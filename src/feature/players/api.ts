import { trpc } from "../../core/api/trpc";
import type { Player } from "./types";

type PlayerPage = { items: Player[]; nextCursor: number | null; total: number };

export function useMe() {
  return trpc.identity.me.useQuery(undefined, { retry: false });
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
  teamId?: string;
  q?: string;
  sort?: "priceAsc" | "priceDesc";
}) {
  const { limit = 24, position = "ALL", forSale, teamScope = "all", teamId, q, sort } = opts ?? {};

  const qry = trpc.player.page.useInfiniteQuery(
    { limit, position, forSale, teamScope, teamId, q, sort },
    {
      getNextPageParam: (lastPage: PlayerPage) => lastPage?.nextCursor ?? undefined,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );

  const pages: PlayerPage[] = (qry.data?.pages as PlayerPage[] | undefined) ?? [];
  const total: number = pages[0]?.total ?? 0;
  const players: Player[] = pages.flatMap((p) => p.items);

  return { ...qry, players, total };
}
