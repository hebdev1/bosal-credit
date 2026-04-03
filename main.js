// ── NAV SCROLL
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// ── BURGER MENU
const burger = document.getElementById('burger');
if (burger) {
  burger.addEventListener('click', () => nav.classList.toggle('open'));
  document.querySelectorAll('.nav-drawer a').forEach(a => {
    a.addEventListener('click', () => nav.classList.remove('open'));
  });
}

// ── REVEAL ON SCROLL
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

// ── SMOOTH ANCHOR SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      nav.classList.remove('open');
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Animate chart bars on scroll
const chartSection = document.querySelector('.dc-chart');
if (chartSection) {
  const chartObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.bar').forEach((b, i) => {
        b.style.transition = `height .8s ${i * .06}s cubic-bezier(.4,0,.2,1)`;
      });
      chartObs.disconnect();
    }
  }, { threshold: .3 });
  chartObs.observe(chartSection);
}
