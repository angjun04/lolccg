"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { PlayerCard, Role } from "@/lib/types";
import { allPlayers } from "@/lib/utils/players";

interface RosterState {
  [key: string]: PlayerCard | null;
}

interface GameContextType {
  roster: RosterState;
  revealingCard: PlayerCard | null;
  upgradedCardIds: Set<string>;
  drawCard: (role: Role) => void;
  completeReveal: () => void;
  upgradeCards: (cardIds: string[]) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

function getRandomCardForRole(role: Role): PlayerCard {
  const roleCards = allPlayers.filter((card) => card.role === role);
  const randomIndex = Math.floor(Math.random() * roleCards.length);
  return roleCards[randomIndex];
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [roster, setRoster] = useState<RosterState>({
    Top: null,
    Jungle: null,
    Mid: null,
    ADC: null,
    Support: null,
  });

  const [revealingCard, setRevealingCard] = useState<PlayerCard | null>(null);
  const [pendingRole, setPendingRole] = useState<Role | null>(null);
  const [upgradedCardIds, setUpgradedCardIds] = useState<Set<string>>(new Set());

  const drawCard = (role: Role) => {
    const card = getRandomCardForRole(role);
    setRevealingCard(card);
    setPendingRole(role);
  };

  const completeReveal = () => {
    if (revealingCard && pendingRole) {
      setRoster((prev) => ({ ...prev, [pendingRole]: revealingCard }));
    }
    setRevealingCard(null);
    setPendingRole(null);
  };

  const upgradeCards = (cardIds: string[]) => {
    setUpgradedCardIds((prev) => new Set([...prev, ...cardIds]));
  };

  const resetGame = () => {
    setRoster({
      Top: null,
      Jungle: null,
      Mid: null,
      ADC: null,
      Support: null,
    });
    setRevealingCard(null);
    setPendingRole(null);
    setUpgradedCardIds(new Set());
  };

  return (
    <GameContext.Provider
      value={{
        roster,
        revealingCard,
        upgradedCardIds,
        drawCard,
        completeReveal,
        upgradeCards,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
