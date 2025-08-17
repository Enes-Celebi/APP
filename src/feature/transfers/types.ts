export type TransferListItem = {
  id: string;
  createdAt: string | Date;
  kind: "buy" | "sell";
  player: { id: string; name: string };
  position: "GK" | "DF" | "MD" | "FW";
  skill: number;
  tactic: number;
  physical: number;
  askingPriceCents: number;
  soldPriceCents: number;
  sellerTeamId: string;
  buyerTeamId: string;
  sellerTeamName: string;
  buyerTeamName: string;
};

export type TransferDetail = {
  id: string;
  createdAt: string | Date;
  player: { id: string; name: string };
  position: "GK" | "DF" | "MD" | "FW";
  skill: number;
  tactic: number;
  physical: number;
  askingPriceCents: number;
  soldPriceCents: number;
  sellerTeamId: string;
  sellerTeamName: string;
  buyerTeamId: string;
  buyerTeamName: string;
  youAreBuyer: boolean;
  youAreSeller: boolean;
  buyerBalanceBefore: number;
  buyerBalanceAfter: number;
  sellerBalanceBefore: number;
  sellerBalanceAfter: number;
};
