// 사이트 전역 인터랙션: 스무스 스크롤(Lenis), 스크롤 등장, 헤더 상태, 숫자 카운트업, 커서 라벨.
// ClientRouter(뷰 트랜지션)로 페이지가 바뀔 때마다 init()이 다시 실행된다.
import Lenis from 'lenis';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let lenis: Lenis | null = null;

function smooth() {
  if (reduced || lenis) return;
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, touchMultiplier: 1.4 });
  const raf = (t: number) => { lenis!.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
}

function reveal() {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  document.querySelectorAll('[data-reveal]:not(.in)').forEach((el) => io.observe(el));
  document.querySelectorAll('.stagger').forEach((g) => [...g.children].forEach((c, i) => (c as HTMLElement).style.setProperty('--i', String(i))));
}

function header() {
  const h = document.getElementById('site-header');
  if (!h) return;
  const overHero = !!document.querySelector('[data-hero-dark]');
  let last = 0;
  const onScroll = () => {
    const y = window.scrollY;
    h.classList.toggle('scrolled', y > 12);
    h.classList.toggle('on-dark', overHero && y < window.innerHeight * 0.72 && !h.classList.contains('menu-open'));
    h.classList.toggle('hidden', y > last && y > 200 && !h.classList.contains('menu-open'));
    last = y;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function countUp() {
  const els = document.querySelectorAll<HTMLElement>('[data-count]');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      io.unobserve(e.target);
      const el = e.target as HTMLElement;
      const target = Number(el.dataset.count), suffix = el.dataset.suffix ?? '';
      if (reduced || !Number.isFinite(target)) { el.textContent = target + suffix; continue; }
      const t0 = performance.now(), dur = 1400;
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur), ease = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(target * ease) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }, { threshold: 0.5 });
  els.forEach((el) => io.observe(el));
}

function cursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  let c = document.getElementById('cursor');
  if (!c) {
    c = document.createElement('div'); c.id = 'cursor'; c.textContent = 'View ↗'; document.body.appendChild(c);
    let x = 0, y = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; }, { passive: true });
    const loop = () => { cx += (x - cx) * 0.18; cy += (y - cy) * 0.18; c!.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`; requestAnimationFrame(loop); };
    loop();
  }
  document.querySelectorAll<HTMLElement>('[data-cursor]').forEach((el) => {
    el.addEventListener('mouseenter', () => { c!.textContent = el.dataset.cursor || 'View ↗'; c!.classList.add('on'); });
    el.addEventListener('mouseleave', () => c!.classList.remove('on'));
  });
}

function parallax() {
  const els = document.querySelectorAll<HTMLElement>('[data-parallax]');
  if (!els.length || reduced) return;
  const run = () => {
    for (const el of els) {
      const r = el.getBoundingClientRect();
      const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight; // -1..1
      const img = el.querySelector('img') as HTMLElement | null;
      if (img) img.style.transform = `translateY(${p * -8}%) scale(1.16)`;
    }
    requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}

function init() {
  smooth(); reveal(); header(); countUp(); cursor(); parallax();
  document.getElementById('cursor')?.classList.remove('on');
}
document.addEventListener('astro:page-load', init);
document.addEventListener('astro:after-swap', () => lenis?.scrollTo(0, { immediate: true }));
