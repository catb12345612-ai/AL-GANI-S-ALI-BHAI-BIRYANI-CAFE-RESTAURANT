/* ============================================================
   Al-Gani's Ali Bhai Biryani & Cafe
   3D handi scene + menu + interactions
   ============================================================ */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/* ------------------------------------------------------------
   1. MENU DATA (from the restaurant's official menu)
   ------------------------------------------------------------ */
const MENU = [
  {
    id: 'chicken-biryani',
    title: 'Chicken Biryani',
    note: 'Dum-cooked in a sealed handi',
    items: [
      { n: 'Single Biryani', d: '1 Piece', p: 120, img: 'chicken-biryani.jpg', veg: false },
      { n: 'Full Chicken Biryani', d: '2 Pieces', p: 150, img: 'chicken-biryani.jpg', veg: false },
      { n: 'KG Biryani', d: '3 Pieces', p: 180, img: 'biryani-hero.jpg', veg: false },
      { n: 'Couple Pack', d: '4 Pieces', p: 300, img: 'chicken-biryani.jpg', veg: false, tag: 'Popular' },
      { n: 'Family Pack', d: '6 Pieces', p: 500, img: 'biryani-hero.jpg', veg: false, tag: 'Value' },
      { n: 'Jumbo Pack', d: '9 Pieces', p: 750, img: 'biryani-hero.jpg', veg: false },
    ],
  },
  {
    id: 'fry-piece',
    title: 'Fry Piece Biryani',
    note: 'Crisp fried chicken layered into dum rice',
    items: [
      { n: 'Fry Piece Single', d: '1 fry piece', p: 160, img: 'fry-biryani.jpg', veg: false },
      { n: 'Fry Piece Full', d: '2 fry pieces', p: 250, img: 'fry-biryani.jpg', veg: false },
      { n: 'Fry Piece Couple Pack', d: 'Sharing size', p: 350, img: 'fry-biryani.jpg', veg: false, tag: 'Popular' },
      { n: 'Fry Piece Family', d: 'Family size', p: 550, img: 'fry-biryani.jpg', veg: false },
      { n: 'Fry Piece Jumbo', d: 'Party size', p: 800, img: 'fry-biryani.jpg', veg: false },
    ],
  },
  {
    id: 'paneer-kaju',
    title: 'Paneer & Kaju',
    note: 'Vegetarian dum, cashew-rich gravy',
    items: [
      { n: 'Paneer Biryani Single', d: 'Single', p: 180, img: 'paneer-biryani.jpg', veg: true },
      { n: 'Paneer Biryani Full', d: 'Full', p: 250, img: 'paneer-biryani.jpg', veg: true },
      { n: 'Paneer Couple Pack', d: 'Sharing size', p: 400, img: 'paneer-biryani.jpg', veg: true },
      { n: 'Paneer Family Pack', d: 'Family size', p: 550, img: 'paneer-biryani.jpg', veg: true },
      { n: 'Paneer Jumbo Pack', d: 'Party size', p: 800, img: 'paneer-biryani.jpg', veg: true },
      { n: 'Kaju Biryani Paneer', d: 'Cashew + paneer', p: 250, img: 'paneer-biryani.jpg', veg: true, tag: 'Rich' },
      { n: 'Kaju Biryani', d: 'Cashew dum biryani', p: 260, img: 'kaju-biryani.jpg', veg: true },
      { n: 'Bagara with Chicken Curry', d: 'Bagara rice + curry', p: 120, img: 'chicken-curry.jpg', veg: false },
    ],
  },
  {
    id: 'rice-noodles',
    title: 'Rice & Noodles',
    note: 'Wok-tossed classics & basmati staples',
    items: [
      { n: 'Egg Fried Rice (Basmati)', d: 'Basmati, egg', p: 90, img: 'egg-fried-rice.jpg', veg: false },
      { n: 'Egg Noodles', d: 'Wok-tossed', p: 70, img: 'egg-noodles.jpg', veg: false },
      { n: 'Chicken Fried Rice', d: 'Basmati, chicken', p: 100, img: 'chicken-fried-rice.jpg', veg: false },
      { n: 'Chicken Noodles', d: 'Wok-tossed', p: 90, img: 'chicken-noodles.jpg', veg: false },
      { n: 'Veg Noodles', d: 'Garden vegetables', p: 70, img: 'veg-noodles.jpg', veg: true },
      { n: 'Veg Fried Rice (Basmati)', d: 'Garden vegetables', p: 80, img: 'veg-fried-rice.jpg', veg: true },
      { n: 'Manchuria Fried Rice', d: 'Manchurian style', p: 80, img: 'veg-manchuria.jpg', veg: true },
      { n: 'Kaju Fried Rice', d: 'Cashew crunch', p: 100, img: 'kaju-fried-rice.jpg', veg: true },
      { n: 'Paneer Fried Rice', d: 'Cottage cheese', p: 90, img: 'paneer-fried-rice.jpg', veg: true },
      { n: 'Kaju Egg Noodles', d: 'Cashew + egg', p: 110, img: 'egg-noodles.jpg', veg: false },
    ],
  },
  {
    id: 'chinese',
    title: 'Chinese Items',
    note: 'Indo-Chinese counter, made to order',
    items: [
      { n: 'Egg Manchuria', d: 'Tangy & crisp', p: 90, img: 'veg-manchuria.jpg', veg: false },
      { n: 'Chicken Manchuria', d: 'Dry or gravy', p: 120, img: 'chicken-manchuria.jpg', veg: false, tag: 'Popular' },
      { n: 'Chicken 65', d: 'Curry-leaf hot', p: 150, img: 'chicken-65.jpg', veg: false, tag: 'Bestseller' },
      { n: 'Chilli Chicken', d: 'Extra spicy', p: 140, img: 'chilli-chicken.jpg', veg: false },
      { n: 'Kaju Chicken', d: 'Cashew chicken', p: 160, img: 'kaju-chicken.jpg', veg: false },
      { n: 'Veg Manchuria', d: 'Mixed vegetable', p: 80, img: 'veg-manchuria.jpg', veg: true },
      { n: 'Chicken Curry', d: 'House gravy', p: 80, img: 'chicken-curry.jpg', veg: false },
    ],
  },
  {
    id: 'unlimited',
    title: 'Unlimited & Extras',
    note: 'Add-ons for serious appetites',
    items: [
      { n: 'Biryani Unlimited Rice', d: 'Per table', p: 130, img: 'biryani-hero.jpg', veg: false, tag: 'Unlimited' },
      { n: 'Extra Piece', d: 'Add-on', p: 50, img: 'chicken-biryani.jpg', veg: false },
      { n: 'Extra Rice', d: 'Add-on', p: 80, img: 'veg-fried-rice.jpg', veg: false },
    ],
  },
];

/* ------------------------------------------------------------
   2. MENU RENDERING
   ------------------------------------------------------------ */
function renderMenu() {
  const root = document.getElementById('menuRoot');
  const chips = document.getElementById('menuChips');
  if (!root || !chips) return;

  const frag = document.createDocumentFragment();
  const chipFrag = document.createDocumentFragment();

  MENU.forEach((cat, idx) => {
    const chip = document.createElement('a');
    chip.className = 'menu__chip' + (idx === 0 ? ' active' : '');
    chip.href = `#${cat.id}`;
    chip.textContent = cat.title;
    chipFrag.appendChild(chip);

    const section = document.createElement('section');
    section.className = 'menu__cat';
    section.id = cat.id;

    const head = document.createElement('div');
    head.className = 'menu__cat-head';
    head.innerHTML = `<h3>${cat.title}</h3><span class="rule"></span><span class="count">${cat.items.length} items</span>`;
    section.appendChild(head);

    const sub = document.createElement('p');
    sub.className = 'section__lede';
    sub.style.margin = '-10px 0 22px';
    sub.textContent = cat.note;
    section.appendChild(sub);

    const grid = document.createElement('div');
    grid.className = 'menu__grid';

    cat.items.forEach((it, i) => {
      const card = document.createElement('article');
      card.className = 'menu__item reveal';
      card.style.setProperty('--d', `${Math.min(i * 0.05, 0.3)}s`);

      const img = document.createElement('img');
      img.className = 'menu__item-img';
      img.src = `./assets/img/${it.img}`;
      img.alt = it.n;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.addEventListener('error', () => img.remove(), { once: true });

      const body = document.createElement('div');
      body.className = 'menu__item-body';

      const name = document.createElement('div');
      name.className = 'menu__item-name';
      const mark = document.createElement('span');
      mark.className = 'veg-mark' + (it.veg ? '' : ' nonveg');
      mark.setAttribute('role', 'img');
      mark.setAttribute('aria-label', it.veg ? 'Vegetarian' : 'Non-vegetarian');
      const label = document.createElement('span');
      label.textContent = it.n;
      name.append(mark, label);
      if (it.tag) {
        const tag = document.createElement('span');
        tag.className = 'menu__item-tag';
        tag.textContent = it.tag;
        name.appendChild(tag);
      }

      const d = document.createElement('div');
      d.className = 'menu__item-note';
      d.textContent = it.d;

      body.append(name, d);

      const price = document.createElement('div');
      price.className = 'menu__item-price';
      price.textContent = `₹${it.p}/-`;

      card.append(img, body, price);
      grid.appendChild(card);
    });

    section.appendChild(grid);
    frag.appendChild(section);
  });

  chips.appendChild(chipFrag);
  root.appendChild(frag);
}

/* ------------------------------------------------------------
   3. 3D SCENE — golden handi over warm embers
   ------------------------------------------------------------ */
function initScene() {
  const mount = document.getElementById('webgl');
  if (!mount) return null;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (err) {
    console.warn('WebGL unavailable — static background only.');
    document.body.classList.add('no-webgl');
    return null;
  }

  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(DPR);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.82;
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0.55, 6.4);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const world = new THREE.Group();
  scene.add(world);

  const spriteCanvas = document.createElement('canvas');
  spriteCanvas.width = spriteCanvas.height = 64;
  const sctx = spriteCanvas.getContext('2d');
  const grad = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.4, 'rgba(255,255,255,0.5)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  sctx.fillStyle = grad;
  sctx.fillRect(0, 0, 64, 64);
  const sprite = new THREE.CanvasTexture(spriteCanvas);

  const pot = new THREE.Group();

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xd9a441, metalness: 0.95, roughness: 0.28,
  });
  const goldDark = new THREE.MeshStandardMaterial({
    color: 0x9a6a1e, metalness: 0.9, roughness: 0.42,
  });

  const bodyPts = [
    new THREE.Vector2(0.02, 0.0),
    new THREE.Vector2(0.5, 0.01),
    new THREE.Vector2(0.86, 0.12),
    new THREE.Vector2(1.08, 0.48),
    new THREE.Vector2(1.04, 0.84),
    new THREE.Vector2(0.88, 1.1),
    new THREE.Vector2(0.7, 1.24),
    new THREE.Vector2(0.77, 1.3),
    new THREE.Vector2(0.68, 1.32),
  ];
  const body = new THREE.Mesh(new THREE.LatheGeometry(bodyPts, 96), goldMat);
  pot.add(body);

  const lidPts = [
    new THREE.Vector2(0.02, 1.66),
    new THREE.Vector2(0.14, 1.64),
    new THREE.Vector2(0.4, 1.56),
    new THREE.Vector2(0.62, 1.44),
    new THREE.Vector2(0.76, 1.34),
    new THREE.Vector2(0.72, 1.3),
  ];
  const lid = new THREE.Mesh(new THREE.LatheGeometry(lidPts, 96), goldMat);
  pot.add(lid);

  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 24), goldDark);
  knob.position.y = 1.7;
  pot.add(knob);

  const band1 = new THREE.Mesh(new THREE.TorusGeometry(0.79, 0.035, 16, 96), goldDark);
  band1.rotation.x = Math.PI / 2;
  band1.position.y = 1.26;
  pot.add(band1);

  const band2 = new THREE.Mesh(new THREE.TorusGeometry(1.07, 0.028, 16, 96), goldDark);
  band2.rotation.x = Math.PI / 2;
  band2.position.y = 0.52;
  pot.add(band2);

  const handleGeo = new THREE.TorusGeometry(0.16, 0.045, 14, 40, Math.PI);
  const hL = new THREE.Mesh(handleGeo, goldDark);
  hL.position.set(-1.04, 0.78, 0);
  hL.rotation.set(0, Math.PI / 2, Math.PI / 1.7);
  pot.add(hL);
  const hR = new THREE.Mesh(handleGeo, goldDark);
  hR.position.set(1.04, 0.78, 0);
  hR.rotation.set(0, -Math.PI / 2, -Math.PI / 1.7);
  pot.add(hR);

  pot.position.y = -1.35;
  world.add(pot);

  const glowCv = document.createElement('canvas');
  glowCv.width = glowCv.height = 256;
  const gc = glowCv.getContext('2d');
  const gg = gc.createRadialGradient(128, 128, 10, 128, 128, 128);
  gg.addColorStop(0, 'rgba(255, 170, 80, 0.55)');
  gg.addColorStop(0.5, 'rgba(255, 120, 40, 0.18)');
  gg.addColorStop(1, 'rgba(255, 100, 30, 0)');
  gc.fillStyle = gg;
  gc.fillRect(0, 0, 256, 256);
  const glowTex = new THREE.CanvasTexture(glowCv);
  const tableGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(7, 7),
    new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
  );
  tableGlow.rotation.x = -Math.PI / 2;
  tableGlow.position.y = -1.34;
  world.add(tableGlow);

  const STEAM = 40;
  const sPos = new Float32Array(STEAM * 3);
  const sPhase = new Float32Array(STEAM);
  const sSpeed = new Float32Array(STEAM);
  for (let i = 0; i < STEAM; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * 0.4;
    sPos[i * 3] = Math.cos(a) * r;
    sPos[i * 3 + 1] = 0;
    sPos[i * 3 + 2] = Math.sin(a) * r;
    sPhase[i] = Math.random();
    sSpeed[i] = 0.1 + Math.random() * 0.12;
  }
  const steamGeo = new THREE.BufferGeometry();
  steamGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
  steamGeo.setAttribute('aPhase', new THREE.BufferAttribute(sPhase, 1));
  steamGeo.setAttribute('aSpeed', new THREE.BufferAttribute(sSpeed, 1));

  const steamMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uMap: { value: sprite }, uPR: { value: DPR } },
    vertexShader: /* glsl */ `
      attribute float aPhase;
      attribute float aSpeed;
      uniform float uTime;
      uniform float uPR;
      varying float vFade;
      void main() {
        float life = fract(aPhase + uTime * aSpeed);
        vec3 p = position;
        p.y = 0.35 + life * 2.6;
        p.x += sin(uTime * 0.9 + aPhase * 40.0) * 0.28 * life;
        p.z += cos(uTime * 0.7 + aPhase * 34.0) * 0.2 * life;
        vFade = smoothstep(0.0, 0.18, life) * (1.0 - smoothstep(0.55, 1.0, life));
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = (0.5 + life * 1.4) * uPR * (58.0 / -mv.z);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap;
      varying float vFade;
      void main() {
        float a = texture2D(uMap, gl_PointCoord).a * vFade * 0.16;
        if (a < 0.01) discard;
        gl_FragColor = vec4(vec3(1.0, 0.94, 0.85), a);
      }
    `,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const steam = new THREE.Points(steamGeo, steamMat);
  steam.position.y = 0.05;
  world.add(steam);

  const EMBER = 750;
  const ePos = new Float32Array(EMBER * 3);
  const eCol = new Float32Array(EMBER * 3);
  const ePhase = new Float32Array(EMBER);
  const eSpeed = new Float32Array(EMBER);
  const palette = [new THREE.Color(0xffc978), new THREE.Color(0xff9a3c), new THREE.Color(0xe8b84b), new THREE.Color(0xff7a4d)];
  for (let i = 0; i < EMBER; i++) {
    ePos[i * 3] = (Math.random() - 0.5) * 22;
    ePos[i * 3 + 1] = (Math.random() - 0.5) * 14;
    ePos[i * 3 + 2] = (Math.random() - 0.5) * 14 - 3;
    const c = palette[(Math.random() * palette.length) | 0];
    eCol[i * 3] = c.r; eCol[i * 3 + 1] = c.g; eCol[i * 3 + 2] = c.b;
    ePhase[i] = Math.random();
    eSpeed[i] = 0.014 + Math.random() * 0.03;
  }
  const emberGeo = new THREE.BufferGeometry();
  emberGeo.setAttribute('position', new THREE.BufferAttribute(ePos, 3));
  emberGeo.setAttribute('color', new THREE.BufferAttribute(eCol, 3));
  emberGeo.setAttribute('aPhase', new THREE.BufferAttribute(ePhase, 1));
  emberGeo.setAttribute('aSpeed', new THREE.BufferAttribute(eSpeed, 1));

  const emberMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uMap: { value: sprite }, uPR: { value: DPR } },
    vertexShader: /* glsl */ `
      attribute float aPhase;
      attribute float aSpeed;
      uniform float uTime;
      uniform float uPR;
      varying vec3 vColor;
      varying float vTw;
      void main() {
        vColor = color;
        vTw = 0.55 + 0.45 * sin(uTime * 2.2 + aPhase * 60.0);
        vec3 p = position;
        p.y = mod(p.y + uTime * aSpeed * 10.0 + 7.0, 14.0) - 7.0;
        p.x += sin(uTime * 0.5 + aPhase * 50.0) * 0.5;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = (0.35 + aPhase * 0.9) * uPR * (52.0 / -mv.z);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap;
      varying vec3 vColor;
      varying float vTw;
      void main() {
        float a = texture2D(uMap, gl_PointCoord).a * 0.75 * vTw;
        if (a < 0.02) discard;
        gl_FragColor = vec4(vColor, a);
      }
    `,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true,
  });
  const embers = new THREE.Points(emberGeo, emberMat);
  scene.add(embers);

  const ringMat = new THREE.MeshBasicMaterial({ color: 0xffb45c, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false });
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.012, 8, 160), ringMat);
  ring1.rotation.x = Math.PI / 2.4;
  ring1.position.y = -0.3;
  world.add(ring1);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.1, 0.008, 8, 160), ringMat.clone());
  ring2.material.opacity = 0.14;
  ring2.rotation.x = Math.PI / 1.9;
  ring2.rotation.z = 0.4;
  ring2.position.y = 0.2;
  world.add(ring2);

  scene.add(new THREE.AmbientLight(0x603515, 1.4));
  const key = new THREE.DirectionalLight(0xffd9a0, 2.4);
  key.position.set(3, 4, 5);
  scene.add(key);
  const rim = new THREE.PointLight(0xff7a2a, 26, 20);
  rim.position.set(-3.4, 1.4, -2.6);
  scene.add(rim);
  const fill = new THREE.PointLight(0xffc76a, 14, 16);
  fill.position.set(2.6, -0.6, 3.2);
  scene.add(fill);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.38, 0.65, 0.82));
  composer.addPass(new OutputPass());

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('pointermove', (e) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  let scrollP = 0;
  let capturing = false;
  const onScroll = () => {
    if (capturing) return;
    scrollP = Math.min(window.scrollY / window.innerHeight, 1.6);
    const op = Math.max(1 - scrollP * 1.1, 0.1);
    document.documentElement.style.setProperty('--scene-opacity', op.toFixed(3));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  window.addEventListener('resize', () => {
    if (capturing) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
  });

  const t0 = performance.now();
  let raf = 0;

  function applyFrame(t) {
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;

    pot.rotation.y = t * 0.22 + mouse.x * 0.35;
    world.rotation.x = mouse.y * 0.1;

    const breathe = 1 + Math.sin(t * 2.1) * 0.05;
    tableGlow.material.opacity = 0.5 + Math.sin(t * 2.1) * 0.12;
    tableGlow.scale.setScalar(breathe);

    ring1.rotation.z = t * 0.16;
    ring2.rotation.z = -t * 0.11;

    steamMat.uniforms.uTime.value = t;
    emberMat.uniforms.uTime.value = t;

    camera.position.z = 6.4 + scrollP * 1.8;
    camera.position.x = mouse.x * 0.4;
    camera.position.y = 0.55 - mouse.y * 0.25 - scrollP * 0.5;
    camera.lookAt(0, 0.15 - scrollP * 0.3, 0);

    composer.render();
  }

  function tick() {
    raf = requestAnimationFrame(tick);
    applyFrame((performance.now() - t0) / 1000);
  }
  tick();

  window.__capture = {
    async renderRange(startFrame, count, fps) {
      const FPS = fps || 30;
      const W = 1280, H = 720;
      capturing = true;
      cancelAnimationFrame(raf);
      raf = 0;

      renderer.setPixelRatio(1);
      renderer.setSize(W, H, false);
      renderer.setClearColor(0x140b07, 1);
      composer.setSize(W, H);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      mouse.x = mouse.tx = 0;
      mouse.y = mouse.ty = 0;
      scrollP = 0;

      try {
        for (let i = 0; i < count; i++) {
          const idx = startFrame + i;
          applyFrame(idx / FPS);
          const data = renderer.domElement.toDataURL('image/jpeg', 0.95).split(',')[1];
          const r = await fetch('/__frame', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: String(idx).padStart(4, '0'), ext: 'jpg', data }),
          });
          if (!r.ok) throw new Error('frame POST failed: ' + r.status);
        }
      } finally {
        renderer.setPixelRatio(DPR);
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        capturing = false;
        if (!raf) tick();
        onScroll();
      }
      return count;
    },
  };

  return { dispose() { cancelAnimationFrame(raf); renderer.dispose(); } };
}

/* ------------------------------------------------------------
   4. UI — reveals, nav, chips, tilt
   ------------------------------------------------------------ */
function initReveals() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
  els.forEach((el) => io.observe(el));
}

function initNav() {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const links = document.getElementById('navLinks');
  if (!nav || !burger || !links) return;

  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  links.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      links.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
}

function initMenuSpy() {
  const chips = document.querySelectorAll('.menu__chip');
  if (!chips.length || !('IntersectionObserver' in window)) return;
  const byId = new Map();
  chips.forEach((c) => byId.set(c.getAttribute('href').slice(1), c));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        chips.forEach((c) => c.classList.remove('active'));
        const chip = byId.get(en.target.id);
        if (chip) chip.classList.add('active');
      }
    });
  }, { rootMargin: '-30% 0px -55% 0px' });

  byId.forEach((_, id) => {
    const el = document.getElementById(id);
    if (el) io.observe(el);
  });
}

function initTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.transform = `perspective(900px) rotateX(${(y - 0.5) * -6}deg) rotateY(${(x - 0.5) * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}

/* ------------------------------------------------------------
   boot
   ------------------------------------------------------------ */
renderMenu();
initScene();
initReveals();
initNav();
initMenuSpy();
initTilt();
