"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { PlayerCard as PlayerCardType, ROLE_COLORS, REGION_NAMES } from "@/lib/types";
import { TEAM_COLORS } from "@/data/teamColors";
import { PlayerCard } from "@/components/Card/PlayerCard";

interface CardRevealProps {
  card: PlayerCardType;
  onComplete: () => void;
}

type RevealStage = "league" | "position" | "team" | "card" | "done";

export function CardReveal({ card, onComplete }: CardRevealProps) {
  const [stage, setStage] = useState<RevealStage>("league");

  const teamColor = TEAM_COLORS[card.team] || "#666666";
  const roleColor = ROLE_COLORS[card.role];

  const leagueLogo: Record<string, string> = {
    LCK: "/lck.svg",
    LPL: "/lpl.png",
    LEC: "/lec.png",
    LCS: "/lcs.svg",
  };

  const skipReveal = useCallback(() => {
    setStage("done");
  }, []);

  // Handle spacebar to skip reveal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        skipReveal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [skipReveal]);

  useEffect(() => {
    const timings: Record<RevealStage, number> = {
      league: 1200,
      position: 1200,
      team: 1200,
      card: 2500,
      done: 0,
    };

    if (stage === "done") {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      const stages: RevealStage[] = ["league", "position", "team", "card", "done"];
      const currentIndex = stages.indexOf(stage);
      setStage(stages[currentIndex + 1]);
    }, timings[stage]);

    return () => clearTimeout(timer);
  }, [stage, onComplete]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      onClick={() => setStage("done")}
    >
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* League Logo Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <Image
            src={leagueLogo[card.region]}
            alt={card.region}
            width={500}
            height={500}
            className={`object-contain ${card.region === "LCK" || card.region === "LCS" ? "invert" : ""}`}
          />
        </div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at center, ${teamColor} 0%, transparent 70%)`,
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,black_100%)]" />
      </div>

      {/* League Reveal */}
      {stage === "league" && (
        <div className="reveal-stage">
          <div className="text-6xl font-black tracking-wider animate-reveal-text">
            {card.region}
          </div>
          <div className="text-xl text-gray-400 mt-2 animate-reveal-text-delay">
            {REGION_NAMES[card.region]}
          </div>
        </div>
      )}

      {/* Position Reveal */}
      {stage === "position" && (
        <div className="reveal-stage">
          <div
            className="text-6xl font-black tracking-wider animate-reveal-text"
            style={{ color: roleColor }}
          >
            {card.role.toUpperCase()}
          </div>
        </div>
      )}

      {/* Team Reveal */}
      {stage === "team" && (
        <div className="reveal-stage">
          <div
            className="text-7xl font-black tracking-wider animate-reveal-text"
            style={{ color: teamColor }}
          >
            {card.team}
          </div>
          <div className="text-2xl text-gray-400 mt-2 animate-reveal-text-delay">
            {card.year}
          </div>
        </div>
      )}

      {/* Card Reveal */}
      {stage === "card" && (
        <div className="reveal-stage">
          <div className="card-final-reveal">
            <PlayerCard card={card} size="lg" />
          </div>
          <div className="mt-6 text-2xl font-bold animate-reveal-text-delay">
            {card.name}
          </div>
          <div className="text-sm text-gray-500 mt-4 animate-fade-in-delay">
            Click anywhere to continue
          </div>
        </div>
      )}
    </div>
  );
}
