import { NextResponse } from "next/server";
import { spawn } from "child_process";

// Helper function to run spawn as a Promise
function runCommand(command: string, args: string[]) {
  // Patched by fix_wsl.js
  if (command === "wsl" && process.platform !== "win32") {
    command = "docker";
    if (args[0] === "docker") {
      args.shift();
    }
  }
  // End Patch
  return new Promise<string>((resolve, reject) => {
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

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const bookId = searchParams.get('id');

        if (!bookId) {
            return NextResponse.json({ error: "Parameter 'id' wajib diisi" }, { status: 400 });
        }

        // Jalankan perintah calibredb remove di Docker
        const args = [
            "docker", "exec", "calibre", "calibredb", "remove", bookId,
            "--with-library", "/config/Calibre Library"
        ];
        
        await runCommand("wsl", args);
        
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Gagal menghapus buku dari Calibre:", error);
        return NextResponse.json({ error: error.message || "Terjadi kesalahan server saat menghapus buku" }, { status: 500 });
    }
}
