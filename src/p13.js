/* ===== Trilha de aprendizado: o que "Hoje" sugere vem do progresso e dos erros da pessoa, não do último jogo aberto =====
   Prioridade: 1) revisão espaçada vencida; 2) muitas palavras em que errou mais do que acertou; 3) próxima lição da trilha.
   A trilha vai do mais fácil ao mais difícil: pronúncia → por grupo de temas (vocabulário do tema → jogos do tema) → gramática → conversação.
   Lições de vocabulário cujas palavras a pessoa já domina (80%+ com 2 acertos ou mais) são puladas. */
function wordsOf(p){
  const arr=(VOCAB[S.lang]&&VOCAB[S.lang][p.cat])||[],K=p.K||2,n=arr.length;
  return arr.slice(Math.round((p.part-1)*n/K),Math.round(p.part*n/K));
}
/* Gramática e frases só entram em «Hoje»/«Próximo» quando a pessoa já acertou palavras suficientes (decisão dela, 23/10/2026:
   aprender aos poucos, como criança; a gramática não pode presumir que ela conhece as palavras). Os números são julgamento de Claude, não vêm de fonte.
   A n-ésima página de gramática pede GRAM_BASE+GRAM_STEP*n palavras já acertadas pelo menos uma vez no idioma. As páginas continuam abertas em Lições. */
const GRAM_BASE=30,GRAM_STEP=9,CONV_BASE=20,CONV_STEP=6;
function knownWords(){const sk=S.sk[S.lang]||{};let n=0;for(const k in sk)if(sk[k][0]>=1)n++;return n;}
const VOCLESSON=["conheca","contexto","reco","completar","embaralhar","escreva"];
let _path=null;
function lessonPath(){
  if(_path)return _path;
  const M={};VOLUMES.forEach(v=>{M[v.id]=new Map(v.pages.map(p=>[p.id,p]));});
  const out=[],add=(vid,id,extra)=>{const p=M[vid].get(id);if(p)out.push(Object.assign({vol:vid,page:p},extra||{}));};
  VOLUME2.pages.forEach(p=>out.push({vol:2,page:p,audio:true}));
  const gids=GROUPS.map(g=>g[0]).filter(g=>CATS.some(c=>c[2]===g));
  const chunk=(arr,i,n)=>arr.slice(Math.round(i*arr.length/n),Math.round((i+1)*arr.length/n));
  const gram=VOLUME4.pages,conv=[];let gn=0,cn=0;
  VOLUME3.pages.filter(p=>p.type==="frases"&&!p.book).forEach(p=>conv.push(p));
  const pairs=VOLUME3.pages.filter(p=>p.type==="sentence").map(s=>[s,M[3].get("resposta-"+s.n)]);
  pairs.forEach(pr=>pr.forEach(p=>{if(p)conv.push(p);}));
  gids.forEach((g,gi)=>{
    CATS.filter(c=>c[2]===g).forEach(c=>{
      VOLUME5.pages.filter(p=>p.cat===c[0]&&p.type==="conheca").forEach(p=>out.push({vol:5,page:p,voc:true}));
      ["contexto","reco","completar","embaralhar","escreva"].forEach(t=>[1,2].forEach(k=>add(5,t+"-"+c[0]+"-"+k,{voc:true})));
      add(1,"odd-"+c[0]);add(1,"search-"+c[0]+"-easy");add(1,"cross-"+c[0]+"-easy");
    });
    add(1,"connect-"+g+"-easy-1");
    chunk(gram,gi,gids.length).forEach(p=>out.push({vol:4,page:p,need:GRAM_BASE+GRAM_STEP*(gn++)}));
    chunk(conv,gi,gids.length).forEach(p=>out.push({vol:3,page:p,need:CONV_BASE+CONV_STEP*(cn++)}));
    if(gi===Math.min(1,gids.length-1))earlyBook(out,add);
  });
  /* temas de livros: novas lições no fim da trilha (só no idioma do livro) */
  BOOKS.forEach(b=>b.chunks.forEach(c=>{
    VOLUME5.pages.filter(p=>p.cat===c.cat&&p.type==="conheca").forEach(p=>out.push({vol:5,page:p,voc:true}));
    ["reco","completar","embaralhar","escreva"].forEach(t=>[1,2].forEach(k=>add(5,t+"-"+c.cat+"-"+k,{voc:true})));
  }));
  BOOKS.forEach(b=>VOLUME3.pages.filter(p=>p.book===b.id||p.rd===b.id).forEach(p=>out.push({vol:3,page:p})));
  /* jogos de livros e de memória: entram no fim da trilha e, antes disso, como intervalo entre lições (ver pickGame) */
  BOOKS.forEach(b=>b.chunks.forEach(c=>{add(1,"search-"+c.cat+"-easy");add(1,"cross-"+c.cat+"-easy");}));
  const byT=["memoria","citacao","regra","ouvir","trecho"].map(t=>VOLUME.pages.filter(p=>p.type===t));
  for(let i=0;byT.some(a=>i<a.length);i++)byT.forEach(a=>{if(a[i])out.push({vol:1,page:a[i]});});
  const seen=new Set();
  return(_path=out.filter(r=>{const k=r.page.id;if(seen.has(k))return false;seen.add(k);return true;}));
}
/* «Primeiro livrinho» (v1.57, pedido dela: livros curtos mais cedo): depois do 2º grupo de temas entra um pedacinho de um livro curto
   de cada idioma: as primeiras palavras do livro e uma página de frases (e, no inglês, a primeira Leitura). As páginas continuam também no fim da trilha. */
const EARLY={en:["peter",["frases-livro-peter-1","leitura-peter-1"]],fr:["perrault",["frases-livro-verne-1"]],it:["racconti",["frases-livro-pinocchio-1"]]};
function earlyBook(out,add){
  Object.keys(EARLY).forEach(l=>{
    const b=BOOKS.find(x=>x.id===EARLY[l][0]);if(!b||!b.chunks.length)return;
    const cat=b.chunks[0].cat;
    VOLUME5.pages.filter(p=>p.cat===cat&&p.type==="conheca").slice(0,3).forEach(p=>out.push({vol:5,page:p,voc:true,early:true}));
    add(5,"reco-"+cat+"-1",{voc:true,early:true});
    EARLY[l][1].forEach((id,i)=>add(3,id,{need:25+10*i,early:true}));
  });
}
/* Jogos entre lições: depois de 2 lições seguidas, o «Hoje» e o «Próximo» oferecem um jogo (de tipo diferente do último).
   Prioridade: jogo do mesmo tema da próxima lição; jogo de tema anterior ainda não feito; jogo solto (memória, livros). */
const GAME_T=["odd","connect","search","cross","memoria","citacao","trecho","regra","ouvir"];
const isGameRef=r=>GAME_T.indexOf(r.page.type)>=0;
const refCat=r=>r.page.cat||r.page.main||null;
function pickGame(up){
  const L=lessonPath(),upI=up?L.findIndex(r=>r.page.id===up.page.id):L.length,cat=up?refCat(up):null;
  const el=[];L.forEach((r,i)=>{if(isGameRef(r)&&eligible(r))el.push([r,i]);});
  if(!el.length)return null;
  const alt=a=>{const x=a.filter(y=>y[0].page.type!==S.lgt);return x.length?x:a;};
  const lv=[
    cat?el.filter(x=>refCat(x[0])===cat):[],
    el.filter(x=>x[1]<upI&&!SOLTOS.has(x[0].page.type)),
    el.filter(x=>SOLTOS.has(x[0].page.type))
  ];
  for(const a of lv)if(a.length)return alt(a)[0][0];
  return null;
}
const SOLTOS=new Set(["memoria","citacao","trecho","regra","ouvir"]);
const _mdone=markDone;
markDone=function(){
  const t=P&&P.type;
  if(t&&t!=="revisao"&&t!=="treino"){
    if(GAME_T.indexOf(t)>=0){S.sq=0;S.lgt=t;}else S.sq=Math.min(99,S.sq+1);
  }
  _mdone();
};
function pageMastered(p){
  const sk=S.sk[S.lang]||{},ws=wordsOf(p);
  if(!ws.length)return false;
  const ok=ws.filter(e=>{const a=sk[e.w.toLowerCase()];return a&&a[0]>=2&&a[0]>a[1];}).length;
  return ok/ws.length>=.8;
}
const canHear=()=>"speechSynthesis" in window;
const eligible=r=>pageInLang(r.page)&&!S.done[S.lang+":"+r.page.id]&&!(r.audio&&!canHear())&&!(r.voc&&pageMastered(r.page))&&!(r.need&&knownWords()<r.need);
const gatedLeft=()=>{const k=knownWords();return lessonPath().filter(r=>r.need&&pageInLang(r.page)&&!S.done[S.lang+":"+r.page.id]&&k<r.need).length;};
function nextNewPage(){
  const up=lessonPath().find(eligible)||null;
  if(S.sq>=2){const g=pickGame(up);if(g)return g;}
  return up;
}
/* «Próximo» (folha de página concluída): segue a trilha a partir da página que acabou de terminar, sem voltar ao início.
   Se não há mais nada à frente, cai na primeira lição ainda não feita; sem nenhuma, o botão nem aparece. */
function nextAfter(p){
  const L=lessonPath(),i=L.findIndex(r=>r.page.id===p.id);
  const up=(i>=0&&L.slice(i+1).find(eligible))||L.find(eligible)||null;
  if(S.sq>=2){const g=pickGame(up);if(g)return g;}
  return up;
}
const canGoNext=()=>!!P&&P.type!=="revisao"&&P.type!=="treino"&&isDone(P)&&!!nextAfter(P);
$("#sheet-next").addEventListener("click",()=>{
  const np=P&&nextAfter(P);closeSheet();
  if(np)startLesson(np);else go("home");
});
function weakWords(){
  const sk=S.sk[S.lang]||{},ix=vIdx()[S.lang],out=[];
  for(const k in sk){const a=sk[k];if(a[1]>a[0]&&ix[k])out.push([a[1]-a[0],ix[k]]);}
  return out.sort((x,y)=>y[0]-x[0]).map(x=>x[1]);
}
const WEAK_MIN=8;
/* Retorno aos sons e às palavras (pedido dela, 23/10/2026): mesmo com o Volume de Pronúncia e os temas de vocabulário concluídos,
   uma vez por dia o «Hoje» sugere rever uma página já feita. Dias alternados: pronúncia (sons das letras e combinações) e vocabulário. */
function refresher(){
  if(S.rfd===ymd())return null;
  const done=lessonPath().filter(r=>(r.audio||r.voc)&&!r.page.book&&pageInLang(r.page)&&S.done[S.lang+":"+r.page.id]&&!(S.dtd&&S.dtd.d===ymd()&&S.dtd.ids.indexOf(S.lang+":"+r.page.id)>=0));
  if(!done.length)return null;
  const day=Math.floor(Date.now()/864e5),pron=done.filter(r=>r.audio),voc=done.filter(r=>r.voc);
  const pool=(day%2===0&&pron.length)?pron:(voc.length?voc:pron);
  let h=0;const k=ymd()+S.lang;for(let i=0;i<k.length;i++)h=(h*31+k.charCodeAt(i))>>>0;
  return pool[h%pool.length];
}
function todayPlan(){
  const d=dueCount();if(d)return{kind:"review",n:d};
  const w=weakWords().length;if(w>=WEAK_MIN)return{kind:"weak",n:w};
  const rf=refresher();if(rf)return{kind:"refresh",ref:rf};
  const r=nextNewPage();return r?{kind:"lesson",ref:r}:{kind:"done",gated:gatedLeft()};
}
function lessonName(r){
  const V=VOLUMES.find(v=>v.id===r.vol),t=V.types.find(x=>x[0]===r.page.type);
  return V.title.replace(/^Volume \d · /,"")+" · "+(t?t[2]:"")+" #"+r.page.n+(r.page.sub?" · "+r.page.sub:"");
}
function planText(){
  const p=todayPlan();
  return p.kind==="review"?p.n+" para revisar":p.kind==="weak"?"reforçar "+p.n+" palavras que errou":p.kind==="refresh"?"rever: "+lessonName(p.ref):p.kind==="lesson"?"próxima: "+lessonName(p.ref):p.gated?"aprenda mais palavras para liberar a gramática":"tudo em dia";
}
function startLesson(r){S.vol=r.vol;S.fGame="all";S.fTheme="all";save();startPage(r.page.id);}
