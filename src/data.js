
const RAW={
 fr:{
  saudacoes:["bonjour||bom dia / olá","bonsoir||boa tarde / boa noite","bonne nuit||boa noite (ao dormir)","salut||oi (informal)","au revoir||tchau","merci||obrigado(a)","de rien||de nada","pardon||desculpa","excusez-moi||com licença / desculpe","bienvenue||bem-vindo","enchanté||prazer em conhecer","oui||sim","non||não"],
  perguntas:["quand||quando","pourquoi||por que","comment||como","combien||quanto","qui||quem","quoi||o quê","quel||qual","parce que||porque","beaucoup||muito","peu||pouco","aussi||também","toujours||sempre","jamais||nunca","peut-être||talvez"],
  pessoas:["homme|l'|homem","femme|la|mulher","enfant|l'|criança","ami|l'|amigo","voisin|le|vizinho","professeur|le|professor","étudiant|l'|estudante","garçon|le|menino","personne|la|pessoa","monsieur|le|senhor"],
  familia:["mère|la|mãe","père|le|pai","frère|le|irmão","sœur|la|irmã","fils|le|filho","fille|la|filha","oncle|l'|tio","tante|la|tia","cousin|le|primo","grand-père|le|avô"],
  descricoes:["heureux||feliz","triste||triste","fatigué||cansado","grand||grande","petit||pequeno","beau||bonito","bon||bom","mauvais||ruim","facile||fácil","difficile||difícil"],
  comida:["pomme|la|maçã","pain|le|pão","fromage|le|queijo","lait|le|leite","poisson|le|peixe","riz|le|arroz","gâteau|le|bolo","fraise|la|morango","poulet|le|frango","sucre|le|açúcar"],
  restaurante:["menu|le|cardápio","addition|l'|conta","serveur|le|garçom","eau|l'|água","vin|le|vinho","café|le|café","bière|la|cerveja","assiette|l'|prato","verre|le|copo","fourchette|la|garfo"],
  compras:["argent|l'|dinheiro","prix|le|preço","magasin|le|loja","cher||caro","gratuit||grátis","monnaie|la|troco","panier|le|cesta","taille|la|tamanho","reçu|le|recibo","caisse|la|caixa"],
  casa:["porte|la|porta","fenêtre|la|janela","table|la|mesa","chaise|la|cadeira","lit|le|cama","cuisine|la|cozinha","salon|le|sala de estar","jardin|le|jardim","toit|le|telhado","mur|le|parede"],
  roupas:["chemise|la|camisa","pantalon|le|calça","robe|la|vestido","jupe|la|saia","manteau|le|casaco","chapeau|le|chapéu","chaussure|la|sapato","chaussette|la|meia","veste|la|jaqueta","sac|le|bolsa"],
  corpo:["tête|la|cabeça","main|la|mão","pied|le|pé","bras|le|braço","jambe|la|perna","bouche|la|boca","nez|le|nariz","dos|le|costas","cœur|le|coração","oreille|l'|orelha"],
  saude:["médecin|le|médico","hôpital|l'|hospital","pharmacie|la|farmácia","douleur|la|dor","fièvre|la|febre","médicament|le|remédio","malade||doente","santé|la|saúde","rhume|le|resfriado","toux|la|tosse"],
  trabalho:["travail|le|trabalho","bureau|le|escritório","ordinateur|l'|computador","téléphone|le|telefone","réunion|la|reunião","patron|le|chefe","collègue||colega","salaire|le|salário","livre|le|livro","stylo|le|caneta"],
  cidade:["rue|la|rua","gare|la|estação de trem","avion|l'|avião","train|le|trem","voiture|la|carro","hôtel|l'|hotel","plage|la|praia","ville|la|cidade","pont|le|ponte","marché|le|mercado","aéroport|l'|aeroporto","billet|le|bilhete / passagem","valise|la|mala","passeport|le|passaporte","métro|le|metrô","taxi|le|táxi"],
  direcoes:["gauche||esquerda","droite||direita","loin||longe","près||perto","ici||aqui","devant||na frente","derrière||atrás","haut||em cima","bas||embaixo","coin|le|esquina"],
  clima:["soleil|le|sol","pluie|la|chuva","vent|le|vento","neige|la|neve","nuage|le|nuvem","orage|l'|tempestade","chaud||quente","froid||frio","ciel|le|céu","lune|la|lua"],
  natureza:["arbre|l'|árvore","fleur|la|flor","forêt|la|floresta","montagne|la|montanha","rivière|la|rio","mer|la|mar","herbe|l'|grama","feuille|la|folha","pierre|la|pedra","île|l'|ilha"],
  animais:["chat|le|gato","chien|le|cachorro","cheval|le|cavalo","oiseau|l'|pássaro","vache|la|vaca","lapin|le|coelho","souris|la|rato","lion|le|leão","ours|l'|urso","loup|le|lobo"],
  laboratorio:["chimie|la|química","biologie|la|biologia","algue|l'|alga","plante|la|planta","cellule|la|célula","molécule|la|molécula","résultat|le|resultado","solution|la|solução","mélange|le|mistura","acide|l'|ácido"],
  numeros:["deux||dois","trois||três","quatre||quatro","cinq||cinco","six||seis","sept||sete","huit||oito","neuf||nove","dix||dez","vingt||vinte"],
  dias:["lundi||segunda-feira","mardi||terça-feira","mercredi||quarta-feira","jeudi||quinta-feira","vendredi||sexta-feira","samedi||sábado","dimanche||domingo","hier||ontem","demain||amanhã","matin|le|manhã"],
  cores:["rouge||vermelho","bleu||azul","vert||verde","jaune||amarelo","noir||preto","blanc||branco","gris||cinza","rose||rosa","orange||laranja","violet||roxo"],
  verbos:["manger||comer","boire||beber","dormir||dormir","parler||falar","aimer||amar / gostar","aller||ir","voir||ver","lire||ler","écrire||escrever","courir||correr","avoir||ter","être||ser / estar","faire||fazer","pouvoir||poder","vouloir||querer","prendre||pegar","donner||dar","acheter||comprar","payer||pagar","comprendre||entender"]
 },
 it:{
  saudacoes:["buongiorno||bom dia","buonasera||boa tarde / boa noite","buonanotte||boa noite (ao dormir)","ciao||oi / tchau","salve||olá (formal)","grazie||obrigado(a)","prego||de nada","scusi||com licença / desculpe","benvenuto||bem-vindo","piacere||prazer em conhecer","certo||claro / certo","bene||bem"],
  perguntas:["dove||onde","quando||quando","perché||por que","come||como","quanto||quanto","chi||quem","cosa||o quê","quale||qual","molto||muito","poco||pouco","anche||também","sempre||sempre","mai||nunca","forse||talvez"],
  pessoas:["uomo|l'|homem","donna|la|mulher","bambino|il|criança","amico|l'|amigo","vicino|il|vizinho","professore|il|professor","studente|lo|estudante","ragazzo|il|garoto","persona|la|pessoa","signore|il|senhor"],
  familia:["madre|la|mãe","padre|il|pai","fratello|il|irmão","sorella|la|irmã","figlio|il|filho","figlia|la|filha","zio|lo|tio","zia|la|tia","cugino|il|primo","nonno|il|avô"],
  descricoes:["felice||feliz","triste||triste","stanco||cansado","grande||grande","piccolo||pequeno","bello||bonito","buono||bom","cattivo||ruim","facile||fácil","difficile||difícil"],
  comida:["mela|la|maçã","pane|il|pão","formaggio|il|queijo","latte|il|leite","pesce|il|peixe","riso|il|arroz","torta|la|bolo","fragola|la|morango","pollo|il|frango","zucchero|lo|açúcar"],
  restaurante:["menu|il|cardápio","conto|il|conta","cameriere|il|garçom","acqua|l'|água","vino|il|vinho","caffè|il|café","birra|la|cerveja","piatto|il|prato","bicchiere|il|copo","forchetta|la|garfo"],
  compras:["soldi|i|dinheiro","prezzo|il|preço","negozio|il|loja","caro||caro","gratis||grátis","resto|il|troco","carrello|il|carrinho de compras","taglia|la|tamanho","scontrino|lo|recibo","cassa|la|caixa"],
  casa:["porta|la|porta","finestra|la|janela","tavolo|il|mesa","sedia|la|cadeira","letto|il|cama","cucina|la|cozinha","salotto|il|sala de estar","giardino|il|jardim","tetto|il|telhado","parete|la|parede"],
  roupas:["camicia|la|camisa","pantaloni|i|calça","vestito|il|vestido","gonna|la|saia","cappotto|il|casaco","cappello|il|chapéu","scarpa|la|sapato","calzino|il|meia","giacca|la|jaqueta","borsa|la|bolsa"],
  corpo:["testa|la|cabeça","mano|la|mão","piede|il|pé","braccio|il|braço","gamba|la|perna","occhio|l'|olho","bocca|la|boca","naso|il|nariz","cuore|il|coração","dente|il|dente"],
  saude:["medico|il|médico","ospedale|l'|hospital","farmacia|la|farmácia","dolore|il|dor","febbre|la|febre","medicina|la|remédio","malato||doente","salute|la|saúde","tosse|la|tosse","pillola|la|comprimido"],
  trabalho:["lavoro|il|trabalho","ufficio|l'|escritório","computer|il|computador","telefono|il|telefone","riunione|la|reunião","capo|il|chefe","collega||colega","stipendio|lo|salário","libro|il|livro","penna|la|caneta"],
  cidade:["strada|la|rua","stazione|la|estação","aereo|l'|avião","treno|il|trem","macchina|la|carro","albergo|l'|hotel","spiaggia|la|praia","città|la|cidade","ponte|il|ponte","mercato|il|mercado","aeroporto|l'|aeroporto","biglietto|il|bilhete / passagem","valigia|la|mala","passaporto|il|passaporte","metro|la|metrô","taxi|il|táxi"],
  direcoes:["sinistra||esquerda","destra||direita","lontano||longe","qui||aqui","davanti||na frente","dietro||atrás","sopra||em cima","sotto||embaixo","angolo|l'|esquina"],
  clima:["sole|il|sol","pioggia|la|chuva","vento|il|vento","neve|la|neve","nuvola|la|nuvem","temporale|il|tempestade","caldo||quente","freddo||frio","cielo|il|céu","luna|la|lua"],
  natureza:["albero|l'|árvore","fiore|il|flor","foresta|la|floresta","montagna|la|montanha","fiume|il|rio","mare|il|mar","erba|l'|grama","foglia|la|folha","pietra|la|pedra","isola|l'|ilha"],
  animais:["gatto|il|gato","cane|il|cachorro","cavallo|il|cavalo","uccello|l'|pássaro","mucca|la|vaca","coniglio|il|coelho","topo|il|rato","leone|il|leão","orso|l'|urso","lupo|il|lobo"],
  laboratorio:["chimica|la|química","biologia|la|biologia","alga|l'|alga","pianta|la|planta","cellula|la|célula","molecola|la|molécula","risultato|il|resultado","soluzione|la|solução","miscela|la|mistura","acido|l'|ácido"],
  numeros:["due||dois","tre||três","quattro||quatro","cinque||cinco","sei||seis","sette||sete","otto||oito","nove||nove","dieci||dez","venti||vinte"],
  dias:["lunedì||segunda-feira","martedì||terça-feira","mercoledì||quarta-feira","giovedì||quinta-feira","venerdì||sexta-feira","sabato||sábado","domenica||domingo","ieri||ontem","domani||amanhã","mattina|la|manhã"],
  cores:["rosso||vermelho","blu||azul","verde||verde","giallo||amarelo","nero||preto","bianco||branco","grigio||cinza","rosa||rosa","arancione||laranja","viola||roxo"],
  verbos:["mangiare||comer","bere||beber","dormire||dormir","parlare||falar","amare||amar","andare||ir","vedere||ver","leggere||ler","scrivere||escrever","correre||correr","avere||ter","essere||ser / estar","fare||fazer","potere||poder","volere||querer","prendere||pegar","dare||dar","comprare||comprar","pagare||pagar","capire||entender"]
 },
  en:{
  saudacoes:["hello||olá","goodbye||tchau","please||por favor","thanks||obrigado(a)","sorry||desculpa","welcome||bem-vindo","good morning||bom dia","good night||boa noite (ao dormir)","see you||até logo","excuse me||com licença","cheers||saúde / valeu","yes||sim","no||não"],
  perguntas:["when||quando","why||por que","how||como","how much||quanto","who||quem","what||o quê","which||qual","where||onde","because||porque","always||sempre","never||nunca","maybe||talvez","also||também","very||muito"],
  pessoas:["man||homem","woman||mulher","child||criança","friend||amigo","neighbour||vizinho","teacher||professor","student||estudante","boy||menino","person||pessoa","gentleman||senhor"],
  familia:["mother||mãe","father||pai","brother||irmão","sister||irmã","son||filho","daughter||filha","uncle||tio","aunt||tia","cousin||primo","grandfather||avô"],
  descricoes:["happy||feliz","sad||triste","tired||cansado","big||grande","small||pequeno","beautiful||bonito","good||bom","bad||ruim","easy||fácil","difficult||difícil"],
  comida:["apple||maçã","bread||pão","cheese||queijo","milk||leite","fish||peixe","rice||arroz","cake||bolo","strawberry||morango","chicken||frango","sugar||açúcar"],
  restaurante:["menu||cardápio","bill||conta","waiter||garçom","water||água","wine||vinho","coffee||café","beer||cerveja","plate||prato","glass||copo","fork||garfo"],
  compras:["money||dinheiro","price||preço","shop||loja","expensive||caro","free||grátis","change||troco","basket||cesta","size||tamanho","receipt||recibo","cashier||caixa"],
  casa:["door||porta","window||janela","table||mesa","chair||cadeira","bed||cama","kitchen||cozinha","living room||sala de estar","garden||jardim","roof||telhado","wall||parede"],
  roupas:["shirt||camisa","trousers||calça","dress||vestido","skirt||saia","coat||casaco","hat||chapéu","shoe||sapato","sock||meia","jacket||jaqueta","bag||bolsa"],
  corpo:["head||cabeça","hand||mão","foot||pé","arm||braço","leg||perna","mouth||boca","nose||nariz","back||costas","heart||coração","ear||orelha"],
  saude:["doctor||médico","hospital||hospital","pharmacy||farmácia","pain||dor","fever||febre","medicine||remédio","sick||doente","health||saúde","flu||gripe","cough||tosse"],
  trabalho:["work||trabalho","office||escritório","computer||computador","phone||telefone","meeting||reunião","boss||chefe","colleague||colega","salary||salário","book||livro","pen||caneta"],
  cidade:["street||rua","station||estação","plane||avião","train||trem","car||carro","hotel||hotel","beach||praia","city||cidade","bridge||ponte","market||mercado","airport||aeroporto","ticket||bilhete / passagem","suitcase||mala","passport||passaporte","subway||metrô","taxi||táxi"],
  direcoes:["left||esquerda","right||direita","far||longe","near||perto","here||aqui","front||na frente","behind||atrás","up||em cima","down||embaixo","corner||esquina"],
  clima:["sun||sol","rain||chuva","wind||vento","snow||neve","cloud||nuvem","storm||tempestade","hot||quente","cold||frio","sky||céu","moon||lua"],
  natureza:["tree||árvore","flower||flor","forest||floresta","mountain||montanha","river||rio","sea||mar","grass||grama","leaf||folha","stone||pedra","island||ilha"],
  animais:["cat||gato","dog||cachorro","horse||cavalo","bird||pássaro","cow||vaca","rabbit||coelho","mouse||rato","lion||leão","bear||urso","wolf||lobo"],
  laboratorio:["chemistry||química","biology||biologia","seaweed||alga","plant||planta","cell||célula","molecule||molécula","result||resultado","solution||solução","mixture||mistura","acid||ácido"],
  numeros:["two||dois","three||três","four||quatro","five||cinco","six||seis","seven||sete","eight||oito","nine||nove","ten||dez","twenty||vinte"],
  dias:["monday||segunda-feira","tuesday||terça-feira","wednesday||quarta-feira","thursday||quinta-feira","friday||sexta-feira","saturday||sábado","sunday||domingo","yesterday||ontem","tomorrow||amanhã","morning||manhã"],
  cores:["red||vermelho","blue||azul","green||verde","yellow||amarelo","black||preto","white||branco","grey||cinza","pink||rosa","orange||laranja","purple||roxo"],
  verbos:["eat||comer","drink||beber","sleep||dormir","speak||falar","love||amar / gostar","go||ir","see||ver","read||ler","write||escrever","run||correr","have||ter","be||ser / estar","do||fazer","can||poder","want||querer","take||pegar","give||dar","buy||comprar","pay||pagar","understand||entender"]
 }
};
const GROUPS=[["conversar","Conversar"],["diaadia","Dia a dia"],["mundo","Mundo e ciência"],["base","Base"]];
const CATS=[
 ["saudacoes","Cumprimentos e cortesia","conversar"],["perguntas","Perguntas e palavras úteis","conversar"],["pessoas","Pessoas","conversar"],["familia","Família","conversar"],["descricoes","Descrições e sentimentos","conversar"],
 ["comida","Comida","diaadia"],["restaurante","Restaurante","diaadia"],["compras","Compras e dinheiro","diaadia"],["casa","Casa","diaadia"],["roupas","Roupas","diaadia"],["corpo","Corpo","diaadia"],["saude","Saúde","diaadia"],["trabalho","Trabalho e estudo","diaadia"],
 ["cidade","Cidade e viagem","mundo"],["direcoes","Direções e posição","mundo"],["clima","Clima","mundo"],["natureza","Natureza","mundo"],["animais","Animais","mundo"],["laboratorio","Laboratório e ciência","mundo"],
 ["numeros","Números","base"],["dias","Dias e momentos","base"],["cores","Cores","base"],["verbos","Verbos","base"]
];
let RNG=Math.random;
const rnd=n=>Math.floor(RNG()*n);
function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function seedWith(str){RNG=mulberry32(hashStr(str));}
function seedOff(){RNG=Math.random;}
const key=(r,c)=>r+","+c;
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
function norm(s){return s.toLowerCase().replace(/œ/g,"oe").replace(/æ/g,"ae").normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z]/g,"").toUpperCase();}
/* Vocabulário adicional (cerca de 10 palavras por tema) */
const MORE={
 fr:{
  saudacoes:["bravo||muito bem","courage||força, coragem","félicitations||parabéns","bientôt||em breve","désolé||sinto muito","volontiers||com prazer","exactement||exatamente","d'accord||de acordo","tchao||tchau (informal)","coucou||olá (bem informal)"],
  perguntas:["où||onde","souvent||frequentemente","parfois||às vezes","déjà||já","encore||ainda, de novo","maintenant||agora","ensuite||depois","avant||antes","après||depois de","trop||demais"],
  pessoas:["adulte|l'|adulto","jeune||jovem","vieux||velho","dame|la|senhora","gens|les|pessoas","habitant|l'|habitante","bébé|le|bebê","directeur|le|diretor","client|le|cliente","touriste|le|turista"],
  familia:["mari|le|marido","épouse|l'|esposa","neveu|le|sobrinho","nièce|la|sobrinha","petit-fils|le|neto","petite-fille|la|neta","grand-mère|la|avó","parents|les|pais","beau-père|le|sogro","belle-mère|la|sogra"],
  descricoes:["joli||bonito, gracioso","laid||feio","rapide||rápido","lent||lento","fort||forte","faible||fraco","riche||rico","pauvre||pobre","propre||limpo","sale||sujo"],
  comida:["viande|la|carne","légume|le|legume","fruit|le|fruta","œuf|l'|ovo","beurre|le|manteiga","soupe|la|sopa","salade|la|salada","pâtes|les|massa","jambon|le|presunto","miel|le|mel"],
  restaurante:["boisson|la|bebida","dessert|le|sobremesa","déjeuner|le|almoço","dîner|le|jantar","couteau|le|faca","cuillère|la|colher","serviette|la|guardanapo","réservation|la|reserva","pourboire|le|gorjeta","carte|la|cardápio (lista)"],
  compras:["boutique|la|lojinha","vendeur|le|vendedor","réduction|la|desconto","soldes|les|liquidação","espèces|les|dinheiro vivo","euro|l'|euro","cadeau|le|presente","commande|la|pedido","facture|la|fatura","pièce|la|moeda"],
  casa:["escalier|l'|escada","chambre|la|quarto","canapé|le|sofá","armoire|l'|armário","miroir|le|espelho","clé|la|chave","lampe|la|luminária","tapis|le|tapete","rideau|le|cortina","plafond|le|teto"],
  roupas:["pull|le|suéter","short|le|short","cravate|la|gravata","gant|le|luva","écharpe|l'|cachecol","bonnet|le|gorro","ceinture|la|cinto","lunettes|les|óculos","botte|la|bota","maillot|le|maiô"],
  corpo:["visage|le|rosto","cheveux|les|cabelos","œil|l'|olho","dent|la|dente","doigt|le|dedo","genou|le|joelho","épaule|l'|ombro","ventre|le|barriga","peau|la|pele","langue|la|língua"],
  saude:["dentiste|le|dentista","infirmier|l'|enfermeiro","ambulance|l'|ambulância","blessure|la|ferimento","allergie|l'|alergia","pilule|la|comprimido","sang|le|sangue","ordonnance|l'|receita médica","vaccin|le|vacina","pansement|le|curativo"],
  trabalho:["entreprise|l'|empresa","emploi|l'|emprego","carrière|la|carreira","contrat|le|contrato","courriel|le|e-mail","examen|l'|exame","école|l'|escola","université|l'|universidade","classe|la|turma","devoir|le|dever de casa"],
  cidade:["église|l'|igreja","banque|la|banco","parc|le|parque","musée|le|museu","bus|le|ônibus","vélo|le|bicicleta","plan|le|mapa","quartier|le|bairro","centre|le|centro","place|la|praça"],
  direcoes:["nord|le|norte","sud|le|sul","est|l'|leste","ouest|l'|oeste","milieu|le|meio","côté|le|lado","entre||entre","sur||sobre","sous||sob","dehors||fora"],
  clima:["brouillard|le|neblina","tonnerre|le|trovão","éclair|l'|relâmpago","température|la|temperatura","saison|la|estação do ano","été|l'|verão","hiver|l'|inverno","printemps|le|primavera","automne|l'|outono"],
  natureza:["lac|le|lago","désert|le|deserto","colline|la|colina","sable|le|areia","terre|la|terra","vallée|la|vale","cascade|la|cachoeira","champ|le|campo","vague|la|onda","bois|le|bosque"],
  animais:["canard|le|pato","cochon|le|porco","mouton|le|carneiro","chèvre|la|cabra","âne|l'|burro","renard|le|raposa","tigre|le|tigre","singe|le|macaco","serpent|le|serpente","abeille|l'|abelha"],
  laboratorio:["expérience|l'|experimento","microscope|le|microscópio","atome|l'|átomo","énergie|l'|energia","oxygène|l'|oxigênio","laboratoire|le|laboratório","échantillon|l'|amostra","mesure|la|medida","formule|la|fórmula","analyse|l'|análise"],
  numeros:["zéro||zero","un||um","onze||onze","douze||doze","quinze||quinze","trente||trinta","quarante||quarenta","cinquante||cinquenta","cent||cem","mille||mil"],
  dias:["aujourd'hui||hoje","semaine|la|semana","mois|le|mês","année|l'|ano","jour|le|dia","nuit|la|noite","soir|le|noite (início)","après-midi|l'|tarde","week-end|le|fim de semana","heure|l'|hora"],
  cores:["marron||marrom","doré||dourado","clair||claro","foncé||escuro","couleur|la|cor","beige||bege","turquoise||turquesa","argenté||prateado","bordeaux||vinho","ocre||ocre"],
  verbos:["chanter||cantar","danser||dançar","jouer||jogar, brincar","travailler||trabalhar","habiter||morar","aider||ajudar","chercher||procurar","trouver||encontrar","attendre||esperar","ouvrir||abrir"]
 },
 it:{
  saudacoes:["arrivederci||até logo","addio||adeus","bravo||muito bem","auguri||parabéns, felicidades","complimenti||parabéns","volentieri||com prazer","esatto||exato","davvero||de verdade","ottimo||ótimo","tranquillo||tranquilo"],
  perguntas:["spesso||frequentemente","talvolta||às vezes","già||já","ancora||ainda, de novo","adesso||agora","poi||depois","prima||antes","dopo||depois de","troppo||demais","abbastanza||bastante"],
  pessoas:["adulto|l'|adulto","giovane||jovem","vecchio||velho","signora|la|senhora","gente|la|gente","abitante|l'|habitante","bebè|il|bebê","direttore|il|diretor","cliente|il|cliente","turista|il|turista"],
  familia:["marito|il|marido","moglie|la|esposa","nipote|il|sobrinho, neto","genitori|i|pais","suocero|il|sogro","suocera|la|sogra","cognato|il|cunhado","cognata|la|cunhada","gemello|il|gêmeo","famiglia|la|família"],
  descricoes:["carino||bonitinho, gentil","brutto||feio","veloce||rápido","lento||lento","forte||forte","debole||fraco","ricco||rico","povero||pobre","pulito||limpo","sporco||sujo"],
  comida:["carne|la|carne","verdura|la|verdura","frutta|la|fruta","uovo|l'|ovo","burro|il|manteiga","zuppa|la|sopa","insalata|l'|salada","pasta|la|massa","prosciutto|il|presunto","miele|il|mel"],
  restaurante:["bevanda|la|bebida","dolce|il|sobremesa","pranzo|il|almoço","cena|la|jantar","coltello|il|faca","cucchiaio|il|colher","tovagliolo|il|guardanapo","prenotazione|la|reserva","mancia|la|gorjeta","carta|la|cardápio (lista)"],
  compras:["vetrina|la|vitrine","commesso|il|vendedor","sconto|lo|desconto","saldi|i|liquidação","contanti|i|dinheiro vivo","euro|l'|euro","regalo|il|presente","ordine|l'|pedido","fattura|la|fatura","moneta|la|moeda"],
  casa:["scala|la|escada","camera|la|quarto","divano|il|sofá","armadio|l'|armário","specchio|lo|espelho","chiave|la|chave","lampada|la|luminária","tappeto|il|tapete","tenda|la|cortina","soffitto|il|teto"],
  roupas:["maglione|il|suéter","pantaloncini|i|short","cravatta|la|gravata","guanto|il|luva","sciarpa|la|cachecol","berretto|il|gorro","cintura|la|cinto","occhiali|gli|óculos","stivale|lo|bota","costume|il|traje de banho (costume da bagno)"],
  corpo:["viso|il|rosto","capelli|i|cabelos","dito|il|dedo","ginocchio|il|joelho","spalla|la|ombro","pancia|la|barriga","pelle|la|pele","lingua|la|língua","collo|il|pescoço","schiena|la|costas"],
  saude:["dentista|il|dentista","infermiere|l'|enfermeiro","ambulanza|l'|ambulância","ferita|la|ferimento","allergia|l'|alergia","sangue|il|sangue","ricetta|la|receita médica","vaccino|il|vacina","cerotto|il|curativo","raffreddore|il|resfriado"],
  trabalho:["azienda|l'|empresa","impiego|l'|emprego","carriera|la|carreira","contratto|il|contrato","esame|l'|exame","scuola|la|escola","università|l'|universidade","classe|la|turma","compito|il|dever de casa","quaderno|il|caderno"],
  cidade:["chiesa|la|igreja","banca|la|banco","parco|il|parque","museo|il|museu","autobus|l'|ônibus","bicicletta|la|bicicleta","mappa|la|mapa","quartiere|il|bairro","centro|il|centro","piazza|la|praça"],
  direcoes:["nord|il|norte","sud|il|sul","est|l'|leste","ovest|l'|oeste","mezzo|il|meio","lato|il|lado","tra||entre","dentro||dentro","fuori||fora",],
  clima:["nebbia|la|neblina","tuono|il|trovão","fulmine|il|raio","temperatura|la|temperatura","stagione|la|estação do ano","estate|l'|verão","inverno|l'|inverno","primavera|la|primavera","autunno|l'|outono","ghiaccio|il|gelo"],
  natureza:["lago|il|lago","deserto|il|deserto","collina|la|colina","sabbia|la|areia","terra|la|terra","valle|la|vale","cascata|la|cachoeira","campo|il|campo","onda|l'|onda","bosco|il|bosque"],
  animais:["anatra|l'|pato","maiale|il|porco","pecora|la|ovelha","capra|la|cabra","asino|l'|burro","volpe|la|raposa","tigre|la|tigre","scimmia|la|macaco","serpente|il|serpente","ape|l'|abelha"],
  laboratorio:["esperimento|l'|experimento","microscopio|il|microscópio","atomo|l'|átomo","energia|l'|energia","ossigeno|l'|oxigênio","laboratorio|il|laboratório","campione|il|amostra","misura|la|medida","formula|la|fórmula","analisi|l'|análise"],
  numeros:["zero||zero","uno||um","undici||onze","dodici||doze","quindici||quinze","trenta||trinta","quaranta||quarenta","cinquanta||cinquenta","cento||cem","mille||mil"],
  dias:["oggi||hoje","settimana|la|semana","mese|il|mês","anno|l'|ano","giorno|il|dia","notte|la|noite","sera|la|noite (início)","pomeriggio|il|tarde","weekend|il|fim de semana","ora|l'|hora"],
  cores:["marrone||marrom","dorato||dourado","chiaro||claro","scuro||escuro","colore|il|cor","beige||bege","turchese||turquesa","argentato||prateado","bordeaux||vinho","celeste||azul-claro"],
  verbos:["cantare||cantar","ballare||dançar","giocare||jogar, brincar","lavorare||trabalhar","abitare||morar","aiutare||ajudar","cercare||procurar","trovare||encontrar","aspettare||esperar","aprire||abrir"]
 },
 en:{
  saudacoes:["hi||oi","bye||até mais","congratulations||parabéns","cheerio||tchau (britânico)","pardon||como? / desculpe","indeed||de fato","exactly||exatamente","certainly||com certeza","sure||claro","fine||bem"],
  perguntas:["often||frequentemente","sometimes||às vezes","already||já","still||ainda","now||agora","then||depois, então","before||antes","after||depois de","too||demais, também","enough||suficiente"],
  pessoas:["adult||adulto","young||jovem","old||velho","lady||senhora","people||pessoas","inhabitant||habitante","baby||bebê","director||diretor","customer||cliente","tourist||turista"],
  familia:["husband||marido","wife||esposa","nephew||sobrinho","niece||sobrinha","grandson||neto","granddaughter||neta","grandmother||avó","parents||pais","family||família","twin||gêmeo"],
  descricoes:["pretty||bonito, gracioso","ugly||feio","fast||rápido","slow||lento","strong||forte","weak||fraco","rich||rico","poor||pobre","clean||limpo","dirty||sujo"],
  comida:["meat||carne","vegetable||legume","fruit||fruta","egg||ovo","butter||manteiga","soup||sopa","salad||salada","pasta||massa","ham||presunto","honey||mel"],
  restaurante:["juice||suco","dessert||sobremesa","lunch||almoço","dinner||jantar","knife||faca","spoon||colher","napkin||guardanapo","reservation||reserva","tip||gorjeta","bottle||garrafa"],
  compras:["seller||vendedor","discount||desconto","sale||liquidação","card||cartão","cash||dinheiro vivo","euro||euro","gift||presente","order||pedido","invoice||fatura","coin||moeda"],
  casa:["stairs||escada","bedroom||quarto","sofa||sofá","wardrobe||armário","mirror||espelho","key||chave","lamp||luminária","carpet||tapete","curtain||cortina","ceiling||teto"],
  roupas:["sweater||suéter","shorts||short","tie||gravata","glove||luva","scarf||cachecol","cap||boné","belt||cinto","glasses||óculos","boots||botas","swimsuit||traje de banho"],
  corpo:["face||rosto","hair||cabelo","eye||olho","tooth||dente","finger||dedo","knee||joelho","shoulder||ombro","stomach||barriga","skin||pele","tongue||língua"],
  saude:["dentist||dentista","nurse||enfermeiro","ambulance||ambulância","wound||ferimento","allergy||alergia","blood||sangue","prescription||receita médica","vaccine||vacina","bandage||curativo","sneeze||espirro"],
  trabalho:["company||empresa","job||emprego","career||carreira","contract||contrato","email||e-mail","exam||exame","school||escola","university||universidade","class||turma","homework||dever de casa"],
  cidade:["church||igreja","bank||banco","park||parque","museum||museu","bus||ônibus","bicycle||bicicleta","map||mapa","neighbourhood||bairro","centre||centro","square||praça"],
  direcoes:["north||norte","south||sul","east||leste","west||oeste","middle||meio","side||lado","between||entre","inside||dentro","outside||fora","above||acima"],
  clima:["fog||neblina","thunder||trovão","lightning||raio","temperature||temperatura","season||estação do ano","summer||verão","winter||inverno","spring||primavera","autumn||outono","ice||gelo"],
  natureza:["lake||lago","desert||deserto","hill||colina","sand||areia","earth||terra","valley||vale","waterfall||cachoeira","field||campo","wave||onda","wood||bosque"],
  animais:["duck||pato","pig||porco","sheep||ovelha","goat||cabra","donkey||burro","fox||raposa","tiger||tigre","monkey||macaco","snake||serpente","bee||abelha"],
  laboratorio:["experiment||experimento","microscope||microscópio","atom||átomo","energy||energia","oxygen||oxigênio","laboratory||laboratório","sample||amostra","measure||medida","formula||fórmula","analysis||análise"],
  numeros:["zero||zero","one||um","eleven||onze","twelve||doze","fifteen||quinze","thirty||trinta","forty||quarenta","fifty||cinquenta","hundred||cem","thousand||mil"],
  dias:["today||hoje","week||semana","month||mês","year||ano","day||dia","night||noite","evening||noite (início)","afternoon||tarde","weekend||fim de semana","hour||hora"],
  cores:["brown||marrom","golden||dourado","light||claro","dark||escuro","colour||cor","beige||bege","turquoise||turquesa","silver||prateado","navy||azul-marinho","lilac||lilás"],
  verbos:["sing||cantar","dance||dançar","play||jogar, brincar","walk||andar","live||morar","help||ajudar","search||procurar","find||encontrar","wait||esperar","open||abrir"]
 }
};
for(const l in MORE)for(const c in MORE[l])RAW[l][c]=RAW[l][c].concat(MORE[l][c]);

const VOCAB={},POOL={};
for(const lang in RAW){
  VOCAB[lang]={};POOL[lang]="";
  for(const cat in RAW[lang]){
    VOCAB[lang][cat]=RAW[lang][cat].map(row=>{const p=row.split("|");return {w:p[0],a:p[1],pt:p[2],s:norm(p[0]),cat:cat};});
    VOCAB[lang][cat].forEach(it=>{POOL[lang]+=it.s;});
  }
}
function full(it){return it.a?(it.a.endsWith("'")?it.a+it.w:it.a+" "+it.w):it.w;}
function genSearch(items,size,dirs,letters){
  const sorted=items.slice().sort((a,b)=>b.s.length-a.s.length);
  for(let attempt=0;attempt<80;attempt++){
    const g=Array.from({length:size},()=>Array(size).fill(""));
    const placed=[];let ok=true;
    for(const it of sorted){
      let done=false;
      for(let t=0;t<300&&!done;t++){
        const d=dirs[rnd(dirs.length)],dr=d[0],dc=d[1],L=it.s.length;
        const r0=rnd(size),c0=rnd(size),r1=r0+dr*(L-1),c1=c0+dc*(L-1);
        if(r1<0||r1>=size||c1<0||c1>=size)continue;
        let fits=true;
        for(let i=0;i<L;i++){const ch=g[r0+dr*i][c0+dc*i];if(ch&&ch!==it.s[i]){fits=false;break;}}
        if(!fits)continue;
        const cells=[];
        for(let i=0;i<L;i++){g[r0+dr*i][c0+dc*i]=it.s[i];cells.push([r0+dr*i,c0+dc*i]);}
        placed.push({it:it,cells:cells});done=true;
      }
      if(!done){ok=false;break;}
    }
    if(ok){
      for(let r=0;r<size;r++)for(let c=0;c<size;c++)if(!g[r][c])g[r][c]=letters[rnd(letters.length)];
      return {grid:g,placed:placed,size:size};
    }
  }
  return null;
}

function makeCrossword(items,span,tries){
  const W=items.filter(it=>it.s.length>=3);
  let best=null,bestScore=-1e9;
  for(let t=0;t<(tries||600);t++){
    const order=shuffle(W);
    let mi=0;order.forEach((x,i)=>{if(x.s.length>order[mi].s.length)mi=i;});
    const first=order.splice(mi,1)[0];
    const cells=new Map(),placed=[];
    const bb={a:0,b:0,c:0,d:0};
    const can=(x,r,c,d)=>{
      const dr=d,dc=1-d,L=x.s.length;
      if(Math.max(bb.b,r+dr*(L-1))-Math.min(bb.a,r)>span-1||Math.max(bb.d,c+dc*(L-1))-Math.min(bb.c,c)>span-1)return -1;
      if(cells.has(key(r-dr,c-dc))||cells.has(key(r+dr*L,c+dc*L)))return -1;
      let cross=0;
      for(let i=0;i<L;i++){
        const rr=r+dr*i,cc=c+dc*i,ex=cells.get(key(rr,cc));
        if(ex){
          if(ex.ch!==x.s[i])return -1;
          if(d===0?ex.h:ex.v)return -1;
          cross++;
        }else if(cells.has(key(rr+dc,cc+dr))||cells.has(key(rr-dc,cc-dr)))return -1;
      }
      return cross;
    };
    const put=(x,r,c,d)=>{
      const dr=d,dc=1-d;
      for(let i=0;i<x.s.length;i++){
        const k=key(r+dr*i,c+dc*i),ex=cells.get(k)||{ch:x.s[i],h:false,v:false};
        if(d===0)ex.h=true;else ex.v=true;
        cells.set(k,ex);
      }
      bb.a=Math.min(bb.a,r);bb.b=Math.max(bb.b,r+dr*(x.s.length-1));bb.c=Math.min(bb.c,c);bb.d=Math.max(bb.d,c+dc*(x.s.length-1));
      placed.push({it:x,r:r,c:c,d:d});
    };
    put(first,0,0,0);
    for(const x of order){
      let cands=[],bestCross=0;
      for(const p of placed){
        for(let i=0;i<x.s.length;i++)for(let j=0;j<p.it.s.length;j++){
          if(x.s[i]!==p.it.s[j])continue;
          let r,c,d;
          if(p.d===0){d=1;r=p.r-i;c=p.c+j;}else{d=0;r=p.r+j;c=p.c-i;}
          const cr=can(x,r,c,d);
          if(cr>=1){if(cr>bestCross){bestCross=cr;cands=[];}if(cr===bestCross)cands.push([r,c,d]);}
        }
      }
      if(cands.length){const pick=cands[rnd(cands.length)];put(x,pick[0],pick[1],pick[2]);}
    }
    let minR=1e9,minC=1e9,maxR=-1e9,maxC=-1e9;
    cells.forEach((v,k)=>{const p=k.split(",").map(Number);minR=Math.min(minR,p[0]);maxR=Math.max(maxR,p[0]);minC=Math.min(minC,p[1]);maxC=Math.max(maxC,p[1]);});
    const area=(maxR-minR+1)*(maxC-minC+1);
    const score=placed.length*40-area;
    if(score>bestScore){bestScore=score;best={placed:placed.slice(),cells:cells,minR:minR,minC:minC,rows:maxR-minR+1,cols:maxC-minC+1};}
  }
  const entries=best.placed.map(p=>{
    const L=p.it.s.length,r=p.r-best.minR,c=p.c-best.minC;
    return {it:p.it,d:p.d,r:r,c:c,cells:Array.from({length:L},(_,i)=>[r+(p.d?i:0),c+(p.d?0:i)])};
  });
  const starts=Array.from(new Set(entries.map(e=>key(e.r,e.c)))).sort((a,b)=>{
    const x=a.split(",").map(Number),y=b.split(",").map(Number);return x[0]-y[0]||x[1]-y[1];
  });
  const sol={};
  entries.forEach(e=>{e.num=starts.indexOf(key(e.r,e.c))+1;e.cells.forEach((cell,i)=>{sol[key(cell[0],cell[1])]=e.it.s[i];});});
  return {rows:best.rows,cols:best.cols,entries:entries,sol:sol,nums:Object.fromEntries(starts.map((k,i)=>[k,i+1]))};
}

function pickWords(lang,cat,n,minL,maxL){
  const ok=it=>it.s.length>=minL&&it.s.length<=maxL;
  const out=[],seen=new Set();
  const add=list=>{for(const it of shuffle(list.filter(ok))){if(out.length>=n)return;if(!seen.has(it.s)){seen.add(it.s);out.push(it);}}};
  const everything=()=>Object.values(VOCAB[lang]).flat();
  if(cat==="all"){add(everything());return out;}
  add(VOCAB[lang][cat]);
  const cc0=CATS.find(c=>c[0]===cat);if(out.length<n&&cc0){const g=cc0[2];add(CATS.filter(c=>c[2]===g&&c[0]!==cat).flatMap(c=>VOCAB[lang][c[0]]));}
  if(out.length<n)add(everything());
  return out;
}
