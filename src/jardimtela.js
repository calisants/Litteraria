/* ===== Meu jardim (v1.68, pedido dela em 25/10/2026): aba própria onde cada palavra vira uma planta.
   Sombra (errou/ainda não acertou) → Semente → Flor → Fruto, em canteiros por tema. Só aparecem as palavras que ela já encontrou
   (têm registro em S.sk ou S.gd); o jardim vai enchendo conforme ela aprende. Estágios e regras: jardim.js (limiares: julgamento de Claude, sem fonte).
   Desenhos das plantas: SVG originais de Claude. Nada é gravado aqui: o jardim é calculado de S.gd, S.sk e S.rvv. */
(function(){
  const ST=["Sombra","Semente","Flor","Fruto"];
  const bits=n=>{let c=0;while(n){c+=n&1;n>>=1;}return c;};
  const dn=()=>{const d=new Date();return Math.floor((d.getTime()-d.getTimezoneOffset()*6e4)/864e5);};
  /* estágio sem mexer no estado (igual a ensure() de jardim.js, só leitura) */
  function info(e){
    const lang=S.lang,w=e.w.toLowerCase(),key=lang+":"+w.slice(0,40),g=S.gd&&S.gd[key];
    const sk=(S.sk[lang]||{})[w];
    if(g)return {lv:g[0],wilt:!!g[4],days:g[3]||0,forms:bits(g[2]||0),last:g[1]||0,met:true};
    if(!sk)return null;
    const a=sk[0]||0,r=S.rvv[lang+":v|"+w],deg=r?r[1]:-1;
    return {lv:deg>=4?3:deg>=2?2:a>=1?1:0,wilt:false,days:a>=1?1:0,forms:0,last:0,met:true};
  }
  /* desenho da planta: matiz muda por canteiro; murcha = inclinada, apagada e com uma gota */
  function plant(lv,hue,wilt,uid){
    const soil='<ellipse cx="24" cy="51" rx="15" ry="4.5" fill="hsl(28 32% 40%)"/><ellipse cx="24" cy="49.5" rx="11" ry="3" fill="hsl(28 30% 33%)"/>';
    const leaf=(x,y,r)=>'<ellipse cx="'+x+'" cy="'+y+'" rx="5" ry="2.4" fill="hsl(125 40% 42%)" transform="rotate('+r+' '+x+' '+y+')"/>';
    const petals=(cx,cy,R,r,fill)=>{let s="";for(let i=0;i<6;i++){const a=i*Math.PI/3;s+='<circle cx="'+(cx+R*Math.cos(a)).toFixed(1)+'" cy="'+(cy+R*Math.sin(a)).toFixed(1)+'" r="'+r+'" fill="'+fill+'"/>';}return s;};
    let body="";
    if(lv===0)body='<path d="M24 49 C24 44 24 41 24 38" stroke="hsl(0 0% 55%)" stroke-width="1.6" stroke-dasharray="2.5 2.5" fill="none" stroke-linecap="round"/><circle cx="24" cy="35" r="4" fill="none" stroke="hsl(0 0% 55%)" stroke-width="1.6" stroke-dasharray="2.5 2.5"/>';
    else if(lv===1)body='<ellipse cx="24" cy="47.5" rx="3.6" ry="2.3" fill="hsl(32 55% 35%)"/><path d="M24 46 C24 42 24 40 24 37" stroke="hsl(125 40% 38%)" stroke-width="2" fill="none" stroke-linecap="round"/>'+leaf(20,38,-25)+leaf(28,37,25);
    else if(lv===2)body='<path d="M24 49 C24 40 24 32 24 25" stroke="hsl(125 40% 38%)" stroke-width="2.4" fill="none" stroke-linecap="round"/>'+leaf(19,40,-30)+leaf(29,37,30)+petals(24,21,6.5,5,"hsl("+hue+" 78% 72%)")+'<circle cx="24" cy="21" r="4.4" fill="hsl(46 90% 58%)"/>';
    else body='<path d="M24 49 C24 38 24 28 24 19" stroke="hsl(125 40% 38%)" stroke-width="2.6" fill="none" stroke-linecap="round"/>'+leaf(18,41,-30)+leaf(30,37,30)+petals(24,15,7.5,5.6,"hsl("+hue+" 80% 70%)")+'<circle cx="24" cy="15" r="4.8" fill="hsl(46 92% 56%)"/><circle cx="14.5" cy="33" r="3.6" fill="hsl('+((hue+330)%360)+' 70% 50%)"/><circle cx="33.5" cy="30" r="3.6" fill="hsl('+((hue+330)%360)+' 70% 50%)"/><circle cx="19" cy="25" r="3" fill="hsl('+((hue+330)%360)+' 70% 52%)"/><path d="M40 8l1.2 3 3 1.2-3 1.2L40 16.4l-1.2-3-3-1.2 3-1.2z" fill="hsl(46 95% 62%)"/>';
    const drop=wilt?'<path d="M40 22c-3 4-4.2 6-4.2 8a4.2 4.2 0 008.4 0c0-2-1.2-4-4.2-8z" fill="hsl(205 80% 58%)"/>':"";
    const tilt=wilt?' transform="rotate(14 24 50)" opacity=".72"':"";
    return '<svg viewBox="0 0 48 56" class="gd-svg gd'+lv+(wilt?" wilted":"")+'" aria-hidden="true" focusable="false">'+soil+"<g"+tilt+">"+body+"</g>"+drop+"</svg>";
  }
  window.gdPlantSvg=plant;
  /* Visitantes do jardim: chegam conforme o número de flores e frutos (limiares: ideia de Claude, sem fonte). Bichinhos genéricos, desenhados em SVG. */
  const VIS=[
    {n:3,nome:"uma borboleta",svg:'<g class="gd-fly"><path d="M56 22c-6-8-12-4-9 2 2 4 7 3 9-2zM56 22c6-8 12-4 9 2-2 4-7 3-9-2z" fill="hsl(285 65% 70%)"/><rect x="55.3" y="18" width="1.4" height="9" rx=".7" fill="hsl(25 30% 25%)"/></g>'},
    {n:10,nome:"uma abelha",svg:'<g class="gd-fly gd-fly2"><ellipse cx="150" cy="32" rx="6" ry="4.2" fill="hsl(46 95% 58%)"/><path d="M147 28v8M151 28v8" stroke="hsl(25 30% 20%)" stroke-width="1.6"/><ellipse cx="148" cy="27" rx="3.6" ry="2.2" fill="hsl(200 60% 88%)" opacity=".85"/></g>'},
    {n:20,nome:"outra borboleta",svg:'<g class="gd-fly gd-fly3"><path d="M206 16c-6-8-12-4-9 2 2 4 7 3 9-2zM206 16c6-8 12-4 9 2-2 4-7 3-9-2z" fill="hsl(18 85% 64%)"/><rect x="205.3" y="12" width="1.4" height="9" rx=".7" fill="hsl(25 30% 25%)"/></g>'},
    {n:40,nome:"um passarinho",svg:'<g class="gd-fly gd-fly2"><ellipse cx="112" cy="14" rx="7" ry="4.6" fill="hsl(205 70% 62%)"/><circle cx="118.5" cy="11.5" r="3" fill="hsl(205 70% 62%)"/><path d="M121 11.5l4 1.2-4 1z" fill="hsl(35 90% 55%)"/><circle cx="119.3" cy="11" r=".8" fill="#222"/><path d="M106 14l-6-2 1 4z" fill="hsl(205 60% 50%)"/></g>'},
    {n:80,nome:"uma joaninha",svg:'<g><ellipse cx="34" cy="60" rx="5" ry="3.8" fill="hsl(5 80% 50%)"/><path d="M34 56.4v7.2" stroke="#222" stroke-width="1"/><circle cx="32" cy="59" r=".9" fill="#222"/><circle cx="36" cy="61" r=".9" fill="#222"/><circle cx="38.6" cy="60" r="2" fill="#222"/></g>'}
  ];
  function groups(){
    const lang=S.lang,out=[],seen={};
    Object.keys(VOCAB[lang]||{}).forEach(cat=>{
      const bc=BOOKCAT[cat],key=bc?"livro-"+bc.book:cat;
      let g=seen[key];
      if(!g){g=seen[key]={key:key,name:bc?bc.name:catName(cat),book:!!bc,items:[],total:0};out.push(g);}
      VOCAB[lang][cat].forEach(e=>{g.total++;const i=info(e);if(i)g.items.push({e:e,i:i});});
    });
    out.forEach((g,k)=>{g.hue=(k*47+330)%360;g.items.sort((a,b)=>b.i.lv-a.i.lv);});
    return out;
  }
  let G=[];
  function render(){
    const box=document.getElementById("gd-body");if(!box)return;
    document.getElementById("gd-lang").textContent=LNAME[S.lang];
    G=groups();
    const cnt=[0,0,0,0];let total=0,met=0,wilted=0;
    G.forEach(g=>{total+=g.total;g.items.forEach(x=>{cnt[x.i.lv]++;met++;if(x.i.wilt)wilted++;});});
    const due=typeof dueWords==="function"?dueWords().length:0;
    const gf=cnt[2]+cnt[3],vis=VIS.filter(v=>gf>=v.n),nv=VIS.find(v=>gf<v.n);
    let h='<div class="gd-sky" aria-hidden="true"><svg viewBox="0 0 320 70" preserveAspectRatio="none"><circle cx="268" cy="24" r="12" fill="hsl(46 95% 62%)"/>'+vis.map(v=>v.svg).join("")+'<path d="M0 70 V52 Q40 40 80 50 T160 48 T240 50 T320 44 V70z" fill="hsl(125 38% 52%)" opacity=".55"/><path d="M0 70 V60 Q50 52 100 59 T200 58 T320 56 V70z" fill="hsl(125 40% 42%)" opacity=".7"/></svg></div>';
    h+='<div class="gd-sum"><span class="gdchip gd3">'+cnt[3]+" fruto"+(cnt[3]===1?"":"s")+'</span><span class="gdchip gd2">'+cnt[2]+" flor"+(cnt[2]===1?"":"es")+'</span><span class="gdchip gd1">'+cnt[1]+" semente"+(cnt[1]===1?"":"s")+'</span><span class="gdchip gd0">'+cnt[0]+" sombra"+(cnt[0]===1?"":"s")+"</span></div>";
    h+='<p class="help">'+met+" de "+total+" palavras de "+LNAME[S.lang]+" já estão no seu jardim. Cada palavra que você acerta cresce: sombra → semente → flor → fruto.</p>";
    h+='<p class="help gd-vis">'+(vis.length?"Visitas no jardim: "+vis.map(v=>v.nome).join(", ")+". ":"Ainda sem visitas. ")+(nv?"Próxima visita: "+nv.nome+", quando você tiver "+nv.n+" flores ou frutos (hoje: "+gf+").":"Seu jardim já recebeu todas as visitas!")+"</p>";
    if(wilted||due)h+='<div class="gd-water"><p><b>'+(wilted?wilted+(wilted===1?" planta precisa":" plantas precisam")+" de água.":"Há "+due+" palavra"+(due===1?"":"s")+" para rever hoje.")+'</b> Regar é rever a palavra: ela volta a crescer.</p><button type="button" class="btn primary" id="gd-water">Regar agora</button></div>';
    if(!met)h+='<div class="gd-empty"><p><b>Seu jardim ainda é só terra.</b></p><p>Acerte a primeira palavra de uma lição de Vocabulário e a primeira semente nasce aqui.</p><button type="button" class="btn primary" id="gd-start">Ir para «Hoje»</button></div>';
    G.forEach(g=>{
      const n=g.items.length;
      h+='<details class="gd-bed"'+(n?" open":"")+'><summary><span>'+esc(g.name)+(g.book?" (livro)":"")+'</span><small>'+n+" de "+g.total+"</small></summary>";
      if(n)h+='<div class="gd-grid">'+g.items.map((x,k)=>'<button type="button" class="gd-pl" data-gd="'+g.key+"|"+k+'" aria-label="'+esc(full(x.e))+", "+ST[x.i.lv]+(x.i.wilt?", precisa de água":"")+'">'+plant(x.i.lv,g.hue,x.i.wilt)+'<span class="gd-w">'+esc(x.e.w)+"</span></button>").join("")+"</div>";
      else h+='<p class="help gd-none">Terra vazia: nenhuma palavra deste tema ainda.</p>';
      h+="</details>";
    });
    h+='<p class="help">Estágios e prazos: escritos por Claude, sem fonte conferida. O histórico de acertos e erros nunca é apagado.</p>';
    box.innerHTML=h;
  }
  function openPlant(key,k){
    const g=G.find(x=>x.key===key),x=g&&g.items[k];if(!x)return;
    const e=x.e,i=x.i,t=dn();
    let h='<div class="gd-card">'+plant(i.lv,g.hue,i.wilt)+'<div><p class="gd-word"><b>'+esc(full(e))+"</b> "+speakBtn(full(e))+"</p><p>"+esc(e.pt)+"</p><p>"+'<span class="gdchip gd'+i.lv+'">'+ST[i.lv]+(i.wilt?" · precisa de água":"")+"</span></p></div></div>";
    const dr=typeof drawSvg==="function"?drawSvg(S.lang,e.w,e.pt):"";
    if(dr)h+='<div class="gd-draw">'+dr+"</div>";
    const c=i.lv>=2&&typeof ctxFor==="function"?ctxFor(e):null;
    if(c)h+='<div class="gd-ctx"><p class="gd-s">«'+esc(c.s)+"» "+speakBtn(c.s)+"</p><p>"+esc(c.pt)+'</p><p class="help">'+esc(c.src)+"</p></div>";
    else if(i.lv<2)h+='<p class="help">Quando esta palavra virar flor, a frase de exemplo aparece aqui.</p>';
    const nxt=["Acerte esta palavra uma vez para plantar a semente.","Acerte de novo, em outro dia (3 dias ou mais depois do último acerto), para ela virar flor.","Para virar fruto: acertar 7 dias ou mais depois do último acerto, de pelo menos 3 formas (ver, ouvir, escrever, usar na frase) e em 4 dias diferentes.","Fruto! Para não murchar, reveja a palavra de vez em quando (cerca de uma vez por mês)."][i.lv];
    h+='<p><b>Como cresce:</b> '+nxt+"</p>";
    if(i.met&&i.lv>0)h+='<p class="help">Até agora: '+i.days+" dia"+(i.days===1?"":"s")+" com acerto, "+i.forms+" forma"+(i.forms===1?"":"s")+" diferente"+(i.forms===1?"":"s")+(i.last?"; último acerto há "+Math.max(0,t-i.last)+" dia"+(t-i.last===1?"":"s"):"")+".</p>";
    h+='<div id="gd-q" data-g="'+esc(key)+"|"+k+'"><button type="button" class="btn primary" data-gdw="start">'+(i.lv===0?"Plantar: tentar agora":"Regar só esta palavra")+"</button></div>";
    openSheet(e.w,h,false);
  }
  /* Regar uma palavra só: escrever a palavra a partir da tradução (conta como forma «Escrever») */
  const n2=x=>String(x||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[’]/g,"'").replace(/\s+/g," ").trim();
  document.getElementById("sheet-in").addEventListener("click",ev=>{
    const b=ev.target.closest("[data-gdw]");if(!b)return;
    const q=document.getElementById("gd-q");if(!q)return;
    const pr=q.dataset.g.split("|"),g=G.find(x=>x.key===pr[0]),x=g&&g.items[+pr[1]];if(!x)return;
    const e=x.e;
    if(b.dataset.gdw==="start"){
      q.innerHTML='<p><b>Como se escreve em '+LNAME[S.lang]+'?</b> «'+esc(e.pt)+'»</p>'+(e.a?'<p class="help">Pode escrever só a palavra, sem o artigo.</p>':"")+'<input type="text" id="gd-in" class="gd-in" autocomplete="off" autocapitalize="none" spellcheck="false" aria-label="Sua resposta"><div class="row" style="margin-top:8px"><button type="button" class="btn primary" data-gdw="ok">Conferir</button></div><p class="help" id="gd-res" aria-live="polite"></p>';
      const inp=document.getElementById("gd-in");inp.focus();
      inp.addEventListener("keydown",kv=>{if(kv.key==="Enter"){kv.preventDefault();q.querySelector("[data-gdw=ok]").click();}});
      return;
    }
    if(b.dataset.gdw==="ok"){
      const v=n2(document.getElementById("gd-in").value);if(!v)return;
      const ok=v===n2(e.w)||v===n2(full(e));
      const key=S.lang+":v|"+e.w.toLowerCase(),cur=S.rvv[key];
      window.GDFORM=2;try{skRec(e.w,e.pt,ok);}finally{window.GDFORM=undefined;}
      if(ok&&cur){const st=cur[1]+1;if(st>=RV_STEPS.length)delete S.rvv[key];else S.rvv[key]=[rvDue(rvIvl(st,cur[2]||0)),st,cur[2]||0];save();}
      const res=document.getElementById("gd-res");
      res.textContent=ok?"Certo! A planta recebeu água.":"Quase. Era «"+full(e)+"». Ela volta para a fila de revisão.";
      q.querySelector("[data-gdw=ok]").hidden=true;
      render();
      return;
    }
  });
  window.renderGarden=render;
  const root=document.getElementById("s-garden");
  root.addEventListener("click",ev=>{
    const b=ev.target.closest("[data-gd]");
    if(b){const p=b.dataset.gd.split("|");openPlant(p[0],+p[1]);return;}
    if(ev.target.closest("#gd-water")){
      if(typeof startCiclo==="function"&&typeof dueWords==="function"&&dueWords().length)startCiclo();
      else if(typeof say==="function")say("Nada vencido agora. Volte mais tarde para regar.");
      return;
    }
    if(ev.target.closest("#gd-start")){go("home");const t=document.getElementById("go-today");if(t)t.click();}
  });
  document.getElementById("go-garden").addEventListener("click",()=>go("garden"));
})();
