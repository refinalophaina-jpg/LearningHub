# BCPS release-readiness continuation — 2026-10-19

Status: **Draft; full release-readiness objective is not complete. Not deployed.**

## Context recovered

Read the Claude desktop conversation “BCPS project refresh” through computer use. Its cloud repo is `refinalophaina-jpg/LearningHub`, not the local Pharmacy simulator workspace. Started from `1f9c61e` on `claude/bcps-project-refresh-4i68ym`; main was `f08da8f`. The cloud scratchpad, reviewer bundles, and failed reviewer outputs were not available in the repository. No message was sent to Claude and no auto-continue preference was changed.

The owner's requested outcome is public pharmacist usability, content accuracy against the licensed 2024 review with other primary sources as appropriate, removal of paid mock material, clear edition attribution, polished UI, and a verified release. Claude's assertion that history purging had begun is not evidence it completed: the downloaded repository still tracked both PDFs.

## Implemented in this draft

- Replaced all 73 `ACCP Pharmacotherapy Mock Exam` items in the regular bank (indices 376–448) with newly authored original drafts, preserving the 449-item count. These cover the 22 curriculum topic groups, include explanations for every option, and carry explicit draft provenance. They are foundational replacements, not a claim of equivalent difficulty or psychometric performance to the retired bank.
- Corrected 24 existing items through targeted review, including invalid zoledronic-acid renal use, ambiguous P2Y12 selection, paliperidone oral-overlap misinformation, contraceptive classifications, a wrong unit in emergency contraception, ondansetron warning history, fungal susceptibility, CMV drug mechanism, renal valganciclovir treatment dosing, NNT explanation, CRRT math, stroke reversal, COPD escalation, and the DEA notification/Form 106 distinction. Exact zero-based indices are in `2026-10-19-targeted-corrections.json`.
- Normalized numbered Volume 2 references to the actual 1–12 PDF chapter map. Corrected volume attribution that called the ACCP books “ASHP.” Free-form citations still need manual verification; a normalized label alone is not a content review.
- Added a Sources & review-status destination under More, linked from an edition notice and footer. Clarified 2024 foundation, dated later corrections, independence, source access, and remaining review scope. Removed the speculative exam-window claims. Added a skip link and removed duplicate viewport metadata.
- Replaced “Not ready / Borderline / Likely ready” predictions with practice-result language. Historical practice scores remain historical, not validated board-readiness estimates.
- Versioned quiz SRS/confidence stores. Migrate only unchanged item records; preserve the legacy stores. Progress-code v4 includes the new stores, timed history, and exam date, and retains v3 import support.
- Moved the licensed PDFs into ignored `.private/sources/` for local review. They are removed from the tracked tree in this draft. This does **not** purge remote Git history, cached objects, earlier deployments, or forks.

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

## Verification completed

- `npm run build`: succeeds, all 8 banks bundled.
- `npm test`: six tests pass: all 449 item shapes/keys, replacement provenance/rationales, targeted corrections, revision migration and preservation, backup contents, source destination and PDF exclusion.
- `node --check` for app.js, study-features.js, podcasts.js, slides.js: passes.
- `git diff --check`: passes.
- Local in-app-browser inspection: Sources reachable, More remains active, edition notice visible, phone light/dark readable. Timed 50-item practice starts with a countdown; answer selection, flag, and Next work. Source screen did not show horizontal overflow at the inspected phone width.
- **Submission verification incomplete:** browser-control protocol stalled at the native confirmation after submitting with unanswered questions. Do not claim a verified submitted score from this run. Do not bypass the computer-use tool with a second automation technology to finish that interaction.

## Work still required before a public release claim

1. Verify all 73 draft replacements against specific source passages/primary references, including single-best-answer validity, educational depth, and balance. They intentionally do not reproduce the paid mock cases.
2. Complete the chapter-by-chapter accuracy/provenance audit across 449 quiz items, 206 flashcards, 80 drug entries, 101 evidence summaries, 543 terms, 22 chapter sections, 6 exam drills, visual diagrams, and linked media. Prior July reviews explicitly left manual findings; they are evidence to revisit, not blanket sign-off. There are still 139 quiz items without four option rationales.
3. Verify the remaining free-form chapter references, reconcile later practice changes across every dependent surface, and attach precise sources. See the generated inventory.
4. Recheck original slide/audio provenance. Claude reported owner-derived NotebookLM material, but that is not an independent content/provenance audit.
5. Finish browser submission/results, backup import round-trip, keyboard focus, desktop/phone/tablet, light/dark, and console checks after final content changes.
6. Prepare a backed-up Git-history rewrite removing both raw PDF paths and the retired official mock bank from every relevant remote branch/tag. Verify exact remote tips and the owner's destructive-action authorization before any force-push. Avoid restoring paid files from old refs. Coordinate Claude auto-resume before modifying its branch.
7. Merge/release only after the actual review closes. Build the data bundle, deploy only `app/`, verify canonical live bytes and behavior, and record the deployment and rollback source.

No force-push, merge, deployment, or public-ready claim was performed in this continuation.
