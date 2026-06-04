/* ============================================================
   WHATSAPP.JS — Floating WhatsApp Widget
   WhatsApp: +91 9579098477
   ============================================================ */
(function initWhatsApp() {
  'use strict';

  // Dynamically load CSS if not already loaded
  if (!document.querySelector('link[href="css/whatsapp.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/whatsapp.css';
    document.head.appendChild(link);
  }

  const WA_NUMBER  = '919579098477';
  const WA_MESSAGE = encodeURIComponent('Hello RGAi Technology! 👋 I\'m interested in your services. Can we discuss my project?');
  const WA_URL     = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

  const html = `
    <div class="wa-widget" id="waWidget" aria-label="WhatsApp contact widget">
      <a class="wa-tooltip" id="waTooltip" href="${WA_URL}" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
        <button class="wa-close" id="waCloseTooltip" aria-label="Close tooltip">✕</button>
        <p class="wa-tip-name">RGAi Technology</p>
        <p class="wa-tip-msg">👋 Hi there! Need help with your project? Let's chat on WhatsApp.</p>
        <p class="wa-tip-time">Typically replies instantly</p>
      </a>
      <a class="wa-btn" href="${WA_URL}" target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp">
        <div class="wa-pulse"  aria-hidden="true"></div>
        <div class="wa-pulse-2" aria-hidden="true"></div>
        <div class="wa-online" aria-hidden="true"></div>
        <svg viewBox="0 0 24 24" fill="white" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>`;

  // Inject
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container.firstElementChild);

  // Close tooltip
  const closeBtn = document.getElementById('waCloseTooltip');
  const tooltip  = document.getElementById('waTooltip');
  if (closeBtn && tooltip) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      tooltip.classList.add('wa-hidden');
      localStorage.setItem('wa-tooltip-closed', '1');
    });
  }

  // Respect user close preference
  if (localStorage.getItem('wa-tooltip-closed') === '1' && tooltip) {
    tooltip.classList.add('wa-hidden');
  }

  // Auto-hide tooltip after 8 seconds if not closed
  setTimeout(() => {
    if (tooltip && !tooltip.classList.contains('wa-hidden')) {
      tooltip.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      tooltip.style.opacity = '0';
      tooltip.style.transform = 'translateX(10px)';
      setTimeout(() => tooltip.classList.add('wa-hidden'), 500);
    }
  }, 8000);
})();
