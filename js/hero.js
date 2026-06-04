/* ============================================================
   HERO.JS — Three.js Background + GSAP Entrance + Typing
   ============================================================ */
'use strict';

document.addEventListener('loaderDone', initHero);
// Also fire if loader is not present
if (!document.getElementById('loader')) initHero();

function initHero() {
  initThreeHero();
  initHeroGSAP();
  initTyping();
  initHeroParticles();
  initHeroScrollParallax();
}

/* ---- Three.js Animated Background ---- */
function initThreeHero() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // Floating geometry group
  const group    = new THREE.Group();
  const material = new THREE.MeshPhongMaterial({
    color: 0x0066FF, wireframe: true, opacity: 0.12, transparent: true,
  });

  const shapes = [
    new THREE.IcosahedronGeometry(1.2, 0),
    new THREE.OctahedronGeometry(0.8, 0),
    new THREE.TetrahedronGeometry(0.6, 0),
    new THREE.IcosahedronGeometry(0.5, 0),
    new THREE.OctahedronGeometry(0.4, 0),
  ];

  const meshes = [];
  shapes.forEach((geo, i) => {
    const mesh = new THREE.Mesh(geo, material.clone());
    mesh.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 4 - 2
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    mesh.userData = {
      rotX: (Math.random() - 0.5) * 0.006,
      rotY: (Math.random() - 0.5) * 0.008,
      floatY: Math.random() * Math.PI * 2,
      floatSpeed: 0.008 + Math.random() * 0.01,
    };
    group.add(mesh);
    meshes.push(mesh);
  });
  scene.add(group);

  // Light
  const pointLight = new THREE.PointLight(0x0066FF, 2, 20);
  pointLight.position.set(3, 3, 3);
  scene.add(pointLight);
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  // Mouse parallax
  let targetX = 0, targetY = 0;
  document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth  - 0.5) * 0.5;
    targetY = (e.clientY / window.innerHeight - 0.5) * 0.5;
  });

  // WebGL Scroll parallax tracking
  let scrollProgress = 0;
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create({
      trigger: "#home",
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        scrollProgress = self.progress;
      }
    });
  } else {
    window.addEventListener('scroll', () => {
      const heroEl = document.getElementById('home');
      if (heroEl) {
        const rect = heroEl.getBoundingClientRect();
        const totalHeight = heroEl.offsetHeight || 1;
        const currentScroll = Math.max(0, -rect.top);
        scrollProgress = Math.min(1, currentScroll / totalHeight);
      }
    }, { passive: true });
  }

  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame += 0.005;

    meshes.forEach((m) => {
      m.rotation.x += m.userData.rotX;
      m.rotation.y += m.userData.rotY;
      m.position.y += Math.sin(frame + m.userData.floatY) * 0.002;
    });

    // Premium WebGL 3D Parallax camera & scene adjustments based on scroll
    group.position.y = -scrollProgress * 3.5;
    group.rotation.z = scrollProgress * 0.45;
    camera.position.z = 5 - scrollProgress * 1.5;

    group.rotation.y += (targetX - group.rotation.y) * 0.04;
    group.rotation.x += (-targetY - group.rotation.x) * 0.04;

    renderer.render(scene, camera);
  }
  animate();

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* ---- GSAP Entrance Animation ---- */
function initHeroGSAP() {
  if (typeof gsap === 'undefined') return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl
    .to('#heroBadge', { opacity: 1, y: 0, duration: 0.7, delay: 0.2 })
    .to('.hero-headline .line', {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.15,
    }, '-=0.3')
    .to('#heroSub',  { opacity: 1, y: 0, duration: 0.6 }, '-=0.2')
    .to('#heroBtns', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
    .to('#heroSocials', { opacity: 1, y: 0, duration: 0.6 }, '-=0.45')
    .to('#heroGlassCard', { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.5)' }, '-=0.25');
}

/* ---- Typing Effect ---- */
function initTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const phrases = [
    'Web Development',
    'AI Solutions',
    'Mobile Apps',
    'Business Automation',
    'Digital Growth',
    'UI/UX Design',
  ];

  let pIdx = 0, cIdx = 0, deleting = false;
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  el.parentNode.insertBefore(cursor, el.nextSibling);

  function type() {
    const phrase = phrases[pIdx];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++cIdx);
      if (cIdx === phrase.length) {
        deleting = true;
        return setTimeout(type, 2000);
      }
    } else {
      el.textContent = phrase.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 50 : 80);
  }

  // Start after entrance animation
  setTimeout(type, 1800);
}

/* ---- Particle System ---- */
function initHeroParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const count = window.innerWidth < 768 ? 20 : 50;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * 30}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: 0;
    `;
    // Random colors between accent colors
    const colors = ['rgba(0,102,255,0.6)', 'rgba(124,58,237,0.5)', 'rgba(16,185,129,0.5)'];
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    container.appendChild(p);
  }
}

/* ---- GSAP Scroll Parallax Coordination ---- */
function initHeroScrollParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Slow down background canvas vertical translation
  gsap.to("#heroCanvas", {
    yPercent: 35,
    ease: "none",
    scrollTrigger: {
      trigger: "#home",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  // Slow down background particle container translation
  gsap.to("#heroParticles", {
    yPercent: 15,
    ease: "none",
    scrollTrigger: {
      trigger: "#home",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  // Float elements translate at staggered parallax speeds
  const floatEls = document.querySelectorAll(".hero-floats .float-el");
  const floatSpeeds = [-45, 30, -55, 25, -35, 45]; // depth layer multipliers
  floatEls.forEach((el, index) => {
    const speed = floatSpeeds[index] || 25;
    gsap.to(el, {
      yPercent: speed,
      ease: "none",
      scrollTrigger: {
        trigger: "#home",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  });

  // Content card fades out and scales down slightly as it recedes into depth
  gsap.to(".hero-container", {
    yPercent: 12,
    opacity: 0.15,
    scale: 0.94,
    ease: "none",
    scrollTrigger: {
      trigger: "#home",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });
}
