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

function writeToDocker(container: string, path: string, content: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Kita gunakan sh -c "cat > path" untuk menulis file langsung ke dalam Docker
    const child = spawn(process.platform === "win32" ? "wsl" : "docker", process.platform === "win32" ? ["docker" : [, "exec", "-i", container, "sh", "-c", `cat > "${path}"`]);
    
    let stderr = "";
    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(stderr || `Gagal menulis file (code ${code})`));
      }
    });
    
    child.on("error", (error) => {
      reject(error);
    });

    child.stdin.write(content);
    child.stdin.end();
  });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { bookId, filePath, newContent } = body;

        if (!bookId || !filePath || newContent === undefined) {
            return NextResponse.json({ error: "Missing bookId, filePath, atau newContent" }, { status: 400 });
        }

        const fullPath = `/tmp/calibre_edit_${bookId}/${filePath}`;

        // 1. Baca file HTML asli dari Docker
        const originalHtml = await runCommandString("wsl", ["docker", "exec", "calibre", "cat", fullPath]);

        // 2. Ganti konten di dalam tag <body> dengan newContent
        // Regex ini menangkap (<body...>) (isi lama) (</body>)
        const bodyRegex = /(<body[^>]*>)([\s\S]*?)(<\/body>)/i;
        
        let updatedHtml = originalHtml;
        if (bodyRegex.test(originalHtml)) {
            updatedHtml = originalHtml.replace(bodyRegex, `$1\n${newContent}\n$3`);
        } else {
            // Jika tidak ada tag body (aneh tapi mungkin untuk xhtml parsial), kembalikan langsung
            updatedHtml = newContent;
        }

        // 3. Tulis ulang file tersebut ke Docker
        await writeToDocker("calibre", fullPath, updatedHtml);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Gagal save EPUB file:", error);
        return NextResponse.json({ error: error.message || "Terjadi kesalahan saat menyimpan file" }, { status: 500 });
    }
}
