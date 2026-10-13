# Mots & Parole: como colocar no ar e instalar

Esta pasta é o app completo. Ele precisa ficar em um endereço https para o celular oferecer a instalação e para funcionar offline. Abrir o index.html direto do arquivo funciona como página, mas não instala como app.

## Arquivos

- index.html: o app, com 347 páginas em francês, italiano e inglês. Volume 1: pronúncia com IPA (62 páginas). Volume 2: jogos de palavras (216 páginas, filtráveis por tema e nível). Volume 3: gramática (33 páginas por idioma, 16 temas). Volume 4: conversação (36 páginas)
- manifest.webmanifest: nome, cores e ícones do app
- sw.js: guarda o app no aparelho para funcionar sem internet
- icon-192.png, icon-512.png, icon-maskable-512.png: ícones

Mantenha todos juntos na mesma pasta.

## Passo 1: hospedar (grátis)

### Opção A: Netlify (mais rápida)
1. Descompacte o zip no computador.
2. Entre em app.netlify.com/drop.
3. Arraste a pasta inteira para a página.
4. Você recebe um endereço https. Pode ser que o site peça login gratuito para continuar no ar.

### Opção B: GitHub Pages (fica no ar sem prazo)
1. Crie uma conta gratuita no GitHub e um repositório novo, público.
2. Envie todos os arquivos desta pasta para o repositório (botão Add file, depois Upload files).
3. Em Settings, depois Pages, escolha a branch main e a pasta root, e salve.
4. Depois de alguns minutos o endereço aparece nessa mesma tela.

## Passo 2: instalar no celular

- iPhone (Safari): abra o endereço, toque em Compartilhar e depois em Adicionar à Tela de Início.
- Android (Chrome): abra o endereço, toque nos três pontinhos e depois em Instalar app (ou Adicionar à tela inicial).
- Computador (Chrome ou Edge): ícone de instalar na barra de endereço.

Abra o app uma vez com internet. Depois disso ele funciona offline.

## Atualizar depois

Quando houver uma versão nova do index.html, substitua o arquivo no mesmo lugar e troque o número em CACHE no começo do sw.js (de v6 para v7) e a constante APP_VERSION no index.html (de "v6" para "v7"). Os dois precisam ter o mesmo número: o sw.js usa mots-parole-vN e o LocalStorage usa mots-parole-vN. Assim os aparelhos baixam a versão nova. (Ao mudar a chave do LocalStorage, as marcas de concluído começam do zero; se quiser mantê-las, não mude APP_VERSION.)

## De onde vêm as pronúncias

- IPA: dados abertos derivados do Wiktionary (WikiPron para italiano; ipa-dict para francês e inglês britânico). Para a posição do acento em italiano e inglês, o espeak-ng ajudou nos poucos casos sem registro.
- "Como fala": aproximação em português feita por regras a partir do IPA (acento em MAIÚSCULAS; ã, ẽ, õ para nasais; ü e ö para os sons do francês). Não substitui ouvir.
- Larousse e Treccani não publicam IPA em texto acessível, então não foram usados para isso.
- Vocabulário do italiano: conferido contra o dicionário do Kaikki (Wiktionary em dados abertos). Todas as palavras tiveram entrada (exceto "beige"), os gêneros dos substantivos com il/lo/la/le/i/gli batem com o dicionário, e as traduções foram lidas uma a uma contra as definições, sem erros. Ajuste feito: "costume" agora indica "traje de banho (costume da bagno)", porque sozinho significa outra coisa. Os artigos com l' não têm como ser conferidos assim.
- Vocabulário do francês: conferido contra o dicionário do Kaikki (Wiktionary em dados abertos). As 482 palavras têm entrada, os gêneros dos artigos le/la batem com o dicionário (as palavras com dois gêneros, como livre, mari e vague, batem no sentido usado) e as traduções foram lidas contra as definições, sem erros. Os artigos com l' e les não têm como ser conferidos assim. Vocabulário do inglês: ainda só conferido quanto à existência da palavra; falta o dicionário inglês do Kaikki.
- A voz do botão de som vem do próprio aparelho (Web Speech) e varia entre celulares.

## De onde vem a gramática (Volume 3)

Cada página tem um cartão de regra e 6 perguntas. O cartão mostra a fonte de cada regra, com um destes níveis:

- Conferido em fonte: formas verbais do francês e do italiano conferidas pela biblioteca de conjugação verbecc; formas do inglês pela biblioteca lemminflect; francês (grupos de verbos, auxiliares, passé composé) conferido no Wiktionnaire, «Conjugaison:français»; artigos do italiano conferidos na Treccani (Enciclopedia dell'Italiano, «articolo»); gêneros, plurais e falsos amigos do italiano conferidos no dicionário Kaikki (Wiktionary); gêneros, plurais e falsos amigos do francês conferidos no Kaikki francês; artigos, plural, negação, perguntas e preposições de lugar do francês conferidos no Tex's French Grammar (Universidade do Texas em Austin, CC BY 3.0), que você enviou; futuro, condicional, subjuntivo, possessivos, conjunções, advérbios, reflexivos e ordem da frase do francês conferidos no Tex's French Grammar; os mesmos temas do italiano conferidos nos capítulos do Wikibooks «Italian Grammar» (Verbs, Verbs Tenses and Moods, Verb Conjugation Reference, Conjunctions, Adverbs, Sentence Structure, Pronouns) que você enviou; os mesmos temas do inglês conferidos no Cambridge Grammar of English; presente, passado e concordância do adjetivo em italiano conferidos nos capítulos do Wikibooks «Italian Grammar» (Verbs, Verb Conjugation Reference, Adjectives, Sentence Structure) que você enviou, e a lista de preposições do italiano no capítulo Prepositions; plural, presente, passado, negação e preposições de tempo do inglês conferidos no Cambridge Grammar of English (Carter e McCarthy), cujo PDF foi fornecido pela usuária.
- Escrito por Claude, sem fonte conferida: negação e perguntas do italiano e os usos de a/in/da do italiano, classes de palavras (três idiomas) e falsos amigos do inglês, além das regras de a/an e de preposições de lugar do inglês. Também sem fonte conferida: o uso de «non … mai» em italiano e a posição dos advérbios de frequência em inglês. O capítulo de conjunções do Wikibooks italiano mostra o congiuntivo nos exemplos, mas não enuncia a regra. Ainda não existe a página de sinônimos e antônimos: ela depende do dicionário inglês do Kaikki.
- Os livros não foram copiados: as regras foram reescritas e os exemplos são próprios. Use o volume como apoio de estudo e confirme em uma gramática impressa antes de decidir dúvidas finas.

## Observações

- As fontes do título vêm do Google Fonts. Se o aparelho nunca abriu o app com internet, usa uma fonte parecida do sistema.
- Só é guardado o que está concluído (por idioma e página) e os ajustes (idioma, layout, claro/escuro, cor, som, teclado), o perfil do jogador (nome, frase e logo) e as estatísticas (partidas concluídas, erros e palavras dominadas). Nenhum progresso parcial é salvo, como num caderno de papel.
- Os sons são gerados pelo próprio app (Web Audio) e podem ser desligados em Ajustes.
