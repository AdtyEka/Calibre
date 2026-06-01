import { NextResponse } from "next/server";
import { spawn } from "child_process";

// Helper function to run spawn as a Promise and return raw buffer
function runCommandBuffer(command: string, args: string[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args);
    const chunks: Buffer[] = [];
    let stderr = "";

    child.stdout.on("data", (data) => {
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
    return runCommandBuffer(command, args).then(buf => buf.toString());
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const bookId = searchParams.get('id');

        if (!bookId) {
            return NextResponse.json({ error: "Parameter 'id' wajib diisi" }, { status: 400 });
        }

        // Dapatkan path cover dari database
        const argsList = [
            "docker", "exec", "calibre", "calibredb", "list", 
            "--search", `id:=${bookId}`,
            "--fields", "cover", 
            "--for-machine", 
            "--with-library", "/config/Calibre Library"
        ];
        
        const rawJson = await runCommandString("wsl", argsList);
        const booksArray = JSON.parse(rawJson);
        
        if (booksArray.length === 0 || !booksArray[0].cover) {
            return NextResponse.json({ error: "Buku atau cover tidak ditemukan" }, { status: 404 });
        }

        const coverPath = booksArray[0].cover;

        // Baca file cover secara biner via docker exec cat
        const catArgs = [
            "docker", "exec", "calibre", "cat", coverPath
        ];
        
        const imageBuffer = await runCommandBuffer("wsl", catArgs);

        // Buat response dengan buffer gambar (cast as any untuk memuaskan TypeScript BodyInit)
        const response = new NextResponse(imageBuffer as any);
        response.headers.set("Content-Type", "image/jpeg");
        response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
        return response;

    } catch (error: any) {
        console.error("Gagal mengambil cover dari Docker:", error);
        return NextResponse.json({ error: "Terjadi kesalahan server saat mengambil cover" }, { status: 500 });
    }
}
