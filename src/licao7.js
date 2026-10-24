/* ===== Lição do Jardim: 7 telas sobre um trecho real de um livro de domínio público =====
   Capa → Leitura guiada → 5 Lacunas → Blocos de sentido → Combine → Palavra em frase nova → Jardim final.
   Usa os trechos de livros_leitura.js (cópia literal conferida) e o vocabulário do livro. Frases novas e traduções: Claude, sem fonte conferida. */
(function(){
  const H=window.__rdh;if(!H||typeof BOOKREAD==="undefined")return;
  VOLUME3.types=VOLUME3.types.concat([["jardim","Lição do Jardim","Jardim"]]);
  BOOKS.forEach(b=>{
    const R=BOOKREAD[b.id];if(!R)return;
    R.forEach((r,k)=>VOLUME3.pages.push({id:"jardim-"+b.id+"-"+(k+1),type:"jardim",n:k,rd:b.id,k:k+1,themes:["livro-"+b.id],langs:[b.lang],sub:b.name,meta:"Lição do Jardim · «"+b.name+"» · trecho "+(k+1)+" de "+R.length}));
  });
  GAMENAME.jardim="Lição do Jardim";STAGES.jardim="#gstage";DOCKS.jardim="none";GAMEFN.jardim=startJardim;
  const SN=["Sombra","Semente","Flor","Fruto"];
  const SD=["Só vista, ainda sem acerto","Já acertou uma vez","Acertou em dias diferentes","Firme: acertou em dias e formas diferentes"];
  const norm2=x=>String(x||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[’]/g,"'");
  let L=null;
  window.jardimState=()=>L;
  const nw=t=>(t.match(/\p{L}[\p{L}'’]*/gu)||[]).length;
  function stageChip(lang,w){const st=window.gdStage(lang,w),wl=window.gdWilted(lang,w);return '<span class="gdchip gd'+st+'">'+SN[st]+(wl?" · precisa de água":"")+"</span>";}
  function build(){
    const b=H.BK[P.rd],D=BOOKREAD[P.rd][P.k-1],m=H.vmap(P.rd),lang=b.lang;
    /* palavras do vocabulário que aparecem no trecho */
    const found={},toks=[];
    D.segs.forEach((sg,si)=>{const re0=/\p{L}[\p{L}'’]*/gu;let mm;while((mm=re0.exec(sg.s))){const t=mm[0],pre=sg.s.slice(0,mm.index),post=sg.s.charAt(mm.index+t.length);
        const k=H.keyOf(t,m,lang);if(!k)continue;
        const proper=t[0]!==t[0].toLowerCase()&&/[\p{L}]/u.test(pre)&&!/[.!?:;]["'«»\s]*$/.test(pre);
        const compound=post==="-"||/-$/.test(pre);
        if(!found[k])found[k]=m[k];
        if(!proper&&!compound)toks.push({si:si,t:t,k:k});}});
    const words=Object.keys(found).map(k=>found[k]);
    /* lacunas: 5 ocorrências de palavras diferentes */
    const gaps=[],seen={};
    sh0(toks).forEach(x=>{if(gaps.length<5&&!seen[x.k]&&x.t.length>=3){seen[x.k]=1;gaps.push(x);}});
    const pool=Object.values(m).filter(e=>e.w.length>=3);
    /* poucas palavras do vocabulário no trecho: completa com palavras comuns do próprio trecho (sem registro no jardim) */
    if(gaps.length<5){
      const all=[];BOOKREAD[P.rd].forEach(r=>r.segs.forEach(sg=>(sg.s.match(/\p{L}[\p{L}'’]*/gu)||[]).forEach(t=>{if(t.length>=5&&t===t.toLowerCase())all.push(t);})));
      const uniq=[...new Set(all)];
      D.segs.forEach((sg,si)=>{
        const ws=(sg.s.match(/\p{L}[\p{L}'’]*/gu)||[]).filter(t=>t.length>=5&&t===t.toLowerCase()&&!seen[t.toLowerCase()]);
        sh0(ws).slice(0,2).forEach(t=>{if(gaps.length<5&&!seen[t.toLowerCase()]){seen[t.toLowerCase()]=1;gaps.push({si:si,t:t,k:t.toLowerCase(),extra:uniq});}});
      });
    }
    gaps.forEach(g=>{
      const ans=g.t;let ds;
      if(g.extra)ds=sh0(g.extra.filter(x=>x!==ans&&Math.abs(x.length-ans.length)<=3)).slice(0,2);
      else ds=sh0(pool.filter(e=>e.w.toLowerCase()!==g.k&&Math.abs(e.w.length-g.k.length)<=3)).slice(0,2).map(e=>(ans[0]!==ans[0].toLowerCase()?e.w[0].toUpperCase()+e.w.slice(1):e.w));
      const o=ds.slice();o.splice(R0(o.length+1),0,ans);g.o=o;g.a=o.indexOf(ans);g.tries=0;g.done=false;g.word=g.extra?null:m[g.k];
    });
    /* blocos: a frase principal em 3 ou 4 pedaços */
    let main=D.segs.map((s,i)=>({s:s.s,i:i,n:nw(s.s)})).filter(x=>x.n>=6&&x.n<=34).sort((a,b2)=>Math.abs(a.n-14)-Math.abs(b2.n-14))[0]||{s:D.segs[0].s,i:0};
    const parts=cut(main.s);
    const order=sh0(parts.map((_,i)=>i));if(order.every((v,i)=>v===i)&&order.length>1)order.reverse();
    /* palavras da combinação: até 3 que precisam de água + as do trecho */
    const wil=Object.keys(S.gd||{}).filter(k=>S.gd[k][4]&&k.indexOf(lang+":")===0).slice(0,3).map(k=>k.slice(lang.length+1));
    const ix=(typeof vIdx==="function"?vIdx()[lang]:null)||{};
    const wilE=wil.map(w=>ix[w]||m[w]).filter(Boolean);
    let mw=wilE.slice();words.forEach(e=>{if(mw.length<4&&!mw.some(x=>x.w===e.w))mw.push(e);});
    if(mw.length<3)Object.values(m).forEach(e=>{if(mw.length<4&&!mw.some(x=>x.w===e.w))mw.push(e);});
    mw=mw.slice(0,4);
    const before={};words.concat(mw).forEach(e=>{before[e.w]=window.gdStage(lang,e.w);});
    const fitE=mw.filter(e=>/^\p{L}{4,10}$/u.test(e.w)).slice(0,3);
    const detE=words.filter(e=>L0(e.w,D)).slice(0,3);
    let game=typeof window.__jdGame==="number"?window.__jdGame:(P.k+Math.floor(Date.now()/864e5))%3;
    if(game===1&&!fitE.length)game=0;
    if(game===2&&!detE.length)game=0;
    return {game:game,fw:{items:fitE.map(e=>({e:e,t:sh0(e.w.toLowerCase().split("")),pick:[],tries:0,done:false})),i:0},dt:{items:detE.map(e=>({e:e,tries:0,done:false})),i:0},b:b,D:D,m:m,lang:lang,found:found,words:words,gaps:gaps,main:main,parts:parts,order:order,pick:[],bwrong:0,match:{e:mw,sel:null,done:{},picks:sh0(mw.map(e=>e.pt))},
      fresh:null,before:before,scr:0,sel:null,gi:0,wilted:wilE.map(e=>e.w),listening:-1,tr:{},ok:0};
  }
  /* a palavra aparece inteira em alguma frase do trecho? */
  function L0(w,D){const re=new RegExp("(^|[^\\p{L}])"+w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"(?![\\p{L}])","iu");return D.segs.some(s=>re.test(s.s));}
  function cut(s){
    const w=s.split(/\s+/);if(w.length<6)return [s];
    const n=w.length>=14?4:3;let pieces=[],at=0;
    for(let i=1;i<n;i++){
      let target=Math.round(w.length*i/n),best=target;
      for(let d=0;d<=3;d++){for(const c of [target-d,target+d]){if(c>at+1&&c<w.length-1&&/[,;:—–]$/.test(w[c-1])){best=c;d=9;break;}}}
      pieces.push(w.slice(at,best).join(" "));at=best;
    }
    pieces.push(w.slice(at).join(" "));
    return pieces.filter(Boolean);
  }
  function startJardim(){
    fitFn=null;L=build();L.scr=0;render();
  }
  const NAMES=["Capa","Leitura","Lacunas","Blocos","Jogo","Frase nova","Jardim"];
  function bar(){
    return '<div class="jd-bar" role="progressbar" aria-valuemin="1" aria-valuemax="7" aria-valuenow="'+(L.scr+1)+'" aria-label="Tela '+(L.scr+1)+' de 7: '+NAMES[L.scr]+'"><span class="jd-fill" style="width:'+Math.round((L.scr+1)*100/7)+'%"></span></div><p class="ocount">Tela '+(L.scr+1)+' de 7 · '+NAMES[L.scr]+"</p>";
  }
  function render(){
    const f=[sCapa,sLeitura,sLacunas,sBlocos,sJogo,sFrase,sJardim][L.scr];
    $("#gstage").innerHTML='<div class="jd">'+bar()+f()+"</div>";
    const ac=$("#gstage").querySelector("[data-focus]");if(ac&&L.scr>0)ac.focus({preventScroll:false});
  }
  function next(){L.scr=Math.min(6,L.scr+1);L.sel=null;render();window.scrollTo(0,0);}
  /* ---- 1 Capa ---- */
  function sCapa(){
    const n=L.words.length,w=L.wilted.length;
    return '<h3 class="jd-h">«'+esc(L.b.name)+"»</h3>"+
      '<p class="note"><b>O trecho:</b> '+esc(L.D.ctx)+"</p>"+
      '<p class="help">'+(n?"Este trecho tem <b>"+n+"</b> palavra(s) do vocabulário do livro. ":"")+(w?"<b>"+w+"</b> palavra(s) <b>precisam de água</b> e aparecem nesta lição.":"Nenhuma palavra precisa de água agora.")+"</p>"+
      '<p class="help">São 7 telas curtas: ler, completar, ordenar, combinar, usar a palavra numa frase nova e ver o que cresceu no seu jardim.</p>'+
      '<button type="button" class="btn wide primary" data-jd="next" data-focus>Começar</button>';
  }
  /* ---- 2 Leitura guiada ---- */
  function sLeitura(){
    const lang=L.lang;let h='<p class="help">Leia com calma. Toque em <b>Ouvir</b> para escutar a frase e numa palavra sublinhada para ver o significado e o estágio dela.</p><div class="rd">';
    L.D.segs.forEach((sg,i)=>{
      const f={};
      h+='<div class="rd-line'+(L.listening===i?" rd-play":"")+'"><p class="rd-s">'+H.wordsHtml(sg.s,L.m,lang,f)+'</p><div class="rd-act"><button type="button" class="btn jd-listen" data-jd="say" data-i="'+i+'">Ouvir a frase</button><button type="button" class="btn" data-jd="tr" data-i="'+i+'" aria-pressed="'+!!L.tr[i]+'">'+(L.tr[i]?"Esconder a tradução":"Ver a tradução")+"</button></div>"+(L.tr[i]?'<p class="rd-pt">'+esc(sg.pt)+"</p>":"")+"</div>";
    });
    h+="</div>";
    const e=L.sel&&L.m[L.sel];
    h+='<div class="rd-def" aria-live="polite">'+(e?"<b>"+esc(full(e))+"</b> = "+esc(e.pt)+" "+stageChip(L.lang,e.w)+"<br><small>"+esc(SD[window.gdStage(L.lang,e.w)])+"</small>":"Toque numa palavra sublinhada.")+"</div>";
    h+='<p class="note"><b>Para reparar:</b> '+hl(L.D.gn)+'</p><button type="button" class="btn wide primary" data-jd="next" data-focus>Continuar</button>';
    return h;
  }
  /* ---- 3 Lacunas ---- */
  function sLacunas(){
    const g=L.gaps[L.gi];
    if(!g){return '<p class="help">Este trecho tem poucas palavras do vocabulário para completar.</p><button type="button" class="btn wide primary" data-jd="next" data-focus>Continuar</button>';}
    const seg=L.D.segs[g.si],re=new RegExp("(^|[^\\p{L}'’])"+g.t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"(?![\\p{L}])","u");
    const sent=seg.s.replace(re,(m0,p)=>p+"_____");
    let h='<p class="help">Lacuna '+(L.gi+1)+" de "+L.gaps.length+". Escolha a palavra que completa a frase.</p><p class=\"rd-s\" id=\"jd-sent\">"+esc(sent)+"</p>";
    if(g.done||g.tries>=1)h+='<p class="rd-pt">'+esc(seg.pt)+"</p>";
    h+='<div class="stack" id="jd-opts">'+g.o.map((t,i)=>'<button type="button" class="btn wide jd-opt" data-jd="opt" data-i="'+i+'"'+(g.bad&&g.bad[i]?' disabled aria-label="'+esc(t)+', errada"':"")+'>'+esc(t)+(g.bad&&g.bad[i]?" (não é essa)":"")+"</button>").join("")+"</div>";
    h+='<p class="help" id="jd-fb" aria-live="polite">'+(g.tries===1?"Ainda não. Tente outra vez; a tradução apareceu como ajuda.":"")+"</p>";
    return h;
  }
  /* ---- 4 Blocos de sentido ---- */
  function sBlocos(){
    const P0=L.parts;
    if(P0.length<3){return '<p class="help">A frase principal é curta; vamos seguir.</p><button type="button" class="btn wide primary" data-jd="next" data-focus>Continuar</button>';}
    const n=L.pick.length,done=n===P0.length;
    let h='<p class="help">Monte a frase na ordem certa: toque nos blocos, do primeiro ao último.</p>';
    h+='<p class="rd-s" aria-live="polite">'+(L.pick.map(i=>esc(P0[i])).join(" ")||"…")+"</p>";
    h+='<div class="stack">'+L.order.map(i=>{const used=L.pick.indexOf(i)>=0;return '<button type="button" class="btn wide jd-blk" data-jd="blk" data-i="'+i+'"'+(used?' disabled aria-label="'+esc(P0[i])+', já usado"':"")+">"+esc(P0[i])+"</button>";}).join("")+"</div>";
    h+='<p class="help" id="jd-fb" aria-live="polite">'+(L.bfb||"")+"</p>";
    if(done)h+='<p class="rd-pt">'+esc(L.D.segs[L.main.i].pt)+'</p><button type="button" class="btn wide primary" data-jd="next" data-focus>Continuar</button>';
    return h;
  }
  /* ---- 5 Jogo (rodízio: Combine, Fitwords, Detetive de Fragmentos) ---- */
  function sJogo(){return L.game===1?sFit():L.game===2?sDet():sCombine();}
  function sFit(){
    const F=L.fw,it=F.items[F.i];
    if(!it)return '<p class="help">Fitwords concluído.</p><button type="button" class="btn wide primary" data-jd="next" data-focus>Continuar</button>';
    const wl=window.gdWilted(L.lang,it.e.w);
    let h='<p class="help"><b>Fitwords</b> '+(F.i+1)+" de "+F.items.length+'. Monte a palavra com as letras. Significado: «'+esc(it.e.pt)+"»"+(wl?" · <b>precisa de água</b>. Dica: começa com «"+esc(it.e.w.charAt(0).toLowerCase())+"»":"")+"</p>";
    h+='<div class="jd-build" id="jd-build" aria-live="polite" aria-label="Palavra montada">'+(it.pick.map(i=>esc(it.t[i])).join("")||"…")+"</div>";
    h+='<div class="jd-tiles">'+it.t.map((c,i)=>'<button type="button" class="btn jd-tile" data-jd="tile" data-i="'+i+'"'+(it.pick.indexOf(i)>=0?' disabled aria-label="'+esc(c)+', já usada"':"")+">"+esc(c)+"</button>").join("")+"</div>";
    if(!it.done)h+='<button type="button" class="btn" data-jd="untile"'+(it.pick.length?"":" disabled")+">Apagar a última letra</button>";
    h+='<p class="help" id="jd-fb" aria-live="polite">'+(it.fb||"")+"</p>";
    if(it.done)h+='<button type="button" class="btn wide primary" data-jd="fnext" data-focus>'+(F.i+1<F.items.length?"Próxima palavra":"Continuar")+"</button>";
    return h;
  }
  function sDet(){
    const T=L.dt,it=T.items[T.i];
    if(!it)return '<p class="help">Detetive concluído.</p><button type="button" class="btn wide primary" data-jd="next" data-focus>Continuar</button>';
    let h='<p class="help"><b>Detetive de Fragmentos</b> '+(T.i+1)+" de "+T.items.length+'. Ache no trecho a palavra que significa «'+esc(it.e.pt)+"». Toque nela.</p><div class=\"rd\">";
    L.D.segs.forEach((sg,si)=>{
      h+='<div class="rd-line"><p class="rd-s">'+sg.s.split(/(\p{L}[\p{L}\u2019']*)/u).map(t=>/^\p{L}/u.test(t)?'<button type="button" class="jd-tok" data-jd="tok" data-t="'+esc(t)+'"'+(it.bad&&it.bad[t.toLowerCase()]?' disabled aria-label="'+esc(t)+', não é essa"':"")+'>'+esc(t)+"</button>":esc(t)).join("")+"</p></div>";
    });
    h+="</div>";
    h+='<p class="help" id="jd-fb" aria-live="polite">'+(it.fb||"")+"</p>";
    if(it.done)h+='<button type="button" class="btn wide primary" data-jd="dnext" data-focus>'+(T.i+1<T.items.length?"Próximo fragmento":"Continuar")+"</button>";
    return h;
  }
  /* ---- Combine ---- */
  function sCombine(){
    const M=L.match,e=M.e;
    let h='<p class="help">Combine cada palavra com o significado. Toque numa palavra e depois no significado.'+(L.wilted.length?" As que precisam de água vêm primeiro.":"")+"</p>";
    h+='<div class="jd-cols"><div class="stack">'+e.map((x,i)=>'<button type="button" class="btn wide jd-w" data-jd="mw" data-i="'+i+'" aria-pressed="'+(M.sel===i)+'"'+(M.done[i]?' disabled aria-label="'+esc(full(x))+', combinada"':"")+">"+esc(full(x))+(M.done[i]?" ✓":"")+"</button>").join("")+"</div>"+
      '<div class="stack">'+M.picks.map((p,j)=>{const used=e.some((x,i)=>M.done[i]&&x.pt===p);return '<button type="button" class="btn wide jd-m" data-jd="mm" data-i="'+j+'"'+(used?' disabled aria-label="'+esc(p)+', combinado"':"")+">"+esc(p)+(used?" ✓":"")+"</button>";}).join("")+"</div></div>";
    h+='<p class="help" id="jd-fb" aria-live="polite">'+(L.mfb||"")+"</p>";
    if(e.every((_,i)=>M.done[i]))h+='<button type="button" class="btn wide primary" data-jd="next" data-focus>Continuar</button>';
    return h;
  }
  /* ---- 6 Palavra em frase nova ---- */
  function pickFresh(){
    const cand=L.wilted.map(w=>L.match.e.find(e=>e.w===w)).filter(Boolean).concat(L.words).concat(L.match.e);
    for(const e of cand){const c=ctxFor(e);if(c){const re=new RegExp("(^|[^\\p{L}\\p{N}])"+e.w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"(?![\\p{L}\\p{N}])","iu");if(re.test(c.s))return {e:e,c:c,re:re,tries:0,done:false};}}
    return {none:true};
  }
  function sFrase(){
    if(!L.fresh)L.fresh=pickFresh();
    const F=L.fresh;
    if(F.none)return '<p class="help">Não há frase nova para as palavras desta lição. Vamos ao jardim.</p><button type="button" class="btn wide primary" data-jd="next" data-focus>Ver o jardim</button>';
    const wl=window.gdWilted(L.lang,F.e.w);
    const sent=F.c.s.replace(F.re,(m0,p)=>p+"_____");
    let h='<p class="help">Uma frase que você ainda não viu neste trecho. Escreva a palavra que falta.</p><p class="rd-s">'+esc(sent)+'</p><p class="help">Significa: '+esc(F.c.pt)+"<br>Palavra: «"+esc(F.e.pt)+"»"+(wl?" · <b>precisa de água</b>. Dica: começa com «"+esc(F.e.w.charAt(0))+"»":"")+"</p>";
    h+='<input id="jd-in" class="field" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Sua resposta" style="width:100%;margin:8px 0"'+(F.done?" disabled":"")+'>';
    if(!F.done)h+='<button type="button" class="btn wide primary" data-jd="chk">Verificar</button>';
    h+='<p class="help" id="jd-fb" aria-live="polite">'+(F.fb||"")+"</p>";
    h+='<p class="help"><small>'+esc(F.c.src)+"</small></p>";
    if(F.done)h+='<button type="button" class="btn wide primary" data-jd="next" data-focus>Ver o jardim</button>';
    return h;
  }
  /* ---- 7 Jardim final ---- */
  function sJardim(){
    const ws=[];L.words.concat(L.match.e).forEach(e=>{if(!ws.some(x=>x.w===e.w))ws.push(e);});
    const grew=ws.filter(e=>window.gdStage(L.lang,e.w)>L.before[e.w]);
    const wil=ws.filter(e=>window.gdWilted(L.lang,e.w));
    let h='<h3 class="jd-h">O que cresceu</h3>';
    h+=grew.length?'<ul class="jd-list">'+grew.map(e=>"<li><b>"+esc(full(e))+"</b> ("+esc(e.pt)+"): "+SN[L.before[e.w]]+" → "+stageChip(L.lang,e.w)+"</li>").join("")+"</ul>":'<p class="help">Nenhuma palavra mudou de estágio hoje. Subir leva dias: o jardim cresce quando você volta a acertar em outro dia.</p>';
    const rest=ws.filter(e=>grew.indexOf(e)<0);
    if(rest.length)h+='<p class="help"><b>Continuam como estavam:</b></p><ul class="jd-list">'+rest.map(e=>"<li><b>"+esc(full(e))+"</b>: "+stageChip(L.lang,e.w)+"</li>").join("")+"</ul>";
    if(wil.length)h+='<p class="help"><b>Ainda precisam de água:</b> '+wil.map(e=>esc(full(e))).join(", ")+". Elas voltam na revisão.</p>";
    h+='<p class="help"><small>Estágios: Sombra (só vista), Semente (1 acerto), Flor (acertou em dias diferentes), Fruto (firme). Errar derruba no máximo 1 estágio e nunca apaga o que você já acertou.</small></p>';
    h+='<button type="button" class="btn wide primary" data-jd="fin" data-focus>Concluir a lição</button>';
    return h;
  }
  /* ---- eventos ---- */
  function rec(e,ok,form){window.GDFORM=form;try{skRec(e.w,"jardim",ok);}finally{window.GDFORM=undefined;}}
  function sayHl(i){
    const seg=L.D.segs[i];if(!seg)return;L.listening=i;render0(i,true);
    const done=()=>{if(L.listening===i){L.listening=-1;if(L.scr===1)render0(i,false);}};
    try{
      if(!window.speechSynthesis){setTimeout(done,1800);return;}
      const u=new SpeechSynthesisUtterance(seg.s);u.lang=SPEECH[S.lang];u.rate=.9;u.onend=done;u.onerror=done;
      speechSynthesis.cancel();speechSynthesis.speak(u);setTimeout(done,Math.max(4000,seg.s.length*130));
    }catch(_){setTimeout(done,1800);}
  }
  function render0(i,on){const el=$("#gstage").querySelectorAll(".rd-line")[i];if(el)el.classList.toggle("rd-play",on);}
  $("#gstage").addEventListener("click",ev=>{
    if(!P||P.type!=="jardim"||!L)return;
    const w=ev.target.closest(".rw");if(w){L.sel=w.dataset.k;render();return;}
    const t=ev.target.closest("[data-jd]");if(!t)return;
    const a=t.dataset.jd,i=+t.dataset.i;
    if(a==="next"){next();return;}
    if(a==="tr"){L.tr[i]=!L.tr[i];render();return;}
    if(a==="say"){sayHl(i);return;}
    if(a==="opt"){
      const g=L.gaps[L.gi];if(!g||g.done)return;
      if(i===g.a){
        g.done=true;if(g.tries===0){L.ok++;if(g.word)rec(g.word,true,3);}sfx("ok");
        const fb=$("#jd-fb");
        $("#gstage").querySelector(".jd").innerHTML=bar()+'<p class="rd-s">'+esc(L.D.segs[g.si].s)+'</p><p class="rd-pt">'+esc(L.D.segs[g.si].pt)+'</p><p class="help"><b>Certo!</b> '+(g.word?esc(full(g.word))+" = "+esc(g.word.pt)+" "+stageChip(L.lang,g.word.w):"«"+esc(g.t)+"»")+'</p><button type="button" class="btn wide primary" data-jd="gnext" data-focus>'+(L.gi+1<L.gaps.length?"Próxima lacuna":"Continuar")+"</button>";
        const f=$("#gstage").querySelector("[data-focus]");if(f)f.focus();
        return;
      }
      g.tries++;g.bad=g.bad||{};g.bad[i]=1;
      if(g.tries===1&&g.word)rec(g.word,false,3);
      sfx("bad");shake($("#jd-sent"));
      if(g.tries>=2){
        g.done=true;
        $("#gstage").querySelector(".jd").innerHTML=bar()+'<p class="rd-s">'+esc(L.D.segs[g.si].s)+'</p><p class="rd-pt">'+esc(L.D.segs[g.si].pt)+'</p><p class="help"><b>A resposta era «'+esc(g.t)+'»</b>'+(g.word?' ('+esc(full(g.word))+" = "+esc(g.word.pt)+'). Ela volta na revisão.':".")+'</p><button type="button" class="btn wide primary" data-jd="gnext" data-focus>'+(L.gi+1<L.gaps.length?"Próxima lacuna":"Continuar")+"</button>";
        const f=$("#gstage").querySelector("[data-focus]");if(f)f.focus();
      }else render();
      return;
    }
    if(a==="gnext"){if(L.gi+1<L.gaps.length){L.gi++;render();}else next();return;}
    if(a==="blk"){
      const want=L.pick.length;
      if(i===want){L.pick.push(i);L.bfb="";sfx("ok");}
      else{L.bwrong++;L.bfb="Esse bloco não vem agora. Tente outro.";sfx("bad");}
      render();return;
    }
    if(a==="mw"){L.match.sel=i;L.mfb="";render();return;}
    if(a==="mm"){
      const M=L.match;if(M.sel==null){L.mfb="Escolha primeiro uma palavra.";render();return;}
      const e=M.e[M.sel];
      if(M.picks[i]===e.pt){M.done[M.sel]=1;M.sel=null;L.mfb="Combinou!";rec(e,true,4);sfx("ok");}
      else{L.mfb="Não é esse significado. Tente outro.";rec(e,false,4);sfx("bad");}
      render();return;
    }
    if(a==="tile"){
      const it=L.fw.items[L.fw.i];if(!it||it.done)return;
      it.pick.push(i);it.fb="";
      if(it.pick.length===it.t.length){
        const got=it.pick.map(j=>it.t[j]).join("");
        if(got===it.e.w.toLowerCase()){it.done=true;it.fb="Certo! "+full(it.e)+" = "+it.e.pt;if(it.tries===0)rec(it.e,true,2);sfx("ok");}
        else{it.tries++;if(it.tries===1)rec(it.e,false,2);sfx("bad");shake($("#jd-build"));
          if(it.tries>=2){it.done=true;it.pick=[];it.fb="A palavra era «"+it.e.w+"». Ela volta na revisão.";}
          else{it.pick=[];it.fb="Essa ordem não forma a palavra. Tente de novo.";}}
      }
      render();return;
    }
    if(a==="untile"){const it=L.fw.items[L.fw.i];if(it&&!it.done){it.pick.pop();render();}return;}
    if(a==="fnext"){if(L.fw.i+1<L.fw.items.length){L.fw.i++;render();}else next();return;}
    if(a==="tok"){
      const it=L.dt.items[L.dt.i];if(!it||it.done)return;
      const t=t0=>String(t0).toLowerCase(),tok=t(ev.target.closest("[data-t]").dataset.t);
      if(tok===t(it.e.w)||(window.candsOf&&window.candsOf(tok,L.lang).indexOf(t(it.e.w))>=0)){
        it.done=true;it.fb="Achou! "+full(it.e)+" = "+it.e.pt;if(it.tries===0)rec(it.e,true,4);sfx("ok");
      }else{
        it.tries++;it.bad=it.bad||{};it.bad[tok]=1;if(it.tries===1)rec(it.e,false,4);sfx("bad");
        if(it.tries>=2){it.done=true;it.fb="Era «"+it.e.w+"». Ela volta na revisão.";}else it.fb="Não é essa palavra. Procure outra.";
      }
      render();return;
    }
    if(a==="dnext"){if(L.dt.i+1<L.dt.items.length){L.dt.i++;render();}else next();return;}
    if(a==="chk"){checkFresh();return;}
    if(a==="fin"){
      markDone();sfx("done");
      openSheet("Lição concluída",'<p class="help">Você completou o trecho de «'+esc(L.b.name)+'». As palavras que errou voltam amanhã; as que acertou voltam mais adiante, e o jardim cresce conforme você volta.</p>',true);
    }
  });
  function checkFresh(){
    const F=L.fresh,i=$("#jd-in");if(!F||F.none||!i)return;const v=i.value.trim();if(!v)return;
    const ok=norm2(v)===norm2(F.e.w);
    if(ok){F.done=true;F.fb="Certo! "+full(F.e)+" = "+F.e.pt;if(F.tries===0)rec(F.e,true,3);sfx("ok");}
    else{F.tries++;if(F.tries===1)rec(F.e,false,3);sfx("bad");shake(i);
      if(F.tries>=2){F.done=true;F.fb="A resposta era «"+F.e.w+"». Ela volta na revisão.";}else F.fb="Ainda não. Confira a letra inicial e tente de novo.";}
    render();
  }
  $("#gstage").addEventListener("keydown",e=>{if(P&&P.type==="jardim"&&e.key==="Enter"&&e.target&&e.target.id==="jd-in"){e.preventDefault();checkFresh();}});
  /* próxima lição do Jardim para o idioma atual (Treino) */
  window.nextJardimPage=function(){
    const ps=VOLUME3.pages.filter(p=>p.type==="jardim"&&p.langs[0]===S.lang);
    return ps.find(p=>!S.done[S.lang+":"+p.id])||ps[0]||null;
  };
  document.addEventListener("click",e=>{
    if(e.target.closest&&e.target.closest("#train-garden")){
      const p=window.nextJardimPage();closeSheet();
      if(p)startLesson({vol:VOLUME3.id,page:p});
    }
  });
})();
