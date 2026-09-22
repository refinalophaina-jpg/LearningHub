# LearningHub

The BCPS Learning Hub — a study app for the BPS Pharmacotherapy (BCPS) exam. It
lives at [bcps.ainadara.com](https://bcps.ainadara.com): a static site with no
accounts and no backend. Progress and best scores are kept in each visitor's own
browser (`localStorage`), so several people can share the URL without colliding.

## How it is built

Content lives in JSON banks under `assets/data/`, and a build step bundles them
into a single `app/data.js` as `window` globals the app reads synchronously — the
site itself ships no fetch calls for content.

- `assets/data/*.json` — the nine content banks: `quiz`, `flash`, `accp`,
  `concept`, `drug_db`, `glo_terms`, `evidencedata`, `_studychapters`, `epdrills`.
  **Edit these**, not the generated bundle.
- `scripts/build-data.js` — reads the banks, drops any array holes, writes
  `app/data.js` (marked generated; do not edit by hand).
- `app/` — the deployed site. `app.js` is the study engine; `slides.js` /
  `slides-data.js` and `podcasts.js` / `podcasts-data.js` add the slide decks and
  podcast list; `study-features.js` carries the study tools. `app.css` is the
  house-styled stylesheet; `app/_headers` sets `Cache-Control: no-cache` so every
  in-place redeploy is live at once rather than serving stale, un-hashed assets.

## Local development

```bash
npm run build    # regenerate app/data.js from assets/data/*.json
npm start        # build, then serve app/ locally via scripts/serve.js
```

## Deployment

Deployed as Cloudflare Worker static assets — `wrangler.toml` points `[assets]`
at `./app` and binds the custom domain `bcps.ainadara.com`; there is no Worker
script, the site is purely static. Run the build first, then `wrangler deploy`.

## Content notes

The study material is original, written for this site; it does not reproduce
ACCP/BPS copyrighted exam content. The BCPS prep PDFs in the repo root are
reference volumes. Verify doses and clinical recommendations against current
guidelines before relying on them.
