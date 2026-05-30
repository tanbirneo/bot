/* =========================================
   LUMINARY — Main JS v2
   ========================================= */

// Nav scroll
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// Mobile nav
const burger = document.getElementById('navBurger');
const drawer = document.getElementById('navDrawer');
if (burger && drawer) {
  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    drawer.classList.toggle('open', open);
  });
  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      drawer.classList.remove('open');
    });
  });
}

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal, .reveal-r, .reveal-l, .reveal-scale');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const siblings = [...(el.parentElement?.children || [])].filter(c =>
      c.classList.contains('reveal') || c.classList.contains('reveal-r') ||
      c.classList.contains('reveal-l') || c.classList.contains('reveal-scale')
    );
    const idx = siblings.indexOf(el);
    const delay = Math.min(idx * 90, 400);
    setTimeout(() => el.classList.add('visible'), delay);
    revealObs.unobserve(el);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObs.observe(el));

// Ebook showcase slider
const ebookSlides = document.querySelectorAll('.ebook-slide');
const ebookTabs = document.querySelectorAll('.ebook-tab');
const ebookFill = document.getElementById('ebookFill');
let currentEbook = 0;
let ebookTimer = null;

function goToEbook(idx) {
  if (idx === currentEbook || !ebookSlides.length) return;
  ebookSlides[currentEbook].classList.remove('active');
  ebookSlides[currentEbook].classList.add('exiting');
  setTimeout(() => ebookSlides[currentEbook - (idx > currentEbook ? 1 : -1) + (idx > currentEbook ? 0 : 0)]?.classList.remove('exiting'), 600);
  const prevIdx = currentEbook;
  currentEbook = idx;
  setTimeout(() => ebookSlides[prevIdx].classList.remove('exiting'), 600);
  ebookSlides[currentEbook].classList.add('active');
  ebookTabs.forEach((t, i) => t.classList.toggle('active', i === currentEbook));
  if (ebookFill) ebookFill.style.width = ((currentEbook + 1) / ebookSlides.length * 100) + '%';
}

function resetEbookTimer() {
  clearInterval(ebookTimer);
  ebookTimer = setInterval(() => goToEbook((currentEbook + 1) % ebookSlides.length), 5500);
}

if (ebookSlides.length) {
  ebookTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      goToEbook(parseInt(btn.dataset.idx, 10));
      resetEbookTimer();
    });
  });
  resetEbookTimer();
}

// Animated counters
const counterEls = document.querySelectorAll('.trust-num[data-target]');
let countersRun = false;

function runCounters() {
  counterEls.forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const dur = 1800;
    const start = performance.now();
    const easeOut = t => 1 - Math.pow(1 - t, 3);
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.floor(easeOut(p) * target).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString() + suffix;
    };
    requestAnimationFrame(tick);
  });
}

if (counterEls.length) {
  const cObs = new IntersectionObserver(entries => {
    if (countersRun) return;
    if (entries.some(e => e.isIntersecting)) {
      countersRun = true;
      runCounters();
      cObs.disconnect();
    }
  }, { threshold: 0.3 });
  cObs.observe(counterEls[0].closest('.trust-grid') || counterEls[0]);
}

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-q');
  const ans = item.querySelector('.faq-a');
  if (!btn || !ans) return;
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.faq-q[aria-expanded="true"]').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling?.classList.remove('open');
    });
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      ans.classList.add('open');
    }
  });
});

// Smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// Form handler (frontend only — shows success message)
function handleForm(e) {
  e.preventDefault();
  const form = e.target;
  const msgId = form.id === 'contactForm' ? 'formMsg' : 'supportMsg';
  const msg = document.getElementById(msgId);
  if (msg) {
    msg.style.display = 'block';
    form.querySelectorAll('input, textarea').forEach(f => f.value = '');
    setTimeout(() => { msg.style.display = 'none'; }, 5000);
  }
}
window.handleForm = handleForm;

// Parallax glow orbs (subtle)
const orbs = document.querySelectorAll('.mem-preview-orb, .final-cta-orb, .mem-final-orb');
if (orbs.length && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  window.addEventListener('mousemove', e => {
    const mx = (e.clientX / window.innerWidth - 0.5) * 30;
    const my = (e.clientY / window.innerHeight - 0.5) * 30;
    orbs.forEach(orb => {
      orb.style.transform = `translate(calc(-50% + ${mx}px), calc(-50% + ${my}px))`;
    });
  }, { passive: true });
}
