(function(){
  'use strict';
  const store=BCPSPDFStore, books=store.BOOKS, $=id=>document.getElementById(id);
  let active='volume-1',doc=null,docId=null,loading=null,renderTask=null,textTask=null,renderId=0,openId=0;
  let page=1,zoom=1,pending=null,allNotes=false,scrollTimer=null,saveFailed=false,undo=null;
  const canvas=$('pdfCanvas'),paper=$('pdfPaper'),textLayer=$('pdfTextLayer'),viewport=$('pdfViewport');
  let library;
  function state(){try{return store.load(localStorage);}catch(e){status(e.message,true);return null;}}
  function bookState(){const s=state();return s?(s.books[active]||store.freshBook(active)):null;}
  function status(message,error=false){$('pdfStatus').textContent=message;$('pdfStatus').classList.toggle('pdf-error',error);}
  function save(fn){try{store.change(localStorage,active,fn);saveFailed=false;status('Saved on this device · include notes with Save backup.');return true;}catch(e){saveFailed=true;status(e.message+' Keep this tab open.',true);return false;}}
  function refreshLibrary(){const s=state();if(!s)return;for(const id of Object.keys(books)){const b=s.books[id],el=document.querySelector('[data-book-progress="'+id+'"]');if(el)el.textContent=b?'Continue at page '+b.page+' · '+b.annotations.length+' saved notes/highlights':'646 pages';if(el&&!b)el.textContent=books[id].pages+' pages · '+(books[id].bytes/1048576).toFixed(1)+' MB';}}
  function rememberScroll(){clearTimeout(scrollTimer);if(!doc||docId!==active||!$('books').classList.contains('active'))return;const max=viewport.scrollHeight-viewport.clientHeight;const ratio=max>0?Math.min(1,Math.max(0,viewport.scrollTop/max)):0;save(b=>{b.page=page;b.zoom=zoom;b.scroll=ratio;});}
  function clearSelection(){pending=null;$('pdfHighlight').disabled=true;window.getSelection()?.removeAllRanges();}
  async function pdfLibrary(){if(!library)library=import('./vendor/pdfjs/pdf.min.mjs').then(lib=>{lib.GlobalWorkerOptions.workerSrc=new URL('./vendor/pdfjs/pdf.worker.min.mjs',document.baseURI).href;return lib;}).catch(e=>{library=null;throw e;});return library;}
  async function openBook(id){
    if(!books[id])return;rememberScroll();++renderId;renderTask?.cancel();textTask?.cancel();const token=++openId;active=id;clearSelection();undo=null;$('pdfUndo').hidden=true;
    $('pdfBook').value=id;$('pdfBookTitle').textContent='2024 ACCP · '+books[id].title;$('pdfOriginal').href=books[id].url;
    const b=bookState();if(!b)return;page=b.page;zoom=b.zoom;$('pdfZoom').value=String(zoom);
    $('pdfPage').max=books[id].pages;$('pdfPage').value=page;$('pdfTotal').textContent='of '+books[id].pages;renderNotes();
    if(docId===id&&doc){await renderPage(b.scroll);return;}
    docId=null;$('pdfPrev').disabled=true;$('pdfNext').disabled=true;$('pdfAddNote').disabled=true;$('pdfChapters').disabled=true;$('pdfLoading').hidden=false;paper.hidden=true;status('Loading '+books[id].title+'…');
    try{
      if(loading){await loading.destroy();loading=null;}
      if(doc){await doc.loadingTask.destroy();doc=null;}
      if(token!==openId)return;
      const lib=await pdfLibrary();if(token!==openId)return;
      loading=lib.getDocument({url:books[id].url,cMapUrl:'vendor/pdfjs/cmaps/',cMapPacked:true,standardFontDataUrl:'vendor/pdfjs/standard_fonts/',wasmUrl:'vendor/pdfjs/wasm/',isEvalSupported:false,enableXfa:false});
      loading.onProgress=({loaded,total})=>{if(token===openId)$('pdfLoading').textContent='Loading '+books[id].title+(total?' · '+Math.min(100,Math.round(100*loaded/total))+'%':'…');};
      const opened=await loading.promise;if(token!==openId){await opened.loadingTask.destroy();return;}doc=opened;docId=id;loading=null;
      if(doc.numPages!==books[id].pages)throw Error('The volume does not match its saved page references.');
      await loadOutline(token);await renderPage(b.scroll);
    }catch(e){if(token!==openId)return;$('pdfLoading').hidden=false;$('pdfLoading').textContent='The reader could not load this volume. Try again, or open the original PDF.';status('Could not load the PDF. Your saved notes are unchanged.',true);$('pdfRetry').hidden=false;console.warn('PDF reader:',e.message);}
  }
  async function loadOutline(token){
    const select=$('pdfChapters');select.replaceChildren(new Option('Jump to a chapter…',''));select.disabled=true;
    const outline=await doc.getOutline();if(token!==openId)return;const entries=[];
    function walk(items,depth=0){for(const item of items||[]){if(item.dest)entries.push({title:('— '.repeat(depth))+item.title.replace(/^\d+-\d+_/, '').replace(/[_ ]2024[_ ]R\d+$/, '').replace(/_/g,' ').replace('Upfront Matter','Front matter').replace(/^FEN$/,'Fluids, Electrolytes and Nutrition'),dest:item.dest});if(entries.length<1000)walk(item.items,Math.min(depth+1,3));}}walk(outline);
    entries.slice(0,1000).forEach((entry,index)=>{const option=new Option(entry.title,String(index));select.add(option);});select.disabled=!entries.length;
    select.onchange=async()=>{const entry=entries[Number(select.value)];if(select.value===''||!entry||!doc)return;try{const dest=typeof entry.dest==='string'?await doc.getDestination(entry.dest):entry.dest;if(!dest)return;const index=typeof dest[0]==='number'?dest[0]:await doc.getPageIndex(dest[0]);await go(index+1);}catch(_){status('This chapter link could not be opened. Use the page box.',true);}};
  }
  async function renderPage(scroll=0){
    if(!doc||docId!==active)return;const token=++renderId,currentDoc=doc;clearSelection();
    renderTask?.cancel();textTask?.cancel();$('pdfRetry').hidden=true;$('pdfLoading').hidden=false;$('pdfLoading').textContent='Opening page '+page+'…';paper.hidden=true;
    $('pdfPage').value=page;$('pdfPrev').disabled=page<=1;$('pdfNext').disabled=page>=doc.numPages;
    try{
      const lib=await pdfLibrary(),pdfPage=await currentDoc.getPage(page);if(token!==renderId||currentDoc!==doc)return;
      const natural=pdfPage.getViewport({scale:1});const width=Math.max(260,Math.min(viewport.clientWidth-32,1100));const scale=width/natural.width*zoom;
      const view=pdfPage.getViewport({scale});const ratio=Math.min(window.devicePixelRatio||1,2,Math.sqrt(8000000/(view.width*view.height)));
      canvas.width=Math.floor(view.width*ratio);canvas.height=Math.floor(view.height*ratio);canvas.style.width=view.width+'px';canvas.style.height=view.height+'px';
      paper.style.width=view.width+'px';paper.style.height=view.height+'px';paper.style.setProperty('--total-scale-factor',scale);paper.style.setProperty('--scale-round-x','1px');paper.style.setProperty('--scale-round-y','1px');
      textLayer.replaceChildren();textLayer.style.width=view.width+'px';textLayer.style.height=view.height+'px';
      renderTask=pdfPage.render({canvasContext:canvas.getContext('2d'),viewport:view,transform:ratio===1?null:[ratio,0,0,ratio,0,0]});await renderTask.promise;
      if(token!==renderId)return;textTask=new lib.TextLayer({textContentSource:pdfPage.streamTextContent(),container:textLayer,viewport:view});await textTask.render();
      if(token!==renderId)return;$('pdfLoading').hidden=true;paper.hidden=false;$('pdfAddNote').disabled=false;$('pdfPrev').disabled=page<=1;$('pdfNext').disabled=page>=doc.numPages;drawHighlights();renderNotes();
      const max=viewport.scrollHeight-viewport.clientHeight;viewport.scrollTop=Math.max(0,max)*scroll;viewport.scrollLeft=0;
      save(b=>{b.page=page;b.zoom=zoom;b.scroll=scroll;});refreshLibrary();
    }catch(e){if(token!==renderId||e.name==='RenderingCancelledException'||e.name==='AbortException')return;status('This page could not render. Try again or open the original PDF.',true);$('pdfLoading').textContent='Page unavailable';$('pdfRetry').hidden=false;}
  }
  async function go(n){const value=Number(n);if(!doc||!Number.isInteger(value)||value<1||value>doc.numPages){status('Enter a PDF page from 1 to '+books[active].pages+'.',true);$('pdfPage').value=page;return;}rememberScroll();page=value;await renderPage(0);}
  function drawHighlights(){
    const overlay=$('pdfHighlights');overlay.replaceChildren();const b=bookState();if(!b)return;
    for(const a of b.annotations.filter(x=>x.type==='highlight'&&x.page===page))for(const r of a.rects){const mark=document.createElement('span');mark.className='pdf-mark pdf-mark-'+a.color;Object.assign(mark.style,{left:r.x*100+'%',top:r.y*100+'%',width:r.w*100+'%',height:r.h*100+'%'});overlay.append(mark);}
  }
  function collectSelection(){
    const selection=window.getSelection();if(!selection||selection.isCollapsed||!selection.rangeCount)return;
    const range=selection.getRangeAt(0);if(!textLayer.contains(range.commonAncestorContainer))return;const text=selection.toString().trim().slice(0,8000);if(!text)return;
    const bounds=paper.getBoundingClientRect(),rects=[],seen=new Set();
    for(const rect of range.getClientRects()){
      const left=Math.max(bounds.left,rect.left),top=Math.max(bounds.top,rect.top),right=Math.min(bounds.right,rect.right),bottom=Math.min(bounds.bottom,rect.bottom);if(right-left<.5||bottom-top<.5)continue;
      const r={x:(left-bounds.left)/bounds.width,y:(top-bounds.top)/bounds.height,w:(right-left)/bounds.width,h:(bottom-top)/bounds.height},key=JSON.stringify(Object.values(r).map(x=>Math.round(x*100000)));
      if(!seen.has(key)){rects.push(r);seen.add(key);}if(rects.length===300)break;
    }
    if(rects.length){pending={book:active,page,text,rects};$('pdfHighlight').disabled=false;}
  }
  function addAnnotation(type){
    if(!doc||docId!==active)return;
    if(type==='highlight'&&(!pending||pending.book!==active||pending.page!==page)){status('Select text on this PDF page first.',true);return;}
    const a={id:crypto.randomUUID(),page,type,color:$('pdfColor').value,text:type==='highlight'?pending.text:'',note:'',rects:type==='highlight'?pending.rects:[]};
    if(!save(b=>b.annotations.push(a)))return;clearSelection();drawHighlights();renderNotes();
    if(type==='note')$('pdfNote-'+a.id)?.focus();
  }
  function renderNotes(){
    const list=$('pdfNotes'),b=bookState();list.replaceChildren();if(!b)return;
    const annotations=b.annotations.filter(a=>allNotes||a.page===page).slice().reverse();$('pdfNotesCount').textContent=allNotes?'Saved in this volume ('+annotations.length+')':'Saved on page '+page+' ('+annotations.length+')';
    if(!annotations.length){const p=document.createElement('p');p.className='pdf-empty';p.textContent=allNotes?'Your highlights and page notes will appear here.':'Select PDF text and choose Highlight, or add a page note.';list.append(p);return;}
    for(const a of annotations.slice(0,200)){
      const item=document.createElement('article');item.className='pdf-note';
      const head=document.createElement('div');head.className='pdf-note-head';const jump=document.createElement('button');jump.className='text-action';jump.textContent='Page '+a.page+' · '+(a.type==='highlight'?'Highlight':'Note');jump.onclick=()=>go(a.page);
      const remove=document.createElement('button');remove.className='text-action';remove.textContent='Remove';remove.setAttribute('aria-label','Remove '+a.type+' on page '+a.page);remove.onclick=()=>{let removed=null;if(save(book=>{removed=book.annotations.find(x=>x.id===a.id)||null;book.annotations=book.annotations.filter(x=>x.id!==a.id);})&&removed){undo={book:active,annotation:removed};$('pdfUndo').hidden=false;drawHighlights();renderNotes();}};head.append(jump,remove);item.append(head);
      if(a.text){const quote=document.createElement('blockquote');quote.textContent=a.text;item.append(quote);}
      const label=document.createElement('label');label.htmlFor='pdfNote-'+a.id;label.textContent=a.type==='highlight'?'Your comment':'Page note';const editor=document.createElement('textarea');editor.id=label.htmlFor;editor.value=a.note;editor.maxLength=4000;editor.rows=3;editor.placeholder='Write a note…';editor.oninput=()=>save(book=>{const stored=book.annotations.find(x=>x.id===a.id);if(stored)stored.note=editor.value;});item.append(label,editor);list.append(item);
    }
    if(annotations.length>200){const p=document.createElement('p');p.textContent='Showing the latest 200. Choose “This page” to see earlier entries by page.';list.append(p);}
  }
  window.BCPS_openBook=id=>{if(!books[id])return;active=id;switchSection('books');};
  $('pdfBook').onchange=()=>openBook($('pdfBook').value);
  $('pdfPageForm').onsubmit=e=>{e.preventDefault();go($('pdfPage').value);};
  $('pdfPrev').onclick=()=>go(page-1);$('pdfNext').onclick=()=>go(page+1);
  $('pdfZoom').onchange=()=>{rememberScroll();const b=bookState();zoom=Number($('pdfZoom').value);renderPage(b?.scroll||0);};
  $('pdfHighlight').onpointerdown=e=>e.preventDefault();$('pdfHighlight').onclick=()=>addAnnotation('highlight');$('pdfAddNote').onclick=()=>addAnnotation('note');
  $('pdfNotesScope').onchange=()=>{allNotes=$('pdfNotesScope').value==='all';renderNotes();};
  $('pdfUndo').onclick=()=>{if(!undo||undo.book!==active)return;const a=undo.annotation;if(save(b=>{if(!b.annotations.some(x=>x.id===a.id))b.annotations.push(a);})){undo=null;$('pdfUndo').hidden=true;drawHighlights();renderNotes();}};
  $('pdfRetry').onclick=()=>doc&&docId===active?renderPage():openBook(active);
  viewport.addEventListener('scroll',()=>{clearTimeout(scrollTimer);scrollTimer=setTimeout(rememberScroll,200);},{passive:true});
  document.addEventListener('selectionchange',collectSelection);
  window.addEventListener('bcps:before-backup',rememberScroll);
  window.addEventListener('bcps:backup-status',event=>{status(event.detail.text,event.detail.error);$('pdfLibraryStatus').textContent=event.detail.text;});window.addEventListener('pagehide',rememberScroll);
  window.addEventListener('storage',event=>{if(event.key===store.KEY){refreshLibrary();if(doc&&$('books').classList.contains('active')){drawHighlights();renderNotes();status('PDF notes refreshed from another tab.');}}});
  window.addEventListener('bcps:tab',event=>{if(event.detail==='books')requestAnimationFrame(()=>openBook(active));else if(event.detail==='study')refreshLibrary();});
  let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(doc&&$('books').classList.contains('active')){rememberScroll();renderPage(bookState()?.scroll||0);}},200);});
  const initial=state();if(initial)active=initial.activeBook;refreshLibrary();
})();
