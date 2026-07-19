import { promises as fs } from "node:fs";
import path from "node:path";
import { defaultState } from "./defaults";
import type { Repository } from "./repository";
import type {
  ActivationRecord,
  AppState,
  ConnectionState,
  SchedulerState,
  Settings,
} from "./types";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "state.json");
const MAX_HISTORY = 200;

/**
 * A small file-backed repository. Writes are serialized through a single
 * in-process promise chain so concurrent requests never interleave a
 * read-modify-write. Suitable for a single tenant tool; see repository.ts
 * for how to replace it with a database.
 */
class FileStore implements Repository {
  private queue: Promise<unknown> = Promise.resolve();

  private async load(): Promise<AppState> {
    try {
      const raw = await fs.readFile(DATA_FILE, "utf8");
      const parsed = JSON.parse(raw) as Partial<AppState>;
      const base = defaultState();
      return {
        settings: { ...base.settings, ...parsed.settings },
        connection: { ...base.connection, ...parsed.connection },
        scheduler: { ...base.scheduler, ...parsed.scheduler },
        activations: parsed.activations ?? base.activations,
      };
    } catch {
      return defaultState();
    }
  }

  private async persist(state: AppState): Promise<void> {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const tmp = `${DATA_FILE}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(state, null, 2), "utf8");
    await fs.rename(tmp, DATA_FILE);
  }

  /** Run a mutation atomically against the persisted state. */
  private mutate<T>(fn: (state: AppState) => T): Promise<T> {
    const next = this.queue.then(async () => {
      const state = await this.load();
      const result = fn(state);
      await this.persist(state);
      return result;
    });
    // Keep the chain alive even if a mutation rejects.
    this.queue = next.catch(() => undefined);
    return next;
  }

  read(): Promise<AppState> {
    return this.queue.then(() => this.load());
  }

  updateSettings(patch: Partial<Settings>): Promise<Settings> {
    return this.mutate((state) => {
      state.settings = { ...state.settings, ...patch };
      return state.settings;
    });
  }

  setConnection(patch: Partial<ConnectionState>): Promise<ConnectionState> {
    return this.mutate((state) => {
      state.connection = { ...state.connection, ...patch };
      return state.connection;
    });
  }

  setScheduler(patch: Partial<SchedulerState>): Promise<SchedulerState> {
    return this.mutate((state) => {
      state.scheduler = { ...state.scheduler, ...patch };
      return state.scheduler;
    });
  }

  addActivation(record: ActivationRecord): Promise<ActivationRecord> {
    return this.mutate((state) => {
      state.activations.unshift(record);
      if (state.activations.length > MAX_HISTORY) {
        state.activations.length = MAX_HISTORY;
      }
      return record;
    });
  }

  listActivations(limit = 50): Promise<ActivationRecord[]> {
    return this.read().then((state) => state.activations.slice(0, limit));
  }
}

/**
 * Reuse one store per server process. Stashed on globalThis so Next.js hot
 * reloads in development do not spawn competing writers.
 */
const globalForStore = globalThis as unknown as { __lazyStore?: FileStore };

export const store: Repository =
  globalForStore.__lazyStore ?? (globalForStore.__lazyStore = new FileStore());
