# Mots & Parole: notas para quem for mexer neste repositório

App de palavras (francês, italiano, inglês) em um único `index.html`, publicado no GitHub Pages. O `index.html` é **gerado**: edite `src/` e rode `cd src && python3 build.py`. Veja `src/README.md`.

## Como a Camila quer ser atendida
- Português do Brasil, resposta direta, explicada, com exemplos e sem abstrações.
- Informação o mais verídica possível. Todo cartão de regra tem um rótulo honesto: «Conferido: <fonte>» ou «Escrito por Claude, sem fonte conferida». Nunca cite uma página que não conseguiu abrir.
- Achar links e fontes é trabalho de quem atende; ela só envia arquivos quando a página não abre (o Cambridge, por exemplo, bloqueia o leitor de páginas).
- «Corrija imediatamente» significa corrigir sem perguntar de volta.
- Não copie texto protegido por direitos autorais (Treccani, Cambridge etc.): use os fatos e escreva com palavras próprias.

## Regras técnicas
- Ao publicar, troque o número do cache em `sw.js` (mots-parole-vNN). **Não mude `APP_VERSION` em `src/p3.js`** (v6), senão o progresso dela some.
- Rodar antes de publicar: `python3 -I tests/gt.py`, `t10.py`, `t11.py`, `t13.py` (dentro de `src/`). O único erro esperado no t11 é o de fontes não encontradas (ele abre o arquivo fora do site).
- Conteúdo de gramática: `src/tools/` (geradores) e `src/content5.js` (gerado por `tools/mk_content5.py`). As correções de rótulo e de texto dos cartões ficam em `tools/gram_rules3.py` (dicionário `OV`).
- Commits terminam com os trailers de atribuição pedidos pela sessão.

## Estado e pendências (outubro de 2026)
- Ordem didática das páginas de gramática já aplicada (está no `LEIA-ME.md`).
- Sem exercício ainda: pronome, conjunção e interjeição (italiano); as preposições soltas do inglês (above, among, during etc.) e «easily confused words», cujos PDFs do Cambridge ela já enviou, ainda não viraram páginas.
- Sem fonte conferida: «a university» e instrumentos com «the» (inglês), «in Brazil» / «in the kitchen» (inglês), a divisão em «três grupos» e o «-issant» (francês).
- Fora de escopo por decisão dela: amigos, perfil compartilhado e servidor.
- Reconhecimento de fala para pronúncia: não começado; só funciona em Chrome/Android e precisa da confirmação dela.
