/**
 * GlobeScene.jsx
 *
 * Visual style: Kubera gold graticule diagram globe (per reference image).
 *  - Solid very dark warm sphere (no procedural continents)
 *  - CLEAN gold graticule (parallel + meridian LineSegments, NOT triangle wireframe = no stitches)
 *  - 4 labeled hubs: SINGAPORE HQ · PIT HEAD · EXPORT PORT · DISTRIBUTION
 *  - 18 country location dots + exactly 18 distributed arcs + travelling gold dots on each arc
 *  - HTML labels billboarded via camera-project() screen-space projection
 *  - Warm site palette only: #0D0D0D / #D4AF37 / #B87333 / #F6E7A8  (zero blue)
 *
 * Pure Three.js, self-contained, cleans up on unmount.
 */
import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';

/* ─── Geo helpers ────────────────────────────────────────────────── */
function latLonToVec3(lat, lon, r = 1) {
  const phi   = (90 - lat)  * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta),
  );
}

function buildArc(a, b, R = 1, segments = 80, lift = 0.32) {
  const points = [];
  const mid    = a.clone().add(b).normalize().multiplyScalar(R + lift);
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = new THREE.Vector3().lerpVectors(
      new THREE.Vector3().lerpVectors(a, mid, t),
      new THREE.Vector3().lerpVectors(mid, b, t),
      t,
    );
    points.push(p);
  }
  return points;
}

/** Build proper graticule geometry (parallels + meridians) — NOT triangle wireframe. */
function buildGraticuleGeo(R = 1, parallelStep = 15, meridianStep = 15) {
  const positions = [];

  // Parallels (latitude circles) — every parallelStep°, skip poles
  for (let lat = -90 + parallelStep; lat < 90; lat += parallelStep) {
    const seg = 160;
    for (let i = 0; i <= seg; i++) {
      const lon = -180 + (i / seg) * 360;
      const v = latLonToVec3(lat, lon, R);
      positions.push(v.x, v.y, v.z);
      if (i < seg) {
        const lon2 = -180 + ((i + 1) / seg) * 360;
        const v2 = latLonToVec3(lat, lon2, R);
        positions.push(v2.x, v2.y, v2.z);
      }
    }
  }

  // Meridians (longitude half-circles) — every meridianStep°
  for (let lon = -180; lon < 180; lon += meridianStep) {
    const seg = 120;
    for (let i = 0; i < seg; i++) {
      const lat1 = -90 + (i / seg) * 180;
      const lat2 = -90 + ((i + 1) / seg) * 180;
      const v1 = latLonToVec3(lat1, lon, R);
      const v2 = latLonToVec3(lat2, lon, R);
      positions.push(v1.x, v1.y, v1.z);
      positions.push(v2.x, v2.y, v2.z);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  return geo;
}

/* ─── Data ───────────────────────────────────────────────────────── */
const R = 1.20; // globe radius

const LOCATIONS = [
  { name: 'Singapore HQ',     lat:  1.35,  lon: 103.82 }, // 0
  { name: 'Jakarta',          lat: -6.21,  lon: 106.85 }, // 1
  { name: 'Dubai',            lat: 25.20,  lon:  55.27 }, // 2
  { name: 'Rotterdam',        lat: 51.92,  lon:   4.48 }, // 3
  { name: 'Mumbai',           lat: 19.08,  lon:  72.88 }, // 4
  { name: 'Kolkata',          lat: 22.57,  lon:  88.36 }, // 5
  { name: 'Shanghai',         lat: 31.23,  lon: 121.47 }, // 6
  { name: 'Tokyo',            lat: 35.69,  lon: 139.69 }, // 7
  { name: 'Sydney',           lat:-33.87,  lon: 151.21 }, // 8
  { name: 'Johannesburg',     lat:-26.20,  lon:  28.04 }, // 9
  { name: 'Dar es Salaam',    lat: -6.79,  lon:  39.21 }, // 10
  { name: 'Lagos',            lat:  6.45,  lon:   3.39 }, // 11
  { name: 'London',           lat: 51.51,  lon:  -0.13 }, // 12
  { name: 'New York',         lat: 40.71,  lon: -74.01 }, // 13
  { name: 'São Paulo',        lat:-23.55,  lon: -46.63 }, // 14
  { name: 'Seoul',            lat: 37.57,  lon: 126.98 }, // 15
  { name: 'Ho Chi Minh City', lat: 10.82,  lon: 106.63 }, // 16
  { name: 'Colombo',          lat:  6.93,  lon:  79.84 }, // 17
];

/*
 * EXACTLY 18 arcs. Distribution: each of the 18 locations is the FROM
 * node exactly once, so arcs span every continent/ocean.
 */
const ARCS = [
  [0, 2],     [1, 0],     [2, 3],     [3, 11],    [4, 2],     [5, 16],
  [6, 4],     [7, 15],    [8, 7],     [9, 10],    [10, 2],    [11, 9],
  [12, 13],   [13, 14],   [14, 11],   [15, 6],    [16, 17],   [17, 4],
];

/*
 * 4 labeled hubs (positions match reference image placement):
 *  • SINGAPORE HQ → Singapore (0)  : front-right lower hemisphere
 *  • EXPORT PORT  → Shanghai  (6)  : front-right upper
 *  • PIT HEAD     → Johannesburg (9), shifted up slightly per diagram : left-middle
 *  • DISTRIBUTION → São Paulo region, placed diagrammatically : lower-middle
 * For the PIT HEAD / DISTRIBUTION labels we pick diagrammatic positions
 * that match the reference's quadrant placement, not strict city lat/lons.
 */
const LABELED_HUBS = [
  { key: 'SINGAPORE',   label: 'SINGAPORE HQ',    lat:  1.35,  lon: 103.82, align: 'left'  },
  { key: 'EXPORT',      label: 'EXPORT PORT',     lat: 32.00,  lon: 150.00, align: 'left'  },
  { key: 'PIT',         label: 'PIT HEAD',        lat: 22.00,  lon:  25.00, align: 'left'  },
  { key: 'DISTRIB',     label: 'DISTRIBUTION',    lat:-30.00,  lon: -15.00, align: 'right' },
];

/* ─── Main component ─────────────────────────────────────────────── */
export default function GlobeScene() {
  const mountRef  = useRef(null);
  const labelsRef = useRef({}); // key -> { el, lat, lon }

  // Stable label order so we can render HTML label placeholders
  const hubKeys = useMemo(() => LABELED_HUBS.map(h => h.key), []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth  || 440;
    const H = mount.clientHeight || 440;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    /* ── Scene / Camera ── */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, W / H, 0.1, 100);
    camera.position.set(0, 0, 4.6);

    /* ── Lights — all warm ── */
    scene.add(new THREE.AmbientLight('#7d6548ff', 1.5));
    const keyLight = new THREE.DirectionalLight('#FFE0A0', 2.2);
    keyLight.position.set(-3.2, 2.8, 4.2);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight('#c89361ff', 1.1);
    rimLight.position.set(3.2, -2.2, -3.2);
    scene.add(rimLight);
    const fillLight = new THREE.DirectionalLight('#F6E7A8', 0.45);
    fillLight.position.set(0, 3.5, -2);
    scene.add(fillLight);

    /* ── Core sphere (solid very dark warm black, no continents) ── */
    const globeGeo = new THREE.SphereGeometry(R, 96, 96);
    const globeMat = new THREE.MeshPhongMaterial({
      color            : new THREE.Color('#120d07'),
      emissive         : new THREE.Color('#161008'),
      emissiveIntensity: 0.42,
      specular         : new THREE.Color('#5c4020'),
      shininess        : 10,
      transparent      : true,
      opacity          : 1.0,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);

    /* ── CLEAN gold graticule (parallels + meridians, NO stitches) ── */
    const gratGeo = buildGraticuleGeo(R + 0.004, 15, 15);
    const gratMat = new THREE.LineBasicMaterial({
      color      : '#D4AF37',
      transparent: true,
      opacity    : 0.34,
    });
    const graticule = new THREE.LineSegments(gratGeo, gratMat);

    /* ── Atmosphere + outer gold ring ── */
    const atmGeo = new THREE.SphereGeometry(R + 0.055, 64, 64);
    const atmMat = new THREE.MeshBasicMaterial({
      color: '#D4AF37', transparent: true, opacity: 0.15, side: THREE.BackSide,
    });
    const atmosphere = new THREE.Mesh(atmGeo, atmMat);

    const glowGeo = new THREE.SphereGeometry(R + 0.22, 64, 64);
    const glowMat = new THREE.MeshBasicMaterial({
      color: '#D4AF37', transparent: true, opacity: 0.05, side: THREE.BackSide,
    });
    const outerGlow = new THREE.Mesh(glowGeo, glowMat);

    /* ── Star field — gold dust ── */
    const starCount = 900;
    const starPos   = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const d = 18 + Math.random() * 14;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      starPos[i*3]   = d * Math.sin(p) * Math.cos(t);
      starPos[i*3+1] = d * Math.cos(p);
      starPos[i*3+2] = d * Math.sin(p) * Math.sin(t);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: '#F6E7A8', size: 0.042, sizeAttenuation: true,
      transparent: true, opacity: 0.58,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    /* ── 18 location gold dots ── */
    const dotGroup = new THREE.Group();
    const dotGeo     = new THREE.SphereGeometry(0.024, 10, 10);
    const dotMat     = new THREE.MeshBasicMaterial({ color: '#FFE066' });
    const glowDotMat = new THREE.MeshBasicMaterial({ color: '#D4AF37', transparent: true, opacity: 0.32 });
    const glowDotGeo = new THREE.SphereGeometry(0.055, 10, 10);

    LOCATIONS.forEach(loc => {
      const pos = latLonToVec3(loc.lat, loc.lon, R + 0.015);
      const dot = new THREE.Mesh(dotGeo, dotMat.clone());
      dot.position.copy(pos);
      dotGroup.add(dot);
      const halo = new THREE.Mesh(glowDotGeo, glowDotMat.clone());
      halo.position.copy(pos);
      dotGroup.add(halo);
    });

    /* ── 4 labeled hubs: bigger dots + outer ring so they stand out ── */
    const hubGroup = new THREE.Group();
    const hubDotGeo   = new THREE.SphereGeometry(0.042, 12, 12);
    const hubDotMat   = new THREE.MeshBasicMaterial({ color: '#FFE066' });
    const hubHaloGeo  = new THREE.SphereGeometry(0.085, 12, 12);
    const hubHaloMat  = new THREE.MeshBasicMaterial({ color: '#D4AF37', transparent: true, opacity: 0.48 });
    const hubRingGeo  = new THREE.RingGeometry(0.10, 0.108, 32);
    const hubRingMat  = new THREE.MeshBasicMaterial({
      color: '#D4AF37', side: THREE.DoubleSide, transparent: true, opacity: 0.72,
    });

    const hubPoints = {}; // key -> worldspace Vector3 (use for label projection)
    // LABELED_HUBS.forEach(h => {
    //   const pos = latLonToVec3(h.lat, h.lon, R + 0.025);
    //   hubPoints[h.key] = pos;

    //   const dot = new THREE.Mesh(hubDotGeo, hubDotMat.clone());
    //   dot.position.copy(pos);
    //   hubGroup.add(dot);

    //   const halo = new THREE.Mesh(hubHaloGeo, hubHaloMat.clone());
    //   halo.position.copy(pos);
    //   hubGroup.add(halo);

    //   // Billboarded ring (aligned to camera-facing plane via rotation group trick below)
    //   const ring = new THREE.Mesh(hubRingGeo, hubRingMat.clone());
    //   ring.userData.isRing = true;
    //   ring.position.copy(pos);
    //   hubGroup.add(ring);
    // });

    /* ── 18 arc connections + travelling dots ── */
    const arcGroup  = new THREE.Group();
    const travGroup = new THREE.Group();
    const travellers = [];

    ARCS.forEach(([ai, bi]) => {
      const a   = latLonToVec3(LOCATIONS[ai].lat, LOCATIONS[ai].lon, R + 0.015);
      const b   = latLonToVec3(LOCATIONS[bi].lat, LOCATIONS[bi].lon, R + 0.015);
      const pts = buildArc(a, b, R, 80, 0.32);

      const positions = new Float32Array(pts.length * 3);
      pts.forEach((p, i) => {
        positions[i*3]   = p.x;
        positions[i*3+1] = p.y;
        positions[i*3+2] = p.z;
      });
      const arcGeo = new THREE.BufferGeometry();
      arcGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const indices = [];
      for (let i = 0; i < pts.length - 1; i++) {
        if (i % 3 !== 2) indices.push(i, i + 1);
      }
      arcGeo.setIndex(indices);

      const arcMat = new THREE.LineBasicMaterial({
        color: '#B87333', transparent: true, opacity: 0.42,
      });
      arcGroup.add(new THREE.LineSegments(arcGeo, arcMat));

      const tDot = new THREE.Mesh(
        new THREE.SphereGeometry(0.03, 10, 10),
        new THREE.MeshBasicMaterial({ color: '#FFED8A' }),
      );
      const tGlow = new THREE.Mesh(
        new THREE.SphereGeometry(0.062, 10, 10),
        new THREE.MeshBasicMaterial({ color: '#FFD580', transparent: true, opacity: 0.34 }),
      );
      const tGroup = new THREE.Group();
      tGroup.add(tDot);
      tGroup.add(tGlow);
      travGroup.add(tGroup);

      travellers.push({
        points  : pts,
        group   : tGroup,
        progress: Math.random(),
        speed   : 0.0011 + Math.random() * 0.0011,
      });
    });

    /* ── Rotation group ── */
    const rotGroup = new THREE.Group();
    rotGroup.add(globe);
    rotGroup.add(graticule);
    rotGroup.add(atmosphere);
    rotGroup.add(outerGlow);
    rotGroup.add(dotGroup);
    rotGroup.add(hubGroup);
    rotGroup.add(arcGroup);
    rotGroup.add(travGroup);
    scene.add(rotGroup);

    /* ── Pointer drag ── */
    let isDragging = false;
    let prevX = 0;
    let userRotY = 0;
    const onPointerDown = (e) => { isDragging = true; prevX = e.clientX; };
    const onPointerMove = (e) => {
      if (!isDragging) return;
      userRotY += (e.clientX - prevX) * 0.005;
      prevX = e.clientX;
    };
    const onPointerUp = () => { isDragging = false; };
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    /* ── Resize ── */
    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(mount);

    /* ── Helper: project a world-space Vector3 → mount-space {x,y,visible} ── */
    const tmpV = new THREE.Vector3();
    function projectWorldPoint(worldV) {
      tmpV.copy(worldV).applyMatrix4(rotGroup.matrixWorld);
      tmpV.project(camera);
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      const sx = (tmpV.x *  0.5 + 0.5) * w;
      const sy = (tmpV.y * -0.5 + 0.5) * h;
      return { x: sx, y: sy, visible: tmpV.z < 1 };
    }

    /* ── RAF loop ── */
    let rafId;
    let time = 0;
    function animate() {
      rafId = requestAnimationFrame(animate);
      time += 0.005;

      if (!isDragging) userRotY += 0.0022;
      rotGroup.rotation.y = userRotY;
      rotGroup.rotation.x = Math.sin(time * 0.18) * 0.055;

      // Pulse location halos
      dotGroup.children.forEach((m, i) => {
        if (i % 2 === 1) m.material.opacity = 0.16 + Math.sin(time * 2 + i) * 0.13;
      });
      // Pulse hub halos + billboard hub rings toward camera
      hubGroup.children.forEach(m => {
        if (m.userData.isRing) {
          // Orient ring to face camera
          m.quaternion.copy(camera.quaternion);
        } else if (m.geometry === hubHaloGeo) {
          m.material.opacity = 0.30 + Math.sin(time * 1.5 + m.position.x * 5) * 0.18;
        }
      });

      // Travelling dots
      travellers.forEach(tr => {
        tr.progress = (tr.progress + tr.speed) % 1;
        const idx = Math.floor(tr.progress * (tr.points.length - 1));
        tr.group.position.copy(tr.points[idx]);
        const fade = Math.sin(tr.progress * Math.PI);
        if (tr.group.children[1].material.transparent) {
          tr.group.children[1].material.opacity = 0.34 * fade;
        }
      });

      // Animate lights
      keyLight.position.x = Math.cos(time * 0.28) * 4.2;
      keyLight.position.z = Math.sin(time * 0.28) * 4.2;
      rimLight.position.x = Math.cos(time * 0.28 + Math.PI) * 3.5;
      rimLight.position.z = Math.sin(time * 0.28 + Math.PI) * 3.5;

      /* — Update HTML label positions (project 4 hubs) — */
      // LABELED_HUBS.forEach(h => {
      //   const el = labelsRef.current[h.key];
      //   if (!el) return;
      //   const worldP = hubPoints[h.key];
      //   const { x, y, visible } = projectWorldPoint(worldP);
      //   // Hide labels on the back-side of the globe
      //   el.style.display = visible ? 'flex' : 'none';
      //   // Offset vertically so label sits just outside the hub ring
      //   el.style.transform = `translate(${x}px, ${y}px)`;
      //   // Alignment: which side of the hub the label is on
      //   el.style.justifyContent = h.align === 'right' ? 'flex-end' : 'flex-start';
      // });

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      globeGeo.dispose(); globeMat.dispose();
      gratGeo.dispose();  gratMat.dispose();
      atmGeo.dispose();   atmMat.dispose();
      glowGeo.dispose();  glowMat.dispose();
      starGeo.dispose();  starMat.dispose();
      dotGeo.dispose();   dotMat.dispose();
      glowDotGeo.dispose(); glowDotMat.dispose();
      hubDotGeo.dispose(); hubDotMat.dispose();
      hubHaloGeo.dispose(); hubHaloMat.dispose();
      hubRingGeo.dispose(); hubRingMat.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="relative w-full aspect-square max-w-[260px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[440px] mx-auto"
    >
      {/* HTML labels layer — projected to screen coords in RAF */}
      {hubKeys.map(key => {
        const hub = LABELED_HUBS.find(h => h.key === key);
        // Offset: label sits just below & beside hub dot (size of padding below hub)
        const offsetX = hub.align === 'right' ? -14 : 14;
        return (
          <div
            key={key}
            ref={(el) => { labelsRef.current[key] = el; }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 160, // enough room for uppercase monospace labels
              pointerEvents: 'none',
              transformOrigin: 'center center',
              padding: '10px 0 0 0',
              display: 'none',
              justifyContent: hub.align === 'right' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                transform: `translate(${offsetX}px, 14px)`,
              }}
            >
              <span
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontSize: 10,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: '#F6E7A8',
                  textShadow: '0 1px 6px rgba(212,175,55,0.35)',
                  whiteSpace: 'nowrap',
                }}
              >
                {hub.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
