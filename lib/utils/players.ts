import { PlayerCard, Region } from "@/lib/types";
import lckPlayers from "@/data/players/lck.json";
import lplPlayers from "@/data/players/lpl.json";
import lecPlayers from "@/data/players/lec.json";
import lcsPlayers from "@/data/players/lcs.json";
import playerImages from "@/data/playerImages.json";

const imageSet = new Set(playerImages);

function resolveImageUrl(name: string, year: string): string | undefined {
  const nameLower = name.toLowerCase();
  const yearShort = year.slice(-2);

  if (imageSet.has(`${nameLower}${yearShort}`)) {
    return `/players/${nameLower}${yearShort}.png`;
  }
  if (imageSet.has(nameLower)) {
    return `/players/${nameLower}.png`;
  }
  return undefined;
}

function enrichPlayer(player: PlayerCard): PlayerCard {
  return {
    ...player,
    imageUrl: resolveImageUrl(player.name, player.year),
  };
}

export const allPlayers: PlayerCard[] = [
  ...(lckPlayers as PlayerCard[]),
  ...(lplPlayers as PlayerCard[]),
  ...(lecPlayers as PlayerCard[]),
  ...(lcsPlayers as PlayerCard[]),
].map(enrichPlayer);

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
