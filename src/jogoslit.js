/* ===== Jogos de literatura (v1.39) =====
   Quem escreveu? · Ordene o trecho · Ordem dos capítulos · Qual regra explica a frase? + caça-palavras e cruzadas com as palavras de cada livro.
   Nenhum mostra tradução antes da resposta (só com «Dica»). Sem áudio. Páginas no Volume 3 · Jogos, no idioma do livro.
   Autores: conferidos em buscas na web em 21/10/2026 (páginas do Projeto Gutenberg, de editoras e de enciclopédias); só o nome, sem texto copiado. */
(function(){
  const AUT={pp:"Antoine de Saint-Exupéry",verne:"Jules Verne",pinocchio:"Carlo Collodi",alice:"Lewis Carroll",peter:"Beatrix Potter",wind:"Kenneth Grahame",sherlock:"Arthur Conan Doyle",frank:"Mary Shelley",musq:"Alexandre Dumas",principe:"Nicolau Maquiavel",dante:"Dante Alighieri",perrault:"Charles Perrault",grimm:"Irmãos Grimm",racconti:"Carlo Collodi"};
  window.LITAUT=AUT;
  const cnt=t=>VOLUME.pages.filter(p=>p.type===t).length;
  VOLUME.types=VOLUME.types.concat([
    ["autor","Quem escreveu o livro?","Quem escreveu?"],
    ["trecho","Ordene o trecho do livro","Ordene o trecho"],
    ["capitulos","Ordem dos capítulos","Capítulos"],
    ["regra","Qual regra explica a frase?","Qual regra?"]]);
  GAMENAME.autor="Quem escreveu?";GAMENAME.trecho="Ordene o trecho";GAMENAME.capitulos="Capítulos";GAMENAME.regra="Qual regra?";
  ["autor","trecho","capitulos","regra"].forEach(t=>{STAGES[t]="#gstage";DOCKS[t]="none";});
  GAMEFN.autor=startQuiz2;GAMEFN.regra=startQuiz2;GAMEFN.trecho=startOrd;GAMEFN.capitulos=startOrd;

  /* ---- páginas ---- */
  ["fr","it","en"].forEach(lang=>{
    const bs=BOOKS.filter(b=>b.lang===lang);
    if(bs.length<3)return;
    [["b2a","Livro → autor"],["a2b","Autor → livro"]].forEach(([kind,lab])=>VOLUME.pages.push({id:"autor-"+lang+"-"+kind,type:"autor",n:cnt("autor")+1,kind:kind,langs:[lang],themes:[],sub:"Autores dos livros",meta:lab}));
    const L=window.phLangList(lang),PER=6,n=Math.max(1,Math.ceil(L.length/PER));
    for(let i=0;i<n&&L.length>=4;i++){
      const part=L.slice(Math.round(i*L.length/n),Math.round((i+1)*L.length/n));
      VOLUME.pages.push({id:"regra-"+lang+"-"+(i+1),type:"regra",n:cnt("regra")+1,langs:[lang],themes:[],sub:"Frases dos livros",meta:"Frases dos livros · parte "+(i+1)+" de "+n,qs:part.map(p=>p.id)});
    }
  });
  BOOKS.forEach(b=>{
    const R=BOOKREAD[b.id]||[];
    R.forEach((r,k)=>{if(r.segs.length>=2)VOLUME.pages.push({id:"trecho-"+b.id+"-"+(k+1),type:"trecho",n:cnt("trecho")+1,bk:b.id,k:k,langs:[b.lang],themes:["livro-"+b.id],sub:b.name,meta:"Trecho de «"+b.name+"» · "+(k+1)+" de "+R.length});});
    if(b.id==="alice"||b.id==="principe")[1,2].forEach(j=>VOLUME.pages.push({id:"capitulos-"+b.id+"-"+j,type:"capitulos",n:cnt("capitulos")+1,bk:b.id,j:j,langs:[b.lang],themes:["livro-"+b.id],sub:b.name,meta:"«"+b.name+"» · sequência "+j+" de 2"}));
    b.chunks.forEach(c=>["search","cross"].forEach(t=>VOLUME.pages.push({id:t+"-"+c.cat+"-easy",type:t,level:"easy",cat:c.cat,n:cnt(t)+1,langs:[b.lang],themes:["livro-"+b.id,c.cat],sub:c.name,meta:c.name+" · Fácil"})));
  });

  const litRec=ok=>{bump();if(typeof gamAns==="function")gamAns(ok);};
  const phMap={};["fr","it","en"].forEach(l=>window.phLangList(l).forEach(p=>{phMap[p.id]=p;}));
  const mask=t=>t.replace(/«[^»]*»/g,"«…»");

  /* ---- Quem escreveu? / Qual regra explica a frase? ---- */
  let st=null;
  function startQuiz2(){
    seedNow();fitFn=null;
    let qs=[];
    if(P.type==="autor"){
      const bs=BOOKS.filter(b=>b.lang===S.lang),allA=[...new Set(BOOKS.map(b=>AUT[b.id]))],seen=new Set();
      shuffle(bs).forEach(b=>{
        if(P.kind==="a2b"){
          if(seen.has(AUT[b.id]))return;seen.add(AUT[b.id]);
          const wrong=shuffle(BOOKS.filter(x=>AUT[x.id]!==AUT[b.id])).slice(0,3).map(x=>x.name);
          qs.push({q:"Qual destes livros foi escrito por "+AUT[b.id]+"?",ans:b.name,opts:shuffle([b.name].concat(wrong)),bk:b.id});
        }else{
          const wrong=shuffle(allA.filter(a=>a!==AUT[b.id])).slice(0,3);
          qs.push({q:"Quem escreveu «"+b.name+"»?",ans:AUT[b.id],opts:shuffle([AUT[b.id]].concat(wrong)),bk:b.id});
        }
      });
    }else{
      const all=window.phLangList(S.lang);
      shuffle(P.qs.map(id=>phMap[id]).filter(Boolean)).forEach(p=>{
        const pool=all.filter(o=>o.id!==p.id&&o.note.slice(0,28)!==p.note.slice(0,28));
        const wrong=[],seen=new Set([p.note.slice(0,28)]);
        shuffle(pool).forEach(o=>{const k=o.note.slice(0,28);if(wrong.length<3&&!seen.has(k)){seen.add(k);wrong.push(o);}});
        if(wrong.length<3)return;
        const opts=shuffle([p].concat(wrong)).map(o=>({id:o.id,t:mask(o.note)}));
        qs.push({p:p,opts:opts,ans:p.id});
      });
    }
    st={kind:P.type,qs:qs,i:0,score:0,sel:null};
    renderQuiz2();
  }
  function renderQuiz2(){
    const q=st.qs[st.i],ans=st.sel!==null,reg=st.kind==="regra";
    let h='<p class="ocount">'+(st.i+1)+" de "+st.qs.length+" · acertos: "+st.score+"</p>";
    if(reg){
      h+='<p class="qz-s">'+esc(q.p.s)+"</p>"+'<p class="help" style="text-align:center">Frase do livro «'+esc(BOOKS.find(b=>b.id===q.p.book).name)+"». Qual explicação combina com a frase? As palavras citadas foram escondidas.</p>";
      h+='<div class="lopts">'+q.opts.map((o,i)=>'<button type="button" class="lopt long'+(ans?(o.id===q.ans?" right":(st.sel===i?" wrong":"")):"")+'" data-o="'+i+'"'+(ans?" disabled":"")+">"+hl(o.t)+"</button>").join("")+"</div>";
      if(ans){
        const ok=q.opts[st.sel].id===q.ans;
        h+='<p class="note"><b>'+(ok?"Certo!":"A explicação certa era:")+"</b> "+hl(q.p.note)+'</p><div class="heard">'+speakBtn(q.p.s)+"<span>"+esc(q.p.pt)+"</span></div>";
      }
    }else{
      h+='<p class="prompt">'+esc(q.q)+"</p>";
      h+='<div class="lopts">'+q.opts.map((o,i)=>'<button type="button" class="lopt'+(ans?(o===q.ans?" right":(st.sel===i?" wrong":"")):"")+'" data-o="'+i+'"'+(ans?" disabled":"")+">"+esc(o)+"</button>").join("")+"</div>";
      if(ans){
        const b=BOOKS.find(x=>x.id===q.bk),ok=q.opts[st.sel]===q.ans;
        h+='<p class="note"><b>'+(ok?"Certo!":"Não foi essa.")+"</b> «"+esc(b.name)+"» é de "+esc(AUT[b.id])+".</p>";
      }
    }
    if(ans)h+='<div class="row"><button type="button" class="btn primary" id="lit-next">'+(st.i===st.qs.length-1?"Ver resultado":"Próxima")+"</button></div>";
    $("#gstage").innerHTML=h;
  }
  $("#gstage").addEventListener("click",ev=>{
    if(!P||!st||(P.type!=="autor"&&P.type!=="regra"))return;
    const o=ev.target.closest(".lopt");
    if(o&&st.sel===null){
      st.sel=+o.dataset.o;const q=st.qs[st.i];
      const ok=st.kind==="regra"?q.opts[st.sel].id===q.ans:q.opts[st.sel]===q.ans;
      if(ok)st.score++;litRec(ok);sfx(ok?"ok":"bad");renderQuiz2();return;
    }
    if(ev.target.closest("#lit-next")){
      if(st.i<st.qs.length-1){st.i++;st.sel=null;renderQuiz2();return;}
      markDone();sfx("done");
      const rows=st.kind==="autor"?st.qs.map(q=>{const b=BOOKS.find(x=>x.id===q.bk);return '<div class="srow"><span class="w">'+esc(b.name)+'</span><span class="pt">'+esc(AUT[b.id])+"</span></div>";}).join("")+'<p class="help">Autores conferidos em buscas na web em 21/10/2026 (Projeto Gutenberg, editoras e enciclopédias).</p>'
        :st.qs.map(q=>'<div class="srow"><span class="pt"><b>'+esc(q.p.s)+"</b><br><small>"+esc(q.p.pt)+"</small></span>"+speakBtn(q.p.s)+"</div>").join("");
      openSheet("Página concluída: "+st.score+" de "+st.qs.length+" certas",rows,true);
    }
  });
  RESUME.reg(["autor","regra"],{
    get(){return st&&st.kind===P.type&&st.i<st.qs.length?{qs:st.qs,i:st.i,score:st.score,sel:st.sel}:null;},
    set(s){
      if(!s.qs||!s.qs.length)return;
      st.qs=s.qs;st.i=Math.max(0,Math.min(+s.i||0,s.qs.length-1));st.score=Math.max(0,+s.score||0);
      st.sel=Number.isInteger(s.sel)?s.sel:null;renderQuiz2();
    }
  });

  /* ---- Ordene o trecho / Ordem dos capítulos (mesmo motor) ---- */
  let od2=null;
  const cleanT=t=>t.replace(/^(CHAPTER|Chapter|Capítulo|Cap\.)\s+[IVXLC\d]+\.?\s*[·.\-–—]?\s*/,"").trim();
  function startOrd(){
    seedNow();fitFn=null;
    let items=[],intro="",title="",foot=null;
    if(P.type==="trecho"){
      const r=BOOKREAD[P.bk][P.k];
      items=r.segs.map((g,i)=>({id:i,t:g.s,pt:g.pt}));
      intro="Estas frases estão fora de ordem. Toque nelas na ordem em que aparecem no livro."+(r.ctx?" Contexto: "+r.ctx:"");
      title="Trecho na ordem certa";
    }else{
      const info=BOOKTXT_INFO[P.bk].chs.filter(c=>cleanT(c.t)!==c.t);
      const L=info.length,N=5,pick=[];
      for(let i=0;i<N;i++){const ix=P.j===1?Math.round(i*(L-1)/(N-1)):Math.floor((i+.5)*L/N);if(pick.indexOf(ix)<0)pick.push(ix);}
      items=pick.map(ix=>({id:info[ix].n,t:cleanT(info[ix].t),pt:cleanT(info[ix].tp)}));
      intro="Estes são capítulos de «"+BOOKS.find(b=>b.id===P.bk).name+"». Toque neles na ordem em que aparecem no livro. Os números foram escondidos.";
      title="Capítulos na ordem certa";
    }
    const ord=items.slice().sort((a,b)=>a.id-b.id).map(x=>x.id);
    let bank=shuffle(items.map(x=>x.id));
    if(bank.length>1&&bank.every((v,k)=>v===ord[k]))bank.reverse();
    od2={items:items,ord:ord,bank:bank,put:[],hint:false,tries:0,done:false,intro:intro,title:title,msg:""};
    renderOrd();
  }
  function renderOrd(){
    const o=od2,by={};o.items.forEach(x=>{by[x.id]=x;});
    const item=(id,cls,attr)=>'<button type="button" class="blk seg'+cls+'" '+attr+'="'+id+'">'+esc(by[id].t)+(o.hint?"<small>"+esc(by[id].pt)+"</small>":"")+"</button>";
    const right=o.put.map((id,k)=>o.ord[k]===id);
    let h='<p class="ocount">'+o.put.length+" de "+o.items.length+" no lugar</p><p class=\"help\">"+esc(o.intro)+"</p>";
    h+='<ol class="ord-put">'+o.put.map((id,k)=>"<li>"+item(id,o.msg&&right[k]?" okp":"","data-un")+"</li>").join("")+"</ol>";
    h+='<div class="ord-bank">'+o.bank.filter(id=>o.put.indexOf(id)<0).map(id=>item(id,"","data-w")).join("")+"</div>";
    h+='<p class="status'+(o.msg.indexOf("Certo")===0?" ok":o.msg?" bad":"")+'" aria-live="polite">'+esc(o.msg)+"</p>";
    h+='<div class="row"><button type="button" class="btn primary" id="ord-ok"'+(o.done||o.put.length!==o.items.length?" disabled":"")+'>Conferir</button><button type="button" class="btn" id="ord-clear"'+(o.done||!o.put.length?" disabled":"")+'>Limpar</button><button type="button" class="btn" id="ord-hint"'+(o.hint?" disabled":"")+">Dica: ver a tradução</button></div>";
    $("#gstage").innerHTML=h;
  }
  $("#gstage").addEventListener("click",ev=>{
    if(!P||!od2||(P.type!=="trecho"&&P.type!=="capitulos")||od2.done)return;
    const o=od2,w=ev.target.closest("[data-w]"),u=ev.target.closest("[data-un]");
    if(w){o.put.push(+w.dataset.w);o.msg="";renderOrd();return;}
    if(u){const id=+u.dataset.un;o.put=o.put.filter(x=>x!==id);o.msg="";renderOrd();return;}
    if(ev.target.closest("#ord-clear")){o.put=[];o.msg="";renderOrd();return;}
    if(ev.target.closest("#ord-hint")){o.hint=true;renderOrd();return;}
    if(ev.target.closest("#ord-ok")){
      const n=o.put.filter((id,k)=>o.ord[k]===id).length;
      if(n===o.items.length){
        if(!o.tries&&!o.hint)litRec(true);
        o.done=true;o.msg="Certo! Tudo na ordem.";markDone();sfx("done");renderOrd();
        const by={};o.items.forEach(x=>{by[x.id]=x;});
        openSheet(o.title,o.ord.map((id,k)=>'<div class="srow"><span class="pt"><b>'+(k+1)+". "+esc(by[id].t)+"</b><br><small>"+esc(by[id].pt)+"</small></span></div>").join(""),true);
      }else{
        if(!o.tries)litRec(false);
        o.tries++;o.msg=n+" de "+o.items.length+" no lugar certo (marcados). Troque as outras.";sfx("bad");renderOrd();
      }
    }
  });
  RESUME.reg(["trecho","capitulos"],{
    get(){return od2&&!od2.done?{bank:od2.bank,put:od2.put,hint:od2.hint,tries:od2.tries}:null;},
    set(s){
      const ids=od2.items.map(x=>x.id).sort((a,b)=>a-b).join();
      if(!s.bank||s.bank.slice().sort((a,b)=>a-b).join()!==ids)return;
      od2.bank=s.bank;od2.put=(s.put||[]).filter(id=>s.bank.indexOf(id)>=0);od2.hint=!!s.hint;od2.tries=+s.tries||0;renderOrd();
    }
  });
})();
