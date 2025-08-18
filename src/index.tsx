import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, makeTrpcClient } from "./core/api/trpc";
import { AppShell } from "./presentation/app/AppShell";
import Players from "./pages/Players";
import Market from "./pages/Market";
import Teams from "./pages/Teams";
import Budget from "./pages/Budget";
import { AuthProvider } from "./presentation/app/AuthProvider";
import { AuthSync } from "./presentation/app/AuthSync";
import "./index.css";

const qc = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});
const client = makeTrpcClient();

function App({ initialMe }: { initialMe: any }) {
  return (
    <trpc.Provider client={client} queryClient={qc}>
      <QueryClientProvider client={qc}>
        <AuthProvider initialMe={initialMe}>
          <BrowserRouter>
            <AppShell>
              <AuthSync />
              <Routes>
                <Route path="/" element={<Navigate to="/players" replace />} />
                <Route path="/players" element={<Players />} />
                <Route path="/teams" element={<Teams />} />
                <Route path="/market" element={<Market />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="*" element={<Navigate to="/players" replace />} />
              </Routes>
            </AppShell>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

(async () => {
  let me: any = null;
  try {
    me = await client.identity.me.query(); 
  } catch {
    me = null;
  }

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App initialMe={me} />
    </React.StrictMode>
  );
})();
