import React from "react";
import { NavLink } from "react-router-dom";
import { IconTeams, IconPlayers, IconBudget, IconMarket } from "../../components/icons";
import { COLORS } from "../../../core/constants/palette";

const items = [
  { to: "/teams", label: "Teams", icon: IconTeams },
  { to: "/players", label: "Players", icon: IconPlayers },
  { to: "/budget", label: "Budget", icon: IconBudget },
  { to: "/market", label: "Market", icon: IconMarket },
];

export function SideNav() {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-16 flex-col items-center py-3"
        style={{ backgroundColor: COLORS.primary }}
      >
        <nav className="flex-1 space-y-1 w-full">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              aria-label={label}
              className={({ isActive }) =>
                [
                  "flex items-center justify-center h-10 w-full",
                  "rounded-md text-white",
                  "hover:bg-white/10",
                  isActive ? "bg-white/10" : "",
                ].join(" ")
              }
            >
              <Icon className="h-5 w-5" />
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 h-14 flex items-center justify-around"
        style={{ backgroundColor: COLORS.primary }}
      >
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "flex flex-col items-center justify-center h-full text-xs text-white",
                "hover:bg-white/10 w-full h-full",
                isActive ? "bg-white/10 font-medium" : "",
              ].join(" ")
            }
          >
            <Icon className="h-5 w-5" />
            <span className="mt-0.5">{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
