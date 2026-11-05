import { useEffect, useRef } from "react";
import * as THREE from "three";

type MaterialEntry = { material: THREE.Material; base: number };

type Variant = {
  group: THREE.Group;
  materials: MaterialEntry[];
  current: number;
  update?: (time: number) => void;
};

const ADDITIVE = THREE.AdditiveBlending;

function canvasGlowTexture(THREE_NS: typeof THREE) {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (context) {
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(255,255,255,0.9)");
    gradient.addColorStop(0.3, "rgba(255,255,255,0.25)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
  }
  return new THREE_NS.CanvasTexture(canvas);
}

/**
 * One fixed WebGL canvas for the whole page. Each section maps to a
 * different scene, and the scenes cross-fade as the active section
 * changes. The hero keeps its own dedicated scene.
 */
export default function AmbientScene({ active }: { active: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  const kickRef = useRef<() => void>(() => {});

  useEffect(() => {
    activeRef.current = active;
    kickRef.current();
  }, [active]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 767px)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 10);

    const disposables: Array<{ dispose: () => void }> = [];
    const track = <T extends { dispose: () => void }>(item: T) => {
      disposables.push(item);
      return item;
    };

    const variants: Record<string, Variant> = {};

    const register = (key: string, group: THREE.Group, entries: Array<[THREE.Material, number]>, update?: (time: number) => void) => {
      group.visible = false;
      scene.add(group);
      variants[key] = {
        group,
        materials: entries.map(([material, base]) => ({ material, base })),
        current: 0,
        update,
      };
    };

    // -----------------------------------------------------------------
    // Work: an animated wireframe terrain.
    // -----------------------------------------------------------------
    {
      const geometry = track(new THREE.PlaneGeometry(12, 9, small ? 22 : 36, small ? 16 : 26));
      const material = track(new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0, depthWrite: false, blending: ADDITIVE }));
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 2 + 0.32;
      mesh.position.set(3.4, -4.0, -2.5);
      const group = new THREE.Group();
      group.add(mesh);
      const base = Float32Array.from(geometry.attributes.position.array as ArrayLike<number>);
      const update = (time: number) => {
        const position = geometry.attributes.position;
        for (let i = 0; i < position.count; i += 1) {
          const x = base[i * 3];
          const y = base[i * 3 + 1];
          position.setZ(i, Math.sin(x * 0.55 + time * 0.7) * 0.36 + Math.cos(y * 0.65 + time * 0.55) * 0.26);
        }
        position.needsUpdate = true;
        group.rotation.y = Math.sin(time * 0.05) * 0.08;
      };
      register("work", group, [[material, 0.055]], update);
    }

    // -----------------------------------------------------------------
    // About: a dotted Earth with request arcs and travelling arrows.
    // -----------------------------------------------------------------
    {
      const group = new THREE.Group();
      const count = small ? 420 : 820;
      const radius = 1.55;
      const golden = Math.PI * (3 - Math.sqrt(5));
      const positions = new Float32Array(count * 3);
      const globePoints: THREE.Vector3[] = [];

      for (let i = 0; i < count; i += 1) {
        const y = 1 - (i / Math.max(count - 1, 1)) * 2;
        const ring = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = golden * i;
        const point = new THREE.Vector3(Math.cos(theta) * ring * radius, y * radius, Math.sin(theta) * ring * radius);
        positions[i * 3] = point.x;
        positions[i * 3 + 1] = point.y;
        positions[i * 3 + 2] = point.z;
        globePoints.push(point);
      }

      const pointGeometry = track(new THREE.BufferGeometry());
      pointGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const pointMaterial = track(
        new THREE.PointsMaterial({ color: 0xffffff, size: small ? 0.03 : 0.035, transparent: true, opacity: 0, depthWrite: false, blending: ADDITIVE, sizeAttenuation: true }),
      );
      group.add(new THREE.Points(pointGeometry, pointMaterial));

      const ringGeometry = track(new THREE.TorusGeometry(radius, 0.004, 4, 120));
      const ringMaterial = track(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, blending: ADDITIVE }));
      const equator = new THREE.Mesh(ringGeometry, ringMaterial);
      equator.rotation.x = Math.PI / 2;
      group.add(equator);
      const meridian = new THREE.Mesh(ringGeometry, ringMaterial);
      meridian.rotation.y = Math.PI / 2;
      group.add(meridian);

      const arcMaterial = track(new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, blending: ADDITIVE }));
      const arrowMaterial = track(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, blending: ADDITIVE }));
      const arrowGeometry = track(new THREE.ConeGeometry(0.05, 0.12, 3));
      const arcs: Array<{ curve: THREE.QuadraticBezierCurve3; arrow: THREE.Mesh }> = [];
      const pairs = [
        [0.08, 0.42],
        [0.55, 0.86],
        [0.2, 0.74],
      ];

      for (const [from, to] of pairs) {
        const a = globePoints[Math.floor(from * (count - 1))];
        const b = globePoints[Math.floor(to * (count - 1))];
        const control = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(radius * 1.6);
        const curve = new THREE.QuadraticBezierCurve3(a, control, b);
        const arcGeometry = track(new THREE.BufferGeometry().setFromPoints(curve.getPoints(48)));
        group.add(new THREE.Line(arcGeometry, arcMaterial));
        const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
        group.add(arrow);
        arcs.push({ curve, arrow });
      }

      const glowTexture = track(canvasGlowTexture(THREE));
      const glowMaterial = track(new THREE.SpriteMaterial({ map: glowTexture, transparent: true, opacity: 0, depthWrite: false, blending: ADDITIVE }));
      const glow = new THREE.Sprite(glowMaterial);
      glow.scale.set(3.2, 3.2, 1);
      group.add(glow);

      group.position.set(6.0, 0.3, -3.0);
      group.scale.setScalar(1);
      const up = new THREE.Vector3(0, 1, 0);
      const update = (time: number) => {
        group.rotation.y = time * 0.055;
        group.rotation.x = Math.sin(time * 0.07) * 0.08;
        arcs.forEach(({ curve, arrow }, index) => {
          const progress = (time * 0.16 + index / arcs.length) % 1;
          const point = curve.getPoint(progress);
          const tangent = curve.getTangent(progress).normalize();
          arrow.position.copy(point);
          arrow.quaternion.setFromUnitVectors(up, tangent);
        });
      };
      register("about", group, [
        [pointMaterial, 0.55],
        [ringMaterial, 0.11],
        [arcMaterial, 0.17],
        [arrowMaterial, 0.8],
        [glowMaterial, 0.1],
      ], update);
    }

    // -----------------------------------------------------------------
    // Experience: a vertical career timeline with a travelling node.
    // -----------------------------------------------------------------
    {
      const group = new THREE.Group();
      const lineGeometry = track(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -3.2, 0), new THREE.Vector3(0, 3.2, 0)]));
      const lineMaterial = track(new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, blending: ADDITIVE }));
      group.add(new THREE.Line(lineGeometry, lineMaterial));

      const tickGeometry = track(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-0.18, 0, 0), new THREE.Vector3(0.18, 0, 0)]));
      const tickMaterial = track(new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, blending: ADDITIVE }));
      const nodeGeometry = track(new THREE.RingGeometry(0.07, 0.1, 16));
      const nodeMaterial = track(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, blending: ADDITIVE, side: THREE.DoubleSide }));
      const nodes: THREE.Mesh[] = [];

      for (let i = 0; i < 6; i += 1) {
        const y = -2.8 + i * 1.12;
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.y = y;
        group.add(node);
        nodes.push(node);
        const tick = new THREE.Line(tickGeometry, tickMaterial);
        tick.position.y = y;
        group.add(tick);
      }

      const dotGeometry = track(new THREE.SphereGeometry(0.07, 8, 8));
      const dotMaterial = track(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, blending: ADDITIVE }));
      const dot = new THREE.Mesh(dotGeometry, dotMaterial);
      group.add(dot);

      group.position.set(6.8, 0, -3.0);
      group.scale.setScalar(0.9);
      const update = (time: number) => {
        group.rotation.y = time * 0.1;
        group.rotation.z = Math.sin(time * 0.08) * 0.04;
        const progress = (time * 0.16) % 1;
        dot.position.y = -3.2 + progress * 6.4;
        dot.position.x = Math.sin(progress * Math.PI * 2) * 0.12;
        dot.position.z = Math.cos(progress * Math.PI * 2) * 0.12;
        nodes.forEach((node, index) => {
          node.scale.setScalar(0.9 + Math.sin(time * 1.1 + index) * 0.1);
        });
      };
      register("experience", group, [
        [lineMaterial, 0.12],
        [tickMaterial, 0.12],
        [nodeMaterial, 0.48],
        [dotMaterial, 0.95],
      ], update);
    }

    // -----------------------------------------------------------------
    // Stack: a rotating 3D point lattice.
    // -----------------------------------------------------------------
    {
      const group = new THREE.Group();
      const count = small ? 4 : 5;
      const spacing = 0.78;
      const offset = ((count - 1) * spacing) / 2;
      const points: number[] = [];
      const lines: number[] = [];
      const index = (x: number, y: number, z: number) => `${x}:${y}:${z}`;
      const position = new Map<string, THREE.Vector3>();

      for (let x = 0; x < count; x += 1) {
        for (let y = 0; y < count; y += 1) {
          for (let z = 0; z < count; z += 1) {
            const point = new THREE.Vector3(x * spacing - offset, y * spacing - offset, z * spacing - offset);
            points.push(point.x, point.y, point.z);
            position.set(index(x, y, z), point);
          }
        }
      }

      for (let x = 0; x < count; x += 1) {
        for (let y = 0; y < count; y += 1) {
          for (let z = 0; z < count; z += 1) {
            const from = position.get(index(x, y, z));
            if (!from) continue;
            const neighbours = [position.get(index(x + 1, y, z)), position.get(index(x, y + 1, z)), position.get(index(x, y, z + 1))];
            for (const to of neighbours) {
              if (!to) continue;
              lines.push(from.x, from.y, from.z, to.x, to.y, to.z);
            }
          }
        }
      }

      const lineGeometry = track(new THREE.BufferGeometry());
      lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(lines, 3));
      const lineMaterial = track(new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, blending: ADDITIVE }));
      group.add(new THREE.LineSegments(lineGeometry, lineMaterial));

      const pointGeometry = track(new THREE.BufferGeometry());
      pointGeometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
      const pointMaterial = track(new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, transparent: true, opacity: 0, depthWrite: false, blending: ADDITIVE, sizeAttenuation: true }));
      group.add(new THREE.Points(pointGeometry, pointMaterial));

      group.position.set(6.5, 0.1, -3.0);
      group.scale.setScalar(0.8);
      const update = (time: number) => {
        group.rotation.y = time * 0.12;
        group.rotation.x = Math.sin(time * 0.1) * 0.16;
      };
      register("stack", group, [
        [lineMaterial, 0.04],
        [pointMaterial, 0.24],
      ], update);
    }

    // -----------------------------------------------------------------
    // Play: a tunnel of rings.
    // -----------------------------------------------------------------
    {
      const group = new THREE.Group();
      const ringCount = small ? 10 : 16;
      const ringGeometry = track(new THREE.TorusGeometry(1.25, 0.006, 4, 96));
      const ringMaterial = track(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, blending: ADDITIVE }));
      const rings: THREE.Mesh[] = [];
      for (let i = 0; i < ringCount; i += 1) {
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.userData.offset = i;
        group.add(ring);
        rings.push(ring);
      }
      group.position.set(0, 0, -2);
      const span = ringCount * 1.15;
      const update = (time: number) => {
        for (const ring of rings) {
          const i = ring.userData.offset as number;
          ring.position.z = ((i * 1.15 + time * 0.9) % span) - span + 4;
          ring.rotation.z = time * 0.02 + i * 0.02;
        }
        group.rotation.x = Math.sin(time * 0.08) * 0.04;
      };
      register("play", group, [[ringMaterial, 0.075]], update);
    }

    // -----------------------------------------------------------------
    // Contact: a pulsing signal beacon.
    // -----------------------------------------------------------------
    {
      const group = new THREE.Group();
      const ringGeometry = track(new THREE.TorusGeometry(1.0, 0.008, 4, 96));
      const rings = [0, 1, 2].map((index) => {
        const material = track(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, blending: ADDITIVE }));
        const mesh = new THREE.Mesh(ringGeometry, material);
        group.add(mesh);
        return { mesh, material, base: 0.18 - index * 0.04 };
      });

      const glowTexture = track(canvasGlowTexture(THREE));
      const glowMaterial = track(new THREE.SpriteMaterial({ map: glowTexture, transparent: true, opacity: 0, depthWrite: false, blending: ADDITIVE }));
      const glow = new THREE.Sprite(glowMaterial);
      glow.scale.set(1.4, 1.4, 1);
      group.add(glow);

      group.position.set(6.4, 0.2, -2.6);
      group.scale.setScalar(0.85);
      const update = (time: number) => {
        rings.forEach(({ mesh }, index) => {
          const phase = (time * 0.22 + index / rings.length) % 1;
          mesh.scale.setScalar(0.45 + phase * 2.2);
          mesh.rotation.z = time * 0.1 + index * 0.4;
        });
        glow.scale.setScalar(1.25 + Math.sin(time * 0.9) * 0.15);
      };
      register("contact", group, [
        [rings[0].material, 0.12],
        [rings[1].material, 0.085],
        [rings[2].material, 0.055],
        [glowMaterial, 0.17],
      ], update);
    }

    // -----------------------------------------------------------------
    // Sizing and loop
    // -----------------------------------------------------------------
    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      const safeWidth = Math.max(width, 1);
      const safeHeight = Math.max(height, 1);
      renderer.setSize(safeWidth, safeHeight, false);
      camera.aspect = safeWidth / safeHeight;
      camera.updateProjectionMatrix();
      kickRef.current();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    const clock = new THREE.Clock();
    let frameId = 0;
    let visible = true;

    const loop = () => {
      frameId = 0;
      if (!visible || document.hidden) return;

      const time = clock.getElapsedTime();
      let anyVisible = false;

      for (const [key, variant] of Object.entries(variants)) {
        const target = activeRef.current === key ? 1 : 0;
        variant.current = reducedMotion ? target : variant.current + (target - variant.current) * 0.055;
        if (variant.current < 0.002) variant.current = 0;
        variant.group.visible = variant.current > 0.002;
        for (const entry of variant.materials) entry.material.opacity = entry.base * variant.current;
        if (variant.group.visible) {
          variant.update?.(reducedMotion ? 1.2 : time);
          anyVisible = true;
        }
      }

      renderer.render(scene, camera);

      if (reducedMotion) return;
      if (activeRef.current === "top" && !anyVisible) return;
      frameId = requestAnimationFrame(loop);
    };

    const kick = () => {
      if (frameId || !visible || document.hidden) return;
      frameId = requestAnimationFrame(loop);
    };
    kickRef.current = kick;
    kick();

    const onVisibilityChange = () => {
      if (document.hidden) {
        if (frameId) cancelAnimationFrame(frameId);
        frameId = 0;
      } else {
        kick();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      resizeObserver.disconnect();
      for (const item of disposables) item.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-85 [mask-image:linear-gradient(to_bottom,transparent_0%,#000_14%,#000_86%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,#000_14%,#000_86%,transparent_100%)]"
    />
  );
}
