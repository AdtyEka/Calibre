import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: Request) {
  try {
    const { bookId, fromFormat, toFormat } = await req.json();

    if (!bookId || !toFormat) {
      return NextResponse.json(
        { error: "bookId and toFormat are required" },
        { status: 400 }
      );
    }

    const targetFormat = toFormat.toLowerCase();
    const sourceFormat = fromFormat ? fromFormat.toLowerCase() : null;

    // 1. Get the book's formats and file paths
    const listCmd = `${process.platform === "win32" ? "wsl docker" : "docker"} exec calibre calibredb list --search "id:=${bookId}" --fields formats --for-machine --with-library "/config/Calibre Library"`;
    
    let listOutput;
    try {
      const { stdout } = await execAsync(listCmd);
      listOutput = JSON.parse(stdout);
    } catch (err: any) {
      console.error("Failed to list book formats:", err);
      return NextResponse.json(
        { error: "Failed to locate book in Calibre database." },
        { status: 500 }
      );
    }

    if (!listOutput || listOutput.length === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const formats: string[] = listOutput[0].formats;
    if (!formats || formats.length === 0) {
      return NextResponse.json(
        { error: "No formats available for this book to convert from." },
        { status: 400 }
      );
    }

    // Determine the source file. If fromFormat is specified, try to find it.
    let sourcePath = "";
    if (sourceFormat) {
      sourcePath = formats.find(f => f.toLowerCase().endsWith(`.${sourceFormat}`)) || formats[0];
    } else {
      sourcePath = formats[0];
    }

    if (!sourcePath) {
      return NextResponse.json(
        { error: "Source file format not found." },
        { status: 400 }
      );
    }

    // Already has target format?
    if (formats.some(f => f.toLowerCase().endsWith(`.${targetFormat}`))) {
      return NextResponse.json({
        success: true,
        message: "Book already has this format.",
        newFormat: targetFormat.toUpperCase()
      });
    }

    const tempFileName = `/tmp/convert_${bookId}_${Date.now()}.${targetFormat}`;

    // 2. Convert the book
    const convertCmd = `${process.platform === "win32" ? "wsl docker" : "docker"} exec calibre ebook-convert "${sourcePath}" "${tempFileName}"`;
    try {
      console.log(`Starting conversion: ${convertCmd}`);
      await execAsync(convertCmd);
    } catch (err: any) {
      console.error("Conversion failed:", err);
      return NextResponse.json(
        { error: "ebook-convert failed. The file might be corrupt or unsupported." },
        { status: 500 }
      );
    }

    // 3. Add the new format back to the database
    const addCmd = `${process.platform === "win32" ? "wsl docker" : "docker"} exec calibre calibredb add_format ${bookId} "${tempFileName}" --with-library "/config/Calibre Library"`;
    try {
      console.log(`Adding format: ${addCmd}`);
      await execAsync(addCmd);
    } catch (err: any) {
      console.error("Failed to add format:", err);
      return NextResponse.json(
        { error: "Failed to save the converted format to the database." },
        { status: 500 }
      );
    }

    // 4. Cleanup temp file
    const rmCmd = `${process.platform === "win32" ? "wsl docker" : "docker"} exec calibre rm "${tempFileName}"`;
    try {
      await execAsync(rmCmd);
    } catch (err: any) {
      console.warn("Failed to delete temp file (ignoring):", err);
    }

    return NextResponse.json({
      success: true,
      message: "Conversion successful",
      newFormat: targetFormat.toUpperCase()
    });

  } catch (error: any) {
    console.error("Conversion API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
