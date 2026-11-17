"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { usePathname } from "next/navigation";
import { createToolSession, toolForPath } from "@/lib/tool-session";

type SessionStore = ReturnType<typeof createToolSession>;
const Context = createContext<SessionStore | null>(null);

export function ToolSessionProvider({
  user,
  children,
}: {
  user: string;
  children: React.ReactNode;
}) {
  const [store] = useState(() => {
    let storage: Storage | undefined;
    try {
      storage = window.sessionStorage;
    } catch {
      /* Retain state in memory only. */
    }
    return createToolSession(user, storage);
  });
  useEffect(() => {
    store.activate();
    const timer = setInterval(() => store.expire(), 60000);
    const check = () => store.expire();
    window.addEventListener("focus", check);
    return () => {
      store.deactivate();
      clearInterval(timer);
      window.removeEventListener("focus", check);
    };
  }, [store]);
  return <Context.Provider value={store}>{children}</Context.Provider>;
}

export function useToolSession() {
  const store = useContext(Context);
  if (!store) throw new Error("Tool session provider is required");
  return store;
}

export function useToolState<T>(
  tool: string,
  field: string,
  initial: T,
  memoryOnly = false,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const store = useToolSession();
  const initialRef = useRef(initial);
  const currentEpoch = store.epoch(tool);
  const value = useSyncExternalStore(
    store.subscribe,
    () => store.get(tool, field, initialRef.current, memoryOnly),
    () => initialRef.current,
  );
  const setValue = useCallback(
    (update: React.SetStateAction<T>) =>
      store.set(
        tool,
        field,
        initialRef.current,
        update,
        currentEpoch,
        memoryOnly,
      ),
    [store, tool, field, currentEpoch, memoryOnly],
  );
  return [value, setValue];
}

export function ToolStateBoundary({ children }: { children: React.ReactNode }) {
  const store = useToolSession();
  const path = usePathname();
  const tool = toolForPath(path) || "other";
  const epoch = useSyncExternalStore(
    store.subscribe,
    () => store.epoch(tool),
    () => "0:0",
  );
  return (
    <div key={`${tool}:${epoch}`} className="min-h-full">
      {children}
    </div>
  );
}
