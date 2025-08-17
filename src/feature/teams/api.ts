import { trpc } from "../../core/api/trpc";
import type { TeamSummary } from "./types";

export function useTeams() {
  return trpc.team.list.useQuery() as unknown as {
    data?: TeamSummary[];
    isLoading: boolean;
    isError: boolean;
  };
}
