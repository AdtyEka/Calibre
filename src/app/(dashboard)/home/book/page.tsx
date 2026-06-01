"use client";

import { useState, useEffect, use } from "react";
import { Download, Share, Edit, FileEdit, Repeat, FolderOpen, Trash2, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BookCoverUploader from "./_components/BookCoverUploader";
import BookMetadataForm from "./_components/BookMetadataForm";
import ConnectModal from "@/components/ConnectModal";
import RemoveModal from "./_components/RemoveModal";
import ConvertModal from "./_components/ConvertModal";
import { useBookPreview } from "@/components/providers/book-preview-context";

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default function BookDetail({ searchParams }: PageProps) {
  const router = useRouter();
  // 1. Ambil ID Buku dari URL secara aman menggunakan 'use' bawaan React
  const parsedParams = use(searchParams);
  const idBukuFromUrl = parsedParams.id || "1";

  const { hoveredBook } = useBookPreview();

  // 2. State untuk menampung data dinamis dari Calibre
  const [buku, setBuku] = useState<any>(null);
  const [libraryId, setLibraryId] = useState<string>("Calibre_Library");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [coverUrlOverride, setCoverUrlOverride] = useState<string | null>(null);
  const [pendingMetadataChanges, setPendingMetadataChanges] = useState<any>(null);
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isSavingMetadata, setIsSavingMetadata] = useState(false);

  // States untuk fitur membaca (Resume Reading)
  const [readProgress, setReadProgress] = useState(0);

  // 3. EFFECT: Ambil data aman melalui Jembatan API Lokal
  useEffect(() => {
    async function fetchDetailBuku() {
      try {
        setIsLoading(true);
        setCoverUrlOverride(null); // Reset override cover ketika pindah detail buku
        setPendingMetadataChanges(null); // Reset pending changes ketika pindah detail buku

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
  }, [idBukuFromUrl, refreshTrigger]);

  // 4. Kunci Pengikat ID Asli (Memastikan ID yang dilempar ke URL Cover & Download 100% Valid)
  const idBukuValid = buku?.id ? String(buku.id) : idBukuFromUrl;

  // EFFECT tambahan: Ambil progress baca dari localStorage
  useEffect(() => {
    if (idBukuValid) {
      const savedPct = localStorage.getItem(`calibre-reader-pct-${idBukuValid}`);
      if (savedPct) {
        setReadProgress(parseInt(savedPct, 10));
      }
    }
  }, [idBukuValid]);

  // 5. Ekstraksi Data Berdasarkan State Buku Aktif
  const judulBuku = isLoading ? "Memuat Judul..." : (buku?.title || "Judul Tidak Ditemukan");
  const penulisBuku = isLoading ? "Memuat Penulis..." : (buku?.authors ? buku.authors.join(", ") : "Unknown Author");
  const formatBuku = buku?.formats ? buku.formats[0] : "EPUB";
  const deskripsiBuku = isLoading
    ? "<p className='animate-pulse text-zinc-400'>Sedang memuat sinopsis perpustakaan...</p>"
    : (buku?.comments || "<p className='text-zinc-400 italic'>Tidak ada sinopsis (Data 'comments' kosong dari backend Calibre).</p>");

  // URL Cover dan Download Otomatis yang dikunci menggunakan ID Buku Valid hasil sinkronisasi
  const coverUrl = coverUrlOverride || `/api/cover?id=${idBukuValid}`;
  const downloadUrl = `/api/download?bookId=${idBukuValid}&format=${formatBuku}`;

  const handleSaveMetadataChanges = async () => {
    if (pendingMetadataChanges) {
      setIsSavingMetadata(true);
      try {
        const res = await fetch("/api/metadata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: pendingMetadataChanges.id || idBukuValid,
            title: pendingMetadataChanges.title,
            authors: pendingMetadataChanges.authors,
            tags: pendingMetadataChanges.tags,
            rating: pendingMetadataChanges.rating,
            comments: pendingMetadataChanges.comments
          })
        });

        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || "Gagal menyimpan metadata");
        }

        setBuku(pendingMetadataChanges);
        setIsMetadataModalOpen(false);
        // Catatan: Kita TIDAK memanggil setRefreshTrigger() di sini, karena server Calibre (port 8081) 
        // akan me-return cache data yang lama dan justru me-reset state UI kita ke data lama.
      } catch (error: any) {
        alert(error.message || "Terjadi kesalahan saat menyimpan metadata.");
      } finally {
        setIsSavingMetadata(false);
      }
    } else {
      setIsMetadataModalOpen(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: judulBuku,
      text: `Lihat buku ${judulBuku} oleh ${penulisBuku} di Library saya!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link buku berhasil disalin ke clipboard!");
      }
    } catch (err) {
      console.log("Error sharing:", err);
    }
  };

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
              <a href={downloadUrl} download target="_blank" rel="noopener noreferrer" className="w-full">
                <Button variant="outline" className="h-11 w-full rounded-full border-zinc-200 dark:border-zinc-700 text-[#64748b] dark:text-zinc-300 font-medium shadow-none hover:bg-zinc-50 dark:hover:bg-zinc-900 flex gap-2 items-center justify-center">
                  <Download className="w-4 h-4" /> Download
                </Button>
              </a>
              <Button onClick={handleShare} variant="outline" className="h-11 rounded-full border-zinc-200 dark:border-zinc-700 text-[#64748b] dark:text-zinc-300 font-medium shadow-none hover:bg-zinc-50 dark:hover:bg-zinc-900 flex gap-2">
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
                <button
                  onClick={() => setIsConvertModalOpen(true)}
                  className="flex items-center gap-3 text-[#1e293b] dark:text-zinc-200 hover:opacity-70 transition-opacity text-left font-semibold cursor-pointer"
                >
                  <Repeat className="w-5 h-5" />
                  <span>Convert Format</span>
                </button>
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
                <Link href={`/home/book/read?id=${idBukuValid}`}>
                  <Button className="h-auto w-full bg-[#1e293b] hover:bg-black dark:bg-zinc-100 dark:hover:bg-white dark:text-black text-white text-base font-semibold py-3 rounded-lg transition-colors mb-4 shadow-sm">
                    {readProgress > 0 ? "Resume Reading" : "Start Reading"}
                  </Button>
                </Link>
                <div className="flex justify-between text-sm text-[#64748b] dark:text-zinc-400 font-medium mb-2">
                  <span>{readProgress}% Complete</span>
                  {/* Hiding fixed page numbers since epub uses dynamic locations */}
                </div>
                <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#E5C39C] rounded-full transition-all duration-300" style={{ width: `${readProgress}%` }}></div>
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

        <Link 
          href="/home/convert"
          className={`fixed bottom-20 bg-[#E5C39C] hover:bg-[#D4B28B] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out z-50 p-0 ${
            hoveredBook 
              ? "right-[262px] lg:right-[312px]" 
              : "right-8"
          }`}
        >
          <Plus className="w-6 h-6" />
        </Link>
      </div>

      {/* Edit Metadata Modal */}
      {isMetadataModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm">
          <div className="bg-[#f8fafc] dark:bg-zinc-950 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-10">
              <h2 className="text-3xl font-bold font-serif text-[#1e293b] dark:text-zinc-100">Edit Metadata</h2>
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setIsMetadataModalOpen(false)} 
                  disabled={isSavingMetadata}
                  className="text-[#1e293b] dark:text-zinc-300 font-semibold hover:opacity-70 transition-opacity disabled:opacity-50"
                >
                  Cancel
                </button>
                <Button 
                  onClick={handleSaveMetadataChanges} 
                  disabled={isSavingMetadata}
                  className="bg-[#1e293b] hover:bg-black dark:bg-zinc-100 dark:hover:bg-white dark:text-black text-white px-6 rounded-lg font-medium shadow-none disabled:opacity-70 flex items-center gap-2"
                >
                  {isSavingMetadata ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black animate-spin" />
                      Saving...
                    </>
                  ) : "Save Changes"}
                </Button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 flex flex-col md:flex-row gap-8">
              <BookCoverUploader 
                currentCoverUrl={coverUrl}
                onCoverUpload={(newUrl) => setCoverUrlOverride(newUrl)}
                onCoverRemove={() => setCoverUrlOverride(null)}
              />
              <BookMetadataForm book={buku} onChange={setPendingMetadataChanges} />
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
          setIsRemoveModalOpen(false);
          router.push("/home/library");
        }}
      />

      {/* Conversion Format Modal */}
      <ConvertModal 
        isOpen={isConvertModalOpen} 
        onClose={() => setIsConvertModalOpen(false)} 
        currentBook={buku ? {
          id: idBukuValid,
          title: judulBuku,
          author: penulisBuku,
          formats: buku.formats || ["EPUB"],
          size: buku.size ? `${(buku.size / (1024*1024)).toFixed(2)} MB` : undefined
        } : undefined}
        onConvertSuccess={() => setRefreshTrigger(prev => prev + 1)}
      />
    </>
  );
}
