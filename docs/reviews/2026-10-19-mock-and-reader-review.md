# Mock review and integrated books — October 19, 2026

> **Superseded October 20, 2026 (book reader and PDFs only).** The owner checked ACCP’s terms and directed removal of both PDF volumes and the reader. The mock-exam findings below still stand. See `2026-10-20-accp-material-removal.md`.

All 150 original mock items were reviewed and revised in edition `2026-10-19-mock-v2`. This is an AI-assisted evidence and editorial review, not independent pharmacist approval or psychometric validation. The machine-readable ledger covers every ID, an evidence anchor, linked source keys, intended cognitive task, editorial difficulty classification and a hash of the final item. All 600 option explanations are aligned with the shuffled choices.

## Clinical and editorial changes

- Added explicit patient factors that distinguish the best answer: renal function, contraindications, organ function, infection site, timing, exposure and hemodynamic stability.
- Replaced weak/generic alternatives with more relevant competing regimens, calculations or interpretations; reduced answer-length cues. Correct positions are balanced 38/38/37/37 with noncyclic ordering.
- Examples of substantive refinements: shock in febrile neutropenia now warrants empiric cefepime plus vancomycin among the choices; paliperidone initiation now tests mild renal impairment; MRA initiation distinguishes potassium from eGFR eligibility; warfarin intracranial bleeding tests PCC plus IV vitamin K; tumor-lysis prophylaxis explicitly addresses G6PD deficiency.
- Updated relevant source framing for 2025 cUTI guidance, 2026 sepsis guidance, 2026 GOLD/GINA/ADA, and 2025 clozapine REMS removal. Older published guidance is identified by date rather than represented as a new publication. The 2027 KDIGO public-review draft was not treated as final guidance.
- Self-contained PK/calculation cases state assumptions. Calculations were recomputed, including renal dosing distinctions, dose caps, infusion rates, oral bioavailability, time to steady state, ARR/RRR/NNT/NNH, predictive value, ICER and denominator-based error rates.
- Professional practice was rebalanced to 19 quality-of-care, 11 evidence-based-practice and 12 practice-management cases, approximating the current BPS subdomain percentages when rounded to 42 items. Total domains stay 54/54/42.

The intended challenge is a judgment based on case reasoning and distractor plausibility. Learner pilots, difficulty/discrimination statistics, independent clinician adjudication and full fine-grained blueprint validation remain necessary before making an exam-equivalence or passing-score claim. The rest of the app's clinical banks are outside this review.

## Edition safety

V2 uses `bcps_mock_session_20261019_v2` and `bcps_mock_result_v2`. V1 active attempts/results are left untouched, included in backups, and identified as earlier-edition data. They are not resumed or scored against revised answers. History remains dated/versioned.

## Authorized PDF publication

The user supplied both books and explicitly answered “Public downloads—I have redistribution permission” in this chat. This supersedes the project's prior PDF-exclusion rule for those two files. Each deployed PDF exactly matches the supplied file; page counts, SHA-256 hashes and the authorization record are in `2026-10-19-pdf-publication.json`. No private scratch text, retired question-bank JSON, backups, or credentials are deployed.

The built-in reader uses locally vendored Mozilla PDF.js 6.4.299. Features: original document rendering, selectable text, chapter jumps, page jump/previous/next, zoom, three highlight colors, comments on highlights, page notes, removal with Undo, and automatic page/scroll/zoom restoration per volume. Notes and normalized rectangles save to `bcps_pdf_study_v1` and are included in ordinary backup/restore/Undo restore. Invalid file fingerprints, pages or geometry are rejected before restoration. Original downloads are explicitly distinguished from separate saved annotations.

## Verification

- 31 Node tests: content/ledger/key alignment, clinical regression cases, independently recomputed calculations, session-edition isolation, PDF geometry validation, two-volume data preservation, file fingerprints, portable backup and exact Undo.
- Build regenerated all nine content banks. New JS passed syntax checks.
- Browser: rendered both full books, jumped to Anticoagulation, selected real PDF text and saved a highlight, edited its comment, changed page/zoom, reloaded and confirmed restoration, added a page note, removed/undid it with latest text retained, and switched volumes without losing prior state.
- Real downloaded backup (2,931 bytes) was parsed and restored through the production helper into isolated storage: Volume 1 page 148, zoom 150%, both saved annotations/comments; Volume 2 page 1. No real user's production-origin progress was used in testing. The browser download-event tool stalled despite its explicit timeout; no further download-event waits were used.
- Phone 390×844 dark mode and desktop light/dark reviewed; compact controls avoid page-wide overflow. Notes/reader chrome inherit semantic theme colors; PDF paper retains original colors.

Deployment verification is recorded separately after publication.

Published via merged PR #4, source commit `126010ff473be3fcf101ddeb96603781cf66a3ed`, Worker version `3cb120df-6362-4cd5-b2da-32958339753d`. Both books render on the canonical site with no checked warnings/errors. The live mock chooser exposes the review limits and earlier-edition result without starting a new public-origin attempt.
