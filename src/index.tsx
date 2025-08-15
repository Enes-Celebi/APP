import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, makeTrpcClient } from "./lib/trpc";
import Home from "./pages/Home";
import "./index.css";

const qc = new QueryClient();
const client = makeTrpcClient();

function Nav() {
  return (
    <nav className="p-3 border-b flex items-center gap-3">
      <NavLink to="/" className="text-blue-600 hover:underline">Home</NavLink>
      <a href="http://localhost:4000/auth/google" className="text-blue-600 hover:underline">
        Sign in with Google
      </a>
      {/* Use GET logout so we don't need any body parser */}
      <a
        href="http://localhost:4000/auth/logout"
        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
      >
        Logout
      </a>
    </nav>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <trpc.Provider client={client} queryClient={qc}>
      <QueryClientProvider client={qc}>
        <BrowserRouter>
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </trpc.Provider>
  </React.StrictMode>
);
