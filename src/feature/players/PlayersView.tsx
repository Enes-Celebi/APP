import { useEffect, useRef, useState } from "react";
import { useMe, usePlayerMutations, usePlayersInfinite } from "./api";
import type { Player, Listing } from "./types";
import { PlayersGrid } from "./PlayersGrid";
import { ListPriceModal } from "./ListPriceModal";
import { BuyPlayerModal } from "./BuyPlayerModal";
import { LoginPrompt } from "../../presentation/auth/LoginPrompt";
import { FiltersRow } from "../../presentation/filters/FiltersRow";
import { SearchBox } from "../../presentation/filters/SearchBox";
import { SelectFilter } from "../../presentation/filters/SearchFilter";
import { SortSelect } from "../../presentation/filters/SortSelect";
import { useTeamsList } from "../teams/api";
import { useDebounced } from "../../presentation/filters/useDebounced";

type Props = {
  title?: string;
  limit?: number;
  teamId?: string;
  teamScope?: "all" | "mine";
  forSale?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;

  enableSearch?: boolean;
  enableTeamFilter?: boolean;
  enablePositionFilter?: boolean;
  enableSortByPrice?: boolean;
};

export function PlayersView({
  title = "Players",
  limit = 24,
  teamId,
  teamScope = "all",
  forSale,
  showBackButton = false,
  onBack,

  enableSearch = true,
  enableTeamFilter = true,
  enablePositionFilter = true,
  enableSortByPrice = false,
}: Props) {
  const meQ = useMe();
  const { listForSale, unlist, buyAt95 } = usePlayerMutations();

  const [q, setQ] = useState("");
  const dq = useDebounced(q, 300);
  const [pos, setPos] = useState<"ALL" | "GK" | "DF" | "MD" | "FW">("ALL");
  const [team, setTeam] = useState<string | undefined>(teamId);
  const [sort, setSort] = useState<string | undefined>(undefined);

  const teamsQ = useTeamsList();

  const inf = usePlayersInfinite({
    limit,
    teamScope,
    forSale,
    teamId: team,
    position: pos,
    q: dq || undefined,
    sort: enableSortByPrice ? (sort as "priceAsc" | "priceDesc" | undefined) : undefined,
  });

  const isAuthed = !!meQ.data?.team || !!meQ.data?.id || !!meQ.data?.user;

  const myTeam = meQ.data?.team ?? null;
  const myBudgetCents = myTeam?.budgetCents ?? 0;
  const myRosterCount = myTeam?.players?.length ?? 0;

  const [priceModal, setPriceModal] = useState<null | { player: Player; currentCents?: number }>(null);
  const [buyModal, setBuyModal] = useState<null | { player: Player; listing: Listing }>(null);
  const [showLogin, setShowLogin] = useState(false);

  const requireAuth = (fn: () => void) => {
    if (!isAuthed) {
      setShowLogin(true);
      return;
    }
    fn();
  };

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

  if (inf.isLoading) return <div className="p-3">Loading players…</div>;
  if (inf.isError) {
    return (
      <div className="p-3 text-red-600">
        Error loading players: {String((inf as any).error?.message ?? "Unknown error")}
      </div>
    );
  }

  const players = inf.players;
  const total = inf.total;
  const remaining = Math.max(0, total - players.length);

  const teamOptions = (teamsQ.data ?? []).map((t) => ({ label: t.name, value: t.id }));

  return (
    <div className="p-2">
      <div className="mb-3 flex items-baseline justify-between">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <button
              className="rounded-lg border px-3 py-1 text-gray-700 hover:bg-gray-50"
              onClick={onBack}
            >
              ← Back
            </button>
          )}
          <h1 className="text-2xl font-semibold">{title}</h1>
        </div>
        <div className="text-sm text-gray-500">
          Showing {players.length} of {total}
          {inf.isFetchingNextPage && " (loading...)"}
        </div>
      </div>

      <FiltersRow>
        {enableSearch && <SearchBox value={q} onChange={setQ} placeholder="Search players…" />}
        {enableTeamFilter && (
          <SelectFilter label="Team" value={team} onChange={setTeam} options={teamOptions} />
        )}
        {enablePositionFilter && (
          <SelectFilter
            label="Position"
            value={pos === "ALL" ? "" : pos}
            onChange={(v: string | undefined) =>
              setPos(((v as "GK" | "DF" | "MD" | "FW" | undefined) ?? "ALL") as any)
            }
            options={[
              { label: "GK", value: "GK" },
              { label: "DF", value: "DF" },
              { label: "MD", value: "MD" },
              { label: "FW", value: "FW" },
            ]}
          />
        )}
        {enableSortByPrice && (
          <SortSelect
            value={sort}
            onChange={(v: string | undefined) => setSort(v)}
            options={[
              { label: "Price ↑", value: "priceAsc" },
              { label: "Price ↓", value: "priceDesc" },
            ]}
          />
        )}
      </FiltersRow>

      <PlayersGrid
        players={players}
        myTeamId={myTeam?.id ?? null}
        onList={(p) => requireAuth(() => setPriceModal({ player: p }))}
        onEdit={(p, listing) =>
          requireAuth(() => setPriceModal({ player: p, currentCents: listing.askingPriceCents }))
        }
        onUnlist={(p) => requireAuth(() => unlist.mutate({ playerId: p.id }))}
        onBuy={(p, listing) => requireAuth(() => setBuyModal({ player: p, listing }))}
      />

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
        onSave={(cents) =>
          priceModal && listForSale.mutate({ playerId: priceModal.player.id, priceCents: cents })
        }
      />

      <BuyPlayerModal
        open={!!buyModal}
        player={buyModal?.player}
        listing={buyModal?.listing}
        myBudgetCents={myBudgetCents}
        myRosterCount={myRosterCount}
        trpcError={undefined as any}
        onClose={() => setBuyModal(null)}
        onPay={() => buyModal && buyAt95.mutate({ playerId: buyModal.player.id })}
      />

      {showLogin && (
        <LoginPrompt
          onClose={() => setShowLogin(false)}
          message="Please sign in to buy, list, edit, or unlist players."
        />
      )}
    </div>
  );
}
