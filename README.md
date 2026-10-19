# BCPS Learning Hub

Independent AinaDara pharmacotherapy study hub. Static HTML/CSS/JavaScript, local browser progress, no account or backend. The curriculum starts from 2024 review topics; some later corrections are dated separately.

**Release review is in progress.** See [the continuation record](docs/reviews/2026-10-19-release-readiness.md) for implemented changes, source checks, verification, and remaining work. This is educational material, not a clinically validated reference or official ACCP/BPS product.

## Local use

```sh
npm run build  # generate app/data.js from assets/data/*.json
npm start      # build, then serve app/ on port 8080
npm test       # content/revision/backup regression checks
node scripts/audit-content.js  # inventory and outstanding review triage
```

Set `PORT` to choose another preview port. No package installation is needed for these Node standard-library commands.

## Editing and release

Edit source banks in `assets/data/`, then regenerate `app/data.js`; do not hand-edit the generated bundle. `app/` is the only static deployment directory. Review `PRODUCT.md`, `DESIGN.md`, and the latest release record before changing the interface.

Licensed source PDFs, extracted text, and review scratchpads belong in ignored `.private/`. Never publish them or copy them into `app/`. Their removal from the current tree does not remove copies from Git history. The retired paid mock is not part of the app; the 73 replacement quiz items remain explicitly marked as original drafts until reviewed.

Progress Code v4 includes flashcards, general progress, revision-aware quiz review, confidence, mock history, and exam date. Older codes remain importable; changed question meanings do not inherit old mastery records.
