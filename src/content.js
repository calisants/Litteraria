/* ===== Conteúdo do caderno: Volume 1 (jogos de palavras, gerado por tema e nível) ===== */
/* Cada página tem um id fixo (o sorteio usa uma semente), então "Cruzadas #1" é sempre a mesma página. */
const TYPES=[["cross","Palavras cruzadas","Cruzadas"],["search","Caça-palavras","Caça-palavras"],["connect","Conecte os grupos","Conecte"],["odd","O Intruso","Intruso"]];
const LVN={easy:"Fácil",classic:"Clássico",adv:"Avançado"};
const CATTXT=Object.fromEntries(CATS.map(c=>[c[0],c[1]]));
const GRPTXT=Object.fromEntries(GROUPS);
const LEVELS=["easy","classic","adv"];
function buildVol1(){
  const pages=[],cnt={};
  const add=p=>{cnt[p.type]=(cnt[p.type]||0)+1;p.n=cnt[p.type];pages.push(p);};
  ["cross","search"].forEach(t=>{
    CATS.forEach(c=>LEVELS.forEach(l=>add({id:t+"-"+c[0]+"-"+l,type:t,level:l,cat:c[0],themes:[c[0]],sub:c[1],meta:c[1]+" · "+LVN[l]})));
    LEVELS.forEach(l=>add({id:t+"-mix-"+l,type:t,level:l,cat:"all",themes:[],sub:"Mistura de temas",meta:"Mistura de temas · "+LVN[l]}));
  });
  GROUPS.concat([["all","Todos os temas"]]).forEach(g=>{
    const th=g[0]==="all"?[]:CATS.filter(c=>c[2]===g[0]).map(c=>c[0]);
    LEVELS.forEach(l=>[1,2,3].forEach(v=>add({id:"connect-"+g[0]+"-"+l+"-"+v,type:"connect",level:l,sec:g[0],themes:th,sub:g[1],meta:g[1]+" · "+LVN[l]+" · "+v})));
  });
  CATS.forEach(c=>add({id:"odd-"+c[0],type:"odd",main:c[0],cats:[c[0]],themes:[c[0]],sub:c[1],meta:c[1]}));
  [["comida","animais","cidade","roupas"],["corpo","casa","cores","verbos"],["familia","trabalho","clima","natureza"],[]].forEach((cs,i)=>add({id:"odd-mix-"+(i+1),type:"odd",cats:cs,themes:[],sub:"Mistura de temas",meta:cs.length?cs.map(k=>CATTXT[k]).join(", "):"Todos os temas"}));
  return pages;
}
const VOLUME={id:1,title:"Volume 2 · Jogos de palavras",types:TYPES,pages:buildVol1()};
const NB=" ";
const DIALOGS={
 fr:[
  [{s:"Bonjour, je voudrais un café, s'il vous plaît.",pt:"Bom dia, eu queria um café, por favor.",note:"«Je voudrais» (condicional de vouloir) é a forma educada de pedir algo."},
   {s:"Bien sûr, avec du lait"+NB+"?",pt:"Claro, com leite?",note:"«Du» = de + le: artigo partitivo, usado para quantidades que não se contam (du lait, de l'eau)."},
   {s:"Oui, avec un peu de lait.",pt:"Sim, com um pouco de leite.",note:"Depois de expressões de quantidade como «un peu», usa-se «de» sem artigo: un peu de lait."},
   {s:"Voilà, cela fait deux euros.",pt:"Aqui está, são dois euros.",note:"«Voilà» se diz ao entregar algo. Na França o serviço já vem incluído no preço, e a gorjeta é opcional."}],
  [{s:"Bonjour, je m'appelle Marie.",pt:"Bom dia, meu nome é Marie.",note:"«Je m'appelle» (literalmente «eu me chamo») é a forma padrão de dizer o nome."},
   {s:"Enchanté, je suis Paul.",pt:"Prazer, eu sou Paul.",note:"«Enchanté» vira «enchantée» quando quem fala é mulher. A pronúncia é a mesma, só a escrita muda."},
   {s:"Vous êtes de Paris"+NB+"?",pt:"O senhor é de Paris?",note:"«Vous» é o tratamento formal (e também o plural). Com amigos e crianças se usa «tu»."},
   {s:"Non, je viens du Brésil.",pt:"Não, eu venho do Brasil.",note:"Com «venir», países masculinos usam «du» (du Brésil); países femininos usam só «de» (de France)."}],
  [{s:"Excusez-moi, où est la gare"+NB+"?",pt:"Com licença, onde fica a estação?",note:"Na França é considerado educado dizer «Bonjour» antes de perguntar algo a um desconhecido."},
   {s:"Tout droit, puis à gauche.",pt:"Sempre em frente, depois à esquerda.",note:"«Tout droit» = em frente; «à gauche» e «à droite» = à esquerda e à direita. «Puis» liga as etapas."},
   {s:"C'est loin d'ici"+NB+"?",pt:"É longe daqui?",note:"«C'est» (ce + est) é muito usado para descrever: c'est loin, c'est bien. «D'ici» = de + ici."},
   {s:"Non, c'est à cinq minutes.",pt:"Não, é a cinco minutos.",note:"Distância em tempo se diz com «à» + tempo: à cinq minutes. «À pied» significa a pé."}],
  [{s:"Combien coûte cette chemise"+NB+"?",pt:"Quanto custa esta camisa?",note:"«Cette» é o demonstrativo feminino (cette chemise); o masculino é «ce» (ce pantalon)."},
   {s:"Elle coûte vingt euros.",pt:"Ela custa vinte euros.",note:"«Elle» substitui «la chemise» porque o substantivo é feminino: em francês os objetos também têm gênero."},
   {s:"Avez-vous une taille plus grande"+NB+"?",pt:"O senhor tem um tamanho maior?",note:"A inversão do verbo (avez-vous) deixa a pergunta mais formal. «Plus grande» é o comparativo: maior."},
   {s:"Oui, un instant, je regarde.",pt:"Sim, um momento, vou ver.",note:"O presente («je regarde») é muito usado para ações imediatas. «Un instant» = um momento."}]
 ],
 it:[
  [{s:"Buongiorno, vorrei un caffè, per favore.",pt:"Bom dia, eu queria um café, por favor.",note:"«Vorrei» (condicional de volere) é a forma educada de pedir. Na Itália, «un caffè» é um espresso, em geral tomado em pé no balcão."},
   {s:"Certo, con un po' di latte?",pt:"Claro, com um pouco de leite?",note:"«Un po'» é a forma abreviada de «un poco»; o apóstrofo marca a letra que caiu."},
   {s:"Sì, solo un goccio, grazie.",pt:"Sim, só um pingo, obrigado.",note:"«Goccio» é um pingo, muito usado para pequenas quantidades de líquido. «Sì» leva acento; sem acento, «si» é um pronome."},
   {s:"Ecco qua, sono due euro.",pt:"Aqui está, são dois euros.",note:"«Ecco» serve para apresentar ou entregar algo. «Euro» não muda no plural: due euro."}],
  [{s:"Buongiorno, mi chiamo Maria.",pt:"Bom dia, meu nome é Maria.",note:"«Mi chiamo» (eu me chamo) usa o verbo reflexivo chiamarsi."},
   {s:"Piacere, io sono Paolo.",pt:"Prazer, eu sou Paolo.",note:"«Piacere» significa literalmente «prazer». O pronome «io» costuma ser omitido; usá-lo dá ênfase."},
   {s:"Lei è di Roma?",pt:"A senhora é de Roma?",note:"«Lei» (formal) é o tratamento de respeito; com amigos se usa «tu»: sei di Roma?"},
   {s:"No, vengo dal Brasile.",pt:"Não, eu venho do Brasil.",note:"«Dal» = da + il. Com «venire da» usa-se «da»: vengo dal Brasile, vengo dall'Italia."}],
  [{s:"Scusi, dov'è la stazione?",pt:"Com licença, onde fica a estação?",note:"«Dov'è» = dove + è. «Scusi» é a forma formal de chamar a atenção; entre amigos, «scusa»."},
   {s:"Sempre dritto, poi a sinistra.",pt:"Sempre em frente, depois à esquerda.",note:"«Sempre dritto» = em frente; «a destra» e «a sinistra» = direita e esquerda."},
   {s:"È lontano da qui?",pt:"É longe daqui?",note:"«Lontano da» = longe de. O acento em «è» (verbo ser) o diferencia da conjunção «e» (e)."},
   {s:"No, è a cinque minuti.",pt:"Não, é a cinco minutos.",note:"Em italiano se diz «a cinque minuti» (a + tempo). «A piedi» significa a pé."}],
  [{s:"Quanto costa questa camicia?",pt:"Quanto custa esta camisa?",note:"«Questa» é o demonstrativo feminino (questa camicia); o masculino é «questo»."},
   {s:"Costa venti euro.",pt:"Custa vinte euros.",note:"Para o preço de um item usa-se «costa» (singular). Para vários itens, «costano»."},
   {s:"Ha una taglia più grande?",pt:"A senhora tem um tamanho maior?",note:"Sem pronome, «ha» soa neutro-formal. «Più grande» é o comparativo: più + adjetivo."},
   {s:"Sì, un attimo, controllo.",pt:"Sim, um momento, vou verificar.",note:"«Un attimo» é muito comum para «só um momento». O presente («controllo») é usado para ações imediatas."}]
 ],
 en:[
  [{s:"Hello, I would like a coffee, please.",pt:"Olá, eu queria um café, por favor.",note:"«I would like» é mais educado que «I want». Em inglês, «please» é quase obrigatório ao pedir algo."},
   {s:"Of course, with milk?",pt:"Claro, com leite?",note:"«Milk» é incontável, por isso não leva «a». Perguntas curtas assim são comuns em cafés."},
   {s:"Yes, with a little milk.",pt:"Sim, com um pouco de leite.",note:"«A little» vem com incontáveis (a little milk); «a few» vem com contáveis (a few biscuits)."},
   {s:"Here you are, that will be two pounds.",pt:"Aqui está, vai dar duas libras.",note:"«Here you are» se diz ao entregar algo. «That will be» é a forma comum de informar o total."}],
  [{s:"Hello, my name is Mary.",pt:"Olá, meu nome é Mary.",note:"Para o nome usa-se o verbo «to be»: «my name is». Também se diz «I am Mary»."},
   {s:"Nice to meet you, I am Paul.",pt:"Prazer em conhecer você, eu sou Paul.",note:"«Nice to meet you» se diz no primeiro encontro. Na fala é comum contrair: «I'm Paul»."},
   {s:"Are you from London?",pt:"Você é de Londres?",note:"Em perguntas com «to be», o verbo vem antes do sujeito. O inglês tem só «you», sem distinção entre «tu» e «senhor»."},
   {s:"No, I come from Brazil.",pt:"Não, eu venho do Brasil.",note:"«From» indica origem. Países geralmente não levam artigo em inglês: from Brazil, from Italy."}],
  [{s:"Excuse me, where is the station?",pt:"Com licença, onde fica a estação?",note:"«Excuse me» chama a atenção antes de uma pergunta; «sorry» serve mais para pedir desculpas."},
   {s:"Straight ahead, then turn left.",pt:"Siga em frente, depois vire à esquerda.",note:"«Turn left/right» é a instrução padrão. «Straight ahead» = em frente. «Then» marca a sequência."},
   {s:"Is it far from here?",pt:"É longe daqui?",note:"Em perguntas com «to be», o verbo vai para o início: «Is it...?». «It» funciona como sujeito neutro."},
   {s:"No, it is five minutes away.",pt:"Não, fica a cinco minutos.",note:"«Away» depois de um tempo indica distância: five minutes away. «On foot» significa a pé."}],
  [{s:"How much is this shirt?",pt:"Quanto custa esta camisa?",note:"«This» é para algo perto; «that» é para algo mais distante. «How much» é usado para preços."},
   {s:"It costs twenty pounds.",pt:"Custa vinte libras.",note:"No inglês britânico o preço é em «pounds» (libras); nos EUA, «dollars». O verbo «costs» leva -s na 3ª pessoa."},
   {s:"Do you have a bigger size?",pt:"Você tem um tamanho maior?",note:"«Bigger» é o comparativo curto de «big» (dobra o g e acrescenta -er). «Do you have...?» é a forma comum de perguntar se há algo."},
   {s:"Yes, one moment, I will check.",pt:"Sim, um momento, vou verificar.",note:"«I will» expressa uma decisão tomada na hora. É comum contrair: «I'll check»."}]
 ]
};
