/* ============================================================
   TESTIMONIALS.JS — Swiper Infinite Auto-Scroll Slider
   ============================================================ */
'use strict';

(function initTestimonials() {
  if (typeof Swiper === 'undefined') return;

  const swiper = new Swiper('.testimonialSwiper', {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    autoplay: {
      delay: 4500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    speed: 700,
    grabCursor: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      640: {
        slidesPerView: 1.5,
        centeredSlides: true,
      },
      900: {
        slidesPerView: 2,
        centeredSlides: false,
      },
      1200: {
        slidesPerView: 3,
        centeredSlides: false,
      },
    },
    on: {
      slideChange() {
        // Subtle GSAP pop on active slide
        if (typeof gsap !== 'undefined') {
          const active = document.querySelector('.swiper-slide-active .testimonial-card');
          if (active) {
            gsap.fromTo(active, { scale: 0.97 }, { scale: 1, duration: 0.4, ease: 'back.out(1.5)' });
          }
        }
      },
    },
  });

  // Pause on card hover
  document.querySelectorAll('.testimonial-card').forEach(card => {
    card.addEventListener('mouseenter', () => swiper.autoplay.stop());
    card.addEventListener('mouseleave', () => swiper.autoplay.start());
  });
})();
