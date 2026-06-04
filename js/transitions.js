/* ============================================================
   TRANSITIONS.JS — Deluxe SPA-Style Page Transitions for Multi-Page Site
   ============================================================ */
(function initTransitions() {
  'use strict';

  // 1. Inject Page Transition Overlay HTML Dynamically
  function injectTransitionOverlay() {
    // Avoid double injection
    if (document.querySelector('.page-trans-overlay')) return;

    // Create transition overlay
    const overlay = document.createElement('div');
    overlay.className = 'page-trans-overlay in'; // Start with "in" state (visible)
    overlay.innerHTML = `
      <div class="page-trans-panel"></div>
      <div class="page-trans-panel"></div>
      <div class="page-trans-panel"></div>
      <div class="page-trans-panel"></div>
    `;

    // Create floating logo for overlay
    const logo = document.createElement('div');
    logo.className = 'page-trans-logo';
    logo.innerHTML = `<div class="page-trans-logo-text">RGA<span>i</span></div>`;

    document.body.appendChild(overlay);
    document.body.appendChild(logo);

    // Trigger Out transition shortly after initialization
    setTimeout(() => {
      overlay.classList.remove('in');
      overlay.classList.add('out');
      
      // Clean up pointer events after slide out is done
      setTimeout(() => {
        overlay.style.visibility = 'hidden';
      }, 700);
    }, 100);
  }

  // 2. Intercept Internal Link Clicks to Animate Page Unload
  function handleLinkClick(e) {
    const anchor = e.target.closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    
    // Ignore external, hash, blank targets, email/phone links
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('javascript:') ||
      anchor.getAttribute('target') === '_blank' ||
      anchor.hasAttribute('download') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:')
    ) {
      return;
    }

    // Verify origin (must be same origin or relative path)
    const isInternal = anchor.hostname === window.location.hostname || !anchor.hostname;
    if (!isInternal) return;

    // Trigger slide-in animation
    e.preventDefault();
    const overlay = document.querySelector('.page-trans-overlay');
    if (overlay) {
      overlay.style.visibility = 'visible';
      overlay.classList.remove('out');
      overlay.classList.add('in');
    }

    // Wait for transition animation to finish before moving location
    setTimeout(() => {
      window.location.href = href;
    }, 600); // Matches transition duration
  }

  // Run on page initialization
  injectTransitionOverlay();
  document.addEventListener('click', handleLinkClick);

  // Expose function for custom triggers
  window.triggerPageTransition = (targetUrl) => {
    const overlay = document.querySelector('.page-trans-overlay');
    if (overlay) {
      overlay.style.visibility = 'visible';
      overlay.classList.remove('out');
      overlay.classList.add('in');
    }
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 600);
  };
})();
