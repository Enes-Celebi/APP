// APP/src/presentation/icons/players.tsx
import React from "react";

// Avatar (top-left silhouette)
export function AvatarIcon(props: { className?: string; size?: number }) {
  const size = props.size ?? 40;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={props.className ?? "text-gray-400"}>
      <circle cx="12" cy="8" r="4" fill="currentColor" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="currentColor" />
    </svg>
  );
}

// Ball (skill – green)
export function BallIcon(props: { size?: number }) {
  const size = props.size ?? 24;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <circle cx="12" cy="12" r="7" fill="white" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  );
}

// Lamp (tactic – yellow)
export function LampIcon(props: { size?: number }) {
  const size = props.size ?? 24;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M8 13a4 4 0 1 1 8 0c0 2-2 3-2 4H10c0-1-2-2-2-4z" fill="currentColor"/>
      <rect x="10" y="18" width="4" height="2" fill="currentColor"/>
    </svg>
  );
}

// Bicep (physical – red)
export function BicepIcon(props: { size?: number }) {
  const size = props.size ?? 24;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M14 6c1 2 3 3 4 4 2 2 2 5 0 7-2 2-6 3-9 1-4-3-2-7 1-9l1-3 3 0z" fill="currentColor"/>
    </svg>
  );
}
