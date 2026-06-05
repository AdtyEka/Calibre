import { NextResponse } from "next/server";
import { spawn } from "child_process";

export async function GET() {
  try {
    // We use tar to compress the Calibre Library directory and output it to stdout.
    const child = spawn(process.platform === "win32" ? "wsl" : "docker", process.platform === "win32" ? ["docker" : [, "exec", "calibre", "tar", "-czf", "-", "-C", "/config", "Calibre Library"]);

    const stream = new ReadableStream({
      start(controller) {
        child.stdout.on("data", (chunk) => {
          controller.enqueue(chunk);
        });

        child.stdout.on("end", () => {
          controller.close();
        });

        child.stderr.on("data", (chunk) => {
          console.error(`tar stderr: ${chunk.toString()}`);
        });

        child.on("error", (error) => {
          console.error("tar process error", error);
          controller.error(error);
        });
      },
      cancel() {
        child.kill();
      }
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "application/gzip",
        "Content-Disposition": 'attachment; filename="calibre-library-export.tar.gz"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to export library" }, { status: 500 });
  }
}
