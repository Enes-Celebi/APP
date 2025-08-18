import React from "react";
import { COLORS } from "../../../core/constants/palette";
import { useAuth } from "../../app/AuthProvider";

function money(cents?: number) {
  const v = (cents ?? 0) / 100;
  return `$${v.toLocaleString()}`;
}

function Hamburger({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
      <path strokeWidth="2" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function External({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
      <path strokeWidth="2" d="M14 3h7v7" />
      <path strokeWidth="2" d="M10 14L21 3" />
      <path strokeWidth="2" d="M21 14v7H3V3h7" />
    </svg>
  );
}

export function TopBar() {
  const { me } = useAuth();
  const [open, setOpen] = React.useState(false);

  const teamName = me?.team?.name ?? "CALO";
  const budgetCents = me?.team?.budgetCents;

  // Prefer DB username; fallback to email prefix if needed
  const displayName =
    me?.user?.username ??
    (me?.user?.email ? me.user.email.split("@")[0] : undefined);

  const isAuthed = !!me?.user;

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 w-full bg-white shadow-md">
        {/* slim colored tip */}
        <div className="h-full w-2" style={{ backgroundColor: COLORS.primary }} />

        <div className="flex flex-1 items-center justify-between px-4">
          {/* logo-style team text */}
          <div className="font-semibold tracking-[0.6em] text-emerald-600 uppercase select-none">
            {teamName}
          </div>

          {/* desktop cluster */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="text-emerald-600 font-semibold">{money(budgetCents)}</div>

            {isAuthed ? (
              <>
                <span className="text-sm font-medium text-gray-900">{displayName}</span>
                <a
                  href="http://localhost:4000/auth/logout"
                  className="inline-flex items-center gap-1 rounded px-2.5 py-1.5 text-gray-800 hover:bg-gray-100"
                  title="Sign out"
                >
                  <External />
                </a>
              </>
            ) : (
              <a
                href="http://localhost:4000/auth/google"
                className="inline-flex items-center rounded px-3 py-1.5 text-white hover:opacity-90"
                style={{ backgroundColor: COLORS.primary }}
              >
                Sign in
              </a>
            )}
          </div>

          {/* mobile hamburger */}
          <button
            className="sm:hidden inline-flex items-center justify-center rounded p-2 text-emerald-600 hover:bg-gray-100"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Hamburger />
          </button>
        </div>
      </header>

      {/* mobile drawer */}
      <div
        className={`fixed inset-0 z-50 sm:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        {/* scrim */}
        <div
          className={`absolute inset-0 bg-black/30 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        {/* panel */}
        <aside
          className={`absolute left-0 top-0 h-full w-72 bg-white shadow-xl ring-1 ring-black/5 transform transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="font-semibold tracking-[0.6em] text-emerald-600 uppercase">
              {teamName}
            </div>
            <button
              className="inline-flex items-center justify-center rounded p-2 text-emerald-600 hover:bg-gray-100"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <Hamburger />
            </button>
          </div>

          <div className="p-4 space-y-5">
            <div className="text-sm font-semibold text-gray-900">
              {isAuthed ? displayName : "Guest"}
            </div>
            <div className="text-emerald-600 font-semibold">{money(budgetCents)}</div>

            {isAuthed ? (
              <a
                href="http://localhost:4000/auth/logout"
                className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-gray-800 hover:bg-gray-50"
              >
                <External className="h-4 w-4" />
                <span>Sign out</span>
              </a>
            ) : (
              <a
                href="http://localhost:4000/auth/google"
                className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2 text-white hover:opacity-90"
              >
                Sign in
              </a>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
