/**
 * Next.js instrumentation hook. Runs once when the server process starts.
 * We use it to bring up the background activation scheduler on the Node
 * runtime only.
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startScheduler } = await import("@/lib/scheduler/scheduler");
    startScheduler();
  }
}
