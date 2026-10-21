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
