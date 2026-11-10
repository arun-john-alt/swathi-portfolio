// The site's only JavaScript: the phone menu, the hero's live measurement, the hero reel,
// the design/live sliders and the scroll reveals. Everything works without it, just less alive.

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Phone menu ---------- */

function setupMenu() {
  const btn = document.querySelector<HTMLButtonElement>('[data-menu-btn]');
  const nav = document.querySelector<HTMLElement>('[data-menu]');
  if (!btn || !nav) return;

  const isOpen = () => btn.getAttribute('aria-expanded') === 'true';
  const setOpen = (open: boolean, returnFocus = false) => {
    btn.setAttribute('aria-expanded', String(open));
    btn.querySelector('.menu-btn__text')!.textContent = open ? 'Close' : 'Menu';
    nav.classList.toggle('is-open', open);
    if (open) nav.querySelector('a')?.focus({ preventScroll: true });
    else if (returnFocus) btn.focus();
  };

  btn.addEventListener('click', () => setOpen(!isOpen()));
  nav.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) setOpen(false, true);
  });
  document.addEventListener('click', (e) => {
    const t = e.target as Node;
    if (isOpen() && !nav.contains(t) && !btn.contains(t)) setOpen(false);
  });
  // Close it if the window grows past the phone layout.
  window.matchMedia('(min-width: 800px)').addEventListener('change', (e) => {
    if (e.matches) setOpen(false);
  });
}

/* ---------- Hero: the selected headline reports its real size ---------- */

function setupHero() {
  const sel = document.querySelector<HTMLElement>('[data-sel]');
  const h1 = sel?.querySelector('h1');
  if (!sel || !h1) return;
  const dims = sel.querySelector<HTMLElement>('[data-sel-dims]');

  const range = document.createRange();
  range.selectNodeContents(h1);

  const update = () => {
    const r = h1.getBoundingClientRect();
    // The widest line, so the outline hugs the words instead of the empty space beside them.
    const lines = Array.from(range.getClientRects());
    const hug = Math.ceil(lines.length ? Math.max(...lines.map((l) => l.right)) - r.left : r.width);
    sel.style.setProperty('--hug', `${hug}px`);
    if (dims) dims.textContent = `${hug} × ${Math.round(r.height)}`;
  };

  update();
  new ResizeObserver(update).observe(h1);
  document.fonts?.ready.then(update);
}

/* ---------- Hero reel: plays while on screen, never for people who asked for less motion ---------- */

function setupReel() {
  const fig = document.querySelector<HTMLElement>('[data-reel]');
  const video = fig?.querySelector<HTMLVideoElement>('[data-reel-video]');
  const toggle = fig?.querySelector<HTMLButtonElement>('[data-reel-toggle]');
  if (!fig || !video || !toggle) return;
  const count = fig.querySelector<HTMLElement>('[data-reel-count]');
  const seg = Number(fig.dataset.seg) || 1;
  const total = Number(fig.dataset.count) || 1;
  const pad = (n: number) => String(n).padStart(2, '0');

  // The script takes over from the browser's own controls.
  video.removeAttribute('controls');
  toggle.hidden = false;

  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  let userPaused = reduceMotion || Boolean(saveData);
  let onScreen = false;

  const show = (playing: boolean) => {
    fig.classList.toggle('is-paused', !playing);
    toggle.setAttribute('aria-label', playing ? 'Pause the reel' : 'Play the reel');
  };
  const play = () => {
    video.preload = 'auto';
    video.play().then(
      () => show(true),
      () => show(false), // autoplay refused: leave the play button showing
    );
  };
  const pause = () => {
    video.pause();
    show(false);
  };

  show(false);
  toggle.addEventListener('click', () => {
    if (video.paused) {
      userPaused = false;
      play();
    } else {
      userPaused = true;
      pause();
    }
  });

  video.addEventListener('timeupdate', () => {
    if (count) count.textContent = `${pad(Math.min(total, Math.floor(video.currentTime / seg) + 1))} / ${pad(total)}`;
  });

  // Only play while it can be seen; stop when it scrolls away or the tab is hidden.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen && !userPaused) play();
        else if (!onScreen && !video.paused) pause();
      },
      { threshold: 0.25 },
    ).observe(video);
  } else if (!userPaused) {
    play();
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !video.paused) pause();
    else if (!document.hidden && onScreen && !userPaused) play();
  });
}

/* ---------- Design / live sliders ---------- */

function setupCompare(box: HTMLElement) {
  const handle = box.querySelector<HTMLElement>('[data-compare-handle]');
  if (!handle) return;
  let pos = 50;

  const set = (p: number) => {
    pos = Math.min(100, Math.max(0, p));
    box.style.setProperty('--pos', `${pos}%`);
    handle.setAttribute('aria-valuenow', String(Math.round(pos)));
    handle.setAttribute(
      'aria-valuetext',
      pos <= 2 ? 'Live site' : pos >= 98 ? 'Design file' : `${Math.round(pos)}% design, ${Math.round(100 - pos)}% live site`,
    );
  };
  const fromX = (clientX: number) => {
    const r = box.getBoundingClientRect();
    set(((clientX - r.left) / r.width) * 100);
  };

  // Touch: only a sideways drag moves the handle, so a vertical swipe over the box still scrolls.
  // Mouse and pen: press anywhere to grab.
  let startX = 0;
  let startY = 0;
  let dragging = false;
  let tracking = false;

  box.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    tracking = true;
    startX = e.clientX;
    startY = e.clientY;
    if (e.pointerType !== 'touch') {
      dragging = true;
      box.classList.add('is-dragging');
      box.setPointerCapture(e.pointerId);
      fromX(e.clientX);
      e.preventDefault();
    }
  });

  box.addEventListener('pointermove', (e) => {
    if (!tracking) return;
    if (!dragging) {
      const dx = Math.abs(e.clientX - startX);
      const dy = Math.abs(e.clientY - startY);
      if (dx > 6 && dx > dy) {
        dragging = true;
        box.classList.add('is-dragging');
        box.setPointerCapture(e.pointerId);
      } else return;
    }
    fromX(e.clientX);
  });

  const end = (e: PointerEvent) => {
    if (!tracking) return;
    // A tap (no drag) on a touch screen moves the handle to the tapped spot.
    if (!dragging && e.type === 'pointerup') {
      const moved = Math.hypot(e.clientX - startX, e.clientY - startY);
      if (moved < 8) fromX(e.clientX);
    }
    tracking = false;
    dragging = false;
    box.classList.remove('is-dragging');
  };
  box.addEventListener('pointerup', end);
  box.addEventListener('pointercancel', end);

  handle.addEventListener('keydown', (e) => {
    const step = e.shiftKey ? 20 : 5;
    const keys: Record<string, number> = {
      ArrowLeft: pos - step,
      ArrowDown: pos - step,
      ArrowRight: pos + step,
      ArrowUp: pos + step,
      PageDown: pos - 20,
      PageUp: pos + 20,
      Home: 0,
      End: 100,
    };
    if (e.key in keys) {
      e.preventDefault();
      set(keys[e.key]);
    }
  });
}

function setupCompares() {
  const boxes = document.querySelectorAll<HTMLElement>('[data-compare]');
  boxes.forEach(setupCompare);

  // Nudge each handle once when it first comes into view, so people see it moves.
  if (reduceMotion || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        el.classList.add('is-hinting');
        el.addEventListener('animationend', () => el.classList.remove('is-hinting'), { once: true });
        io.unobserve(el);
      }
    },
    { threshold: 0.6 },
  );
  boxes.forEach((b) => io.observe(b));
}

/* ---------- Scroll reveals ---------- */

function setupReveals() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      }
    },
    // Start before the board is on screen, so nobody waits on a blank box.
    { rootMargin: '0px 0px 15% 0px' },
  );
  els.forEach((el) => {
    // Anything already on screen at load shows straight away.
    if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in');
    else io.observe(el);
  });
}

setupMenu();
setupHero();
setupReel();
setupCompares();
setupReveals();
