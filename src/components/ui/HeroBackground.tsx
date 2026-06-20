"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 130;
const CONNECT_DIST = 4.2;
const MAX_LINES = PARTICLE_COUNT * 8;

function buildGlowTexture(): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0.0, "rgba(255,255,255,1)");
  g.addColorStop(0.2, "rgba(200,190,255,0.9)");
  g.addColorStop(0.5, "rgba(120,100,255,0.4)");
  g.addColorStop(1.0, "rgba(80,60,220,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

export function HeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // ── Renderer ─────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // ── Scene / Camera ───────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, el.clientWidth / el.clientHeight, 0.1, 120);
    camera.position.set(0, 0, 17);

    // ── Particles ────────────────────────────────────────────────────────────
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities: THREE.Vector3[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 9;
      velocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.007,
          (Math.random() - 0.5) * 0.007,
          (Math.random() - 0.5) * 0.003,
        ),
      );
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));

    const glowTex = buildGlowTexture();
    const pMat = new THREE.PointsMaterial({
      map: glowTex,
      color: new THREE.Color(0x818cf8),
      size: 0.32,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    scene.add(new THREE.Points(pGeo, pMat));

    // ── Connection lines ─────────────────────────────────────────────────────
    const lPos = new Float32Array(MAX_LINES * 2 * 3);
    const lCol = new Float32Array(MAX_LINES * 2 * 3);

    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute("position", new THREE.BufferAttribute(lPos, 3).setUsage(THREE.DynamicDrawUsage));
    lGeo.setAttribute("color",    new THREE.BufferAttribute(lCol, 3).setUsage(THREE.DynamicDrawUsage));

    const lMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    scene.add(new THREE.LineSegments(lGeo, lMat));

    // ── Ambient glow spheres (large, transparent) ────────────────────────────
    const glowData = [
      { pos: [-5, 2, -3] as const,  color: 0x6366f1, radius: 3.5 },
      { pos: [5,  -2, -5] as const, color: 0x7c3aed, radius: 2.8 },
      { pos: [0,  4,  -6] as const, color: 0x4f46e5, radius: 2.2 },
    ];
    glowData.forEach(({ pos, color, radius }) => {
      const geo = new THREE.SphereGeometry(radius, 16, 16);
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.04,
        side: THREE.FrontSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(pos[0], pos[1], pos[2]);
      scene.add(mesh);
    });

    // ── Mouse tracking ───────────────────────────────────────────────────────
    let mx = 0, my = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    // ── Resize ───────────────────────────────────────────────────────────────
    const onResize = () => {
      if (!el) return;
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // ── Animation loop ───────────────────────────────────────────────────────
    let raf: number;
    let time = 0;

    const C1 = new THREE.Color(0x6366f1);
    const C2 = new THREE.Color(0xa78bfa);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      time += 0.0015;

      // Update particle positions
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        positions[i * 3]     += velocities[i].x;
        positions[i * 3 + 1] += velocities[i].y;
        positions[i * 3 + 2] += velocities[i].z;

        if (Math.abs(positions[i * 3])     > 12) velocities[i].x *= -1;
        if (Math.abs(positions[i * 3 + 1]) > 7.5) velocities[i].y *= -1;
        if (Math.abs(positions[i * 3 + 2]) > 4.5) velocities[i].z *= -1;
      }
      pGeo.attributes.position.needsUpdate = true;

      // Build connection lines
      let li = 0;
      for (let i = 0; i < PARTICLE_COUNT && li < MAX_LINES - 1; i++) {
        for (let j = i + 1; j < PARTICLE_COUNT && li < MAX_LINES - 1; j++) {
          const dx = positions[i * 3]     - positions[j * 3];
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
          const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
          const d2 = dx * dx + dy * dy + dz * dz;

          if (d2 < CONNECT_DIST * CONNECT_DIST) {
            const alpha = 1 - Math.sqrt(d2) / CONNECT_DIST;
            const t = Math.sqrt(d2) / CONNECT_DIST;
            const c = C1.clone().lerp(C2, t);
            const b = li * 6;

            lPos[b]     = positions[i * 3];     lPos[b + 1] = positions[i * 3 + 1]; lPos[b + 2] = positions[i * 3 + 2];
            lPos[b + 3] = positions[j * 3];     lPos[b + 4] = positions[j * 3 + 1]; lPos[b + 5] = positions[j * 3 + 2];
            lCol[b]     = c.r * alpha;           lCol[b + 1] = c.g * alpha;           lCol[b + 2] = c.b * alpha;
            lCol[b + 3] = c.r * alpha;           lCol[b + 4] = c.g * alpha;           lCol[b + 5] = c.b * alpha;

            li++;
          }
        }
      }

      lGeo.attributes.position.needsUpdate = true;
      lGeo.attributes.color.needsUpdate = true;
      lGeo.setDrawRange(0, li * 2);

      // Camera: slow orbit + mouse parallax
      const targetX = mx * 2.5;
      const targetY = -my * 1.8 + Math.sin(time * 0.5) * 0.4;
      const targetZ = 17 + Math.sin(time * 0.35) * 1.2;

      camera.position.x += (targetX - camera.position.x) * 0.025;
      camera.position.y += (targetY - camera.position.y) * 0.025;
      camera.position.z += (targetZ - camera.position.z) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    tick();

    // ── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      renderer.dispose();
      pGeo.dispose();
      lGeo.dispose();
      pMat.dispose();
      lMat.dispose();
      glowTex.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden
    />
  );
}
