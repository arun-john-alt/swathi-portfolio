# Swathi's portfolio: reference analysis and plan (11 Nov 2026)

## 1. The reference: abisheakportfolio.vercel.app

Read in the in-app browser at 1024 px and at a 375 px phone (bundle, DOM, network and screenshots).

### How it is built

| Part | What it uses |
|---|---|
| Framework | React single-page app built with Vite, TanStack Router. Client-rendered: the HTML is a 3.5 KB empty shell and nothing shows until the JavaScript runs. |
| JavaScript | About 1.3 MB unzipped (987 KB app chunk + 340 KB core). |
| CSS | Tailwind CSS v4 (oklch colours, utility classes, a custom `spider-dark` colour). |
| Fonts | General Sans (Fontshare, 300 to 600) for everything. Geist 700 is loaded but not used on the pages checked. |
| Motion | Three systems at once: Three.js (WebGL ember particles fixed behind the page, a 3D project carousel), GSAP + ScrollTrigger (pinned, scrubbed scroll sections), Motion / framer-motion (in-view reveals, count-up numbers). Plus a custom canvas cursor effect (a web/tentacle that follows the pointer; the theme is Spider-Man). The canvas effect checks `prefers-reduced-motion`. |
| Hosting | Vercel, served from the Mumbai edge (bom1). |
| Content | Name, WhatsApp number, projects (YouTube links) and a Google Drive folder sit in one data object in the code. Good pattern: one place to edit. |
| Contact | A WhatsApp link with a pre-filled message (good), and a form that sends nothing: on submit it shows "Thanks" for 4 seconds and drops the message. |

### Page structure (one long page: about 9,600 px on desktop, 10,100 px on a phone)

1. Fixed glass nav pill: logo, five anchor links, red "Let's talk" button.
2. Hero: small eyebrow line, huge name, role line, one-sentence pitch, two buttons; portrait behind tilted glass panels.
3. "Client results": three count-up numbers.
4. Projects: pinned 3D carousel of video cards, plus a "full quality Drive folder" link.
5. About: paragraph, tool chips, a hanging ID badge on a rope (physics).
6. Services and pricing: five numbered cards with rupee ranges and a small-print note.
7. Skills: eight skill cards with level labels, then tool logos.
8. Contact: WhatsApp card first, then the form.
9. Footer: glass bar with anchor links.

### Layout, type, colour, motion

- Near-black ground (#08080c) with one hot red accent; red glow and bokeh everywhere; translucent glass cards (blur, thin 5% white border, about 24 px radius).
- One grotesk for everything. Headings all caps and ending in a full stop ("PROJECTS."), tight tracking (-1.2 px at 48 px). A tiny letter-spaced red eyebrow and a short red bar above every heading.
- Centred section heads, card grids, generous vertical padding (80 to 112 px).
- Motion everywhere: an intro with blurred-in text, count-ups, the pinned 3D carousel, cursor canvas.

### On phones

What works:
- The hero restacks: picture card on top, text and full-width buttons below, fits one screen.
- Services go two-up and stay readable. The WhatsApp card comes first in Contact: one tap to chat.
- Form fields are tall (about 56 px) with 16 px+ text, so iPhones don't zoom in.
- No sideways scroll at 375 px.

What doesn't (lessons for Swathi's site):
- Slow first screen: about 10 s to first paint in my phone-emulated load. Causes: client-side rendering, 1.3 MB of JavaScript, and a 7.7 MB uncompressed about photo.
- The phone nav is only the logo, with no menu; footer links are 16 px tall (well under 44 px).
- The stats section is blank until it scrolls into view; the 3D carousel cards spill off the screen edge.
- The fake contact form, and client numbers ("150+") with no source.

## 2. Plan for Swathi's site

Take the reference's structure and polish as the bar; leave its look (dark, red glow, cinematic) behind. Swathi's job is the step between a design file and a working site, so the site should show that step.

### Direction (pick one before I build)

- **A. "Frame to live" (recommended).** Light grey ground, ink-black type, and one signal colour: the blue of a selected frame in a design tool. The hero headline sits inside a selected frame with corner handles and a live width-by-height label that changes as the window resizes. Every project shows its design and its live build in one box with a drag slider between them. Small mono labels (breakpoints, spacing, "Shopify" / "Static") are the decoration, like a developer hand-off. Type: Schibsted Grotesk for text, IBM Plex Mono for the labels (free, self-hosted).
- **B. "Workbench".** Dark graphite ground with warm white type. Work is shown inside real phone frames that scroll the live site, because her sites are mostly opened on phones. Code-style labels (Liquid section names, file names) as texture. Same fonts.

### Sections

1. **Header**: her name, "Work", "Contact". On phones: name plus a 44 px menu button that opens a full-width sheet.
2. **Hero**: one line on what she does (from the brief: designs turned into Shopify stores and static websites), lorem ipsum supporting line, "See the work" and "Contact" buttons.
3. **Selected work**: four placeholder project cards. Each: title, type tag (Shopify or Static), year, her role, a Design/Live comparison (two labelled image boxes), "View live site" link. Each card can later open a short case-study page made from the same file.
4. **What I build**: Shopify stores, static websites, and one slot marked "to confirm". Descriptions in lorem ipsum until she writes them.
5. **How a project runs**: four steps (design file, build, phone check, launch), text in lorem ipsum.
6. **About**: photo box, lorem ipsum paragraph, tools list with placeholders.
7. **Contact**: real ways to reach her, no fake form: WhatsApp (pre-filled message), email, and placeholder social links. A working form can be added later with a free form service if she wants one.
8. **Footer**: name, year, placeholder links.

Left out on purpose: stats, testimonials, client logos and prices. None exist yet, and the brief says not to invent them. Empty templates for them can be added once she has real ones.

### Stack and hosting

- **Astro (static output) + plain CSS + about 3 KB of plain JavaScript** (menu, comparison slider, scroll reveals). No Tailwind, no WebGL, no preloader.
- Why Astro: the output is plain HTML that loads fast on any phone; it turns photos into small WebP/AVIF files automatically (the reference's 7.7 MB photo problem can't happen); one project file makes both the card and its case-study page.
- Motion: CSS-first, short (200 to 300 ms), only where it explains something (frame handles drawing in, the slider, gentle reveals). All of it switches off for people who turn on "reduce motion".
- Budget: under 100 KB before images; first screen in under 2 s on 4G.
- Hosting: a GitHub repo plus Netlify or Cloudflare Pages free tier (both allow a freelancer's commercial site; Vercel's free tier is for non-commercial use), or GitHub Pages, which the agency already uses. Custom domain later. Nothing gets published or pushed without asking.
- Toolchain: the portable Node 22 in `data\tools` (the laptop's own Node 9 is too old).

### How real work and copy get swapped in later

- `src/data/site.json`: name, one-liner, WhatsApp number, email, social links.
- `src/content/work/<project>.md`: one file per project (title, type, year, role, live link, image names, a short write-up). Copy a file to add a project; delete one to remove it.
- `src/assets/work/<project>/`: drop in `design.png` and `live.png` (any size; Astro resizes them).
- Every placeholder is visibly marked: lorem ipsum text, image boxes labelled with the size to supply, and placeholder links with a dashed outline. `README.md` lists every field to replace.

### Where it lives

A new folder next to the repo: `C:\Users\aj\Downloads\swathi-portfolio`, with its own git history (local only until you say to push). Not inside `extractor/`, `mocks/` or the previews repo.

### How it gets checked

Phone first at 360, 390 and 414 px, then 768, 1280 and 1440 px: no sideways scroll, 44 px tap targets, readable text, working menu and slider. Then the repo's unslop scanner and an independent design review before I show you screenshots.
