/* ============================================================
   STATS.JS — Counter Animation + SVG Circle Progress
   ============================================================ */
'use strict';

(function initStats() {
  initCounters();
  initCircleProgress();
  initStatsBgGSAP();
})();

/* ---- Animated Number Counter ---- */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target   = parseInt(el.getAttribute('data-target'));
    const suffix   = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const start    = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.floor(easeOut(progress) * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  };

  // Intersection Observer — trigger when visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ---- SVG Circle Progress ---- */
function initCircleProgress() {
  const circles = document.querySelectorAll('.stat-progress[data-percent]');
  if (!circles.length) return;

  const circumference = 2 * Math.PI * 52; // r=52

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el      = entry.target;
        const percent = parseInt(el.getAttribute('data-percent'));
        const offset  = circumference - (percent / 100) * circumference;

        el.style.strokeDasharray  = circumference;
        el.style.strokeDashoffset = circumference;

        // Force reflow then animate
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.22, 1, 0.36, 1)';
            el.style.strokeDashoffset = offset;
          });
        });

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  circles.forEach(c => observer.observe(c));
}

/* ---- GSAP Stats Section ---- */
function initStatsBgGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const cards = document.querySelectorAll('.stat-card');
  if (!cards.length) return;

  gsap.fromTo(cards,
    { scale: 0.85, opacity: 0, y: 30 },
    {
      scale: 1, opacity: 1, y: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: 'back.out(1.4)',
      scrollTrigger: {
        trigger: '#stats',
        start: 'top 75%',
        once: true,
      },
    }
  );

  // Floating particles in bg
  const bgEl = document.getElementById('statsBgAnim');
  if (bgEl) {
    for (let i = 0; i < 8; i++) {
      const dot = document.createElement('div');
      const size = Math.random() * 6 + 3;
      dot.style.cssText = `
        position:absolute;
        width:${size}px;height:${size}px;
        border-radius:50%;
        background:var(--clr-accent);
        opacity:${Math.random() * 0.12 + 0.04};
        top:${Math.random() * 100}%;
        left:${Math.random() * 100}%;
      `;
      bgEl.appendChild(dot);
      gsap.to(dot, {
        y: -60 - Math.random() * 60,
        x: (Math.random() - 0.5) * 40,
        opacity: 0,
        duration: 4 + Math.random() * 4,
        ease: 'none',
        repeat: -1,
        delay: Math.random() * 4,
      });
    }
  }
}
