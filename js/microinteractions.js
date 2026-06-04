/* ============================================================
   MICROINTERACTIONS.JS — Advanced Hover & Interactive Animations
   ============================================================ */
(function initMicrointeractions() {
  'use strict';

  // 1. Dynamic Injection of Spotlight Borders into Cards
  function injectSpotlightBorders() {
    const cards = document.querySelectorAll('.service-card, .testimonial-card, .stat-card, .portfolio-card, .contact-info-item, .estimator-card, .careers-card');
    
    cards.forEach(card => {
      // Avoid injecting duplicate borders
      if (card.querySelector('.spotlight-border')) return;

      const border = document.createElement('span');
      border.className = 'spotlight-border';
      card.appendChild(border);
    });
  }

  // 2. Magnetic Buttons Effect
  function initMagneticButtons() {
    const magnets = document.querySelectorAll('.btn-magnetic');
    if (window.matchMedia('(hover: none)').matches) return; // Disable on touch devices

    magnets.forEach(magnet => {
      // Find inner element if it exists, otherwise use the whole element content
      let inner = magnet.querySelector('.btn-magnetic-inner');
      if (!inner) {
        // Wrap children in a magnetic-inner container
        const wrapper = document.createElement('span');
        wrapper.className = 'btn-magnetic-inner';
        wrapper.style.display = 'inline-block';
        wrapper.style.pointerEvents = 'none';
        
        while (magnet.firstChild) {
          wrapper.appendChild(magnet.firstChild);
        }
        magnet.appendChild(wrapper);
        inner = wrapper;
      }

      magnet.addEventListener('mousemove', (e) => {
        const rect = magnet.getBoundingClientRect();
        // Mouse coordinate relative to button center
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Move the button container (slower movement)
        gsap.to(magnet, {
          x: x * 0.35,
          y: y * 0.35,
          duration: 0.3,
          ease: 'power2.out'
        });

        // Move the inner container (faster movement for depth)
        gsap.to(inner, {
          x: x * 0.15,
          y: y * 0.15,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      magnet.addEventListener('mouseleave', () => {
        // Snap back smoothly
        gsap.to(magnet, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        gsap.to(inner, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  // 3. 3D Tilt Card Effect
  function init3DTilt() {
    const tiltCards = document.querySelectorAll('.service-card, .portfolio-card, .estimator-card');
    if (window.matchMedia('(hover: none)').matches) return;

    tiltCards.forEach(card => {
      // Ensure GSAP transform perspective is set
      gsap.set(card, { transformPerspective: 1000 });

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate rotation angles based on cursor offset from card center
        // Max tilt is 8 degrees
        const rotY = ((x - rect.width / 2) / (rect.width / 2)) * 8;
        const rotX = -((y - rect.height / 2) / (rect.height / 2)) * 8;

        gsap.to(card, {
          rotateX: rotX,
          rotateY: rotY,
          scale: 1.015,
          duration: 0.25,
          ease: 'power1.out',
          overwrite: 'auto'
        });
      });

      card.addEventListener('mouseleave', () => {
        // Return to rest
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });
    });
  }

  // Lifecycle
  document.addEventListener('DOMContentLoaded', () => {
    injectSpotlightBorders();
    initMagneticButtons();
    init3DTilt();
  });

  // Export refresh function for dynamic AJAX/transitions loading
  window.refreshMicrointeractions = () => {
    injectSpotlightBorders();
    initMagneticButtons();
    init3DTilt();
  };

  // Run immediately
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    injectSpotlightBorders();
    initMagneticButtons();
    init3DTilt();
  }
})();
