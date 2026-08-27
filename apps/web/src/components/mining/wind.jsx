/**
 * WindStreaks.jsx
 *
 * Subtle directional wind effect for a hero section over a photo background
 * (e.g. wind-turbine landscape). Designed to sit quietly behind text, not
 * to be the star of the section.
 *
 * Technique:
 * - ~90 elongated streak particles (plane sprites stretched along velocity)
 * - Motion is mostly left→right with a gentle upward drift, matching how
 *   wind actually reads across a horizontal landscape shot
 * - A slow sine-driven "gust" cycle modulates speed + opacity so the
 *   motion has rhythm instead of a flat constant drift
 * - Warm, low-opacity off-white streaks (matches the site's gold/amber
 *   accent family rather than a generic cyan/green particle look)
 * - Ambient by default (no interaction required) — but streaks near the
 *   cursor bend toward the direction the cursor is MOVING (not just its
 *   position), like a localized gust. Effect decays back to ambient
 *   whenever the cursor stops or leaves the section.
 *
 * Canvas: absolute inset-0, pointer-events-none, sits behind foreground content.
 * The mouse listener is attached to window (not this div), so the div can
 * stay pointer-events:none and all real content underneath stays clickable.
 */
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

/* ─── Streak texture: soft horizontal gradient, tapered at both ends ── */
function makeStreakTexture() {
  const w = 128, h = 16;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const grd = ctx.createLinearGradient(0, 0, w, 0);
  grd.addColorStop(0.00, 'rgba(255,244,222,0)');
  grd.addColorStop(0.15, 'rgba(255,244,222,0.55)');
  grd.addColorStop(0.55, 'rgba(255,244,222,0.85)');
  grd.addColorStop(0.85, 'rgba(255,244,222,0.35)');
  grd.addColorStop(1.00, 'rgba(255,244,222,0)');
  ctx.fillStyle = grd;

  // soften vertically too, so it's not a hard-edged bar
  ctx.fillRect(0, 0, w, h);
  const vgrd = ctx.createLinearGradient(0, 0, 0, h);
  vgrd.addColorStop(0, 'rgba(0,0,0,1)');
  vgrd.addColorStop(0.5, 'rgba(255,255,255,1)');
  vgrd.addColorStop(1, 'rgba(0,0,0,1)');
  ctx.globalCompositeOperation = 'destination-in';
  ctx.fillStyle = vgrd;
  ctx.fillRect(0, 0, w, h);

  return new THREE.CanvasTexture(canvas);
}

function makeStreak(W, H) {
  return {
    x: (Math.random() - 0.5) * W * 1.3,
    y: (Math.random() - 0.5) * H,
    z: (Math.random() - 0.5) * 3,
    len: 0.6 + Math.random() * 1.6,        // streak length
    thick: 0.012 + Math.random() * 0.02,   // streak thickness
    speed: 0.55 + Math.random() * 0.85,    // individual pace variance
    wobble: Math.random() * Math.PI * 2,   // phase offset for vertical drift
    baseOpacity: 0.05 + Math.random() * 0.16,
  };
}

export default function WindStreaks() {
  const mountRef = useRef(null);

  // Cursor tracking — lives outside React state since it's read every
  // animation frame, not something we want triggering re-renders.
  const pointerRef = useRef({
    worldX: 0,
    worldY: 0,
    dirX: 0,      // normalized movement direction, decays to 0 when idle
    dirY: 0,
    intensity: 0, // 0..1, ramps up on movement, decays when idle/left
    active: false,
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth || window.innerWidth;
    const H = mount.clientHeight || 600;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    /* ── Scene / Camera ── */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 50);
    camera.position.set(0, 0, 6);

    const camH = 2 * Math.tan((50 / 2) * Math.PI / 180) * 6;
    const camW = camH * (W / H);

    /* ── Streak material ── */
    const tex = makeStreakTexture();
    const baseMat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });

    /* ── Build streak meshes ── */
    const COUNT = 90;
    const streaks = Array.from({ length: COUNT }, () => makeStreak(camW, camH));
    const geo = new THREE.PlaneGeometry(1, 1);
    const meshes = streaks.map((p) => {
      const m = new THREE.Mesh(geo, baseMat.clone());
      m.scale.set(p.len, p.thick, 1);
      scene.add(m);
      return m;
    });

    /* ── Cursor tracking ── */
    // Attached to window (not the pointer-events:none div) so foreground
    // content stays fully interactive while we still see cursor movement.
    const ptr = pointerRef.current;
    let lastClientX = null;
    let lastClientY = null;
    let idleTimeout = null;

    function handlePointerMove(e) {
      const rect = mount.getBoundingClientRect();
      // Only react while the cursor is over this section
      if (
        e.clientX < rect.left || e.clientX > rect.right ||
        e.clientY < rect.top || e.clientY > rect.bottom
      ) {
        ptr.active = false;
        return;
      }
      ptr.active = true;

      // Screen → world space (NDC → plane at z=0 in camera view)
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      ptr.worldX = nx * camW * 0.5;
      ptr.worldY = ny * camH * 0.5;

      if (lastClientX !== null) {
        const dx = e.clientX - lastClientX;
        const dy = -(e.clientY - lastClientY);
        const mag = Math.hypot(dx, dy);
        if (mag > 0.5) {
          // Normalize direction, blend toward it rather than snapping
          ptr.dirX += (dx / mag - ptr.dirX) * 0.3;
          ptr.dirY += (dy / mag - ptr.dirY) * 0.3;
          ptr.intensity = Math.min(1, ptr.intensity + mag * 0.02);
        }
      }
      lastClientX = e.clientX;
      lastClientY = e.clientY;

      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => { ptr.active = false; }, 400);
    }

    function handlePointerLeave() {
      ptr.active = false;
    }

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('mouseleave', handlePointerLeave, { passive: true });

    /* ── Resize ── */
    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(mount);

    /* ── Animation loop ── */
    let rafId;
    let time = 0;

    function animate() {
      rafId = requestAnimationFrame(animate);
      time += 0.01;

      // Slow gust cycle: base wind speed rhythmically surges and eases.
      // Combining two sine waves at different periods avoids an obviously
      // metronomic "breathing" feel.
      const gust =
        0.55 +
        0.30 * Math.sin(time * 0.35) +
        0.15 * Math.sin(time * 0.9 + 1.3);

      const hw = camW * 0.7;
      const hh = camH * 0.6;

      streaks.forEach((p, i) => {
        const mesh = meshes[i];

        // Mostly horizontal travel, slight upward bias, gentle vertical wobble
        const vx = (0.9 + p.speed * 0.4) * gust;
        const vy = 0.05 * gust + Math.sin(time * 0.6 + p.wobble) * 0.01;

        p.x += vx * 0.02;
        p.y += vy;

        // Wrap around when off-screen
        if (p.x > hw) {
          p.x = -hw;
          p.y = (Math.random() - 0.5) * camH;
          p.z = (Math.random() - 0.5) * 3;
        }
        if (p.y > hh) p.y = -hh;
        if (p.y < -hh) p.y = hh;

        mesh.position.set(p.x, p.y, p.z);

        // Slight tilt in travel direction — reinforces the sense of motion
        mesh.rotation.z = vy * 1.2;

        // Depth-based scale (closer = larger) and gust-linked opacity
        const depthScale = 1 + (p.z + 1.5) * 0.12;
        mesh.scale.set(p.len * depthScale, p.thick * depthScale, 1);

        const flicker = 0.85 + 0.15 * Math.sin(time * 2 + p.wobble * 3);
        mesh.material.opacity = Math.min(
          0.32,
          p.baseOpacity * (0.6 + gust * 0.6) * flicker
        );
      });

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      meshes.forEach((m) => {
        m.material.dispose();
        scene.remove(m);
      });
      geo.dispose();
      baseMat.dispose();
      tex.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    />
  );
}