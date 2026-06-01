import { NextResponse } from "next/server";
import { spawn } from "child_process";

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

function extractBodyInnerHTML(html: string): string {
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    return bodyMatch ? bodyMatch[1].trim() : html;
}

// Natural sort algorithm for strings (e.g. file9.html comes before file10.html)
function naturalSort(a: string, b: string) {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const bookId = searchParams.get('id');

        if (!bookId) {
            return NextResponse.json({ error: "Parameter 'id' wajib diisi" }, { status: 400 });
        }

        // 1. Dapatkan path EPUB
        const listArgs = [
            "docker", "exec", "calibre", "calibredb", "list", 
            "--search", `id:=${bookId}`,
            "--fields", "formats", 
            "--for-machine", 
            "--with-library", "/config/Calibre Library"
        ];
        
        const listJson = await runCommandString("wsl", listArgs);
        const booksArray = JSON.parse(listJson);
        
        if (booksArray.length === 0 || !booksArray[0].formats) {
            return NextResponse.json({ error: "Buku tidak ditemukan" }, { status: 404 });
        }

        const epubPath = booksArray[0].formats.find((f: string) => f.toLowerCase().endsWith('.epub'));
        if (!epubPath) {
            return NextResponse.json({ error: "Buku ini tidak memiliki format EPUB" }, { status: 400 });
        }

        const tempDir = `/tmp/calibre_edit_${bookId}`;

        // 2. Bersihkan direktori sementara jika ada, lalu explode EPUB
        await runCommandString("wsl", ["docker", "exec", "calibre", "sh", "-c", `rm -rf "${tempDir}"`]);
        await runCommandString("wsl", ["docker", "exec", "calibre", "calibre-debug", "-x", epubPath, tempDir]);

        // 3. Temukan semua file HTML/XHTML (gunakan sh -c agar glob dieksekusi dengan benar)
        const findArgs = [
            "docker", "exec", "calibre", "sh", "-c",
            `find "${tempDir}" -type f \\( -name "*.html" -o -name "*.xhtml" \\)`
        ];
        const findOutput = await runCommandString("wsl", findArgs);
        const files = findOutput.split('\n').map(f => f.trim()).filter(f => f);

        // Urutkan file secara natural
        files.sort(naturalSort);

        // 4. Baca isi setiap file
        const tabs = [];
        let index = 1;

        for (const file of files) {
            try {
                const catArgs = ["docker", "exec", "calibre", "cat", file];
                const fileContent = await runCommandString("wsl", catArgs);
                
                // Ambil path relatif dari tempDir untuk memudahkan penyimpanan kembali nanti
                const relativePath = file.replace(tempDir + '/', '');
                
                // Ambil judul sederhana dari nama file
                const fileName = relativePath.split('/').pop() || `Chapter ${index}`;
                
                // Ekstrak innerHTML dari <body>
                const bodyContent = extractBodyInnerHTML(fileContent);

                tabs.push({
                    id: relativePath,
                    title: fileName,
                    content: bodyContent,
                    level: 1,
                    pages: 1, // field tiruan untuk UI
                    startPage: index
                });
                index++;
            } catch (e) {
                console.error(`Gagal membaca file ${file}:`, e);
            }
        }

        return NextResponse.json({ tabs });
    } catch (error: any) {
        console.error("Gagal explode EPUB:", error);
        return NextResponse.json({ error: error.message || "Terjadi kesalahan saat membuka buku" }, { status: 500 });
    }
}
