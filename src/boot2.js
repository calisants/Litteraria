/* ===== Depois de tudo carregado (v1.39): retomar a lição em andamento e atalhos ?go= ===== */
(function(){
  let did=false;
  try{if(typeof resumeLesson==="function")did=resumeLesson();}catch(e){}
  RESUME.quiet=false;
  window.__resumed=did;
})();
(function(){
  /* atalhos do ícone do app e toque na notificação: ?go=hoje | cartao | treino */
  try{
    const u=new URL(location.href),g=u.searchParams.get("go");
    if(g){
      u.searchParams.delete("go");history.replaceState(null,"",u.pathname+(u.search||"")+u.hash);
      if(typeof handleGo==="function")setTimeout(()=>handleGo(g),150);
    }
  }catch(_){}
})();
/* ===== Lembrar a última tela (v1.53) =====
   No Android o navegador descarta a página quando a pessoa sai do app; ao voltar, tudo recomeçava na tela inicial.
   Guarda a última tela simples (Ajustes, Estatísticas, Perfil, Lições, Livros...) por até 3 horas, fora do progresso.
   A lição em andamento (retomar.js) e o passo do código da conta (nuvem.js) têm prioridade. */
(function(){
  const SK=KEY+"-scr",OK=["settings","stats","profile","vol","index","books","album","news","garden"],MAX=3*3600e3;
  try{
    const u=new URL(location.href),pend=localStorage.getItem("mots-parole-cloud-pend");
    const o=JSON.parse(localStorage.getItem(SK)||"null");
    if(o&&OK.indexOf(o.n)>=0&&Date.now()-(+o.t||0)<MAX&&!window.__resumed&&!pend&&!u.searchParams.get("go")){
      go(o.n);if(o.n==="news"&&typeof renderNews==="function")renderNews();
    }
  }catch(_){}
  const _g=go;
  go=function(n){
    _g.apply(this,arguments);
    try{if(n!=="game")localStorage.setItem(SK,JSON.stringify({n:n,t:Date.now()}));}catch(_){}
  };
})();
