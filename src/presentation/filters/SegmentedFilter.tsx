import React from "react";

export function SegmentedFilter<T extends string>({
  value,
  onChange,
  segments,
}: {
  value: T;
  onChange: (v: T) => void;
  segments: { label: string; value: T }[];
}) {
  return (
    <div className="inline-flex overflow-hidden rounded-xl border">
      {segments.map((s, i) => {
        const active = s.value === value;
        return (
          <button
            key={s.value}
            onClick={() => onChange(s.value)}
            className={`px-3 py-1.5 text-sm ${active ? "bg-gray-900 text-white" : "bg-white text-gray-700 hover:bg-gray-50"} ${i !== segments.length - 1 ? "border-r" : ""}`}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
