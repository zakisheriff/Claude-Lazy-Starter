/**
 * The script of the workflow film. Every function here is pure in the film
 * clock t (seconds), so the 3D scene, the laptop screen, the captions, and the
 * overlays always agree about what is happening.
 */

export const FILM_LENGTH = 37;

export const captions = [
  { from: 0, to: 4.5, text: "11:00 pm. Deep in a project, he hits his usage limit." },
  { from: 4.5, to: 7, text: "Nothing left to do but sleep. The limit resets at 3:00 am." },
  { from: 7, to: 10.4, text: "3:00 am. The limit resets, and nobody is awake to use it." },
  { from: 10.4, to: 14.3, text: "Except Claude. At 3:07 it sends one word: Hi." },
  { from: 14.3, to: 17.4, text: "A fresh five hour window starts while he sleeps." },
  { from: 17.4, to: 20.6, text: "The clock runs down in the dark, not during his day." },
  { from: 20.6, to: 23.2, text: "7:00 am. He wakes up to an hour already waiting." },
  { from: 23.2, to: 28, text: "He works flat out and burns through 90 percent of it." },
  { from: 28, to: 31.5, text: "8:07 am. It resets: a fresh five hours, back to zero." },
  { from: 31.5, to: 37, text: "Two windows before lunch, and he never woke up early." },
] as const;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const ease = (x: number) => {
  const k = clamp01(x);
  return k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
};
export const range = (t: number, a: number, b: number) =>
  clamp01((t - a) / (b - a));
/** Rises over [a, b], holds, then falls over [c, d]. */
const window4 = (t: number, a: number, b: number, c: number, d: number) =>
  ease(range(t, a, b)) * (1 - ease(range(t, c, d)));

const H307 = 27 + 7 / 60; // 3:07 am, as hours past the previous midnight
const H807 = H307 + 5; // 8:07 am

/** Wall clock time in hours (values past 24 are the next morning). */
export function clockHours(t: number): number {
  const keys: [number, number][] = [
    [0, 23],
    [4.5, 23.25],
    [7, 23.7],
    [10.4, 27],
    [11.4, H307],
    [14.5, H307 + 0.02],
    [17.4, 28],
    [20.6, 31],
    [28, H807],
    [37, H807 + 0.6],
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
  return ease(range(clockHours(t), 29.3, 31.4));
}

/* Moments --------------------------------------------------------------- */

export const WINDOW_ONE_AT = 14.3;
export const WINDOW_TWO_AT = 28;
export const LIMIT_AT = 3;

/** The "+5 hours" pops, one per window started. */
export const pops = [
  { at: WINDOW_ONE_AT, text: "+5 hours", sub: "Window started at 3:07 am" },
  { at: WINDOW_TWO_AT, text: "+5 hours", sub: "Fresh window at 8:07 am" },
] as const;

export function hoursUnlocked(t: number): number {
  if (t >= WINDOW_TWO_AT) return 10;
  if (t >= WINDOW_ONE_AT) return 5;
  return 0;
}

export function firstWindow(t: number): number {
  if (t < WINDOW_ONE_AT) return 0;
  return clamp01((clockHours(t) - H307) / 5);
}

export function secondWindow(t: number): number {
  if (t < WINDOW_TWO_AT) return 0;
  return clamp01((clockHours(t) - H807) / 5);
}

/** Hours left in whichever window is open right now, for the laptop pill. */
export function windowLeft(t: number): number {
  const h = clockHours(t);
  if (t >= WINDOW_TWO_AT) return Math.max(0, H807 + 5 - h);
  return Math.max(0, H807 - h);
}

/* The person ------------------------------------------------------------- */

/** 0 awake, 1 fast asleep leaning back in the chair. */
export function asleep(t: number): number {
  return window4(t, 4.6, 6.2, 20.7, 21.6);
}

/** A big morning stretch, 0 to 1 and back. */
export function stretch(t: number): number {
  return window4(t, 21.4, 22.1, 22.7, 23.3);
}

/** Arms up and grinning when the fresh window lands. */
export function celebrate(t: number): number {
  return window4(t, 28.1, 28.5, 30.2, 30.8);
}

/** How much of the current window he has used, 0 to 1. He works the first
 *  window up to 90 percent, then it resets to zero at 8:07. */
export function usage(t: number): number {
  if (t < 23.4) return 0;
  if (t < WINDOW_TWO_AT) return 0.9 * ease(range(t, 23.4, 27.7));
  return 0.08 * range(t, 30.8, 37);
}

/** How hard he is typing, 0 to 1. */
export function typing(t: number): number {
  return (
    (1 - ease(range(t, 3.2, 3.8))) +
    window4(t, 23.2, 23.6, 27.9, 28.1) +
    window4(t, 30.8, 31.2, 36.4, 37)
  );
}

/* The Claude bot --------------------------------------------------------- */

/** 0 at home on the desk corner, 1 standing on the laptop keyboard. */
export function botTravel(t: number): number {
  return window4(t, 10.5, 11.6, 16.2, 17.3);
}

/** Stomping on the keys while it types the command. */
export function botStomp(t: number): number {
  return t > 12.1 && t < 13.5 ? 1 : 0;
}

/** True while the bot is facing back toward its corner. */
export function botReturning(t: number): boolean {
  return t > 16.2;
}

/** The bot cheers when each window starts. */
export function botCheer(t: number): number {
  return Math.max(window4(t, 14.3, 14.5, 15.2, 15.6), window4(t, 28, 28.2, 29, 29.4));
}

/* Camera ----------------------------------------------------------------- */

/** 0 for the wide room shot, 1 for the over the shoulder screen shot. */
export function screenShot(t: number): number {
  return Math.max(window4(t, 10.4, 11.4, 16.0, 17.0), window4(t, 23.3, 24.1, 27.7, 28.3));
}

/* The laptop screen ------------------------------------------------------ */

export type ScreenMode = "chat" | "off" | "terminal" | "locked" | "work";

export function screenMode(t: number): ScreenMode {
  if (t < 5.6) return "chat";
  if (t < 11.6) return "off";
  if (t < 16.8) return "terminal";
  if (t < 21.4) return "locked";
  return "work";
}

/** Brightness of the screen, so it fades rather than snapping off. */
export function screenBrightness(t: number): number {
  if (t < 5.6) return 1 - 0.75 * ease(range(t, 4.8, 5.6));
  if (t < 11.6) return 0.25 * (1 - ease(range(t, 5.6, 6.4))) + ease(range(t, 11.2, 11.6));
  if (t >= 16.8 && t < 21.4) return 0.55;
  return 1;
}

export const nightChat = {
  prompt: "Help me ship the new onboarding flow tonight.",
  reply: [
    "Sure. Here is the plan:",
    "1. Split the signup form into three short steps",
    "2. Save progress so nobody loses their answers",
    "3. Add a welcome screen with a clear first task",
  ],
  replyFrom: 0.3,
  replyTo: 2.8,
};

export const terminal = [
  { at: 11.8, text: "lazy-start  scheduled run at 3:07 am", tone: "muted", typed: false },
  { at: 12.2, text: '$ claude -p "Hi" --model haiku', tone: "command", typed: true },
  { at: 13.6, text: "Hi! How can I help you today?", tone: "reply", typed: false },
  { at: 14.3, text: "Window started. Runs until 8:07 am.", tone: "ok", typed: false },
] as const;

/** The morning session: a fast run of tasks, newest last. */
export const morningWork = [
  { at: 23.5, prompt: "Finish the welcome screen.", reply: "Done. Greeting, first task, skip button." },
  { at: 24.3, prompt: "Now write the tests.", reply: "Added 24 tests. All passing." },
  { at: 25.1, prompt: "Fix the slow signup query.", reply: "Added an index. 40ms down to 3ms." },
  { at: 25.9, prompt: "Add dark mode.", reply: "Done, and it follows the system setting." },
  { at: 26.7, prompt: "Review the whole flow.", reply: "Two small fixes applied. Ready to ship." },
  { at: 31.2, prompt: "Ship it, then start the billing page.", reply: "Shipped. Sketching the billing page now." },
] as const;
