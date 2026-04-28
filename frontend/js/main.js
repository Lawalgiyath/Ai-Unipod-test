/* ============================================================
   AI UNIPOD LAGOS — Global JavaScript
   ============================================================ */

'use strict';

// ─── LOADER ─────────────────────────────────────────────────
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1400);
  });
  document.body.style.overflow = 'hidden';
}

// ─── CUSTOM CURSOR ───────────────────────────────────────────
function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const cursor = document.querySelector('.cursor');
  const ring = document.querySelector('.cursor-ring');
  if (!cursor || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX - 5 + 'px';
    cursor.style.top = mouseY - 5 + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX - 20) * 0.12;
    ringY += (mouseY - ringY - 20) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .card, .nav__link').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      ring.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      ring.classList.remove('hover');
    });
  });
}

// ─── NAVIGATION ─────────────────────────────────────────────
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  // Scroll behavior
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Active link
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  // Hamburger
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileNav = document.querySelector('.nav__mobile');
  const mobileClose = document.querySelector('.nav__mobile-close');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => mobileNav.classList.add('open'));
    mobileClose?.addEventListener('click', () => mobileNav.classList.remove('open'));
  }
}

// ─── SCROLL REVEAL ──────────────────────────────────────────
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => observer.observe(el));
}

// ─── HORIZONTAL SCROLL (DRAG) ────────────────────────────────
function initHScroll() {
  document.querySelectorAll('.h-scroll-track').forEach(track => {
    let isDown = false;
    let startX;
    let scrollLeft;

    track.addEventListener('mousedown', e => {
      isDown = true;
      track.classList.add('active');
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });
    track.addEventListener('mouseleave', () => { isDown = false; });
    track.addEventListener('mouseup', () => { isDown = false; });
    track.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 2;
      track.scrollLeft = scrollLeft - walk;
    });
  });
}

// ─── COUNTER ANIMATION ───────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const start = performance.now();

      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// ─── TOAST NOTIFICATION ──────────────────────────────────────
function showToast(message, type = 'success') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : '✕'}</span>
    <span>${message}</span>
  `;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}
window.showToast = showToast;

// ─── API HELPERS ─────────────────────────────────────────────
// Note: API is provided by mock-data.js or supabase-client.js
// Don't overwrite it here - just ensure it exists
if (!window.API) {
  console.warn('⚠️ No API found. Please load mock-data.js or supabase-client.js first.');
  window.API = {
    async get() { throw new Error('API not initialized'); },
    async getOne() { throw new Error('API not initialized'); },
    async post() { throw new Error('API not initialized'); },
    async put() { throw new Error('API not initialized'); },
    async delete() { throw new Error('API not initialized'); }
  };
}

// ─── FORMAT DATE ─────────────────────────────────────────────
function formatDate(dateStr, options = {}) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options
  });
}
window.formatDate = formatDate;

// ─── SMOOTH PARALLAX ─────────────────────────────────────────
function initParallax() {
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (!parallaxEls.length || window.innerWidth < 768) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const offset = (center - window.innerHeight / 2) * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  }, { passive: true });
}

// ─── IMAGE LAZY LOAD ─────────────────────────────────────────
function initLazyImages() {
  const imgs = document.querySelectorAll('img[data-src]');
  if (!imgs.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.src = e.target.dataset.src;
        observer.unobserve(e.target);
      }
    });
  });
  imgs.forEach(img => observer.observe(img));
}

// ─── MARQUEE ─────────────────────────────────────────────────
function initMarquee() {
  document.querySelectorAll('.marquee-track').forEach(track => {
    const content = track.innerHTML;
    track.innerHTML = content + content;
  });
}

// ─── MODAL HELPERS ────────────────────────────────────────────
function openModal(id) {
  document.getElementById(id)?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
  document.body.style.overflow = '';
}
window.openModal = openModal;
window.closeModal = closeModal;

// Close modal on overlay click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ─── INIT ALL ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initNav();
  initReveal();
  initHScroll();
  initCounters();
  initParallax();
  initLazyImages();
  initMarquee();
});
