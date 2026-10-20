/* ===== Cartões de revisão com autoavaliação: «Fácil» / «Preciso rever». Sem tempo, sem pontos. ===== */
(function(){
  let deck=[],ci=0,shown=false,easy=0,hard=0;
  window.dueWords=function(){return dueKeys().filter(x=>x[2]===1).slice(0,10).map(x=>x[1]);};
  function grade(key,ok){
    const cur=S.rvv[key];if(!cur)return;
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
    const r=rvVocab(deck[ci]);
    if(!r){ci++;render();return;}
    const e=r.e;
    openSheet("Cartão "+(ci+1)+" de "+deck.length,
      '<p class="card-w">'+esc(full(e))+" "+speakBtn(full(e))+"</p>"+
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
