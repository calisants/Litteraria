/* ===== Hoje, revisão, treino, meta diária e backup ===== */
const ymd=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");};
const R0=n=>Math.floor(Math.random()*n);
const sh0=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=R0(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;};
/* meta diária: conta respostas (primeira tentativa de cada item) em qualquer jogo */
function dayN(){return S.day.d===ymd()?S.day.n:0;}
function bump(){
  const t=ymd();if(S.day.d!==t)S.day={d:t,n:0};
  S.day.n++;save();
}
function goalText(){const n=dayN();return n>=S.goal?"Meta de hoje cumprida: "+n+" respostas.":"Hoje: "+n+" de "+S.goal+" respostas.";}
/* vocabulário: índice e fila de revisão */
let _vi=null;
function vIdx(){
  if(_vi)return _vi;_vi={};
  for(const l in VOCAB){_vi[l]={};Object.values(VOCAB[l]).flat().forEach(e=>{const k=e.w.toLowerCase();if(!_vi[l][k])_vi[l][k]=e;});}
  return _vi;
}
const _sk=skRec;
skRec=function(w,label,ok){
  _sk(w,label,ok);bump();
  if(!ok&&w){
    const e=vIdx()[S.lang][String(w).toLowerCase()];
    if(e){const key=S.lang+":v|"+e.w.toLowerCase();if(!S.rvv[key]&&Object.keys(S.rvv).length<400){S.rvv[key]=[rvDue(1),0,0];save();}}
  }
};
function vocabItem(e){
  const cat=VOCAB[S.lang][e.cat].filter(x=>x.w!==e.w&&x.pt!==e.pt&&full(x)!==full(e));
  const ds=sh0(cat).slice(0,3).map(full);
  const k=R0(4),o=ds.slice();o.splice(k,0,full(e));
  return {q:"Como se diz «"+e.pt+"»?",o:o,a:k,w:"«"+e.pt+"» = «"+full(e)+"».",s:full(e),k:e.w,lbl:e.pt,ok:[...new Set(Object.values(VOCAB[S.lang]).flat().filter(x=>x.pt===e.pt).flatMap(x=>[x.w,full(x)]))],_v:true};
}
function rvItem(key){
  const m=/^(fr|it|en):([a-z]+)\|(\d+)\|(\d+)$/.exec(key);if(!m)return null;
  const pg=GRAM.items[m[1]]&&GRAM.items[m[1]][m[2]]&&GRAM.items[m[1]][m[2]][+m[3]-1];
  return pg&&pg[+m[4]]?{lang:m[1],type:m[2],id:m[2]+"|"+m[3]+"|"+m[4],it:pg[+m[4]]}:null;
}
function rvVocab(key){
  const m=/^(fr|it|en):v\|(.+)$/.exec(key);if(!m)return null;
  const e=vIdx()[m[1]][m[2]];
  return e?{type:"vocab",id:"v|"+m[2],e:e}:null;
}
function dueKeys(){
  const out=[];
  const t=Date.now();
  Object.keys(S.rv).forEach(k=>{if(k.indexOf(S.lang+":")===0&&S.rv[k][0]<=t){if(rvItem(k))out.push([S.rv[k][0],k,0]);else delete S.rv[k];}});
  Object.keys(S.rvv).forEach(k=>{if(k.indexOf(S.lang+":")===0&&S.rvv[k][0]<=t){if(rvVocab(k))out.push([S.rvv[k][0],k,1]);else delete S.rvv[k];}});
  return out.sort((a,b)=>a[0]-b[0]);
}
const dueCount=()=>dueKeys().length;
function dueItems(max){
  return dueKeys().slice(0,max).map(([,k,v])=>{
    if(!v){const r=rvItem(k);return {type:r.type,id:r.id,it:shufItem(r.it)};}
    const r=rvVocab(k);return {type:"vocab",id:r.id,it:vocabItem(r.e)};
  });
}
function renderToday(){
  const el=$("#today-sub");if(!el)return;
  el.textContent=LNAME[S.lang]+" · "+planText();
  const n=dayN();
  $("#goal-fill").style.width=Math.min(100,Math.round(100*n/S.goal))+"%";
  $("#goal-txt").textContent=n>=S.goal?"cumprida ("+n+")":n+" de "+S.goal;
}
const _rm=renderMe;renderMe=function(){_rm();renderToday();};
function showGame(title,sub){
  go("game");
  $("#g-title").textContent=title;$("#g-sub").textContent=sub;
  ["#stage","#cstage","#sstage","#ostage","#lstage","#rstage","#gstage"].forEach(s=>{$(s).hidden=s!=="#gstage";});
  ["cross","search","connect","sentence","odd","listen","resp","gram"].forEach(d=>{$("#dock-"+d).hidden=d!=="gram";});
  $("#g-list").hidden=true;$("#kb-toggle").hidden=true;$("#zoom-toggle").hidden=true;
  fitFn=null;seedOff();
}
function startReview(){
  const due=dueItems(8);
  if(!due.length)return startToday();
  P={id:"revisao",type:"revisao",n:0};
  showGame("Revisão de hoje",LNAME[S.lang]+" · erros de páginas e de palavras");
  gm.items=due.map(r=>r.it);gm.ids=due.map(r=>r.id);gm.types=due.map(r=>r.type);gm.review=true;gm.drill=false;gm.i=0;gm.miss=0;gm.open=true;
  loadGram();
}
STAGES.revisao="#gstage";DOCKS.revisao="gram";GAMEFN.revisao=startReview;
/* treino: itens novos a cada vez (verbos por tempo ou palavras PT -> idioma), sempre digitados */
let lastDrill=null;
function drillConj(tid){
  const rows=DRILL.bank[S.lang][tid],r=rows[R0(rows.length)],p=R0(6);
  const pre=r[1][p],ans=r[2][p],lab=DRILL.labels[S.lang][tid];
  let wrong=[...new Set(r[2].filter(x=>x!==ans))];
  while(wrong.length<3){const x=rows[R0(rows.length)][2][p];if(x!==ans&&wrong.indexOf(x)<0)wrong.push(x);}
  const ds=sh0(wrong).slice(0,3),k=R0(4),o=ds.slice();o.splice(k,0,ans);
  const pr=pre.endsWith(" ")||pre.endsWith("'")?pre:pre+" ";
  return {q:pr+"___  ("+r[0]+", "+lab+")",o:o,a:k,w:lab.charAt(0).toUpperCase()+lab.slice(1)+" de «"+r[0]+"»: "+r[1].map((x,i)=>(x.endsWith(" ")||x.endsWith("'")?x:x+" ")+r[2][i]).join(" · ")+".",s:pr+ans,k:pr+ans,lbl:lab,_force:true};
}
function drillWord(){
  const all=Object.values(VOCAB[S.lang]).flat(),e=all[R0(all.length)],it=vocabItem(e);it._force=true;return it;
}
function startDrill(kind,tid){
  lastDrill={kind:kind,tid:tid};
  P={id:"treino",type:"treino",n:0};
  showGame("Treino",LNAME[S.lang]+" · "+(kind==="v"?"verbos: "+DRILL.labels[S.lang][tid]:kind==="r"?"palavras que você errou":"palavras: português → "+LNAME[S.lang]));
  const items=[];
  if(kind==="r"){sh0(weakWords().slice(0,15)).slice(0,10).forEach(e=>{const it=vocabItem(e);it._force=true;items.push(it);});}
  else for(let i=0;i<10;i++)items.push(kind==="v"?drillConj(tid):drillWord());
  if(!items.length){openSheet("Nenhuma palavra errada","<p class=\"help\">Você não tem palavras erradas em "+esc(LNAME[S.lang])+" no momento. Continue as lições e as palavras que você errar aparecem aqui.</p>",false);return;}
  gm.items=items;gm.ids=items.map((_,i)=>"d|"+i);gm.types=items.map(()=>"drill");gm.review=false;gm.drill=true;gm.i=0;gm.miss=0;gm.open=false;
  loadGram();
}
STAGES.treino="#gstage";DOCKS.treino="gram";GAMEFN.treino=()=>lastDrill?startDrill(lastDrill.kind,lastDrill.tid):openTrainMenu();
function openTrainMenu(){
  const L=DRILL.labels[S.lang],nw=weakWords().length;
  openSheet("Treino de "+LNAME[S.lang],
    '<p class="help">Idioma do treino (é o mesmo idioma do app):</p>'+
    '<div class="seg" role="group" aria-label="Idioma do treino" style="margin-bottom:12px">'+Object.keys(LNAME).map(l=>'<button type="button" data-trainlang="'+l+'" aria-pressed="'+(l===S.lang)+'">'+LNAME[l]+"</button>").join("")+"</div>"+
    '<p class="help">Cada rodada tem 10 itens. Sem regra na tela: é para testar o que você já sabe. «Revisar palavras que errei» usa as palavras em que você errou mais do que acertou; cada acerto aqui as tira da lista.</p>'+
    Object.keys(L).map(t=>'<button type="button" class="btn wide" data-train="v|'+esc(t)+'" style="margin-bottom:8px">Verbos em '+esc(LNAME[S.lang])+": "+esc(L[t])+"</button>").join("")+
    '<button type="button" class="btn wide primary" id="train-cycle" style="margin-bottom:8px">Ciclo da palavra ('+(typeof dueWords==="function"?dueWords().length:0)+")</button>"+
    '<button type="button" class="btn wide" id="train-garden" style="margin-bottom:8px">Lição do Jardim: trecho de um livro (7 telas)</button>'+
    '<button type="button" class="btn wide" id="train-garden-t" style="margin-bottom:8px">Lição do Jardim: palavras de um tema (7 telas)</button>'+
    '<button type="button" class="btn wide" id="train-mem" style="margin-bottom:8px">Memória das palavras em revisão</button>'+
    '<button type="button" class="btn wide" id="train-cards" style="margin-bottom:8px">Cartões de revisão: Fácil / Preciso rever ('+(typeof dueWords==="function"?dueWords().length:0)+")</button>"+
    '<button type="button" class="btn wide" data-train="r" style="margin-bottom:8px"'+(nw?"":" disabled")+'>Revisar palavras que errei ('+nw+")</button>"+
    '<button type="button" class="btn wide" data-train="w" style="margin-bottom:8px">Palavras: português → '+esc(LNAME[S.lang])+"</button>",false);
}
function trainSub(){const e=$("#train-sub");if(e)e.textContent=LNAME[S.lang]+" · digitar verbos e palavras";}
$("#go-train").addEventListener("click",openTrainMenu);
$("#sheet-in").addEventListener("click",e=>{
  const tl=e.target.closest("[data-trainlang]");
  if(tl){S.lang=tl.dataset.trainlang;lastDrill=null;save();syncPrefs();renderIndex();trainSub();openTrainMenu();return;}
  const t=e.target.closest("[data-train]");
  if(t){closeSheet();const v=t.dataset.train;if(v==="w")startDrill("w");else if(v==="r")startDrill("r");else startDrill("v",v.slice(2));return;}
  if(e.target.closest("#drill-more")){closeSheet();GAMEFN.treino();return;}
  if(e.target.closest("#rv-next")){closeSheet();const np=nextNewPage();if(np)startLesson(np);else go("home");}
});
function startToday(){
  const pl=todayPlan();
  if(pl.kind==="review")return startReview();
  if(pl.kind==="weak")return startDrill("r");
  if(pl.kind==="refresh"){S.rfd=ymd();save();return startLesson(pl.ref);}
  if(pl.kind==="lesson")return startLesson(pl.ref);
  if(pl.gated)return openSheet("Mais palavras primeiro","<p class=\"help\">Por enquanto você fez todas as lições de palavras e jogos disponíveis em "+esc(LNAME[S.lang])+". Ainda restam "+pl.gated+" páginas de gramática e frases, que abrem aos poucos conforme você acerta mais palavras. Treine e revise as palavras (menu Treino) e elas vão aparecendo. Você pode abri-las quando quiser em Lições.</p>",false);
  openSheet("Tudo em dia","<p class=\"help\">Você concluiu todas as lições da trilha em "+esc(LNAME[S.lang])+" e não há nada para revisar. Experimente o Treino, que gera itens novos a cada rodada.</p>",false);
}
$("#go-today").addEventListener("click",startToday);
/* meta diária nos ajustes */
function syncGoal(){$$("#goal-seg [data-goal]").forEach(b=>b.setAttribute("aria-pressed",String(+b.dataset.goal===S.goal)));}
$("#goal-seg").addEventListener("click",e=>{const b=e.target.closest("[data-goal]");if(!b)return;S.goal=+b.dataset.goal;save();syncGoal();renderToday();});
const _go=go;go=function(n){_go(n);if(n==="settings")syncGoal();};
/* backup */
let bkPending=null;
function bkReset(){bkPending=null;const g=$("#bk-go"),n=$("#bk-note"),f=$("#bk-file");if(g)g.hidden=true;if(n)n.textContent="";if(f)f.value="";}
$("#bk-save").addEventListener("click",()=>{
  try{
    const blob=new Blob([JSON.stringify(S)],{type:"application/json"}),a=document.createElement("a");
    a.href=URL.createObjectURL(blob);a.download="litteraria-progresso-"+ymd()+".json";
    document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),3000);
    S.bk=Date.now();save();renderBkWarn();
    $("#bk-note").textContent="Backup baixado: procure o arquivo litteraria-progresso-"+ymd()+".json em Downloads.";
  }catch(_){$("#bk-note").textContent="Não consegui gerar o arquivo neste navegador.";}
});
$("#bk-file").addEventListener("change",e=>{
  const f=e.target.files&&e.target.files[0];if(!f)return;
  const rd=new FileReader();
  rd.onload=()=>{
    try{
      const o=JSON.parse(String(rd.result));
      if(!o||typeof o!=="object"||(!o.done&&!o.plays&&!o.sk))throw 0;
      bkPending=JSON.stringify(o);
      $("#bk-note").textContent="Arquivo válido: "+Object.keys(o.done||{}).length+" páginas concluídas, "+(Object.keys(o.rv||{}).length+Object.keys(o.rvv||{}).length)+" itens em revisão. Toque em Restaurar para substituir o progresso atual.";
      $("#bk-go").hidden=false;
    }catch(_){bkPending=null;$("#bk-go").hidden=true;$("#bk-note").textContent="Esse arquivo não parece um backup do app Litteraria.";}
  };
  rd.onerror=()=>{$("#bk-note").textContent="Não consegui ler o arquivo.";};
  rd.readAsText(f);
});
$("#bk-go").addEventListener("click",()=>{
  if(!bkPending)return;
  try{localStorage.setItem(KEY,bkPending);location.reload();}catch(_){$("#bk-note").textContent="O navegador não deixou gravar. Nada foi alterado.";}
});

/* ===== zoom opcional, aviso de backup e erro ao salvar ===== */
const VP_LOCK="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover";
const VP_FREE="width=device-width, initial-scale=1, viewport-fit=cover";
function applyZoom(){const m=document.querySelector('meta[name="viewport"]');if(m)m.setAttribute("content",S.zoom?VP_FREE:VP_LOCK);}
function syncZoom(){$$("#zoom-seg [data-zoom]").forEach(b=>b.setAttribute("aria-pressed",String((b.dataset.zoom==="on")===S.zoom)));}
$("#zoom-seg").addEventListener("click",e=>{const b=e.target.closest("[data-zoom]");if(!b)return;S.zoom=b.dataset.zoom==="on";save();applyZoom();syncZoom();});
const _go2=go;go=function(n){_go2(n);if(n==="settings")syncZoom();};
applyZoom();
let toastT=0;
function say(msg){const t=$("#toast");if(!t)return;t.textContent=msg;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>{t.hidden=true;},6000);}
let failShown=false;
function saveFail(){if(failShown)return;failShown=true;say("Não consegui salvar o progresso neste navegador. Baixe um backup em Ajustes para não perder nada.");}
function renderBkWarn(){
  const el=$("#bk-warn");if(!el)return;
  const now=Date.now(),has=Object.keys(S.done).length>=3;
  const idle=S.bk?now-S.bk:now-(S.since||now);
  const show=has&&idle>(S.bk?14:7)*DAY&&now>S.bks;
  el.hidden=!show;
  if(show)$("#bk-warn-txt").textContent=S.bk?"Seu último backup foi há "+Math.floor((now-S.bk)/DAY)+" dias. Se trocar de celular ou limpar o navegador, o progresso some.":"Você ainda não fez backup do progresso, que fica só neste aparelho.";
}
$("#bk-warn-go").addEventListener("click",()=>{go("settings");const b=$("#bk-save");if(b)b.focus();});
$("#bk-warn-later").addEventListener("click",()=>{S.bks=Date.now()+7*DAY;save();renderBkWarn();});
const _rt=renderToday;renderToday=function(){_rt();renderBkWarn();};

/* ----- versão e envio de sugestões ----- */
function verText(){return "Versão "+APP_REL.v+" · atualizado em "+APP_REL.d.split("-").reverse().join("/");}
function showVer(){["#ver-line","#ver-set"].forEach(s=>{const e=$(s);if(e)e.textContent=verText();});trainSub();}
showVer();
const _ri=renderIndex;renderIndex=function(){_ri.apply(this,arguments);trainSub();};
/* Formulário do Google: preencha action (URL terminada em /formResponse) e os três campos entry.NNN.
   Enquanto action estiver vazio, o envio fica desligado e o app só oferece "Copiar o texto". */
const FB_FORM={action:"https://docs.google.com/forms/d/e/1FAIpQLSccWT9AFf5q5ALhaijoAje_E96RPcUB4FiNrWkkfnLsV9cC9A/formResponse",kind:"entry.958003478",text:"entry.474885746",info:"entry.1734770126"};
let fbFrom="home";
function fbDiag(){return "Versão "+APP_REL.v+" ("+APP_REL.d+") · idioma "+S.lang+" · volume "+S.vol+" · tela "+innerWidth+"x"+innerHeight+" · "+navigator.userAgent;}
function openFeedback(){
  const cur=SCREENS.find(s=>!$("#s-"+s).hidden);fbFrom=cur&&cur!=="feedback"?cur:"home";if(fbFrom==="game")fbFrom="home";
  closeSheet();go("feedback");
  $("#fb-note").textContent=FB_FORM.action?"":"O envio direto ainda não foi ativado neste app. Use \"Copiar o texto\" e mande para a Camila.";
  $("#fb-send").disabled=!FB_FORM.action;
}
function fbBody(){const tx=$("#fb-text").value.trim();return tx+($("#fb-diag").checked?"\n\n---\n"+fbDiag():"");}
$("#fb-back").addEventListener("click",()=>go(fbFrom));
document.addEventListener("click",e=>{
  if(e.target.closest("[data-feedback]")){openFeedback();return;}
  const k=e.target.closest("[data-fbk]");
  if(k){$$("[data-fbk]").forEach(b=>b.setAttribute("aria-pressed",String(b===k)));return;}
  if(e.target.closest("#fb-send")){
    const tx=$("#fb-text").value.trim();if(!tx){$("#fb-note").textContent="Escreva algo antes de enviar.";$("#fb-text").focus();return;}
    const kind=$('[data-fbk][aria-pressed="true"]').dataset.fbk,fd=new URLSearchParams();
    fd.set(FB_FORM.kind,kind);fd.set(FB_FORM.text,tx);if($("#fb-diag").checked)fd.set(FB_FORM.info,fbDiag());
    $("#fb-send").disabled=true;$("#fb-note").textContent="Enviando...";
    fetch(FB_FORM.action,{method:"POST",mode:"no-cors",body:fd}).then(()=>{$("#fb-text").value="";$("#fb-note").textContent="Enviado. Obrigada!";say("Enviado. Obrigada!");$("#fb-send").disabled=false;})
    .catch(()=>{$("#fb-note").textContent="Não consegui enviar (sem internet?). Seu texto continua aqui; tente de novo ou use \"Copiar o texto\".";$("#fb-send").disabled=false;});
    return;
  }
  if(e.target.closest("#fb-copy")){
    const tx=$("#fb-text").value.trim();if(!tx){$("#fb-note").textContent="Escreva algo antes de copiar.";return;}
    const body=$('[data-fbk][aria-pressed="true"]').dataset.fbk+": "+fbBody();
    (navigator.clipboard?navigator.clipboard.writeText(body):Promise.reject()).then(()=>say("Texto copiado.")).catch(()=>{$("#fb-text").value=body;$("#fb-text").select();$("#fb-note").textContent="Não consegui copiar sozinho: o texto está selecionado, copie com o seu aparelho.";});
  }
});
