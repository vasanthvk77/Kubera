/**
 * GoldDustScene.jsx
 *
 * Three.js gold dust under a stat column.
 * Flakes fade out before they hit the canvas edge (no hard clip).
 * Nearby flakes drift with the mouse on hover.
 */
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

function makeGoldFlakeTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const c = size / 2;
  const grd = ctx.createRadialGradient(c, c, 0, c, c, c);
  grd.addColorStop(0, 'rgba(255, 248, 210, 1)');
  grd.addColorStop(0.18, 'rgba(255, 214, 90, 1)');
  grd.addColorStop(0.42, 'rgba(212, 175, 55, 0.85)');
  grd.addColorStop(0.7, 'rgba(184, 115, 51, 0.28)');
  grd.addColorStop(1, 'rgba(184, 115, 51, 0)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function edgeFade(value, falloff) {
  const t = Math.max(0, Math.min(1, value / falloff));
  return t * t * (3 - 2 * t);
}

export default function ({ active }) {
  const mountRef = useRef(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 20);
    camera.position.z = 8;

    const texture = makeGoldFlakeTexture();
    const COUNT = 36;
    const flakes = [];

    function spawn(w, h, fromTop) {
      const px = (Math.random() - 0.5) * w * 0.62;
      const py = fromTop
        ? h * 0.28 + Math.random() * (h * 0.12)
        : (Math.random() - 0.35) * h * 0.45;
      const size = 7 + Math.random() * 11;
      return {
        x: px,
        y: py,
        vx: (Math.random() - 0.5) * 0.16,
        vy: -(0.18 + Math.random() * 0.32),
        rot: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.035,
        size,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 1.6 + Math.random() * 2.4,
      };
    }

    const sprites = [];
    for (let i = 0; i < COUNT; i += 1) {
      const mat = new THREE.SpriteMaterial({
        map: texture,
        color: new THREE.Color('#ffd56a'),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0.92,
      });
      const sprite = new THREE.Sprite(mat);
      scene.add(sprite);
      sprites.push(sprite);
      flakes.push(spawn(220, 110, false));
    }

    function layout() {
      const w = Math.max(1, mount.clientWidth);
      const h = Math.max(1, mount.clientHeight);
      camera.left = -w / 2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = -h / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      return { w, h };
    }

    let { w, h } = layout();
    flakes.forEach((f, i) => {
      Object.assign(f, spawn(w, h, false));
      sprites[i].position.set(f.x, f.y, 0);
      sprites[i].scale.set(f.size, f.size, 1);
    });

    const mouse = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      inside: false,
      strength: 0,
    };
    let lastMx = 0;
    let lastMy = 0;

    function worldFromEvent(e) {
      const rect = mount.getBoundingClientRect();
      return {
        x: e.clientX - rect.left - rect.width / 2,
        y: -(e.clientY - rect.top - rect.height / 2),
      };
    }

    function onPointerEnter(e) {
      mouse.inside = true;
      const p = worldFromEvent(e);
      mouse.x = p.x;
      mouse.y = p.y;
      lastMx = p.x;
      lastMy = p.y;
    }

    function onPointerMove(e) {
      mouse.inside = true;
      const p = worldFromEvent(e);
      mouse.vx = p.x - lastMx;
      mouse.vy = p.y - lastMy;
      mouse.x = p.x;
      mouse.y = p.y;
      lastMx = p.x;
      lastMy = p.y;
    }

    function onPointerLeave() {
      mouse.inside = false;
      mouse.vx = 0;
      mouse.vy = 0;
    }

    mount.addEventListener('pointerenter', onPointerEnter);
    mount.addEventListener('pointermove', onPointerMove);
    mount.addEventListener('pointerleave', onPointerLeave);

    const ro = new ResizeObserver(() => {
      ({ w, h } = layout());
    });
    ro.observe(mount);

    let rafId = 0;
    let t = 0;
    let intensity = 0.7;
    const influence = 78;

    function tick() {
      rafId = requestAnimationFrame(tick);
      t += 0.016;
      const target = activeRef.current ? 1 : 0.72;
      intensity += (target - intensity) * 0.06;
      mouse.strength += ((mouse.inside ? 1 : 0) - mouse.strength) * 0.12;
      mouse.vx *= 0.86;
      mouse.vy *= 0.86;
      const fallBoost = 0.85 + intensity * 0.7;

      const padX = Math.max(28, w * 0.18);
      const padY = Math.max(26, h * 0.28);

      for (let i = 0; i < COUNT; i += 1) {
        const f = flakes[i];
        const sp = sprites[i];

        let ax = 0;
        let ay = 0;
        if (mouse.strength > 0.02) {
          const dx = f.x - mouse.x;
          const dy = f.y - mouse.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          if (dist < influence) {
            const pull = (1 - dist / influence) * mouse.strength;
            ax += mouse.vx * pull * 0.55;
            ay += mouse.vy * pull * 0.55;
            ax += (dx / dist) * pull * 0.22;
            ay += (dy / dist) * pull * 0.18;
          }
        }

        f.vx += ax;
        f.vy += ay;
        f.vx *= 0.96;
        f.vy = f.vy * 0.985 + (-0.22 * fallBoost) * 0.015;

        f.x += f.vx + Math.sin(t * 1.4 + f.twinkle) * 0.12;
        f.y += f.vy;
        f.rot += f.spin;

        const left = f.x - (-w / 2);
        const right = w / 2 - f.x;
        const top = h / 2 - f.y;
        const bottom = f.y - (-h / 2);
        const fade = Math.min(
          edgeFade(left, padX),
          edgeFade(right, padX),
          edgeFade(top, padY),
          edgeFade(bottom, padY),
        );

        if (fade <= 0.02 || bottom < 10) {
          Object.assign(f, spawn(w, h, true));
          continue;
        }

        const shine = 0.62 + 0.38 * Math.sin(t * f.twinkleSpeed + f.twinkle);
        sp.position.set(f.x, f.y, 0);
        sp.material.opacity = Math.min(1, (0.55 + intensity * 0.35 * shine) * fade);
        const s = f.size * (0.85 + shine * 0.35) * (0.9 + intensity * 0.18);
        sp.scale.set(s, s, 1);
        sp.material.rotation = f.rot;
      }

      renderer.render(scene, camera);
    }
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      mount.removeEventListener('pointerenter', onPointerEnter);
      mount.removeEventListener('pointermove', onPointerMove);
      mount.removeEventListener('pointerleave', onPointerLeave);
      sprites.forEach((s) => {
        s.material.dispose();
        scene.remove(s);
      });
      texture.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="mt-3 block h-[128px] w-full max-w-[260px] cursor-default"
      aria-hidden="true"
      style={{
        WebkitMaskImage: 'radial-gradient(ellipse 78% 62% at 50% 42%, #000 42%, transparent 78%)',
        maskImage: 'radial-gradient(ellipse 78% 62% at 50% 42%, #000 42%, transparent 78%)',
      }}
    />
  );
}
