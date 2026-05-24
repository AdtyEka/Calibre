// src/app/api/calibre/route.ts
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Server Next.js menembak ke server Calibre (Aman dari CORS karena sesama server)
        const res = await fetch("http://127.0.0.1:8081/interface-data/books-init?library_id=Calibre_Library", {
            cache: "no-store"
        });

        if (!res.ok) throw new Error("Calibre Docker tidak merespon");

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Gagal mengambil data dari Docker" }, { status: 500 });
    }
}