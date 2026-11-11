// The Glass version's only script. Everything on the page works without it: the menu is a
// <details>, the links are links, and the screenshots stay clear. With it:
// - the pane nearest the middle of the screen lights up and its site comes through sharp,
// - the navigation pane for the section you are reading floods amber,
// - the phone menu closes after a tap, on Escape, or on a tap outside it,
// - on desktop, the rail's message pane lights cobalt once the first bay's one has scrolled away.

const root = document.documentElement;

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
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
    if (e.matches) menu.open = false;
  });
}

/* ---------- Light: the pane nearest the centre, and the section being read ---------- */

function setupLight() {
  if (!('IntersectionObserver' in window)) return;

  const panes = Array.from(document.querySelectorAll<HTMLElement>('[data-focus]'));
  const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'));
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav] a[href^="#"]'));

  // Only panes near the screen are measured on scroll.
  const near = new Set<HTMLElement>();
  let lit: HTMLElement | null = null;
  let current = '';
  let queued = false;

  const update = () => {
    queued = false;
    const vh = window.innerHeight;
    const mid = vh / 2;

    let best: HTMLElement | null = null;
    let bestDist = Infinity;
    for (const el of near) {
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
    if (best !== lit) {
      lit?.classList.remove('is-lit');
      best?.classList.add('is-lit');
      lit = best;
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
  panes.forEach((p) => io.observe(p));

  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  root.classList.add('glass-ready');
  queue();
}

/* ---------- The one cobalt pane (desktop) ---------- */

// The rail's message pane stays clear glass while the first bay's cobalt pane is on screen, and
// lights cobalt once that one has scrolled away, so there is always exactly one lit way to her.
function setupRailCta() {
  const rail = document.querySelector<HTMLElement>('[data-rail-cta]');
  const hero = document.querySelector<HTMLElement>('.hero__cta');
  if (!rail || !hero || !('IntersectionObserver' in window)) {
    rail?.classList.add('is-on');
    return;
  }
  new IntersectionObserver(([entry]) => {
    rail.classList.toggle('is-on', !entry.isIntersecting);
  }).observe(hero);
}

setupMenu();
setupLight();
setupRailCta();
