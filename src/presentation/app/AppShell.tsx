// src/presentation/app/AppShell.tsx
import React, { useEffect, useRef } from "react";
import { TopBar } from "../widgets/navigation/TopBar";
import { SideNav } from "../widgets/navigation/SideNav";
import OnboardingGate from "../../feature/onboarding/ui/OnboardingGate";
import { trpc } from "../../core/api/trpc";
import { useAuth } from "./AuthProvider";

export function AppShell({ children }: { children: React.ReactNode }) {
  // Force a full reload when team creation completes
  const { me } = useAuth();
  const fired = useRef(false);

  const enabled = me?.user?.onboardingStep === "CREATING_TEAM";
  const jobQ = trpc.team.jobStatus.useQuery(undefined, {
    enabled,
    refetchInterval: enabled ? 2000 : false,
    refetchOnWindowFocus: enabled,
  });

  useEffect(() => {
    if (!enabled || fired.current) return;
    if (jobQ.data?.status === "done") {
      fired.current = true;
      // small delay to ensure writes are fully visible
      setTimeout(() => window.location.reload(), 300);
    }
  }, [enabled, jobQ.data?.status]);

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <SideNav />
      <main className="pt-14 md:pl-16 pb-14 md:pb-0">
        <div className="mx-auto max-w-screen-2xl p-4">
          <OnboardingGate />
          {children}
        </div>
      </main>
    </div>
  );
}
