"use client";

import { useGame } from "@/lib/context/GameContext";
import { PlayerCard } from "@/components/Card/PlayerCard";
import { CardReveal } from "@/components/CardReveal/CardReveal";
import { Role, ROLE_COLORS } from "@/lib/types";

const ROLES: Role[] = ["Top", "Jungle", "Mid", "ADC", "Support"];

export default function Home() {
  const { roster, revealingCard, drawCard, completeReveal } = useGame();

  return (
    <>
      {/* Full Screen Card Reveal */}
      {revealingCard && (
        <CardReveal card={revealingCard} onComplete={completeReveal} />
      )}

      <div className="space-y-8">
        {/* Title */}
        <div className="text-center py-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Build Your Dream Roster
          </h1>
          <p className="text-gray-400 mt-2">
            Click on each position to draw a random player card
          </p>
        </div>

        {/* Roster Slots */}
        <div className="grid grid-cols-5 gap-4">
          {ROLES.map((role) => {
            const selected = roster[role];
            const roleColor = ROLE_COLORS[role];

            return (
              <div key={role} className="flex flex-col items-center gap-2">
                {/* Role Label */}
                <div
                  className="text-sm font-bold px-3 py-1 rounded-full"
                  style={{ backgroundColor: `${roleColor}33`, color: roleColor }}
                >
                  {role}
                </div>

                {/* Card Slot */}
                {selected ? (
                  <PlayerCard card={selected} />
                ) : (
                  <button
                    onClick={() => drawCard(role)}
                    className="w-48 h-64 rounded-xl border-2 border-dashed border-gray-700
                      hover:border-gray-500 hover:bg-gray-800/50
                      flex items-center justify-center cursor-pointer transition-all"
                  >
                    <span className="text-gray-500">Draw</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
