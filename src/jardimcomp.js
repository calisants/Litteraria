/* ===== Compartilhar o jardim (v1.74) =====
   Botão «Compartilhar meu jardim» (Meu jardim): link, imagem ou texto. O link leva DENTRO do endereço (?jardim=...) só: idioma, quantas plantas em cada estágio,
   total de palavras e um nome opcional que a pessoa digita. Nada vai a servidor. Quem abre o link vê o jardim (só leitura) e um convite para fazer o seu. */
(function(){
  const LN={fr:"francês",it:"italiano",en:"inglês"};
  const b64=s=>btoa(unescape(encodeURIComponent(s))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
  const unb=s=>{s=s.replace(/-/g,"+").replace(/_/g,"/");while(s.length%4)s+="=";return decodeURIComponent(escape(atob(s)));};
  const base=()=>location.origin+location.pathname.replace(/index\.html$/,"");
  const GK="mots-parole-gname";
  const getName=()=>{try{return localStorage.getItem(GK)||"";}catch(_){return "";}};
  const setName=v=>{try{localStorage.setItem(GK,v);}catch(_){}};
  const clean=n=>String(n||"").replace(/[<>&"'\u0000-\u001f]/g,"").trim().slice(0,24);
  function payload(name){const L=window.gdLast();return {v:1,l:S.lang,c:L.cnt.slice(),m:L.met,t:L.total,n:clean(name)};}
  const linkOf=name=>base()+"?jardim="+b64(JSON.stringify(payload(name)));
  function parse(str){
    try{
      const o=JSON.parse(unb(str));
      if(!o||o.v!==1||!LN[o.l]||!Array.isArray(o.c)||o.c.length!==4)return null;
      const c=o.c.map(x=>Math.max(0,Math.min(99999,Math.floor(+x)||0)));
      return {l:o.l,c:c,m:Math.max(0,Math.min(99999,Math.floor(+o.m)||0)),t:Math.max(0,Math.min(99999,Math.floor(+o.t)||0)),n:clean(o.n)};
    }catch(_){return null;}
  }
  window.__jardimParse=parse;window.__jardimLink=linkOf;
  const nm=(n,s)=>n+" "+(n===1?s[0]:s[1]);
  function summary(c){
    const p=[];
    if(c[3])p.push(nm(c[3],["fruto","frutos"]));if(c[2])p.push(nm(c[2],["flor","flores"]));if(c[1])p.push(nm(c[1],["semente","sementes"]));
    return p.join(", ");
  }
  const total=c=>c[0]+c[1]+c[2]+c[3];
  function shareText(name){
    const L=window.gdLast(),s=summary(L.cnt);
    return "Esse é o meu jardim de "+LN[S.lang]+" no Litteraria 🌱"+(s?" Já tenho "+s+".":"")+" Venha fazer o seu jardim estudando e lendo no app:";
  }
  /* ---- folha de compartilhar ---- */
  function openShare(){
    const L=window.gdLast();
    if(!total(L.cnt)){openSheet("Compartilhar meu jardim",'<p class="help">Seu jardim de '+LN[S.lang]+' ainda é só terra. Acerte algumas palavras e volte aqui para compartilhar.</p>',false);return;}
    const sky='<div class="gd-sky">'+window.gdSceneSvg(L.cnt)+"</div>";
    openSheet("Compartilhar meu jardim",sky+
      '<p class="help">Quem receber o link vê o seu jardim de '+LN[S.lang]+' (só os números: nada mais do seu progresso) e um convite para fazer o dele.</p>'+
      '<label class="help" for="jc-name">Seu nome ou apelido no jardim (opcional):</label><input id="jc-name" class="gd-in" type="text" maxlength="24" autocomplete="off" value="'+esc(getName())+'" style="margin-bottom:10px">'+
      '<div class="stack"><button type="button" class="btn wide primary" id="jc-share">Compartilhar</button><button type="button" class="btn wide" id="jc-copy">Copiar o link</button><button type="button" class="btn wide" id="jc-img">Salvar como imagem</button></div>'+
      '<p class="help" id="jc-fb" aria-live="polite"></p><p class="help"><small>O link leva só o idioma, as quantidades de plantas e o nome acima. Nada é enviado a servidor.</small></p>',false);
  }
  const nameVal=()=>{const i=document.getElementById("jc-name");const v=clean(i?i.value:"");setName(v);return v;};
  const fb=t=>{const e=document.getElementById("jc-fb");if(e)e.textContent=t;};
  /* ---- imagem ---- */
  function cardImage(name){
    return new Promise((res,rej)=>{
      const L=window.gdLast(),W=1080,H=1350,cs=getComputedStyle(document.documentElement);
      const bg=(cs.getPropertyValue("--bg")||"#fff8e2").trim(),ink=(cs.getPropertyValue("--ink")||"#222").trim(),acc=(cs.getPropertyValue("--accent")||"#1f3d7a").trim(),mut=(cs.getPropertyValue("--muted")||"#666").trim();
      let svg=window.gdSceneSvg(L.cnt).replace("<svg ",'<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="439" ');
      const img=new Image();
      img.onload=()=>{
        const c=document.createElement("canvas");c.width=W;c.height=H;const g=c.getContext("2d");
        g.fillStyle=bg;g.fillRect(0,0,W,H);
        g.fillStyle=ink;g.textAlign="center";g.font="700 64px Georgia,serif";
        g.fillText(name?"Jardim de "+LN[S.lang]+" de "+name:"Meu jardim de "+LN[S.lang],W/2,130);
        g.drawImage(img,0,190,1080,439);
        const items=[["🍎",L.cnt[3],"frutos"],["🌸",L.cnt[2],"flores"],["🌱",L.cnt[1],"sementes"],["○",L.cnt[0],"sombras"]];
        items.forEach((it,i)=>{const x=135+i*270;g.font="64px sans-serif";g.fillStyle=ink;g.fillText(it[0],x,760);g.font="700 76px Georgia,serif";g.fillText(String(it[1]),x,860);g.font="34px sans-serif";g.fillStyle=mut;g.fillText(it[2],x,910);});
        g.fillStyle=ink;g.font="38px sans-serif";g.fillText(L.met+" de "+L.total+" palavras de "+LN[S.lang]+" já estão no jardim",W/2,1020);
        g.fillStyle=acc;g.font="700 54px Georgia,serif";g.fillText("Faça o seu jardim no Litteraria",W/2,1170);
        g.fillStyle=mut;g.font="36px sans-serif";g.fillText(base().replace(/^https?:\/\//,"").replace(/\/$/,""),W/2,1230);
        c.toBlob(b=>b?res(b):rej(new Error("png")),"image/png");
      };
      img.onerror=()=>rej(new Error("img"));
      img.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg);
    });
  }
  function download(blob,fn){const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=fn;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1500);}
  /* ---- cliques ---- */
  document.addEventListener("click",async ev=>{
    const t=ev.target.closest&&ev.target.closest("#gd-share,#jc-share,#jc-copy,#jc-img,#jv-start,#jv-install");if(!t)return;
    if(t.id==="gd-share"){openShare();return;}
    if(t.id==="jv-start"){closeSheet();go("home");return;}
    if(t.id==="jv-install"){closeSheet();go("settings");const b=document.getElementById("open-install");if(b)setTimeout(()=>b.click(),200);return;}
    const name=nameVal(),url=linkOf(name),txt=shareText(name);
    if(t.id==="jc-share"){
      if(navigator.share&&!navigator.webdriver){try{await navigator.share({title:"Meu jardim no Litteraria",text:txt,url:url});}catch(e){if(e&&e.name!=="AbortError")fb("Não consegui abrir o compartilhamento. Use «Copiar o link».");}}
      else{try{await navigator.clipboard.writeText(txt+" "+url);fb("Texto e link copiados. É só colar numa conversa.");}catch(_){fb("Copie o link: "+url);}}
      return;
    }
    if(t.id==="jc-copy"){try{await navigator.clipboard.writeText(url);fb("Link copiado.");}catch(_){fb("Copie o link: "+url);}return;}
    if(t.id==="jc-img"){
      try{
        const blob=await cardImage(name),f=new File([blob],"meu-jardim-litteraria.png",{type:"image/png"});
        if(navigator.canShare&&navigator.canShare({files:[f]})&&!navigator.webdriver){try{await navigator.share({files:[f],title:"Meu jardim no Litteraria",text:txt+" "+url});}catch(e){if(e&&e.name!=="AbortError")download(blob,f.name);}}
        else{download(blob,f.name);fb("Imagem salva.");}
      }catch(_){fb("Não consegui criar a imagem neste aparelho.");}
      return;
    }
  });
  /* ---- quem recebe o link ---- */
  function viewGarden(o){
    const gf=o.c[2]+o.c[3],who=o.n?"de "+o.n:"de alguém";
    const tile=(lv,n,lab)=>'<div class="gd-tile gd'+lv+'">'+window.gdPlantSvg(lv,330,false)+"<b>"+n+"</b><span>"+lab+"</span></div>";
    openSheet("Jardim "+who,
      '<div class="gd-sky">'+window.gdSceneSvg(o.c,gf)+"</div>"+
      '<div class="gd-sum">'+tile(3,o.c[3],o.c[3]===1?"fruto":"frutos")+tile(2,o.c[2],o.c[2]===1?"flor":"flores")+tile(1,o.c[1],o.c[1]===1?"semente":"sementes")+tile(0,o.c[0],o.c[0]===1?"sombra":"sombras")+"</div>"+
      '<p class="note"><b>Este é um jardim de '+LN[o.l]+' no Litteraria.</b> Cada palavra que a pessoa acerta nas lições vira uma planta: sombra, semente, flor e fruto. '+(o.m?o.m+" palavras já chegaram ao jardim.":"")+"</p>"+
      '<p class="help">Quer fazer o seu? Estude e leia no app e o seu jardim vai crescendo. É grátis e funciona no celular.</p>'+
      '<div class="stack"><button type="button" class="btn wide primary" id="jv-start">Quero fazer o meu jardim</button><button type="button" class="btn wide" id="jv-install">Como instalar o app</button></div>',false);
  }
  function boot(){
    let q;try{q=new URLSearchParams(location.search).get("jardim");}catch(_){return;}
    if(!q)return;
    try{const u=new URL(location.href);u.searchParams.delete("jardim");history.replaceState(null,"",u.pathname+u.search+u.hash);}catch(_){}
    const o=parse(q);if(!o)return;
    setTimeout(()=>viewGarden(o),navigator.webdriver?200:1600);
  }
  window.__jardimView=viewGarden;
  boot();
})();
