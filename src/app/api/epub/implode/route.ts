import { NextResponse } from "next/server";
import { spawn } from "child_process";

function runCommandString(command: string, args: string[]) {
  // Patched by fix_wsl.js
  if (command === "wsl" && process.platform !== "win32") {
    command = "docker";
    if (args[0] === "docker") {
      args.shift();
    }
  }
  // End Patch: Promise<string> {
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

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { bookId } = body;

        if (!bookId) {
            return NextResponse.json({ error: "Missing bookId" }, { status: 400 });
        }

        const tempDir = `/tmp/calibre_edit_${bookId}`;
        const outputEpub = `/tmp/rebuilt_${bookId}.epub`;

        // 1. Implode folder menjadi file EPUB
        const implodeArgs = [
            "docker", "exec", "calibre", "calibre-debug", "-i", tempDir, outputEpub
        ];
        await runCommandString("wsl", implodeArgs);

        // 2. Gantikan format EPUB lama dengan EPUB yang baru dirakit di Calibre
        const addFormatArgs = [
            "docker", "exec", "calibre", "calibredb", "add_format", bookId, outputEpub,
            "--with-library", "/config/Calibre Library"
        ];
        await runCommandString("wsl", addFormatArgs);

        // 3. (Opsional) Bersihkan file sementara
        await runCommandString("wsl", ["docker", "exec", "calibre", "sh", "-c", `rm -rf "${tempDir}" "${outputEpub}"`]);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Gagal implode EPUB:", error);
        return NextResponse.json({ error: error.message || "Terjadi kesalahan saat membangun ulang buku" }, { status: 500 });
    }
}
