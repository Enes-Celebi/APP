import { useMemo } from "react";
import { useTeams } from "../feature/teams/api";
import { TeamCard } from "../feature/teams/TeamCard";
import { TeamPlayersView } from "../feature/teams/TeamPlayersView";
import type { TeamSummary } from "../feature/teams/types";
import { useNavigate, useSearchParams } from "react-router-dom";

function TeamsPage() {
  const { data, isLoading, isError } = useTeams();
  const teams = data ?? [];

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const teamId = searchParams.get("teamId");
  const selectedTeam: TeamSummary | null = useMemo(
    () => (teamId ? teams.find((t) => t.id === teamId) ?? null : null),
    [teamId, teams]
  );

  if (isLoading) return <div className="p-3">Loading teams…</div>;
  if (isError)   return <div className="p-3 text-red-600">Error loading teams.</div>;

  if (selectedTeam) {
    return (
      <div className="p-2">
        <TeamPlayersView
          team={selectedTeam}
          onBack={() => {
            // remove teamId from query params (stays on /teams)
            const sp = new URLSearchParams(searchParams);
            sp.delete("teamId");
            navigate({ search: sp.toString() }, { replace: false });
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="mb-3 flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">Teams</h1>
        <div className="text-sm text-gray-500">{teams.length} teams</div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {teams.map((t) => (
          <TeamCard
            key={t.id}
            team={t}
            onViewPlayers={() => {
              const sp = new URLSearchParams(searchParams);
              sp.set("teamId", t.id);
              navigate({ search: sp.toString() }, { replace: false });
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default TeamsPage;
