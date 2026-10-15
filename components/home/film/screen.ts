import {
  LIMIT_AT,
  clockHours,
  firstWindow,
  formatClock,
  morningWork,
  nightChat,
  range,
  screenMode,
  terminal,
  usage,
  WINDOW_TWO_AT,
} from "./story";

/**
 * Draws the laptop screen for a moment of the film onto a 2D canvas, which the
 * scene uses as a texture. The screen tells the real story: the chat that hits
 * the limit, the terminal where the Hi is sent, and the morning session.
 */

export const SCREEN_W = 1024;
export const SCREEN_H = 640;

type Fonts = { sans: string; mono: string; serif: string };

const C = {
  bg: "#262624",
  panel: "#30302e",
  line: "#3d3d3a",
  text: "#f0eee6",
  soft: "#b0aea5",
  muted: "#87867f",
  clay: "#d97757",
  clayWash: "#4a2f24",
  green: "#b5c99a",
  term: "#141413",
};

function rounded(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Reveal a list of lines character by character across [from, to]. */
function revealLines(lines: readonly string[], t: number, from: number, to: number) {
  const total = lines.reduce((n, l) => n + l.length, 0);
  let budget = Math.floor(range(t, from, to) * total);
  return lines.map((l) => {
    const shown = l.slice(0, Math.max(0, budget));
    budget -= l.length;
    return shown;
  });
}

function header(ctx: CanvasRenderingContext2D, f: Fonts, title: string, right?: string) {
  ctx.fillStyle = "#1f1e1d";
  ctx.fillRect(0, 0, SCREEN_W, 72);
  ctx.fillStyle = C.line;
  ctx.fillRect(0, 72, SCREEN_W, 2);
  ctx.fillStyle = C.text;
  ctx.font = `500 30px ${f.serif}`;
  ctx.textBaseline = "middle";
  ctx.fillText(title, 36, 38);
  if (right) {
    ctx.font = `500 22px ${f.sans}`;
    const w = ctx.measureText(right).width + 36;
    rounded(ctx, SCREEN_W - w - 30, 18, w, 40, 20);
    ctx.fillStyle = C.clayWash;
    ctx.fill();
    ctx.fillStyle = "#ffd2bd";
    ctx.fillText(right, SCREEN_W - w - 12, 39);
  }
}

function userBubble(ctx: CanvasRenderingContext2D, f: Fonts, text: string, y: number) {
  ctx.font = `400 26px ${f.sans}`;
  const w = ctx.measureText(text).width + 44;
  rounded(ctx, SCREEN_W - w - 36, y, w, 58, 16);
  ctx.fillStyle = C.panel;
  ctx.fill();
  ctx.fillStyle = C.text;
  ctx.textBaseline = "middle";
  ctx.fillText(text, SCREEN_W - w - 14, y + 30);
}

function replyLines(
  ctx: CanvasRenderingContext2D,
  f: Fonts,
  lines: string[],
  y: number,
  caret: boolean,
) {
  ctx.font = `400 27px ${f.serif}`;
  ctx.fillStyle = C.text;
  ctx.textBaseline = "top";
  let last = { x: 52, y };
  lines.forEach((l, i) => {
    if (!l) return;
    ctx.fillText(l, 52, y + i * 40);
    last = { x: 52 + ctx.measureText(l).width, y: y + i * 40 };
  });
  // Claude's mark: a small clay spark before the reply.
  ctx.fillStyle = C.clay;
  ctx.font = `600 26px ${f.sans}`;
  ctx.fillText("*", 22, y + 2);
  if (caret) {
    ctx.fillStyle = C.clay;
    ctx.fillRect(last.x + 6, last.y + 4, 12, 26);
  }
}

function composer(ctx: CanvasRenderingContext2D, f: Fonts, text = "Reply to Claude") {
  rounded(ctx, 36, SCREEN_H - 104, SCREEN_W - 72, 70, 18);
  ctx.fillStyle = C.panel;
  ctx.fill();
  ctx.strokeStyle = C.line;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = C.muted;
  ctx.font = `400 25px ${f.sans}`;
  ctx.textBaseline = "middle";
  ctx.fillText(text, 64, SCREEN_H - 68);
}

export function drawScreen(
  ctx: CanvasRenderingContext2D,
  t: number,
  f: Fonts,
  wall: number,
) {
  const mode = screenMode(t);
  ctx.clearRect(0, 0, SCREEN_W, SCREEN_H);

  if (mode === "chat") {
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
    header(ctx, f, "Onboarding flow");
    userBubble(ctx, f, nightChat.prompt, 104);
    const lines = revealLines(nightChat.reply, t, nightChat.replyFrom, nightChat.replyTo);
    replyLines(ctx, f, lines, 196, t < nightChat.replyTo);
    if (t >= LIMIT_AT) {
      rounded(ctx, 36, SCREEN_H - 132, SCREEN_W - 72, 98, 18);
      ctx.fillStyle = C.clayWash;
      ctx.fill();
      ctx.strokeStyle = C.clay;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#ffd2bd";
      ctx.font = `600 27px ${f.sans}`;
      ctx.fillText("Usage limit reached", 66, SCREEN_H - 100);
      ctx.fillStyle = C.soft;
      ctx.font = `400 23px ${f.sans}`;
      ctx.fillText("Your limit resets at 3:00 am", 66, SCREEN_H - 64);
    } else {
      composer(ctx, f);
    }
    return;
  }

  if (mode === "off") {
    ctx.fillStyle = "#0b0b0b";
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
    ctx.fillStyle = "#3a3936";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `300 96px ${f.sans}`;
    ctx.fillText(formatClock(clockHours(t)), SCREEN_W / 2, SCREEN_H / 2);
    ctx.textAlign = "left";
    return;
  }

  if (mode === "terminal") {
    ctx.fillStyle = C.term;
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
    ctx.fillStyle = "#1f1e1d";
    ctx.fillRect(0, 0, SCREEN_W, 64);
    ctx.fillStyle = "#788c5d";
    ctx.beginPath();
    ctx.arc(40, 32, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.soft;
    ctx.font = `500 24px ${f.sans}`;
    ctx.textBaseline = "middle";
    ctx.fillText("GitHub Actions, Lazy start", 62, 33);

    ctx.textBaseline = "top";
    ctx.font = `400 29px ${f.mono}`;
    let y = 104;
    let caret: { x: number; y: number } | null = null;
    for (const line of terminal) {
      if (t < line.at) break;
      let text: string = line.text;
      if (line.typed) {
        const n = Math.floor((t - line.at) * 24);
        text = line.text.slice(0, n);
        if (n < line.text.length) {
          caret = { x: 40 + ctx.measureText(text).width, y };
        }
      }
      ctx.fillStyle =
        line.tone === "command"
          ? C.text
          : line.tone === "reply"
            ? "#e3a58d"
            : line.tone === "ok"
              ? C.green
              : C.muted;
      ctx.fillText(text, 40, y);
      y += 54;
    }
    if (!caret) caret = { x: 40, y };
    if (Math.sin(wall * 9) > -0.2) {
      ctx.fillStyle = C.text;
      ctx.fillRect(caret.x + 4, caret.y + 2, 16, 32);
    }
    return;
  }

  if (mode === "locked") {
    ctx.fillStyle = "#1a1918";
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = C.text;
    ctx.font = `300 110px ${f.sans}`;
    ctx.fillText(formatClock(clockHours(t)), SCREEN_W / 2, 230);
    ctx.fillStyle = C.soft;
    ctx.font = `400 30px ${f.sans}`;
    ctx.fillText("Claude window running until 8:07 am", SCREEN_W / 2, 350);
    ctx.textAlign = "left";
    rounded(ctx, 212, 410, 600, 16, 8);
    ctx.fillStyle = C.line;
    ctx.fill();
    rounded(ctx, 212, 410, Math.max(16, 600 * firstWindow(t)), 16, 8);
    ctx.fillStyle = C.clay;
    ctx.fill();
    return;
  }

  // Morning work session: a usage meter in the header and a fast run of
  // tasks. At 8:07 the meter resets to zero with a fresh window.
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  const used = usage(t);
  const fresh = t >= WINDOW_TWO_AT;
  header(
    ctx,
    f,
    "Onboarding flow",
    fresh ? `New window, ${Math.round(used * 100)}% used` : `${Math.round(used * 100)}% used`,
  );
  // Usage bar under the header.
  ctx.fillStyle = C.line;
  ctx.fillRect(0, 74, SCREEN_W, 8);
  ctx.fillStyle = used > 0.75 ? "#e0866a" : C.clay;
  ctx.fillRect(0, 74, SCREEN_W * used, 8);

  if (t < 22.4) {
    composer(ctx, f, "Good morning");
    return;
  }

  if (fresh && t < 30.9) {
    // The reset moment.
    rounded(ctx, 112, 170, SCREEN_W - 224, 250, 24);
    ctx.fillStyle = C.clayWash;
    ctx.fill();
    ctx.strokeStyle = C.clay;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffd2bd";
    ctx.font = `500 64px ${f.serif}`;
    ctx.fillText("+5 hours", SCREEN_W / 2, 250);
    ctx.fillStyle = C.text;
    ctx.font = `400 28px ${f.sans}`;
    ctx.fillText("Fresh window. Usage back to 0%.", SCREEN_W / 2, 330);
    ctx.textAlign = "left";
    composer(ctx, f);
    return;
  }

  const shown = morningWork.filter((m) => t >= m.at).slice(-3);
  let y = 104;
  for (const m of shown) {
    userBubble(ctx, f, m.prompt, y);
    const reveal = revealLines([m.reply], t, m.at + 0.15, m.at + 0.6);
    replyLines(ctx, f, reveal, y + 70, t < m.at + 0.6);
    y += 128;
  }
  composer(ctx, f);
}
