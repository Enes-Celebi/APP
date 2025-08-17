export type Listing = { playerId: string; teamId: string; askingPriceCents: number };

export type Team = { id: string; name: string; budgetCents: number };

export type Player = {
  id: string;
  name: string;
  position: "GK" | "DF" | "MD" | "FW";
  skill: number;
  tactic: number;
  physical: number;
  teamId: string;
  team: Team;
  listing?: Listing | null;
};