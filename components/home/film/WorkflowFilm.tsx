"use client";

import { useEffect, useRef, useState } from "react";
import type * as THREE_NS from "three";
import { prefersReducedMotion } from "@/lib/utils/motion";
import { SCREEN_H, SCREEN_W, drawScreen } from "./screen";
import {
  FILM_LENGTH,
  asleep,
  botCheer,
  botReturning,
  botStomp,
  botTravel,
  captions,
  celebrate,
  clockHours,
  daylight,
  formatClock,
  hoursUnlocked,
  pops,
  screenBrightness,
  screenShot,
  stretch,
  typing,
  usage,
  WINDOW_TWO_AT,
} from "./story";

type Three = typeof THREE_NS;

/**
 * The workflow film. A low poly room drawn in code with three.js: a developer
 * at his laptop, a small Claude bot on the desk, a window that turns from
 * night to morning, and a laptop screen that shows the real story (the usage
 * limit, the 3:07 am Hi, the morning session). HTML overlays carry captions,
 * the clock, the hours unlocked, and the usage bars, all driven by one film
 * clock from story.ts.
 */
export function WorkflowFilm() {
  const mountRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);
  const unlockedRef = useRef<HTMLSpanElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const popTextRef = useRef<HTMLParagraphElement>(null);
  const popSubRef = useRef<HTMLParagraphElement>(null);
  const usageBarRef = useRef<HTMLDivElement>(null);
  const usageLabelRef = useRef<HTMLParagraphElement>(null);
  const usagePctRef = useRef<HTMLParagraphElement>(null);
  const zRef = useRef<HTMLDivElement>(null);
  const scrubRef = useRef<HTMLInputElement>(null);

  const [playing, setPlaying] = useState(true);
  const [ready, setReady] = useState(false);
  const playingRef = useRef(true);
  const timeRef = useRef(0);
  const seekRef = useRef<number | null>(null);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;
    let raf = 0;
    let cleanup = () => {};
    let lastPop = -1;

    if (prefersReducedMotion()) {
      playingRef.current = false;
      setPlaying(false);
      timeRef.current = 25;
    }

    void import("three").then((THREE: Three) => {
      if (disposed) return;
      const built = buildScene(THREE, mount);
      setReady(true);

      let visible = true;
      const io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
        },
        { threshold: 0.05 },
      );
      io.observe(mount);

      let last = performance.now();
      let rendered = false;
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        const dt = Math.min(0.1, (now - last) / 1000);
        last = now;
        if (seekRef.current !== null) {
          timeRef.current = seekRef.current;
          seekRef.current = null;
        } else if (playingRef.current && visible) {
          timeRef.current = (timeRef.current + dt) % FILM_LENGTH;
        } else if (!visible && rendered) {
          return;
        }
        rendered = true;
        const t = timeRef.current;
        built.update(t, now / 1000);
        updateOverlays(t, built.headScreen());
      };
      raf = requestAnimationFrame(loop);

      cleanup = () => {
        io.disconnect();
        built.dispose();
      };
    });

    function updateOverlays(t: number, head: { x: number; y: number } | null) {
      const cap = captions.find((c) => t >= c.from && t < c.to) ?? captions[0];
      if (captionRef.current && captionRef.current.textContent !== cap.text) {
        captionRef.current.textContent = cap.text;
      }
      if (clockRef.current) clockRef.current.textContent = formatClock(clockHours(t));
      if (unlockedRef.current) {
        const text = `${hoursUnlocked(t)} hours`;
        if (unlockedRef.current.textContent !== text) unlockedRef.current.textContent = text;
      }
      const used = usage(t);
      if (usageBarRef.current) usageBarRef.current.style.width = `${used * 100}%`;
      if (usagePctRef.current) usagePctRef.current.textContent = `${Math.round(used * 100)}%`;
      if (usageLabelRef.current) {
        const label =
          t >= WINDOW_TWO_AT
            ? "Usage, fresh window from 8:07 am"
            : t >= 14.3
              ? "Usage, window from 3:07 am"
              : "Usage";
        if (usageLabelRef.current.textContent !== label) usageLabelRef.current.textContent = label;
      }

      // The "+5 hours" pop, restarted each time a window starts.
      const current = pops.findIndex((p) => t >= p.at && t < p.at + 2.6);
      if (popRef.current) {
        if (current !== -1 && current !== lastPop) {
          if (popTextRef.current) popTextRef.current.textContent = pops[current].text;
          if (popSubRef.current) popSubRef.current.textContent = pops[current].sub;
          popRef.current.classList.remove("film-pop");
          void popRef.current.offsetWidth;
          popRef.current.classList.add("film-pop");
        }
        if (current === -1) popRef.current.classList.remove("film-pop");
      }
      lastPop = current;

      if (zRef.current) {
        const z = asleep(t) * (1 - screenShot(t));
        zRef.current.style.opacity = head ? String(z) : "0";
        if (head) {
          zRef.current.style.left = `${head.x * 100}%`;
          zRef.current.style.top = `${head.y * 100}%`;
        }
      }
      if (scrubRef.current && document.activeElement !== scrubRef.current) {
        scrubRef.current.value = String(t);
      }
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanup();
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-[#141322] text-[#f2ede4]">
      <div
        ref={mountRef}
        className="relative aspect-[4/5] w-full sm:aspect-[16/10] lg:aspect-[16/9]"
        role="img"
        aria-label="Animation: a developer hits his Claude usage limit at 11 pm and falls asleep. At 3:07 am a small Claude bot types a Hi on his laptop, starting a five hour window. He wakes at 7 am to an hour waiting, works, and at 8:07 am a fresh five hour window opens."
      >
        {!ready ? (
          <div className="absolute inset-0 flex items-center justify-center text-[15px] text-[#b0aea5]">
            Setting the scene
          </div>
        ) : null}

        <div
          ref={zRef}
          aria-hidden
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full font-serif text-[#f2ede4]"
          style={{ opacity: 0 }}
        >
          <span className="film-z block text-[22px]">z</span>
          <span className="film-z film-z-2 block translate-x-4 text-[16px]">z</span>
          <span className="film-z film-z-3 block translate-x-7 text-[12px]">z</span>
        </div>

        <div className="pointer-events-none absolute top-4 left-4 rounded-[6px] bg-black/40 px-3 py-1.5 font-mono text-[14px] backdrop-blur-sm sm:top-6 sm:left-6">
          <span ref={clockRef}>11:00 pm</span>
        </div>

        <div className="pointer-events-none absolute top-4 right-4 rounded-[6px] bg-black/40 px-3 py-1.5 text-right backdrop-blur-sm sm:top-6 sm:right-6">
          <p className="text-[11px] text-[#b0aea5] sm:text-[12px]">Claude time unlocked</p>
          <p className="font-mono text-[15px] sm:text-[17px]">
            <span ref={unlockedRef}>0 hours</span>
          </p>
        </div>

        <div
          ref={popRef}
          aria-hidden
          className="pointer-events-none absolute top-[24%] left-1/2 -translate-x-1/2 text-center opacity-0 sm:top-[7%]"
        >
          <p
            ref={popTextRef}
            className="font-serif text-[44px] leading-none text-[#ffb08f] [text-shadow:0_2px_24px_rgba(217,119,87,0.6)] sm:text-[64px]"
          >
            +5 hours
          </p>
          <p ref={popSubRef} className="mt-2 text-[13px] text-[#f2ede4] sm:text-[15px]" />
        </div>

        <p
          ref={captionRef}
          aria-live="polite"
          className="pointer-events-none absolute right-6 bottom-[96px] left-6 text-center text-[17px] font-medium text-balance [text-shadow:0_1px_12px_rgba(0,0,0,0.75)] sm:bottom-[104px] sm:text-[22px]"
        >
          {captions[0].text}
        </p>

        <div className="pointer-events-none absolute right-4 bottom-4 left-4 sm:right-6 sm:bottom-6 sm:left-6">
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-[12px] text-[#d1cfc5] sm:text-[13px]">
            <p ref={usageLabelRef}>Usage</p>
            <p ref={usagePctRef} className="font-mono">0%</p>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/12">
            <div ref={usageBarRef} className="h-full w-0 rounded-full bg-[#d97757]" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 border-t border-white/10 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="w-14 shrink-0 cursor-pointer text-left text-[14px] text-[#d1cfc5] transition-colors hover:text-white"
        >
          {playing ? "Pause" : "Play"}
        </button>
        <input
          ref={scrubRef}
          type="range"
          min={0}
          max={FILM_LENGTH}
          step={0.01}
          defaultValue={0}
          aria-label="Scrub through the night"
          onChange={(e) => {
            seekRef.current = Number(e.target.value);
          }}
          className="film-scrub h-1 w-full cursor-pointer"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Scene                                                                     */
/* ------------------------------------------------------------------------ */

function cssFont(name: string, fallback: string): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v ? `${v}, ${fallback}` : fallback;
}

function buildScene(THREE: Three, mount: HTMLDivElement) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.localClippingEnabled = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  Object.assign(renderer.domElement.style, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
  });
  mount.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#141322");
  const camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.05, 50);

  const geos: THREE_NS.BufferGeometry[] = [];
  const mats: THREE_NS.Material[] = [];
  const keep = <G extends THREE_NS.BufferGeometry>(g: G) => (geos.push(g), g);
  const mat = (color: string, extra: THREE_NS.MeshStandardMaterialParameters = {}) => {
    const m = new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.82, ...extra });
    mats.push(m);
    return m;
  };
  const mesh = (g: THREE_NS.BufferGeometry, m: THREE_NS.Material) => {
    const x = new THREE.Mesh(keep(g), m);
    x.castShadow = true;
    x.receiveShadow = true;
    return x;
  };
  const box = (w: number, h: number, d: number, m: THREE_NS.Material) =>
    mesh(new THREE.BoxGeometry(w, h, d), m);

  /* Room ----------------------------------------------------------------- */
  const wallMat = mat("#2c2842");
  const floor = box(12, 0.1, 8, mat("#1d1a2b"));
  floor.position.set(0, -0.05, 0.5);
  scene.add(floor);
  const wall = box(12, 6, 0.1, wallMat);
  wall.position.set(0, 3, -1.75);
  scene.add(wall);
  const rug = box(2.6, 0.01, 1.6, mat("#3a2f4a"));
  rug.position.set(0, 0.005, -0.4);
  scene.add(rug);

  // Window and sky.
  const winX = -1.25;
  const winY = 2.05;
  const winW = 1.4;
  const winH = 1.1;
  const skyMat = new THREE.MeshBasicMaterial({ color: "#1b2550" });
  mats.push(skyMat);
  const sky = new THREE.Mesh(keep(new THREE.PlaneGeometry(winW, winH)), skyMat);
  sky.position.set(winX, winY, -1.695);
  scene.add(sky);
  const frameMat = mat("#3e3856");
  (
    [
      [winX, winY + winH / 2, winW + 0.12, 0.06],
      [winX, winY - winH / 2, winW + 0.16, 0.08],
      [winX - winW / 2, winY, 0.06, winH + 0.06],
      [winX + winW / 2, winY, 0.06, winH + 0.06],
      [winX, winY, 0.04, winH],
    ] as const
  ).forEach(([x, y, w, h]) => {
    const f = box(w, h, 0.06, frameMat);
    f.position.set(x, y, -1.67);
    scene.add(f);
  });
  const clip = [
    new THREE.Plane(new THREE.Vector3(1, 0, 0), -(winX - winW / 2)),
    new THREE.Plane(new THREE.Vector3(-1, 0, 0), winX + winW / 2),
    new THREE.Plane(new THREE.Vector3(0, 1, 0), -(winY - winH / 2)),
    new THREE.Plane(new THREE.Vector3(0, -1, 0), winY + winH / 2),
  ];
  const disc = keep(new THREE.CircleGeometry(0.12, 24));
  const moonMat = new THREE.MeshBasicMaterial({ color: "#f2ede4", transparent: true, clippingPlanes: clip });
  const sunMat = new THREE.MeshBasicMaterial({ color: "#ffb36b", transparent: true, clippingPlanes: clip });
  const starMat = new THREE.MeshBasicMaterial({ color: "#f2ede4", transparent: true, clippingPlanes: clip });
  mats.push(moonMat, sunMat, starMat);
  const moon = new THREE.Mesh(disc, moonMat);
  moon.position.set(winX + 0.35, winY + 0.25, -1.69);
  scene.add(moon);
  const sun = new THREE.Mesh(disc, sunMat);
  sun.scale.setScalar(1.4);
  sun.position.set(winX - 0.3, winY - 0.9, -1.69);
  scene.add(sun);
  const star = keep(new THREE.CircleGeometry(0.012, 5));
  for (let i = 0; i < 16; i++) {
    const s = new THREE.Mesh(star, starMat);
    s.position.set(
      winX - winW / 2 + 0.08 + ((i * 0.37) % 1) * (winW - 0.16),
      winY - winH / 2 + 0.25 + ((i * 0.61) % 1) * (winH - 0.35),
      -1.692,
    );
    scene.add(s);
  }

  // Wall clock.
  const clockGroup = new THREE.Group();
  clockGroup.position.set(0.85, 2.3, -1.68);
  scene.add(clockGroup);
  const face = mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.05, 28), mat("#f2ede4"));
  face.rotation.x = Math.PI / 2;
  clockGroup.add(face);
  clockGroup.add(mesh(new THREE.TorusGeometry(0.27, 0.03, 6, 28), mat("#3e3856")));
  const handMat = mat("#141413");
  const hourHand = new THREE.Group();
  const hh = box(0.035, 0.14, 0.02, handMat);
  hh.position.y = 0.07;
  hourHand.add(hh);
  hourHand.position.z = 0.04;
  clockGroup.add(hourHand);
  const minuteHand = new THREE.Group();
  const mh = box(0.024, 0.21, 0.02, handMat);
  mh.position.y = 0.105;
  minuteHand.add(mh);
  minuteHand.position.z = 0.05;
  clockGroup.add(minuteHand);

  // A shelf with a plant, for life.
  const shelf = box(0.9, 0.05, 0.25, mat("#4a3f5e"));
  shelf.position.set(1.9, 1.75, -1.6);
  scene.add(shelf);
  const pot = mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.16, 7), mat("#d97757"));
  pot.position.set(1.7, 1.86, -1.6);
  scene.add(pot);
  const leaves = mesh(new THREE.IcosahedronGeometry(0.15, 0), mat("#788c5d"));
  leaves.position.set(1.7, 2.04, -1.6);
  scene.add(leaves);

  /* Desk ----------------------------------------------------------------- */
  const deskMat = mat("#5a4c6e");
  const top = box(2.2, 0.08, 0.95, deskMat);
  top.position.set(0, 0.75, -0.2);
  scene.add(top);
  (
    [
      [-1.0, -0.6],
      [1.0, -0.6],
      [-1.0, 0.2],
      [1.0, 0.2],
    ] as const
  ).forEach(([x, z]) => {
    const leg = box(0.07, 0.71, 0.07, deskMat);
    leg.position.set(x, 0.355, z);
    scene.add(leg);
  });
  const mug = mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.12, 9), mat("#e8e6dc"));
  mug.position.set(-0.62, 0.85, -0.38);
  scene.add(mug);
  const book1 = box(0.34, 0.06, 0.25, mat("#6a9bcc"));
  book1.position.set(-0.75, 0.82, 0.02);
  book1.rotation.y = 0.25;
  scene.add(book1);
  const book2 = box(0.3, 0.05, 0.23, mat("#c46686"));
  book2.position.set(-0.75, 0.875, 0.02);
  book2.rotation.y = 0.05;
  scene.add(book2);
  const lamp = new THREE.Group();
  lamp.position.set(-0.85, 0.79, -0.5);
  scene.add(lamp);
  const lampBase = mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.03, 8), mat("#141413"));
  lamp.add(lampBase);
  const lampArm = box(0.025, 0.4, 0.025, mat("#141413"));
  lampArm.position.set(0, 0.2, 0);
  lamp.add(lampArm);
  const shadeMat = mat("#d97757", { emissive: new THREE.Color("#ffb489"), emissiveIntensity: 0.25 });
  const shade = mesh(new THREE.ConeGeometry(0.1, 0.12, 8, 1, true), shadeMat);
  shade.position.set(0.05, 0.42, 0.04);
  shade.rotation.z = -0.6;
  lamp.add(shade);

  /* Laptop: the screen faces the person (toward -z). ---------------------- */
  const laptop = new THREE.Group();
  laptop.position.set(0, 0.79, -0.3);
  laptop.rotation.y = Math.PI;
  scene.add(laptop);
  const shellMat = mat("#b9b7c4", { roughness: 0.5, metalness: 0.2 });
  const base = box(0.64, 0.025, 0.42, shellMat);
  base.position.y = 0.0125;
  laptop.add(base);
  const deck = box(0.56, 0.004, 0.2, mat("#2a2833"));
  deck.position.set(0, 0.027, -0.04);
  laptop.add(deck);
  const pad = box(0.18, 0.003, 0.1, mat("#a3a1af"));
  pad.position.set(0, 0.026, 0.14);
  laptop.add(pad);
  const lid = new THREE.Group();
  lid.position.set(0, 0.025, -0.21);
  lid.rotation.x = -0.24;
  laptop.add(lid);
  const lidBox = box(0.64, 0.41, 0.018, shellMat);
  lidBox.position.y = 0.205;
  lid.add(lidBox);
  const bezel = box(0.62, 0.39, 0.002, mat("#0b0b0b"));
  bezel.position.set(0, 0.205, 0.01);
  lid.add(bezel);

  const screenCanvas = document.createElement("canvas");
  screenCanvas.width = SCREEN_W;
  screenCanvas.height = SCREEN_H;
  const screenCtx = screenCanvas.getContext("2d")!;
  const screenTex = new THREE.CanvasTexture(screenCanvas);
  screenTex.colorSpace = THREE.SRGBColorSpace;
  screenTex.anisotropy = 8;
  const screenMat = new THREE.MeshBasicMaterial({ map: screenTex });
  mats.push(screenMat);
  const screen = new THREE.Mesh(keep(new THREE.PlaneGeometry(0.58, 0.3625)), screenMat);
  screen.position.set(0, 0.205, 0.0115);
  lid.add(screen);
  const screenLight = new THREE.PointLight("#ffd9c2", 0, 2.2, 1.5);
  screenLight.position.set(0, 1.02, -0.55);
  scene.add(screenLight);
  const fonts = {
    sans: cssFont("--font-inter", "system-ui, sans-serif"),
    mono: cssFont("--font-jetbrains", "ui-monospace, monospace"),
    serif: cssFont("--font-source-serif", "Georgia, serif"),
  };

  /* Chair ---------------------------------------------------------------- */
  const chairMat = mat("#26223a");
  const seat = box(0.62, 0.08, 0.56, chairMat);
  seat.position.set(0, 0.48, -1.02);
  scene.add(seat);
  const back = box(0.62, 0.78, 0.07, chairMat);
  back.position.set(0, 0.9, -1.3);
  back.rotation.x = -0.12;
  scene.add(back);
  const post = box(0.06, 0.44, 0.06, mat("#141413"));
  post.position.set(0, 0.22, -1.02);
  scene.add(post);

  /* The developer: chunky and simple, a big faceted head on a block suit. -- */
  const skin = mat("#f3c9a5");
  const suit = mat("#5b57c9");
  const suitLight = mat("#6c68d8");
  const hairMat = mat("#3a2a22");
  const ink = mat("#141413");
  const white = mat("#f2ede4");

  // Legs, seated.
  [-1, 1].forEach((side) => {
    const thigh = box(0.18, 0.16, 0.46, suit);
    thigh.position.set(side * 0.12, 0.6, -0.82);
    scene.add(thigh);
    const shin = box(0.16, 0.48, 0.16, suit);
    shin.position.set(side * 0.12, 0.3, -0.62);
    scene.add(shin);
    const shoe = box(0.17, 0.08, 0.26, ink);
    shoe.position.set(side * 0.12, 0.04, -0.56);
    scene.add(shoe);
  });

  const upper = new THREE.Group();
  upper.position.set(0, 0.62, -0.95);
  scene.add(upper);
  const torso = box(0.5, 0.5, 0.3, suit);
  torso.position.y = 0.26;
  upper.add(torso);
  const shirt = box(0.14, 0.3, 0.01, white);
  shirt.position.set(0, 0.34, 0.155);
  upper.add(shirt);
  [-1, 1].forEach((side) => {
    const lapel = box(0.09, 0.3, 0.02, suitLight);
    lapel.position.set(side * 0.09, 0.33, 0.16);
    lapel.rotation.z = side * 0.18;
    upper.add(lapel);
  });

  // A big head, so the face reads from across the room.
  const head = new THREE.Group();
  head.position.y = 0.78;
  upper.add(head);
  const skull = mesh(new THREE.IcosahedronGeometry(0.27, 1), skin);
  skull.scale.set(1, 0.95, 0.92);
  head.add(skull);
  [-1, 1].forEach((side) => {
    const ear = mesh(new THREE.IcosahedronGeometry(0.06, 0), skin);
    ear.position.set(side * 0.27, -0.01, -0.02);
    head.add(ear);
  });
  const cap = mesh(new THREE.DodecahedronGeometry(0.28, 0), hairMat);
  cap.scale.set(1.02, 0.42, 1.0);
  cap.position.set(0, 0.17, -0.03);
  head.add(cap);
  (
    [
      [-0.14, 0.27, -0.02, 0.4],
      [-0.05, 0.3, -0.05, 0.15],
      [0.05, 0.3, -0.06, -0.1],
      [0.14, 0.27, -0.04, -0.4],
      [0.0, 0.26, -0.17, 0],
    ] as const
  ).forEach(([x, y, z, rz]) => {
    const spike = mesh(new THREE.ConeGeometry(0.045, 0.16, 4), hairMat);
    spike.position.set(x, y, z);
    spike.rotation.set(-0.25, 0, rz);
    head.add(spike);
  });
  const eyeGeo = keep(new THREE.CylinderGeometry(0.03, 0.03, 0.02, 12));
  const eyes = [-0.095, 0.095].map((x) => {
    const e = new THREE.Mesh(eyeGeo, ink);
    e.rotation.x = Math.PI / 2;
    e.position.set(x, 0.02, 0.245);
    head.add(e);
    return e;
  });
  // Closed eyes: short downturned lines shown instead of the dots.
  const lids = [-0.095, 0.095].map((x, i) => {
    const l = box(0.075, 0.016, 0.02, ink);
    l.position.set(x, 0.015, 0.245);
    l.rotation.z = (i === 0 ? 1 : -1) * 0.12;
    l.visible = false;
    head.add(l);
    return l;
  });
  const brows: THREE_NS.Mesh[] = [];
  const mouth = box(0.09, 0.035, 0.02, ink);
  mouth.position.set(0, -0.11, 0.225);
  head.add(mouth);

  // Arms: plain blocks with shoulder and elbow joints.
  const arms = [-1, 1].map((side) => {
    const shoulder = new THREE.Group();
    shoulder.position.set(side * 0.3, 0.44, 0);
    upper.add(shoulder);
    const upperArm = box(0.13, 0.28, 0.14, suit);
    upperArm.position.y = -0.14;
    shoulder.add(upperArm);
    const elbow = new THREE.Group();
    elbow.position.y = -0.28;
    shoulder.add(elbow);
    const fore = box(0.12, 0.26, 0.13, suit);
    fore.position.y = -0.13;
    elbow.add(fore);
    const hand = box(0.1, 0.09, 0.1, skin);
    hand.position.y = -0.3;
    elbow.add(hand);
    return { side, shoulder, elbow };
  });

  /* The Claude bot: a clay block with tall eyes, stubby arms, four legs. --- */
  const bot = new THREE.Group();
  scene.add(bot);
  const botInner = new THREE.Group();
  bot.add(botInner);
  const clay = mat("#d97757", { roughness: 0.7 });
  const body = box(0.3, 0.22, 0.2, clay);
  body.position.y = 0.18;
  botInner.add(body);
  const botEyes = [-0.06, 0.06].map((x) => {
    const e = box(0.032, 0.066, 0.01, ink);
    e.position.set(x, 0.2, 0.101);
    botInner.add(e);
    return e;
  });
  const botArms = [-1, 1].map((side) => {
    const a = new THREE.Group();
    a.position.set(side * 0.15, 0.17, 0);
    botInner.add(a);
    const nub = box(0.06, 0.05, 0.07, clay);
    nub.position.x = side * 0.03;
    a.add(nub);
    return a;
  });
  const botLegs = [-0.1, -0.035, 0.035, 0.1].map((x) => {
    const leg = box(0.04, 0.07, 0.06, clay);
    leg.position.set(x, 0.035, 0);
    botInner.add(leg);
    return leg;
  });
  const botGlow = new THREE.PointLight("#ff9b6a", 0, 1.2, 2);
  botGlow.position.set(0, 0.25, 0.25);
  bot.add(botGlow);

  const botHome = new THREE.Vector3(0.72, 0.79, -0.02);
  const botKeys = new THREE.Vector3(0.45, 0.79, -0.36);

  /* Lights --------------------------------------------------------------- */
  const hemi = new THREE.HemisphereLight("#8a98e0", "#2a2638", 1.1);
  scene.add(hemi);
  const key = new THREE.DirectionalLight("#9fb2ff", 1.5);
  key.position.set(-2.5, 4, 2.5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -3, right: 3, top: 3, bottom: -2 });
  scene.add(key);
  const rim = new THREE.PointLight("#8f7cff", 3, 7, 1.6);
  rim.position.set(1.8, 2.2, 0.6);
  scene.add(rim);
  const lampLight = new THREE.PointLight("#ffb489", 1.2, 2.5, 1.8);
  lampLight.position.set(-0.78, 1.15, -0.45);
  scene.add(lampLight);

  const nightSky = new THREE.Color("#1b2550");
  const dawnSky = new THREE.Color("#f0a070");
  const daySky = new THREE.Color("#a8c8ec");
  const nightKey = new THREE.Color("#9fb2ff");
  const dayKey = new THREE.Color("#ffd2a8");
  const nightWall = new THREE.Color("#2c2842");
  const dayWall = new THREE.Color("#4e4466");
  const tmp = new THREE.Color();

  /* Camera shots ---------------------------------------------------------- */
  const wide = { pos: new THREE.Vector3(-1.0, 1.8, 3.0), look: new THREE.Vector3(0.05, 1.08, -0.5) };
  const wideTall = { pos: new THREE.Vector3(-1.1, 2.05, 4.4), look: new THREE.Vector3(0.05, 1.1, -0.5) };
  const shoulder = { pos: new THREE.Vector3(-1.0, 1.72, -1.18), look: new THREE.Vector3(0.1, 0.98, -0.1) };
  const shoulderTall = { pos: new THREE.Vector3(-0.98, 1.68, -1.0), look: new THREE.Vector3(0.0, 0.98, -0.12) };
  const camPos = new THREE.Vector3();
  const camLook = new THREE.Vector3();

  function resize() {
    const w = mount.clientWidth;
    const h = mount.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(mount);

  let lastScreenDraw = -1;
  const headWorld = new THREE.Vector3();

  function update(t: number, wallClock: number) {
    /* Camera. */
    const s = screenShot(t);
    const tall = camera.aspect < 1;
    const w = tall ? wideTall : wide;
    const sh = tall ? shoulderTall : shoulder;
    camPos.copy(w.pos).lerp(sh.pos, s);
    camPos.x += Math.sin(wallClock * 0.12) * 0.25 * (1 - s);
    camLook.copy(w.look).lerp(sh.look, s);
    camera.position.copy(camPos);
    camera.fov = tall ? 40 + s * 8 : 40 - s * 12;
    camera.updateProjectionMatrix();
    camera.lookAt(camLook);

    /* Sky and light. */
    const d = daylight(t);
    if (d < 0.5) tmp.copy(nightSky).lerp(dawnSky, d * 2);
    else tmp.copy(dawnSky).lerp(daySky, (d - 0.5) * 2);
    skyMat.color.copy(tmp);
    moonMat.opacity = 1 - d;
    starMat.opacity = Math.max(0, 1 - d * 2);
    sun.position.y = winY - 0.85 + d * 0.95;
    sunMat.opacity = Math.min(1, d * 1.5);
    key.color.copy(nightKey).lerp(dayKey, d);
    key.intensity = 1.5 + d * 1.6;
    hemi.intensity = 1.1 + d * 0.8;
    wallMat.color.copy(nightWall).lerp(dayWall, d);
    lampLight.intensity = 1.2 * (1 - d);

    /* Clock. */
    const hrs = clockHours(t);
    minuteHand.rotation.z = -((hrs % 1) * Math.PI * 2);
    hourHand.rotation.z = -(((hrs % 12) / 12) * Math.PI * 2);

    /* The developer. */
    const z = asleep(t);
    const cel = celebrate(t);
    const st = Math.max(stretch(t), cel);
    const ty = typing(t);
    upper.rotation.x = 0.08 * (1 - z) - 0.3 * z - 0.08 * st;
    upper.position.y = 0.62 + Math.sin(wallClock * 1.6) * 0.01 * z;
    head.rotation.x = 0.12 * (1 - z) * (1 - st) - 0.32 * z - 0.25 * st;
    head.rotation.z = 0.32 * z;
    head.rotation.y = (1 - z) * (1 - ty) * Math.sin(wallClock * 0.6) * 0.18;
    const closed = z > 0.4 || (st > 0.5 && cel < 0.1);
    const blink = !closed && Math.sin(wallClock * 2.1) > 0.985;
    eyes.forEach((e) => (e.visible = !(closed || blink)));
    lids.forEach((l) => (l.visible = closed || blink));
    brows.forEach((b, i) => (b.rotation.z = (i === 0 ? -1 : 1) * 0.15 * z));
    if (cel > 0.1) {
      // A big open grin.
      mouth.scale.set(1.7, 2.2, 1);
    } else if (z > 0.4) {
      // Asleep: a small, calm, closed mouth.
      mouth.scale.set(0.55, 0.45, 1);
    } else if (st > 0.3) {
      // Mid stretch: a wide yawn.
      mouth.scale.set(0.8, 2.6, 1);
    } else {
      mouth.scale.set(1, 1, 1);
    }
    upper.position.y += cel * Math.abs(Math.sin(wallClock * 8)) * 0.04;

    arms.forEach(({ side, shoulder: sh, elbow }) => {
      const tap = Math.sin(wallClock * 22 + side * 1.7) * 0.06 * ty;
      const typeS = -0.55;
      const typeE = -1.05 + tap;
      const sleepS = 0.15;
      const sleepE = -0.15;
      const stretchS = -2.9;
      const stretchE = -0.1;
      let shX = typeS * (1 - z) + sleepS * z;
      let elX = typeE * (1 - z) + sleepE * z;
      shX = shX * (1 - st) + stretchS * st;
      elX = elX * (1 - st) + stretchE * st;
      sh.rotation.x = shX;
      sh.rotation.z = side * (0.12 * z + 0.25 * st);
      elbow.rotation.x = elX;
    });

    /* The Claude bot. */
    const k = botTravel(t);
    bot.position.lerpVectors(botHome, botKeys, k);
    const walking = k > 0.01 && k < 0.99;
    bot.position.y += walking ? Math.abs(Math.sin(k * Math.PI * 3)) * 0.06 : 0;
    const stomp = botStomp(t) * Math.abs(Math.sin(wallClock * 16)) * 0.035;
    const cheer = botCheer(t);
    bot.position.y += stomp + cheer * Math.abs(Math.sin(wallClock * 9)) * 0.12;
    // Face the keyboard when there, face the walk direction when walking,
    // and otherwise glance around from the corner.
    const toKeys = Math.atan2(botKeys.x - botHome.x, botKeys.z - botHome.z);
    bot.rotation.y =
      k > 0.99
        ? -Math.PI / 2 + 0.25
        : walking
          ? botReturning(t)
            ? toKeys + Math.PI
            : toKeys
          : -0.45 + Math.sin(wallClock * 0.7) * 0.25;
    botLegs.forEach((leg, i) => {
      leg.position.y = 0.035 + (walking ? Math.max(0, Math.sin(wallClock * 18 + i * Math.PI)) * 0.025 : 0);
    });
    botArms.forEach((a, i) => {
      const typingArm = botStomp(t) && i === 0 ? Math.sin(wallClock * 20) * 0.5 : 0;
      a.rotation.z = (i === 0 ? 1 : -1) * cheer * 1.2 + typingArm;
    });
    botEyes.forEach((e) => (e.scale.y = Math.sin(wallClock * 1.7 + 1) > 0.99 ? 0.15 : 1));
    botGlow.intensity = cheer * 1.5 + botStomp(t) * 0.8;

    /* Laptop screen. */
    const b = screenBrightness(t);
    screenMat.color.setScalar(Math.max(0.05, b));
    screenLight.intensity = b * 1.6;
    if (wallClock - lastScreenDraw > 1 / 30) {
      drawScreen(screenCtx, t, fonts, wallClock);
      screenTex.needsUpdate = true;
      lastScreenDraw = wallClock;
    }

    renderer.render(scene, camera);
  }

  function headScreen() {
    head.getWorldPosition(headWorld);
    headWorld.y += 0.26;
    headWorld.x += 0.12;
    headWorld.project(camera);
    if (headWorld.z > 1) return null;
    return { x: (headWorld.x + 1) / 2, y: (1 - headWorld.y) / 2 };
  }

  function dispose() {
    ro.disconnect();
    screenTex.dispose();
    geos.forEach((g) => g.dispose());
    mats.forEach((m) => m.dispose());
    renderer.dispose();
    renderer.domElement.remove();
  }

  return { update, headScreen, dispose };
}
