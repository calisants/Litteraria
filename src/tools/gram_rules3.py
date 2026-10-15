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
 "fr": {"classes": {"src": "Conferido: Tex's French Grammar (Universidade do Texas em Austin, CC BY 3.0): substantivo (cap. «no1»), adjetivo («adj1»), advérbio («adv1»), artigo/determinante («det1»), preposição («pre1») e verbo («v1»). A dica de reconhecimento e a lista das seis classes foram escritas por Claude."}},
 "it": {
  "negacao": {
   "p": ["Para negar, coloque «non» antes do verbo (non parlo inglese). Se houver pronomes antes do verbo, o «non» vai antes deles (non lo so).",
         "A dupla negação é normal em italiano: non … mai (nunca), non … niente/nulla (nada), non … nessuno (ninguém), non … ancora (ainda não), non … più (não … mais), non … né … né (nem … nem). Nos tempos compostos, «mai», «ancora» e «più» ficam entre o auxiliar e o particípio: non ho mai visto.",
         "Perguntas sim/não usam a mesma frase com entonação de pergunta (parli italiano?). Palavras interrogativas vão no início: dove, come, perché."],
   "ex": [["Non parlo inglese.", "Eu não falo inglês."], ["Non vedo nessuno.", "Não vejo ninguém."], ["Non ho mai visto quel film.", "Nunca vi esse filme."], ["Non abito più a Bologna.", "Não moro mais em Bolonha."]],
   "src": "Negação conferida: LibreTexts, «3.14 Negativi» (Blum e Gemmani, CC BY-NC-SA 4.0) e Pressbooks, «Italian Language and Culture II: Negative expressions» (CC BY-NC 4.0), que você enviou. As perguntas (entonação e palavras interrogativas) foram escritas por Claude, sem fonte conferida."},
  "prep": {
   "p": ["«A»: cidades (a Roma), antes de refeições (a pranzo, a cena), a destra/a sinistra, a piedi e expressões como a casa e a scuola. «In»: países (in Italia), meios de transporte (in treno, in macchina), cômodos da casa (in cucina), meses (in ottobre) e a duração de algo (in due mesi). «Da»: origem (da Bologna) e a casa ou o local de trabalho de alguém (da Lucia, dal dentista).",
         "Cuidado: existem muitas exceções, e «a casa» (em casa) não é «in casa» (dentro da casa)."],
   "ex": [["Vado a Roma.", "Eu vou a Roma."], ["Vado in treno.", "Eu vou de trem."], ["Vai in cucina.", "Vá para a cozinha."], ["Vengo da Milano.", "Eu venho de Milão."]],
   "src": "Conferido: Flexi Classes, «Italian prepositions: A, IN or DA?» (página que você enviou; é um guia de uma escola de idiomas, não uma gramática oficial). As formas e contrações de di, a, da, in, con, su, per e tra/fra seguem o Wikibooks «Italian/Grammar/Prepositions»."}},
 "en": {"falsos": {
   "p": ["São palavras parecidas com o português, mas com outro sentido. Exemplos da tabela e das frases: library é biblioteca (livraria é bookstore); pretend é fingir (pretender é intend); actually é na verdade (atualmente é nowadays); college é faculdade (colégio é school); costume é fantasia (costume é habit); mayor é prefeito (maior é bigger).",
         "Quando a palavra parecer fácil demais, desconfie e confira no contexto."],
   "ex": [["library = biblioteca", "(livraria = bookstore)"], ["actually = na verdade", "(atualmente = nowadays)"], ["mayor = prefeito", "(maior = bigger)"], ["costume = fantasia", "(costume = habit)"]],
   "src": "Conferido: Toda Matéria, «Falsos cognatos em inglês (false friends)» (página que você enviou): a tabela e as frases de exemplo cobrem os 12 itens. É um site de ensino, não um dicionário."}}}
