export const TOOL_SESSION_TTL = 2 * 60 * 60 * 1000;
export const TOOL_SESSION_PREFIX = "sophianet:tools:v1:";

export function toolForPath(path: string) {
  if (path.startsWith("/chatbot/t/")) return path.split("/")[3];
  if (path.startsWith("/chatbot/c/")) return `chat:${path.split("/")[3]}`;
  return path === "/chatbot" ? "chat-draft" : null;
}

export function createToolSession(
  user: string,
  storage?: Storage,
  now = Date.now,
) {
  const storageKey = TOOL_SESSION_PREFIX + encodeURIComponent(user);
  const values = new Map<string, unknown>();
  const memoryOnly = new Set<string>();
  const listeners = new Set<() => void>();
  const epochs = new Map<string, number>();
  let active = true;
  let globalEpoch = 0;
  let touched = now();
  let volatile = false;
  const emit = () => listeners.forEach((listener) => listener());
  try {
    if (storage) {
      for (let index = storage.length - 1; index >= 0; index--) {
        const key = storage.key(index);
        if (key?.startsWith(TOOL_SESSION_PREFIX) && key !== storageKey)
          storage.removeItem(key);
      }
      const saved = JSON.parse(storage.getItem(storageKey) || "null");
      if (
        saved?.version === 1 &&
        typeof saved.touched === "number" &&
        now() - saved.touched < TOOL_SESSION_TTL &&
        saved.values &&
        typeof saved.values === "object" &&
        !Array.isArray(saved.values)
      ) {
        Object.entries(saved.values).forEach(([key, value]) =>
          values.set(key, value),
        );
        touched = saved.touched;
      } else storage.removeItem(storageKey);
    }
  } catch {
    try {
      storage?.removeItem(storageKey);
    } catch {
      /* Storage can be disabled. */
    }
  }

  const persist = () => {
    if (!storage) {
      volatile = true;
      return;
    }
    try {
      const json = JSON.stringify({
        version: 1,
        touched,
        values: Object.fromEntries(
          [...values].filter(([key]) => !memoryOnly.has(key)),
        ),
      });
      if (json.length > 2_000_000)
        throw new Error("Session snapshot exceeds budget");
      storage.setItem(storageKey, json);
      volatile = false;
    } catch {
      volatile = true;
      try {
        storage.removeItem(storageKey);
      } catch {
        /* Keep working in memory. */
      }
    }
  };
  const epoch = (tool: string) => `${globalEpoch}:${epochs.get(tool) || 0}`;
  return {
    activate() {
      active = true;
    },
    deactivate() {
      active = false;
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    get<T>(tool: string, field: string, initial: T, transient = false): T {
      const key = `${tool}/${field}`;
      if (transient) memoryOnly.add(key);
      if (!values.has(key)) values.set(key, initial);
      return values.get(key) as T;
    },
    set<T>(
      tool: string,
      field: string,
      initial: T,
      update: T | ((previous: T) => T),
      expectedEpoch: string,
      transient = false,
    ) {
      if (!active || epoch(tool) !== expectedEpoch) return;
      const key = `${tool}/${field}`;
      if (transient) memoryOnly.add(key);
      const previous = values.has(key) ? (values.get(key) as T) : initial;
      values.set(
        key,
        typeof update === "function"
          ? (update as (previous: T) => T)(previous)
          : update,
      );
      touched = now();
      persist();
      emit();
    },
    epoch,
    reset(tool?: string) {
      if (tool) {
        [...values.keys()]
          .filter((key) => key.startsWith(`${tool}/`))
          .forEach((key) => {
            values.delete(key);
            memoryOnly.delete(key);
          });
        epochs.set(tool, (epochs.get(tool) || 0) + 1);
      } else {
        values.clear();
        memoryOnly.clear();
        globalEpoch++;
      }
      touched = now();
      persist();
      emit();
    },
    expire() {
      if (now() - touched >= TOOL_SESSION_TTL) this.reset();
    },
    isVolatile: () => volatile,
    dispose() {
      values.clear();
      listeners.clear();
      try {
        storage?.removeItem(storageKey);
      } catch {
        /* No storage available. */
      }
    },
  };
}
