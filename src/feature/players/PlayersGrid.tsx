import { PlayerCard } from "./PlayerCard";
import type { Player, Listing } from "./types";

export function PlayersGrid({
  players,
  myTeamId,
  onList,
  onEdit,
  onUnlist,
  onBuy,
}: {
  players: Player[];
  myTeamId?: string | null;
  onList: (p: Player) => void;
  onEdit: (p: Player, listing: Listing) => void;
  onUnlist: (p: Player) => void;
  onBuy: (p: Player, listing: Listing) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {players.map((p) => {
        const isMine = !!myTeamId && p.teamId === myTeamId;
        const listing = p.listing ?? null;
        return (
          <PlayerCard
            key={p.id}
            player={p}
            isMine={isMine}
            listing={listing}
            onList={() => onList(p)}
            onEdit={() => listing && onEdit(p, listing)}
            onUnlist={() => onUnlist(p)}
            onBuy={() => listing && onBuy(p, listing)}
          />
        );
      })}
    </div>
  );
}