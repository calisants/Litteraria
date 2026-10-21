/* ===== Cartão do dia («widget» dentro do app), lembretes e atalhos (v1.39) =====
   Limites reais (ditos na tela, em Ajustes):
   · Um PWA instalado pelo Chrome no Android NÃO consegue criar um widget na tela inicial do celular. Por isso o «widget» é um cartão na tela inicial do app,
     que também pode virar a notificação do lembrete, e o ícone do app ganha atalhos (segurar o ícone: Hoje, Cartão do dia, Treino).
   · Notificações em horário exato exigiriam um servidor de envio (fora de escopo, decisão dela). Sem servidor, o app usa: (1) Sincronização periódica em segundo plano,
     que só existe no Chrome/Edge com o app instalado, e cujo horário quem decide é o navegador; (2) aviso dentro do app quando ele está aberto; (3) botão «Testar». */
(function(){
  const pad=n=>String(n).padStart(2,"0");
  const dstr=d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
  const MSGS=["Cinco minutinhos de {L} hoje já contam.","Uma lição curta agora vale mais do que uma longa que nunca começa.","Quem treina pouco, mas sempre, chega longe. Vamos de {L}?","Que tal uma palavra nova de {L} antes de dormir?","Seu caderno de {L} está aberto. Uma página só?","Uma pausa boa: uma lição de {L} e pronto.","Errar faz parte. Venha treinar {L} um pouquinho.","Hoje é um bom dia para um jogo de {L}.","Uma frase de livro, uma lição, e o dia já rendeu.","Revisar um pouco hoje evita esquecer amanhã."];
  const SRC=[["hoje","O que aparece em «Hoje»","A próxima lição sugerida"],["msg","Mensagem para fazer as lições","Uma frase curta de incentivo"],["frase","Frase do dia","Uma frase de livro"],["livro","Citação de um livro","Você escolhe o livro"],["palavra","Palavra do dia","Palavra, tradução e áudio"],["off","Não mostrar","Esconde o cartão da tela inicial"]];

  /* ---- conteúdo do cartão: depende só do dia e do idioma ---- */
  function cardFor(day,lang){
    const h=window.phHash,L=LNAME[lang],src=S.wd.src;
    if(src==="msg"){
      const s=window.gamStreak?gamStreak():{n:0,today:false};
      return {k:"Lembrete",t:MSGS[h(day+lang)%MSGS.length].replace("{L}",L),s:S.gam.on&&s.n>0?"Sequência: "+s.n+(s.n===1?" dia":" dias"):"",act:"lesson"};
    }
    if(src==="frase"||src==="livro"){
      let list=window.phLangList(lang);
      if(src==="livro"&&S.wd.bk!=="all"){const f=list.filter(p=>p.book===S.wd.bk);if(f.length)list=f;}
      if(!list.length)return {k:"Cartão do dia",t:"Sem frases de livros em "+L+".",s:"",act:"lesson"};
      const p=list[h(day+lang+(src==="livro"?S.wd.bk:""))%list.length],bn=window.phBookMap[p.book].name;
      return {k:(src==="frase"?"Frase do dia":"Citação")+" · «"+bn+"»",t:p.s,s:"",say:p.s,act:"say"};
    }
    if(src==="palavra"){
      const pool=CATS.flatMap(c=>VOCAB[lang][c[0]]||[]);
      const e=pool[h(day+lang+"w")%pool.length];
      return {k:"Palavra do dia · "+L,t:full(e),s:e.pt,say:full(e),act:"say"};
    }
    return {k:"Hoje",t:LNAME[lang]+" · "+planText(),s:"",act:"lesson"};
  }
  window.cardFor=cardFor;

  /* ---- cartão na tela inicial ---- */
  function renderWcard(){
    const el=$("#wcard");if(!el)return;
    if(S.wd.src==="off"){el.hidden=true;return;}
    const c=cardFor(ymd(),S.lang);
    el.hidden=false;
    el.innerHTML='<small class="wk">'+esc(c.k)+"</small><p class=\"wt\">"+esc(c.t)+"</p>"+(c.s?'<p class="ws">'+esc(c.s)+"</p>":"")+
      '<div class="wrow">'+(c.act==="say"?'<button type="button" class="btn wbtn" data-wc="say">Ouvir</button>':'<button type="button" class="btn wbtn" data-wc="go">Começar</button>')+
      '<button type="button" class="btn wbtn quiet" data-wc="cfg">Trocar</button></div>';
  }
  window.renderWcard=renderWcard;
  function openCard(){
    const c=cardFor(ymd(),S.lang);
    openSheet("Cartão do dia",'<div class="wbig"><small class="wk">'+esc(c.k)+"</small><p class=\"wt\">"+esc(c.t)+"</p>"+(c.s?'<p class="ws">'+esc(c.s)+"</p>":"")+"</div>"+
      '<div class="row">'+(c.say?'<button type="button" class="btn" id="wc-say2">Ouvir</button>':"")+'<button type="button" class="btn primary" id="wc-go2">Começar uma lição</button></div>',false);
  }
  window.openCard=openCard;
  function wdPicker(){
    const books=BOOKS.filter(b=>b.lang===S.lang);
    return '<div class="wdl" role="group" aria-label="O que o cartão mostra">'+SRC.map(x=>'<button type="button" class="wdo" data-wd="'+x[0]+'" aria-pressed="'+(S.wd.src===x[0])+'"><b>'+x[1]+"</b><small>"+x[2]+"</small></button>").join("")+"</div>"+
      (S.wd.src==="livro"?'<label class="flt">Livro <select class="field" id="wd-book" aria-label="Livro das citações"><option value="all">Todos os livros de '+esc(LNAME[S.lang])+"</option>"+books.map(b=>'<option value="'+b.id+'"'+(S.wd.bk===b.id?" selected":"")+">"+esc(b.name)+"</option>").join("")+"</select></label>":"");
  }
  function renderWdBox(){const b=$("#wd-box");if(b)b.innerHTML=wdPicker();}
  window.renderWdBox=renderWdBox;
  function afterWd(){save();renderWcard();renderWdBox();pushState();if(!$("#sheet").hidden&&$("#wd-sheet"))$("#wd-sheet").innerHTML=wdPicker();}
  document.addEventListener("click",e=>{
    const t=e.target.closest&&e.target.closest("[data-wd],[data-wc],#wc-go2,#wc-say2,#nudge-go,#nudge-x");
    if(!t)return;
    if(t.dataset.wd){S.wd.src=t.dataset.wd;S.wd.u=1;afterWd();return;}
    const w=t.dataset.wc;
    if(w==="go"||t.id==="wc-go2"||t.id==="nudge-go"){closeSheet();startToday();return;}
    if(w==="say"||t.id==="wc-say2"){const c=cardFor(ymd(),S.lang);if(c.say)speak(c.say);return;}
    if(w==="cfg"){openSheet("O que o cartão mostra",'<p class="help">Escolha o que aparece no cartão da tela inicial. Ele também vira o texto do lembrete, se você escolher «Cartão do dia» nos lembretes.</p><div id="wd-sheet">'+wdPicker()+"</div>",false);return;}
    if(t.id==="nudge-x"){nudgeOff=true;renderNudge();}
  });
  document.addEventListener("change",e=>{if(e.target.id==="wd-book"){S.wd.bk=e.target.value;afterWd();}});

  /* ---- aviso dentro do app ---- */
  let nudgeOff=false;
  function renderNudge(){
    const el=$("#nudge");if(!el)return;
    const now=new Date(),hr=now.getHours(),s=window.gamStreak?gamStreak():{n:0,today:false};
    const want=!nudgeOff&&!studiedToday()&&((S.rm.on&&hr>=S.rm.h)||(S.gam.on&&s.n>0&&hr>=18));
    el.hidden=!want;
    if(!want)return;
    const txt=S.gam.on&&s.n>0?"Sua sequência de "+s.n+(s.n===1?" dia":" dias")+" continua se você fizer uma lição hoje.":"Hoje ainda não teve lição. Uma de 5 minutos já vale.";
    el.innerHTML='<span class="nb" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 17h12l-1.5-2.5V10a4.5 4.5 0 0 0-9 0v4.5zM10 20a2 2 0 0 0 4 0"/></svg></span><p>'+esc(txt)+'</p><button type="button" class="btn primary" id="nudge-go">Fazer agora</button><button type="button" class="btn icon" id="nudge-x" aria-label="Dispensar o aviso">×</button>';
  }
  window.renderNudge=renderNudge;

  /* ---- estado para o service worker (ele lê isto quando o navegador o acorda) ---- */
  let pushT=null;
  async function pushState(){
    if(!window.caches)return;
    try{
      const c=await caches.open("mp-state"),old=await c.match("state.json"),prev=old?await old.json():{};
      const days=S.gam.days;let last=days.length?days[days.length-1]:"";if(dayN()>0)last=ymd();
      const cards={},d0=new Date();
      for(let i=0;i<8;i++){const d=new Date(d0);d.setDate(d0.getDate()+i);const k=dstr(d);cards[k]=cardFor(k,S.lang);}
      const s=window.gamStreak?gamStreak():{n:0};
      const st={v:1,on:S.rm.on,h:S.rm.h,st:S.rm.st,last:last,streak:s.n,gam:S.gam.on,name:(S.player||"").split(" ")[0],ln:LNAME[S.lang],cards:cards,ic:S.ic,push:window.__pushOn?1:0,notified:prev.notified||""};
      await c.put("state.json",new Response(JSON.stringify(st),{headers:{"content-type":"application/json"}}));
    }catch(_){}
  }
  window.pushState=pushState;
  const _sv=save;save=function(){_sv.apply(this,arguments);clearTimeout(pushT);pushT=setTimeout(pushState,1500);};
  document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")pushState();else{renderNudge();renderWcard();schedInApp();}});

  /* ---- lembretes ---- */
  const can=()=>"Notification" in window;
  async function swReg(){try{return await Promise.race([navigator.serviceWorker.ready,new Promise((_,r)=>setTimeout(r,2500))]);}catch(_){return null;}}
  function textFor(style){
    const s=window.gamStreak?gamStreak():{n:0,today:false},nm=(S.player||"").split(" ")[0];
    if(style==="calma")return {title:"Mots & Parole",body:"Quando puder, uma lição curta de "+LNAME[S.lang]+"."};
    if(style==="cartao"){const c=cardFor(ymd(),S.lang);return {title:c.k,body:c.t+(c.s?"\n"+c.s:"")};}
    const body=S.gam.on&&s.n>0&&!s.today?"Sua sequência de "+s.n+(s.n===1?" dia":" dias")+" está esperando. 5 minutos salvam o dia!":"Que tal 5 minutos de "+LNAME[S.lang]+"? Uma lição curta já vale.";
    return {title:"📚 "+(nm?nm+", ":"")+"hora de brincar com as palavras!",body:body};
  }
  async function showNow(style){
    if(!can()||Notification.permission!=="granted")return false;
    const reg=await swReg(),t=textFor(style||S.rm.st);
    const o={body:t.body,icon:"icon-192.png",badge:"icon-192.png",vibrate:[120,60,120,60,220],tag:"mp-lembrete",renotify:true,data:{go:"hoje"},actions:[{action:"hoje",title:"Fazer agora"},{action:"depois",title:"Depois"}]};
    try{if(reg)await reg.showNotification(t.title,o);else new Notification(t.title,o);return true;}catch(_){try{new Notification(t.title,{body:t.body});return true;}catch(__){return false;}}
  }
  let rmT=null;
  function schedInApp(){
    clearTimeout(rmT);if(!S.rm.on||window.__pushOn)return;
    const n=new Date(),t=new Date(n);t.setHours(S.rm.h,0,0,0);const ms=t-n;
    if(ms<=0||ms>20*3600e3)return;
    rmT=setTimeout(()=>{if(!studiedToday()){showNow();renderNudge();}},ms+500);
  }
  async function regPeriodic(){
    const reg=await swReg();
    if(!reg||!("periodicSync" in reg))return "nao";
    try{const p=await navigator.permissions.query({name:"periodic-background-sync"});if(p.state!=="granted")return "negado";}catch(_){}
    try{
      if(S.rm.on)await reg.periodicSync.register("mp-lembrete",{minInterval:6*3600*1000});else await reg.periodicSync.unregister("mp-lembrete");
      return "ok";
    }catch(_){return "erro";}
  }
  async function rmNote(){
    const el=$("#rm-note");if(!el)return;
    let m;
    if(!can())m="Este navegador não permite notificações. Mesmo assim, o aviso aparece dentro do app quando você o abre depois do horário.";
    else if(Notification.permission==="denied")m="As notificações estão bloqueadas nas configurações do aparelho ou do navegador para este app. Libere lá e volte aqui.";
    else if(Notification.permission==="default")m="Toque em «Permitir notificações» para o aparelho deixar o app avisar.";
    else if(window.PUSHCFG&&PUSHCFG.sink)m="Notificações permitidas. Veja abaixo se o envio com o app fechado está ativo.";
    else{
      const r=await regPeriodic();
      m="Notificações permitidas. "+(r==="ok"?"Lembrete diário em segundo plano: ativo, mas quem escolhe o minuto exato é o Android/Chrome (ele pode atrasar, ou pular o dia se você quase não usa o app).":
        r==="negado"?"O lembrete em segundo plano está sem permissão neste aparelho; ele só aparece com o app aberto. Instale o app na tela inicial e use-o alguns dias.":
        "Neste aparelho o navegador não deixa agendar lembretes em segundo plano (é o caso do iPhone). O aviso aparece quando você abre o app depois do horário.");
    }
    el.textContent=m;
  }
  function syncRm(){
    $$("#rm-seg [data-rm]").forEach(b=>b.setAttribute("aria-pressed",String((b.dataset.rm==="on")===S.rm.on)));
    $$("#rm-st [data-rmst]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.rmst===S.rm.st)));
    const h=$("#rm-hour");if(h){if(!h.options.length)h.innerHTML=Array.from({length:24},(_,i)=>'<option value="'+i+'">'+pad(i)+":00</option>").join("");h.value=String(S.rm.h);}
    rmNote();
  }
  window.syncRm=syncRm;
  function rmChanged(){save();syncRm();pushState();schedInApp();renderNudge();}
  $("#rm-seg").addEventListener("click",async e=>{
    const b=e.target.closest("[data-rm]");if(!b)return;
    S.rm.on=b.dataset.rm==="on";
    if(S.rm.on&&can()&&Notification.permission==="default"){try{await Notification.requestPermission();}catch(_){}}
    rmChanged();
  });
  $("#rm-st").addEventListener("click",e=>{const b=e.target.closest("[data-rmst]");if(!b)return;S.rm.st=b.dataset.rmst;rmChanged();});
  $("#rm-hour").addEventListener("change",e=>{S.rm.h=+e.target.value;rmChanged();});
  $("#rm-perm").addEventListener("click",async()=>{
    if(!can()){rmNote();return;}
    try{await Notification.requestPermission();}catch(_){}
    rmChanged();
  });
  $("#rm-test").addEventListener("click",async()=>{
    const el=$("#rm-note");
    if(!can()||Notification.permission!=="granted"){
      if(can()&&Notification.permission==="default"){try{await Notification.requestPermission();}catch(_){}}
      if(!can()||Notification.permission!=="granted"){say("Sem permissão para notificações. Toque em «Permitir notificações».");rmNote();return;}
    }
    const ok=await showNow();
    say(ok?"Lembrete de teste enviado. Olhe a barra de notificações.":"Não consegui mostrar a notificação neste aparelho.");
    if(el&&!ok)rmNote();
  });

  /* ---- atalhos (?go=…) e toque na notificação ---- */
  function handleGo(g){
    if(g==="hoje")startToday();
    else if(g==="cartao")openCard();
    else if(g==="treino")openTrainMenu();
  }
  window.handleGo=handleGo;
  if(navigator.serviceWorker)navigator.serviceWorker.addEventListener("message",e=>{if(e.data&&e.data.t==="go")handleGo(e.data.go);});

  const _rm3=renderMe;renderMe=function(){_rm3();renderWcard();renderNudge();};
  const _go3=go;go=function(n){_go3.apply(this,arguments);if(n==="settings"){syncRm();renderWdBox();}if(n==="home"){renderWcard();renderNudge();}};
  syncRm();renderWdBox();renderWcard();renderNudge();schedInApp();pushState();
  setTimeout(()=>{if(S.rm.on&&!(window.PUSHCFG&&PUSHCFG.sink))regPeriodic();},3000);
})();
