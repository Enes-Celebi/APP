// src/layouts/AppLayout.tsx
import React from "react";
import { TopBar } from "../presentation/widgets/navigation/TopBar";
import { SideNav } from "../presentation/widgets/navigation/SideNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky top bar */}
      <TopBar />

      {/* Sidebar (desktop) + Bottom bar (mobile) are both handled inside SideNav */}
      <SideNav />

      {/* Main content:
          - pt-14 to clear the sticky TopBar (h-14)
          - md:pl-16 to clear the fixed desktop SideNav (w-16)
          - pb-14 on mobile to clear the bottom nav (h-14), not needed on md+ */}
      <main className="pt-14 md:pl-16 pb-14 md:pb-0">
        <div className="mx-auto max-w-screen-2xl p-4">
          {children}
        </div>
      </main>
    </div>
  );
}
