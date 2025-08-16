import React from "react";
import { TopBar } from "../widgets/navigation/TopBar";
import { SideNav } from "../widgets/navigation/SideNav";
import OnboardingGate from "../../feature/onboarding/ui/OnboardingGate";

export function AppShell({ children }: { children: React.ReactNode }) {
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
