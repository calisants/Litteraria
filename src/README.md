# Código-fonte do Mots & Parole

O `index.html` da raiz é **gerado** a partir desta pasta. Não edite o `index.html` à mão.

## Como reconstruir
    cd src
    python3 build.py        # monta o app e atualiza ../index.html
    python3 tests/gt.py     # 35 páginas por idioma (precisa de playwright)
    python3 tests/t10.py ; python3 tests/t11.py

## O que é cada parte
- `p1.html` (CSS) e `p2.html` (telas) · `p3.js` (estado, salvar/carregar) · `p4`–`p7.js` (jogos) · `p9.js` (motor de gramática) · `p10.js` (Hoje, revisão, Treino, backup).
- `data.js`, `content*.js`, `pron.js`, `sons.js`: dados. `content5.js` é **gerado** por `tools/mk_content5.py`.

## Gerar o conteúdo de gramática (`tools/`)
    cd tools
    python3 -I gram_gen.py ; python3 -I gram_gen2.py ; python3 -I gram_gen3.py   # geram gram_items*.json
    python3 -I mk_content5.py ../content5.js
Os geradores usam dicionários grandes que NÃO estão no repositório (Kaikki FR/IT, WordNet 3.0,
verbecc/lemminflect via pip). Ajuste os caminhos no topo de cada script (`sys.path`, `D=`) antes de rodar.
Os arquivos `gram_items*.json`, `bank.json` e `syn_*.json` já estão prontos aqui.

## Ao publicar
Troque o número do cache em `../sw.js` (mots-parole-vNN). Não mude `APP_VERSION` em `p3.js`, senão o progresso some.
