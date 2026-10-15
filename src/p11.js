/* ===== Volume 2: Vocabulário, exercícios de escrita (sem áudio) =====
   Usam o mesmo motor da gramática (p9.js). Cada resposta errada entra na revisão como palavra ("v|palavra"). */
VOCTYPES.forEach(t=>{GAMENAME[t[0]]=t[2];});
["reco","completar","embaralhar","escreva"].forEach(t=>{STAGES[t]="#gstage";DOCKS[t]="gram";GAMEFN[t]=startVoc;});
function vocWords(){
  const arr=(VOCAB[S.lang]&&VOCAB[S.lang][P.cat])||[],h=Math.ceil(arr.length/2);
  return P.part===1?arr.slice(0,h):arr.slice(h);
}
const sameLetters=(a,b)=>a.length===b.length&&a.every((x,i)=>x===b[i]);
function vocBase(e,q){
  const f=full(e);
  return {q:q,o:[f],a:0,w:"«"+e.pt+"» = «"+f+"».",s:f,k:e.w,lbl:e.pt,ok:[...new Set([e.w,f])],_force:true};
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
  const it=vocBase(e,"Escreva «"+e.pt+"» em "+LNAME[S.lang]+":"+(e.a?"\n(com ou sem o artigo)":""));
  it.ok=[...new Set(Object.values(VOCAB[S.lang]).flat().filter(x=>x.pt===e.pt).flatMap(x=>[x.w,full(x)]))];
  return it;
}
function startVoc(){
  fitFn=null;
  let ws=vocWords();
  if(P.type==="embaralhar"){const one=ws.filter(e=>/^\p{L}{3,}$/u.test(e.w));if(one.length>=4)ws=one;}
  const mk={reco:vocabItem,completar:itemComplete,embaralhar:itemScramble,escreva:itemWrite}[P.type];
  const items=sh0(ws).map(mk);
  gm.items=items;gm.ids=items.map(it=>"v|"+it.k.toLowerCase());gm.types=null;gm.review=false;gm.drill=false;
  gm.i=0;gm.miss=0;gm.open=false;
  loadGram();
}
