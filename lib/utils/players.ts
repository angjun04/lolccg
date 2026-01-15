import { PlayerCard, Region } from "@/lib/types";
import lckPlayers from "@/data/players/lck.json";
import lplPlayers from "@/data/players/lpl.json";
import lecPlayers from "@/data/players/lec.json";
import lcsPlayers from "@/data/players/lcs.json";

export const allPlayers: PlayerCard[] = [
  ...(lckPlayers as PlayerCard[]),
  ...(lplPlayers as PlayerCard[]),
  ...(lecPlayers as PlayerCard[]),
  ...(lcsPlayers as PlayerCard[]),
];

export function getPlayersByRegion(region: Region): PlayerCard[] {
  return allPlayers.filter((player) => player.region === region);
}

export function getPlayerById(id: string): PlayerCard | undefined {
  return allPlayers.find((player) => player.id === id);
}

export function getTotalCardCount(): number {
  return allPlayers.length;
}

export function getCardsByIds(ids: string[]): PlayerCard[] {
  return ids
    .map((id) => getPlayerById(id))
    .filter((card): card is PlayerCard => card !== undefined);
}
