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
    const n=Math.max(1,Math.ceil(list.length/PER));
    for(let i=0;i<n;i++){
      const part=list.slice(Math.round(i*list.length/n),Math.round((i+1)*list.length/n));
      VOLUME.pages.push({id:"memoria-"+lang+"-"+(i+1),type:"memoria",n:i+1,langs:[lang],themes:[],sub:"Palavras com desenho",meta:"Palavras com desenho · parte "+(i+1)+" de "+n,words:part});
    }
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
  RESUME.reg("memoria",{
    get(){return mm&&mm.cards.length&&mm.done.size<mm.cards.length/2?{cards:mm.cards,done:[...mm.done],moves:mm.moves}:null;},
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
        markDone();sfx("done");
        setTimeout(()=>doneSheet("Página concluída: "+mm.moves+" tentativas para "+mm.done.size+" pares",P.words.map(ent)),500);
      }
    }else{
      mm.lock=true;renderMemoria();
      setTimeout(()=>{mm.open=[];mm.lock=false;renderMemoria();},1000);
    }
  });
})();
