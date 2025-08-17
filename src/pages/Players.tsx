// web/pages/Players.tsx
import { useEffect, useRef, useState } from "react";
import { useMe, usePlayerMutations, usePlayersInfinite } from "../feature/players/api";
import type { Player, Listing } from "../feature/players/types";
import { PlayersGrid } from "../feature/players/PlayersGrid";
import { ListPriceModal } from "../feature/players/ListPriceModal";
import { BuyPlayerModal } from "../feature/players/BuyPlayerModal";

function PlayersPage() {
  const meQ = useMe();
  const { listForSale, unlist, buyAt95 } = usePlayerMutations();
  const inf = usePlayersInfinite({ limit: 10 });

  const myTeam = meQ.data?.team ?? null;
  const myBudgetCents = myTeam?.budgetCents ?? 0;
  const myRosterCount = myTeam?.players?.length ?? 0;

  const [priceModal, setPriceModal] = useState<null | { player: Player; currentCents?: number }>(null);
  const [buyModal, setBuyModal] = useState<null | { player: Player; listing: Listing }>(null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Auto-fetch more when sentinel comes into view
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && inf.hasNextPage && !inf.isFetchingNextPage) {
          inf.fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [inf.hasNextPage, inf.isFetchingNextPage, inf.fetchNextPage]);

  if (inf.isLoading || meQ.isLoading) {
    return <div className="p-3">Loading players…</div>;
  }

  if (inf.isError) {
    return <div className="p-3 text-red-600">Error loading players: {String((inf as any).error?.message ?? "Unknown error")}</div>;
  }

  const players = inf.players;
  const total = inf.total;
  const remaining = Math.max(0, total - players.length);

  return (
    <div className="p-2">
      <div className="mb-3 flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">Players</h1>
        <div className="text-sm text-gray-500">
          Showing {players.length} of {total}
          {inf.isFetchingNextPage && " (loading...)"}
        </div>
      </div>

      <PlayersGrid
        players={players}
        myTeamId={myTeam?.id ?? null}
        onList={(p) => setPriceModal({ player: p })}
        onEdit={(p, listing) => setPriceModal({ player: p, currentCents: listing.askingPriceCents })}
        onUnlist={(p) => unlist.mutate({ playerId: p.id })}
        onBuy={(p, listing) => setBuyModal({ player: p, listing })}
      />

      {/* Load more section */}
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

export default PlayersPage;