import { PlayersView } from "../feature/players/PlayersView";

export default function PlayersPage() {
  return (
    <PlayersView
      title="Players"
      limit={12}
      teamScope="all"
      enableSearch
      enableTeamFilter
      enablePositionFilter
      enableSortByPrice={false}
    />
  );
}
