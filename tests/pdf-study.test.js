const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const store=require('../app/pdf-store.js'),backup=require('../app/progress-code.js');
const storage=()=>{const map=new Map();return {getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k)};};
const annotation={id:'example',type:'highlight',page:42,color:'yellow',text:'Selected β-blocker passage',note:'Review renal dosing',rects:[{x:.1,y:.2,w:.3,h:.015}]};
const encode=x=>Buffer.from(JSON.stringify(x)).toString('base64');
test('PDF notes and reading position survive a portable backup and exact undo',()=>{
 const first=storage();store.change(first,'volume-1',b=>{b.page=42;b.zoom=1.5;b.scroll=.4;b.annotations.push(annotation);});
 const raw=first.getItem(store.KEY),file=backup.makeFile(encode({v:4,studyRevision:'2026-10-19',pdfStudy:raw,currentMockSession:'{"revision":"2026-10-19-mock-v2"}',mockSession:'{"revision":"2026-10-19-mock-v1"}'}));
 const second=storage(),before=backup.capture(second);backup.restore(backup.readFile(file).code,second);
 assert.equal(second.getItem(store.KEY),raw);assert.equal(store.load(second).books['volume-1'].annotations[0].text,annotation.text);
 assert.match(second.getItem('bcps_mock_session_20261019_v2'),/mock-v2/);assert.match(second.getItem('bcps_mock_session_20261019'),/mock-v1/);
 backup.restoreSnapshot(before,second);assert.equal(second.getItem(store.KEY),null);
});
test('updates preserve the other volume and merge the latest stored notes',()=>{
 const s=storage();store.change(s,'volume-1',b=>b.annotations.push(annotation));store.change(s,'volume-2',b=>{b.page=75;});
 store.change(s,'volume-1',b=>{b.page=43;});const d=store.load(s);assert.equal(d.books['volume-2'].page,75);assert.equal(d.books['volume-1'].annotations[0].id,'example');
});
test('invalid page geometry, editions and oversized notes cannot overwrite good progress',()=>{
 const s=storage();store.change(s,'volume-1',b=>b.annotations.push(annotation));const good=s.getItem(store.KEY);
 for(const alter of [b=>b.page=647,b=>b.fingerprint='different-file',b=>b.annotations[0].rects[0].w=2,b=>b.annotations[0].note='x'.repeat(4001),b=>b.annotations.push({...b.annotations[0]})]){
  const d=JSON.parse(good);alter(d.books['volume-1']);assert.equal(store.valid(d),false);
  assert.throws(()=>backup.restore(encode({v:4,studyRevision:'2026-10-19',pdfStudy:JSON.stringify(d)}),s),/invalid PDF notes/);assert.equal(s.getItem(store.KEY),good);
 }
 const d=store.empty();d.activeBook='toString';assert.equal(store.valid(d),false);
});
test('PDF note storage failure is surfaced without erasing the previous saved copy',()=>{
 const s=storage();store.change(s,'volume-1',b=>b.page=42);const good=s.getItem(store.KEY);s.setItem=()=>{throw Error('QuotaExceeded');};
 assert.throws(()=>store.change(s,'volume-1',b=>b.page=43),/Quota/);assert.equal(s.getItem(store.KEY),good);
});
test('both published books exactly match the permission and fingerprint manifest',()=>{
 const manifest=require('../docs/reviews/2026-10-19-pdf-publication.json');assert.equal(manifest.length,2);
 for(const m of manifest){const data=fs.readFileSync('app'+m.path);assert.equal(data.length,m.bytes);assert.equal(crypto.createHash('sha256').update(data).digest('hex'),m.sha256);assert.equal(store.BOOKS[m.id].fingerprint,m.sha256);assert.ok(m.authorization);assert.ok(data.subarray(0,5).equals(Buffer.from('%PDF-')));}
});
