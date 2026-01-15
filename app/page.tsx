"use client";

import { useEffect } from "react";
import { useGame } from "@/lib/context/GameContext";
import { PlayerCard } from "@/components/Card/PlayerCard";
import { CardReveal } from "@/components/CardReveal/CardReveal";
import { Role, ROLE_COLORS } from "@/lib/types";

const ROLES: Role[] = ["Top", "Jungle", "Mid", "ADC", "Support"];

const KEY_TO_ROLE: Record<string, Role> = {
  a: "Top",
  s: "Jungle",
  d: "Mid",
  f: "ADC",
  g: "Support",
};

const ROLE_TO_KEY: Record<Role, string> = {
  Top: "A",
  Jungle: "S",
  Mid: "D",
  ADC: "F",
  Support: "G",
};

export default function Home() {
  const { roster, revealingCard, drawCard, completeReveal, resetGame } = useGame();

  // Keyboard shortcuts (only when not revealing)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if reveal animation is running
      if (revealingCard) return;

      const key = e.key.toLowerCase();

      // Reset with 'r'
      if (key === "r") {
        e.preventDefault();
        resetGame();
        return;
      }

      // Draw card with a/s/d/f/g
      const role = KEY_TO_ROLE[key];
      if (role && !roster[role]) {
        e.preventDefault();
        drawCard(role);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [revealingCard, roster, drawCard, resetGame]);

  return (
    <>
      {/* Full Screen Card Reveal */}
      {revealingCard && (
        <CardReveal card={revealingCard} onComplete={completeReveal} />
      )}

      <div className="space-y-8 px-4 md:px-0"> {/* 좌우 여백 추가 */}
        {/* Title */}
        <div className="text-center py-4">
          <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            [Fan Game] Build Your Dream Roster
          </h1>
          <p className="text-sm md:text-base text-gray-400 mt-2">
            Click on each position to draw a random player card
          </p>
        </div>

        {/* Roster Slots */}
        {/* 변경점 1: 모바일 2열(grid-cols-2) -> 태블릿 3열 -> PC 5열 */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 justify-items-center">
          {ROLES.map((role) => {
            const selected = roster[role];
            const roleColor = ROLE_COLORS[role];

            return (
              <div key={role} className="flex flex-col items-center gap-2 w-full max-w-12rem">
                {/* Role Label with key hint */}
                <div
                  className="text-xs md:text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1.5"
                  style={{ backgroundColor: `${roleColor}33`, color: roleColor }}
                >
                  <span>{role}</span>
                  <kbd className="hidden md:inline-block text-[10px] px-1.5 py-0.5 rounded bg-black/30 font-mono">
                    {ROLE_TO_KEY[role]}
                  </kbd>
                </div>

                {/* Card Slot */}
                {/* 변경점 2: w-48 고정 제거 -> w-full 및 aspect-[3/4]로 비율 유지 */}
                <div className="w-full aspect-3/4">
                  {selected ? (
                    // PlayerCard 내부에서도 w-full h-full을 쓰거나 크기를 상속받도록 확인 필요
                    <div className="w-full h-full">
                        <PlayerCard card={selected} />
                    </div>
                  ) : (
                    <button
                      onClick={() => drawCard(role)}
                      disabled={!!revealingCard}
                      className="w-full h-full rounded-xl border-2 border-dashed border-gray-700
                        hover:border-gray-500 hover:bg-gray-800/50
                        flex items-center justify-center cursor-pointer transition-all p-4
                        disabled:pointer-events-none"
                    >
                      <span className="text-gray-500 text-sm md:text-base">Draw</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className="hidden md:flex justify-center gap-6 text-xs text-gray-500 pt-4">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 rounded bg-gray-800 text-gray-400 font-mono">A S D F G</kbd>
            <span>Draw positions</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 rounded bg-gray-800 text-gray-400 font-mono">Space</kbd>
            <span>Skip reveal</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 rounded bg-gray-800 text-gray-400 font-mono">R</kbd>
            <span>Reset</span>
          </div>
        </div>
      </div>
    </>
  );
}