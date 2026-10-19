const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const fs=require('node:fs'),vm=require('node:vm'),bank=require('../assets/data/mock_exam.json'),engine=require('../app/mock-engine.js');
const ledger=require('../docs/reviews/2026-10-19-mock-item-review.json');
const item=n=>bank.find(q=>q.num===n),answer=n=>{const q=item(n);return q.choices[q.correctIdx];};
test('every reviewed item matches the audit record, engine edition and keyed explanation',()=>{
 assert.equal(ledger.items.length,150);assert.equal(ledger.edition,engine.REVISION);
 for(const q of bank){
  const record=ledger.items.find(r=>r.id===q.id);assert.ok(record,q.id);
  assert.equal(record.questionSha256,crypto.createHash('sha256').update(JSON.stringify(sort(q))).digest('hex'),q.id);
  assert.equal(q.provenance.revision,engine.REVISION);assert.equal(q.exp,q.optsExp[q.correctIdx]);
  assert.ok(q.sources.length>0&&q.sources.every(s=>s.url.startsWith('https://')&&s.scope&&s.accessed==='2026-10-19'));
  assert.equal(q.review.independentClinicalSignOff,false);
 }
});
// Canonical sorted-key UTF-8 JSON is shared with the review ledger.
function sort(q){return Object.fromEntries(Object.keys(q).sort().map(k=>[k,Array.isArray(q[k])?q[k].map(x=>x&&typeof x==='object'?sort(x):x):q[k]&&typeof q[k]==='object'?sort(q[k]):q[k]]));}
test('answer positions are balanced and professional practice has broader blueprint coverage',()=>{
 const counts=[0,0,0,0];bank.forEach(q=>counts[q.correctIdx]++);assert.ok(Math.max(...counts)-Math.min(...counts)<=1);
 for(const [sub,n] of [['3A',19],['3B',11],['3C',12]])assert.equal(bank.filter(q=>q.subdomain===sub).length,n);
});
test('clinical decisions retain renal, shock and contraindication distinctions',()=>{
 assert.match(answer(4),/^5 mg twice daily$/);assert.match(answer(38),/156 mg deltoid.*117 mg deltoid/);
 assert.match(answer(50),/cefepime plus vancomycin/);assert.match(answer(77),/Defer/);assert.match(answer(49),/Avoid rasburicase/);
 assert.match(answer(83),/PCC plus IV vitamin K/);assert.match(answer(13),/Fidaxomicin 200 mg/);
});
test('independently recomputed model, infusion and epidemiology calculations match the selected quantities',()=>{
 const num=n=>Number(answer(n).match(/[\d,]+(?:\.\d+)?/)[0].replaceAll(',',''));
 assert.equal(num(32),Math.min(60*80,4500));assert.equal(num(45),(30*21/3)/(200/5));
 assert.equal(num(55),1200*480/720);assert.equal(num(56),Math.round(4*.693*45/3));
 assert.equal(num(57),(.5*200/5)*4/.8);assert.equal(num(59),12*Math.log2(32/4));
 assert.equal(num(60),(12*75)/(18000/300));
 assert.match(answer(58),new RegExp((45*8)+' mg loading dose; '+(4*8)+' mg/h'));
 assert.match(answer(61),new RegExp((20*5/.4)+' mg loading; '+(2*5*12/.4)+' mg'));
 assert.match(answer(109),new RegExp('NNT '+Math.ceil(1/(.24-.18))));assert.match(answer(110),/25 over six months/);
 assert.equal(num(111),100*(.9*100)/(.9*100+.1*900));assert.equal(num(143),(42000-30000)/(.2));
 assert.match(answer(150),/10 to 15/);
});
test('old mock attempts stay intact and are not resumed/regraded against revised choices',()=>{
 const oldSession=engine.start(bank,'practice',Date.now());oldSession.revision='2026-10-19-mock-v1';
 const raw=JSON.stringify(oldSession),oldResult=JSON.stringify({revision:oldSession.revision,correct:37,total:50,date:'2026-10-19'});
 const records=new Map([['bcps_mock_session_20261019',raw],['bcps_mock_result_v1',oldResult]]);
 const panel={innerHTML:'',querySelector:()=>null},window={__mockExamData:bank,addEventListener:()=>{}};
 vm.runInNewContext(fs.readFileSync('app/mock-exam.js','utf8'),{window,BCPSMockEngine:engine,document:{getElementById:()=>panel},localStorage:{getItem:k=>records.get(k)||null,setItem:(k,v)=>records.set(k,v),removeItem:k=>records.delete(k)},setInterval:()=>{}});
 assert.match(panel.innerHTML,/earlier attempt is kept/);assert.match(panel.innerHTML,/37 \/ 50/);
 window.BCPS_startMock('practice');assert.ok(engine.validate(JSON.parse(records.get('bcps_mock_session_20261019_v2')),bank));
 assert.equal(records.get('bcps_mock_session_20261019'),raw);assert.equal(records.get('bcps_mock_result_v1'),oldResult);
});
