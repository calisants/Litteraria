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
- Rodar antes de publicar: `python3 -I tests/gt.py`, `t10.py`, `t11.py`, `t13.py`, `t14.py`, `t15.py`, `t16.py` e `t17.py` (dentro de `src/`). O único erro esperado no t11 é o de fontes não encontradas (ele abre o arquivo fora do site).
- Conteúdo de gramática: `src/tools/` (geradores) e `src/content5.js` (gerado por `tools/mk_content5.py`). As correções de rótulo e de texto dos cartões ficam em `tools/gram_rules3.py` (dicionário `OV`).
- Commits terminam com os trailers de atribuição pedidos pela sessão.

- Volumes: 1 Pronúncia, 2 Vocabulário, 3 Jogos, 4 Gramática, 5 Conversação (`src/content6.js`). Cada jogo/exercício precisa funcionar sem áudio; os com áudio levam «(com áudio)» no nome.
- Sugestões e erros: tela própria em Ajustes → Google Forms (`FB_FORM` em `p10.js`; formulário e planilha na pasta «motseparole» do Drive dela), com «Copiar o texto» como alternativa.
- Vocabulário: toda página de exercício abre com o cartão «Palavras desta página» (as palavras antes das perguntas); a 1ª página de cada tema é «Conheça as palavras».

- Dicionário (`src/p12.js`, sílabas em `src/sil.js`, exemplos em `src/exemplos.js`): cada idioma mostra a fonte das sílabas e dos exemplos na própria tela; não afirme mais do que a fonte permite. Exemplos (Wikcionário, CC BY-SA 4.0, traduzidos por Claude) só para 116 palavras do francês e 55 do italiano; inglês sem exemplos.
- Palavras de «O Pequeno Príncipe» (francês): `src/tools/pp_words.txt` (palavra|tradução|classe|artigo) → `tools/mk_pp.py` → `src/petitprince.js`. Só aparecem no Dicionário (não entram em jogos/Treino). Não copiar frases do livro. Existência/gênero conferidos no Wikcionário; tradução de Claude, sem fonte conferida.
- Estilos visuais (Ajustes → Estilo visual): 7 estilos + Padrão em `STYLES` (`p3.js`, cores por variação) e CSS `:root[data-style=...]` no fim de `p1.html`; `S.style` e `S.scheme`. Todo esquema novo precisa passar no teste de contraste do `t17.py`.
- Sugestões novas: ler a planilha de respostas na pasta «motseparole» do Drive (conector do Google Drive).

## Estado e pendências (outubro de 2026)
- Ordem didática das páginas de gramática já aplicada (está no `LEIA-ME.md`).
- Sem exercício ainda: pronome, conjunção e interjeição (italiano); as preposições soltas do inglês (above, among, during etc.) e «easily confused words», cujos PDFs do Cambridge ela já enviou, ainda não viraram páginas.
- Sem fonte conferida: «a university» e instrumentos com «the» (inglês), «in Brazil» / «in the kitchen» (inglês), a divisão em «três grupos» e o «-issant» (francês).
- Fora de escopo por decisão dela: amigos, perfil compartilhado e servidor.
- Reconhecimento de fala para pronúncia: não começado; só funciona em Chrome/Android e precisa da confirmação dela.
