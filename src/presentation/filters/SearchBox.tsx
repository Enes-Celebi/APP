import React from "react";

export function SearchBox({
  value,
  onChange,
  placeholder = "Search…",
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-60 rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200 ${className}`}
    />
  );
}
