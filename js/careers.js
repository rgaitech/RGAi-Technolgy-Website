/* ============================================================
   CAREERS.JS — Job Opportunities Filter & Modal Applications
   ============================================================ */
(function initCareers() {
  'use strict';

  // Job Details Data Source
  const jobDetails = {
    'nlp-eng': {
      title: 'Senior NLP Engineer',
      tag: 'AI Research',
      loc: '📍 Mumbai / Remote • Full-Time',
      overview: 'We are seeking an experienced Natural Language Processing researcher to lead the development of custom LLM prompting structures, indexing configurations, autonomous workflow systems, and vector databases for our flagship enterprise client applications.',
      requirements: [
        '3+ years of commercial NLP software engineering experience.',
        'Expertise with vector search architectures (Chroma, Pinecone, pgvector).',
        'Strong production python scripting capabilities (FastAPI, PyTorch, LangChain).',
        'Familiarity with fine-tuning open source models (Llama, Mistral).'
      ],
      benefits: [
        'Industry leading salary package + performance shares.',
        'Flexible hybrid working arrangements.',
        'Learning credits & conference allowance.'
      ]
    },
    'next-dev': {
      title: 'Fullstack Next.js Developer',
      tag: 'Engineering',
      loc: '📍 Mumbai • Full-Time',
      overview: 'Join our team as a Fullstack React Developer. You will construct responsive, pixel-perfect user experiences using Next.js, React, luxury animations (GSAP, Framer Motion), serverless database layers, and custom API routes.',
      requirements: [
        '2+ years of production experience building Next.js web applications.',
        'Deep CSS expertise (Flexbox, CSS Grid, custom variables, responsive web).',
        'Familiarity with serverless environments (Vercel, AWS, Firebase).',
        'Solid background in code optimization and SEO configurations.'
      ],
      benefits: [
        'Premium workstation allocation (Apple MacBook Pro).',
        'Regular team building events and wellness programs.',
        'Comprehensive health insurance plans.'
      ]
    },
    'uiux-lead': {
      title: 'Lead Product Designer',
      tag: 'UI/UX Design',
      loc: '📍 Remote • Full-Time',
      overview: 'We are looking for a visionary Lead Product Designer to outline high-end, futuristic design systems matching the aesthetics of brands like Stripe, Apple, and Linear. You will oversee wireframing, UX studies, and design system creation in Figma.',
      requirements: [
        '3+ years of UX/UI design experience for consumer SaaS platforms.',
        'Stunning portfolio demonstrating dark/light luxury layouts, clean grids, and custom typography.',
        'Mastery of Figma (advanced components, auto layout, prototyping).',
        'Familiarity with basic CSS/HTML to ensure developer compatibility.'
      ],
      benefits: [
        '100% remote workspace setup credit.',
        'Direct collaboration with founding partners.',
        'Uncapped career growth pathways.'
      ]
    },
    'flutter-dev': {
      title: 'Mobile App Developer (Flutter)',
      tag: 'Engineering',
      loc: '📍 Mumbai / Hybrid • Full-Time',
      overview: 'Lead mobile engineering for our consumer mobile applications. You will write clean, well-tested Dart code, configure native device bridge SDKs, and build custom widget interfaces that feel extremely smooth.',
      requirements: [
        '2+ years development background using Dart and Flutter frameworks.',
        'Released at least 2 mobile applications to App Store or Google Play.',
        'Experience with client-side state management (Bloc, Provider, or Riverpod).',
        'Integrations with Firebase Firestore APIs and OAuth services.'
      ],
      benefits: [
        'Modern, light filled office workspace in Mumbai.',
        'Annual technology upgrade budget.',
        'Equity shares eligibility (ESOP).'
      ]
    },
    'tech-sales': {
      title: 'Technical Sales Executive',
      tag: 'Business Dev',
      loc: '📍 Mumbai • Full-Time',
      overview: 'Drive customer acquisitions for our custom AI solutions, digital engineering developments, and automations. You will conduct discovery calls, prepare solution documents, and secure contract seals with startup founders and enterprise partners.',
      requirements: [
        '2+ years experience in technical sales, B2B sales, or agency accounts.',
        'Basic understanding of modern tech (Web, Mobile Apps, AI, Databases).',
        'Outstanding written and verbal English communication abilities.',
        'Skilled negotiator with client relationship management expertise.'
      ],
      benefits: [
        'Highly attractive commission structure (no upper cap).',
        'Mentorship under director of business development.',
        'Travel allowances and cell phone credits.'
      ]
    }
  };

  // DOM Elements
  const filterButtons = document.querySelectorAll('.careers-filters .filter-btn');
  const jobCards = document.querySelectorAll('.careers-listings-sec .careers-card');
  const modal = document.getElementById('jobModal');
  const closeBtn = document.querySelector('#jobModal .modal-close-btn');
  const applyForm = document.getElementById('careersApplyForm');

  // Modal specific fields
  const modalTitle = document.getElementById('modalTitle');
  const modalTag = document.getElementById('modalTag');
  const modalLoc = document.getElementById('modalLoc');
  const modalOverview = document.getElementById('modalOverview');
  const modalRequirements = document.getElementById('modalRequirements');
  const modalBenefits = document.getElementById('modalBenefits');

  let activeJobId = '';

  // 1. Department Filtering Logic
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button active states
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetDept = btn.getAttribute('data-dept');

      jobCards.forEach(card => {
        const cardDept = card.getAttribute('data-dept');
        if (targetDept === 'all' || cardDept === targetDept) {
          card.classList.remove('hidden');
          // Simple stagger layout entrance
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(card, 
              { opacity: 0, y: 15 }, 
              { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
            );
          }
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // 2. Modal Popup Management
  document.querySelectorAll('.view-job-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const jobId = btn.getAttribute('data-job');
      const data = jobDetails[jobId];
      if (!data) return;

      activeJobId = jobId;

      // Populate details
      modalTitle.textContent = data.title;
      modalTag.textContent = data.tag;
      modalLoc.textContent = data.loc;
      modalOverview.textContent = data.overview;

      // Build lists
      modalRequirements.innerHTML = data.requirements.map(req => `<li>${req}</li>`).join('');
      modalBenefits.innerHTML = data.benefits.map(ben => `<li>${ben}</li>`).join('');

      // Open Modal
      modal.classList.add('open');
      document.body.style.overflow = 'hidden'; // Block background scroll
    });
  });

  // Close Modal trigger
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // 3. Form Submission
  if (applyForm) {
    applyForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('appName').value;
      const email = document.getElementById('appEmail').value;
      const portfolio = document.getElementById('appPortfolio').value;
      const cover = document.getElementById('appCover').value;
      const jobName = modalTitle.textContent;

      // Build local application record
      const appRecord = {
        jobId: activeJobId,
        jobTitle: jobName,
        name,
        email,
        portfolio,
        cover,
        date: new Date().toISOString()
      };

      // Store in localStorage
      let currentApps = JSON.parse(localStorage.getItem('rgai-applications') || '[]');
      currentApps.push(appRecord);
      localStorage.setItem('rgai-applications', JSON.stringify(currentApps));

      // Build WA text
      const message = 
`💼 *RGAi Job Application Submission* 💼

• Job: ${jobName}
• Name: ${name}
• Email: ${email}
• Portfolio/GitHub: ${portfolio}

*Cover Note:*
"${cover}"

Please review my credentials and let me know about next steps.`;

      // Open WA message (Target WhatsApp: +91 9579098477)
      const encodedMsg = encodeURIComponent(message);
      const waUrl = `https://wa.me/919579098477?text=${encodedMsg}`;

      window.open(waUrl, '_blank');

      // Success notification
      if (window.showToast) {
        window.showToast('✅ Application submitted! Directing to WhatsApp...', 'success');
      } else {
        alert('✅ Application compiled successfully! Opening WhatsApp chat...');
      }

      applyForm.reset();
      closeModal();
    });
  }

})();
