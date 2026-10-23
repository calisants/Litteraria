# Litteraria (antes Mots & Parole): como colocar no ar e instalar

Esta pasta é o app completo. Ele precisa ficar em um endereço https para o celular oferecer a instalação e para funcionar offline. Abrir o index.html direto do arquivo funciona como página, mas não instala como app.

## Arquivos

- `index.html`: o app inteiro (francês, italiano e inglês). É **gerado** a partir de `src/` (`cd src && python3 build.py`); não edite à mão. Os 5 volumes, na ordem de aprendizado: 1 Pronúncia, 2 Vocabulário, 3 Jogos, 4 Gramática, 5 Conversação, mais Livros (frases, leitura e capítulos completos de livros de domínio público), Treino, Dicionário, Estatísticas, Perfil e Amigos. Versão e data: `src/VERSION` (aparece em Ajustes → Sobre e ajuda).
- `manifest.webmanifest`: nome, cores e ícones do app.
- `sw.js`: guarda o app no aparelho para funcionar sem internet.
- `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`: ícones.
- `books/`: texto completo dos livros, carregado só quando a pessoa abre o capítulo. `fonts/`: fontes locais.
- `nuvem/` (conta, amigos, avisos no Supabase) e `push/` (lembretes com o app fechado): têm o próprio `LEIA-ME.md`.
- `CNAME`: o endereço do app (`litteraria.com.br`) no GitHub Pages.

Mantenha tudo na mesma pasta.

## Onde está publicado

GitHub Pages, repositório `calisants/motsparole`, branch `main`, pasta raiz, com o domínio `litteraria.com.br` (Registro.br; DNS: 4 registros A do GitHub Pages e CNAME `www`). Cada commit na `main` publica sozinho. O endereço antigo `calisants.github.io/motsparole` redireciona para o domínio.

## Instalar no celular

- iPhone (Safari): abra **litteraria.com.br**, toque em Compartilhar e depois em Adicionar à Tela de Início. Só assim o app abre sem a barra do Safari.
- Android (Chrome): abra o endereço, toque nos três pontinhos e depois em Instalar app (ou Adicionar à tela inicial).
- Computador (Chrome ou Edge): ícone de instalar na barra de endereço.

Abra o app uma vez com internet. Depois disso ele funciona offline. O armazenamento do aparelho é por endereço: ao mudar de endereço, o progresso só vem junto por backup (Ajustes → Dados) ou pela conta na nuvem (Perfil).

## Atualizar depois

Edite os arquivos em `src/`, rode `python3 build.py` e os testes (lista em `src/README.md`), troque o número do cache em `sw.js` (`mots-parole-vNN`) e a linha de `src/VERSION`, acrescente a entrada em `src/novidades.js` e publique. **Não mude `APP_VERSION` em `src/p3.js`** (`v6`): ele é a chave do LocalStorage, e mudar apaga o progresso de quem já usa o app. O número do cache em `sw.js` pode mudar à vontade.

## De onde vêm as pronúncias

- IPA: dados abertos derivados do Wiktionary (WikiPron para italiano; ipa-dict para francês e inglês britânico). Para a posição do acento em italiano e inglês, o espeak-ng ajudou nos poucos casos sem registro.
- "Como fala": aproximação em português feita por regras a partir do IPA (acento em MAIÚSCULAS; ã, ẽ, õ para nasais; ü e ö para os sons do francês). Não substitui ouvir.
- Larousse e Treccani não publicam IPA em texto acessível, então não foram usados para isso.
- Vocabulário do italiano: conferido contra o dicionário do Kaikki (Wiktionary em dados abertos). Todas as palavras tiveram entrada (exceto "beige"), os gêneros dos substantivos com il/lo/la/le/i/gli batem com o dicionário, e as traduções foram lidas uma a uma contra as definições, sem erros. Ajuste feito: "costume" agora indica "traje de banho (costume da bagno)", porque sozinho significa outra coisa. Os artigos com l' não têm como ser conferidos assim.
- Vocabulário do francês: conferido contra o dicionário do Kaikki (Wiktionary em dados abertos). As 482 palavras têm entrada, os gêneros dos artigos le/la batem com o dicionário (as palavras com dois gêneros, como livre, mari e vague, batem no sentido usado) e as traduções foram lidas contra as definições, sem erros. Os artigos com l' e les não têm como ser conferidos assim. Vocabulário do inglês: ainda só conferido quanto à existência da palavra; falta o dicionário inglês do Kaikki.
- A voz do botão de som vem do próprio aparelho (Web Speech) e varia entre celulares.

## De onde vem a gramática (Volume 4)

Cada página tem um cartão de regra e 6 perguntas. O cartão mostra a fonte de cada regra, com um destes níveis:

- Conferido em fonte: formas verbais do francês e do italiano conferidas pela biblioteca de conjugação verbecc; formas do inglês pela biblioteca lemminflect; presente em -er do francês conferido no Tex's French Grammar (cap. v1); sinônimos e antônimos conferidos no Kaikki (francês e italiano) e no Princeton WordNet 3.0 (inglês); artigos do italiano conferidos na Treccani (Enciclopedia dell'Italiano, «articolo»); gêneros, plurais e falsos amigos do italiano conferidos no dicionário Kaikki (Wiktionary); gêneros, plurais e falsos amigos do francês conferidos no Kaikki francês; artigos, plural, negação, perguntas e preposições de lugar do francês conferidos no Tex's French Grammar (Universidade do Texas em Austin, CC BY 3.0), que você enviou; futuro, condicional, subjuntivo, possessivos, conjunções, advérbios, reflexivos e ordem da frase do francês conferidos no Tex's French Grammar; os mesmos temas do italiano conferidos nos capítulos do Wikibooks «Italian Grammar» (Verbs, Verbs Tenses and Moods, Verb Conjugation Reference, Conjunctions, Adverbs, Sentence Structure, Pronouns) que você enviou; os mesmos temas do inglês conferidos no Cambridge Grammar of English; presente, passado e concordância do adjetivo em italiano conferidos nos capítulos do Wikibooks «Italian Grammar» (Verbs, Verb Conjugation Reference, Adjectives, Sentence Structure) que você enviou, e a lista de preposições do italiano no capítulo Prepositions; plural, presente, passado, negação e preposições de tempo do inglês conferidos no Cambridge Grammar of English (Carter e McCarthy), cujo PDF foi fornecido pela usuária.
- Conferido: negação do italiano (LibreTexts «3.14 Negativi», Pressbooks «Negative expressions»), a/in/da (Flexi Classes, guia de escola, não gramática oficial), falsos amigos do inglês (Toda Matéria), perguntas do italiano (Learn Italian, UNC), francês: presente, passé composé, imparfait e classes (Tex's French Grammar, CC BY 3.0: vir1, virr1, virr2, virr4, tap2, tap3, tap5, tap6, v1, no1, adj1, adv1, det1, pre1), a/an e artigo zero do inglês (Wikipédia «English articles») e in/on/at (Grammarly, blog comercial).
- Inglês conferido nos PDFs do Cambridge Dictionary «Grammar» (English Grammar Today) que Camila enviou: posição dos advérbios de frequência, at/on/in de tempo e de lugar, at/in/to com movimento, classes de palavras, substantivos, adjetivos, advérbios e conjunções. Correção feita: o advérbio de frequência fica na posição do meio, mas DEPOIS de «be» (she's always late) e do primeiro auxiliar.
- Italiano: as nove classes tradicionais conferidas na Treccani («Parti del discorso», só a lista) e definições resumidas na página «POS tags» do Universal Dependencies (definições genéricas; sem licença informada) e «non … mai» nos PDFs de negação. Francês e italiano: preposições, advérbios, conjunções e ordem já estavam conferidos no Tex's French Grammar e no Wikibooks.
- Ainda sem fonte conferida: exemplo «a university» e instrumentos com «the» no inglês, «in Brazil» e «in the kitchen» (a regra de área maior está conferida, as palavras não), a divisão do francês em «três grupos» e o «-issant». Os PDFs de preposições soltas (above, among, beyond etc.) e «easily confused words» ainda não foram usados.
- Os livros não foram copiados: as regras foram reescritas e os exemplos são próprios. Use o volume como apoio de estudo e confirme em uma gramática impressa antes de decidir dúvidas finas.

## Observações

- As fontes (Atkinson Hyperlegible e Newsreader) ficam em `fonts/` e funcionam sem internet.
- O app guarda no aparelho: páginas concluídas por idioma, ajustes (idioma, estilo visual, claro/escuro, som, teclado, lembretes), perfil (nome, frase, ícone, livro favorito), estatísticas, revisões, caderno de palavras e álbum de citações. Se uma lição ou jogo for interrompido, o app tenta voltar a ele quando é reaberto em até 3 horas. Com conta na nuvem (opcional) o mesmo progresso fica guardado no Supabase. O texto completo está em Ajustes → Sobre e ajuda → Política de Privacidade.
- Os sons de aviso são gerados pelo próprio app (Web Audio) e podem ser desligados em Ajustes. A voz do botão de áudio vem do aparelho.
- Novidades de cada versão: Ajustes → Sobre e ajuda → «Novidades desta versão» (arquivo `src/novidades.js`).

## Conferências desta rodada
- Vocabulário inglês: 470 das 483 palavras estão no WordNet 3.0; as 13 restantes são palavras funcionais, plurais e expressões (see you, excuse me, cheers, when, how, how much, what, which, where, because, parents, trousers, boots). O significado de cada uma foi comparado com a glosa do WordNet, lida por Claude, e não apareceu divergência. A tradução em si não vem de dicionário bilíngue.
- Pronúncia do italiano: os nomes das letras, gli [ʎ], sci [ʃ], «ch/gh» e as consoantes dobradas conferem com o capítulo «Pronunciation and alphabet» do Wikibooks. O IPA de cada palavra vem do WikiPron (Wiktionary).

## Ordem das páginas de gramática
Classes → artigos → plural → presente → negação e perguntas → possessivos → falsos amigos → preposições → reflexivos → ordem da frase → advérbios → passado → futuro → condicional → subjuntivo → conjunções → sinônimos. É um critério didático meu (do mais básico ao mais complexo), não vem de uma fonte. O progresso não depende da ordem.
