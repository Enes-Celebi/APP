import React from "react";
import { COLORS } from "../../../core/constants/palette";
import { trpc } from "../../../core/api/trpc";

export function TopBar() {
  // Safe usage in case trpc hook is not available in some build context
  const me =
    trpc?.identity?.me?.useQuery
      ? trpc.identity.me.useQuery(undefined, { retry: false })
      : (null as any);

  const email: string | undefined = me?.data?.user?.email;

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full bg-white shadow-md">
      {/* Slim primary-colored tip on the left, empty inside */}
      <div className="h-full w-2" style={{ backgroundColor: COLORS.primary }} />

      <div className="flex-1 flex items-center justify-between px-4">
        <div className="font-medium">Football Manager</div>

        {/* Right-side auth actions */}
        <div className="flex items-center gap-3">
          {me?.isLoading ? (
            <div className="h-8 w-40 rounded bg-gray-100 animate-pulse" />
          ) : email ? (
            <>
              <span className="hidden sm:inline text-sm text-gray-700">{email}</span>
              <a
                href="http://localhost:4000/auth/logout"
                className="inline-flex items-center rounded px-3 py-1.5 text-white hover:opacity-90"
                style={{ backgroundColor: COLORS.primary }}
              >
                Sign out
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
      </div>
    </header>
  );
}
