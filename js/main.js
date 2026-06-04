/* ============================================================
   MAIN.JS — Global: Loader, Navbar, Dark Mode, Cursor, Scroll Top
   ============================================================ */
'use strict';

/* ---- Loader ---- */
(function initLoader() {
  const loader  = document.getElementById('loader');
  const barEl   = document.getElementById('loaderBar');
  if (!loader) return;

  document.body.classList.add('loading');

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15 + 5;
    if (progress >= 100) { progress = 100; clearInterval(interval); }
    if (barEl) barEl.style.width = progress + '%';
  }, 100);

  window.addEventListener('load', () => {
    clearInterval(interval);
    if (barEl) barEl.style.width = '100%';
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
      document.dispatchEvent(new CustomEvent('loaderDone'));
    }, 500);
  });
})();

/* ---- Dark Mode ---- */
(function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const root   = document.documentElement;

  // Persist across pages
  const stored = localStorage.getItem('rgai-theme') || 'dark';
  root.setAttribute('data-theme', stored);

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next    = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('rgai-theme', next);
    });
  }
})();

/* ---- Navbar ---- */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const links     = document.querySelectorAll('.nav-link');

  if (!navbar) return;

  // Scroll style
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
    });
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current ||
        link.getAttribute('href') === current + '.html');
    });
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Hamburger
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      navLinks.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
})();

/* ---- Cursor Glow (desktop only) ---- */
(function initCursor() {
  const glow = document.getElementById('cursorGlow');
  const dot  = document.getElementById('cursorDot');
  if (!glow || !dot || window.matchMedia('(hover: none)').matches) return;

  let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
  let dotX = 0, dotY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth follow
  const followCursor = () => {
    glowX += (mouseX - glowX) * 0.06;
    glowY += (mouseY - glowY) * 0.06;
    dotX  += (mouseX - dotX)  * 0.25;
    dotY  += (mouseY - dotY)  * 0.25;

    glow.style.left = glowX + 'px';
    glow.style.top  = glowY + 'px';
    dot.style.left  = dotX  + 'px';
    dot.style.top   = dotY  + 'px';
    requestAnimationFrame(followCursor);
  };
  followCursor();

  // Scale on hover over interactive elements
  document.querySelectorAll('a, button, .service-card, .portfolio-card, .filter-btn').forEach(el => {
    el.addEventListener('mouseenter', () => dot.style.transform = 'translate(-50%,-50%) scale(3)');
    el.addEventListener('mouseleave', () => dot.style.transform = 'translate(-50%,-50%) scale(1)');
  });
})();

/* ---- Scroll To Top ---- */
(function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ---- AOS Init ---- */
(function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
    });
  }
})();

/* ---- Smooth Scroll for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ---- Ripple Button Effect ---- */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect   = this.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height) * 2;
    const x      = e.clientX - rect.left - size / 2;
    const y      = e.clientY - rect.top  - size / 2;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

/* ---- Newsletter Form (footer) ---- */
(function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  const msg  = document.getElementById('newsletterMsg');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (msg) {
      msg.textContent = '✅ Subscribed successfully! Welcome aboard.';
      setTimeout(() => { msg.textContent = ''; form.reset(); }, 4000);
    }
  });
})();
