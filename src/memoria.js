/* ===== Jogo da memória: palavra × desenho (Volume 3 · Jogos) =====
   Só entram palavras que têm desenho em DRAW (francês, italiano e inglês). Cada página: até 6 pares = 12 cartas, na ordem dos temas.
   Não usa áudio. Ao achar um par, mostra o significado em português. */
(function(){
  const byW={},PER=6;
  VOLUME.types=VOLUME.types.concat([["memoria","Memória: palavra e desenho","Memória"]]);
  ["fr","it","en"].forEach(lang=>{
    const m=byW[lang]={},list=[];
    Object.keys(VOCAB[lang]||{}).forEach(cat=>VOCAB[lang][cat].forEach(e=>{
      const k=e.w.toLowerCase();
      if(DRAW[lang]&&DRAW[lang][k]&&!m[k]){m[k]=e;list.push(k);}
    }));
    /* v1.70.1: duas palavras com o MESMO desenho (ex. lunch/dinner = refeição) nunca ficam na mesma página, senão as cartas se confundem */
    const pages=[];let cur=[],svgs=new Set(),later=[];
    const flush=()=>{pages.push(cur);cur=later.slice();later=[];svgs=new Set(cur.map(w=>DRAW[lang][w]));};
    list.forEach(k=>{
      if(cur.length>=PER)flush();
      if(svgs.has(DRAW[lang][k]))later.push(k);else{cur.push(k);svgs.add(DRAW[lang][k]);}
    });
    while(cur.length||later.length){flush();if(!cur.length&&!later.length)break;}
    const parts=pages.filter(p=>p.length);
    const lastP=parts[parts.length-1];
    if(lastP&&lastP.length<4){const used=new Set(lastP.map(w=>DRAW[lang][w]));for(const k of list.slice().reverse()){if(lastP.length>=6)break;if(lastP.indexOf(k)<0&&!used.has(DRAW[lang][k])){lastP.push(k);used.add(DRAW[lang][k]);}}}const n=Math.max(1,parts.length);
    parts.forEach((part,i)=>{
      VOLUME.pages.push({id:"memoria-"+lang+"-"+(i+1),type:"memoria",n:i+1,langs:[lang],themes:[],sub:"Palavras com desenho",meta:"Palavras com desenho · parte "+(i+1)+" de "+n,words:part});
    });
  });
  GAMENAME.memoria="Memória";
  STAGES.memoria="#gstage";DOCKS.memoria="none";GAMEFN.memoria=startMemoria;
  let mm=null;window.memState=()=>mm;
  const ent=w=>byW[S.lang][w];
  function startMemoria(){
    fitFn=null;
    const es=P.words.map(ent).filter(Boolean);
    const cards=sh0(es.flatMap(e=>[{w:e.w.toLowerCase(),kind:"d"},{w:e.w.toLowerCase(),kind:"t"}]));
    mm={cards:cards,open:[],done:new Set(),moves:0,lock:false};
    renderMemoria();
  }
  /* Memória com as palavras em revisão (v1.57): palavras do ciclo/revisão/erros que têm desenho; completa com palavras já acertadas.
     Página «virtual» (P.rev): não conta como lição concluída. */
  window.memRevWords=function(first){
    const m=byW[S.lang]||{},out=[],add=w=>{w=String(w||"").toLowerCase();if(w&&m[w]&&out.indexOf(w)<0&&out.length<6&&!out.some(o=>DRAW[S.lang][o]===DRAW[S.lang][w]))out.push(w);};
    (first||[]).forEach(add);
    Object.keys(S.gd||{}).filter(k=>S.gd[k][4]&&k.indexOf(S.lang+":")===0).slice(0,3).forEach(k=>add(k.slice(S.lang.length+1)));
    const nw=out.length; /* até 3 que precisam de água */
    if(typeof dueWords==="function")dueWords().forEach(c=>{if(c.t==="v"){const r=rvVocab(c.k);r&&add(r.e.w);}else add(c.o.w);});
    Object.keys(S.rvv).filter(k=>k.indexOf(S.lang+":v|")===0).forEach(k=>add(k.slice(S.lang.length+3)));
    weakWords().forEach(e=>add(e.w));
    (S.cad||[]).filter(c=>c.l===S.lang).forEach(c=>add(c.w));
    const sk=S.sk[S.lang]||{};
    sh0(Object.keys(sk).filter(k=>sk[k][0]>=1)).forEach(add);
    if(out.length<4&&!nw)return [];
    sh0(Object.keys(m)).forEach(add); /* completa até 6 pares (grade 3×4) com outras palavras que têm desenho */
    return out;
  };
  window.startMemRev=function(words){
    if(!words||words.length<4)return false;
    P={id:"memoria-rev",type:"memoria",n:0,langs:[S.lang],words:words,rev:true};
    go("game");
    $("#g-title").textContent="Memória em revisão";
    $("#g-sub").textContent=LNAME[S.lang]+" · suas palavras em revisão, as que precisam de água primeiro (e outras com desenho, se faltar)";
    ["#stage","#cstage","#sstage","#ostage","#lstage","#rstage","#gstage"].forEach(s=>{$(s).hidden=s!=="#gstage";});
    ["cross","search","connect","sentence","odd","listen","resp","gram"].forEach(d=>{$("#dock-"+d).hidden=true;});
    $("#g-list").hidden=true;$("#kb-toggle").hidden=true;$("#zoom-toggle").hidden=true;
    newGame();return true;
  };
  RESUME.reg("memoria",{
    get(){return mm&&!(P&&P.rev)&&mm.cards.length&&mm.done.size<mm.cards.length/2?{cards:mm.cards,done:[...mm.done],moves:mm.moves}:null;},
    set(st){
      const ok=st.cards&&st.cards.length===mm.cards.length&&st.cards.every(c=>c&&ent(c.w));
      if(!ok)return;
      mm.cards=st.cards;mm.done=new Set((st.done||[]).filter(w=>ent(w)));mm.moves=Math.max(0,+st.moves||0);mm.open=[];mm.lock=false;renderMemoria();
    }
  });
  function renderMemoria(){
    const n=mm.cards.length/2;
    let h='<p class="ocount">Jogo da memória · '+mm.done.size+" de "+n+" pares · "+mm.moves+" tentativas</p>";
    h+='<p class="help" style="text-align:center">Vire duas cartas: uma com a palavra e outra com o desenho dela.</p><div class="mgrid">';
    mm.cards.forEach((c,i)=>{
      const shown=mm.open.indexOf(i)>=0||mm.done.has(c.w);
      const e=ent(c.w);
      h+='<button type="button" class="mcard'+(shown?" up":"")+(mm.done.has(c.w)?" ok":"")+'" data-i="'+i+'"'+(shown?" disabled":"")+' aria-label="'+(shown?(c.kind==="d"?"Desenho: "+esc(e.pt):esc(full(e))):"Carta virada para baixo")+'">'+
        (shown?(c.kind==="d"?'<span class="wdraw-sm">'+drawSvg(S.lang,c.w,e.pt)+"</span>":"<b>"+esc(full(e))+"</b>"):"?")+"</button>";
    });
    h+="</div>";
    const last=mm.last;
    h+='<div class="mstat" aria-live="polite">'+(last?'<p class="note"><b>'+esc(full(last))+"</b> = "+esc(last.pt)+"</p>":"")+"</div>";
    $("#gstage").innerHTML=h;
  }
  $("#gstage").addEventListener("click",ev=>{
    const b=ev.target.closest(".mcard");
    if(!b||!P||P.type!=="memoria"||!mm||mm.lock)return;
    const i=+b.dataset.i;
    if(mm.open.indexOf(i)>=0)return;
    mm.open.push(i);
    if(mm.open.length<2){renderMemoria();return;}
    mm.moves++;
    const a=mm.cards[mm.open[0]],c=mm.cards[mm.open[1]];
    if(a.w===c.w&&a.kind!==c.kind){
      mm.done.add(a.w);mm.open=[];const e=ent(a.w);mm.last=e;skRec(e.w,e.pt,true);sfx("ok");renderMemoria();
      if(mm.done.size===mm.cards.length/2){
        if(!P.rev)markDone();sfx("done");
        setTimeout(()=>doneSheet("Página concluída: "+mm.moves+" tentativas para "+mm.done.size+" pares",P.words.map(ent)),500);
      }
    }else{
      mm.lock=true;renderMemoria();
      setTimeout(()=>{mm.open=[];mm.lock=false;renderMemoria();},1000);
    }
  });
})();
