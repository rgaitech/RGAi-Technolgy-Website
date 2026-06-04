/* ============================================================
   AURORA.JS — Interactive Canvas Aurora Gradient Background
   ============================================================ */
(function initAurora() {
  'use strict';

  const canvas = document.getElementById('auroraCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let width = 0;
  let height = 0;

  // Configuration for 4 Aurora Blobs
  const blobs = [
    {
      x: 0.1, y: 0.1,
      targetX: 0.1, targetY: 0.1,
      radius: 0.45,
      color: { r: 0, g: 102, b: 255, a: 0.25 }, // Accent Blue
      speed: 0.002,
      angle: 0
    },
    {
      x: 0.8, y: 0.2,
      targetX: 0.8, targetY: 0.2,
      radius: 0.4,
      color: { r: 124, g: 58, b: 237, a: 0.20 }, // Purple
      speed: 0.0015,
      angle: Math.PI * 0.5
    },
    {
      x: 0.3, y: 0.8,
      targetX: 0.3, targetY: 0.8,
      radius: 0.35,
      color: { r: 16, g: 185, b: 129, a: 0.15 }, // Green
      speed: 0.001,
      angle: Math.PI
    },
    {
      x: 0.7, y: 0.7,
      targetX: 0.7, targetY: 0.7,
      radius: 0.3,
      color: { r: 245, g: 158, b: 11, a: 0.10 }, // Amber
      speed: 0.0025,
      angle: Math.PI * 1.5
    }
  ];

  // Handle Resize
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    
    // Scale for high DPI displays
    const dpi = window.devicePixelRatio || 1;
    canvas.width = width * dpi;
    canvas.height = height * dpi;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpi, dpi);
  }

  // Mouse Interaction (nudges blobs slightly)
  let mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
  
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX / window.innerWidth;
    mouse.targetY = e.clientY / window.innerHeight;
  });

  // Main Loop
  function tick(timestamp) {
    if (!width || !height) return;

    // Clear Canvas
    ctx.clearRect(0, 0, width, height);

    // Smooth mouse interpolation
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    // Check Theme
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    blobs.forEach((blob, index) => {
      // Calculate slow orbital/random path
      blob.angle += blob.speed;
      const radiusOffset = 0.08 * Math.sin(blob.angle * 2.5);
      
      // Target position based on orbits
      let orbitX = blob.targetX + 0.12 * Math.cos(blob.angle);
      let orbitY = blob.targetY + 0.12 * Math.sin(blob.angle);

      // Add small mouse push away/pull effect
      const dx = mouse.x - orbitX;
      const dy = mouse.y - orbitY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 0.4) {
        // Push away slightly
        const force = (0.4 - dist) * 0.08;
        orbitX -= (dx / dist) * force;
        orbitY -= (dy / dist) * force;
      }

      // Smooth current positions
      blob.x += (orbitX - blob.x) * 0.02;
      blob.y += (orbitY - blob.y) * 0.02;

      // Draw Radial Gradient
      const absX = blob.x * width;
      const absY = blob.y * height;
      const absRadius = (blob.radius + radiusOffset) * Math.max(width, height);

      const grad = ctx.createRadialGradient(absX, absY, 0, absX, absY, absRadius);
      
      // Adjust alpha for light vs dark mode
      let alphaMultiplier = isDark ? 1.0 : 0.45;
      
      const c = blob.color;
      grad.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a * alphaMultiplier})`);
      grad.addColorStop(0.3, `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a * 0.5 * alphaMultiplier})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(absX, absY, absRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    animationFrameId = requestAnimationFrame(tick);
  }

  // Setup Lifecycle
  window.addEventListener('resize', resize);
  resize();

  // Page visibility awareness (pauses animation when tab inactive)
  let isTabActive = true;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isTabActive = false;
      cancelAnimationFrame(animationFrameId);
    } else {
      isTabActive = true;
      animationFrameId = requestAnimationFrame(tick);
    }
  });

  // Start
  if (isTabActive) {
    animationFrameId = requestAnimationFrame(tick);
  }
})();
