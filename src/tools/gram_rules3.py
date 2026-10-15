"""Cartão de regra de Sinônimos e antônimos, com a fonte."""
SRC_K = "Conferido: os pares vêm das listas de sinônimos e antônimos do Wiktionnaire/Wiktionary, extraídas pelo Kaikki (arquivo que você enviou). As alternativas erradas foram escolhidas para não aparecer nessas listas. A explicação foi escrita por Claude."
SRC_WN = "Conferido: os pares vêm do Princeton WordNet 3.0 (pacote de dados do NLTK). As alternativas erradas foram escolhidas para não aparecer nas listas de sinônimos e antônimos. A explicação foi escrita por Claude."
COMMON = ["Sinônimos são palavras com sentido parecido; antônimos têm sentido contrário. Uma palavra com vários sentidos só é sinônima de outra em um deles, então olhe sempre o contexto.",
          "Sinônimos quase nunca são idênticos: muitos mudam o registro (mais informal, mais literário). Antônimos mais seguros são os de adjetivos e verbos básicos."]
R3 = {
 "fr": {"sinonimos": {"t": "Sinônimos e antônimos", "p": COMMON,
   "ex": [["froid ↔ chaud", "frio ↔ quente"], ["laid = moche", "feio = feio (mais informal)"], ["difficile = ardu", "difícil = árduo"], ["souvent ↔ rarement", "muitas vezes ↔ raramente"]], "src": SRC_K}},
 "it": {"sinonimos": {"t": "Sinônimos e antônimos", "p": COMMON,
   "ex": [["caldo ↔ freddo", "quente ↔ frio"], ["veloce = rapido", "veloz = rápido"], ["comprare = acquistare", "comprar = adquirir"], ["aprire ↔ chiudere", "abrir ↔ fechar"]], "src": SRC_K}},
 "en": {"sinonimos": {"t": "Sinônimos e antônimos", "p": COMMON,
   "ex": [["hot ↔ cold", "quente ↔ frio"], ["big = large", "grande = grande"], ["buy = purchase", "comprar = adquirir (mais formal)"], ["open ↔ close", "abrir ↔ fechar"]], "src": SRC_WN}}}

# correções de fonte desta rodada (sobrepõem o que está em gram_rules.py)
OV = {
 "fr": {"presente": {"src": "Conferido: Tex's French Grammar (Universidade do Texas em Austin, CC BY 3.0): verbos em -er (cap. «v1»), terminações regulares em -ir «-is, -is, -it, -issons, -issez, -issent» («vir1») e o presente de être («virr1»), avoir («virr2») e aller («virr4»). Não conferido nessa fonte: a divisão em «três grupos» e o gerúndio em «-issant» (escritos por Claude). As formas dos verbos dos exercícios vêm do verbecc."},
        "passado": {"src": "Conferido: Tex's French Grammar (CC BY 3.0): passé composé com avoir («tap2»), com être (verbos intransitivos, em geral de movimento, naître, mourir e os pronominais; particípio concorda com o sujeito, «tap3»), formação do imparfait pelo «nous» sem «-ons», terminações «-ais, -ais, -ait, -ions, -iez, -aient» e a exceção «ét-» de être («tap5»), e usos do imparfait: estados e ações habituais («tap6»). As formas dos exercícios vêm do verbecc."},
        "classes": {"src": "Conferido: Tex's French Grammar (Universidade do Texas em Austin, CC BY 3.0): substantivo (cap. «no1»), adjetivo («adj1»), advérbio («adv1»), artigo/determinante («det1»), preposição («pre1») e verbo («v1»). A dica de reconhecimento e a lista das seis classes foram escritas por Claude."}},
 "it": {
  "negacao": {
   "p": ["Para negar, coloque «non» antes do verbo (non parlo inglese). Se houver pronomes antes do verbo, o «non» vai antes deles (non lo so).",
         "A dupla negação é normal em italiano: non … mai (nunca), non … niente/nulla (nada), non … nessuno (ninguém), non … ancora (ainda não), non … più (não … mais), non … né … né (nem … nem). Nos tempos compostos, «mai», «ancora» e «più» ficam entre o auxiliar e o particípio: non ho mai visto.",
         "Perguntas sim/não usam as mesmas palavras e a mesma ordem da afirmação; só muda a entonação, com a voz subindo no fim (parli italiano?). As palavras interrogativas são: che/cosa (o quê), chi (quem), dove (onde), come (como), perché (por que), quando (quando), quanto (quanto) e quale (qual)."],
   "ex": [["Non parlo inglese.", "Eu não falo inglês."], ["Non vedo nessuno.", "Não vejo ninguém."], ["Non ho mai visto quel film.", "Nunca vi esse filme."], ["Non abito più a Bologna.", "Não moro mais em Bolonha."]],
   "src": "Negação conferida: LibreTexts, «3.14 Negativi» (Blum e Gemmani, CC BY-NC-SA 4.0) e Pressbooks, «Italian Language and Culture II: Negative expressions» (CC BY-NC 4.0), que você enviou. As perguntas foram conferidas na página «Interrogatives» do Learn Italian (Universidade da Carolina do Norte em Chapel Hill; a página não informa licença): pergunta sim/não tem as mesmas palavras e a mesma ordem da afirmação, só muda a entonação (a voz sobe no fim), e o sujeito pode ficar no começo ou no fim; a lista das palavras interrogativas (che/cosa, chi, dove, come, perché, quando, quanto, quale) também está lá."},
  "prep": {
   "p": ["«A»: cidades (a Roma), antes de refeições (a pranzo, a cena), a destra/a sinistra, a piedi e expressões como a casa e a scuola. «In»: países (in Italia), meios de transporte (in treno, in macchina), cômodos da casa (in cucina), meses (in ottobre) e a duração de algo (in due mesi). «Da»: origem (da Bologna) e a casa ou o local de trabalho de alguém (da Lucia, dal dentista).",
         "Cuidado: existem muitas exceções, e «a casa» (em casa) não é «in casa» (dentro da casa)."],
   "ex": [["Vado a Roma.", "Eu vou a Roma."], ["Vado in treno.", "Eu vou de trem."], ["Vai in cucina.", "Vá para a cozinha."], ["Vengo da Milano.", "Eu venho de Milão."]],
   "src": "Conferido: Flexi Classes, «Italian prepositions: A, IN or DA?» (página que você enviou; é um guia de uma escola de idiomas, não uma gramática oficial). As formas e contrações de di, a, da, in, con, su, per e tra/fra seguem o Wikibooks «Italian/Grammar/Prepositions»."}},
 "en": {"falsos": {
   "p": ["São palavras parecidas com o português, mas com outro sentido. Exemplos da tabela e das frases: library é biblioteca (livraria é bookstore); pretend é fingir (pretender é intend); actually é na verdade (atualmente é nowadays); college é faculdade (colégio é school); costume é fantasia (costume é habit); mayor é prefeito (maior é bigger).",
         "Quando a palavra parecer fácil demais, desconfie e confira no contexto."],
   "ex": [["library = biblioteca", "(livraria = bookstore)"], ["actually = na verdade", "(atualmente = nowadays)"], ["mayor = prefeito", "(maior = bigger)"], ["costume = fantasia", "(costume = habit)"]],
   "src": "Conferido: Toda Matéria, «Falsos cognatos em inglês (false friends)» (página que você enviou): a tabela e as frases de exemplo cobrem os 12 itens. É um site de ensino, não um dicionário."},
   "artigos": {"src": "Conferido na Wikipédia, «English articles»: «a» ou «an» dependem do SOM da palavra seguinte («an hour», porque o h é mudo); «the» vale para algo único ou conhecido pelo contexto; plural e incontáveis em sentido geral ficam sem artigo. Conferido no Cambridge Grammar of English: «an hour», «play football» e «the moon». Sem fonte conferida: o exemplo «a university» (a página da Wikipédia não o cita) e a regra de instrumentos com «the» (she plays the piano). Escrito por Claude."},
   "prep": {"src": "Conferido em Grammarly, «in, on, at» (blog comercial, não gramática oficial): lugar, «in» para locais gerais e grandes (cidades, países), «on» para superfícies, «at» para pontos precisos, eventos e endereços; tempo, «at» para horas e refeições, «on» para dias e datas, «in» para meses, estações, anos e partes do dia. Conferido no Cambridge Grammar of English: «at two o'clock», «on Monday», «in the spring/summer». Sem fonte conferida: «at home» e «at the bus stop» como exemplos. Escrito por Claude."}}}

# ---- inglês: conferido nos PDFs do Cambridge Dictionary «Grammar» (English Grammar Today) enviados pela Camila
CAM = "Cambridge Dictionary, seção Grammar (English Grammar Today, Cambridge University Press), páginas que você enviou"
OV['en']['adverbios'] = {
 "p": ["Advérbios indicam tempo, modo, lugar, grau e frequência. A maioria é o adjetivo + -ly: beautiful → beautifully, careful → carefully.",
       "Alguns têm a mesma forma do adjetivo (hard, late, right, straight, well). Outros não vêm de adjetivos: just, quite, so, soon, too, very.",
       "Alguns formam comparativo e superlativo: soon – sooner – soonest; hard – harder – hardest. Um advérbio pode ser modificado por outro: rather suddenly.",
       "Advérbios de frequência (always, often, usually, never) vão, em geral, na posição do MEIO: entre o sujeito e o verbo principal (we often have friends to stay). Depois do verbo «be» (she's always late) e depois do primeiro auxiliar ou modal (I could never swim fast). Também podem ir no começo (sometimes she wore a hat) ou no fim (we don't see them very often), mas «always», «ever» e «never» normalmente não vão no começo."],
 "ex": [["She sings beautifully.", "Ela canta lindamente."], ["She's always late.", "Ela está sempre atrasada."], ["I could never swim fast.", "Eu nunca conseguia nadar rápido."]],
 "src": "Conferido: " + CAM + ", «Adverbs and adverb phrases: position» (posição do advérbio de frequência e exemplos) e «Adverbs»; formação com -ly, advérbios sem adjetivo e comparação: Cambridge Grammar of English (Carter e McCarthy)."}
OV['en']['ordem'] = {
 "p": ["A ordem normal (não marcada) é sujeito–verbo–objeto: He loves football. Pôr o objeto na frente é possível, mas menos comum.",
       "Em inglês, os modificadores vêm antes do substantivo principal: cheap red shoes, a very important meeting, a stone wall.",
       "Alguns modificadores vêm depois: a drawer full of pens; a report published last week. A ordem do sintagma é: determinante + modificadores + substantivo + complementos.",
       "Advérbios de frequência (often, always) ficam, em geral, entre o sujeito e o verbo principal, e não entre o verbo e o objeto: I often visit my aunt. Depois de «be» o advérbio vem depois: she's always late."],
 "src": "Conferido: Cambridge Grammar of English (Carter e McCarthy), seções «Word order and focus» e «Order of elements in the noun phrase»; posição do advérbio de frequência: " + CAM + ", «Adverbs and adverb phrases: position». A frase «I visit often my aunt» como errada não aparece escrita nessas fontes (é a regra geral de não pôr advérbio entre verbo e objeto): conferido só em parte."}
OV['en']['classes'] = {
 "p": ["O inglês tem quatro classes principais: substantivo (noun), verbo (verb), adjetivo (adjective) e advérbio (adverb). As outras classes são: preposição, pronome, determinante, conjunção e interjeição.",
       "Substantivo nomeia pessoas, animais e coisas. Adjetivo dá mais informação sobre o substantivo (a big house). Advérbio acrescenta informação sobre um verbo, um adjetivo ou outro advérbio (she swims really well). Preposição liga palavras (at, in, on, for). Determinante vem antes do substantivo: a/an, the, my, some, this. Os artigos «a/an» e «the» são determinantes.",
       "Uma mesma palavra pode ter mais de uma classe: «book» é substantivo ou verbo; «fast» é adjetivo ou advérbio."],
 "ex": [["the small cat", "o gatinho (small = adjetivo, cat = substantivo)"], ["she often sings", "ela canta com frequência (often = advérbio)"], ["Don't drive so fast!", "Não dirija tão rápido! (fast = advérbio) · He loves fast cars. (fast = adjetivo)"]],
 "src": "Conferido: " + CAM + ", «Word classes and phrase classes», «Nouns», «Adjectives» e «Adverbs» (as quatro classes principais, as outras classes e os exemplos de «book» e «fast»)."}
OV['en']['prep'] = {
 "p": ["Tempo: «at» com horas e pontos do dia (at five o'clock, at midday, at the weekend, at night em geral); «on» com datas e dias da semana (on 25 October, on Friday, on your birthday); «in» com partes do dia, meses, anos, estações e períodos longos (in the morning, in July, in 1835, in the spring).",
       "Lugar: «at» para uma posição vista como um ponto (at my desk), com school/college/university (at school), endereços (at number 12) e lojas ou consultórios (at the hairdresser's). «On» para superfícies, andares e transporte público (on the table, on the 15th floor, on the train). «in» para um local dentro de uma área maior (in this room) e in class.",
       "Com chegar: «arrive at» um lugar visto como ponto (at the station) e «arrive in» uma área maior, como cidade ou país."],
 "ex": [["at five o'clock, on Friday, in July", "às cinco, na sexta, em julho"], ["I was sitting at my desk.", "Eu estava sentada na minha mesa."], ["They live on the 15th floor.", "Eles moram no 15º andar."], ["I arrived at the station.", "Eu cheguei à estação."]],
 "src": "Conferido: " + CAM + ", «At, on and in (time)», «At, on and in (place)» e «At, in and to (movement)». Os exemplos «in Brazil» e «in the kitchen» dos exercícios seguem a regra de «área maior» dessas páginas, mas essas palavras específicas não aparecem nelas. «At home» e «at the bus stop» não foram encontrados nas páginas enviadas."}
OV['en']['conjuncoes'] = {"src": "Conferido: Cambridge Grammar of English (Carter e McCarthy), seção «Conjunctions» (coordenativas, correlativas e subordinativas), e " + CAM + ", «Conjunctions and linking words» (coordenativas como and e but; subordinativas como because, if, when; temporais: when, while, before, after, until, once, as soon as)."}

# ---- italiano: classes (Universal Dependencies) e «non … mai» (PDFs de negação)
OV['it']['classes'] = {
 "p": ["Substantivo (sostantivo) designa pessoa, lugar, coisa, animal ou ideia. Verbo designa acontecimentos e ações. Adjetivo modifica o substantivo e diz suas propriedades. Advérbio modifica o verbo (tempo, lugar, direção, modo). Preposição liga palavras; em italiano só existem preposições (não há posposições). Determinante vem junto do substantivo e indica a que ele se refere: os artigos são determinantes.",
       "Em italiano o adjetivo concorda em gênero e número com o substantivo (gatto nero, case grandi)."],
 "src": "Conferido: Universal Dependencies, página «POS tags» do italiano (definições de substantivo, verbo, adjetivo, advérbio, preposição e determinante; a página não informa licença nem autor, e as definições são genéricas, para todas as línguas). Concordância do adjetivo: Wikibooks, «Italian/Grammar/Adjectives» (página que você enviou). Escrito por Claude: a lista das seis classes como está no cartão."}
OV['it']['adverbios'] = {"src": "Conferido: Wikibooks «Italian Grammar» (capítulos que você enviou), capítulo «Adverbs». O uso de «non … mai» (nunca) foi conferido em LibreTexts, «3.14 Negativi», e Pressbooks, «Negative expressions» (PDFs que você enviou)."}
