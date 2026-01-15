export type Region = "LCK" | "LPL" | "LEC" | "LCS";
export type Role = "Top" | "Jungle" | "Mid" | "ADC" | "Support";

export interface PlayerCard {
  id: string;
  name: string;
  team: string;
  region: Region;
  role: Role;
  year: string;
  imageUrl?: string;
}

export const ROLE_COLORS: Record<Role, string> = {
  Top: "#EF4444",
  Jungle: "#22C55E",
  Mid: "#A855F7",
  ADC: "#EAB308",
  Support: "#3B82F6",
};

export const REGION_NAMES: Record<Region, string> = {
  LCK: "Korea",
  LPL: "China",
  LEC: "Europe",
  LCS: "North America",
};
