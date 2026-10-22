# Reference fact-check and post-2024 change sweep — October 22, 2026

Supersedes the "Updated since 2024" wording in `2026-10-21-answer-key-verification.md`; notes now use the two markers described below.

## Basis
The site teaches the 2024 ACCP Updates in Therapeutics course book. When newer guidance differs, the book's answer stays primary and the newer guidance is added as a note. Safety-driven changes (withdrawals, new boxed warnings) may be the main teaching. Notes start with one of two markers, which `app/updates.js` renders as callouts:
- `Updated after the 2024 course:` (shown as **Newer guidance**) — a later guideline, approval, withdrawal, or schedule change.
- `Current FDA labeling differs:` (shown as **Label differs**) — current labeling disagrees with what the book teaches.

`tests/content-integrity.test.js` rejects the older note formats and checks every entry in `assets/data/updates.json`.

## 1. Blind fact-check of flashcards, glossary and drug monographs
1. **Blind pass.** Reviewers wrote the key facts for all 206 flashcards, 502 glossary terms and 75 drug monographs from the prompt only, without seeing the stored text.
2. **Adjudication.** A second pass compared stored and blind text and checked every disagreement against FDA labeling, guidelines and trials, editing surgically.
3. **Chapter consistency.** Every fix that cited a guideline published during or after 2024 was checked against the book; 19 were returned to the book's teaching with the newer guidance as a note.

Verdicts across 783 entries: fine 509, fixed_fact 193, fixed_inconsistency 14, fixed_dose 36, fixed_bbw 25, outdated_noted 6. Entries changed: 274 (flashcards 73, glossary 129, drugs 72).

### Returned to the 2024 course teaching

| Item | Reason |
|---|---|
| quiz Q349 | Chapter teaches the 3.3 mEq/L insulin-hold threshold with 20-30 mEq/h K; reverted from the 2024 consensus 3.5 threshold (K 3.2 keeps the same key). |
| quiz Q245 | Key unchanged; explanation/rationales taught the Sept 2024 DHHS changes (RAL and EVG/c removed, DTG/ABC/3TC demoted) that the chapter does not teach. |
| mock AD-MOCK-036 | Item tested the 2025 REMS elimination as the main teaching; chapter teaches mandatory REMS registration and ANC submission before dispensing (more restrictive, not dangerous), so reverted with a 2025 note. |
| quiz Q036 | Chapter teaches K <3.3 hold threshold, dextrose at <200, bicarbonate at pH <6.9; reverted from 2024 consensus values. |
| quiz Q041 | Key unchanged; explanation taught the ACG 2024 rule (clarithromycin triple only if susceptibility known) instead of the chapter's >15% resistance/prior macrolide rule. |
| quiz Q087 | Chapter lists DTG/ABC/3TC as a recommended initial regimen (HLA-B*5701 negative), so D was also correct; made D wrong by stating HLA-B*5701 positive and noted the Sept 2024 DHHS change. |
| quiz Q094 | Explanation taught the June 2024 ACIP routine RSV recommendation; chapter teaches shared clinical decision-making for adults 60+, so reworded stem and explanation (answer D unchanged). |
| flash F040 | Card taught the 2024 hyperglycemic-crises consensus values; chapter teaches the earlier ADA thresholds (K 3.3/5.3, dextrose <200, pH <6.9, resolution criteria with anion gap). |
| flash F044 | Chapter teaches a 2-year limit for teriparatide; card taught the label's removal of the cap, so restored the 2-year teaching and moved the label change to the note. |
| flash F053 | Card taught age 50 for pneumococcal vaccine and routine RSV at 75+/60-74 at risk; chapter teaches age 65 and RSV by shared clinical decision-making at 60+. |
| flash F061 | Card taught ACG 2024 (bismuth quadruple preferred, clarithromycin only with proven susceptibility); chapter teaches ACG 2017 options with clarithromycin triple first-line when resistance <=15%. |
| drugs amiodarone | Card taught label CXR every 3-6 months and half-life 40-55 days; chapter teaches CXR annually, eye exam if impairment/symptoms, half-life ~58 days. |
| drugs sotalol | Card made the newer label's extended AF intervals the main teaching; chapter teaches AF CrCl 40-60 q24h and CrCl <40 contraindicated. |
| drugs rivaroxaban | Card taught label 'avoid CrCl <15' for VTE; chapter teaches avoiding rivaroxaban for VTE when CrCl <=30. |
| drugs metronidazole | Item made ACG 2024 BQT-preferred, 14-day-only teaching; chapter (ACG 2017) offers clarithromycin triple or BQT 10-14 d. |
| drugs albuterol | Chapter thresholds are >1 canister/month (poor outcomes) and >2/month (fatal asthma); item had GINA thresholds. |
| glossary DKA Management | Item used 2024 consensus K+ <3.5 and dextrose at <250; chapter teaches K+ <3.3 and dextrose at <200. |
| glossary Acute Ischemic Stroke | Item presented tenecteplase as an equal alternative; chapter teaches alteplase as the only guideline-recommended agent. |
| glossary DKA (Diabetic Ketoacidosis) | Chapter teaches 2009-based thresholds (dextrose at <200, hold insulin if K+ <3.3, K+ added at 3.3-5.3, 0.1 u/kg bolus, resolution criteria); 2024 consensus values moved to the update note. |

### All fact-check corrections

| Item | Verdict | What changed | Sources |
|---|---|---|---|
| flash F002 | fixed_fact | Thrombolytic criterion mislabeled as '<120 min door-to-device' -> fibrinolysis if PCI not achievable within 120 min of FMC, door-to-needle <30 min | 2013 ACCF/AHA STEMI guideline |
| flash F003 | fixed_fact | Prasugrel age >=75 / wt <60 kg wrongly called contraindications -> 'generally not recommended' and 5 mg dose; ticagrelor dyspnea 10% -> ~14%; prasugrel added as preferred PCI option | Effient (prasugrel) PI; Brilinta (ticagrelor) PI; 2014 AHA/ACC NSTE-ACS guideline |
| flash F006 | fixed_fact | INR 5-10 'vitamin K 1-2.5 mg' (pre-2012 ACCP) -> INR 4.5-10 hold without routine vitamin K; added INR >10 oral vitamin K 2.5-5 mg | CHEST 2012 (Holbrook/Guyatt) antithrombotic guideline; 2020 ACC ECDP on bleeding with oral anticoagulants |
| flash F007 | fixed_inconsistency | Back never gave the intensity classification the front asks for -> added the three intensity tiers with LDL-C reductions and doses; indication line kept | 2018 AHA/ACC cholesterol guideline, Table 3 |
| flash F008 | fixed_fact | 'PFTs, TFTs, LFTs, CXR annually' -> TFTs/LFTs every 6 months, CXR annually, PFTs baseline | Amiodarone (Pacerone/Cordarone) PI; HRS 2007 amiodarone monitoring guideline (Goldschlager) |
| flash F009 | fixed_fact | Dopamine presented as an alternative first-line agent -> only in highly selected patients | Surviving Sepsis Campaign 2021; SOAP II (NEJM 2010) |
| flash F010 | fixed_fact | HFrEF defined as EF <40% -> EF <=40% | 2022 AHA/ACC/HFSA HF guideline |
| flash F011 | fixed_fact | DM line implied ACEi/ARB + SGLT2i are the required antihypertensives -> any first-line class; ACEi/ARB if albuminuria | 2017 ACC/AHA HTN guideline; ADA Standards of Care 2024, Sec 10 |
| flash F017 | fixed_fact | LMWH called 'preferred' for cancer VTE -> CHEST 2021 prefers oral Xa inhibitors (also fixes conflict with the VTE duration card) | CHEST 2021 VTE guideline update (Stevens); ASH 2021 cancer VTE guideline |
| flash F020 | fixed_fact | qSOFA described as a screening tool -> prognostic only; SSC 2021 recommends against it as a single screening tool | Surviving Sepsis Campaign 2021; Sepsis-3 (JAMA 2016) |
| flash F022 | fixed_fact | 'Severe CAP with septic shock' listed as standalone MRSA indication -> requires prior MRSA or recent hospitalization+IV abx within 90 days | ATS/IDSA 2019 CAP guideline |
| flash F024 | fixed_fact | Routine MAC prophylaxis at CD4 <50 -> not recommended when ART is started immediately | HHS/CDC/NIH/IDSA Adult OI Guidelines (MAC section, 2019+) |
| flash F027 | fixed_fact | 1-3 month regimen lacked vancomycin -> vancomycin + 3rd-gen cephalosporin (IDSA 1-23 months) +/- ampicillin | IDSA 2004 bacterial meningitis guideline (Tunkel) |
| flash F029 | fixed_inconsistency | Self-contradictory 'IBW if TBW < IBW (use TBW)' -> 'TBW if TBW < IBW' | Standard CG dosing-weight convention (Pharmacotherapy/ASHP) |
| flash F031 | fixed_fact | Obese dosing by AdjBW -> LD 20-25 mg/kg actual BW (max 3 g), maintenance <=4.5 g/day; MIC cutoff >2 -> >1; Bayesian can use a trough alone; 2-point sampling is the first-order alternative | 2020 ASHP/IDSA/PIDS/SIDP vancomycin consensus (Rybak) |
| flash F033 | fixed_fact | Amiodarone, grapefruit juice and all azoles grouped as strong inhibitors -> strong 3A4 list corrected; fluconazole/grapefruit moderate; amiodarone weak 3A4 | FDA Drug Development & Drug Interactions table of substrates, inhibitors and inducers |
| flash F035 | fixed_fact | Warfarin listed as a zero-order drug -> replaced with theophylline at high concentrations | Applied Pharmacokinetics (Winter's Basic Clinical PK) |
| flash F040 | fixed_fact | DKA steps used mixed 2009 values -> 2024 consensus: K 20-30 mEq/L once K <5.0; resolution BHB <0.6 + pH >=7.3 or HCO3 >=18 (not anion gap); bicarbonate if pH <7.0; dextrose added to saline at glucose <250 | ADA/EASD/JBDS/AACE/DTS Hyperglycemic Crises Consensus 2024 (Umpierrez, Diabetes Care/Diabetologia) |
| flash F042 | fixed_fact | Central hypothyroidism 'LOW TSH' only -> low or inappropriately normal TSH; monitor free T4 | ATA 2014 hypothyroidism guideline |
| flash F043 | fixed_dose | Major stress 50-100 mg q6-8h (up to 400 mg/day) -> 100 mg IV then 200 mg/24 h (50 mg q6h); moderate 25-50 mg -> 50 mg at induction then 25 mg q8h x24h, noting 2024 ESE/ES regimen | ESE/Endocrine Society 2024 glucocorticoid-induced adrenal insufficiency guideline (Beuschlein, JCEM), Table 8; Liu et al. Anesthesiology 2017 |
| flash F044 | fixed_bbw | Denosumab 'renally safe' lacked Jan 2024 BBW for severe hypocalcemia in advanced CKD -> added; teriparatide 2-year cap removed 2020 (abaloparatide keeps it) | Prolia PI boxed warning (Jan 2024); Forteo PI (Nov 2020); Tymlos PI |
| flash F050 | fixed_fact | Steps 3-6 followed NAEPP 2007 -> NAEPP 2020 (ICS-formoterol SMART preferred at steps 3-4; LAMA at step 5; biologics) | NAEPP 2020 Focused Updates to the Asthma Management Guidelines; GINA 2024 |
| flash F051 | fixed_fact | Pre-2023 GOLD initial therapy (B = single bronchodilator; A = PRN short-acting) -> GOLD 2023/2024: B = LABA+LAMA; A = a bronchodilator; ICS criteria corrected | GOLD 2024 Report |
| flash F052 | fixed_fact | 'Any 2 of 3' Anthonisen criteria -> all 3, or 2 including purulence, or need for ventilation | GOLD 2024 Report |
| flash F053 | outdated_noted | 2024 facts correct; appended the April 2025 ACIP RSV expansion to adults 50-59 at increased risk | ACIP June 2024 RSV recommendation (MMWR); ACIP Oct 2024 pneumococcal vote; ACIP April 16, 2025 meeting |
| flash F058 | fixed_fact | Old exclusions (glucose >400, 'major surgery <3 months', 3-4.5 h age >80/NIHSS >25/stroke+DM as absolute) -> AHA/ASA 2019 criteria | AHA/ASA 2019 Acute Ischemic Stroke guideline (Powers); Activase PI (2015 revision) |
| flash F061 | fixed_fact | Clarithromycin triple listed first-line by local resistance (ACG 2017) -> ACG 2024: bismuth quadruple preferred; clarithromycin triple only with proven susceptibility; added rifabutin/vonoprazan alternatives | ACG 2024 H. pylori guideline (Chey, Am J Gastroenterol) |
| flash F062 | fixed_fact | Crohn '5-ASA (some benefit)' -> mesalamine not effective/not recommended | ACG 2018 Crohn disease guideline (Lichtenstein); AGA 2021 Crohn guideline |
| flash F063 | fixed_fact | 'Dietary protein excess' as precipitant (implies restriction) -> protein restriction not recommended, 1.2-1.5 g/kg/day | AASLD/EASL 2014 hepatic encephalopathy guideline |
| flash F064 | fixed_fact | Beers 2023: SU avoidance extended to all sulfonylureas; antipsychotic entry limited to first-gen/EPS -> all antipsychotics in dementia/delirium (stroke, mortality) | AGS Beers Criteria 2023 |
| flash F065 | fixed_fact | Vitamin D 'reduces falls + fractures' -> USPSTF recommends against supplementation for fall prevention | USPSTF 2018 Falls Prevention (Grade D for vitamin D); USPSTF Dec 2024 draft vitamin D/calcium |
| flash F066 | fixed_fact | Confirmatory examples RIBA and HIV Western blot are obsolete -> HIV-1/2 differentiation immunoassay and HCV RNA | CDC 2014 HIV laboratory testing algorithm; CDC 2013 HCV testing guidance (RIBA discontinued) |
| flash F068 | fixed_fact | 'OR always overestimates RR' (false when RR <1) -> OR exaggerates RR, lying farther from 1 | Zhang & Yu, JAMA 1998; Pharmacotherapy biostatistics chapter |
| flash F071 | fixed_fact | Unsupported '15-30% ADE reduction' figure -> qualitative outcomes supported by meta-analysis | Mekonnen et al., BMJ Open 2016 meta-analysis; TJC NPSG.03.06.01 |
| flash F072 | outdated_noted | Card stated the 2025 REMS removal as the main fact -> 2024 REMS requirements restored, with the June 2025 elimination appended as the update sentence | FDA Drug Safety Communication: FDA removes clozapine REMS (2025); Clozapine PI (2024) |
| flash F074 | fixed_fact | Antidote named as Digibind (discontinued) -> DigiFab | DigiFab PI |
| flash F076 | fixed_fact | Aliskiren combo 'contraindicated' if CrCl <60 -> 'avoid' (label); 'ARNI benefits HFpEF' -> PARAGON-HF neutral primary, Class 2b | Tekturna PI; PARAGON-HF (NEJM 2019); 2022 AHA/ACC/HFSA HF guideline |
| flash F078 | fixed_fact | Candidemia duration anchor 'after last positive culture' -> 14 days after first negative culture with symptom resolution | IDSA 2016 Candidiasis guideline (Pappas) |
| flash F081 | fixed_fact | EM doxycycline 10-21 days -> 10 days (IDSA 2020); clindamycin+quinine as severe-babesiosis regimen -> atovaquone + IV azithromycin preferred | IDSA/AAN/ACR 2020 Lyme guideline; IDSA/ASTMH 2020 Babesiosis guideline |
| flash F082 | fixed_fact | G/P 8 weeks restricted to 'no cirrhosis' -> treatment-naive with or without compensated cirrhosis | AASLD/IDSA HCV Guidance; Mavyret PI |
| flash F089 | fixed_inconsistency | One lab pattern given for all hyperparathyroidism while listing secondary causes -> pattern labeled primary; secondary pattern added | Endocrine Society/4th International Workshop primary HPT guidance; KDIGO 2017 CKD-MBD |
| flash F090 | fixed_fact | Clomiphene first-line for ovulation induction -> letrozole first-line (2023 international PCOS guideline / ACOG) | 2023 International Evidence-based PCOS Guideline; ACOG PB 194 |
| flash F093 | fixed_fact | Risk threshold eGFR <60 -> eGFR <30 highest risk; NAC 'often given' -> not recommended per PRESERVE | ACR/NKF 2020 consensus on IV contrast in kidney disease; PRESERVE trial (NEJM 2018) |
| flash F095 | fixed_fact | Cardiac surgery threshold 8-9 -> 7.5 (AABB 2023/TRICS-III); FFP for warfarin reversal -> only if PCC unavailable; cryo for vWD/hemophilia A -> only if factor concentrates unavailable | AABB 2023 RBC transfusion guideline (Carson, JAMA); MINT trial (NEJM 2023); CHEST 2012/ACC 2020 ECDP |
| flash F097 | fixed_fact | PN 7-day hold applied to all -> only for low nutrition risk; start early PN if high risk/malnourished | ASPEN/SCCM 2016 critical care nutrition guideline |
| flash F101 | fixed_fact | Acamprosate 'reduces withdrawal symptoms' -> maintains abstinence/protracted withdrawal, not acute withdrawal | Campral PI; APA 2018 AUD pharmacotherapy guideline |
| flash F102 | fixed_bbw | Missing BBW for increased mortality in elderly dementia patients (and full myocarditis/orthostasis wording) added; 2024 REMS fact restored, June 2025 removal appended as update | Clozaril PI boxed warning; FDA Drug Safety Communication on clozapine REMS removal (2025) |
| flash F103 | fixed_fact | HEC said triple therapy with olanzapine only for refractory CINV; carboplatin listed with 2-drug regimen -> HEC 4-drug incl. olanzapine upfront; carboplatin AUC>=4 adds NK1 RA | ASCO Antiemetics Guideline Update (Hesketh, JCO 2017; 2020 update); NCCN Antiemesis 2024 |
| flash F107 | outdated_noted | 2024 facts correct -> appended note on 2025 clesrovimab approval | FDA approval Enflonsia June 2025; ACIP June 2025 recommendation |
| flash F108 | fixed_fact | Said all <2 y need antibiotics and azithromycin first for PCN allergy -> AAP 2013 observation option for non-severe unilateral 6-23 mo; cephalosporins for non-type I allergy, macrolides not recommended | AAP Clinical Practice Guideline: Diagnosis and Management of AOM (Lieberthal, Pediatrics 2013) |
| flash F112 | fixed_fact | CCB called second-line, long-acting nitrates 'as-needed', ivabradine recommended -> BB or CCB first line; LA nitrates scheduled with nitrate-free interval; ivabradine potentially harmful with normal LVEF | 2023 AHA/ACC Chronic Coronary Disease Guideline (Virani, Circulation 2023) |
| flash F122 | fixed_fact | All smokers >35 labeled MEC 4 -> MEC 4 only for >=35 y smoking >=15 cig/day (<15 = category 3) | CDC US MEC for Contraceptive Use 2024 |
| flash F131 | fixed_inconsistency | One line said avoid ER oxybutynin, another said avoid IR -> both say avoid oral oxybutynin (IR and ER) in elderly per Beers | AGS Beers Criteria 2023 |
| flash F135 | fixed_fact | Siponimod (S1P modulator) listed as high-efficacy -> moved to moderate-efficacy oral S1P group; anti-CD20 ofatumumab in high-efficacy list | AAN 2018 DMT guideline; Mayzent/Kesimpta prescribing information |
| flash F142 | fixed_fact | CEA example given as cost per QALY -> natural units; cost per QALY identified as cost-utility analysis | ISPOR/standard pharmacoeconomics definitions (CEA vs CUA) |
| flash F146 | fixed_fact | Conflated sacubitril with neprilysin ('sacubitril degrades BNP') -> neprilysin degrades BNP, sacubitril inhibits it | Entresto prescribing information; 2022 AHA/ACC/HFSA HF Guideline |
| flash F149 | fixed_fact | Said Css changes 'proportionally' with CL -> inversely proportional | Css = (F x Dose/tau)/CL; standard PK texts |
| flash F151 | fixed_fact | 90%/10% domain split and 60-70 s/question -> official BPS outline 36%/36%/28%; ~90 s per item (150 items/225 min) | BPS Job Analysis Pharmacotherapy (BCPS), March 2023, Exam Content Outline (bpsweb.org); BPS BCPS exam: 150 items/225 min |
| flash F155 | fixed_fact | Said clozapine used ONLY for treatment-resistant schizophrenia (contradicting suicidality bullet) -> both labeled indications | Clozaril prescribing information (DailyMed) |
| flash F161 | fixed_fact | 70 s per question -> ~90 s (150 items in 225 minutes) | BPS BCPS exam format: 150 items, 225 minutes |
| flash F176 | outdated_noted | 2024 facts correct -> appended note on Dec 2025 US withdrawal of andexanet alfa | FDA alert / TCTMD 'Andexanet Alfa Pulled From US Market' (Dec 2025); Medical Letter 2026 |
| flash F182 | fixed_bbw | Aortic dissection (blank) and QT listed as boxed warnings -> BBW = tendinopathy, peripheral neuropathy, CNS effects, MG exacerbation; aortic aneurysm/QT are non-boxed warnings | FDA Drug Safety Communications 2016 and Dec 2018; Levofloxacin/ciprofloxacin labeling (DailyMed) |
| flash F183 | fixed_inconsistency | Front had no question stem; back said discontinue at ANC <1,000 -> stem added; interrupt <1,000, discontinue <500 per label | Clozaril prescribing information (DailyMed) |
| flash F184 | fixed_bbw | BBW blank said proarrhythmia 'especially TdP' (TdP rare with amiodarone) -> worsened arrhythmia, significant heart block/bradycardia per boxed warning | Amiodarone (Pacerone) prescribing information boxed warning |
| flash F185 | fixed_fact | NNT 1/0.03 given as 33 -> 34 (NNT always rounded up) | Standard EBM convention: NNT rounded up |
| flash F189 | fixed_dose | Empiric DigiFab for chronic toxicity 5 vials -> 6 vials (adults) per label | DigiFab prescribing information (FDA) |
| flash F190 | fixed_dose | 0.4 mg listed as intranasal dose -> 0.4 mg IV/IM/SC; intranasal is 4 mg | Naloxone injection and Narcan nasal spray prescribing information |
| flash F194 | fixed_fact | SOFA increase '>2' -> '≥2' points (Sepsis-3) | Singer et al. Sepsis-3, JAMA 2016 |
| flash F197 | fixed_fact | CBC weekly x1 month then q1-2 months + periodic CXR -> ACR: CBC/LFT/SCr q2-4 wk x3 mo, q8-12 wk months 3-6, then q12 wk; baseline hepatitis serologies and CXR | ACR 2008 Recommendations for nonbiologic/biologic DMARDs (Saag, Arthritis Rheum 2008) |
| flash F199 | fixed_inconsistency | Front had no question stem and gave away the answer (~1.55x) -> stem with t½/τ added; answer unchanged | R = 1/(1-e^-k*tau); k=0.0866, tau=12 -> 1.55 |
| flash F201 | fixed_fact | Age threshold '>75' -> '≥75' per prasugrel label | Effient prescribing information |
| flash F203 | fixed_fact | Said dofetilide REMS requires trained prescribers -> REMS eliminated 2016; labeled inpatient initiation still applies | FDA: Information on Tikosyn (dofetilide), March 2016 |
| flash F205 | fixed_fact | RALES EF '<35%' -> '≤35%' (enrollment criterion) | Pitt et al. RALES, NEJM 1999 |
| glossary Biliary Excretion | fixed_fact | MW >300 Da and 'lipophilic drugs' -> >~500 Da in humans, polar/conjugated compounds | Shargel Applied Biopharmaceutics & PK, hepatic elimination chapter; Hirom et al. Biochem J 1972 (species MW thresholds) |
| glossary Cmax (Peak Concentration) | fixed_fact | Cmax restricted to oral/IM and said to 'determine' killing type -> any route; Cmax/MIC is the target for concentration-dependent agents | Applied Pharmacokinetics (Winter), aminoglycoside chapter |
| glossary Hill Equation | fixed_fact | Hill equation missing Emax term -> Effect = Emax × C^n/(EC50^n + C^n) | Goodman & Gilman, ch. 3 (pharmacodynamics) |
| glossary Time-Dependent Killing | fixed_fact | Listed glycopeptides as T>MIC agents -> notes vancomycin target is AUC/MIC 400-600 | Rybak et al. ASHP/IDSA/PIDS/SIDP vancomycin guideline, AJHP 2020 |
| glossary Inverse Agonist | fixed_fact | Timolol lowering resting HR cited as inverse agonism (that is antagonism of sympathetic tone) -> standard examples H1 antihistamines, pimavanserin | Goodman & Gilman ch. 3; Nuplazid (pimavanserin) prescribing information |
| glossary Angiotensin-Converting Enzyme (ACE) Inhibitor | fixed_bbw | Omitted boxed warning -> adds fetal toxicity BBW | Lisinopril (Zestril) prescribing information, DailyMed |
| glossary Angiotensin II Receptor Blocker | fixed_fact | 'Often combined with ACEi' -> dual RAAS blockade should be avoided; adds fetal toxicity BBW | ONTARGET NEJM 2008; VA NEPHRON-D NEJM 2013; Losartan prescribing information, DailyMed; 2017 ACC/AHA HTN guideline |
| glossary Angiotensin Receptor-Neprilysin Inhibitor | fixed_bbw | Omitted boxed warning -> adds fetal toxicity BBW | Entresto prescribing information, DailyMed |
| glossary Chronotropy | fixed_fact | 'CCBs' as negative chronotropes -> non-DHP only (DHPs cause reflex tachycardia) | Goodman & Gilman, CCB chapter |
| glossary Digoxin | fixed_fact | Only 0.5-2 ng/mL range though HF use listed -> adds HF target 0.5-0.9 ng/mL | 2022 AHA/ACC/HFSA HF guideline; DIG trial post hoc (Rathore JAMA 2003) |
| glossary Direct Oral Anticoagulants | fixed_bbw | Omitted boxed warnings -> adds premature discontinuation and spinal/epidural hematoma BBWs (edoxaban CrCl >95) | Eliquis, Xarelto, Savaysa, Pradaxa prescribing information, DailyMed |
| glossary Dromotrope | fixed_fact | 'CCBs' as negative dromotropes -> non-DHP only | Goodman & Gilman, CCB chapter |
| glossary Ejection Fraction | fixed_fact | HFrEF <40% (left 40% unclassified) -> ≤40% per 2022 AHA/ACC/HFSA | 2022 AHA/ACC/HFSA HF guideline |
| glossary Factor Xa Inhibitor | fixed_bbw | Omitted boxed warnings -> adds premature discontinuation and spinal/epidural hematoma BBWs | Eliquis, Xarelto, Savaysa prescribing information, DailyMed |
| glossary Fibrinolysis | fixed_fact | Streptokinase/urokinase listed for MI/stroke -> alteplase only stroke agent (2024); notes 2025 tenecteplase stroke approval | Activase PI, DailyMed; 2019 AHA/ASA acute ischemic stroke guideline; FDA/Genentech TNKase stroke approval, Mar 2025 |
| glossary Heart Failure with Preserved EF | fixed_fact | Therapy list omitted SGLT2 inhibitors -> adds SGLT2i class 2a and MRA/ARNI/ARB 2b; notes 2025 finerenone approval | 2022 AHA/ACC/HFSA HF guideline; EMPEROR-Preserved NEJM 2021; DELIVER NEJM 2022; Bayer/FDA Kerendia approval, Jul 2025 |
| glossary Heart Failure with Reduced EF | fixed_fact | HFrEF EF <40% -> ≤40% | 2022 AHA/ACC/HFSA HF guideline |
| glossary Inotropy | fixed_fact | 'CCBs' as negative inotropes -> non-DHP CCBs (DHPs negligible clinically) | Goodman & Gilman, CCB chapter; 2022 AHA/ACC/HFSA HF guideline (avoid non-DHP CCBs in HFrEF) |
| glossary LMWH (Low Molecular Weight Heparin) | fixed_dose | 'Avoid severe renal failure' -> enoxaparin CrCl <30 dose reduction (1 mg/kg q24h; 30 mg daily); adds spinal/epidural hematoma BBW | Lovenox prescribing information, DailyMed |
| glossary PT/INR | fixed_fact | PT described as measuring II, VII, X as 'extrinsic pathway' → extrinsic + common pathways (VII, X, V, II, fibrinogen) | Standard coagulation physiology references |
| glossary QRS Complex | fixed_fact | Normal QRS listed as up to 0.12 s with wide >0.12 s → normal <0.12 s, wide ≥0.12 s (120 ms) | AHA/ACCF/HRS ECG interpretation recommendations 2009 |
| glossary Renin | fixed_fact | 'Directly measured for HTN diagnosis' → used (ARR/PRA) to screen secondary HTN such as primary aldosteronism | Endocrine Society primary aldosteronism guideline 2016 |
| glossary Resynchronization Therapy | fixed_fact | CRT criteria 'QRS >120 ms' → LVEF ≤35% + LBBB QRS ≥150 ms (Class 1); 120-149 LBBB or non-LBBB ≥150 (2a) | 2022 AHA/ACC/HFSA HF guideline |
| glossary Statin | fixed_fact | CYP3A4 interactions stated as class-wide → limited to simvastatin/lovastatin (atorvastatin less); intensity bands added | 2018 AHA/ACC cholesterol guideline; Statin FDA labeling |
| glossary SVR (Systemic Vascular Resistance) | fixed_inconsistency | 'Elevated in shock… decreased in sepsis' (contradictory) → high in cardiogenic/hypovolemic/obstructive, low in distributive shock | Standard hemodynamic references |
| glossary Systolic Dysfunction | fixed_fact | HFrEF cutoff <40% → ≤40% | 2022 AHA/ACC/HFSA HF guideline |
| glossary TIMI Score | fixed_fact | Incomplete item list, 'mortality' outcome and 0/1-low/6-very-high bands → 7 correct items, composite outcome, 0-2/3-4/5-7 bands | Antman et al. JAMA 2000 (TIMI risk score for UA/NSTEMI) |
| glossary Vasodilation | fixed_fact | Vasodilators 'improve CO in cardiogenic shock' → improve CO in high-SVR HF with adequate BP; avoid in hypotension | 2022 AHA/ACC/HFSA HF guideline |
| glossary Vasopressin | fixed_fact | Listed as cardiac arrest rescue → removed from ACLS arrest algorithm 2015; septic shock add-on role | AHA ACLS guidelines 2015/2020; SSC 2021 |
| glossary Ventricular Tachycardia | fixed_fact | Unstable VT → defibrillation → synchronized cardioversion if pulse present; defibrillation if pulseless/polymorphic | AHA ACLS 2020 tachycardia algorithm |
| glossary Warfarin | fixed_bbw | Missing boxed warning → added major/fatal bleeding BBW | Warfarin FDA labeling (DailyMed) |
| glossary Aminoglycoside | fixed_fact | Peak 8-10 for all/'AUC-guided once-daily' → infection-dependent peaks 5-10, trough <1-2, Hartford nomogram; BBWs added | Nicolau et al. AAC 1995 (Hartford nomogram); Gentamicin FDA labeling |
| glossary C. difficile (CDI) | fixed_fact | Metronidazole for 'mild non-severe' → only if fidaxomicin/vancomycin unavailable; noted bezlotoxumab discontinued Jan 2025 | IDSA/SHEA CDI focused update 2021; ASHP Drug Shortage listing (Zinplava) 2025 |
| glossary CAP (Community-Acquired Pneumonia) | fixed_fact | Truncated fragment (regimens only, no definition) → completed with definition and inpatient regimens | ATS/IDSA CAP guideline 2019 |
| glossary Caspofungin | fixed_fact | Truncated fragment (never said what caspofungin is) → completed: echinocandin, mechanism, dosing, limitations | Cancidas FDA labeling; IDSA candidiasis guideline 2016 |
| glossary ESBL (Extended-Spectrum Beta-Lactamase) | fixed_fact | 'Hydrolyze all cephalosporins'; MERINO as 'failure rates' explained solely by inoculum effect → most cephalosporins (not cephamycins); failed non-inferiority on mortality; inoculum effect one proposed cause | Harris et al. JAMA 2018 (MERINO); IDSA AMR guidance 2024 |
| glossary Fluconazole | fixed_fact | 'Strong CYP3A4 inhibitor' → moderate CYP3A4; CYP2C9 and strong CYP2C19 inhibitor | FDA Drug Interaction Table of CYP inhibitors; Diflucan FDA labeling |
| glossary HIV Basics | fixed_fact | Biktarvy as the single 'preferred' regimen → one of several DHHS-recommended initial regimens (incl. DTG-based, DTG/3TC) | DHHS Adult ART Guidelines 2024 |
| glossary Inoculum Effect | fixed_fact | Inoculum effect stated as 'the' explanation for MERINO → one proposed explanation | Harris et al. JAMA 2018; Henderson et al. CID 2021 (MERINO reanalysis) |
| glossary MERINO Effect | fixed_fact | Carbapenems 'the only appropriate definitive agents'; non-inferiority result not stated → failed non-inferiority; carbapenems preferred with oral step-down options | Harris et al. JAMA 2018 (MERINO); IDSA AMR guidance 2024 |
| glossary MRSA (Methicillin-Resistant S. aureus) | fixed_fact | 'Resistant to all beta-lactams' → except ceftaroline/ceftobiprole | Teflaro and Zevtera FDA labeling |
| glossary Pip-Tazo (Piperacillin-Tazobactam) | fixed_fact | Vanco+pip-tazo '4-fold AKI' → ~3-fold in observational data; ACORN RCT no difference vs cefepime | Luther et al. Crit Care Med 2018; Qian et al. JAMA 2023 (ACORN) |
| glossary Sepsis | fixed_fact | 30 mL/kg bolus for all → for hypotension or lactate ≥4 mmol/L | SSC Hour-1 bundle 2018; SSC 2021 |
| glossary VAP (Ventilator-Associated Pneumonia) | fixed_fact | Truncated fragment (duration only; trial arms misstated as 7-8 vs 14-15 d) → completed definition/empiric therapy; PneumA 8 vs 15 days | IDSA/ATS HAP/VAP guideline 2016; Chastre et al. JAMA 2003 |
| glossary Vancomycin | fixed_fact | Truncated fragment (never said what vancomycin is) → completed: glycopeptide, mechanism, AUC target, PO use, ADRs | ASHP/IDSA/PIDS/SIDP vancomycin consensus 2020; Vancomycin FDA labeling |
| glossary ABCDEF Bundle | fixed_fact | Unsupported '10% compliance → 15%/17%/16%' figures attributed to Pun 2019 → actual Pun 2019 and Barnes-Daly 2017 results | Pun et al. Crit Care Med 2019;47:3-14; Barnes-Daly et al. Crit Care Med 2017 |
| glossary DKA (Diabetic Ketoacidosis) | fixed_fact | Bicarb <15 → <18; 'do NOT use loading dose' → optional; 'replace K if <3.5' → add K when <5.0-5.2, hold insulin if <3.5; routine phosphate → only if <1.0; dextrose threshold updated | ADA hyperglycemic crises consensus 2009; Umpierrez et al. Diabetes Care/Diabetologia 2024 consensus |
| glossary Hyperkalemia Emergency | fixed_fact | Omitted albuterol shift therapy and understated insulin effect (-0.5) → albuterol added; insulin ↓ ~0.6-1 mEq/L | KDIGO Controversies Conference on potassium 2020; Standard hyperkalemia protocols |
| glossary Lactate (Critical Care) | fixed_fact | Truncated fragment (never said what lactate is) → completed: definition, normal value, type A/B causes, remeasurement | Singer et al. JAMA 2016 (Sepsis-3); SSC 2021 |
| glossary Norepinephrine | fixed_fact | SOAP-II 'NE superior' → no overall mortality difference, fewer arrhythmias | De Backer et al. NEJM 2010 (SOAP II) |
| glossary TTM (Targeted Temperature Management) | fixed_fact | TTM2 normothermia ≤37.7 → ≤37.5°C; 72-h fever rule attributed generically → ERC/ILCOR; AHA 2023 32-37.5°C ≥24 h added | Dankiewicz et al. NEJM 2021 (TTM2); AHA 2023 focused update post-arrest care; ERC-ESICM 2021 |
| glossary Vasopressin (Vasopressor) | fixed_fact | VANISH misdescribed and renal benefit claimed → VANISH no kidney benefit on primary outcome; VASST no overall mortality difference | Gordon et al. JAMA 2016 (VANISH); Russell et al. NEJM 2008 (VASST) |
| glossary Thyroid Storm | fixed_dose | PTU 200 mg q4-6h → 500-1000 mg load then 250 mg q4h | ATA hyperthyroidism guideline 2016 |
| glossary Insulin Therapy | fixed_fact | Degludec 't½ ~42h' → t½ ~25 h, duration >42 h; detemir US discontinuation noted | Tresiba FDA labeling; Novo Nordisk Levemir discontinuation notice 2024 |
| glossary GLP-1 RA (Glucagon-Like Peptide-1 Receptor Agonist) | fixed_bbw | Missing thyroid C-cell tumor boxed warning → added (MTC/MEN2 contraindication); tirzepatide labeled dual GIP/GLP-1 RA | Ozempic/Victoza/Trulicity/Mounjaro FDA labeling |
| glossary SGLT2 Inhibitor (Endo) | fixed_fact | 'Avoid if eGFR <20' for all uses → cardiorenal initiation ≥20 (dapa ≥25); empagliflozin not for glycemic control <30; CREDENCE was T2D-only | Jardiance/Farxiga FDA labeling; KDIGO 2024 |
| glossary Phenytoin | fixed_fact | Truncated fragment (never said what phenytoin is) → completed: Na-channel blocker, nonlinear PK, induction, IV BBW, ADRs | Dilantin/phenytoin injection FDA labeling |
| glossary Status Epilepticus | fixed_fact | Treatment phase timing 0-5/5-20/>30 min → 5-20/20-40/40-60 min | AES convulsive status epilepticus guideline 2016 |
| glossary TIA (Transient Ischemic Attack) | fixed_fact | DAPT '21-90 days' → 21 days started within 24 h, then single antiplatelet | AHA/ASA secondary stroke prevention guideline 2021 |
| glossary Valproic Acid | fixed_bbw | Boxed warnings not identified; 'strong CYP2C9 inhibitor' → BBWs (hepatotoxicity, pancreatitis, fetal risk) labeled; CYP2C9/UGT inhibitor | Depakote FDA labeling |
| glossary Neuropathic Pain | fixed_fact | Fibromyalgia classed as neuropathic pain; 'SNRIs preferred over gabapentinoids' → nociplastic; duloxetine/milnacipran/pregabalin all FDA-approved | IASP pain terminology; NeuPSIG 2015; FDA labeling |
| glossary CKD (Chronic Kidney Disease) | fixed_fact | SGLT2i limited to UACR ≥200 → also T2D and HF regardless of albuminuria; KDIGO 2024 eGFR-for-dosing noted | KDIGO 2024 CKD guideline |
| glossary eGFR (Estimated Glomerular Filtration Rate) | fixed_fact | 'Use CG rather than eGFR' as absolute → CG basis of most labels; KDIGO 2024/FDA 2024 also accept de-indexed eGFR | KDIGO 2024 CKD guideline; FDA renal impairment PK guidance 2024 |
| glossary Vancomycin Nephrotoxicity | fixed_fact | '4-fold vs either agent alone' → ~3-fold vs vancomycin alone (observational); ACORN RCT no difference | Luther et al. Crit Care Med 2018; Qian et al. JAMA 2023 (ACORN) |
| glossary Warfarin Reversal | fixed_fact | Neuraxial INR ≤2 → normalized (<1.5, ASRA); asymptomatic INR 4.5-10 no routine vitamin K; INR >10 oral vitamin K added | CHEST 2012 antithrombotic guideline; ACC 2020 ECDP bleeding; ASRA 4th ed 2018 |
| glossary TLS (Tumor Lysis Syndrome) | fixed_fact | Truncated fragment (lab criteria only) → completed: definition, clinical TLS, prevention | Cairo & Bishop Br J Haematol 2004; Elitek FDA labeling |
| glossary Febrile Neutropenia | fixed_fact | 'Solid tumor/lymphoma' as high-risk criterion; G-CSF never in active FN → comorbidity criteria; G-CSF considered in high-risk FN | IDSA febrile neutropenia guideline 2010; ASCO/IDSA outpatient FN 2018; ASCO G-CSF guideline 2015 |
| glossary Asthma (Pathophysiology & Treatment) | fixed_fact | SABA risk attributed to 'SMART trial' (a salmeterol trial); Track 2 steps mixed into Track 1 → SYGMA/Novel START; GINA Track 1 MART steps | GINA 2024; O'Byrne NEJM 2018 (SYGMA1); Beasley NEJM 2019 (Novel START) |
| glossary COPD (Chronic Obstructive Pulmonary Disease) | fixed_fact | Claimed LAMA preferred over LABA for dyspnea as initial therapy → GOLD groups A (single LA bronchodilator) and B (LAMA+LABA); LAMA advantage is exacerbation prevention, not symptoms | ACCP Updates in Therapeutics 2024, Pulmonology ch. (GOLD 2023 groups; Cochrane tiotropium vs LABA) |
| glossary LAMA (Long-Acting Muscarinic Antagonist) | fixed_fact | Said LAMA superior to LABA for dyspnea → superior for exacerbation prevention only; symptom improvement similar | ACCP Updates in Therapeutics 2024, Pulmonology ch. (Cochrane: tiotropium vs LABA); POET-COPD, NEJM 2011 |
| glossary GDMT | fixed_fact | HFrEF threshold EF <40% → EF ≤40% | ACCP Updates in Therapeutics 2024, Chronic Care in Cardiology ch.; 2022 AHA/ACC/HFSA HF guideline |
| glossary MTM | fixed_inconsistency | Said 'five' problems while listing six (ADR merged) → the seven drug therapy problems with ADR listed separately | Cipolle, Strand & Morley, Pharmaceutical Care Practice (7 DTP categories) |
| glossary SOFA Score | fixed_fact | Said baseline SOFA ≥2 defines organ dysfunction → Sepsis-3: baseline assumed 0; acute rise ≥2 points defines organ dysfunction/sepsis | Singer et al. Sepsis-3, JAMA 2016 |
| glossary Serotonin Syndrome | fixed_fact | Hunter criteria misstated (any clonus alone; invented 'agitation + hyperreflexia + diaphoresis') → correct five Hunter rules | Dunkley et al. Hunter criteria, QJM 2003; ACCP Updates in Therapeutics 2024, Psychiatry ch. |
| glossary CYP2C9 | fixed_fact | Labeled fluconazole/amiodarone/etc. 'strong' CYP2C9 inhibitors and rifampin 'strong' inducer → FDA classes them moderate (no strong 2C9 inhibitors listed) | FDA Drug Development and Drug Interactions table of substrates, inhibitors and inducers |
| glossary CYP2C19 | fixed_fact | Said ultrarapid metabolizers may need higher clopidogrel doses → standard dosing; response normal/enhanced | CPIC guideline for CYP2C19 and clopidogrel, 2022 |
| glossary Opioid Overdose | fixed_dose | Gave 0.4–2 mg as the intranasal dose → intranasal naloxone is 4 mg | Narcan nasal spray FDA labeling |
| glossary Methanol/Ethylene Glycol Toxicity | fixed_fact | HD threshold methanol >25 mg/dL and routine calcium for EG → HD at methanol >50 mg/dL (EXTRIP >70 on fomepizole); calcium only for symptomatic hypocalcemia | AACT methanol guideline 2002; EXTRIP methanol, Crit Care Med 2015; AACT ethylene glycol guideline 1999 |
| glossary Fosfomycin | fixed_inconsistency | Named IV product tromethamine and said it must always be combined (contradicting single-dose UTI use) → IV is fosfomycin disodium; combination applies to systemic MDR use | Monurol (fosfomycin tromethamine) FDA labeling; IDSA uncomplicated cystitis guideline 2010 |
| glossary Metronidazole | fixed_fact | CDI 'mild only' option, alcohol 48 h, 'strong' 2C9 inhibitor → CDI only if vancomycin/fidaxomicin unavailable; avoid alcohol ≥3 days after; CYP2C9 inhibitor | ACCP Updates in Therapeutics 2024, Infectious Diseases I ch. (C. difficile); Flagyl FDA labeling; IDSA/SHEA CDI 2021 |
| glossary Tigecycline | fixed_bbw | Said not for pneumonia and tied boxed warning to BSI → approved for CABP but not HAP/VAP; boxed warning is all-cause mortality across trials | Tygacil FDA labeling (boxed warning, indications) |
| glossary Digoxin Toxicity | fixed_fact | Listed spironolactone as raising digoxin 50–70% → amiodarone is the ~70% interaction (reduce digoxin 30–50%); spironolactone removed, dronedarone added | ACCP Updates in Therapeutics 2024, Chronic Care in Cardiology ch. (digoxin interactions) |
| glossary Cardiac Resynchronization Therapy | fixed_fact | LBBB 130–149 ms and non-LBBB ≥150 'uncertain' → 2022 AHA/ACC/HFSA: LBBB 120–149 ms IIa; non-LBBB ≥150 ms IIa | ACCP Updates in Therapeutics 2024, Chronic Care in Cardiology ch.; 2022 AHA/ACC/HFSA HF guideline |
| glossary Ezetimibe | fixed_fact | Fragment never said what ezetimibe is → adds mechanism (NPC1L1), LDL effect, dose, place in therapy; IMPROVE-IT data kept | Zetia FDA labeling; Cannon et al. IMPROVE-IT, NEJM 2015 |
| glossary Natriuretic Peptide (BNP/NT-proBNP) | fixed_fact | Said PRIMA showed BNP-guided therapy improves outcomes → PRIMA and GUIDE-IT were neutral | Eurlings et al. PRIMA, JACC 2010; Felker et al. GUIDE-IT, JAMA 2017; 2022 AHA/ACC/HFSA HF guideline |
| glossary Hepatorenal Syndrome | fixed_fact | Used old type 1 HRS definition and albumin 1 g/kg/day as maintenance → HRS-AKI by ICA criteria; 1 g/kg is the challenge dose, then 20–40 g/day with vasoconstrictor | ACCP Updates in Therapeutics 2024, Gastroenterology ch. (HRS-AKI); AASLD 2021 ascites/HRS guidance |
| glossary Diuretic Resistance | fixed_fact | Fragment (only the infusion phrase) → full definition, causes, and management strategies; DOSE-trial phrase kept | Felker et al. DOSE trial, NEJM 2011; Mullens et al. ADVOR, NEJM 2022; 2022 AHA/ACC/HFSA HF guideline |
| glossary Diabetes Insipidus | fixed_fact | Fragment began mid-definition with nephrogenic DI only → full definition with central vs nephrogenic DI and treatment; desmopressin-challenge text kept | Desmopressin FDA labeling; Endocrine Society/standard references on DI |
| glossary Obesity (Pharmacotherapy) | fixed_fact | Surgery criteria BMI ≥40 or ≥35+comorbidity (1991 NIH) → 2022 ASMBS/IFSO: BMI ≥35, consider 30–34.9 with metabolic disease | ASMBS/IFSO 2022 indications for metabolic and bariatric surgery |
| glossary Hypoglycemia Management | fixed_dose | Nasal glucagon dosed 1 mg (claimed IM more reliable) and diazoxide for SU toxicity → intranasal 3 mg; octreotide for sulfonylurea hypoglycemia | ACCP Updates in Therapeutics 2024, Endocrine ch. (glucagon 1 mg SC/IM or 3 mg nasal); Baqsimi FDA labeling; Toxicology: octreotide for SU overdose |
| glossary Bone Health (Osteoporosis) | fixed_fact | Fragment (anabolic drugs only) → full definition, diagnosis, calcium/vitamin D, antiresorptives, anabolics with boxed warnings | ACCP Updates in Therapeutics 2024, Sexual & Repro Health ch. (osteoporosis); Prolia boxed warning 2024; Evenity FDA labeling; AACE 2020 osteoporosis guideline |
| glossary Alzheimer's Disease (Pharmacotherapy) | fixed_fact | Fragment (only anti-amyloid mAbs) → full definition with cholinesterase inhibitors, memantine, anti-amyloid agents and ARIA boxed warning | ACCP Updates in Therapeutics 2024, Geriatrics ch. (Table 5 AD drugs); Leqembi and Kisunla FDA labeling |
| glossary Migraine Treatment | fixed_fact | Single <15 days/month limit for all acute meds → triptans/combination <10 days/month; simple analgesics <15 | ICHD-3 medication-overuse headache criteria; ACCP Updates in Therapeutics 2024, Neurology ch. |
| glossary Metformin | fixed_fact | Said hold 48 h before contrast → stop at time of/before contrast and hold ≥48 h after | ACCP Updates in Therapeutics 2024, Nephrology ch. (hold metformin ≥48 h after contrast); FDA metformin labeling 2016 |
| glossary Drug Absorption Interactions | fixed_fact | Said PPIs contraindicated with atazanavir → contraindicated with rilpivirine; atazanavir allows limited low-dose PPI when boosted in treatment-naive | Reyataz and Edurant FDA labeling; DHHS adult ARV guidelines |
| glossary Andexanet Alfa | fixed_bbw | Omitted boxed warning, claimed certified-hospital-only, presented as current → boxed warning added; notes Dec 2025 US withdrawal for thrombotic risk (4F-PCC instead) | Andexxa FDA labeling (boxed warning); FDA/AstraZeneca US withdrawal notice Dec 2025 (AABB, TCTMD) |
| glossary Idarucizumab | fixed_dose | Said vials given 15 min apart → two vials administered consecutively (back-to-back infusions or bolus) | Praxbind FDA labeling |
| glossary Roflumilast | fixed_bbw | Claimed a boxed warning for psychiatric events → labeled warning only (no boxed warning) | Daliresp FDA labeling; ACCP Updates in Therapeutics 2024, Pulmonology ch. (roflumilast) |
| glossary Pulmonary Arterial Hypertension | fixed_fact | Threshold '≥20' and PCWP '<15' without PVR → mPAP >20, PCWP ≤15, PVR >2 WU (2022 ESC/ERS) | 2022 ESC/ERS pulmonary hypertension guidelines |
| glossary CBC Interpretation | fixed_fact | Listed AKI as normocytic anemia cause → CKD (EPO deficiency) | KDIGO anemia in CKD 2012 |
| glossary Ammonia (Lab) | fixed_fact | Normal range given as 15–45 mcmol/L → 15–45 mcg/dL (≈11–32 mcmol/L) | MedlinePlus ammonia blood test reference range |
| glossary MACE | fixed_fact | Listed PARADIGM-HF as a MACE-endpoint trial → its primary endpoint was CV death or HF hospitalization | McMurray et al. PARADIGM-HF, NEJM 2014 |
| glossary ASCVD | fixed_fact | Fragment (risk tiers only) → defines ASCVD and the Pooled Cohort Equations context; risk-tier text kept | 2018 AHA/ACC multisociety cholesterol guideline |
| glossary eGFR (Drug Dosing) | fixed_fact | Weight rule and DOAC renal cutoffs wrong (rivaroxaban VTE reduction at <30; dabigatran 'contraindicated'; metformin by C-G) → chapter BMI-based weight; label DOAC cutoffs; metformin uses eGFR | ACCP Updates in Therapeutics 2024, Pharmacokinetics ch. (C-G weight selection); Xarelto, Pradaxa, metformin FDA labeling |
| glossary CrCl (Cockcroft-Gault) | fixed_fact | 'Lower of adjusted BW or IBW' in obesity (always IBW) → 2024 chapter rule: actual if BMI <18.5, IBW if 18.5–25, adjusted BW if >25 | ACCP Updates in Therapeutics 2024, Pharmacokinetics ch. (Cockcroft-Gault weight) |
| glossary IBW (Ideal Body Weight) | fixed_fact | Listed vancomycin as AdjBW-dosed → vancomycin is dosed on actual body weight | ASHP/IDSA/PIDS/SIDP vancomycin consensus 2020 |
| glossary Area Under the Curve | fixed_fact | Fragment (only PK/PD use) → defines AUC, formula, and uses; original PK/PD phrase kept | ACCP Updates in Therapeutics 2024, Pharmacokinetics ch. |
| glossary Adverse Drug Event | fixed_fact | 3.5 million ER visits/year (that figure is CDC's office-visit estimate) → ~1.3 million ED visits/year | Shehab N et al. JAMA 2016;316:2115; Budnitz DS et al. JAMA 2006;296:1858; CDC Medication Safety Program |
| glossary Drug Hypersensitivity | fixed_fact | NSAIDs given as a classic IgE/Type I example → penicillin; notes most NSAID hypersensitivity is non-IgE (COX-1 mediated) | AAAAI/ACAAI Drug Allergy Practice Parameter 2022 |
| glossary SVT | fixed_fact | Adenosine 'contraindicated in WPW with pre-excitation' → avoid in pre-excited AF; usable for orthodromic AVRT | 2015 ACC/AHA/HRS SVT guideline |
| glossary Carbapenem-Resistant Enterobacteriaceae | fixed_fact | CRE defined as resistant to ALL carbapenems → resistant to at least one carbapenem or carbapenemase-producing | CDC CRE clinician definition; IDSA AMR Guidance 2023/2024 |
| glossary ESBL-Producing Organisms | fixed_fact | 'Resistant to all cephalosporins' and ertapenem limited to non-BSI → cephamycins usually spared; ertapenem OK incl. bacteremia unless critically ill; cystitis nitrofurantoin/TMP-SMX; avoid pip-tazo | IDSA AMR Guidance 2023 (Tamma et al. CID); MERINO trial, JAMA 2018 |
| glossary Clostridium difficile Infection | outdated_noted | Bezlotoxumab presented as available → 2024 fact kept; appended note on its January 2025 US discontinuation | IDSA/SHEA 2021 CDI focused update; ASHP Drug Shortages: Bezlotoxumab (discontinued Jan 2025) |
| glossary Endocarditis | fixed_fact | 'Prosthetic valve' listed as a stand-alone surgical indication → prosthetic valve dehiscence or relapsing PVE | AHA 2015 IE scientific statement (Baddour); 2020 ACC/AHA valvular heart disease guideline |
| glossary Pneumocystis jirovecii Pneumonia | fixed_dose | Prophylaxis TMP-SMX DS 3x/week (an alternative) → 1 DS or SS daily preferred; 3x/week alternative | HHS Adult/Adolescent OI Guidelines, PCP section |
| glossary Cryptococcal Meningitis | fixed_dose | Consolidation fluconazole 400 mg → 800 mg daily ≥8 weeks (400 mg only once on ART with negative CSF culture) | HHS Adult/Adolescent OI Guidelines, Cryptococcosis (2021 update) |
| glossary ARDS Management | fixed_fact | 'No benefit for corticosteroids except late fibroproliferative phase' → 2023 ATS/2024 SCCM conditionally recommend; late (>14 d) initiation harmful | ATS ARDS guideline 2023 (Qadir et al. AJRCCM); SCCM corticosteroid focused update 2024 (Chaudhuri et al. CCM); LaSRS, NEJM 2006 |
| glossary Weaning from Mechanical Ventilation | fixed_fact | SAT+SBT trial named 'PAC trial' → ABC (Awakening and Breathing Controlled) trial | Girard TD et al. Lancet 2008;371:126 |
| glossary Targeted Temperature Management | fixed_fact | AHA 2020 misquoted as 'normothermia acceptable, prevent fever 72 h' → AHA 2020 32–36°C ≥24 h; AHA 2023 32–37.5°C ≥24 h; 72 h fever prevention is ILCOR | AHA 2020 ACLS guidelines; AHA 2023 Focused Update on Adult ACLS (Perman et al. Circulation) |
| glossary Contrast-Induced Nephropathy | fixed_fact | 'Hold metformin if eGFR<30 or 48h post-procedure' → contraindicated <30; hold for eGFR 30–60/intra-arterial etc., recheck at 48 h (FDA label) | Metformin FDA labeling (DailyMed); ACR Manual on Contrast Media 2023 |
| glossary Drug Dosing in Renal Failure | fixed_fact | Actual body weight for obese CG and 'avoid LMWH if CrCl<30' → adjusted/ideal weight; enoxaparin 1 mg/kg q24h if CrCl<30 (or UFH) | Enoxaparin FDA labeling (DailyMed); Winter MA et al. Pharmacotherapy 2012 (CG weight in obesity) |
| glossary DKA Management | fixed_fact | DKA diagnostic bicarbonate <15 → <18 mEq/L | ADA 2009 consensus (Kitabchi); ADA/EASD/JBDS/AACE/DTS Hyperglycemic Crises Consensus 2024 |
| glossary Hyperparathyroidism | fixed_fact | Cinacalcet for secondary HPT in 'CKD/ESRD' → CKD on dialysis only (label limitation) | Sensipar (cinacalcet) FDA labeling |
| glossary Hyponatremia Management | fixed_dose | 3% saline '1–2 mL/kg/h bolus' and tolvaptan for cirrhosis → 100–150 mL bolus over 10–20 min, repeat ×2–3; tolvaptan avoided in liver disease | Verbalis JG et al. Am J Med 2013 expert panel; Spasovski G et al. Eur J Endocrinol 2014; Samsca (tolvaptan) FDA labeling |
| glossary Acute Ischemic Stroke | outdated_noted | Tenecteplase listed without status → 2024 off-label status noted; appended March 2025 FDA approval | 2019 AHA/ASA AIS guideline; FDA TNKase approval for AIS, March 2025 |
| glossary COPD Pharmacotherapy | fixed_fact | Pre-2023 stepwise SABA→LAMA or LABA monotherapy for all → GOLD 2023/2024 groups A/B/E with LAMA+LABA initial for B and E | GOLD 2024 Report |
| glossary Liver Function Tests | fixed_fact | Ambiguous ratio under 'ALT/AST' (reads as ALT:AST >2:1) → AST:ALT >2:1 favors alcoholic hepatitis | ACG Clinical Guideline: Evaluation of Abnormal Liver Chemistries 2017 |
| glossary ACEi | fixed_fact | 'Switch to ARB — shared mechanism in bradykinin pathway' (wrong rationale) → ARBs don't block bradykinin breakdown; ARB cautiously, never rechallenge ACEi | ACE inhibitor FDA labeling; Haymore BR et al. Ann Allergy Asthma Immunol 2008 |
| glossary MAP | fixed_fact | 'Higher goal ≥80 in chronic HTN' presented as a target → SSC 2021 initial MAP 65; SEPSISPAM showed only less RRT, no mortality benefit | Surviving Sepsis Campaign 2021; SEPSISPAM, NEJM 2014 |
| drugs sacubitril_valsartan | fixed_dose | Renal/hepatic low starting dose given as  and hepatic said  → 24/26 mg BID for eGFR <30 or Child-Pugh B, Child-Pugh C not recommended; dosing now states usual 49/51 mg BID start; ddi distinguishes ACEi (contraindicated, 36-h washout) from ARB (avoid) and adds aliskiren; valsartan fecal excretion 83% → 86%. | Entresto (sacubitril/valsartan) USPI, sections 2, 4, 7, 8.6-8.7, 12.3 (DailyMed/openFDA) |
| drugs ivabradine | fixed_fact | Indication called  → reduces HF hospitalization (requires max-tolerated beta-blocker); fabricated Child-Pugh B  → no adjustment A/B; phosphene incidence ~25% → ~3% (vs 0.5%); PK t½/excretion corrected (effective t½ ~6 h; feces ≈ urine, 4% unchanged). | Corlanor (ivabradine) USPI, sections 1, 6.1 (SHIFT Table 2), 8.6, 12.3 (openFDA, 2025) |
| drugs spironolactone | fixed_bbw | Stored boxed warning (rat tumorigenicity) no longer exists → bbw  (removed in 2018 PLR label); HF max 50 mg/day was presented as the drug max → scoped to HF with HTN/ascites/hyperaldosteronism doses; renal  → label 25 mg QOD for eGFR 30-50, avoid <30 per guidelines; ades listed only gynecomastia → hyperkalemia added first. | Aldactone USPI 2018 (NDA 012151/S-075, PLR; no boxed warning) and current Pfizer label 11/2025; 2022 AHA/ACC/HFSA HF guideline (MRA renal/K thresholds) |
| drugs eplerenone | fixed_fact | MOA attributed selectivity to  → low androgen/progesterone receptor affinity; HF max 50 mg presented as drug max → HTN 50 mg BID added; renal thresholds corrected (CrCl ≤30 contraindicated; HTN CrCl <50/SCr limits; QOD dosing for eGFR 31-49 not 30-60); EPHESUS 15% is all-cause (CV death 17%) and EMPHASIS-HF 37% is the composite (HF hosp 42%);  contradiction → <1%; removed nonsensical  monitoring clause. | Inspra (eplerenone) USPI sections 2, 4 (openFDA 2025); Pitt B et al. NEJM 2003 (EPHESUS); Zannad F et al. NEJM 2011 (EMPHASIS-HF) |
| drugs carvedilol | fixed_fact | Hepatic said  → severe hepatic impairment is a contraindication; PK  → food slows rate, not extent. | Coreg (carvedilol) USPI sections 2, 4, 12.3 (openFDA 2026; unchanged since 2024) |
| drugs metoprolol_succinate | fixed_dose | Dosing gave only the titration target → adds HF start 25 mg (12.5 mg severe) and HTN/angina doses; pearls  → succinate is ER only; indications flag post-MI/AF as off-label for the succinate. (Empty bbw is correct: current Toprol-XL/metoprolol succinate labels carry abrupt cessation as W&P 5.1, not a boxed warning.) | Toprol-XL (metoprolol succinate) USPI sections 1, 2, 5.1 (openFDA) |
| drugs digoxin | fixed_dose | Loading doses wrong (PO 8-12, IV 4-6 mcg/kg) → PO 10-15, IV 8-12 mcg/kg; ades said HYPERkalemia worsens toxicity → hypokalemia does (hyperkalemia marks acute overdose); hepatic  → no adjustment; renal field now states maintenance-dose reduction; DDI magnitudes corrected (amiodarone ~70%, verapamil 50-75%, diltiazem ~20%); unchanged urinary excretion 50-70%. | Lanoxin/digoxin tablets and injection USPI sections 2.2-2.3, 7.2 (DDI table), 8.6-8.7, 12.3 (openFDA) |
| drugs amiodarone | fixed_dose | IV dosing  → 150 mg/10 min then 1 mg/min ×6 h, 0.5 mg/min ×18 h (300 mg push for pulseless VF/VT); fabricated cirrhosis  → LFT >3× ULN rule; pulmonary toxicity 1-5% → up to 17%, hypothyroidism 20-30% → up to 10%; digoxin interaction 100% vs 70% inconsistency resolved (~70%, halve dose); warfarin cut 1/3-1/2; steady state  → months; monitoring/highyield harmonized; indications flag AF as off-label. | Pacerone/amiodarone tablets USPI (boxed warning, sections 2, 5.2-5.6, 7, 12.3; openFDA 2024); Nexterone/amiodarone IV labeling; 2020 AHA ACLS guidelines |
| drugs dronedarone | fixed_fact | DDI said ketoconazole ↑ only 2-3× and  → strong CYP3A4 inhibitors are contraindicated (~17-fold ↑);  → potassium-depleting diuretics; hepatic  → only severe contraindicated; renal  → no adjustment; bioavailability 15%/84% → 4% fasted/15% fed. | Multaq (dronedarone) USPI sections 4, 5.7, 7, 8.6-8.7, 12.3 (openFDA); Multaq EU SmPC (ketoconazole 17-fold; verapamil/diltiazem 1.4-1.7-fold) |
| drugs sotalol | fixed_dose | Renal table wrong (CrCl 40-60 ) → >60 q12h, 30-59 q24h, 10-29 q36-48h (older AF label: 40-60 q24h, <40 contraindicated);  → Sotylize is oral, IV is sotalol injection; BBW now includes ≥3-day monitored initiation and CrCl; QTc check  → 2-4 h post-dose;  → K+ <4; MOA  → beta-blockade at low dose, Class III ≥160 mg/day; QTc 450/460 sex split → 450 ms (AF). | Betapace/Betapace AF (sotalol) USPI boxed warning, sections 1, 2.1-2.5, 4, 12.1 (openFDA Dec 2024); Sotylize USPI 2024; sotalol hydrochloride injection labeling |
| drugs ticagrelor | fixed_fact | DDI said CYP3A4 inhibitors need  → strong CYP3A4 inhibitors and inducers must be avoided (plus statin >40 mg limit); aspirin >100 mg effect is ↓ efficacy not ↑ bleeding; stable CAD indication is THEMIS (not PLATO) and stroke/TIA (THALES) added with doses; dyspnea 10%/15% → ~14%;  → label says transfusion unlikely to help. | Brilinta (ticagrelor) USPI sections 1, 2, 5.3, 7.1-7.4, 10 (openFDA Apr 2024) |
| drugs prasugrel | fixed_bbw | BBW said  for weight <60 kg → weight <60 kg is a bleeding risk factor (consider 5 mg), only age ≥75 is ; adds active bleeding, CABG/7-day hold; hepatic  → no adjustment A/B, severe not studied. | Effient (prasugrel) USPI boxed warning, section 8.7 (openFDA) |
| drugs clopidogrel | fixed_fact | DDI field covered only H2-blockers → adds the key omeprazole/esomeprazole and CYP2C19-inhibitor interactions, repaglinide (CYP2C8), opioids, bleeding agents; ades claimed PPIs ↑ bleeding → PPIs reduce GI bleeding (interaction is ↓ efficacy). | Plavix (clopidogrel) USPI sections 5.1, 7 (openFDA 2025) |
| drugs rivaroxaban | fixed_fact | Indications listed only CAD/PAD and dosing only AF → full label indications and VTE/prophylaxis/CAD doses; pearls said  → andexanet approved for rivaroxaban; highyield rewritten to the 2024 fact with Dec-2025 Andexxa withdrawal appended; hepatic B-C  → avoid; DDI  → avoid; urinary excretion 33% → 66% total (36% unchanged). | Xarelto (rivaroxaban) USPI sections 1, 2 (Table 1), 7, 8.7, 12.3 (openFDA); AABB/TCTMD news Dec 2025: AstraZeneca withdraws Andexxa from US market |
| drugs apixaban | fixed_inconsistency | Indications field held an editor instruction () → proper list of approved indications with the ADOPT caveat; ESRD rule  → OR (ESRD already meets the SCr criterion); P-gp/CYP3A4 inhibitor rule  → reduce 50% (avoid if on 2.5 mg); highyield restored to 2024 fact with Andexxa withdrawal appended and meta note removed. | Eliquis (apixaban) USPI sections 1, 2.1, 2.5, 7.1, 8.6 (openFDA Feb 2025); AABB news Dec 23, 2025 (Andexxa US withdrawal) |
| drugs edoxaban | fixed_bbw | BBW missing spinal/epidural hematoma (part C) → added;  is not a US indication → removed/flagged; hepatic Child-Pugh B  → not recommended; P-gp inhibitor dose reduction applies only to VTE (contradicted dosing field) → corrected; highyield withdrawal moved to . | Savaysa (edoxaban) USPI boxed warning, sections 1, 2, 7, 8.7 (openFDA 2025) |
| drugs dabigatran | fixed_dose | AF dose reduction listed  (EU criteria) → US: 75 mg BID only for CrCl 15-30 or CrCl 30-50 + dronedarone/ketoconazole; fabricated  indication removed; major bleeding  → ~3.1% vs 3.4% (similar); dyspepsia 15% → ~35%;  wording fixed; VTE renal cutoff (≤30) and P-gp rules qualified by indication. | Pradaxa (dabigatran) USPI sections 1, 2, 4, 6.1, 7 (openFDA 2025); Connolly SJ et al. NEJM 2009 (RE-LY) |
| drugs warfarin | fixed_inconsistency | ades field held an editor instruction () with no actual ADEs → real ADE list (bleeding, skin necrosis, purple toe, calciphylaxis, teratogenicity) keeping the HIT/limb-gangrene note;  → 2-5 mg initial (no loading); mechanical valve INR 2.5-3.5 applied to all valves → mitral/high-risk aortic only; pearls reversal FFP-first → 4F-PCC + IV vitamin K for major bleeding. | Coumadin/warfarin USPI section 2 (openFDA); CHEST 2012/2018 VTE guidance; 2020 ACC/AHA valvular heart disease guideline; 2017/2020 ACC ECDP on anticoagulant reversal |
| drugs alteplase | fixed_fact | Indications listed only stroke (and dosing lacked STEMI) → adds STEMI, massive PE, Cathflo with STEMI accelerated regimen; 3-4.5 h ECASS III exclusions presented as current → noted as no longer absolute per 2019 AHA/ASA; ambiguous  → hold all antithrombotics 24 h post-tPA (prior aspirin not a contraindication). | Activase/Cathflo Activase (alteplase) USPI; Powers WJ et al. 2019 AHA/ASA AIS guideline update; 2013 ACCF/AHA STEMI guideline |
| drugs atorvastatin | fixed_fact | Pearls credited atorvastatin with WOSCOPS (pravastatin), JUPITER and HOPE-3 (rosuvastatin) → atorvastatin trials (ASCOT-LLA, CARDS, SPARCL, TNT, PROVE-IT); hepatic  → acute liver failure/decompensated cirrhosis (2024 label); LFT elevation  → ~0.7% >3× ULN; contradictory  → baseline only; CYP3A4 magnitude/dose limits corrected. | Lipitor (atorvastatin) USPI sections 2.6, 4, 5.3, 7 (openFDA Apr 2024) |
| drugs rosuvastatin | fixed_dose | Renal said only  → label CrCl <30 (not on HD): start 5 mg, max 10 mg; hepatic contraindication updated to acute liver failure/decompensated cirrhosis; LFT elevation 3-5% → ~1.1% (>3× ULN); removed fabricated  ADE, added dose-related proteinuria/hematuria. | Crestor/rosuvastatin USPI sections 2.5, 4, 5.3, 6 (openFDA) |
| drugs evolocumab | fixed_fact | Pearls said anti-drug antibodies in ~5% that may reduce efficacy (contradicting ades ) → ~0.3%, none neutralizing; outdated ~$14,000/yr price → ~$6,000/yr list after 2018 cut. (HoFH dosing 420 mg monthly → 420 mg q2wk verified as correct.) | Repatha (evolocumab) USPI sections 2, 6.2/12.6 immunogenicity (openFDA); Amgen press release Oct 2018 (list price reduction) |
| drugs ezetimibe | fixed_fact | IMPROVE-IT described as  → LDL 54 vs 70 mg/dL with ~2% absolute event reduction; dosing  unit error → additional ~20-25% LDL lowering; bile-acid-sequestrant spacing  → ≥2 h before or ≥4 h after (matches highyield). | Zetia (ezetimibe) USPI sections 2, 7 (openFDA); Cannon CP et al. NEJM 2015 (IMPROVE-IT) |
| drugs hydralazine_isosorbide | fixed_dose | Dosing omitted BiDil (37.5/20 mg 1 tab TID → 2 tabs TID) and used sub-target hydralazine 10-25 mg with a 10-14 h nitrate-free interval → BiDil and guideline component doses, no nitrate-free interval; highyield  → slow acetylators (contradicted ades);  removed as an indication; ades now lists headache/dizziness (most common). | BiDil USPI sections 1, 2, 6 (openFDA 2025); Taylor AL et al. NEJM 2004 (A-HeFT); 2022 AHA/ACC/HFSA HF guideline |
| drugs mavacamten | fixed_bbw | BBW omitted the CYP-interaction contraindications and LVEF <55% initiation limit → added (2024) with April-2025 change appended; ddi called strong CYP3A4 inhibitors  and omitted CYP2C19 → 2024 contraindications listed, dubious NSAID claim dropped; highyield rewritten to the 2024 fact with the 2025 change appended; dosing lacked 5 mg start; hepatic  → no adjustment A/B; PK excretion swapped (fecal 85%) → urine 85%/feces 7%, bioavailability ≥85%. | Camzyos (mavacamten) USPI 2022-2024 and BMS PI (sections 2, 4, 8.6, 12.3); BMS/FDA Apr 17 2025 label update (HFSA, HMP Global) |
| drugs vancomycin | fixed_dose | pearls said use adjusted body weight in obesity → actual body weight (load 20–25 mg/kg ABW, max 3 g) per 2020 consensus | ASHP/IDSA/PIDS/SIDP vancomycin consensus guideline 2020 (Rybak, AJHP 2020) |
| drugs piperacillin-tazobactam | fixed_fact | ades listed hyponatremia with 2.35 mEq Na/g → hypokalemia + sodium load 2.84 mEq/g (current label); renal now includes label nosocomial-pneumonia regimen | Zosyn PI (DailyMed) sections 2.3, 5.8 |
| drugs meropenem | fixed_fact | pearls claimed MERINO 'superiority' for ESBL/AmpC and that CRE 'require combination therapy' → MERINO failed noninferiority (ESBL), CRE treated with novel BL/BLI monotherapy; 'lower threshold' seizure wording corrected | Harris PNA et al. JAMA 2018 (MERINO); IDSA 2024 Guidance on AMR Gram-negative infections (Tamma, CID 2024) |
| drugs daptomycin | fixed_dose | renal implied a 'supplemental' 6–8 mg/kg post-HD dose on top of q48h → label: same mg/kg q48h after HD; pk '78% unchanged' → 78% total (~52% unchanged) | Cubicin RF PI (DailyMed) Table 3, section 12.3 |
| drugs linezolid | fixed_fact | pearls attributed linezolid-vs-vancomycin MRSA pneumonia result to ATTAIN (a telavancin trial) → ZEPHyR | Wunderink RG et al. Clin Infect Dis 2012;54:621 (ZEPHyR) |
| drugs metronidazole | fixed_fact | alcohol avoidance 48 h → at least 3 days (label); unsupported 'dose reduction after 3 days in ESRD' → monitor + dose after HD; highyield 'drug of choice for C. diff' contradicted IDSA 2021 → alternative only; H. pylori triple therapy → bismuth quadruple 500 mg TID–QID x14d | Flagyl PI (DailyMed): Contraindications, Clinical Pharmacology (renal/dialysis); IDSA/SHEA CDI focused update 2021; ACG H. pylori guideline 2024 (Chey, Am J Gastroenterol 2024) |
| drugs voriconazole | fixed_fact | pearls cited Walsh NEJM 2002 for aspergillosis superiority → Herbrecht NEJM 2002 | Herbrecht R et al. N Engl J Med 2002;347:408; Walsh TJ et al. N Engl J Med 2002;346:225 |
| drugs trimethoprim-sulfamethoxazole | fixed_dose | Stenotrophomonas dose '1 DS q8h' (~7 mg/kg/day, underdosed) → 8–12 mg/kg/day TMP; hepatic omitted label contraindication (marked hepatic damage) | Bactrim PI (DailyMed) Contraindications; IDSA 2024 AMR Gram-negative guidance (S. maltophilia) |
| drugs norepinephrine | fixed_fact | pearls described CATS as a dopamine comparison → epinephrine vs norepinephrine+dobutamine (no difference); SOAP II 'superior' reconciled with highyield (no mortality difference, fewer arrhythmias) | Annane D et al. Lancet 2007 (CATS); De Backer D et al. NEJM 2010 (SOAP II); Levophed PI (DailyMed, no boxed warning) |
| drugs vasopressin | fixed_dose | dosing field had only DI dosing (no shock dose) → adds 0.03 units/min and Vasostrict label ranges/taper; pk t½ → ≤10 min per label | Vasostrict PI (DailyMed) sections 2.2, 12.3; Surviving Sepsis Campaign 2021 |
| drugs propofol | fixed_inconsistency | bbw contained stray editor text and >5 vs >4 mg/kg/h conflict → clean 'None' + label >5 mg/kg/h with practice cap 4 mg/kg/h; induction 1–2 → 2–2.5 mg/kg (<65 y) / 1–1.5 elderly | Diprivan PI (DailyMed) sections 2.2, 5.9 |
| drugs hydrocortisone-cc | fixed_inconsistency | highyield said APROCCHSS showed no mortality benefit (contradicting pearls) and used '2 vasopressors' trigger → APROCCHSS ↓ mortality, SSC ≥0.25 mcg/kg/min ≥4 h; 'tight' glycemic 140–180 corrected | Annane D et al. NEJM 2018 (APROCCHSS); Venkatesh B et al. NEJM 2018 (ADRENAL); SSC 2021 guidelines; NICE-SUGAR NEJM 2009 |
| drugs insulin-glargine | fixed_dose | dosing field had only U-100/U-300 conversion → adds label initiation doses (T2DM 0.2 units/kg or ≤10 units; T1DM ~1/3 TDD; NPH→glargine 80%); moa 'T1/2 ~24h' → duration ~24 h | Lantus PI (DailyMed) sections 2.3–2.4; Toujeo PI |
| drugs semaglutide | fixed_bbw | bbw had non-label clause ('not for routine obesity treatment') → label C-cell tumor box; indications field was only a 2025 add-on note → 2024 indications + 'Updated since 2024' (FLOW, MASH); ades listed only pancreatitis → full list; SELECT population corrected to established CVD; PIONEER 6 CV noninferior | Ozempic/Wegovy/Rybelsus PI (DailyMed); Lincoff AM et al. NEJM 2023 (SELECT); Husain M et al. NEJM 2019 (PIONEER 6); ADA Standards of Care 2024 |
| drugs empagliflozin | fixed_dose | renal said do not use for glycemic control at eGFR 20–44 and stop <20 → current label: not recommended for glycemic only if eGFR <30; HF/CKD initiate ≥20, continue until dialysis; ades listed only Fournier's → full list; EMPEROR-Preserved HR 0.79 not 25% | Jardiance PI (DailyMed) sections 1, 2, 8.6, 8.7; Anker SD et al. NEJM 2021 (EMPEROR-Preserved); KDIGO diabetes-in-CKD 2022 |
| drugs levothyroxine | fixed_fact | ddi said levothyroxine raises digoxin toxicity risk → digoxin levels fall as patient becomes euthyroid; TSH goal 0.5–2.5 for 'most patients' → reference range (0.5–2.5 for pregnancy planning) | Synthroid PI (DailyMed) Drug Interactions (digitalis glycosides); ATA hypothyroidism guideline 2014 |
| drugs levetiracetam | fixed_fact | ddi claimed probenecid raises levetiracetam ~70% (avoid) and an OCT metformin interaction → label: probenecid does not alter levetiracetam PK; ades listed only anaphylaxis/SJS → full ADE list | Keppra PI (DailyMed) section 12.3 Drug Interactions, section 5/6 |
| drugs fosphenytoin | fixed_bbw | boxed warning omitted pediatric rate limit → adds 2 mg PE/kg/min (or 150 mg PE/min, whichever slower) | Cerebyx PI (DailyMed) Boxed Warning |
| drugs nimodipine | fixed_dose | hepatic limited 30 mg q4h to Child-Pugh C → label: all cirrhosis 30 mg q4h; nonexistent 'NICE-SAH guidelines' → BRANT 1989/AHA 2023; capsule handling aligned with label (oral syringe only) | Nymalize PI (DailyMed, 2024) sections 2.4, 5.2; Pickard JD et al. BMJ 1989; Hoh BL et al. Stroke 2023 (AHA/ASA aSAH) |
| drugs enoxaparin | fixed_fact | pk SC bioavailability ~92% → ~100% per current label | Lovenox PI (DailyMed) section 12.3 |
| drugs hydroxyurea | fixed_dose | renal used non-label tiers (50% for CrCl 10–59, 75% for <10) → label 50% for CrCl <60 or ESRD; bbw updated to label 'Myelosuppression and Malignancies' (skin cancer, sun protection); highyield CBC interval reconciled with monitoring (q2 weeks during titration) | Droxia PI and Hydrea PI (DailyMed) Boxed Warning, section 2.2 |
| drugs albuterol | fixed_fact | SABA overuse threshold '>2 canisters/month' (far too permissive) → GINA ≥3 canisters/yr (≥1/month ↑ mortality); indications field lacked labeled indications (bronchospasm/COPD, EIB) → added | GINA 2024 report; Ventolin HFA / ProAir HFA PI (DailyMed) |
| drugs tiotropium | fixed_dose | Respimat asthma dose given as 5 mcg → 2.5 mcg (2×1.25); renal caution threshold CrCl <50 → <60 mL/min; highyield Respimat COPD dose 2.5 → 5 mcg and unsupported 'more CV data' claim corrected (TIOSPIR); t½ updated to label ~25 h | Spiriva HandiHaler PI (DailyMed) §5.6/8.6/12.3; Spiriva Respimat PI (DailyMed) §2; Wise R, NEJM 2013 (TIOSPIR) |
| drugs fluticasone-salmeterol | fixed_dose | COPD dose listed 250/50 or 500/50 → 250/50 only; GOLD B/D (outdated) → GOLD 2023–24 guidance discouraging ICS/LABA in COPD; strong CYP3A4 inhibitors 'contraindicated' → 'not recommended'; SMART pearl contradicted bbw and misquoted (doubled → ~4-fold) → corrected; TORCH NNH corrected; ades field lacked ADEs → added; inhaled bioavailability 1–2% → 5.5% | Advair Diskus PI (DailyMed, GSK) §1.2, 2.2, 5.9, 8.6, 12.3; FDA DSC 12/20/2017 (ICS/LABA boxed warning removal); Nelson HS, Chest 2006 (SMART); Calverley PM, NEJM 2007 (TORCH); GOLD 2024 report |
| drugs roflumilast | fixed_dose | Dosing said 'WITH food' → label 'with or without food'; monitoring and ades omitted the labeled weight-loss and most common ADE (diarrhea) → added | Daliresp PI (DailyMed, AstraZeneca) §2, 5.3, 6.1, 12.3 |
| drugs furosemide | fixed_bbw | Boxed warning blended non-boxed Warnings (thrombosis, embolism, deafness) into the box → actual Lasix boxed text, with the other risks attributed to Warnings; anuria contraindication added to renal | Lasix tablets PI (DailyMed, Validus) Boxed Warning, Contraindications, Warnings |
| drugs sodium-bicarbonate | fixed_fact | Cited nonexistent 'BAST trial' as proving CKD-progression benefit → de Brito-Ashurst/UBI vs negative BiCARB + KDIGO 2024 threshold; highyield said Ca²⁺ shifts into cells (contradicts ades) → binds albumin; acute 15–20 goal clarified vs CKD 22–26 target; ACC/AHA → AHA | BiCARB Study Group, BMC Med 2020; de Brito-Ashurst I, JASN 2009; KDIGO 2024 CKD Guideline rec 3.10; AHA 2020 ACLS guidelines |
| drugs sevelamer | fixed_dose | Starting-dose table was the old Renagel 400 mg scheme (3.5–5.5 → 800; 5.5–7.5 → 1200–1600) → Renvela label (>5.5–<7.5 → 800 mg TID; ≥7.5 → 1600 mg TID; titrate 800 mg/meal); warfarin wrongly listed as bound (label: no effect); separation timing harmonized to label 1 h before/3 h after; LANDMARK (a lanthanum trial) removed | Renvela PI (DailyMed, Genzyme) §2, 7, 12.3; Suki WN, Kidney Int 2007 (DCOR); Ogata H, JAMA 2021 (LANDMARK — lanthanum) |
| drugs pantoprazole | fixed_dose | Erosive esophagitis 40 mg BID → 40 mg once daily; PEPTIC misdescribed as IV vs PO trial → PPI vs H2RA SUP trial (+REVISE 2024); hepatic 'max 20 mg/day' (EU label) → US label no adjustment; atazanavir 'contraindicated' → only rilpivirine contraindicated | Protonix PI (DailyMed, Wyeth/Pfizer) §1, 4, 7, 8.7, 12.3; PEPTIC Investigators, JAMA 2020; Cook D, NEJM 2024 (REVISE) |
| drugs rifaximin | fixed_fact | Cyclosporine interaction called 'modest' → label 83-fold Cmax/124-fold AUC; 'modest' 20-fold hepatic exposure + missing Child-Pugh C caution fixed; peripheral edema 'rare' → most common HE ADE (15%); NNT 4.2 rounded up to 5; 'more effective than either alone' overstated → vs lactulose alone | Xifaxan PI (DailyMed, Salix) §5.4, 5.5, 6.1, 7.1, 8.7, 12.3, 14.2; Bass NM, NEJM 2010 |
| drugs lactulose | fixed_inconsistency | Grams/mL mismatch (25–30 g ≠ 30–45 mL) → 20–30 g; ades said over-laxation causes hyponatremia (contradicts highyield, label hypernatremia) → hypernatremia/hypokalemia; highyield stool target 2–4 vs 2–3 elsewhere → 2–3 (AASLD) | Lactulose solution PI (DailyMed); AASLD/EASL HE Practice Guideline 2014 |
| drugs sertraline | fixed_fact | Cimetidine 'doubles levels — avoid' → ~50% ↑, no adjustment (label); missing pimozide/disulfiram contraindications added; hepatic '50% reduction' lacked 'not recommended in moderate–severe' → label wording; 'wait 4 weeks before dose adjustment' contradicted label weekly titration → clarified | Zoloft PI (DailyMed, Viatris) §2.1, 2.4, 4, 7, 8.6, 12.3 |
| drugs quetiapine | fixed_fact | Listed nonexistent 'IM formulation' for agitation → removed; schizophrenia range 300–800 → IR max 750 (XR 800); fictional 'QUINTi trial' → BOLDER I/II; metabolic ranking omitted clozapine | Seroquel / Seroquel XR PI (DailyMed, AstraZeneca) §1, 2; Calabrese JR, Am J Psychiatry 2005 (BOLDER I); Thase ME, J Clin Psychopharmacol 2006 (BOLDER II) |
| drugs lithium | fixed_fact | Renal cutoffs 'CrCl 10–50 reduce by 25–75%, avoid <10' (garbled older guidance) → current label CrCl 30–89 start low/titrate, <30 not recommended; targets untouched (anchor) | Lithium carbonate PI (DailyMed) §2.5, 8.6 |
| drugs ondansetron | fixed_fact | Hepatic max 'IV' only → 8 mg total daily dose any route; highyield 'constipation most common' → headache most common (label) | Ondansetron tablets/injection PI (DailyMed) §2.2, 6.1 |
| drugs filgrastim | fixed_dose | Dosing field contained no dose → added label 5 mcg/kg/day (and other indications); FN threshold >20% → ≥20% (matches highyield/ASCO); loratadine falsely attributed to ASCO | Neupogen PI (DailyMed, Amgen) §2; Smith TJ, J Clin Oncol 2015 (ASCO WBC growth factor guideline) |
| drugs tacrolimus | fixed_bbw | BBW omitted Astagraf XL female-liver-transplant mortality and mislabeled XR non-interchangeability as boxed → corrected; dosing called Astagraf 'bioequivalent to IR' (contradicts non-interchangeability) → fixed; trough targets harmonized with Prograf label | Prograf PI (DailyMed, Astellas) Boxed Warning, §2; Astagraf XL PI (DailyMed) Boxed Warning, §5.3; Envarsus XR PI §2 |
| drugs mycophenolate | fixed_dose | Renal rule reversed (max 1 g BID in early post-op until graft function) → label: max 1 g BID only for GFR <25 outside immediate post-op, no adjustment for DGF; kidney dose 1–1.5 g BID → 1 g BID; CBC schedule → label weekly×1 month; conception washout 3 months → ≥6 weeks per label | CellCept PI (DailyMed, Genentech) Boxed Warning, §2, 5, 8.3; Mycophenolate REMS |
| drugs morphine | fixed_bbw | BBW listed 'CYP450 interactions' (not in morphine label) and omitted accidental ingestion/REMS → MS Contin boxed headings; indications listed only MI pain → added labeled pain indications; benzo 'majority of overdose deaths' overstated; CDC 2022 '≤3-day' limit (from 2016) corrected | MS Contin PI (DailyMed) Boxed Warning, §1, 4; Dowell D, MMWR 2022 (CDC opioid guideline) |
| drugs naloxone | fixed_dose | IN dose written '4 mg per nostril' (reads as 8 mg) → one 4 mg spray in one nostril; methylnaltrexone mislabeled as a naloxone formulation → naloxegol; FDA/CDC naloxone co-prescribing overstated → actual 2020 FDA / 2022 CDC wording | Narcan Nasal Spray Drug Facts/PI (DailyMed); FDA DSC 7/23/2020 (naloxone labeling); Dowell D, MMWR 2022 |
| drugs mesalamine | fixed_fact | Nephrotoxicity described as dose-dependent ('at high doses') → idiosyncratic, not dose-related; label renal-function evaluation wording | Lialda / Asacol HD PI (DailyMed) §5.1; Gisbert JP, Inflamm Bowel Dis 2007 (5-ASA nephrotoxicity review) |
| drugs azathioprine | fixed_bbw | BBW added 'serious infections' (not boxed) and omitted HSTCL → Imuran boxed text; moa said TPMT forms 6-TGN (contradicts pk) → HGPRT; monitoring lacked CBC schedule → label schedule; CPIC intermediate 'reduce 30–50%' → start 30–80%; febuxostat added | Imuran PI (DailyMed) Boxed Warning, Warnings, Precautions; Relling MV, Clin Pharmacol Ther 2019 (CPIC thiopurines) |
| drugs methylprednisolone | fixed_fact | Pearl 'not evidence-based for ARDS' was outdated by 2024 ATS/SCCM conditional recommendations → updated; septic-shock indication now points to hydrocortisone (consistent with pearls); NASCIS characterization corrected | Qadir N, AJRCCM 2024 (ATS ARDS guideline); Chaudhuri D, Crit Care Med 2024 (SCCM corticosteroid guideline); Villar J, Lancet Respir Med 2020 (DEXA-ARDS); Hurlbert RJ, Neurosurgery 2013 (AANS/CNS) |
| drugs montelukast | fixed_bbw | BBW said 'avoid in patients with psychiatric disorders' (not in label) and omitted the allergic-rhinitis restriction → Singulair boxed wording; 'drug of choice for AERD' overstated → add-on | Singulair PI (DailyMed, Organon) Boxed Warning, §1.3, 5.1; FDA DSC 3/4/2020 |
| drugs acetazolamide | fixed_dose | Indications listed only off-label metabolic alkalosis → labeled indications added; AMS prophylaxis '125–250 mg BID–TID' → 125 mg BID (WMS); hepatic 'use caution' contradicted pearls/label contraindication in cirrhosis; phenytoin mechanism corrected | Acetazolamide tablets PI (DailyMed) Indications, Contraindications, Precautions; Luks AM, Wilderness Environ Med 2019/2024 (WMS AMS guideline) |
| drugs erlotinib | fixed_fact | ILD incidence 3–4% → ~1% (label 0.7–1.1%); hepatic 'reduce dose' → label monitor/interrupt rules; smoking (CYP1A2) interaction added | Tarceva PI (DailyMed) §2, 5.1, 5.2, 7 |
| drugs levonorgestrel | fixed_fact | Most common ADE given as nausea → menstrual changes (label: heavier bleeding ~31% vs nausea ~14%); 165–175 lb cutoff (withdrawn EU Norlevo wording) → BMI ≥30 with conflicting data per ACOG/FDA | Plan B One-Step Drug Facts/PI (DailyMed); ACOG Practice Bulletin 152 (Emergency Contraception); FDA statement on LNG EC and weight, 2016 |

## 2. Post-2024 change sweep
1. **Change list.** 112 practice-changing updates published after the course (mid-2024 through October 2026) were each verified against the publisher, FDA, CDC/MMWR, or PubMed; 18 candidates that could not be verified were left out. The book's own source years were checked (GINA 2023, ADA Standards 2023, KDIGO 2021, GOLD 2023, AHS 2021), so 2024 items count as after the book.
2. **Sweep.** Eight reviewers searched every unit of study text (questions, options, rationales, flashcards, glossary, drugs, trials, drills, study guide, visuals, exam-strategy page) for each change, and added a note wherever an item would be answered differently under the newer guidance and no note existed.
3. **Conflicts.** Items teaching the newer guidance as the main answer without a note were returned to the book with the newer guidance as a note (clozapine REMS in Q408 and the exam-strategy page; GDMT sequencing; SGLT2 inhibitor perioperative hold; KDIGO 2024 SGLT2 inhibitor criteria in the CKD glossary entry and DAPA-CKD; anti-amyloid agents; ARDS corticosteroids; AD-MOCK-090 cUTI duration).

Notes added: 346 (quiz 59, flash 54, glossary 91, drugs 38, evidence 43, html 50, mock 11), plus 11 conflict resolutions and DKA resolution-criteria notes on 3 items. Items mentioning a change with no effect on the answer were left unannotated.

### Coverage by change

| ID | Change | Date | Candidates | Notes |
|---|---|---|---|---|
| C001 | acs-guideline-2025 | 2025-02 | 95 | 15 |
| C002 | hypertension-guideline-2025 | 2025-08 | 95 | 7 |
| C003 | finerenone-hfmref-hfpef | 2025-07 | 49 | 9 |
| C004 | hfpef-ecdp-2026 | 2026-07 | 60 | 8 |
| C005 | hfref-ecdp-2024 | 2024-03 | 91 | 5 |
| C006 | dyslipidemia-guideline-2026 | 2026-03 | 83 | 13 |
| C007 | andexanet-withdrawal | 2025-12 | 48 | 12 |
| C008 | inclisiran-monotherapy | 2025-07 | 0 | 0 |
| C009 | perioperative-guideline-2024 | 2024-09 | 21 | 2 |
| C010 | oral-semaglutide-cv-indication | 2025-10 | 53 | 6 |
| C011 | attr-cm-new-therapies | 2025-03 | 11 | 0 |
| C012 | apoc3-fcs-agents | 2025-11 | 9 | 0 |
| C013 | olezarsen-severe-htg | 2026-06 | 9 | 0 |
| C014 | aficamten-ohcm | 2025-12 | 5 | 2 |
| C015 | baxdrostat-hypertension | 2026-05 | 3 | 1 |
| C016 | idsa-amr-guidance-2024 | 2024-08 | 23 | 2 |
| C017 | idsa-amr-guidance-2026 | 2026-07 | 23 | 11 |
| C018 | idsa-cuti-guideline-2025 | 2025-07 | 30 | 3 |
| C019 | ats-cap-2025-steroids | 2025-07 | 28 | 6 |
| C020 | aztreonam-avibactam-approval | 2025-02 | 17 | 4 |
| C021 | new-oral-uuti-agents | 2025-03 | 12 | 3 |
| C022 | oral-gonorrhea-agents | 2025-12 | 8 | 2 |
| C023 | doxy-pep-cdc-2024 | 2024-06 | 10 | 1 |
| C024 | lenacapavir-prep | 2025-09 | 6 | 0 |
| C025 | dhhs-art-guidelines-2026 | 2026-09 | 12 | 3 |
| C026 | bictegravir-lenacapavir-approval | 2026-08 | 6 | 0 |
| C027 | bezlotoxumab-discontinued | 2025-01 | 22 | 2 |
| C028 | pcv-adults-50 | 2024-10 | 9 | 3 |
| C029 | rsv-vaccine-older-adults | 2025-04 | 5 | 1 |
| C030 | covid-vaccine-2025-2026 | 2025-10 | 5 | 1 |
| C031 | influenza-thimerosal-free | 2025-07 | 8 | 1 |
| C032 | flumist-self-administration | 2024-09 | 8 | 0 |
| C033 | menabcwy-penmenvy | 2025-04 | 11 | 0 |
| C034 | us-vaccine-recommendations-legal-status-2026 | 2026-03 | 26 | 4 |
| C035 | childhood-schedule-2026 | 2026-01 | 8 | 2 |
| C036 | hepb-birth-dose-scdm | 2025-12 | 5 | 0 |
| C037 | mmrv-under-4 | 2025-09 | 4 | 0 |
| C038 | clesrovimab-rsv-infants | 2025-06 | 5 | 0 |
| C039 | palivizumab-discontinued | 2025-12 | 2 | 1 |
| C040 | ssc-2026-resuscitation | 2026-03 | 91 | 15 |
| C041 | ssc-2026-antimicrobials | 2026-03 | 83 | 5 |
| C042 | stress-ulcer-prophylaxis-2024 | 2024-08 | 10 | 2 |
| C043 | padis-focused-update-2025 | 2025-03 | 59 | 7 |
| C044 | ards-corticosteroids-2024 | 2024-01 | 66 | 5 |
| C045 | ada-standards-2025 | 2024-12 | 60 | 8 |
| C046 | ada-standards-2026 | 2025-12 | 45 | 7 |
| C047 | hyperglycemic-crises-consensus-2024 | 2024-06 | 27 | 3 |
| C048 | tirzepatide-osa | 2024-12 | 12 | 2 |
| C049 | oral-semaglutide-obesity | 2025-12 | 10 | 2 |
| C050 | orforglipron-obesity | 2026-04 | 10 | 2 |
| C051 | insulin-icodec-approval | 2026-03 | 10 | 3 |
| C052 | gc-induced-adrenal-insufficiency-2024 | 2024-05 | 38 | 7 |
| C053 | vitamin-d-guideline-2024 | 2024-06 | 15 | 1 |
| C054 | ata-dtc-guideline-2025 | 2025-10 | 10 | 2 |
| C055 | kdigo-ckd-2024 | 2024-03 | 48 | 9 |
| C056 | semaglutide-ckd-t2d | 2025-01 | 30 | 8 |
| C057 | kdigo-anemia-2026 | 2026-01 | 10 | 2 |
| C058 | gold-2025 | 2024-11 | 34 | 7 |
| C059 | gold-2026 | 2025-11 | 36 | 10 |
| C060 | ensifentrine-copd | 2024-06 | 8 | 2 |
| C061 | copd-biologics-approvals | 2025-05 | 12 | 3 |
| C062 | gina-2024 | 2024-05 | 20 | 0 |
| C063 | gina-2025 | 2025-05 | 18 | 4 |
| C064 | gina-2026 | 2026-05 | 22 | 6 |
| C065 | depemokimab-asthma | 2025-12 | 8 | 3 |
| C066 | brensocatib-bronchiectasis | 2025-08 | 0 | 0 |
| C067 | nerandomilast-ipf | 2025-10 | 9 | 2 |
| C068 | tenecteplase-ais-approval | 2025-03 | 34 | 3 |
| C069 | ais-guideline-2026 | 2026-01 | 91 | 9 |
| C070 | stroke-primary-prevention-2024 | 2024-10 | 17 | 1 |
| C071 | ahs-cgrp-first-line-2024 | 2024-03 | 8 | 1 |
| C072 | asm-pregnancy-guideline-2024 | 2024-05 | 118 | 7 |
| C073 | mcdonald-criteria-2024 | 2025-09 | 15 | 1 |
| C074 | donanemab-approval-and-titration | 2025-07 | 14 | 0 |
| C075 | lecanemab-subcutaneous | 2026-07 | 5 | 1 |
| C076 | carbidopa-levodopa-b6 | 2026-03 | 19 | 6 |
| C077 | clozapine-rems-eliminated | 2025-06 | 16 | 1 |
| C078 | xanomeline-trospium | 2024-09 | 41 | 1 |
| C079 | benzodiazepine-tapering-guideline-2025 | 2025-06 | 30 | 6 |
| C080 | er-stimulants-under-6 | 2025-06 | 6 | 1 |
| C081 | esketamine-monotherapy | 2025-01 | 12 | 1 |
| C082 | lumateperone-adjunct-mdd | 2025-11 | 8 | 1 |
| C083 | acg-h-pylori-2024 | 2024-09 | 13 | 6 |
| C084 | semaglutide-mash-approval | 2025-08 | 5 | 0 |
| C085 | resmetirom-approval | 2024-03 | 0 | 0 |
| C086 | obeticholic-acid-withdrawal | 2025-09 | 0 | 0 |
| C087 | pbc-ppar-agonists | 2024-08 | 0 | 0 |
| C088 | acg-ibd-guidelines-2025 | 2025-06 | 17 | 5 |
| C089 | aasld-hbv-guideline-2025 | 2025-11 | 15 | 1 |
| C090 | asco-wbc-growth-factors-2026 | 2026-02 | 10 | 3 |
| C091 | suzetrigine-acute-pain | 2025-01 | 20 | 1 |
| C092 | opioid-labeling-2025 | 2025-07 | 25 | 4 |
| C093 | sublocade-rapid-initiation | 2025-02 | 6 | 2 |
| C094 | us-mec-spr-2024 | 2024-08 | 30 | 3 |
| C095 | mht-boxed-warning-removal | 2025-11 | 15 | 0 |
| C096 | fezolinetant-boxed-warning | 2024-12 | 70 | 0 |
| C097 | elinzanetant-vms | 2025-10 | 8 | 0 |
| C098 | acetaminophen-pregnancy-label | 2025-09 | 24 | 1 |
| C099 | beers-alternatives-list-2025 | 2025-07 | 40 | 8 |
| C100 | consort-2025 | 2025-04 | 7 | 1 |
| C101 | spirit-2025 | 2025-04 | 7 | 0 |
| C102 | dea-telemedicine-flexibilities-2026 | 2026-01 | 14 | 3 |
| C103 | biosimilar-interchangeability-guidance | 2025-10 | 15 | 3 |
| C104 | glp1-shortage-resolution-compounding | 2025-02 | 20 | 3 |
| C105 | iv-fluid-shortage-2024 | 2025-08 | 30 | 1 |
| C106 | medicare-drug-price-negotiation-2026 | 2026-01 | 22 | 1 |
| C107 | oral-phenylephrine-proposed-removal | 2024-11 | 14 | 0 |
| C108 | glp1-suicidality-warning-removed | 2026-01 | 38 | 2 |
| C109 | testosterone-labeling-2025 | 2025-02 | 5 | 0 |
| C110 | car-t-rems-eliminated | 2025-06 | 5 | 0 |
| C111 | voxelotor-withdrawal | 2024-09 | 3 | 1 |
| C112 | cetirizine-withdrawal-pruritus | 2025-05 | 23 | 0 |

Several changes have no notes because the site has no content on them (for example PrEP, PBC, MASH drugs, menopause therapy, CAR-T); they still appear on the What's changed page.

## 3. Other corrections found during the sweep
- COPD visual and study card used the retired GOLD A–D groups; now the book's GOLD 2023 A/B/E groups.
- Rifaximin NNT corrected to about 4; degludec duration set to the book's 24–42 hours.
- Amiodarone, sotalol, rivaroxaban and teriparatide notes relabeled as label differences.
- Podcasts and slides now state they reflect the 2024 material.

## Limits
This is an AI-assisted review, not a licensed pharmacist's sign-off. Study guide chapters, trial summaries, diagrams, podcasts and slides were swept for later changes but not independently fact-checked. Several 2025–2026 federal vaccine decisions are under a March 2026 court stay; affected notes say so. Readers can report suspected errors from every question and card.
