/* ===== Só 5 minutos (v1.71) =====
   Sessão curta que se monta sozinha, em Treino: 3 palavras (as que estão para rever; senão as mais fracas; senão as que você já viu),
   2 de gênero (fr/it) ou de escrita (en) e 1 ditado de frase. 6 passos, círculo de progresso. A quantidade e a mistura são julgamento de Claude, sem fonte. */
(function(){
  let f5=null;
  const TOTAL=6;
  const ring=n=>{const r=26,c=2*Math.PI*r,d=c*n/TOTAL;return '<svg viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="'+n+' de '+TOTAL+'"><circle cx="32" cy="32" r="'+r+'" fill="none" stroke="currentColor" stroke-opacity=".18" stroke-width="7"/><circle cx="32" cy="32" r="'+r+'" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-dasharray="'+d.toFixed(1)+" "+c.toFixed(1)+'" transform="rotate(-90 32 32)"/><text x="32" y="37" text-anchor="middle" font-size="16" font-weight="700" fill="currentColor">'+n+"</text></svg>";};

  function pickWords(){
    const ix=vIdx()[S.lang]||{},out=[],seen=new Set();
    const add=e=>{if(e&&e.w&&!seen.has(e.w.toLowerCase())&&out.length<3){seen.add(e.w.toLowerCase());out.push(e);}};
    Object.keys(S.rvv).filter(k=>k.indexOf(S.lang+":v|")===0).sort((a,b)=>S.rvv[a][0]-S.rvv[b][0]).forEach(k=>{const r=rvVocab(k);if(r)add(r.e);});
    weakWords().forEach(add);
    const sk=S.sk[S.lang]||{};
    shuffle(Object.keys(sk)).forEach(k=>add(ix[k]));
    if(out.length<3)shuffle(Object.values(ix)).forEach(add);
    return out;
  }
  function meaningQ(e){
    const ix=Object.values(vIdx()[S.lang]||{}).filter(x=>x.pt&&x.pt!==e.pt);
    const wrong=[],seen=new Set([e.pt]);
    shuffle(ix).forEach(x=>{if(wrong.length<3&&!seen.has(x.pt)&&x.cls===e.cls){seen.add(x.pt);wrong.push(x.pt);}});
    shuffle(ix).forEach(x=>{if(wrong.length<3&&!seen.has(x.pt)){seen.add(x.pt);wrong.push(x.pt);}});
    return {k:"m",e:e,opts:shuffle([e.pt].concat(wrong))};
  }
  function build(){
    const steps=pickWords().map(meaningQ);
    const gen=(S.lang==="fr"||S.lang==="it")?shuffle(window.__genPool(S.lang)).slice(0,2).map(e=>({k:"g",e:e})):null;
    if(gen&&gen.length)gen.forEach(x=>steps.push(x));
    else{
      shuffle(Object.values(vIdx()[S.lang]||{}).filter(e=>e.w.length>=4&&e.w.length<=9&&!/[\s'-]/.test(e.w))).slice(0,2).forEach(e=>steps.push({k:"w",e:e}));
    }
    const L=window.__dictLines(S.lang);
    if(L.length)steps.push({k:"d",l:shuffle(L)[0]});
    return steps.slice(0,TOTAL);
  }
  const rec=(w,pt,ok)=>{
    bump();if(typeof gamAns==="function")gamAns(ok);
    if(w){window.GDFORM=4;try{skRec(w,pt,ok);}finally{window.GDFORM=undefined;}}
  };

  function open(){
    const st=build();
    if(st.length<3){openSheet("Só 5 minutos",'<p>Ainda não há itens suficientes neste idioma. Faça uma lição de vocabulário primeiro.</p>',true);return;}
    f5={st:st,i:0,score:0,res:null,sel:null,typed:""};
    openSheet("Só 5 minutos",'<div id="f5"></div>',false);
    paint();
  }
  function head(){return '<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px"><span style="color:var(--accent,currentColor)">'+ring(f5.i)+'</span><span class="help" style="margin:0">Passo '+(Math.min(f5.i+1,f5.st.length))+" de "+f5.st.length+" · "+LNAME[S.lang]+"</span></div>";}
  function paint(){
    const el=document.getElementById("f5");if(!el||!f5)return;
    if(f5.i>=f5.st.length){
      el.innerHTML=head()+'<p class="note"><b>Sessão concluída!</b><br>'+f5.score+" de "+f5.st.length+" certas. Cinco minutos já contam como dia de estudo.</p>"+
        '<div class="row"><button type="button" class="btn primary" id="f5-close">Fechar</button> <button type="button" class="btn" id="f5-again">Mais uma sessão</button></div>';
      sfx("done");return;
    }
    const s=f5.st[f5.i],a=f5.res!==null;
    let h=head();
    if(s.k==="m"){
      h+='<p class="qz-s" style="font-size:1.5rem;text-align:center"><b>'+esc(full(s.e))+"</b> "+speakBtn(full(s.e))+'</p><p class="help" style="text-align:center">O que significa?</p>';
      h+='<div class="lopts">'+s.opts.map((o,i)=>'<button type="button" class="lopt long'+(a?(o===s.e.pt?" right":(f5.sel===i?" wrong":"")):"")+'" data-f5o="'+i+'"'+(a?" disabled":"")+">"+esc(o)+"</button>").join("")+"</div>";
    }else if(s.k==="g"){
      const arts=S.lang==="fr"?["le","la"]:["il","lo","la"];
      h+='<p class="qz-s" style="font-size:1.5rem;text-align:center"><b>'+esc(s.e.w)+'</b></p><p class="help" style="text-align:center">Qual artigo vai antes?</p>';
      h+='<div class="lopts">'+arts.map((x,i)=>'<button type="button" class="lopt'+(a?(x===s.e.a?" right":(f5.sel===i?" wrong":"")):"")+'" data-f5g="'+i+'"'+(a?" disabled":"")+">"+esc(x)+"</button>").join("")+"</div>";
    }else if(s.k==="w"){
      h+='<p class="qz-s" style="text-align:center">Escreva em '+esc(LNAME[S.lang])+": <b>"+esc(s.e.pt)+"</b></p>";
      h+=a?"":'<input id="f5-in" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" style="width:100%;font-size:1.1rem;padding:12px;min-height:48px"><div class="row"><button type="button" class="btn primary" id="f5-ok">Conferir</button></div>';
    }else{
      h+='<div class="row" style="justify-content:center"><button type="button" class="btn primary" id="f5-play">🔊 Ouvir a frase</button></div>';
      h+=a?"":'<div class="row" style="justify-content:center"><button type="button" class="btn" id="f5-show">Mostrar a frase (sem áudio)</button></div>'+(f5.show?'<p class="qz-s">'+esc(s.l.s)+"</p>":"")+'<input id="f5-in" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" style="width:100%;font-size:1.1rem;padding:12px;min-height:48px"><div class="row"><button type="button" class="btn primary" id="f5-ok">Conferir</button></div>';
    }
    if(a){
      const ok=f5.res!=="bad";
      const ans=s.k==="m"?full(s.e)+" = "+s.e.pt:s.k==="g"?full(s.e)+" = "+s.e.pt:s.k==="w"?full(s.e)+" = "+s.e.pt:s.l.s+" ("+s.l.pt+")";
      h+='<p class="note"><b>'+(ok?"Certo!":"Resposta:")+"</b> "+esc(ans)+"</p>"+'<div class="row"><button type="button" class="btn primary" id="f5-next">'+(f5.i===f5.st.length-1?"Ver resultado":"Próximo")+"</button></div>";
    }
    el.innerHTML=h;
  }
  function done(ok){f5.res=ok?"ok":"bad";if(ok)f5.score++;sfx(ok?"ok":"bad");paint();}
  document.addEventListener("click",ev=>{
    const t=ev.target;if(!t.closest)return;
    if(t.closest("#train-five")){closeSheet();open();return;}
    if(!f5)return;
    if(!t.closest("#f5")&&!t.closest("#f5-close"))return;
    const s=f5.st[f5.i];
    let b;
    if((b=t.closest("[data-f5o]"))&&f5.res===null){f5.sel=+b.dataset.f5o;const ok=s.opts[f5.sel]===s.e.pt;rec(s.e.w,s.e.pt,ok);done(ok);return;}
    if((b=t.closest("[data-f5g]"))&&f5.res===null){f5.sel=+b.dataset.f5g;const arts=S.lang==="fr"?["le","la"]:["il","lo","la"];const ok=arts[f5.sel]===s.e.a;rec(ok?null:s.e.w,s.e.pt,ok);done(ok);return;}
    if(t.closest("#f5-ok")&&f5.res===null){
      const v=(document.getElementById("f5-in")||{}).value||"";if(!v.trim())return;
      if(s.k==="w"){const ok=window.__dictPlain(v)===window.__dictPlain(s.e.w);rec(s.e.w,s.e.pt,ok);done(ok);}
      else{const ok=window.__dictPlain(v)===window.__dictPlain(s.l.s);rec(null,null,ok);done(ok);}
      return;
    }
    if(t.closest("#f5-play")){speak(s.l.s);return;}
    if(t.closest("#f5-show")){f5.show=true;const v=(document.getElementById("f5-in")||{}).value;paint();if(v)document.getElementById("f5-in").value=v;return;}
    if(t.closest("#f5-next")){f5.i++;f5.res=null;f5.sel=null;f5.show=false;paint();const n=f5.st[f5.i];if(n&&n.k==="d")speak(n.l.s);return;}
    if(t.closest("#f5-close")){f5=null;closeSheet();return;}
    if(t.closest("#f5-again")){closeSheet();open();return;}
  });
  document.addEventListener("keydown",ev=>{if(ev.key==="Enter"&&ev.target&&ev.target.id==="f5-in"){ev.preventDefault();const b=document.getElementById("f5-ok");if(b)b.click();}});
  const _otm=openTrainMenu;
  openTrainMenu=function(){
    _otm();
    const box=document.getElementById("sheet-in");
    if(box&&!document.getElementById("train-five")){
      const b=document.createElement("button");b.type="button";b.className="btn wide primary";b.id="train-five";b.style.marginBottom="8px";b.textContent="Só 5 minutos (6 passos rápidos)";
      box.insertBefore(b,box.firstChild);
    }
  };
  window.__f5Open=open;window.__f5State=()=>f5;
})();
