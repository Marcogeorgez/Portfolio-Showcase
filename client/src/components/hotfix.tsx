import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Wrench } from "lucide-react";

type Status = "idle" | "running" | "paused" | "over";
type BugKind = "normal" | "fast" | "armored" | "splitter" | "critical" | "boss";
type PowerKind = "freeze" | "shield";

type Bug = {
  id: number;
  kind: BugKind;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  vy: number;
  hp: number;
  maxHp: number;
  flash: number;
};

type PowerUp = {
  id: number;
  kind: PowerKind;
  x: number;
  y: number;
  size: number;
  vy: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
};

type RainDrop = {
  x: number;
  y: number;
  speed: number;
  char: string;
  size: number;
};

const BEST_KEY = "hotfix-best-v2";
const PATCH_TARGET = 12;
const BUG_LABELS: Record<BugKind, string[]> = {
  normal: ["NullReference", "Timeout", "500", "CORS", "Memory leak", "404"],
  fast: ["Timeout", "Race", "404", "Off by one", "CORS"],
  armored: ["Deadlock", "Memory leak", "N+1 query", "Auth bypass"],
  splitter: ["Race condition", "Off by one", "Split brain"],
  critical: ["P0 incident", "Data loss", "Auth bypass"],
  boss: ["PRODUCTION DOWN"],
};
const BUG_STATS: Record<BugKind, { hp: number; speed: number; height: number; pad: number; font: number; score: number }> = {
  normal: { hp: 1, speed: 70, height: 40, pad: 32, font: 17, score: 10 },
  fast: { hp: 1, speed: 116, height: 32, pad: 24, font: 15, score: 15 },
  armored: { hp: 2, speed: 54, height: 46, pad: 48, font: 17, score: 25 },
  splitter: { hp: 1, speed: 78, height: 40, pad: 44, font: 17, score: 20 },
  critical: { hp: 1, speed: 92, height: 40, pad: 48, font: 17, score: 35 },
  boss: { hp: 6, speed: 34, height: 64, pad: 44, font: 20, score: 120 },
};
const RAIN_CHARS = "01{}[]<>/\\|=-+*;:";

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

export function HotfixGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef({ start: () => {}, pause: () => {}, resume: () => {}, patch: () => {} });
  const bestRef = useRef(0);

  const [status, setStatus] = useState<Status>("idle");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [lives, setLives] = useState(3);
  const [best, setBest] = useState(0);
  const [wave, setWave] = useState(1);
  const [patch, setPatch] = useState(0);
  const [frozen, setFrozen] = useState(false);

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
    window.addEventListener("start-hotfix", startFromPalette);
    return () => window.removeEventListener("start-hotfix", startFromPalette);
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
    const LINE_Y = H - (narrow ? 46 : 54);
    const SPEED_SCALE = H / 520;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const game = {
      running: false,
      over: false,
      time: 0,
      score: 0,
      combo: 1,
      comboTimer: 0,
      lives: 3,
      wave: 1,
      squashed: 0,
      bugs: [] as Bug[],
      particles: [] as Particle[],
      powerups: [] as PowerUp[],
      spawn: 0.5,
      powerupTimer: 10,
      flash: 0,
      shake: 0,
      freezeUntil: 0,
      patch: 0,
      nextId: 1,
      bossWave: 0,
      reticle: { x: W / 2, y: H - 150, visible: false },
      keys: new Set<string>(),
      rain: Array.from({ length: narrow ? 18 : 30 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        speed: 16 + Math.random() * 40,
        char: RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)],
        size: 9 + Math.random() * 5,
      })) as RainDrop[],
    };

    let freezeState = false;

    const syncHud = () => {
      setScore(game.score);
      setCombo(game.combo);
      setLives(game.lives);
      setWave(game.wave);
      setPatch(game.patch);
    };

    const burst = (x: number, y: number, count: number) => {
      if (reducedMotion) return;
      for (let i = 0; i < count; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 40 + Math.random() * 190;
        game.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0.4 + Math.random() * 0.2,
          maxLife: 0.6,
          size: 2 + Math.random() * 3,
        });
      }
    };

    const makeBug = (kind: BugKind, x?: number, y?: number): Bug => {
      const stats = BUG_STATS[kind];
      const labels = BUG_LABELS[kind];
      const label = labels[Math.floor(Math.random() * labels.length)];
      ctx.font = `600 ${stats.font}px "Inter", system-ui, sans-serif`;
      const w = Math.ceil(ctx.measureText(label).width) + stats.pad;
      const h = stats.height;
      const speed = (stats.speed + Math.min(game.score, 600) * 0.18 + Math.random() * 18) * SPEED_SCALE;
      return {
        id: game.nextId++,
        kind,
        label,
        x: x ?? 18 + Math.random() * Math.max(1, W - w - 36),
        y: y ?? -h - 8,
        w,
        h,
        vy: speed,
        hp: stats.hp,
        maxHp: stats.hp,
        flash: 0,
      };
    };

    const spawnBug = (kind?: BugKind) => {
      if (kind) {
        game.bugs.push(makeBug(kind));
        return;
      }
      const roll = Math.random();
      const waveBoost = Math.min(game.wave * 0.02, 0.1);
      let next: BugKind = "normal";
      if (roll < 0.48) next = "normal";
      else if (roll < 0.66) next = "fast";
      else if (roll < 0.8 + waveBoost) next = "armored";
      else if (roll < 0.92 + waveBoost) next = "splitter";
      else next = "critical";
      game.bugs.push(makeBug(next));
    };

    const spawnBoss = () => {
      game.bugs.push(makeBug("boss"));
      game.flash = reducedMotion ? 0 : 0.2;
    };

    const spawnPowerUp = () => {
      const kind: PowerKind = Math.random() < 0.55 ? "freeze" : "shield";
      game.powerups.push({
        id: game.nextId++,
        kind,
        x: 40 + Math.random() * Math.max(1, W - 80),
        y: -50,
        size: 40,
        vy: 48 * SPEED_SCALE,
      });
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

    const destroyBug = (bug: Bug, bonus = 0) => {
      const index = game.bugs.indexOf(bug);
      if (index === -1) return;
      game.bugs.splice(index, 1);
      const base = BUG_STATS[bug.kind].score;
      game.combo = game.comboTimer > 0 ? Math.min(game.combo + 1, 5) : 1;
      game.comboTimer = 1.8;
      game.score += (base + bonus) * game.combo;
      game.squashed += 1;
      game.patch = Math.min(PATCH_TARGET, game.patch + 1);
      game.flash = reducedMotion ? 0 : 0.05;
      burst(bug.x + bug.w / 2, bug.y + bug.h / 2, bug.kind === "boss" ? 40 : 14);

      if (bug.kind === "splitter") {
        const left = makeBug("fast", bug.x - 12, bug.y);
        const right = makeBug("fast", bug.x + bug.w - left.w + 12, bug.y);
        game.bugs.push(left, right);
      }

      const nextWave = 1 + Math.floor(game.squashed / 20);
      if (nextWave !== game.wave) {
        game.wave = nextWave;
        if (nextWave % 3 === 0 && game.bossWave !== nextWave) {
          game.bossWave = nextWave;
          spawnBoss();
        }
      }
      syncHud();
    };

    const hitBug = (bug: Bug) => {
      if (bug.hp > 1) {
        bug.hp -= 1;
        bug.flash = 0.22;
        game.score += 2 * game.combo;
        burst(bug.x + bug.w / 2, bug.y + bug.h / 2, 7);
        syncHud();
        return;
      }
      destroyBug(bug);
    };

    const collectPowerUp = (powerUp: PowerUp) => {
      const index = game.powerups.indexOf(powerUp);
      if (index === -1) return;
      game.powerups.splice(index, 1);
      if (powerUp.kind === "freeze") {
        game.freezeUntil = game.time + 3;
      } else {
        game.lives = Math.min(3, game.lives + 1);
      }
      game.score += 20;
      game.flash = reducedMotion ? 0 : 0.1;
      burst(powerUp.x + powerUp.size / 2, powerUp.y + powerUp.size / 2, 18);
      syncHud();
    };

    const squashAt = (x: number, y: number) => {
      if (!game.running) return;

      for (let i = game.powerups.length - 1; i >= 0; i -= 1) {
        const powerUp = game.powerups[i];
        if (x >= powerUp.x - 8 && x <= powerUp.x + powerUp.size + 8 && y >= powerUp.y - 8 && y <= powerUp.y + powerUp.size + 8) {
          collectPowerUp(powerUp);
          return;
        }
      }

      for (let i = game.bugs.length - 1; i >= 0; i -= 1) {
        const bug = game.bugs[i];
        if (x >= bug.x - 10 && x <= bug.x + bug.w + 10 && y >= bug.y - 10 && y <= bug.y + bug.h + 10) {
          hitBug(bug);
          return;
        }
      }
    };

    const deployPatch = () => {
      if (!game.running || game.patch < PATCH_TARGET) return;
      const bugs = [...game.bugs];
      for (const bug of bugs) {
        if (bug.kind === "boss") {
          bug.hp -= 3;
          if (bug.hp <= 0) destroyBug(bug, 60);
          else {
            bug.flash = 0.35;
            burst(bug.x + bug.w / 2, bug.y + bug.h / 2, 18);
          }
        } else {
          destroyBug(bug, 8);
        }
      }
      game.patch = 0;
      game.score += 30;
      game.flash = reducedMotion ? 0 : 0.24;
      game.shake = reducedMotion ? 0 : 8;
      syncHud();
    };

    const drawRain = () => {
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = "left";
      for (const drop of game.rain) {
        ctx.font = `${drop.size}px "JetBrains Mono", monospace`;
        ctx.fillStyle = "rgba(255,255,255,0.05)";
        ctx.fillText(drop.char, drop.x, drop.y);
      }
    };

    const drawBackground = () => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, W, H);
      drawRain();

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

      const glow = ctx.createRadialGradient(W / 2, H * 0.35, 0, W / 2, H * 0.35, W * 0.55);
      glow.addColorStop(0, "rgba(255,255,255,0.045)");
      glow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      const shift = (game.time * 38) % 32;
      for (let x = -32 + shift; x < W + 32; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, LINE_Y - 14);
        ctx.lineTo(x + 10, LINE_Y - 8);
        ctx.lineTo(x, LINE_Y - 2);
        ctx.stroke();
      }

      ctx.setLineDash([9, 9]);
      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, LINE_Y);
      ctx.lineTo(W, LINE_Y);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = `500 ${narrow ? 11 : 10}px "JetBrains Mono", monospace`;
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.textAlign = "left";
      ctx.fillText("PRODUCTION", 18, LINE_Y + 26);
      if (!narrow) {
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.textAlign = "right";
        ctx.fillText("3 ESCAPES = FAILED DEPLOY", W - 18, LINE_Y + 26);
        ctx.textAlign = "left";
      }

      if (freezeState) {
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.font = `600 ${narrow ? 10 : 11}px "JetBrains Mono", monospace`;
        ctx.textAlign = "center";
        ctx.fillText("FROZEN", W / 2, 24);
        ctx.textAlign = "left";
      }
    };

    const drawBug = (bug: Bug) => {
      const danger = bug.y + bug.h > LINE_Y - 120;
      const critical = bug.kind === "critical" || bug.kind === "boss";
      const inverted = danger || critical;
      const stats = BUG_STATS[bug.kind];
      const flash = bug.flash > 0;
      const left = bug.x;
      const top = bug.y;

      if (inverted) {
        ctx.fillStyle = "#000000";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = bug.kind === "boss" ? 2 : 1.5;
      } else {
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;
      }
      roundRect(ctx, left, top, bug.w, bug.h, bug.h / 2);
      ctx.fill();
      if (inverted || flash) ctx.stroke();
      if (flash) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        roundRect(ctx, left, top, bug.w, bug.h, bug.h / 2);
        ctx.stroke();
      }

      ctx.fillStyle = inverted ? "#ffffff" : "#000000";
      ctx.font = `600 ${stats.font}px "Inter", system-ui, sans-serif`;
      ctx.textBaseline = "middle";
      const textY = top + bug.h / 2 + 0.5;
      ctx.fillText(bug.label, left + (narrow ? 12 : 15), textY);

      const tagX = left + bug.w - 10;
      if (bug.kind === "armored") {
        for (let i = 0; i < bug.maxHp; i += 1) {
          ctx.fillStyle = i < bug.hp ? (inverted ? "#ffffff" : "#000000") : "rgba(128,128,128,0.4)";
          ctx.fillRect(tagX - 6 - i * 8, top + bug.h / 2 - 3, 4, 6);
        }
      } else if (bug.kind === "splitter") {
        ctx.fillStyle = inverted ? "#ffffff" : "#000000";
        ctx.font = '600 10px "JetBrains Mono", monospace';
        ctx.textAlign = "right";
        ctx.fillText("x2", tagX, textY);
        ctx.textAlign = "left";
      } else if (bug.kind === "critical") {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.strokeRect(tagX - 18, top + bug.h / 2 - 7, 16, 14);
        ctx.fillStyle = "#ffffff";
        ctx.font = '600 9px "JetBrains Mono", monospace';
        ctx.textAlign = "center";
        ctx.fillText("P0", tagX - 10, textY);
        ctx.textAlign = "left";
      } else if (bug.kind === "boss") {
        const barWidth = bug.w - 20;
        const barY = top + bug.h + 7;
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = 1;
        ctx.strokeRect(left + 10, barY, barWidth, 5);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(left + 10, barY, barWidth * (bug.hp / bug.maxHp), 5);
      }

      ctx.textBaseline = "alphabetic";
    };

    const drawPowerUp = (powerUp: PowerUp) => {
      const left = powerUp.x;
      const top = powerUp.y;
      ctx.fillStyle = "#000000";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      roundRect(ctx, left, top, powerUp.size, powerUp.size, 8);
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);

      const cx = left + powerUp.size / 2;
      const cy = top + powerUp.size / 2 - 2;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      if (powerUp.kind === "freeze") {
        for (let i = 0; i < 3; i += 1) {
          const angle = (i / 3) * Math.PI;
          ctx.moveTo(cx - Math.cos(angle) * 9, cy - Math.sin(angle) * 9);
          ctx.lineTo(cx + Math.cos(angle) * 9, cy + Math.sin(angle) * 9);
        }
      } else {
        ctx.moveTo(cx, cy - 9);
        ctx.lineTo(cx + 9, cy - 4);
        ctx.lineTo(cx + 7, cy + 6);
        ctx.lineTo(cx, cy + 10);
        ctx.lineTo(cx - 7, cy + 6);
        ctx.lineTo(cx - 9, cy - 4);
        ctx.closePath();
      }
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = '600 10px "JetBrains Mono", monospace';
      ctx.textAlign = "center";
      ctx.fillText(powerUp.kind === "freeze" ? "FREEZE" : "SHIELD", cx, top + powerUp.size - 6);
      ctx.textAlign = "left";
    };

    const draw = () => {
      ctx.save();
      if (game.shake > 0) {
        ctx.translate((Math.random() - 0.5) * game.shake, (Math.random() - 0.5) * game.shake);
      }

      drawBackground();

      if (!game.running && !game.over && game.bugs.length === 0 && !narrow) {
        const demo = makeBug("normal", 120, 110);
        demo.label = "NullReference";
        demo.w = 168;
        ctx.globalAlpha = 0.28;
        drawBug(demo);
        const demo2 = makeBug("armored", 380, 190);
        demo2.label = "Deadlock";
        demo2.w = 150;
        drawBug(demo2);
        const demo3 = makeBug("critical", 640, 100);
        demo3.label = "P0 incident";
        demo3.w = 168;
        drawBug(demo3);
        ctx.globalAlpha = 1;
      }

      for (const powerUp of game.powerups) drawPowerUp(powerUp);
      for (const bug of game.bugs) drawBug(bug);

      for (const particle of game.particles) {
        ctx.globalAlpha = Math.max(particle.life / particle.maxLife, 0);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
      }
      ctx.globalAlpha = 1;

      if (game.reticle.visible) {
        const { x, y } = game.reticle;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - 28, y);
        ctx.lineTo(x - 9, y);
        ctx.moveTo(x + 9, y);
        ctx.lineTo(x + 28, y);
        ctx.moveTo(x, y - 28);
        ctx.lineTo(x, y - 9);
        ctx.moveTo(x, y + 9);
        ctx.lineTo(x, y + 28);
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x - 2, y - 2, 4, 4);
      }

      if (game.flash > 0) {
        ctx.fillStyle = `rgba(255,255,255,${game.flash * 0.55})`;
        ctx.fillRect(0, 0, W, H);
      }

      ctx.restore();
    };

    const update = (dt: number) => {
      game.time += dt;

      if (game.comboTimer > 0) {
        game.comboTimer -= dt;
        if (game.comboTimer <= 0 && game.combo > 1) {
          game.combo = 1;
          syncHud();
        }
      }

      const frozenNow = game.freezeUntil > game.time;
      if (frozenNow !== freezeState) {
        freezeState = frozenNow;
        setFrozen(frozenNow);
      }

      game.spawn -= dt;
      if (game.spawn <= 0) {
        spawnBug();
        if (game.wave >= 3 && Math.random() < 0.12) spawnBug("fast");
        game.spawn = Math.max(0.36, 0.95 - game.wave * 0.07) + Math.random() * 0.28;
      }

      game.powerupTimer -= dt;
      if (game.powerupTimer <= 0) {
        spawnPowerUp();
        game.powerupTimer = 13 + Math.random() * 7;
      }

      for (let i = game.bugs.length - 1; i >= 0; i -= 1) {
        const bug = game.bugs[i];
        bug.y += bug.vy * (frozenNow ? 0.3 : 1) * dt;
        if (bug.flash > 0) bug.flash = Math.max(0, bug.flash - dt * 2.5);
        if (bug.y + bug.h < LINE_Y) continue;

        game.bugs.splice(i, 1);
        const penalty = bug.kind === "critical" ? 2 : bug.kind === "boss" ? 3 : 1;
        game.lives = Math.max(0, game.lives - penalty);
        game.combo = 1;
        game.comboTimer = 0;
        game.flash = reducedMotion ? 0 : 0.32;
        game.shake = reducedMotion ? 0 : 9;
        syncHud();
        if (game.lives <= 0) {
          endGame();
          return;
        }
      }

      for (let i = game.powerups.length - 1; i >= 0; i -= 1) {
        const powerUp = game.powerups[i];
        powerUp.y += powerUp.vy * dt;
        if (powerUp.y > LINE_Y) game.powerups.splice(i, 1);
      }

      for (let i = game.particles.length - 1; i >= 0; i -= 1) {
        const particle = game.particles[i];
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        particle.vy += 180 * dt;
        particle.life -= dt;
        if (particle.life <= 0) game.particles.splice(i, 1);
      }

      if (!reducedMotion) {
        for (const drop of game.rain) {
          drop.y += drop.speed * dt;
          if (drop.y > H + 20) {
            drop.y = -20;
            drop.x = Math.random() * W;
            drop.char = RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)];
          }
        }
      }

      if (game.flash > 0) game.flash = Math.max(0, game.flash - dt * 1.6);
      if (game.shake > 0) game.shake = Math.max(0, game.shake - dt * 42);

      const keys = game.keys;
      let dx = 0;
      let dy = 0;
      if (keys.has("arrowleft") || keys.has("a")) dx -= 1;
      if (keys.has("arrowright") || keys.has("d")) dx += 1;
      if (keys.has("arrowup") || keys.has("w")) dy -= 1;
      if (keys.has("arrowdown") || keys.has("s")) dy += 1;
      if (dx !== 0 || dy !== 0) {
        const length = Math.hypot(dx, dy) || 1;
        game.reticle.x = Math.min(W - 24, Math.max(24, game.reticle.x + (dx / length) * 660 * dt));
        game.reticle.y = Math.min(LINE_Y - 24, Math.max(24, game.reticle.y + (dy / length) * 660 * dt));
        game.reticle.visible = true;
      }

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
      game.running = true;
      game.over = false;
      game.time = 0;
      game.score = 0;
      game.combo = 1;
      game.comboTimer = 0;
      game.lives = 3;
      game.wave = 1;
      game.squashed = 0;
      game.bugs = [];
      game.particles = [];
      game.powerups = [];
      game.spawn = 0.5;
      game.powerupTimer = 10;
      game.flash = 0;
      game.shake = 0;
      game.freezeUntil = 0;
      game.patch = 0;
      game.nextId = 1;
      game.bossWave = 0;
      game.reticle = { x: W / 2, y: H - 150, visible: false };
      game.keys.clear();
      freezeState = false;
      setFrozen(false);
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

    controlsRef.current = { start, pause, resume, patch: deployPatch };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.style.aspectRatio = `${W} / ${H}`;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!game.running) return;
      event.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * W;
      const y = ((event.clientY - rect.top) / rect.height) * H;
      game.reticle.visible = false;
      squashAt(x, y);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const movement = ["arrowleft", "arrowright", "arrowup", "arrowdown", "a", "d", "w", "s"];
      if (movement.includes(key)) {
        event.preventDefault();
        game.keys.add(key);
        game.reticle.visible = true;
        return;
      }
      if (key === " " || key === "enter") {
        event.preventDefault();
        if (game.running) squashAt(game.reticle.x, game.reticle.y);
        return;
      }
      if (key === "e") {
        event.preventDefault();
        deployPatch();
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
      ? { eyebrow: "Deploy failed", title: "Production is down.", body: "Too many bugs reached the line. Deploy a patch earlier and prioritize the critical ones.", action: "Play again" }
      : status === "paused"
        ? { eyebrow: "Paused", title: "Holding the line.", body: "The queue is frozen. Resume when you are ready.", action: "Resume" }
        : {
            eyebrow: "Incident response",
            title: "Hotfix.",
            body: "Bugs fall toward production. Some take two hits, some split. Fill the patch meter, then deploy. Three escapes and the release fails.",
            action: "Start hotfix",
          };

  return (
    <div className="grid gap-10 lg:grid-cols-[0.62fr_1.38fr] lg:gap-16">
      <div className="order-2 lg:order-1">
        <p className="max-w-[40ch] text-[16px] leading-[1.75] text-soft">
          Bugs fall toward the production line. Squash them before they land. Armored bugs take two hits, splitters break apart, and critical bugs cost two lives.
        </p>

        <dl className="mt-8 border-t border-line">
          <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-4 border-b border-line py-3">
            <dt className="eyebrow">Controls</dt>
            <dd className="text-[14px] text-soft">Click / tap, or arrows + space</dd>
          </div>
          <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-4 border-b border-line py-3">
            <dt className="eyebrow">Patch</dt>
            <dd className="text-[14px] text-soft">Fill the meter, then press E or deploy</dd>
          </div>
          <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-4 border-b border-line py-3">
            <dt className="eyebrow">Waves</dt>
            <dd className="text-[14px] text-soft">Every 20 squashes; boss every third wave</dd>
          </div>
          <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-4 border-b border-line py-3">
            <dt className="eyebrow">Best</dt>
            <dd className="text-[14px] text-soft">{best} points, saved in this browser</dd>
          </div>
        </dl>

        <p className="mt-6 font-mono text-[11px] uppercase leading-[1.8] tracking-[0.14em] text-muted">No sound. No tracking. Just a canvas and your reflexes.</p>
      </div>

      <div className="game-shell order-1 lg:order-2">
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
          <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            <span className={`h-1.5 w-1.5 rounded-full ${status === "running" ? "bg-white" : "bg-line-strong"}`} aria-hidden="true" />
            Incident / Hotfix_02
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            {frozen ? "Frozen" : status === "running" ? "Live" : status === "paused" ? "Paused" : status === "over" ? "Failed" : "Standby"}
          </span>
        </div>

        <div className="relative">
          <canvas
            ref={canvasRef}
            className="game-canvas"
            tabIndex={0}
            role="application"
            aria-label="Hotfix game. Bugs fall toward a production line. Click or tap bugs to squash them. Armored bugs take two hits, splitters break apart, critical bugs cost two lives. Use the arrow keys to aim and space to squash. Press E to deploy a patch."
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
                  Score {score} · Wave {wave} · Best {best}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-line px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
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
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Lives</dt>
                <dd className="mono text-[15px] text-white">{lives}</dd>
              </div>
              <div className="flex items-baseline gap-1.5">
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Wave</dt>
                <dd className="mono text-[15px] text-white">{wave}</dd>
              </div>
              <div className="flex items-baseline gap-1.5">
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Best</dt>
                <dd className="mono text-[15px] text-white">{best}</dd>
              </div>
            </dl>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => controlsRef.current.patch()}
                disabled={status !== "running" || patch < PATCH_TARGET}
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:border-line-strong hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Wrench className="h-3 w-3" aria-hidden="true" /> Deploy
              </button>
              {status === "running" ? (
                <button
                  type="button"
                  onClick={() => controlsRef.current.pause()}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:border-line-strong hover:text-white"
                >
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

          <div className="mt-3 flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Patch</span>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-line" aria-hidden="true">
              <div className="h-full bg-white transition-[width] duration-200" style={{ width: `${(patch / PATCH_TARGET) * 100}%` }} />
            </div>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              {patch}/{PATCH_TARGET}
            </span>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {status === "running" ? "Game started." : status === "paused" ? "Game paused." : status === "over" ? `Game over. Score ${score}. Wave ${wave}. Best ${best}.` : ""}
        </p>
      </div>
    </div>
  );
}
