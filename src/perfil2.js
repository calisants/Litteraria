/* ===== Livro favorito no Perfil (v1.54) =====
   Fica só no aparelho (e no backup da conta, se ela tiver uma). Não é enviado a amigos. */
(function(){
  const sel=$("#fbook");if(!sel)return;
  const LN={fr:"Francês",it:"Italiano",en:"Inglês"};
  function fill(){
    let h='<option value="">Nenhum (escolha um livro)</option>';
    ["fr","it","en"].forEach(l=>{
      const bs=BOOKS.filter(b=>b.lang===l);if(!bs.length)return;
      h+='<optgroup label="'+LN[l]+'">'+bs.map(b=>'<option value="'+b.id+'">'+esc(b.name)+"</option>").join("")+"</optgroup>";
    });
    sel.innerHTML=h;sel.value=S.fbook&&BOOKS.some(b=>b.id===S.fbook)?S.fbook:"";
  }
  function show(){
    const b=BOOKS.find(x=>x.id===S.fbook),el=$("#me-motto");
    if(el&&b&&!S.motto)el.textContent="Livro favorito: "+b.name;
  }
  fill();show();
  sel.addEventListener("change",()=>{if(sel.value)S.fbook=sel.value;else delete S.fbook;save();renderMe();show();});
  const _rm=renderMe;renderMe=function(){_rm.apply(this,arguments);try{show();}catch(_){}};
})();
