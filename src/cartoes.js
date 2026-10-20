/* ===== Cartões de revisão com autoavaliação: «Fácil» / «Preciso rever». Sem tempo, sem pontos. ===== */
(function(){
  let deck=[],ci=0,shown=false,easy=0,hard=0;
  window.dueWords=function(){
    const a=dueKeys().filter(x=>x[2]===1).map(x=>({t:"v",k:x[1]}));
    const b=S.cad.filter(c=>c.l===S.lang&&c.pt&&c.d<=Date.now()).map(c=>({t:"c",o:c}));
    return a.concat(b).slice(0,10);
  };
  function grade(card,ok){
    if(card.t==="c"){
      const o=card.o,lp=0;
      if(ok){const st=o.s+1;if(st>=RV_STEPS.length){const i=S.cad.indexOf(o);if(i>=0)S.cad.splice(i,1);}else{o.s=st;o.d=rvDue(rvIvl(st,lp));}}
      else{o.s=Math.max(0,o.s-2);o.d=rvDue(1);}
      save();return;
    }
    const key=card.k,cur=S.rvv[key];if(!cur)return;
    const lp=cur[2]||0;
    if(ok){const st=cur[1]+1;if(st>=RV_STEPS.length)delete S.rvv[key];else S.rvv[key]=[rvDue(rvIvl(st,lp)),st,lp];}
    else S.rvv[key]=[rvDue(1),Math.max(0,cur[1]-2),Math.min(99,lp+1)];
    save();
  }
  function render(){
    if(ci>=deck.length){
      openSheet("Cartões concluídos",'<p class="help">Você passou por '+deck.length+' palavra(s): '+easy+' «Fácil» e '+hard+' «Preciso rever». As que precisam de revisão voltam amanhã; as fáceis demoram mais para voltar.</p><button type="button" class="btn wide" id="cards-again">Ver se há mais cartões</button>',false);
      return;
    }
    const cd=deck[ci];let e;
    if(cd.t==="c")e={w:cd.o.w,pt:cd.o.pt,_c:1};
    else{const r=rvVocab(cd.k);if(!r){ci++;render();return;}e=r.e;}
    openSheet("Cartão "+(ci+1)+" de "+deck.length,
      '<p class="card-w">'+esc(e._c?e.w:full(e))+" "+speakBtn(e._c?e.w:full(e))+"</p>"+
      (shown?'<p class="card-pt">'+esc(e.pt)+'</p><div class="row"><button type="button" class="btn wide" id="card-easy">Fácil</button><button type="button" class="btn wide" id="card-hard">Preciso rever</button></div>':'<p class="help">Tente lembrar o significado antes de virar.</p><button type="button" class="btn wide primary" id="card-show">Mostrar significado</button>'),false);
  }
  function start(){
    deck=dueWords();ci=0;shown=false;easy=0;hard=0;
    if(!deck.length){openSheet("Nenhuma palavra para hoje",'<p class="help">Não há palavras vencidas em '+esc(LNAME[S.lang])+' agora. As palavras em que você erra nas lições entram aqui no dia seguinte.</p>',false);return;}
    render();
  }
  window.startCards=start;
  document.addEventListener("click",e=>{
    const t=e.target;if(!t.closest)return;
    if(t.closest("#card-show")){shown=true;render();}
    else if(t.closest("#card-easy")||t.closest("#card-hard")){const ok=!!t.closest("#card-easy");grade(deck[ci],ok);ok?easy++:hard++;ci++;shown=false;render();}
    else if(t.closest("#cards-again")){start();}
    else if(t.closest("#train-cards")){closeSheet();start();}
  });
})();
