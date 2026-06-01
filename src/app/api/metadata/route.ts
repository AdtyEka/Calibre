import { NextResponse } from "next/server";
import { spawn } from "child_process";

// Helper function to run spawn as a Promise
function runCommand(command: string, args: string[]): Promise<string> {
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

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { id, title, authors, tags, rating, comments } = data;

    if (!id) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 }
      );
    }

    // Build calibredb set_metadata arguments
    const args = [
      "docker", "exec", "calibre", "calibredb", "set_metadata", String(id),
      "--with-library", "/config/Calibre Library"
    ];

    if (title) {
      args.push("--field", `title:${title}`);
    }
    if (authors && Array.isArray(authors)) {
      // calibredb uses '&' to separate authors
      args.push("--field", `authors:${authors.join(' & ')}`);
    }
    if (tags && Array.isArray(tags)) {
      args.push("--field", `tags:${tags.join(',')}`);
    }
    if (rating !== undefined) {
      // Rating is generally 1-5, sometimes 2-10 in calibre DB depending on format. Standard is 1-5 or 2-10.
      // Usually, calibre CLI accepts integers 1 to 5.
      args.push("--field", `rating:${rating}`);
    }
    if (comments !== undefined) {
      args.push("--field", `comments:${comments}`);
    }

    try {
      console.log("Setting metadata:", args);
      await runCommand("wsl", args);
    } catch (err: any) {
      console.error("Failed to set metadata:", err);
      return NextResponse.json(
        { error: "calibredb set_metadata failed. " + err.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Metadata updated successfully"
    });

  } catch (error: any) {
    console.error("Metadata API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
