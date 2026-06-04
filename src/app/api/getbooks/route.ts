import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, author, keyword, stores } = body;

    // Hit Gutendex API
    const searchQuery = title || keyword || author || "";
    if (!searchQuery) {
      return NextResponse.json(
        { error: "Mohon masukkan minimal salah satu kata kunci (Judul, Penulis, atau Keyword)" },
        { status: 400 }
      );
    }

    const apiUrl = `https://gutendex.com/books?search=${encodeURIComponent(searchQuery)}`;
    const res = await fetch(apiUrl);
    
    if (!res.ok) {
      throw new Error(`Gutendex API returned ${res.status}`);
    }

    const data = await res.json();

    const mappedResults = (data.results || []).map((item: any) => {
      return {
        id: item.id,
        title: item.title,
        author: item.authors?.[0]?.name || "Unknown Author",
        price: "Free",
        drm: "unlocked",
        store: "Project Gutenberg",
        cover: item.formats["image/jpeg"] || null,
        downloadUrl: item.formats["application/epub+zip"] || null
      };
    });

    return NextResponse.json({
      success: true,
      message: `Pencarian untuk '${searchQuery}' berhasil`,
      data: mappedResults
    });

  } catch (error) {
    console.error("Error in getbooks API:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server saat mencari buku" },
      { status: 500 }
    );
  }
}
