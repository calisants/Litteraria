/* ===== Trilha de aprendizado: o que "Hoje" sugere vem do progresso e dos erros da pessoa, não do último jogo aberto =====
   Prioridade: 1) revisão espaçada vencida; 2) muitas palavras em que errou mais do que acertou; 3) próxima lição da trilha.
   A trilha vai do mais fácil ao mais difícil: pronúncia → por grupo de temas (vocabulário do tema → jogos do tema) → gramática → conversação.
   Lições de vocabulário cujas palavras a pessoa já domina (80%+ com 2 acertos ou mais) são puladas. */
function wordsOf(p){
  const arr=(VOCAB[S.lang]&&VOCAB[S.lang][p.cat])||[],K=p.K||2,n=arr.length;
  return arr.slice(Math.round((p.part-1)*n/K),Math.round(p.part*n/K));
}
const VOCLESSON=["conheca","reco","completar","embaralhar","escreva"];
let _path=null;
function lessonPath(){
  if(_path)return _path;
  const M={};VOLUMES.forEach(v=>{M[v.id]=new Map(v.pages.map(p=>[p.id,p]));});
  const out=[],add=(vid,id,extra)=>{const p=M[vid].get(id);if(p)out.push(Object.assign({vol:vid,page:p},extra||{}));};
  VOLUME2.pages.forEach(p=>out.push({vol:2,page:p,audio:true}));
  const gids=GROUPS.map(g=>g[0]).filter(g=>CATS.some(c=>c[2]===g));
  const chunk=(arr,i,n)=>arr.slice(Math.round(i*arr.length/n),Math.round((i+1)*arr.length/n));
  const gram=VOLUME4.pages,conv=[];
  VOLUME3.pages.filter(p=>p.type==="frases"&&!p.book).forEach(p=>conv.push(p));
  const pairs=VOLUME3.pages.filter(p=>p.type==="sentence").map(s=>[s,M[3].get("resposta-"+s.n)]);
  pairs.forEach(pr=>pr.forEach(p=>{if(p)conv.push(p);}));
  gids.forEach((g,gi)=>{
    CATS.filter(c=>c[2]===g).forEach(c=>{
      VOLUME5.pages.filter(p=>p.cat===c[0]&&p.type==="conheca").forEach(p=>out.push({vol:5,page:p,voc:true}));
      ["reco","completar","embaralhar","escreva"].forEach(t=>[1,2].forEach(k=>add(5,t+"-"+c[0]+"-"+k,{voc:true})));
      add(1,"odd-"+c[0]);add(1,"search-"+c[0]+"-easy");add(1,"cross-"+c[0]+"-easy");
    });
    add(1,"connect-"+g+"-easy-1");
    chunk(gram,gi,gids.length).forEach(p=>out.push({vol:4,page:p}));
    chunk(conv,gi,gids.length).forEach(p=>out.push({vol:3,page:p}));
  });
  /* temas de livros: novas lições no fim da trilha (só no idioma do livro) */
  BOOKS.forEach(b=>b.chunks.forEach(c=>{
    VOLUME5.pages.filter(p=>p.cat===c.cat&&p.type==="conheca").forEach(p=>out.push({vol:5,page:p,voc:true}));
    ["reco","completar","embaralhar","escreva"].forEach(t=>[1,2].forEach(k=>add(5,t+"-"+c.cat+"-"+k,{voc:true})));
  }));
  BOOKS.forEach(b=>VOLUME3.pages.filter(p=>p.book===b.id).forEach(p=>out.push({vol:3,page:p})));
  return(_path=out);
}
function pageMastered(p){
  const sk=S.sk[S.lang]||{},ws=wordsOf(p);
  if(!ws.length)return false;
  const ok=ws.filter(e=>{const a=sk[e.w.toLowerCase()];return a&&a[0]>=2&&a[0]>a[1];}).length;
  return ok/ws.length>=.8;
}
const canHear=()=>"speechSynthesis" in window;
function nextNewPage(){
  return lessonPath().find(r=>pageInLang(r.page)&&!S.done[S.lang+":"+r.page.id]&&!(r.audio&&!canHear())&&!(r.voc&&pageMastered(r.page)))||null;
}
function weakWords(){
  const sk=S.sk[S.lang]||{},ix=vIdx()[S.lang],out=[];
  for(const k in sk){const a=sk[k];if(a[1]>a[0]&&ix[k])out.push([a[1]-a[0],ix[k]]);}
  return out.sort((x,y)=>y[0]-x[0]).map(x=>x[1]);
}
const WEAK_MIN=8;
function todayPlan(){
  const d=dueCount();if(d)return{kind:"review",n:d};
  const w=weakWords().length;if(w>=WEAK_MIN)return{kind:"weak",n:w};
  const r=nextNewPage();return r?{kind:"lesson",ref:r}:{kind:"done"};
}
function lessonName(r){
  const V=VOLUMES.find(v=>v.id===r.vol),t=V.types.find(x=>x[0]===r.page.type);
  return V.title.replace(/^Volume \d · /,"")+" · "+(t?t[2]:"")+" #"+r.page.n+(r.page.sub?" · "+r.page.sub:"");
}
function planText(){
  const p=todayPlan();
  return p.kind==="review"?p.n+" para revisar":p.kind==="weak"?"reforçar "+p.n+" palavras que errou":p.kind==="lesson"?"próxima: "+lessonName(p.ref):"tudo em dia";
}
function startLesson(r){S.vol=r.vol;S.fGame="all";S.fTheme="all";save();startPage(r.page.id);}
