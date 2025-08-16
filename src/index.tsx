import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, makeTrpcClient } from "./core/api/trpc";
import { AppShell } from "./presentation/app/AppShell";
import Home from "./pages/Home";
import Players from "./pages/Players";
import Market from "./pages/Market";
import Teams from "./pages/Teams";
import Budget from "./pages/Budget";
import "./index.css";

const qc = new QueryClient();
const client = makeTrpcClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <trpc.Provider client={client} queryClient={qc}>
      <QueryClientProvider client={qc}>
        <BrowserRouter>
          <AppShell>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/players" element={<Players />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/market" element={<Market />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppShell>
        </BrowserRouter>
      </QueryClientProvider>
    </trpc.Provider>
  </React.StrictMode>
);
