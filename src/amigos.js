/* ===== Amigos (opcional, v1.43) =====
   Só com conta. Tudo desligado até a pessoa ativar. Mostra só apelido + o que cada um escolher compartilhar (sequência, palavras, dias na semana, ícone, frase, nível, idiomas). Sem chat, sem foto enviada, sem busca: entra-se só por código. Bloquear, denunciar e sair.
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
      if(/friends_share2|friends_profile/i.test(m))throw new Error("O servidor ainda não tem a parte nova de Amigos (amigos2.sql).");
      if(/challenge_/i.test(m))throw new Error("O servidor ainda não tem o desafio semanal instalado (desafio.sql).");
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
  /* desafio semanal: lições concluídas de segunda a domingo (só o total; o dia a dia fica no aparelho) */
  function weekInfo(){
    const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));
    const mon=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
    let n=0;const w=S.wkd||{};Object.keys(w).forEach(k=>{if(k>=mon)n+=w[k]||0;});
    return {p_week:mon,p_pages:n};
  }
  const hasCh=()=>!!(lst&&lst.friends&&lst.friends.some(f=>f.ch&&f.ch.st==="on"));
  async function pushCh(){if(hasCh())await rpc("challenge_stats",weekInfo());}
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
  /* ícone, frase, nível e páginas concluídas por idioma (o servidor só guarda o que a pessoa deixou marcado) */
  function myProfile(){
    const langs={};Object.keys(S.done||{}).forEach(k=>{const l=k.split(":")[0];if(LNAME[l])langs[l]=(langs[l]||0)+1;});
    let lv=null;try{lv=window.gamLevel?gamLevel():null;}catch(_){}
    return {p_avatar:(S.avatar&&AVATARS[S.avatar])?S.avatar:null,p_motto:S.motto||"",p_level:lv,p_langs:langs};
  }
  async function pushStats(){if(!ses()||!on())return;try{await rpc("friends_stats",myStats());if(me&&(me.share_profile||me.share_langs))await rpc("friends_profile",myProfile());await pushCh();}catch(_){}syncSub();}
  async function load(){
    try{me=await rpc("friends_me");if(me){setOn(true);await pushStats();lst=await rpc("friends_list");if(hasCh()){try{await pushCh();lst=await rpc("friends_list");}catch(_){}}}else{setOn(false);lst=null;}msg="";}
    catch(e){msg=e.message;}
  }
  const h=s=>esc(String(s==null?"":s));
  const LORD=["fr","it","en"];
  function avt(f,size){
    const k=f.avatar,st='style="--av:'+size+'px"';
    if(k&&typeof AVATARS!=="undefined"&&AVATARS[k]&&/^[a-z]+$/.test(k))return '<span class="avatar" '+st+' aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+AVATARS[k]+"</svg></span>";
    return '<span class="avatar" '+st+' aria-hidden="true">'+h(String(f.nick||"?").trim().charAt(0).toUpperCase()||"?")+"</span>";
  }
  function ago(at){
    if(!at)return "";const d=Math.floor((Date.now()-new Date(at).getTime())/864e5);
    return d<=0?"ativo hoje":d===1?"ativo ontem":d<30?"ativo há "+d+" dias":"";
  }
  function chips(f){
    const c=[];
    if(f.level!=null)c.push('<span class="frc"><b>Nív. '+h(f.level)+"</b></span>");
    if(f.streak!=null)c.push('<span class="frc"><b>'+h(f.streak)+"</b> "+(f.streak===1?"dia":"dias")+" seguidos</span>");
    if(f.words!=null)c.push('<span class="frc"><b>'+h(f.words)+"</b> palavras</span>");
    if(f.week!=null)c.push('<span class="frc"><b>'+h(f.week)+"</b>/7 dias na semana</span>");
    return c.join("");
  }
  function langsLine(f){
    if(!f.langs||typeof f.langs!=="object")return "";
    const a=LORD.filter(l=>f.langs[l]>0).map(l=>"<b>"+h(LNAME[l])+"</b> "+h(f.langs[l])+" "+(f.langs[l]===1?"página":"páginas"));
    return a.length?'<div class="frl">Estuda: '+a.join(" · ")+"</div>":"";
  }
  function chBlock(f){
    const c=f.ch;if(!c)return "";const u=h(f.uid),nn=h(f.nick);
    if(c.st==="sent")return '<div class="frch">🏁 Desafio enviado a <b>'+nn+'</b>. Aguardando a resposta. <button type="button" class="btn" data-fr="che" data-u="'+u+'">Cancelar</button></div>';
    if(c.st==="recv")return '<div class="frch"><b>'+nn+'</b> te desafiou: quem conclui mais lições nesta semana (de segunda a domingo)? Só o total de lições aparece para os dois.<div class="row"><button type="button" class="btn primary" data-fr="cha" data-u="'+u+'">Aceitar</button><button type="button" class="btn" data-fr="che" data-u="'+u+'">Recusar</button></div></div>';
    const m=c.mine|0,t=c.theirs|0,lead=m>t?"Você está na frente":m<t?nn+" está na frente":"Empatados";
    let prev="";
    if(c.mine_prev!=null||c.theirs_prev!=null){const a=c.mine_prev|0,b=c.theirs_prev|0;prev='<div class="frl">Semana passada: você <b>'+a+"</b> × <b>"+b+"</b> "+nn+" · "+(a>b?"você venceu":a<b?nn+" venceu":"empate")+"</div>";}
    return '<div class="frch"><b>🏁 Desafio da semana</b><div class="frvs"><span><b>'+m+'</b><small>você</small></span><span class="frx" aria-hidden="true">×</span><span><b>'+t+'</b><small>'+nn+'</small></span></div><div class="frl">'+lead+'. Conta as lições concluídas de segunda a domingo.</div>'+prev+"</div>";
  }
  function friendCard(f){
    const none=!chips(f)&&!f.motto&&!langsLine(f);
    const u=h(f.uid),nn=h(f.nick);
    return '<article class="frcard"><div class="frtop">'+avt(f,48)+'<div class="frw"><b class="frn">'+nn+"</b>"+(f.motto?'<div class="frm">“'+h(f.motto)+"”</div>":"")+
      (ago(f.at)&&(f.streak!=null||f.words!=null)?'<small class="frs">'+h(ago(f.at))+"</small>":"")+"</div></div>"+
      (chips(f)?'<div class="frchips">'+chips(f)+"</div>":"")+langsLine(f)+(none?'<p class="help">Este amigo não compartilha detalhes.</p>':"")+chBlock(f)+
      '<div class="row"><button type="button" class="btn primary" data-fr="poke" data-u="'+u+'" aria-label="Cutucar '+nn+'">👋 Cutucar</button>'+(f.ch?"":'<button type="button" class="btn" data-fr="chp" data-u="'+u+'" aria-label="Desafiar '+nn+' na semana">🏁 Desafiar</button>')+
      '<details class="frmore"><summary class="btn">Mais</summary><div class="row">'+(f.ch&&f.ch.st==="on"?'<button type="button" class="btn" data-fr="chx" data-u="'+u+'">Encerrar desafio</button>':"")+'<button type="button" class="btn" data-fr="del" data-u="'+u+'">Remover</button><button type="button" class="btn" data-fr="blk" data-u="'+u+'">Bloquear</button><button type="button" class="btn" data-fr="rep" data-u="'+u+'">Denunciar</button></div></details></div></article>';
  }
  /* convite por link: ?amigo=CODIGO (guardado até a pessoa entrar/ativar; nunca envia sozinho) */
  const IK="mots-parole-invite";
  let inv="";
  try{
    const q=new URLSearchParams(location.search).get("amigo");
    if(q&&/^[A-Za-z0-9]{4,12}$/.test(q)){inv=q.toUpperCase();localStorage.setItem(IK,JSON.stringify({c:inv,t:Date.now()}));
      const u=new URL(location.href);u.searchParams.delete("amigo");history.replaceState(null,"",u.pathname+u.search+u.hash);}
    else{const o=JSON.parse(localStorage.getItem(IK)||"null");if(o&&/^[A-Z0-9]{4,12}$/.test(o.c||"")&&Date.now()-o.t<7*864e5)inv=o.c;else localStorage.removeItem(IK);}
  }catch(_){}
  window.__hasInvite=()=>!!inv;
  function inviteLink(){return location.origin+location.pathname.replace(/index\.html$/,"")+"?amigo="+encodeURIComponent(me.code);}
  function invNote(){return inv?'<p class="help" role="status"><b>Você recebeu um convite de amizade (código '+h(inv)+').</b> '+(me?"O código já está preenchido abaixo: confira e toque em «Enviar convite».":ses()?"Ative Amigos abaixo; depois o código já aparece preenchido para você enviar o convite.":"Entre na conta (e-mail e código) e ative Amigos; depois o código aparece preenchido.")+"</p>":"";}
  function view(){
    if(!ses())return invNote()+ '<p class="help">Para usar Amigos, primeiro entre na conta: Perfil → Conta e backup na nuvem.</p><button type="button" class="btn primary wide" id="fr-login">Ir para Conta e nuvem</button>';
    const note0=msg?'<p class="help" role="status"><b>'+h(msg)+"</b></p>":"";
    const note=invNote()+note0;
    if(!me){
      return '<p class="help">Amigos é opcional e começa desligado. Quando você ativar:</p><ul class="help"><li>Seus amigos veem o seu <b>apelido</b> e só os números que você deixar marcados.</li><li>Ninguém te encontra por busca: só entra quem tiver o seu <b>código</b>.</li><li>Não há chat, foto nem mensagens.</li><li>Você pode bloquear, denunciar e desativar quando quiser; desativar apaga seus convites e amizades.</li></ul>'+
        '<input class="tin" id="fr-nick" maxlength="20" autocomplete="off" aria-label="Apelido (2 a 20 letras)" placeholder="Apelido (não use seu nome completo)">'+
        '<label class="chk"><input type="checkbox" id="fr-s1"> Mostrar minha sequência de dias</label>'+
        '<label class="chk"><input type="checkbox" id="fr-s2"> Mostrar palavras acertadas e dias estudados na semana</label>'+
        '<label class="chk"><input type="checkbox" id="fr-s3"> Mostrar meu ícone, minha frase e meu nível</label>'+
        '<label class="chk"><input type="checkbox" id="fr-s4"> Mostrar os idiomas que estudo</label>'+
        '<button type="button" class="btn primary wide" id="fr-on" style="margin-top:8px">Ativar Amigos</button>'+note;
    }
    const L=lst||{friends:[],incoming:[],outgoing:[],blocked:[]};
    let o='<div class="frme">'+avt({nick:me.nick,avatar:S.avatar&&AVATARS[S.avatar]?S.avatar:null},56)+'<div class="frw"><b class="frn">'+h(me.nick)+"</b>"+(S.motto?'<div class="frm">“'+h(S.motto)+"”</div>":'<small class="frs">Sem frase. Escreva uma no Perfil.</small>')+"</div></div>"+note;
    if(L.incoming.length)o+='<h3 class="lab" style="margin-top:14px">Convites recebidos</h3>'+L.incoming.map(f=>'<div class="cad-row"><span>'+avt(f,32)+' <b>'+h(f.nick)+'</b></span><span><button type="button" class="btn primary" data-fr="acc" data-u="'+h(f.uid)+'">Aceitar</button> <button type="button" class="btn" data-fr="rej" data-u="'+h(f.uid)+'">Recusar</button> <button type="button" class="btn" data-fr="blk" data-u="'+h(f.uid)+'">Bloquear</button></span></div>').join("");
    o+='<h3 class="lab" style="margin-top:14px">Amigos ('+L.friends.length+')</h3>'+(L.friends.length?L.friends.map(friendCard).join(""):'<p class="help">Ainda sem amigos. Envie o seu código ou digite o de alguém em «Adicionar um amigo».</p>');
    if(L.outgoing.length)o+='<h3 class="lab" style="margin-top:14px">Convites enviados</h3>'+L.outgoing.map(f=>'<div class="cad-row"><span><b>'+h(f.nick)+'</b> · aguardando</span><button type="button" class="btn" data-fr="del" data-u="'+h(f.uid)+'">Cancelar</button></div>').join("");
    o+='<h3 class="lab" style="margin-top:14px">Adicionar um amigo</h3>'+
      '<input class="tin" id="fr-add" maxlength="12" autocapitalize="characters" autocomplete="off" aria-label="Código do amigo" placeholder="Código do amigo" value="'+h(inv)+'">'+
      '<button type="button" class="btn primary wide" id="fr-req" style="margin-top:8px">Enviar convite</button>'+
      '<h3 class="lab" style="margin-top:14px">Seu código de amigo</h3><p style="font-size:1.6rem;font-weight:800;letter-spacing:.12em;margin:4px 0" id="fr-code">'+h(me.code)+'</p>'+
      '<p class="help">Passe este código só para quem você quer como amigo.</p><div class="row"><button type="button" class="btn" id="fr-copy">Copiar código</button> <button type="button" class="btn primary" id="fr-share">Convidar por link</button> <button type="button" class="btn" id="fr-copylink">Copiar link</button></div><p class="help">O link abre o Litteraria com o seu código já preenchido. Quem recebe ainda precisa tocar em «Enviar convite» e você aceita depois.</p>'+
      '<details class="frset" style="margin-top:14px"><summary class="lab">O que meus amigos veem e preferências</summary>'+
      '<label class="chk"><input type="checkbox" id="fr-s1" '+(me.share_streak?"checked":"")+'> Minha sequência de dias</label>'+
      '<label class="chk"><input type="checkbox" id="fr-s2" '+(me.share_words?"checked":"")+'> Palavras acertadas e dias estudados na semana</label>'+
      '<label class="chk"><input type="checkbox" id="fr-s3" '+(me.share_profile?"checked":"")+'> Meu ícone, minha frase e meu nível (o ícone e a frase vêm do Perfil)</label>'+
      '<label class="chk"><input type="checkbox" id="fr-s4" '+(me.share_langs?"checked":"")+'> Os idiomas que estudo e quantas páginas concluí em cada um</label>'+
      '<label class="chk"><input type="checkbox" id="fr-poke" '+(me.poke_ok!==false?"checked":"")+'> Aceitar avisos dos amigos (cutucadas, convites e desafios)</label>'+
      (window.__pushOn?'<p class="help">Este aparelho está pronto para receber cutucadas.</p>':'<p class="help">Para receber cutucadas, ligue os lembretes com o app fechado em Ajustes → Lembretes e cartão. Sem isso, você ainda pode cutucar os outros.</p>')+
      '<p class="help">Apelido atual: <b>'+h(me.nick)+'</b>.</p></details>';
    if(L.blocked.length)o+='<h3 class="lab" style="margin-top:14px">Bloqueados</h3>'+L.blocked.map(f=>'<div class="cad-row"><span>'+h(f.nick)+'</span><button type="button" class="btn" data-fr="unb" data-u="'+h(f.uid)+'">Desbloquear</button></div>').join("");
    o+='<div class="row" style="margin-top:16px"><button type="button" class="btn" id="fr-refresh">Atualizar lista</button><button type="button" class="btn" id="fr-off">Desativar Amigos</button></div>'+
      '<p class="help">Denunciar bloqueia a pessoa e registra a denúncia para a criadora do app. Veja a <a href="#" data-open-priv>Política de Privacidade</a>.</p>';
    return o;
  }
  function paint(){const el=$("#fr-box");if(!el)return;const d=$(".frset"),was=d?d.open:false;el.innerHTML=view();const n=$(".frset");if(n&&was)n.open=true;}
  async function openFriends(){
    openSheet("Amigos",'<div id="fr-box"><p class="help">Carregando…</p></div>',false);
    if(ses())await load();paint();
  }
  window.openFriends=openFriends;
  /* aviso por notificação (convite, aceite, desafio): melhor esforço, em segundo plano; falhar nunca atrapalha a ação */
  function notify(kind,uid,code){
    try{CLOUD.authed("/functions/v1/poke",{method:"POST",body:{kind:kind,uid:uid||undefined,code:code||undefined}}).catch(()=>{});}catch(_){}
  }
  async function act(fn){
    if(busy)return;busy=true;
    try{await fn();msg=msg||"";}catch(e){msg=e.message;}
    busy=false;
    try{if(me)lst=await rpc("friends_list");}catch(_){}
    paint();
  }
  document.addEventListener("click",e=>{
    const t=e.target.closest&&e.target.closest("#fr-login,#fr-on,#fr-copy,#fr-share,#fr-copylink,#fr-req,#fr-off,#fr-refresh,[data-fr]");if(!t||!$("#fr-box")||!$("#fr-box").contains(t))return;
    if(t.id==="fr-login"){closeSheet();go("profile");const d=$("#sec-cloud");if(d){setTimeout(()=>d.scrollIntoView({block:"start"}),50);}return;}
    if(t.id==="fr-on")return act(async()=>{
      const nick=($("#fr-nick").value||"").trim(),s1=$("#fr-s1").checked,s2=$("#fr-s2").checked;
      await rpc("friends_enable",{p_nick:nick});await rpc("friends_share",{p_streak:s1,p_words:s2});
      if($("#fr-s3").checked||$("#fr-s4").checked)await rpc("friends_share2",{p_profile:$("#fr-s3").checked,p_langs:$("#fr-s4").checked});
      me=await rpc("friends_me");setOn(true);await pushStats();msg="Amigos ativado. Passe o seu código a quem você quiser como amigo.";
    });
    if(t.id==="fr-copy"){try{navigator.clipboard.writeText(me.code);msg="Código copiado.";}catch(_){msg="Não consegui copiar; selecione o código e copie.";}paint();return;}
    if(t.id==="fr-copylink"){try{navigator.clipboard.writeText(inviteLink());msg="Link copiado.";}catch(_){msg="Não consegui copiar o link.";}paint();return;}
    if(t.id==="fr-share"){
      const txt="Vem estudar idiomas comigo no Litteraria! Toque no link para me adicionar como amigo: "+inviteLink();
      if(navigator.share){navigator.share({text:txt}).catch(()=>{});}
      else window.open("https://wa.me/?text="+encodeURIComponent(txt),"_blank","noopener");
      return;
    }
    if(t.id==="fr-req")return act(async()=>{
      const c=($("#fr-add").value||"").trim();if(c.length<4){msg="Digite o código do amigo.";return;}
      const r=await rpc("friends_request",{p_code:c});
      if(r==="enviado")notify("invite",null,c);
      if(r!=="limite"&&r!=="nao_encontrado"){inv="";try{localStorage.removeItem(IK);}catch(_){}}
      msg={enviado:"Convite enviado. Quando a pessoa aceitar, ela aparece em «Amigos».",ja:"Vocês já estão conectados ou há um convite pendente.",nao_encontrado:"Não achei esse código. Confira com o seu amigo.",limite:"Você já tem muitos convites pendentes. Espere alguém responder."}[r]||"Pronto.";
    });
    if(t.id==="fr-refresh")return act(async()=>{await pushStats();msg="Lista atualizada.";});
    if(t.id==="fr-off")return act(async()=>{
      if(!confirm("Desativar Amigos? Seus convites e amizades serão apagados. O apelido e o código deixam de existir."))return;
      await rpc("friends_disable");me=null;lst=null;setOn(false);msg="Amigos desativado e dados apagados do servidor.";
    });
    const a=t.dataset.fr,u=t.dataset.u;
    if(a==="acc")return act(async()=>{await rpc("friends_respond",{p_uid:u,p_accept:true});notify("accepted",u);});
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
    if(a==="chp")return act(async()=>{const r=await rpc("challenge_propose",{p_uid:u});msg={enviado:"Desafio enviado. Ele só começa quando a pessoa aceitar.",ja:"Já existe um desafio com essa pessoa.",nao_amigo:"Vocês não estão mais conectados."}[r]||"Pronto.";
      if(r==="enviado")notify("challenge",u);
    });
    if(a==="cha")return act(async()=>{await rpc("challenge_respond",{p_uid:u,p_accept:true});notify("ch_ok",u);lst=await rpc("friends_list");await pushCh();msg="Desafio aceito! Vale a semana de segunda a domingo.";});
    if(a==="che")return act(async()=>{await rpc("challenge_end",{p_uid:u});msg="Pronto. Nada ficou guardado no servidor.";});
    if(a==="chx")return act(async()=>{if(!confirm("Encerrar o desafio? O total da semana de vocês dois é apagado do servidor."))return;await rpc("challenge_end",{p_uid:u});msg="Desafio encerrado e totais apagados do servidor.";});
    if(a==="unb")return act(()=>rpc("friends_unblock",{p_uid:u}));
    if(a==="rep")return act(async()=>{const m=prompt("Conte em poucas palavras o que aconteceu (opcional):","");if(m===null)return;await rpc("friends_report",{p_uid:u,p_reason:m});msg="Denúncia enviada e pessoa bloqueada.";});
  });
  document.addEventListener("change",e=>{
    const t=e.target;if(t&&t.id==="fr-poke"&&me){act(async()=>{await rpc("friends_pokes_set",{p_on:t.checked});me=await rpc("friends_me");msg="Preferência salva.";});return;}
    if(!t||!/^fr-s[1-4]$/.test(t.id)||!me)return;
    act(async()=>{
      if(t.id==="fr-s1"||t.id==="fr-s2")await rpc("friends_share",{p_streak:$("#fr-s1").checked,p_words:$("#fr-s2").checked});
      else await rpc("friends_share2",{p_profile:$("#fr-s3").checked,p_langs:$("#fr-s4").checked});
      me=await rpc("friends_me");await pushStats();msg="Preferência salva.";});
  });
  /* mantém os números atualizados enquanto o app é usado (no máximo uma vez por minuto) */
  let tm=null;
  const _sv=save;save=function(){const r=_sv.apply(this,arguments);if(on()&&ses()){clearTimeout(tm);tm=setTimeout(pushStats,60000);}return r;};
  document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")pushStats();});
})();

/* atalho na tela inicial: só aparece quando a conta na nuvem está configurada */
(function(){
  const b=$("#go-friends");if(!b)return;
  if(window.CLOUDCFG&&CLOUDCFG.url&&CLOUDCFG.key)b.hidden=false;
  b.addEventListener("click",()=>openFriends());
  if(window.__hasInvite&&window.__hasInvite()&&!b.hidden)setTimeout(()=>{if(!$("#fr-box"))openFriends();},1500);
})();
