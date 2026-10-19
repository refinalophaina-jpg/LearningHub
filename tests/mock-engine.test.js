const test=require('node:test'),assert=require('node:assert/strict');
const engine=require('../app/mock-engine.js'),bank=require('../assets/data/mock_exam.json');
test('dedicated mock bank contains 150 distinct original cases with complete option feedback',()=>{
 assert.equal(bank.length,150);assert.equal(new Set(bank.map(q=>q.stem)).size,150);
 assert.equal(new Set(bank.map(q=>q.id)).size,150);
 for(const q of bank){assert.equal(q.choices.length,4);assert.equal(new Set(q.choices).size,4);assert.equal(q.optsExp.length,4);assert.ok(q.correctIdx>=0&&q.correctIdx<4);assert.equal(q.provenance.kind,'original');}
});
test('full simulation has the intended domains and 25 simulated unscored items',()=>{
 const s=engine.start(bank,'simulation',1000,()=>0.35);assert.equal(s.items.length,150);assert.equal(s.minutes,225);
 assert.equal(s.items.filter(q=>q.pretest).length,25);
 const lookup=new Map(bank.map(q=>[q.id,q]));
 for(const [domain,total,trial] of [['Area 1',54,9],['Area 2',54,9],['Area 3',42,7]]){
  const group=s.items.filter(x=>lookup.get(x.id).domain===domain);assert.equal(group.length,total);assert.equal(group.filter(x=>x.pretest).length,trial);
 }
});
test('practice has 50 unique items with all items scored',()=>{
 const s=engine.start(bank,'practice',1000);assert.equal(s.items.length,50);assert.equal(s.minutes,75);assert.equal(s.items.filter(x=>x.pretest).length,0);
});
test('scoring excludes simulated pretest items but preserves all-item review',()=>{
 const s=engine.start(bank,'simulation',1000),lookup=new Map(bank.map(q=>[q.id,q]));
 s.items.forEach((item,i)=>{s.answers[i]=item.pretest?(lookup.get(item.id).correctIdx+1)%4:lookup.get(item.id).correctIdx;});
 const r=engine.score(s,bank,61000);assert.equal(r.total,125);assert.equal(r.correct,125);assert.equal(r.pct,100);assert.equal(r.allCorrect,125);assert.equal(r.review.length,150);
});
test('timer uses wall-clock elapsed time through reloads and breaks',()=>{
 const s=engine.start(bank,'simulation',1000);s.breakUsed=true;s.breakStartedAt=61000;
 assert.equal(engine.remaining(s,121000),225*60-120);assert.equal(engine.remaining(s,1000+225*60000),0);
 assert.equal(engine.validate(JSON.parse(JSON.stringify(s)),bank),true);
});
test('incomplete answers score as incorrect and malformed saved sessions are rejected',()=>{
 const s=engine.start(bank,'practice',1000);assert.equal(engine.score(s,bank,2000).correct,0);
 s.answers[0]=4;assert.equal(engine.validate(s,bank),false);delete s.answers[0];
 s.revision='old-quiz-bank';assert.equal(engine.validate(s,bank),false);
});

test('saved sessions reject malformed item and break state without throwing',()=>{
 const s=engine.start(bank,'simulation',1000);s.items[0]=null;assert.equal(engine.validate(s,bank),false);
 const t=engine.start(bank,'practice',1000);t.breakStartedAt=2000;t.breakUsed=true;assert.equal(engine.validate(t,bank),false);
});
