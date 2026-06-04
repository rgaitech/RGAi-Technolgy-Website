/* ============================================================
   SERVICES.JS — Card Tilt + Hover Animations + GSAP Scroll
   ============================================================ */
'use strict';

(function initServices() {
  initCardTilt();
  initServiceGSAP();
})();

/* ---- 3D Card Tilt ---- */
function initCardTilt() {
  const cards = document.querySelectorAll('.service-card[data-tilt]');
  if (!cards.length) return;

  cards.forEach(card => {
    const inner = card;

    card.addEventListener('mousemove', (e) => {
      const rect    = card.getBoundingClientRect();
      const cx      = rect.left + rect.width  / 2;
      const cy      = rect.top  + rect.height / 2;
      const dx      = (e.clientX - cx) / (rect.width  / 2);
      const dy      = (e.clientY - cy) / (rect.height / 2);
      const rotX    = -dy * 8;
      const rotY    =  dx * 8;

      inner.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px) scale(1.01)`;
    });

    card.addEventListener('mouseleave', () => {
      inner.style.transform = '';
      inner.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      setTimeout(() => { inner.style.transition = ''; }, 500);
    });

    card.addEventListener('mouseenter', () => {
      inner.style.transition = 'transform 0.15s ease';
    });
  });
}

/* ---- GSAP Scroll Reveal for Services ---- */
function initServiceGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const cards = document.querySelectorAll('.service-card');
  if (!cards.length) return;

  gsap.fromTo(cards,
    { y: 50, opacity: 0 },
    {
      y: 0, opacity: 1,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#services',
        start: 'top 80%',
        once: true,
      },
    }
  );

  // Icon floating animation
  document.querySelectorAll('.service-icon').forEach((icon, i) => {
    gsap.to(icon, {
      y: -8,
      duration: 2 + i * 0.2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: i * 0.15,
    });
  });
}
