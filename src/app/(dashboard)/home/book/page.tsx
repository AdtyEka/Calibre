"use client";

import { useState, useEffect, use } from "react";
import { Download, Share, Edit, FileEdit, Repeat, FolderOpen, Trash2, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BookCoverUploader from "./_components/BookCoverUploader";
import BookMetadataForm from "./_components/BookMetadataForm";
import ConnectModal from "@/components/ConnectModal";
import RemoveModal from "./_components/RemoveModal";

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default function BookDetail({ searchParams }: PageProps) {
  // 1. Ambil ID Buku dari URL secara aman menggunakan 'use' bawaan React
  const parsedParams = use(searchParams);
  const idBukuFromUrl = parsedParams.id || "1";

  // 2. State untuk menampung data dinamis dari Calibre
  const [buku, setBuku] = useState<any>(null);
  const [libraryId, setLibraryId] = useState<string>("Calibre_Library");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  // 3. EFFECT: Ambil data aman melalui Jembatan API Lokal
  useEffect(() => {
    async function fetchDetailBuku() {
      try {
        setIsLoading(true);

        // MENEMBAK API INTERNAL NEXT.JS (100% Bebas dari blokir CORS)
        const res = await fetch("/api/calibre");
        if (!res.ok) throw new Error("Gagal mengambil data dari API internal");

        const dataJson = await res.json();
        const objekMetadata = dataJson.metadata;

        if (objekMetadata) {
          // Ambil data buku berdasarkan ID dari URL
          const dataBukuMata = objekMetadata[idBukuFromUrl];

          if (dataBukuMata) {
            setBuku({
              ...dataBukuMata,
              id: idBukuFromUrl
            });
          } else {
            // Antisipasi jika key di objek ternyata tipe data Number
            const dataBukuNumber = objekMetadata[Number(idBukuFromUrl)];
            if (dataBukuNumber) {
              setBuku({ ...dataBukuNumber, id: idBukuFromUrl });
            }
          }

          setLibraryId(dataJson.library_id);
        }
      } catch (error) {
        console.error("Gagal memuat detail buku:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDetailBuku();
  }, [idBukuFromUrl]);

  // 4. Kunci Pengikat ID Asli (Memastikan ID yang dilempar ke URL Cover & Download 100% Valid)
  const idBukuValid = buku?.id ? String(buku.id) : idBukuFromUrl;

  // 5. Ekstraksi Data Berdasarkan State Buku Aktif
  const judulBuku = isLoading ? "Memuat Judul..." : (buku?.title || "Judul Tidak Ditemukan");
  const penulisBuku = isLoading ? "Memuat Penulis..." : (buku?.authors ? buku.authors.join(", ") : "Unknown Author");
  const formatBuku = buku?.formats ? buku.formats[0] : "EPUB";
  const deskripsiBuku = isLoading
    ? "<p className='animate-pulse text-zinc-400'>Sedang memuat sinopsis perpustakaan...</p>"
    : (buku?.comments || "<p className='text-zinc-400 italic'>Tidak ada sinopsis resmi untuk buku ini.</p>");

  // URL Cover dan Download Otomatis yang dikunci menggunakan ID Buku Valid hasil sinkronisasi
  const coverUrl = `http://127.0.0.1:8081/get/cover/${idBukuValid}/${libraryId}`;
  const downloadUrl = `http://127.0.0.1:8081/get/fmt/${idBukuValid}/${formatBuku}/${libraryId}`;

  return (
    <>
      <div className="flex-1 p-8 flex flex-col relative max-w-7xl w-full">

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-[#64748b] dark:text-zinc-400 font-medium mb-8">
          <Link href="/home/library" className="hover:text-[#1e293b] dark:hover:text-zinc-200 transition-colors">Library</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#94a3b8] dark:text-zinc-500 line-clamp-1 max-w-[200px]">{judulBuku}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Left Column */}
          <div className="w-full md:w-[280px] flex-shrink-0 flex flex-col gap-6">
            {/* Book Cover Container Dinamis */}
            <div className="w-full aspect-[3/4] bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner border border-zinc-100 dark:border-zinc-800">
              {isLoading ? (
                <div className="animate-pulse text-zinc-400 text-sm">Loading Cover...</div>
              ) : (
                <img src={coverUrl} alt={judulBuku} className="w-full h-full object-cover" />
              )}
            </div>

            {/* Actions (Mengaktifkan Tombol Download Fisik Berkas) */}
            <div className="grid grid-cols-2 gap-3">
              <a href={downloadUrl} download className="w-full">
                <Button variant="outline" className="h-11 w-full rounded-full border-zinc-200 dark:border-zinc-700 text-[#64748b] dark:text-zinc-300 font-medium shadow-none hover:bg-zinc-50 dark:hover:bg-zinc-900 flex gap-2 items-center justify-center">
                  <Download className="w-4 h-4" /> Download
                </Button>
              </a>
              <Button variant="outline" className="h-11 rounded-full border-zinc-200 dark:border-zinc-700 text-[#64748b] dark:text-zinc-300 font-medium shadow-none hover:bg-zinc-50 dark:hover:bg-zinc-900 flex gap-2">
                <Share className="w-4 h-4" /> Share
              </Button>
            </div>

            {/* Management Card */}
            <div className="bg-[#e2e8f0]/60 dark:bg-zinc-900/60 rounded-2xl p-6 border border-zinc-200/40 dark:border-zinc-800/40">
              <h3 className="text-[#64748b] dark:text-zinc-400 font-bold mb-5">Management</h3>
              <div className="flex flex-col gap-4">
                <button onClick={() => setIsMetadataModalOpen(true)} className="flex items-center gap-3 text-[#1e293b] dark:text-zinc-200 hover:opacity-70 transition-opacity text-left font-semibold cursor-pointer">
                  <Edit className="w-5 h-5" />
                  <span>Edit Metadata</span>
                </button>
                <Link href="/home/book/edit" className="flex items-center gap-3 text-[#1e293b] dark:text-zinc-200 hover:opacity-70 transition-opacity text-left font-semibold">
                  <FileEdit className="w-5 h-5" />
                  <span>Edit Book Contents</span>
                </Link>
                <Link href="/home/convert" className="flex items-center gap-3 text-[#1e293b] dark:text-zinc-200 hover:opacity-70 transition-opacity text-left font-semibold">
                  <Repeat className="w-5 h-5" />
                  <span>Convert Format</span>
                </Link>
                <button
                  onClick={() => setIsFolderModalOpen(true)}
                  className="flex items-center gap-3 text-[#1e293b] dark:text-zinc-200 hover:opacity-70 transition-opacity text-left font-semibold cursor-pointer"
                >
                  <FolderOpen className="w-5 h-5" />
                  <span>Show in Folder</span>
                </button>
                <button
                  onClick={() => setIsRemoveModalOpen(true)}
                  className="flex items-center gap-3 text-[#1e293b] dark:text-zinc-200 hover:opacity-70 transition-opacity text-left font-semibold cursor-pointer"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Remove from Library</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1 flex flex-col">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold font-serif text-[#1e293b] dark:text-zinc-100 mb-3 leading-tight">
                  {judulBuku}
                </h1>
                <div className="flex items-center text-[#64748b] dark:text-zinc-400 font-medium">
                  <span>{penulisBuku}</span>
                  <div className="w-[1px] h-4 bg-zinc-300 dark:bg-zinc-700 mx-3" />
                  <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded text-xs font-bold uppercase">{formatBuku}</span>
                </div>
              </div>

              <div className="w-full sm:w-[260px] flex-shrink-0 flex flex-col">
                <Button className="h-auto w-full bg-[#1e293b] hover:bg-black dark:bg-zinc-100 dark:hover:bg-white dark:text-black text-white text-base font-semibold py-3 rounded-lg transition-colors mb-4 shadow-sm">
                  Resume Reading
                </Button>
                <div className="flex justify-between text-sm text-[#64748b] dark:text-zinc-400 font-medium mb-2">
                  <span>12% Complete</span>
                  <span>Page 59 of 496</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#E5C39C] rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>

            {/* Synopsis Dinamis */}
            <div>
              <h3 className="text-[#1e293b] dark:text-zinc-200 font-bold mb-4 text-lg font-serif">Synopsis</h3>
              <div
                className="text-[#64748b] dark:text-zinc-400 leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: deskripsiBuku }}
              />
            </div>
          </div>
        </div>

        <Button className="fixed bottom-20 right-8 bg-[#E5C39C] hover:bg-[#D4B28B] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors z-50 p-0">
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      {/* Edit Metadata Modal */}
      {isMetadataModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm">
          <div className="bg-[#f8fafc] dark:bg-zinc-950 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-10">
              <h2 className="text-3xl font-bold font-serif text-[#1e293b] dark:text-zinc-100">Edit Metadata</h2>
              <div className="flex items-center gap-6">
                <button onClick={() => setIsMetadataModalOpen(false)} className="text-[#1e293b] dark:text-zinc-300 font-semibold hover:opacity-70 transition-opacity">Cancel</button>
                <Button onClick={() => setIsMetadataModalOpen(false)} className="bg-[#1e293b] hover:bg-black dark:bg-zinc-100 dark:hover:bg-white dark:text-black text-white px-6 rounded-lg font-medium shadow-none">Save Changes</Button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 flex flex-col md:flex-row gap-8">
              <BookCoverUploader />
              <BookMetadataForm />
            </div>
          </div>
        </div>
      )}

      {/* Connect to Folder Modal */}
      <ConnectModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
      />

      {/* Remove Confirmation Modal */}
      <RemoveModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        onConfirm={() => {
          alert("Book removed successfully from calibre library!");
          setIsRemoveModalOpen(false);
        }}
      />
    </>
  );
}