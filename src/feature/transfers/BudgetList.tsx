import { useEffect, useRef, useState } from "react";
import { useTransfersInfinite } from "./api";
import { TransferHeader } from "./Transferheader";
import { TransferRow } from "./TransferRow";
import type { TransferListItem } from "./types";
import { FiltersRow } from "../../presentation/filters/FiltersRow";
import { SearchBox } from "../../presentation/filters/SearchBox";
import { SelectFilter } from "../../presentation/filters/SearchFilter";
import { SegmentedFilter } from "../../presentation/filters/SegmentedFilter";
import { SortSelect } from "../../presentation/filters/SortSelect";
import { useTeamsList } from "../teams/api";
import { useDebounced } from "../../presentation/filters/useDebounced";

export function BudgetList({ onView }: { onView: (id: string) => void }) {
  const [q, setQ] = useState("");
  const dq = useDebounced(q, 300);
  const [kind, setKind] = useState<"all" | "buy" | "sell">("all");
  const [teamId, setTeamId] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState<string | undefined>(undefined);

  const teamsQ = useTeamsList();

  const inf = useTransfersInfinite(25, {
    q: dq || undefined,
    kind,
    teamId,
    sort: sort as any,
  });

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && inf.hasNextPage && !inf.isFetchingNextPage) {
        inf.fetchNextPage();
      }
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, [inf.hasNextPage, inf.isFetchingNextPage, inf.fetchNextPage]);

  if (inf.isLoading) return <div className="p-2">Loading transactions…</div>;
  if (inf.isError) return <div className="p-2 text-red-600">Failed to load transactions.</div>;

  const transfers = inf.transfers as TransferListItem[];
  const total = inf.total;
  const remaining = Math.max(0, total - transfers.length);

  const teamOptions = (teamsQ.data ?? []).map((t) => ({ label: t.name, value: t.id }));

  return (
    <div className="p-2">
      <div className="mb-3 flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <div className="text-sm text-gray-500">
          Showing {transfers.length} of {total}
          {inf.isFetchingNextPage && " (loading…)"}
        </div>
      </div>

      <FiltersRow>
        <SearchBox value={q} onChange={setQ} placeholder="Search players…" />
        <SegmentedFilter
          value={kind}
          onChange={setKind}
          segments={[
            { label: "All", value: "all" },
            { label: "Buys", value: "buy" },
            { label: "Sells", value: "sell" },
          ]}
        />
        <SelectFilter label="Team" value={teamId} onChange={setTeamId} options={teamOptions} />
        <SortSelect
          value={sort}
          onChange={setSort}
          options={[
            { label: "Price ↑", value: "priceAsc" },
            { label: "Price ↓", value: "priceDesc" },
          ]}
        />
      </FiltersRow>

      <TransferHeader />

      <div className="space-y-3">
        {transfers.map((t) => (
          <TransferRow key={t.id} t={t} onView={() => onView(t.id)} />
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        {inf.isFetchingNextPage && (
          <div className="text-blue-600 font-medium">Loading more…</div>
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
    </div>
  );
}
