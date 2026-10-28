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
  /* Cena do jardim (v1.73): céu com sol, nuvens, colinas, cerca e flores que aparecem conforme o jardim cresce; visitantes animados */
  const VIS=[
    {n:3,nome:"uma borboleta",x:70,y:58,svg:'<g class="gd-path gd-p1"><g class="gd-bfly"><g class="gd-wing"><path d="M0 0C-4-9-14-10-13-2-12 3-5 3 0 0zM0 0C-3 7-10 10-9 4-8 0-4-1 0 0z" fill="hsl(285 65% 72%)" stroke="hsl(285 40% 45%)" stroke-width=".6"/></g><g class="gd-wing gd-wr"><path d="M0 0C4-9 14-10 13-2 12 3 5 3 0 0zM0 0C3 7 10 10 9 4 8 0 4-1 0 0z" fill="hsl(285 65% 72%)" stroke="hsl(285 40% 45%)" stroke-width=".6"/></g><rect x="-.8" y="-5" width="1.6" height="10" rx=".8" fill="hsl(25 30% 25%)"/></g></g>'},
    {n:10,nome:"uma abelha",x:150,y:76,svg:'<g class="gd-path gd-p2"><g class="gd-bee"><ellipse cx="0" cy="0" rx="6.5" ry="4.5" fill="hsl(46 95% 58%)"/><path d="M-2-4.2v8.4M2 -4.2v8.4" stroke="hsl(25 30% 18%)" stroke-width="1.8"/><circle cx="-7" cy="-.6" r="2.6" fill="hsl(25 30% 18%)"/><g class="gd-wing"><ellipse cx="0" cy="-6" rx="4" ry="2.4" fill="hsl(200 60% 92%)" opacity=".85"/></g></g></g>'},
    {n:20,nome:"outra borboleta",x:215,y:44,svg:'<g class="gd-path gd-p3"><g class="gd-bfly"><g class="gd-wing"><path d="M0 0C-4-9-14-10-13-2-12 3-5 3 0 0zM0 0C-3 7-10 10-9 4-8 0-4-1 0 0z" fill="hsl(18 90% 64%)" stroke="hsl(18 50% 35%)" stroke-width=".6"/></g><g class="gd-wing gd-wr"><path d="M0 0C4-9 14-10 13-2 12 3 5 3 0 0zM0 0C3 7 10 10 9 4 8 0 4-1 0 0z" fill="hsl(18 90% 64%)" stroke="hsl(18 50% 35%)" stroke-width=".6"/></g><rect x="-.8" y="-5" width="1.6" height="10" rx=".8" fill="hsl(25 30% 25%)"/></g></g>'},
    {n:40,nome:"um passarinho",x:120,y:30,svg:'<g class="gd-path gd-p4"><ellipse cx="0" cy="0" rx="8" ry="5.2" fill="hsl(205 70% 62%)"/><circle cx="7" cy="-3" r="3.4" fill="hsl(205 70% 62%)"/><path d="M10-3l4.5 1.4-4.5 1.2z" fill="hsl(35 90% 55%)"/><circle cx="8" cy="-3.6" r=".9" fill="#222"/><path d="M-7 1l-8-3 1.5 5z" fill="hsl(205 55% 48%)"/><path d="M-1 0c-1-6 3-8 6-6" fill="none" stroke="hsl(205 55% 48%)" stroke-width="2" class="gd-wing"/></g>'},
    {n:80,nome:"uma joaninha",x:148,y:115,svg:'<g class="gd-lady"><ellipse cx="0" cy="0" rx="5.4" ry="4.2" fill="hsl(5 82% 50%)"/><path d="M0-4.2v8.4" stroke="#222" stroke-width="1"/><circle cx="-2.2" cy="-1" r=".95" fill="#222"/><circle cx="2.2" cy="1.2" r=".95" fill="#222"/><circle cx="-2" cy="2" r=".8" fill="#222"/><circle cx="5.6" cy="0" r="2.2" fill="#222"/></g>'}
  ];
  function sceneSvg(cnt,vis){
    const gf=cnt[2]+cnt[3],fruits=cnt[3];
    const flowers=Math.min(14,Math.round(gf*0.9));
    let fl="";
    for(let i=0;i<flowers;i++){
      const x=14+((i*53)%296),y=96+((i*29)%24),h=(i*47+330)%360,s=0.8+((i*7)%5)/10;
      fl+='<g transform="translate('+x+' '+y+') scale('+s.toFixed(2)+')"><path d="M0 0V-12" stroke="hsl(125 40% 34%)" stroke-width="1.4"/><circle cx="0" cy="-14" r="3.6" fill="hsl('+h+' 78% 72%)"/><circle cx="-3.6" cy="-12" r="2.6" fill="hsl('+h+' 78% 72%)"/><circle cx="3.6" cy="-12" r="2.6" fill="hsl('+h+' 78% 72%)"/><circle cx="0" cy="-14" r="1.8" fill="hsl(46 92% 56%)"/></g>';
    }
    const tree=fruits>=1?'<g transform="translate(40 92)"><rect x="-3" y="-14" width="6" height="22" rx="2" fill="hsl(28 35% 36%)"/><circle cx="0" cy="-22" r="16" fill="hsl(125 42% 38%)"/><circle cx="-9" cy="-16" r="10" fill="hsl(125 42% 42%)"/><circle cx="9" cy="-16" r="10" fill="hsl(125 40% 34%)"/>'+(fruits>=3?'<circle cx="-5" cy="-24" r="2.4" fill="hsl(5 80% 52%)"/><circle cx="6" cy="-18" r="2.4" fill="hsl(5 80% 52%)"/><circle cx="1" cy="-12" r="2.4" fill="hsl(5 80% 52%)"/>':"")+"</g>":"";
    return '<svg viewBox="0 0 320 130" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Cena do jardim: céu, colinas e flores"><defs><linearGradient id="gdsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="hsl(205 80% 78%)"/><stop offset="1" stop-color="hsl(48 90% 90%)"/></linearGradient></defs><rect width="320" height="130" fill="url(#gdsk)"/>'+
      '<g class="gd-sun"><circle cx="270" cy="26" r="22" fill="hsl(46 95% 70%)" opacity=".35"/><circle cx="270" cy="26" r="13" fill="hsl(46 96% 62%)"/></g>'+
      '<g class="gd-cloud gd-c1" fill="#fff" opacity=".85"><ellipse cx="60" cy="24" rx="20" ry="7"/><ellipse cx="74" cy="19" rx="13" ry="7"/><ellipse cx="48" cy="20" rx="10" ry="6"/></g>'+
      '<g class="gd-cloud gd-c2" fill="#fff" opacity=".7"><ellipse cx="170" cy="40" rx="16" ry="5.5"/><ellipse cx="182" cy="36" rx="10" ry="5.5"/></g>'+
      '<path d="M0 100 Q50 72 110 90 T220 84 T320 88 V130H0z" fill="hsl(135 38% 62%)"/>'+
      '<path d="M0 112 Q60 96 130 108 T260 104 T320 106 V130H0z" fill="hsl(125 42% 48%)"/>'+
      tree+
      '<g stroke="hsl(30 30% 62%)" stroke-width="2" opacity=".9"><path d="M230 116v-12M240 116v-12M250 116v-12M260 116v-12M226 109h38M226 114h38" fill="none"/></g>'+
      fl+
      '<path d="M0 122 Q80 114 160 121 T320 119 V130H0z" fill="hsl(125 40% 38%)"/>'+
      vis.map(v=>'<g transform="translate('+v.x+' '+v.y+')">'+v.svg+'</g>').join("")+"</svg>";
  }
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
    let h='<div class="gd-sky">'+sceneSvg(cnt,vis)+'</div>';
    const tile=(lv,n,lab)=>'<div class="gd-tile gd'+lv+'">'+plant(lv,330,false)+'<b>'+n+'</b><span>'+lab+'</span></div>';
    h+='<div class="gd-sum">'+tile(3,cnt[3],cnt[3]===1?"fruto":"frutos")+tile(2,cnt[2],cnt[2]===1?"flor":"flores")+tile(1,cnt[1],cnt[1]===1?"semente":"sementes")+tile(0,cnt[0],cnt[0]===1?"sombra":"sombras")+"</div>";
    h+='<p class="help gd-prog">'+met+" de "+total+" palavras de "+LNAME[S.lang]+' já chegaram ao jardim.</p><div class="gd-bar" aria-hidden="true"><span style="width:'+Math.round(100*met/Math.max(1,total))+'%"></span></div>';
    h+='<div class="gd-vis"><b>'+(vis.length?"Visitas: ":"Ainda sem visitas. ")+"</b>"+(vis.length?esc(vis.map(v=>v.nome).join(", "))+". ":"")+(nv?"Próxima: "+nv.nome+" com "+nv.n+" flores ou frutos (hoje: "+gf+").":"O jardim já recebeu todas as visitas!")+(nv?'<div class="gd-bar gd-bar2" aria-hidden="true"><span style="width:'+Math.min(100,Math.round(100*gf/nv.n))+'%"></span></div>':"")+"</div>";
    if(wilted||due)h+='<div class="gd-water"><p><b>'+(wilted?wilted+(wilted===1?" planta precisa":" plantas precisam")+" de água.":"Há "+due+" palavra"+(due===1?"":"s")+" para rever hoje.")+'</b> Regar é rever a palavra: ela volta a crescer.</p><button type="button" class="btn primary" id="gd-water">Regar agora</button></div>';
    if(!met)h+='<div class="gd-empty"><p><b>Seu jardim ainda é só terra.</b></p><p>Acerte a primeira palavra de uma lição de Vocabulário e a primeira semente nasce aqui.</p><button type="button" class="btn primary" id="gd-start">Ir para «Hoje»</button></div>';
    const live=G.filter(g=>g.items.length).sort((x,y)=>(y.items.filter(i=>i.i.lv>=2).length-x.items.filter(i=>i.i.lv>=2).length)||(y.items.length-x.items.length));
    live.forEach(g=>{
      const n=g.items.length,c=[0,0,0,0];g.items.forEach(x=>c[x.i.lv]++);
      const seg=lv=>c[lv]?'<span class="gd-seg gd-s'+lv+'" style="flex:'+c[lv]+'"></span>':"";
      h+='<details class="gd-bed" style="--bh:'+g.hue+'" open><summary><span class="gd-bn">'+esc(g.name)+(g.book?" (livro)":"")+'</span><small>'+n+" de "+g.total+'</small><span class="gd-stack" aria-hidden="true">'+seg(3)+seg(2)+seg(1)+seg(0)+"</span></summary>";
      h+='<div class="gd-grid">'+g.items.map((x,k)=>'<button type="button" class="gd-pl'+(x.i.wilt?" wilt":"")+'" data-gd="'+g.key+"|"+k+'" aria-label="'+esc(full(x.e))+", "+ST[x.i.lv]+(x.i.wilt?", precisa de água":"")+'">'+plant(x.i.lv,g.hue,x.i.wilt)+'<span class="gd-w">'+esc(x.e.w)+"</span></button>").join("")+"</div></details>";
    });
    const empty=G.filter(g=>!g.items.length);
    if(empty.length)h+='<details class="gd-bed gd-emptybeds"><summary><span class="gd-bn">Canteiros ainda vazios</span><small>'+empty.length+'</small></summary><p class="help gd-none">Terra pronta para plantar. Acerte uma palavra de cada tema e ele ganha as primeiras sementes:</p><div class="gd-chips">'+empty.map(g=>'<span class="gd-chip">'+esc(g.name)+"</span>").join("")+"</div></details>";
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
