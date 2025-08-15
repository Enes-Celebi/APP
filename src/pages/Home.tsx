"use client";
import { trpc } from "../lib/trpc";

export default function Home() {
  const me = trpc?.identity?.me?.useQuery
    ? trpc.identity.me.useQuery(undefined, { retry: false })
    : ({ isLoading: false, error: { message: "tRPC not ready" }, data: null } as any);

  if (me.isLoading) return <div className="p-6">Loading…</div>;

  if (me.error) {
    return (
      <div className="p-6 space-y-3">
        <h1 className="text-xl font-semibold">Football Manager</h1>
        <p>You’re not signed in or the API is unavailable.</p>
        <a
          href="http://localhost:4000/auth/google"
          className="inline-block px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Sign in with Google
        </a>
      </div>
    );
  }

  const email = me.data?.user?.email ?? "(no email)";
  const team = me.data?.team;

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-xl font-semibold">Welcome</h1>
      <p>Signed in as: <b>{email}</b></p>

      {!team ? (
        <p>Creating your team… refresh in a few seconds.</p>
      ) : (
        <>
          <h2 className="text-lg font-semibold">{team.name}</h2>
          <p>Budget: ${(team.budgetCents / 100).toLocaleString()}</p>
          <h3 className="font-semibold mt-2">Players ({team.players.length})</h3>
          <ul className="list-disc pl-5">
            {team.players.map((p: any) => (
              <li key={p.id}>
                {p.name} — {p.position} — S{p.skill}/T{p.tactic}/P{p.physical}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Optional second logout on the page (GET) */}
      <a
        href="http://localhost:4000/auth/logout"
        className="inline-block mt-2 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
      >
        Logout
      </a>
    </div>
  );
}
