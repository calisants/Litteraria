/* ===== Construção de frases com frases dos livros (só livros de domínio público: Verne, Pinóquio, Alice, Peter Rabbit, O Vento nos Salgueiros, Sherlock Holmes, Frankenstein, Os Três Mosqueteiros, O Príncipe, A Divina Comédia; nunca O Pequeno Príncipe).
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
  {s:"Come away, my dears!",pt:"Venham, queridos!",note:"O imperativo é o próprio infinitivo: come. «Away» reforça o movimento."}],
 peter:[
  {s:"Once upon a time there were four little Rabbits",pt:"Era uma vez quatro coelhinhos",note:"«There were» (havia) fica no plural porque «four little Rabbits» é plural; no singular seria «there was»."},
  {s:"They lived with their Mother in a sand-bank",pt:"Eles moravam com a mãe num banco de areia",note:"«Lived» é o passado simples (live + d). «Their» (deles) vem antes do substantivo: their Mother."},
  {s:"Now run along, and don't get into mischief.",pt:"Agora vão andando e não se metam em travessuras.",note:"«Don't» + verbo no infinitivo dá a ordem negativa: don't get. «Run along» é um verbo com partícula (phrasal verb) que manda alguém ir embora."},
  {s:"She only shook her head at him.",pt:"Ela só balançou a cabeça para ele.",note:"«Shook» é o passado irregular de «shake». «Only» fica antes do verbo, como em «só balançou»."},
  {s:"First he ate some lettuces and some French beans",pt:"Primeiro ele comeu algumas alfaces e algumas vagens",note:"«Ate» é o passado irregular de «eat». «Some» (alguns/algumas) aparece em frases afirmativas com plural. «French beans» são vagens."},
  {s:"He was put in a pie by Mrs. McGregor.",pt:"Ele foi colocado numa torta pela Sra. McGregor.",note:"Voz passiva: was + particípio (put). Quem faz a ação vem depois de «by»."},
  {s:"Mr. McGregor came up with a sieve",pt:"O Sr. McGregor chegou perto com uma peneira",note:"«Came» é o passado irregular de «come». «Come up» = aproximar-se; «with a sieve» diz o que ele trazia."},
  {s:"Peter was most dreadfully frightened",pt:"Peter ficou terrivelmente assustado",note:"«Most dreadfully» é um jeito literário de dizer «muito». «Frightened» (assustado) é adjetivo e vem depois de «was»."},
  {s:"Peter scuttered underneath the bushes.",pt:"Peter correu apressado por baixo dos arbustos.",note:"«Scuttered» (andou depressa, com passinhos curtos) é uma palavra rara. «Underneath» = por baixo de."},
  {s:"Peter began to cry.",pt:"Peter começou a chorar.",note:"«Began» é o passado irregular de «begin». Depois de «began» vem «to» + infinitivo."}],
 wind:[
  {s:"The Mole had been working very hard all the morning",pt:"A Toupeira vinha trabalhando muito durante toda a manhã",note:"«Had been working» é o passado perfeito contínuo: uma ação que vinha acontecendo antes de outro momento do passado."},
  {s:"Do you know, I've never been in a boat before in all my life.",pt:"Sabe, eu nunca estive num barco em toda a minha vida.",note:"«I've never been» (present perfect) fala de experiência de vida; «never» fica entre «have» e o particípio."},
  {s:"It's never the wrong time to call on Toad.",pt:"Nunca é hora errada para visitar o Sapo.",note:"«Call on» é um phrasal verb: fazer uma visita a alguém. «It's» = it is."},
  {s:"Finest house on the whole river",pt:"A melhor casa de todo o rio",note:"«Finest» é o superlativo de «fine». O verbo e o artigo foram omitidos, como numa fala empolgada."},
  {s:"Hold on a bit!",pt:"Espere um pouquinho!",note:"«Hold on» = esperar; «a bit» = um pouco."},
  {s:"What was to be done?",pt:"O que havia para ser feito?",note:"«Was to be done» é voz passiva com «to»: o que devia ser feito."},
  {s:"Why didn't you invite me, Ratty?",pt:"Por que você não me convidou, Ratty?",note:"Pergunta no passado negativo: didn't + verbo no infinitivo (invite). O pronome «me» vem depois do verbo."},
  {s:"Come inside and look at the arrangements.",pt:"Entre e dê uma olhada nos preparativos.",note:"Duas ordens ligadas por «and»: come … and look. «Look at» = olhar para."},
  {s:"It was a golden afternoon.",pt:"Era uma tarde dourada.",note:"«It was» abre descrições no passado; o adjetivo «golden» vem antes do substantivo."},
  {s:"half so much worth doing as simply messing about in boats",pt:"nem de longe tão digno de ser feito quanto simplesmente passear à toa de barco",note:"É o final da fala mais famosa do Rato. «Half so much … as» = nem metade tanto quanto; «messing about» = fazer coisas sem pressa e sem objetivo."}],
 sherlock:[
  {s:"You see, but you do not observe.",pt:"Você vê, mas não observa.",note:"Negativa do presente: «do not» + infinitivo (observe). «See» é ver sem prestar atenção; «observe» é reparar."},
  {s:"She is always the woman.",pt:"Ela é sempre a mulher.",note:"Frase do primeiro capítulo, sobre Irene Adler. «Always» fica depois do verbo «to be»: is always."},
  {s:"It is a capital mistake to theorise before one has data.",pt:"É um erro capital teorizar antes de ter dados.",note:"«It is … to + verbo» dá a opinião e depois o que ela julga. «Theorise» é a grafia britânica (a americana é «theorize»). «One» é um pronome formal: a gente."},
  {s:"I have no data yet.",pt:"Ainda não tenho dados.",note:"«No» + substantivo nega: I have no data = I don't have any data. «Yet» no fim de frase negativa = ainda."},
  {s:"This is very interesting.",pt:"Isso é muito interessante.",note:"«Very» intensifica adjetivos («very interesting»); não se usa com verbos."},
  {s:"What could it be?",pt:"O que poderia ser?",note:"«Could» = poderia, numa hipótese. Na pergunta ele vem antes do sujeito: could it."},
  {s:"Stay where you are.",pt:"Fique onde está.",note:"Ordem sem sujeito (imperativo). «Where you are» é uma oração dentro da frase: o verbo «are» fica no fim."},
  {s:"You must not interfere, come what may.",pt:"Você não deve interferir, aconteça o que acontecer.",note:"«Must not» = proibição. «Come what may» é expressão pronta: aconteça o que acontecer."},
  {s:"I am at my wit's end.",pt:"Estou sem saber mais o que fazer.",note:"«At my wit's end» é expressão pronta (sem saber mais o que fazer); não se traduz palavra por palavra."},
  {s:"Now, what did you gather from that woman's appearance?",pt:"Agora, o que você deduziu da aparência daquela mulher?",note:"Pergunta no passado: did + sujeito + verbo no infinitivo (gather). «Woman's» com 's mostra posse."}],
 frank:[
  {s:"It was on a dreary night of November",pt:"Foi numa noite sombria de novembro",note:"«It was … that» destaca a informação: foi numa noite … que. «Dreary» = triste, sombrio. Em inglês os meses levam maiúscula."},
  {s:"I beheld the wretch",pt:"Contemplei o miserável",note:"«Beheld» é o passado de «behold» (ver, contemplar), palavra literária e antiga; hoje se usa «saw»."},
  {s:"Nothing is so painful to the human mind as a great and sudden change.",pt:"Nada é tão doloroso para a mente humana quanto uma mudança grande e repentina.",note:"«So … as» compara: tão … quanto. «Nothing» já é negativo, por isso o verbo fica afirmativo (is)."},
  {s:"I am malicious because I am miserable.",pt:"Sou malvado porque sou infeliz.",note:"«Because» liga a causa. Cuidado: «miserable» é infeliz, não só «miserável» no sentido de pobre."},
  {s:"I ought to be thy Adam",pt:"Eu deveria ser o teu Adão",note:"«Ought to» = deveria; vem com «to» + infinitivo. «Thy» é a forma antiga de «your»."},
  {s:"I was benevolent and good; misery made me a fiend.",pt:"Eu era bondoso e bom; a infelicidade fez de mim um demônio.",note:"«Made me a fiend»: «make» + pessoa + substantivo = transformar em. «Made» é o passado irregular de «make»."},
  {s:"Remember that I am thy creature",pt:"Lembra-te de que sou a tua criatura",note:"Imperativo (remember) + «that» introduzindo o que se deve lembrar."},
  {s:"Beware, for I am fearless and therefore powerful.",pt:"Cuidado, pois não tenho medo e por isso sou poderoso.",note:"«For» aqui é uma forma antiga de «because» (pois). «Therefore» = por isso. «Fearless» = sem (-less) medo (fear)."},
  {s:"I wept like a child.",pt:"Chorei como uma criança.",note:"«Wept» é o passado irregular de «weep» (chorar, mais literário que «cry»). «Like» + substantivo compara."},
  {s:"What a divine day!",pt:"Que dia divino!",note:"Exclamação: what + a + adjetivo + substantivo. O «a» não pode faltar com substantivo contável no singular."}],
 musq:[
  {s:"Le premier lundi du mois d'avril",pt:"Na primeira segunda-feira do mês de abril",note:"Em francês, dias da semana e meses não levam maiúscula. «Du» = de + le: du mois = do mês. «Premier» é masculino, como «lundi»."},
  {s:"Tous pour un, un pour tous",pt:"Todos por um, um por todos",note:"É o lema dos mosqueteiros. «Pour» = por, para. Não há verbo: o lema é só a frase curta."},
  {s:"En garde donc, monsieur, en garde!",pt:"Em guarda, então, senhor, em guarda!",note:"«En garde» é o grito da esgrima: assumir posição de combate. «Donc» (então) reforça a ordem."},
  {s:"Partez, partez vite!",pt:"Partam, partam depressa!",note:"Imperativo de «partir» para «vous»: partez. «Vite» é advérbio (depressa) e não muda."},
  {s:"L'épée au fourreau, messieurs!",pt:"A espada na bainha, senhores!",note:"«Au» = à + le: au fourreau = na bainha (le fourreau). A ordem não tem verbo."},
  {s:"Voilà qui est ingénieux, dit Athos.",pt:"Isso é engenhoso, disse Athos.",note:"«Voilà» (eis aí) aponta algo. No diálogo, o verbo de fala vem depois: dit Athos (sujeito depois do verbo)."},
  {s:"Le jeune homme se tint dans l'ombre et attendit.",pt:"O jovem ficou na sombra e esperou.",note:"«Se tint» e «attendit» estão no passado simples, tempo de narrativa em livros. «Se tenir» é reflexivo: o «se» vem antes do verbo."},
  {s:"D'Artagnan revint sur ses pas.",pt:"D'Artagnan voltou sobre os próprios passos.",note:"«Revint» é o passado simples de «revenir» (voltar). «Sur ses pas» = pelo mesmo caminho."},
  {s:"Ainsi, au revoir, mon cher Athos.",pt:"Assim, até logo, meu caro Athos.",note:"«Mon cher» é masculino porque Athos é homem; para uma mulher seria «ma chère»."},
  {s:"Mais qu'est-il arrivé après mon départ?",pt:"Mas o que aconteceu depois da minha partida?",note:"«Qu'est-il arrivé» é pergunta com inversão: verbo + pronome. «Est arrivé» é passé composé com «être». «Après» = depois de."}],
 principe:[
  {s:"Di quante ragioni sieno e principati e in che modo si acquistino",pt:"De quantos tipos são os principados e de que modo se conquistam",note:"Título do capítulo I, em italiano do século XVI. «Sieno» = siano (sejam). «E principati» = i principati: o «e» antigo fazia o papel do artigo «i». «Ragioni» aqui = tipos, espécies."},
  {s:"De' Principati ereditari",pt:"Dos principados hereditários",note:"Título do capítulo II. «De'» = dei (dos), forma antiga cortada. «Ereditari» (hereditários) concorda com «principati» (plural masculino)."},
  {s:"De' Principati misti",pt:"Dos principados mistos",note:"Título do capítulo III. «Misti» é o plural masculino de «misto» (misturado). Em italiano, «principato» (reino de um príncipe) é masculino."},
  {s:"Di quelli che per scelleratezze sono pervenuti al principato",pt:"Daqueles que chegaram ao principado por crimes",note:"Título do capítulo VIII. «Pervenuti» (chegaram) é particípio com «essere»: sono pervenuti. «Quelli che» = aqueles que. «Scelleratezze» = atos malvados, crimes."},
  {s:"Del Principato civile",pt:"Do principado civil",note:"Título do capítulo IX. «Del» = di + il. Aqui «civile» significa que o poder vem do apoio dos cidadãos."},
  {s:"In che modo si debbino misurare le forze di tutti i principati",pt:"De que modo se devem medir as forças de todos os principados",note:"Título do capítulo X. «Debbino» é forma antiga de «debbano» (devam). «Si debbino misurare» é o «se» impessoal: se devem medir."},
  {s:"Di quante ragioni sia la milizia, e de' soldati mercenari",pt:"De quantos tipos é a milícia, e dos soldados mercenários",note:"Título do capítulo XII. «Sia» é «seja» (subjuntivo). «De'» = dei (dos). «Soldati mercenari» = soldados pagos para lutar."},
  {s:"Quel che s'appartenga a un Principe circa la milizia",pt:"O que cabe a um Príncipe quanto à milícia",note:"Título do capítulo XIV. «S'appartenga» é «si appartenga» (subjuntivo de «appartenere»: caber a). «Circa» = a respeito de."},
  {s:"Della liberalità e parsimonia",pt:"Da liberalidade e da parcimônia",note:"Título do capítulo XVI. «Della» = di + la. Cuidado: «liberalità» é generosidade, não «liberalismo»."},
  {s:"s'elli è meglio esser amato che temuto, o più tosto temuto che amato",pt:"se é melhor ser amado do que temido, ou antes temido do que amado",note:"Parte do título do capítulo XVII, a pergunta mais famosa de Machiavelli. «S'elli» = se egli (se é); «esser» = essere sem o «e»; «più tosto» = antes, de preferência."}],
 dante:[
  {s:"Nel mezzo del cammin di nostra vita",pt:"No meio do caminho da nossa vida",note:"Verso de abertura da Divina Comédia. «Nel» = in + il. «Cammin» é «cammino» cortado (poesia). «Di nostra vita» sem artigo é jeito antigo; hoje: «della nostra vita»."},
  {s:"mi ritrovai per una selva oscura",pt:"me encontrei por uma selva escura",note:"«Mi ritrovai» é o passato remoto de «ritrovarsi» (reflexivo). «Selva» é floresta, palavra poética; hoje se diz mais «foresta» ou «bosco»."},
  {s:"ché la diritta via era smarrita",pt:"pois o caminho certo estava perdido",note:"«Ché» (com acento) = porque, forma poética. «Diritta via» é o caminho direito (hoje: «dritta» ou «retta via»). «Era smarrita» = estava perdida."},
  {s:"Considerate la vostra semenza",pt:"Pensai na vossa origem",note:"Imperativo de «considerare» para «voi»: considerate. «Semenza» é «semente», aqui no sentido de origem; hoje o mais comum é «origine»."},
  {s:"fatti non foste a viver come bruti",pt:"não fostes feitos para viver como animais",note:"Ordem poética: «fatti non foste» = «non foste fatti». «Viver» é «vivere» sem o «e» final. «Bruti» = animais, seres sem razão."},
  {s:"ma per seguir virtute e canoscenza",pt:"mas para seguir virtude e conhecimento",note:"«Virtute» e «canoscenza» são formas antigas de «virtù» e «conoscenza». «Seguir» = seguire sem o «e»."},
  {s:"Lasciate ogne speranza, voi ch'intrate",pt:"Deixai toda esperança, vós que entrais",note:"Inscrição da porta do Inferno. «Ogne» é forma antiga de «ogni» (toda). «Lasciate» é imperativo de «voi». «Ch'intrate» = che + intrate."},
  {s:"Amor, ch'a nullo amato amar perdona",pt:"Amor, que não deixa nenhum amado deixar de amar",note:"Verso famoso do canto de Francesca. O sentido: quem é amado não consegue deixar de amar também. «Nullo» é forma antiga de «nessuno» (nenhum)."},
  {s:"E quindi uscimmo a riveder le stelle.",pt:"E dali saímos para rever as estrelas.",note:"Último verso do Inferno. «Uscimmo» é o passato remoto de «uscire» (nós saímos). «Riveder» = rivedere sem o «e»; o prefixo «ri-» dá ideia de «de novo»."},
  {s:"non ragioniam di lor, ma guarda e passa",pt:"não falemos deles, mas olha e passa",note:"«Ragioniam» = ragioniamo e «lor» = loro: formas poéticas. «Ragionare di» = falar de, discutir. Os dois imperativos (guarda, passa) são de «tu»."}]
};
const BOOKFSRC={
 principe:"título de capítulo do original de Machiavelli (1532, domínio público), copiado de um PDF de Gerardo D'Orrico; só os títulos foram usados, porque o corpo desse PDF é uma versão em italiano moderno",
 musq:"texto de Alexandre Dumas (1844, domínio público) do PDF do grupo «Ebooks libres et gratuits»",
 dante:"verso de Dante (morto em 1321, domínio público) do PDF «Grande biblioteca della letteratura italiana» (LIZ/Zanichelli)"
};
(function(){
  BOOKS.forEach(b=>{
    const L=BOOKFRASES[b.id];if(!L)return;
    for(let k=0;k<2;k++)VOLUME3.pages.push({id:"frases-livro-"+b.id+"-"+(k+1),type:"frases",n:100+VOLUME3.pages.length,book:b.id,lines:L.slice(k*5,k*5+5),themes:["livro-"+b.id],langs:[b.lang],sub:b.name,meta:"Frases de «"+b.name+"» · "+(k+1)+" de 2"});
  });
})();
