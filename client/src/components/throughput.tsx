import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Zap } from "lucide-react";

type Status = "idle" | "running" | "paused" | "over";

type Request = {
  id: number;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  vy: number;
};

type Flow = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  t: number;
  max: number;
};

type Server = {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  active: number[];
  scaledUntil: number;
  flash: number;
  pulse: number;
};

const LABELS = ["GET /orders", "POST /checkout", "GET /users", "POST /auth", "GET /reports", "PATCH /jobs", "GET /health", "POST /webhook"];
const BEST_KEY = "throughput-best-v1";
const PROCESS_TIME = 1.8;
const BASE_CAPACITY = 3;

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.min(radius, height / 2, width / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

export function ThroughputGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef({ start: () => {}, pause: () => {}, resume: () => {}, scale: () => {} });
  const bestRef = useRef(0);

  const [status, setStatus] = useState<Status>("idle");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [drops, setDrops] = useState(3);
  const [best, setBest] = useState(0);
  const [wave, setWave] = useState(1);
  const [scaleReady, setScaleReady] = useState(0);

  useEffect(() => {
    try {
      const stored = Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? "0", 10);
      if (Number.isFinite(stored) && stored > 0) {
        bestRef.current = stored;
        setBest(stored);
      }
    } catch {
      // localStorage can be unavailable in private contexts.
    }
  }, []);

  useEffect(() => {
    const startFromPalette = () => controlsRef.current.start();
    window.addEventListener("start-throughput", startFromPalette);
    return () => window.removeEventListener("start-throughput", startFromPalette);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 640px)").matches;
    const W = narrow ? 480 : 960;
    const H = narrow ? 360 : 520;
    const ROUTER_Y = H - (narrow ? 136 : 184);
    const SERVER_Y = H - (narrow ? 98 : 132);
    const SERVER_W = narrow ? 108 : 176;
    const SERVER_H = narrow ? 74 : 96;
    const SERVER_X = [W * 0.18, W * 0.5, W * 0.82];
    const ROUTER_SPEED = 720;
    const REQUEST_FONT = 14;
    const REQUEST_H = narrow ? 26 : 28;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const makeServers = (): Server[] =>
      SERVER_X.map((x, index) => ({
        id: index,
        x,
        y: SERVER_Y,
        w: SERVER_W,
        h: SERVER_H,
        active: [],
        scaledUntil: 0,
        flash: 0,
        pulse: 0,
      }));

    const game = {
      running: false,
      over: false,
      time: 0,
      score: 0,
      combo: 1,
      comboCount: 0,
      drops: 3,
      wave: 1,
      requests: [] as Request[],
      flows: [] as Flow[],
      servers: makeServers(),
      routerX: W / 2,
      spawn: 0.6,
      flash: 0,
      shake: 0,
      scaleCooldown: 0,
      nextId: 1,
      keys: new Set<string>(),
    };

    let lastScaleLabel = -1;

    const nearestServer = (x: number) => {
      let bestServer = game.servers[0];
      let bestDistance = Math.abs(x - bestServer.x);
      for (const server of game.servers) {
        const distance = Math.abs(x - server.x);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestServer = server;
        }
      }
      return bestServer;
    };

    const syncHud = () => {
      setScore(game.score);
      setCombo(game.combo);
      setDrops(game.drops);
      setWave(game.wave);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.style.aspectRatio = `${W} / ${H}`;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const spawnRequest = (offset = 0) => {
      const label = LABELS[Math.floor(Math.random() * LABELS.length)];
      ctx.font = `600 ${REQUEST_FONT}px "Inter", system-ui, sans-serif`;
      const w = Math.ceil(ctx.measureText(label).width) + (narrow ? 22 : 26);
      game.requests.push({
        id: game.nextId,
        label,
        x: W / 2 + (Math.random() - 0.5) * W * 0.14 + offset,
        y: -REQUEST_H - 4,
        w,
        h: REQUEST_H,
        vy: (narrow ? 100 : 138) + game.wave * 8 + Math.random() * 22,
      });
      game.nextId += 1;
    };

    const endGame = () => {
      game.running = false;
      game.over = true;
      if (game.score > bestRef.current) {
        bestRef.current = game.score;
        setBest(game.score);
        try {
          window.localStorage.setItem(BEST_KEY, String(game.score));
        } catch {
          // Ignore storage failures.
        }
      }
      setStatus("over");
      syncHud();
      draw();
    };

    const dropRequest = () => {
      game.drops -= 1;
      game.combo = 1;
      game.comboCount = 0;
      game.flash = reducedMotion ? 0 : 0.3;
      game.shake = reducedMotion ? 0 : 8;
      syncHud();
      if (game.drops <= 0) endGame();
    };

    const scaleSelected = () => {
      if (!game.running || game.scaleCooldown > 0) return;
      const server = nearestServer(game.routerX);
      server.scaledUntil = game.time + 4;
      server.flash = 0.25;
      game.scaleCooldown = 9;
      setScaleReady(9);
      canvas.focus({ preventScroll: true });
    };

    const drawBackground = () => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = "rgba(255,255,255,0.035)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= W; x += 48) {
        ctx.beginPath();
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, H);
        ctx.stroke();
      }
      for (let y = 0; y <= H; y += 48) {
        ctx.beginPath();
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(W, y + 0.5);
        ctx.stroke();
      }

      const glow = ctx.createRadialGradient(W / 2, H * 0.42, 0, W / 2, H * 0.42, W * 0.6);
      glow.addColorStop(0, "rgba(255,255,255,0.055)");
      glow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      ctx.font = `500 ${narrow ? 10 : 11}px "JetBrains Mono", monospace`;
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.textAlign = "left";
      ctx.fillText("INCOMING TRAFFIC", 18, 26);
      ctx.textAlign = "right";
      ctx.fillText(`TRAFFIC x${game.wave}`, W - 18, 26);
      ctx.textAlign = "left";

      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = "rgba(255,255,255,0.42)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, ROUTER_Y);
      ctx.lineTo(W, ROUTER_Y);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = `500 ${narrow ? 10 : 11}px "JetBrains Mono", monospace`;
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.fillText("ROUTER", 18, ROUTER_Y - 10);
    };

    const drawServer = (server: Server, target: boolean) => {
      const scaledCapacity = game.time < server.scaledUntil ? BASE_CAPACITY + 1 : BASE_CAPACITY;
      const capacity = Math.max(scaledCapacity, server.active.length);
      const full = server.active.length >= scaledCapacity;
      const left = server.x - server.w / 2;

      if (target) {
        ctx.strokeStyle = "rgba(255,255,255,0.9)";
        ctx.lineWidth = 1.5;
      } else {
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 1;
      }
      ctx.fillStyle = server.flash > 0 ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.015)";
      roundRect(ctx, left, server.y, server.w, server.h, 10);
      ctx.fill();
      ctx.stroke();

      ctx.font = `600 ${narrow ? 12 : 13}px "JetBrains Mono", monospace`;
      ctx.fillStyle = full ? "#ffffff" : "rgba(255,255,255,0.7)";
      ctx.textAlign = "left";
      ctx.fillText(`API-${server.id + 1}`, left + 12, server.y + 18);
      ctx.textAlign = "right";
      ctx.fillText(full ? "FULL" : `${server.active.length}/${capacity}`, left + server.w - 12, server.y + 18);
      ctx.textAlign = "left";

      const gap = 4;
      const slotWidth = (server.w - 24 - (capacity - 1) * gap) / capacity;
      const slotY = server.y + 28;
      const slotHeight = Math.max(20, server.h - 38);
      for (let i = 0; i < capacity; i += 1) {
        const slotX = left + 12 + i * (slotWidth + gap);
        if (i < server.active.length) {
          ctx.fillStyle = "#ffffff";
          roundRect(ctx, slotX, slotY, slotWidth, slotHeight, 3);
          ctx.fill();
        } else {
          ctx.strokeStyle = i === BASE_CAPACITY ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.16)";
          ctx.setLineDash(i === BASE_CAPACITY ? [4, 3] : []);
          roundRect(ctx, slotX, slotY, slotWidth, slotHeight, 3);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      if (server.pulse > 0) {
        ctx.strokeStyle = `rgba(255,255,255,${server.pulse * 0.5})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(server.x, server.y + server.h / 2, server.w * (0.45 + (0.25 - server.pulse) * 1.2), 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    const draw = () => {
      ctx.save();
      if (game.shake > 0) {
        ctx.translate((Math.random() - 0.5) * game.shake, (Math.random() - 0.5) * game.shake);
      }

      drawBackground();

      const target = nearestServer(game.routerX);

      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(game.routerX, ROUTER_Y);
      ctx.lineTo(target.x, target.y);
      ctx.stroke();

      for (const server of game.servers) drawServer(server, server === target);

      for (const flow of game.flows) {
        const p = Math.min(flow.t / flow.max, 1);
        const x = flow.x1 + (flow.x2 - flow.x1) * p;
        const y = flow.y1 + (flow.y2 - flow.y1) * p;
        ctx.globalAlpha = 1 - p;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x - 2, y - 2, 4, 4);
      }
      ctx.globalAlpha = 1;

      for (const request of game.requests) {
        const left = request.x - request.w / 2;
        ctx.fillStyle = "#ffffff";
        roundRect(ctx, left, request.y, request.w, request.h, request.h / 2);
        ctx.fill();
        ctx.fillStyle = "#000000";
        ctx.font = `600 ${REQUEST_FONT}px "Inter", system-ui, sans-serif`;
        ctx.textBaseline = "middle";
        ctx.fillText(request.label, left + (narrow ? 10 : 12), request.y + request.h / 2 + 0.5);
        ctx.textBaseline = "alphabetic";
      }

      const pulse = 0.5 + Math.sin(game.time * 4) * 0.5;
      ctx.strokeStyle = `rgba(255,255,255,${0.35 + pulse * 0.35})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(game.routerX, ROUTER_Y - 16);
      ctx.lineTo(game.routerX, ROUTER_Y + 16);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(game.routerX - 5, ROUTER_Y - 21);
      ctx.lineTo(game.routerX + 5, ROUTER_Y - 21);
      ctx.lineTo(game.routerX, ROUTER_Y - 14);
      ctx.closePath();
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      if (game.flash > 0) {
        ctx.fillStyle = `rgba(255,255,255,${game.flash * 0.55})`;
        ctx.fillRect(0, 0, W, H);
      }

      ctx.restore();
    };

    const update = (dt: number) => {
      game.time += dt;

      if (game.scaleCooldown > 0) {
        game.scaleCooldown = Math.max(0, game.scaleCooldown - dt);
        const label = Math.ceil(game.scaleCooldown);
        if (label !== lastScaleLabel) {
          lastScaleLabel = label;
          setScaleReady(label);
        }
      }

      game.spawn -= dt;
      if (game.spawn <= 0) {
        spawnRequest();
        if (game.wave >= 3 && Math.random() < 0.14) spawnRequest(28);
        game.spawn = Math.max(0.34, 0.82 - game.wave * 0.1) + Math.random() * 0.18;
      }

      for (let i = game.requests.length - 1; i >= 0; i -= 1) {
        const request = game.requests[i];
        request.y += request.vy * dt;
        if (request.y < ROUTER_Y) continue;

        game.requests.splice(i, 1);
        const target = nearestServer(game.routerX);
        const capacity = game.time < target.scaledUntil ? BASE_CAPACITY + 1 : BASE_CAPACITY;
        if (target.active.length < capacity) {
          target.active.push(PROCESS_TIME);
          target.flash = 0.16;
          game.flows.push({ x1: request.x, y1: ROUTER_Y, x2: target.x, y2: target.y + 12, t: 0, max: 0.32 });
        } else {
          dropRequest();
          if (!game.running) return;
        }
      }

      for (let i = game.flows.length - 1; i >= 0; i -= 1) {
        const flow = game.flows[i];
        flow.t += dt;
        if (flow.t >= flow.max) game.flows.splice(i, 1);
      }

      for (const server of game.servers) {
        if (server.flash > 0) server.flash = Math.max(0, server.flash - dt * 2.5);
        if (server.pulse > 0) server.pulse = Math.max(0, server.pulse - dt * 2);
        for (let i = server.active.length - 1; i >= 0; i -= 1) {
          server.active[i] -= dt;
          if (server.active[i] > 0) continue;
          server.active.splice(i, 1);
          game.comboCount += 1;
          game.score += 10 * game.combo;
          server.pulse = 0.25;
          if (game.comboCount % 8 === 0) game.combo = Math.min(game.combo + 1, 5);
          const nextWave = 1 + Math.floor(game.score / 150);
          if (nextWave !== game.wave) game.wave = nextWave;
          syncHud();
        }
      }

      const keys = game.keys;
      let direction = 0;
      if (keys.has("arrowleft") || keys.has("a")) direction -= 1;
      if (keys.has("arrowright") || keys.has("d")) direction += 1;
      if (direction !== 0) {
        game.routerX = Math.min(W - 18, Math.max(18, game.routerX + direction * ROUTER_SPEED * dt));
      }

      if (game.flash > 0) game.flash = Math.max(0, game.flash - dt * 1.8);
      if (game.shake > 0) game.shake = Math.max(0, game.shake - dt * 42);
    };

    let raf = 0;
    let last = 0;

    const tick = (timestamp: number) => {
      raf = 0;
      if (!game.running) return;
      const dt = last ? Math.min((timestamp - last) / 1000, 0.05) : 0;
      last = timestamp;
      update(dt);
      draw();
      if (game.running) raf = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (raf || !game.running) return;
      last = 0;
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
      lastScaleLabel = -1;
      game.running = true;
      game.over = false;
      game.time = 0;
      game.score = 0;
      game.combo = 1;
      game.comboCount = 0;
      game.drops = 3;
      game.wave = 1;
      game.requests = [];
      game.flows = [];
      game.servers = makeServers();
      game.routerX = W / 2;
      game.spawn = 0.5;
      game.flash = 0;
      game.shake = 0;
      game.scaleCooldown = 0;
      game.nextId = 1;
      game.keys.clear();
      setScaleReady(0);
      syncHud();
      setStatus("running");
      kick();
      canvas.closest(".game-shell")?.scrollIntoView({
        block: "center",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
      canvas.focus({ preventScroll: true });
    };

    const pause = () => {
      if (!game.running) return;
      game.running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      setStatus("paused");
      draw();
    };

    const resume = () => {
      if (game.over) {
        start();
        return;
      }
      game.running = true;
      setStatus("running");
      kick();
      canvas.focus({ preventScroll: true });
    };

    controlsRef.current = { start, pause, resume, scale: scaleSelected };

    const onPointerDown = (event: PointerEvent) => {
      event.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * W;
      const y = ((event.clientY - rect.top) / rect.height) * H;
      if (y > ROUTER_Y - 30) {
        game.routerX = nearestServer(x).x;
      } else {
        game.routerX = Math.min(W - 18, Math.max(18, x));
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (["arrowleft", "arrowright", "a", "d"].includes(key)) {
        event.preventDefault();
        game.keys.add(key);
        return;
      }
      if (key === " " || key === "enter") {
        event.preventDefault();
        scaleSelected();
        return;
      }
      if (key === "p" || key === "escape") {
        event.preventDefault();
        pause();
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      game.keys.delete(event.key.toLowerCase());
    };

    const onVisibilityChange = () => {
      if (document.hidden) pause();
    };

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) pause();
      },
      { threshold: 0.15 },
    );
    intersectionObserver.observe(canvas);

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("keydown", onKeyDown);
    canvas.addEventListener("keyup", onKeyUp);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("resize", resize);

    resize();
    if (document.fonts?.ready) {
      void document.fonts.ready.then(() => {
        if (!game.running) draw();
      });
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      intersectionObserver.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("keydown", onKeyDown);
      canvas.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const overlayCopy =
    status === "over"
      ? { eyebrow: "SLA breached", title: "Too many drops.", body: "Three requests hit full queues. Balance the load and use autoscaling before the next wave.", action: "Play again" }
      : status === "paused"
        ? { eyebrow: "Paused", title: "Traffic is holding.", body: "The queue is frozen. Resume when you are ready.", action: "Resume" }
        : {
            eyebrow: "Capacity planning",
            title: "Throughput.",
            body: "Requests fall toward the router. Move it to a server with room. Three dropped requests and the SLA is breached.",
            action: "Start throughput",
          };

  return (
    <div className="grid gap-10 lg:grid-cols-[0.62fr_1.38fr] lg:gap-16">
      <div className="order-2 lg:order-1">
        <p className="max-w-[38ch] text-[16px] leading-[1.75] text-soft">
          Keep every queue below capacity. Route each request to a server with room, and autoscale before a wave hits.
        </p>

        <dl className="mt-8 border-t border-line">
          <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-4 border-b border-line py-3">
            <dt className="eyebrow">Controls</dt>
            <dd className="text-[14px] text-soft">Arrows / A-D, or click a server</dd>
          </div>
          <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-4 border-b border-line py-3">
            <dt className="eyebrow">Capacity</dt>
            <dd className="text-[14px] text-soft">Three concurrent requests per server</dd>
          </div>
          <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-4 border-b border-line py-3">
            <dt className="eyebrow">Autoscale</dt>
            <dd className="text-[14px] text-soft">Space adds a fourth slot for 4s, 9s cooldown</dd>
          </div>
          <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-4 border-b border-line py-3">
            <dt className="eyebrow">Best</dt>
            <dd className="text-[14px] text-soft">{best} points, saved in this browser</dd>
          </div>
        </dl>

        <p className="mt-6 font-mono text-[11px] uppercase leading-[1.7] tracking-[0.14em] text-muted">Models queue depth, backpressure, load balancing and autoscaling.</p>
      </div>

      <div className="game-shell order-1 lg:order-2">
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
          <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            <span className={`h-1.5 w-1.5 rounded-full ${status === "running" ? "bg-white" : "bg-line-strong"}`} aria-hidden="true" />
            Incident / Throughput_01
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{status === "running" ? "Live" : status === "paused" ? "Paused" : status === "over" ? "Breached" : "Standby"}</span>
        </div>

        <div className="relative">
          <canvas
            ref={canvasRef}
            className="game-canvas"
            tabIndex={0}
            role="application"
            aria-label="Throughput game. Requests fall toward a router. Move the router left and right to route them to servers with capacity. Use space to autoscale. Three dropped requests end the game."
            data-cursor="native"
          />

          {status !== "running" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 px-6 text-center backdrop-blur-[2px]">
              <span className="eyebrow">{overlayCopy.eyebrow}</span>
              <h3 className="display-3 mt-3">{overlayCopy.title}</h3>
              <p className="mt-3 max-w-[30rem] text-[14px] leading-[1.7] text-muted">{overlayCopy.body}</p>
              <button
                type="button"
                onClick={() => {
                  if (status === "paused") controlsRef.current.resume();
                  else controlsRef.current.start();
                }}
                className="btn btn-solid mt-6"
              >
                {status === "over" ? <RotateCcw className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4 fill-current" aria-hidden="true" />}
                {overlayCopy.action}
              </button>
              {status === "over" && (
                <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                  Score {score} · Best {best}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line px-4 py-3">
          <dl className="flex flex-wrap items-center gap-x-5 gap-y-1" aria-hidden="true">
            <div className="flex items-baseline gap-1.5">
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Score</dt>
              <dd className="mono text-[15px] text-white">{score}</dd>
            </div>
            <div className="flex items-baseline gap-1.5">
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Combo</dt>
              <dd className="mono text-[15px] text-white">x{combo}</dd>
            </div>
            <div className="flex items-baseline gap-1.5">
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Drops</dt>
              <dd className="mono text-[15px] text-white">{drops}</dd>
            </div>
            <div className="flex items-baseline gap-1.5">
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Traffic</dt>
              <dd className="mono text-[15px] text-white">x{wave}</dd>
            </div>
            <div className="flex items-baseline gap-1.5">
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Best</dt>
              <dd className="mono text-[15px] text-white">{best}</dd>
            </div>
          </dl>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => controlsRef.current.scale()}
              disabled={status !== "running" || scaleReady > 0}
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:border-line-strong hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Zap className="h-3 w-3" aria-hidden="true" /> {scaleReady > 0 ? `Scale ${scaleReady}s` : "Scale"}
            </button>
            {status === "running" ? (
              <button type="button" onClick={() => controlsRef.current.pause()} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:border-line-strong hover:text-white">
                <Pause className="h-3 w-3" aria-hidden="true" /> Pause
              </button>
            ) : (
              <button
                type="button"
                onClick={() => (status === "paused" ? controlsRef.current.resume() : controlsRef.current.start())}
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:border-line-strong hover:text-white"
              >
                <Play className="h-3 w-3" aria-hidden="true" /> {status === "paused" ? "Resume" : "Start"}
              </button>
            )}
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {status === "running" ? "Game started." : status === "paused" ? "Game paused." : status === "over" ? `Game over. Score ${score}. Best ${best}.` : ""}
        </p>
      </div>
    </div>
  );
}
