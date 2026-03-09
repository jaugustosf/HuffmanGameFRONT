"use client";

import React from "react";
import HuffmanBoard from "../components/HuffmanBoard";

export default function Home() {
  return (
    // Removi o px-4 (margem lateral) e deixei o container livre
    <main className="flex min-h-screen flex-col items-center pt-4 bg-neutral-50 dark:bg-[#1B1B1B] transition-colors duration-300">
      {/* Removi o max-w-[1600px] para ele poder esticar infinitamente */}
      <div className="w-full h-full flex-grow px-4 ">
        <HuffmanBoard />
      </div>
    </main>
  );
}
