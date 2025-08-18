import { useEffect } from "react";
import { trpc } from "../../core/api/trpc";
import { useAuth } from "./AuthProvider";

export function AuthSync() {
  const { me, setMe } = useAuth();

  const q = trpc.identity.me.useQuery(undefined, {
    initialData: me,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  useEffect(() => {
    if (q.data !== undefined) setMe(q.data as any);
  }, [q.data, setMe]);

  return null;
}
