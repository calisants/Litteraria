/* ===== Boas-vindas e tutorial (v1.62, pedido dela em 23/10/2026) =====
   Aparece sozinho só na 1ª abertura de uma instalação nova (sem progresso salvo); quem já usa o app não vê.
   Marca em localStorage `mots-parole-tour` (fora do progresso). Qualquer pessoa pode rever em Ajustes → Sobre e ajuda → «Ver o tutorial».
   Textos: escritos por Claude; descrevem só o que o app faz. Em navegador automatizado (testes) não abre sozinho, salvo `window.__tourTest`. */
(function(){
  const K="mots-parole-tour";
  const STEPS=[
    {t:"Bem-vindo(a) ao Litteraria",p:["Aqui você aprende francês, italiano e inglês aos poucos: palavras, sons, jogos e livros clássicos.","São 6 telas rápidas. Dá para pular e rever depois em Ajustes."]},
    {t:"«Hoje»: seu ponto de partida",p:["O botão grande da tela inicial. Ele escolhe a próxima coisa para você: uma revisão, palavras para reforçar ou a próxima lição.","Exemplo: 5 minutos por dia já contam. Abra «Hoje», faça uma lição e feche."]},
    {t:"Lições: 5 volumes",p:["<b>1 Pronúncia</b> (sons e letras) · <b>2 Vocabulário</b> (palavras por tema) · <b>3 Jogos</b>.","Comece por esses três. <b>4 Gramática</b> e <b>5 Conversação</b> ficam para depois, quando você já conhecer palavras suficientes.","Em Lições você escolhe o idioma (Francês, Italiano ou Inglês)."]},
    {t:"Livros",p:["Textos clássicos de domínio público, em capítulos, com «Ver tradução» em cada parágrafo.","Toque numa palavra para ver o significado e guardar no caderno. As citações que você gostar vão para o Álbum."]},
    {t:"Treino e Dicionário",p:["<b>Treino</b>: revisão das palavras que estão vencendo (Ciclo da palavra, Cartões e Memória). Errar e esquecer faz parte: elas voltam sozinhas.","<b>Dicionário</b>: busque uma palavra, veja sílabas, exemplos e palavras parecidas."]},
    {t:"Seu espaço",p:["<b>Perfil</b>: nome, logo e livro favorito. <b>Ajustes</b>: estilo visual (um por livro), som, lembretes e tamanho da letra.","<b>Conta</b> é opcional: ela guarda seu progresso na nuvem e libera <b>Amigos</b>. Sem conta, tudo fica só neste aparelho; baixe um backup em Ajustes → Dados de vez em quando."]}
  ];
  let box=null,i=0,lastFocus=null;
  function draw(){
    const s=STEPS[i],last=i===STEPS.length-1;
    box.querySelector(".tour-in").innerHTML=
      '<p class="tour-n">'+(i+1)+" de "+STEPS.length+'</p><h3 id="tour-h">'+s.t+'</h3>'+s.p.map(x=>"<p>"+x+"</p>").join("")+
      '<div class="tour-dots" aria-hidden="true">'+STEPS.map((_,k)=>'<span'+(k===i?' class="on"':"")+"></span>").join("")+"</div>"+
      '<div class="tour-btns">'+(i>0?'<button type="button" class="btn" data-tour="back">Voltar</button>':'<button type="button" class="btn" data-tour="skip">Pular</button>')+
      '<button type="button" class="btn primary" data-tour="'+(last?"done":"next")+'">'+(last?"Começar":"Próximo")+"</button></div>";
    const b=box.querySelector(".btn.primary");if(b)b.focus();
  }
  function close(go2){
    try{localStorage.setItem(K,"1");}catch(_){}
    if(box){box.remove();box=null;}
    try{if(lastFocus&&lastFocus.focus)lastFocus.focus();}catch(_){}
    if(go2&&typeof go==="function")go("home");
  }
  function open(){
    if(box)return;
    lastFocus=document.activeElement;i=0;
    box=document.createElement("div");box.id="tour";box.setAttribute("role","dialog");box.setAttribute("aria-modal","true");box.setAttribute("aria-labelledby","tour-h");
    box.innerHTML='<div class="tour-in"></div>';
    box.addEventListener("click",e=>{
      const t=e.target.closest&&e.target.closest("[data-tour]");if(!t)return;
      const a=t.dataset.tour;
      if(a==="next"){i=Math.min(STEPS.length-1,i+1);draw();}
      else if(a==="back"){i=Math.max(0,i-1);draw();}
      else close(a==="done");
    });
    box.addEventListener("keydown",e=>{if(e.key==="Escape")close(false);});
    document.body.appendChild(box);draw();
  }
  window.openTour=open;
  document.addEventListener("click",e=>{if(e.target.closest&&e.target.closest("#open-tour"))open();});
  const auto=()=>{
    let seen=null,hasData=false;
    try{seen=localStorage.getItem(K);hasData=localStorage.getItem(KEY)!==null;}catch(_){return;}
    if(seen!==null)return;
    if(hasData){try{localStorage.setItem(K,"1");}catch(_){}return;}  /* quem já usa o app não vê */
    if(navigator.webdriver&&!window.__tourTest)return;
    setTimeout(open,600);
  };
  if(document.body)auto();else document.addEventListener("DOMContentLoaded",auto);
})();
