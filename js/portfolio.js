/* ============================================================
   PORTFOLIO.JS — Filter, Modal, GSAP Animations
   ============================================================ */
'use strict';

(function initPortfolio() {
  initFilter();
  initModal();
  initPortfolioGSAP();
})();

/* ---- Filter System ---- */
function initFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items      = document.querySelectorAll('.portfolio-item');
  if (!filterBtns.length || !items.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      items.forEach(item => {
        const cat = item.getAttribute('data-category');
        const show = filter === 'all' || cat === filter;

        if (show) {
          item.classList.remove('hidden');
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(item, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
          } else {
            item.style.opacity = '1';
          }
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

/* ---- Modal System ---- */
const modalData = {
  1: {
    gradient: 'p-gradient-1', icon: '🌐',
    tag: 'Web Development',
    title: 'FinTech Dashboard',
    desc: 'A comprehensive real-time analytics platform built for a leading fintech company. Features live market data, AI-powered investment insights, portfolio tracking, and beautiful data visualisations with Chart.js and D3.',
    techs: ['React', 'Node.js', 'PostgreSQL', 'Chart.js', 'AWS', 'TailwindCSS'],
  },
  2: {
    gradient: 'p-gradient-2', icon: '🤖',
    tag: 'AI / Machine Learning',
    title: 'AI Chatbot Platform',
    desc: 'A GPT-4 powered enterprise customer support AI platform. Multi-language support, context-aware responses, seamless CRM integration, and advanced analytics dashboard for support teams.',
    techs: ['GPT-4', 'Python', 'FastAPI', 'React', 'Pinecone', 'Redis'],
  },
  3: {
    gradient: 'p-gradient-3', icon: '📱',
    tag: 'Mobile App Development',
    title: 'Health Tracker App',
    desc: 'A cross-platform mobile health companion with AI-powered insights. Features include workout tracking, nutrition planning, sleep analysis, and personalized AI health recommendations.',
    techs: ['React Native', 'TypeScript', 'Firebase', 'TensorFlow Lite', 'HealthKit'],
  },
  4: {
    gradient: 'p-gradient-4', icon: '🎨',
    tag: 'UI/UX Design',
    title: 'SaaS Design System',
    desc: 'Complete brand identity and component library for a B2B SaaS startup. Includes 200+ components, dark/light theme tokens, accessibility-first design, and Storybook documentation.',
    techs: ['Figma', 'Storybook', 'React', 'Design Tokens', 'WCAG 2.1'],
  },
  5: {
    gradient: 'p-gradient-5', icon: '🛍️',
    tag: 'Web Development',
    title: 'E-Commerce Platform',
    desc: 'High-performance e-commerce platform with AI-driven product recommendation engine, dynamic pricing, inventory automation, and a 3x conversion rate improvement through smart UX.',
    techs: ['Next.js', 'Shopify API', 'Python ML', 'PostgreSQL', 'Stripe', 'Vercel'],
  },
  6: {
    gradient: 'p-gradient-6', icon: '⚡',
    tag: 'Business Automation',
    title: 'RPA Workflow Engine',
    desc: 'Enterprise-grade robotic process automation platform that saved 40+ hours/week. Automated invoice processing, HR onboarding, and CRM updates with zero manual intervention.',
    techs: ['Python', 'UiPath', 'Microsoft Power Automate', 'Azure', 'SQL Server'],
  },
};

function initModal() {
  const overlay  = document.getElementById('portfolioModal');
  const closeBtn = document.getElementById('modalClose');
  const content  = document.getElementById('modalContent');
  if (!overlay || !closeBtn || !content) return;

  // Open modal
  document.querySelectorAll('.p-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id   = parseInt(btn.getAttribute('data-modal'));
      const data = modalData[id];
      if (!data) return;

      content.innerHTML = `
        <div class="modal-img ${data.gradient}">${data.icon}</div>
        <p class="modal-tag">${data.tag}</p>
        <h2 class="modal-title">${data.title}</h2>
        <p class="modal-desc">${data.desc}</p>
        <div class="modal-techs">
          ${data.techs.map(t => `<span class="modal-tech">${t}</span>`).join('')}
        </div>
      `;
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Also open on card click
  document.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('click', () => {
      const btn = card.querySelector('.p-view-btn');
      if (btn) btn.click();
    });
  });

  // Close
  const close = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

/* ---- GSAP Portfolio Animations ---- */
function initPortfolioGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const items = document.querySelectorAll('.portfolio-item');
  if (!items.length) return;

  gsap.fromTo(items,
    { y: 40, opacity: 0 },
    {
      y: 0, opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#portfolio',
        start: 'top 75%',
        once: true,
      },
    }
  );
}
