"use client";

import Image from "next/image";
import { PlayerCard as PlayerCardType, ROLE_COLORS } from "@/lib/types";
import { TEAM_COLORS } from "@/data/teamColors";

const LEAGUE_LOGOS: Record<string, string> = {
  LCK: "/lck.svg",
  LPL: "/lpl.png",
  LEC: "/lec.png",
  LCS: "/lcs.svg",
};

interface PlayerCardProps {
  card: PlayerCardType;
  size?: "sm" | "md" | "lg";
  isNew?: boolean;
  onClick?: () => void;
}

export function PlayerCard({
  card,
  size = "md",
  isNew = false,
  onClick,
}: PlayerCardProps) {
  const roleColor = ROLE_COLORS[card.role];
  const teamColor = TEAM_COLORS[card.team] || "#666666";

  const sizeClasses = {
    sm: "w-32 h-44",
    md: "w-48 h-64",
    lg: "w-64 h-80",
  };

  const textSizes = {
    sm: { name: "text-sm", team: "text-xs" },
    md: { name: "text-lg", team: "text-sm" },
    lg: { name: "text-xl", team: "text-base" },
  };

  return (
    <div
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        relative rounded-xl overflow-hidden
        bg-gradient-to-b from-gray-900 to-gray-800
        border-2 shadow-lg
        transition-all duration-300 ease-out
        ${onClick ? "cursor-pointer hover:scale-105 hover:shadow-xl" : ""}
        ${isNew ? "ring-2 ring-yellow-400 ring-offset-2 ring-offset-gray-900" : ""}
      `}
      style={{ borderColor: teamColor }}
    >
      {/* Team color indicator bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: teamColor }}
      />

      {/* Year badge */}
      <div
        className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-bold text-white"
        style={{ backgroundColor: teamColor }}
      >
        {card.year.slice(-2)}&apos;
      </div>

      {/* Region logo */}
      <div className="absolute top-2 right-2">
        <Image
          src={LEAGUE_LOGOS[card.region]}
          alt={card.region}
          width={24}
          height={24}
          className={`object-contain ${card.region === "LCK" || card.region === "LCS" ? "invert" : ""}`}
        />
      </div>

      {/* Player image placeholder */}
      <div className="mt-10 mx-auto w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
        <span
          className="text-3xl font-bold"
          style={{ color: teamColor }}
        >
          {card.name.charAt(0)}
        </span>
      </div>

      {/* Player info */}
      <div className="px-3 mt-4 text-center">
        <h3 className={`${textSizes[size].name} font-bold text-white truncate`}>
          {card.name}
        </h3>
        <p
          className={`${textSizes[size].team} truncate font-medium`}
          style={{ color: teamColor }}
        >
          {card.team}
        </p>
        <div
          className={`text-xs mt-2 inline-block px-3 py-1 rounded-full`}
          style={{ backgroundColor: `${roleColor}33`, color: roleColor }}
        >
          {card.role}
        </div>
      </div>
    </div>
  );
}
