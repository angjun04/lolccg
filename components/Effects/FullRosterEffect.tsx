"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { PlayerCard as PlayerCardType } from "@/lib/types";
import { PlayerCard } from "@/components/Card/PlayerCard";
import { TEAM_COLORS } from "@/data/teamColors";

interface FullRosterEffectProps {
  cards: PlayerCardType[];
  onComplete: () => void;
}

export function FullRosterEffect({ cards, onComplete }: FullRosterEffectProps) {
  const [stage, setStage] = useState<
    "initial" | "merging" | "flash" | "champion" | "splitting" | "upgraded" | "done"
  >("initial");
  const [isMobile, setIsMobile] = useState(false);

  const team = cards[0]?.team || "T1";
  const year = cards[0]?.year || "2024";
  const teamColor = TEAM_COLORS[team] || "#E2012D";

  // Detect mobile
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Stage progression
  useEffect(() => {
    const timings: Record<typeof stage, number> = {
      initial: 500,
      merging: 1200,
      flash: 400,
      champion: 3000,
      splitting: 1000,
      upgraded: 2500,
      done: 0,
    };

    if (stage === "done") {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      const stages = ["initial", "merging", "flash", "champion", "splitting", "upgraded", "done"] as const;
      const currentIndex = stages.indexOf(stage);
      if (currentIndex < stages.length - 1) {
        setStage(stages[currentIndex + 1]);
      }
    }, timings[stage]);

    return () => clearTimeout(timer);
  }, [stage, onComplete]);

  // Skip on click
  const handleClick = () => setStage("done");

  // Role order for card positions
  const roleOrder = ["Top", "Jungle", "Mid", "ADC", "Support"];
  const sortedCards = [...cards].sort(
    (a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role)
  );

  // Card positions for merge animation (relative to center)
  const getCardStyle = (index: number) => {
    const baseOffset = isMobile ? 80 : 140;
    const positions = [
      { x: -baseOffset * 2, y: 0 },
      { x: -baseOffset, y: 0 },
      { x: 0, y: 0 },
      { x: baseOffset, y: 0 },
      { x: baseOffset * 2, y: 0 },
    ];

    if (stage === "initial") {
      return {
        transform: `translateX(${positions[index].x}px) translateY(${positions[index].y}px) scale(1)`,
        opacity: 1,
      };
    }

    if (stage === "merging") {
      return {
        transform: `translateX(0) translateY(0) scale(0.3)`,
        opacity: 0,
        transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
      };
    }

    if (stage === "flash" || stage === "champion") {
      return {
        transform: `translateX(0) translateY(0) scale(0)`,
        opacity: 0,
      };
    }

    if (stage === "splitting") {
      return {
        transform: `translateX(${positions[index].x}px) translateY(${positions[index].y}px) scale(1)`,
        opacity: 1,
        transition: "all 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
      };
    }

    // upgraded stage
    return {
      transform: `translateX(${positions[index].x}px) translateY(${positions[index].y}px) scale(1)`,
      opacity: 1,
    };
  };

  const showChampionFrame = stage === "champion";
  const showFlash = stage === "flash";
  const isUpgraded = stage === "splitting" || stage === "upgraded";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black"
      onClick={handleClick}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(ellipse at center, ${teamColor}30 0%, transparent 60%)`,
          opacity: stage !== "initial" ? 1 : 0,
        }}
      />

      {/* Platinum flash */}
      {showFlash && (
        <div className="absolute inset-0 animate-platinum-flash bg-gradient-to-b from-white via-gray-200 to-gray-400" />
      )}

      {/* Cards container */}
      <div className={`relative flex items-center justify-center ${isMobile ? "scale-50" : "scale-75"}`}>
        {sortedCards.map((card, index) => (
          <div
            key={card.id}
            className="absolute"
            style={getCardStyle(index)}
          >
            {isUpgraded ? (
              <div className="relative">
                {/* Holographic glow shadow */}
                <div className="absolute -inset-4 rounded-xl opacity-70 blur-xl animate-pulse-slow"
                  style={{ background: "linear-gradient(45deg, #02FEFF, #FF88FE, #0777FD)" }} />

                {/* Holographic border */}
                <div className="absolute -inset-[3px] rounded-xl animate-holographic-border" />

                {/* Card with overlay */}
                <div className="relative">
                  <PlayerCard card={card} size="md" />

                  {/* Holographic shimmer overlay */}
                  <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 animate-holographic-shimmer opacity-30" />
                  </div>
                </div>
              </div>
            ) : (
              <PlayerCard card={card} size="md" />
            )}
          </div>
        ))}
      </div>

      {/* Champion Frame */}
      {showChampionFrame && (
        <div className="absolute inset-0 flex items-center justify-center z-30 animate-champion-frame-in">
          {/* Frame container */}
          <div className="relative">
            {/* Platinum holographic border */}
            <div className="absolute -inset-5 rounded-2xl animate-holographic-border-large" />

            {/* Inner glow */}
            <div className="absolute -inset-2 rounded-xl blur-sm"
              style={{ background: "linear-gradient(135deg, rgba(2,254,255,0.3), rgba(255,255,255,0.2), rgba(255,136,254,0.3))" }} />

            {/* Main frame */}
            <div
              className="relative w-80 md:w-96 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-xl overflow-hidden border-2"
              style={{ borderColor: `${teamColor}88` }}
            >
              {/* Team logo background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div className="relative w-64 h-64">
                  <Image
                    src={`/teams/${team.toLowerCase()}.png`}
                    alt={team}
                    fill
                    className="object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `/teams/${team.toLowerCase()}.svg`;
                    }}
                  />
                </div>
              </div>

              {/* Championship photo */}
              <div className="relative aspect-video">
                <Image
                  src={`/championships/${team.toLowerCase()}${year.slice(-2)}.png`}
                  alt={`${team} ${year} Champions`}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Fallback to team logo if no championship photo
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                {/* Fallback: Team logo centered */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-32 h-32 md:w-40 md:h-40">
                    <Image
                      src={`/teams/${team.toLowerCase()}.png`}
                      alt={team}
                      fill
                      className="object-contain drop-shadow-2xl"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `/teams/${team.toLowerCase()}.svg`;
                      }}
                    />
                  </div>
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
              </div>

              {/* Text content */}
              <div className="relative px-6 py-6 text-center">
                <div
                  className="text-4xl md:text-5xl font-black tracking-wider mb-2"
                  style={{
                    color: teamColor,
                    textShadow: `0 0 30px ${teamColor}, 0 0 60px ${teamColor}50`
                  }}
                >
                  {team}
                </div>
                <div className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-white to-gray-300">
                  {year} WORLD CHAMPIONS
                </div>

                {/* Decorative line */}
                <div className="flex items-center justify-center gap-3 mt-4">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-500" />
                  <div className="w-2 h-2 rotate-45 bg-gray-500" />
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-500" />
                </div>
              </div>

              {/* Holographic shimmer overlay */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                <div className="absolute inset-0 animate-holographic-shimmer opacity-20" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skip hint */}
      <div className="absolute bottom-4 text-gray-600 text-sm">
        Tap to skip
      </div>
    </div>
  );
}
