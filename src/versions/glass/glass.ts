// The Glass version's only script. Everything on the page works without it: the menu is a
// <details>, the links are links, and every pane rests lit and clear. With it:
// - the project pane nearest the middle of the screen lights up and its site comes through
//   sharp (on phones the step of "How I work" nearest the middle brightens the same way),
// - the navigation pane for the section you are reading floods amber,
// - each section below the first screen plays its own light once as it scrolls in,
// - on desktop, the rail's message pane lights cobalt only while no other cobalt pane is in view,
//   a lamp behind the glass follows the mouse inside a screenshot, and the logo glints on hover
//   and replays the opening when clicked,
// - the phone menu closes after a tap, on Escape, or on a tap outside it.
// Light only: nothing moves position. People who ask for less motion get the state changes
// (lit, amber, cobalt) without the sweeps, the entrances or the replay.

const root = document.documentElement;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
const wide = window.matchMedia('(min-width: 1024px)');

/* ---------- Phone menu ---------- */

function setupMenu() {
  const menu = document.querySelector<HTMLDetailsElement>('[data-menu]');
  if (!menu) return;
  const summary = menu.querySelector('summary');

  menu.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) menu.open = false;
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.open) {
      menu.open = false;
      summary?.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (menu.open && !menu.contains(e.target as Node)) menu.open = false;
  });
  wide.addEventListener('change', (e) => {
    if (e.matches) menu.open = false;
  });
}

/* ---------- Light: the pane nearest the centre, and the section being read ---------- */

interface Group {
  els: HTMLElement[];
  lit: HTMLElement | null;
  active: () => boolean;
}

function setupLight() {
  if (!('IntersectionObserver' in window)) return;

  const groups: Group[] = [
    // The five project bays.
    { els: Array.from(document.querySelectorAll<HTMLElement>('[data-focus]')), lit: null, active: () => true },
    // The steps of "How I work", while they are stacked (on desktop they sit in one row).
    { els: Array.from(document.querySelectorAll<HTMLElement>('[data-step]')), lit: null, active: () => !wide.matches },
  ];
  const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'));
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav] a[href^="#"]'));

  // Only panes near the screen are measured on scroll.
  const near = new Set<HTMLElement>();
  let current = '';
  let queued = false;

  const update = () => {
    queued = false;
    const vh = window.innerHeight;
    const mid = vh / 2;

    for (const g of groups) {
      let best: HTMLElement | null = null;
      let bestDist = Infinity;
      if (g.active()) {
        for (const el of g.els) {
          if (!near.has(el)) continue;
          const r = el.getBoundingClientRect();
          if (!r.height) continue; // hidden at this width
          // It has to reach into the middle part of the screen to count.
          if (r.bottom < vh * 0.25 || r.top > vh * 0.75) continue;
          const dist = Math.abs((r.top + r.bottom) / 2 - mid);
          if (dist < bestDist) {
            bestDist = dist;
            best = el;
          }
        }
      }
      if (best !== g.lit) {
        g.lit?.classList.remove('is-lit');
        best?.classList.add('is-lit');
        g.lit = best;
      }
    }

    const line = vh * 0.35;
    let now = '';
    for (const s of sections) {
      const r = s.getBoundingClientRect();
      if (r.top <= line && r.bottom > line) {
        now = s.id;
        break;
      }
    }
    if (now !== current) {
      current = now;
      for (const a of links) {
        if (a.getAttribute('href') === `#${now}`) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      }
    }
  };

  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) near.add(e.target as HTMLElement);
        else near.delete(e.target as HTMLElement);
      }
      queue();
    },
    { rootMargin: '10% 0px 10% 0px' },
  );
  groups.forEach((g) => g.els.forEach((el) => io.observe(el)));

  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  wide.addEventListener('change', queue);
  root.classList.add('glass-ready');
  queue();
}

/* ---------- Sections: each plays its own light once as it scrolls in ---------- */

// Only sections still below the screen at load are armed (their panes wait in the shade, still
// readable); anything already on screen simply stays lit. glass.css holds each section's light.
function setupEntrances() {
  if (reduce.matches || !('IntersectionObserver' in window)) return;
  const enter = (entries: IntersectionObserverEntry[], io: IntersectionObserver) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    }
  };
  // A section plays once its top is a little way up the screen; a short one at the very end of
  // the page (the sill) may never get that far, so it plays once most of it is visible.
  const tall = new IntersectionObserver(enter, { rootMargin: '0px 0px -18% 0px' });
  const short = new IntersectionObserver(enter, { threshold: 0.6 });
  document.querySelectorAll<HTMLElement>('[data-enter]').forEach((s) => {
    const r = s.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.82) return;
    s.classList.add('is-armed');
    (r.height < window.innerHeight * 0.3 ? short : tall).observe(s);
  });
}

/* ---------- The one cobalt pane (desktop) ---------- */

// The rail's message pane stays clear glass while either big cobalt pane (the first bay's or the
// close's) is on screen, and lights cobalt otherwise: one lit way to her at a time.
function setupRailCta() {
  const rail = document.querySelector<HTMLElement>('[data-rail-cta]');
  const others = Array.from(document.querySelectorAll<HTMLElement>('.hero__cta, .close__cta'));
  if (!rail || !others.length || !('IntersectionObserver' in window)) {
    rail?.classList.add('is-on');
    return;
  }
  const seen = new Set<Element>();
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) seen.add(e.target);
      else seen.delete(e.target);
    }
    rail.classList.toggle('is-on', seen.size === 0);
  });
  others.forEach((el) => io.observe(el));
}

/* ---------- A lamp behind the glass, following the mouse (desktop) ---------- */

function setupPointerLight() {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!fine.matches || reduce.matches) return;
  let shot: HTMLElement | null = null;
  let x = 0;
  let y = 0;
  let queued = false;

  const paint = () => {
    queued = false;
    if (!shot) return;
    const r = shot.getBoundingClientRect();
    shot.style.setProperty('--mx', `${Math.round(x - r.left)}px`);
    shot.style.setProperty('--my', `${Math.round(y - r.top)}px`);
  };
  const hold = (next: HTMLElement | null) => {
    if (next === shot) return;
    shot?.classList.remove('is-pointer');
    shot = next;
    shot?.classList.add('is-pointer');
  };

  document.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX;
      y = e.clientY;
      hold((e.target as Element).closest<HTMLElement>('.shot'));
      if (shot && !queued) {
        queued = true;
        requestAnimationFrame(paint);
      }
    },
    { passive: true },
  );
  root.addEventListener('pointerleave', () => hold(null));
}

/* ---------- The logo: a glint on hover, and a click replays the opening ---------- */

function setupLogo() {
  const logo = document.querySelector<HTMLElement>('[data-logo]');
  if (!logo) return;
  let timer = 0;

  logo.addEventListener('pointerenter', (e) => {
    if (e.pointerType !== 'mouse' || reduce.matches) return;
    logo.classList.remove('is-glint');
    void logo.offsetWidth; // restart the glint if it is still running
    logo.classList.add('is-glint');
    window.clearTimeout(timer);
    timer = window.setTimeout(() => logo.classList.remove('is-glint'), 1200);
  });

  logo.addEventListener('click', () => {
    if (reduce.matches) return;
    const replay = () => {
      root.classList.remove('intro');
      void root.offsetWidth;
      root.classList.add('intro');
    };
    if (window.scrollY < 4) {
      replay();
      return;
    }
    // Wait until the page has scrolled back to the top, so the opening plays where it can be seen.
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      replay();
    };
    window.addEventListener('scrollend', go, { once: true });
    window.setTimeout(go, 1400);
  });
}

setupMenu();
setupLight();
setupEntrances();
setupRailCta();
setupPointerLight();
setupLogo();
