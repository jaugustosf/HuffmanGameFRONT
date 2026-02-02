"use client";

import React from "react";
import HuffmanBoard from "../components/HuffmanBoard";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center pt-4 px-4 bg-neutral-50 dark:bg-[#1B1B1B] transition-colors duration-300">
      {/* text-slate-... -> text-neutral-... */}
      <h1 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
        Jogo de Huffman
      </h1>

      <div className="w-full h-full">
        <HuffmanBoard />
      </div>
    </main>
  );
}
