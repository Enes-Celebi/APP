import React from "react";

export function FiltersRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      {children}
    </div>
  );
}
