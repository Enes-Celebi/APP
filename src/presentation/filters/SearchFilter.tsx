import React from "react";

export type Option = { label: string; value: string };

export function SelectFilter({
  label,
  value,
  onChange,
  options,
  className = "",
}: {
  label?: string;
  value: string | undefined;
  onChange: (v: string | undefined) => void;
  options: Option[];
  className?: string;
}) {
  return (
    <label className={`inline-flex items-center gap-2 ${className}`}>
      {label && <span className="text-xs text-gray-500">{label}</span>}
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="rounded-xl border bg-white px-3 py-2 text-sm"
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
