import { NextResponse } from "next/server";
import { writeFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { existsSync } from "fs";

const execAsync = promisify(exec);

export async function POST(req: Request) {
  let tempFilePath = "";

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file extension
    const allowedExtensions = [".epub", ".pdf", ".mobi", ".azw3", ".txt", ".html", ".docx", ".rtf", ".odt", ".cbz", ".cbr"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json(
        { error: `Unsupported file format: ${ext}` },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 50MB limit" },
        { status: 400 }
      );
    }

    // Save file temporarily on the host
    const tempDir = join(process.cwd(), "tmp-uploads");
    if (!existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true });
    }

    // Sanitize filename: replace spaces and special chars
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    tempFilePath = join(tempDir, `${Date.now()}_${sanitizedName}`);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(tempFilePath, buffer);

    const isWindows = process.platform === "win32";

    // Only convert paths if on Windows
    const hostPathForDocker = isWindows 
      ? tempFilePath
          .replace(/\\/g, "/")
          .replace(/^([A-Za-z]):/, (_, letter) => `/mnt/${letter.toLowerCase()}`)
      : tempFilePath;

    const containerTempPath = `/tmp/${Date.now()}_${sanitizedName}`;

    // Use wsl prefix only on Windows
    const dockerCmdPrefix = isWindows ? "wsl docker" : "docker";

    // 1. Copy file into Docker container
    const cpCmd = `${dockerCmdPrefix} cp "${hostPathForDocker}" calibre:"${containerTempPath}"`;
    console.log(`[Upload] Copying file: ${cpCmd}`);
    
    try {
      await execAsync(cpCmd);
    } catch (cpErr: any) {
      console.error("[Upload] docker cp failed:", cpErr);
      return NextResponse.json(
        { error: "Failed to copy file to Calibre container. Is Docker running?" },
        { status: 500 }
      );
    }

    // 2. Add the book to Calibre library
    const addCmd = `${dockerCmdPrefix} exec calibre calibredb add "${containerTempPath}" --with-library "/config/Calibre Library"`;
    console.log(`[Upload] Adding book: ${addCmd}`);

    let addOutput = "";
    try {
      const { stdout, stderr } = await execAsync(addCmd);
      addOutput = stdout + stderr;
      console.log("[Upload] calibredb add output:", addOutput);
    } catch (addErr: any) {
      console.error("[Upload] calibredb add failed:", addErr);
      // Clean up container temp file
      try { await execAsync(`${dockerCmdPrefix} exec calibre rm "${containerTempPath}"`); } catch {}
      return NextResponse.json(
        { error: "Failed to add book to Calibre library." },
        { status: 500 }
      );
    }

    // 3. Clean up temp file in container
    try {
      await execAsync(`${dockerCmdPrefix} exec calibre rm "${containerTempPath}"`);
    } catch {
      // ignore cleanup errors
    }

    // 4. Clean up temp file on host
    try {
      await unlink(tempFilePath);
      tempFilePath = ""; // Mark as cleaned
    } catch {
      // ignore cleanup errors
    }

    // Try to extract the new book ID from calibredb output
    // Output is usually like: "Added book ids: 42"
    let bookId: string | null = null;
    const idMatch = addOutput.match(/Added book ids?:\s*(\d+)/i);
    if (idMatch) {
      bookId = idMatch[1];
    }

    return NextResponse.json({
      success: true,
      message: "Book added to Calibre library successfully",
      bookId,
      filename: file.name
    });

  } catch (error: any) {
    console.error("[Upload] Unexpected error:", error);
    // Clean up temp file on unexpected error
    if (tempFilePath) {
      try { await unlink(tempFilePath); } catch {}
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
