/* ===== Construção de frases com frases dos livros (só livros de domínio público: Verne, Pinóquio, Alice).
   As frases em francês/italiano/inglês são copiadas do texto do livro (Projeto Gutenberg); a tradução e a nota são de Claude, sem fonte conferida.
   Páginas novas no fim do Volume 5; as lições antigas não mudam. Conferência: tools/chk_frases.py ===== */
const BOOKFRASES={
 verne:[
  {s:"Voici ce qui était arrivé.",pt:"Eis o que tinha acontecido.",note:"«Était arrivé» é o mais-que-perfeito: «être» no imperfeito + particípio (tinha acontecido)."},
  {s:"Nous achèterons en route.",pt:"Compraremos pelo caminho.",note:"O futuro simples tem terminação própria: acheter → achèterons (nous)."},
  {s:"Il ne pouvait parler!",pt:"Ele não conseguia falar!",note:"Negação com «ne» antes do verbo; «pas» pode ser omitido com «pouvoir» na escrita literária."},
  {s:"Un cri de terreur s'éleva.",pt:"Um grito de terror se ergueu.",note:"«S'éleva» é verbo reflexivo no passado simples (tempo de narrativa em livros)."},
  {s:"Les passagers débarquèrent aussitôt.",pt:"Os passageiros desembarcaram logo.",note:"«Débarquèrent» é o passado simples de «débarquer» (3ª pessoa do plural)."},
  {s:"La locomotive siffla vigoureusement.",pt:"A locomotiva apitou com força.",note:"Muitos advérbios em -ment vêm de adjetivos: vigoureux → vigoureusement."},
  {s:"Les yeux du guide brillèrent.",pt:"Os olhos do guia brilharam.",note:"«Du» = de + le: «os olhos do guia»."},
  {s:"Rangoon était à quai, et les passagers débarquaient.",pt:"O Rangoon estava no cais, e os passageiros desembarcavam.",note:"O imperfeito (était, débarquaient) descreve a cena ao fundo."},
  {s:"Oui, en quatre-vingts jours!",pt:"Sim, em oitenta dias!",note:"Em francês, 80 é «quatre-vingts» (quatro vezes vinte); o «s» some quando outro número vem depois."},
  {s:"Fix sentait son coeur bondir de joie.",pt:"Fix sentia o coração pular de alegria.",note:"«Sentir» + infinitivo: sentir o coração pular. «Son» é o possessivo de «coeur»."}],
 pinocchio:[
  {s:"Allora che cosa fa?",pt:"Então, o que ele faz?",note:"«Che cosa» = o que. O verbo «fa» (fare) vem depois, sem pronome sujeito."},
  {s:"Andiamo subito a casa.",pt:"Vamos já para casa.",note:"«Andiamo» serve para «nós vamos» e para «vamos!». «A casa» = para casa, sem artigo."},
  {s:"Voglio andare a trovarlo.",pt:"Quero ir encontrá-lo.",note:"O pronome «lo» gruda no fim do infinitivo (trovare → trovarlo)."},
  {s:"Vuoi venire con noi?",pt:"Você quer vir conosco?",note:"A pergunta tem a mesma ordem da afirmação; só muda a entonação e o «?»."},
  {s:"Quella voce era la voce di Geppetto.",pt:"Aquela voz era a voz de Gepeto.",note:"«Quella» (aquela) concorda com «voce», feminino. «Di» indica de quem é."},
  {s:"Io ti do venti soldi.",pt:"Eu te dou vinte soldos.",note:"O pronome «ti» (te) vem antes do verbo conjugado: ti do."},
  {s:"Pinocchio non ne poteva più.",pt:"Pinóquio não aguentava mais.",note:"«Non ne poteva più» é uma expressão pronta: não aguentar mais."},
  {s:"Dobbiamo ritentare la fuga.",pt:"Precisamos tentar a fuga de novo.",note:"O prefixo «ri-» dá ideia de repetir: tentare → ritentare."},
  {s:"E il mio babbo dove sarà?",pt:"E onde estará o meu papai?",note:"Em italiano o possessivo leva artigo: «il mio babbo». «Sarà» é futuro de essere e aqui expressa dúvida."},
  {s:"Oramai è tardi e voglio andare a letto.",pt:"Já é tarde e quero ir para a cama.",note:"«A letto» = para a cama, sem artigo, como «a casa»."}],
 alice:[
  {s:"Off with her head!",pt:"Cortem-lhe a cabeça!",note:"Ordem curta, sem verbo conjugado: «off with…» manda tirar/cortar algo."},
  {s:"Do cats eat bats?",pt:"Gatos comem morcegos?",note:"Perguntas no presente simples usam «do» antes do sujeito; o verbo fica no infinitivo (eat)."},
  {s:"I'm getting tired of this.",pt:"Estou ficando cansada disso.",note:"«Get» + adjetivo = ficar: getting tired. «I'm» = I am."},
  {s:"But I don't understand.",pt:"Mas eu não entendo.",note:"A negação do presente usa «don't» + verbo no infinitivo."},
  {s:"Silence all round, if you please!",pt:"Silêncio geral, por favor!",note:"«If you please» é uma forma antiga e educada de dizer «por favor»."},
  {s:"The first witness was the Hatter.",pt:"A primeira testemunha foi o Chapeleiro.",note:"«First» é um ordinal e vem antes do substantivo: the first witness."},
  {s:"How puzzling all these changes are!",pt:"Como todas essas mudanças são intrigantes!",note:"Em exclamações com «how», o verbo fica no fim: how puzzling … are!"},
  {s:"The Cat only grinned when it saw Alice.",pt:"O Gato só sorriu quando viu Alice.",note:"«Grinned» e «saw» são passados; «saw» é irregular (see → saw)."},
  {s:"I wish you were down here with me!",pt:"Queria que você estivesse aqui embaixo comigo!",note:"Depois de «I wish», usa-se «were» para um desejo irreal, mesmo com «you»."},
  {s:"Come away, my dears!",pt:"Venham, queridos!",note:"O imperativo é o próprio infinitivo: come. «Away» reforça o movimento."}]
};
(function(){
  BOOKS.forEach(b=>{
    const L=BOOKFRASES[b.id];if(!L)return;
    for(let k=0;k<2;k++)VOLUME3.pages.push({id:"frases-livro-"+b.id+"-"+(k+1),type:"frases",n:100+VOLUME3.pages.length,book:b.id,lines:L.slice(k*5,k*5+5),themes:["livro-"+b.id],langs:[b.lang],sub:b.name,meta:"Frases de «"+b.name+"» · "+(k+1)+" de 2"});
  });
})();
