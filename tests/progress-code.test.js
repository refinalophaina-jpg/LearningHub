const test=require('node:test');
const assert=require('node:assert/strict');
const {decode,restore,capture,restoreSnapshot,readFile,makeFile}=require('../app/progress-code.js');
const code=data=>Buffer.from(JSON.stringify(data),'utf8').toString('base64');
const storage=(seed={})=>{
  const m=new Map(Object.entries(seed));
  return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),map:m};
};
const backup={v:4,studyRevision:'2026-10-19',sr:'{}',custom:'[]',quizSrs:JSON.stringify({10:{graduated:true}}),confidence:'[]',mockHistory:'[]',examDate:'2026-12-10'};
test('valid backup restores all supported records',()=>{
 const s=storage();restore(code(backup),s);
 assert.equal(s.getItem('bcps_quiz_srs_20261019'),backup.quizSrs);assert.equal(s.getItem('bcps_exam_date'),'2026-12-10');
});
test('malformed later records cannot partially overwrite existing progress',()=>{
 const old=JSON.stringify({existing:true}),s=storage({'bcps_sr_v2':old});
 assert.throws(()=>restore(code({...backup,confidence:'not json'}),s),/incomplete confidence/);
 assert.equal(s.getItem('bcps_sr_v2'),old);assert.equal(s.map.size,1);
});
test('storage failure rolls successful writes back',()=>{
 const old=JSON.stringify({existing:true}),s=storage({'bcps_sr_v2':old}),set=s.setItem;
 s.setItem=(k,v)=>{if(k==='bcps_custom_cards')throw Error('QuotaExceeded');set(k,v);};
 assert.throws(()=>restore(code(backup),s),/Previous progress was restored/);
 assert.equal(s.getItem('bcps_sr_v2'),old);assert.equal(s.map.size,1);
});
test('legacy v3 codes remain importable without question-revision records',()=>{
 assert.deepEqual(decode(code({v:3,sr:'{}',custom:'[]'})),[['bcps_sr_v2','{}'],['bcps_custom_cards','[]']]);
});
test('empty, unsupported, and invalid-date backups are rejected before writes',()=>{
 for(const invalid of [{v:4,studyRevision:'2099-01-01',sr:'{}'},{v:3},{...backup,examDate:'2026-02-30'},{...backup,custom:'{}'}]) assert.throws(()=>decode(code(invalid)));
});
test('a saved backup file restores Unicode cards and progress without code handling',()=>{
 const original={...backup,custom:JSON.stringify([{front:'β-blocker',back:'A patient’s note',topic:'Cardiology'}])};
 const file=makeFile(code(original)), parsed=readFile(file), s=storage();
 restore(parsed.code,s);assert.deepEqual(JSON.parse(s.getItem('bcps_custom_cards')),JSON.parse(original.custom));
});
test('undo returns missing fields to absent and preserves the exact previous snapshot',()=>{
 const s=storage({'bcps_sr_v2':'{"existing":true}'}),previous=capture(s);
 restore(code(backup),s);restoreSnapshot(previous,s);
 assert.deepEqual(capture(s),previous);assert.equal(s.map.size,1);
});
test('unrelated files give a useful error before restore',()=>{
 for(const text of ['hello','null','[]',JSON.stringify({shopping:['milk']})])assert.throws(()=>readFile(text));
});
