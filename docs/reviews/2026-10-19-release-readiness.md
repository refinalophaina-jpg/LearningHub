# BCPS technical release — October 19, 2026

Status: **Technical implementation verified. Published as an educational draft; comprehensive clinical/provenance review remains open.** Deployment details are recorded separately once verified.

## Recovered context and scope

Resumed the Claude desktop conversation “BCPS project refresh” for `refinalophaina-jpg/LearningHub`. The cloud scratchpad and failed reviewer outputs were unavailable. The local Pharmacy simulator is a different project and its source was not changed. No message was sent to Claude. The owner approved disabling Claude’s auto-continue; the unchecked state was verified.

The owner subsequently approved publication, UI refinements, simple file backups, and a separate timed practice simulation guided by curriculum objectives. An earlier push rejection was resolved by that explicit publication approval; it was not bypassed.

## Earlier content corrections retained

- Replaced 73 mock-derived general quiz items with separately authored original drafts, preserving 449 total items. Complete option rationales and draft provenance are included. These are not claimed to match the licensed bank’s difficulty.
- Corrected 24 targeted existing items. Exact zero-based indices are in `2026-10-19-targeted-corrections.json`; these include renal dosing, reproductive safety, incorrect units, drug mechanisms, study calculations, and regulatory reporting distinctions.
- Normalized numbered Volume 2 references to the PDF’s 1–12 chapter map and corrected erroneous ASHP attribution. Free-form citations still require verification.
- Added Sources & review status, 2024 foundation and dated update notices, independent-study attribution, and removed unsupported board-passing predictions.
- Migrated only unchanged quiz SRS/confidence records into revision-aware stores. Legacy stores are preserved, and revised missed-question records do not inherit a previous question’s meaning.

## Source checks

Accessed October 19, 2026. The 2024 PDF bookmark structure was read locally; extracted text stays ignored under `.private/review/`. No raw source text is committed.

- [ACCP 2024 official course description](https://www.accp.com/report/index.aspx?art=3483)
- [FDA Reclast label](https://www.accessdata.fda.gov/drugsatfda_docs/label/2026/021817s032lbl.pdf): osteoporosis CrCl contraindication.
- [Valcyte label](https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=4c517a39-2ded-4c5a-8d56-276853414b31&version=24): adult renal treatment dosing.
- [Invega Sustenna label](https://www.janssenlabels.com/package-insert/product-monograph/prescribing-information/INVEGA%2BSUSTENNA-pi.pdf): initiation without routine oral supplementation.
- [CDC US MEC 2024 appendices](https://www.cdc.gov/mmwr/volumes/73/rr/rr7304a1_appendix.htm): method-specific drug interactions.
- [FDA clozapine REMS removal](https://www.fda.gov/drugs/drug-safety-communications/fda-removes-risk-evaluation-and-mitigation-strategy-rems-program-antipsychotic-drug-clozapine): June 13, 2025 administrative change; monitoring remains relevant.
- [FDA ondansetron label, 2012](https://www.accessdata.fda.gov/drugsatfda_docs/label/2012/020007s043lbl.pdf): 32 mg single-IV-dose removal.
- [FDA Accelerated Approval](https://www.fda.gov/drugs/nda-and-bla-approvals/accelerated-approval-program): distinguish reasonably likely from established surrogates.
- [ESO IV thrombolysis guideline, 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC7995316/): distinguish thrombectomy from reversal to enable thrombolysis.
- [IDSA candidiasis guideline, 2016](https://www.idsociety.org/practice-guideline/candidiasis/): initial therapy and susceptibility categories.
- [American Thyroid Association](https://www.thyroid.org/hyperthyroidism-in-pregnancy/): first-trimester antithyroid drug considerations.
- [DEA theft/loss reporting](https://www.deadiversion.usdoj.gov/faq/civil-unrest.html): one-business-day initial notification and electronic Form 106 within 45 days; state obligations are separate.
- [FDA recall definitions](https://www.fda.gov/safety/industry-guidance-recalls/recalls-background-and-definitions): Class I hazard classification.
- [Hartford nomogram research](https://journals.asm.org/doi/10.1128/aac.00148-19): specified dose and 6–14-hour concentration, rather than invented graph boundaries.
- [CDC outbreak summary](https://archive.cdc.gov/www_cdc_gov/hai/outbreaks/meningitis.html): 64 deaths, correcting 303.
- [BPS content outlines](https://bpsweb.org/examination-content-outlines/) and [candidate guide](https://bpsweb.org/candidates-guide/): current official exam information is the destination, not this hub's predictions.

## Final technical continuation

The owner explicitly approved publication after the earlier rejected push, requested Impeccable UI refinements, asked for a simple nontechnical progress-backup method, and approved developing a dedicated timed simulation guided by the 150-item bank’s objectives. Claude auto-continue remains off.

- Added `mock_exam.json`: 150 independently authored cases, four option rationales each, draft provenance and curriculum/source references. Forty-two cases received an additional detail/distractor pass. Correct answer positions were shuffled rather than retaining the authoring-order cycle. This is a mix of foundational and applied questions, not a validated high-difficulty bank or an ACCP reproduction.
- Primary blueprint: 54 patient-care, 54 therapeutics/patient-management, 42 professional-practice cases (36% / 36% / 28%). Fine-grained subdomain quotas and difficulty equivalence remain unvalidated.
- Full simulation: 150 questions, 225 minutes, 25 simulated unscored items chosen before the attempt, forward-only confirmed answers, no feedback before submission, one optional ten-minute break that consumes exam time. The scored split is 45 / 45 / 35 across the three domains. Flexible practice selects 50 cases for 75 minutes with navigation and flags. Both retain the last result and active session across refresh.
- Verified the format against the [current BPS Candidate’s Guide](https://bpsweb.org/candidates-guide/) and the [Pharmacotherapy ECO linked from the current outlines page](https://bpsweb.org/wp-content/uploads/BCPS-Examination-Specifications-Fall-2024.pdf) on October 19, 2026. The simulated unscored selection is an app design choice, not BPS calibration.
- Added Save backup / Restore backup file actions, a dated confirmation, pre-write validation, rollback on storage failure, and Undo restore. Progress codes remain inside a secondary disclosure. Active mock session, result, history, spaced review, custom cards, and exam date are portable. Timers retain their original start timestamp after restore.
- Refined phone navigation to five primary tabs; moved four secondary destinations into More on phones. Preserved the warm bone/terracotta identity, centered wide layouts, improved compact header spacing, keyboard chapter controls, closed-search accessibility, focus behavior, minimum functional text sizes, and reduced-motion handling.
- Impeccable’s prescribed mechanical detector ran once. It reported 1,013 findings, predominantly inherited static/inline style and token drift. This was not a clean audit; the new pure helper files had no reported findings. No automatic detector hook was enabled.

### Final technical verification

- Build: all nine source banks bundle successfully.
- Tests: 21 pass, including simulation distribution/scoring, timer continuity, malformed saved sessions, backup atomicity, quota rollback, Unicode file round-trip, exact Undo, revision migration, and existing content structure/corrections.
- JavaScript syntax checks and `git diff --check`: pass.
- Actual browser flow: 150-question full simulation started at 3:45:00; selecting an answer enabled confirmation; continuing advanced without a back control; the optional break and timer survived refresh; returning consumed the one break; inline end confirmation submitted successfully. One correct scored item produced 1/125, with all 150 available for review and 25 marked simulated unscored only after submission.
- File backup: actual download and file-chooser restore were verified, including dated confirmation, successful restore notice, and Undo restore. No technical code copying is required in the primary path.
- Desktop and phone layout checked in light/dark; 1280px desktop showed no document overflow. Browser warning/error log was empty in the final checked session. Proof images: `mock-mobile.png` and `mock-desktop.png`.

### Remaining content limits

The full clinical/provenance review remains open. The inventory records 73 revised general-bank drafts, 150 mock drafts, 139 older general-bank questions without four option rationales, and 93 free-form references requiring review. Structural tests do not validate clinical accuracy. Linked media and every other learning surface have not received comprehensive sign-off. The product displays this status and offers no official passing-score prediction.


## Git history cleanup and publication

A complete verified local Git bundle was saved under ignored `.private/backups/before-publish-20261019.bundle`. A separate bare mirror was rewritten, leaving the working checkout and backup intact during verification. The rewrite removed both licensed PDF paths, `assets/data/accp.json`, and identified copied/mock-derived records from historical quiz JSON arrays. A scan of reachable historical JSON/JS/HTML found zero long copied-question fragment matches. This is a targeted check, not a complete copyright audit.

The cleaned release tree was byte-for-byte identical to the tested tree (Git tree `a2d3363fc4ba43f0d584e40c857c76c135d936cd`). Exact remote tips were checked immediately before publication. An atomic push used explicit leases for main and the Claude branch and created the new Codex branch; it succeeded. No newer remote work was overwritten. Cleaned tips at publication: main `b81aa47`, Claude branch `f2ff7e8`, release branch `146a97f`.

Old commit IDs changed. Existing clones must fetch the cleaned branches carefully rather than push old history back. GitHub caches, inaccessible refs, third-party clones/forks, previously downloaded files, and old deployed versions are outside this reachability rewrite; no purge of those copies is claimed. Private licensed review copies remain on the owner’s machine and are not deployed.

## Verified deployment

PR [#1](https://github.com/refinalophaina-jpg/LearningHub/pull/1) merged at `542e167` on October 19, 2026. A README-only conflict was resolved before merge; no application source changed during that reconciliation. Explicit-config Wrangler dry run succeeded, then 17 app assets were read and 10 changed assets uploaded. The deployed version is `5d5e6c2d-ed67-48cc-aed4-8cd03928374e` at [bcps.ainadara.com](https://bcps.ainadara.com/).

The canonical browser visibly showed the new simulation and file-backup controls and recorded no warning/error messages during the checked session. Direct urllib byte comparison received HTTP 403, so byte-for-byte live HTTP equivalence is not claimed. The browser was left on Mock Exam without starting or overwriting a public-origin study session. `mock-live.png` records the published interface. Prior deployment details and the caution about restoring retired material are in `2026-10-19-deployment.json`.
