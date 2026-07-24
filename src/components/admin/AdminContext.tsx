"use client";

import { createContext, useContext, useRef, useState, useCallback } from "react";
import { CheckCircle, XCircle } from "lucide-react";

type Toast = { id: number; type: "success" | "error"; msg: string };

interface AdminContextValue {
  password: string;
  addToast: (type: "success" | "error", msg: string) => void;
  /** fetch() wrapper that attaches the admin password header and parses JSON. Throws on non-2xx. */
  api: (url: string, init?: RequestInit) => Promise<unknown>;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}

export function AdminProvider({
  password,
  children,
}: {
  password: string;
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  const addToast = useCallback((type: "success" | "error", msg: string) => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, type, msg }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const api = useCallback(
    async (url: string, init?: RequestInit) => {
      const res = await fetch(url, {
        ...init,
        headers: {
          "x-admin-password": password,
          ...(init?.body && !(init.body instanceof FormData) ? { "content-type": "application/json" } : {}),
          ...init?.headers,
        },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error ?? "Request failed");
      }
      return res.json();
    },
    [password]
  );

  return (
    <AdminContext.Provider value={{ password, addToast, api }}>
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
              t.type === "success"
                ? "bg-green-500/10 border border-green-500/30 text-green-400"
                : "bg-red-500/10 border border-red-500/30 text-red-400"
            }`}
          >
            {t.type === "success" ? <CheckCircle size={16} /> : <XCircle size={16} />}
            {t.msg}
          </div>
        ))}
      </div>
      {children}
    </AdminContext.Provider>
  );
}
