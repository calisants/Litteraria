/* ===== Livros: álbum de citações, frase do dia, jogos de citação, mini-leitura e «Meus livros» =====
   Tudo parte das frases conferidas de livros_frases.js e dos trechos conferidos de livros_leitura.js (só livros de domínio público).
   Nenhum jogo precisa de áudio; o botão de ouvir é um extra. Tradução, contexto e notas: Claude, sem fonte conferida (dito na tela). */
(function(){
  const BK={};BOOKS.forEach(b=>{BK[b.id]=b;});
  /* ---- lista plana de frases: id "livro:índice" ---- */
  const PH=[],phById={};
  Object.keys(BOOKFRASES).forEach(id=>{
    const b=BK[id];if(!b)return;
    BOOKFRASES[id].forEach((f,i)=>{const o={id:id+":"+i,book:id,lang:b.lang,s:f.s,pt:f.pt,note:f.note};PH.push(o);phById[o.id]=o;});
  });
  const phLang=l=>PH.filter(p=>p.lang===l);
  /* mistura os livros (um de cada vez) para cada página ter frases de livros diferentes */
  function interleave(lang){
    const by={};phLang(lang).forEach(p=>{(by[p.book]||(by[p.book]=[])).push(p);});
    const ks=Object.keys(by),out=[];
    for(let i=0;i<10;i++)ks.forEach(k=>{if(by[k][i])out.push(by[k][i]);});
    return out;
  }
  function rng(seed){let a=0;for(let i=0;i<seed.length;i++)a=(a*31+seed.charCodeAt(i))|0;return()=>{a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};}
  const shufS=(arr,seed)=>{const r=rng(seed),a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};

  /* ---- álbum de citações (S.fav) ---- */
  const isFav=id=>S.fav.indexOf(id)>=0;
  const imgBtn=id=>'<button type="button" class="btn" data-img="'+id+'">Salvar como imagem</button>';
  const favBtn=id=>'<button type="button" class="favbtn" data-fav="'+id+'" aria-pressed="'+isFav(id)+'">'+(isFav(id)?"★ No álbum":"☆ Guardar no álbum")+"</button>";
  window.phFavBtn=(book,i)=>favBtn(book+":"+i);
  document.addEventListener("click",e=>{
    const b=e.target.closest&&e.target.closest(".favbtn");if(!b)return;
    const id=b.dataset.fav,i=S.fav.indexOf(id);
    if(i>=0)S.fav.splice(i,1);else S.fav.push(id);
    save();
    b.setAttribute("aria-pressed",String(isFav(id)));b.textContent=isFav(id)?"★ No álbum":"☆ Guardar no álbum";
    if(!$("#s-album").hidden)renderAlbum();
  });
  /* ---- cartão de citação em imagem (PNG), só frases de livros de domínio público ---- */
  function wrapLines(ctx,text,maxW){
    const words=text.split(/\s+/),lines=[];let cur="";
    words.forEach(w=>{const t=cur?cur+" "+w:w;if(ctx.measureText(t).width>maxW&&cur){lines.push(cur);cur=w;}else cur=t;});
    if(cur)lines.push(cur);return lines;
  }
  function cardCanvas(p){
    const W=1080,H=1350,pad=96,cs=getComputedStyle(document.documentElement);
    const col=(n,d)=>(cs.getPropertyValue(n)||"").trim()||d;
    const bg=col("--surface",col("--bg","#ffffff")),ink=col("--ink","#141a24"),muted=col("--muted","#4d5869"),acc=col("--accent","#1f3d7a");
    const c=document.createElement("canvas");c.width=W;c.height=H;const x=c.getContext("2d");
    x.fillStyle=col("--bg","#f4f5f7");x.fillRect(0,0,W,H);
    x.fillStyle=bg;x.fillRect(48,48,W-96,H-96);
    x.strokeStyle=acc;x.lineWidth=4;x.strokeRect(48,48,W-96,H-96);
    const maxW=W-2*pad;let y=150;
    x.textBaseline="top";x.fillStyle=muted;x.font="600 30px Georgia,serif";
    wrapLines(x,("Frase do livro «"+BK[p.book].name+"» · "+LNAME[p.lang]).toUpperCase(),maxW).forEach(l=>{x.fillText(l,pad,y);y+=42;});
    let fs=72,lines;
    for(;fs>=36;fs-=4){x.font="700 "+fs+"px Georgia,serif";lines=wrapLines(x,p.s,maxW);if(lines.length*fs*1.35<=620)break;}
    x.font="italic 400 40px Georgia,serif";const tl=wrapLines(x,p.pt,maxW);
    const bodyH=lines.length*fs*1.35+34+6+44+tl.length*56,top=y+20,bottom=H-200;
    y=top+Math.max(0,(bottom-top-bodyH)/2);
    x.fillStyle=ink;x.font="700 "+fs+"px Georgia,serif";
    lines.forEach(l=>{x.fillText(l,pad,y);y+=fs*1.35;});
    y+=34;x.fillStyle=acc;x.fillRect(pad,y,160,6);y+=44;
    x.fillStyle=muted;x.font="italic 400 40px Georgia,serif";
    tl.forEach(l=>{x.fillText(l,pad,y);y+=56;});
    x.fillStyle=muted;x.font="400 26px Georgia,serif";
    x.fillText("Tradução: escrita por Claude, sem fonte conferida",pad,H-170);
    x.fillStyle=acc;x.font="700 34px Georgia,serif";x.fillText("Litteraria",pad,H-120);
    return c;
  }
  async function saveCard(id){
    const p=phById[id];if(!p)return;
    const c=cardCanvas(p),name="citacao-"+p.book+"-"+id.split(":")[1]+".png";
    const blob=await new Promise(r=>c.toBlob(r,"image/png"));
    if(!blob){say("Não consegui gerar a imagem neste navegador.");return;}
    const f=new File([blob],name,{type:"image/png"});
    try{
      if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:"Frase do livro «"+BK[p.book].name+"»"});return;}
    }catch(e){if(e&&e.name==="AbortError")return;}
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href),4000);
    say("Imagem salva: "+name);
  }
  window.cardCanvas=cardCanvas;window.phGet=id=>phById[id];
  document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-img]");if(b)saveCard(b.dataset.img);});
  function renderAlbum(){
    const ids=S.fav.filter(id=>phById[id]).slice().reverse();
    $("#album-count").textContent=ids.length?ids.length+(ids.length===1?" frase guardada":" frases guardadas"):"";
    $("#album-list").innerHTML=ids.length?ids.map(id=>{
      const p=phById[id],b=BK[p.book];
      return '<article class="alb"><p class="alb-k">'+esc(b.name)+" · "+esc(LNAME[p.lang])+'</p><p class="alb-s">'+esc(p.s)+(p.lang===S.lang?" "+speakBtn(p.s):"")+'</p><p class="alb-pt">'+esc(p.pt)+'</p><p class="alb-n">'+hl(p.note)+"</p>"+favBtn(id)+imgBtn(id)+"</article>";
    }).join(""):'<p class="help">Seu álbum está vazio. Toque em «Guardar no álbum» nas frases dos livros, na Frase do dia ou nos jogos de citação.</p>';
  }

  /* ---- toque em qualquer palavra do capítulo + caderno de vocabulário ---- */
  let anyW=null;
  function lookupAny(tok){
    const L=S.lang,vi=vIdx()[L],gl=(window.GLOS&&GLOS[L])||{};
    for(const x of candsOf(tok,L)){
      if(vi[x]&&(x===tok.toLowerCase()||x.length>=4))return {w:full(vi[x]),pt:vi[x].pt,src:"app"};
      if(gl[x]&&(x===tok.toLowerCase()||x.length>=4))return {w:x,pt:gl[x],src:"glos"};
    }
    return null;
  }
  function showAnyWord(tok){
    const r=lookupAny(tok),L=S.lang;
    anyW={w:r?r.w:tok.toLowerCase(),pt:r?r.pt:"",tok:tok};
    const saved=S.cad.some(c=>c.l===L&&c.w===anyW.w);
    $("#rdr-def").innerHTML="<b>"+esc(tok)+"</b> "+speakBtn(tok)+(r?" = "+esc(r.pt)+(r.w.toLowerCase()!==tok.toLowerCase()?" <small>(forma: "+esc(r.w)+")</small>":"")+"<br><small>"+(r.src==="app"?"Significado do vocabulário do app.":"Glossário do app: escrito por Claude, sem fonte conferida.")+"</small>":'<br><small>Esta palavra ainda não está no glossário do app, então não tenho o significado para mostrar. Você pode guardá-la mesmo assim e conferir no dicionário depois.</small>')+
      ' <button type="button" class="btn" id="cad-save"'+(saved?" disabled":"")+">"+(saved?"Já está no caderno":"Guardar no caderno")+"</button>";
  }
  function cadSave(){
    if(!anyW||S.cad.length>=300)return;
    if(S.cad.some(c=>c.l===S.lang&&c.w===anyW.w))return;
    S.cad.push({l:S.lang,w:anyW.w,pt:anyW.pt,b:RK.id||"",d:rvDue(1),s:0});save();
    showAnyWord(anyW.tok);
  }
  function openCad(){
    const L=S.lang,rows=S.cad.map((c,i)=>[c,i]).filter(x=>x[0].l===L);
    openSheet("Meu caderno · "+LNAME[L],
      (rows.length?rows.map(([c,i])=>'<div class="cad-row"><span><b>'+esc(c.w)+"</b> "+speakBtn(c.w)+" "+(c.pt?esc(c.pt):"<i>sem tradução salva</i>")+(c.b&&BK[c.b]?" <small>· «"+esc(BK[c.b].name)+"»</small>":"")+'</span><button type="button" class="btn" data-cad-del="'+i+'" aria-label="Tirar '+esc(c.w)+' do caderno">Tirar</button></div>').join(""):'<p class="help">Seu caderno de '+esc(LNAME[L])+' está vazio. No leitor, toque numa palavra e use «Guardar no caderno».</p>')+
      '<p class="help">As palavras guardadas voltam nos «Cartões de revisão» do Treino (só as que têm tradução salva).</p>',false);
  }
  window.openCad=openCad;
  document.addEventListener("click",e=>{
    const d=e.target.closest&&e.target.closest("[data-cad-del]");
    if(d){S.cad.splice(+d.dataset.cadDel,1);save();openCad();}
  });
  /* ---- frase do dia ---- */
  let qodExtra=0;
  const hash=s=>{let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h);};
  function renderQod(){
    const el=$("#qod");if(!el)return;
    const L=phLang(S.lang);
    if(!L.length){el.hidden=true;return;}
    const d=new Date(),day=d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    const p=L[(hash(day+S.lang)+qodExtra)%L.length];
    el.hidden=false;
    el.innerHTML='<p class="qod-k">Frase do dia · «'+esc(BK[p.book].name)+"»</p>"+
      '<p class="qod-s">'+esc(p.s)+" "+speakBtn(p.s)+'</p>'+
      '<details class="qod-d"><summary>Tradução e nota</summary><p class="qod-pt">'+esc(p.pt)+'</p><p class="qod-n">'+hl(p.note)+'</p><p class="qod-src">Frase copiada do livro. Tradução e nota: Claude, sem fonte conferida.</p></details>'+
      '<div class="row">'+favBtn(p.id)+'<button type="button" class="btn" id="qod-more">Outra frase</button></div>';
  }
  document.addEventListener("click",e=>{if(e.target.closest&&e.target.closest("#qod-more")){qodExtra++;renderQod();}});
  window.renderQod=renderQod;window.renderAlbum=renderAlbum;
  window.phLangList=phLang;window.phBookMap=BK;window.phHash=hash;

  /* ---- páginas novas ---- */
  VOLUME.types=VOLUME.types.concat([["citacao","Complete a citação","Citação"]]);
  VOLUME3.types=VOLUME3.types.concat([["leitura","Leitura de um trecho","Leitura"]]);
  const PER=6;
  ["fr","it","en"].forEach(lang=>{
    const L=interleave(lang);if(!L.length)return;
    const n=Math.max(1,Math.ceil(L.length/PER));
    ["citacao"].forEach(type=>{
      for(let i=0;i<n;i++){
        const part=L.slice(Math.round(i*L.length/n),Math.round((i+1)*L.length/n));
        VOLUME.pages.push({id:type+"-"+lang+"-"+(i+1),type:type,n:i+1,langs:[lang],themes:[],sub:"Frases dos livros",meta:"Frases dos livros · parte "+(i+1)+" de "+n,qs:part.map(p=>p.id)});
      }
    });
  });
  BOOKS.forEach(b=>{
    const R=BOOKREAD[b.id];if(!R)return;
    R.forEach((r,k)=>VOLUME3.pages.push({id:"leitura-"+b.id+"-"+(k+1),type:"leitura",n:200+VOLUME3.pages.length,rd:b.id,k:k+1,themes:["livro-"+b.id],langs:[b.lang],sub:b.name,meta:"Trecho de «"+b.name+"» · "+(k+1)+" de "+R.length}));
  });
  GAMENAME.citacao="Citação";GAMENAME.leitura="Leitura";
  ["citacao","leitura"].forEach(t=>{STAGES[t]="#gstage";DOCKS[t]="none";});
  GAMEFN.citacao=startCit;GAMEFN.leitura=startLeitura;

  /* ---- Complete a citação ---- */
  const STOP={
    en:"the and but for nor not you your that this with from have has had was were are been will would could shall into onto over what when where which who whom they them their there then than very just only also".split(" "),
    fr:"les des une est sont que qui dans pour avec par sur sous plus mais très son ses leur leurs nous vous ils elles elle lui moi toi cette ces aux ont été avait avaient était étaient fut sans chez".split(" "),
    it:"gli del della delle dello dei che per con una uno non più sono era erano come questo questa questi queste suo sua suoi sue loro egli ella essi tra fra nel nella nelle negli dal dalla dai alle agli".split(" ")};
  const core=t=>{const m=t.match(/^[^\p{L}]*([\s\S]*?)[^\p{L}]*$/u);return m?m[1]:t;};
  const cap=(w,like)=>like&&like[0]!==like[0].toLowerCase()?w[0].toUpperCase()+w.slice(1):w;
  function cloze(p){
    const toks=p.s.split(" ");let best=-1,bl=0;
    toks.forEach((t,i)=>{const w=core(t);if(w.length<4||STOP[p.lang].indexOf(w.toLowerCase())>=0)return;if(i>0&&w[0]!==w[0].toLowerCase())return;if(w.length>bl){bl=w.length;best=i;}});
    if(best<0)return null;
    const ans=core(toks[best]),pool=[];
    phLang(p.lang).forEach(o=>{if(o.id===p.id)return;o.s.split(" ").forEach(t=>{const w=core(t);if(w.length>=3&&Math.abs(w.length-ans.length)<=2&&w.toLowerCase()!==ans.toLowerCase()&&(w[0]===w[0].toLowerCase())&&!/[0-9]/.test(w))pool.push(w.toLowerCase());});});
    const opts=[],seen={};seen[ans.toLowerCase()]=1;
    shufS(pool,"cit|"+p.id).forEach(w=>{if(opts.length<3&&!seen[w]){seen[w]=1;opts.push(w);}});
    if(opts.length<3)return null;
    const all=shufS([ans.toLowerCase()].concat(opts),"opt|"+p.id).map(w=>cap(w,ans));
    const shown=toks.map((t,i)=>i===best?t.replace(ans,"_____"):t).join(" ");
    return{p:p,shown:shown,ans:cap(ans.toLowerCase(),ans),opts:all};
  }
  let qz=null;window.quizState=()=>qz;
  RESUME.reg(["citacao"],{
    get(){return qz&&qz.qs&&qz.i<qz.qs.length?{kind:qz.kind,qs:qz.qs,i:qz.i,score:qz.score,sel:qz.sel}:null;},
    set(st){
      if(!st.qs||st.kind!==qz.kind||!st.qs.length)return;
      qz.qs=st.qs;qz.i=Math.max(0,Math.min(+st.i||0,st.qs.length-1));qz.score=Math.max(0,+st.score||0);
      qz.sel=Number.isInteger(st.sel)?st.sel:null;renderQ();
    }
  });
  /* revisão espaçada das frases erradas (ou vistas com dica): voltam nas próximas páginas de citação */
  function qrvDue(){const t=Date.now();return Object.keys(S.qrv).filter(id=>phById[id]&&phById[id].lang===S.lang&&S.qrv[id][0]<=t).slice(0,2);}
  function qrvGrade(id,ok){
    const cur=S.qrv[id];
    if(ok){if(!cur)return;const st=cur[1]+1;if(st>=RV_STEPS.length)delete S.qrv[id];else S.qrv[id]=[rvDue(rvIvl(st,0)),st];}
    else if(Object.keys(S.qrv).length<200||cur)S.qrv[id]=[rvDue(1),cur?Math.max(0,cur[1]-1):0];
    save();
  }
  function withRev(ids){const ex=qrvDue().filter(id=>ids.indexOf(id)<0);return ids.concat(ex);}
  function startCit(){
    fitFn=null;
    const qs=withRev(P.qs).map(id=>cloze(phById[id])).filter(Boolean);
    qz={kind:"cit",qs:qs,i:0,score:0,sel:null};renderQ();
  }
  function renderQ(){
    const q=qz.qs[qz.i],p=q.p,ans=qz.sel!==null;
    let h='<p class="ocount">Citação '+(qz.i+1)+" de "+qz.qs.length+" · acertos: "+qz.score+"</p>";
    h+=(q.hint||ans?'<p class="prompt"><small>Tradução (dica)</small>'+esc(p.pt)+'</p>':'')+'<p class="qz-s">'+esc(q.shown)+'</p><p class="help" style="text-align:center">Qual palavra completa a frase do livro «'+esc(BK[p.book].name)+"»?</p>";
    h+='<div class="opts">'+q.opts.map((w,i)=>'<button type="button" class="opt'+(ans?(w===q.ans?" right":(qz.sel===i?" wrong":"")):"")+'" data-o="'+i+'"'+(ans?" disabled":"")+">"+esc(w)+"</button>").join("")+"</div>";
    if(!ans&&!q.hint)h+='<div class="row"><button type="button" class="btn" id="qz-hint">Dica: ver a tradução</button></div>';
    if(ans){
      const ok=q.opts[qz.sel]===q.ans;
      h+='<p class="note"><b>'+(ok?"Certo!":"Era «"+esc(q.ans)+"».").replace(/«([^»]*)»/g,"<b>$1</b>")+"</b></p>";
      h+='<div class="heard">'+speakBtn(p.s)+"<span>"+esc(p.s)+'</span></div><p class="note"><b>Nota:</b> '+hl(p.note)+'</p><p class="note"><small>Frase copiada do livro «'+esc(BK[p.book].name)+"». Tradução e nota: escritas por Claude, sem fonte conferida.</small></p>"+favBtn(p.id)+
        '<div class="row"><button type="button" class="btn primary" id="qz-next">'+(qz.i===qz.qs.length-1?"Ver resultado":"Próxima")+"</button></div>";
    }
    $("#gstage").innerHTML=h;
  }
  $("#gstage").addEventListener("click",e=>{
    if(!P||P.type!=="citacao"||!qz)return;
    if(e.target.closest("#qz-hint")&&qz.sel===null){qz.qs[qz.i].hint=true;renderQ();return;}
    const o=e.target.closest(".opt");
    if(o&&qz.sel===null){
      qz.sel=+o.dataset.o;const q=qz.qs[qz.i];
      const ok=q.opts[qz.sel]===q.ans;
      if(ok&&!q.hint)qz.score++;qrvGrade(q.p.id,ok&&!q.hint);sfx(ok?"ok":"bad");renderQ();return;
    }
    if(e.target.closest("#qz-next")){
      if(qz.i<qz.qs.length-1){qz.i++;qz.sel=null;renderQ();return;}
      markDone();sfx("done");
      doneSheet("Página concluída: "+qz.score+" de "+qz.qs.length+" certas",qz.qs.map(q=>({w:q.p.s,pt:q.p.pt})));
    }
  });

  /* ---- Mini-leitura ---- */
  const VM={};
  function vmap(id){
    if(VM[id])return VM[id];
    const m=VM[id]={};
    BK[id].chunks.forEach(c=>c.words.forEach(w=>{const k=w.w.toLowerCase();if(!m[k])m[k]=w;}));
    return m;
  }
  /* acha a palavra do vocabulário também em formas flexionadas simples (mentioned → mention, doors → door) */
  function candsOf(tok,lang){
    const k=tok.toLowerCase().replace(/’/g,"'");
    const c=[k];
    if(k.indexOf("'")>=0)c.push(lang==="en"?k.replace(/'s$/,""):k.slice(k.lastIndexOf("'")+1));
    c.slice().forEach(x=>{
      if(lang==="en"){
        if(/ies$/.test(x))c.push(x.slice(0,-3)+"y");
        if(/(es|ed)$/.test(x))c.push(x.slice(0,-2),x.slice(0,-1));
        if(/(s|d)$/.test(x))c.push(x.slice(0,-1));
        if(/ing$/.test(x))c.push(x.slice(0,-3),x.slice(0,-3)+"e");
        if(/ly$/.test(x))c.push(x.slice(0,-2));
      }else if(lang==="fr"){
        if(/[sx]$/.test(x))c.push(x.slice(0,-1));
      }
    });
    return c;
  }
  window.candsOf=candsOf;
  window.__rdh={wordsHtml:(...a)=>wordsHtml(...a),vmap:id=>vmap(id),keyOf:(...a)=>keyOf(...a),BK:BK};
  function keyOf(tok,m,lang){
    const c=candsOf(tok,lang),k=c[0];
    for(const x of c){if(m[x]&&(x===k||x.length>=4))return x;}
    return null;
  }
  let rd=null;window.readState=()=>rd;
  function startLeitura(){
    fitFn=null;
    rd={D:BOOKREAD[P.rd][P.k-1],shown:{},sel:null,found:{}};
    renderLeitura();
  }
  function wordsHtml(text,m,lang,found,all){
    const sk=S.sk[lang]||{};
    let before="";
    return text.split(/(\p{L}[\p{L}'’]*)/u).map(t=>{
      const start=!/[\p{L}]/u.test(before)||/[.!?:;]["'«»\s]*$/.test(before);
      before+=t;
      if(!/^\p{L}/u.test(t))return esc(t);
      if(!start&&t[0]!==t[0].toLowerCase())return esc(t);   /* nomes próprios no meio da frase não contam */
      const k=keyOf(t,m,lang);
      if(!k)return all?'<span class="tw" data-t="'+esc(t)+'">'+esc(t)+"</span>":esc(t);
      found[k]=m[k];
      const a=sk[k],learned=a&&a[0]>0;
      const gs=typeof window.gdStage==="function"?window.gdStage(lang,m[k].w):0;
      return '<button type="button" class="rw '+(learned?"k":"u")+' gs'+gs+'" data-k="'+esc(k)+'">'+esc(t)+"</button>";
    }).join("");
  }
  function lineHtml(seg,i,m,lang){
    return '<div class="rd-line"><p class="rd-s">'+wordsHtml(seg.s,m,lang,rd.found)+'</p><div class="rd-act">'+(lang===S.lang?speakBtn(seg.s):"")+'<button type="button" class="btn rd-tr" data-i="'+i+'" aria-pressed="'+!!rd.shown[i]+'">'+(rd.shown[i]?"Esconder tradução":"Ver tradução")+"</button></div>"+(rd.shown[i]?'<p class="rd-pt">'+esc(seg.pt)+"</p>":"")+"</div>";
  }
  function renderLeitura(){
    const b=BK[P.rd],m=vmap(P.rd);rd.found={};
    let h='<p class="ocount">'+esc(P.meta)+"</p>"+'<p class="note"><b>Contexto:</b> '+esc(rd.D.ctx)+"</p>";
    h+='<div class="rd">'+rd.D.segs.map((s,i)=>lineHtml(s,i,m,S.lang)).join("")+"</div>";
    const e=rd.sel&&m[rd.sel];
    h+='<div class="rd-def" aria-live="polite">'+(e?"<b>"+esc(full(e))+"</b> = "+esc(e.pt)+" <small>("+esc(e.c)+")</small>"+(window.gdChip?" "+window.gdChip(S.lang,e.w):""):(Object.keys(rd.found).length?"Toque numa palavra sublinhada para ver o significado. As que você já acertou nos exercícios aparecem em negrito e com cor.":"Neste trecho não aparece nenhuma palavra do vocabulário deste livro no app. Use a tradução frase a frase e a nota abaixo."))+"</div>";
    h+='<p class="note"><b>Para reparar:</b> '+hl(rd.D.gn)+"</p>";
    h+='<details class="srcbox"><summary>Fonte da tradução</summary><p class="note"><small>Trecho do livro «'+esc(b.name)+"». Tradução, contexto e nota: escritas por Claude, sem fonte conferida. As palavras sublinhadas são as do vocabulário do livro neste app.</small></p></details>";
    h+='<div class="row"><button type="button" class="btn" id="rd-all">Ver toda a tradução</button><button type="button" class="btn primary" id="rd-done">Concluí a leitura</button></div>';
    $("#gstage").innerHTML=h;
  }
  $("#gstage").addEventListener("click",e=>{
    if(!P||P.type!=="leitura"||!rd)return;
    const w=e.target.closest(".rw"),t=e.target.closest(".rd-tr");
    if(w){rd.sel=w.dataset.k;renderLeitura();return;}
    if(t){const i=+t.dataset.i;rd.shown[i]=!rd.shown[i];renderLeitura();return;}
    if(e.target.closest("#rd-all")){const all=rd.D.segs.every((_,i)=>rd.shown[i]);rd.D.segs.forEach((_,i)=>{rd.shown[i]=!all;});renderLeitura();return;}
    if(e.target.closest("#rd-done")){
      const items=Object.keys(rd.found).slice(0,15).map(k=>rd.found[k]);
      markDone();sfx("done");
      if(items.length)doneSheet("Leitura concluída · palavras do trecho",items);
      else openSheet("Leitura concluída","<p class=\"help\">Esse trecho não tem palavras do vocabulário do livro neste app, mas ler no original já conta.</p>",true);
    }
  });

  const TI=window.BOOKTXT_INFO||{};
  /* ---- Meus livros ---- */
  const cats=b=>b.chunks.map(c=>c.cat);
  const bookPages=b=>{
    const cs=cats(b);
    return lessonPath().filter(r=>(r.page.cat&&cs.indexOf(r.page.cat)>=0)||r.page.book===b.id||r.page.rd===b.id);
  };
  const isDoneId=p=>!!S.done[S.lang+":"+p.id];
  const CONTOS={perrault:1,grimm:1,racconti:1};
  const BOOK_GROUPS=[["Romances e clássicos",b=>!CONTOS[b.id]],["Contos de fadas",b=>!!CONTOS[b.id]]];
  const readCaps=id=>(TI[id]?TI[id].chs:[]).filter(c=>S.cap[capKey(id,c.n)]).length;
  function renderBooks(){
    const bs=BOOKS.filter(b=>b.lang===S.lang),sk=S.sk[S.lang]||{};
    $("#books-lang").textContent=LNAME[S.lang];
    const fav=S.fav.filter(id=>phById[id]).length;
    $("#books-album").textContent="★ Álbum de citações"+(fav?" ("+fav+")":"");
    const card=b=>{
      let tot=0,known=0;
      b.chunks.forEach(c=>c.words.forEach(w=>{tot++;const a=sk[w.w.toLowerCase()];if(a&&a[0]>0)known++;}));
      const pages=bookPages(b),doneN=pages.filter(r=>isDoneId(r.page)).length;
      const nx=pages.find(r=>!isDoneId(r.page));
      const kinds={words:pages.filter(r=>r.page.cat),fr:pages.filter(r=>r.page.book),rd:pages.filter(r=>r.page.rd)};
      const cnt=a=>a.filter(r=>isDoneId(r.page)).length+" de "+a.length;
      const pct=pages.length?Math.round(100*doneN/pages.length):0,pw=tot?Math.round(100*known/tot):0;
      return '<article class="bkc"><h3>'+esc(b.name)+"</h3>"+
        '<p class="bkc-l">Palavras que você já acertou: <b>'+known+" de "+tot+"</b></p>"+'<div class="bar2" role="img" aria-label="'+pw+'% das palavras"><i style="width:'+pw+'%"></i></div>'+
        '<p class="bkc-l">Lições concluídas: <b>'+doneN+" de "+pages.length+"</b> ("+pct+"%)</p>"+'<div class="bar2" role="img" aria-label="'+pct+'% das lições"><i style="width:'+pct+'%"></i></div>'+
        '<p class="bkc-s">'+(TI[b.id]?"Texto do livro: <b>"+readCaps(b.id)+" de "+TI[b.id].chs.length+"</b> "+(TI[b.id].chs.length===1?"capítulo lido":"capítulos lidos")+" · ":"")+'Vocabulário '+cnt(kinds.words)+(kinds.fr.length?" · Frases "+cnt(kinds.fr):"")+(kinds.rd.length?" · Leitura "+cnt(kinds.rd):"")+"</p>"+
        (nx?'<button type="button" class="btn primary" data-bk-go="'+esc(nx.page.id)+'" data-bk-vol="'+nx.vol+'">'+(doneN?"Continuar este livro":"Começar este livro")+"</button>":'<p class="bkc-ok">Livro concluído ✓</p>')+
        '<div class="row bkc-r">'+(TI[b.id]?'<button type="button" class="btn" data-bk-read="'+b.id+'">Ler o livro</button>':"")+(kinds.fr.length?'<button type="button" class="btn" data-bk-go="'+esc(kinds.fr[0].page.id)+'" data-bk-vol="3">Frases</button>':"")+(kinds.rd.length?'<button type="button" class="btn" data-bk-go="'+esc(kinds.rd[0].page.id)+'" data-bk-vol="3">Leitura</button>':"")+"</div></article>";
    };
    const out=[];
    BOOK_GROUPS.forEach(g=>{
      const l=bs.filter(b=>g[1](b));
      if(l.length)out.push('<h2 class="grp bkgrp">'+g[0]+" <small>("+l.length+(l.length===1?" livro":" livros")+")</small></h2>"+l.map(card).join(""));
    });
    $("#books-list").innerHTML=out.join("");
  }
  window.renderBooks=renderBooks;
  $("#books-list").addEventListener("click",e=>{
    const rb=e.target.closest("[data-bk-read]");if(rb){openReader(rb.dataset.bkRead);return;}
    const b=e.target.closest("[data-bk-go]");if(!b)return;
    S.vol=+b.dataset.bkVol;S.fGame="all";S.fTheme="all";save();startPage(b.dataset.bkGo);
  });
  $("#books-album").addEventListener("click",()=>go("album"));
  $("#books-cad").addEventListener("click",()=>openCad());
  $("#go-books").addEventListener("click",()=>go("books"));

  /* ---- Livro completo: capítulos com o original e a tradução, parágrafo a parágrafo ---- */
  const RK={id:null,ch:null,data:null,shown:{},found:{},sel:null};window.readerState=()=>RK;
  const capKey=(id,n)=>id+"-"+n;
  function loadTxt(id){
    return new Promise((ok,no)=>{
      if(window.BOOKTXT&&BOOKTXT[id])return ok(BOOKTXT[id]);
      const sc=document.createElement("script");
      sc.src="books/"+id+".js?v="+APP_REL.v;
      sc.onload=()=>(window.BOOKTXT&&BOOKTXT[id])?ok(BOOKTXT[id]):no();
      sc.onerror=no;document.head.appendChild(sc);
    });
  }
  function rdrSet(title,sub){$("#rdr-title").textContent=title;$("#rdr-sub").textContent=sub||"";}
  function openReader(id,ch){
    const b=BK[id],info=TI[id];if(!b||!info)return;
    RK.id=id;RK.ch=null;RK.data=null;go("reader");
    if(ch){openChapter(ch);return;}
    renderChapterList();
  }
  /* ---- contexto histórico e cultural (notas com fonte) ---- */
  function ctxHtml(notes,title,open){
    if(!notes||!notes.length)return "";
    return '<details class="ctxh"'+(open?" open":"")+"><summary>"+esc(title)+" ("+notes.length+")</summary><ul>"+notes.map(n=>"<li>"+esc(n.t)+'<br><small>Fonte: <a href="'+esc(n.u)+'" target="_blank" rel="noopener noreferrer">'+esc(n.s)+"</a></small></li>").join("")+"</ul>"+
      '<p class="note"><small>Resumo escrito por Claude, com suas próprias palavras, a partir da fonte indicada em cada nota (página aberta e conferida em 20/10/2026). Os links abrem fora do app e precisam de internet.</small></p></details>';
  }
  const CX=id=>(window.CTXH&&CTXH[id])||{};
  function renderChapterList(){
    const b=BK[RK.id],info=TI[RK.id];RK.ch=null;
    rdrSet(b.name,"Texto completo · "+(info.chs.length===info.total?info.total+" capítulo"+(info.total>1?"s":""):info.chs.length+" de "+info.total+" capítulos prontos"));
    const read=info.chs.filter(c=>S.cap[capKey(RK.id,c.n)]).length;
    let h=ctxHtml(CX(RK.id).intro,"Sobre o livro e a época",false)+'<p class="ocount">Capítulos lidos: '+read+" de "+info.chs.length+"</p>";
    h+='<div class="chl">'+info.chs.map(c=>{
      const ok=S.cap[capKey(RK.id,c.n)];
      return '<button type="button" class="chb'+(ok?" ok":"")+'" data-ch="'+c.n+'"><span class="chn">'+(ok?"✓":c.n)+'</span><span class="cht"><b>'+esc(c.t)+"</b>"+(c.tp?"<small>"+esc(c.tp)+"</small>":"")+"<small>"+c.w+" palavras</small></span></button>";
    }).join("")+"</div>";
    if(info.chs.length<info.total)h+='<p class="note"><small>Os outros capítulos ainda estão sendo preparados.</small></p>';
    h+='<details class="srcbox"><summary>Fonte da tradução</summary><p class="note"><small>Texto do livro «'+esc(b.name)+'». Tradução: escrita por Claude, sem fonte conferida; pode ter erros ou escolhas diferentes de uma tradução publicada.</small></p></details>';
    $("#rdr-body").innerHTML=h;$("#rdr-body").scrollTop=0;
  }
  function openChapter(n){
    const b=BK[RK.id];
    $("#rdr-body").innerHTML='<p class="help">Abrindo o capítulo…</p>';
    loadTxt(RK.id).then(D=>{
      const c=D.find(x=>x.n===n);if(!c)throw 0;
      RK.ch=n;RK.data=c;RK.shown={};RK.found={};RK.sel=null;
      renderChapter();
    }).catch(()=>{
      $("#rdr-body").innerHTML='<p class="note">Não consegui abrir este capítulo agora. Se você estiver sem internet, abra o livro uma vez com internet para ele ficar guardado no aparelho.</p><div class="row"><button type="button" class="btn" id="rdr-list">Voltar à lista</button></div>';
    });
  }
  function hasLit(){return !!(RK.data&&RK.data.p.some(x=>x.length>2));}
  function trTxt(pr){return (S.trad==="lit"&&pr[2])?pr[2]:pr[1];}
  function parHtml(i){
    const pr=RK.data.p[i],m=vmap(RK.id),sh=RK.shown[i];
    if(!/\p{L}/u.test(pr[0]))return '<div class="rd-line rd-sep" data-i="'+i+'" aria-hidden="true">'+esc(pr[0])+'</div>';
    return '<div class="rd-line" data-i="'+i+'"><p class="rd-s">'+wordsHtml(pr[0],m,S.lang,RK.found,true)+'</p><div class="rd-act">'+speakBtn(pr[0])+'<button type="button" class="btn rd-tr" data-i="'+i+'" aria-pressed="'+!!sh+'">'+(sh?"Esconder tradução":"Ver tradução")+"</button></div>"+(sh?'<p class="rd-pt">'+esc(trTxt(pr))+"</p>":"")+"</div>";
  }
  function renderChapter(){
    const b=BK[RK.id],info=TI[RK.id],c=RK.data,pos=info.chs.findIndex(x=>x.n===c.n);
    rdrSet(b.name,"Capítulo "+(pos+1)+" de "+info.chs.length);
    RK.found={};
    let h='<h3 class="rdc-t">'+esc(c.t)+"</h3>"+(c.tp?'<p class="rdc-tp">'+esc(c.tp)+"</p>":"");
    if(hasLit())h+='<div class="row trmode"><span class="help">Tradução:</span><button type="button" class="btn" id="rdr-mode" aria-pressed="'+(S.trad==="lit")+'">'+(S.trad==="lit"?"Literal (segue a ordem do original)":"Natural (soa melhor em português)")+'</button></div>';
    h+=ctxHtml((CX(RK.id).ch||{})[c.n],"Contexto histórico e cultural",false);
    if(RK.id==="racconti"&&c.n>=10)h+='<p class="note"><small>Este conto não é um dos contos de Perrault: faz parte da mesma coletânea do livro.</small></p>';
    h+='<div class="rd" id="rdr-pars">'+c.p.map((_,i)=>parHtml(i)).join("")+"</div>";
    h+='<div class="rd-def" id="rdr-def" aria-live="polite">'+(Object.keys(RK.found).length?"Toque numa palavra sublinhada para ver o significado. As que você já acertou nos exercícios aparecem em negrito e com cor.":"Neste capítulo não aparece nenhuma palavra do vocabulário deste livro no app.")+"</div>";
    h+='<details class="srcbox"><summary>Fonte da tradução</summary><p class="note"><small>Texto do livro «'+esc(b.name)+'». Tradução ('+(hasLit()?"literal e natural":"natural")+'): escrita por Claude, sem fonte conferida. As palavras sublinhadas são as do vocabulário do livro neste app.</small></p></details>';
    h+='<div class="row"><button type="button" class="btn" id="rdr-all">Ver toda a tradução</button><button type="button" class="btn primary" id="rdr-done">Concluí o capítulo</button></div>';
    h+='<div class="row">'+(pos>0?'<button type="button" class="btn" data-go-ch="'+info.chs[pos-1].n+'">← Capítulo anterior</button>':"")+(pos<info.chs.length-1?'<button type="button" class="btn" data-go-ch="'+info.chs[pos+1].n+'">Próximo capítulo →</button>':"")+'<button type="button" class="btn" id="rdr-list">Lista de capítulos</button></div>';
    $("#rdr-body").innerHTML=h;$("#rdr-body").scrollTop=0;
  }
  $("#rdr-body").addEventListener("click",e=>{
    const ch=e.target.closest("[data-ch]");if(ch){openChapter(+ch.dataset.ch);return;}
    const g=e.target.closest("[data-go-ch]");if(g){openChapter(+g.dataset.goCh);return;}
    if(e.target.closest("#rdr-list")){renderChapterList();return;}
    if(!RK.data)return;
    const w=e.target.closest(".rw"),t=e.target.closest(".rd-tr"),tw=e.target.closest(".tw");
    if(tw){showAnyWord(tw.dataset.t);return;}
    if(e.target.closest("#cad-save")){cadSave();return;}
    if(w){
      RK.sel=w.dataset.k;const en=vmap(RK.id)[RK.sel];
      $("#rdr-def").innerHTML=en?"<b>"+esc(full(en))+"</b> = "+esc(en.pt)+" <small>("+esc(en.c)+")</small>"+(window.gdChip?" "+window.gdChip(S.lang,en.w):""):"";
      return;
    }
    if(t){const i=+t.dataset.i;RK.shown[i]=!RK.shown[i];const el=t.closest(".rd-line");el.outerHTML=parHtml(i);return;}
    if(e.target.closest("#rdr-mode")){
      S.trad=S.trad==="lit"?"nat":"lit";save();
      const bt=$("#rdr-mode");bt.setAttribute("aria-pressed",S.trad==="lit");bt.textContent=S.trad==="lit"?"Literal (segue a ordem do original)":"Natural (soa melhor em português)";
      $$("#rdr-pars .rd-line").forEach(el=>{el.outerHTML=parHtml(+el.dataset.i);});
      return;
    }
    if(e.target.closest("#rdr-all")){
      const all=RK.data.p.every((x,i)=>RK.shown[i]||!/\p{L}/u.test(x[0]));
      RK.data.p.forEach((_,i)=>{RK.shown[i]=!all;});
      $$("#rdr-pars .rd-line").forEach(el=>{el.outerHTML=parHtml(+el.dataset.i);});
      $("#rdr-all").textContent=all?"Ver toda a tradução":"Esconder toda a tradução";
      return;
    }
    if(e.target.closest("#rdr-done")){
      const items=Object.keys(RK.found).slice(0,15).map(k=>RK.found[k]);
      S.cap[capKey(RK.id,RK.data.n)]=1;save();sfx("done");
      if(items.length)doneSheet("Capítulo concluído · palavras do capítulo",items);
      else openSheet("Capítulo concluído","<p class=\"help\">Esse capítulo não tem palavras do vocabulário do livro neste app, mas ler no original já conta.</p>",true);
    }
  });
  $("#rdr-back").addEventListener("click",()=>{if(RK.ch!==null)renderChapterList();else go("books");});
  window.openReader=openReader;
  renderQod();
})();
