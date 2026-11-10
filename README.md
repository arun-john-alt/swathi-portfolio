# Swathi's portfolio

A small, fast portfolio site for Swathi, who turns designs into Shopify stores and static websites.

The idea ("Frame to live"): the page looks like a design tool's canvas. Each section is a white artboard with its name above it, the headline is drawn as a selected layer, and every project shows its design file and its live site in one box with a handle to drag between them.

Right now everything is **placeholder content**: lorem ipsum text, striped image boxes and dashed "to add" links. Nothing on the site is a real client, number or quote yet.

## Run it on this laptop

The laptop's own Node is too old, so use the portable Node 22 that sits in the Client Extractor folder. In PowerShell:

```powershell
$env:PATH = "C:\Users\aj\Downloads\Clients extractor\data\tools\node-v22.23.4-win-x64;" + $env:PATH
cd C:\Users\aj\Downloads\swathi-portfolio
npm install        # first time only
npm run dev        # opens on http://localhost:4321 and refreshes as you edit
npm run build      # makes the finished site in dist/
```

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
| Instagram, LinkedIn, Behance | `site.json` → `contact.links` | Paste each full link (`https://…`). Delete a line to remove it, or copy a line to add another. |
| Her photo | `src/assets/about/` | Drop **one** photo in this folder (jpg, png or webp, portrait, about 1200 × 1500 or larger). It is used automatically and shrunk for phones. |

**Rule of thumb:** an empty value (`""`) or text in `[square brackets]` shows as a dashed placeholder. Fill it in and the dashes disappear.

### Projects

Each project is one folder in `src/content/work/`, for example `src/content/work/project-one/`. The folder name becomes the page address (`/work/project-one/`), so rename it to something like `kanmani-sarees`.

Inside each folder:

- `index.md`: the details at the top between the `---` lines, and the case-study write-up below them.
- `design.png`: a screenshot of the design file (Figma etc.).
- `live.png`: a screenshot of the finished live site at the same size and position, so the slider lines up.

Then edit the top of `index.md`:

```yaml
title: Kanmani Sarees          # project name
order: 1                       # position on the page (1 = first)
type: Shopify store            # or "Static website"
year: "2026"
role: Design to Shopify build  # what she did
summary: One or two sentences for the card.
live: "https://example.com"    # the live site; leave "" to show a placeholder
design: ./design.png           # remove the # at the start of these two lines
liveShot: ./live.png           #   once the images are in the folder
placeholder: false             # false removes the "Placeholder" tag
```

- **Add a project:** copy a whole folder, rename it, change `order`.
- **Remove a project:** delete its folder.
- **Screenshots:** any size works, the site makes small copies for phones. 1600 × 1000 (or larger, same shape) suits the box best. Use the same size for `design.png` and `live.png`.

## Before it goes live

1. Replace every placeholder (search the site for "to add", "lorem", "Placeholder" and `[`).
2. In `src/data/site.json` set `"draft": false`. While it is `true`, every page asks search engines not to list it.
3. In `astro.config.mjs` set `site:` to the real address. This also turns on the link-preview picture that WhatsApp and Instagram show when someone shares the link (`public/og.png`, 1200 × 630; replace it to change the picture). The home-screen icon is `public/apple-touch-icon.png`.
4. Run `npm run build` and check `dist/` on a phone first.

## Hosting (suggested, nothing is set up yet)

The finished site is plain files in `dist/`, so any static host works. Free options that allow a freelancer's site: Netlify or Cloudflare Pages connected to a GitHub repository, or GitHub Pages. A custom domain can be added later. Nothing has been published or pushed.

## How it's built

- [Astro](https://astro.build) 7, static output. No frameworks on the page; about 3 KB of JavaScript for the menu, the sliders, the hero's live measurements and gentle scroll reveals.
- Plain CSS with a few variables at the top of `src/styles/global.css` (colours, fonts, spacing).
- Fonts are self-hosted from npm: Schibsted Grotesk (text) and IBM Plex Mono (labels).
- Works without JavaScript and with "reduce motion" turned on.
- Checked at 360, 390, 414, 768, 1280 and 1440 px wide: no sideways scrolling, tap targets at least 44 px.

## Files at a glance

```
src/data/site.json          all the words and contact details
src/content/work/<project>/ one folder per project (index.md + design.png + live.png)
src/assets/about/           her photo
src/components/             the sections (Hero, Work, Services, Process, About, Contact)
src/styles/global.css       colours, fonts, shared styles
src/scripts/site.ts         the small bit of JavaScript
public/favicon.svg          the browser-tab icon
```
