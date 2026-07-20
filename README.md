# LearningHub

A static BCPS (Board Certified Pharmacotherapy Specialist) study site built with [Eleventy](https://www.11ty.dev/). Review modules with high-yield notes and interactive practice quizzes; best scores are saved per browser via localStorage — no accounts, no backend.

## Local development

```bash
npm install
npm start        # serve at http://localhost:8080 with live reload
npm run build    # output static site to _site/
```

## Structure

- `src/index.njk` — home page with module grid and progress badges
- `src/modules/*.njk` — one page per study module (notes + quiz questions in a `window.LH_QUIZ` script block)
- `src/_includes/base.njk`, `module.njk` — layouts
- `assets/js/quiz.js` — quiz rendering, grading, localStorage progress
- `assets/js/progress.js` — home-page progress badges
- `.github/workflows/gh-pages.yml` — builds Eleventy and deploys `_site/` to GitHub Pages on push to `main`

## Sharing with a study partner

Progress is stored in each visitor's own browser, so two (or more) people can use the same URL without interfering with each other. Note: GitHub Pages sites are public — don't publish copyrighted question banks or private data here.

## Content notes

All study content is original material written for this site; it does not reproduce ACCP/BPS copyrighted exam content. Verify doses and clinical recommendations against current guidelines before relying on them.
