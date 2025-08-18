// web/feature/teams/api.ts
import { trpc } from "../../core/api/trpc";
import type { TeamSummary } from "./types";

// Searchable teams list
export function useTeamsList(q?: string) {
  return trpc.team.list.useQuery(q ? { q } : undefined, {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  }) as unknown as {
    data?: TeamSummary[];
    isLoading: boolean;
    isError: boolean;
  };
}
