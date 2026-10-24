/* Jardim da Memória: estágio de cada palavra (Sombra, Semente, Flor, Fruto) e «murchar».
   S.gd["idioma:palavra"] = [estágio 0..3, dia do último acerto, formas (bits), dias com acerto, murcha 0/1, dia da última prática, última forma]
   Os limiares (dias, formas, acertos) são julgamento de Claude, sem fonte. O histórico (S.sk) nunca é apagado. */
(function(){
  const STAGES=["Sombra","Semente","Flor","Fruto"];
  const IVL=[0,3,14,30]; /* murcha quando passam 2× o intervalo do estágio sem prática */
  const dn=()=>{const d=new Date();return Math.floor((d.getTime()-d.getTimezoneOffset()*6e4)/864e5);};
  const gkey=(lang,w)=>lang+":"+String(w).toLowerCase().slice(0,40);
  const bits=n=>{let c=0;while(n){c+=n&1;n>>=1;}return c;};
  function ensure(key,lang,w){
    let g=S.gd[key];if(g)return g;
    const a=((S.sk[lang]||{})[String(w).toLowerCase().slice(0,100)]||[0,0])[0]||0;
    const r=S.rvv[lang+":v|"+String(w).toLowerCase()],deg=r?r[1]:-1;
    const lv=deg>=4?3:deg>=2?2:a>=1?1:0,t=dn();
    g=S.gd[key]=[lv,a>=1?t:0,0,a>=1?1:0,0,t,-1];
    return g;
  }
  /* evento de resposta (certa ou errada): chamado antes de skRec registrar */
  function rec(lang,w,ok,form){
    if(!w||!S.gd)return;const key=gkey(lang,w),g=ensure(key,lang,w),t=dn();
    const fb=form>=0?1<<Math.min(form,5):0;
    if(ok){
      const gap=g[1]?t-g[1]:0;
      if(g[0]===0)g[0]=1;
      else if(g[0]===1&&g[1]&&gap>=3)g[0]=2;
      else if(g[0]===2&&g[1]&&gap>=7&&bits(g[2]|fb)>=3&&g[3]+(t>g[1]?1:0)>=4)g[0]=3;
      if(!g[1]||t>g[1])g[3]=Math.min(999,g[3]+1);
      g[1]=t;g[2]|=fb;
    }else if(g[0]>=2)g[0]--; /* errar derruba no máximo 1 estágio e nunca chega à Sombra */
    g[4]=0;g[5]=t;if(form>=0)g[6]=form;
  }
  const _sr=skRec;
  skRec=function(w,label,ok){
    try{rec(S.lang,w,ok,typeof window.GDFORM==="number"?window.GDFORM:4);}catch(e){}
    return _sr.apply(this,arguments);
  };
  /* degraus que a fila de revisão perde ao errar: 1 se a palavra é Flor/Fruto, 2 nos demais */
  window.gdDrop=function(rvKey){
    const m=/^(fr|it|en):v\|(.+)$/.exec(rvKey||"");if(!m)return 2;
    const g=S.gd[m[1]+":"+m[2].toLowerCase().slice(0,40)];return g&&g[0]>=2?1:2;
  };
  window.gdRec=rec;
  window.gdStage=function(lang,w){const g=S.gd[gkey(lang,w)];return g?g[0]:0;};
  window.gdName=function(lang,w){return STAGES[window.gdStage(lang,w)];};
  window.gdWilted=function(lang,w){const g=S.gd[gkey(lang,w)];return !!(g&&g[4]);};
  window.gdLastForm=function(lang,w){const g=S.gd[gkey(lang,w)];return g?g[6]:-1;};
  window.GD_STAGES=STAGES;
  window.gdChip=function(lang,w){const st=window.gdStage(lang,w);return '<span class="gdchip gd'+st+'">'+STAGES[st]+(window.gdWilted(lang,w)?" · precisa de água":"")+"</span>";};
  /* verificação diária: murcha, volta à fila e, depois de mais de 2 semanas fora, espalha as revisões em 5 dias */
  function tick(){
    if(!S.gd)return;const t=dn();let ch=false;
    const away=S.gdt&&t-S.gdt>14;
    if(away){
      const now=Date.now(),od=Object.keys(S.rvv).filter(k=>S.rvv[k][0]<=now).sort((a,b)=>S.rvv[a][0]-S.rvv[b][0]),n=od.length;
      od.forEach((k,i)=>{S.rvv[k][0]=rvDue(Math.floor(i*5/n));});
      Object.keys(S.gd).forEach(k=>{S.gd[k][5]=t;}); /* a ausência não derruba ninguém */
      ch=true;
    }else Object.keys(S.gd).forEach(key=>{
      const g=S.gd[key];if(g[0]<1||g[4])return;
      if(t-g[5]>2*IVL[g[0]]){
        if(g[0]>=2)g[0]--;
        g[4]=1;g[5]=t;ch=true;
        const w=key.slice(key.indexOf(":")+1),rk=key.slice(0,key.indexOf(":"))+":v|"+w;
        if(!S.rvv[rk]&&Object.keys(S.rvv).length<400)S.rvv[rk]=[rvDue(0),Math.max(0,g[0]-1),0];
      }
    });
    S.gdt=t; /* sem save próprio: gravar aqui criaria o progresso numa instalação nova */
    const ks=Object.keys(S.gd);if(ks.length>2000){ks.sort((a,b)=>S.gd[a][5]-S.gd[b][5]).slice(0,ks.length-2000).forEach(k=>delete S.gd[k]);ch=true;}
    if(ch)save();
  }
  window.gdTick=tick;
  window.gdWiltCount=function(){return Object.keys(S.gd).filter(k=>S.gd[k][4]&&k.indexOf(S.lang+":")===0).length;};
  /* até 3 palavras murchas por sessão; as demais ficam para outro dia */
  window.gdCap=function(keys,max){
    max=max||3;let n=0;
    return keys.filter(k=>{const m=/^(fr|it|en):v\|(.+)$/.exec(k);if(!m)return true;
      const g=S.gd[m[1]+":"+m[2].toLowerCase().slice(0,40)];if(g&&g[4]){return ++n<=max;}return true;});
  };
  tick();
  document.addEventListener("visibilitychange",()=>{if(!document.hidden)tick();});
})();
