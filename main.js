/* =========================================
   LUMINARY — Main JS
   ========================================= */

// NAV scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Mobile nav burger
const burger = document.getElementById('navBurger');
const mobileNav = document.getElementById('navMobile');
if (burger && mobileNav) {
  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    mobileNav.classList.toggle('open', open);
  });
  // close on link click
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });
}

// Reveal on scroll (IntersectionObserver)
const revealEls = document.querySelectorAll('.reveal, .reveal-right, .reveal-up');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger siblings in grid parents
      const siblings = entry.target.parentElement
        ? [...entry.target.parentElement.children].filter(c => c.classList.contains('reveal') || c.classList.contains('reveal-right') || c.classList.contains('reveal-up'))
        : [];
      const idx = siblings.indexOf(entry.target);
      const delay = idx >= 0 ? idx * 80 : 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObs.observe(el));

// Ebook showcase
const ebookSlides = document.querySelectorAll('.ebook-slide');
const ebookNavBtns = document.querySelectorAll('.ebook-nav-btn');
const progressBar = document.getElementById('ebookProgress');
let currentEbook = 0;
let ebookInterval = null;

function goToEbook(idx) {
  if (idx === currentEbook) return;

  const prev = ebookSlides[currentEbook];
  prev.classList.remove('active');
  prev.classList.add('exit');
  setTimeout(() => prev.classList.remove('exit'), 600);

  currentEbook = idx;
  ebookSlides[currentEbook].classList.add('active');

  ebookNavBtns.forEach((btn, i) => btn.classList.toggle('active', i === currentEbook));

  if (progressBar) {
    const pct = ((currentEbook + 1) / ebookSlides.length) * 100;
    progressBar.style.width = pct + '%';
  }
}

function startEbookAutoplay() {
  ebookInterval = setInterval(() => {
    goToEbook((currentEbook + 1) % ebookSlides.length);
  }, 5000);
}

function resetEbookAutoplay() {
  clearInterval(ebookInterval);
  startEbookAutoplay();
}

ebookNavBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    goToEbook(parseInt(btn.dataset.index, 10));
    resetEbookAutoplay();
  });
});

if (ebookSlides.length > 0) {
  if (progressBar) progressBar.style.width = '33.33%';
  startEbookAutoplay();
}

// Animated counters
const trustStats = document.querySelectorAll('.trust-stat');
let countersStarted = false;

function animateCounter(el) {
  const numEl = el.querySelector('.trust-number');
  if (!numEl) return;
  const target = parseInt(numEl.dataset.target, 10);
  const suffix = numEl.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.floor(easeOut(progress) * target);
    numEl.textContent = value.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else numEl.textContent = target.toLocaleString() + suffix;
  }
  requestAnimationFrame(tick);
}

const counterObs = new IntersectionObserver((entries) => {
  if (countersStarted) return;
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      countersStarted = true;
      trustStats.forEach(stat => animateCounter(stat));
      counterObs.disconnect();
    }
  });
}, { threshold: 0.3 });

if (trustStats.length > 0) counterObs.observe(trustStats[0]);

// FAQ accordion
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const btn = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  if (!btn || !answer) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    // close all
    faqItems.forEach(fi => {
      fi.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      fi.querySelector('.faq-answer').classList.remove('open');
    });

    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      answer.classList.add('open');
    }
  });
});

// Smooth anchor scroll for in-page links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Cursor-relative sheen on pricing / member cards
const cards = document.querySelectorAll('.pricing-card, .member-card');
cards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});
