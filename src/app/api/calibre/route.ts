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

export async function GET() {
    try {
        // Alih-alih menembak port 8081 (yang me-nge-cache data lama),
        // kita langsung membaca database SQLite calibre secara realtime via Docker CLI
        const args = [
            "docker", "exec", "calibre", "calibredb", "list", 
            "--fields", "id,title,authors,tags,rating,formats,size,comments,cover,timestamp,last_modified", 
            "--for-machine", 
            "--with-library", "/config/Calibre Library"
        ];
        
        const rawJson = await runCommand("wsl", args);
        const booksArray = JSON.parse(rawJson);
        
        // Format ulang data agar sesuai dengan struktur yang diharapkan oleh UI (seperti books-init)
        const metadataMap: Record<string, any> = {};
        
        for (const book of booksArray) {
            // Ekstrak format dari path
            const extractedFormats = (book.formats || []).map((path: string) => {
                const parts = path.split('.');
                return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "UNKNOWN";
            });
            
            // Konversi nama penulis dari string (dipisah '&') menjadi array
            let authorsArray = [];
            if (book.authors) {
                authorsArray = book.authors.split('&').map((a: string) => a.trim());
            }

            metadataMap[String(book.id)] = {
                id: book.id,
                title: book.title,
                authors: authorsArray,
                tags: book.tags || [],
                rating: book.rating || 0,
                formats: extractedFormats,
                size: book.size || 0,
                comments: book.comments || "",
                timestamp: book.timestamp,
                last_modified: book.last_modified
            };
        }

        return NextResponse.json({ metadata: metadataMap });
    } catch (error: any) {
        console.error("Gagal membaca database Calibre:", error);
        // Fallback jika WSL gagal: coba fetch dari API lama
        try {
            const res = await fetch("http://127.0.0.1:8081/interface-data/books-init?library_id=Calibre_Library", {
                cache: "no-store"
            });
            const data = await res.json();
            return NextResponse.json(data);
        } catch (e) {
            return NextResponse.json({ error: "Gagal mengambil data dari Docker" }, { status: 500 });
        }
    }
}