"use client";

import { useState } from "react";
import Image from "next/image";
import { PlayerCard as PlayerCardType, ROLE_COLORS } from "@/lib/types";
import { TEAM_COLORS } from "@/data/teamColors";

const LEAGUE_LOGOS: Record<string, string> = {
  LCK: "/lck.svg",
  LPL: "/lpl.png",
  LEC: "/lec.png",
  LCS: "/lcs.svg",
};

function isBrightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.7;
}

type TeamLogoState = "png" | "svg" | "fallback";

const TEAM_LOGO_EXTENSIONS: TeamLogoState[] = ["png", "svg"];

interface PlayerCardProps {
  card: PlayerCardType;
  size?: "sm" | "md" | "lg";
  isNew?: boolean;
  isUpgraded?: boolean;
  onClick?: () => void;
}

export function PlayerCard({
  card,
  size = "md",
  isNew = false,
  isUpgraded = false,
  onClick,
}: PlayerCardProps) {
  const [teamLogoState, setTeamLogoState] = useState<TeamLogoState>("png");

  const roleColor = ROLE_COLORS[card.role];
  const teamColor = TEAM_COLORS[card.team] || "#666666";
  const teamNameLower = card.team.toLowerCase();

  const getTeamLogoSrc = () => {
    if (teamLogoState === "fallback") return null;
    return `/teams/${teamNameLower}.${teamLogoState}`;
  };

  const handleTeamLogoError = () => {
    const currentIndex = TEAM_LOGO_EXTENSIONS.indexOf(teamLogoState as typeof TEAM_LOGO_EXTENSIONS[number]);
    if (currentIndex < TEAM_LOGO_EXTENSIONS.length - 1) {
      setTeamLogoState(TEAM_LOGO_EXTENSIONS[currentIndex + 1]);
    } else {
      setTeamLogoState("fallback");
    }
  };

  const teamLogoSrc = getTeamLogoSrc();

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

  const cardElement = (
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
      style={{ borderColor: isUpgraded ? "transparent" : teamColor }}
    >
      {/* Player image - fills the card */}
      {card.imageUrl ? (
        <Image
          src={card.imageUrl}
          alt={card.name}
          fill
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-6xl font-bold opacity-30"
            style={{ color: teamColor }}
          >
            {card.name.charAt(0)}
          </span>
        </div>
      )}

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* Team color indicator bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 z-10"
        style={{ backgroundColor: teamColor }}
      />

      {/* Year badge */}
      <div
        className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-bold z-10"
        style={{ backgroundColor: teamColor, color: isBrightColor(teamColor) ? "#000" : "#fff" }}
      >
        {card.year.slice(-2)}&apos;
      </div>

      {/* Region logo */}
      <div className="absolute top-2 right-2 z-10">
        <Image
          src={LEAGUE_LOGOS[card.region]}
          alt={card.region}
          width={24}
          height={24}
          className={`object-contain ${card.region === "LCK" || card.region === "LCS" ? "invert" : ""}`}
        />
      </div>

      {/* Player info - positioned at bottom */}
      <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 text-center z-10">
        <h3 className={`${textSizes[size].name} font-bold text-white truncate drop-shadow-lg`}>
          {card.name}
        </h3>
        <div className="flex items-center justify-center gap-1 mt-0.5">
          {teamLogoSrc ? (
            <Image
              src={teamLogoSrc}
              alt={card.team}
              width={20}
              height={20}
              className="object-contain"
              onError={handleTeamLogoError}
            />
          ) : (
            <span
              className={`${textSizes[size].team} truncate font-medium drop-shadow-lg`}
              style={{ color: teamColor }}
            >
              {card.team}
            </span>
          )}
        </div>
        <div
          className={`text-xs mt-1 inline-block px-3 py-1 rounded-full`}
          style={{ backgroundColor: `${roleColor}cc`, color: "white" }}
        >
          {card.role}
        </div>
      </div>

      {/* Holographic shimmer overlay for upgraded cards */}
      {isUpgraded && (
        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-20">
          <div className="absolute inset-0 animate-holographic-shimmer opacity-40" />
        </div>
      )}
    </div>
  );

  if (isUpgraded) {
    return (
      <div className="relative">
        {/* Holographic glow shadow */}
        <div
          className="absolute -inset-4 rounded-xl opacity-70 blur-xl animate-pulse-slow"
          style={{ background: "linear-gradient(45deg, #02FEFF, #FF88FE, #0777FD)" }}
        />

        {/* Holographic border */}
        <div className="absolute -inset-[3px] rounded-xl animate-holographic-border" />

        {/* Card */}
        <div className="relative">
          {cardElement}
        </div>
      </div>
    );
  }

  return cardElement;
}
