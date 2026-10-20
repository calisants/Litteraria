/* ===== Leitura confortável: tamanho da letra, espaço entre linhas e fundo (só no leitor de livros) ===== */
(function(){
  const FS=["Normal","Grande","Maior","Muito grande"],BG=[["pad","Padrão do app"],["sepia","Sépia"],["escuro","Escuro"]];
  function apply(){
    const el=$("#s-reader");if(!el)return;
    el.dataset.rfs=S.rd.fs;el.dataset.rlh=S.rd.lh;
    if(S.rd.bg==="pad")delete el.dataset.rbg;else el.dataset.rbg=S.rd.bg;
  }
  function panel(){
    const r=S.rd;
    openSheet("Leitura confortável",
      '<p class="help">Vale só para o leitor de livros.</p>'+
      '<h3 class="lab">Tamanho da letra</h3><div class="seg" role="group" aria-label="Tamanho da letra">'+FS.map((n,i)=>'<button type="button" data-rd="fs" data-v="'+i+'" aria-pressed="'+(r.fs===i)+'">'+n+"</button>").join("")+"</div>"+
      '<h3 class="lab">Espaço entre as linhas</h3><div class="seg" role="group" aria-label="Espaço entre as linhas"><button type="button" data-rd="lh" data-v="0" aria-pressed="'+(r.lh===0)+'">Normal</button><button type="button" data-rd="lh" data-v="1" aria-pressed="'+(r.lh===1)+'">Amplo</button></div>'+
      '<h3 class="lab">Fundo</h3><div class="seg" role="group" aria-label="Fundo do leitor">'+BG.map(b=>'<button type="button" data-rd="bg" data-v="'+b[0]+'" aria-pressed="'+(r.bg===b[0])+'">'+b[1]+"</button>").join("")+"</div>",false);
  }
  document.addEventListener("click",e=>{
    const t=e.target;if(!t.closest)return;
    if(t.closest("#rdr-aa")){panel();return;}
    const b=t.closest("[data-rd]");
    if(b){const k=b.dataset.rd;S.rd[k]=k==="bg"?b.dataset.v:+b.dataset.v;save();apply();panel();}
  });
  apply();
})();
