/* ===== Volume 2: estudo e teste de ouvido ===== */
const ls={phase:"study",items:[],pairs:[],rounds:[],i:0,sel:null,solved:false,all:[]};
const parts=(s,n)=>s.split("|");
function themeItems(L,cat){
  return VOCAB[L][cat].map(it=>{const pr=(PRON[L][it.w]||"|").split("|");return {w:full(it),bare:it.w,say:full(it),ipa:pr[0],pt:pr[1],tr:it.pt};});
}
function lev(a,b){
  const m=a.length,n=b.length;let prev=[];for(let j=0;j<=n;j++)prev[j]=j;
  for(let i=1;i<=m;i++){const cur=[i];for(let j=1;j<=n;j++)cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));prev=cur;}
  return prev[n];
}
function ditadoOpts(ans){
  const L=S.lang,ipa=w=>(PRON[L][w]||"").split("|")[0],seen=new Set([ans.bare]);
  const cand=shuffle(Object.values(VOCAB[L]).flat()).filter(x=>{
    if(seen.has(x.w)||ipa(x.w)===ipa(ans.bare)||norm(x.w)===norm(ans.bare))return false;
    seen.add(x.w);return true;
  });
  cand.sort((p,q)=>lev(p.w,ans.bare)-lev(q.w,ans.bare));
  const near=shuffle(cand.slice(0,5)).slice(0,3);
  return shuffle([{t:ans.bare,ok:true}].concat(near.map(x=>({t:x.w,ok:false}))));
}
function startListen(){
  seedNow();fitFn=null;
  const L=S.lang;
  ls.items=[];ls.pairs=[];
  if(P.type==="alfabeto"){
    ls.items=ALFA[L].slice((P.n-1)*13,P.n*13).map(r=>{const p=r.split("|");return {w:p[0],say:p[1],ipa:p[2],pt:p[3],tr:"nome da letra: "+p[1]};});
  }else if(P.type==="sons"){
    ls.pairs=SONS[L][P.n-1].map(r=>{const h=r.split("||").map(x=>x.split("|"));return h.map(p=>({w:p[0],say:p[0],ipa:p[1],pt:p[2],tr:p[3]}));});
    ls.items=ls.pairs.flat();
  }else if(P.type==="tema"||P.type==="ditado"){
    ls.items=themeItems(L,P.cat);
  }else{
    ls.items=FALA[L][P.n-1].map(r=>{const p=r.split("|");return {w:p[0],say:p[0],ipa:p[1],pt:p[2],tr:p[3]};});
  }
  ls.phase="study";
  if(P.type==="ditado"){startQuiz();return;}
  renderStudy();
}
function lsDock(){
  const study=ls.phase==="study";
  $("#ls-go").hidden=!study;
  ["#ls-submit","#ls-replay","#ls-next","#ls-study"].forEach(id=>{$(id).hidden=study;});
}
function ipaLine(it){return '<span class="ipa">/'+esc(it.ipa)+'/</span> <span class="how">'+esc(it.pt)+"</span>";}
function renderStudy(){
  lsDock();
  let h='<p class="note">'+esc(LEGENDA[S.lang])+(P.type==="tema"?" Aqui o IPA e o \"como fala\" valem para a palavra sem o artigo.":"")+"</p>";
  if(P.type==="sons"){
    h+=ls.pairs.map(pr=>'<div class="prow pair">'+pr.map(it=>'<div class="pcell"><b>'+esc(it.w)+"</b>"+speakBtn(it.say)+"<br>"+ipaLine(it)+"<br><small>"+esc(it.tr)+"</small></div>").join("")+"</div>").join("");
  }else{
    h+=ls.items.map(it=>'<div class="prow"><span class="big">'+esc(it.w)+'</span><span class="pc">'+ipaLine(it)+"<br><small>"+esc(P.type==="alfabeto"?"se diz «"+it.say+"»":it.tr)+"</small></span>"+speakBtn(it.say)+"</div>").join("");
  }
  $("#lstage").innerHTML=h;
  setStatus("#ls-status","Leia e ouça. Quando quiser, comece o teste de ouvido.");
}
$("#ls-go").addEventListener("click",startQuiz);
$("#ls-study").addEventListener("click",()=>{ls.phase="study";renderStudy();});
function startQuiz(){
  seedNow();
  const N=P.type==="tema"||P.type==="ditado"?8:6,items=ls.items;ls.rounds=[];ls.all=ls.items;
  if(P.type==="sons"){
    shuffle(ls.pairs.flatMap(pr=>pr.map(ans=>({pr:pr,ans:ans})))).forEach(x=>{
      ls.rounds.push({say:x.ans.say,ask:"Qual palavra você ouviu?",opts:shuffle(x.pr.map(it=>({t:it.w,ok:it===x.ans}))),ans:x.ans,show:x.pr});
    });
  }else if(P.type==="ditado"){
    shuffle(items).slice(0,N).forEach(ans=>{
      ls.rounds.push({say:ans.say,ask:"Como se escreve a palavra que você ouviu?",opts:ditadoOpts(ans),ans:ans,show:[ans]});
    });
  }else if(P.type==="tema"){
    shuffle(items).slice(0,N).forEach(ans=>{
      const seen=new Set([ans.tr]),others=shuffle(items.filter(x=>x!==ans)).filter(x=>{if(seen.has(x.tr))return false;seen.add(x.tr);return true;}).slice(0,2);
      ls.rounds.push({say:ans.say,ask:"Qual é o significado da palavra que você ouviu?",opts:shuffle([ans].concat(others).map(it=>({t:it.tr,ok:it===ans}))),ans:ans,show:[ans]});
    });
  }else{
    shuffle(items).slice(0,N).forEach(ans=>{
      const others=shuffle(items.filter(x=>x!==ans)).slice(0,P.type==="alfabeto"?3:2);
      const ask=P.type==="alfabeto"?"Qual letra você ouviu?":"Qual é o «como fala» da palavra que você ouviu?";
      const opts=shuffle([ans].concat(others).map(it=>({t:P.type==="alfabeto"?it.w:it.pt,ok:it===ans})));
      ls.rounds.push({say:ans.say,ask:ask,opts:opts,ans:ans,show:[ans]});
    });
  }
  ls.i=0;ls.sel=null;ls.solved=false;ls.phase="quiz";
  renderRound(true);
}
function renderRound(play){
  lsDock();
  const r=ls.rounds[ls.i];
  let h='<p class="ocount">Rodada '+(ls.i+1)+" de "+ls.rounds.length+'</p><p class="prompt">'+esc(r.ask)+'<small>Toque no alto-falante quantas vezes quiser.</small></p>';
  h+='<div class="heard bigspk">'+speakBtn(r.say)+"<span>Ouvir</span></div>";
  h+='<div class="lopts">'+r.opts.map((o,k)=>'<button type="button" class="lopt'+(ls.solved&&o.ok?" right":"")+'" data-k="'+k+'" aria-pressed="'+(ls.sel===k)+'"'+(ls.solved?" disabled":"")+">"+esc(o.t)+"</button>").join("")+"</div>";
  if(ls.solved)h+='<div class="note">'+r.show.map(it=>"<b>"+esc(it.w)+"</b> "+ipaLine(it)+" · "+esc(it.tr)).join("<br>")+"</div>";
  $("#lstage").innerHTML=h;
  $("#ls-submit").disabled=ls.solved||ls.sel===null;
  $("#ls-next").disabled=!ls.solved;
  $("#ls-next").textContent=ls.i===ls.rounds.length-1?"Terminar":"Próxima";
  if(play)speak(r.say);
}
$("#lstage").addEventListener("click",e=>{
  if(ls.phase!=="quiz"||ls.solved)return;
  const b=e.target.closest(".lopt");if(!b)return;
  ls.sel=+b.dataset.k;renderRound(false);
});
$("#ls-replay").addEventListener("click",()=>{if(ls.phase==="quiz")speak(ls.rounds[ls.i].say);});
$("#ls-submit").addEventListener("click",()=>{
  if(ls.solved||ls.sel===null)return;
  const r=ls.rounds[ls.i];
  if(r.opts[ls.sel].ok){if(!r.bad)skRec(r.ans.bare||r.ans.w,P.type==="alfabeto"?"letra "+r.ans.say:(r.ans.tr||r.ans.pt),true);ls.solved=true;sfx("ok");renderRound(false);setStatus("#ls-status","Certo!","ok");}
  else{if(!r.bad){r.bad=true;skRec(r.ans.bare||r.ans.w,P.type==="alfabeto"?"letra "+r.ans.say:(r.ans.tr||r.ans.pt),false);}sfx("bad");shake($('#lstage .lopt[aria-pressed="true"]'));setStatus("#ls-status","Ainda não. Ouça de novo e tente outra opção.","bad");}
});
$("#ls-next").addEventListener("click",()=>{
  if(!ls.solved)return;
  if(ls.i<ls.rounds.length-1){ls.i++;ls.sel=null;ls.solved=false;renderRound(true);setStatus("#ls-status","");return;}
  markDone();sfx("done");setStatus("#ls-status","Página concluída.","ok");
  openSheet("Página concluída: para rever",ls.all.map(it=>'<div class="srow"><span class="w">'+esc(it.w)+'</span><span class="pt">'+ipaLine(it)+"</span>"+speakBtn(it.say)+"</div>").join(""),true);
});
