import React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & { className?: string };

const Base = ({ children, className, ...rest }: IconProps & { children: React.ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className ?? "h-5 w-5"}
    {...rest}
  >
    {children}
  </svg>
);

export const IconTeams = (p: IconProps) => (
  <Base {...p}>
    <path d="M8 21h8" />
    <path d="M12 17v4" />
    <path d="M7 4h10v6a5 5 0 0 1-10 0V4z" />
    <path d="M5 9a3 3 0 0 1-3-3V5h5" />
    <path d="M19 9a3 3 0 0 0 3-3V5h-5" />
  </Base>
);

export const IconPlayers = (p: IconProps) => (
  <Base {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Base>
);

export const IconBudget = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 7h14a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4H3z" />
    <path d="M16 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" />
    <path d="M18 12h2" />
  </Base>
);

export const IconMarket = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 6h15l-1.5 9H7.5L6 6Z" />
    <path d="M6 6l-1-3H2" />
    <circle cx="9" cy="20" r="1" />
    <circle cx="19" cy="20" r="1" />
  </Base>
);
