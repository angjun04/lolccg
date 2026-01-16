"use client";

import { useState } from "react";
import { FullRosterEffect } from "@/components/Effects/FullRosterEffect";
import { PlayerCard as PlayerCardType, Region, Role } from "@/lib/types";
import { PlayerCard } from "@/components/Card/PlayerCard";
import { TEAM_COLORS } from "@/data/teamColors";

// Sample rosters for testing
const SAMPLE_ROSTERS: Record<string, PlayerCardType[]> = {
  "T1 2024": [
    { id: "zeus-t1-2024", name: "Zeus", team: "T1", region: "LCK", role: "Top", year: "2024", imageUrl: "/players/zeus24.png" },
    { id: "oner-t1-2024", name: "Oner", team: "T1", region: "LCK", role: "Jungle", year: "2024", imageUrl: "/players/oner24.png" },
    { id: "faker-t1-2024", name: "Faker", team: "T1", region: "LCK", role: "Mid", year: "2024", imageUrl: "/players/faker24.png" },
    { id: "gumayusi-t1-2024", name: "Gumayusi", team: "T1", region: "LCK", role: "ADC", year: "2024", imageUrl: "/players/gumayusi24.png" },
    { id: "keria-t1-2024", name: "Keria", team: "T1", region: "LCK", role: "Support", year: "2024", imageUrl: "/players/keria24.png" },
  ],
  "DWG 2020": [
    { id: "nuguri-dwg-2020", name: "Nuguri", team: "DWG", region: "LCK", role: "Top", year: "2020", imageUrl: "/players/nuguri20.png" },
    { id: "canyon-dwg-2020", name: "Canyon", team: "DWG", region: "LCK", role: "Jungle", year: "2020", imageUrl: "/players/canyon20.png" },
    { id: "showmaker-dwg-2020", name: "ShowMaker", team: "DWG", region: "LCK", role: "Mid", year: "2020", imageUrl: "/players/showmaker20.png" },
    { id: "ghost-dwg-2020", name: "Ghost", team: "DWG", region: "LCK", role: "ADC", year: "2020", imageUrl: "/players/ghost20.png" },
    { id: "beryl-dwg-2020", name: "BeryL", team: "DWG", region: "LCK", role: "Support", year: "2020", imageUrl: "/players/beryl20.png" },
  ],
  "SSW 2014": [
    { id: "looper-ssw-2014", name: "Looper", team: "SSW", region: "LCK", role: "Top", year: "2014" },
    { id: "dandy-ssw-2014", name: "DanDy", team: "SSW", region: "LCK", role: "Jungle", year: "2014" },
    { id: "pawn-ssw-2014", name: "PawN", team: "SSW", region: "LCK", role: "Mid", year: "2014", imageUrl: "/players/pawn.png" },
    { id: "imp-ssw-2014", name: "imp", team: "SSW", region: "LCK", role: "ADC", year: "2014", imageUrl: "/players/imp14.png" },
    { id: "mata-ssw-2014", name: "Mata", team: "SSW", region: "LCK", role: "Support", year: "2014", imageUrl: "/players/mata14.png" },
  ],
  "G2 2019": [
    { id: "wunder-g2-2019", name: "Wunder", team: "G2", region: "LEC", role: "Top", year: "2019", imageUrl: "/players/wunder.png" },
    { id: "jankos-g2-2019", name: "Jankos", team: "G2", region: "LEC", role: "Jungle", year: "2019", imageUrl: "/players/jankos.png" },
    { id: "caps-g2-2019", name: "Caps", team: "G2", region: "LEC", role: "Mid", year: "2019", imageUrl: "/players/caps.png" },
    { id: "perkz-g2-2019", name: "Perkz", team: "G2", region: "LEC", role: "ADC", year: "2019", imageUrl: "/players/perkz.png" },
    { id: "mikyx-g2-2019", name: "Mikyx", team: "G2", region: "LEC", role: "Support", year: "2019", imageUrl: "/players/mikyx.png" },
  ],
  "FPX 2019": [
    { id: "gimgoon-fpx-2019", name: "GimGoon", team: "FPX", region: "LPL", role: "Top", year: "2019", imageUrl: "/players/gimgoon.png" },
    { id: "tian-fpx-2019", name: "Tian", team: "FPX", region: "LPL", role: "Jungle", year: "2019", imageUrl: "/players/tian19.png" },
    { id: "doinb-fpx-2019", name: "Doinb", team: "FPX", region: "LPL", role: "Mid", year: "2019", imageUrl: "/players/doinb19.png" },
    { id: "lwx-fpx-2019", name: "LWX", team: "FPX", region: "LPL", role: "ADC", year: "2019", imageUrl: "/players/lwx.png" },
    { id: "crisp-fpx-2019", name: "Crisp", team: "FPX", region: "LPL", role: "Support", year: "2019", imageUrl: "/players/crisp19.png" },
  ],
};

export default function TestEffectPage() {
  const [showEffect, setShowEffect] = useState(false);
  const [selectedRoster, setSelectedRoster] = useState<string>("T1 2024");
  const [upgradedIds, setUpgradedIds] = useState<Set<string>>(new Set());

  const roster = SAMPLE_ROSTERS[selectedRoster];
  const team = roster[0]?.team || "T1";
  const teamColor = TEAM_COLORS[team] || "#E2012D";

  const handleEffectComplete = () => {
    // Mark all cards in current roster as upgraded
    setUpgradedIds(new Set(roster.map(c => c.id)));
    setShowEffect(false);
  };

  const handleReset = () => {
    setUpgradedIds(new Set());
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Full Roster Effect Test</h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Select Roster</label>
          <select
            value={selectedRoster}
            onChange={(e) => setSelectedRoster(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white"
          >
            {Object.keys(SAMPLE_ROSTERS).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-3">
          <button
            onClick={() => setShowEffect(true)}
            className="px-6 py-2 rounded font-bold text-white transition-all hover:scale-105"
            style={{ backgroundColor: teamColor }}
          >
            Play Effect
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 rounded font-bold text-white bg-gray-600 transition-all hover:scale-105 hover:bg-gray-500"
          >
            Reset Upgrades
          </button>
        </div>
      </div>

      {/* Team Info */}
      <div className="mb-8 p-4 bg-gray-800 rounded-lg inline-block">
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: teamColor }}
          />
          <span className="text-xl font-bold">{selectedRoster}</span>
          <span className="text-gray-400">({roster[0]?.region})</span>
        </div>
      </div>

      {/* Preview Cards */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Preview {upgradedIds.size > 0 && <span className="text-sm text-cyan-400">(Upgraded)</span>}
        </h2>
        <div className="flex flex-wrap gap-6">
          {roster.map((card) => (
            <PlayerCard key={card.id} card={card} size="sm" isUpgraded={upgradedIds.has(card.id)} />
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-800/50 rounded-lg p-4 max-w-xl">
        <h3 className="font-semibold mb-2">Test Instructions</h3>
        <ul className="text-gray-400 text-sm space-y-1">
          <li>1. Select a roster from the dropdown</li>
          <li>2. Click &quot;Play Effect&quot; to see the animation</li>
          <li>3. Click anywhere to skip the effect</li>
          <li>4. Test on mobile by resizing window or using devtools</li>
        </ul>
      </div>

      {/* Effect Overlay */}
      {showEffect && (
        <FullRosterEffect
          cards={roster}
          onComplete={handleEffectComplete}
        />
      )}
    </div>
  );
}
