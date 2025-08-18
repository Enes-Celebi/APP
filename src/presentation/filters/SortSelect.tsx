import React from "react";

export function SortSelect({
  value,
  onChange,
  options,
  label = "Sort",
}: {
  value: string | undefined;
  onChange: (v: string | undefined) => void;
  options: { label: string; value: string }[];
  label?: string;
}) {
  return (
    <label className="inline-flex items-center gap-2">
      <span className="text-xs text-gray-500">{label}</span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="rounded-xl border bg-white px-3 py-2 text-sm"
      >
        <option value="">Default</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
