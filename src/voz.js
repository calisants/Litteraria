/* ===== Vozes do aparelho (v1.70.1): mostra qual voz fala cada idioma e deixa testar ===== */
(function(){
  const box=document.getElementById("voice-box");if(!box)return;
  function paint(){
    if(!window.speechSynthesis){box.textContent="Este navegador não tem fala (texto para voz). Os exercícios com áudio levam «(com áudio)» no nome; os outros funcionam sem som.";return;}
    const vs=speechSynthesis.getVoices();
    if(!vs||!vs.length){box.textContent="O aparelho ainda não informou a lista de vozes. Toque em um dos botões abaixo para testar.";return;}
    box.innerHTML=["fr","it","en"].map(l=>{const v=pickVoice(SPEECH[l]);return "<b>"+LNAME[l]+"</b>: "+(v?esc(v.name)+" ("+esc(v.lang)+")":"<span class=\"bad\">nenhuma voz encontrada: vai sair com sotaque errado</span>");}).join("<br>");
  }
  paint();
  if(window.speechSynthesis){try{speechSynthesis.addEventListener("voiceschanged",paint);}catch(_){}}
  const TESTE={fr:"Bonjour, je m'appelle Camille. J'habite à Paris.",it:"Ciao, mi chiamo Camilla. Abito a Roma.",en:"Hello, my name is Camila. I live in Rio."};
  document.addEventListener("click",e=>{
    const b=e.target.closest&&e.target.closest("[data-voice-test]");if(!b)return;
    const l=b.dataset.voiceTest;try{const u=mkUtt(TESTE[l],SPEECH[l]);speechSynthesis.cancel();speechSynthesis.speak(u);}catch(_){}
    paint();
  });
  const gs=document.getElementById("go-settings");if(gs)gs.addEventListener("click",paint);
})();

/* ===== Compartilhar o app (v1.70.2): convite com o endereço em que a pessoa está usando o app ===== */
(function(){
  const link=()=>location.origin+location.pathname.replace(/index\.html$/,"");
  const txt=()=>"Estou usando o Litteraria para aprender francês, italiano e inglês com palavras, jogos e livros. É grátis e dá para instalar no celular: "+link();
  function fallback(){
    const t=txt();
    openSheet("Compartilhar o app",'<p>Copie o convite ou envie pelo WhatsApp.</p><p class="srow"><span class="pt"><b id="shr-txt">'+esc(t)+'</b></span></p><p class="row"><button type="button" class="btn primary" id="shr-copy">Copiar o convite</button> <a class="btn" id="shr-wa" target="_blank" rel="noopener" href="https://wa.me/?text='+encodeURIComponent(t)+'">Enviar pelo WhatsApp</a></p><p class="help" id="shr-ok" aria-live="polite"></p>',true);
  }
  document.addEventListener("click",e=>{
    if(e.target.closest&&e.target.closest("#open-share")){
      if(navigator.share&&!navigator.webdriver){navigator.share({title:"Litteraria",text:txt()}).catch(e=>{if(e&&e.name!=="AbortError")fallback();});}
      else fallback();
      return;
    }
    if(e.target.closest&&e.target.closest("#shr-copy")){
      const t=txt(),ok=()=>{const o=document.getElementById("shr-ok");if(o)o.textContent="Convite copiado.";};
      try{navigator.clipboard.writeText(t).then(ok,()=>{});}catch(_){}
    }
  });
  window.__shareText=txt;
})();
