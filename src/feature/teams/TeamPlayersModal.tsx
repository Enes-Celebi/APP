import { useEffect, useRef, useState } from "react";
import type { TeamSummary } from "./types";
import { PlayersGrid } from "../players/PlayersGrid";
import { useMe, usePlayerMutations, usePlayersInfinite } from "../players/api";
import type { Player, Listing } from "../players/types";
import { ListPriceModal } from "../players/ListPriceModal";
import { BuyPlayerModal } from "../players/BuyPlayerModal";

export function TeamPlayersModal({
  open,
  team,
  onClose,
}: {
  open: boolean;
  team: TeamSummary | null;
  onClose: () => void;
}) {
  const meQ = useMe();
  const { listForSale, unlist, buyAt95 } = usePlayerMutations();
  const inf = usePlayersInfinite({ limit: 12, teamId: team?.id });
  const [priceModal, setPriceModal] = useState<null | { player: Player; currentCents?: number }>(null);
  const [buyModal, setBuyModal] = useState<null | { player: Player; listing: Listing }>(null);

  const myTeam = meQ.data?.team ?? null;
  const myBudgetCents = myTeam?.budgetCents ?? 0;
  const myRosterCount = myTeam?.players?.length ?? 0;

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && inf.hasNextPage && !inf.isFetchingNextPage) {
        inf.fetchNextPage();
      }
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, [open, inf.hasNextPage, inf.isFetchingNextPage, inf.fetchNextPage]);

  if (!open || !team) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-3">
      <div className="w-full max-w-5xl rounded-2xl bg-white p-4 shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-xl font-semibold">{team.name} — Players</div>
          <button className="rounded-lg px-3 py-1 text-gray-600 hover:bg-gray-100" onClick={onClose}>
            Close
          </button>
        </div>

        {inf.isLoading ? (
          <div className="p-3">Loading players…</div>
        ) : inf.isError ? (
          <div className="p-3 text-red-600">Failed to load players.</div>
        ) : (
          <>
            <PlayersGrid
              players={inf.players}
              myTeamId={myTeam?.id ?? null}
              onList={(p) => setPriceModal({ player: p })}
              onEdit={(p, listing) => setPriceModal({ player: p, currentCents: listing.askingPriceCents })}
              onUnlist={(p) => unlist.mutate({ playerId: p.id })}
              onBuy={(p, listing) => setBuyModal({ player: p, listing })}
            />

            <div className="mt-4 flex justify-center">
              {inf.isFetchingNextPage && <div className="text-sky-700 font-medium">Loading more…</div>}
              {!inf.isFetchingNextPage && inf.hasNextPage && (
                <button
                  className="rounded-lg border px-4 py-2 text-gray-700 hover:bg-gray-50"
                  onClick={() => inf.fetchNextPage()}
                >
                  Load more
                </button>
              )}
            </div>
            <div ref={sentinelRef} className="h-4 mt-4" />
          </>
        )}

        {/* Modals for list/edit/buy (same behavior as PlayersPage) */}
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
    </div>
  );
}
