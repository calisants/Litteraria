/* ===== Pontos, sequências e conquistas (opcional, v1.39) =====
   Desligado por padrão: Ajustes → Estudo → «Pontos e sequências». Os dias estudados são anotados sempre (para a sequência já existir quando ela ligar),
   mas pontos, nível e conquistas só contam e aparecem com a opção ligada.
   Um dia «conta» quando a pessoa conclui uma lição ou cumpre a meta diária. Sem punição: se um dia passa em branco a sequência recomeça e o recorde fica guardado. */
(function(){
  const pad=n=>String(n).padStart(2,"0");
  const dstr=d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
  const lvStart=n=>50*n*(n-1);               /* nível 2 = 100, 3 = 300, 4 = 600, 5 = 1000 ... */
  const levelOf=p=>{let n=1;while(p>=lvStart(n+1))n++;return n;};
  let combo=0,pend=null;
  const on=()=>S.gam.on;

  function streak(){
    const set=new Set(S.gam.days),d=new Date();d.setHours(12,0,0,0);
    const today=set.has(dstr(d));
    if(!today)d.setDate(d.getDate()-1);
    let n=0;while(set.has(dstr(d))){n++;d.setDate(d.getDate()-1);}
    return {n:n,today:today};
  }
  window.studiedToday=()=>S.gam.days.indexOf(ymd())>=0||dayN()>0;
  window.gamStreak=streak;
  window.gamLevel=()=>S.gam.on?levelOf(S.gam.pts):null;
  function markDay(){
    const t=ymd(),d=S.gam.days;
    if(d.indexOf(t)>=0)return false;
    d.push(t);d.sort();if(d.length>400)d.splice(0,d.length-400);
    S.gam.last=t;
    const s=streak().n;if(s>S.gam.best)S.gam.best=s;S.gam.streak=s;
    return true;
  }

  const BADGES=[
    ["primeira","Primeira lição","Concluir 1 lição",()=>S.gam.les>=1],
    ["dez","10 lições","Concluir 10 lições",()=>S.gam.les>=10],
    ["cinquenta","50 lições","Concluir 50 lições",()=>S.gam.les>=50],
    ["cem","100 lições","Concluir 100 lições",()=>S.gam.les>=100],
    ["d3","3 dias seguidos","Estudar 3 dias em sequência",()=>S.gam.best>=3],
    ["d7","Semana completa","Estudar 7 dias em sequência",()=>S.gam.best>=7],
    ["d30","30 dias seguidos","Estudar 30 dias em sequência",()=>S.gam.best>=30],
    ["c10","10 seguidas","Acertar 10 de primeira, em sequência",()=>S.gam.bc>=10],
    ["c25","25 seguidas","Acertar 25 de primeira, em sequência",()=>S.gam.bc>=25],
    ["p500","500 pontos","Chegar a 500 pontos",()=>S.gam.pts>=500],
    ["p2000","2.000 pontos","Chegar a 2.000 pontos",()=>S.gam.pts>=2000],
    ["meta","Meta do dia","Cumprir a meta diária",()=>dayN()>=S.goal],
    ["tri","Três idiomas","Concluir lições em francês, italiano e inglês",()=>["fr","it","en"].every(l=>Object.keys(S.done).some(k=>k.indexOf(l+":")===0))],
    ["leitor","Leitor","Concluir 3 capítulos de livros",()=>Object.keys(S.cap).length>=3],
    ["album","Colecionador de frases","Guardar 5 frases no álbum",()=>S.fav.length>=5]
  ];
  function checkBadges(){
    if(!on())return [];
    const s=streak().n;if(s>S.gam.best)S.gam.best=s;
    const fresh=[];
    BADGES.forEach(b=>{if(S.gam.seen.indexOf(b[0])<0&&b[3]()&&S.gam.seen.length<40){S.gam.seen.push(b[0]);fresh.push(b);}});
    if(fresh.length&&pend)pend.badges=pend.badges.concat(fresh.map(b=>b[1]));
    if(fresh.length&&!pend)say("Conquista: "+fresh.map(b=>b[1]).join(", "));
    return fresh;
  }
  function add(n){S.gam.pts+=n;if(pend)pend.pts+=n;}
  function pop(txt){
    if(!on())return;
    let el=$("#gpop");
    if(!el){el=document.createElement("div");el.id="gpop";el.setAttribute("aria-hidden","true");document.body.appendChild(el);}
    el.textContent=txt;el.classList.remove("go");void el.offsetWidth;el.classList.add("go");
  }

  /* cada resposta de primeira (certa ou errada): vem de skRec e dos jogos de literatura */
  window.gamAns=function(ok){
    if(!on())return;
    if(ok){
      combo++;add(10);pop("+10");
      if(combo>S.gam.bc)S.gam.bc=combo;
      if(combo%5===0){add(5);pop(combo+" seguidas! +5");}
    }else combo=0;
    checkBadges();save();
  };
  const _sr=skRec;skRec=function(w,l,ok){_sr.apply(this,arguments);window.gamAns(ok);};
  const _bp=bump;bump=function(){
    _bp.apply(this,arguments);
    if(dayN()>=S.goal&&markDay()){onNewDay();checkBadges();save();}
  };
  function onNewDay(){
    if(!on())return;
    const s=streak().n;
    if(s>=2){const b=5*Math.min(s,10);add(b);}
  }
  const _md=markDone;
  markDone=function(){
    const first=!!P&&!isDone(P);
    _md.apply(this,arguments);
    S.gam.les++;
    const newDay=markDay();
    if(on()){
      if(!pend)pend={pts:0,badges:[],streak:0};
      add(first?50:10);
      if(newDay)onNewDay();
      pend.streak=streak().n;
      checkBadges();
    }
    save();
    renderGam();
  };
  const _sp=startPage;startPage=function(){pend=null;combo=0;return _sp.apply(this,arguments);};

  /* recompensa no começo da folha «Página concluída» */
  function rewardHtml(){
    if(!pend)return "";
    const l=levelOf(S.gam.pts);
    let h='<div class="gam-r"><b>+'+pend.pts+" pontos</b>"+(pend.streak>=2?" · sequência de "+pend.streak+" dias":"")+" · nível "+l;
    if(pend.badges.length)h+='<br><span class="gam-b">Conquista: '+pend.badges.map(esc).join(", ")+"</span>";
    return h+"</div>";
  }
  const _os=openSheet;
  openSheet=function(title,html,foot){
    if(on()&&foot&&pend&&pend.pts>0){html=rewardHtml()+html;pend=null;}
    return _os.call(this,title,html,foot);
  };

  /* chips na tela inicial */
  const FLAME='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3c1 3.5 5 5.2 5 10a5 5 0 0 1-10 0c0-2 1-3.4 2-4.4.3 1.4 1 2 1.8 2.2C11 8.2 11 5.5 12 3z"/></svg>';
  const STAR='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4l2.4 5 5.4.7-4 3.8 1 5.4L12 16.3 7.2 18.9l1-5.4-4-3.8 5.4-.7z"/></svg>';
  function renderGam(){
    const el=$("#gam-chip");if(!el)return;
    if(!on()){el.hidden=true;return;}
    const s=streak(),l=levelOf(S.gam.pts);
    el.hidden=false;
    el.classList.toggle("idle",!s.today);
    el.innerHTML='<span>'+FLAME+" "+s.n+"</span><span>"+STAR+" Nív. "+l+"</span>";
    el.setAttribute("aria-label","Sequência de "+s.n+" dias, nível "+l+". Toque para ver detalhes.");
  }
  window.renderGam=renderGam;
  const _rm2=renderMe;renderMe=function(){_rm2();renderGam();};


  /* pontos fortes e fracos: só do que ela realmente jogou (S.sk), por tema do vocabulário */
  function skillsHtml(){
    const L=S.lang,sk=S.sk[L]||{},names={};
    CATS.concat(BOOKTHEMES).forEach(c=>{names[c[0]]=c[1];});
    const rows=[];
    Object.keys(VOCAB[L]||{}).forEach(t=>{
      let ok=0,bad=0,seen=0;
      VOCAB[L][t].forEach(it=>{const a=sk[String(it.w).toLowerCase()];if(a){ok+=a[0];bad+=a[1];seen++;}});
      if(seen>=3&&ok+bad>=6)rows.push({n:names[t]||t,p:Math.round(100*ok/(ok+bad)),t:ok+bad});
    });
    rows.sort((a,b)=>b.p-a.p||b.t-a.t);
    const bar=r=>'<div class="skr"><span>'+esc(r.n)+'</span><span class="gbar" aria-hidden="true"><i style="width:'+r.p+'%"></i></span><b>'+r.p+'%</b></div>';
    let h='<h3 class="sub">Pontos fortes e fracos · '+LNAME[L]+'</h3>';
    if(rows.length<2)return h+'<p class="help">Ainda há pouco dado. Jogue mais alguns jogos de vocabulário e aqui aparecem os temas em que você vai melhor e os que precisam de reforço.</p>';
    const top=rows.filter(r=>r.p>=70).slice(0,3),low=rows.slice().reverse().filter(r=>r.p<70).slice(0,3);
    h+='<p class="help">Cada barra é a porcentagem de acertos nas palavras do tema (só entram temas com pelo menos 3 palavras e 6 respostas suas).</p>';
    h+='<h4 class="skh">Você vai bem em</h4>'+(top.length?top.map(bar).join(""):'<p class="help">Nenhum tema chegou a 70% ainda.</p>');
    h+='<h4 class="skh">Precisa de reforço</h4>'+(low.length?low.map(bar).join(""):'<p class="help">Nenhum tema abaixo de 70%. Muito bem!</p>');
    const weak=Object.keys(sk).filter(k=>sk[k][1]>sk[k][0]).sort((a,b)=>(sk[b][1]-sk[b][0])-(sk[a][1]-sk[a][0])).slice(0,5);
    if(weak.length)h+='<h4 class="skh">Palavras que mais erra</h4><p class="help">'+weak.map(k=>"<b>"+esc(k)+"</b>"+(sk[k][2]?" ("+esc(sk[k][2])+")":"")).join(" · ")+'</p>';
    return h+'<div class="row"><button type="button" class="btn primary" id="gam-train">Treinar o que preciso reforçar</button></div>';
  }

  function openGam(){
    const s=streak(),l=levelOf(S.gam.pts),a=lvStart(l),b=lvStart(l+1),pc=Math.round(100*(S.gam.pts-a)/(b-a));
    const set=new Set(S.gam.days),now=new Date();now.setHours(12,0,0,0);
    let dots="";
    for(let i=6;i>=0;i--){
      const d=new Date(now);d.setDate(d.getDate()-i);
      dots+='<span class="gd'+(set.has(dstr(d))?" on":"")+(i===0?" now":"")+'"><i></i><small>'+"DSTQQSS".charAt(d.getDay())+"</small></span>";
    }
    const earned=BADGES.filter(x=>S.gam.seen.indexOf(x[0])>=0).length;
    let h='<div class="gam-top"><b class="gam-n">'+s.n+"</b><span>"+(s.n===1?"dia":"dias")+" seguidos"+(s.today?"":" · hoje ainda não contou")+"</span></div>"+
      '<div class="gdots" role="img" aria-label="Últimos 7 dias">'+dots+"</div>"+
      '<p class="help">Recorde: '+S.gam.best+" dias · lições concluídas: "+S.gam.les+" · maior série de acertos: "+S.gam.bc+"</p>"+
      '<p class="gam-lv"><b>Nível '+l+"</b> · "+S.gam.pts+" pontos</p><span class=\"gbar\" aria-hidden=\"true\"><i style=\"width:"+pc+"%\"></i></span>"+
      '<p class="help">Faltam '+(b-S.gam.pts)+" pontos para o nível "+(l+1)+'.</p>'+
      skillsHtml()+
      '<h3 class="sub">Conquistas · '+earned+" de "+BADGES.length+"</h3><div class=\"gbadges\">"+
      BADGES.map(x=>{const got=S.gam.seen.indexOf(x[0])>=0;return '<div class="gb'+(got?" got":"")+'"><b>'+esc(x[1])+"</b><small>"+esc(x[2])+"</small></div>";}).join("")+"</div>"+
      '<h3 class="sub">Como os pontos funcionam</h3><p class="help">+10 por resposta certa de primeira; +5 a cada 5 acertos seguidos; +50 ao concluir uma página nova (+10 ao repetir); bônus ao começar um novo dia de sequência. Se um dia passar em branco, a sequência recomeça e o recorde fica guardado. Nada é tirado de você.</p>'+
      '<div class="row"><button type="button" class="btn" id="gam-off">Desligar pontos e sequências</button></div>';
    openSheet("Pontos e sequência",h,false);
  }
  window.openGam=openGam;
  document.addEventListener("click",e=>{
    if(e.target.closest&&e.target.closest("#gam-chip")){openGam();return;}
    if(e.target.closest&&e.target.closest("#gam-train")){closeSheet();if(typeof openTrainMenu==="function")openTrainMenu();return;}
    if(e.target.closest&&e.target.closest("#gam-off")){S.gam.on=false;save();closeSheet();renderGam();syncGamSeg();}
  });
  function syncGamSeg(){$$("#gam-seg [data-gam]").forEach(b=>b.setAttribute("aria-pressed",String((b.dataset.gam==="on")===on())));}
  window.syncGamSeg=syncGamSeg;
  $("#gam-seg").addEventListener("click",e=>{
    const b=e.target.closest("[data-gam]");if(!b)return;
    S.gam.on=b.dataset.gam==="on";
    if(S.gam.on){const s=streak().n;if(s>S.gam.best)S.gam.best=s;checkBadges();}
    save();syncGamSeg();renderGam();
  });
  const _go2=go;go=function(n){_go2.apply(this,arguments);if(n==="settings")syncGamSeg();};
  syncGamSeg();renderGam();
})();
