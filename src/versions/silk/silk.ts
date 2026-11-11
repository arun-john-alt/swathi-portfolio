// The Silk version's only script. It lays each saree (live project) open as it comes up the screen,
// dyes the counter's edge and the ledger in the colour of the saree in front of you, weaves each section
// in once as it arrives, and rests the silk's sheen while it is off screen.
// Without it, every saree already lies flat and every section is already finished.

declare global {
  interface Window {
    __silkReady?: boolean;
  }
}

window.__silkReady = true;

const root = document.documentElement;
const folding = root.classList.contains('js-fold');
const weaving = root.classList.contains('js-weave');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Play a class-driven animation again from the start, and lift the class when it is over. */
function replay(el: Element, cls: string, ms: number) {
  el.classList.remove(cls);
  void (el as HTMLElement).offsetWidth;
  el.classList.add(cls);
  window.setTimeout(() => el.classList.remove(cls), ms);
}

/* ---------- Sarees unfold with the scroll ---------- */

type Saree = {
  el: HTMLElement;
  sheet: HTMLElement;
  hem: HTMLElement | null;
  handset: HTMLElement | null;
  id: string;
  target: number;
  open: number;
  written: string;
  hero: boolean;
  landed: boolean;
};

const sarees: Saree[] = Array.from(document.querySelectorAll<HTMLElement>('[data-saree]')).map((el) => ({
  el,
  sheet: el.querySelector<HTMLElement>('.sheet') ?? el,
  hem: el.querySelector<HTMLElement>('.hem'),
  handset: el.querySelector<HTMLElement>('.handset'),
  id: el.id.replace(/^work-/, ''),
  target: 0,
  open: 0,
  written: '',
  hero: false,
  landed: false,
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
  // As the cloth lands flat, light runs once across the zari of its hem.
  if (!s.landed && s.open >= 1) {
    s.landed = true;
    if (s.hem) replay(s.hem, 'is-glossing', 1000);
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

// While a saree passes through the screen its phone drifts a few pixels and turns a few degrees.
function drift() {
  const vh = window.innerHeight;
  for (const s of sarees) {
    if (!s.handset) continue;
    const r = s.sheet.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh) continue;
    const c = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / (vh / 2)));
    s.handset.style.setProperty('--tilt', `${(c * -5).toFixed(2)}deg`);
    s.handset.style.setProperty('--lift', `${(c * 10).toFixed(1)}px`);
  }
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

/* ---------- How a project goes: the thread is drawn down as you pass, each marker set as it is reached ---------- */

const thread = document.querySelector<HTMLElement>('[data-thread]');
const steps = thread ? Array.from(thread.querySelectorAll<HTMLElement>('.step')) : [];
let threadDone = 0;

function drawThread() {
  if (!thread || threadDone >= 1) return;
  const r = thread.getBoundingClientRect();
  const p = clamp01((window.innerHeight * 0.72 - r.top) / r.height);
  if (p <= threadDone) return;
  threadDone = p;
  thread.style.setProperty('--thread', p.toFixed(3));
  const reached = p * r.height;
  for (const s of steps) {
    if (!s.classList.contains('is-set') && s.offsetTop + 10 <= reached) s.classList.add('is-set');
  }
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
      drift();
    }
    if (weaving) drawThread();
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
    if (!s.hero) {
      s.open = s.target;
      s.landed = s.open >= 1;
    }
    write(s);
  }
  drift();
  // The first saree on a wide screen half-opens as the last thread of the opening weave is drawn.
  if (sarees.some((s) => s.hero)) {
    window.setTimeout(() => {
      heroReady = true;
      setTargets();
      kick();
    }, 1250);
  }

  // Under a pointer, light runs across a saree's hem again.
  if (finePointer.matches) {
    for (const s of sarees) {
      const hem = s.hem;
      if (!hem) continue;
      s.el.querySelector('.saree__stage')?.addEventListener('pointerenter', () => {
        if (s.open >= 1) replay(hem, 'is-glossing', 1000);
      });
    }
  }
}

pickCurrent();
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);

/* ---------- The opening weave: header, logo, border, headline, buttas, light ---------- */

const intros = Array.from(document.querySelectorAll<HTMLElement>('[data-intro]'));
const header = document.querySelector<HTMLElement>('.strip');
const hero = document.querySelector<HTMLElement>('[data-hero]');
const logoLink = document.querySelector<HTMLAnchorElement>('[data-logo]');
const logo = logoLink?.querySelector('svg');
let introTimers: number[] = [];

// The hero's buttas are set one at a time on the same half-drop as the pattern, then the pattern takes over.
function setButtas() {
  const pattern = hero?.querySelector<HTMLElement>('.butta');
  if (!hero || !pattern) return;
  hero.querySelector('.kasu-set')?.remove();
  hero.classList.remove('is-set');
  const t = parseFloat(getComputedStyle(root).getPropertyValue('--t')) || 24;
  const w = pattern.offsetWidth;
  const h = pattern.offsetHeight;
  if (!w || !h) return;
  const tile = t * 3;
  // The pattern keeps its motifs above and below the copy; match its fade so the hand-over is invisible.
  const band = (y: number) => {
    const f = y / h;
    if (f <= 0.15 || f >= 0.93) return 1;
    if (f < 0.21) return (0.21 - f) / 0.06;
    if (f > 0.87) return (f - 0.87) / 0.06;
    return 0;
  };
  const set = document.createElement('i');
  set.className = 'kasu-set';
  set.setAttribute('aria-hidden', 'true');
  const spots: [number, number][] = [];
  for (let ty = t * 0.5 - tile; ty < h; ty += tile) {
    for (let tx = t * 0.5 - tile; tx < w; tx += tile) {
      spots.push([tx + t * 0.75, ty + t * 0.75], [tx + t * 2.25, ty + t * 2.25]);
    }
  }
  for (const [x, y] of spots) {
    if (x < -t * 0.25 || x > w + t * 0.25 || y < -t * 0.25 || y > h + t * 0.25) continue;
    const a = band(y);
    if (a <= 0.02) continue;
    const k = document.createElement('i');
    k.className = 'kasu';
    // Set across the cloth from the top-left corner, about 0.5 s from first to last.
    const d = 1900 + Math.round(((x + y) / (w + h)) * 500);
    k.style.cssText = `left:${x.toFixed(1)}px;top:${y.toFixed(1)}px;opacity:${a.toFixed(2)};--d:${d}ms`;
    set.appendChild(k);
  }
  pattern.after(set);
  introTimers.push(
    window.setTimeout(() => {
      hero.classList.add('is-set');
      set.remove();
    }, 2700),
  );
}

function runIntro(again: boolean) {
  introTimers.forEach(clearTimeout);
  introTimers = [];
  if (again) {
    for (const el of intros) {
      el.classList.remove('is-intro');
      void el.offsetWidth;
      el.classList.add('is-intro');
    }
  }
  setButtas();
  // The header is free for its hover thread once its own weave is done; the hero once its light has passed.
  introTimers.push(window.setTimeout(() => header?.classList.remove('is-intro'), 1400));
  introTimers.push(window.setTimeout(() => hero?.classList.remove('is-intro'), 4400));
}

if (weaving) {
  runIntro(false);

  if (logoLink && logo) {
    // Under a pointer the zari thread re-traces the letters and the dot catches the light.
    logoLink.addEventListener('pointerenter', () => {
      if (finePointer.matches && !header?.classList.contains('is-intro')) replay(logo, 'is-retrace', 900);
    });
    // The logo leads back to the top; there it weaves the opening again instead of reloading the page.
    logoLink.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: window.scrollY < window.innerHeight ? 'smooth' : 'auto' });
      runIntro(true);
    });
  }
} else {
  intros.forEach((el) => el.classList.remove('is-intro'));
}

/* ---------- Each section is woven in once, as it arrives ---------- */

const toWeave = document.querySelectorAll<HTMLElement>('[data-weave]');
if (weaving && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-woven');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
  );
  toWeave.forEach((el) => io.observe(el));
  drawThread();
} else {
  toWeave.forEach((el) => el.classList.add('is-woven'));
  steps.forEach((s) => s.classList.add('is-set'));
}

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
