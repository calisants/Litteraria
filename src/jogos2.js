/* ===== Jogos novos (v1.71): «Gênero das palavras» (le/la, il/lo/la) e «Ditado de frases (com áudio)» =====
   Volume 3 · Jogos. Gênero: só francês e italiano, só palavras com artigo definido que mostra o gênero (le/la; il/lo/la). As palavras com «l'» ficam de fora,
   porque o app não guarda o gênero delas. Acertos NÃO contam como palavra conhecida (só os erros vão para a revisão), para um chute certo não liberar a gramática.
   Ditado: as frases de «Construção de frases» e dos diálogos (nunca frases de livros); sem áudio há o botão «Mostrar a frase». */
(function(){
  const cnt=t=>VOLUME.pages.filter(p=>p.type===t).length;
  VOLUME.types=VOLUME.types.concat([
    ["genero","Gênero das palavras: le ou la? il, lo ou la?","Gênero (le/la)"],
    ["ditado","Ouça a frase e escreva","Ditado de frases (com áudio)"]]);
  GAMENAME.genero="Gênero das palavras";GAMENAME.ditado="Ditado de frases (com áudio)";
  ["genero","ditado"].forEach(t=>{STAGES[t]="#gstage";DOCKS[t]="none";});
  GAMEFN.genero=startGenero;GAMEFN.ditado=startDitado;

  const ART={fr:["le","la"],it:["il","lo","la"]};
  const hash=s=>{let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))>>>0;return h;};
  const genPool=lang=>{
    const seen=new Set(),out=[];
    Object.keys(VOCAB[lang]||{}).forEach(c=>VOCAB[lang][c].forEach(e=>{
      const k=e.w.toLowerCase();
      if(!seen.has(k)&&ART[lang]&&ART[lang].indexOf(e.a)>=0&&(!e.cls||e.cls==="substantivo")){seen.add(k);out.push(e);}
    }));
    return out;
  };
  const dictLines=lang=>{
    const out=[];
    const add=a=>(a||[]).forEach(pg=>(pg||[]).forEach(l=>{const n=l.s.split(/\s+/).length;if(n>=3&&n<=12)out.push(l);}));
    add(FRASES[lang]);add(DIALOGS[lang]);
    return out;
  };
  window.__genPool=genPool;window.__dictLines=dictLines;

  /* ---- páginas ---- */
  const byW={};
  ["fr","it"].forEach(lang=>{
    const pool=genPool(lang).sort((a,b)=>hash(lang+a.w)-hash(lang+b.w)),PER=12;
    byW[lang]={};pool.forEach(e=>{byW[lang][e.w.toLowerCase()]=e;});
    const n=Math.max(1,Math.ceil(pool.length/PER));
    for(let i=0;i<n&&pool.length>=6;i++){
      const part=pool.slice(Math.round(i*pool.length/n),Math.round((i+1)*pool.length/n));
      VOLUME.pages.push({id:"genero-"+lang+"-"+(i+1),type:"genero",n:cnt("genero")+1,langs:[lang],themes:[],sub:"Artigo certo",meta:"Artigo certo · parte "+(i+1)+" de "+n,words:part.map(e=>e.w.toLowerCase())});
    }
  });
  ["fr","it","en"].forEach(lang=>{
    const L=dictLines(lang),PER=5,n=Math.floor(L.length/PER);
    for(let i=0;i<n;i++){
      VOLUME.pages.push({id:"ditado-"+lang+"-"+(i+1),type:"ditado",n:cnt("ditado")+1,langs:[lang],themes:[],sub:"Frases do dia a dia",meta:"Frases do dia a dia · parte "+(i+1)+" de "+n,lines:L.slice(i*PER,(i+1)*PER).map(l=>({s:l.s,pt:l.pt}))});
    }
  });

  const rec=ok=>{bump();if(typeof gamAns==="function")gamAns(ok);};

  /* ---- Gênero ---- */
  let gn=null;
  function startGenero(){
    seedNow();fitFn=null;
    const es=P.words.map(w=>byW[S.lang][w]).filter(Boolean);
    gn={items:shuffle(es),i:0,score:0,sel:null};
    renderGenero();
  }
  function renderGenero(){
    const e=gn.items[gn.i],arts=ART[S.lang],ans=gn.sel!==null;
    let h='<p class="ocount">'+(gn.i+1)+" de "+gn.items.length+" · acertos: "+gn.score+"</p>";
    h+='<div style="text-align:center">'+(DRAW[S.lang]&&DRAW[S.lang][e.w.toLowerCase()]?'<span class="wdraw-sm" style="display:inline-block;width:72px">'+drawSvg(S.lang,e.w,e.pt)+"</span>":"")+'<p class="qz-s" style="font-size:1.6rem;margin:6px 0"><b>'+esc(e.w)+"</b></p></div>";
    h+='<p class="help" style="text-align:center">Qual artigo vai antes desta palavra?</p>';
    h+='<div class="lopts">'+arts.map((a,i)=>'<button type="button" class="lopt'+(ans?(a===e.a?" right":(gn.sel===i?" wrong":"")):"")+'" data-g="'+i+'"'+(ans?" disabled":"")+">"+esc(a)+"</button>").join("")+"</div>";
    if(ans){
      const ok=arts[gn.sel]===e.a;
      h+='<p class="note"><b>'+(ok?"Certo!":"O certo é: "+esc(e.a))+"</b><br>"+esc(full(e))+" = "+esc(e.pt)+' '+speakBtn(full(e))+'</p><p class="help">Dica de estudo: aprenda a palavra sempre com o artigo («'+esc(full(e))+"»).</p>";
      h+='<div class="row"><button type="button" class="btn primary" id="gn-next">'+(gn.i===gn.items.length-1?"Ver resultado":"Próxima")+"</button></div>";
    }
    $("#gstage").innerHTML=h;
  }
  $("#gstage").addEventListener("click",ev=>{
    if(!P||P.type!=="genero"||!gn)return;
    const b=ev.target.closest("[data-g]");
    if(b&&gn.sel===null){
      gn.sel=+b.dataset.g;const e=gn.items[gn.i],ok=ART[S.lang][gn.sel]===e.a;
      if(ok)gn.score++;else{window.GDFORM=4;try{skRec(e.w,e.pt,false);}finally{window.GDFORM=undefined;}}
      rec(ok);sfx(ok?"ok":"bad");renderGenero();return;
    }
    if(ev.target.closest("#gn-next")){
      if(gn.i<gn.items.length-1){gn.i++;gn.sel=null;renderGenero();return;}
      markDone();sfx("done");
      openSheet("Página concluída: "+gn.score+" de "+gn.items.length+" certas",gn.items.map(e=>'<div class="srow"><span class="w">'+esc(full(e))+'</span><span class="pt">'+esc(e.pt)+"</span>"+speakBtn(full(e))+"</div>").join(""),true);
    }
  });

  /* ---- Ditado ---- */
  const norm=s=>String(s).toLowerCase().replace(/[’‘`]/g,"'").replace(/[.,!?;:«»"“”()¿¡…\-–—]/g," ").replace(/\s+/g," ").trim();
  const plain=s=>norm(s).normalize("NFD").replace(/[̀-ͯ]/g,"");
  window.__dictNorm=norm;window.__dictPlain=plain;
  let dt=null;
  function startDitado(){
    seedNow();fitFn=null;
    dt={items:shuffle(P.lines),i:0,score:0,res:null,show:false};
    renderDitado();
  }
  function renderDitado(){
    const l=dt.items[dt.i],r=dt.res;
    let h='<p class="ocount">'+(dt.i+1)+" de "+dt.items.length+" · acertos: "+dt.score+"</p>";
    h+='<div class="row" style="justify-content:center"><button type="button" class="btn primary" id="dt-play">🔊 Ouvir a frase</button></div>';
    if(!r){
      h+=dt.show?'<p class="qz-s">'+esc(l.s)+'</p><p class="help" style="text-align:center">Copie a frase para treinar a escrita.</p>':'<div class="row" style="justify-content:center"><button type="button" class="btn" id="dt-show">Mostrar a frase (sem áudio)</button></div>';
      h+='<label class="help" for="dt-in">Escreva o que você ouviu em '+esc(LNAME[S.lang])+':</label><input id="dt-in" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" style="width:100%;font-size:1.1rem;padding:12px;min-height:48px">';
      h+='<div class="row"><button type="button" class="btn primary" id="dt-ok">Conferir</button></div>';
    }else{
      h+='<p class="note"><b>'+(r==="ok"?"Certo!":r==="acc"?"Certo, mas faltaram acentos.":"Quase lá. A frase era:")+"</b><br>"+esc(l.s)+" "+speakBtn(l.s)+"<br><small>"+esc(l.pt)+"</small></p>";
      if(r==="bad")h+='<p class="help">Você escreveu: '+esc(dt.typed)+"</p>";
      h+='<p class="help">Tradução: escrita por Claude, sem fonte conferida.</p>';
      h+='<div class="row"><button type="button" class="btn primary" id="dt-next">'+(dt.i===dt.items.length-1?"Ver resultado":"Próxima")+"</button></div>";
    }
    $("#gstage").innerHTML=h;
    const inp=$("#dt-in");if(inp&&!/Android|iPhone|iPad/.test(navigator.userAgent))inp.focus();
  }
  function checkDit(){
    const inp=$("#dt-in");if(!inp||dt.res)return;
    const l=dt.items[dt.i],t=inp.value;if(!t.trim()){inp.focus();return;}
    dt.typed=t;
    dt.res=norm(t)===norm(l.s)?"ok":(plain(t)===plain(l.s)?"acc":"bad");
    if(dt.res!=="bad")dt.score++;
    rec(dt.res!=="bad");sfx(dt.res==="bad"?"bad":"ok");renderDitado();
  }
  $("#gstage").addEventListener("click",ev=>{
    if(!P||P.type!=="ditado"||!dt)return;
    if(ev.target.closest("#dt-play")){speak(dt.items[dt.i].s);return;}
    if(ev.target.closest("#dt-show")){dt.show=true;const v=($("#dt-in")||{}).value;renderDitado();if(v&&$("#dt-in"))$("#dt-in").value=v;return;}
    if(ev.target.closest("#dt-ok")){checkDit();return;}
    if(ev.target.closest("#dt-next")){
      if(dt.i<dt.items.length-1){dt.i++;dt.res=null;dt.show=false;renderDitado();speak(dt.items[dt.i].s);return;}
      markDone();sfx("done");
      openSheet("Página concluída: "+dt.score+" de "+dt.items.length+" certas",dt.items.map(l=>'<div class="srow"><span class="pt"><b>'+esc(l.s)+"</b><br><small>"+esc(l.pt)+"</small></span>"+speakBtn(l.s)+"</div>").join(""),true);
    }
  });
  $("#gstage").addEventListener("keydown",ev=>{if(ev.key==="Enter"&&ev.target&&ev.target.id==="dt-in"){ev.preventDefault();checkDit();}});
  window.__gnState=()=>gn;window.__dtState=()=>dt;
})();
