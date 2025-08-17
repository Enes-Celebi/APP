// web/feature/players/api.ts
import { trpc } from "../../core/api/trpc";
import type { Player } from "./types";

type PlayerPage = { items: Player[]; nextCursor: number | null; total: number };

export function useMe() {
  return trpc.identity.me.useQuery();
}

export function useAllPlayers() {
  return trpc.player.all.useQuery() as unknown as { data?: Player[]; isLoading: boolean; isError: boolean };
}

export function usePlayerMutations() {
  const utils = trpc.useUtils();
  const invalidate = () => {
    utils.player.all?.invalidate?.();
    utils.player.page?.invalidate?.();
    utils.identity.me?.invalidate?.();
  };

  const listForSale = trpc.player.listForSale.useMutation({ onSuccess: invalidate });
  const unlist = trpc.player.unlist.useMutation({ onSuccess: invalidate });
  const buyAt95 = trpc.player.buyAt95.useMutation({ onSuccess: invalidate });

  return { listForSale, unlist, buyAt95 };
}

export function usePlayersInfinite(opts?: {
  limit?: number;
  position?: "GK" | "DF" | "MD" | "FW" | "ALL";
  forSale?: boolean;
  teamScope?: "all" | "mine";
}) {
  const { limit = 24, position = "ALL", forSale, teamScope = "all" } = opts ?? {};

  const q = trpc.player.page.useInfiniteQuery(
    { limit, position, forSale, teamScope },
    {
      getNextPageParam: (lastPage: PlayerPage) => {
        console.log("getNextPageParam:", {
          nextCursor: lastPage?.nextCursor,
          pageItems: lastPage?.items?.length,
          pageTotal: lastPage?.total,
        });
        return lastPage?.nextCursor ?? undefined;
      },
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );

  const pages: PlayerPage[] = (q.data?.pages as PlayerPage[] | undefined) ?? [];
  const total: number = pages[0]?.total ?? 0;
  const players: Player[] = pages.flatMap((p) => p.items);

  console.log("usePlayersInfinite state:", {
    pagesCount: pages.length,
    total,
    playersLoaded: players.length,
    hasNextPage: q.hasNextPage,
    isFetchingNextPage: q.isFetchingNextPage,
    isLoading: q.isLoading,
    lastPageCursor: pages[pages.length - 1]?.nextCursor,
  });

  return { ...q, players, total };
}