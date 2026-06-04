/* ============================================================
   CONTACT.JS — Luxury Form Logic, EmailJS, Firestore & Modals
   ============================================================ */
'use strict';

(function initContactPage() {
  // Configs
  const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY"; // Placeholder for client configuration
  const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID"; // Placeholder
  const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID"; // Placeholder

  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  };

  let db = null;
  let isFirebaseActive = false;
  let captchaAnswer = 0;

  // Initialize Modules on Load
  document.addEventListener('DOMContentLoaded', () => {
    initFirebase();
    initEmailJS();
    initMathCaptcha();
    initFormValidation();
    initFAQAccordion();
    initCalendlyModal();
  });

  /* ==================== 1. Firebase Initialization ==================== */
  function initFirebase() {
    if (typeof firebase !== 'undefined' && firebaseConfig.apiKey !== 'YOUR_API_KEY') {
      try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        isFirebaseActive = true;
        console.log('🔥 Contact Page: Firebase Firestore initialized.');
      } catch (err) {
        console.warn('Firebase initialization failed. Storing leads locally.', err);
      }
    } else {
      console.log('📦 Contact Page: Firebase keys unconfigured. Running in LocalStorage fallback mode.');
    }
  }

  /* ==================== 2. EmailJS Initialization ==================== */
  function initEmailJS() {
    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
      try {
        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
        console.log('📨 Contact Page: EmailJS initialized.');
      } catch (err) {
        console.warn('EmailJS initialization failed.', err);
      }
    }
  }

  /* ==================== 3. Math Captcha Spambot Blocker ==================== */
  function initMathCaptcha() {
    const questionEl = document.getElementById('captchaQuestion');
    if (!questionEl) return;

    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    captchaAnswer = num1 + num2;
    questionEl.textContent = `What is ${num1} + ${num2}?`;
  }

  /* ==================== 4. Luxury Form Validation & Counter ==================== */
  function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const messageField = document.getElementById('message');
    const charCounter = document.getElementById('charCount');

    // Message Character Counter
    if (messageField && charCounter) {
      messageField.addEventListener('input', () => {
        const len = messageField.value.length;
        charCounter.textContent = `${len} / 1000`;
        if (len > 1000) {
          messageField.value = messageField.value.substring(0, 1000);
          charCounter.textContent = `1000 / 1000`;
        }
      });
    }

    // Input fields real-time validation triggers
    const fields = form.querySelectorAll('.lux-input');
    fields.forEach(input => {
      // Blur validation
      input.addEventListener('blur', () => {
        validateField(input);
      });
      // Clear error state on focus
      input.addEventListener('focus', () => {
        clearError(input);
      });
      // Live validation on typing after error is shown
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          validateField(input);
        }
      });
    });

    // Main Submit Handler
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // A. Spam Honeypot Protection
      const hp = document.getElementById('website').value;
      if (hp !== '') {
        console.warn('🤖 Bot submission intercepted.');
        window.location.href = 'thankyou.html'; // Silently redirect spambot
        return;
      }

      // B. Validation Check
      let isValid = true;
      fields.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });

      // C. Math Captcha Verification
      const captchaInput = document.getElementById('captchaInput');
      const captchaError = document.getElementById('captchaError');
      if (captchaInput) {
        const val = parseInt(captchaInput.value.trim());
        if (val !== captchaAnswer) {
          isValid = false;
          captchaInput.classList.add('error');
          if (captchaError) {
            captchaError.classList.add('visible');
            captchaError.textContent = 'Incorrect verification code.';
          }
        } else {
          captchaInput.classList.remove('error');
          if (captchaError) captchaError.classList.remove('visible');
        }
      }

      if (!isValid) {
        // Shake form on validation failure
        if (typeof gsap !== 'undefined') {
          gsap.to(form, {
            x: -10,
            duration: 0.08,
            repeat: 5,
            yoyo: true,
            ease: 'none',
            onComplete: () => gsap.set(form, { x: 0 })
          });
        }
        return;
      }

      // D. Loading State Activation
      const submitBtn = document.getElementById('submitBtn');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnSpinner = submitBtn.querySelector('.btn-spinner');
      
      submitBtn.disabled = true;
      if (btnText) btnText.style.display = 'none';
      if (btnSpinner) btnSpinner.style.display = 'inline-block';

      // E. Gathering Leads Data
      const leadData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        company: document.getElementById('company').value.trim() || 'Not Provided',
        service: document.getElementById('service').value,
        budget: document.getElementById('budget').value,
        message: messageField.value.trim(),
        date: new Date().toISOString(),
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      };

      // F. Store Leads (Firestore or LocalStorage Fallback)
      try {
        if (isFirebaseActive) {
          await db.collection('leads').add(leadData);
          console.log('✅ Lead saved to Firestore database.');
        } else {
          const localLeads = JSON.parse(localStorage.getItem('rgai-leads') || '[]');
          localLeads.push(leadData);
          localStorage.setItem('rgai-leads', JSON.stringify(localLeads));
          console.log('💾 Lead saved locally to browser storage.');
        }
      } catch (err) {
        console.error('Error saving lead: ', err);
      }

      // G. Send email via EmailJS (if configured)
      if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
        try {
          const emailParams = {
            subject: 'New Website Inquiry - RGAi Technology',
            from_name: leadData.name,
            from_email: leadData.email,
            phone: leadData.phone,
            company: leadData.company,
            service: leadData.service,
            budget: leadData.budget,
            project_details: leadData.message,
            submission_date: leadData.timestamp,
            to_email: 'rgai.tech@gmail.com'
          };
          
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, emailParams);
          console.log('📧 Inquiry email successfully dispatched to admin.');
        } catch (err) {
          console.warn('EmailJS failed to deliver. Form will still complete.', err);
        }
      } else {
        console.log('✉️ EmailJS not configured. Simulating transmission.');
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // H. Success Transition and Redirection
      if (typeof gsap !== 'undefined') {
        const card = document.querySelector('.contact-form-glass-card');
        gsap.to(card, {
          scale: 0.95,
          opacity: 0,
          duration: 0.4,
          ease: 'power3.in',
          onComplete: () => {
            window.location.href = 'thankyou.html';
          }
        });
      } else {
        window.location.href = 'thankyou.html';
      }
    });

    // Character limit validator helpers
    const validators = {
      name: (v) => v.trim().length >= 2,
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      phone: (v) => v.trim() === '' || /^[\d\s\+\-\(\)]{7,18}$/.test(v.trim()),
      service: (v) => v !== '' && v !== null,
      budget: (v) => v !== '' && v !== null,
      message: (v) => v.trim().length >= 10,
    };

    const errorMsgs = {
      name: 'Please enter your full name (at least 2 characters)',
      email: 'Please enter a valid email address (e.g. name@domain.com)',
      phone: 'Please enter a valid phone number format',
      service: 'Please select the service type required',
      budget: 'Please select your estimated budget range',
      message: 'Please tell us about your project in detail (min. 10 characters)'
    };

    function validateField(input) {
      const id = input.id;
      const val = input.value;
      const validator = validators[id];
      if (!validator) return true;

      const isValid = validator(val);
      const errorEl = document.getElementById(id + 'Error');

      if (!isValid) {
        input.classList.remove('valid');
        input.classList.add('error');
        if (errorEl) {
          errorEl.textContent = errorMsgs[id] || 'This field is required';
          errorEl.classList.add('visible');
        }
        return false;
      } else {
        input.classList.remove('error');
        input.classList.add('valid');
        if (errorEl) errorEl.classList.remove('visible');
        return true;
      }
    }

    function clearError(input) {
      input.classList.remove('error');
      const errorEl = document.getElementById(input.id + 'Error');
      if (errorEl) errorEl.classList.remove('visible');
    }
  }

  /* ==================== 5. FAQ Accordion Logic ==================== */
  function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const header = item.querySelector('.faq-header');
      const body = item.querySelector('.faq-body');
      
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        
        // Collapse all other accordions
        faqItems.forEach(sibling => {
          if (sibling !== item && sibling.classList.contains('open')) {
            sibling.classList.remove('open');
            sibling.querySelector('.faq-body').style.maxHeight = '0px';
          }
        });
        
        // Toggle current item
        if (isOpen) {
          item.classList.remove('open');
          body.style.maxHeight = '0px';
        } else {
          item.classList.add('open');
          body.style.maxHeight = `${body.scrollHeight}px`;
        }
      });
    });
  }

  /* ==================== 6. Calendly Modal Popup Logic ==================== */
  function initCalendlyModal() {
    const trigger = document.getElementById('calendlyTrigger');
    const modal = document.getElementById('calendlyModal');
    const closeBtn = document.getElementById('calendlyCloseBtn');
    const overlay = document.getElementById('calendlyOverlay');
    
    if (!trigger || !modal) return;

    function openModal(e) {
      if (e) e.preventDefault();
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    trigger.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);

    // Escape key press support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });
  }

})();
