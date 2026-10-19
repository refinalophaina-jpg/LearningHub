/* Pure simulation rules. Content and the visual shell are separate. */
(function (root) {
  'use strict';
  const REVISION = '2026-10-19-mock-v1';
  function shuffle(values, random) {
    const list = values.slice();
    for (let i=list.length-1;i>0;i--) { const j=Math.floor(random()*(i+1)); [list[i],list[j]]=[list[j],list[i]]; }
    return list;
  }
  function start(bank, mode, now=Date.now(), random=Math.random) {
    if (!['simulation','practice'].includes(mode)) throw new Error('Choose a simulation or practice session.');
    const full=mode==='simulation', counts=full?[54,54,42]:[18,18,14], trial=full?[9,9,7]:[0,0,0];
    const items=[];
    counts.forEach((count,index)=>{
      const group=shuffle(bank.filter(q=>q.domain==='Area '+(index+1)),random);
      if (group.length<count) throw new Error('The question bank could not load completely. Refresh before starting.');
      group.slice(0,count).forEach((q,i)=>items.push({id:q.id,pretest:i<trial[index]}));
    });
    return {revision:REVISION,id:String(now)+'-'+Math.floor(random()*1e9),mode,items:shuffle(items,random),answers:{},flags:{},cur:0,startedAt:now,minutes:full?225:75,breakUsed:false,breakStartedAt:null};
  }
  function validate(session, bank) {
    if (!session || session.revision!==REVISION || !['simulation','practice'].includes(session.mode)) return false;
    const expected=session.mode==='simulation'?150:50, ids=new Set(bank.map(q=>q.id));
    if (!Array.isArray(session.items)||session.items.length!==expected||new Set(session.items.map(x=>x&&x.id)).size!==expected||!session.items.every(x=>x&&ids.has(x.id)&&typeof x.pretest==='boolean'))return false;
    if (!Number.isFinite(session.startedAt)||!Number.isInteger(session.cur)||session.cur<0||session.cur>=expected||session.minutes!==(expected===150?225:75))return false;
    if (!session.answers||typeof session.answers!=='object'||Array.isArray(session.answers)||!session.flags||typeof session.flags!=='object'||Array.isArray(session.flags))return false;
    if (typeof session.id!=='string'||typeof session.breakUsed!=='boolean'||(session.breakStartedAt!==null&&(!Number.isFinite(session.breakStartedAt)||!session.breakUsed||session.mode!=='simulation')))return false;
    if (!Object.entries(session.answers).every(([k,v])=>/^\d+$/.test(k)&&Number(k)<expected&&Number.isInteger(v)&&v>=0&&v<4))return false;
    if (!Object.entries(session.flags).every(([k,v])=>/^\d+$/.test(k)&&Number(k)<expected&&typeof v==='boolean'))return false;
    return session.items.filter(x=>x.pretest).length===(expected===150?25:0);
  }
  function remaining(session,now=Date.now()) { return Math.max(0,session.minutes*60-Math.floor((now-session.startedAt)/1000)); }
  function score(session,bank,now=Date.now(),timedOut=false) {
    if(!validate(session,bank))throw new Error('This saved session does not match the current question bank.');
    const byId=new Map(bank.map(q=>[q.id,q])); let correct=0,total=0,allCorrect=0; const byArea={};
    const review=session.items.map((item,i)=>{
      const q=byId.get(item.id),chosen=session.answers[i],right=chosen===q.correctIdx;
      if(right)allCorrect++;
      if(!item.pretest){total++;if(right)correct++;const a=byArea[q.domain]||(byArea[q.domain]={correct:0,total:0});a.total++;if(right)a.correct++;}
      return {id:q.id,chosen:chosen??null,correct:right,pretest:item.pretest};
    });
    return {id:session.id,revision:REVISION,date:new Date(now).toISOString().slice(0,10),mode:session.mode,total,correct,pct:Math.round(100*correct/total),seenTotal:session.items.length,allCorrect,minutesUsed:Math.min(session.minutes,Math.round((now-session.startedAt)/60000)),minutesAllotted:session.minutes,timedOut,byArea,review};
  }
  root.BCPSMockEngine={REVISION,start,validate,remaining,score};
  if(typeof module!=='undefined'&&module.exports)module.exports=root.BCPSMockEngine;
})(typeof window==='undefined'?globalThis:window);
