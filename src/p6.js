/* ===== Conversação (monte a frase) ===== */
const sn={lines:[],i:0,words:[],bank:[],slot:[],solved:false,doneLines:0};
function startSentence(){
  seedNow();
  sn.fr=P.type==="frases";sn.lines=P.lines||(sn.fr?FRASES:DIALOGS)[S.lang][P.n-1];sn.i=0;sn.doneLines=0;fitFn=null;
  loadLine();
}
function loadLine(){
  const l=sn.lines[sn.i];
  sn.words=l.s.split(" ");
  sn.bank=shuffle(sn.words.map((w,id)=>({id:id,w:w})));
  if(sn.words.length>1&&sn.bank.every((b,k)=>b.w===sn.words[k]))sn.bank.reverse();
  sn.slot=[];sn.solved=false;sn.bad=false;
  renderSentence();
  setStatus("#sn-status","Toque nas palavras para montar a frase, na ordem certa.");
}
function renderSentence(){
  const l=sn.lines[sn.i],spk=sn.i%2===0?"A":"B";
  const prev=sn.i>0&&!sn.fr?'<p class="said"><small>Fala anterior</small>'+esc(sn.lines[sn.i-1].s)+"</p>":"";
  let h=prev+'<p class="prompt"><small>'+(sn.fr?"Frase ":"Fala ")+(sn.i+1)+" de "+sn.lines.length+(sn.fr?" · monte em ":" · pessoa "+spk+" diz, em ")+LNAME[S.lang]+":</small>"+esc(l.pt)+"</p>";
  if(P.book)h+='<p class="note"><small>Frase do livro «'+esc(P.sub)+'». Tradução e nota: escritas por Claude, sem fonte conferida.</small></p>';
  h+='<div class="slot" id="sn-slot" aria-label="Sua frase">'+sn.slot.map(b=>'<button type="button" class="blk" data-un="'+b.id+'">'+esc(b.w)+"</button>").join("")+"</div>";
  const used=new Set(sn.slot.map(b=>b.id));
  h+='<div class="bank" id="sn-bank">'+sn.bank.map(b=>'<button type="button" class="blk'+(used.has(b.id)?" used":"")+'" data-w="'+b.id+'"'+(used.has(b.id)?" tabindex=-1 aria-hidden=true":"")+">"+esc(b.w)+"</button>").join("")+"</div>";
  if(sn.solved)h+='<div class="heard">'+speakBtn(l.s)+'<span>'+esc(l.s)+'</span></div><p class="note"><b>Nota:</b> '+hl(l.note)+"</p>"+(P.book&&typeof phFavBtn==="function"?phFavBtn(P.book,(+P.id.split("-").pop()-1)*5+sn.i):"");
  $("#sstage").innerHTML=h;
  $("#sn-submit").disabled=sn.solved||sn.slot.length!==sn.words.length;
  $("#sn-clear").disabled=sn.solved||!sn.slot.length;
  $("#sn-next").disabled=!sn.solved;
  $("#sn-next").textContent=sn.i===sn.lines.length-1?(sn.fr?"Ver frases":"Ver diálogo"):(sn.fr?"Próxima frase":"Próxima fala");
}
$("#sstage").addEventListener("click",e=>{
  if(sn.solved)return;
  const w=e.target.closest("[data-w]"),u=e.target.closest("[data-un]");
  if(w){const b=sn.bank.find(x=>x.id===+w.dataset.w);if(b&&!sn.slot.includes(b))sn.slot.push(b);}
  else if(u){sn.slot=sn.slot.filter(x=>x.id!==+u.dataset.un);}
  else return;
  renderSentence();
});
$("#sn-clear").addEventListener("click",()=>{if(sn.solved)return;sn.slot=[];renderSentence();});
$("#sn-submit").addEventListener("click",()=>{
  if(sn.solved||sn.slot.length!==sn.words.length)return;
  const ok=sn.slot.every((b,k)=>b.w===sn.words[k]);
  if(ok){
    sn.solved=true;sn.doneLines++;sfx("ok");
    if(!sn.bad){skRec(sn.lines[sn.i].s,sn.lines[sn.i].pt,true);}
    renderSentence();
    setStatus("#sn-status","Certo!","ok");
    speak(sn.lines[sn.i].s);
  }else{
    if(!sn.bad){sn.bad=true;skRec(sn.lines[sn.i].s,sn.lines[sn.i].pt,false);}
    sfx("bad");shake($("#sn-slot"));
    setStatus("#sn-status","Ainda não. Toque numa palavra da frase para tirá-la e reordene.","bad");
  }
});
$("#sn-next").addEventListener("click",()=>{
  if(!sn.solved)return;
  if(sn.i<sn.lines.length-1){sn.i++;loadLine();return;}
  markDone();sfx("done");
  openSheet(sn.fr?"Frases completas":"Diálogo completo",sn.lines.map(l=>'<div class="srow"><span class="pt"><b>'+esc(l.s)+"</b><br><small>"+esc(l.pt)+"</small></span>"+speakBtn(l.s)+"</div>").join(""),true);
  setStatus("#sn-status","Página concluída.","ok");
});

/* ===== O Intruso ===== */
const od={rounds:[],i:0,sel:null,solved:false,all:[]};
function startOdd(){
  seedNow();
  const R=5;od.rounds=[];od.all=[];
  if(P.main){
    /* página de um tema: três palavras do tema + um intruso de outro tema */
    const a=P.main,words=shuffle(VOCAB[S.lang][a]);
    const others=shuffle(CATS.map(c=>c[0]).filter(k=>k!==a&&!clashes(a,k)));
    for(let i=0;i<R;i++){
      const b=others[i%others.length];
      const three=words.slice(i*3,i*3+3);
      const intr=shuffle(VOCAB[S.lang][b]).find(x=>three.every(t=>t.s!==x.s))||VOCAB[S.lang][b][0];
      const tiles=shuffle(three.map(it=>({it:it,odd:false})).concat([{it:intr,odd:true}]));
      od.rounds.push({a:a,b:b,tiles:tiles});od.all.push(...three,intr);
    }
  }else{
    const keys=P.cats.length?P.cats:CATS.map(c=>c[0]);
    const order=shuffle(keys);
    for(let i=0;i<R;i++){
      const a=order[i%order.length];
      const pool=(P.cats.length>1?P.cats:CATS.map(c=>c[0])).filter(k=>k!==a&&!clashes(a,k));
      const others=shuffle(pool);
      const b=others[0];
      const three=shuffle(VOCAB[S.lang][a]).slice(0,3);
      const intr=shuffle(VOCAB[S.lang][b])[0];
      const tiles=shuffle(three.map(it=>({it:it,odd:false})).concat([{it:intr,odd:true}]));
      od.rounds.push({a:a,b:b,tiles:tiles});
      od.all.push(...three,intr);
    }
  }
  od.i=0;od.sel=null;od.solved=false;fitFn=null;
  renderOdd();
  setStatus("#od-status","Três palavras são do mesmo grupo. Qual é o intruso?");
}
function renderOdd(){
  const r=od.rounds[od.i];
  let h='<p class="ocount">Rodada '+(od.i+1)+" de "+od.rounds.length+"</p>";
  h+='<div class="ogrid">'+r.tiles.map((t,k)=>{
    const cls="otile"+(od.solved&&t.odd?" right":"");
    return '<button type="button" class="'+cls+'" data-k="'+k+'" aria-pressed="'+(od.sel===k)+'"'+(od.solved?" disabled":"")+"><span>"+esc(full(t.it))+"</span><small>"+esc(t.it.pt)+"</small></button>";
  }).join("")+"</div>";
  if(od.solved)h+='<p class="note">As outras três são de <b>'+esc(CATLABEL[r.a])+"</b>. <b>"+esc(full(r.tiles.find(t=>t.odd).it))+"</b> é de "+esc(CATLABEL[r.b])+".</p>";
  $("#ostage").innerHTML=h;
  $("#od-submit").disabled=od.solved||od.sel===null;
  $("#od-next").disabled=!od.solved;
  $("#od-next").textContent=od.i===od.rounds.length-1?"Terminar":"Próxima";
}
$("#ostage").addEventListener("click",e=>{
  const b=e.target.closest(".otile");if(!b||od.solved)return;
  od.sel=+b.dataset.k;renderOdd();
  const t=od.rounds[od.i].tiles[od.sel];speak(full(t.it));
});
$("#od-submit").addEventListener("click",()=>{
  if(od.solved||od.sel===null)return;
  const r=od.rounds[od.i];
  const oddIt=r.tiles.find(t=>t.odd).it;
  if(r.tiles[od.sel].odd){if(!r.bad)skRec(oddIt.w,oddIt.pt,true);od.solved=true;sfx("ok");renderOdd();setStatus("#od-status","Certo! Esse é o intruso.","ok");}
  else{if(!r.bad){r.bad=true;skRec(oddIt.w,oddIt.pt,false);}sfx("bad");shake($('#ostage .otile[aria-pressed="true"]'));setStatus("#od-status","Esse pertence ao grupo. Tente outra palavra.","bad");}
});
$("#od-next").addEventListener("click",()=>{
  if(!od.solved)return;
  if(od.i<od.rounds.length-1){od.i++;od.sel=null;od.solved=false;renderOdd();setStatus("#od-status","Três palavras são do mesmo grupo. Qual é o intruso?");return;}
  markDone();sfx("done");
  setStatus("#od-status","Página concluída.","ok");
  doneSheet("Página concluída: palavras",od.all);
});



/* ===== Volume 3: Qual resposta faz sentido? ===== */
const rs={lines:[],i:0,opts:[],sel:null,solved:false,said:[]};
function startResp(){
  seedNow();fitFn=null;
  rs.lines=DIALOGS[S.lang][P.n-1];rs.i=0;rs.said=[];
  loadResp();
}
function loadResp(){
  const l=rs.lines[rs.i];
  const others=shuffle(rs.lines.filter((x,k)=>k!==rs.i)).slice(0,2);
  rs.opts=shuffle([l].concat(others).map(x=>({x:x,ok:x===l})));
  rs.sel=null;rs.solved=false;rs.bad=false;
  renderResp();
  setStatus("#rs-status","Escolha a fala que faz mais sentido neste ponto da conversa.");
}
function renderResp(){
  const l=rs.lines[rs.i];
  let h='<p class="ocount">Fala '+(rs.i+1)+" de "+rs.lines.length+" · "+esc(P.meta)+"</p>";
  h+=rs.said.map((x,k)=>'<p class="said"><small>Pessoa '+(k%2===0?"A":"B")+"</small>"+esc(x.s)+"</p>").join("");
  h+='<p class="prompt"><small>Pessoa '+(rs.i%2===0?"A":"B")+" responde:</small>"+(rs.i===0?"Qual fala abre a conversa?":"Qual fala vem agora?")+"</p>";
  h+='<div class="lopts">'+rs.opts.map((o,k)=>'<button type="button" class="lopt long'+(rs.solved&&o.ok?" right":"")+'" data-k="'+k+'" aria-pressed="'+(rs.sel===k)+'"'+(rs.solved?" disabled":"")+">"+esc(o.x.s)+"</button>").join("")+"</div>";
  if(rs.solved)h+='<div class="heard">'+speakBtn(l.s)+"<span>"+esc(l.pt)+'</span></div><p class="note"><b>Nota:</b> '+hl(l.note)+"</p>";
  $("#rstage").innerHTML=h;
  $("#rs-submit").disabled=rs.solved||rs.sel===null;
  $("#rs-next").disabled=!rs.solved;
  $("#rs-next").textContent=rs.i===rs.lines.length-1?"Ver diálogo":"Próxima";
}
$("#rstage").addEventListener("click",e=>{
  if(!P||P.type!=="resposta"||rs.solved)return;
  const b=e.target.closest(".lopt");if(!b)return;
  rs.sel=+b.dataset.k;renderResp();
});
$("#rs-submit").addEventListener("click",()=>{
  if(rs.solved||rs.sel===null)return;
  if(rs.opts[rs.sel].ok){if(!rs.bad)skRec(rs.lines[rs.i].s,rs.lines[rs.i].pt,true);rs.solved=true;sfx("ok");renderResp();setStatus("#rs-status","Certo!","ok");speak(rs.lines[rs.i].s);}
  else{if(!rs.bad){rs.bad=true;skRec(rs.lines[rs.i].s,rs.lines[rs.i].pt,false);}sfx("bad");shake($('#rstage .lopt[aria-pressed="true"]'));setStatus("#rs-status","Ainda não. Releia o que já foi dito e tente outra fala.","bad");}
});
$("#rs-next").addEventListener("click",()=>{
  if(!rs.solved)return;
  rs.said.push(rs.lines[rs.i]);
  if(rs.i<rs.lines.length-1){rs.i++;loadResp();return;}
  markDone();sfx("done");
  openSheet("Diálogo completo",rs.lines.map(l=>'<div class="srow"><span class="pt"><b>'+esc(l.s)+"</b><br><small>"+esc(l.pt)+"</small></span>"+speakBtn(l.s)+"</div>").join(""),true);
  setStatus("#rs-status","Página concluída.","ok");
});
