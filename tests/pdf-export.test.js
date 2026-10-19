const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const PDFLib=require('../app/vendor/pdf-lib/pdf-lib.min.js'),exporter=require('../app/pdf-export.js'),store=require('../app/pdf-store.js');
const {PDFDocument,PDFName,PDFArray,PDFDict}=PDFLib;
const rect={x:.1,y:.2,w:.3,h:.04};
const views=[
 {width:200,height:300,transform:[1,0,0,-1,-10,320]},
 {width:300,height:200,transform:[0,1,1,0,-20,-10]},
 {width:200,height:300,transform:[-1,0,0,1,210,-20]},
 {width:300,height:200,transform:[0,-1,-1,0,320,210]}
];
function annotations(pdf,page){return pdf.getPage(page-1).node.lookupMaybe(PDFName.of('Annots'),PDFArray)?.asArray().map(ref=>pdf.context.lookup(ref,PDFDict))||[];}
const text=(a,key)=>a.get(PDFName.of(key)).decodeText();
test('highlight coordinates respect cropped pages, every quarter-turn and user-unit scaling',()=>{
 const expected=[[30,260,90,260,30,248,90,248],[50,50,50,140,58,50,58,140],[190,80,130,80,190,92,130,92],[170,290,170,200,162,290,162,200]];
 views.forEach((view,i)=>{
  exporter.quad(rect,view).forEach((n,j)=>assert.ok(Math.abs(n-expected[i][j])<1e-8));
  const doubled={width:view.width*2,height:view.height*2,transform:view.transform.map(n=>n*2)};
  assert.deepEqual(exporter.quad(rect,doubled),exporter.quad(rect,view));
 });
 assert.throws(()=>exporter.quad(rect,{width:200,height:300,transform:[0,0,0,0,0,0]}),/coordinates/);
});
test('exports both complete volumes with native highlights, Unicode comments and page notes, preserving source annotations',async()=>{
 for(const bookId of Object.keys(store.BOOKS)){
  const source=fs.readFileSync('app/'+store.BOOKS[bookId].url),before=crypto.createHash('sha256').update(source).digest('hex');
  const original=await PDFDocument.load(source,{updateMetadata:false}),book=store.freshBook(bookId);
  book.annotations=[
   {id:'multi-line',type:'highlight',page:50,color:'green',text:'Selected β-blocker passage',note:'Review CrCl ≤30 mL/min — résumé ✓',rects:[rect,{...rect,y:.25}]},
   {id:'last-page',type:'note',page:store.BOOKS[bookId].pages,color:'pink',text:'',note:'Final page: compare options.',rects:[]}
  ];
  let progress=0;
  const bytes=await exporter.create({PDFLib,bytes:source,bookId,book,viewportForPage:()=>({width:612,height:792,transform:[1,0,0,-1,0,792]}),onProgress:done=>progress=done});
  const output=await PDFDocument.load(bytes,{updateMetadata:false});
  assert.equal(output.getPageCount(),original.getPageCount());assert.equal(output.getTitle(),original.getTitle());assert.equal(progress,2);
  for(let n=1;n<=original.getPageCount();n++){
   const count=pdf=>pdf.getPage(n-1).node.lookupMaybe(PDFName.of('Annots'),PDFArray)?.size()||0;
   assert.equal(count(output),count(original)+Number(n===50||n===book.annotations[1].page),'Preserve source annotations on page '+n);
  }
  const mark=annotations(output,50).find(a=>a.get(PDFName.of('NM'))?.decodeText()==='bcps-multi-line');
  assert.equal(mark.get(PDFName.of('Subtype')).toString(),'/Highlight');assert.equal(mark.lookup(PDFName.of('QuadPoints'),PDFArray).size(),16);
  assert.equal(text(mark,'Contents'),book.annotations[0].note+'\n\nHighlighted passage:\n'+book.annotations[0].text);
  assert.ok(mark.lookup(PDFName.of('AP'),PDFDict).get(PDFName.of('N')));
  const note=annotations(output,book.annotations[1].page).find(a=>a.get(PDFName.of('NM'))?.decodeText()==='bcps-last-page');
  assert.equal(note.get(PDFName.of('Subtype')).toString(),'/Text');assert.equal(text(note,'Contents'),book.annotations[1].note);
  assert.equal(crypto.createHash('sha256').update(source).digest('hex'),before);
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync('app/'+store.BOOKS[bookId].url)).digest('hex'),before);
 }
});
test('invalid notes and mismatched PDFs fail without altering study data',async()=>{
 const book=store.freshBook('volume-1'),before=JSON.stringify(book);
 const fixture=await PDFDocument.create();fixture.addPage();const bytes=await fixture.save();
 await assert.rejects(exporter.create({PDFLib,bytes,bookId:'volume-1',book}),/does not match/);
 assert.equal(JSON.stringify(book),before);
 book.annotations.push({id:'bad',page:1,type:'highlight',color:'yellow',text:'x',note:'',rects:[{x:2,y:0,w:1,h:1}]});
 await assert.rejects(exporter.create({PDFLib,bytes,bookId:'volume-1',book}),/could not be read/);
});
