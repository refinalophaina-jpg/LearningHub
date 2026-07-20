<!-- Synthesized from 10 web-sourced learning-science reviews, 2026-07-20. Raw per-dimension data in .audit-src/results/exam-science.json -->

# BCPS Study Hub — Prioritized, Evidence-Graded Implementation Spec

Scope note: static SPA, localStorage only, no accounts. Every item below is buildable client-side. The single unifying architectural move is **extend the existing SM-2 engine and the export/import progress code to carry per-question state and confidence**, because ~70% of the highest-value recommendations across all ten dimensions collapse onto that one capability.

---

## 1. TOP RECOMMENDATIONS (ranked, duplicates merged)

**R1 — Spaced, mastery-based Missed-Question queue (successive relearning).** *Enhance.*
Route every missed/flagged/low-confidence quiz item into the existing SM-2 scheduler at expanding intervals (~2-3d → 7d → 16d). An item only earns "Learned" after **two correct answers in separate spaced sessions**, not one; block re-testing before due date so a next-day redo can't fake mastery. Dashboard tile: "N questions due today · M near graduation."
*Evidence: STRONG (Rawson & Dunlosky 2022 successive relearning ≈ +1 letter grade on real exams; Dunlosky 2013 — testing + spacing are the only two "high-utility" techniques; MedBoardTutors second-pass +8-12 vs +3-5 NBME pts when spaced 7-21d).* **Priority: high · Effort: med.**
*Why #1: highest leverage — roughly doubles the app's spaced-retrieval surface using content and an engine that already exist, and targets the exact behavior that predicts passing.*

**R2 — Confidence capture → calibration + hypercorrection routing (one capture, six payoffs).** *New.*
After an MCQ is selected but **before** the answer/explanation unlocks, one tap: Guess / Fairly sure / Certain (keys 1-3). Store `{qId, topic, chosen, correct, confidence, ts}`. This one field powers: (a) a **calibration report** ("When you said Certain you were right 71%"), (b) a **"Confidently wrong" deck** surfaced with surprise framing and pinned to the front of R1's queue, (c) **overconfidence badges** on weak-but-trusted topics ("keep reviewing"), (d) priority sort of the review queue, (e) postdiction accuracy, (f) confidence-weighted mock scoring.
*Evidence: STRONG (Butterfield & Metcalfe 2001 hypercorrection; Metcalfe 2017; Dunlosky & Rawson 2012 — overconfidence causes premature stopping; calibration-instruction meta g≈0.57). Overconfidence is a documented, distinct failure predictor, worst in the weakest candidates.* **Priority: high · Effort: med (capture is low; full report med).**

**R3 — Exam-date anchor: countdown + interval capping + backward study plan.** *New.*
One-time "Set exam date." Persistent "N days to exam" header badge. Scheduler caps every interval at `min(interval, daysToExam)` so **nothing is ever scheduled past the test**; final 5-7 days force a guaranteed last pass of every card, lowest-predicted-recall first. Backward-plan the 22 chapters into dated daily targets (see §5).
*Evidence: STRONG (Cepeda 2008 ridgeline — gaps must compress toward the test; Gollwitzer & Sheeran if-then d≈0.65; Buehler planning-fallacy / task-unpacking).* **Priority: high · Effort: med-high.**

**R4 — Interleave-by-default sequencer + confusable-cluster drills.** *Enhance.*
Replace fixed JSON iteration with a round-robin that never places two same-topic items consecutively (bucket by topic, pop from largest non-matching bucket; secondarily spread `domain` and `diff`). Make "Mixed (recommended)" the default for multi-topic sessions. Add ~10-15 hand-tagged **confusable clusters** (P2Y12 inhibitors; DOAC/warfarin/heparin-HIT; vanco vs aminoglycoside PK; ARR/RRR/NNT vs HR; ITT vs per-protocol; LASA pairs) that interleave **within** a related set and show a one-line "why not the neighbor" contrast.
*Evidence: STRONG (Brunmair & Richter 2019 g≈0.42, benefit concentrated in confusable/related items; Sana & Yan 2022 interleaved quizzing d≈0.35; Rohrer 2020 d≈0.83). Cheapest high-value change — no shuffle exists anywhere in the codebase today.* **Priority: high · Effort: low.**

**R5 — True exam-condition mock + performance-anchored readiness meter.** *Enhance.*
Run the 150-item ACCP mock as one uninterrupted 3h45m countdown, feedback withheld to submission, flag-for-review navigator grid, hard auto-submit, then a full report: raw %, scaled-score estimate vs the 500/~73% heuristic (labeled an estimate, **not** an official cut), per-BPS-domain breakdown, time-per-item, all explanations, misses piped into R1. **Repeatable**; plot every attempt over time. A dashboard **readiness band** (Not ready <60 / Borderline 60-69 / Likely ready ≥70) computes **only from TIMED work** and stays grayed until ≥~150 timed items answered.
*Evidence: STRONG (NBME self-assessments r≈0.70-0.92, MAE ~7-10 pts near exam; untimed/tutor mode inflates 7-12 pts → false green light; Rowland testing effect g≈0.50).* **Priority: high · Effort: med.**

**R6 — "Due Today" queue + "Next best action" on the dashboard.** *Enhance.*
A tile beside the streak with the due count and one "Start today's reviews" button launching an **interleaved** session of exactly the due items. Above it, a single prioritized directive: "Review 14 due cards" / "12 questions in Nephrology (weakest)" / "You haven't touched trials in 9 days."
*Evidence: STRONG (spacing only works if the user returns daily; dashboards improve outcomes only when they lower inference cost and name the next action).* **Priority: high · Effort: low-med.**

**R7 — Recall-first / generation modes.** *Enhance + New.*
Flashcards get a "Type it" mode (type the drug/dose/MOA → reveal → self-grade) and cloze cards; quiz gets a "Cover options" toggle (commit before choices appear); mechanism diagrams get **"Label the blank"** reusing the image-occlusion code (misses feed R1).
*Evidence: STRONG (Rowland 2014 free recall g≈.79 / cued .70 vs recognition .32; Bertsch generation effect d≈0.40). Current flashcards are reveal-only and quiz is recognition-only — the largest passive surface in the app.* **Priority: high · Effort: med.**

**R8 — Four-button recall grade (Again / Hard / Good / Easy, keys 1-4).** *Enhance.*
Unified graded self-report for flashcards; "Again" re-queues within session. Enables both a better SM-2 and future FSRS.
*Evidence: MODERATE-STRONG (graded recall materially improves interval accuracy over binary). Keyboard-driven, keeps fast flow.* **Priority: high · Effort: low.**

**R9 — Per-distractor elaborated feedback + task-focused framing + error tagging.** *Enhance + New.*
Add optional `whyWrong` per option; on a miss show "Why B is wrong" above the existing why-correct rationale (fallback to current text). Reframe the miss state by **concept to fix** ("Fix: warfarin–amiodarone interaction"), not by failure, and keep score/streak visually separate from the explanation. One-tap error taxonomy: Didn't know / Misread / Knew-but-misapplied / Careless, aggregated on the dashboard.
*Evidence: STRONG (Shute 2008 elaborated feedback ≈0.49 vs 0.05 bare, rising to ≈0.59 on higher-order items = the BCPS item type; Kluger & DeNisi — ~⅓ of feedback interventions HURT when attention shifts to self).* **Priority: high/med · Effort: med.**

**R10 — Blueprint coverage-&-accuracy matrix + bank-coverage meter + volume headline.** *New + Enhance.*
Table of the official BPS Pharmacotherapy domains weighted **55% patient-specific / 25% drug-info-EBM / 20% systems** showing % seen, TIMED accuracy, and blueprint weight, with the weakest high-weight domain badged "Study next." Add "seen X/449 unique (Y%)" with 80%/100% markers, and make **lifetime unique-question volume** (not just streak) the dashboard headline metric.
*Evidence: STRONG (NAPLEX content-area scores explain 32-44% of variance → domain diagnostics beat a global %; Deng 2015 — ~445 questions per Step point, dose-responsive, independent of aptitude). Reweight current ~32/31/20 tags toward the real 55/25/20.* **Priority: high/med · Effort: low-med.**

**R11 — One-click weak-area targeting.** *Enhance.*
"Target my weak spots" builds a session from the 3-5 lowest-accuracy topics (weight by 1−accuracy, discounted by attempt count so one miss doesn't dominate), refreshing as accuracy rises; add Wrong / Marked / Low-confidence / by-Domain session filters.
*Evidence: MODERATE-STRONG (turns collected per-topic accuracy into the actionable next step; concentrates retrieval where error is highest).* **Priority: med · Effort: med.**

**R12 — Adopt FSRS via inlined ts-fsrs (UMD, no bundler) + desired-retention slider + load/retention panel.** *Enhance.*
Store `{stability, difficulty, last_review, due, state}`; seed from existing SM-2 ease/interval on first run (no progress lost); slider default 0.90 (0.85-0.95); a panel shows projected daily review count and lets users trade retention down to ~0.85 if the backlog is unmanageable (warn below 0.85).
*Evidence: STRONG on accuracy (700M-review benchmark: ~3× more accurate than SM-2, 20-30% fewer reviews) but MODERATE marginal value here — within a short fixed window, **capped SM-2 (R3) captures most of the benefit**, so this ranks below the deadline cap and due queue.* **Priority: med · Effort: med.**

**R13 — Adaptive "Smart Practice" targeting ~80-85% success (Elo).** *New.*
Per-topic learner ability θ in localStorage; map `diff` tags to item difficulty b (exam −0.5 / hard +0.4 / expert +1.2); Elo-update θ each answer; draw the next item to minimize |P(correct) − 0.83|. In-session control loop: 2-3 easy warm-ups, de-escalate if rolling accuracy <50%, step up if >90%. **Estimate only the learner, never re-estimate item difficulty from one user** (confounded with no backend).
*Evidence: MODERATE (Wilson 2019 ~85% optimum — theoretical analogy; Pyc & Rawson retrieval-effort; Pelánek Elo works client-side with small samples). Higher effort, so mid-rank.* **Priority: med · Effort: high.**

**R14 — Diagrams as a first-class "Visuals" surface, cross-linked from quiz.** *Enhance.*
Add a Visuals nav; from each quiz explanation / drug monograph, "See diagram: RAAS pathway" jumps to the zoom-opened canvas. Expand the set ~4-6 (DOAC reversal, ACS/antiplatelet algorithm, insulin curves, INR management, acid-base map).
*Evidence: STRONG (Mayer multimedia effect ~55-89% better transfer; dual coding). Engine + lightbox already exist — low cost, high yield.* **Priority: med · Effort: low.**

**R15 — Audio spaced-retrieval read-aloud queue (Web Speech API).** *New.*
A "Listen" button on **short** items (pearls, glossary, trial bottom-lines) and a hands-free queue that speaks the **prompt → silent gap for answering aloud → answer → advance**, then offers "Quiz what you just heard." Rate slider persisted; redundancy guardrail (dim/hide identical on-screen text during long passages).
*Evidence: MODERATE. Constraints are hard: transient-information effect (long spoken < read), passive-listening ceiling, learning-styles myth, ~13% AI-audio hallucination + not client-side-generable. Value only as short, retrieval-looped commute/eye-rest review.* **Priority: med/low · Effort: med.**

**R16 — If-then plan + forgiving streak + taper/sleep checklist.** *New + Enhance.*
One-time implementation-intention prompt ("I will do 20 questions at 8pm at my desk") echoed on the dashboard; streak gains a weekly grace day / freeze and "never miss twice" framing with a "days studied 5/7" ring; final-week checklist enforces taper + 7-9h sleep + one mock ~2-3 days out.
*Evidence: STRONG (Gollwitzer if-then d≈0.65; Lally habit — one miss is fine, two derail; Diekelmann & Born sleep consolidation, all-nighters impair next-day recall).* **Priority: med · Effort: low.**

---

## 2. QUICK WINS (high-evidence, low-effort — build first)

1. **Interleave-by-default no-repeat-topic sequencer** + one-time "Why is this mixed?" card + sticky default (R4). ~30 lines over existing tagged data; counters the metacognitive illusion that makes users revert.
2. **Four-button recall grade, keys 1-4** (R8).
3. **Exam-date input → countdown badge + interval cap** (R3 core).
4. **Confidence tap capture + "Confidently wrong" deck** (R2 minimum viable slice).
5. **Bank-coverage meter + lifetime unique-volume as dashboard headline** (R10).
6. **Diagrams cross-linked from quiz explanations + Visuals nav** (R14).
7. **If-then implementation-intention prompt** (R16).
8. **Forgiving streak: grace day + "never miss twice" copy** (R16).
9. **One-tap error-type tagging** (R9).
10. **Task-focused miss framing** (concept-to-fix copy, separate score panel — pure copy/CSS) (R9).
11. **"Next best action" dashboard line** (R6).
12. **Timed-only gating flag on any readiness signal** — prevents false green lights (R5).
13. **Persist all new state (per-question SR, confidence, exam date, θ) in the export/import code**, version-bumped with backward-compatible parsing — the only continuity mechanism with no accounts.

---

## 3. WHAT THE HUB ALREADY DOES WELL (keep / polish)

- **449-question quiz + explanations + review-missed** — practice testing is one of the two highest-utility techniques (Dunlosky 2013). Keep; extend review-missed from one-shot to R1's spaced queue.
- **SM-2 spaced flashcards + custom cards** — distributed practice, the other high-utility technique. This engine is the reuse chassis for R1, R7, R2-routing.
- **Image-occlusion flashcards** — proves cued-recall/generation UI is feasible; reuse for "Label the blank" diagrams (R7).
- **Canvas mechanism diagrams + zoom** — dual coding, the strongest multimodal lever (Mayer). Under-surfaced; promote (R14).
- **150-item ACCP mock** — full-length timed practice is the single best readiness predictor. Elevate to true exam conditions + repeatable trend (R5).
- **Per-topic accuracy stats** — the raw material for weak-area targeting and the blueprint matrix (R10, R11).
- **Session timer + exam-pace calculator + exam-psychology drills** — genuine exam-condition rehearsal; extend the pacing HUD into the live mock.
- **Streaks + progress dashboard** — sound habit scaffolding; make forgiving and self-referential (R16).
- **Keyboard shortcuts + dark mode** — fast-flow and accessibility; keep the 1-4 convention for grading/confidence.
- **No accounts / localStorage / single-user** — a genuine strength: it makes every documented social-comparison harm structurally impossible. Lean into self-referential design.
- **Export/import progress code** — the continuity backbone; widen it, don't replace it.

---

## 4. CAUTIONS (what the evidence says NOT to do)

- **No leaderboards, public ranking, or competitive point economies.** They demotivate lower performers, raise anxiety, and in one quasi-experiment *lowered* exam scores; salient extrinsic rewards risk overjustification for already-motivated BCPS candidates (Sailer & Homner; SDT). Any reward layer must be **mastery/progress-based, self-referential, and never punitive**.
- **Don't punish streak resets.** Long broken streaks trigger sunk-cost quitting (loss aversion). Use grace day / freeze and "never miss twice."
- **Don't ship Leitner boxes as the scheduling engine** — least accurate; cosmetic overlay at most (Karpicke & Roediger 2007).
- **Don't globally random-shuffle disparate domains.** Interleaving pays off only within **confusable, related** clusters; mixing unrelated content gives ~no benefit (Brunmair & Richter). And you must **default interleaving and explain it**, or ~90% of users who learn better will *feel* worse and switch it off.
- **Keep feedback task/concept-focused, not ego/score-focused** — ~⅓ of feedback interventions reduce performance when attention shifts to the self (Kluger & DeNisi).
- **Never mark an item "learned" after one correct answer**, and never let a next-day redo count as mastery — criterion must be met across *spaced* sessions.
- **Readiness must use TIMED data only, gated on minimum volume.** Untimed/tutor mode inflates % by 7-12 points → dangerous false confidence.
- **Never schedule a card past the exam date.**
- **Present readiness as a relative estimate, not a BCPS score.** Scoring is criterion-referenced modified-Angoff (scaled 200-800, pass 500); the "~73%" is a defensible heuristic only.
- **Audio guardrails:** keep segments short (transient-information effect — long spoken text is learned *worse* than read); never narrate identical visible text (redundancy principle); never brand it "for auditory learners" (styles is a myth); always loop back to on-screen retrieval; no client-side AI two-host audio (~13% hallucination, and not generable in a static SPA anyway).
- **Don't reward volume/showing-up over predictive behavior.** Make cumulative timed-question volume and calibration the headline metrics, not the streak alone.

---

## 5. PACING / STUDY-PLAN MODEL (backward from a fixed exam date)

**Inputs (one-time):** exam date; weekday vs weekend study hours; remaining unseen cards/questions (derived from coverage). Standard window: 3-6 months.

**The two governing equations**
- **Interval cap:** every card's next review = `min(scheduler_interval, daysToExam)`. Nothing survives past the test; hardest cards get a forced final pass.
- **New-material rate:** `newPerDay = remainingUnseen / (daysToExam − finalWeekBuffer)`, constrained so every item gets **≥2 spaced exposures** before exam day. Surface it concretely: *"Introduce ~35 new items/day to finish new material by [date] with room for 2 reviews each."* If the resulting daily due-count is unmanageable, the load/retention panel (R12) lets the user lower desired retention toward 0.85.

**Four phases (auto-generated onto a scrollable timeline, with a "Today's plan" card):**

1. **Foundation (front third).** First-pass learning of the 22 chapters via question-first pretests (attempt before reading, immediate feedback, not scored against accuracy). Generous early spacing gaps. Daily new-item target from the rate equation.
2. **Consolidation (middle).** Interleaved mixed-topic drilling by default; confusable-cluster drills; weak-area targeting; spaced review queue widening then beginning to tighten. First 1-2 timed mocks to calibrate. Gaps compress as the exam nears (ridgeline).
3. **Simulation (final ~2-3 weeks).** Full timed, blueprint-weighted (55/25/20) mocks every ~2-3 weeks moving to ~weekly; readiness meter live. **Green-light rule:** ≥80% bank coverage · ≥70% on ≥2 consecutive TIMED mocks · review queue near-empty · no high-weight domain chronically below target.
4. **Taper (final 5-7 days).** "Cram/Consolidation mode": guaranteed last pass of every card, lowest-predicted-recall first; light interleaved review only, **no new material**; one final mock ~2-3 days out (not the night before); sleep checklist (7-9h, no all-nighter — protects consolidation).

**Daily loop that ties it together:** Due-Today interleaved queue (spacing) → mixed/weak-area new questions (retrieval + interleaving) → misses auto-enroll in the spaced criterion queue (successive relearning) → confidently-wrong items jump the queue (hypercorrection) → dashboard shows days-left, today's target, on-track/behind, and the single next-best action. This converts the ridgeline math into one concrete daily number and structurally prevents last-week massing.
