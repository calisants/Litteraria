/* ===== Jogo da memória: palavra × desenho (Volume 3 · Jogos) =====
   Só entram palavras que têm desenho em DRAW (hoje, inglês). Cada página: ~6 pares = 12 cartas.
   Não usa áudio. Ao achar um par, mostra o significado em português. */
(function(){
  const lang="en",keys=Object.keys(DRAW[lang]||{}),byW={};
  BOOKS.filter(b=>b.lang===lang).forEach(b=>b.chunks.forEach(c=>c.words.forEach(e=>{byW[e.w.toLowerCase()]=Object.assign({cat:c.cat},e);})));
  Object.keys(VOCAB[lang]||{}).forEach(cat=>VOCAB[lang][cat].forEach(e=>{if(!byW[e.w.toLowerCase()])byW[e.w.toLowerCase()]=Object.assign({cat:cat},e);}));
  const ents=keys.filter(k=>byW[k]).map(k=>byW[k]);
  const k=Math.max(1,Math.ceil(ents.length/6));
  VOLUME.types=VOLUME.types.concat([["memoria","Memória: palavra e desenho","Memória"]]);
  for(let i=0;i<k;i++){
    const part=ents.slice(Math.round(i*ents.length/k),Math.round((i+1)*ents.length/k));
    VOLUME.pages.push({id:"memoria-"+lang+"-"+(i+1),type:"memoria",n:i+1,langs:[lang],themes:[],sub:"Palavras com desenho",meta:"Palavras com desenho · parte "+(i+1)+" de "+k,words:part.map(e=>e.w.toLowerCase())});
  }
  GAMENAME.memoria="Memória";
  STAGES.memoria="#gstage";DOCKS.memoria="none";GAMEFN.memoria=startMemoria;
  let mm=null;window.memState=()=>mm;
  function startMemoria(){
    fitFn=null;
    const es=P.words.map(w=>byW[w]).filter(Boolean);
    const cards=sh0(es.flatMap(e=>[{w:e.w.toLowerCase(),kind:"d"},{w:e.w.toLowerCase(),kind:"t"}]));
    mm={cards:cards,open:[],done:new Set(),moves:0,lock:false};
    renderMemoria();
  }
  function renderMemoria(){
    const n=mm.cards.length/2;
    let h='<p class="ocount">Jogo da memória · '+mm.done.size+" de "+n+" pares · "+mm.moves+" tentativas</p>";
    h+='<p class="help" style="text-align:center">Vire duas cartas: uma com a palavra e outra com o desenho dela.</p><div class="mgrid">';
    mm.cards.forEach((c,i)=>{
      const shown=mm.open.indexOf(i)>=0||mm.done.has(c.w);
      const e=byW[c.w];
      h+='<button type="button" class="mcard'+(shown?" up":"")+(mm.done.has(c.w)?" ok":"")+'" data-i="'+i+'"'+(shown?" disabled":"")+' aria-label="'+(shown?(c.kind==="d"?"Desenho de "+esc(c.w):esc(c.w)):"Carta virada para baixo")+'">'+
        (shown?(c.kind==="d"?'<span class="wdraw-sm">'+drawSvg(lang,c.w,e.pt)+"</span>":"<b>"+esc(c.w)+"</b>"):"?")+"</button>";
    });
    h+="</div>";
    const last=mm.last;
    h+='<div class="mstat" aria-live="polite">'+(last?'<p class="note"><b>'+esc(last.w)+"</b> = "+esc(last.pt)+"</p>":"")+"</div>";
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
      mm.done.add(a.w);mm.open=[];const e=byW[a.w];mm.last=e;skRec(e.w,e.pt,true);sfx("ok");renderMemoria();
      if(mm.done.size===mm.cards.length/2){
        markDone();sfx("done");
        setTimeout(()=>doneSheet("Página concluída: "+mm.moves+" tentativas para "+mm.done.size+" pares",P.words.map(w=>byW[w])),500);
      }
    }else{
      mm.lock=true;renderMemoria();
      setTimeout(()=>{mm.open=[];mm.lock=false;renderMemoria();},1000);
    }
  });
})();
