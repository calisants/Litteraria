/* ===== Jogos de literatura (v1.39) =====
   Ordene o trecho · Qual o sentido? · Ouça e escolha (com áudio) + caça-palavras e cruzadas com as palavras de cada livro.
   (Em 23/10/2026 saíram «Quem escreveu?» e «Ordem dos capítulos»: não treinavam o idioma.) Páginas no Volume 3 · Jogos, no idioma do livro. */
(function(){
  const cnt=t=>VOLUME.pages.filter(p=>p.type===t).length;
  VOLUME.types=VOLUME.types.concat([
    ["trecho","Ordene o trecho do livro","Ordene o trecho"],
    ["regra","O que a frase quer dizer?","Qual o sentido?"],
    ["ouvir","Ouça a frase e escolha o sentido","Ouça e escolha (com áudio)"]]);
  GAMENAME.trecho="Ordene o trecho";GAMENAME.regra="Qual o sentido?";GAMENAME.ouvir="Ouça e escolha (com áudio)";
  ["trecho","regra","ouvir"].forEach(t=>{STAGES[t]="#gstage";DOCKS[t]="none";});
  GAMEFN.regra=startQuiz2;GAMEFN.ouvir=startQuiz2;GAMEFN.trecho=startOrd;

  /* ---- páginas ---- */
  ["fr","it","en"].forEach(lang=>{
    const bs=BOOKS.filter(b=>b.lang===lang);
    if(bs.length<3)return;
    const L=window.phLangList(lang),PER=6,n=Math.max(1,Math.ceil(L.length/PER));
    for(let i=0;i<n&&L.length>=4;i++){
      const part=L.slice(Math.round(i*L.length/n),Math.round((i+1)*L.length/n));
      VOLUME.pages.push({id:"regra-"+lang+"-"+(i+1),type:"regra",n:cnt("regra")+1,langs:[lang],themes:[],sub:"Frases dos livros",meta:"Frases dos livros · parte "+(i+1)+" de "+n,qs:part.map(p=>p.id)});
      VOLUME.pages.push({id:"ouvir-"+lang+"-"+(i+1),type:"ouvir",n:cnt("ouvir")+1,langs:[lang],themes:[],sub:"Frases dos livros",meta:"Frases dos livros · parte "+(i+1)+" de "+n,qs:part.map(p=>p.id).reverse()});
    }
  });
  BOOKS.forEach(b=>{
    const R=BOOKREAD[b.id]||[];
    R.forEach((r,k)=>{if(r.segs.length>=2)VOLUME.pages.push({id:"trecho-"+b.id+"-"+(k+1),type:"trecho",n:cnt("trecho")+1,bk:b.id,k:k,langs:[b.lang],themes:["livro-"+b.id],sub:b.name,meta:"Trecho de «"+b.name+"» · "+(k+1)+" de "+R.length});});
    b.chunks.forEach(c=>["search","cross"].forEach(t=>VOLUME.pages.push({id:t+"-"+c.cat+"-easy",type:t,level:"easy",cat:c.cat,n:cnt(t)+1,langs:[b.lang],themes:["livro-"+b.id,c.cat],sub:c.name,meta:c.name+" · Fácil"})));
  });

  const litRec=ok=>{bump();if(typeof gamAns==="function")gamAns(ok);};
  const phMap={};["fr","it","en"].forEach(l=>window.phLangList(l).forEach(p=>{phMap[p.id]=p;}));
  const mask=t=>t.replace(/«[^»]*»/g,"«…»");

  /* ---- Qual o sentido? / Ouça e escolha ---- */
  let st=null;
  function startQuiz2(){
    seedNow();fitFn=null;
    let qs=[];
    {
      const all=window.phLangList(S.lang);
      shuffle(P.qs.map(id=>phMap[id]).filter(Boolean)).forEach(p=>{
        /* interpretações: a tradução da frase e a de 3 outras frases do mesmo idioma (pedido dela, 23/10/2026) */
        const pool=all.filter(o=>o.id!==p.id&&o.pt&&o.pt!==p.pt);
        const wrong=[],seen=new Set([p.pt]);
        shuffle(pool).forEach(o=>{if(wrong.length<3&&!seen.has(o.pt)){seen.add(o.pt);wrong.push(o);}});
        if(wrong.length<3)return;
        const opts=shuffle([p].concat(wrong)).map(o=>({id:o.id,t:o.pt}));
        qs.push({p:p,opts:opts,ans:p.id});
      });
    }
    st={kind:P.type,qs:qs,i:0,score:0,sel:null};
    renderQuiz2();
  }
  function renderQuiz2(){
    const q=st.qs[st.i],ans=st.sel!==null,reg=st.kind==="regra"||st.kind==="ouvir",ouv=st.kind==="ouvir";
    let h='<p class="ocount">'+(st.i+1)+" de "+st.qs.length+" · acertos: "+st.score+"</p>";
    if(reg){
      if(ouv&&!ans){
        h+='<div class="row" style="justify-content:center"><button type="button" class="btn primary" id="ouv-play">🔊 Ouvir a frase</button></div>';
        h+=st.show?'<p class="qz-s">'+esc(q.p.s)+"</p>":'<div class="row" style="justify-content:center"><button type="button" class="btn" id="ouv-show">Mostrar a frase (sem áudio)</button></div>';
        h+='<p class="help" style="text-align:center">Ouça a frase de um livro e escolha o que ela quer dizer.</p>';
      }else h+='<p class="qz-s">'+esc(q.p.s)+"</p>"+'<p class="help" style="text-align:center">Frase do livro «'+esc(BOOKS.find(b=>b.id===q.p.book).name)+"». O que ela quer dizer?</p>";
      h+='<div class="lopts">'+q.opts.map((o,i)=>'<button type="button" class="lopt long'+(ans?(o.id===q.ans?" right":(st.sel===i?" wrong":"")):"")+'" data-o="'+i+'"'+(ans?" disabled":"")+">"+esc(o.t)+"</button>").join("")+"</div>";
      if(ans){
        const ok=q.opts[st.sel].id===q.ans;
        h+='<p class="note"><b>'+(ok?"Certo!":"O sentido certo era: "+esc(q.p.pt))+"</b><br>Estrutura da frase: "+hl(q.p.note)+'</p><div class="heard">'+speakBtn(q.p.s)+"<span>"+esc(q.p.s)+'</span></div><p class="help">Tradução e nota: escritas por Claude, sem fonte conferida.</p>';
      }
    }
    if(ans)h+='<div class="row"><button type="button" class="btn primary" id="lit-next">'+(st.i===st.qs.length-1?"Ver resultado":"Próxima")+"</button></div>";
    $("#gstage").innerHTML=h;
  }
  $("#gstage").addEventListener("click",ev=>{
    if(!P||!st||(P.type!=="regra"&&P.type!=="ouvir"))return;
    const o=ev.target.closest(".lopt");
    if(o&&st.sel===null){
      st.sel=+o.dataset.o;const q=st.qs[st.i];
      const ok=q.opts[st.sel].id===q.ans;
      if(ok)st.score++;litRec(ok);sfx(ok?"ok":"bad");renderQuiz2();return;
    }
    if(ev.target.closest("#ouv-play")){const q=st.qs[st.i];if(q&&q.p)speak(q.p.s);return;}
    if(ev.target.closest("#ouv-show")){st.show=true;renderQuiz2();return;}
    if(ev.target.closest("#lit-next")){
      if(st.i<st.qs.length-1){st.i++;st.sel=null;st.show=false;renderQuiz2();return;}
      markDone();sfx("done");
      const rows=st.qs.map(q=>'<div class="srow"><span class="pt"><b>'+esc(q.p.s)+"</b><br><small>"+esc(q.p.pt)+"</small></span>"+speakBtn(q.p.s)+"</div>").join("");
      openSheet("Página concluída: "+st.score+" de "+st.qs.length+" certas",rows,true);
    }
  });
  RESUME.reg(["regra","ouvir"],{
    get(){return st&&st.kind===P.type&&st.i<st.qs.length?{qs:st.qs,i:st.i,score:st.score,sel:st.sel}:null;},
    set(s){
      if(!s.qs||!s.qs.length)return;
      st.qs=s.qs;st.i=Math.max(0,Math.min(+s.i||0,s.qs.length-1));st.score=Math.max(0,+s.score||0);
      st.sel=Number.isInteger(s.sel)?s.sel:null;renderQuiz2();
    }
  });

  /* ---- Ordene o trecho ---- */
  let od2=null;
  function startOrd(){
    seedNow();fitFn=null;
    let items=[],intro="",title="";
    const r=BOOKREAD[P.bk][P.k];
    items=r.segs.map((g,i)=>({id:i,t:g.s,pt:g.pt}));
    intro="Estas frases estão fora de ordem. Toque nelas na ordem em que aparecem no livro."+(r.ctx?" Contexto: "+r.ctx:"");
    title="Trecho na ordem certa";
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
    if(!P||!od2||P.type!=="trecho"||od2.done)return;
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
  RESUME.reg(["trecho"],{
    get(){return od2&&!od2.done?{bank:od2.bank,put:od2.put,hint:od2.hint,tries:od2.tries}:null;},
    set(s){
      const ids=od2.items.map(x=>x.id).sort((a,b)=>a-b).join();
      if(!s.bank||s.bank.slice().sort((a,b)=>a-b).join()!==ids)return;
      od2.bank=s.bank;od2.put=(s.put||[]).filter(id=>s.bank.indexOf(id)>=0);od2.hint=!!s.hint;od2.tries=+s.tries||0;renderOrd();
    }
  });
})();
