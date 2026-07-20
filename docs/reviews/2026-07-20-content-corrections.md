# Content corrections — verified review pass 1

`updated: 2026-07-20` · source: independent-reviewer workflow (each change confirmed by a second adversarial PharmD/BCPS reviewer)

> Partial pass: 345 of ~1,297 items in quiz/flash/accp/glossary were reviewed before the run hit the account session limit. The remaining items and the drug/trial verification still need a resumed pass. This log covers only the changes applied so far.

| # | Item | Field | Severity | Change | Basis |
|---|---|---|---|---|---|
| 347 | quiz | correct | critical | key 3 → key 0 | FDA Eliquis (apixaban) PI — reduce to 2.5 mg BID for AF only if ≥2 of: age ≥80, weight ≤60 kg, SCr ≥1.5 mg/dL. |
| 354 | quiz | correct | critical | key 2 → key 0 | FDA clozapine PI ANC monitoring table (2015–present; REMS removed Feb 2025, thresholds retained). |
| 354 | quiz | exp | critical | "Per the FDA Clozapine REMS Program: ANC …" → "Per current FDA clozapine ANC monitoring…" | FDA clozapine prescribing information, ANC monitoring. |
| 352 | quiz | q | major | "A 58-year-old woman with CKD Stage 4 (eG…" → "A 58-year-old woman with CKD Stage 4 (eG…" | Kerendia (finerenone) PI — do not initiate at eGFR <25 or K+ >5.0. |
| 350 | quiz | q | minor | "GOLD Group D" → "GOLD Group E" | GOLD 2023 report. |
| 350 | quiz | exp | minor | "GOLD Group D patients" → "GOLD Group E patients" | GOLD 2023 report. |
| 350 | quiz | exp | minor | "GINA 2023 supports this dual approach." → "GOLD 2023/2024 supports this dual approa…" | GOLD 2023/2024. |
| 353 | quiz | opts[1] | minor | "Ebstein risk with lithium is ~1.5-3x bas…" → "absolute Ebstein risk with lithium remai…" | Patorno et al. NEJM 2017; teratogen data. |

## Detail

### quiz #347 · correct
- **Why:** Only 1 of 3 apixaban dose-reduction criteria met (SCr≥1.5 only); CrCl is not a trigger for AF. Correct answer is A (no change). Option D and the old key both miscount to "2 of 3". The explanation already concludes answer A.
- **From:** 3
- **To:** 0
- **Basis:** FDA Eliquis (apixaban) PI — reduce to 2.5 mg BID for AF only if ≥2 of: age ≥80, weight ≤60 kg, SCr ≥1.5 mg/dL.

### quiz #354 · correct
- **Why:** ANC 1,000–1,499 = mild neutropenia → continue clozapine (option A). Keyed C reflects pre-2015 "<1,500 = hold" thresholds.
- **From:** 2
- **To:** 0
- **Basis:** FDA clozapine PI ANC monitoring table (2015–present; REMS removed Feb 2025, thresholds retained).

### quiz #354 · exp
- **Why:** Rewrote explanation to current FDA thresholds (mild/moderate/severe).
- **From:** Per the FDA Clozapine REMS Program: ANC 1,000-1,499 (severe neutropenia) = interrupt clozapine, increase monitoring frequency (daily ANC), recheck every day until ANC ≥1,500, then monitor twice weekly for 4 weeks before resuming weekly. This patient's ANC is 1,200 → severe neutropenia threshold → interrupt. Permanent discontinuation is required only if ANC falls below 500 (agranulocytosis). Dose reduction is not a guideline-endorsed strategy.
- **To:** Per current FDA clozapine ANC monitoring: ANC 1,000–1,499 = MILD neutropenia → CONTINUE clozapine and monitor ANC 3× weekly until ≥1,500. Interrupt only at ANC 500–999 (moderate; daily ANC until ≥1,000) and discontinue/do not rechallenge at <500 (severe/agranulocytosis). This patient’s ANC 1,200 is mild → continue (option A). Note: the FDA removed the Clozapine REMS in Feb 2025, but these ANC thresholds remain in the prescribing information.
- **Basis:** FDA clozapine prescribing information, ANC monitoring.

### quiz #352 · q
- **Why:** STEM REWRITE (flag for human sign-off): raised eGFR 22→28 and K+ 5.0→4.8 so finerenone is label-eligible (eGFR ≥25, K+ ≤5.0) and the keyed "both B and C" answer holds.
- **From:** A 58-year-old woman with CKD Stage 4 (eGFR 22) and type 2 diabetes has albumin-to-creatinine ratio 1,800 mg/g on maximal ACE inhibitor therapy (lisinopril 40mg/day, K+ 5.0 mEq/L). She is not on an MRA. Blood pressure is 138/88 despite 3 antihypertensives. Which new agent most strongly reduces CKD progression?
- **To:** A 58-year-old woman with CKD Stage 4 (eGFR 28) and type 2 diabetes has albumin-to-creatinine ratio 1,800 mg/g on maximal ACE inhibitor therapy (lisinopril 40mg/day, K+ 4.8 mEq/L). She is not on an MRA. Blood pressure is 138/88 despite 3 antihypertensives. Which new agent most strongly reduces CKD progression?
- **Basis:** Kerendia (finerenone) PI — do not initiate at eGFR <25 or K+ >5.0.

### quiz #350 · q
- **Why:** GOLD 2023 replaced ABCD with ABE; this exacerbation-prone patient is Group E.
- **From:** GOLD Group D
- **To:** GOLD Group E
- **Basis:** GOLD 2023 report.

### quiz #350 · exp
- **Why:** Consistency with stem (GOLD ABE).
- **From:** GOLD Group D patients
- **To:** GOLD Group E patients
- **Basis:** GOLD 2023 report.

### quiz #350 · exp
- **Why:** GINA is the asthma initiative; COPD triple/roflumilast guidance comes from GOLD.
- **From:** GINA 2023 supports this dual approach.
- **To:** GOLD 2023/2024 supports this dual approach.
- **Basis:** GOLD 2023/2024.

### quiz #353 · opts[1]
- **Why:** Aligns option B with the explanation’s absolute-risk figures.
- **From:** Ebstein risk with lithium is ~1.5-3x baseline but still <1%
- **To:** absolute Ebstein risk with lithium remains low (~1-2 per 1,000 vs ~1 per 20,000 baseline), still <1%
- **Basis:** Patorno et al. NEJM 2017; teratogen data.

