"use client";

import { useEffect, useRef, useState } from "react";
import type * as THREE_NS from "three";
import { prefersReducedMotion } from "@/lib/utils/motion";
import {
  FILM_LENGTH,
  awake,
  botTravel,
  botTyping,
  captions,
  clockHours,
  daylight,
  firstWindow,
  formatClock,
  screenGlow,
  secondWindow,
  terminalLines,
} from "./story";

type Three = typeof THREE_NS;

/**
 * The workflow film. A low poly room drawn entirely in code with three.js: a
 * sleeper at a desk, a small clay helper bot that sends the Hi at 3:07 am, a
 * window that turns from night to morning, and a wall clock. HTML overlays
 * carry the captions, the live terminal, and the usage window bars, all driven
 * by one film clock from story.ts so everything stays in sync.
 */
export function WorkflowFilm() {
  const mountRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);
  const bar1Ref = useRef<HTMLDivElement>(null);
  const bar2Ref = useRef<HTMLDivElement>(null);
  const bar2WrapRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
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

    const reduce = prefersReducedMotion();
    if (reduce) {
      playingRef.current = false;
      setPlaying(false);
      timeRef.current = 22;
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
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        const dt = Math.min(0.1, (now - last) / 1000);
        last = now;
        if (seekRef.current !== null) {
          timeRef.current = seekRef.current;
          seekRef.current = null;
        } else if (playingRef.current && visible) {
          timeRef.current = (timeRef.current + dt) % FILM_LENGTH;
        } else if (!visible) {
          return;
        }
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
      if (bar1Ref.current) bar1Ref.current.style.width = `${firstWindow(t) * 100}%`;
      if (bar2Ref.current) bar2Ref.current.style.width = `${secondWindow(t) * 100}%`;
      if (bar2WrapRef.current) {
        bar2WrapRef.current.style.opacity = t > 20 ? "1" : "0.35";
      }
      if (linesRef.current) {
        Array.from(linesRef.current.children).forEach((el, i) => {
          const on = t >= terminalLines[i].at;
          (el as HTMLElement).style.opacity = on ? "1" : "0";
          (el as HTMLElement).style.transform = on ? "none" : "translateY(4px)";
        });
      }
      if (zRef.current) {
        const asleep = 1 - awake(t);
        zRef.current.style.opacity = head ? String(asleep) : "0";
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
        aria-label="Animation: a person sleeps at their desk while a small helper bot sends Hi at 3:07 am, starting a fresh Claude usage window before morning."
      >
        {!ready ? (
          <div className="absolute inset-0 flex items-center justify-center text-[15px] text-[#b0aea5]">
            Setting the scene
          </div>
        ) : null}

        {/* Sleeping z's that follow the sleeper's head. */}
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

        {/* Wall clock readout. */}
        <div className="pointer-events-none absolute top-4 left-4 rounded-[6px] bg-black/35 px-3 py-1.5 font-mono text-[14px] backdrop-blur-sm sm:top-6 sm:left-6">
          <span ref={clockRef}>11:00 pm</span>
        </div>

        {/* Caption, set like subtitles. */}
        <p
          ref={captionRef}
          aria-live="polite"
          className="pointer-events-none absolute right-6 bottom-[104px] left-6 text-center text-[17px] font-medium text-balance [text-shadow:0_1px_12px_rgba(0,0,0,0.7)] sm:bottom-[112px] sm:text-[22px]"
        >
          {captions[0].text}
        </p>

        {/* Usage windows. */}
        <div className="pointer-events-none absolute right-4 bottom-4 left-4 grid grid-cols-2 gap-3 sm:right-6 sm:bottom-6 sm:left-6">
          <div>
            <p className="mb-1.5 text-[12px] text-[#d1cfc5] sm:text-[13px]">
              Window started for you
            </p>
            <div className="h-2 overflow-hidden rounded-full bg-white/12">
              <div ref={bar1Ref} className="h-full w-0 rounded-full bg-[#d97757]" />
            </div>
          </div>
          <div ref={bar2WrapRef} className="transition-opacity duration-500">
            <p className="mb-1.5 text-[12px] text-[#d1cfc5] sm:text-[13px]">
              Fresh window at 8:07 am
            </p>
            <div className="h-2 overflow-hidden rounded-full bg-white/12">
              <div ref={bar2Ref} className="h-full w-0 rounded-full bg-[#f2ede4]" />
            </div>
          </div>
        </div>
      </div>

        {/* Live terminal: what GitHub Actions actually runs. */}
      <div className="pointer-events-none mx-4 mt-4 rounded-[8px] border border-white/10 bg-[#0f0e18]/80 p-3 backdrop-blur-sm sm:absolute sm:top-6 sm:right-6 sm:mx-0 sm:mt-0 sm:w-[340px] sm:p-4">
        <p className="mb-2 flex items-center gap-2 text-[12px] text-[#b0aea5]">
          <span className="inline-block h-2 w-2 rounded-full bg-[#788c5d]" />
          GitHub Actions, Lazy start
        </p>
        <div ref={linesRef} className="flex flex-col gap-1 font-mono text-[11.5px] leading-snug sm:text-[12.5px]">
          {terminalLines.map((line) => (
            <p
              key={line.text}
              className={
                line.tone === "command"
                  ? "text-[#f2ede4] transition-all duration-300"
                  : line.tone === "reply"
                    ? "text-[#e3a58d] transition-all duration-300"
                    : line.tone === "ok"
                      ? "text-[#b5c99a] transition-all duration-300"
                      : "text-[#87867f] transition-all duration-300"
              }
              style={{ opacity: 0 }}
            >
              {line.text}
            </p>
          ))}
        </div>
      </div>

      {/* Controls. */}
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

function buildScene(THREE: Three, mount: HTMLDivElement) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.localClippingEnabled = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.inset = "0";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  mount.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#141322");
  scene.fog = new THREE.Fog("#141322", 6, 12);

  const camera = new THREE.PerspectiveCamera(38, 16 / 9, 0.1, 50);

  const geos: THREE_NS.BufferGeometry[] = [];
  const mats: THREE_NS.Material[] = [];
  const mat = (color: string, extra: THREE_NS.MeshStandardMaterialParameters = {}) => {
    const m = new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.85, ...extra });
    mats.push(m);
    return m;
  };
  const box = (w: number, h: number, d: number, m: THREE_NS.Material) => {
    const g = new THREE.BoxGeometry(w, h, d);
    geos.push(g);
    const mesh = new THREE.Mesh(g, m);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  };

  // Room.
  const wallMat = mat("#2c2842");
  const floorMat = mat("#1b1928");
  const floor = box(12, 0.1, 8, floorMat);
  floor.position.set(0, -0.05, 0.5);
  scene.add(floor);
  const wall = box(12, 6, 0.1, wallMat);
  wall.position.set(0, 3, -1.65);
  scene.add(wall);

  // Window in the back wall, with a sky that turns from night to morning.
  const winX = -1.15;
  const winY = 2.05;
  const winW = 1.5;
  const winH = 1.15;
  const skyMat = new THREE.MeshBasicMaterial({ color: "#1b2550" });
  mats.push(skyMat);
  const skyGeo = new THREE.PlaneGeometry(winW, winH);
  geos.push(skyGeo);
  const sky = new THREE.Mesh(skyGeo, skyMat);
  sky.position.set(winX, winY, -1.595);
  scene.add(sky);
  const frameMat = mat("#3a3550");
  const frameParts: [number, number, number, number][] = [
    [winX, winY + winH / 2, winW + 0.12, 0.06],
    [winX, winY - winH / 2, winW + 0.12, 0.06],
    [winX - winW / 2, winY, 0.06, winH + 0.06],
    [winX + winW / 2, winY, 0.06, winH + 0.06],
    [winX, winY, 0.04, winH],
  ];
  frameParts.forEach(([x, y, w, h]) => {
    const f = box(w, h, 0.06, frameMat);
    f.position.set(x, y, -1.57);
    scene.add(f);
  });
  const clip = [
    new THREE.Plane(new THREE.Vector3(1, 0, 0), -(winX - winW / 2)),
    new THREE.Plane(new THREE.Vector3(-1, 0, 0), winX + winW / 2),
    new THREE.Plane(new THREE.Vector3(0, 1, 0), -(winY - winH / 2)),
    new THREE.Plane(new THREE.Vector3(0, -1, 0), winY + winH / 2),
  ];
  const discGeo = new THREE.CircleGeometry(0.13, 20);
  geos.push(discGeo);
  const moonMat = new THREE.MeshBasicMaterial({ color: "#f2ede4", transparent: true, clippingPlanes: clip });
  const sunMat = new THREE.MeshBasicMaterial({ color: "#ffb36b", transparent: true, clippingPlanes: clip });
  mats.push(moonMat, sunMat);
  const moon = new THREE.Mesh(discGeo, moonMat);
  moon.position.set(winX + 0.38, winY + 0.25, -1.59);
  scene.add(moon);
  const sun = new THREE.Mesh(discGeo, sunMat);
  sun.scale.setScalar(1.35);
  sun.position.set(winX - 0.3, winY - 0.9, -1.59);
  scene.add(sun);
  const starGeo = new THREE.CircleGeometry(0.012, 5);
  geos.push(starGeo);
  const starMat = new THREE.MeshBasicMaterial({ color: "#f2ede4", transparent: true, clippingPlanes: clip });
  mats.push(starMat);
  for (let i = 0; i < 14; i++) {
    const s = new THREE.Mesh(starGeo, starMat);
    s.position.set(
      winX - winW / 2 + 0.08 + ((i * 0.37) % 1) * (winW - 0.16),
      winY - winH / 2 + 0.2 + ((i * 0.61) % 1) * (winH - 0.3),
      -1.592,
    );
    scene.add(s);
  }

  // Wall clock.
  const clockGroup = new THREE.Group();
  clockGroup.position.set(0.2, 2.5, -1.58);
  scene.add(clockGroup);
  const faceGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 24);
  geos.push(faceGeo);
  const face = new THREE.Mesh(faceGeo, mat("#f2ede4"));
  face.rotation.x = Math.PI / 2;
  clockGroup.add(face);
  const rimGeo = new THREE.TorusGeometry(0.3, 0.03, 6, 24);
  geos.push(rimGeo);
  clockGroup.add(new THREE.Mesh(rimGeo, mat("#3a3550")));
  const handMat = mat("#141413");
  const hourHand = new THREE.Group();
  const hh = box(0.035, 0.15, 0.02, handMat);
  hh.position.y = 0.075;
  hourHand.add(hh);
  hourHand.position.z = 0.04;
  clockGroup.add(hourHand);
  const minuteHand = new THREE.Group();
  const mh = box(0.025, 0.23, 0.02, handMat);
  mh.position.y = 0.115;
  minuteHand.add(mh);
  minuteHand.position.z = 0.05;
  clockGroup.add(minuteHand);

  // Desk.
  const deskMat = mat("#4a3f5e");
  const top = box(2.3, 0.08, 1.0, deskMat);
  top.position.set(0, 0.75, 0);
  scene.add(top);
  [
    [-1.05, -0.42],
    [1.05, -0.42],
    [-1.05, 0.42],
    [1.05, 0.42],
  ].forEach(([x, z]) => {
    const leg = box(0.07, 0.71, 0.07, deskMat);
    leg.position.set(x, 0.355, z);
    scene.add(leg);
  });

  // A mug and a small stack of books, for life.
  const mugGeo = new THREE.CylinderGeometry(0.06, 0.055, 0.13, 8);
  geos.push(mugGeo);
  const mug = new THREE.Mesh(mugGeo, mat("#d97757"));
  mug.castShadow = true;
  mug.position.set(0.95, 0.855, -0.25);
  scene.add(mug);
  const book1 = box(0.36, 0.06, 0.26, mat("#6a9bcc"));
  book1.position.set(-0.9, 0.82, -0.3);
  book1.rotation.y = 0.2;
  scene.add(book1);
  const book2 = box(0.32, 0.05, 0.24, mat("#788c5d"));
  book2.position.set(-0.9, 0.875, -0.3);
  book2.rotation.y = -0.1;
  scene.add(book2);

  // Laptop, angled so its screen faces the viewer.
  const laptop = new THREE.Group();
  laptop.position.set(-0.55, 0.79, 0.12);
  laptop.rotation.y = 0.55;
  scene.add(laptop);
  const shellMat = mat("#5c5a6e");
  const base = box(0.52, 0.03, 0.36, shellMat);
  base.position.y = 0.015;
  laptop.add(base);
  const lid = new THREE.Group();
  lid.position.set(0, 0.03, -0.17);
  lid.rotation.x = -0.28;
  laptop.add(lid);
  const lidBox = box(0.52, 0.36, 0.02, shellMat);
  lidBox.position.y = 0.18;
  lid.add(lidBox);
  const screenMat = new THREE.MeshStandardMaterial({
    color: "#1a1828",
    emissive: new THREE.Color("#ffb489"),
    emissiveIntensity: 0.1,
    flatShading: true,
  });
  mats.push(screenMat);
  const screenGeo = new THREE.PlaneGeometry(0.46, 0.3);
  geos.push(screenGeo);
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.set(0, 0.18, 0.012);
  lid.add(screen);
  const screenLight = new THREE.PointLight("#ffb489", 0, 3, 1.4);
  screenLight.position.set(-0.4, 1.05, 0.35);
  scene.add(screenLight);

  // Chair.
  const chairMat = mat("#2e2a40");
  const seat = box(0.62, 0.08, 0.56, chairMat);
  seat.position.set(0, 0.5, -0.9);
  scene.add(seat);
  const back = box(0.62, 0.7, 0.07, chairMat);
  back.position.set(0, 0.88, -1.18);
  scene.add(back);

  // The sleeper. Upper body pivots at the hips so it can slump onto the desk.
  const skin = mat("#f1c7a3");
  const shirt = mat("#5b57c9");
  const hairMat = mat("#2b1f1a");
  const upper = new THREE.Group();
  upper.position.set(0, 0.62, -0.82);
  scene.add(upper);
  const torso = box(0.56, 0.62, 0.3, shirt);
  torso.position.y = 0.31;
  upper.add(torso);
  const collar = box(0.12, 0.2, 0.02, mat("#f2ede4"));
  collar.position.set(0, 0.5, 0.16);
  upper.add(collar);
  const head = new THREE.Group();
  head.position.y = 0.82;
  upper.add(head);
  const headGeo = new THREE.IcosahedronGeometry(0.23, 0);
  geos.push(headGeo);
  const headMesh = new THREE.Mesh(headGeo, skin);
  headMesh.castShadow = true;
  head.add(headMesh);
  const hairGeo = new THREE.DodecahedronGeometry(0.25, 0);
  geos.push(hairGeo);
  const hair = new THREE.Mesh(hairGeo, hairMat);
  hair.scale.set(1, 0.62, 1);
  hair.position.set(0, 0.11, -0.03);
  hair.castShadow = true;
  head.add(hair);
  const eyeMat = mat("#141413");
  const eyes = [-0.085, 0.085].map((x) => {
    const e = box(0.05, 0.065, 0.02, eyeMat);
    e.position.set(x, 0.0, 0.205);
    head.add(e);
    return e;
  });
  // Forearms folded on the desk.
  [-1, 1].forEach((side) => {
    const arm = box(0.5, 0.1, 0.13, shirt);
    arm.position.set(side * 0.1, 0.85, -0.22);
    arm.rotation.y = side * 0.35;
    scene.add(arm);
    const hand = box(0.11, 0.09, 0.11, skin);
    hand.position.set(side * -0.13, 0.85, -0.13 + side * 0.04);
    scene.add(hand);
  });

  // The helper bot: a small clay block with a visor and an antenna.
  const bot = new THREE.Group();
  scene.add(bot);
  const clay = mat("#d97757");
  const botBody = box(0.26, 0.24, 0.24, clay);
  botBody.position.y = 0.16;
  bot.add(botBody);
  const visor = box(0.2, 0.08, 0.02, mat("#1a1828"));
  visor.position.set(0, 0.19, 0.125);
  bot.add(visor);
  const botEyeMat = new THREE.MeshBasicMaterial({ color: "#ffe1cf" });
  mats.push(botEyeMat);
  const botEyeGeo = new THREE.BoxGeometry(0.035, 0.035, 0.01);
  geos.push(botEyeGeo);
  [-0.045, 0.045].forEach((x) => {
    const e = new THREE.Mesh(botEyeGeo, botEyeMat);
    e.position.set(x, 0.19, 0.137);
    bot.add(e);
  });
  const footMat = mat("#b5654a");
  [-0.07, 0.07].forEach((x) => {
    const foot = box(0.07, 0.04, 0.1, footMat);
    foot.position.set(x, 0.02, 0.01);
    bot.add(foot);
  });
  const stalkGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.1, 5);
  geos.push(stalkGeo);
  const stalk = new THREE.Mesh(stalkGeo, footMat);
  stalk.position.y = 0.33;
  bot.add(stalk);
  const tipGeo = new THREE.IcosahedronGeometry(0.025, 0);
  geos.push(tipGeo);
  const tipMat = new THREE.MeshStandardMaterial({ color: "#ffe1cf", emissive: new THREE.Color("#ff9b6a"), emissiveIntensity: 0.4 });
  mats.push(tipMat);
  const tip = new THREE.Mesh(tipGeo, tipMat);
  tip.position.y = 0.39;
  bot.add(tip);
  const botLight = new THREE.PointLight("#ff9b6a", 0, 1.2, 2);
  botLight.position.y = 0.4;
  bot.add(botLight);

  const botHome = new THREE.Vector3(0.68, 0.79, 0.18);
  const botAway = new THREE.Vector3(-0.22, 0.79, 0.34);

  // Lights.
  const hemi = new THREE.HemisphereLight("#8a98e0", "#2a2638", 1.1);
  scene.add(hemi);
  const sunLight = new THREE.DirectionalLight("#9fb2ff", 0.9);
  sunLight.position.set(-2.5, 4, 2.5);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(1024, 1024);
  sunLight.shadow.camera.left = -3;
  sunLight.shadow.camera.right = 3;
  sunLight.shadow.camera.top = 3;
  sunLight.shadow.camera.bottom = -2;
  scene.add(sunLight);
  const rim = new THREE.PointLight("#8f7cff", 3.2, 7, 1.6);
  rim.position.set(1.8, 2.2, 0.6);
  scene.add(rim);

  const nightSky = new THREE.Color("#1b2550");
  const dawnSky = new THREE.Color("#f0a070");
  const daySky = new THREE.Color("#a8c8ec");
  const nightKey = new THREE.Color("#9fb2ff");
  const dayKey = new THREE.Color("#ffd2a8");
  const nightWall = new THREE.Color("#2c2842");
  const dayWall = new THREE.Color("#4a4160");
  const tmp = new THREE.Color();

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

  const headWorld = new THREE.Vector3();

  function update(t: number, wall: number) {
    // Camera: a slow drift, pulled back on tall screens so the room fits.
    const tall = camera.aspect < 1;
    const dist = tall ? 4.4 : 3.3;
    camera.position.set(Math.sin(wall * 0.12) * 0.25, tall ? 1.95 : 1.7, dist);
    camera.lookAt(-0.1, tall ? 1.15 : 1.25, -0.4);

    // Sky and light.
    const d = daylight(t);
    if (d < 0.5) tmp.copy(nightSky).lerp(dawnSky, d * 2);
    else tmp.copy(dawnSky).lerp(daySky, (d - 0.5) * 2);
    skyMat.color.copy(tmp);
    moonMat.opacity = 1 - d;
    starMat.opacity = Math.max(0, 1 - d * 2);
    sun.position.y = winY - 0.85 + d * 0.95;
    sunMat.opacity = Math.min(1, d * 1.5);
    sunLight.color.copy(nightKey).lerp(dayKey, d);
    sunLight.intensity = 1.5 + d * 1.6;
    hemi.intensity = 1.1 + d * 0.8;
    wallMat.color.copy(nightWall).lerp(dayWall, d);

    // Clock hands.
    const hrs = clockHours(t);
    minuteHand.rotation.z = -((hrs % 1) * Math.PI * 2);
    hourHand.rotation.z = -(((hrs % 12) / 12) * Math.PI * 2);

    // Sleeper.
    const a = awake(t);
    upper.rotation.x = 0.92 * (1 - a) + 0.04 * a;
    head.rotation.x = -0.25 * (1 - a);
    const breathe = Math.sin(wall * 1.6) * 0.012 * (1 - a);
    upper.position.y = 0.62 + breathe;
    const blink = a > 0.99 && Math.sin(wall * 2.3) > 0.985 ? 0.15 : 1;
    eyes.forEach((e) => (e.scale.y = a < 0.5 ? 0.18 : blink));
    head.rotation.y = a * Math.sin(wall * 0.7) * 0.15;

    // Bot hop.
    const k = botTravel(t);
    bot.position.lerpVectors(botHome, botAway, k);
    bot.position.y += Math.sin(Math.PI * k) * 0.55 + botTyping(t);
    const going = t < 11;
    const look = going ? botAway.clone().sub(botHome) : botHome.clone().sub(botAway);
    const atLaptop = k > 0.98;
    bot.rotation.y = atLaptop
      ? Math.atan2(laptop.position.x - bot.position.x, laptop.position.z - bot.position.z)
      : k > 0.001 && k < 0.999
        ? Math.atan2(look.x, look.z)
        : Math.sin(wall * 0.8) * 0.25 - 0.5;
    bot.position.y += k === 0 ? Math.abs(Math.sin(wall * 2)) * 0.015 : 0;
    const sending = t > 9.4 && t < 11.3;
    tipMat.emissiveIntensity = sending ? 1.6 + Math.sin(wall * 14) * 0.6 : 0.4;
    botLight.intensity = sending ? 1.4 : 0.15;

    // Laptop glow.
    const g = screenGlow(t);
    screenMat.emissiveIntensity = g * 1.4;
    screenLight.intensity = g * 4;

    renderer.render(scene, camera);
  }

  function headScreen() {
    head.getWorldPosition(headWorld);
    headWorld.y += 0.25;
    headWorld.x += 0.1;
    headWorld.project(camera);
    if (headWorld.z > 1) return null;
    return { x: (headWorld.x + 1) / 2, y: (1 - headWorld.y) / 2 };
  }

  function dispose() {
    ro.disconnect();
    geos.forEach((g) => g.dispose());
    mats.forEach((m) => m.dispose());
    renderer.dispose();
    renderer.domElement.remove();
  }

  return { update, headScreen, dispose };
}
