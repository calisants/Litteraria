/* ===== Instalar o app (v1.66, pedido dela em 23/10/2026: «download direto para quem entrar no site») =====
   O Litteraria é um PWA: "baixar" = instalar na tela inicial. Chrome/Edge/Samsung (Android e PC) oferecem um botão que abre a janela
   de instalação (evento beforeinstallprompt); iPhone/iPad (Safari) não têm isso, então mostramos o passo a passo.
   Cartão na tela inicial (#inst-card): só em navegador, nunca no app já instalado; «Agora não» esconde por 14 dias (localStorage `mots-parole-inst`).
   Botão fixo em Ajustes → Sobre e ajuda (#open-install). Em navegador automatizado (testes) o cartão só aparece com window.__instTest. */
(function(){
  const K="mots-parole-inst",DAYS14=14*864e5;
  let dp=null;
  const ua=navigator.userAgent||"";
  const isIOS=/iPhone|iPad|iPod/.test(ua)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
  const isAndroid=/Android/.test(ua);
  const isSamsung=/SamsungBrowser/.test(ua);
  const isFirefox=/Firefox|FxiOS/.test(ua);
  function installed(){
    try{if(window.__instStandalone!==undefined)return !!window.__instStandalone;}catch(_){}
    try{if(window.matchMedia&&matchMedia("(display-mode: standalone)").matches)return true;}catch(_){}
    return navigator.standalone===true;
  }
  function dismissed(){try{const t=+localStorage.getItem(K)||0;return t&&Date.now()-t<DAYS14;}catch(_){return false;}}
  function guide(){
    if(isIOS)return '<p>No iPhone ou iPad, a instalação é feita pelo <b>Safari</b> (em outros navegadores o botão pode não aparecer):</p><ol><li>Toque no botão <b>Compartilhar</b> (o quadrado com uma seta para cima).</li><li>Role a lista e toque em <b>Adicionar à Tela de Início</b>.</li><li>Toque em <b>Adicionar</b>.</li></ol><p><b>Antes, guarde seu progresso:</b> o app instalado pode começar vazio. Entre na sua conta (Perfil) ou faça um backup em Ajustes → Dados e restaure depois.</p>';
    if(isSamsung)return '<p>No Samsung Internet: toque no menu (três linhas) e em <b>Adicionar página a</b> → <b>Tela inicial</b>. Se aparecer «Instalar», use essa opção.</p>';
    if(isFirefox)return '<p>O Firefox no computador não instala sites como apps. No Android, toque no menu (⋮) e em <b>Instalar</b>. No computador, abra o endereço no <b>Chrome</b> ou no <b>Edge</b>.</p>';
    if(isAndroid)return '<p>No Chrome do Android: toque no menu (⋮) e em <b>Instalar app</b> (ou <b>Adicionar à tela inicial</b>).</p>';
    return '<p>No Chrome ou no Edge do computador: clique no ícone de instalar no fim da barra de endereço (um monitor com uma seta), ou no menu (⋮) → <b>Instalar Litteraria</b>.</p>';
  }
  function showGuide(){
    if(typeof openSheet!=="function")return;
    openSheet("Instalar o Litteraria",'<div class="inst-g">'+guide()+'<p class="help">Instalar não custa nada, não ocupa quase espaço e o app abre sem a barra do navegador. Funciona sem internet depois da primeira abertura.</p></div>');
  }
  async function install(){
    if(installed()){if(typeof openSheet==="function")openSheet("Instalar o Litteraria",'<p>O Litteraria já está instalado neste aparelho.</p>');return;}
    if(dp){
      const e=dp;dp=null;
      try{e.prompt();const r=await e.userChoice;if(r&&r.outcome==="accepted")hideCard(true);}catch(_){showGuide();}
      paint();return;
    }
    showGuide();
  }
  function hideCard(forever){
    try{localStorage.setItem(K,String(forever?Date.now()+3650*864e5-DAYS14:Date.now()));}catch(_){}
    paint();
  }
  function paint(){
    const c=document.getElementById("inst-card");
    const b=document.getElementById("open-install");
    const inst=installed();
    if(b){b.hidden=inst;}
    if(!c)return;
    const auto=!!navigator.webdriver&&!window.__instTest;
    const can=!inst&&!dismissed()&&!auto&&(dp||isIOS||isAndroid||/Chrome|Edg\//.test(ua));
    c.hidden=!can;
    const t=c.querySelector("#inst-go");if(t)t.textContent=dp?"Instalar o app":"Como instalar";
  }
  window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();dp=e;paint();});
  window.addEventListener("appinstalled",()=>{dp=null;paint();});
  document.addEventListener("click",e=>{
    const t=e.target.closest&&e.target.closest("#inst-go,#open-install");if(t){install();return;}
    if(e.target.closest&&e.target.closest("#inst-later"))hideCard(false);
  });
  window.__instState=()=>({installed:installed(),prompt:!!dp,card:!(document.getElementById("inst-card")||{}).hidden});
  window.__instPaint=paint;
  paint();
})();
