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

Extracted text, retired paid question-bank JSON, and review scratchpads belong in ignored `.private/`. The 2024 ACCP course PDFs are **not** hosted or committed: the book’s copyright page prohibits electronic reproduction or transmission without ACCP’s written permission, and none is on file. They were removed from the site, the tree, and all Git history on October 20, 2026; `*.pdf` is gitignored. Do not re-add them unless ACCP grants written permission. The retired paid mock is not part of the app; the 73 replacement quiz items remain explicitly marked as original drafts until reviewed.

## Practice and progress

Mock Exam offers a separate 150-case original educational draft. Full simulation is 225 minutes, forward-only, with 25 simulated unscored items and one optional ten-minute break that uses exam time. Flexible practice draws 50 cases for 75 minutes and permits flags/navigation. Sessions resume by wall-clock time after refresh. All explanations appear after submission. The primary domain mix is 36% / 36% / 28%; fine-grained subdomain equivalence and item difficulty are not validated.

Choose **Save backup** to download a file. On another device, choose **Restore backup**, select that file, and confirm. **Undo restore** recovers the prior local progress. Codes remain available under “Use a progress code instead.” Backups include flashcards, general progress, revision-aware quiz review, confidence, mock history, active session, last result, and exam date. Legacy v3 codes remain importable; revised questions do not inherit old mastery records.

All 150 mock items and all 600 option explanations received an AI-assisted evidence/editorial pass on October 19, 2026. Cases now test more explicit patient constraints, calculations and competing management choices; 106 guideline, label, methods and safety sources are traced in the item review ledger. Independent pharmacist sign-off and learner-based difficulty/discrimination calibration remain pending. Professional practice now has 19 quality-of-care, 11 evidence-based-practice and 12 practice-management items; other fine-grained subdomain proportions remain unvalidated. No passing-score prediction is provided.

The mock v2 uses separate session/result keys; v1 records remain intact in backups and are never regraded against changed choices.

## Deployment

The canonical site is [bcps.ainadara.com](https://bcps.ainadara.com). Cloudflare Worker static assets serve only `app/`; `wrangler.toml` binds that custom domain. Build first, then deploy with this repository’s explicit config (`wrangler deploy --config ./wrangler.toml`). The `app/_headers` file requests fresh validation for un-hashed assets. No private review files are part of the deployment.
