import { trpc } from "../../core/api/trpc";
import type { TransferListItem, TransferDetail } from "./types";

type TransferPage = { items: TransferListItem[]; nextCursor: number | null; total: number };

export function useTransfersInfinite(limit = 25) {
  const q = trpc.transfer.page.useInfiniteQuery(
    { limit },
    {
      getNextPageParam: (lastPage: TransferPage) => lastPage?.nextCursor ?? undefined,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );

  const pages: TransferPage[] = (q.data?.pages as TransferPage[] | undefined) ?? [];
  const total = pages[0]?.total ?? 0;
  const transfers = pages.flatMap((p) => p.items);

  return { ...q, transfers, total };
}

export function useTransferDetail(id?: string | null) {
  return trpc.transfer.byId.useQuery({ id: id ?? "" }, { enabled: !!id });
}
