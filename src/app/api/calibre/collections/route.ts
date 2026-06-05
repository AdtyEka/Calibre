import { NextResponse } from "next/server";
import { spawn } from "child_process";

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

// GET /api/calibre/collections — returns all tags as collections, with their books
export async function GET() {
  try {
    // Fetch all books with tags from Calibre
    const args = [
      "docker", "exec", "calibre", "calibredb", "list",
      "--fields", "id,title,authors,tags,rating,formats,size,timestamp,last_modified",
      "--for-machine",
      "--with-library", "/config/Calibre Library"
    ];

    const rawJson = await runCommand("wsl", args);
    const booksArray = JSON.parse(rawJson);

    // Build a map: tag -> list of books
    const tagMap: Record<string, any[]> = {};
    // Also track "untagged" books
    const untaggedBooks: any[] = [];

    for (const book of booksArray) {
      const extractedFormats = (book.formats || []).map((p: string) => {
        const parts = p.split(".");
        return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "UNKNOWN";
      });

      let authorsArray: string[] = [];
      if (book.authors) {
        authorsArray = book.authors.split("&").map((a: string) => a.trim());
      }

      const bookData = {
        id: String(book.id),
        title: book.title || "Unknown Title",
        authors: authorsArray,
        author: authorsArray.join(", ") || "Unknown Author",
        rating: book.rating || 0,
        formats: extractedFormats,
        format: extractedFormats[0] || "UNKNOWN",
        size: book.size || 0,
        timestamp: book.timestamp,
        last_modified: book.last_modified,
      };

      const tags: string[] = book.tags || [];
      if (tags.length === 0) {
        untaggedBooks.push(bookData);
      } else {
        for (const tag of tags) {
          const trimmedTag = tag.trim();
          if (!tagMap[trimmedTag]) {
            tagMap[trimmedTag] = [];
          }
          tagMap[trimmedTag].push(bookData);
        }
      }
    }

    // Build collections array
    const collections = Object.entries(tagMap)
      .map(([tag, books]) => ({
        id: tag.toLowerCase().replace(/\s+/g, "-"),
        name: tag,
        bookCount: books.length,
        books,
      }))
      .sort((a, b) => b.bookCount - a.bookCount);

    // Add untagged collection if there are untagged books
    if (untaggedBooks.length > 0) {
      collections.push({
        id: "__untagged__",
        name: "Untagged",
        bookCount: untaggedBooks.length,
        books: untaggedBooks,
      });
    }

    return NextResponse.json({
      collections,
      totalBooks: booksArray.length,
      totalCollections: collections.length,
    });
  } catch (error: any) {
    console.error("Failed to fetch collections:", error);
    return NextResponse.json(
      { error: "Failed to fetch collections from Calibre" },
      { status: 500 }
    );
  }
}
