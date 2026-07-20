# Drug & trial corrections — verified

`updated: 2026-07-20` · 135 corrections, each confirmed by a second independent adversarial PharmD/BCPS reviewer. Applied to `drug_db.json` (81 monographs) and `evidencedata.json` (101 trials).

Severity: 7 critical · 62 major · 66 minor.

## CRITICAL (7)

- **Ticagrelor** · `dosing` — Maintenance dose is inverted—the standard first-year ACS dose is 90 mg BID, not 60 mg BID, and the 60 mg dose applies only beyond 12 months (not to age >60 or weight <60 kg).  
  <sub>BRILINTA (ticagrelor) FDA prescribing information, 2024 label (accessdata.fda.gov/drugsatfda_docs/label/2024/022433s037lbl.pdf); DailyMed Brilinta.</sub>
- **Prasugrel** · `dosing` — Standard maintenance dose is 10 mg daily (not 5 mg), and there is no 5 mg loading dose—the loading dose is 60 mg for all eligible patients.  
  <sub>EFFIENT (prasugrel) FDA prescribing information (DailyMed); TRITON-TIMI 38. Standard: 60 mg load, 10 mg daily maintenance; 5 mg maintenance for <60 kg; age ≥75 generally not recommended.</sub>
- **Dronedarone** · `indications` — Lists 'HFrEF + AFib (reduced hospitalizations)' as an indication, but dronedarone is contraindicated in symptomatic HF/NYHA Class IV with recent decompensation (ANDROMEDA doubled mortality).  
  <sub>MULTAQ (dronedarone) FDA prescribing information — Indications and boxed warning; ANDROMEDA trial (terminated for excess mortality in symptomatic HF); PALLAS trial (permanent AF harm); DailyMed Multaq</sub>
- **Dronedarone** · `dosing` — Fabricates a '600 mg daily' reduced dose for HFrEF citing a non-existent 'SHIFT-AF' trial; dronedarone has only one dose (400 mg BID) and no HF-based reduction.  
  <sub>MULTAQ (dronedarone) FDA prescribing information, Dosage & Administration and Boxed Warning/Contraindications; ANDROMEDA trial (severe HF mortality); SHIFT trial studied ivabradine, not dronedarone.</sub>
- **Apixaban** · `dosing` — Dose-reduction age criterion is stated as age ≥60, but the labeled threshold is age ≥80; using ≥60 would inappropriately halve the dose in many AF patients, causing underdosing and stroke risk.  
  <sub>Eliquis (apixaban) US Prescribing Information, Dosage and Administration — Nonvalvular AF: reduce to 2.5 mg BID in patients with ≥2 of: age ≥80 years, body weight ≤60 kg, serum creatinine ≥1.5 mg/dL.</sub>
- **Nimodipine** · `bbw` — Boxed warning field is empty, but nimodipine carries an FDA boxed warning against IV/parenteral administration—a documented cause of fatal cardiovascular collapse.  
  <sub>FDA Nimodipine prescribing information (Nimotop capsules; Nymalize oral solution), Boxed Warning added 2006; DailyMed nimodipine labeling; FDA/ISMP medication-error safety alerts.</sub>
- **Clozapine Monitoring (REMS)** · `finding` — The card mislabels neutropenia severity thresholds: severe neutropenia is ANC <500, not <1000, and ANC 500-999 (moderate) calls for treatment interruption, not permanent discontinuation.  
  <sub>FDA Clozapine Shared REMS ANC monitoring algorithm (general population) and clozapine prescribing information (post-2015 revision).</sub>

## MAJOR (62)

- **Sacubitril/Valsartan** · `dosing` — Recommended starting dose in severe renal impairment (and moderate hepatic impairment) is 24/26 mg TWICE daily, not once daily as written.  
  <sub>Entresto (sacubitril/valsartan) Prescribing Information, Dosage & Administration, sections 2.3 (renal impairment) and 2.4 (hepatic impairment). FDA label: https://www.accessdata.fda.gov/drugsatfda_doc</sub>
- **Sacubitril/Valsartan** · `indications` — 'CKD progression reduction' is not an FDA-approved indication for Entresto, and the indication is now broader than HFrEF only.  
  <sub>Entresto (sacubitril/valsartan) US Prescribing Information, Indications and Usage (current label, post Feb 16 2021 expansion based on PARAGON-HF); pediatric indication approved Oct 2019 for patients ></sub>
- **Sacubitril/Valsartan** · `highyield` — Claim that Entresto is 'Only for HFrEF (EF <=40%); NOT for HFpEF' is outdated since the Feb 2021 FDA label expansion.  
  <sub>FDA/Novartis expanded indication Feb 16, 2021; current Entresto USPI: "reduce the risk of CV death and hospitalization for HF in adult patients with chronic HF. Benefits are most clearly evident in pa</sub>
- **Ivabradine** · `ddi` — Strong CYP3A4 inhibitors are CONTRAINDICATED with ivabradine, not merely capped at 2.5 mg BID; verapamil is a moderate (not strong) inhibitor to be avoided.  
  <sub>Corlanor (ivabradine) US Prescribing Information — Contraindications (concomitant strong CYP3A4 inhibitors) and Drug Interactions 7.1 (avoid verapamil/diltiazem); DailyMed setid 92018a65-38f6-45f7-91d</sub>
- **Ivabradine** · `highyield` — High-yield point tells students to 'cut dose by 50%' with strong CYP3A4 inhibitors, but these combinations are contraindicated.  
  <sub>Corlanor (ivabradine) US Prescribing Information, Amgen — Contraindications (concomitant strong CYP3A4 inhibitors) and Drug Interactions (avoid verapamil/diltiazem). https://www.pi.amgen.com/-/media/P</sub>
- **Eplerenone** · `trials` — Trials list contains a fabricated trial ('EMPHASIS-HF-Chronic'), a wrong-drug trial (RALES = spironolactone), and omits the pivotal post-MI trial EPHESUS.  
  <sub>EPHESUS: Pitt B, et al. NEJM 2003;348:1309-1321 (eplerenone post-MI HF). EMPHASIS-HF: Zannad F, et al. NEJM 2011;364:11-21 (eplerenone NYHA II HFrEF). RALES: Pitt B, et al. NEJM 1999;341:709-717 (spir</sub>
- **Carvedilol** · `indications` — CIBIS and MERIT-HF are cited as carvedilol mortality trials, but CIBIS studied bisoprolol and MERIT-HF studied metoprolol succinate.  
  <sub>CIBIS-II (Lancet 1999) tested bisoprolol; MERIT-HF (Lancet 1999) tested metoprolol CR/XL (succinate). Carvedilol HFrEF mortality benefit established by US Carvedilol Heart Failure Program (NEJM 1996),</sub>
- **Carvedilol** · `trials` — Trials list attributes bisoprolol (CIBIS) and metoprolol (MERIT-HF) trials to carvedilol.  
  <sub>CIBIS/CIBIS-II = bisoprolol; MERIT-HF = metoprolol succinate (established trial nomenclature; ACC/AHA/HFSA HF guidelines). Carvedilol pivotal trials: COPERNICUS (severe HFrEF), CAPRICORN (post-MI LV d</sub>
- **Carvedilol** · `highyield` — High-yield point cites MERIT-HF as evidence for carvedilol; MERIT-HF studied metoprolol succinate.  
  <sub>MERIT-HF, Lancet 1999;353:2001-07 (metoprolol CR/XL); COPERNICUS, NEJM 2001;344:1651-58 and US Carvedilol HF Program, NEJM 1996;334:1349-55 (carvedilol).</sub>
- **Metoprolol Succinate** · `dosing` — Heart failure target dose is stated as 190 mg daily; the correct MERIT-HF/Toprol-XL target maximum is 200 mg once daily.  
  <sub>Toprol-XL (metoprolol succinate ER) Prescribing Information, Heart Failure section; MERIT-HF trial (Lancet 1999). Target dose 200 mg once daily; start 25 mg (12.5 mg NYHA III/IV), double q2 weeks as t</sub>
- **Dronedarone** · `trials` — All three listed trials are incorrect: ARISTOTLE is an apixaban trial, and PAFAF/PERMANENT are not dronedarone trials.  
  <sub>Established dronedarone evidence base: ATHENA (NEJM 2009, ↓ CV hospitalization/death in AF), ANDROMEDA (NEJM 2008, halted for ↑ mortality in decompensated HF), PALLAS (NEJM 2011, harm in permanent AF)</sub>
- **Dronedarone** · `pearls` — Cites fabricated trial names (PAFAF 2008, PERMANENT 2011, SHIFT-AF) as evidence base instead of the real dronedarone trials.  
  <sub>Dronedarone (Multaq) prescribing information and pivotal trials: ATHENA (Hohnloser NEJM 2009), ANDROMEDA (Kober NEJM 2008), PALLAS (Connolly NEJM 2011).</sub>
- **Digoxin** · `renal` — States a post-dialysis supplemental dose while also (correctly) noting no HD removal; digoxin is not dialyzable, so a post-dialysis supplement is inappropriate and risks toxicity.  
  <sub>Digoxin PK: apparent Vd 5-7.3 L/kg with ~99.5% extravascular tissue distribution at steady state; HD (and peritoneal dialysis) removal is minimal/not beneficial (digoxin product labeling; Pharmacy Tim</sub>
- **Digoxin** · `dosing` — References 'AUC-guided dosing for CKD,' which is not a recognized digoxin dosing method—digoxin is weight/renal-function dosed and monitored by serum trough concentration, not AUC.  
  <sub>Lanoxin (digoxin) US prescribing information; ACC/AHA/HFSA HF guideline (target serum digoxin 0.5-0.9 ng/mL). AUC-guided dosing is the vancomycin monitoring paradigm, not applicable to digoxin.</sub>
- **Rivaroxaban** · `dosing` — AF dose-reduction threshold is wrong (CrCl 15-30) and an age/low-weight criterion is fabricated; the labeled cutoff for the 15 mg dose is CrCl 15-50, so CrCl 30-50 patients would be overdosed at 20 mg.  
  <sub>Xarelto (rivaroxaban) US Prescribing Information, Dosage and Administration — Nonvalvular Atrial Fibrillation: CrCl >50 mL/min = 20 mg once daily with the evening meal; CrCl 15-50 mL/min = 15 mg once </sub>
- **Rivaroxaban** · `renal` — Renal dosing threshold understated as CrCl 15-30; the 15 mg AF dose applies down to CrCl 15-50, so patients with CrCl 30-50 are incorrectly left at 20 mg.  
  <sub>Xarelto (rivaroxaban) US Prescribing Information, Dosage and Administration — Nonvalvular Atrial Fibrillation: CrCl >50 mL/min = 20 mg once daily with evening meal; CrCl 15–50 mL/min = 15 mg once dail</sub>
- **Edoxaban** · `dosing` — For AF, weight ≤60 kg and P-gp-inhibitor dose reductions are applied, but for NVAF the only labeled reduction is CrCl 15-50; the weight/P-gp criteria belong to VTE treatment, and misapplying them would underdose AF patients.  
  <sub>Savaysa (edoxaban) US Prescribing Information, Section 2.1 (Nonvalvular AF: reduce to 30 mg for CrCl 15-50 only) vs Section 2.2 (DVT/PE: reduce for CrCl 15-50, weight ≤60 kg, or certain P-gp inhibitor</sub>
- **Edoxaban** · `highyield` — States andexanet alfa is an FDA-approved reversal for edoxaban, which is false (Andexxa was only ever approved for apixaban/rivaroxaban), contradicts this item's own pearls, and is now moot because Andexxa was withdrawn from the US market.  
  <sub>FDA Andexxa label (indicated only for apixaban/rivaroxaban; edoxaban/betrixaban excluded, use is off-label); FDA Safety Communication "Update on the Safety of Andexxa by AstraZeneca" (voluntary US mar</sub>
- **Rivaroxaban** · `highyield` — Presents andexanet alfa (Andexxa) as the currently available specific antidote, but it was withdrawn from the US market in December 2025 for thromboembolic risk (2026 currency).  
  <sub>FDA Safety Communication "Update on the Safety of Andexxa by AstraZeneca" (fda.gov); AABB news 2025-12-23 "AstraZeneca Withdraws Factor Xa Reversal Agent From US Market"; Healio/Medscape/tctmd 2025-12</sub>
- **Apixaban** · `highyield` — Lists andexanet alfa (Andexxa) as the current specific reversal agent (also echoed in pearls), but Andexxa was withdrawn from the US market in December 2025 (2026 currency).  
  <sub>FDA Safety Communication "Update on the Safety of Andexxa (AstraZeneca)" (fda.gov); AABB news (2025-12-23) "AstraZeneca Withdraws Factor Xa Reversal Agent From US Market"; Medscape/Healio (Dec 2025) r</sub>
- **Rosuvastatin** · `ddi` — DDI section wrongly attributes rosuvastatin interactions to CYP3A4 inhibitors (ketoconazole, clarithromycin), contradicting the item's own PK note that rosuvastatin is not CYP3A4-metabolized, and omits the true transporter-mediated culprits.  
  <sub>Crestor (rosuvastatin) FDA prescribing information, Drug Interactions/Dosage sections: rosuvastatin excreted largely unchanged (~90%), CYP2C9 minor; cyclosporine ↑AUC 7× (limit 5 mg), gemfibrozil ↑AUC</sub>
- **Ezetimibe** · `highyield` — States ezetimibe is 'not effective if no gallbladder / less effective after cholecystectomy,' which is false — ezetimibe acts at the intestinal brush-border NPC1L1 transporter and does not require a gallbladder for efficacy.  
  <sub>ZETIA (ezetimibe) US prescribing information — MOA (NPC1L1 inhibition at enterocyte brush border) and drug-interaction section (dose ≥2h before/≥4h after bile acid sequestrants; cholestyramine reduces</sub>
- **Mavacamten** · `monitoring` — Echocardiographic LVEF monitoring schedule is wrong — there is no weekly echo monitoring; the label specifies echos at Weeks 4, 8, and 12 during titration then every 12 weeks (and every 6 months for stable maintenance patients per the 2025 update).  
  <sub>Camzyos (mavacamten) US Prescribing Information, packageinserts.bms.com/pi/pi_camzyos.pdf (2025); BMS/FDA April 2025 label update reducing echocardiography monitoring, news.bms.com and drugs.com/newdr</sub>
- **Mavacamten** · `dosing` — Maximum dose is understated — the label allows titration to 15 mg once daily (allowable doses 2.5, 5, 10, 15 mg), not a 10 mg ceiling.  
  <sub>Camzyos (mavacamten) US Prescribing Information, Dosage and Administration (accessdata.fda.gov 214998s010lbl, 2025); Drugs.com Camzyos dosage guide.</sub>
- **Vancomycin** · `bbw` — Fabricated boxed warning — standard IV vancomycin has NO boxed warning; ototoxicity/nephrotoxicity are Warnings & Precautions, not a boxed warning.  
  <sub>FDA vancomycin HCl injection labels (e.g., accessdata.fda.gov 213895s000lbl, 2021; DailyMed vancomycin hydrochloride injection); Baxter premixed vancomycin RTU label boxed warning for fetal toxicity d</sub>
- **Piperacillin-Tazobactam** · `highyield` — Misattributed trial — AKIKI is a renal-replacement-therapy timing trial, not a study of vancomycin + piperacillin-tazobactam nephrotoxicity.  
  <sub>Gaudry S et al. NEJM 2016 (AKIKI, RRT timing — misattributed); Qian ET et al. ACORN, JAMA 2023; Luther MK et al. Crit Care Med 2018 (vanc+TZP AKI meta-analysis).</sub>
- **Linezolid** · `trials` — Misattributed trial — the Wunderink 2012 CID linezolid-vs-vancomycin MRSA nosocomial pneumonia RCT is the ZEPHyR trial; ATTAIN refers to the telavancin HAP trials, not linezolid.  
  <sub>Wunderink RG et al. Clin Infect Dis 2012;54(5):621-629 (ZEPHyR); Rubinstein E et al. Clin Infect Dis 2011;52(1):31-40 (ATTAIN, telavancin HAP/VAP).</sub>
- **Voriconazole** · `bbw` — Voriconazole (VFEND) has no FDA boxed warning; hepatotoxicity, phototoxicity, and squamous cell carcinoma are Warnings and Precautions (Section 5), not a boxed warning.  
  <sub>DailyMed voriconazole label setid 67c174da-41b8-4738-8a22-dd814b8e96b8 and FDA VFEND PI accessdata NDA 021266s039 rev 1/2019: Highlights list no BOXED WARNING; items appear under Section 5 Warnings an</sub>
- **Norepinephrine** · `bbw` — Norepinephrine (LEVOPHED) has no FDA boxed warning; extravasation/tissue ischemia is a Warnings and Precautions item (5.1), not a boxed warning.  
  <sub>LEVOPHED (norepinephrine bitartrate) FDA prescribing information, accessdata 007513s045lbl (2020) and DailyMed setid 2c7dd2b0-cc10-4db6-bf56-6eb154ebeb10 — Highlights list no BOXED WARNING; extravasat</sub>
- **Propofol** · `bbw` — The monograph asserts a PROPOFOL INFUSION SYNDROME boxed warning, but Diprivan/propofol has no FDA boxed warning — PRIS appears under Warnings and Precautions.  
  <sub>DailyMed DIPRIVAN (propofol) label, section 5.9 "Risks of Propofol Infusion Syndrome in Patients with ICU Sedation" (Warnings and Precautions) — no Boxed Warning present; risk factor stated as propofo</sub>
- **Insulin Glargine** · `dosing` — The Lantus-to-Toujeo conversion is stated backwards — Lantus→Toujeo is unit-for-unit (1:1), and the ~20% reduction applies only in the reverse direction (Toujeo→Lantus U-100).  
  <sub>Toujeo (insulin glargine U-300) Prescribing Information, Dosage and Administration (Sanofi): initiate Toujeo at the same dose as prior once-daily U-100 glargine; reduce dose ~20% when switching from T</sub>
- **Semaglutide** · `indications` — Indications omit two 2025 expanded FDA approvals: Ozempic for CKD/CV-death risk reduction in T2DM+CKD (FLOW) and Wegovy for noncirrhotic MASH with F2–F3 fibrosis (ESSENCE).  
  <sub>FDA/Novo Nordisk press release, Jan 28, 2025 (Ozempic CKD sNDA approval, FLOW, 24% RRR): prnewswire.com/news-releases/fda-approves-ozempic-semaglutide-as-the-only-glp-1-ra...302362466.html; National K</sub>
- **Levothyroxine** · `bbw` — Boxed warning is mislabeled as cardiovascular toxicity in osteoporosis management; the actual BBW concerns use for obesity/weight loss.  
  <sub>Levothyroxine sodium (Synthroid) FDA prescribing information, Boxed Warning; DailyMed.</sub>
- **Alteplase (tPA)** · `pearls` — Describes tenecteplase as merely 'emerging' for stroke, but TNKase received FDA approval for acute ischemic stroke on 2025-03-03 (2026 currency).  
  <sub>FDA/Genentech approval of TNKase (tenecteplase) for acute ischemic stroke, March 2025 (Genentech press release March 3; broad news coverage March 6, 2025); AcT trial, Lancet 2022; AHA/ASA guidance. Co</sub>
- **Apixaban** · `indications` — Apixaban is not FDA-approved for VTE prophylaxis in medically ill patients, and the cited APEX trial studied betrixaban, not apixaban.  
  <sub>Eliquis (apixaban) US Prescribing Information (approved indications); APEX trial — Cohen AT et al., NEJM 2016 (betrixaban), NEJMoa1601747; ADOPT trial — Goldhaber SZ et al., NEJM 2011;365:2167-77 (api</sub>
- **Apixaban** · `trials` — APEX is listed as an apixaban VTE-prophylaxis trial, but APEX was a betrixaban trial.  
  <sub>APEX: Cohen AT et al. NEJM 2016;375:534-544 (NEJMoa1601747) — betrixaban in acutely medically ill. Apixaban approvals: ADVANCE-1/2/3 (orthopedic prophylaxis), AMPLIFY (Agnelli, NEJM 2013) and AMPLIFY-</sub>
- **Fluticasone/Salmeterol** · `bbw` — The FDA removed the boxed warning from ICS/LABA combination products (including Advair) on Dec 20, 2017; the current label carries only a Warning/Precaution, not a boxed warning.  
  <sub>FDA Drug Safety Communication 12/20/2017 (removal of Boxed Warning from ICS/LABA combination products: Advair Diskus/HFA, Symbicort, Dulera, Breo Ellipta, AirDuo); GSK press release "FDA approves US l</sub>
- **Roflumilast** · `pearls` — Roflumilast (Daliresp) has no boxed warning; psychiatric events are Warnings & Precautions, so labeling them 'BLACK BOX' is factually incorrect (the same error recurs in the ades and monitoring fields).  
  <sub>DALIRESP (roflumilast) FDA prescribing information, Warnings and Precautions section 5.1 (Psychiatric Events Including Suicidality); no Boxed Warning present. accessdata.fda.gov/drugsatfda_docs/label/</sub>
- **Roflumilast** · `ades` — Psychiatric adverse effects are parenthetically tagged as a boxed warning, but roflumilast has no boxed warning.  
  <sub>DALIRESP (roflumilast) FDA Prescribing Information, accessdata.fda.gov/drugsatfda_docs/label/2018/022522s009lbl.pdf — psychiatric events (insomnia, anxiety, depression, suicidality) appear under Secti</sub>
- **Furosemide** · `highyield` — High-yield bullet states continuous infusion is superior to bolus for severe HF, contradicting the DOSE trial (no difference) and the item's own pearls field.  
  <sub>Felker GM et al. Diuretic Strategies in Patients with Acute Decompensated Heart Failure (DOSE), NEJM 2011;364:797-805 — no significant difference in symptom AUC or serum creatinine between continuous </sub>
- **Filgrastim** · `dosing` — The pre-chemotherapy avoidance window is stated as 14 days before, contradicting both labeling and this monograph's own ddi/highyield fields (24 hours before).  
  <sub>Neupogen (filgrastim) US Prescribing Information, Dosage and Administration: do not administer filgrastim products in the 24-hour period before through 24 hours after administration of cytotoxic chemo</sub>
- **Morphine** · `highyield` — The "3-in-1 rule" describing morphine requiring three escalating doses to achieve analgesia is a fabricated mnemonic with no basis in pharmacology or guidelines.  
  <sub>CDC Clinical Practice Guideline for Prescribing Opioids for Pain (2022); WHO analgesic ladder; morphine sulfate immediate-release prescribing information (titrate to effect, individualize dosing)</sub>
- **Sertraline** · `highyield` — Sertraline does NOT have the shortest half-life/fastest washout among common SSRIs — fluvoxamine (~15–22h) and paroxetine (~21–24h) are shorter; this incorrect fact also appears in the pk field.  
  <sub>Standard SSRI PK: fluvoxamine t½ ~15–16h, paroxetine ~21h, sertraline ~26h (22–36h), citalopram ~35h, escitalopram ~27–32h; fluoxetine/norfluoxetine 4–16 days (US FDA labels; Hiemke/Baumann SSRI PK re</sub>
- **Lithium** · `bbw` — Lithium carries a U.S. Boxed Warning about toxicity being closely related to serum levels, but the monograph lists bbw as null.  
  <sub>FDA lithium carbonate prescribing information, Boxed Warning (DailyMed / accessdata.fda.gov; NDA 017812). Consistent across all current lithium carbonate/citrate labels in 2026.</sub>
- **Ondansetron** · `monitoring` — The stated single-dose ceiling is wrong; FDA limits any single IV dose to 16 mg (the 32 mg single IV dose was removed for QT/torsades risk), with 32 mg only as a 24-hour maximum.  
  <sub>FDA Drug Safety Communication (Dec 4, 2012), "Updated information on 32 mg intravenous ondansetron (Zofran) dose and pre-mixed ondansetron products"; Zofran (ondansetron) prescribing information.</sub>
- **Ondansetron** · `highyield` — High-yield point repeats the incorrect ceiling; the maximum single IV dose is 16 mg, not 32 mg.  
  <sub>FDA Drug Safety Communication (Dec 4, 2012), "Updated information on 32 mg intravenous ondansetron (Zofran) dose": single 32 mg IV dose withdrawn; no single IV dose >16 mg; CINV regimen 0.15 mg/kg IV </sub>
- **Levonorgestrel (Emergency Contraception)** · `area` — Therapeutic area is incorrectly listed as Infectious Disease for an emergency contraceptive progestin.  
  <sub>Plan B One-Step (levonorgestrel) FDA prescribing information — progestin indicated for emergency contraception; drug_db.json line 1719 currently lists area as "Infectious Disease".</sub>
- **SOLVD** · `endpoint` — The SOLVD Treatment trial's primary endpoint was all-cause mortality, not the composite 'Death or HF hospitalization' shown; the composite was a secondary outcome.  
  <sub>SOLVD Treatment, Yusuf et al., NEJM 1991;325:293-302 (PMID 2057034): primary endpoint all-cause mortality, 35.2% vs 39.7%, 16% RRR, 95% CI 5-26%, p=0.0036. Confirmed via NEJM/PubMed.</sub>
- **TOPCAT** · `finding` — Hyperkalemia was roughly doubled with spironolactone (18.7% vs 9.1%), not 5x higher.  
  <sub>Pitt B et al. TOPCAT. NEJM 2014;370:1383-92 (PMID 24716680): hyperkalemia (K+ >5.5 mmol/L) 18.7% spironolactone vs 9.1% placebo. Confirmed via NEJM and secondary analysis PMID 29572190.</sub>
- **ARISTOTLE** · `finding` — Primary stroke/SE reduction was 21% (HR 0.79), not 27%, and the p<0.001 shown applies to noninferiority — superiority p was 0.01.  
  <sub>Granger CB et al. Apixaban versus Warfarin in Patients with Atrial Fibrillation (ARISTOTLE). NEJM 2011;365:981-92 (PMID 21870978): primary outcome HR 0.79 (95% CI 0.66-0.95), 1.27% vs 1.60%/yr; P<0.00</sub>
- **TTM2** · `finding` — The card states the control arm received no fever management, but TTM2's normothermia arm actively treated fever with surface/intravascular cooling devices triggered at >=37.8C targeting <=37.5C.  
  <sub>Dankiewicz J, et al. Hypothermia versus Normothermia after Out-of-Hospital Cardiac Arrest. N Engl J Med 2021;384:2283-2294 (PMID 34133859).</sub>
- **POINT** · `drug` — POINT used a 600 mg clopidogrel loading dose and treated for 90 days; the 300 mg load and 21-day course actually describe the CHANCE regimen (which also matches the 21-day guideline recommendation).  
  <sub>POINT primary publication, Johnston SC et al., NEJM 2018;379:215-225 (clopidogrel 600 mg load, 75 mg daily, aspirin 50-325 mg, 90-day treatment). CHANCE (Wang Y et al., NEJM 2013;369:11-19) is the 300</sub>
- **AMPLIFY** · `impact` — Apixaban maintenance dosing is stated as once-daily, but apixaban for VTE is twice-daily throughout (QD is rivaroxaban's regimen).  
  <sub>Eliquis (apixaban) US Prescribing Information, DVT/PE treatment: 10 mg PO BID x7 days, then 5 mg PO BID. AMPLIFY trial (Agnelli et al., NEJM 2013;369:799-808).</sub>
- **HOKUSAI-VTE CANCER** · `finding` — Claims statistical superiority for recurrent VTE, but the recurrent-VTE difference was not statistically significant.  
  <sub>Raskob GE et al. Edoxaban for the Treatment of Cancer-Associated Venous Thromboembolism (HOKUSAI-VTE Cancer). NEJM 2018;378:615-624.</sub>
- **IMPACT** · `finding` — The exacerbation reduction comparators are reversed: triple therapy cut exacerbations 15% vs ICS/LABA and 25% vs LAMA/LABA, not the other way around.  
  <sub>Lipson DA, et al. NEJM 2018;378:1671-1680 (IMPACT). Triple vs FF/VI RR 0.85 (0.80-0.90); triple vs UMEC/VI RR 0.75 (0.70-0.81). PMID 29668286.</sub>
- **IMPACT** · `finding` — The all-cause mortality benefit is overstated (42%) with an incorrect p-value; the pre-specified ITT reduction vs LAMA/LABA was 28% (HR 0.72), p=0.042 — the 42% is the on-treatment HR 0.58 (p=0.011), not the headline result.  
  <sub>Lipson DA et al. Reduction in All-Cause Mortality with FF/UMEC/VI in COPD. Am J Respir Crit Care Med 2020;201:1508-1516 (IMPACT mortality analysis). ITT FF/UMEC/VI vs UMEC/VI HR 0.72 (0.53-0.99), p=0.</sub>
- **ABSSSI Trials (oritavancin/dalbavancin)** · `impact` — The 2-dose dalbavancin regimen is 1000 mg followed by 500 mg one week later; 1500 mg is the single-dose regimen, so '1500 mg then 500 mg' conflates the two and misstates a dose.  
  <sub>Dalvance (dalbavancin) US prescribing information (AbbVie): two-dose regimen = 1000 mg IV followed one week later by 500 mg IV; single-dose regimen = 1500 mg IV once. Consistent with DISCOVER 1/2 (100</sub>
- **IDSA CDI Guidelines 2021** · `impact` — Bezlotoxumab (Zinplava) was discontinued by Merck effective Jan 31, 2025 and is no longer marketed in the US, so recommending it for recurrence prevention no longer holds in 2026.  
  <sub>ASHP drug shortage/discontinuation notice (id=1130); Infectious Disease Advisor "C difficile Prevention Therapy Zinplava Discontinued" (2025); Medscape lists Zinplava as (DSC). Rebyota (FDA-approved N</sub>
- **Clozapine Monitoring (REMS)** · `finding` — The ANC monitoring frequency is wrong: monthly (every 4 weeks) monitoring begins after 12 months of continuous therapy, not after 6 months.  
  <sub>FDA Clozapine REMS shared monitoring program; clozapine prescribing information (ANC monitoring frequency: weekly 0-6 months, every 2 weeks 6-12 months, every 4 weeks after 12 months).</sub>
- **H. PYLORI ERADICATION Meta-analyses** · `impact` — The test-and-treat vs. endoscopy age rule is inverted: test-and-treat applies to patients <60 without alarm features, whereas ≥60 years or alarm symptoms warrant endoscopy, not test-and-treat.  
  <sub>ACG Management of Dyspepsia guideline, Moayyedi et al., Am J Gastroenterol 2017;112:988-1013 (co-endorsed AGA); reaffirmed in ACG 2022 uninvestigated dyspepsia guidance.</sub>
- **CLL11 / RESONATE** · `n` — CLL11 enrollment is misstated as 590; the trial randomized 781 patients (RESONATE's 391 is correct).  
  <sub>Goede V et al. Obinutuzumab plus chlorambucil in patients with CLL and coexisting conditions (CLL11). NEJM 2014;370:1101-1110 (NCT01010061), n=781. Byrd JC et al. Ibrutinib vs ofatumumab in previously</sub>
- **STOPP/START Criteria v3 2023** · `finding` — STOPP version 3 contains 133 criteria (PIMs), not 143 as stated.  
  <sub>O'Mahony D, et al. STOPP/START criteria for potentially inappropriate prescribing in older people: version 3. Eur Geriatr Med. 2023;14(4):625-632 (PMID 37387376; PMC10447584). Version 3: 133 STOPP + 5</sub>

## MINOR (66)

- **Sacubitril/Valsartan** · `trials` — DAPA-HF and EMPEROR-Reduced are SGLT2 inhibitor (dapagliflozin/empagliflozin) trials, not sacubitril/valsartan trials.  
  <sub>PARADIGM-HF (McMurray, NEJM 2014) and PARAGON-HF (Solomon, NEJM 2019) and PIONEER-HF (Velazquez, NEJM 2019) are sacubitril/valsartan trials; DAPA-HF (McMurray, NEJM 2019) tested dapagliflozin and EMPE</sub>
- **Spironolactone** · `ades` — Gynecomastia incidence stated as 20-50% conflicts with RALES-doses (~10%, matching this item's own high-yield) and is only that high at higher doses.  
  <sub>RALES (Pitt et al., NEJM 1999) — gynecomastia/breast pain ~10% in men at mean dose ~26 mg/day; dose-response data (Huffman 1978; Mosenkis & Townsend, J Clin Hypertens 2004): ~30% at 100 mg, ~62.5% at </sub>
- **Eplerenone** · `pearls` — Post-MI mortality benefit ('start within 2 weeks, mortality down') is attributed to EMPHASIS-HF, but that outcome comes from EPHESUS.  
  <sub>Pitt et al., EPHESUS, NEJM 2003;348:1309-21 (post-MI mortality); Zannad et al., EMPHASIS-HF, NEJM 2011;364:11-21 (chronic NYHA II HFrEF).</sub>
- **Eplerenone** · `ddi` — Strong CYP3A4 inhibitors are contraindicated per label (as this item's own highyield states), not merely 'avoid or monitor closely'.  
  <sub>Inspra (eplerenone) US Prescribing Information — Contraindications ("Do not use with strong CYP3A4 inhibitors") and Drug Interactions/Dosage (moderate CYP3A4 inhibitors: reduce starting dose to 25 mg </sub>
- **Carvedilol** · `pearls` — Rapid up-titration risk is stated as 'angioedema', which is not a beta-blocker titration hazard.  
  <sub>Coreg (carvedilol) US Prescribing Information — Dosage & Administration / Warnings: up-titrate slowly due to risk of worsening heart failure/fluid retention, bradycardia, and hypotension; angioedema i</sub>
- **Metoprolol Succinate** · `trials` — COPERNICUS is listed as a metoprolol trial, but COPERNICUS studied carvedilol.  
  <sub>Packer M, et al. Effect of carvedilol on survival in severe chronic heart failure (COPERNICUS). N Engl J Med. 2001;344:1651-1658. MERIT-HF Study Group. Metoprolol CR/XL in chronic heart failure (MERIT</sub>
- **Digoxin** · `monitoring` — Lists HF therapeutic target as 0.5-2.0 ng/mL, contradicting the modern lower target (0.5-0.9 ng/mL) stated in the item's own highyield section.  
  <sub>DIG trial post-hoc analysis (Rathore et al., JAMA 2003; digoxin 0.5-0.8 ng/mL lowest mortality, >=1.2 ng/mL increased mortality); ACC/AHA HF guidelines recommend 0.5-0.9 ng/mL in HFrEF.</sub>
- **Prasugrel** · `trials` — CHAMPION-PCI is a cangrelor trial, not a prasugrel trial.  
  <sub>TRITON-TIMI 38 (Wiviott NEJM 2007); TRILOGY ACS (Roe NEJM 2012); ACCOAST (Montalescot NEJM 2013) — all prasugrel trials. CHAMPION-PCI (Harrington NEJM 2009) evaluated cangrelor, not prasugrel.</sub>
- **Edoxaban** · `class` — Chemically mislabels edoxaban as an oxazolidinone; the oxazolidinone-scaffold factor Xa inhibitor is rivaroxaban, not edoxaban.  
  <sub>Established medicinal chemistry / Savaysa (edoxaban) prescribing information and drug-class references (e.g., DrugBank, Lexicomp): edoxaban is a tosylate salt of a tetrahydrothieno-pyridine/cyclohexan</sub>
- **Warfarin** · `ades` — Lists HIT (heparin-induced thrombocytopenia) as a warfarin adverse effect; HIT is caused by heparin, not warfarin.  
  <sub>Warfarin FDA label (adverse reactions: hemorrhage, skin necrosis/gangrene, purple toe syndrome; no HIT); ASH 2018 VTE/HIT guidelines and Coumadin PI — HIT is an anti-PF4/heparin immune reaction attrib</sub>
- **Clopidogrel** · `ddi` — Attributes reduced clopidogrel efficacy to ranitidine; ranitidine is not a meaningful CYP2C19 inhibitor (cimetidine is), and ranitidine was withdrawn from the US market in 2020 (NDMA).  
  <sub>Clopidogrel prodrug activation via CYP2C19 (Plavix PI); cimetidine is a known broad CYP inhibitor (incl. 2C19) whereas ranitidine is not; FDA April 2020 request to withdraw all ranitidine products (ND</sub>
- **Clopidogrel** · `highyield` — States CYP2C19 poor metabolizers are ~14% of the population without qualifier; ~14% reflects East Asian populations, whereas it is roughly 2-4% in Whites and Blacks.  
  <sub>FDA Plavix (clopidogrel) prescribing information, Pharmacogenomics/Boxed Warning: CYP2C19 poor-metabolizer prevalence ~2% Whites, ~4% Blacks, ~14% Chinese; CPIC clopidogrel-CYP2C19 guideline.</sub>
- **Rivaroxaban** · `indications` — Cites COMPASS as evidence for an ACS secondary-prevention indication; COMPASS studied stable CAD/PAD, and the ACS trial was ATLAS ACS 2-TIMI 51 (not FDA-approved in the US).  
  <sub>COMPASS trial (Eikelboom NEJM 2017) enrolled stable chronic CAD/PAD, excluding recent ACS; basis for US Xarelto label indication "chronic CAD or PAD" (2.5 mg BID + aspirin 81 mg). ATLAS ACS 2-TIMI 51 </sub>
- **Rosuvastatin** · `trials` — 'MOON' is not a real rosuvastatin trial; the GALAXY program trials are COMETS, LUNAR, MERCURY-I, SOLAR, STELLAR, etc.  
  <sub>LUNAR study (Limiting UNdertreatment of lipids in ACS with Rosuvastatin), part of AstraZeneca GALAXY program; PubMed 22360820 (Am J Cardiol 2012) and clinicaltrials.gov NCT00214630. No rosuvastatin tr</sub>
- **Alteplase (tPA)** · `indications` — Stroke window phrasing 'within 4.5h onset, or 3h if no prior thrombolysis' is confusing and inaccurate; the real distinction is the FDA 3h window vs the guideline-extended 3–4.5h window for selected patients.  
  <sub>Activase (alteplase) FDA prescribing information (3 h window for acute ischemic stroke); 2019 AHA/ASA Guidelines for Early Management of Acute Ischemic Stroke; ECASS III (3–4.5 h extended window with </sub>
- **Atorvastatin** · `highyield` — Lists amlodipine alongside diltiazem/clarithromycin as a CYP3A4 inhibitor conferring myopathy risk; amlodipine only mildly raises atorvastatin exposure, requires no dose limit, and is co-formulated with atorvastatin (Caduet).  
  <sub>Lipitor (atorvastatin) FDA prescribing information, Drug Interactions/Clinical Pharmacology (amlodipine 10 mg increases atorvastatin AUC ~15-18%, not clinically significant, no dose limit); Caduet (am</sub>
- **Hydralazine/Isosorbide Dinitrate** · `ades` — Lists 'hypothyroidism' as a hydralazine adverse effect; hydralazine is not associated with hypothyroidism (its class effects are drug-induced lupus and pyridoxine-responsive peripheral neuropathy).  
  <sub>Hydralazine FDA prescribing information (adverse reactions: SLE-like syndrome, peripheral neuritis/paresthesias evidenced by numbness/tingling, responsive to pyridoxine); DiPiro/pharmacotherapy refere</sub>
- **Evolocumab** · `dosing` — States 140 mg Q2wk and 420 mg Q4wk are 'equivalent' without noting that homozygous FH (a listed indication) requires 420 mg monthly and cannot use the 140 mg Q2wk regimen.  
  <sub>Repatha (evolocumab) FDA prescribing information, Dosage and Administration: HoFH 420 mg once monthly, or 420 mg every 2 weeks for patients on LDL apheresis (accessdata.fda.gov/drugsatfda_docs/label/2</sub>
- **Mavacamten** · `highyield` — CYP contraindication statement is outdated after the April 2025 label change, which reclassified moderate CYP2C19 inhibitors and strong CYP3A4 inhibitors from contraindications to manageable drug interactions.  
  <sub>FDA/BMS Camzyos (mavacamten) label update, April 17, 2025 (news.bms.com 2025; drugs.com newdrugs 6505; The Cardiology Advisor; HCPLive).</sub>
- **Mavacamten** · `pearls` — Initiation LVEF threshold is misstated as <50%; the label directs not to initiate or up-titrate if LVEF <55% (the <50% value is the on-treatment interruption threshold).  
  <sub>Camzyos (mavacamten) US Prescribing Information, ref 214998s010lbl (2025) — Boxed Warning ("Initiation ... LVEF <55% is not recommended. Interrupt CAMZYOS if LVEF is <50% at any visit") and Section 2.</sub>
- **Meropenem** · `highyield` — Backwards/contradictory wording — stating meropenem has a 'lower seizure threshold than other carbapenems' implies MORE seizures, the opposite of the intended (and correct) point that it is less epileptogenic than imipenem.  
  <sub>Meropenem PI (FDA-approved for bacterial meningitis) vs imipenem-cilastatin PI (higher seizure risk, not recommended for CNS infection); comparative carbapenem neurotoxicity data.</sub>
- **Norepinephrine** · `highyield` — SOAP II claim overstates mortality benefit — the trial showed no significant overall 28-day mortality difference vs dopamine; the mortality advantage was confined to the prespecified cardiogenic-shock subgroup, not septic shock.  
  <sub>De Backer D, et al. Comparison of dopamine and norepinephrine in the treatment of shock. NEJM 2010;362:779-789 (SOAP II).</sub>
- **Micafungin** · `highyield` — Implies a Child-Pugh C hepatic dose adjustment that is not label-supported and contradicts the monograph's own hepatic field (which correctly says no adjustment, minimal data for severe).  
  <sub>Mycamine (micafungin sodium) FDA prescribing information — Use in Specific Populations/Dosage: no dosage adjustment recommended for hepatic impairment; PK evaluated only in mild-to-moderate (Child-Pug</sub>
- **Semaglutide** · `ades` — Pancreatitis is incorrectly labeled a black box warning; the only boxed warning for semaglutide is thyroid C-cell tumors/MTC.  
  <sub>Ozempic/Wegovy/Rybelsus (semaglutide) FDA Prescribing Information — Boxed Warning limited to thyroid C-cell tumors/MTC; pancreatitis under Section 5 Warnings and Precautions (discontinue if suspected;</sub>
- **Vasopressin** · `dosing` — Central diabetes insipidus dosing is below labeled range for aqueous vasopressin (Pitressin), which is 5–10 units 2–4 times daily.  
  <sub>Pitressin (vasopressin) injection prescribing information — DI: 5–10 units SC/IM repeated 2–3 times daily as needed (per Drugs.com/RxList label summaries); desmopressin is the guideline-preferred agen</sub>
- **Empagliflozin** · `ades` — Fournier's gangrene is incorrectly labeled a 'black box warning'; SGLT2 inhibitors carry no boxed warning for it (consistent with the correctly empty bbw field).  
  <sub>Jardiance (empagliflozin) FDA prescribing information — Fournier gangrene listed under Warnings and Precautions; SGLT2 inhibitor class labeling (FDA Drug Safety Communication, Aug 2018) added it as a </sub>
- **Levetiracetam** · `ades` — Misspelling of Stevens-Johnson syndrome ('Steven-Johnson').  
  <sub>Keppra (levetiracetam) FDA prescribing information, Warnings and Precautions (serious dermatologic reactions; anaphylaxis and angioedema; DRESS/multiorgan hypersensitivity).</sub>
- **Fosphenytoin** · `pearls` — Garbled/misleading closing sentence implies fosphenytoin has reduced enzyme-inducing properties; after conversion to phenytoin it retains full CYP-inducing potency (as the DDI field correctly states).  
  <sub>Cerebyx (fosphenytoin) FDA prescribing information — Clinical Pharmacology (complete conversion to phenytoin) and Drug Interactions; phenytoin is a strong inducer of CYP3A4/2C9/2C19.</sub>
- **Nimodipine** · `highyield` — 'Do not hold for hypotension' contradicts the monograph's own monitoring section and label, which permit dose reduction (e.g., 30 mg q2h) for hypotension.  
  <sub>Nimodipine FDA prescribing information (DailyMed, oral solution) — standard 60 mg q4h ×21d, hepatic reduction 30 mg q4h; monograph's own dosing field ("If severe hypotension: 30 mg q2h, same total dai</sub>
- **Fluticasone/Salmeterol** · `ades` — ADE text asserts a current 'BLACK BOX WARNING (LABA)' on this combination product, which is outdated after the 2017 boxed-warning removal.  
  <sub>FDA Drug Safety Communication, 12/20/2017: "FDA review finds no significant increase in risk of serious asthma outcomes with LABAs used in combination with ICS" — boxed warning removed from ICS/LABA c</sub>
- **Apixaban** · `renal` — The ESRD dosing recommendation was based on a single-dose pharmacokinetic study, not RENAL-AF (which was terminated early and inconclusive).  
  <sub>Eliquis (apixaban) US Prescribing Information (ESRD/HD dosing added Jan 2014 on PK rationale); Wang X et al., J Clin Pharmacol 2016;56(5):628-636 (single-dose PK/PD in 8 ESRD-HD subjects, PMID 2633158</sub>
- **Albuterol** · `indications` — Calling SABA 'first-line reliever for all asthma patients' is outdated; GINA (2019 onward) recommends against SABA-only treatment and prefers an ICS-containing reliever (e.g., ICS-formoterol).  
  <sub>GINA 2025 Global Strategy for Asthma Management and Prevention (Nov 2025 update), ginasthma.org — SABA-only treatment not recommended for adults, adolescents, or children; Track 1 as-needed low-dose I</sub>
- **Roflumilast** · `monitoring` — Mood monitoring is twice attributed to a BLACK BOX warning that does not exist for this drug.  
  <sub>DALIRESP (roflumilast) FDA Prescribing Information, Section 5.2 Psychiatric Events Including Suicidality (Warnings & Precautions); label contains no Boxed Warning. DailyMed setid c9a1d0a8-581f-4f91-a2</sub>
- **Roflumilast** · `indications` — Indication references GOLD group D, but GOLD 2023 onward merged groups C and D into group E (A, B, E classification).  
  <sub>GOLD 2023 Executive Summary (PMC10111975; ERJ 2023;61:2300239) — ABCD reclassified to A, B, E; groups C and D merged into group E, defined as ≥2 moderate exacerbations or ≥1 leading to hospitalization</sub>
- **Quetiapine** · `ddi` — Garbled parenthetical inserts 'risperidone/quetiapine' into a sentence about CYP3A4 inhibitors, which is incoherent and mixes in an unrelated drug.  
  <sub>Seroquel (quetiapine) US prescribing information, Drug Interactions/Dosage: with chronic use of strong CYP3A4 inhibitors, reduce quetiapine dose to one-sixth. Risperidone is a CYP2D6 substrate, not im</sub>
- **Lactulose** · `trials` — 'SONIC trial' is not a lactulose/hepatic encephalopathy study; SONIC is the infliximab/azathioprine Crohn's disease trial (Colombel NEJM 2010).  
  <sub>Colombel JF et al, NEJM 2010;362:1383 (SONIC = infliximab/azathioprine in Crohn's); Bass NM et al, NEJM 2010;362:1071 (rifaximin HE RCT on lactulose background); Sharma P et al, Gastroenterology 2009;</sub>
- **Quetiapine** · `trials` — 'QUINTi trial' does not correspond to a known quetiapine bipolar-depression trial; the pivotal monotherapy trials are BOLDER I/II and EMBOLDEN I/II.  
  <sub>Calabrese et al. Am J Psychiatry 2005 (BOLDER I); Thase et al. J Clin Psychopharmacol 2006 (BOLDER II); Young et al. 2010 (EMBOLDEN I); McElroy et al. 2010 (EMBOLDEN II); Lieberman et al. NEJM 2005 (C</sub>
- **Ondansetron** · `ades` — The removal of the single 32 mg IV dose is attributed to 2011, but FDA removed the 32 mg single IV dose in December 2012 (the 2011 communication only warned of QT risk).  
  <sub>FDA Drug Safety Communication June 29, 2011 (QT prolongation warning) and December 4, 2012 (32 mg single IV dose no longer marketed due to serious cardiac/QT-torsades risk); recommended IV dose 0.15 m</sub>
- **Sertraline** · `pk` — Same erroneous "shortest washout of common SSRIs" claim in pk; also desmethylsertraline is only weakly/clinically negligibly active, not a meaningfully active metabolite.  
  <sub>Sertraline (Zoloft) US prescribing information (Clinical Pharmacology: t½ ~26 h; N-desmethylsertraline ~20-fold less active, clinically insignificant; multi-CYP N-demethylation); SSRI PK review PMC181</sub>
- **Morphine** · `indications` — CULPRIT-SHOCK is miscited as evidence of morphine harm in ACS; it studied culprit-lesion-only vs multivessel PCI and has nothing to do with morphine/P2Y12 interaction.  
  <sub>CULPRIT-SHOCK, Thiele et al., NEJM 2017 (culprit-lesion-only vs multivessel PCI in cardiogenic shock — no morphine content); IMPRESSION, Kubica et al., Eur Heart J 2016 (morphine attenuates/delays tic</sub>
- **Naloxone** · `highyield` — Seizures are not a feature of naloxone-precipitated opioid withdrawal; opioid withdrawal is non-life-threatening and does not typically cause seizures.  
  <sub>Clinical Opioid Withdrawal Scale (COWS), 11 items: pulse, sweating, restlessness, pupil size, bone/joint aches, rhinorrhea/lacrimation, GI upset, tremor, yawning, anxiety/irritability, gooseflesh (Sta</sub>
- **Azathioprine / 6-Mercaptopurine** · `monitoring` — Only TPMT testing is mentioned; current FDA labeling and CPIC guidance also recommend NUDT15 genotyping (major determinant of myelosuppression, especially in Asian/Hispanic patients).  
  <sub>CPIC Guideline for Thiopurine Dosing Based on TPMT and NUDT15 Genotype (2018 update, Clin Pharmacol Ther 2019); FDA azathioprine and mercaptopurine prescribing information (Pharmacogenomics/Warnings s</sub>
- **Erlotinib** · `pk` — Bioavailability statement is self-contradictory (states 60% 'with food' then 100% 'with food'), misrepresenting the food effect.  
  <sub>Tarceva (erlotinib) FDA prescribing information, Clinical Pharmacology/Dosage & Administration: absolute bioavailability ~60%, increased to nearly 100% with food; administer ≥1 hour before or 2 hours </sub>
- **Acetazolamide** · `indications` — Parenthetical for the metabolic alkalosis indication conflates the drug's acidifying effect with the condition being treated, which is confusing/misleading.  
  <sub>Acetazolamide (Diamox) prescribing information; standard carbonic anhydrase inhibitor pharmacology (Goodman & Gilman; UpToDate acetazolamide monograph).</sub>
- **ROCKET AF** · `finding` — The rates 1.7% vs 2.2%/yr are the per-protocol on-treatment result (HR 0.79); HR 0.88 is the ITT analysis (2.1% vs 2.4%/yr), so the rate/HR pairing is mismatched.  
  <sub>Patel MR et al. ROCKET AF. NEJM 2011;365:883-91 (PMID 21830957): per-protocol on-treatment primary endpoint 1.7 vs 2.2 events/100 pt-yr, HR 0.79 (95% CI 0.66-0.96); ITT 2.1 vs 2.4/yr, HR 0.88 (95% CI </sub>
- **ROCKET AF** · `pubmed` — PMID listed (21870978) is the ARISTOTLE paper, not ROCKET AF.  
  <sub>PubMed 21830957 = Patel MR et al., "Rivaroxaban versus warfarin in nonvalvular atrial fibrillation," N Engl J Med 2011;365:883-91 (ROCKET AF). PubMed 21870978 = Granger CB et al., "Apixaban versus war</sub>
- **ADRENAL** · `pubmed` — The PMID given (29490185) is APROCCHSS; the correct ADRENAL PMID is 29347874.  
  <sub>Venkatesh B et al. Adjunctive Glucocorticoid Therapy in Patients with Septic Shock (ADRENAL). NEJM 2018;378:797-808. PMID 29347874 (https://pubmed.ncbi.nlm.nih.gov/29347874/). Original PMID 29490185 =</sub>
- **SOAP-II** · `impact` — The renal-dose dopamine trial is miscited as 'DOPAMINE trial, BMJ 2000'; it was the ANZICS trial published in Lancet 2000.  
  <sub>ANZICS Clinical Trials Group (Bellomo R, et al.). Low-dose dopamine in patients with early renal dysfunction: a placebo-controlled randomised trial. Lancet 2000;356(9248):2139-43. PMID 11191537.</sub>
- **APROCCHSS** · `design` — APROCCHSS was analyzed as a two-group (hydrocortisone+fludrocortisone vs placebo) trial; the originally planned 2x2 factorial (with drotrecogin alfa) collapsed when that drug was withdrawn from the market.  
  <sub>Annane et al, Hydrocortisone plus Fludrocortisone for Adults with Septic Shock, NEJM 2018;378:809-818 (PMID 29490185); trial-design paper Ann Intensive Care 2016;6:43 (PMC4859323). Drotrecogin alfa (X</sub>
- **CREDENCE** · `impact` — SGLT2 inhibitors are continued until dialysis is initiated, not 'through dialysis'; they are neither indicated nor effective once a patient is dialysis-dependent.  
  <sub>Canagliflozin (INVOKANA) FDA label (accessdata.fda.gov/drugsatfda_docs/label/2020/204042s034lbl.pdf): contraindicated in eGFR <30 with ESRD/dialysis; albuminuria >300 mg/day may continue 100 mg daily </sub>
- **ACCORD-BP** · `design` — The ACCORD blood-pressure comparison was an open-label (transparent-treatment) randomized trial with blinded outcome adjudication, not double-blind.  
  <sub>ACCORD Study Group. Effects of Intensive Blood-Pressure Control in Type 2 Diabetes Mellitus. NEJM 2010;362:1575-1585.</sub>
- **CHEST VTE Guidelines 2021** · `subtitle` — Attributes the CHEST VTE guideline to ACCP/AHA, but the AHA is not a sponsor of the CHEST guideline.  
  <sub>Stevens SM et al. Antithrombotic Therapy for VTE Disease: Second Update of the CHEST Guideline and Expert Panel Report. Chest 2021;160(6):e545-e608 (PMID 34352278). Published by the American College o</sub>
- **SPRINT** · `finding` — The stated 2.5x increase in AKI overstates the observed effect size.  
  <sub>SPRINT Research Group, NEJM 2015;373:2103-2116 (serious AKI/ARF 4.1% vs 2.5%, HR 1.66, 95% CI 1.30-2.10); final report NEJM 2021;384:1921 (3.8% vs 2.3%, HR 1.64).</sub>
- **BRIDGE Trial** · `finding` — Arterial thromboembolism rates are attributed to the wrong arms (bridge vs no-bridge labels are swapped).  
  <sub>Douketis JD et al. BRIDGE. N Engl J Med 2015;373:823-833. ATE 0.4% no-bridging vs 0.3% bridging (P=0.01 for noninferiority).</sub>
- **CAST + ISIS-2** · `finding` — The absolute mortality percentages for CAST appear inaccurate, though the ~2.5x relative increase is correct.  
  <sub>CAST Investigators. Preliminary Report: Effect of Encainide and Flecainide on Mortality in a Randomized Trial of Arrhythmia Suppression after Myocardial Infarction. NEJM 1989;321:406-412 (total mortal</sub>
- **LIBERTY ASTHMA QUEST** · `finding` — FEV1 gain and the eos>=300 subgroup reduction are misstated: QUEST absolute FEV1 improvement was ~310 mL (200 mg) with placebo-adjusted difference ~130-190 mL, and the eos>=300 exacerbation reduction was 65.8%, not 68%.  
  <sub>Castro M, et al. Dupilumab Efficacy and Safety in Moderate-to-Severe Uncontrolled Asthma (LIBERTY ASTHMA QUEST). NEJM 2018;378:2486-2496. 200 mg q2w: annualized severe exacerbation rate 0.46 vs 0.87 (</sub>
- **ABSSSI Trials (oritavancin/dalbavancin)** · `impact` — 'Not active against VRE' is inaccurate as a blanket statement: oritavancin retains in vitro activity against vanA and vanB vancomycin-resistant enterococci (dalbavancin lacks vanA activity).  
  <sub>Arthur/JMI surveillance data (AAC 2012; J Antimicrob Chemother 2017;72:622) — oritavancin inhibits both vanA and vanB E. faecalis/faecium; comparative lipoglycopeptide reviews (Zhanel, Drugs 2010) — v</sub>
- **GOLD COPD Strategy 2024** · `finding` — GOLD 2023/2024 Group A is 'a bronchodilator' (short- or long-acting), not specifically a SABA, and Group B initial therapy is LABA+LAMA (dual), not 'LAMA or LAMA/LABA'; the framework is now ABE, so the ABCD label in endpoint/tags is outdated.  
  <sub>GOLD 2023/2024 Report, initial pharmacologic treatment table (Group A: a bronchodilator; Group B: LABA+LAMA); ABE assessment scheme replaced ABCD in the 2023 report. goldcopd.org; corroborated by AJMC</sub>
- **Surviving Sepsis Campaign 2021** · `impact` — SSC 2021 moved away from CVP and ScvO2 as resuscitation targets (favoring dynamic measures, capillary refill, and lactate clearance), so listing CVP/ScvO2 as current individualized endpoints is outdated.  
  <sub>Evans L et al. Surviving Sepsis Campaign 2021, Crit Care Med 2021;49:e1063-e1143 (PMID 34599691): recommends dynamic parameters, capillary refill time, and lactate-guided resuscitation; CVP/ScvO2 (Riv</sub>
- **POLARIS / ASTRAL Trials** · `drug` — Sofosbuvir/ledipasvir (Harvoni) was not studied in the POLARIS or ASTRAL programs; POLARIS evaluated sofosbuvir/velpatasvir/voxilaprevir (Vosevi) and sof/vel, while Harvoni was studied in the ION trials.  
  <sub>Feld/Foster ASTRAL sof/vel NEJM 2015 (PMID 26575258); Bourlière POLARIS-1/-4 sof/vel/vox NEJM 2017 (PMID 28564569); Afdhal ION-1 ledipasvir/sofosbuvir NEJM 2014 (PMID 24725239); AASLD/IDSA HCV Guidanc</sub>
- **GEMINI 1+2** · `impact` — Stating vedolizumab carries 'No TB reactivation risk' overstates its safety; risk is markedly lower than anti-TNFs but not absent, and TB screening is still recommended per label.  
  <sub>Entyvio (vedolizumab) US Prescribing Information (FDA label, 2024; accessdata.fda.gov/drugsatfda_docs/label/2024/125476s060s061lbl.pdf) — evaluate for TB prior to initiation, serious infections includ</sub>
- **STAR*D** · `finding` — The 67% cumulative remission figure is the original theoretical/estimated value and has been challenged by reanalyses reporting a substantially lower real-world cumulative remission.  
  <sub>Rush AJ et al. Am J Psychiatry 2006;163:1905-1917 (PMID 16554526) reported ~67% cumulative remission; Pigott HE et al. BMJ Open 2023;13:e063095 protocol-fidelity reanalysis reported ~35% (1,089/3,110)</sub>
- **Tacrolimus TDM Guidelines** · `design` — The 2019 second consensus report on tacrolimus TDM was produced by IATDMCT, not the non-existent abbreviation 'ITAS'.  
  <sub>Brunet M, van Gelder T, Asberg A, et al. Therapeutic Drug Monitoring of Tacrolimus-Personalized Therapy: Second Consensus Report. Ther Drug Monit 2019;41(3):261-307 (PMID 31045868), issued by the Immu</sub>
- **HYVET** · `endpoint` — The primary endpoint was fatal or nonfatal stroke (any stroke), not fatal stroke alone; fatal stroke was a secondary endpoint.  
  <sub>Beckett NS et al. Treatment of Hypertension in Patients 80 Years of Age or Older (HYVET). NEJM 2008;358:1887-1898.</sub>
- **CDC Opioid Prescribing Guidelines 2022** · `finding` — The 2022 CDC guideline deliberately removed the rigid numeric MME thresholds; presenting 'caution ≥50 / avoid >90 MME without specialist' as current guidance restates the superseded 2016 hard-limit framing.  
  <sub>CDC Clinical Practice Guideline for Prescribing Opioids for Pain — United States, 2022, MMWR RR7103 (PMID 36327391), cdc.gov/mmwr/volumes/71/rr/rr7103a1.htm — states dosage thresholds should not be ap</sub>
- **Adaptive and Pragmatic Trial Design** · `year` — The pivotal FDA 'Adaptive Designs for Clinical Trials of Drugs and Biologics' guidance was finalized in November 2019, not 2020.  
  <sub>Federal Register notice of availability for "Adaptive Designs for Clinical Trials of Drugs and Biologics; Guidance for Industry" dated Dec 2, 2019 (2019-25986); FDA finalized the guidance in November </sub>

