export type TeamSummary = {
  id: string;
  name: string;
  budgetCents: number;
  counts: { GK: number; DF: number; MD: number; FW: number };
  avg: { skill: number; tactic: number; physical: number };
};
