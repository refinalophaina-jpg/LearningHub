/* Inventory and triage, not automated clinical validation. */
const fs=require('node:fs');
const path=require('node:path');
const dir=path.join(__dirname,'../assets/data');
const banks=Object.fromEntries(fs.readdirSync(dir).filter(f=>f.endsWith('.json')).map(f=>[f,JSON.parse(fs.readFileSync(path.join(dir,f),'utf8'))]));
const q=banks['quiz.json'];
const report={date:'2026-10-19',status:'full-content-review-pending',counts:Object.fromEntries(Object.entries(banks).map(([k,v])=>[k,Array.isArray(v)?v.length:Object.keys(v).length])),mockDrafts:banks['mock_exam.json'].filter(x=>x.provenance?.status==='educational-draft').length,mockClinicalReview:'pending',replacementDrafts:q.flatMap((x,i)=>x.provenance?.reviewStatus==='draft'?[i]:[]),missingOptionRationales:q.flatMap((x,i)=>x.opts_exp.length===4?[]:[i]),chapterReferenceReview:q.flatMap((x,i)=>!/^Vol [12], Ch (?:[1-9]|1[0-2]):/.test(x.ref)&&!x.provenance?[i]:[]),note:'Indices are zero-based. Structural passes do not mean clinical review is complete. Free-form historical citations need manual verification; no inference of accuracy is made from a keyword match.'};
const out=path.join(__dirname,'../docs/reviews/2026-10-19-content-inventory.json');
fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({counts:report.counts,drafts:report.replacementDrafts.length,missingOptionRationales:report.missingOptionRationales.length,freeFormReferences:report.chapterReferenceReview.length,status:report.status},null,2));
