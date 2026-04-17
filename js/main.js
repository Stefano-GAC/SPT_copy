// ========== MAIN.JS - Interactividad Principal ==========

document.addEventListener('DOMContentLoaded', function() {
  initAOS();
  initScrollTop();
  initHtmlActionBindings();
  initFAQ();
  initMobileMenu();
  initNavbarOpacity();
  initSmoothScroll();
  initFlipCards();
  initScheduleCards();
  initHeroCarousel();
  initScrollProgress();
  initLightbox();
  initCookieBanner();
  initLanguageToggle();
  initExperienceMode();
  initVisitTour();
  initWeekendVisualMode();
  initSaturdayEventMode();
});

// ========== Loading Screen ==========
window.addEventListener('load', function() {
  const loader = document.getElementById('loading-screen');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 400);
  }
});

// ========== AOS (Animate On Scroll) Initialization ==========
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
      delay: 0
    });
  }
}

// ========== Navbar Opacity on Scroll ==========
function initNavbarOpacity() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', function() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const threshold = 50; // px desde el top

    // Si estamos muy arriba (sin imagen detrás), navbar más opaco
    if (scrollY < threshold) {
      navbar.style.background = 'linear-gradient(90deg, rgba(14, 14, 14, 0.94), rgba(26, 26, 26, 0.96))';
    } else {
      // Si hay imagen detrás, navbar más transparente
      navbar.style.background = 'linear-gradient(90deg, rgba(14, 14, 14, 0.58), rgba(26, 26, 26, 0.62))';
    }
  });

  // Trigger inicial
  window.dispatchEvent(new Event('scroll'));
}

// ========== Scroll to Top Button ==========
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  if (!scrollTopBtn) return;

  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  });

  scrollTopBtn.addEventListener('click', scrollToTop);
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// ========== HTML Action Bindings ==========
function initHtmlActionBindings() {
  document.querySelectorAll('[data-scroll-target]').forEach(trigger => {
    trigger.addEventListener('click', function() {
      const targetId = this.getAttribute('data-scroll-target');
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  document.querySelectorAll('[data-action="open-whatsapp"]').forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      openWhatsApp();
    });
  });
}

// ========== FAQ Toggle ==========
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.addEventListener('click', function() {
        const isActive = item.classList.contains('active');

        // Cerrar todos los demás
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.height = '0';
          }
        });

        // Toggle el actual con altura real
        if (isActive) {
          item.classList.remove('active');
          answer.style.height = '0';
        } else {
          item.classList.add('active');
          answer.style.height = answer.scrollHeight + 'px';
        }
      });
    }
  });
}

// ========== Flip Cards ==========
function initFlipCards() {
  const flipCards = document.querySelectorAll('.price-card-flip');
  const touchMode = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (!touchMode) return;

  flipCards.forEach(card => {
    card.addEventListener('click', function(e) {
      if (e.target.closest('button, a')) {
        return;
      }

      this.classList.toggle('flipped');

      const siblingCards = document.querySelectorAll('.price-card-flip');
      siblingCards.forEach(sibling => {
        if (sibling !== this && sibling.parentElement === this.parentElement) {
          sibling.classList.remove('flipped');
        }
      });
    });
  });

  // Resetear flip cards en resize (opcional)
  window.addEventListener('resize', function() {
    if (window.innerWidth < 768) {
      flipCards.forEach(card => {
        card.classList.remove('flipped');
      });
    }
  });
}

// ========== Schedule Flip Cards ==========
function initScheduleCards() {
  const schedules = {
    weekday: {
      markerId: 'sched-marker-weekday',
      statusId: 'sched-status-weekday',
      timeId: 'sched-time-weekday',
      copyId: 'sched-copy-weekday',
      peakId: 'sched-peak-weekday',
      openMinutes: 14 * 60,
      closeMinutes: 23 * 60,
      peakWindow: {
        es: 'Franja con más movimiento: 18:30 - 21:30',
        en: 'Busiest slot: 6:30 PM - 9:30 PM'
      },
      helperCopy: {
        es: 'Elige franjas con más movimiento y aprovecha espacios comunes para una visita más dinámica.',
        en: 'Choose busier time slots and make the most of shared areas for a more dynamic visit.'
      },
      periods: [
        { start: 14 * 60, end: 16 * 60 + 30, level: 'calm' },
        { start: 16 * 60 + 30, end: 18 * 60 + 30, level: 'steady' },
        { start: 18 * 60 + 30, end: 21 * 60 + 30, level: 'peak' },
        { start: 21 * 60 + 30, end: 23 * 60, level: 'steady' }
      ]
    },
    weekend: {
      markerId: 'sched-marker-weekend',
      statusId: 'sched-status-weekend',
      timeId: 'sched-time-weekend',
      copyId: 'sched-copy-weekend',
      peakId: 'sched-peak-weekend',
      openMinutes: 14 * 60,
      closeMinutes: 23 * 60,
      peakWindow: {
        es: 'Franja con más movimiento: 17:00 - 22:00',
        en: 'Busiest slot: 5:00 PM - 10:00 PM'
      },
      helperCopy: {
        es: 'Elige franjas con más movimiento y aprovecha espacios comunes para una visita más dinámica.',
        en: 'Choose busier time slots and make the most of shared areas for a more dynamic visit.'
      },
      periods: [
        { start: 14 * 60, end: 17 * 60, level: 'steady' },
        { start: 17 * 60, end: 22 * 60, level: 'peak' },
        { start: 22 * 60, end: 23 * 60, level: 'steady' }
      ]
    }
  };

  function getCurrentScheduleState(config) {
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const normalizedNow = nowMinutes < config.openMinutes ? nowMinutes + 24 * 60 : nowMinutes;
    const withinSchedule = normalizedNow >= config.openMinutes && normalizedNow <= config.closeMinutes;
    const timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

    if (!withinSchedule) {
      return {
        withinSchedule: false,
        level: 'off',
        markerPosition: 0,
        timeStr
      };
    }

    const activePeriod = config.periods.find(period => normalizedNow >= period.start && normalizedNow < period.end) || config.periods[config.periods.length - 1];
    const markerPosition = ((normalizedNow - config.openMinutes) / (config.closeMinutes - config.openMinutes)) * 100;

    return {
      withinSchedule: true,
      level: activePeriod.level,
      markerPosition,
      timeStr
    };
  }

  function getLevelLabel(level, lang) {
    const labels = {
      es: {
        calm: 'Movimiento tranquilo',
        steady: 'Movimiento medio',
        peak: 'Movimiento alto',
        off: 'Fuera de franja'
      },
      en: {
        calm: 'Quiet flow',
        steady: 'Moderate flow',
        peak: 'High flow',
        off: 'Outside schedule'
      }
    };

    return labels[lang][level];
  }

  function updateCards() {
    const lang = getCurrentLanguage();
    Object.values(schedules).forEach(config => {
      const state = getCurrentScheduleState(config);
      const marker = document.getElementById(config.markerId);
      const badge = document.getElementById(config.statusId);
      const timeEl = document.getElementById(config.timeId);
      const copyEl = document.getElementById(config.copyId);
      const peakEl = document.getElementById(config.peakId);

      if (badge) {
        badge.textContent = getLevelLabel(state.level, lang);
        badge.className = 'schedule-status-badge ' + state.level;
      }

      if (timeEl) {
        timeEl.textContent = state.withinSchedule
          ? (lang === 'en'
            ? 'Current time: ' + state.timeStr + ' · Marker placed on the estimated flow band'
            : 'Hora actual: ' + state.timeStr + ' · El marcador señala la franja estimada')
          : (lang === 'en'
            ? 'Current time: ' + state.timeStr + ' · Venue closed in this time range'
            : 'Hora actual: ' + state.timeStr + ' · Local cerrado en esta franja');
      }

      if (copyEl) {
        copyEl.textContent = config.helperCopy[lang];
      }

      if (peakEl) {
        peakEl.textContent = config.peakWindow[lang];
      }

      if (marker) {
        marker.classList.toggle('hidden', !state.withinSchedule);
        marker.style.left = state.markerPosition + '%';
      }
    });
  }

  const touchMode = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  document.querySelectorAll('.schedule-card-flip').forEach(card => {
    if (touchMode) {
      card.addEventListener('click', function() {
        const goingToBack = !this.classList.contains('flipped');
        this.classList.toggle('flipped');
        if (goingToBack) updateCards();
      });
    } else {
      card.addEventListener('mouseenter', function() {
        updateCards();
      });
    }
  });

  // Legend zone highlight on click
  const legendZones = {
    weekday: { calm: [0, 26], steady: [26, 56], peak: [56, 80] },
    weekend: { calm: [0, 18], steady: [18, 46], peak: [46, 82] }
  };
  const scheduleCardEls = Array.from(document.querySelectorAll('#horarios .schedule-card-flip'));
  document.querySelectorAll('#horarios .schedule-card-flip:nth-child(1) .schedule-legend-item, #horarios .schedule-card-flip:nth-child(2) .schedule-legend-item').forEach(item => {
    item.addEventListener('click', function(e) {
      e.stopPropagation();
      const cardFlip = this.closest('.schedule-card-flip');
      const schedKey = scheduleCardEls.indexOf(cardFlip) === 1 ? 'weekend' : 'weekday';
      const level = this.dataset.level;
      const highlight = document.getElementById('sched-highlight-' + schedKey);
      if (!highlight) return;

      const wasActive = this.classList.contains('legend-active');
      cardFlip.querySelectorAll('.schedule-legend-item').forEach(i => i.classList.remove('legend-active'));

      if (wasActive) {
        highlight.classList.remove('active');
        return;
      }

      this.classList.add('legend-active');
      const zone = legendZones[schedKey][level] || [0, 0];
      highlight.style.left = zone[0] + '%';
      highlight.style.width = (zone[1] - zone[0]) + '%';
      highlight.classList.add('active');
    });
  });

  document.addEventListener('languagechange', function() {
    const anyFlipped = document.querySelector('.schedule-card-flip.flipped');
    if (anyFlipped) updateCards();
  });
}

// ========== Hero Carousel ==========
function initHeroCarousel() {
  const carousel = document.querySelector('.hero-carousel');
  const backgrounds = document.querySelectorAll('.hero-background');
  
  if (!carousel || backgrounds.length === 0) return;
  
  let currentIndex = 0;
  const totalImages = backgrounds.length;
  const intervalTime = 5000; // 5 segundos por imagen
  
  // Función para cambiar imagen
  function changeImage() {
    // Obtener índices
    const currentIdx = currentIndex;
    const nextIdx = (currentIndex + 1) % totalImages;
    
    // Remover clase active
    backgrounds[currentIdx].classList.remove('active');
    backgrounds[currentIdx].classList.add('transition-out');
    
    // Agregar clase active a siguiente
    backgrounds[nextIdx].classList.add('active');
    backgrounds[nextIdx].classList.add('transition-in');
    
    // Limpiar clases de transición después de la animación
    setTimeout(() => {
      backgrounds[currentIdx].classList.remove('transition-out');
      backgrounds[nextIdx].classList.remove('transition-in');
    }, 1200);
    
    // Actualizar índice
    currentIndex = nextIdx;
  }
  
  // Iniciar carrusel automático
  setInterval(changeImage, intervalTime);
  
  // Pausar en hover (opcional)
  carousel.addEventListener('mouseenter', function() {
    // Se podría agregar lógica aquí para pausar
  });
  
  carousel.addEventListener('mouseleave', function() {
    // Se podría agregar lógica aquí para reanudar
  });
}

// ========== Mobile Menu ==========
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.setAttribute('aria-expanded', 'false');

    menuToggle.addEventListener('click', function() {
      const isOpen = navMenu.classList.toggle('active');
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.classList.toggle('menu-open', isOpen);
    });
  }

  // Cerrar menú al hacer click en un enlace
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (navMenu) navMenu.classList.remove('active');
      if (menuToggle) menuToggle.classList.remove('active');
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    });
  });

  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      if (navMenu) navMenu.classList.remove('active');
      if (menuToggle) menuToggle.classList.remove('active');
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }
  });
}

// ========== Smooth Scroll ==========
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ========== Language Toggle (ES/EN) ==========
function getCurrentLanguage() {
  const savedLanguage = localStorage.getItem('site-language');
  const htmlLanguage = (document.documentElement.lang || 'es').slice(0, 2);
  return savedLanguage === 'en' || savedLanguage === 'es' ? savedLanguage : (htmlLanguage === 'en' ? 'en' : 'es');
}

function getStaticTranslations(lang) {
  const isEn = lang === 'en';

  return {
    nav: isEn ? {
      nav_home: 'Home',
      nav_about: 'About Us',
      nav_facilities: 'Facilities',
      nav_hours: 'Hours',
      nav_prices: 'Rates',
      nav_faq: 'FAQ',
      nav_book: 'Book'
    } : {
      nav_home: 'Inicio',
      nav_about: 'Sobre Nosotros',
      nav_facilities: 'Instalaciones',
      nav_hours: 'Horarios',
      nav_prices: 'Tarifas',
      nav_faq: 'FAQ',
      nav_book: 'Reservar'
    },
    toggle: isEn ? {
      iconClass: 'fi fi-es',
      aria: 'Switch language to Spanish'
    } : {
      iconClass: 'fi fi-gb',
      aria: 'Cambiar idioma a ingles'
    },
    title: isEn ? 'Sauna Puerta de Toledo - Your Private Space in Madrid' : 'Sauna Puerta de Toledo - Tu Espacio Intimo en Madrid',
    metas: isEn ? {
      description: 'Sauna Puerta de Toledo in Madrid. Rates, location and contact information to confirm opening hours and availability.',
      ogTitle: 'Sauna Puerta de Toledo - Your Private Space in Madrid',
      ogDescription: 'Wellness experience in a discreet and professional environment.'
    } : {
      description: 'Sauna Puerta de Toledo en Madrid. Informacion de tarifas, ubicacion y contacto para confirmar horarios y disponibilidad.',
      ogTitle: 'Sauna Puerta de Toledo - Tu Espacio Intimo en Madrid',
      ogDescription: 'Experiencia de bienestar en un entorno discreto y profesional.'
    },
    text: isEn ? {
      '.hero-title': 'Your Private Space',
      '.hero-subtitle': 'Wellness and social space in central Madrid',
      '.hero-ctas .btn-primary': 'See Prices',
      '.hero-ctas .btn-secondary': 'Ask on WhatsApp',
      '.experience-mode .section-title': 'Choose your experience',
      '.experience-mode .section-subtitle': 'Adapt the visit to how you want to feel today',
      '#experience-chips .chip[data-mode="relax"]': 'Relaxation',
      '#experience-chips .chip[data-mode="social"]': 'Social',
      '#experience-chips .chip[data-mode="massage"]': 'Massage',
      '.journey .section-title': 'A visit in 3 moments',
      '.journey .section-subtitle': 'A clear route to anticipate each sensation from your arrival',
      '.journey-step:nth-child(1) h3': 'You arrive',
      '.journey-step:nth-child(1) p': 'Reception check-in, quick welcome and clear guidance so you can set your pace from minute one.',
      '.journey-step:nth-child(2) h3': 'You disconnect',
      '.journey-step:nth-child(2) p': 'Move through sauna, steam bath and jacuzzi to release tension and lower your pulse.',
      '.journey-step:nth-child(3) h3': 'You recharge',
      '.journey-step:nth-child(3) p': 'Finish in rest areas with a calm mind and renewed energy.',
      '#nosotros .section-title': 'About Us',
      '#nosotros .section-subtitle': 'Clear and updated information for your visit',
      '#nosotros .about-card:nth-child(1) h3': 'Wellness Specialists',
      '#nosotros .about-card:nth-child(1) p': 'A space designed for rest, disconnection and personal wellbeing.',
      '#nosotros .about-card:nth-child(2) h3': 'Privacy and Discretion',
      '#nosotros .about-card:nth-child(2) p': 'We work with discretion, respect and professional service at all times.',
      '#nosotros .about-card:nth-child(3) h3': 'Professional Service',
      '#nosotros .about-card:nth-child(3) p': 'Our team is available to answer questions and guide your visit.',
      '#instalaciones .section-title': 'Our Facilities',
      '#instalaciones .section-subtitle': 'Highlighted services of the venue',
      '#instalaciones .facility-card:nth-child(1) h3': 'Finnish Sauna',
      '#instalaciones .facility-card:nth-child(1) p': 'Sauna area for relaxation and wellbeing.',
      '#instalaciones .facility-card:nth-child(2) h3': 'Steam Bath',
      '#instalaciones .facility-card:nth-child(2) p': 'Steam area available as part of the route.',
      '#instalaciones .facility-card:nth-child(3) h3': 'Jacuzzi',
      '#instalaciones .facility-card:nth-child(3) p': 'Water area for rest and relaxation.',
      '#instalaciones .facility-card:nth-child(4) h3': 'Private Cabins',
      '#instalaciones .facility-card:nth-child(4) p': 'Private-use spaces. Check conditions at reception.',
      '#instalaciones .facility-card:nth-child(5) h3': 'Bar and Lounge',
      '#instalaciones .facility-card:nth-child(5) p': 'Rest area for breaks during your visit.',
      '#instalaciones .facility-card:nth-child(6) h3': 'Professional Massages',
      '#instalaciones .facility-card:nth-child(6) p': 'Massage service available on request.',
      '.tour .section-title': 'Quick tour of the venue',
      '.tour .section-subtitle': 'Visual preview to understand the route before your visit',
      '#tour-prev': 'Previous',
      '#tour-next': 'Next',
      '#horarios .section-title': 'Opening Hours',
      '#horarios .section-subtitle': 'Current schedule: every day from 2:00 PM to 11:00 PM. We recommend confirming on WhatsApp before your visit.',
      '#horarios .flip-hint': 'Click the cards to see the estimated flow by time slot',
      '#horarios .schedule-card-flip:nth-child(1) .schedule-card-front h3': 'Monday to Thursday',
      '#horarios .schedule-card-flip:nth-child(1) .schedule-card-front .schedule-note': 'A more relaxed pace',
      '#horarios .schedule-card-flip:nth-child(1) .schedule-card-front .click-hint': '◆ Click to see flow',
      '#horarios .schedule-card-flip:nth-child(1) .schedule-back-title': 'Estimated Flow',
      '#horarios .schedule-card-flip:nth-child(1) .schedule-legend-item:nth-child(1)': 'Lower flow',
      '#horarios .schedule-card-flip:nth-child(1) .schedule-legend-item:nth-child(2)': 'Moderate flow',
      '#horarios .schedule-card-flip:nth-child(1) .schedule-legend-item:nth-child(3)': 'Higher flow',
      '#horarios .schedule-card-flip:nth-child(2) .schedule-card-front h3': 'Friday to Sunday',
      '#horarios .schedule-card-flip:nth-child(2) .schedule-card-front .schedule-note': 'A more social atmosphere',
      '#horarios .schedule-card-flip:nth-child(2) .schedule-card-front .click-hint': '◆ Click to see flow',
      '#horarios .schedule-card-flip:nth-child(2) .schedule-back-title': 'Estimated Flow',
      '#horarios .schedule-card-flip:nth-child(2) .schedule-legend-item:nth-child(1)': 'Lower flow',
      '#horarios .schedule-card-flip:nth-child(2) .schedule-legend-item:nth-child(2)': 'Moderate flow',
      '#horarios .schedule-card-flip:nth-child(2) .schedule-legend-item:nth-child(3)': 'Higher flow',
      '#horarios .schedule-card-flip:nth-child(3) .schedule-card-front h3': 'Contact',
      '#horarios .schedule-card-flip:nth-child(3) .schedule-card-front .schedule-note': 'Madrid city center',
      '#horarios .schedule-card-flip:nth-child(3) .schedule-card-front .click-hint': '◆ Click to see useful info',
      '#horarios .schedule-card-flip:nth-child(3) .schedule-back-title': 'Before You Visit',
      '#horarios .schedule-card-flip:nth-child(3) .schedule-directions': '📲 Confirm availability on WhatsApp\n🪪 Bring valid ID\n🕒 Arrive with enough time to enjoy the visit',
      '#horarios .sched-back-hint': '◆ Click to go back',
      '#precios .section-title': 'Rates',
      '#precios .section-subtitle': 'Clear pricing so you can choose what fits you best',
      '#precios .subsection-title:nth-of-type(1)': 'General Entry',
      '#precios .flip-hint': 'Click the cards to see details',
      '#precios .subsection-title:nth-of-type(2)': 'Massage and Treatments',
      '#precios .prices-grid:first-of-type .price-card-flip:nth-child(1) .price-card-front h4': 'Daily Entry',
      '#precios .prices-grid:first-of-type .price-card-flip:nth-child(1) .price-card-front .price-desc': 'Monday to Friday',
      '#precios .prices-grid:first-of-type .price-card-flip:nth-child(2) .price-badge': 'Popular',
      '#precios .prices-grid:first-of-type .price-card-flip:nth-child(2) .price-card-front h4': 'Weekend Entry',
      '#precios .prices-grid:first-of-type .price-card-flip:nth-child(2) .price-card-front .price-desc': 'Saturdays, Sundays and Holidays',
      '#precios .prices-grid:first-of-type .price-card-flip:nth-child(1) .price-card-back .price-badge-back': 'Entry',
      '#precios .prices-grid:first-of-type .price-card-flip:nth-child(1) .price-card-back .price-features li:nth-child(1)': '✓ General access to the venue',
      '#precios .prices-grid:first-of-type .price-card-flip:nth-child(1) .price-card-back .price-features li:nth-child(2)': '✓ Valid Monday to Friday',
      '#precios .prices-grid:first-of-type .price-card-flip:nth-child(1) .price-card-back .price-features li:nth-child(3)': '✓ Time: 14:00-23:00',
      '#precios .prices-grid:first-of-type .price-card-flip:nth-child(1) .price-card-back .price-features li:nth-child(4)': '✓ Conditions at reception',
      '#precios .prices-grid:first-of-type .price-card-flip:nth-child(2) .price-card-back .price-badge-back': 'Weekend',
      '#precios .prices-grid:first-of-type .price-card-flip:nth-child(2) .price-card-back .price-features li:nth-child(1)': '✓ Valid on Saturdays, Sundays and holidays',
      '#precios .prices-grid:first-of-type .price-card-flip:nth-child(2) .price-card-back .price-features li:nth-child(2)': '✓ Time: 14:00-23:00',
      '#precios .prices-grid:first-of-type .price-card-flip:nth-child(2) .price-card-back .price-features li:nth-child(3)': '✓ General access to the venue',
      '#precios .prices-grid:first-of-type .price-card-flip:nth-child(2) .price-card-back .price-features li:nth-child(4)': '✓ Confirm capacity on WhatsApp',
      '#precios .prices-grid:last-of-type .price-card-flip:nth-child(1) .price-card-front h4': 'Express Massage',
      '#precios .prices-grid:last-of-type .price-card-flip:nth-child(1) .price-card-front .price-desc': '30 minutes',
      '#precios .prices-grid:last-of-type .price-card-flip:nth-child(2) .price-badge': 'Recommended',
      '#precios .prices-grid:last-of-type .price-card-flip:nth-child(2) .price-card-front h4': 'Full Massage',
      '#precios .prices-grid:last-of-type .price-card-flip:nth-child(2) .price-card-front .price-desc': '1 hour',
      '#precios .prices-grid:last-of-type .price-card-flip:nth-child(1) .price-card-back .price-badge-back': 'Express',
      '#precios .prices-grid:last-of-type .price-card-flip:nth-child(1) .price-card-back .price-features li:nth-child(1)': '✓ Duration: 30 minutes',
      '#precios .prices-grid:last-of-type .price-card-flip:nth-child(1) .price-card-back .price-features li:nth-child(2)': '✓ Massage service',
      '#precios .prices-grid:last-of-type .price-card-flip:nth-child(1) .price-card-back .price-features li:nth-child(3)': '✓ Recommended reservation',
      '#precios .prices-grid:last-of-type .price-card-flip:nth-child(1) .price-card-back .price-features li:nth-child(4)': '✓ Conditions at reception',
      '#precios .prices-grid:last-of-type .price-card-flip:nth-child(2) .price-card-back .price-badge-back': 'Full',
      '#precios .prices-grid:last-of-type .price-card-flip:nth-child(2) .price-card-back .price-features li:nth-child(1)': '✓ Duration: 1 hour',
      '#precios .prices-grid:last-of-type .price-card-flip:nth-child(2) .price-card-back .price-features li:nth-child(2)': '✓ Massage service',
      '#precios .prices-grid:last-of-type .price-card-flip:nth-child(2) .price-card-back .price-features li:nth-child(3)': '✓ Recommended reservation',
      '#precios .prices-grid:last-of-type .price-card-flip:nth-child(2) .price-card-back .price-features li:nth-child(4)': '✓ Conditions at reception',
      '.price-card-front .click-hint': '◆ Click to see details',
      '.manifesto-kicker': 'SPT / Central Madrid',
      '.manifesto-box h2': 'A place to lower the noise and recover your energy.',
      '.manifesto-box > p:not(.manifesto-kicker)': 'We believe in wellbeing with discretion, respect as a principle, and an experience remembered by how it makes you feel.',
      '.manifesto-box .btn': 'Chat on WhatsApp',
      '#galeria .section-title': 'Gallery',
      '#galeria .section-subtitle': 'Explore our space',
      '.gallery-item[data-zone="sauna"] .gallery-overlay p': 'Sauna area',
      '.gallery-item[data-zone="vapor"] .gallery-overlay p': 'Steam bath',
      '.gallery-item[data-zone="jacuzzi"] .gallery-overlay p': 'Relaxing jacuzzi',
      '.gallery-item[data-zone="tratamientos"] .gallery-overlay p': 'Treatments',
      '#faq .section-title': 'Frequently Asked Questions',
      '#faq .section-subtitle': 'Useful information to prepare your visit',
      '#faq .faq-item:nth-child(1) .faq-question h3': 'How is my first visit?',
      '#faq .faq-item:nth-child(2) .faq-question h3': 'What should I bring?',
      '#faq .faq-item:nth-child(3) .faq-question h3': 'Are there coexistence rules?',
      '#faq .faq-item:nth-child(4) .faq-question h3': 'What is your disinfection policy?',
      '#faq .faq-item:nth-child(5) .faq-question h3': 'Do you accept groups?',
      '#faq .faq-item:nth-child(6) .faq-question h3': 'Do you accept heterosexual couples?',
      '#faq .faq-item:nth-child(1) .faq-answer p': 'At reception you present your ID, pay the entry and receive your locker key. Staff briefly explains available areas and venue rules. From there you can move independently. We recommend arriving with enough time to settle in and enjoy the facilities.',
      '#faq .faq-item:nth-child(2) .faq-answer p': 'Valid ID is mandatory: DNI, NIE or passport. Access is not allowed without identification. We also recommend bringing flip-flops for wet areas. Towel is available on site. If you have questions about what your entry includes, ask reception or contact us on WhatsApp.',
      '#faq .faq-item:nth-child(3) .faq-answer p': 'Mutual respect is essential. Taking photos or videos is strictly forbidden in all areas. Showering before entering wet areas is mandatory and towel use on surfaces is required. Any interaction requires explicit consent. Staff is present to ensure coexistence.',
      '#faq .faq-item:nth-child(4) .faq-answer p': 'Facilities are cleaned and disinfected regularly throughout the day. Towel use on surfaces is mandatory. Showering before sauna, jacuzzi and pool access is required. Hygiene products are available in bathrooms. For specific needs, contact us on WhatsApp before your visit.',
      '#faq .faq-item:nth-child(5) .faq-answer p': 'Yes, groups are allowed, but we recommend notifying us in advance to ensure comfort for everyone. On high-demand slots capacity limits may apply. Contact us on WhatsApp with approximate group size and preferred time slot for confirmation.',
      '#faq .faq-item:nth-child(6) .faq-answer p': 'Sauna Puerta de Toledo is primarily oriented to male audience. For specific access conditions, contact us on WhatsApp before your visit and we will reply with updated information.',
      '.health .section-title': 'Safety & Health',
      '.health .section-subtitle': 'Commitment to coexistence, respect and care',
      '.health-card:nth-child(1) h3': 'Privacy Guarantee',
      '.health-card:nth-child(1) p': 'Commitment to discretion and privacy of all visitors.',
      '.health-card:nth-child(2) h3': 'Safe Practices',
      '.health-card:nth-child(2) p': 'We promote prevention information and personal care for a responsible experience.',
      '.health-card:nth-child(3) h3': 'Compliance',
      '.health-card:nth-child(3) p': 'Activity subject to current regulations. For specific documentation, ask at the venue.',
      '.health-card:nth-child(4) h3': 'Trained Staff',
      '.health-card:nth-child(4) p': 'Support staff available during opening hours for assistance and coexistence.',
      '#contacto .section-title': 'Location & Contact',
      '#contacto .section-subtitle': 'We are in central Madrid, with easy public transport access',
      '#contacto .contact-card:nth-child(1) h3': 'Address',
      '#contacto .contact-card:nth-child(1) p': 'Cuesta de las Descargas, 6 - 28005 Madrid, Spain',
      '#contacto .contact-card:nth-child(1) .contact-note': 'Central Madrid, next to Puerta de Toledo',
      '#contacto .contact-card:nth-child(2) h3': 'How to get here',
      '#contacto .contact-card:nth-child(2) p': 'Puerta de Toledo / La Latina - Fast access from the city center',
      '#contacto .contact-card:nth-child(2) .contact-note': 'Well connected by metro and bus',
      '#contacto .contact-card:nth-child(3) h3': 'Contact',
      '#contacto .contact-card:nth-child(3) .btn': 'WhatsApp',
      '.footer-section:nth-child(1) p': 'Wellness and social space in central Madrid.',
      '.footer-section:nth-child(2) h4': 'Quick Links',
      '.footer-section:nth-child(3) h4': 'Follow Us',
      '.footer-section:nth-child(2) li:nth-child(1) a': 'Prices',
      '.footer-section:nth-child(2) li:nth-child(2) a': 'Hours',
      '.footer-section:nth-child(2) li:nth-child(3) a': 'FAQ',
      '.footer-section:nth-child(2) li:nth-child(4) a': 'Contact',
      '.footer-bottom > p': '© 2025 Sauna Puerta de Toledo. All rights reserved.',
      '.footer-links a:nth-child(1)': 'Privacy Policy',
      '.footer-links a:nth-child(2)': 'Legal Notice',
      '.footer-links a:nth-child(3)': 'Cookie Policy',
      '#cookie-desc': 'We use first-party cookies to improve browsing experience. By continuing to browse you accept their use. <a href="#" class="cookie-link">Cookie policy</a>.',
      '.cookie-decline': 'Essential only',
      '.cookie-accept': 'Accept all'
    } : {
      '.hero-title': 'Tu Espacio Intimo',
      '.hero-subtitle': 'Espacio de bienestar y encuentro en Madrid centro',
      '.hero-ctas .btn-primary': 'Ver Precios',
      '.hero-ctas .btn-secondary': 'Consultar por WhatsApp',
      '.experience-mode .section-title': 'Elige tu experiencia',
      '.experience-mode .section-subtitle': 'Adapta la experiencia segun como quieres sentir tu visita hoy',
      '#experience-chips .chip[data-mode="relax"]': 'Relax',
      '#experience-chips .chip[data-mode="social"]': 'Social',
      '#experience-chips .chip[data-mode="massage"]': 'Masaje',
      '.journey .section-title': 'Una visita en 3 momentos',
      '.journey .section-subtitle': 'Un recorrido claro para anticipar cada sensacion desde tu llegada',
      '.journey-step:nth-child(1) h3': 'Llegas',
      '.journey-step:nth-child(1) p': 'Acceso en recepcion, bienvenida agil y orientacion breve para que elijas tu ritmo desde el primer minuto.',
      '.journey-step:nth-child(2) h3': 'Desconectas',
      '.journey-step:nth-child(2) p': 'Recorre sauna, vapor y jacuzzi para bajar pulsaciones, soltar tension y entrar en modo pausa.',
      '.journey-step:nth-child(3) h3': 'Recargas',
      '.journey-step:nth-child(3) p': 'Cierra en zonas de descanso con sensacion de calma, claridad y energia renovada.',
      '#nosotros .section-title': 'Sobre Nosotros',
      '#nosotros .section-subtitle': 'Informacion clara y actualizada para tu visita',
      '#nosotros .about-card:nth-child(1) h3': 'Especialistas en Bienestar',
      '#nosotros .about-card:nth-child(1) p': 'Un entorno pensado para el descanso, la desconexion y el bienestar personal.',
      '#nosotros .about-card:nth-child(2) h3': 'Privacidad y Discrecion',
      '#nosotros .about-card:nth-child(2) p': 'Trabajamos con enfoque en discrecion, respeto y trato profesional en todo momento.',
      '#nosotros .about-card:nth-child(3) h3': 'Atencion Profesional',
      '#nosotros .about-card:nth-child(3) p': 'Equipo disponible para resolver dudas y acompanarte durante tu visita.',
      '#instalaciones .section-title': 'Nuestras Instalaciones',
      '#instalaciones .section-subtitle': 'Servicios destacados del espacio',
      '#instalaciones .facility-card:nth-child(1) h3': 'Sauna Finlandesa',
      '#instalaciones .facility-card:nth-child(1) p': 'Zona de sauna para relajacion y bienestar.',
      '#instalaciones .facility-card:nth-child(2) h3': 'Bano de Vapor',
      '#instalaciones .facility-card:nth-child(2) p': 'Zona de vapor disponible en el recorrido del local.',
      '#instalaciones .facility-card:nth-child(3) h3': 'Jacuzzi',
      '#instalaciones .facility-card:nth-child(3) p': 'Zona de agua para descanso y relax.',
      '#instalaciones .facility-card:nth-child(4) h3': 'Cabinas Privadas',
      '#instalaciones .facility-card:nth-child(4) p': 'Espacios de uso privado. Consulta condiciones en recepcion.',
      '#instalaciones .facility-card:nth-child(5) h3': 'Bar y Lounge',
      '#instalaciones .facility-card:nth-child(5) p': 'Zona de descanso para pausas durante la visita.',
      '#instalaciones .facility-card:nth-child(6) h3': 'Masajes Profesionales',
      '#instalaciones .facility-card:nth-child(6) p': 'Servicio de masaje disponible bajo consulta.',
      '.tour .section-title': 'Tour rapido del espacio',
      '.tour .section-subtitle': 'Vista previa visual para conocer el ritmo del recorrido antes de venir',
      '#tour-prev': 'Anterior',
      '#tour-next': 'Siguiente',
      '#horarios .section-title': 'Horarios',
      '#horarios .section-subtitle': 'Horario actual: todos los dias de 14:00 a 23:00. Recomendamos confirmar por WhatsApp antes de tu visita.',
      '#horarios .flip-hint': 'Haz click en las tarjetas para ver el nivel de movimiento por franja',
        '#horarios .flip-hint': 'Hover over or tap the cards to see the activity level by time slot.',
      '#horarios .schedule-card-flip:nth-child(1) .schedule-card-front h3': 'Lunes a Jueves',
      '#horarios .schedule-card-flip:nth-child(1) .schedule-card-front .schedule-note': 'Ritmo mas relajado',
      '#horarios .schedule-card-flip:nth-child(1) .schedule-card-front .click-hint': '◆ Click para ver movimiento',
        '#horarios .schedule-card-flip:nth-child(1) .schedule-card-front .click-hint': '◆ Hover or tap to see activity',
      '#horarios .schedule-card-flip:nth-child(1) .schedule-back-title': 'Movimiento estimado',
      '#horarios .schedule-card-flip:nth-child(1) .schedule-legend-item:nth-child(1)': 'Menos movimiento',
      '#horarios .schedule-card-flip:nth-child(1) .schedule-legend-item:nth-child(2)': 'Movimiento medio',
      '#horarios .schedule-card-flip:nth-child(1) .schedule-legend-item:nth-child(3)': 'Mas movimiento',
      '#horarios .schedule-card-flip:nth-child(2) .schedule-card-front h3': 'Viernes a Domingo',
      '#horarios .schedule-card-flip:nth-child(2) .schedule-card-front .schedule-note': 'Mas ambiente social',
      '#horarios .schedule-card-flip:nth-child(2) .schedule-card-front .click-hint': '◆ Click para ver movimiento',
        '#horarios .schedule-card-flip:nth-child(2) .schedule-card-front .click-hint': '◆ Hover or tap to see activity',
      '#horarios .schedule-card-flip:nth-child(2) .schedule-back-title': 'Movimiento estimado',
      '#horarios .schedule-card-flip:nth-child(2) .schedule-legend-item:nth-child(1)': 'Menos movimiento',
      '#horarios .schedule-card-flip:nth-child(2) .schedule-legend-item:nth-child(2)': 'Movimiento medio',
      '#horarios .schedule-card-flip:nth-child(2) .schedule-legend-item:nth-child(3)': 'Mas movimiento',
      '#horarios .schedule-card-flip:nth-child(3) .schedule-card-front h3': 'Contacto',
      '#horarios .schedule-card-flip:nth-child(3) .schedule-card-front .schedule-note': 'Centro de Madrid',
      '#horarios .schedule-card-flip:nth-child(3) .schedule-card-front .click-hint': '◆ Click para ver info util',
        '#horarios .schedule-card-flip:nth-child(3) .schedule-card-front .click-hint': '◆ Hover or tap to see useful info',
      '#horarios .schedule-card-flip:nth-child(3) .schedule-back-title': 'Antes de venir',
      '#horarios .schedule-card-flip:nth-child(3) .schedule-directions': '📲 Confirma disponibilidad por WhatsApp\n🪪 Trae documentacion valida\n🕒 Ven con tiempo para disfrutar mejor',
      '#precios .section-title': 'Tarifas',
      '#precios .subsection-title:nth-of-type(1)': 'Entrada General',
      '#precios .flip-hint': 'Haz click en las tarjetas para ver los detalles',
        '#precios .flip-hint': 'Hover over or tap the cards to see the details.',
        '.price-card-front .click-hint': '◆ Hover or tap to see details',
        '#horarios .flip-hint': 'Pasa el cursor o toca las tarjetas para ver el nivel de movimiento por franja.',
        '#horarios .schedule-card-flip:nth-child(1) .schedule-card-front .click-hint': '◆ Pasa el cursor o toca para ver movimiento',
        '#horarios .schedule-card-flip:nth-child(2) .schedule-card-front .click-hint': '◆ Pasa el cursor o toca para ver movimiento',
        '#horarios .schedule-card-flip:nth-child(3) .schedule-card-front .click-hint': '◆ Pasa el cursor o toca para ver info util',
        '#precios .flip-hint': 'Pasa el cursor o toca las tarjetas para ver los detalles.',
      '#precios .subsection-title:nth-of-type(2)': 'Masajes y Tratamientos',
      '#precios .prices-grid:first-of-type .price-card-flip:nth-child(1) .price-card-front h4': 'Entrada Diaria',
      '#precios .prices-grid:first-of-type .price-card-flip:nth-child(1) .price-card-front .price-desc': 'Lunes a Viernes',
      '#precios .prices-grid:first-of-type .price-card-flip:nth-child(2) .price-badge': 'Popular',
      '#precios .prices-grid:first-of-type .price-card-flip:nth-child(2) .price-card-front h4': 'Entrada Fin de Semana',
      '#precios .prices-grid:first-of-type .price-card-flip:nth-child(2) .price-card-front .price-desc': 'Sabados, Domingos y Festivos',
      '#precios .prices-grid:first-of-type .price-card-flip:nth-child(1) .price-card-back .price-badge-back': 'Entrada',
      '#precios .prices-grid:first-of-type .price-card-flip:nth-child(1) .price-card-back .price-features li:nth-child(1)': '✓ Acceso general al local',
      '#precios .prices-grid:first-of-type .price-card-flip:nth-child(1) .price-card-back .price-features li:nth-child(2)': '✓ Valido de lunes a viernes',
      '#precios .prices-grid:first-of-type .price-card-flip:nth-child(1) .price-card-back .price-features li:nth-child(3)': '✓ Horario: 14:00-23:00',
      '#precios .prices-grid:first-of-type .price-card-flip:nth-child(1) .price-card-back .price-features li:nth-child(4)': '✓ Condiciones en recepcion',
      '#precios .prices-grid:first-of-type .price-card-flip:nth-child(2) .price-card-back .price-badge-back': 'Fin de Semana',
      '#precios .prices-grid:first-of-type .price-card-flip:nth-child(2) .price-card-back .price-features li:nth-child(1)': '✓ Valido sabados, domingos y festivos',
      '#precios .prices-grid:first-of-type .price-card-flip:nth-child(2) .price-card-back .price-features li:nth-child(2)': '✓ Horario: 14:00-23:00',
      '#precios .prices-grid:first-of-type .price-card-flip:nth-child(2) .price-card-back .price-features li:nth-child(3)': '✓ Acceso general al local',
      '#precios .prices-grid:first-of-type .price-card-flip:nth-child(2) .price-card-back .price-features li:nth-child(4)': '✓ Confirmar aforo por WhatsApp',
      '#precios .prices-grid:last-of-type .price-card-flip:nth-child(1) .price-card-front h4': 'Masaje Express',
      '#precios .prices-grid:last-of-type .price-card-flip:nth-child(1) .price-card-front .price-desc': '30 minutos',
      '#precios .prices-grid:last-of-type .price-card-flip:nth-child(2) .price-badge': 'Recomendado',
      '#precios .prices-grid:last-of-type .price-card-flip:nth-child(2) .price-card-front h4': 'Masaje Completo',
      '#precios .prices-grid:last-of-type .price-card-flip:nth-child(2) .price-card-front .price-desc': '1 hora',
      '#precios .prices-grid:last-of-type .price-card-flip:nth-child(1) .price-card-back .price-badge-back': 'Express',
      '#precios .prices-grid:last-of-type .price-card-flip:nth-child(1) .price-card-back .price-features li:nth-child(1)': '✓ Duracion: 30 minutos',
      '#precios .prices-grid:last-of-type .price-card-flip:nth-child(1) .price-card-back .price-features li:nth-child(2)': '✓ Servicio de masaje',
      '#precios .prices-grid:last-of-type .price-card-flip:nth-child(1) .price-card-back .price-features li:nth-child(3)': '✓ Reserva recomendada',
      '#precios .prices-grid:last-of-type .price-card-flip:nth-child(1) .price-card-back .price-features li:nth-child(4)': '✓ Condiciones en recepcion',
      '#precios .prices-grid:last-of-type .price-card-flip:nth-child(2) .price-card-back .price-badge-back': 'Completo',
      '#precios .prices-grid:last-of-type .price-card-flip:nth-child(2) .price-card-back .price-features li:nth-child(1)': '✓ Duracion: 1 hora',
      '#precios .prices-grid:last-of-type .price-card-flip:nth-child(2) .price-card-back .price-features li:nth-child(2)': '✓ Servicio de masaje',
      '#precios .prices-grid:last-of-type .price-card-flip:nth-child(2) .price-card-back .price-features li:nth-child(3)': '✓ Reserva recomendada',
      '#precios .prices-grid:last-of-type .price-card-flip:nth-child(2) .price-card-back .price-features li:nth-child(4)': '✓ Condiciones en recepcion',
      '.price-card-front .click-hint': '◆ Pasa el cursor o toca para ver detalles',
      '.manifesto-kicker': 'SPT / Madrid centro',
      '.manifesto-box h2': 'Un lugar para bajar el ruido y recuperar tu energia.',
      '.manifesto-box > p:not(.manifesto-kicker)': 'Creemos en el bienestar con discrecion, en el respeto como principio y en una experiencia que se recuerda por como te hace sentir.',
      '.manifesto-box .btn': 'Reservar por WhatsApp',
      '#galeria .section-title': 'Galeria',
      '#galeria .section-subtitle': 'Explora nuestro espacio',
      '.gallery-item[data-zone="sauna"] .gallery-overlay p': 'Zona de sauna',
      '.gallery-item[data-zone="vapor"] .gallery-overlay p': 'Bano de Vapor',
      '.gallery-item[data-zone="jacuzzi"] .gallery-overlay p': 'Jacuzzi Relajante',
      '.gallery-item[data-zone="tratamientos"] .gallery-overlay p': 'Tratamientos',
      '#faq .section-title': 'Preguntas Frecuentes',
      '#faq .section-subtitle': 'Informacion util para preparar tu visita',
      '#faq .faq-item:nth-child(1) .faq-question h3': 'Como es mi primera visita?',
      '#faq .faq-item:nth-child(2) .faq-question h3': 'Que debo llevar?',
      '#faq .faq-item:nth-child(3) .faq-question h3': 'Hay normas de convivencia?',
      '#faq .faq-item:nth-child(4) .faq-question h3': 'Cual es vuestra politica de desinfeccion?',
      '#faq .faq-item:nth-child(5) .faq-question h3': 'Aceptais grupos?',
      '#faq .faq-item:nth-child(6) .faq-question h3': 'Aceptais parejas heterosexuales?',
      '#faq .faq-item:nth-child(1) .faq-answer p': 'Al llegar, presentas tu documentacion en recepcion, abonas la entrada y recibes tu llave de taquilla. El equipo te explica brevemente las zonas disponibles y las normas del local. A partir de ahi puedes moverte con total autonomia. Te recomendamos llegar con tiempo suficiente para instalarte con calma y disfrutar al maximo de las instalaciones.',
      '#faq .faq-item:nth-child(2) .faq-answer p': 'Es imprescindible llevar documentacion oficial valida: DNI, NIE o pasaporte. No se permite el acceso sin identificacion. Recomendamos tambien traer chanclas para el uso de zonas humedas. La toalla esta disponible en el local. Si tienes alguna duda sobre que incluye exactamente tu entrada, puedes consultarlo en recepcion al llegar o antes por WhatsApp.',
      '#faq .faq-item:nth-child(3) .faq-answer p': 'El respeto mutuo es la base de todo. Esta absolutamente prohibido fotografiar o grabar en cualquier zona del local. Es obligatorio ducharse antes de acceder a las zonas humedas y usar la toalla sobre cualquier superficie. Cualquier interaccion requiere consentimiento explicito. El personal esta presente para garantizar la convivencia.',
      '#faq .faq-item:nth-child(4) .faq-answer p': 'Las instalaciones se limpian y desinfectan de forma periodica a lo largo del dia. El uso de toalla sobre las superficies es obligatorio. Se exige ducha antes de acceder a la sauna, jacuzzi y piscina. Disponemos de productos de higiene en los aseos. Si tienes necesidades especificas o quieres mas informacion, puedes consultarlo por WhatsApp antes de tu visita.',
      '#faq .faq-item:nth-child(5) .faq-answer p': 'Si, se admiten grupos, aunque recomendamos avisar con antelacion para asegurar comodidad para todos. En dias o franjas de mayor afluencia puede haber limitacion de aforo. Consultanos por WhatsApp indicando el numero aproximado de personas y la franja horaria deseada.',
      '#faq .faq-item:nth-child(6) .faq-answer p': 'Sauna Puerta de Toledo es un espacio orientado al publico masculino. Para cualquier consulta especifica sobre condiciones de acceso, escribenos por WhatsApp antes de tu visita y te respondemos con toda la informacion actualizada.',
      '.health .section-title': 'Seguridad & Salud',
      '.health .section-subtitle': 'Compromiso con la convivencia, el respeto y el cuidado',
      '.health-card:nth-child(1) h3': 'Garantia de Privacidad',
      '.health-card:nth-child(1) p': 'Compromiso de discrecion y respeto a la privacidad de las personas usuarias.',
      '.health-card:nth-child(2) h3': 'Practicas Seguras',
      '.health-card:nth-child(2) p': 'Promovemos informacion de prevencion y cuidado personal para una experiencia responsable.',
      '.health-card:nth-child(3) h3': 'Certificaciones',
      '.health-card:nth-child(3) p': 'Actividad sujeta a normativa vigente. Para informacion documental especifica, consulta en el propio local.',
      '.health-card:nth-child(4) h3': 'Personal Entrenado',
      '.health-card:nth-child(4) p': 'Personal de apoyo durante el horario de apertura para atencion y convivencia.',
      '#contacto .section-title': 'Ubicacion & Contacto',
      '#contacto .section-subtitle': 'Estamos en Madrid centro, con acceso comodo en transporte publico',
      '#contacto .contact-card:nth-child(1) h3': 'Direccion',
      '#contacto .contact-card:nth-child(1) p': 'Cuesta de las Descargas, 6 - 28005 Madrid, Espana',
      '#contacto .contact-card:nth-child(1) .contact-note': 'Centro de Madrid, junto a Puerta de Toledo',
      '#contacto .contact-card:nth-child(2) h3': 'Como llegar',
      '#contacto .contact-card:nth-child(2) p': 'Puerta de Toledo / La Latina - Acceso rapido desde el centro',
      '#contacto .contact-card:nth-child(2) .contact-note': 'Zona bien conectada en Metro y bus',
      '#contacto .contact-card:nth-child(3) h3': 'Contacto',
      '#contacto .contact-card:nth-child(3) .btn': 'WhatsApp',
      '.footer-section:nth-child(1) p': 'Espacio de bienestar y encuentro en Madrid centro.',
      '.footer-section:nth-child(2) h4': 'Enlaces Rapidos',
      '.footer-section:nth-child(3) h4': 'Siguenos',
      '.footer-section:nth-child(2) li:nth-child(1) a': 'Precios',
      '.footer-section:nth-child(2) li:nth-child(2) a': 'Horarios',
      '.footer-section:nth-child(2) li:nth-child(3) a': 'FAQ',
      '.footer-section:nth-child(2) li:nth-child(4) a': 'Contacto',
      '.footer-bottom > p': '© 2025 Sauna Puerta de Toledo. Todos los derechos reservados.',
      '.footer-links a:nth-child(1)': 'Politica de Privacidad',
      '.footer-links a:nth-child(2)': 'Aviso Legal',
      '.footer-links a:nth-child(3)': 'Politica de Cookies',
      '#cookie-desc': '&#127850; Utilizamos cookies propias para mejorar la experiencia de navegacion. Al continuar navegando aceptas su uso. <a href="#" class="cookie-link">Politica de cookies</a>.',
      '.cookie-decline': 'Solo esenciales',
      '.cookie-accept': 'Aceptar todas'
    },
    attrs: isEn ? [
      { selector: '#review-name', attr: 'placeholder', value: 'Your name' },
      { selector: '#review-lastname', attr: 'placeholder', value: 'Your last name' },
      { selector: '#review-text', attr: 'placeholder', value: 'Write your experience here...' },
      { selector: '#lightbox', attr: 'aria-label', value: 'Expanded image' },
      { selector: '#lightbox-close', attr: 'aria-label', value: 'Close' },
      { selector: '#lightbox-prev', attr: 'aria-label', value: 'Previous' },
      { selector: '#lightbox-next', attr: 'aria-label', value: 'Next' },
      { selector: '#whatsapp-btn', attr: 'title', value: 'Chat on WhatsApp' },
      { selector: '.gallery-item[data-zone="sauna"]', attr: 'data-caption', value: 'Sauna area' },
      { selector: '.gallery-item[data-zone="vapor"]', attr: 'data-caption', value: 'Steam bath' },
      { selector: '.gallery-item[data-zone="jacuzzi"]', attr: 'data-caption', value: 'Relaxing jacuzzi' },
      { selector: '.gallery-item[data-zone="tratamientos"]', attr: 'data-caption', value: 'Treatments' }
    ] : [
      { selector: '#review-name', attr: 'placeholder', value: 'Tu nombre' },
      { selector: '#review-lastname', attr: 'placeholder', value: 'Tu apellido' },
      { selector: '#review-text', attr: 'placeholder', value: 'Escribe aqui tu experiencia...' },
      { selector: '#lightbox', attr: 'aria-label', value: 'Imagen ampliada' },
      { selector: '#lightbox-close', attr: 'aria-label', value: 'Cerrar' },
      { selector: '#lightbox-prev', attr: 'aria-label', value: 'Anterior' },
      { selector: '#lightbox-next', attr: 'aria-label', value: 'Siguiente' },
      { selector: '#whatsapp-btn', attr: 'title', value: 'Chat por WhatsApp' },
      { selector: '.gallery-item[data-zone="sauna"]', attr: 'data-caption', value: 'Zona de sauna' },
      { selector: '.gallery-item[data-zone="vapor"]', attr: 'data-caption', value: 'Bano de Vapor' },
      { selector: '.gallery-item[data-zone="jacuzzi"]', attr: 'data-caption', value: 'Jacuzzi Relajante' },
      { selector: '.gallery-item[data-zone="tratamientos"]', attr: 'data-caption', value: 'Tratamientos' }
    ]
  };
}

function initLanguageToggle() {
  const btnEs = document.getElementById('language-es');
  const btnEn = document.getElementById('language-en');
  const translatable = document.querySelectorAll('[data-i18n]');

  if (!btnEs || !btnEn) return;

  function applyLanguage(lang) {
    const selected = lang === 'en' ? 'en' : 'es';
    const content = getStaticTranslations(selected);

    translatable.forEach(node => {
      const key = node.dataset.i18n;
      if (content.nav[key]) {
        node.textContent = content.nav[key];
      }
    });

    Object.entries(content.text).forEach(([selector, value]) => {
      try {
        const nodes = document.querySelectorAll(selector);
        nodes.forEach(node => {
          if (selector === '#cookie-desc') {
            node.innerHTML = value;
          } else {
            node.textContent = value;
          }
        });
      } catch (error) {
        // Ignore invalid selectors in translation maps to prevent blocking language switch.
      }
    });

    content.attrs.forEach(item => {
      const node = document.querySelector(item.selector);
      if (node) node.setAttribute(item.attr, item.value);
    });

    document.title = content.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (metaDescription) metaDescription.setAttribute('content', content.metas.description);
    if (ogTitle) ogTitle.setAttribute('content', content.metas.ogTitle);
    if (ogDescription) ogDescription.setAttribute('content', content.metas.ogDescription);

    btnEs.setAttribute('aria-pressed', selected === 'es' ? 'true' : 'false');
    btnEn.setAttribute('aria-pressed', selected === 'en' ? 'true' : 'false');
    document.documentElement.lang = selected;
    localStorage.setItem('site-language', selected);

    document.dispatchEvent(new CustomEvent('languagechange', { detail: { language: selected } }));
    initSaturdayEventMode();
  }

  const initialLanguage = getCurrentLanguage();
  applyLanguage(initialLanguage);

  btnEs.addEventListener('click', () => applyLanguage('es'));
  btnEn.addEventListener('click', () => applyLanguage('en'));
}

// ========== WhatsApp Button ==========
function openWhatsApp() {
  // Número de WhatsApp (incluir código delD país)
  const phoneNumber = '34XXXXXXXXX'; // Reemplaza con tu número real
  const language = getCurrentLanguage();
  const baseMessage = language === 'en'
    ? 'Hi, I would like more information about Sauna Puerta de Toledo.'
    : 'Hola, quisiera mas informacion sobre Sauna Puerta de Toledo.';
  const message = encodeURIComponent(baseMessage);
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
  
  window.open(whatsappURL, '_blank');
}

// ========== Animaciones en Scroll ==========
function observeElements() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1
  });

  document.querySelectorAll('[data-observe]').forEach(el => {
    observer.observe(el);
  });
}

// ========== Efecto Parallax ==========
function initParallax() {
  window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    parallaxElements.forEach(element => {
      const speed = element.getAttribute('data-parallax') || 0.5;
      element.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });
}

// ========== Counter Animation ==========
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);

  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.ceil(start);
    }
  }, 16);
}

// ========== Form Validation ==========
function validateForm(formElement) {
  const inputs = formElement.querySelectorAll('input, textarea, select');
  let isValid = true;

  inputs.forEach(input => {
    if (!input.value.trim()) {
      isValid = false;
      input.style.borderColor = '#e84c51';
      input.style.boxShadow = '0 0 10px rgba(232, 76, 81, 0.3)';
    } else {
      input.style.borderColor = '#4ade80';
    }
  });

  return isValid;
}

// ========== Modal Window ==========
class Modal {
  constructor(triggerSelector, closeSelector = '.modal-close') {
    this.trigger = document.querySelector(triggerSelector);
    this.modal = this.trigger?.closest('.modal') || null;
    this.closeBtn = this.modal?.querySelector(closeSelector);

    if (this.trigger && this.modal) {
      this.trigger.addEventListener('click', () => this.open());
      this.closeBtn?.addEventListener('click', () => this.close());
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.close();
      });
    }
  }

  open() {
    if (this.modal) {
      this.modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      setTimeout(() => this.modal.classList.add('active'), 10);
    }
  }

  close() {
    if (this.modal) {
      this.modal.classList.remove('active');
      setTimeout(() => {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }, 300);
    }
  }
}

// ========== Lazy Loading Images ==========
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img.lazy').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// ========== Navbar Sticky Effect ==========
function initStickyNavbar() {
  const navbar = document.querySelector('.navbar');
  let lastScrollTop = 0;

  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
      navbar.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    } else {
      navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }

    lastScrollTop = scrollTop;
  });
}

// ========== Print Function ==========
function printPage() {
  window.print();
}

// ========== Share Function ==========
function shareOnSocial(platform) {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(document.title);

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
    whatsapp: `https://wa.me/?text=${title}%20${url}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    email: `mailto:?subject=${title}&body=${url}`
  };

  if (shareUrls[platform]) {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  }
}

// ========== Notification System ==========
class Notification {
  constructor(message, type = 'info', duration = 3000) {
    this.message = message;
    this.type = type;
    this.duration = duration;
    this.show();
  }

  show() {
    const notification = document.createElement('div');
    notification.className = `notification notification-${this.type}`;
    notification.textContent = this.message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      z-index: 10000;
      animation: slideIn 0.3s ease;
      font-weight: 500;
    `;

    if (this.type === 'success') {
      notification.style.background = '#4ade80';
    } else if (this.type === 'error') {
      notification.style.background = '#e84c51';
    } else if (this.type === 'warning') {
      notification.style.background = '#f97316';
    } else {
      notification.style.background = '#3b82f6';
    }

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, this.duration);
  }
}

// ========== Keyboard Navigation ==========
document.addEventListener('keydown', function(event) {
  // ESC para cerrar modales
  if (event.key === 'Escape') {
    const modals = document.querySelectorAll('.modal.active');
    modals.forEach(modal => {
      modal.classList.remove('active');
    });
  }

  // Acceso rápido: Alt + O para abrir WhatsApp
  if (event.altKey && event.key === 'o') {
    openWhatsApp();
  }
});

// ========== Dark/Light Mode Toggle ==========
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Cargar preferencia guardada
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
}

// ========== Inicializar funciones al cargar página ==========
window.addEventListener('load', function() {
  observeElements();
  initParallax();
  initLazyLoading();
  initStickyNavbar();
});

// ========== Scroll Progress Bar ==========
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', function() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  }, { passive: true });
}

// ========== Lightbox ==========
function initLightbox() {
  const items = document.querySelectorAll('.gallery-item[data-src]');
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!lightbox || items.length === 0) return;

  function getZoneGalleries(language) {
    if (language === 'en') {
      return {
        sauna: [
          { src: 'assets/images/gallery-sauna.jpg', caption: 'Sauna area' },
          { src: 'assets/images/hero-1.jpg', caption: 'Sauna atmosphere' }
        ],
        vapor: [
          { src: 'assets/images/gallery-vapor.jpg', caption: 'Steam bath' },
          { src: 'assets/images/hero-2.jpg', caption: 'Steam area' }
        ],
        jacuzzi: [
          { src: 'assets/images/gallery-jacuzzi.jpg', caption: 'Relaxing jacuzzi' },
          { src: 'assets/images/hero-1.jpg', caption: 'Water and relax area' }
        ],
        tratamientos: [
          { src: 'assets/images/gallery-tratamientos.jpg', caption: 'Treatments' },
          { src: 'assets/images/hero-2.jpg', caption: 'Treatment cabin' }
        ]
      };
    }

    return {
      sauna: [
        { src: 'assets/images/gallery-sauna.jpg', caption: 'Zona de sauna' },
        { src: 'assets/images/hero-1.jpg', caption: 'Sauna y ambiente' }
      ],
      vapor: [
        { src: 'assets/images/gallery-vapor.jpg', caption: 'Bano de vapor' },
        { src: 'assets/images/hero-2.jpg', caption: 'Espacio de vapor' }
      ],
      jacuzzi: [
        { src: 'assets/images/gallery-jacuzzi.jpg', caption: 'Jacuzzi relajante' },
        { src: 'assets/images/hero-1.jpg', caption: 'Zona de agua y relax' }
      ],
      tratamientos: [
        { src: 'assets/images/gallery-tratamientos.jpg', caption: 'Tratamientos' },
        { src: 'assets/images/hero-2.jpg', caption: 'Cabina de tratamientos' }
      ]
    };
  }

  let currentIndex = 0;
  let images = [];
  let currentZone = '';

  function openLightbox(index) {
    if (!images.length) return;
    currentIndex = index;
    img.src = images[index].src;
    img.alt = images[index].caption;
    caption.textContent = images[index].caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { img.src = ''; }, 350);
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + images.length) % images.length;
    img.style.opacity = '0';
    setTimeout(() => {
      img.src = images[currentIndex].src;
      caption.textContent = images[currentIndex].caption;
      img.style.opacity = '1';
    }, 180);
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      const zone = item.dataset.zone || '';
      const fallback = [{ src: item.dataset.src, caption: item.dataset.caption || '' }];
      currentZone = zone;
      const zoneGalleries = getZoneGalleries(getCurrentLanguage());
      images = zoneGalleries[zone] || fallback;
      openLightbox(0);
    });
  });

  document.addEventListener('languagechange', function() {
    if (!currentZone || !images.length) return;
    const zoneGalleries = getZoneGalleries(getCurrentLanguage());
    const updated = zoneGalleries[currentZone];
    if (!updated || !updated.length) return;
    images = updated;
    if (lightbox.classList.contains('active') && images[currentIndex]) {
      caption.textContent = images[currentIndex].caption;
      img.alt = images[currentIndex].caption;
    }
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => navigate(-1));
  nextBtn.addEventListener('click', () => navigate(1));

  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
}

// ========== Cookie Banner ==========
function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;

  const declineBtn = banner.querySelector('.cookie-decline');
  const acceptBtn = banner.querySelector('.cookie-accept');
  if (declineBtn) declineBtn.addEventListener('click', declineCookies);
  if (acceptBtn) acceptBtn.addEventListener('click', acceptCookies);

  if (localStorage.getItem('cookieConsent')) return;
  setTimeout(() => banner.classList.add('visible'), 1200);
}

function acceptCookies() {
  localStorage.setItem('cookieConsent', 'all');
  const banner = document.getElementById('cookie-banner');
  if (banner) banner.classList.remove('visible');
}

function declineCookies() {
  localStorage.setItem('cookieConsent', 'essential');
  const banner = document.getElementById('cookie-banner');
  if (banner) banner.classList.remove('visible');
}

// ========== Experience Mode ==========
function initExperienceMode() {
  const chips = document.querySelectorAll('#experience-chips .chip');
  const title = document.getElementById('experience-title');
  const description = document.getElementById('experience-description');
  const cta = document.getElementById('experience-cta');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroSecondaryBtn = document.querySelector('.hero-ctas .btn-secondary');

  if (!chips.length || !title || !description || !cta) return;

  function getModes(language) {
    if (language === 'en') {
      return {
        relax: {
          title: 'Relaxation Plan',
          description: 'Start with steam bath, continue with jacuzzi and finish in lounge area for complete disconnection.',
          ctaText: 'See relaxation route',
          targetId: 'instalaciones',
          heroText: 'Experience focused on relaxation and wellbeing in central Madrid',
          heroBtn: 'Ask for relaxation plan'
        },
        social: {
          title: 'Social Plan',
          description: 'Choose busier time slots and use shared spaces for a more active visit.',
          ctaText: 'See recommended slots',
          targetId: 'horarios',
          heroText: 'Social space with active atmosphere and busier slots',
          heroBtn: 'Ask for social slot'
        },
        massage: {
          title: 'Massage Plan',
          description: 'Plan your visit around massage service and combine it with recovery areas.',
          ctaText: 'See massage options',
          targetId: 'precios',
          heroText: 'Route designed to combine massage and recovery',
          heroBtn: 'Ask for massage'
        }
      };
    }

    return {
      relax: {
        title: 'Plan Relax',
        description: 'Empieza por bano de vapor, continua con jacuzzi y termina en zona lounge para una desconexion completa.',
        ctaText: 'Ver recorrido relax',
        targetId: 'instalaciones',
        heroText: 'Experiencia orientada a relajación y bienestar en Madrid centro',
        heroBtn: 'Consultar plan relax'
      },
      social: {
        title: 'Plan Social',
        description: 'Elige franjas con mas movimiento y aprovecha espacios comunes para una visita mas dinamica.',
        ctaText: 'Ver franjas recomendadas',
        targetId: 'horarios',
        heroText: 'Espacio social con franjas de mayor movimiento y ambiente activo',
        heroBtn: 'Consultar franja social'
      },
      massage: {
        title: 'Plan Masaje',
        description: 'Organiza tu visita en torno al servicio de masaje y combina despues con zonas de recuperacion.',
        ctaText: 'Ver opciones de masaje',
        targetId: 'precios',
        heroText: 'Recorrido pensado para combinar masaje y recuperacion',
        heroBtn: 'Consultar masaje'
      }
    };
  }

  let currentMode = document.querySelector('#experience-chips .chip.active')?.dataset.mode || 'relax';

  function applyMode(modeKey) {
    const modes = getModes(getCurrentLanguage());
    const mode = modes[modeKey];
    if (!mode) return;
    currentMode = modeKey;

    chips.forEach(chip => chip.classList.toggle('active', chip.dataset.mode === modeKey));
    title.textContent = mode.title;
    description.textContent = mode.description;
    cta.textContent = mode.ctaText;
    cta.onclick = () => {
      const target = document.getElementById(mode.targetId);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    };

    if (heroSubtitle) heroSubtitle.textContent = mode.heroText;
    if (heroSecondaryBtn) heroSecondaryBtn.textContent = mode.heroBtn;
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => applyMode(chip.dataset.mode));
  });

  applyMode(currentMode);

  document.addEventListener('languagechange', function() {
    applyMode(currentMode);
  });
}

// ========== Interactive Tour ==========
function initVisitTour() {
  const image = document.getElementById('tour-image');
  const stepLabel = document.getElementById('tour-step-label');
  const title = document.getElementById('tour-title');
  const description = document.getElementById('tour-description');
  const prevBtn = document.getElementById('tour-prev');
  const nextBtn = document.getElementById('tour-next');

  if (!image || !stepLabel || !title || !description || !prevBtn || !nextBtn) return;

  function getSteps(language) {
    if (language === 'en') {
      return [
        {
          title: 'Reception and access',
          description: 'Arrival, access validation and quick orientation to start the route.',
          image: 'assets/images/gallery-sauna.jpg'
        },
        {
          title: 'Steam area',
          description: 'Ideal to begin and prepare your body with progressive humid heat.',
          image: 'assets/images/gallery-vapor.jpg'
        },
        {
          title: 'Jacuzzi and recovery',
          description: 'Deep relaxation stage to release tension and recover energy.',
          image: 'assets/images/gallery-jacuzzi.jpg'
        },
        {
          title: 'Visit closing',
          description: 'Final stage in the rest area to end your route calmly.',
          image: 'assets/images/gallery-tratamientos.jpg'
        }
      ];
    }

    return [
      {
        title: 'Recepcion y acceso',
        description: 'Llegada al local, validacion de acceso y orientacion inicial para empezar el recorrido.',
        image: 'assets/images/gallery-sauna.jpg'
      },
      {
        title: 'Zona de vapor',
        description: 'Ideal para comenzar y preparar el cuerpo con calor humedo progresivo.',
        image: 'assets/images/gallery-vapor.jpg'
      },
      {
        title: 'Jacuzzi y recuperacion',
        description: 'Fase de relajacion profunda para liberar tension y recuperar energia.',
        image: 'assets/images/gallery-jacuzzi.jpg'
      },
      {
        title: 'Cierre de visita',
        description: 'Ultimo tramo en zona de descanso para terminar el recorrido con calma.',
        image: 'assets/images/gallery-tratamientos.jpg'
      }
    ];
  }

  let current = 0;

  function renderStep(index) {
    const language = getCurrentLanguage();
    const steps = getSteps(language);
    const step = steps[index];
    image.style.opacity = '0';
    setTimeout(() => {
      image.src = step.image;
      image.alt = step.title;
      stepLabel.textContent = language === 'en' ? `Step ${index + 1} of ${steps.length}` : `Paso ${index + 1} de ${steps.length}`;
      title.textContent = step.title;
      description.textContent = step.description;
      image.style.opacity = '1';
    }, 180);
  }

  prevBtn.addEventListener('click', function() {
    const steps = getSteps(getCurrentLanguage());
    current = (current - 1 + steps.length) % steps.length;
    renderStep(current);
  });

  nextBtn.addEventListener('click', function() {
    const steps = getSteps(getCurrentLanguage());
    current = (current + 1) % steps.length;
    renderStep(current);
  });

  renderStep(current);

  document.addEventListener('languagechange', function() {
    renderStep(current);
  });
}

// ========== First Visit Checklist ==========
function initFirstVisitChecklist() {
  const list = document.getElementById('checklist-list');
  const counter = document.getElementById('checklist-counter');
  const bar = document.getElementById('checklist-progress-bar');

  if (!list || !counter || !bar) return;

  const checkboxes = list.querySelectorAll('input[type="checkbox"]');

  function updateChecklist() {
    const done = Array.from(checkboxes).filter(cb => cb.checked).length;
    const total = checkboxes.length;
    const progress = total > 0 ? (done / total) * 100 : 0;
    counter.textContent = `${done}/${total} completado`;
    bar.style.width = `${progress}%`;
  }

  checkboxes.forEach(cb => cb.addEventListener('change', updateChecklist));
  updateChecklist();
}

// ========== Weekend Visual Mode ==========
function initWeekendVisualMode() {
  const params = new URLSearchParams(window.location.search);
  const forcedWeekend = params.get('weekend') === '1';
  const forcedWeekday = params.get('weekend') === '0';

  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();

  const isWeekendBySchedule = day === 6 || day === 0 || (day === 5 && hour >= 18);
  const shouldEnable = forcedWeekday ? false : (forcedWeekend || isWeekendBySchedule);

  document.body.classList.toggle('weekend-theme', shouldEnable);
}

// ========== Saturday Event Mode ==========
function initSaturdayEventMode() {
  const params = new URLSearchParams(window.location.search);
  const forcedEvent = params.get('event') === '1';
  const forcedNoEvent = params.get('event') === '0';

  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();

  // Sabado noche + madrugada inmediata del domingo
  const isSaturdayNight = (day === 6 && hour >= 20) || (day === 0 && hour < 2);
  const shouldEnable = forcedNoEvent ? false : (forcedEvent || isSaturdayNight);

  document.body.classList.toggle('saturday-event', shouldEnable);

  const badge = document.getElementById('event-mode-badge');
  const language = getCurrentLanguage();
  if (badge) {
    if (shouldEnable) {
      badge.textContent = language === 'en' ? 'Saturday Night / Event Mode' : 'Sabado Noche / Event Mode';
      badge.classList.add('visible');
    } else {
      badge.classList.remove('visible');
      badge.textContent = '';
    }
  }

  if (shouldEnable) {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroPrimaryBtn = document.querySelector('.hero-ctas .btn-primary');
    const heroSecondaryBtn = document.querySelector('.hero-ctas .btn-secondary');

    if (heroSubtitle) {
      heroSubtitle.textContent = language === 'en'
        ? 'Saturday night: more active atmosphere, we recommend confirming capacity on WhatsApp'
        : 'Sabado noche: ambiente mas activo, recomendamos confirmar aforo por WhatsApp';
    }
    if (heroPrimaryBtn) {
      heroPrimaryBtn.textContent = language === 'en' ? 'See night plan' : 'Ver plan noche';
      heroPrimaryBtn.onclick = () => {
        const target = document.getElementById('horarios');
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      };
    }
    if (heroSecondaryBtn) {
      heroSecondaryBtn.textContent = language === 'en' ? 'Confirm capacity now' : 'Confirmar aforo ahora';
    }
  }
}

// ========== Utilities ==========

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Get query parameter
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Format currency
function formatCurrency(amount, currency = 'EUR') {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

// ========== Console Log Prevention (Opcional) ==========
// Uncomment para producción
/*
console.log = function() {};
console.error = function() {};
console.warn = function() {};
*/

// Export para uso en otros scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    scrollToTop,
    openWhatsApp,
    acceptCookies,
    declineCookies,
    formatCurrency,
    debug: true
  };
}


