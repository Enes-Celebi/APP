import { PlayersView } from "../players/PlayersView";
import type { TeamSummary } from "./types";

export function TeamPlayersView({ team, onBack }: { team: TeamSummary; onBack: () => void }) {
  return (
    <PlayersView
      title={`${team.name} — Players`}
      limit={12}
      teamId={team.id}
      teamScope="all"
      showBackButton
      onBack={onBack}
    />
  );
}
