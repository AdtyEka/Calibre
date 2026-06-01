import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

const execAsync = promisify(exec);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get("bookId");
    const format = searchParams.get("format");

    if (!bookId || !format) {
      return new NextResponse("Missing bookId or format", { status: 400 });
    }

    const targetFormat = format.toLowerCase();

    // 1. Get the path of the file inside docker
    const listCmd = `wsl docker exec calibre calibredb list --search "id:=${bookId}" --fields formats --for-machine --with-library "/config/Calibre Library"`;
    
    let listOutput;
    try {
      const { stdout } = await execAsync(listCmd);
      listOutput = JSON.parse(stdout);
    } catch (err) {
      console.error("Failed to query calibredb:", err);
      return new NextResponse("Database query failed", { status: 500 });
    }

    if (!listOutput || listOutput.length === 0) {
      return new NextResponse("Book not found", { status: 404 });
    }

    const formats: string[] = listOutput[0].formats;
    const sourcePath = formats.find(f => f.toLowerCase().endsWith(`.${targetFormat}`));

    if (!sourcePath) {
      return new NextResponse(`No ${targetFormat} format for book ${bookId}`, { status: 404 });
    }

    // 2. Copy the file from Docker to Next.js temp folder
    const tempFileName = `book_${bookId}_${Date.now()}.${targetFormat}`;
    const localTempDir = path.join(process.cwd(), "public", "downloads");
    const localTempPath = path.join(localTempDir, tempFileName);

    await fs.mkdir(localTempDir, { recursive: true });

    // Important: replace Windows backslashes with forward slashes for WSL if needed, but since it's just docker cp, let's format it properly
    // localTempPath is Windows path like d:\...\public\downloads\...
    // WSL docker cp needs it to be in WSL format or Windows can run docker cp directly if docker is installed on Windows.
    // Wait, the user has docker installed via WSL, so we use `wsl docker cp ...`
    // If we use `wsl docker cp`, the destination path should be a WSL path.
    // E.g., `d:\Study\S1\...` becomes `/mnt/d/Study/S1/...`
    // Instead of doing complicated path translation, let's just do `docker exec calibre cat` and write it locally via node!
    // But stdout maxBuffer is an issue. Let's use maxBuffer: 50 * 1024 * 1024 (50MB) for exec.
    
    try {
      const { stdout } = await execAsync(`wsl docker exec calibre cat "${sourcePath}"`, { 
        maxBuffer: 50 * 1024 * 1024,
        encoding: 'buffer' // Important for binary files!
      });
      
      return new NextResponse(stdout, {
        headers: {
          "Content-Disposition": `attachment; filename="book_${bookId}.${targetFormat}"`,
          "Content-Type": targetFormat === "pdf" ? "application/pdf" : "application/octet-stream",
        }
      });
    } catch (err) {
      console.error("Failed to cat file from docker:", err);
      return new NextResponse("File read failed", { status: 500 });
    }
  } catch (error) {
    console.error("Download API error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
