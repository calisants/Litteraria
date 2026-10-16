/* ===== Volume 3: Gramática (cartão de regra + perguntas de escolha ou digitadas), revisão e treino ===== */
const gm={items:[],ids:[],types:null,i:0,sel:null,solved:false,bad:false,miss:0,open:true,txt:"",tries:0,review:false,drill:false};
const DAY=864e5,RV_STEPS=[1,3,7,14,30];
const TYPABLE=["presente","passado","futuro","condicional","subjuntivo","reflexivos"];
const isGramP=()=>!!P&&(GRAMTYPES.indexOf(P.type)>=0||(typeof VOCGAMES!=="undefined"&&VOCGAMES.indexOf(P.type)>=0)||P.type==="revisao"||P.type==="treino");
const curType=()=>gm.types?gm.types[gm.i]:P.type;
const nrm=s=>String(s).trim().replace(/[’‘`´]/g,"'").replace(/\s+/g," ").toLowerCase();
const noAcc=s=>nrm(s).normalize("NFD").replace(/[̀-ͯ]/g,"");
const hasRule=t=>!!(GRAM.rules[S.lang]&&GRAM.rules[S.lang][t]);
const canTypeIt=it=>!!it._force||!!it._v||(TYPABLE.indexOf(curType())>=0&&/___/.test(it.q)&&/\(/.test(it.q));
const typedOn=it=>!!it._force||(S.typed&&canTypeIt(it));
const accepts=it=>it.ok||[it.o[it.a]];
/* revisão espaçada. Erro de primeira entra na fila para amanhã (a partir da meia-noite, então aparece logo cedo).
   Acertou na revisão: sobe um degrau (1, 3, 7, 14, 30 dias); passou do último, sai da fila.
   Errou na revisão: desce dois degraus e conta um "tropeço"; item com tropeços volta em 60% do prazo normal. */
const rvDue=n=>{const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+n);return d.getTime();};
const rvIvl=(st,lp)=>Math.max(1,Math.round(RV_STEPS[st]*(lp>0?.6:1)));
function shufItem(it){
  if(!it||it._v||it._force||!it.o||it.o.length<2)return it;
  const ix=it.o.map((_,k)=>k);
  for(let k=ix.length-1;k>0;k--){const j=Math.floor(Math.random()*(k+1));[ix[k],ix[j]]=[ix[j],ix[k]];}
  return Object.assign({},it,{o:ix.map(k=>it.o[k]),a:ix.indexOf(it.a)});
}
function rvUpdate(ok){
  if(gm.drill)return;
  const id=gm.ids[gm.i],T=id.indexOf("v|")===0?S.rvv:S.rv,key=S.lang+":"+id,cur=T[key];
  if(gm.review){
    if(!cur)return;
    const lp=cur[2]||0;
    if(ok){const st=cur[1]+1;if(st>=RV_STEPS.length)delete T[key];else T[key]=[rvDue(rvIvl(st,lp)),st,lp];}
    else T[key]=[rvDue(1),Math.max(0,cur[1]-2),Math.min(99,lp+1)];
  }else if(!ok){T[key]=[rvDue(1),0,cur?Math.min(99,(cur[2]||0)+1):0];}
  save();
}
function startGram(){
  seedNow();fitFn=null;
  gm.items=GRAM.items[S.lang][P.type][P.n-1].map(shufItem);gm.ids=gm.items.map((_,k)=>P.type+"|"+P.n+"|"+k);gm.types=null;gm.review=false;gm.drill=false;
  gm.i=0;gm.miss=0;gm.open=true;
  loadGram();
}
function loadGram(){
  gm.sel=null;gm.solved=false;gm.bad=false;gm.txt="";gm.tries=0;
  renderGram();
  const it=gm.items[gm.i];
  const vocP=isVocP();
  setStatus("#gm-status",vocP?(P.type==="conheca"?"Cada palavra nova: leia, copie, escreva de novo e depois sem olhar.":it._force?"Digite a palavra.":"Escolha a palavra certa."):gm.i===0?(gm.drill?"Digite a forma certa.":gm.review?"Revise: escolha ou digite a resposta certa.":"Leia a regra e escolha a resposta certa."):(it._force?"Digite a forma certa.":"Escolha a resposta certa."));
}
function ruleCard(){
  if(isVocP())return P.type==="conheca"?"":vocCard();
  const t=curType();if(!hasRule(t))return "";
  const R=GRAM.rules[S.lang][t];
  return '<details class="rule"'+(gm.open?" open":"")+"><summary>Regra · "+esc(R.t)+"</summary><div class=\"in\">"+
    R.p.map(x=>"<p>"+esc(x)+"</p>").join("")+
    '<ul class="rex">'+R.ex.map(e=>"<li><b>"+esc(e[0])+"</b>"+(e[1]?" <span>"+esc(e[1])+"</span>":"")+"</li>").join("")+"</ul>"+
    '<p class="src"><b>Fonte:</b> '+esc(R.src)+"</p></div></details>";
}
function renderGram(){
  const it=gm.items[gm.i],lines=it.q.split("\n"),typed=typedOn(it),canType=canTypeIt(it)&&!it._force;
  let h='<p class="ocount">'+(gm.drill?"Treino · ":gm.review?"Revisão · ":"")+"Pergunta "+(gm.i+1)+" de "+gm.items.length+"</p>"+ruleCard();
  if(canType&&!gm.solved)h+='<button type="button" class="btn tgl" id="typed-toggle" aria-pressed="'+S.typed+'">Digitar a resposta: '+(S.typed?"sim":"não")+"</button>";
  h+='<p class="prompt gq">'+lines.map(esc).join("<br>")+"</p>";
  if(typed&&!gm.solved)h+='<input class="tin" id="gm-typed" type="text" inputmode="text" enterkeyhint="done" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" aria-label="Sua resposta" placeholder="Digite a resposta" value="'+esc(gm.txt)+'">';
  else if(typed&&gm.solved)h+='<p class="prompt gq"><b>'+esc(accepts(it)[0])+"</b></p>";
  else h+='<div class="lopts">'+it.o.map((o,k)=>'<button type="button" class="lopt'+(gm.solved&&k===it.a?" right":"")+'" data-k="'+k+'" aria-pressed="'+(gm.sel===k)+'"'+(gm.solved?" disabled":"")+">"+esc(o)+"</button>").join("")+"</div>";
  if(gm.solved)h+='<div class="heard">'+(it.s?speakBtn(it.s):"")+"<span>"+esc(it.s||it.o[it.a])+'</span></div><p class="note"><b>Por quê:</b> '+esc(it.w)+"</p>";
  $("#gstage").innerHTML=h;
  syncGramBtns();
  if(typed&&!gm.solved&&(gm.tries>0||gm.drill)){const n=$("#gm-typed");if(n&&!gm.__noFocus)n.focus();}
}
function syncGramBtns(){
  const it=gm.items[gm.i],typed=typedOn(it);
  $("#gm-submit").disabled=gm.solved||(typed?!gm.txt.trim():gm.sel===null);
  $("#gm-next").disabled=!gm.solved;
  $("#gm-next").textContent=gm.i===gm.items.length-1?((gm.review||gm.drill)?"Terminar":"Ver resumo"):"Próxima";
}
$("#gstage").addEventListener("toggle",e=>{if(e.target.classList&&e.target.classList.contains("rule"))gm.open=e.target.open;},true);
$("#gstage").addEventListener("click",e=>{
  if(!isGramP())return;
  if(e.target.closest("#typed-toggle")){S.typed=!S.typed;save();renderGram();return;}
  if(gm.solved)return;
  const b=e.target.closest(".lopt");if(!b)return;
  gm.sel=+b.dataset.k;renderGram();
});
$("#gstage").addEventListener("input",e=>{if(e.target.id==="gm-typed"){gm.txt=e.target.value;syncGramBtns();}});
$("#gstage").addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.id==="gm-typed"){e.preventDefault();$("#gm-submit").click();}});
function gramSolve(it){
  gm.solved=true;sfx("ok");renderGram();
  if(it.s)speak(it.s);
}
$("#gm-submit").addEventListener("click",()=>{
  if(gm.solved||!isGramP())return;
  const it=gm.items[gm.i],R=GRAM.rules[S.lang][curType()]||{t:it.lbl||""},typed=typedOn(it),acc=accepts(it);
  if(typed?!gm.txt.trim():gm.sel===null)return;
  const ok=typed?acc.some(a=>nrm(a)===nrm(gm.txt)):gm.sel===it.a;
  if(ok){
    if(!gm.bad&&!it._noRec){skRec(it.k,R.t,true);rvUpdate(true);}
    gramSolve(it);setStatus("#gm-status","Certo!","ok");
    return;
  }
  gm.tries++;
  if(!gm.bad){gm.bad=true;gm.miss++;if(!it._noRec){skRec(it.k,R.t,false);rvUpdate(false);}}
  sfx("bad");
  if(!typed){
    const o=it.o[gm.sel];
    shake($('#gstage .lopt[aria-pressed="true"]'));
    setStatus("#gm-status","Ainda não. "+((it.d&&it.d[o])||"Releia a regra e tente outra opção."),"bad");
    return;
  }
  const ans=acc[0];shake($("#gm-typed"));
  if(gm.tries>=3){gramSolve(it);setStatus("#gm-status","A resposta era «"+ans+"»."+(gm.drill?"":" Este item volta na revisão."),"bad");return;}
  let msg="Ainda não.";
  if(acc.some(a=>noAcc(gm.txt)===noAcc(a)))msg="Quase: a letra está certa, confira os acentos.";
  else if(gm.tries>=2)msg="Dica: começa com «"+ans.charAt(0)+"» e tem "+ans.length+" letras.";
  else msg+=it._v?" Tente de novo.":" Releia a regra e tente de novo.";
  setStatus("#gm-status",msg,"bad");
});
$("#gm-next").addEventListener("click",()=>{
  if(!gm.solved)return;
  if(gm.i<gm.items.length-1){gm.i++;gm.open=false;loadGram();return;}
  const n=gm.items.length,list=gm.items.map(it=>'<div class="srow"><span class="pt"><b>'+esc(it.s||it.o[it.a])+"</b><br><small>"+esc(it.w)+"</small></span>"+(it.s?speakBtn(it.s):"")+"</div>").join("");
  const goalLine=typeof goalText==="function"?'<p class="help">'+esc(goalText())+"</p>":"";
  if(gm.drill){
    sfx("done");
    openSheet("Treino concluído",'<p class="help">'+(n-gm.miss)+" de "+n+" certas de primeira.</p>"+goalLine+'<button type="button" class="btn primary wide" id="drill-more" style="margin-bottom:10px">Mais 10</button>'+list,true);
    setStatus("#gm-status","Treino concluído.","ok");return;
  }
  if(gm.review){
    sfx("done");
    openSheet("Revisão concluída",'<p class="help">'+(n-gm.miss)+" de "+n+" certas de primeira.</p>"+goalLine+
      '<button type="button" class="btn primary wide" id="rv-next" style="margin-bottom:10px">Fazer a próxima página nova</button>'+list,true);
    setStatus("#gm-status","Revisão concluída.","ok");return;
  }
  markDone();sfx("done");
  openSheet("Página concluída",'<p class="help">'+(n-gm.miss)+" de "+n+" certas de primeira."+(gm.miss?" Os erros voltam em Hoje, para revisar.":"")+"</p>"+goalLine+list,true);
  setStatus("#gm-status","Página concluída.","ok");
});
