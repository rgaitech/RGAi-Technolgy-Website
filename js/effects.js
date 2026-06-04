/* ============================================================
   JS/EFFECTS.JS — Visual Orchestrator for 100+ FX Catalog
   ============================================================ */
(function initEffectsOrchestrator() {
  'use strict';

  // Lifecycle
  document.addEventListener('DOMContentLoaded', () => {
    injectGlobalProgressBar();
    initScrollRevealObserver();
    initTextLetterSplitter();
    initSiblingCardBlurInteractions();
    initMouseScrollParallax();
    initClickRippleEffects();
  });

  // Hot refresh handler for dynamic SPA transitions
  window.refreshVisualEffects = () => {
    initScrollRevealObserver();
    initTextLetterSplitter();
    initSiblingCardBlurInteractions();
    initMouseScrollParallax();
  };

  /* ==================== 1. Scroll Progress Bar ==================== */
  function injectGlobalProgressBar() {
    if (document.getElementById('fxGlobalProgressBar')) return;

    const bar = document.createElement('div');
    bar.id = 'fxGlobalProgressBar';
    bar.className = 'fx-scroll-indicator';
    document.body.appendChild(bar);

    const handleScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      if (docH <= 0) return;
      const progress = (window.scrollY / docH) * 100;
      bar.style.width = progress + '%';
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ==================== 2. Scroll Reveal IntersectionObserver ==================== */
  function initScrollRevealObserver() {
    const selector = `
      .fx-scroll-reveal-item,
      .fx-scroll-reveal-text,
      .fx-scroll-reveal-left,
      .fx-scroll-reveal-right,
      .fx-scroll-reveal-scale,
      .fx-scroll-highlight,
      .fx-scroll-blur-fade,
      .fx-scroll-rotate-in,
      .fx-scroll-scale-up,
      .fx-scroll-clip-down,
      .fx-scroll-clip-up,
      .fx-scroll-clip-right,
      .fx-scroll-clip-left
    `;

    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          
          // If it's a character reveal, animate children letters sequentially
          if (entry.target.classList.contains('fx-scroll-reveal-text')) {
            animateLetters(entry.target);
          }
          
          // Once revealed, unobserve to free resources (unless looping desired)
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    elements.forEach(el => observer.observe(el));
  }

  /* ==================== 3. Sequential Letters Splitter Reveal ==================== */
  function initTextLetterSplitter() {
    const textEls = document.querySelectorAll('.fx-scroll-reveal-text');
    
    textEls.forEach(el => {
      // Avoid double splitting
      if (el.querySelector('.letter')) return;

      const rawText = el.textContent;
      el.textContent = "";
      
      // Wrap characters in span classes
      for(let char of rawText) {
        const span = document.createElement('span');
        span.className = 'letter';
        span.textContent = char === " " ? "\u00A0" : char; // Handle white spaces
        el.appendChild(span);
      }
    });
  }

  function animateLetters(parent) {
    const letters = parent.querySelectorAll('.letter');
    letters.forEach((l, idx) => {
      // Stagger transitions using inline delay styles
      l.style.transitionDelay = (idx * 25) + 'ms';
      l.style.opacity = '1';
    });
  }

  /* ==================== 4. Sibling Blur Hover Coordinator ==================== */
  function initSiblingCardBlurInteractions() {
    // Target any common grid layout housing interactive items
    const grids = document.querySelectorAll(`
      .services-grid, 
      .portfolio-grid, 
      .agents-grid, 
      .curriculum-grid, 
      .options-grid, 
      .stats-grid,
      .reviews-badge-row,
      .careers-grid
    `);

    grids.forEach(grid => {
      const cards = grid.children;
      if (cards.length <= 1) return;

      // Inline styles injection hook to dim/blur sibling nodes
      const dimStyle = 'transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1); opacity: 0.45; filter: blur(2px) scale(0.97);';
      const hoverStyle = 'transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1); opacity: 1; filter: none; transform: scale3d(1.03, 1.03, 1.03); z-index: 5;';
      const resetStyle = 'transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1); opacity: 1; filter: none; transform: none; z-index: auto;';

      Array.from(cards).forEach(card => {
        // Only run on desktop/devices with cursors
        if (window.matchMedia('(hover: none)').matches) return;

        card.addEventListener('mouseenter', () => {
          Array.from(cards).forEach(sibling => {
            if (sibling === card) {
              sibling.setAttribute('style', hoverStyle);
            } else {
              sibling.setAttribute('style', dimStyle);
            }
          });
        });

        card.addEventListener('mouseleave', () => {
          Array.from(cards).forEach(sibling => {
            sibling.setAttribute('style', resetStyle);
            // Quick cleanup
            setTimeout(() => sibling.removeAttribute('style'), 350);
          });
        });
      });
    });
  }

  /* ==================== 5. Scroll Parallax Multiplier ==================== */
  function initMouseScrollParallax() {
    const parallaxItems = document.querySelectorAll('.fx-scroll-parallax-bg');
    if (parallaxItems.length === 0) return;

    let tick = false;

    window.addEventListener('scroll', () => {
      if (!tick) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          parallaxItems.forEach(item => {
            // Shift item by scroll offset * multiplier (default: 0.15)
            const speed = parseFloat(item.getAttribute('data-parallax-speed')) || 0.15;
            item.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
          });
          tick = false;
        });
        tick = true;
      }
    }, { passive: true });
  }

  /* ==================== 6. Click Ripples State Action ==================== */
  function initClickRippleEffects() {
    const targets = document.querySelectorAll('.btn, .btn-magnetic, .range-btn, .option-card, .sidebar-item');

    targets.forEach(target => {
      // Avoid duplicated listener assignments
      if (target.getAttribute('data-ripple-bound')) return;
      target.setAttribute('data-ripple-bound', '1');

      target.addEventListener('click', function(e) {
        // Ensure relative layout context
        const position = window.getComputedStyle(this).position;
        if (position !== 'absolute' && position !== 'fixed' && position !== 'sticky') {
          this.style.position = 'relative';
        }
        this.style.overflow = 'hidden';

        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.className = 'fx-state-click-ripple';
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        this.appendChild(ripple);
        
        // Remove ripple node after animation
        setTimeout(() => ripple.remove(), 700);
      });
    });
  }

})();
