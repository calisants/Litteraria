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
  function renderAlbum(){
    const ids=S.fav.filter(id=>phById[id]).slice().reverse();
    $("#album-count").textContent=ids.length?ids.length+(ids.length===1?" frase guardada":" frases guardadas"):"";
    $("#album-list").innerHTML=ids.length?ids.map(id=>{
      const p=phById[id],b=BK[p.book];
      return '<article class="alb"><p class="alb-k">'+esc(b.name)+" · "+esc(LNAME[p.lang])+'</p><p class="alb-s">'+esc(p.s)+(p.lang===S.lang?" "+speakBtn(p.s):"")+'</p><p class="alb-pt">'+esc(p.pt)+'</p><p class="alb-n">'+hl(p.note)+"</p>"+favBtn(id)+"</article>";
    }).join(""):'<p class="help">Seu álbum está vazio. Toque em «Guardar no álbum» nas frases dos livros, na Frase do dia ou nos jogos de citação.</p>';
  }

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
      '<p class="qod-s">'+esc(p.s)+" "+speakBtn(p.s)+'</p><p class="qod-pt">'+esc(p.pt)+"</p>"+
      '<details class="qod-d"><summary>Ver nota de gramática</summary><p class="qod-n">'+hl(p.note)+'</p><p class="qod-src">Frase copiada do livro. Tradução e nota: Claude, sem fonte conferida.</p></details>'+
      '<div class="row">'+favBtn(p.id)+'<button type="button" class="btn" id="qod-more">Outra frase</button></div>';
  }
  document.addEventListener("click",e=>{if(e.target.closest&&e.target.closest("#qod-more")){qodExtra++;renderQod();}});
  window.renderQod=renderQod;window.renderAlbum=renderAlbum;

  /* ---- páginas novas ---- */
  VOLUME.types=VOLUME.types.concat([["citacao","Complete a citação","Citação"],["qualivro","De qual livro é?","De qual livro?"]]);
  VOLUME3.types=VOLUME3.types.concat([["leitura","Leitura de um trecho","Leitura"]]);
  const PER=6;
  ["fr","it","en"].forEach(lang=>{
    const L=interleave(lang);if(!L.length)return;
    const n=Math.max(1,Math.ceil(L.length/PER));
    ["citacao","qualivro"].forEach(type=>{
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
  GAMENAME.citacao="Citação";GAMENAME.qualivro="De qual livro?";GAMENAME.leitura="Leitura";
  ["citacao","qualivro","leitura"].forEach(t=>{STAGES[t]="#gstage";DOCKS[t]="none";});
  GAMEFN.citacao=startCit;GAMEFN.qualivro=startQual;GAMEFN.leitura=startLeitura;

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
  function startCit(){
    fitFn=null;
    const qs=P.qs.map(id=>cloze(phById[id])).filter(Boolean);
    qz={kind:"cit",qs:qs,i:0,score:0,sel:null};renderQ();
  }
  function startQual(){
    fitFn=null;
    const opts=BOOKS.filter(b=>b.lang===S.lang);
    const qs=P.qs.map(id=>{const p=phById[id];return{p:p,opts:shufS(opts.map(b=>b.id),"ql|"+p.id)};});
    qz={kind:"qual",qs:qs,i:0,score:0,sel:null};renderQ();
  }
  function renderQ(){
    const q=qz.qs[qz.i],p=q.p,ans=qz.sel!==null;
    let h='<p class="ocount">'+(qz.kind==="cit"?"Citação ":"Frase ")+(qz.i+1)+" de "+qz.qs.length+" · acertos: "+qz.score+"</p>";
    if(qz.kind==="cit"){
      h+='<p class="prompt"><small>Tradução</small>'+esc(p.pt)+'</p><p class="qz-s">'+esc(q.shown)+'</p><p class="help" style="text-align:center">Qual palavra completa a frase do livro «'+esc(BK[p.book].name)+"»?</p>";
      h+='<div class="opts">'+q.opts.map((w,i)=>'<button type="button" class="opt'+(ans?(w===q.ans?" right":(qz.sel===i?" wrong":"")):"")+'" data-o="'+i+'"'+(ans?" disabled":"")+">"+esc(w)+"</button>").join("")+"</div>";
    }else{
      h+='<p class="prompt"><small>De qual livro é esta frase?</small>'+esc(p.s)+(ans?" "+speakBtn(p.s):"")+'</p><p class="help" style="text-align:center">Tradução: '+esc(p.pt)+"</p>";
      h+='<div class="opts">'+q.opts.map((id,i)=>'<button type="button" class="opt'+(ans?(id===p.book?" right":(qz.sel===i?" wrong":"")):"")+'" data-o="'+i+'"'+(ans?" disabled":"")+">"+esc(BK[id].name)+"</button>").join("")+"</div>";
    }
    if(ans){
      const ok=qz.kind==="cit"?q.opts[qz.sel]===q.ans:q.opts[qz.sel]===p.book;
      h+='<p class="note"><b>'+(ok?"Certo!":(qz.kind==="cit"?"Era «"+esc(q.ans)+"».":"Era «"+esc(BK[p.book].name)+"».")).replace(/«([^»]*)»/g,"<b>$1</b>")+"</b></p>";
      h+='<div class="heard">'+speakBtn(p.s)+"<span>"+esc(p.s)+'</span></div><p class="note"><b>Nota:</b> '+hl(p.note)+'</p><p class="note"><small>Frase copiada do livro «'+esc(BK[p.book].name)+"». Tradução e nota: escritas por Claude, sem fonte conferida.</small></p>"+favBtn(p.id)+
        '<div class="row"><button type="button" class="btn primary" id="qz-next">'+(qz.i===qz.qs.length-1?"Ver resultado":"Próxima")+"</button></div>";
    }
    $("#gstage").innerHTML=h;
  }
  $("#gstage").addEventListener("click",e=>{
    if(!P||(P.type!=="citacao"&&P.type!=="qualivro")||!qz)return;
    const o=e.target.closest(".opt");
    if(o&&qz.sel===null){
      qz.sel=+o.dataset.o;const q=qz.qs[qz.i];
      const ok=qz.kind==="cit"?q.opts[qz.sel]===q.ans:q.opts[qz.sel]===q.p.book;
      if(ok)qz.score++;sfx(ok?"ok":"bad");renderQ();return;
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
  function keyOf(tok,m,lang){
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
    for(const x of c){if(m[x]&&(x===k||x.length>=4))return x;}
    return null;
  }
  let rd=null;window.readState=()=>rd;
  function startLeitura(){
    fitFn=null;
    rd={D:BOOKREAD[P.rd][P.k-1],shown:{},sel:null,found:{}};
    renderLeitura();
  }
  function lineHtml(seg,i,m,lang){
    const sk=S.sk[lang]||{};
    let before="";
    const parts=seg.s.split(/(\p{L}[\p{L}'’]*)/u).map(t=>{
      const start=!/[\p{L}]/u.test(before)||/[.!?:;]["'«»\s]*$/.test(before);
      before+=t;
      if(!/^\p{L}/u.test(t))return esc(t);
      if(!start&&t[0]!==t[0].toLowerCase())return esc(t);   /* nomes próprios no meio da frase não contam */
      const k=keyOf(t,m,lang);
      if(!k)return esc(t);
      rd.found[k]=m[k];
      const a=sk[k],learned=a&&a[0]>0;
      return '<button type="button" class="rw '+(learned?"k":"u")+'" data-k="'+esc(k)+'">'+esc(t)+"</button>";
    }).join("");
    return '<div class="rd-line"><p class="rd-s">'+parts+'</p><div class="rd-act">'+(lang===S.lang?speakBtn(seg.s):"")+'<button type="button" class="btn rd-tr" data-i="'+i+'" aria-pressed="'+!!rd.shown[i]+'">'+(rd.shown[i]?"Esconder tradução":"Ver tradução")+"</button></div>"+(rd.shown[i]?'<p class="rd-pt">'+esc(seg.pt)+"</p>":"")+"</div>";
  }
  function renderLeitura(){
    const b=BK[P.rd],m=vmap(P.rd);rd.found={};
    let h='<p class="ocount">'+esc(P.meta)+"</p>"+'<p class="note"><b>Contexto:</b> '+esc(rd.D.ctx)+"</p>";
    h+='<div class="rd">'+rd.D.segs.map((s,i)=>lineHtml(s,i,m,S.lang)).join("")+"</div>";
    const e=rd.sel&&m[rd.sel];
    h+='<div class="rd-def" aria-live="polite">'+(e?"<b>"+esc(full(e))+"</b> = "+esc(e.pt)+" <small>("+esc(e.c)+")</small>":(Object.keys(rd.found).length?"Toque numa palavra sublinhada para ver o significado. As que você já acertou nos exercícios aparecem em negrito e com cor.":"Neste trecho não aparece nenhuma palavra do vocabulário deste livro no app. Use a tradução frase a frase e a nota abaixo."))+"</div>";
    h+='<p class="note"><b>Para reparar:</b> '+hl(rd.D.gn)+"</p>";
    h+='<p class="note"><small>Trecho do livro «'+esc(b.name)+"». Tradução, contexto e nota: escritas por Claude, sem fonte conferida. As palavras sublinhadas são as do vocabulário do livro neste app.</small></p>";
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

  /* ---- Meus livros ---- */
  const cats=b=>b.chunks.map(c=>c.cat);
  const bookPages=b=>{
    const cs=cats(b);
    return lessonPath().filter(r=>(r.page.cat&&cs.indexOf(r.page.cat)>=0)||r.page.book===b.id||r.page.rd===b.id);
  };
  const isDoneId=p=>!!S.done[S.lang+":"+p.id];
  function renderBooks(){
    const bs=BOOKS.filter(b=>b.lang===S.lang),sk=S.sk[S.lang]||{};
    $("#books-lang").textContent=LNAME[S.lang];
    const fav=S.fav.filter(id=>phById[id]).length;
    $("#books-album").textContent="★ Álbum de citações"+(fav?" ("+fav+")":"");
    $("#books-list").innerHTML=bs.map(b=>{
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
        '<p class="bkc-s">Vocabulário '+cnt(kinds.words)+(kinds.fr.length?" · Frases "+cnt(kinds.fr):"")+(kinds.rd.length?" · Leitura "+cnt(kinds.rd):"")+"</p>"+
        (nx?'<button type="button" class="btn primary" data-bk-go="'+esc(nx.page.id)+'" data-bk-vol="'+nx.vol+'">'+(doneN?"Continuar este livro":"Começar este livro")+"</button>":'<p class="bkc-ok">Livro concluído ✓</p>')+
        '<div class="row bkc-r">'+(kinds.fr.length?'<button type="button" class="btn" data-bk-go="'+esc(kinds.fr[0].page.id)+'" data-bk-vol="3">Frases</button>':"")+(kinds.rd.length?'<button type="button" class="btn" data-bk-go="'+esc(kinds.rd[0].page.id)+'" data-bk-vol="3">Leitura</button>':"")+"</div></article>";
    }).join("");
  }
  window.renderBooks=renderBooks;
  $("#books-list").addEventListener("click",e=>{
    const b=e.target.closest("[data-bk-go]");if(!b)return;
    S.vol=+b.dataset.bkVol;S.fGame="all";S.fTheme="all";save();startPage(b.dataset.bkGo);
  });
  $("#books-album").addEventListener("click",()=>go("album"));
  $("#go-books").addEventListener("click",()=>go("books"));
  renderQod();
})();
