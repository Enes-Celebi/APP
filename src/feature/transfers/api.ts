import { trpc } from "../../core/api/trpc";
import type { TransferListItem, TransferDetail } from "./types";

type TransferPage = { items: TransferListItem[]; nextCursor: number | null; total: number };

export function useTransfersInfinite(
  limit = 25,
  filters?: { q?: string; kind?: "all" | "buy" | "sell"; teamId?: string; sort?: "priceAsc" | "priceDesc" }
) {
  const { q, kind = "all", teamId, sort } = filters ?? {};

  const qy = trpc.transfer.page.useInfiniteQuery(
    { limit, q, kind, teamId, sort },
    {
      getNextPageParam: (lastPage: TransferPage) => lastPage?.nextCursor ?? undefined,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );

  const pages: TransferPage[] = (qy.data?.pages as TransferPage[] | undefined) ?? [];
  const total = pages[0]?.total ?? 0;
  const transfers = pages.flatMap((p) => p.items);

  return { ...qy, transfers, total };
}

export function useTransferDetail(id?: string | null) {
  return trpc.transfer.byId.useQuery({ id: id ?? "" }, { enabled: !!id });
}
