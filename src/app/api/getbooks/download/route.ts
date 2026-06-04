import { NextResponse } from "next/server";
import { writeFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { existsSync } from "fs";

const execAsync = promisify(exec);

export async function POST(req: Request) {
  let tempFilePath = "";
  let containerTempPath = "";

  try {
    const { downloadUrl, title } = await req.json();

    if (!downloadUrl) {
      return NextResponse.json(
        { error: "Download URL is required" },
        { status: 400 }
      );
    }

    // 1. Fetch the book file from Gutendex URL
    const bookRes = await fetch(downloadUrl);
    if (!bookRes.ok) {
      throw new Error(`Failed to download book from source: ${bookRes.statusText}`);
    }

    const buffer = await bookRes.arrayBuffer();

    // 2. Save file temporarily on the host
    const tempDir = join(process.cwd(), "tmp-uploads");
    if (!existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true });
    }

    // Sanitize filename
    const safeTitle = (title || "book").replace(/[^a-zA-Z0-9_-]/g, "_");
    const filename = `${safeTitle}.epub`;
    
    tempFilePath = join(tempDir, `${Date.now()}_${filename}`);
    await writeFile(tempFilePath, Buffer.from(buffer));

    // Convert Windows path to WSL path for docker cp
    const wslTempPath = tempFilePath
      .replace(/\\/g, "/")
      .replace(/^([A-Za-z]):/, (_, letter) => `/mnt/${letter.toLowerCase()}`);

    containerTempPath = `/tmp/${Date.now()}_${filename}`;

    // 3. Copy file into Docker container
    const cpCmd = `wsl docker cp "${wslTempPath}" calibre:"${containerTempPath}"`;
    try {
      await execAsync(cpCmd);
    } catch (cpErr: any) {
      console.error("[GetBooks Download] docker cp failed:", cpErr);
      throw new Error("Failed to copy file to Calibre container.");
    }

    // 4. Add the book to Calibre library
    const addCmd = `wsl docker exec calibre calibredb add "${containerTempPath}" --with-library "/config/Calibre Library"`;
    let addOutput = "";
    try {
      const { stdout, stderr } = await execAsync(addCmd);
      addOutput = stdout + stderr;
    } catch (addErr: any) {
      console.error("[GetBooks Download] calibredb add failed:", addErr);
      throw new Error("Failed to add book to Calibre library.");
    }

    // Extract book ID
    let bookId: string | null = null;
    const idMatch = addOutput.match(/Added book ids?:\s*(\d+)/i);
    if (idMatch) {
      bookId = idMatch[1];
    }

    // Cleanups
    try { await execAsync(`wsl docker exec calibre rm "${containerTempPath}"`); } catch {}
    try { await unlink(tempFilePath); } catch {}

    return NextResponse.json({
      success: true,
      message: "Book successfully downloaded and added to Calibre",
      bookId,
      title
    });

  } catch (error: any) {
    console.error("[GetBooks Download] Error:", error);
    
    // Attempt cleanups on error
    if (containerTempPath) {
      try { await execAsync(`wsl docker exec calibre rm "${containerTempPath}"`); } catch {}
    }
    if (tempFilePath) {
      try { await unlink(tempFilePath); } catch {}
    }

    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
