/* Portable annotations refer to normalized page coordinates in these exact PDFs. */
(function(root){
  'use strict';
  const KEY='bcps_pdf_study_v1';
  const BOOKS={
    'volume-1':{title:'Volume 1',pages:646,bytes:10849762,url:'books/bcps-2024-volume-1.pdf',fingerprint:'7543b22ea999456909a3acd5c7264523bb34ee7e18bb61600740334182e6d954'},
    'volume-2':{title:'Volume 2',pages:594,bytes:9574675,url:'books/bcps-2024-volume-2.pdf',fingerprint:'7080d38d6b751d779815ec319bd3e10ce6ea5f456c9d17f1ae15fe5e841abb99'}
  };
  const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
  const number=x=>Number.isFinite(x)&&x>=0&&x<=1;
  function valid(data){
    if(!object(data)||data.v!==1||!Object.hasOwn(BOOKS,data.activeBook)||!object(data.books))return false;
    return Object.entries(data.books).every(([id,b])=>{
      const spec=BOOKS[id];
      return spec&&object(b)&&b.fingerprint===spec.fingerprint&&Number.isInteger(b.page)&&b.page>=1&&b.page<=spec.pages&&[1,1.25,1.5,2].includes(b.zoom)&&number(b.scroll)&&Array.isArray(b.annotations)&&b.annotations.length<=10000&&new Set(b.annotations.map(a=>a?.id)).size===b.annotations.length&&b.annotations.every(a=>object(a)&&typeof a.id==='string'&&a.id.length<=100&&Number.isInteger(a.page)&&a.page>=1&&a.page<=spec.pages&&['highlight','note'].includes(a.type)&&['yellow','green','pink'].includes(a.color)&&typeof a.text==='string'&&a.text.length<=8000&&typeof a.note==='string'&&a.note.length<=4000&&Array.isArray(a.rects)&&a.rects.length<=300&&a.rects.every(r=>object(r)&&number(r.x)&&number(r.y)&&number(r.w)&&number(r.h)&&r.w>0&&r.h>0&&r.x+r.w<=1.001&&r.y+r.h<=1.001)&&(a.type!=='highlight'||a.rects.length>0));
    });
  }
  const empty=()=>({v:1,activeBook:'volume-1',books:{}});
  const freshBook=id=>({fingerprint:BOOKS[id].fingerprint,page:1,zoom:1,scroll:0,annotations:[]});
  function load(storage){const raw=storage.getItem(KEY);if(!raw)return empty();const value=JSON.parse(raw);if(!valid(value))throw Error('Saved PDF notes could not be read. Save a backup before restoring another copy.');return value;}
  function change(storage,id,fn){if(!BOOKS[id])throw Error('Choose an available volume.');const data=load(storage);data.activeBook=id;const book=data.books[id]||(data.books[id]=freshBook(id));fn(book);if(!valid(data))throw Error('These PDF notes could not be saved.');storage.setItem(KEY,JSON.stringify(data));return data;}
  root.BCPSPDFStore={KEY,BOOKS,valid,empty,freshBook,load,change};
  if(typeof module!=='undefined'&&module.exports)module.exports=root.BCPSPDFStore;
})(typeof window==='undefined'?globalThis:window);
