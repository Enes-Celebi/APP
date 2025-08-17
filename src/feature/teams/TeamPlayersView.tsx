import { useEffect, useRef, useState } from "react";
import type { TeamSummary } from "./types";
import { PlayersGrid } from "../players/PlayersGrid";
import { useMe, usePlayerMutations, usePlayersInfinite } from "../players/api";
import type { Player, Listing } from "../players/types";
import { ListPriceModal } from "../players/ListPriceModal";
import { BuyPlayerModal } from "../players/BuyPlayerModal";

export function TeamPlayersView({
  team,
  onBack,
}: {
  team: TeamSummary;
  onBack: () => void;
}) {
  // same hooks/actions as Players page
  const meQ = useMe();
  const { listForSale, unlist, buyAt95 } = usePlayerMutations();

  const inf = usePlayersInfinite({ limit: 12, teamId: team.id });

  const myTeam = meQ.data?.team ?? null;
  const myBudgetCents = myTeam?.budgetCents ?? 0;
  const myRosterCount = myTeam?.players?.length ?? 0;

  const [priceModal, setPriceModal] = useState<null | { player: Player; currentCents?: number }>(null);
  const [buyModal, setBuyModal] = useState<null | { player: Player; listing: Listing }>(null);

  // infinite scroll sentinel
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && inf.hasNextPage && !inf.isFetchingNextPage) {
          inf.fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inf.hasNextPage, inf.isFetchingNextPage, inf.fetchNextPage]);

  const players = inf.players;
  const total = inf.total;
  const remaining = Math.max(0, total - players.length);

  return (
    <div className="p-0">
      {/* header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            className="rounded-lg border px-3 py-1 text-gray-700 hover:bg-gray-50"
            onClick={onBack}
          >
            ← Back to Teams
          </button>
          <h1 className="text-2xl font-semibold">
            {team.name} — Players
          </h1>
        </div>
        <div className="text-sm text-gray-500">
          Showing {players.length} of {total}
          {inf.isFetchingNextPage && " (loading...)"}
        </div>
      </div>

      {/* grid */}
      {inf.isLoading ? (
        <div className="p-3">Loading players…</div>
      ) : inf.isError ? (
        <div className="p-3 text-red-600">Error loading players.</div>
      ) : (
        <>
          <PlayersGrid
            players={players}
            myTeamId={myTeam?.id ?? null}
            onList={(p) => setPriceModal({ player: p })}
            onEdit={(p, listing) => setPriceModal({ player: p, currentCents: listing.askingPriceCents })}
            onUnlist={(p) => unlist.mutate({ playerId: p.id })}
            onBuy={(p, listing) => setBuyModal({ player: p, listing })}
          />

          {/* load more row */}
          <div className="mt-4 flex justify-center">
            {inf.isFetchingNextPage && (
              <div className="text-blue-600 font-medium">Loading more players...</div>
            )}
            {!inf.isFetchingNextPage && inf.hasNextPage && (
              <button
                className="rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => inf.fetchNextPage()}
              >
                Load more ({remaining} remaining)
              </button>
            )}
          </div>
          <div ref={sentinelRef} className="h-4 mt-4" />
        </>
      )}

      {/* re-use the same modals for list/edit/buy */}
      <ListPriceModal
        open={!!priceModal}
        title={priceModal?.currentCents ? "Edit listing price" : "List player for sale"}
        defaultPriceCents={priceModal?.currentCents}
        onClose={() => setPriceModal(null)}
        onSave={(cents) => priceModal && listForSale.mutate({ playerId: priceModal.player.id, priceCents: cents })}
      />

      <BuyPlayerModal
        open={!!buyModal}
        player={buyModal?.player}
        listing={buyModal?.listing}
        myBudgetCents={myBudgetCents}
        myRosterCount={myRosterCount}
        trpcError={(buyAt95 as any).error?.message}
        onClose={() => setBuyModal(null)}
        onPay={() => buyModal && buyAt95.mutate({ playerId: buyModal.player.id })}
      />
    </div>
  );
}
