/**
 * Suganya S - 3D Personal Portfolio
 * Interactive Three.js WebGL Cyber Environment
 */

(function () {
  'use strict';

  // Check if Three.js is loaded
  if (typeof THREE === 'undefined') {
    console.warn('Three.js not loaded. 3D visual background disabled.');
    return;
  }

  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05070f, 0.0012);

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.set(0, 0, 80);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const cyanLight = new THREE.PointLight(0x00f5d4, 2, 250);
  cyanLight.position.set(40, 30, 40);
  scene.add(cyanLight);

  const violetLight = new THREE.PointLight(0x8b5cf6, 2.5, 250);
  violetLight.position.set(-40, -20, 30);
  scene.add(violetLight);

  // -------------------------------------------------------------------------
  // 1. Interactive Starfield / Particle Constellation
  // -------------------------------------------------------------------------
  const particleCount = 1600;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorPalette = [
    new THREE.Color(0x00f5d4), // Neon Cyan
    new THREE.Color(0x8b5cf6), // Hyper Violet
    new THREE.Color(0x38bdf8), // Sky Blue
    new THREE.Color(0xec4899), // Neon Pink
  ];

  for (let i = 0; i < particleCount; i++) {
    // Distribute particles in a 3D volume
    const x = (Math.random() - 0.5) * 350;
    const y = (Math.random() - 0.5) * 350;
    const z = (Math.random() - 0.5) * 300 - 50;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Pick random accent color
    const pickedColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i * 3] = pickedColor.r;
    colors[i * 3 + 1] = pickedColor.g;
    colors[i * 3 + 2] = pickedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Particle Material
  // Create a soft radial particle texture programmatically
  const createParticleTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(0, 245, 212, 0.8)');
    gradient.addColorStop(0.7, 'rgba(139, 92, 246, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();
    return new THREE.CanvasTexture(canvas);
  };

  const particleMaterial = new THREE.PointsMaterial({
    size: 2.8,
    vertexColors: true,
    map: createParticleTexture(),
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particleField = new THREE.Points(geometry, particleMaterial);
  scene.add(particleField);

  // -------------------------------------------------------------------------
  // 2. Central 3D Cyber Holographic Geometry (Torus Knot + Cage)
  // -------------------------------------------------------------------------
  const cyberGroup = new THREE.Group();
  scene.add(cyberGroup);
  cyberGroup.position.set(28, 5, 0); // Positioned slightly toward the right hero visual

  // Wireframe Torus Knot
  const knotGeo = new THREE.TorusKnotGeometry(14, 3.8, 128, 24, 2, 3);
  const knotWireframe = new THREE.WireframeGeometry(knotGeo);
  const knotLineMaterial = new THREE.LineBasicMaterial({
    color: 0x00f5d4,
    transparent: true,
    opacity: 0.38,
    blending: THREE.AdditiveBlending,
  });
  const knotMesh = new THREE.LineSegments(knotWireframe, knotLineMaterial);
  cyberGroup.add(knotMesh);

  // Core Icosahedron with glass sheen
  const coreGeo = new THREE.IcosahedronGeometry(7, 2);
  const coreMat = new THREE.MeshPhongMaterial({
    color: 0x8b5cf6,
    emissive: 0x2e1065,
    specular: 0x00f5d4,
    shininess: 90,
    wireframe: true,
    transparent: true,
    opacity: 0.5,
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  cyberGroup.add(coreMesh);

  // Orbital Rings
  const ringGeo = new THREE.RingGeometry(24, 24.6, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x8b5cf6,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.25,
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI / 3;
  cyberGroup.add(ringMesh);

  // -------------------------------------------------------------------------
  // Mouse & Scroll Parallax State
  // -------------------------------------------------------------------------
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  let scrollY = 0;
  let targetScrollY = 0;

  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
  });

  // -------------------------------------------------------------------------
  // Resize Handler
  // -------------------------------------------------------------------------
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Adjust cyber group position based on screen width
    if (window.innerWidth < 992) {
      cyberGroup.position.set(0, 0, -20);
    } else {
      cyberGroup.position.set(28, 5, 0);
    }
  });

  // Initial screen width check
  if (window.innerWidth < 992) {
    cyberGroup.position.set(0, 0, -20);
  }

  // -------------------------------------------------------------------------
  // Animation Loop
  // -------------------------------------------------------------------------
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth Lerping for Mouse Coordinates
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    // Smooth Lerp for Scroll
    scrollY += (targetScrollY - scrollY) * 0.08;
    const normalizedScroll = scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);

    // Dynamic Camera Flight based on scroll & mouse
    camera.position.x = mouseX * 8;
    camera.position.y = -mouseY * 8 - normalizedScroll * 35;
    camera.position.z = 80 - normalizedScroll * 25;
    camera.lookAt(0, -normalizedScroll * 35, 0);

    // Particle Cloud Dynamic Rotation
    particleField.rotation.y = elapsedTime * 0.02 + mouseX * 0.2;
    particleField.rotation.x = elapsedTime * 0.015 - mouseY * 0.2;

    // Holographic Cyber Mesh Rotation
    knotMesh.rotation.x = elapsedTime * 0.15;
    knotMesh.rotation.y = elapsedTime * 0.25;
    coreMesh.rotation.y = -elapsedTime * 0.3;
    coreMesh.rotation.z = elapsedTime * 0.2;
    ringMesh.rotation.z = elapsedTime * 0.1;

    // Gentle float wave
    cyberGroup.position.y = (window.innerWidth < 992 ? 0 : 5) + Math.sin(elapsedTime * 1.5) * 1.8;

    // Pulsing point light colors
    cyanLight.position.x = 40 + Math.sin(elapsedTime * 2) * 15;
    cyanLight.position.y = 30 + Math.cos(elapsedTime * 2) * 15;

    renderer.render(scene, camera);
  }

  animate();
})();
