import { PlayersView } from "../feature/players/PlayersView";

export default function Market() {
  return (
    <PlayersView
      title="Market"
      limit={12}
      teamScope="all"
      forSale
      enableSearch
      enableTeamFilter
      enablePositionFilter
      enableSortByPrice
    />
  );
}
