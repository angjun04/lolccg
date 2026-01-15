"use client";

import Link from "next/link";
import Image from "next/image";
import { useGame } from "@/lib/context/GameContext";

export function Header() {
  const { resetGame } = useGame();

  return (
    <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/worldslogo.svg"
            alt="Worlds"
            width={32}
            height={32}
            className="invert"
          />
          <span className="font-bold text-white">Esports Roster</span>
        </Link>

        {/* Reset Button */}
        <button
          onClick={resetGame}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-gray-800 hover:bg-gray-700 text-gray-300"
        >
          Reset
        </button>
      </div>
    </header>
  );
}
