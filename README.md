# Swathi's portfolio

A small, fast portfolio site for Swathi, who turns designs into Shopify stores and static websites.

**Live:** https://arun-john-alt.github.io/swathi-portfolio/ (GitHub Pages; every push to `main` rebuilds it).

The idea ("Frame to live"): the page looks like a design tool's canvas. Each section is a white artboard with its name above it, and the headline is drawn as a selected layer. Beside it, a phone screen plays a quick reel of the concept sites made in the Client Extractor workflow. Her live projects are shown on a desktop screen and a phone.

**The words** were written on 11 Nov 2026 from what her projects show (no invented clients, numbers or quotes). Swathi should read them once and change anything she wouldn't say that way; they all live in `src/data/site.json`. Her WhatsApp number and email aren't in yet, so those contact rows stay hidden until they are. While `"draft": true` is set in `site.json`, the site asks search engines not to list it.

## Design versions (to choose from)

Three versions of the home page live side by side, with the same five projects:

| Version | Address | Idea |
|---|---|---|
| Frame to live (current) | `/` | a design tool's canvas; the headline drawn as a selected layer; the concept-site reel |
| Silk | `/v/silk/` | a Kanjivaram silk on a silk-house counter; projects unfold like sarees |
| Glass | `/v/glass/` | one steel-framed glass wall; each project is a pane, the cobalt pane is the way to message her |

`/versions/` lists them with links. Silk and Glass were made with the impeccable design process: `PRODUCT.md` holds the product facts, and `.impeccable/surfaces/` holds each version's direction. Their code is in `src/versions/silk/` and `src/versions/glass/`, with their pages in `src/pages/v/`. The version pages are always hidden from search engines.

Once one is chosen, it becomes the home page (its page moves to `src/pages/index.astro`), the other two are removed, and a `DESIGN.md` describing the chosen design is written.

## Run it on this laptop

The laptop's own Node is too old, so use the portable Node 22 that sits in the Client Extractor folder. In PowerShell:

```powershell
$env:PATH = "C:\Users\aj\Downloads\Clients extractor\data\tools\node-v22.23.4-win-x64;" + $env:PATH
cd C:\Users\aj\Downloads\swathi-portfolio
npm install        # first time only
npm run dev        # opens on http://localhost:4321/swathi-portfolio/ and refreshes as you edit
npm run build      # makes the finished site in dist/
```

## Publishing a change

Commit and push to `main`. The GitHub Action in `.github/workflows/deploy.yml` builds the site and publishes it to GitHub Pages in about two minutes. Watch it under the repository's **Actions** tab.

## Replacing the placeholders

Most of the words live in **one file: `src/data/site.json`**. Open it in any text editor.

| What | Where | How |
|---|---|---|
| Name, eyebrow line, headline, intro | `src/data/site.json` (`name`, `eyebrow`, `headline`, `intro`) | Replace the text. |
| Page title and Google description | `site.json` → `seo` | Replace the text. |
| Services | `site.json` → `services` | Each has `name`, `summary`, `items`. The third one is a slot marked `[Third service, to confirm]`: fill it in or delete that block. |
| Process steps | `site.json` → `process` | Rename or rewrite the four steps; add or remove steps freely. |
| About text and tools | `site.json` → `about` | Tools in `[square brackets]` show as dashed "tool to add" slots. Replace them with real tool names or delete them. |
| WhatsApp | `site.json` → `contact.whatsapp` | The number with country code, e.g. `+91 98xxx xxxxx`. The button then opens WhatsApp with the `whatsappMessage` already typed. |
| Email | `site.json` → `contact.email` | The address. |
| Instagram and other links | `site.json` → `contact.links` | Paste each full link (`https://…`). Copy a line to add LinkedIn, Behance and so on. |
| Her photo | `src/assets/about/swathi.jpg` | Replace the file (keep one photo in the folder: portrait, 1000 px wide or more). It is shrunk for phones automatically. |

**Rule of thumb:** an empty value (`""`) or text in `[square brackets]` shows as a dashed placeholder. Fill it in and the dashes disappear.

## Projects

Each project is one folder in `src/content/work/`, for example `src/content/work/kattam/`. Inside:

- `index.md`: the details at the top, between the `---` lines.
- `desktop.jpg` and `phone.jpg`: screenshots of the live site at 1440 × 900 and 390 × 844 (a phone screenshot at 2× is ideal). The card shows the desktop screen with the phone in front of it.

```yaml
title: Kattam                  # project name
order: 1                       # position on the page (1 = first)
type: Shopify store            # what it is: "Shopify store", "WordPress landing page", ...
summary: One sentence for the card.
live: "https://www.kattam.in/" # the live site
desktop: ./desktop.jpg
phone: ./phone.jpg
# year: "2026"                 # optional
# role: Design to Shopify build # optional
```

- **Add a project:** copy a folder, rename it, swap the screenshots, change `order`.
- **Remove a project:** delete its folder.
- **Case study page (optional):** write a few paragraphs below the closing `---` in `index.md`. The project then gets its own page at `/work/<folder>/` and a "Case study" link on its card. Without text there is no page, just the link to the live site.
- **Design next to live (optional):** add `design.png` (a screenshot of the design file) and `live.png` (the live site at the same size), with `design: ./design.png` and `liveShot: ./live.png` in `index.md`. The card then shows a slider to drag between the two.

The screenshots for the first five projects were taken on 11 Nov 2026 with "Someone in … purchased" pop-ups hidden, since those show real customers' names.

## Logo

`brand/` holds Swathi's logo: lowercase **swathi** in Schibsted Grotesk (the site's typeface, weight 800, tight spacing), with the dot of the i drawn as a blue square, the same corner handle that marks the selected headline on the site. The letters are real vector shapes, so the files work anywhere without the font.

| File | Use |
|---|---|
| `logo.svg`, `logo-2000.png` | dark logo for light backgrounds |
| `logo-white.svg`, `logo-white-2000.png` | white logo for dark backgrounds or photos |
| `mark.svg`, `mark-512.png` | the short version: "s" and the blue square on a dark tile (favicon, small spaces) |
| `profile-picture-1080.png` | square version for an Instagram or WhatsApp profile picture |

Colours: ink `#141414`, blue `#0a72d6`. The site uses `public/logo.svg` in the header, `public/favicon.svg` for the browser tab and `public/apple-touch-icon.png` for the phone home screen.

## The hero reel

`public/reel/` holds the reel: `concepts.webm` (main, about 2 MB), `concepts.mp4` (fallback for older iPhones) and `poster.jpg` (its first frame). It shows 29 concept sites from https://arun-john-alt.github.io/previews/ for one second each, recorded by really scrolling each site in a phone-sized browser. The words around it (label, caption, count) are in `src/data/reel.json`.

It plays only while on screen, has a pause button, and does not start for people who have "reduce motion" or data saver turned on. To remake it after new mocks: record the sites the same way (390 × 700 phone screen, 24 fps, one second each), encode VP9 for the webm and H.264 for the mp4, and update `count` in `reel.json`.

## Before it is shared widely

1. Swathi reads the words once (see above) and adds her WhatsApp number and email if she wants them on the site.
2. In `src/data/site.json` set `"draft": false`, so search engines may list it.
3. With a custom domain later: set `site:` in `astro.config.mjs` to it and delete the `base:` line.

The link preview that WhatsApp and Instagram show is `public/og.png` (1200 × 630). The home-screen icon is `public/apple-touch-icon.png`.

## How it's built

- [Astro](https://astro.build) 7, static output, hosted on GitHub Pages under `/swathi-portfolio/` (`base` in `astro.config.mjs`; internal links go through `src/lib/url.ts`).
- No frameworks on the page; a few KB of JavaScript for the menu, the reel, the hero's live measurement, the sliders and gentle scroll reveals.
- Plain CSS with a few variables at the top of `src/styles/global.css` (colours, fonts, spacing).
- Fonts are self-hosted from npm: Schibsted Grotesk (text) and IBM Plex Mono (labels).
- Works without JavaScript and with "reduce motion" turned on.
- Checked at 360, 390, 414, 768, 1280 and 1440 px wide: no sideways scrolling, tap targets at least 44 px.

## Files at a glance

```
src/data/site.json          all the words and contact details
src/data/reel.json          the reel's label, caption and count
src/content/work/<project>/ one folder per project (index.md + desktop.jpg + phone.jpg)
src/assets/about/           her photo
src/components/             the sections (Hero, Work, Services, Process, About, Contact)
src/styles/global.css       colours, fonts, shared styles
src/scripts/site.ts         the small bit of JavaScript
public/reel/                the hero reel video and its poster
brand/                      the logo files (SVG and PNG)
public/og.png               the link-preview picture
.github/workflows/deploy.yml  builds and publishes to GitHub Pages
```
