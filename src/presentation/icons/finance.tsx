export function TagIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
      <path strokeWidth="1.8" d="M20 13l-7 7-10-10V3h7L20 13z" />
      <circle cx="7.5" cy="7.5" r="1.4" fill="currentColor" />
    </svg>
  );
}

export function BriefcaseIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
      <rect x="3" y="7" width="18" height="13" rx="2" strokeWidth="1.8" />
      <path strokeWidth="1.8" d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
      <path strokeWidth="1.8" d="M3 12h18" />
    </svg>
  );
}

export function EyeIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
      <path strokeWidth="1.8" d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" strokeWidth="1.8" />
    </svg>
  );
}
