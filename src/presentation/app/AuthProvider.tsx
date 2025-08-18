import React, { createContext, useContext, useState } from "react";

export type OnboardingStep = "NEED_USERNAME" | "NEED_TEAM" | "CREATING_TEAM" | "READY";

export type MeTeam = {
  id: string;
  name: string;
  budgetCents: number;
  players: { id: string }[];
};

export type MeUser = {
  id: string;
  email: string | null;
  username: string | null;
  onboardingStep: OnboardingStep;
};

export type MeShape = {
  user: MeUser;
  team: MeTeam | null;
  job?: any | null;
} | null;

type Ctx = { me: MeShape; setMe: React.Dispatch<React.SetStateAction<MeShape>> };

const AuthCtx = createContext<Ctx | undefined>(undefined);

export function AuthProvider({
  initialMe,
  children,
}: {
  initialMe: MeShape;
  children: React.ReactNode;
}) {
  const [me, setMe] = useState<MeShape>(initialMe);
  return <AuthCtx.Provider value={{ me, setMe }}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const v = useContext(AuthCtx);
  if (!v) throw new Error("useAuth must be used within <AuthProvider>");
  return v;
}
