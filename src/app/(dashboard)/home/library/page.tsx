import { LayoutGrid, List, Plus, Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

async function getCalibreData() {
  const url = "http://127.0.0.1:8081/interface-data/books-init?library_id=Calibre_Library&sort=timestamp.desc";

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;

    const dataJson = await res.json();

    // Trik Cerdas: Kita ambil pasangannya (ID dan Datanya)
    const objekMetadata = dataJson.metadata;

    // Kita looping setiap kunci ("1", "2") dan masukkan ke dalam data bukunya sebagai properti 'id'
    const arrayBukuDenganId = Object.keys(objekMetadata).map((idAsli) => {
      return {
        ...objekMetadata[idAsli],
        id: idAsli // Sekarang setiap buku DIJAMIN punya properti .id yang berisi angka asli ("1" atau "2")
      };
    });

    return {
      books: arrayBukuDenganId,
      libraryId: dataJson.library_id,
      totalBooks: dataJson.search_result.total_num
    };
  } catch (error) {
    console.error("Gagal terhubung ke server Calibre:", error);
    return null;
  }
}

// 2. KOMPONEN UTAMA (Server Component)
export default async function Home() {
  const calibreData = await getCalibreData();

  // Data fallback cadangan jika fetch gagal
  const books = calibreData?.books || [
    { id: 1, title: "The Hunger Games", authors: ["Suzanne Collins"], formats: ["EPUB"] },
    { id: 2, title: "The Brothers Karamazov", authors: ["Fyodor Dostoevsky"], formats: ["PDF"] },
  ];

  const libraryId = calibreData?.libraryId || "Calibre_Library";
  const totalBooksArchive = calibreData?.totalBooks || books.length;

  return (
    <>
      <div className="flex-1 p-8 flex flex-col gap-8 relative">
        {/* Continue Reading Section */}
        <div>
          <h2 className="text-3xl font-bold mb-6 font-serif">Continue Reading</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card 1 */}
            <Link href="/home/book" className="block transition-transform hover:-translate-y-1">
              <Card className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 flex gap-6 bg-white dark:bg-zinc-950 shadow-none h-full">
                <div className="w-32 h-44 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center relative flex-shrink-0">
                  <span className="absolute top-2 right-2 bg-zinc-800/20 dark:bg-zinc-100/20 text-xs font-bold px-1.5 py-0.5 rounded">PDF</span>
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-xs font-bold uppercase text-zinc-500 mb-1">Fiction</span>
                  <h3 className="text-xl font-bold font-serif mb-1">A Dance with Dragons</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">George R. R. Martin</p>
                  <div className="flex justify-start gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < 4 ? "text-amber-500 fill-amber-500" : "text-zinc-300"}`} />
                    ))}
                  </div>
                  <div className="mt-auto">
                    <div className="flex justify-between text-xs text-zinc-500 mb-1">
                      <span>78% Complete</span>
                      <span>Page 823 of 1,056</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-4">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <Button className="h-auto w-full bg-[#243342] hover:bg-[#1B2631] text-white text-sm font-medium py-2 rounded-lg transition-colors pointer-events-none">
                      Resume Reading
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Card 2 */}
            <Link href="/home/book" className="block transition-transform hover:-translate-y-1">
              <Card className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 flex gap-6 bg-white dark:bg-zinc-950 shadow-none h-full">
                <div className="w-32 h-44 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center relative flex-shrink-0">
                  <span className="absolute top-2 right-2 bg-zinc-800/20 dark:bg-zinc-100/20 text-xs font-bold px-1.5 py-0.5 rounded">EPUB</span>
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-xs font-bold uppercase text-zinc-500 mb-1">Sci-Fi</span>
                  <h3 className="text-xl font-bold font-serif mb-1">Hail Mary</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Andy Weir</p>
                  <div className="flex justify-start gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < 4 ? "text-amber-500 fill-amber-500" : "text-zinc-300"}`} />
                    ))}
                  </div>
                  <div className="mt-auto">
                    <div className="flex justify-between text-xs text-zinc-500 mb-1">
                      <span>12% Complete</span>
                      <span>Page 59 of 496</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-4">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '12%' }}></div>
                    </div>
                    <Button className="h-auto w-full bg-[#243342] hover:bg-[#1B2631] text-white text-sm font-medium py-2 rounded-lg transition-colors pointer-events-none">
                      Resume Reading
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* Your Virtual Library Section */}
        <div className="mt-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h2 className="text-3xl font-bold font-serif">Your Virtual Library</h2>
              <p className="text-sm text-zinc-500 mt-1">{totalBooksArchive} Books in Archive</p>
            </div>

            <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg text-sm">
              <div className="flex items-center gap-1 px-3 py-1.5">
                <span className="text-zinc-500">Sort by:</span>
                <Button className="h-auto p-0 bg-transparent font-medium flex items-center gap-1 text-zinc-900 dark:text-zinc-100">
                  Date Added <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
              <div className="w-[1px] bg-zinc-200 dark:bg-zinc-800 h-6" />
              <Button className="h-auto p-1.5 bg-[#2C3E50] dark:bg-zinc-800 rounded-md shadow-xs">
                <LayoutGrid className="w-4 h-4 text-white" />
              </Button>
              <Button className="h-auto p-1.5 bg-transparent text-zinc-500">
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Book Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {books.map((book: any, index: number) => {

              // KUNCI UTAMA: Calibre menyimpan ID unik buku pada properti bernama 'id'
              // Kita pastikan mengambil properti tersebut secara akurat
              const idBukuAsli = book.id;

              const coverUrl = calibreData
                ? `http://127.0.0.1:8081/get/cover/${idBukuAsli}/${libraryId}`
                : "";

              return (
                <Link key={idBukuAsli || index} href={`/home/book?id=${idBukuAsli}`} className="flex flex-col group cursor-pointer">
                  <div className="aspect-[3/4] bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-3 relative flex items-center justify-center transition-transform group-hover:-translate-y-1 overflow-hidden">
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-serif p-4 text-center">{book.title}</span>
                    )}
                    <span className="absolute top-2 right-2 bg-zinc-900/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                      {book.formats ? book.formats[0] : "EPUB"}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm mb-0.5 font-serif group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-1">
                    {book.authors ? book.authors.join(", ") : "Unknown Author"}
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="flex justify-center mt-8">
            <Button className="h-auto bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium px-6 py-2.5 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
              Load More Titles
            </Button>
          </div>
        </div>

        <Button className="fixed bottom-20 right-8 bg-[#E5C39C] hover:bg-[#D4B28B] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors z-50 p-0">
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </>
  );
}