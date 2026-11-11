// The Silk version's only script. It lays each saree (live project) open as it comes up the screen,
// dyes the counter's edge and the ledger in the colour of the saree in front of you, and rests the
// silk's sheen while it is off screen. Without it, every saree already lies flat and readable.

declare global {
  interface Window {
    __silkReady?: boolean;
  }
}

window.__silkReady = true;

const root = document.documentElement;
const folding = root.classList.contains('js-fold');
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/* ---------- Sarees unfold with the scroll ---------- */

type Saree = {
  el: HTMLElement;
  sheet: HTMLElement;
  id: string;
  target: number;
  open: number;
  written: string;
  hero: boolean;
};

const sarees: Saree[] = Array.from(document.querySelectorAll<HTMLElement>('[data-saree]')).map((el) => ({
  el,
  sheet: el.querySelector<HTMLElement>('.sheet') ?? el,
  id: el.id.replace(/^work-/, ''),
  target: 0,
  open: 0,
  written: '',
  hero: false,
}));

// A saree already on the first screen (the desktop hero) waits half open, then opens fully on the first scroll.
const HERO_REST = 0.72;
let heroReady = false;
let frame = 0;
let last = 0;

function setTargets() {
  const vh = window.innerHeight;
  for (const s of sarees) {
    let t: number;
    if (s.hero) {
      const scrolled = clamp01(window.scrollY / (vh * 0.22));
      t = Math.max(heroReady ? HERO_REST : 0, scrolled > 0 ? HERO_REST + (1 - HERO_REST) * scrolled : 0);
    } else {
      // Opens between the moment its top enters the lower screen and when it reaches the upper third.
      const top = s.sheet.getBoundingClientRect().top;
      const p = clamp01((vh * 0.88 - top) / (vh * 0.5));
      t = 1 - Math.pow(1 - p, 3);
    }
    // Once laid open on the counter, a saree stays open.
    s.target = Math.max(s.target, t);
  }
}

function write(s: Saree) {
  const v = s.open.toFixed(3);
  if (v !== s.written) {
    s.el.style.setProperty('--open', v);
    s.written = v;
  }
}

// Each value glides toward its target with an exponential ease-out, so a quick flick still unfolds smoothly.
function glide(now: number) {
  const dt = last ? Math.min(64, now - last) : 16;
  last = now;
  const k = 1 - Math.exp(-dt / 150);
  let moving = false;
  for (const s of sarees) {
    const d = s.target - s.open;
    if (Math.abs(d) > 0.002) {
      s.open += d * k;
      moving = true;
    } else {
      s.open = s.target;
    }
    write(s);
  }
  frame = moving ? requestAnimationFrame(glide) : 0;
  if (!moving) last = 0;
}

function kick() {
  if (!frame) frame = requestAnimationFrame(glide);
}

/* ---------- The counter edge and the ledger take the colour of the saree in front of you ---------- */

const counter = document.querySelector<HTMLElement>('[data-counter]');
const workSection = document.getElementById('work');
const ledger = new Map(
  Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-ledger]')).map((a) => [a.dataset.ledger!, a]),
);
let current: Saree | null | undefined;

function pickCurrent() {
  const mid = window.innerHeight * 0.5;
  let next: Saree | null = null;
  const workBottom = workSection ? workSection.getBoundingClientRect().bottom : 0;
  if (workBottom > mid) {
    for (const s of sarees) {
      if (s.el.getBoundingClientRect().top <= mid) next = s;
    }
  }
  if (next === current) return;
  current = next;
  if (counter) {
    if (next) counter.style.setProperty('--edge', next.el.dataset.brand || '');
    else counter.style.removeProperty('--edge');
  }
  ledger.forEach((a, id) => {
    if (next && id === next.id) a.setAttribute('aria-current', 'true');
    else a.removeAttribute('aria-current');
  });
}

/* ---------- Scroll ---------- */

let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    if (folding) {
      setTargets();
      kick();
    }
    pickCurrent();
  });
}

if (folding) {
  const vh = window.innerHeight;
  for (const s of sarees) {
    if (window.scrollY < 8 && s.sheet.getBoundingClientRect().top < vh * 0.55) s.hero = true;
  }
  setTargets();
  // Whatever is already part-way up the screen at load starts where it should be, without a jump.
  for (const s of sarees) {
    if (!s.hero) s.open = s.target;
    write(s);
  }
  // The first saree on a wide screen half-opens as the last thread of the opening weave is drawn.
  if (sarees.some((s) => s.hero)) {
    window.setTimeout(() => {
      heroReady = true;
      setTargets();
      kick();
    }, 1250);
  }
}

pickCurrent();
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);

/* ---------- The sheen rests while the silk is off screen, and on data saver ---------- */

const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
if (saveData) root.classList.add('save-data');

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) e.target.classList.toggle('is-away', !e.isIntersecting);
  });
  document.querySelectorAll('[data-silk]').forEach((el) => io.observe(el));
}

export {};
