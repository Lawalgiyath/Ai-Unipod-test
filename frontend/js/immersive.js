/* ============================================================
   IMMERSIVE EXPERIENCES — AI UniPod Lagos
   Advanced scroll animations, parallax, and interactive elements
   ============================================================ */

'use strict';

// ─── SMOOTH SCROLL WITH MOMENTUM ─────────────────────────────
class SmoothScroll {
  constructor() {
    this.current = 0;
    this.target = 0;
    this.ease = 0.075;
    this.init();
  }

  init() {
    if (window.innerWidth < 768) return; // Disable on mobile
    
    document.body.style.height = `${document.documentElement.scrollHeight}px`;
    
    window.addEventListener('scroll', () => {
      this.target = window.scrollY;
    });

    this.animate();
  }

  animate() {
    this.current += (this.target - this.current) * this.ease;
    
    if (Math.abs(this.target - this.current) < 0.05) {
      this.current = this.target;
    }

    document.querySelectorAll('[data-scroll]').forEach(el => {
      const speed = parseFloat(el.dataset.scroll) || 0.5;
      el.style.transform = `translateY(${-this.current * speed}px)`;
    });

    requestAnimationFrame(() => this.animate());
  }
}

// ─── MAGNETIC BUTTONS ────────────────────────────────────────
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn, .nav__cta, .program-card');
  
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

// ─── PARALLAX IMAGES ─────────────────────────────────────────
function initParallaxImages() {
  const images = document.querySelectorAll('[data-parallax-img]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        window.addEventListener('scroll', () => updateParallax(entry.target));
      }
    });
  }, { threshold: 0 });

  images.forEach(img => observer.observe(img));
}

function updateParallax(el) {
  const rect = el.getBoundingClientRect();
  const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
  const speed = parseFloat(el.dataset.parallaxImg) || 0.3;
  
  el.style.transform = `translateY(${scrollPercent * 100 * speed}px) scale(1.1)`;
}

// ─── TEXT REVEAL ON SCROLL ───────────────────────────────────
function initTextReveal() {
  const elements = document.querySelectorAll('[data-text-reveal]');
  
  elements.forEach(el => {
    const text = el.textContent;
    el.innerHTML = text.split('').map((char, i) => 
      `<span style="display:inline-block;opacity:0;transform:translateY(20px);transition:all 0.5s ${i * 0.02}s">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('span').forEach(span => {
          span.style.opacity = '1';
          span.style.transform = 'translateY(0)';
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  elements.forEach(el => observer.observe(el));
}

// ─── SCROLL PROGRESS INDICATOR ───────────────────────────────
function initScrollProgress() {
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #0468B1, #C8A84B);
    z-index: 9999;
    transform-origin: left;
    transform: scaleX(0);
    transition: transform 0.1s ease-out;
  `;
  document.body.appendChild(progress);

  window.addEventListener('scroll', () => {
    const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    progress.style.transform = `scaleX(${scrollPercent})`;
  }, { passive: true });
}

// ─── HOVER TILT EFFECT ───────────────────────────────────────
function initTiltEffect() {
  const cards = document.querySelectorAll('.card, .program-card, .news-item');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      const tiltX = (y - 0.5) * 10;
      const tiltY = (x - 0.5) * -10;
      
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });
}

// ─── SCROLL-TRIGGERED ANIMATIONS ─────────────────────────────
function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const animation = entry.target.dataset.animate;
        entry.target.style.animation = `${animation} 0.8s ease-out forwards`;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  elements.forEach(el => observer.observe(el));
}

// ─── FLOATING ELEMENTS ───────────────────────────────────────
function initFloatingElements() {
  const floaters = document.querySelectorAll('[data-float]');
  
  floaters.forEach((el, i) => {
    const speed = parseFloat(el.dataset.float) || 2;
    const delay = i * 0.5;
    
    function animate() {
      const time = Date.now() / 1000;
      const y = Math.sin(time * speed + delay) * 10;
      el.style.transform = `translateY(${y}px)`;
      requestAnimationFrame(animate);
    }
    animate();
  });
}

// ─── IMAGE ZOOM ON HOVER ─────────────────────────────────────
function initImageZoom() {
  const images = document.querySelectorAll('.card__image, .program-card__img, .news-item__img');
  
  images.forEach(img => {
    const parent = img.parentElement;
    parent.style.overflow = 'hidden';
    
    parent.addEventListener('mouseenter', () => {
      img.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      img.style.transform = 'scale(1.08)';
    });

    parent.addEventListener('mouseleave', () => {
      img.style.transform = 'scale(1)';
    });
  });
}

// ─── STAGGER REVEAL ──────────────────────────────────────────
function initStaggerReveal() {
  const groups = document.querySelectorAll('[data-stagger]');
  
  groups.forEach(group => {
    const children = group.children;
    const delay = parseInt(group.dataset.stagger) || 100;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          Array.from(children).forEach((child, i) => {
            setTimeout(() => {
              child.style.opacity = '1';
              child.style.transform = 'translateY(0)';
            }, i * delay);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    // Set initial state
    Array.from(children).forEach(child => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(30px)';
      child.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });

    observer.observe(group);
  });
}

// ─── MOUSE FOLLOWER ──────────────────────────────────────────
function initMouseFollower() {
  const follower = document.createElement('div');
  follower.className = 'mouse-follower';
  follower.style.cssText = `
    position: fixed;
    width: 8px;
    height: 8px;
    background: rgba(4, 104, 177, 0.6);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    transition: transform 0.15s ease-out;
    mix-blend-mode: difference;
  `;
  document.body.appendChild(follower);

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    
    follower.style.left = followerX - 4 + 'px';
    follower.style.top = followerY - 4 + 'px';
    
    requestAnimationFrame(animate);
  }
  animate();

  // Scale on hover
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      follower.style.transform = 'scale(3)';
    });
    el.addEventListener('mouseleave', () => {
      follower.style.transform = 'scale(1)';
    });
  });
}

// ─── SECTION TRANSITIONS ─────────────────────────────────────
function initSectionTransitions() {
  const sections = document.querySelectorAll('section');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(40px)';
    section.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    observer.observe(section);
  });
}

// ─── INIT ALL IMMERSIVE FEATURES ─────────────────────────────
function initImmersive() {
  // Only init on desktop for performance
  const isDesktop = window.innerWidth >= 1024;
  
  if (isDesktop) {
    // new SmoothScroll(); // Commented out - can cause issues with some browsers
    initMagneticButtons();
    initTiltEffect();
    initMouseFollower();
  }

  // Init on all devices
  initScrollProgress();
  initParallaxImages();
  initTextReveal();
  initScrollAnimations();
  initFloatingElements();
  initImageZoom();
  initStaggerReveal();
  initSectionTransitions();
}

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initImmersive);
} else {
  initImmersive();
}

// Export for manual initialization
window.initImmersive = initImmersive;

console.log('✨ Immersive experiences initialized');
