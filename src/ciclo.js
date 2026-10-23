/* ===== Ciclo da palavra (v1.57): a mesma palavra volta em formas diferentes =====
   Ver (desenho + escolher o significado) → Ouvir (escolher o significado; «Mostrar a palavra» funciona sem áudio)
   → Escrever (digitar) → Usar na frase (completar). A forma vem do degrau da revisão: (degrau + erros) % 4.
   Acertar sobe um degrau (e muda a forma); errar volta 2 degraus, amanhã, e a forma também muda. Sem tempo e sem pontos. */
(function(){
  const FORMS=["Ver","Ouvir","Escrever","Usar na frase"];
  let deck=[],ci=0,cur=null,ok=0,bad=0,heard=false,seen=[];
  const formOf=cd=>cd.t==="c"?cd.o.s%4:((S.rvv[cd.k]||[0,0,0])[1]+((S.rvv[cd.k]||[0,0,0])[2]||0))%4;
  function entry(cd){
    if(cd.t==="c")return {w:cd.o.w,pt:cd.o.pt,_c:1};
    const r=rvVocab(cd.k);return r?r.e:null;
  }
  function opts(e){
    const all=[...new Set(Object.values(VOCAB[S.lang]).flat().map(x=>x.pt).filter(p=>p&&p!==e.pt))];
    const ds=sh0(all).slice(0,3),k=R0(4);ds.splice(k,0,e.pt);return {o:ds,a:k};
  }
  function grade(cd,good){
    if(cd.t==="c"){
      const o=cd.o;
      if(good){const st=o.s+1;if(st>=RV_STEPS.length){const i=S.cad.indexOf(o);if(i>=0)S.cad.splice(i,1);}else{o.s=st;o.d=rvDue(rvIvl(st,0));}}
      else{o.s=Math.max(0,o.s-2);o.d=rvDue(1);}
      save();return;
    }
    const c=S.rvv[cd.k];if(!c)return;
    const lp=c[2]||0;
    if(good){const st=c[1]+1;if(st>=RV_STEPS.length)delete S.rvv[cd.k];else S.rvv[cd.k]=[rvDue(rvIvl(st,lp)),st,lp];}
    else S.rvv[cd.k]=[rvDue(1),Math.max(0,c[1]-(typeof gdDrop==="function"?gdDrop(cd.k):2)),Math.min(99,lp+1)];
    save();
  }
  function build(cd){
    const e=entry(cd);if(!e)return null;
    let f=formOf(cd),c=null;
    {const m=cd.k&&/^(fr|it|en):v\|(.+)$/.exec(cd.k);if(m&&typeof gdLastForm==="function"&&gdLastForm(m[1],m[2])===f)f=(f+1)%4;}
    if(f===3){c=ctxFor(e);if(!c)f=2;}
    const o={cd:cd,e:e,f:f,c:c,res:null};
    if(f<2)Object.assign(o,opts(e));
    return o;
  }
  function head(){return '<p class="help">'+(ci+1)+" de "+deck.length+" · forma: <b>"+FORMS[cur.f]+"</b></p>";}
  function optsHtml(){
    return '<div class="stack">'+cur.o.map((t,i)=>'<button type="button" class="btn wide" data-cic-opt="'+i+'">'+esc(t)+"</button>").join("")+"</div>";
  }
  function typeHtml(){
    return '<input id="cic-in" class="field" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Sua resposta" style="width:100%;margin:8px 0">'+
      '<button type="button" class="btn wide primary" id="cic-check">Verificar</button>';
  }
  function render(){
    if(ci>=deck.length){
      const mw=typeof memRevWords==="function"?memRevWords(seen):[];
      openSheet("Ciclo concluído",'<p class="help">Você passou por '+deck.length+" palavra(s): "+ok+" certa(s) e "+bad+' para rever. As que você errou voltam amanhã, em outra forma; as certas voltam daqui a mais dias.</p>'+
        (mw.length?'<p class="help">Quer fixar com imagens? O jogo da memória usa as palavras que você está revisando.</p><button type="button" class="btn wide primary" id="cic-mem" style="margin-bottom:8px">Jogo da memória com essas palavras</button>':"")+
        '<button type="button" class="btn wide" id="cic-again">Ver se há mais palavras</button>',false);
      return;
    }
    cur=build(deck[ci]);
    if(!cur){ci++;render();return;}
    heard=false;if(cur.e.w&&seen.indexOf(cur.e.w)<0)seen.push(cur.e.w);
    const e=cur.e,dr=drawSvg(S.lang,e.w,e.pt),w=e._c?e.w:full(e);let b="";
    if(cur.f===0)b=(dr?'<div class="wdraw">'+dr+"</div>":"")+'<p class="card-w">'+esc(w)+"</p><p class=\"help\">O que significa?</p>"+optsHtml();
    else if(cur.f===1)b='<p class="help">Ouça a palavra e escolha o significado.</p><p>'+speakBtn(w)+' <button type="button" class="btn" id="cic-show">Mostrar a palavra (sem áudio)</button></p><p class="card-w" id="cic-word"></p>'+optsHtml();
    else if(cur.f===2)b=(dr?'<div class="wdraw">'+dr+"</div>":"")+'<p class="help">Escreva em '+esc(LNAME[S.lang])+':</p><p class="card-w">'+esc(e.pt)+"</p>"+typeHtml();
    else{
      const re=new RegExp("(^|[^\\p{L}\\p{N}])"+e.w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"(?![\\p{L}\\p{N}])","giu");
      b='<p class="help">Complete a frase:</p><p class="card-w">'+esc(cur.c.s.replace(re,(m,p)=>p+"_____"))+'</p><p class="help">Significa: '+esc(cur.c.pt)+"<br>Palavra que falta: «"+esc(e.pt)+"»</p>"+typeHtml();
    }
    if((cur.f===2||cur.f===3)&&typeof gdWilted==="function"&&gdWilted(S.lang,e.w))b+='<p class="help">Precisa de água. Dica: começa com «'+esc(e.w.charAt(0))+'»</p>';
    openSheet("Ciclo da palavra",head()+b,false);
    const i=$("#cic-in");if(i)i.focus();
  }
  function feedback(good,said){
    const e=cur.e,w=e._c?e.w:full(e);
    grade(cur.cd,good);if(!e._c){window.GDFORM=cur.f;try{skRec(e.w,"ciclo",good);}finally{window.GDFORM=undefined;}}
    good?ok++:bad++;
    const dr=drawSvg(S.lang,e.w,e.pt);
    openSheet("Ciclo da palavra",head()+'<p><b>'+(good?"Certo!":"Ainda não.")+"</b></p>"+(dr?'<div class="wdraw">'+dr+"</div>":"")+
      '<p class="card-w">'+esc(w)+" "+speakBtn(w)+'</p><p class="card-pt">'+esc(e.pt)+"</p>"+
      (!good&&said?'<p class="help">Você respondeu: '+esc(said)+"</p>":"")+
      (cur.c?'<p class="help">'+esc(cur.c.s)+"<br>"+esc(cur.c.pt)+"<br><i>"+esc(cur.c.src)+"</i></p>":"")+
      '<p class="help">'+(good?"Na próxima vez ela volta em outra forma, mais adiante.":"Ela volta amanhã, em outra forma.")+'</p><button type="button" class="btn wide primary" id="cic-next">Continuar</button>',false);
    const n=$("#cic-next");if(n)n.focus();
  }
  function check(){
    const i=$("#cic-in");if(!i)return;const v=i.value.trim();if(!v)return;
    const e=cur.e,n=norm(v);
    feedback(n===norm(e.w)||(cur.f===2&&n===norm(full(e))),v);
  }
  function start(){
    deck=typeof dueWords==="function"?dueWords():[];ci=0;ok=0;bad=0;seen=[];
    if(typeof gdCap==="function"){const ok2=new Set(gdCap(deck.map(d=>d.k||d)));deck=deck.filter(d=>!d.k||ok2.has(d.k));}
    if(!deck.length){openSheet("Nenhuma palavra para hoje",'<p class="help">Não há palavras vencidas em '+esc(LNAME[S.lang])+' agora. As palavras em que você erra nas lições voltam aqui no dia seguinte, cada vez numa forma diferente: ver, ouvir, escrever e usar na frase.</p>',false);return;}
    render();
  }
  window.startCiclo=start;window.__ciclo=function(){return {cur:cur,ci:ci,n:deck.length,ok:ok,bad:bad};};
  const _sr=startReview;
  startReview=function(){if(typeof dueWords==="function"&&dueWords().length)return start();return _sr();};
  document.addEventListener("click",e=>{
    const t=e.target;if(!t.closest)return;
    const o=t.closest("[data-cic-opt]");
    if(o&&cur){const good=+o.dataset.cicOpt===cur.a;feedback(good,cur.o[+o.dataset.cicOpt]);return;}
    if(t.closest("#cic-check"))check();
    else if(t.closest("#cic-show")){const w=$("#cic-word");if(w){const e2=cur.e;w.textContent=e2._c?e2.w:full(e2);}}
    else if(t.closest("#cic-next")){ci++;render();}
    else if(t.closest("#cic-again"))start();
    else if(t.closest("#cic-mem")){const w=memRevWords(seen);closeSheet();startMemRev(w);}
    else if(t.closest("#train-mem")){const w=memRevWords();closeSheet();if(!startMemRev(w))openSheet("Poucas palavras com desenho",'<p class="help">Ainda não há 4 palavras com desenho para montar o jogo. Conforme você estuda e revisa, elas aparecem aqui.</p>',false);}
    else if(t.closest("#train-cycle")){closeSheet();start();}
  });
  document.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target&&e.target.id==="cic-in"){e.preventDefault();check();}});
})();
