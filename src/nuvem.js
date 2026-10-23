/* ===== Conta e nuvem (opcional), v1.41 =====
   Entrada por código numérico (6 a 8 dígitos) enviado ao e-mail (Supabase Auth). O progresso (o objeto S inteiro, menos lembretes e cartão, que são de cada aparelho)
   é guardado na tabela «progress»; cada pessoa só enxerga a própria linha (regras em nuvem/setup.sql). Sem conta, nada sai do aparelho.
   Conflito entre aparelhos: o servidor carimba a hora (updated_at); o app só grava se o carimbo que ele conhece ainda é o atual. */
(function(){
  const C=window.CLOUDCFG||{};
  const ready=()=>!!(C.url&&C.key);
  if(!ready())return;
  const SK="mots-parole-cloud";
  let ses=null,busy=false,step="email",pendEmail="",msg="",conflictShown=false,bootDone=false;
  try{ses=JSON.parse(localStorage.getItem(SK)||"null");}catch(_){}
  /* v1.52.2: o passo «digitar o código» sobrevive se o navegador descartar a página enquanto a pessoa vai ao e-mail (Samsung Internet, Chrome com pouca memória) */
  const PK="mots-parole-cloud-pend",PMAX=30*60e3;
  const putPend=()=>{try{pendEmail?localStorage.setItem(PK,JSON.stringify({e:pendEmail,t:Date.now()})):localStorage.removeItem(PK);}catch(_){}};
  let restored=false;
  try{const o=JSON.parse(localStorage.getItem(PK)||"null");
    if(o&&typeof o.e==="string"&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(o.e)&&Date.now()-(+o.t||0)<PMAX&&!ses){pendEmail=o.e;step="code";restored=true;}
    else if(o)localStorage.removeItem(PK);}catch(_){}
  const putSes=()=>{try{ses?localStorage.setItem(SK,JSON.stringify(ses)):localStorage.removeItem(SK);}catch(_){}};
  const hs=s=>{let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return s.length+":"+h;};
  const now=()=>Math.floor(Date.now()/1000);
  const mine=()=>{const o=JSON.parse(JSON.stringify(S));return o;};
  const hasProgress=()=>Object.keys(S.done||{}).length>0||Object.keys(S.sk&&S.sk[S.lang]||{}).length>0||Object.keys(S.rvv||{}).length>0;

  async function raw(path,o){
    o=o||{};
    const h={apikey:C.key,"content-type":"application/json"};
    if(o.token)h.authorization="Bearer "+o.token;else if(/^eyJ/.test(C.key))h.authorization="Bearer "+C.key; /* chaves novas (sb_publishable_…) não são JWT: só vão no cabeçalho apikey */
    if(o.prefer)h.prefer=o.prefer;
    return fetch(C.url+path,{method:o.method||"GET",headers:h,body:o.body===undefined?undefined:JSON.stringify(o.body)});
  }
  async function token(){
    if(!ses)return null;
    if(ses.exp-60>now())return ses.at;
    try{
      const r=await raw("/auth/v1/token?grant_type=refresh_token",{method:"POST",body:{refresh_token:ses.rt}});
      if(!r.ok){if(r.status>=400&&r.status<500){ses=null;putSes();render();}return null;}
      const j=await r.json();ses.at=j.access_token;ses.rt=j.refresh_token||ses.rt;ses.exp=j.expires_at||now()+(j.expires_in||3600);putSes();return ses.at;
    }catch(_){return null;}
  }
  async function authed(path,o){const t=await token();if(!t)throw new Error("sem sessão");o=o||{};o.token=t;return raw(path,o);}
  window.CLOUD={authed:authed,session:()=>ses}; /* usado por amigos.js */

  /* ---- entrar ---- */
  function errText(r,j){
    const m=String((j&&(j.msg||j.error_description||j.message))||"");
    if(r&&r.status===429||/rate|seconds/i.test(m))return "Aguarde um minuto antes de pedir outro código.";
    if(/not authorized/i.test(m))return "Este e-mail ainda não pode receber o código: o envio de e-mails do serviço está em modo de teste.";
    if(/invalid|expired|token/i.test(m))return "Código incorreto ou vencido. Peça um novo.";
    if(/sending|smtp|mail/i.test(m))return "O serviço não conseguiu enviar o e-mail (conferir a conexão do Gmail no Supabase). Detalhe: "+m.slice(0,140);
    return "Não consegui concluir"+(r?" (erro "+r.status+(m?": "+m.slice(0,140):"")+")":"")+". Confira a internet e o e-mail e tente de novo.";
  }
  async function requestCode(email){
    const r=await raw("/auth/v1/otp",{method:"POST",body:{email:email,create_user:true}});
    if(!r.ok){let j=null;try{j=await r.json();}catch(_){}throw new Error(errText(r,j));}
  }
  async function verify(email,code){
    const r=await raw("/auth/v1/verify",{method:"POST",body:{type:"email",email:email,token:code}});
    let j=null;try{j=await r.json();}catch(_){}
    if(!r.ok||!j||!j.access_token)throw new Error(errText(r,j));
    ses={at:j.access_token,rt:j.refresh_token,exp:j.expires_at||now()+(j.expires_in||3600),uid:j.user&&j.user.id,email:(j.user&&j.user.email)||email,ts:"",lh:""};
    putSes();
  }

  /* ---- progresso ---- */
  async function remoteGet(){
    const r=await authed("/rest/v1/progress?select=data,updated_at&user_id=eq."+ses.uid);
    if(!r.ok)throw new Error("get "+r.status);
    const a=await r.json();return a[0]||null;
  }
  async function remoteStamp(){
    const r=await authed("/rest/v1/progress?select=updated_at&user_id=eq."+ses.uid);
    if(!r.ok)throw new Error("stamp "+r.status);
    const a=await r.json();return a[0]?a[0].updated_at:"";
  }
  /* devolve "ok", "conflito" ou lança erro */
  async function remotePush(){
    const body=mine(),txt=JSON.stringify(body);
    if(txt.length>1900000)throw new Error("O progresso ficou grande demais para a nuvem.");
    let r,j;
    if(!ses.ts){
      r=await authed("/rest/v1/progress",{method:"POST",prefer:"return=representation",body:{user_id:ses.uid,data:body,app:APP_VERSION}});
      if(r.status===409)return "conflito";
    }else{
      r=await authed("/rest/v1/progress?user_id=eq."+ses.uid+"&updated_at=eq."+encodeURIComponent(ses.ts),{method:"PATCH",prefer:"return=representation",body:{data:body,app:APP_VERSION}});
    }
    if(!r.ok)throw new Error("push "+r.status);
    j=await r.json();
    if(!j.length)return "conflito";
    ses.ts=j[0].updated_at;ses.lh=hs(JSON.stringify(S));ses.at2=Date.now();putSes();
    return "ok";
  }
  function applyCloud(row){
    const o=Object.assign({},row.data,{rm:S.rm,wd:S.wd});
    ses.ts=row.updated_at;ses.lh="";putSes();
    try{localStorage.setItem(KEY,JSON.stringify(o));location.reload();}catch(_){say("O navegador não deixou gravar. Nada foi alterado.");}
  }
  const strip=o=>{const c=Object.assign({},o);delete c.rm;delete c.wd;delete c.bk;delete c.since;return JSON.stringify(c);};
  const same=d=>strip(d)===strip(S);
  function count(o){return Object.keys((o&&o.done)||{}).length;}
  function when(t){try{return new Date(t).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"});}catch(_){return "";}}
  function askConflict(row){
    if(conflictShown)return;conflictShown=true;
    openSheet("Progresso diferente na nuvem",
      '<p class="help">Este aparelho e a nuvem têm progressos diferentes. Escolha qual manter; o outro será substituído.</p>'+
      '<p class="help"><b>Neste aparelho:</b> '+count(S)+' lições concluídas.<br><b>Na nuvem:</b> '+count(row.data)+' lições concluídas (salvo em '+esc(when(row.updated_at))+').</p>'+
      '<div class="row"><button type="button" class="btn primary" id="cl-cloud">Usar o da nuvem</button><button type="button" class="btn" id="cl-local">Usar o deste aparelho</button></div>'+
      '<p class="help">Dica: se tiver dúvida, baixe um backup em Ajustes → Dados antes de escolher.</p>',false);
    window.__cloudRow=row;
  }
  /* o código aparece em grupos de 3 (482 917); espaços digitados ou colados são ignorados na hora de enviar */
  document.addEventListener("input",e=>{const t=e.target;if(!t||t.id!=="cl-code")return;const d=(t.value||"").replace(/\D/g,"").slice(0,8);t.value=d.replace(/(\d{3})(?=\d)/g,"$1 ");});
  document.addEventListener("click",async e=>{
    const t=e.target.closest&&e.target.closest("#cl-cloud,#cl-local");if(!t)return;
    const row=window.__cloudRow;if(!row)return;
    if(t.id==="cl-cloud"){applyCloud(row);return;}
    ses.ts=row.updated_at;putSes();
    try{const r=await remotePush();closeSheet();say(r==="ok"?"Progresso deste aparelho guardado na nuvem.":"A nuvem mudou de novo. Tente sincronizar outra vez.");}catch(_){say("Não consegui enviar agora. Tente de novo.");}
    conflictShown=false;render();
  });

  async function sync(manual,atBoot){
    if(!ses||busy)return;
    busy=true;
    try{
      const stamp=await remoteStamp(),changedLocal=hs(JSON.stringify(S))!==ses.lh;
      if(!stamp){const r=await remotePush();if(manual)say(r==="ok"?"Progresso guardado na nuvem.":"Tente de novo.");}
      else if(stamp===ses.ts){if(changedLocal){const r=await remotePush();if(r==="conflito"){const row=await remoteGet();if(row)askConflict(row);}else if(manual)say("Sincronizado.");}else if(manual)say("Tudo em dia.");}
      else{
        const row=await remoteGet();
        if(!changedLocal&&(atBoot||manual)&&!(typeof P!=="undefined"&&P&&!manual))applyCloud(row);
        else if(manual||atBoot||changedLocal)askConflict(row);
      }
      msg="";
    }catch(e){if(manual)say("Sem conexão ou o serviço não respondeu. Seu progresso continua salvo neste aparelho.");}
    finally{busy=false;render();}
  }
  window.cloudSync=sync;

  /* ---- ações da conta ---- */
  async function recordConsent(){
    try{await authed("/rest/v1/consents",{method:"POST",prefer:"resolution=merge-duplicates,return=minimal",body:{user_id:ses.uid,policy_version:PRIV_VER,age_ok:true}});}catch(_){}
  }
  async function afterLogin(){
    await recordConsent();
    let row=null;
    try{row=await remoteGet();}catch(_){}
    if(!row){await remotePush().catch(()=>{});say("Conta criada. Seu progresso foi guardado na nuvem.");}
    else if(!hasProgress())applyCloud(row);
    else if(same(row.data)){ses.ts=row.updated_at;ses.lh=hs(JSON.stringify(S));ses.at2=Date.now();putSes();say("Conectado. Seu progresso já estava igual ao da nuvem.");}
    else askConflict(row);
    render();
  }
  async function downloadMine(){
    try{
      const row=await remoteGet();
      const c=await authed("/rest/v1/consents?select=policy_version,age_ok,at&user_id=eq."+ses.uid);
      const o={email:ses.email,consentimento:c.ok?await c.json():[],progresso:row?row.data:null,salvo_em:row?row.updated_at:null};
      const blob=new Blob([JSON.stringify(o,null,1)],{type:"application/json"}),a=document.createElement("a");
      a.href=URL.createObjectURL(blob);a.download="litteraria-meus-dados-"+ymd()+".json";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),3000);
      say("Arquivo baixado: procure litteraria-meus-dados-"+ymd()+".json.");
    }catch(_){say("Não consegui baixar agora. Tente de novo.");}
  }
  async function deleteAccount(){
    try{
      const r=await authed("/rest/v1/rpc/delete_me",{method:"POST",body:{}});
      if(!r.ok)throw new Error(String(r.status));
      ses=null;putSes();closeSheet();render();say("Conta e dados da nuvem apagados. O progresso deste aparelho foi mantido.");
    }catch(_){say("Não consegui apagar agora. Tente de novo mais tarde.");}
  }

  /* ---- tela ---- */
  function box(){return $("#cloud-box");}
  function render(){
    const el=box();if(!el)return;
    const note=msg?'<p class="help" role="status">'+esc(msg)+"</p>":"";
    if(!ses){
      if(step==="code"){
        el.innerHTML='<p class="help">Enviamos um código de 6 números para <b>'+esc(pendEmail)+'</b>. Digite abaixo. Olhe também a caixa de spam.</p>'+
          '<input class="tin" id="cl-code" inputmode="numeric" autocomplete="one-time-code" maxlength="11" aria-label="Código recebido por e-mail" placeholder="000 000">'+
          '<div class="row" style="margin-top:8px"><button type="button" class="btn primary" id="cl-verify">Entrar</button><button type="button" class="btn" id="cl-back">Trocar e-mail</button></div>'+note;
      }else{
        el.innerHTML='<p class="help">A conta é opcional. Com ela, seu progresso fica guardado na nuvem: você recupera tudo se trocar de celular e pode usar em mais de um aparelho. Sem conta, o app continua igual, só neste aparelho.</p>'+
          '<input class="tin" id="cl-email" type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" aria-label="Seu e-mail" placeholder="seu@email.com">'+
          '<label class="chk"><input type="checkbox" id="cl-age"> Tenho 13 anos ou mais.</label>'+
          '<label class="chk"><input type="checkbox" id="cl-pol"> Li e concordo com a <a href="#" data-open-priv>Política de Privacidade</a>.</label>'+
          '<button type="button" class="btn primary wide" id="cl-send" style="margin-top:8px">Receber código por e-mail</button>'+note;
      }
      return;
    }
    el.innerHTML='<p class="help">Conectado como <b>'+esc(ses.email)+"</b>.<br>"+(ses.at2?"Última sincronização: "+esc(when(ses.at2))+".":"Ainda não sincronizado.")+"</p>"+
      '<button type="button" class="btn wide primary" id="cl-now">Sincronizar agora</button>'+
      '<button type="button" class="btn wide" id="cl-friends" style="margin-top:8px">Amigos (opcional)</button>'+
      '<button type="button" class="btn wide" id="cl-dl" style="margin-top:8px">Baixar meus dados</button>'+
      '<button type="button" class="btn wide" id="cl-out" style="margin-top:8px">Sair neste aparelho</button>'+
      '<button type="button" class="btn wide" id="cl-del" style="margin-top:8px">Apagar minha conta e dados</button>'+
      '<p class="help"><a href="#" data-open-priv>Política de Privacidade</a></p>'+note;
  }
  function mount(){
    if($("#sec-cloud"))return;
    const st=document.querySelectorAll("#s-profile .stack");
    if(!st.length)return;
    const d=document.createElement("section");d.id="sec-cloud";
    d.innerHTML='<h2 class="lab">Conta e backup na nuvem</h2><div id="cloud-box"></div>';
    st[st.length-1].appendChild(d);render();
  }
  document.addEventListener("click",async e=>{
    const t=e.target.closest&&e.target.closest("#cl-send,#cl-verify,#cl-back,#cl-now,#cl-friends,#cl-dl,#cl-out,#cl-del,#cl-del2,#cl-cancel");if(!t)return;
    if(t.id==="cl-send"){
      const em=($("#cl-email").value||"").trim().toLowerCase();
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)){msg="Confira o e-mail.";render();return;}
      if(!$("#cl-age").checked||!$("#cl-pol").checked){msg="Marque as duas caixas para continuar.";render();return;}
      t.disabled=true;
      try{await requestCode(em);pendEmail=em;step="code";msg="";putPend();}catch(er){msg=er.message;}
      render();return;
    }
    if(t.id==="cl-back"){step="email";msg="";pendEmail="";putPend();render();return;}
    if(t.id==="cl-verify"){
      const code=($("#cl-code").value||"").replace(/\D/g,"");
      if(code.length<6){msg="Digite o código completo, só os números.";render();return;}
      t.disabled=true;
      try{await verify(pendEmail,code);step="email";msg="";pendEmail="";putPend();await afterLogin();}catch(er){msg=er.message;render();}
      return;
    }
    if(t.id==="cl-now"){sync(true);return;}
    if(t.id==="cl-friends"){if(window.openFriends)openFriends();return;}
    if(t.id==="cl-dl"){downloadMine();return;}
    if(t.id==="cl-out"){if(window.cloudBeforeOut)await cloudBeforeOut();ses=null;putSes();step="email";msg="";render();say("Você saiu da conta neste aparelho. O progresso continua aqui.");return;}
    if(t.id==="cl-del"){openSheet("Apagar conta e dados",'<p class="help">Isso apaga o seu e-mail e todo o progresso guardado na nuvem. Não dá para desfazer. O progresso que está neste aparelho continua aqui.</p><div class="row"><button type="button" class="btn primary" id="cl-del2">Apagar tudo da nuvem</button><button type="button" class="btn" id="cl-cancel">Cancelar</button></div>',false);return;}
    if(t.id==="cl-del2"){deleteAccount();return;}
    if(t.id==="cl-cancel"){closeSheet();return;}
  });

  /* ---- sincronização automática ---- */
  let tm=null;
  const _sv=save;save=function(){const r=_sv.apply(this,arguments);if(ses){clearTimeout(tm);tm=setTimeout(()=>{if(ses&&hs(JSON.stringify(S))!==ses.lh)sync(false,false);},20000);}return r;};
  document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"&&ses&&bootDone)sync(false,false);});
  const _go5=go;go=function(n){_go5.apply(this,arguments);if(n==="profile")mount();};
  mount();
  setTimeout(()=>{bootDone=true;if(ses)sync(false,true);},2500);
  if(restored)setTimeout(()=>{ /* volta direto para onde a pessoa estava: o campo do código */
    try{go("profile");const b=box();if(b){let n=b.parentNode;while(n&&n.nodeType===1){if(n.tagName==="DETAILS")n.open=true;n=n.parentNode;}render();b.scrollIntoView({block:"center"});const c=$("#cl-code");if(c)c.focus();}}catch(_){}
  },900);
})();
