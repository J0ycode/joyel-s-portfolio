/* ══════════════════════════════════════════
   JOSHY JOSEPH EXECUTIVE PORTFOLIO
   Main JavaScript — All Interactions
   ══════════════════════════════════════════ */

'use strict';

// ─── DOM Helpers ───
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ══════════════════════════════════════════
// 1. HERO CANVAS — Animated Particle Grid
// ══════════════════════════════════════════
(function initHeroCanvas() {
  const canvas = $('#heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles, animId;
  const PARTICLE_COUNT = 60;
  const GOLD = 'rgba(198,163,95,';
  const TEAL = 'rgba(45,212,191,';

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.4,
      color: Math.random() > 0.4 ? GOLD : TEAL,
      opacity: Math.random() * 0.35 + 0.1,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          const alpha = (1 - dist / 110) * 0.12;
          ctx.beginPath();
          ctx.strokeStyle = `${particles[i].color}${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${p.opacity})`;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    animId = requestAnimationFrame(draw);
  }

  init();
  draw();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { init(); }, 200);
  });
})();

// ══════════════════════════════════════════
// 2. NAVBAR — Scroll spy / hamburger
// ══════════════════════════════════════════
(function initNavbar() {
  const navbar = $('#navbar');
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobileMenu');
  const navLinks = $$('.nav-link, .mobile-link');
  const sections = $$('section[id]');

  // Scroll class
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    // Scroll spy
    let current = '';
    sections.forEach(s => {
      const top = s.offsetTop - 100;
      if (window.scrollY >= top) current = s.getAttribute('id');
    });

    $$('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });

  // Hamburger
  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
  });

  // Close mobile menu on link click
  $$('.mobile-link').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
})();

// ══════════════════════════════════════════
// 3. SCROLL REVEAL — IntersectionObserver
// ══════════════════════════════════════════
(function initScrollReveal() {
  const revealEls = $$('.reveal-up, .reveal-left, .reveal-right');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));
})();

// ══════════════════════════════════════════
// 4. ANIMATED COUNTERS
// ══════════════════════════════════════════
(function initCounters() {
  const counters = $$('.counter-num');
  if (!counters.length) return;

  let started = false;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(easeOut(progress) * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target + suffix;
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        counters.forEach(c => animateCounter(c));
      }
    });
  }, { threshold: 0.4 });

  const section = $('.counters-row');
  if (section) observer.observe(section);
})();

// ══════════════════════════════════════════
// 5. EXPANDABLE TIMELINE
// ══════════════════════════════════════════
(function initTimeline() {
  $$('.timeline-card').forEach(card => {
    const toggle = $('.tc-toggle', card);
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      const expanded = card.dataset.expanded === 'true';
      // Close all others
      $$('.timeline-card[data-expanded="true"]').forEach(c => {
        if (c !== card) c.dataset.expanded = 'false';
      });
      card.dataset.expanded = expanded ? 'false' : 'true';
    });

    // Click on header (excluding toggle button) also expands
    const header = $('.tc-header', card);
    header.addEventListener('click', (e) => {
      if (!e.target.closest('.tc-toggle')) {
        toggle.click();
      }
    });

    card.style.cursor = 'pointer';
  });
})();

// ══════════════════════════════════════════
// 6. EXPERTISE CARDS — keyboard accessible
// ══════════════════════════════════════════
(function initExpertise() {
  $$('.expertise-card').forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.focus();
      }
    });
  });
})();

// ══════════════════════════════════════════
// 7. TESTIMONIALS SLIDER
// ══════════════════════════════════════════
(function initSlider() {
  const track = $('#testimonialsTrack');
  const prevBtn = $('#prevBtn');
  const nextBtn = $('#nextBtn');
  const dotsContainer = $('#sliderDots');

  if (!track) return;

  const slides = $$('.testimonial-card', track);
  let current = 0;
  let autoplayTimer;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function getDots() { return $$('.slider-dot', dotsContainer); }

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    getDots().forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });
  prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });

  // Touch swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) dx > 0 ? next() : prev();
    resetAutoplay();
  }, { passive: true });

  // Autoplay
  function startAutoplay() {
    autoplayTimer = setInterval(next, 5500);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  startAutoplay();
})();

// ══════════════════════════════════════════
// 8. LIGHT / DARK MODE TOGGLE
// ══════════════════════════════════════════
(function initThemeToggle() {
  const toggle = $('#themeToggle');
  const icon = $('.theme-icon', toggle);
  if (!toggle) return;

  const saved = localStorage.getItem('jj-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  icon.textContent = saved === 'dark' ? '☀️' : '🌙';

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    icon.textContent = next === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('jj-theme', next);
  });
})();

// ══════════════════════════════════════════
// 9. SCROLL TO TOP BUTTON
// ══════════════════════════════════════════
(function initScrollTop() {
  const btn = $('#scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ══════════════════════════════════════════
// 10. CONTACT FORM — Simulated Submit
// ══════════════════════════════════════════
(function initContactForm() {
  const form = $('#contactForm');
  const success = $('#formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span>Sending…</span>';

    // Simulate network delay
    setTimeout(() => {
      form.reset();
      btn.innerHTML = originalHTML;
      btn.disabled = false;
      success.classList.add('visible');
      setTimeout(() => success.classList.remove('visible'), 5000);
    }, 1200);
  });
})();

// ══════════════════════════════════════════
// 11. RESUME DOWNLOAD BUTTON
// ══════════════════════════════════════════
(function initResumeBtn() {
  const btn = $('#resumeBtn');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    // Create a simple text file as placeholder
    const content = `JOSHY JOSEPH\nAdditional Director | LeaseIndex India Ltd\nKerala, India\n\nThis is a placeholder for the executive profile PDF.\nPlease replace with actual resume file.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Joshy_Joseph_Executive_Profile.txt';
    a.click();
    URL.revokeObjectURL(url);
  });
})();

// ══════════════════════════════════════════
// 12. SMOOTH ACTIVE NAV (init on load)
// ══════════════════════════════════════════
(function onLoad() {
  // Trigger initial scroll check
  window.dispatchEvent(new Event('scroll'));

  // Profile image fallback (styled placeholder if file not found)
  const profileImg = document.querySelector('.profile-img');
  if (profileImg) {
    profileImg.addEventListener('error', () => {
      profileImg.style.display = 'none';
      const placeholder = document.createElement('div');
      placeholder.style.cssText = `
        width: 100%;
        aspect-ratio: 4/5;
        border-radius: 28px;
        background: linear-gradient(145deg, #111827, #1a2340);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 16px;
        border: 1px solid rgba(255,255,255,0.07);
      `;
      placeholder.innerHTML = `
        <div style="width:90px;height:90px;border-radius:50%;background:linear-gradient(135deg,#c6a35f,#a67c3a);display:flex;align-items:center;justify-content:center;font-size:2.2rem;font-weight:800;color:#0a0e1a;font-family:sans-serif;">JJ</div>
        <p style="color:#6b7a99;font-size:0.85rem;text-align:center;font-family:Outfit,sans-serif;">Joshy Joseph<br>Additional Director</p>
      `;
      profileImg.parentNode.insertBefore(placeholder, profileImg.nextSibling);
    });
  }
})();

// ══════════════════════════════════════════
// 13. SCROLL PROGRESS BAR
// ══════════════════════════════════════════
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgressBar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
  }, { passive: true });
})();

// ══════════════════════════════════════════
// 14. TYPEWRITER EFFECT — Hero Sub-Line
// ══════════════════════════════════════════
(function initTypewriter() {
  const el = document.getElementById('heroTypewriter');
  if (!el) return;

  const phrases = [
    'Director · LeaseIndex India Limited',
    'Vice Chairman · KIDCO Ltd',
    'Financial Services Strategy Leader',
    'MSME Finance & Growth Champion',
    'Board-Level Executive · Kerala'
  ];

  let phraseIndex = 0, charIndex = 0, isDeleting = false;

  // Rebuild DOM: text node + cursor span
  el.innerHTML = '';
  const textNode = document.createTextNode('');
  el.appendChild(textNode);
  const cursorEl = document.createElement('span');
  cursorEl.className = 'typewriter-cursor';
  cursorEl.textContent = '|';
  el.appendChild(cursorEl);

  function type() {
    const current = phrases[phraseIndex];
    charIndex += isDeleting ? -1 : 1;
    textNode.nodeValue = current.substring(0, charIndex);

    let delay = isDeleting ? 40 : 75;
    if (!isDeleting && charIndex === current.length) {
      delay = 2200; isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }
    setTimeout(type, delay);
  }

  setTimeout(type, 1200);
})();

// ══════════════════════════════════════════
// 15. SKILL BARS — Animate on Intersection
// ══════════════════════════════════════════
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-bar-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseInt(el.closest('.skill-row')?.dataset.delay || 0) * 150;
      setTimeout(() => { el.style.width = el.dataset.width + '%'; }, delay);
      observer.unobserve(el);
    });
  }, { threshold: 0.3 });

  fills.forEach(f => observer.observe(f));
})();
