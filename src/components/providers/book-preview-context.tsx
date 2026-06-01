"use client";

import React, { createContext, useContext, useState } from "react";

export interface Book {
  title: string;
  author: string;
  format: string;
  rating?: number;
  progress?: number;
  currentPage?: number;
  totalPages?: number;
  description?: string;
  coverUrl?: string;
  genre?: string;
}

export const BOOK_METADATA_DATABASE: Record<string, Partial<Book>> = {
  "a dance with dragons": {
    rating: 4,
    progress: 78,
    currentPage: 823,
    totalPages: 1056,
    genre: "Fiction",
    coverUrl: "/assets/images/a_dance_with_dragons_cover.png",
    description: "A Dance with Dragons picks up where A Storm of Swords leaves off and runs simultaneously with events in A Feast for Crows. The War of the Five Kings seems to be winding down. In the north, King Stannis Baratheon has installed himself at the Wall and vowed to win the support of the northmen to continue his struggle—even if it means cooperating with the night's watch."
  },
  "hail mary": {
    rating: 4,
    progress: 12,
    currentPage: 59,
    totalPages: 496,
    genre: "Sci-Fi",
    coverUrl: "/assets/images/hail_mary_cover.png",
    description: "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish. Except that right now, he doesn't know that. He can't even remember his own name, let alone the nature of his assignment or how to complete it."
  },
  "project hail mary": {
    rating: 4,
    progress: 12,
    currentPage: 59,
    totalPages: 496,
    genre: "Sci-Fi",
    coverUrl: "/assets/images/hail_mary_cover.png",
    description: "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish. Except that right now, he doesn't know that. He can't even remember his own name, let alone the nature of his assignment or how to complete it."
  },
  "the hunger games": {
    rating: 4,
    progress: 45,
    currentPage: 168,
    totalPages: 374,
    genre: "Fiction",
    description: "In the ruins of a place once known as North America lies the nation of Panem, a shining Capitol surrounded by twelve outlying districts. The Capitol is harsh and cruel and keeps the districts in line by forcing them all to send one boy and one girl between the ages of twelve and eighteen to participate in the annual Hunger Games, a fight to the death on live TV."
  },
  "the brothers karamazov": {
    rating: 3,
    progress: 90,
    currentPage: 741,
    totalPages: 824,
    genre: "Fiction",
    description: "The Brothers Karamazov is a passionate philosophical novel set in 19th-century Russia, that enters deeply into the ethical debates of God, free will, and morality. It is a spiritual drama of moral struggles concerning faith, doubt, judgment, and reason, set against a modernizing Russia."
  },
  "the metamorphosis": {
    rating: 4,
    progress: 100,
    currentPage: 82,
    totalPages: 82,
    genre: "Fiction",
    description: "The Metamorphosis is a novella written by Franz Kafka which was first published in 1915. One of Kafka's best-known works, The Metamorphosis tells the story of salesman Gregor Samsa, who wakes one morning to find himself inexplicably transformed into a huge insect and subsequently struggles to adjust to this new condition."
  },
  "laut bercerita": {
    rating: 4,
    progress: 60,
    currentPage: 228,
    totalPages: 380,
    genre: "Fiction",
    description: "Laut Bercerita adalah novel fiksi sejarah karya penulis asal Indonesia, Leila S. Chudori, yang diterbitkan pada tahun 2017. Novel ini menceritakan tentang hilangnya para aktivis di masa orde baru dan perjuangan keluarga yang ditinggalkan dalam mencari kebenaran."
  },
  "dune": {
    rating: 3,
    progress: 30,
    currentPage: 183,
    totalPages: 612,
    genre: "Sci-Fi",
    description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the 'spice' melange, a drug capable of extending life and enhancing consciousness."
  }
};

interface BookPreviewContextType {
  hoveredBook: Book | null;
  setHoveredBook: (book: Book | null) => void;
}

const BookPreviewContext = createContext<BookPreviewContextType | undefined>(undefined);

export function BookPreviewProvider({ children }: { children: React.ReactNode }) {
  const [hoveredBook, setHoveredBook] = useState<Book | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const setHoveredBookWithMetadata = (book: Book | null) => {
    // Clear any active closing timeout immediately
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }

    if (!book) {
      // Delay closing by 1000ms (1 second) to prevent flickering between cards
      const id = setTimeout(() => {
        setHoveredBook(null);
      }, 1000);
      setTimeoutId(id);
      return;
    }

    const lowerTitle = book.title.toLowerCase();
    const metadata = BOOK_METADATA_DATABASE[lowerTitle] || {};
    
    setHoveredBook({
      ...book,
      ...metadata,
    });
  };

  return (
    <BookPreviewContext.Provider value={{ hoveredBook, setHoveredBook: setHoveredBookWithMetadata }}>
      {children}
    </BookPreviewContext.Provider>
  );
}

export function useBookPreview() {
  const context = useContext(BookPreviewContext);
  if (context === undefined) {
    throw new Error("useBookPreview must be used within a BookPreviewProvider");
  }
  return context;
}
