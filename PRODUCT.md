# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: the owner (AinaDara) and a small circle of study partners preparing for the BCPS (Board Certified Pharmacotherapy Specialist) exam. They are practicing pharmacists studying around work — the dominant scene is short sessions on a phone (commutes, breaks, stolen moments), with longer desk sessions on a laptop for chapter reading and timed mock exams. Both scenes are first-class; the phone scene must never be the degraded one.

Requested audience: practicing pharmacists and BCPS candidates. Public release readiness is under review; see docs/reviews/2026-10-19-release-readiness.md.

## Product Purpose

A self-contained BCPS exam-prep hub: study chapters, a 449-item quiz engine (including 73 original draft replacements) with spaced repetition and confidence tracking, 206 SM-2 flashcards with cloze drills, timed practice from the general quiz bank, a drug reference database, landmark-trial/evidence library, glossary (543 terms incl. biostatistics), exam-psychology coaching, visual pharmacology diagrams, podcasts, and slide decks. Success means two things, in order: the people using it pass the BCPS exam, and the site represents AinaDara.com's craft well enough to stand as a portfolio piece.

## Positioning

One coherent, beautifully built place covering the whole BCPS study loop (learn → drill → space → mock → review weaknesses) with no accounts, no server, and no cost — progress lives on-device with a simple downloadable backup file. Neighboring products are either question banks or note piles; this is both, under one brand, tuned by someone actually sitting the exam.

## Operating Context

- Static single-page app: `app/index.html` + `app/app.css` + `app/app.js` + `app/study-features.js` + generated `app/data.js`.
- Content is authored in `assets/data/*.json`; `node scripts/build-data.js` regenerates `app/data.js` (gitignored — rebuild after fresh checkout and before deploy).
- Deployed to https://bcps.ainadara.com via Cloudflare Workers static assets (`wrangler deploy`; `wrangler.toml` at repo root).
- All progress is localStorage (quiz history, SRS queue, streaks, mock history) plus Save backup / Restore backup files (codes remain an optional fallback). No auth, no backend, no analytics.
- Headless verification harness lives in gitignored `.audit-src/` (Playwright against a local static server).

## Capabilities and Constraints

- **Retired paid mock JSON remains excluded.** The dedicated 150-item ACCP mock bank was removed in 1f9c61e. Another 73 mock-derived quiz items have now been replaced with original drafts. A separately authored 150-case educational draft powers the new simulation; it does not distribute the licensed bank. Full content/provenance review remains open.
- **ACCP course PDFs are never hosted, bundled, or committed.** The 2024 book’s copyright page prohibits electronic reproduction or transmission without ACCP’s written permission, and none is on file. On October 20, 2026 the owner, after checking ACCP’s terms, directed their removal: the on-site reader and both volumes were taken off the site and purged from all Git history. A release test fails if any PDF ships in `app/`. Revisit only with written ACCP permission. “Updates in Therapeutics®” is ACCP’s registered trademark; use it only to identify the course the notes follow, alongside the not-affiliated notice.
- No server-side anything: features must work as static files (this is why sync/login was removed — do not reintroduce).
- Progress must survive via localStorage + the downloadable backup file (codes remain available); never make durable progress depend on a third-party service.
- Light and dark mode are both supported and both must stay readable; dark-mode regressions have been a recurring bug class.
- Canvas-drawn pharmacology diagrams are fixed-height bitmaps; CSS must not scale them (distortion).
- Terminology follows BCPS/ACCP conventions (Areas 1–3 exam domains, chapter names mirror ACCP Updates in Therapeutics).

## Brand Commitments

- AinaDara house identity, confirmed binding: warm bone-paper background (#faf5ed family), ink (#2d3428), terracotta accent family (#cc785c decorative; #a85a38 as accessible ink for small text/buttons in light mode), purple #4a3d7a and moss #4a5c28 as supporting hues.
- Type: DM Serif Display for display/headings, Outfit for body.
- AinaDara brand mark (aperture/compass SVG) in header and favicon; "BCPS Learning Hub by AinaDara" naming.
- Voice: calm, direct, encouraging-without-cheerleading; sentence-case UI labels; no emoji in UI chrome (drawn SVG icons only).
- Design system is iOS-inflected (bottom tab bar, cards, chips) wearing the AinaDara warm palette.

## Evidence on Hand

- 449 quiz questions, 206 flashcards, 543 glossary terms, 101 trial/evidence summaries, 70+ drug monographs, 22 study chapters, 22 slide-deck PDFs, podcast audio — all real content in `assets/data/` and `app/`.
- No testimonials, user counts, or outcome claims exist; do not fabricate any.

## Product Principles

1. **The core loop outranks everything.** Quiz, cards, study, and mock get first-class placement; reference material lives one tap deeper (the "More" hub). New features must not re-clutter the main bar.
2. **Respect the stolen moment.** Any screen should be useful within seconds on a phone: fast load, obvious next action, state preserved on return.
3. **Evidence-based UI, literally.** WCAG contrast (4.5:1 small text, 11px functional-text floor), redundancy removal, progressive disclosure, calm motion with reduced-motion support — accessibility findings are fixed, not debated.
4. **One brand, everywhere.** Every surface reads as AinaDara: warm palette, serif display voice, drawn icons. Portfolio-grade finish is a stated success criterion, not a nice-to-have.
5. **Original work only.** The hub is public. Everything it ships must be original study material or properly attributed facts; no ACCP text, questions, figures, or files.

## Accessibility & Inclusion

No user-specific needs declared. Standing requirement from the owner: dark-mode readability and WCAG-level contrast throughout; `prefers-reduced-motion` honored.

## Edition and release status

2024 topic foundation, with some later corrections explicitly dated. Do not describe the hub as comprehensively current or clinically validated. The Sources destination and release-readiness record expose the actual review scope. Raw licensed PDFs and extracted review text belong only in ignored `.private/`; never include them in a release.
