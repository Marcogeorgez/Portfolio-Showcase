import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * A monochrome WebGL "system map": a point-cloud shell with connective
 * tissue, orbit rings and a soft core. Pointer parallax, slow rotation,
 * paused when offscreen. Renders a single static frame under reduced motion.
 */
export function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const isSmall = window.matchMedia("(max-width: 767px)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 9.2);

    const group = new THREE.Group();
    group.position.x = isSmall ? 0.45 : 1.35;
    scene.add(group);

    const disposables: Array<{ dispose: () => void }> = [];
    const track = <T extends { dispose: () => void }>(item: T) => {
      disposables.push(item);
      return item;
    };

    // ---------------------------------------------------------------
    // Point shell
    // ---------------------------------------------------------------
    const count = isSmall ? 300 : 680;
    const radius = 2.32;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const vectors: THREE.Vector3[] = [];

    for (let i = 0; i < count; i += 1) {
      const y = 1 - (i / Math.max(count - 1, 1)) * 2;
      const ring = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * i;
      const jitter = 0.93 + Math.random() * 0.14;
      const r = radius * jitter;
      const v = new THREE.Vector3(Math.cos(theta) * ring * r, y * r, Math.sin(theta) * ring * r);
      vectors.push(v);
      positions[i * 3] = v.x;
      positions[i * 3 + 1] = v.y;
      positions[i * 3 + 2] = v.z;
      phases[i] = Math.random() * Math.PI * 2;
    }

    const pointGeometry = track(new THREE.BufferGeometry());
    pointGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointGeometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));

    const pointMaterial = track(
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: 0.125 },
          uPixelRatio: { value: renderer.getPixelRatio() },
          uOpacity: { value: 0.82 },
        },
        vertexShader: /* glsl */ `
          attribute float aPhase;
          uniform float uTime;
          uniform float uSize;
          uniform float uPixelRatio;
          varying float vAlpha;

          void main() {
            vec3 p = position;
            p *= 1.0 + 0.018 * sin(uTime * 0.7 + aPhase);
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = uSize * uPixelRatio * (300.0 / max(-mv.z, 0.001)) * (0.7 + 0.3 * sin(uTime * 1.3 + aPhase));
            vAlpha = 0.5 + 0.5 * sin(uTime * 1.1 + aPhase);
          }
        `,
        fragmentShader: /* glsl */ `
          varying float vAlpha;
          uniform float uOpacity;

          void main() {
            float d = length(gl_PointCoord - vec2(0.5));
            float alpha = smoothstep(0.5, 0.08, d);
            gl_FragColor = vec4(1.0, 1.0, 1.0, alpha * vAlpha * uOpacity);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );

    const points = new THREE.Points(pointGeometry, pointMaterial);
    group.add(points);

    // ---------------------------------------------------------------
    // Connective lines (sparse nearest-neighbour pairs)
    // ---------------------------------------------------------------
    const linePositions: number[] = [];
    const maxDistance = isSmall ? 0.62 : 0.5;
    const maxLines = isSmall ? 420 : 900;
    let lineCount = 0;

    for (let i = 0; i < count && lineCount < maxLines; i += 1) {
      for (let j = i + 1; j < count && lineCount < maxLines; j += 1) {
        if (vectors[i].distanceTo(vectors[j]) > maxDistance) continue;
        linePositions.push(vectors[i].x, vectors[i].y, vectors[i].z, vectors[j].x, vectors[j].y, vectors[j].z);
        lineCount += 1;
      }
    }

    const lineGeometry = track(new THREE.BufferGeometry());
    lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMaterial = track(
      new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.06,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    group.add(new THREE.LineSegments(lineGeometry, lineMaterial));

    // ---------------------------------------------------------------
    // Orbit rings
    // ---------------------------------------------------------------
    const ringOne = track(new THREE.TorusGeometry(2.92, 0.004, 6, 240));
    const ringOneMaterial = track(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.18, depthWrite: false, blending: THREE.AdditiveBlending }));
    const ringMeshOne = new THREE.Mesh(ringOne, ringOneMaterial);
    ringMeshOne.rotation.set(Math.PI / 2.15, 0.2, 0.18);
    group.add(ringMeshOne);

    const ringTwo = track(new THREE.TorusGeometry(3.24, 0.003, 6, 240));
    const ringTwoMaterial = track(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08, depthWrite: false, blending: THREE.AdditiveBlending }));
    const ringMeshTwo = new THREE.Mesh(ringTwo, ringTwoMaterial);
    ringMeshTwo.rotation.set(Math.PI / 1.72, -0.35, 0.55);
    group.add(ringMeshTwo);

    // ---------------------------------------------------------------
    // Core glow
    // ---------------------------------------------------------------
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = 128;
    glowCanvas.height = 128;
    const glowContext = glowCanvas.getContext("2d");
    if (glowContext) {
      const gradient = glowContext.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, "rgba(255,255,255,0.85)");
      gradient.addColorStop(0.25, "rgba(255,255,255,0.28)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      glowContext.fillStyle = gradient;
      glowContext.fillRect(0, 0, 128, 128);
    }
    const glowTexture = track(new THREE.CanvasTexture(glowCanvas));
    const glowMaterial = track(new THREE.SpriteMaterial({ map: glowTexture, transparent: true, opacity: 0.48, depthWrite: false, blending: THREE.AdditiveBlending }));
    const glow = new THREE.Sprite(glowMaterial);
    glow.scale.set(1.3, 1.3, 1);
    group.add(glow);

    // ---------------------------------------------------------------
    // Sizing
    // ---------------------------------------------------------------
    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      const safeWidth = Math.max(width, 1);
      const safeHeight = Math.max(height, 1);
      renderer.setSize(safeWidth, safeHeight, false);
      camera.aspect = safeWidth / safeHeight;
      camera.updateProjectionMatrix();
    };

    resize();
    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reducedMotion) renderFrame(1.2);
    });
    resizeObserver.observe(mount);

    // ---------------------------------------------------------------
    // Pointer parallax
    // ---------------------------------------------------------------
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX / window.innerWidth - 0.5;
      pointerY = event.clientY / window.innerHeight - 0.5;
    };

    if (!reducedMotion && !coarsePointer) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    // ---------------------------------------------------------------
    // Render loop
    // ---------------------------------------------------------------
    const clock = new THREE.Clock();
    let frameId = 0;
    let visible = true;

    const renderFrame = (elapsed: number) => {
      targetX += (pointerX - targetX) * 0.04;
      targetY += (pointerY - targetY) * 0.04;

      group.rotation.y = elapsed * 0.055 + targetX * 0.5;
      group.rotation.x = Math.sin(elapsed * 0.18) * 0.08 + targetY * 0.3;
      group.rotation.z = Math.sin(elapsed * 0.12) * 0.04;

      ringMeshOne.rotation.z = 0.18 + elapsed * 0.05;
      ringMeshTwo.rotation.z = 0.55 - elapsed * 0.035;

      pointMaterial.uniforms.uTime.value = elapsed;
      glowMaterial.opacity = 0.4 + Math.sin(elapsed * 0.9) * 0.08;

      renderer.render(scene, camera);
    };

    const loop = () => {
      frameId = 0;
      if (!visible || document.hidden) return;
      renderFrame(clock.getElapsedTime());
      frameId = requestAnimationFrame(loop);
    };

    const kick = () => {
      if (frameId || reducedMotion) return;
      if (!visible || document.hidden) return;
      frameId = requestAnimationFrame(loop);
    };

    if (reducedMotion) {
      renderFrame(1.2);
    } else {
      kick();
    }

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (!visible && frameId) {
          cancelAnimationFrame(frameId);
          frameId = 0;
        } else {
          kick();
        }
      },
      { threshold: 0.05 },
    );
    intersectionObserver.observe(mount);

    const onVisibilityChange = () => {
      if (document.hidden && frameId) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      } else {
        kick();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      for (const item of disposables) item.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} aria-hidden="true" className="hero-scene-mask pointer-events-none absolute inset-0 h-full w-full">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_45%,rgba(255,255,255,0.07),transparent_55%)]" />
    </div>
  );
}

export default HeroScene;
