// /**
//  * WindScene.jsx
//  *
//  * Three.js 3D realistic wind/smoke flow effect.
//  *
//  * Technique:
//  * - 400 smoke particles rendered as billboard sprites (always face camera)
//  * - Each particle follows a 3D curl-noise-like flow field
//  * - Flow field is computed from layered sine waves in 3D → organic turbulence
//  * - Particles near the viewer are larger and more transparent
//  * - Hover: increases speed multiplier and spawns extra particles
//  * - Mouse leave: lerps speed back to idle
//  *
//  * Canvas: absolute inset-0, pointer-events-none, z-0 (behind content).
//  */
// import React, { useRef, useEffect } from 'react';
// import * as THREE from 'three';

// /* ─── Flow field helpers ─────────────────────────────────────────── */
// // Approximate curl noise using layered offset sine functions
// function flowAt(x, y, z, t, strength) {
//   const s = strength;
//   // x-direction influenced by y and z
//   const fx = Math.sin(y * 0.55 + t * 0.22) * Math.cos(z * 0.38 + t * 0.14) * s
//            + Math.sin(y * 1.1  + z * 0.7  + t * 0.18) * s * 0.4;
//   // y-direction — gentle upward bias + turbulence
//   const fy = (0.018 * s)
//            + Math.sin(x * 0.44 + t * 0.16) * Math.cos(z * 0.52 + t * 0.20) * s * 0.35;
//   // z-direction
//   const fz = Math.cos(x * 0.48 + t * 0.19) * Math.sin(y * 0.61 + t * 0.13) * s
//            + Math.cos(x * 0.9  + y * 0.55 + t * 0.24) * s * 0.3;
//   return { fx, fy, fz };
// }

// /* ─── Particle factory ───────────────────────────────────────────── */
// function makeParticle(W, H) {
//   return {
//     x    : (Math.random() - 0.5) * W,
//     y    : (Math.random() - 0.5) * H,
//     z    : (Math.random() - 0.5) * 4,
//     life : Math.random(),           // 0→1, wraps
//     speed: 0.4 + Math.random() * 0.6,
//     size : 0.08 + Math.random() * 0.22,
//     opacity: 0.03 + Math.random() * 0.10,
//   };
// }

// /* ─── Sprite texture — soft white disc ──────────────────────────── */
// function makeSpriteTexture() {
//   const size   = 64;
//   const canvas = document.createElement('canvas');
//   canvas.width = canvas.height = size;
//   const ctx = canvas.getContext('2d');
//   const grd = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
//   grd.addColorStop(0,    'rgba(255,255,255,1)');
//   grd.addColorStop(0.35, 'rgba(255,255,255,0.6)');
//   grd.addColorStop(0.7,  'rgba(255,255,255,0.15)');
//   grd.addColorStop(1,    'rgba(255,255,255,0)');
//   ctx.fillStyle = grd;
//   ctx.fillRect(0, 0, size, size);
//   return new THREE.CanvasTexture(canvas);
// }

// /* ─── Component ──────────────────────────────────────────────────── */
// export default function WindScene({ callbacksRef }) {
//   const mountRef    = useRef(null);
//   const hoverRef    = useRef(false);
//   const strengthRef = useRef({ cur: 0.012, target: 0.012 });

//   // Register hover callbacks so parent section can trigger them
//   useEffect(() => {
//     if (callbacksRef) {
//       callbacksRef.current.onEnter = () => {
//         hoverRef.current = true;
//         strengthRef.current.target = 0.038;
//       };
//       callbacksRef.current.onLeave = () => {
//         hoverRef.current = false;
//         strengthRef.current.target = 0.012;
//       };
//     }
//   }, [callbacksRef]);

//   const onMouseEnter = () => {
//     hoverRef.current = true;
//     strengthRef.current.target = 0.038;
//   };
//   const onMouseLeave = () => {
//     hoverRef.current = false;
//     strengthRef.current.target = 0.012;
//   };

//   useEffect(() => {
//     const mount = mountRef.current;
//     if (!mount) return;

//     const W = mount.clientWidth  || window.innerWidth;
//     const H = mount.clientHeight || 600;

//     /* ── Renderer ── */
//     const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
//     renderer.setSize(W, H);
//     renderer.setPixelRatio(1);           // intentionally low — smoke should be soft
//     renderer.setClearColor(0x000000, 0);
//     mount.appendChild(renderer.domElement);

//     /* ── Scene / Camera ── */
//     const scene  = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 50);
//     camera.position.set(0, 0, 6);

//     /* ── Sprite material ── */
//     const tex = makeSpriteTexture();
//     const mat = new THREE.SpriteMaterial({
//       map        : tex,
//       color      : new THREE.Color('#e8f0e8'),
//       transparent: true,
//       depthWrite : false,
//       blending   : THREE.AdditiveBlending,
//     });

//     /* ── Particles ── */
//     const COUNT   = 420;
//     const camH    = 2 * Math.tan((55 / 2) * Math.PI / 180) * 6;  // world height at z=0
//     const camW    = camH * (W / H);
//     const particles = Array.from({ length: COUNT }, () => makeParticle(camW, camH));
//     const sprites   = particles.map(() => {
//       const s = new THREE.Sprite(mat.clone());
//       scene.add(s);
//       return s;
//     });

//     /* ── Resize ── */
//     const ro = new ResizeObserver(() => {
//       const w = mount.clientWidth;
//       const h = mount.clientHeight;
//       camera.aspect = w / h;
//       camera.updateProjectionMatrix();
//       renderer.setSize(w, h);
//     });
//     ro.observe(mount);

//     /* ── RAF loop ── */
//     let rafId;
//     let time = 0;
//     const st = strengthRef.current;

//     function animate() {
//       rafId = requestAnimationFrame(animate);

//       /* Lerp strength toward target */
//       st.cur += (st.target - st.cur) * 0.035;
//       const s = st.cur;

//       time += 0.008 + (hoverRef.current ? 0.008 : 0);

//       particles.forEach((p, i) => {
//         /* Advance particle through flow field */
//         const { fx, fy, fz } = flowAt(p.x, p.y, p.z, time, s);
//         p.x += fx * p.speed;
//         p.y += fy * p.speed;
//         p.z += fz * p.speed * 0.5;

//         /* Wrap when out of view */
//         const hw = camW * 0.6, hh = camH * 0.6;
//         if (p.x >  hw) p.x = -hw;
//         if (p.x < -hw) p.x =  hw;
//         if (p.y >  hh) { p.x = (Math.random() - 0.5) * camW; p.y = -hh; }
//         if (p.y < -hh) p.y = hh;
//         if (p.z >  2.5) p.z = -2.5;
//         if (p.z < -2.5) p.z =  2.5;

//         /* Position sprite */
//         const sp = sprites[i];
//         sp.position.set(p.x, p.y, p.z);

//         /* Size: bigger when closer to camera (z > 0) */
//         const scaleFactor = hoverRef.current ? 1.45 : 1.0;
//         sp.scale.setScalar((p.size + (p.z + 2.5) * 0.04) * scaleFactor);

//         /* Opacity: fade by z depth + hover boost */
//         const baseOp = p.opacity * (0.5 + (p.z + 2.5) * 0.1);
//         sp.material.opacity = Math.min(0.28, baseOp * (hoverRef.current ? 1.7 : 1.0));
//       });

//       renderer.render(scene, camera);
//     }

//     animate();

//     return () => {
//       cancelAnimationFrame(rafId);
//       ro.disconnect();
//       sprites.forEach(s => {
//         s.material.dispose();
//         scene.remove(s);
//       });
//       tex.dispose();
//       renderer.dispose();
//       if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
//     };
//   }, []);

//   return (
//     <div
//       ref={mountRef}
//       onMouseEnter={onMouseEnter}
//       onMouseLeave={onMouseLeave}
//       style={{
//         position      : 'absolute',
//         inset         : 0,
//         zIndex        : 1,
//         pointerEvents : 'none',  // section content stays clickable
//       }}
//     />
//   );
// }




/**
 * WindBreeze.jsx
 *
 * Photoreal atmospheric breeze — small soft dust/pollen motes drifting
 * through real moving air, not a stylized graphic mark and not aimless
 * smoke. Built to sit behind hero text over a landscape photo.
 *
 * Physical model:
 * - Every particle is pushed by a WIND VECTOR (mostly rightward, slight
 *   upward buoyancy — dust drifts and gently rises) plus TURBULENCE
 *   (layered sine curl-noise) layered on top. Wind alone reads as a
 *   straight conveyor belt; turbulence alone reads as smoke. Together
 *   they read as actual air.
 * - A very slow, gentle GUST cycle modulates overall wind strength —
 *   barely perceptible speed changes, not a rhythmic push.
 * - DEPTH OF FIELD: particles near the camera (z > 0) are rendered
 *   larger and softer/dimmer (like an out-of-focus foreground mote);
 *   far particles are small, sharp points of light.
 * - VELOCITY IS SMOOTHED (lerped) frame to frame rather than applied
 *   instantly — this is what removes jitter and gives the slow, buttery
 *   "floating" quality instead of a twitchy drift, at any speed.
 * - Cursor movement locally disturbs nearby particles — bends their
 *   drift toward the cursor's travel direction — and decays back to
 *   ambient wind when idle. This is a nudge, not a takeover.
 *
 * Canvas: absolute inset-0, pointer-events-none, sits behind foreground content.
 */
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

/* ─── Soft radial dot texture — warm, not stylized ──────────────── */
function makeMoteTexture() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const grd = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  // Warm off-white core fading to transparent — genuine amber undertone,
  // not near-white, so it survives blending without washing to gray.
  grd.addColorStop(0, 'rgba(255,238,205,0.9)');
  grd.addColorStop(0.35, 'rgba(240,205,140,0.5)');
  grd.addColorStop(0.7, 'rgba(220,180,110,0.15)');
  grd.addColorStop(1, 'rgba(220,180,110,0)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

/* ─── Turbulence field: layered sine curl-noise (organic, not linear) ── */
function turbulenceAt(x, y, z, t, amount) {
  const fx = Math.sin(y * 0.35 + t * 0.06) * Math.cos(z * 0.25 + t * 0.04) * amount;
  const fy = Math.sin(x * 0.3 + t * 0.05) * Math.cos(z * 0.32 + t * 0.05) * amount * 0.6;
  const fz = Math.cos(x * 0.28 + t * 0.05) * Math.sin(y * 0.35 + t * 0.04) * amount * 0.5;
  return { fx, fy, fz };
}

function makeMote(W, H) {
  const depth = Math.random(); // 0 = far, 1 = near
  return {
    x: (Math.random() - 0.5) * W * 1.2,
    y: (Math.random() - 0.5) * H,
    z: (depth - 0.5) * 3.2,
    depth,
    baseSize: 0.03 + depth * 0.06 + Math.random() * 0.02,
    baseOpacity: (0.05 + Math.random() * 0.09) * (0.5 + depth * 0.5),
    driftRate: 0.7 + Math.random() * 0.7, // per-particle speed variance
    flicker: Math.random() * Math.PI * 2,
    flickerSpeed: 0.15 + Math.random() * 0.25,
    vx: 0, // smoothed velocity — lerped toward target each frame, never snaps
    vy: 0,
  };
}

export default function WindBreeze({ callbacksRef }) {
  const mountRef = useRef(null);

  const pointerRef = useRef({
    worldX: 0,
    worldY: 0,
    dirX: 0,
    dirY: 0,
    intensity: 0,
    active: false,
  });

  /* Section-level hover state — lerped between 0 (idle) and 1 (hovered) */
  const hoverRef = useRef({ cur: 0, target: 0 });

  useEffect(() => {
    if (callbacksRef) {
      callbacksRef.current.onEnter = () => { hoverRef.current.target = 1; };
      callbacksRef.current.onLeave = () => { hoverRef.current.target = 0; };
    }
  }, [callbacksRef]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth || window.innerWidth;
    const H = mount.clientHeight || 600;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    /* ── Scene / Camera ── */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 50);
    camera.position.set(0, 0, 6);

    const camH = 2 * Math.tan((50 / 2) * Math.PI / 180) * 6;
    const camW = camH * (W / H);

    /* ── Mote sprites ── */
    const tex = makeMoteTexture();
    const baseMat = new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const COUNT = 320;
    const motes = Array.from({ length: COUNT }, () => makeMote(camW, camH));
    const sprites = motes.map((m) => {
      const s = new THREE.Sprite(baseMat.clone());
      scene.add(s);
      return s;
    });

    /* ── Cursor tracking (window-level; div stays pointer-events:none) ── */
    const ptr = pointerRef.current;
    let lastClientX = null;
    let lastClientY = null;
    let idleTimeout = null;

    function handlePointerMove(e) {
      const rect = mount.getBoundingClientRect();
      if (
        e.clientX < rect.left || e.clientX > rect.right ||
        e.clientY < rect.top || e.clientY > rect.bottom
      ) {
        ptr.active = false;
        return;
      }
      ptr.active = true;

      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      ptr.worldX = nx * camW * 0.5;
      ptr.worldY = ny * camH * 0.5;

      if (lastClientX !== null) {
        const dx = e.clientX - lastClientX;
        const dy = -(e.clientY - lastClientY);
        const mag = Math.hypot(dx, dy);
        if (mag > 0.5) {
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
    function handlePointerLeave() { ptr.active = false; }

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
    const INFLUENCE_RADIUS = camW * 0.3;
    const hv = hoverRef.current;

    function animate() {
      rafId = requestAnimationFrame(animate);
      time += 0.004;

      // Lerp hover state (0 → idle, 1 → section is hovered)
      hv.cur += (hv.target - hv.cur) * 0.06;
      const h = hv.cur;

      // Very slow, gentle gust — speed drifts within a narrow band,
      // never surges. Long period (~150s+) so it's felt, not seen.
      // Hover boosts overall wind speed by ~55%.
      const gust = (0.85 + 0.15 * Math.sin(time * 0.12)) * (1 + h * 0.55);

      if (!ptr.active) ptr.intensity = Math.max(0, ptr.intensity - 0.02);

      const hw = camW * 0.65;
      const hh = camH * 0.6;

      motes.forEach((m, i) => {
        const sprite = sprites[i];

        // Base wind vector: mostly rightward, gentle upward buoyancy —
        // real dust doesn't fall, it drifts and slowly rises. Kept very
        // small — this is a breeze, not a gust front.
        let targetVx = (0.035 + m.driftRate * 0.015) * gust;
        let targetVy = (0.006 + m.driftRate * 0.002) * gust;

        // Turbulence layered on top — organic wobble, not pure straight drift
        const turb = turbulenceAt(m.x, m.y, m.z, time, 0.006 * gust);
        targetVx += turb.fx;
        targetVy += turb.fy;

        // Local cursor disturbance — bends nearby motes toward the
        // cursor's movement direction, fading with distance and idle time.
        if (ptr.intensity > 0.01) {
          const dx = m.x - ptr.worldX;
          const dy = m.y - ptr.worldY;
          const dist = Math.hypot(dx, dy);
          if (dist < INFLUENCE_RADIUS) {
            const falloff = 1 - dist / INFLUENCE_RADIUS;
            const pull = falloff * falloff * ptr.intensity;
            targetVx += ptr.dirX * pull * 0.25;
            targetVy += ptr.dirY * pull * 0.25;
          }
        }

        // Smooth toward the target velocity instead of snapping to it —
        // this single change is what removes jitter and makes the motion
        // read as slow and weighted rather than twitchy.
        m.vx += (targetVx - m.vx) * 0.015;
        m.vy += (targetVy - m.vy) * 0.015;
        m.z += turb.fz * 0.06;

        m.x += m.vx;
        m.y += m.vy;

        // Wrap around screen edges
        if (m.x > hw) { m.x = -hw; m.y = (Math.random() - 0.5) * camH; }
        if (m.x < -hw) m.x = hw;
        if (m.y > hh) m.y = -hh;
        if (m.y < -hh) m.y = hh;
        if (m.z > 1.8) m.z = -1.8;
        if (m.z < -1.8) m.z = 1.8;

        sprite.position.set(m.x, m.y, m.z);

        // Depth of field: near motes bigger + softer, far motes tiny + sharp
        // Hover scales motes up by ~65% and gives them a green tint.
        const nearness = (m.z + 1.8) / 3.6; // 0..1
        const scaleHover = 1 + h * 0.65;
        sprite.scale.setScalar(m.baseSize * (0.85 + nearness * 1.25) * scaleHover);

        // Warm greenish tint on hover (moves from amber → green/amber)
        const tintR = 1 - h * 0.15;
        const tintG = 1 + h * 0.25;
        const tintB = 1 - h * 0.35;
        sprite.material.color.setRGB(tintR, tintG, tintB);

        // Subtle twinkle, as if catching ambient light unevenly — slow,
        // barely-there shift, matching the calm drift speed.
        // Hover pushes cap from 0.2 → 0.45 so motes are clearly visible.
        const tw = 0.85 + 0.15 * Math.sin(time * m.flickerSpeed + m.flicker);
        const cap = 0.2 + h * 0.25;
        const opBoost = 1 + h * 0.7;
        sprite.material.opacity = Math.min(cap, m.baseOpacity * tw * (0.75 + gust * 0.25) * opBoost);
      });

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(idleTimeout);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
      ro.disconnect();
      sprites.forEach((s) => {
        s.material.dispose();
        scene.remove(s);
      });
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