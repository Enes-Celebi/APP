import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";

// Force any to avoid type errors while we're auth-only.
export const trpc: any = (createTRPCReact as any)() as any;

export function makeTrpcClient() {
  return (trpc as any).createClient({
    links: [
      httpBatchLink({
        url: "http://localhost:4000/trpc",
        fetch: (url, opts) => fetch(url, { ...opts, credentials: "include" }),
      }),
    ],
  });
}
