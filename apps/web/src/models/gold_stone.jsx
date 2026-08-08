import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ---------- Simplex noise (Ashima, public domain) ----------
function SimplexNoise() {
  function fastFloor(x) { return Math.floor(x) | 0; }
  const grad3 = [
    [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],
    [1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
  ];
  const p = [];
  for (let i = 0; i < 256; i++) p[i] = Math.floor(Math.random() * 256);
  const perm = new Array(512), gradP = new Array(512);
  for (let i = 0; i < 512; i++) { perm[i] = p[i & 255]; gradP[i] = grad3[perm[i] % 12]; }
  const F3 = 1 / 3, G3 = 1 / 6;

  this.noise3D = function (xin, yin, zin) {
    let n0, n1, n2, n3;
    const s = (xin + yin + zin) * F3;
    const i = fastFloor(xin + s), j = fastFloor(yin + s), k = fastFloor(zin + s);
    const t = (i + j + k) * G3;
    const X0 = i - t, Y0 = j - t, Z0 = k - t;
    const x0 = xin - X0, y0 = yin - Y0, z0 = zin - Z0;
    let i1, j1, k1, i2, j2, k2;
    if (x0 >= y0) {
      if (y0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=1;k2=0; }
      else if (x0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=0;k2=1; }
      else { i1=0;j1=0;k1=1;i2=1;j2=0;k2=1; }
    } else {
      if (y0 < z0) { i1=0;j1=0;k1=1;i2=0;j2=1;k2=1; }
      else if (x0 < z0) { i1=0;j1=1;k1=0;i2=0;j2=1;k2=1; }
      else { i1=0;j1=1;k1=0;i2=1;j2=1;k2=0; }
    }
    const x1=x0-i1+G3, y1=y0-j1+G3, z1=z0-k1+G3;
    const x2=x0-i2+2*G3, y2=y0-j2+2*G3, z2=z0-k2+2*G3;
    const x3=x0-1+3*G3, y3=y0-1+3*G3, z3=z0-1+3*G3;
    const ii=i&255, jj=j&255, kk=k&255;
    const gi0=gradP[ii+perm[jj+perm[kk]]];
    const gi1=gradP[ii+i1+perm[jj+j1+perm[kk+k1]]];
    const gi2=gradP[ii+i2+perm[jj+j2+perm[kk+k2]]];
    const gi3=gradP[ii+1+perm[jj+1+perm[kk+1]]];
    let t0=0.6-x0*x0-y0*y0-z0*z0;
    n0 = t0<0 ? 0 : (t0*=t0, t0*t0*(gi0[0]*x0+gi0[1]*y0+gi0[2]*z0));
    let t1=0.6-x1*x1-y1*y1-z1*z1;
    n1 = t1<0 ? 0 : (t1*=t1, t1*t1*(gi1[0]*x1+gi1[1]*y1+gi1[2]*z1));
    let t2=0.6-x2*x2-y2*y2-z2*z2;
    n2 = t2<0 ? 0 : (t2*=t2, t2*t2*(gi2[0]*x2+gi2[1]*y2+gi2[2]*z2));
    let t3=0.6-x3*x3-y3*y3-z3*z3;
    n3 = t3<0 ? 0 : (t3*=t3, t3*t3*(gi3[0]*x3+gi3[1]*y3+gi3[2]*z3));
    return 32*(n0+n1+n2+n3);
  };
}

// three.js's IcosahedronGeometry duplicates a position for every triangle that
// touches it (so it can UV-map cleanly), which means computeVertexNormals()
// can't blend a normal across faces — each vertex only "belongs" to one
// triangle, giving the flat, faceted diamond-cut look. Welding duplicate
// positions into a shared, indexed geometry fixes that and lets normals
// smooth continuously across the surface, like a real rounded nugget.
function weldVertices(geometry, precision = 5) {
  const posAttr = geometry.attributes.position;
  const count = posAttr.count;
  const map = new Map();
  const newPositions = [];
  const indices = new Array(count);

  for (let i = 0; i < count; i++) {
    const x = posAttr.getX(i), y = posAttr.getY(i), z = posAttr.getZ(i);
    const key = x.toFixed(precision) + "_" + y.toFixed(precision) + "_" + z.toFixed(precision);
    let idx = map.get(key);
    if (idx === undefined) {
      idx = newPositions.length / 3;
      newPositions.push(x, y, z);
      map.set(key, idx);
    }
    indices[i] = idx;
  }

  const welded = new THREE.BufferGeometry();
  welded.setAttribute("position", new THREE.Float32BufferAttribute(newPositions, 3));
  welded.setIndex(indices);
  return welded;
}

export default function GoldNugget() {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mount = mountRef.current;
    let width = mount.clientWidth;
    let height = mount.clientHeight;

    // ---------- Scene ----------
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.6, 4.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // ---------- Procedural environment map (for gold reflections) ----------
    function buildEnvMap() {
      const size = 256;
      const cubeRT = new THREE.WebGLCubeRenderTarget(size, {
        format: THREE.RGBAFormat,
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter,
        encoding: THREE.sRGBEncoding,
      });
      const cubeCam = new THREE.CubeCamera(0.1, 100, cubeRT);
      const envScene = new THREE.Scene();

      const skyGeo = new THREE.SphereGeometry(50, 32, 32);
      const skyMat = new THREE.ShaderMaterial({
        side: THREE.BackSide,
        uniforms: {
          topColor: { value: new THREE.Color(0x3a3a40) },
          bottomColor: { value: new THREE.Color(0x050505) },
          midColor: { value: new THREE.Color(0x171512) },
        },
        vertexShader: `varying vec3 vPos; void main(){ vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `varying vec3 vPos; uniform vec3 topColor; uniform vec3 bottomColor; uniform vec3 midColor;
          void main(){ float h = normalize(vPos).y; vec3 col = h > 0.0 ? mix(midColor, topColor, smoothstep(0.0,1.0,h)) : mix(midColor, bottomColor, smoothstep(0.0,-1.0,h)); gl_FragColor = vec4(col,1.0); }`,
      });
      envScene.add(new THREE.Mesh(skyGeo, skyMat));

      function addLightPanel(x, y, z, w, h, color, intensity) {
        const geo = new THREE.PlaneGeometry(w, h);
        const mat = new THREE.MeshBasicMaterial({ color, toneMapped: false });
        const m = new THREE.Mesh(geo, mat);
        m.position.set(x, y, z);
        m.lookAt(0, 0, 0);
        m.material.color.multiplyScalar(intensity);
        envScene.add(m);
      }
      addLightPanel(6, 5, 3, 8, 8, 0xfff4d8, 3.2);
      addLightPanel(-6, 2, -4, 6, 10, 0xffe9b0, 1.6);
      addLightPanel(0, -6, 4, 10, 4, 0x222018, 0.6);
      addLightPanel(3, -3, -6, 5, 5, 0x14110c, 0.4);

      cubeCam.position.set(0, 0, 0);
      cubeCam.update(renderer, envScene);
      return cubeRT.texture;
    }

    const envMap = buildEnvMap();
    scene.environment = envMap;

    // ---------- Nugget geometry ----------
    const simplex = new SimplexNoise();
    const simplex2 = new SimplexNoise();

    const rawGeo = new THREE.IcosahedronGeometry(1, 6); // high subdivision, welded below
    const baseGeo = weldVertices(rawGeo);
    rawGeo.dispose();

    const posAttr = baseGeo.attributes.position;
    const v = new THREE.Vector3();

    // squash into a rounded, asymmetric nugget silhouette
    for (let i = 0; i < posAttr.count; i++) {
      v.fromBufferAttribute(posAttr, i);
      v.y *= 0.78;
      v.x *= 1.05;
      v.z *= 0.9;
      posAttr.setXYZ(i, v.x, v.y, v.z);
    }

    function fbm(nx, ny, nz, octaves) {
      let freq = 1, amp = 1, sum = 0, norm = 0;
      const lac = 2.0, gain = 0.55;
      for (let o = 0; o < octaves; o++) {
        sum += simplex.noise3D(nx * freq, ny * freq, nz * freq) * amp;
        norm += amp;
        freq *= lac; amp *= gain;
      }
      return sum / norm;
    }

    // gentle, low-frequency lumps only — enough vertices now exist to render
    // smooth curved bumps rather than sharp spikes, so amplitudes stay modest
    for (let i = 0; i < posAttr.count; i++) {
      v.fromBufferAttribute(posAttr, i);
      const n = v.clone().normalize();
      const large = fbm(n.x * 1.4, n.y * 1.4, n.z * 1.4, 3);        // broad rounded lobes
      const mid = fbm(n.x * 3.2 + 9.1, n.y * 3.2 + 4.4, n.z * 3.2 + 2.2, 3) * 0.45; // secondary bumps
      const fine = simplex2.noise3D(n.x * 7.5, n.y * 7.5, n.z * 7.5) * 0.035; // soft surface grain
      let disp = large * 0.22 + mid * 0.09 + fine;
      disp = Math.max(disp, -0.16);
      const scale = 1 + disp;
      v.multiplyScalar(scale);
      posAttr.setXYZ(i, v.x, v.y, v.z);
    }
    baseGeo.computeVertexNormals(); // now blends smoothly across shared/welded vertices

    const goldMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xffcf3d),
      metalness: 1.0,
      roughness: 0.22,
      reflectivity: 1.0,
      clearcoat: 0.35,
      clearcoatRoughness: 0.25,
      envMap: envMap,
      envMapIntensity: 1.8,
    });

    const nugget = new THREE.Mesh(baseGeo, goldMat);
    nugget.castShadow = true;
    nugget.receiveShadow = true;
    nugget.rotation.z = 0.15;
    scene.add(nugget);

    // ---------- Ground ----------
    const groundGeo = new THREE.CircleGeometry(6, 64);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x161616, roughness: 0.95, metalness: 0.0 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.92;
    ground.receiveShadow = true;
    scene.add(ground);

    // ---------- Lighting ----------
    const key = new THREE.DirectionalLight(0xfff2d6, 3.2);
    key.position.set(4, 5, 3);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 15;
    key.shadow.radius = 4;
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xffe0a0, 0.9);
    fill.position.set(-5, 2, -3);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xfff8e8, 1.4);
    rim.position.set(-2, 3, -6);
    scene.add(rim);

    const ambient = new THREE.AmbientLight(0x1a1712, 0.6);
    scene.add(ambient);

    const underGlow = new THREE.PointLight(0xffb347, 0.6, 6);
    underGlow.position.set(0, -0.6, 1.5);
    scene.add(underGlow);

    // small tight hotspots so the rounded bumps catch bright, distinct
    // specular highlights the way polished metal does in the reference photo
    const hotspot1 = new THREE.PointLight(0xffffff, 1.6, 5);
    hotspot1.position.set(1.6, 1.8, 2.2);
    scene.add(hotspot1);

    const hotspot2 = new THREE.PointLight(0xfff0c0, 1.0, 5);
    hotspot2.position.set(-1.4, 0.6, 2.6);
    scene.add(hotspot2);

    // ---------- Manual orbit controls (drag to rotate, scroll to zoom) ----------
    let isDragging = false;
    let prevX = 0, prevY = 0;
    let theta = 0.0;   // horizontal angle
    let phi = 1.35;    // vertical angle (from top)
    let radius = 4.2;
    let autoRotate = true;

    const target = new THREE.Vector3(0, 0, 0);

    function updateCamera() {
      camera.position.x = target.x + radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = target.y + radius * Math.cos(phi);
      camera.position.z = target.z + radius * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(target);
    }
    theta = 0.0;
    updateCamera();

    function onPointerDown(e) {
      isDragging = true;
      autoRotate = false;
      prevX = e.clientX ?? e.touches?.[0]?.clientX;
      prevY = e.clientY ?? e.touches?.[0]?.clientY;
    }
    function onPointerMove(e) {
      if (!isDragging) return;
      const clientX = e.clientX ?? e.touches?.[0]?.clientX;
      const clientY = e.clientY ?? e.touches?.[0]?.clientY;
      const dx = clientX - prevX;
      const dy = clientY - prevY;
      prevX = clientX; prevY = clientY;
      theta -= dx * 0.006;
      phi -= dy * 0.006;
      phi = Math.max(0.35, Math.min(Math.PI - 0.35, phi));
      updateCamera();
    }
    function onPointerUp() { isDragging = false; }
    function onWheel(e) {
      e.preventDefault();
      radius += e.deltaY * 0.0025;
      radius = Math.max(2, Math.min(8, radius));
      updateCamera();
    }

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
    renderer.domElement.addEventListener("touchstart", onPointerDown, { passive: true });
    renderer.domElement.addEventListener("touchmove", onPointerMove, { passive: true });
    renderer.domElement.addEventListener("touchend", onPointerUp);

    // ---------- Resize ----------
    function handleResize() {
      width = mount.clientWidth;
      height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);

    setLoading(false);

    // ---------- Animate ----------
    let rafId;
    function animate() {
      rafId = requestAnimationFrame(animate);
      if (autoRotate) {
        theta += 0.0035;
        updateCamera();
      }
      renderer.render(scene, camera);
    }
    animate();

    // ---------- Cleanup ----------
    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("wheel", onWheel);
      renderer.domElement.removeEventListener("touchstart", onPointerDown);
      renderer.domElement.removeEventListener("touchmove", onPointerMove);
      renderer.domElement.removeEventListener("touchend", onPointerUp);
      baseGeo.dispose();
      goldMat.dispose();
      groundGeo.dispose();
      groundMat.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", background: "#0a0a0a" }}>
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
      {loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#d4af37",
            fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: 14,
            letterSpacing: "0.05em",
            background: "#0a0a0a",
          }}
        >
          forging nugget…
        </div>
      )}
      <div
        style={{
          position: "absolute",
          bottom: 14,
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(255,255,255,0.45)",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          fontSize: 12,
          letterSpacing: "0.02em",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        drag to rotate · scroll to zoom
      </div>
    </div>
  );
}