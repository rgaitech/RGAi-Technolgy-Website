/* ============================================================
   ESTIMATOR.JS — Cost Calculator Interactive Logic
   ============================================================ */
(function initEstimator() {
  'use strict';

  // Calculator State
  const state = {
    service: 'web',
    serviceName: 'Web Development',
    basePrice: 15000,
    complexityMultiplier: 1.5,
    complexityName: 'Growth / Professional',
    timelineMultiplier: 1.0,
    timelineName: 'Standard Delivery',
    addonsSum: 0,
    addonsList: [],
    totalPrice: 0,
    previousPrice: 0
  };

  // DOM elements
  const serviceCards = document.querySelectorAll('#stepService .option-card');
  const complexityCards = document.querySelectorAll('#stepComplexity .option-card');
  const timelineCards = document.querySelectorAll('#stepTimeline .option-card');
  const featureCheckboxes = document.querySelectorAll('#stepFeatures input[type="checkbox"]');
  
  // Summary outputs
  const sumService = document.getElementById('sumService');
  const sumBase = document.getElementById('sumBase');
  const sumMult = document.getElementById('sumMult');
  const sumAddons = document.getElementById('sumAddons');
  const sumTimeline = document.getElementById('sumTimeline');
  const sumTotal = document.getElementById('sumTotal');

  // Lead Form
  const leadForm = document.getElementById('estimatorLeadForm');

  if (!sumTotal) {
    console.warn('Estimator summary elements not found in current DOM. Skipping calculator setup.');
    return;
  }

  // Calculate Total Cost
  function calculateTotal() {
    // Save previous price for rolling counter start point
    state.previousPrice = state.totalPrice;

    // Formula: Total = ((Base * Complexity) + Addons) * Timeline
    const calculated = ((state.basePrice * state.complexityMultiplier) + state.addonsSum) * state.timelineMultiplier;
    state.totalPrice = Math.round(calculated);

    updateBreakdownUI();
    animateCounter();
  }

  // Update Summary texts
  function updateBreakdownUI() {
    if (sumService) sumService.textContent = state.serviceName;
    if (sumBase) sumBase.textContent = `₹${state.basePrice.toLocaleString('en-IN')}`;
    
    let compTag = 'Basic';
    if (state.complexityMultiplier === 1.5) compTag = 'Growth';
    if (state.complexityMultiplier === 2.2) compTag = 'Enterprise';
    if (sumMult) sumMult.textContent = `x${state.complexityMultiplier} (${compTag})`;
    
    if (sumAddons) sumAddons.textContent = `₹${state.addonsSum.toLocaleString('en-IN')}`;
    
    let timeTag = 'Standard';
    if (state.timelineMultiplier > 1) timeTag = 'Express';
    if (sumTimeline) sumTimeline.textContent = `x${state.timelineMultiplier} (${timeTag})`;
  }

  // Animate Price Total with GSAP Rolling Counter
  function animateCounter() {
    const counterObj = { value: state.previousPrice };
    
    // Check if GSAP is available
    if (typeof gsap !== 'undefined') {
      gsap.to(counterObj, {
        value: state.totalPrice,
        duration: 0.5,
        ease: 'power2.out',
        onUpdate: () => {
          sumTotal.textContent = `₹${Math.round(counterObj.value).toLocaleString('en-IN')}`;
        }
      });
    } else {
      // Fallback
      sumTotal.textContent = `₹${state.totalPrice.toLocaleString('en-IN')}`;
    }
  }

  // Handle Service selections
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      serviceCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      state.service = card.getAttribute('data-service');
      state.serviceName = card.querySelector('h4').textContent;
      state.basePrice = parseFloat(card.getAttribute('data-base'));
      
      calculateTotal();
    });
  });

  // Handle Complexity selections
  complexityCards.forEach(card => {
    card.addEventListener('click', () => {
      complexityCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      state.complexityMultiplier = parseFloat(card.getAttribute('data-multiplier'));
      state.complexityName = card.querySelector('h4').textContent;

      calculateTotal();
    });
  });

  // Handle Timeline selections
  timelineCards.forEach(card => {
    card.addEventListener('click', () => {
      timelineCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      state.timelineMultiplier = parseFloat(card.getAttribute('data-timeline-multiplier'));
      state.timelineName = card.querySelector('h4').textContent;

      calculateTotal();
    });
  });

  // Handle Checklist items
  function updateAddons() {
    let sum = 0;
    const list = [];

    featureCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        const price = parseFloat(checkbox.getAttribute('data-price'));
        const labelText = checkbox.parentNode.querySelector('strong').textContent;
        sum += price;
        list.push(labelText);
      }
    });

    state.addonsSum = sum;
    state.addonsList = list;

    calculateTotal();
  }

  featureCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateAddons);
  });

  // Handle Form Submission (WhatsApp Integration)
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Gather input data
      const name = document.getElementById('estName').value;
      const email = document.getElementById('estEmail').value;
      const phone = document.getElementById('estPhone').value;

      // Build text message
      let addonsText = state.addonsList.length > 0 
        ? state.addonsList.map(item => `  - ${item}`).join('\n') 
        : '  - None';

      const waMessage = 
`🚀 *RGAi Project Estimate Request* 🚀

*Client Details:*
• Name: ${name}
• Email: ${email}
• WhatsApp: ${phone}

*Configuration:*
• Category: ${state.serviceName}
• Base Cost: ₹${state.basePrice.toLocaleString('en-IN')}
• Complexity: ${state.complexityName} (x${state.complexityMultiplier})
• Timeline: ${state.timelineName} (x${state.timelineMultiplier})

*Selected Add-ons:*
${addonsText}

--------------------------
💰 *Estimated Cost: ₹${state.totalPrice.toLocaleString('en-IN')}*
--------------------------

Please review this estimate and contact me for confirmation.`;

      // WhatsApp deep link URL (Target Number: +91 9579098477)
      const encodedMsg = encodeURIComponent(waMessage);
      const waUrl = `https://wa.me/919579098477?text=${encodedMsg}`;

      // Open WA in a new tab
      window.open(waUrl, '_blank');

      // Success notification
      if (window.showToast) {
        window.showToast('✅ Estimate submitted! Opening WhatsApp chat...', 'success');
      } else {
        alert('✅ Estimate compiled! Directing you to WhatsApp...');
      }
      
      leadForm.reset();
    });
  }

  // Initial Calculation
  updateAddons();

})();
