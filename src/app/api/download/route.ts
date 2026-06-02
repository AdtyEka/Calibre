import { NextResponse } from "next/server";
import { spawn } from "child_process";

function runCommandBinary(command: string, args: string[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args);
    const chunks: Buffer[] = [];
    let stderr = "";

    child.stdout.on("data", (data: Buffer) => {
      chunks.push(data);
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve(Buffer.concat(chunks));
      } else {
        reject(new Error(stderr || `Process exited with code ${code}`));
      }
    });

    child.on("error", (error) => {
      reject(error);
    });
  });
}

function runCommandString(command: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args);
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(stderr || `Process exited with code ${code}`));
      }
    });

    child.on("error", (error) => {
      reject(error);
    });
  });
}

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
    const listArgs = [
      "docker", "exec", "calibre", "calibredb", "list",
      "--search", `id:=${bookId}`,
      "--fields", "formats",
      "--for-machine",
      "--with-library", "/config/Calibre Library"
    ];

    let listOutput;
    try {
      const stdout = await runCommandString("wsl", listArgs);
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

    // 2. Read the file as binary from Docker using spawn (not exec) to preserve binary integrity
    try {
      const fileBuffer = await runCommandBinary("wsl", [
        "docker", "exec", "calibre", "cat", sourcePath
      ]);

      const contentType = targetFormat === "pdf"
        ? "application/pdf"
        : targetFormat === "epub"
          ? "application/epub+zip"
          : "application/octet-stream";

      return new NextResponse(new Uint8Array(fileBuffer), {
        headers: {
          "Content-Disposition": `attachment; filename="book_${bookId}.${targetFormat}"`,
          "Content-Type": contentType,
          // Prevent caching so edits are always reflected
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          "Pragma": "no-cache",
          "Expires": "0",
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
