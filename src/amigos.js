/* ===== Amigos (opcional, v1.43) =====
   Só com conta. Tudo desligado até a pessoa ativar. Mostra só apelido + o que cada um escolher compartilhar (sequência de dias,
   palavras acertadas, dias estudados nos últimos 7). Sem chat, sem foto, sem busca: entra-se só por código. Bloquear, denunciar e sair.
   Servidor: nuvem/amigos.sql (funções friends_*). O cliente só chama essas funções. */
(function(){
  const FK="mots-parole-friends";
  let me=null,lst=null,msg="",busy=false;
  const on=()=>{try{return localStorage.getItem(FK)==="1";}catch(_){return false;}};
  const setOn=v=>{try{if(v)localStorage.setItem(FK,"1");else localStorage.removeItem(FK);}catch(_){}};
  const ses=()=>window.CLOUD&&CLOUD.session();
  async function rpc(name,body){
    const r=await CLOUD.authed("/rest/v1/rpc/"+name,{method:"POST",body:body||{}});
    let j=null;try{j=await r.json();}catch(_){}
    if(!r.ok){const m=String((j&&(j.message||j.msg))||"");
      if(/Could not find the function|schema cache/i.test(m))throw new Error("O servidor ainda não tem a parte de Amigos instalada.");
      if(/apelido/i.test(m))throw new Error("O apelido precisa ter de 2 a 20 letras.");
      throw new Error("Não consegui agora (erro "+r.status+"). Tente de novo.");}
    return j;
  }
  /* números que a pessoa escolheu compartilhar */
  function myStats(){
    let words=0;for(const l in (S.sk||{}))words+=Object.keys(S.sk[l]||{}).length;
    const days=new Set((S.gam&&S.gam.days)||[]);let wk=0;const d=new Date();d.setHours(12,0,0,0);
    for(let i=0;i<7;i++){const t=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");if(days.has(t))wk++;d.setDate(d.getDate()-1);}
    let st=0;try{st=window.gamStreak?gamStreak().n:0;}catch(_){}
    return {p_streak:st,p_words:words,p_week:wk};
  }
  /* endereço de envio deste aparelho (para receber cutucadas); só enquanto Amigos estiver ativo e os lembretes com app fechado ligados */
  let lastEp="";
  async function getSub(){
    try{if(!("serviceWorker" in navigator)||!("PushManager" in window))return null;
      const reg=await Promise.race([navigator.serviceWorker.ready,new Promise((_,r)=>setTimeout(r,3000))]);
      return reg?await reg.pushManager.getSubscription():null;}catch(_){return null;}
  }
  async function syncSub(){
    if(!ses()||!on())return;
    try{
      const sub=await getSub();
      if(sub&&S.rm&&S.rm.on&&window.Notification&&Notification.permission==="granted"){
        const j=sub.toJSON();
        if(j.endpoint&&j.keys&&j.endpoint!==lastEp){await rpc("push_save",{p_endpoint:j.endpoint,p_p256dh:j.keys.p256dh,p_auth:j.keys.auth});lastEp=j.endpoint;}
      }else if(lastEp){await rpc("push_drop",{p_endpoint:lastEp});lastEp="";}
    }catch(_){}
  }
  window.cloudBeforeOut=async function(){if(!on())return;try{const sub=await getSub();if(sub)await rpc("push_drop",{p_endpoint:sub.endpoint});}catch(_){}lastEp="";};
  async function pushStats(){if(!ses()||!on())return;try{await rpc("friends_stats",myStats());}catch(_){}syncSub();}
  async function load(){
    try{me=await rpc("friends_me");if(me){setOn(true);await pushStats();lst=await rpc("friends_list");}else{setOn(false);lst=null;}msg="";}
    catch(e){msg=e.message;}
  }
  const h=s=>esc(String(s==null?"":s));
  function statsLine(f){
    const a=[];
    if(f.streak!=null)a.push(f.streak+(f.streak===1?" dia":" dias")+" seguidos");
    if(f.words!=null)a.push(f.words+" palavras acertadas");
    if(f.week!=null)a.push(f.week+" de 7 dias estudados");
    return a.length?a.join(" · "):"não compartilha números";
  }
  function view(){
    if(!ses())return '<p class="help">Para usar Amigos, primeiro entre na conta: Ajustes → Conta e nuvem.</p>';
    const note=msg?'<p class="help" role="status"><b>'+h(msg)+"</b></p>":"";
    if(!me){
      return '<p class="help">Amigos é opcional e começa desligado. Quando você ativar:</p><ul class="help"><li>Seus amigos veem o seu <b>apelido</b> e só os números que você deixar marcados.</li><li>Ninguém te encontra por busca: só entra quem tiver o seu <b>código</b>.</li><li>Não há chat, foto nem mensagens.</li><li>Você pode bloquear, denunciar e desativar quando quiser; desativar apaga seus convites e amizades.</li></ul>'+
        '<input class="tin" id="fr-nick" maxlength="20" autocomplete="off" aria-label="Apelido (2 a 20 letras)" placeholder="Apelido (não use seu nome completo)">'+
        '<label class="chk"><input type="checkbox" id="fr-s1"> Mostrar minha sequência de dias</label>'+
        '<label class="chk"><input type="checkbox" id="fr-s2"> Mostrar palavras acertadas e dias estudados na semana</label>'+
        '<button type="button" class="btn primary wide" id="fr-on" style="margin-top:8px">Ativar Amigos</button>'+note;
    }
    const L=lst||{friends:[],incoming:[],outgoing:[],blocked:[]};
    let o='<h3 class="lab">Seu código de amigo</h3><p style="font-size:1.6rem;font-weight:800;letter-spacing:.12em;margin:4px 0" id="fr-code">'+h(me.code)+'</p>'+
      '<p class="help">Passe este código só para quem você quer como amigo. Apelido atual: <b>'+h(me.nick)+'</b>.</p><div class="row"><button type="button" class="btn" id="fr-copy">Copiar código</button></div>'+
      '<h3 class="lab" style="margin-top:14px">O que meus amigos veem</h3>'+
      '<label class="chk"><input type="checkbox" id="fr-s1" '+(me.share_streak?"checked":"")+'> Minha sequência de dias</label>'+
      '<label class="chk"><input type="checkbox" id="fr-s2" '+(me.share_words?"checked":"")+'> Palavras acertadas e dias estudados na semana</label>'+
      '<label class="chk"><input type="checkbox" id="fr-poke" '+(me.poke_ok!==false?"checked":"")+'> Aceitar cutucadas dos amigos (um lembrete para estudar)</label>'+
      (window.__pushOn?'<p class="help">Este aparelho está pronto para receber cutucadas.</p>':'<p class="help">Para receber cutucadas, ligue os lembretes com o app fechado em Ajustes → Lembretes e cartão. Sem isso, você ainda pode cutucar os outros.</p>')+
      '<h3 class="lab" style="margin-top:14px">Adicionar um amigo</h3>'+
      '<input class="tin" id="fr-add" maxlength="12" autocapitalize="characters" autocomplete="off" aria-label="Código do amigo" placeholder="Código do amigo">'+
      '<button type="button" class="btn primary wide" id="fr-req" style="margin-top:8px">Enviar convite</button>';
    if(L.incoming.length)o+='<h3 class="lab" style="margin-top:14px">Convites recebidos</h3>'+L.incoming.map(f=>'<div class="cad-row"><span><b>'+h(f.nick)+'</b></span><span><button type="button" class="btn primary" data-fr="acc" data-u="'+h(f.uid)+'">Aceitar</button> <button type="button" class="btn" data-fr="rej" data-u="'+h(f.uid)+'">Recusar</button> <button type="button" class="btn" data-fr="blk" data-u="'+h(f.uid)+'">Bloquear</button></span></div>').join("");
    o+='<h3 class="lab" style="margin-top:14px">Amigos ('+L.friends.length+')</h3>'+(L.friends.length?L.friends.map(f=>'<div class="cad-row"><span><b>'+h(f.nick)+'</b><br><small>'+h(statsLine(f))+'</small></span><span><button type="button" class="btn primary" data-fr="poke" data-u="'+h(f.uid)+'" aria-label="Cutucar '+h(f.nick)+'">👋 Cutucar</button> <button type="button" class="btn" data-fr="del" data-u="'+h(f.uid)+'">Remover</button> <button type="button" class="btn" data-fr="blk" data-u="'+h(f.uid)+'">Bloquear</button> <button type="button" class="btn" data-fr="rep" data-u="'+h(f.uid)+'">Denunciar</button></span></div>').join(""):'<p class="help">Ainda sem amigos. Envie o seu código ou digite o de alguém acima.</p>');
    if(L.outgoing.length)o+='<h3 class="lab" style="margin-top:14px">Convites enviados</h3>'+L.outgoing.map(f=>'<div class="cad-row"><span><b>'+h(f.nick)+'</b> · aguardando</span><button type="button" class="btn" data-fr="del" data-u="'+h(f.uid)+'">Cancelar</button></div>').join("");
    if(L.blocked.length)o+='<h3 class="lab" style="margin-top:14px">Bloqueados</h3>'+L.blocked.map(f=>'<div class="cad-row"><span>'+h(f.nick)+'</span><button type="button" class="btn" data-fr="unb" data-u="'+h(f.uid)+'">Desbloquear</button></div>').join("");
    o+='<div class="row" style="margin-top:16px"><button type="button" class="btn" id="fr-refresh">Atualizar lista</button><button type="button" class="btn" id="fr-off">Desativar Amigos</button></div>'+
      '<p class="help">Denunciar bloqueia a pessoa e registra a denúncia para a criadora do app. Veja a <a href="#" data-open-priv>Política de Privacidade</a>.</p>'+note;
    return o;
  }
  function paint(){const el=$("#fr-box");if(el)el.innerHTML=view();}
  async function openFriends(){
    openSheet("Amigos",'<div id="fr-box"><p class="help">Carregando…</p></div>',false);
    if(ses())await load();paint();
  }
  window.openFriends=openFriends;
  async function act(fn){
    if(busy)return;busy=true;
    try{await fn();msg=msg||"";}catch(e){msg=e.message;}
    busy=false;
    try{if(me)lst=await rpc("friends_list");}catch(_){}
    paint();
  }
  document.addEventListener("click",e=>{
    const t=e.target.closest&&e.target.closest("#fr-on,#fr-copy,#fr-req,#fr-off,#fr-refresh,[data-fr]");if(!t||!$("#fr-box")||!$("#fr-box").contains(t))return;
    if(t.id==="fr-on")return act(async()=>{
      const nick=($("#fr-nick").value||"").trim(),s1=$("#fr-s1").checked,s2=$("#fr-s2").checked;
      await rpc("friends_enable",{p_nick:nick});await rpc("friends_share",{p_streak:s1,p_words:s2});
      me=await rpc("friends_me");setOn(true);await pushStats();msg="Amigos ativado. Passe o seu código a quem você quiser como amigo.";
    });
    if(t.id==="fr-copy"){try{navigator.clipboard.writeText(me.code);msg="Código copiado.";}catch(_){msg="Não consegui copiar; selecione o código e copie.";}paint();return;}
    if(t.id==="fr-req")return act(async()=>{
      const c=($("#fr-add").value||"").trim();if(c.length<4){msg="Digite o código do amigo.";return;}
      const r=await rpc("friends_request",{p_code:c});
      msg={enviado:"Convite enviado. Quando a pessoa aceitar, ela aparece em «Amigos».",ja:"Vocês já estão conectados ou há um convite pendente.",nao_encontrado:"Não achei esse código. Confira com o seu amigo.",limite:"Você já tem muitos convites pendentes. Espere alguém responder."}[r]||"Pronto.";
    });
    if(t.id==="fr-refresh")return act(async()=>{await pushStats();msg="Lista atualizada.";});
    if(t.id==="fr-off")return act(async()=>{
      if(!confirm("Desativar Amigos? Seus convites e amizades serão apagados. O apelido e o código deixam de existir."))return;
      await rpc("friends_disable");me=null;lst=null;setOn(false);msg="Amigos desativado e dados apagados do servidor.";
    });
    const a=t.dataset.fr,u=t.dataset.u;
    if(a==="acc")return act(()=>rpc("friends_respond",{p_uid:u,p_accept:true}));
    if(a==="rej")return act(()=>rpc("friends_respond",{p_uid:u,p_accept:false}));
    if(a==="del")return act(()=>rpc("friends_remove",{p_uid:u}));
    if(a==="blk")return act(async()=>{await rpc("friends_block",{p_uid:u});msg="Pessoa bloqueada.";});
    if(a==="poke")return act(async()=>{
      const r=await CLOUD.authed("/functions/v1/poke",{method:"POST",body:{uid:u}});
      let j=null;try{j=await r.json();}catch(_){}
      if(r.status===404){msg="A parte de cutucadas ainda não foi instalada no servidor.";return;}
      if(!r.ok||!j){msg="Não consegui cutucar agora. Tente de novo mais tarde.";return;}
      msg={ok:"Cutucada enviada! 👋",ja_hoje:"Você já cutucou essa pessoa hoje. Amanhã pode de novo.",recusa:"Esta pessoa não está recebendo cutucadas.",sem_aparelho:"Esta pessoa ainda não tem as notificações ligadas neste aparelho, então a cutucada não chegaria.",limite:"Essa pessoa já recebeu muitas cutucadas hoje. Tente amanhã.",nao_amigo:"Vocês não estão mais conectados.",falhou:"A notificação não saiu. Tente de novo mais tarde."}[j.status]||"Não consegui cutucar agora.";
    });
    if(a==="unb")return act(()=>rpc("friends_unblock",{p_uid:u}));
    if(a==="rep")return act(async()=>{const m=prompt("Conte em poucas palavras o que aconteceu (opcional):","");if(m===null)return;await rpc("friends_report",{p_uid:u,p_reason:m});msg="Denúncia enviada e pessoa bloqueada.";});
  });
  document.addEventListener("change",e=>{
    const t=e.target;if(t&&t.id==="fr-poke"&&me){act(async()=>{await rpc("friends_pokes_set",{p_on:t.checked});me=await rpc("friends_me");msg="Preferência salva.";});return;}
    if(!t||(t.id!=="fr-s1"&&t.id!=="fr-s2")||!me)return;
    act(async()=>{await rpc("friends_share",{p_streak:$("#fr-s1").checked,p_words:$("#fr-s2").checked});me=await rpc("friends_me");await pushStats();msg="Preferência salva.";});
  });
  /* mantém os números atualizados enquanto o app é usado (no máximo uma vez por minuto) */
  let tm=null;
  const _sv=save;save=function(){const r=_sv.apply(this,arguments);if(on()&&ses()){clearTimeout(tm);tm=setTimeout(pushStats,60000);}return r;};
  document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")pushStats();});
})();
