/**
 * The script of the workflow film. Pure functions of the film clock t (in
 * seconds), so the 3D scene, the captions, and the overlays all stay in sync.
 */

export const FILM_LENGTH = 27;

export const captions = [
  { from: 0, to: 4, text: "11:00 pm. You hit your limit and call it a night." },
  { from: 4, to: 8, text: "3:00 am. Your window ends. Nobody is awake to start the next one." },
  { from: 8, to: 12.5, text: "Lazy Starter is. At 3:07 it sends a single Hi." },
  { from: 12.5, to: 16.5, text: "A fresh five hour window starts in the dark." },
  { from: 16.5, to: 21.5, text: "7:00 am. You wake up to an hour already waiting." },
  { from: 21.5, to: 27, text: "Use it, and at 8:07 a full new window opens right behind it." },
] as const;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const ease = (x: number) => {
  const k = clamp01(x);
  return k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
};
export const range = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

/** Wall clock time in hours since midnight (may exceed 24 before wrapping). */
export function clockHours(t: number): number {
  const keys: [number, number][] = [
    [0, 23],
    [4, 23.5],
    [7, 27], // 3:00 am the next day
    [12, 27 + 7 / 60], // 3:07 am
    [16.5, 29.5],
    [20, 31], // 7:00 am
    [27, 32 + 20 / 60],
  ];
  for (let i = 1; i < keys.length; i++) {
    const [t1, h1] = keys[i];
    const [t0, h0] = keys[i - 1];
    if (t <= t1) return lerp(h0, h1, ease((t - t0) / (t1 - t0)));
  }
  return keys[keys.length - 1][1];
}

export function formatClock(hours: number): string {
  const h24 = ((hours % 24) + 24) % 24;
  const h = Math.floor(h24);
  const m = Math.floor((h24 - h) * 60);
  const suffix = h < 12 ? "am" : "pm";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${suffix}`;
}

/** 0 at deep night, 1 at full morning light. */
export function daylight(t: number): number {
  return ease(range(clockHours(t), 29.2, 31.6));
}

/** How far the sleeper has sat up, 0 asleep to 1 awake. */
export function awake(t: number): number {
  return ease(range(t, 17, 18.6));
}

const START = 27 + 7 / 60; // 3:07 am
const WINDOW = 5;

/** Fraction of the first (started for you) window that has elapsed. */
export function firstWindow(t: number): number {
  if (t < 11) return 0;
  return clamp01((clockHours(t) - START) / WINDOW);
}

/** Fraction of the second (fresh) window that has elapsed. */
export function secondWindow(t: number): number {
  return clamp01((clockHours(t) - (START + WINDOW)) / WINDOW);
}

export const terminalLines = [
  { at: 8.6, text: "lazy-start  scheduled run 3:07 am", tone: "muted" },
  { at: 9.4, text: '$ claude -p "Hi" --model haiku', tone: "command" },
  { at: 10.6, text: "Hi! How can I help you today?", tone: "reply" },
  { at: 11.2, text: "Window started. Runs until 8:07 am.", tone: "ok" },
  { at: 23.4, text: "8:07 am  fresh five hour window open", tone: "ok" },
] as const;

/** Bot position along its hop to the laptop and back. 0 home, 1 at laptop. */
export function botTravel(t: number): number {
  if (t < 8) return 0;
  if (t < 9.2) return ease(range(t, 8, 9.2));
  if (t < 12.6) return 1;
  return 1 - ease(range(t, 12.6, 13.8));
}

/** Small typing bounce while the bot sends the message. */
export function botTyping(t: number): number {
  if (t < 9.4 || t > 10.6) return 0;
  return Math.abs(Math.sin((t - 9.4) * 18)) * 0.05;
}

/** Laptop screen glow, 0 dark to 1 lit. */
export function screenGlow(t: number): number {
  if (t < 9) return 0.08;
  if (t < 12.8) return 0.08 + 0.92 * ease(range(t, 9, 9.6));
  return 0.08 + 0.92 * (1 - ease(range(t, 12.8, 14)));
}
