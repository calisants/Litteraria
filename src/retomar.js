/* ===== Retomar a lição de onde parou (v1.39) =====
   No Android, quando a pessoa sai do app para usar outro, o sistema pode descartar a página; ao voltar, tudo recomeçava.
   Agora o estado da lição em andamento é guardado no aparelho (chave própria, fora do progresso e do backup) e devolvido ao reabrir.
   Passa de 3 horas parado, ou a pessoa saiu da lição de propósito (voltou ao índice, terminou a página): o estado é descartado.
   Cada motor registra get()/set() em RESUME (p3.js). Os motores de p4–p9 e p11 são tratados aqui; memória, citação e jogos de
   literatura registram os seus no próprio arquivo. */
(function(){
  const RKEY=KEY+"-rs",MAXAGE=3*3600e3;
  let lastJs="",fin=false;
  RESUME.quiet=true; /* durante a abertura do app (go('home') do p8.js) nada pode apagar o estado guardado; boot2.js liga de novo */
  const gramLike=()=>!!P&&(GRAMTYPES.indexOf(P.type)>=0||VOCGAMES.indexOf(P.type)>=0||P.type==="revisao"||P.type==="treino");
  const adFor=()=>{
    if(!P)return null;
    if(gramLike())return RESUME.ad.gm;
    return RESUME.ad[P.type]||RESUME.ad.any;
  };
  function clear(){lastJs="";try{localStorage.removeItem(RKEY);}catch(_){}}
  function write(force){
    const g=$("#s-game");
    if(!g||g.hidden||!P||fin)return;
    const ad=adFor();if(!ad)return;
    let st=null;try{st=ad.get();}catch(_){return;}
    if(!st){clear();return;}
    const body=JSON.stringify(st);
    if(!force&&body===lastJs)return;
    lastJs=body;
    try{localStorage.setItem(RKEY,JSON.stringify({v:1,t:Date.now(),lang:S.lang,vol:S.vol,id:P.id,type:P.type,title:$("#g-title").textContent,sub:$("#g-sub").textContent,st:st}));}catch(_){}
  }
  /* o que muda a situação da lição */
  const _md=markDone;markDone=function(){_md.apply(this,arguments);fin=true;clear();};
  const fresh=()=>{fin=false;lastJs="";if(!RESUME.quiet)clear();};
  const _sp=startPage;startPage=function(){fresh();return _sp.apply(this,arguments);};
  const _sg=showGame;showGame=function(){fresh();return _sg.apply(this,arguments);};
  const _go=go;go=function(n){_go.apply(this,arguments);if(n!=="game"&&!RESUME.quiet){fin=false;clear();}};
  $("#g-new").addEventListener("click",()=>{fin=false;lastJs="";});
  $("#sheet-again").addEventListener("click",()=>{fin=false;lastJs="";});
  const _speak=speak;speak=function(){if(RESUME.quiet)return;return _speak.apply(this,arguments);};
  document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")write(true);});
  window.addEventListener("pagehide",()=>write(true));
  document.addEventListener("freeze",()=>write(true));
  setInterval(()=>write(false),1500);

  /* ---- motor das páginas de gramática, vocabulário, revisão e treino ---- */
  RESUME.reg("gm",{
    get(){
      if(!gm.items||!gm.items.length)return null;
      return {i:gm.i,miss:gm.miss,solved:!!gm.solved,review:!!gm.review,drill:!!gm.drill,items:gm.items,ids:gm.ids,types:gm.types};
    },
    set(st){
      if(!st.items||!st.items.length)return;
      gm.items=st.items;gm.ids=st.ids;gm.types=st.types||null;gm.review=!!st.review;gm.drill=!!st.drill;
      const n=gm.items.length;
      let i=Math.max(0,Math.min(+st.i||0,n-1));
      if(st.solved&&i<n-1)i++;
      gm.i=i;gm.miss=Math.max(0,+st.miss||0);gm.open=i===0;
      loadGram();
    }
  });
  /* ---- palavras cruzadas ---- */
  RESUME.reg("cross",{
    get(){
      if(cw.finished||!cw.order.length)return null;
      const ix=set=>[...set].map(e=>cw.order.indexOf(e)).filter(i=>i>=0);
      return {sig:cw.order.map(e=>e.it.w).join("|"),vals:cw.vals,wrong:cw.wrong,rev:cw.rev,cur:cw.cur,ei:cw.ei,dir:cw.dir,cred:ix(cw.cred),missed:ix(cw.missed)};
    },
    set(st){
      if(st.sig!==cw.order.map(e=>e.it.w).join("|"))return;
      Object.keys(st.vals||{}).forEach(k=>{if(cw.cells[k])cw.vals[k]=st.vals[k];});
      cw.wrong=st.wrong||{};cw.rev=st.rev||{};
      cw.cred=new Set((st.cred||[]).map(i=>cw.order[i]).filter(Boolean));
      cw.missed=new Set((st.missed||[]).map(i=>cw.order[i]).filter(Boolean));
      if(st.ei>=0&&st.ei<cw.order.length)cw.ei=st.ei;
      cw.dir=curEntry().d;
      cw.cur=cw.cells[st.cur]?st.cur:entryKeys(curEntry())[0];
      paintCross();
    }
  });
  /* ---- caça-palavras ---- */
  RESUME.reg("search",{
    get(){
      if(!ws.p)return null;
      if(ws.found.size===ws.p.placed.length)return null;
      return {sig:ws.p.placed.map(p=>p.it.w).join("|"),found:[...ws.found.entries()],missed:ws.p.placed.map((p,i)=>(p.missed?i:-1)).filter(i=>i>=0)};
    },
    set(st){
      if(st.sig!==ws.p.placed.map(p=>p.it.w).join("|"))return;
      (st.found||[]).forEach(([i,col])=>{
        const w=ws.p.placed[i];if(!w)return;
        ws.found.set(i,col);
        w.cells.forEach(c=>{const el=ws.cells[c[0]][c[1]];el.classList.remove("f1","f2","f3","f4","f5","rev");el.classList.add("f"+col);});
      });
      (st.missed||[]).forEach(i=>{const w=ws.p.placed[i];if(!w)return;w.missed=true;if(!ws.found.has(i))w.cells.forEach(c=>ws.cells[c[0]][c[1]].classList.add("rev"));});
      renderWsList();
    }
  });
  /* ---- conecte ---- */
  RESUME.reg("connect",{
    get(){
      if(cn.done||!cn.groups.length)return null;
      return {sig:cn.groups.map(g=>g.items.map(i=>i.w).join(",")).join("|"),solved:cn.solved,mistakes:cn.mistakes,hinted:!!cn.hinted,tr:!!cn.tr,order:cn.tiles.map(t=>t.id)};
    },
    set(st){
      if(st.sig!==cn.groups.map(g=>g.items.map(i=>i.w).join(",")).join("|"))return;
      const by={};cn.tiles.forEach(t=>{by[t.id]=t;});
      if(st.order&&st.order.length===cn.tiles.length&&st.order.every(id=>by[id]))cn.tiles=st.order.map(id=>by[id]);
      cn.solved=(st.solved||[]).filter(g=>g>=0&&g<cn.groups.length);cn.mistakes=+st.mistakes||0;cn.hinted=!!st.hinted;cn.tr=!!st.tr;cn.sel=new Set();
      renderConnect();cnSay("Escolha 4 palavras do mesmo tema.");
    }
  });
  /* ---- intruso ---- */
  RESUME.reg("odd",{
    get(){return od.rounds.length?{sig:od.all.map(it=>it.w).join("|"),i:od.i,solved:!!od.solved,bad:od.rounds.map(r=>!!r.bad)}:null;},
    set(st){
      if(st.sig!==od.all.map(it=>it.w).join("|"))return;
      od.rounds.forEach((r,k)=>{if(st.bad&&st.bad[k])r.bad=true;});
      let i=Math.max(0,Math.min(+st.i||0,od.rounds.length-1));
      if(st.solved&&i<od.rounds.length-1)i++;
      od.i=i;od.sel=null;od.solved=false;renderOdd();
      setStatus("#od-status","Três palavras são do mesmo grupo. Qual é o intruso?");
    }
  });
  /* ---- construção de frases e falas ---- */
  RESUME.reg(["sentence","frases"],{
    get(){return sn.lines.length?{i:sn.i,d:sn.doneLines,solved:!!sn.solved,slot:sn.slot.map(b=>b.id),bank:sn.bank.map(b=>b.id)}:null;},
    set(st){
      let i=Math.max(0,Math.min(+st.i||0,sn.lines.length-1));
      const adv=st.solved&&i<sn.lines.length-1;
      if(adv)i++;
      sn.i=i;sn.doneLines=Math.max(0,+st.d||0);loadLine();
      if(!adv&&!st.solved&&st.bank&&st.bank.length===sn.words.length){
        const by={};sn.bank.forEach(b=>{by[b.id]=b;});
        if(st.bank.every(id=>by[id])){
          sn.bank=st.bank.map(id=>by[id]);
          sn.slot=(st.slot||[]).filter(id=>by[id]).map(id=>by[id]);
          renderSentence();
        }
      }
    }
  });
  /* ---- qual resposta faz sentido ---- */
  RESUME.reg("resposta",{
    get(){return rs.lines.length?{i:rs.i,solved:!!rs.solved}:null;},
    set(st){
      let i=Math.max(0,Math.min(+st.i||0,rs.lines.length-1));
      if(st.solved&&i<rs.lines.length-1)i++;
      rs.i=i;rs.said=rs.lines.slice(0,i);loadResp();
    }
  });
  /* ---- alfabeto, sons, sons difíceis, tema e ditado ---- */
  RESUME.reg(["alfabeto","sons","fala","tema","ditado"],{
    get(){return ls.items.length?{phase:ls.phase,i:ls.i,solved:!!ls.solved}:null;},
    set(st){
      if(st.phase==="quiz"){
        startQuiz();
        let i=Math.max(0,Math.min(+st.i||0,ls.rounds.length-1));
        if(st.solved&&i<ls.rounds.length-1)i++;
        ls.i=i;ls.sel=null;ls.solved=false;renderRound(false);
      }
    }
  });

  /* ---- qualquer outra página (leitura etc.): reabre a mesma página ---- */
  RESUME.reg("any",{get(){return {};},set(){}});
  /* ---- ao abrir o app ---- */
  function restore(){
    let sv=null,raw="";
    try{raw=localStorage.getItem(RKEY)||"";sv=JSON.parse(raw||"null");}catch(_){}
    if(!sv||sv.v!==1||!(Date.now()-sv.t<MAXAGE)||!LNAME[sv.lang]){clear();return false;}
    const rev=sv.type==="revisao"||sv.type==="treino";
    let V=null,pg=null;
    if(!rev){V=VOLUMES.find(v=>v.id===sv.vol);pg=V&&V.pages.find(p=>p.id===sv.id);if(!pg){clear();return false;}}
    S.lang=sv.lang;
    RESUME.quiet=true;
    try{
      if(rev){
        P={id:sv.type,type:sv.type,n:0};
        showGame(sv.title||"Revisão",sv.sub||"");
        RESUME.ad.gm.set(sv.st);
      }else{
        S.vol=sv.vol;
        startPage(sv.id);
        const ad=adFor();
        if(!ad){go("home");RESUME.quiet=false;return false;}
        ad.set(sv.st);
      }
      syncPrefs();
    }catch(e){
      RESUME.quiet=false;clear();go("home");return false;
    }
    RESUME.quiet=false;
    fin=false;lastJs="";
    try{localStorage.setItem(RKEY,raw);}catch(_){}
    say("Voltamos de onde você parou.");
    return true;
  }
  window.resumeLesson=restore;
})();
