/* ===== Jogos novos (v1.72): «Parece, mas não é» (falsos amigos) e «Conversas com escolhas» =====
   Parece, mas não é: Volume 3 · Jogos. Pares conferidos em páginas abertas em 27/10/2026 (fonte na tela, por idioma); as opções erradas foram escolhidas por Claude.
   Conversas com escolhas: Volume 5 · Conversação. Diálogos escritos por Claude, sem fonte conferida (rótulo na tela). Nenhuma tradução antes da resposta. */
(function(){
  /* ---------- Parece, mas não é ---------- */
  const SRC={
    en:"Conferido: Infoescola, «Falsos cognatos» (infoescola.com/ingles/falsos-cognatos), página aberta em 27/10/2026.",
    fr:"Conferido: Cours et Fiches, «Faux amis» francês-português (cours-et-fiches.com), página aberta em 27/10/2026; só entraram os pares que fazem sentido para quem estuda francês.",
    it:"Conferido: Quero Bolsa, «35 falsos cognatos em italiano» (querobolsa.com.br), página aberta em 27/10/2026; só entraram os pares que conferem com o sentido usual."
  };
  /* [palavra, sentido real, parece com (falso amigo)] */
  const FA={
    en:[["actually","na verdade","atualmente"],["library","biblioteca","livraria"],["lunch","almoço","lanche"],["parents","pai e mãe","parentes"],["college","faculdade","colégio"],["expert","especialista","esperto"],
      ["novel","romance (livro)","novela"],["pretend","fingir","pretender"],["realize","perceber, dar-se conta","realizar"],["resume","retomar","resumir"],["support","apoiar","suportar"],["exit","saída","êxito"],
      ["lecture","palestra, aula","leitura"],["fabric","tecido","fábrica"],["injury","ferimento","injúria"],["balcony","sacada","balcão"],["eventually","finalmente, no fim","eventualmente"],["tax","imposto","taxa"],
      ["cigar","charuto","cigarro"],["prejudice","preconceito","prejuízo"],["stranger","desconhecido","estrangeiro"],["large","grande","largo"],["legend","lenda","legenda"],["mayor","prefeito","maior"]],
    fr:[["exquis","delicado, refinado","esquisito"],["pâtes","massa (macarrão)","pasta"],["procurer","proporcionar, fornecer","procurar"],["expert","especialista","esperto"],["prétendre","afirmar, alegar","pretender"],
      ["balcon","sacada","balcão"],["net","limpo","neto"],["taxe","imposto","taxa"],["accorder","conceder","acordar"]],
    it:[["cane","cão","cano"],["coppia","casal, par","cópia"],["birra","cerveja","birra (manha)"],["baffo","bigode","bafo"],["burro","manteiga","burro (o animal)"],["pregiudizio","preconceito","prejuízo"],
      ["squisito","delicioso","esquisito"],["appena","mal, assim que","apenas"],["cigno","cisne","signo"],["ragno","aranha","ranho"],["palestra","academia de ginástica","palestra (conferência)"],["feriale","dia útil","férias"]]
  };
  const cntV=t=>VOLUME.pages.filter(p=>p.type===t).length;
  VOLUME.types=VOLUME.types.concat([["parece","Parece, mas não é: falsos amigos","Parece, mas não é"]]);
  GAMENAME.parece="Parece, mas não é";STAGES.parece="#gstage";DOCKS.parece="none";GAMEFN.parece=startParece;
  ["fr","it","en"].forEach(lang=>{
    const L=FA[lang],n=Math.ceil(L.length/6);
    for(let i=0;i<n;i++){
      const part=L.slice(Math.round(i*L.length/n),Math.round((i+1)*L.length/n));
      VOLUME.pages.push({id:"parece-"+lang+"-"+(i+1),type:"parece",n:cntV("parece")+1,langs:[lang],themes:[],sub:"Falsos amigos",meta:"Falsos amigos · parte "+(i+1)+" de "+n,fa:part});
    }
  });
  let pc=null;
  function startParece(){
    seedNow();fitFn=null;
    const items=shuffle(P.fa.slice()).map(x=>{
      const others=shuffle(FA[S.lang].filter(y=>y[0]!==x[0]).map(y=>y[1]));
      return {w:x[0],real:x[1],trap:x[2],opts:shuffle([x[1],x[2],others[0]])};
    });
    pc={items:items,i:0,score:0,sel:null};renderParece();
  }
  function renderParece(){
    const it=pc.items[pc.i],a=pc.sel!==null;
    let h='<p class="ocount">'+(pc.i+1)+" de "+pc.items.length+" · acertos: "+pc.score+"</p>";
    h+='<p class="qz-s" style="font-size:1.6rem;text-align:center"><b>'+esc(it.w)+"</b> "+speakBtn(it.w)+'</p><p class="help" style="text-align:center">O que esta palavra significa? Cuidado: uma das opções é o falso amigo.</p>';
    h+='<div class="lopts">'+it.opts.map((o,i)=>'<button type="button" class="lopt long'+(a?(o===it.real?" right":(pc.sel===i?" wrong":"")):"")+'" data-pc="'+i+'"'+(a?" disabled":"")+">"+esc(o)+"</button>").join("")+"</div>";
    if(a){
      const ok=it.opts[pc.sel]===it.real;
      h+='<p class="note"><b>'+(ok?"Certo!":"Cuidado!")+"</b><br>«"+esc(it.w)+"» significa <b>"+esc(it.real)+"</b>, e não «"+esc(it.trap)+"».</p>";
      h+='<div class="row"><button type="button" class="btn primary" id="pc-next">'+(pc.i===pc.items.length-1?"Ver resultado":"Próxima")+"</button></div>";
    }
    h+='<p class="help">'+esc(SRC[S.lang])+" As opções erradas foram escolhidas por Claude.</p>";
    $("#gstage").innerHTML=h;
  }
  $("#gstage").addEventListener("click",ev=>{
    if(!P||P.type!=="parece"||!pc)return;
    const b=ev.target.closest("[data-pc]");
    if(b&&pc.sel===null){
      pc.sel=+b.dataset.pc;const it=pc.items[pc.i],ok=it.opts[pc.sel]===it.real;
      if(ok)pc.score++;
      bump();if(typeof gamAns==="function")gamAns(ok);sfx(ok?"ok":"bad");renderParece();return;
    }
    if(ev.target.closest("#pc-next")){
      if(pc.i<pc.items.length-1){pc.i++;pc.sel=null;renderParece();return;}
      markDone();sfx("done");
      openSheet("Página concluída: "+pc.score+" de "+pc.items.length+" certas",pc.items.map(it=>'<div class="srow"><span class="w">'+esc(it.w)+'</span><span class="pt">'+esc(it.real)+" (não é «"+esc(it.trap)+"»)</span>"+speakBtn(it.w)+"</div>").join("")+'<p class="help">'+esc(SRC[S.lang])+"</p>",true);
    }
  });
  window.__paState=()=>pc;window.__paData=FA;

  /* ---------- Conversas com escolhas ---------- */
  /* nó: {n: fala do outro, pt, o:[{s, pt, q (2 ótima, 1 serve, 0 estranha), w (por quê), to (índice do próximo nó)}]}; último nó sem «o» */
  const O=(s,pt,q,to,w)=>({s:s,pt:pt,q:q,to:to,w:w||""});
  const DL={
    fr:[
      {t:"No café",intro:"Você entra num café em Paris e vai ao balcão.",nodes:[
        {n:"Bonjour ! Qu'est-ce que je vous sers ?",pt:"Bom dia! O que posso servir?",o:[O("Un café, s'il vous plaît.","Um café, por favor.",2,1),O("Je voudrais un café et un croissant, s'il vous plaît.","Eu queria um café e um croissant, por favor.",2,2),O("Café !","Café!",0,1,"Seco demais: faltou «s'il vous plaît».")]},
        {n:"Très bien. Et avec ça ?",pt:"Muito bem. Mais alguma coisa?",o:[O("Non, merci, c'est tout.","Não, obrigada, é só.",2,3),O("Oui, un croissant, s'il vous plaît.","Sim, um croissant, por favor.",2,3),O("Je ne sais pas.","Não sei.",0,3,"Não responde à pergunta; ele quer saber se você quer mais algo.")]},
        {n:"Parfait. Vous mangez sur place ou à emporter ?",pt:"Perfeito. Vai comer aqui ou levar?",o:[O("Sur place, merci.","Aqui, obrigada.",2,3),O("À emporter, s'il vous plaît.","Para levar, por favor.",2,3),O("Oui.","Sim.",0,3,"A pergunta tem «ou»: «oui» não escolhe nenhuma das duas.")]},
        {n:"Voilà, ça fait trois euros cinquante.",pt:"Aqui está, dá 3,50 €."}]},
      {t:"Perguntando o caminho",intro:"Você está na rua e procura a estação de trem.",nodes:[
        {n:"Oui ? Je peux vous aider ?",pt:"Sim? Posso ajudar?",o:[O("Excusez-moi, où est la gare, s'il vous plaît ?","Com licença, onde fica a estação, por favor?",2,1),O("Gare ?","Estação?",0,2,"Só a palavra soa seco; comece com «Excusez-moi» ou «Pardon»."),O("Pardon, vous savez où est la gare ?","Desculpe, o senhor sabe onde fica a estação?",2,1)]},
        {n:"Allez tout droit, puis tournez à gauche. C'est à cinq minutes.",pt:"Siga em frente e depois vire à esquerda. É a cinco minutos.",o:[O("Merci beaucoup, bonne journée !","Muito obrigada, bom dia!",2,3),O("Tout droit, puis à gauche ? D'accord, merci.","Em frente e depois à esquerda? Certo, obrigada.",2,3),O("Quoi ?","O quê?",0,3,"«Quoi ?» é brusco. Para pedir de novo, use «Pardon ?» ou «Vous pouvez répéter ?».")]},
        {n:"Pardon ? Vous cherchez la gare ?",pt:"Como? O senhor procura a estação?",o:[O("Oui, s'il vous plaît.","Sim, por favor.",1,1,"Serve, mas «s'il vous plaît» soa estranho como resposta a uma pergunta."),O("Oui, pardon. Où est la gare ?","Sim, desculpe. Onde fica a estação?",2,1)]},
        {n:"De rien ! Bon voyage.",pt:"De nada! Boa viagem."}]},
      {t:"No hotel",intro:"Você chega ao hotel à noite.",nodes:[
        {n:"Bonsoir, vous avez une réservation ?",pt:"Boa noite, a senhora tem reserva?",o:[O("Oui, au nom de Silva.","Sim, em nome de Silva.",2,1),O("Non, mais je voudrais une chambre pour deux nuits.","Não, mas eu queria um quarto para duas noites.",2,2),O("Je suis fatiguée.","Estou cansada.",0,2,"É verdade, mas não responde: ele perguntou se há reserva.")]},
        {n:"Très bien. Votre passeport, s'il vous plaît.",pt:"Muito bem. Seu passaporte, por favor.",o:[O("Voilà mon passeport.","Aqui está meu passaporte.",2,3),O("Voici.","Aqui.",1,3,"Serve, mas é curto; «Voilà mon passeport» é mais completo."),O("Non.","Não.",0,3,"Ele pediu o passaporte; «non» soa como recusa.")]},
        {n:"Pas de problème. Une chambre simple ou double ?",pt:"Sem problema. Quarto de solteiro ou de casal?",o:[O("Double, s'il vous plaît.","De casal, por favor.",2,3),O("Simple, s'il vous plaît.","De solteiro, por favor.",2,3),O("Oui.","Sim.",0,3,"Pergunta com «ou»: escolha uma das duas.")]},
        {n:"Parfait. Voici votre clé : chambre douze, au deuxième étage.",pt:"Perfeito. Aqui está sua chave: quarto doze, no segundo andar."}]}
    ],
    it:[
      {t:"Al bar",intro:"Você entra num bar em Roma e vai ao balcão.",nodes:[
        {n:"Buongiorno! Cosa le servo?",pt:"Bom dia! O que posso servir?",o:[O("Un caffè, per favore.","Um café, por favor.",2,1),O("Vorrei un caffè e un cornetto, per favore.","Eu queria um café e um croissant, por favor.",2,2),O("Caffè!","Café!",0,1,"Seco demais: faltou «per favore».")]},
        {n:"Va bene. Altro?",pt:"Certo. Mais alguma coisa?",o:[O("No, grazie, basta così.","Não, obrigada, é só.",2,3),O("Sì, anche un cornetto, per favore.","Sim, também um croissant, por favor.",2,3),O("Non lo so.","Não sei.",0,3,"Não responde à pergunta; ele quer saber se você quer mais algo.")]},
        {n:"Perfetto. Lo prende qui o da portare via?",pt:"Perfeito. Toma aqui ou leva?",o:[O("Qui, grazie.","Aqui, obrigada.",2,3),O("Da portare via, per favore.","Para levar, por favor.",2,3),O("Sì.","Sim.",0,3,"A pergunta tem «o» (ou): «sì» não escolhe nenhuma das duas.")]},
        {n:"Ecco a lei. Sono tre euro e cinquanta.",pt:"Aqui está. São 3,50 €."}]},
      {t:"Perguntando o caminho",intro:"Você está na rua e procura a estação de trem.",nodes:[
        {n:"Sì? Posso aiutarla?",pt:"Sim? Posso ajudar?",o:[O("Scusi, dov'è la stazione, per favore?","Com licença, onde fica a estação, por favor?",2,1),O("Stazione?","Estação?",0,2,"Só a palavra soa seco; comece com «Scusi» ou «Mi scusi»."),O("Mi scusi, sa dov'è la stazione?","Desculpe, o senhor sabe onde fica a estação?",2,1)]},
        {n:"Vada sempre dritto, poi giri a sinistra. Sono cinque minuti a piedi.",pt:"Siga sempre em frente e depois vire à esquerda. São cinco minutos a pé.",o:[O("Grazie mille, buona giornata!","Muito obrigada, bom dia!",2,3),O("Dritto, poi a sinistra? Va bene, grazie.","Em frente e depois à esquerda? Certo, obrigada.",2,3),O("Cosa?","O quê?",0,3,"«Cosa?» é brusco. Para pedir de novo, use «Come?» ou «Può ripetere?».")]},
        {n:"Come? Cerca la stazione?",pt:"Como? O senhor procura a estação?",o:[O("Sì, per favore.","Sim, por favor.",1,1,"Serve, mas «per favore» soa estranho como resposta a uma pergunta."),O("Sì, scusi. Dov'è la stazione?","Sim, desculpe. Onde fica a estação?",2,1)]},
        {n:"Prego! Buon viaggio.",pt:"De nada! Boa viagem."}]},
      {t:"No hotel",intro:"Você chega ao hotel à noite.",nodes:[
        {n:"Buonasera, ha una prenotazione?",pt:"Boa noite, a senhora tem reserva?",o:[O("Sì, a nome Silva.","Sim, em nome de Silva.",2,1),O("No, ma vorrei una camera per due notti.","Não, mas eu queria um quarto para duas noites.",2,2),O("Sono stanca.","Estou cansada.",0,2,"É verdade, mas não responde: ele perguntou se há reserva.")]},
        {n:"Benissimo. Il passaporto, per favore.",pt:"Ótimo. O passaporte, por favor.",o:[O("Ecco il mio passaporto.","Aqui está meu passaporte.",2,3),O("Ecco.","Aqui.",1,3,"Serve, mas é curto; «Ecco il mio passaporto» é mais completo."),O("No.","Não.",0,3,"Ele pediu o passaporte; «no» soa como recusa.")]},
        {n:"Nessun problema. Camera singola o doppia?",pt:"Sem problema. Quarto de solteiro ou de casal?",o:[O("Doppia, per favore.","De casal, por favor.",2,3),O("Singola, per favore.","De solteiro, por favor.",2,3),O("Sì.","Sim.",0,3,"Pergunta com «o» (ou): escolha uma das duas.")]},
        {n:"Perfetto. Ecco la chiave: camera dodici, al secondo piano.",pt:"Perfeito. Aqui está a chave: quarto doze, no segundo andar."}]}
    ],
    en:[
      {t:"At the café",intro:"Você entra num café e vai ao balcão.",nodes:[
        {n:"Hi! What can I get you?",pt:"Oi! O que vai ser?",o:[O("A coffee, please.","Um café, por favor.",2,1),O("Could I have a coffee and a croissant, please?","Posso pedir um café e um croissant, por favor?",2,2),O("Coffee.","Café.",0,1,"Seco demais: faltou «please».")]},
        {n:"Sure. Anything else?",pt:"Claro. Mais alguma coisa?",o:[O("No, thanks, that's all.","Não, obrigada, é só.",2,3),O("Yes, a croissant too, please.","Sim, também um croissant, por favor.",2,3),O("I don't know.","Não sei.",0,3,"Não responde à pergunta; ele quer saber se você quer mais algo.")]},
        {n:"Great. For here or to go?",pt:"Ótimo. Para comer aqui ou levar?",o:[O("For here, thanks.","Aqui, obrigada.",2,3),O("To go, please.","Para levar, por favor.",2,3),O("Yes.","Sim.",0,3,"A pergunta tem «or» (ou): «yes» não escolhe nenhuma das duas.")]},
        {n:"Here you go. That's three fifty.",pt:"Aqui está. Dá 3,50."}]},
      {t:"Asking the way",intro:"Você está na rua e procura a estação de trem.",nodes:[
        {n:"Hi, can I help you?",pt:"Oi, posso ajudar?",o:[O("Excuse me, where is the station, please?","Com licença, onde fica a estação, por favor?",2,1),O("Station?","Estação?",0,2,"Só a palavra soa seco; comece com «Excuse me» ou «Sorry»."),O("Sorry, do you know where the station is?","Desculpe, você sabe onde fica a estação?",2,1)]},
        {n:"Go straight ahead, then turn left. It's about five minutes' walk.",pt:"Siga em frente e depois vire à esquerda. É uma caminhada de uns cinco minutos.",o:[O("Thanks a lot, have a nice day!","Muito obrigada, tenha um bom dia!",2,3),O("Straight, then left? Okay, thanks.","Em frente e depois à esquerda? Certo, obrigada.",2,3),O("What?","O quê?",0,3,"«What?» é brusco. Para pedir de novo, use «Sorry?» ou «Could you repeat that?».")]},
        {n:"Sorry? Are you looking for the station?",pt:"Como? Você procura a estação?",o:[O("Yes, please.","Sim, por favor.",1,1,"Serve, mas «please» soa estranho como resposta a uma pergunta."),O("Yes, sorry. Where is the station?","Sim, desculpe. Onde fica a estação?",2,1)]},
        {n:"No problem! Have a good trip.",pt:"Sem problema! Boa viagem."}]},
      {t:"At the hotel",intro:"Você chega ao hotel à noite.",nodes:[
        {n:"Good evening. Do you have a reservation?",pt:"Boa noite. Você tem reserva?",o:[O("Yes, under Silva.","Sim, em nome de Silva.",2,1),O("No, but I'd like a room for two nights.","Não, mas eu gostaria de um quarto para duas noites.",2,2),O("I'm tired.","Estou cansada.",0,2,"É verdade, mas não responde: ele perguntou se há reserva.")]},
        {n:"Great. Your passport, please.",pt:"Ótimo. Seu passaporte, por favor.",o:[O("Here's my passport.","Aqui está meu passaporte.",2,3),O("Here.","Aqui.",1,3,"Serve, mas é curto; «Here's my passport» é mais completo."),O("No.","Não.",0,3,"Ele pediu o passaporte; «no» soa como recusa.")]},
        {n:"No problem. A single or a double room?",pt:"Sem problema. Um quarto de solteiro ou de casal?",o:[O("A double, please.","De casal, por favor.",2,3),O("A single, please.","De solteiro, por favor.",2,3),O("Yes.","Sim.",0,3,"Pergunta com «or» (ou): escolha uma das duas.")]},
        {n:"Perfect. Here's your key: room twelve, second floor.",pt:"Perfeito. Aqui está a chave: quarto doze, segundo andar."}]}
    ]
  };
  VOLUME3.types=VOLUME3.types.concat([["conversa","Conversas com escolhas","Conversa"]]);
  GAMENAME.conversa="Conversas com escolhas";STAGES.conversa="#gstage";DOCKS.conversa="none";GAMEFN.conversa=startConversa;
  ["fr","it","en"].forEach((lang,li)=>{
    DL[lang].forEach((d,k)=>VOLUME3.pages.push({id:"conversa-"+lang+"-"+(k+1),type:"conversa",n:VOLUME3.pages.filter(p=>p.type==="conversa").length+1,langs:[lang],themes:[],sub:d.t,meta:"Conversa · "+d.t,dl:k}));
  });
  let cv=null;
  function startConversa(){
    seedNow();fitFn=null;
    const d=DL[S.lang][P.dl];
    cv={d:d,node:0,log:[],sel:null,pts:0,max:0};renderConversa();
  }
  function renderConversa(){
    const nd=cv.d.nodes[cv.node],a=cv.sel!==null;
    let h='<p class="help"><b>'+esc(cv.d.t)+"</b> · "+esc(cv.d.intro)+"</p>";
    h+=cv.log.map(l=>'<p class="note" style="margin:6px 0"><small>'+esc(l.n)+'</small><br><b>Você:</b> '+esc(l.s)+"</p>").join("");
    h+='<p class="qz-s"><b>'+esc(nd.n)+"</b> "+speakBtn(nd.n)+"</p>";
    if(!nd.o){
      const r=cv.pts/cv.max;
      h+='<p class="help">'+esc(nd.pt)+"</p>";
      h+='<p class="note"><b>Fim da conversa.</b> '+cv.pts+" de "+cv.max+" pontos. "+(r>=.99?"Tudo natural e educado!":r>=.6?"Boa conversa; veja as dicas acima para ficar ainda mais natural.":"Vale repetir: as dicas acima mostram o que soaria mais natural.")+"</p>";
      h+='<div class="row"><button type="button" class="btn primary" id="cv-end">Concluir</button></div>';
    }else{
      h+='<p class="help">Escolha sua resposta:</p><div class="lopts">'+nd.o.map((o,i)=>'<button type="button" class="lopt long'+(a?(i===cv.sel?(o.q===0?" wrong":" right"):(o.q===2?" right":"")):"")+'" data-cv="'+i+'"'+(a?" disabled":"")+">"+esc(o.s)+"</button>").join("")+"</div>";
      if(a){
        const o=nd.o[cv.sel];
        h+='<p class="note"><b>'+(o.q===2?"Natural e educado!":o.q===1?"Serve.":"Soa estranho.")+"</b> "+esc(o.pt)+(o.w?"<br>"+esc(o.w):"")+"<br><small>Ele disse: "+esc(nd.pt)+"</small></p>";
        h+='<div class="row"><button type="button" class="btn primary" id="cv-next">Continuar</button></div>';
      }
    }
    h+='<p class="help">Diálogo escrito por Claude, sem fonte conferida. Traduções também.</p>';
    $("#gstage").innerHTML=h;
  }
  $("#gstage").addEventListener("click",ev=>{
    if(!P||P.type!=="conversa"||!cv)return;
    const b=ev.target.closest("[data-cv]");
    if(b&&cv.sel===null){
      cv.sel=+b.dataset.cv;const o=cv.d.nodes[cv.node].o[cv.sel];
      cv.pts+=o.q;cv.max+=2;bump();if(typeof gamAns==="function")gamAns(o.q>0);sfx(o.q>0?"ok":"bad");renderConversa();return;
    }
    if(ev.target.closest("#cv-next")){
      const nd=cv.d.nodes[cv.node],o=nd.o[cv.sel];
      cv.log.push({n:nd.n,s:o.s});cv.node=o.to;cv.sel=null;renderConversa();
      const n2=cv.d.nodes[cv.node];if(n2&&!n2.o){/* última fala fica só na tela */}
      return;
    }
    if(ev.target.closest("#cv-end")){
      markDone();sfx("done");
      openSheet("Conversa concluída: "+cv.pts+" de "+cv.max,cv.log.map(l=>'<div class="srow"><span class="pt"><small>'+esc(l.n)+"</small><br><b>"+esc(l.s)+"</b></span>"+speakBtn(l.s)+"</div>").join("")+'<p class="help">Diálogo escrito por Claude, sem fonte conferida.</p>',true);
    }
  });
  window.__cvState=()=>cv;window.__cvData=DL;
})();
