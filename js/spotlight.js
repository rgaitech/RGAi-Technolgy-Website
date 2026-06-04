/* ============================================================
   SPOTLIGHT.JS — Luxury Card & Element Spotlight Hover Effects
   ============================================================ */
(function initSpotlight() {
  'use strict';

  // Apply card spotlight coordinates tracking
  function initCardSpotlights() {
    const cards = document.querySelectorAll('.service-card, .testimonial-card, .stat-card, .portfolio-card, .contact-info-item, .estimator-card, .careers-card');

    cards.forEach(card => {
      // Ensure element has relative positioning styles for spotlight overlays
      if (window.getComputedStyle(card).position === 'static') {
        card.style.position = 'relative';
      }

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element.
        const y = e.clientY - rect.top;  // y position within the element.

        card.style.setProperty('--spotlight-x', `${x}px`);
        card.style.setProperty('--spotlight-y', `${y}px`);
      });
    });
  }

  // Spotlight text tracking (e.g. for hero headings or banner elements)
  function initTextSpotlights() {
    const headings = document.querySelectorAll('.spotlight-text');
    headings.forEach(heading => {
      heading.addEventListener('mousemove', (e) => {
        const rect = heading.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        heading.style.setProperty('--text-spotlight-x', `${x}%`);
        heading.style.setProperty('--text-spotlight-y', `${y}%`);
      });
    });
  }

  // Run on load and after custom transitions
  document.addEventListener('DOMContentLoaded', () => {
    initCardSpotlights();
    initTextSpotlights();
  });

  // Re-expose in case dynamic page transitions load new components
  window.refreshSpotlights = () => {
    initCardSpotlights();
    initTextSpotlights();
  };

  // Run immediately as well (in case DOMContentLoaded already fired)
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initCardSpotlights();
    initTextSpotlights();
  }
})();
