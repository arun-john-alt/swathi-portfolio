# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Business owners in Tamil Nadu (shops, clothing and jewellery labels, clinics, stays and activity businesses) who receive Swathi's link, usually in an Instagram DM or WhatsApp, and open it on an Android phone. They are deciding whether to hire her to build their website. Most already sell or take enquiries through Instagram and WhatsApp.

## Product Purpose

A portfolio that wins Swathi freelance web projects. It shows that she can take a finished design and build it into a working site, and makes it easy to contact her. Success: a business owner who opens the link understands what she builds, sees real live work, and messages her.

## Positioning

Swathi is a solo freelancer. Clients deal with her directly. She turns finished designs into working sites: Shopify stores for brands that sell online, WordPress (Elementor) pages, and hand-built static websites. Her claim is the build itself: sites that look the way they were designed and work on the phone, where her clients' customers are.

## Operating Context

- Visitors arrive from a DM or WhatsApp link, on a phone, often on mobile data. The first screen decides whether they keep scrolling.
- The site is the evidence: it is itself a built site, so its own quality is part of the pitch.
- Contact today is Instagram (@swathi_krithvi). WhatsApp number and email are not on the site yet.
- Hosted on GitHub Pages at https://arun-john-alt.github.io/swathi-portfolio/ from the repo arun-john-alt/swathi-portfolio; content lives in `src/data/site.json`, `src/data/reel.json` and `src/content/work/`.

## Capabilities and Constraints

- Astro 7 static site, plain CSS, a few KB of plain JavaScript; no client framework.
- Phones first: works at 360 px, 44 px tap targets, nothing that scrolls sideways; must work without JavaScript and with reduced motion.
- Built with the portable Node 22 on the owner's laptop; deployed by a GitHub Action on push to `main`.
- Undecided: custom domain; WhatsApp number and email; whether case-study write-ups will be added.

## Brand Commitments

- Name: Swathi. Logo: lowercase "swathi" in Schibsted Grotesk 800 with the i's dot drawn as a blue (#0a72d6) square; "s" mark for small sizes. Files in `brand/`.
- Voice: plain, first person, short sentences; no hype. Copy lives in `src/data/site.json`.

## Evidence on Hand

- Five live projects with desktop and phone screenshots (`src/content/work/<slug>/`): Kattam (Shopify, temple and kundan jewellery), Tunic Closet (Shopify, women's ethnic wear), Vastara the Label (Shopify, organic cotton clothing), 10X Healthy Skin (WordPress landing page, skin and hair clinic in Coimbatore), Rave Adventures (WordPress, surf, scuba, kayak and sailing on five coasts).
- A 29-second reel of 29 phone-first concept sites (`public/reel/`), labelled as concept sites, not clients.
- Her photo (`src/assets/about/swathi.jpg`) and Instagram @swathi_krithvi.
- No testimonials, client counts, years of experience, prices or results. Do not invent any.

## Product Principles

1. Show the work before talking about it: real live sites first, claims second.
2. The site must prove the skill it sells: fast, exact and flawless on a phone.
3. One clear next step for a business owner: message Swathi.
4. Plain words a shop owner understands; no design jargon.
5. Nothing fabricated: no invented clients, numbers or quotes.

## Accessibility & Inclusion

WCAG AA contrast; respects reduced motion and data saver; usable with JavaScript off; readable on low-end Android phones.
