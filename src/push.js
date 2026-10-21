/* ===== Notificações com o app fechado (Web Push), v1.40 =====
   O celular se inscreve no serviço de push do próprio sistema (Apple/Google/Mozilla). O endereço da inscrição vai para uma caixa
   (Apps Script em PUSHCFG.sink) e uma rotina do GitHub Actions (push/send.py) manda o lembrete na hora escolhida.
   Só funciona com PUSHCFG.sink preenchido. No iPhone exige iOS 16.4+ e o app instalado na Tela de Início. */
(function(){
  const C=window.PUSHCFG||{};
  const ready=()=>!!(C.sink&&C.pub);
  const can=()=>ready()&&"serviceWorker" in navigator&&"PushManager" in window&&"Notification" in window;
  const b64u=s=>{const p="=".repeat((4-s.length%4)%4),b=atob((s+p).replace(/-/g,"+").replace(/_/g,"/"));return Uint8Array.from(b,c=>c.charCodeAt(0));};
  async function subId(sub){
    const d=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(sub.endpoint));
    return btoa(String.fromCharCode.apply(null,new Uint8Array(d))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"").slice(0,32);
  }
  const post=o=>fetch(C.sink,{method:"POST",mode:"no-cors",headers:{"content-type":"text/plain"},body:JSON.stringify(o)});
  async function getReg(){try{return await Promise.race([navigator.serviceWorker.ready,new Promise((_,r)=>setTimeout(r,4000))]);}catch(_){return null;}}
  let busy=false,lastSig="",state="";
  window.__pushOn=0;

  async function sync(force){
    if(!can()||busy)return;
    busy=true;
    try{
      const reg=await getReg();if(!reg)return;
      let sub=await reg.pushManager.getSubscription();
      if(!S.rm.on||Notification.permission!=="granted"){
        if(sub){try{await post({a:"del",id:await subId(sub)});}catch(_){}await sub.unsubscribe();}
        window.__pushOn=0;state="";lastSig="";return;
      }
      if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64u(C.pub)});
      const id=await subId(sub),done=studiedToday()?ymd():"",tz=new Date().getTimezoneOffset();
      const sig=[id,S.rm.h,S.rm.st,S.lang,done,tz].join("|");
      if(sig===lastSig&&!force){window.__pushOn=1;state="ok";return;}
      await post({a:"sub",id:id,sub:sub.toJSON(),h:S.rm.h,tz:tz,st:S.rm.st,ln:LNAME[S.lang],done:done});
      lastSig=sig;window.__pushOn=1;state="ok";
    }catch(e){window.__pushOn=0;state=(e&&e.name==="NotAllowedError")?"gesto":"erro";}
    finally{busy=false;renderPush();if(window.pushState)pushState();}
  }
  window.pushSync=sync;

  function renderPush(){
    const el=$("#rm-push");if(!el)return;
    if(!ready()){el.innerHTML="";return;}
    let m,btn=false;
    if(!can())m="Para receber o lembrete com o app fechado: no iPhone, abra o site no Safari, toque em Compartilhar → «Adicionar à Tela de Início» e abra o app por esse ícone (precisa do iOS 16.4 ou mais novo). Nesta aba do navegador esse tipo de aviso não está disponível.";
    else if(!S.rm.on)m="Ligue os lembretes acima para receber o aviso com o app fechado.";
    else if(Notification.permission==="denied")m="As notificações estão bloqueadas para este app nas configurações do aparelho. Libere lá e volte aqui.";
    else if(state==="ok")m="Envio com o app fechado: ativo. O aviso chega a partir das "+String(S.rm.h).padStart(2,"0")+":00 e pode atrasar até cerca de 2 horas. Se você já tiver estudado no dia, ele não vem. O texto é o mesmo de sempre: o servidor não conhece o seu progresso.";
    else if(state==="erro"){m="Não consegui ativar agora (sem internet ou o aparelho recusou). Tente de novo.";btn=true;}
    else{m=state==="gesto"?"O aparelho pediu um toque seu para ativar.":"Falta um passo para o aviso chegar com o app fechado.";btn=true;}
    el.innerHTML='<p class="help">'+esc(m)+"</p>"+(btn?'<div class="row"><button type="button" class="btn primary" id="rm-push-on">Ativar envio com o app fechado</button></div>':"")+
      '<p class="help">O que vai para o servidor: só o endereço de envio do aparelho, o horário, o estilo, o idioma e se você já estudou hoje. Sem nome, e-mail ou progresso.</p>';
  }
  window.renderPush=renderPush;
  document.addEventListener("click",async e=>{
    if(!e.target.closest||!e.target.closest("#rm-push-on"))return;
    if(!("Notification" in window))return;
    if(Notification.permission==="default"){try{await Notification.requestPermission();}catch(_){}}
    if(!S.rm.on){S.rm.on=true;save();if(window.syncRm)syncRm();}
    await sync(true);
  });

  let t=null;
  const _sv=save;save=function(){_sv.apply(this,arguments);clearTimeout(t);t=setTimeout(()=>sync(false),2500);};
  document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")sync(false);});
  const _go4=go;go=function(n){_go4.apply(this,arguments);if(n==="settings")renderPush();};
  renderPush();
  setTimeout(()=>sync(false),2500);
})();
