/* Standard PDF markup, generated locally. Original book bytes are never changed. */
(function(root){
  'use strict';
  const store=root.BCPSPDFStore||(typeof require==='function'?require('./pdf-store.js'):null);
  const colors={yellow:[1,211/255,43/255],green:[87/255,208/255,110/255],pink:[243/255,124/255,164/255]};
  function quad(rect,view){
    const [a,b,c,d,e,f]=view.transform,det=a*d-b*c;
    if(!Number.isFinite(det)||!det||!(view.width>0)||!(view.height>0))throw Error('Invalid PDF page coordinates.');
    const point=(x,y)=>{x=x*view.width-e;y=y*view.height-f;return [(d*x-c*y)/det,(-b*x+a*y)/det];};
    // PDF text markup uses visual top-left, top-right, bottom-left, bottom-right.
    return [point(rect.x,rect.y),point(rect.x+rect.w,rect.y),point(rect.x,rect.y+rect.h),point(rect.x+rect.w,rect.y+rect.h)].flat();
  }
  function bounds(quads){const x=[],y=[];for(const q of quads)for(let i=0;i<8;i+=2){x.push(q[i]);y.push(q[i+1]);}return [Math.min(...x),Math.min(...y),Math.max(...x),Math.max(...y)];}
  async function create({PDFLib,bytes,bookId,book,viewportForPage,onProgress=()=>{}}){
    if(!store.valid({v:1,activeBook:bookId,books:{[bookId]:book}}))throw Error('Saved PDF notes could not be read. Save a backup and try again.');
    const {PDFDocument,PDFName,PDFHexString}=PDFLib;
    const pdf=await PDFDocument.load(bytes,{updateMetadata:false});
    if(pdf.getPageCount()!==store.BOOKS[bookId].pages)throw Error('This PDF does not match your saved notes.');
    const context=pdf.context,views=new Map(),noteCounts=new Map(),notes=book.annotations;
    for(let index=0;index<notes.length;index++){
      const note=notes[index],page=pdf.getPage(note.page-1);
      if(!views.has(note.page))views.set(note.page,await viewportForPage(note.page));
      const view=views.get(note.page),color=colors[note.color],isHighlight=note.type==='highlight';
      let quads;
      if(isHighlight)quads=note.rects.map(r=>quad(r,view));
      else{
        // Separate note icons along the visual right margin; page notes have no text anchor.
        const n=noteCounts.get(note.page)||0;noteCounts.set(note.page,n+1);
        const w=Math.min(.04,20/view.width),h=Math.min(.04,20/view.height);
        quads=[quad({x:.94-(Math.floor(n/20)%10)*.045,y:.03+(n%20)*.045,w,h},view)];
      }
      const rect=bounds(quads),width=rect[2]-rect[0],height=rect[3]-rect[1];
      const commands=['q','/GS gs',color.join(' ')+' rg'];
      if(isHighlight){
        for(const q of quads){const p=i=>(q[i]-rect[0]).toFixed(5)+' '+(q[i+1]-rect[1]).toFixed(5);commands.push(p(0)+' m',p(2)+' l',p(6)+' l',p(4)+' l','h f');}
      }else{
        commands.push('0.7 0.7 '+(width-1.4)+' '+(height-1.4)+' re f','0.25 0.2 0.1 RG','1 w','0.7 0.7 '+(width-1.4)+' '+(height-1.4)+' re S');
        for(const fraction of [.3,.5,.7])commands.push((width*.2)+' '+(height*fraction)+' m '+(width*.8)+' '+(height*fraction)+' l S');
      }
      commands.push('Q');
      const appearance=context.register(context.flateStream(commands.join('\n'),{
        Type:'XObject',Subtype:'Form',FormType:1,BBox:[0,0,width,height],
        Resources:{ExtGState:{GS:{Type:'ExtGState',ca:isHighlight?.4:1,CA:isHighlight?.4:1,BM:isHighlight?'Multiply':'Normal'}}}
      }));
      const contents=isHighlight?(note.note?note.note+'\n\nHighlighted passage:\n'+note.text:note.text):(note.note||'Page note');
      const annotation={Type:'Annot',Subtype:isHighlight?'Highlight':'Text',Rect:rect,P:page.ref,
        Contents:PDFHexString.fromText(contents),T:PDFHexString.fromText('BCPS study notes'),
        NM:PDFHexString.fromText('bcps-'+note.id),C:color,F:4,AP:{N:appearance}};
      if(isHighlight){annotation.QuadPoints=quads.flat();annotation.CA=.4;}
      else{annotation.Name=PDFName.of('Note');annotation.Open=false;}
      page.node.addAnnot(context.register(context.obj(annotation)));
      onProgress(index+1,notes.length);
      // Let the progress label paint during a large export.
      if(index%25===24)await new Promise(resolve=>setTimeout(resolve,0));
    }
    return pdf.save({useObjectStreams:true,addDefaultPage:false,updateFieldAppearances:false});
  }
  root.BCPSPDFExport={create,quad};
  if(typeof module!=='undefined'&&module.exports)module.exports=root.BCPSPDFExport;
})(typeof window==='undefined'?globalThis:window);
