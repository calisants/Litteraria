/* ===== Volume 2: Vocabulário, exercícios de escrita (sem áudio) =====
   Usam o mesmo motor da gramática (p9.js). Cada resposta errada entra na revisão como palavra ("v|palavra"). */
VOCTYPES.forEach(t=>{GAMENAME[t[0]]=t[2];});
VOCGAMES.forEach(t=>{STAGES[t]="#gstage";DOCKS[t]="gram";GAMEFN[t]=startVoc;});
const isVocP=()=>!!P&&VOCGAMES.indexOf(P.type)>=0&&P.type!==undefined&&gm.types===null&&!gm.review&&!gm.drill;
/* Apresentação das palavras: aparece aberta na 1ª pergunta de cada página de vocabulário (como o cartão de regra na gramática) */
function vocCard(){
  const ws=vocWords();
  return '<details class="rule"'+(gm.open?" open":"")+"><summary>Palavras desta página · "+esc(ws.length)+"</summary><div class=\"in\">"+
    "<p>Estas são as palavras que aparecem nas perguntas. Leia, ouça (se puder) e só então responda.</p>"+
    '<ul class="rex">'+ws.map(e=>"<li>"+(DRAW[S.lang]&&DRAW[S.lang][e.w.toLowerCase()]?'<span class="wdraw-sm">'+drawSvg(S.lang,e.w,e.pt)+"</span>":"")+"<b>"+esc(full(e))+"</b> <span>"+esc(e.pt)+"</span> "+speakBtn(full(e))+"</li>").join("")+"</ul></div></details>";
}
function vocWords(){
  const arr=(VOCAB[S.lang]&&VOCAB[S.lang][P.cat])||[],K=P.K||2,n=arr.length;
  return arr.slice(Math.round((P.part-1)*n/K),Math.round(P.part*n/K));
}
const sameLetters=(a,b)=>a.length===b.length&&a.every((x,i)=>x===b[i]);
function vocBase(e,q){
  const f=full(e);
  return {q:q,o:[f],a:0,w:"«"+e.pt+"» = «"+f+"».",s:f,k:e.w,lbl:e.pt,ok:[...new Set([e.w,f])],_force:true};
}
/* Classe da palavra, só quando o próprio tema ou o artigo permite afirmar (sem inventar) */
const CLS={verbos:"verbo (forma do infinitivo)",cores:"cor",numeros:"número",descricoes:"descrição (como alguém ou algo é)",saudacoes:"saudação ou expressão",perguntas:"palavra ou expressão de pergunta",dias:"dia da semana, mês ou período",direcoes:"direção ou lugar"};
const catName=c=>(CATS.find(x=>x[0]===c)||[0,(BOOKCAT[c]||{name:c}).name])[1];
function classOf(e){return e.cls||CLS[e.cat]||(e.a?"substantivo (nome de coisa, pessoa ou lugar)":"");}
function wordIntro(e){
  const f=full(e),cl=classOf(e);
  return "Palavra nova em "+LNAME[S.lang]+":\n«"+f+"» significa «"+e.pt+"».\nTema: "+catName(e.cat)+(cl?" · Classe: "+cl:"")+(e.a?"\nVem com o artigo «"+(e.a.endsWith("'")?e.a:e.a)+"»: escreva com ele ou sem ele.":"");
}
/* cada palavra: 1) apresentação + copiar, 2) escrever de novo, 3) escrever sem olhar */
function itemsKnow(e){
  const f=full(e),a=vocBase(e,wordIntro(e)+"\n\n1 de 3 · Copie: «"+f+"»");
  const b=vocBase(e,"2 de 3 · Escreva de novo: «"+f+"»\nSignifica: «"+e.pt+"»");
  const c=vocBase(e,"3 de 3 · Agora sem olhar. Escreva «"+e.pt+"» em "+LNAME[S.lang]+":");
  a.draw=b.draw=drawSvg(S.lang,e.w,e.pt);c.drawAfter=a.draw;
  a._noRec=b._noRec=true;
  return [a,b,c];
}
function itemComplete(e){
  const ch=Array.from(e.w),ix=[];
  ch.forEach((c,i)=>{if(/\p{L}/u.test(c)&&i>0)ix.push(i);});
  const n=Math.max(2,Math.round(ix.length*.4)),hide=new Set(sh0(ix).slice(0,Math.min(n,ix.length)));
  const shown=ch.map((c,i)=>hide.has(i)?"?":c===" "?"/":c).join(" ");
  return vocBase(e,"Complete a palavra para «"+e.pt+"» em "+LNAME[S.lang]+" (cada ? é uma letra que falta):\n"+shown);
}
function itemScramble(e){
  const ch=Array.from(e.w.toLowerCase());let s=ch;
  for(let t=0;t<12&&sameLetters(s,ch);t++)s=sh0(ch);
  return vocBase(e,"Coloque as letras em ordem para escrever «"+e.pt+"» em "+LNAME[S.lang]+":\n"+s.join(" ").toUpperCase());
}
function itemWrite(e){
  const it=vocBase(e,"Escreva «"+e.pt+"» em "+LNAME[S.lang]+":"+(e.a?"\nPode escrever com ou sem o artigo.":""));
  it.ok=[...new Set(Object.values(VOCAB[S.lang]).flat().filter(x=>x.pt===e.pt).flatMap(x=>[x.w,full(x)]))];
  return it;
}
/* Frase de contexto: do Wikcionário (EX) quando há; senão escrita por Claude (CTXC, sem fonte conferida) */
function ctxFor(e){
  const k=e.w.toLowerCase(),x=EX[S.lang]&&EX[S.lang][k];
  if(x)return {s:x[0],pt:x[1],src:"Frase do Wikcionário (CC BY-SA 4.0), traduzida por Claude."};
  const c=CTXC[S.lang]&&(CTXC[S.lang][e.w]||CTXC[S.lang][k]);
  return c?{s:c[0],pt:c[1],src:"Frase escrita por Claude, sem fonte conferida."}:null;
}
function itemContexto(e){
  const c=ctxFor(e),it=vocBase(e,"");
  const re=new RegExp("(^|[^\\p{L}\\p{N}])"+e.w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"(?![\\p{L}\\p{N}])","giu");
  const gap=c.s.replace(re,(m,p)=>p+"_____");
  it.q="Complete a frase em "+LNAME[S.lang]+":\n«"+gap+"»\nSignifica: "+c.pt+"\nPalavra que falta: «"+e.pt+"»"+(e.a?"\nPode escrever só a palavra, sem o artigo.":"");
  it.drawAfter=drawSvg(S.lang,e.w,e.pt);it.s=c.s;it.lab="Fonte:";it.w=c.src;it.ok=[...new Set([e.w])];
  return it;
}
function startVoc(){
  fitFn=null;
  let ws=vocWords();
  if(P.type==="contexto")ws=ws.filter(ctxFor);
  if(P.type==="embaralhar"){const one=ws.filter(e=>/^\p{L}{3,}$/u.test(e.w));if(one.length>=4)ws=one;}
  const mk={reco:vocabItem,completar:itemComplete,embaralhar:itemScramble,escreva:itemWrite,contexto:itemContexto}[P.type];
  const items=P.type==="conheca"?ws.flatMap(itemsKnow):sh0(ws).map(mk);
  gm.items=items;gm.ids=items.map(it=>"v|"+it.k.toLowerCase());gm.types=null;gm.review=false;gm.drill=false;
  gm.i=0;gm.miss=0;gm.open=true;
  loadGram();
}
