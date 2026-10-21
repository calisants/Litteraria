/* ===== Ícone do app (v1.39): Padrão + um por tema (Alice, Pequeno Príncipe, Frankenstein, Soft elegante, A Divina Comédia) =====
   Arte original (tools/mk_icons.py): relógio de bolso, planeta com flor, raio, monograma, anéis e estrela; nenhum personagem de livro.
   Como funciona: o ícone da aba muda na hora; o ícone do app instalado é lido do manifesto, e o service worker (sw.js) devolve o manifesto com o ícone escolhido
   (a escolha vai para um cache chamado mp-state). Quando o ícone da tela inicial muda depende do sistema: ver o texto de #ic-note. */
(function(){
  const NAMES={padrao:"Padrão",alice:"Alice",pp:"Pequeno Príncipe",frank:"Frankenstein",soft:"Soft elegante",dante:"A Divina Comédia"};
  const url=(id,z)=>id==="padrao"?(z==="m"?"icon-maskable-512.png":"icon-"+z+".png"):"icons/"+id+"-"+(z==="m"?"maskable-512":z)+".png";
  function applyIcon(){
    ["icon","apple-touch-icon"].forEach(rel=>{const l=document.querySelector('link[rel="'+rel+'"]');if(l)l.href=url(S.ic,192);});
  }
  function build(){
    const g=$("#ic-grid");if(!g)return;
    g.innerHTML=ICON_IDS.map(id=>'<button type="button" class="icb" data-ic="'+id+'" aria-pressed="'+(S.ic===id)+'" aria-label="Ícone '+esc(NAMES[id])+'"><img src="'+url(id,192)+'" alt="" width="56" height="56" loading="lazy"><small>'+esc(NAMES[id])+"</small></button>").join("");
    $("#ic-note").textContent="Ícone atual: "+NAMES[S.ic]+". A aba do navegador muda na hora. Na tela inicial: no Android (Chrome) o ícone muda sozinho depois que o Chrome atualiza o app (ele só faz isso com o app fechado, o aparelho carregando e no Wi-Fi; pode levar de alguns minutos a alguns dias). No iPhone, o ícone fica o de quando o app foi adicionado: remova-o da tela inicial e adicione de novo. No computador, o Chrome ainda não atualiza o ícone de app instalado.";
  }
  document.addEventListener("click",e=>{
    const b=e.target.closest&&e.target.closest("[data-ic]");if(!b)return;
    if(ICON_IDS.indexOf(b.dataset.ic)<0)return;
    S.ic=b.dataset.ic;save();applyIcon();build();
    if(typeof pushState==="function")pushState();
    if(navigator.serviceWorker&&navigator.serviceWorker.getRegistration)navigator.serviceWorker.getRegistration().then(r=>{if(r&&r.update)r.update();}).catch(()=>{});
  });
  const _go4=go;go=function(n){_go4.apply(this,arguments);if(n==="settings")build();};
  applyIcon();build();
})();
