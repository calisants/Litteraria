# Mots & Parole: notas para quem for mexer neste repositório

App de palavras (francês, italiano, inglês) em um único `index.html`, publicado no GitHub Pages. O `index.html` é **gerado**: edite `src/` e rode `cd src && python3 build.py`. Veja `src/README.md`.

## Como a Camila quer ser atendida
- Português do Brasil, resposta direta, explicada, com exemplos e sem abstrações.
- Informação o mais verídica possível. Todo cartão de regra tem um rótulo honesto: «Conferido: <fonte>» ou «Escrito por Claude, sem fonte conferida». Nunca cite uma página que não conseguiu abrir.
- Achar links e fontes é trabalho de quem atende; ela só envia arquivos quando a página não abre (o Cambridge, por exemplo, bloqueia o leitor de páginas).
- «Corrija imediatamente» significa corrigir sem perguntar de volta.
- Não copie texto protegido por direitos autorais (Treccani, Cambridge etc.): use os fatos e escreva com palavras próprias.

## Regras técnicas
- Ao publicar, troque o número do cache em `sw.js` (mots-parole-vNN) e a linha de `src/VERSION` (versão e data mostradas no app). **Não mude `APP_VERSION` em `src/p3.js`** (v6), senão o progresso dela some.
- Rodar antes de publicar: `python3 -I tests/gt.py`, `t10.py`, `t11.py`, `t13.py`, `t14.py`, `t15.py`, `t16.py`, `t17.py`, `t18.py` e `t19.py` (dentro de `src/`). O único erro esperado no t11 é o de fontes não encontradas (ele abre o arquivo fora do site).
- Conteúdo de gramática: `src/tools/` (geradores) e `src/content5.js` (gerado por `tools/mk_content5.py`). As correções de rótulo e de texto dos cartões ficam em `tools/gram_rules3.py` (dicionário `OV`).
- Commits terminam com os trailers de atribuição pedidos pela sessão.

- Navegação: Início → Lições abre direto os volumes (com seletor de idioma); Ajustes agrupados (Aparência, Som e vibração, Estudo, Dados, Sobre e ajuda); «Apagar estatísticas» fica em Estatísticas.
- Volumes: 1 Pronúncia, 2 Vocabulário, 3 Jogos, 4 Gramática, 5 Conversação (`src/content6.js`). Cada jogo/exercício precisa funcionar sem áudio; os com áudio levam «(com áudio)» no nome.
- Sugestões e erros: tela própria em Ajustes → Google Forms (`FB_FORM` em `p10.js`; formulário e planilha na pasta «motseparole» do Drive dela), com «Copiar o texto» como alternativa.
- Vocabulário: toda página de exercício abre com o cartão «Palavras desta página» (as palavras antes das perguntas); a 1ª página de cada tema é «Conheça as palavras».

- Dicionário (`src/p12.js`, sílabas em `src/sil.js`, exemplos em `src/exemplos.js`): cada idioma mostra a fonte das sílabas e dos exemplos na própria tela; não afirme mais do que a fonte permite. Exemplos (Wikcionário, CC BY-SA 4.0, traduzidos por Claude) para 116 palavras do francês, 55 do italiano e 154 do inglês (inglês: arquivo Kaikki `en_ex.jsonl` que ela extraiu; escolha e conferência em `tools/pick_ex_en.py`).
- Temas de livros (lições novas de Vocabulário, só no idioma do livro, no fim da trilha; as lições antigas não mudam): `src/tools/pp_words.txt` (fr, «O Pequeno Príncipe»), `livro_verne.txt` (fr, «A Volta ao Mundo em 80 Dias»), `livro_pinocchio.txt` (it, «As Aventuras de Pinóquio»; gênero m/f no 4º campo, artigo calculado; `it_hy.json` = sílabas do Wikcionário) `livro_alice.txt` (en, «Alice no País das Maravilhas») e `livro_peter.txt` (en, «Peter Rabbit», Gutenberg, ePub que ela enviou; só ~82 palavras, o livro é curto) → `tools/mk_livros.py` → `src/livros_data.js`; lógica em `src/livros.js` (páginas com `langs`, `BOOKCAT`, `BOOKTHEMES`). Textos: Verne e Pinocchio vieram dos ePubs do Gutenberg que ela enviou; Alice, do nltk_data (GitHub). Só as palavras, nenhuma frase do livro. Exceção: `src/livros_frases.js` (Verne, Pinóquio, Alice; nunca o Pequeno Príncipe, que não é domínio público) traz 10 frases verbatim por livro, em 2 páginas «Construção de frases» (`frases-livro-<id>-N`, tipo `frases`, com `book`, `lines`, `langs`), no fim da trilha; `python3 -I tools/chk_frases.py <pasta com verne.txt, pinocchio.txt, carroll-alice.txt>` confere que cada frase está no texto. Tradução e nota: Claude, sem fonte conferida. Existência/gênero conferidos (fr e it: Wikcionário/Kaikki; en: dicionário CMU); tradução de Claude, sem fonte conferida. O Gutenberg não abre pelo sandbox (só GitHub/PyPI); livros novos: ela envia o ePub/PDF.
- Estilos visuais (Ajustes → Aparência): Padrão + Fofo (rosa bebê, azul céu, lavanda e champagne), Soft elegante (branco/bege/dourado, nude e salmão) Minimalista e, a pedido dela (17/10/2026), um estilo por livro: «Horta do Peter» (Peter Rabbit, 18/10), «Céu estrelado» (O Pequeno Príncipe), «País das Maravilhas» (Alice), «Oficina de Pinóquio» e «Volta ao Mundo» (Verne), cada um com 2 esquemas (claro/escuro) e papel de parede em SVG original, gerado por `tools/mk_wallpapers.py` (bloco `BEGIN/END wallpapers` do `p1.html`); sem personagens nem ilustrações dos livros, em `STYLES` (`p3.js`) e CSS `:root[data-style=...]` no fim de `p1.html`; `S.style` e `S.scheme`. Gamificado, Dark Tech, Cultural e Analítico foram retirados por decisão dela. Todo esquema novo precisa passar no teste de contraste do `t17.py`.
- Sugestões novas: ler a planilha de respostas na pasta «motseparole» do Drive (conector do Google Drive).

## Estado e pendências (outubro de 2026)
- Ordem didática das páginas de gramática já aplicada (está no `LEIA-ME.md`).
- Sem exercício ainda: pronome, conjunção e interjeição (italiano); as preposições soltas do inglês (above, among, during etc.) e «easily confused words», cujos PDFs do Cambridge ela já enviou, ainda não viraram páginas.
- Sem fonte conferida: «a university» e instrumentos com «the» (inglês), «in Brazil» / «in the kitchen» (inglês), a divisão em «três grupos» e o «-issant» (francês).
- Fora de escopo por decisão dela: amigos, perfil compartilhado e servidor.
- Reconhecimento de fala para pronúncia: não começado; só funciona em Chrome/Android e precisa da confirmação dela.

## Lição em 3 passos e destaque (18/10/2026)
- Cada tema de Vocabulário: «Conheça as palavras» → «Use a palavra na frase» (tipo `contexto`, 2 partes por tema) → jogos. Frases: Wikcionário (`EX`, `exemplos.js`) quando há; senão `src/frases_ctx.js` (`CTXC`), gerado por `tools/mk_ctx.py` a partir de `tools/ctx_fr|it|en.txt` (escritas por Claude, **sem fonte conferida**, rotuladas assim na tela; o script confere que a palavra aparece inteira, uma vez). Temas de livros não têm frase de contexto.
- Botão «Próximo» (`#sheet-next`, `p13.js`: `nextAfter`, `canGoNext`) no fim de cada página: vai direto à próxima lição da trilha.
- Destaque: `hl()` (`p3.js`) troca «texto» por negrito real; nada de « » ou parênteses de destaque na tela.
- «Ampliar» do jogo é `applyGridZoom` (havia outra `applyZoom` em `p10.js` que a sobrescrevia: todo o JS compartilha um escopo, cuidado com nomes repetidos).
- Desenhos das palavras (18/10/2026): `src/desenhos.js` (`DRAW[idioma][palavra]`, `drawSvg`), SVG originais de Claude, só objetos e animais genéricos, nunca personagens nem ilustrações de livros. Estilo «linha fina» escolhido por ela (18/10/2026): contorno fino em `--ink` + cor pastel deslocada 2px + brilhinhos (ela rejeitou o 1º estilo, de traço grosso, por parecer infantil). Hoje só inglês: 35 palavras concretas de «Alice» + rabbit. Ideia dela para depois: jogo de memória palavra × desenho. Aparecem no «Conheça» (passos 1 e 2; no passo 3 só depois de acertar), na lista «Palavras desta página» e na revelação da frase. Para incluir outro livro/idioma, acrescente entradas em `DRAW`.

- Livros que ela já enviou e ainda faltam virar tema (18/10/2026): O Vento nos Salgueiros, Frankenstein e Sherlock Holmes (en, ePub), Os Três Mosqueteiros (fr, PDF), Divina Comédia e Il Principe (it, PDF). Cada um precisa de tema (`tools/livro_<id>.txt` + `mk_livros.py`), estilo visual (`mk_wallpapers.py` + `STYLES`) e desenhos (`desenhos.js`). Ela pediu estilo visual para cada livro novo. Sem os arquivos Kaikki aqui, gênero/existência em fr e it precisam de outra fonte. Divina Comédia: poesia do séc. XIV, usar só palavras ainda vivas no italiano e avisar quais são antigas.
