(function () {
  'use strict';
  const engine=BCPSMockEngine, bank=window.__mockExamData||[], byId=new Map(bank.map(q=>[q.id,q]));
  const sessionKey='bcps_mock_session_20261019_v2', resultKey='bcps_mock_result_v2', historyKey='bcps_mock_history';
  const panel=document.getElementById('mockExamPanel');
  let session=null,result=null,confirmEnd=false,reviewFilter='missed',saveFailed=false;
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback;}catch(_){return fallback;}}
  function persist(){try{localStorage.setItem(sessionKey,JSON.stringify(session));saveFailed=false;}catch(_){saveFailed=true;}}
  function clock(seconds){const h=Math.floor(seconds/3600),m=Math.floor(seconds%3600/60),s=seconds%60;return (h?h+':':'')+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');}
  function focus(selector){const el=panel.querySelector(selector);if(el)el.focus({preventScroll:false});}
  function finish(timedOut=false){
    if(!session)return;
    result=engine.score(session,bank,Date.now(),timedOut);
    try{
      localStorage.setItem(resultKey,JSON.stringify(result));
      const rawHistory=read(historyKey,[]), history=Array.isArray(rawHistory)?rawHistory.filter(x=>x&&typeof x==='object'):[];
      if(!history.some(x=>x.id===result.id)){const {review,...summary}=result;history.push(summary);localStorage.setItem(historyKey,JSON.stringify(history.slice(-30)));}
      localStorage.removeItem(sessionKey);saveFailed=false;
    }catch(_){saveFailed=true;}
    session=null;confirmEnd=false;render();focus('h3');
    if(window.renderStudyPlan)window.renderStudyPlan();
  }
  window.BCPS_startMock=function(mode){
    try{session=engine.start(bank,mode);result=null;confirmEnd=false;persist();render();focus('.mock-question');}
    catch(error){panel.innerHTML='<p role="alert">'+esc(error.message)+'</p>';}
  };
  window.BCPS_mockSelect=function(choice){
    if(!session||session.breakStartedAt||!Number.isInteger(choice)||choice<0||choice>3)return;
    if(engine.remaining(session)<=0){finish(true);return;}
    session.answers[session.cur]=choice;confirmEnd=false;persist();render();focus('[aria-pressed="true"].mock-choice');
  };
  window.BCPS_mockGoto=function(index){
    if(!session||session.mode==='simulation'||!Number.isInteger(index)||index<0||index>=session.items.length)return;
    session.cur=index;confirmEnd=false;persist();render();focus('.mock-question');
  };
  window.BCPS_mockNext=function(){
    if(!session)return;
    if(session.mode==='simulation'&&session.answers[session.cur]==null)return;
    if(session.cur===session.items.length-1){if(session.mode==='practice' && Object.keys(session.answers).length<session.items.length){confirmEnd=true;render();focus('#mockConfirmTitle');return;}finish();return;}
    session.cur++;confirmEnd=false;persist();render();focus('.mock-question');
  };
  window.BCPS_mockFlag=function(){if(!session||session.mode==='simulation')return;session.flags[session.cur]=!session.flags[session.cur];persist();render();focus('[data-mock-flag]');};
  window.BCPS_mockSubmitConfirm=function(){if(!session)return;confirmEnd=true;render();focus('#mockConfirmTitle');};
  window.BCPS_mockKeepAnswering=function(){confirmEnd=false;render();focus('.mock-question');};
  window.BCPS_mockConfirm=function(){finish();};
  window.BCPS_mockBreak=function(){if(!session||session.mode!=='simulation'||session.breakUsed)return;session.breakUsed=true;session.breakStartedAt=Date.now();persist();render();focus('h3');};
  window.BCPS_mockReturn=function(){if(!session)return;session.breakStartedAt=null;persist();render();focus('.mock-question');};
  window.BCPS_mockReview=function(value){reviewFilter=value;render();};
  window.BCPS_clearMockState=function(){session=null;result=null;confirmEnd=false;render();};
  window.BCPS_mockReset=function(){result=null;try{localStorage.removeItem(resultKey);}catch(_){}render();};
  function earlierEditionHTML(){
    const earlierSession=read('bcps_mock_session_20261019',null), earlierResult=read('bcps_mock_result_v1',null);
    if(!earlierSession&&!earlierResult)return '';
    const summary=earlierResult&&Number.isFinite(earlierResult.correct)&&Number.isFinite(earlierResult.total)?'<p>Earlier result: '+esc(earlierResult.correct)+' / '+esc(earlierResult.total)+' · '+esc(earlierResult.date||'')+'.</p>':'';
    return '<aside class="mock-method"><p><strong>The mock questions have been revised.</strong> An earlier attempt is kept on this device and in your backup. It cannot resume against changed questions or answer choices.</p>'+summary+'<button class="btn btn-secondary" onclick="BCPS_saveBackupFile()">Save backup</button></aside>';
  }
  function startHTML(){return earlierEditionHTML()+'<div class="mock-start"><h3>Choose your session</h3><div class="mock-mode"><h4>Full simulation</h4><p>150 original case-based questions · 3 hours 45 minutes. Answer in order; once you continue, the previous answer is locked. Twenty-five items are excluded from the practice score and identified only after submission. One optional 10-minute break keeps the clock running.</p><button class="btn btn-primary" onclick="BCPS_startMock(\'simulation\')">Start full simulation</button></div><div class="mock-mode"><h4>Flexible practice</h4><p>50 questions · 75 minutes. Flag questions, move back and forth, and review all explanations after submission. All 50 count toward this practice score.</p><button class="btn btn-secondary" onclick="BCPS_startMock(\'practice\')">Start practice session</button></div><p class="mock-method">All 150 items received an AI-assisted source and editorial review on October 19, 2026. Independent pharmacist sign-off and measured difficulty calibration remain pending. Format checked against the <a href="https://bpsweb.org/candidates-guide/" target="_blank" rel="noopener">BPS Candidate’s Guide</a> on October 19, 2026. This is a practice simulation, not an official examination or a prediction of passing.</p></div>';}
  function liveHTML(){
    const q=byId.get(session.items[session.cur].id),full=session.mode==='simulation',last=session.cur===session.items.length-1;
    const header='<div class="mock-live-head"><span id="mockTimer" class="mock-timer" aria-label="Time remaining">'+clock(engine.remaining(session))+'</span><span>Question '+(session.cur+1)+' of '+session.items.length+'</span><button class="btn btn-secondary" onclick="BCPS_mockSubmitConfirm()">End attempt</button></div>';
    if(session.breakStartedAt)return header+'<div class="mock-break"><h3 tabindex="-1">Break in progress</h3><p>The exam clock is still running. This is your one optional break.</p><p id="mockBreakClock">'+clock(Math.max(0,600-Math.floor((Date.now()-session.breakStartedAt)/1000)))+' left in this break</p><button class="btn btn-primary" onclick="BCPS_mockReturn()">Return to questions</button></div>';
    const check=confirmEnd?'<div class="mock-submit-check"><h3 tabindex="-1" id="mockConfirmTitle">Finish this attempt?</h3><p>'+ (session.items.length-Object.keys(session.answers).length)+' unanswered questions will count as incorrect where scored. You can review explanations after finishing.</p><button class="btn btn-primary" onclick="BCPS_mockConfirm()">Finish attempt</button> <button class="btn btn-secondary" onclick="BCPS_mockKeepAnswering()">Keep answering</button></div>':'';
    const grid=full?'':('<div class="mock-nav-grid">'+session.items.map((_,i)=>'<button class="mock-nav-cell '+(session.answers[i]!=null?'answered ':'')+(i===session.cur?'cur ':'')+(session.flags[i]?'flagged':'')+'" aria-label="Question '+(i+1)+(session.answers[i]!=null?', answered':', unanswered')+(session.flags[i]?', flagged':'')+'" onclick="BCPS_mockGoto('+i+')">'+(i+1)+'</button>').join('')+'</div>');
    const choices=q.choices.map((text,i)=>'<button class="option-btn mock-choice" aria-pressed="'+(session.answers[session.cur]===i)+'" onclick="BCPS_mockSelect('+i+')">'+String.fromCharCode(65+i)+'. '+esc(text)+'</button>').join('');
    return header+check+'<p class="mock-save-note">'+(saveFailed?'This browser could not save the session. Keep this tab open.':'Session saved on this device. The timer continues if you leave or refresh.')+'</p>'+grid+'<div class="question-card"><h3 class="mock-question" tabindex="-1">'+esc(q.stem)+'</h3><div class="options">'+choices+'</div></div><div class="mock-live-foot">'+(full?'':('<button class="btn btn-secondary" '+(session.cur===0?'disabled':'')+' onclick="BCPS_mockGoto('+(session.cur-1)+')">Previous</button><button class="btn btn-secondary" data-mock-flag aria-pressed="'+!!session.flags[session.cur]+'" onclick="BCPS_mockFlag()">'+(session.flags[session.cur]?'Unflag':'Flag for review')+'</button>'))+'<button class="btn btn-primary" '+(full&&session.answers[session.cur]==null?'disabled':'')+' onclick="BCPS_mockNext()">'+(last?'Finish attempt':full?'Confirm & continue':'Next')+'</button></div>'+(full?'<p class="mock-method">Your answer locks when you continue. '+(!session.breakUsed?'<button class="text-action" onclick="BCPS_mockBreak()">Take optional break</button>':'Your optional break has been used.')+'</p>':'');
  }
  function resultHTML(){
    const review=result.review||[],filtered=review.filter(r=>reviewFilter==='all'||(reviewFilter==='missed'&&!r.correct)||(reviewFilter==='pretest'&&r.pretest));
    const summary='<h3 tabindex="-1">'+result.correct+' / '+result.total+' ('+result.pct+'%)</h3><p>'+ (result.mode==='simulation'?'Practice score from 125 items; 25 simulated unscored items excluded.':'Practice score from all 50 items.')+' '+result.minutesUsed+' of '+result.minutesAllotted+' minutes used.'+(result.timedOut?' Time expired.':'')+'</p><p class="mock-method">All-item accuracy: '+result.allCorrect+' / '+result.seenTotal+'. Repeated exposure can improve this score; it does not predict an official passing result.</p>';
    const areaNames={'Area 1':'Patient care specialty areas','Area 2':'Therapeutics and patient management','Area 3':'Professional practice'};
    const areas=Object.entries(result.byArea).sort(([a],[b])=>a.localeCompare(b)).map(([name,v])=>'<div class="mock-area-row"><span>'+esc(areaNames[name]||name)+'</span><span>'+v.correct+' / '+v.total+'</span></div>').join('');
    const filters='<label for="mockReviewFilter">Review questions</label><select id="mockReviewFilter" onchange="BCPS_mockReview(this.value)"><option value="missed" '+(reviewFilter==='missed'?'selected':'')+'>Missed or unanswered</option><option value="all" '+(reviewFilter==='all'?'selected':'')+'>All questions</option><option value="pretest" '+(reviewFilter==='pretest'?'selected':'')+'>Simulated unscored items</option></select>';
    const details=filtered.map(r=>{const q=byId.get(r.id);if(!q)return '';return '<details class="mock-review-item"><summary>'+esc(q.topic)+' · '+(r.correct?'Correct':'Needs review')+(r.pretest?' · unscored':'')+'</summary><p>'+esc(q.stem)+'</p><p><strong>Your answer:</strong> '+(r.chosen===null?'Unanswered':esc(q.choices[r.chosen]))+'</p><p><strong>Best answer:</strong> '+esc(q.choices[q.correctIdx])+'</p><ol type="A">'+q.optsExp.map((reason,i)=>'<li><strong>'+esc(q.choices[i])+':</strong> '+esc(reason)+'</li>').join('')+'</ol><p class="mock-method">'+q.sources.map(source=>'<a href="'+esc(source.url)+'" target="_blank" rel="noopener">'+esc(source.title)+'</a>').join(' · ')+'. '+esc(q.review?.evidenceAnchor||'')+' · AI-assisted source review: October 19, 2026. Independent clinical sign-off pending.</p></details>';}).join('');
    return '<div class="mock-result">'+summary+'<div class="mock-area-breakdown">'+areas+'</div><button class="btn btn-secondary" onclick="BCPS_mockReset()">Choose another session</button><div class="mock-review">'+filters+(details||'<p>No questions in this review group.</p>')+'</div></div>';
  }
  function render(){if(panel)panel.innerHTML=session?liveHTML():result?resultHTML():startHTML();}
  const saved=read(sessionKey,null);if(engine.validate(saved,bank)&&saved.startedAt<=Date.now())session=saved;
  const prior=read(resultKey,null);if(!session&&prior&&prior.revision===engine.REVISION&&Array.isArray(prior.review))result=prior;
  function tick(){
    if(!session)return;
    if(engine.remaining(session)<=0){finish(true);return;}
    if(session.breakStartedAt&&Date.now()-session.breakStartedAt>=600000){session.breakStartedAt=null;persist();render();}
    const timer=document.getElementById('mockTimer');if(timer)timer.textContent=clock(engine.remaining(session));
    const pause=document.getElementById('mockBreakClock');if(pause)pause.textContent=clock(Math.max(0,600-Math.floor((Date.now()-session.breakStartedAt)/1000)))+' left in this break';
  }
  window.addEventListener('bcps:tab',event=>{if(event.detail==='accp')render();});
  setInterval(tick,1000);tick();render();
})();
