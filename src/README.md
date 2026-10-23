# Código-fonte do Litteraria (antes Mots & Parole)

O `index.html` da raiz é **gerado** a partir desta pasta. Não edite o `index.html` à mão.

## Como reconstruir
    cd src
    python3 build.py        # monta o app e atualiza ../index.html
    for t in gt t10 t11 t13 t14 t15 t16 t17 t18 t19 t20 t21 t22 t23 t24 t25 t26 t27 t28 t29 t30 t31 t32 t33 t34 t35; do python3 -I tests/$t.py || break; done   # um de cada vez; todos têm de passar antes de publicar

## O que é cada parte
- `p1.html` (CSS) e `p2.html` (telas) · `p3.js` (estado, salvar/carregar) · `p4`–`p7.js` (jogos) · `p9.js` (motor de gramática) · `p10.js` (Hoje, revisão, Treino, backup, versão, envio de sugestões) · `p11.js` (exercícios de escrita do Vocabulário).
- `content6.js` define a ordem final dos volumes (ids internos: 1 jogos, 2 pronúncia, 3 conversação, 4 gramática, 5 vocabulário; páginas movidas guardam `vid` para manter o sorteio).
- `VERSION` (ex.: `1.1.0 2026-10-15`): o `build.py` gera `version.js`. Atualize a cada publicação.
- `data.js`, `content*.js`, `pron.js`, `sons.js`: dados. `content5.js` é **gerado** por `tools/mk_content5.py`.

## Gerar o conteúdo de gramática (`tools/`)
    cd tools
    python3 -I gram_gen.py ; python3 -I gram_gen2.py ; python3 -I gram_gen3.py   # geram gram_items*.json
    python3 -I mk_content5.py ../content5.js
Os geradores usam dicionários grandes que NÃO estão no repositório (Kaikki FR/IT, WordNet 3.0,
verbecc/lemminflect via pip). Ajuste os caminhos no topo de cada script (`sys.path`, `D=`) antes de rodar.
Os arquivos `gram_items*.json`, `bank.json` e `syn_*.json` já estão prontos aqui.

## Ao publicar
Troque o número do cache em `../sw.js` (mots-parole-vNN) e a linha de `VERSION`. Não mude `APP_VERSION` em `p3.js`, senão o progresso some.

## Formulário de sugestões
O app envia para um Google Forms. Em `p10.js`, preencha `FB_FORM` (`action` = URL do formulário terminando em `/formResponse`; `kind`, `text`, `info` = `entry.NNN` de cada pergunta). Já configurado (formulário de sugestões e erros). Se `action` ficar vazio, o envio fica desligado e só há "Copiar o texto". Formulário e planilha de respostas: pasta «litteraria» no Drive da Camila.

## Dicionário e sílabas
`p12.js` é o dicionário (tela «Dicionário» na página inicial). As sílabas ficam em `sil.js`, **gerado** por `tools/mk_syl.py` (usa `syl_fr.py`, `syl_en.py`, o arquivo Kaikki do italiano e os pacotes pip `pyphen` e `cmudict`; ver o topo do script para a fonte de cada idioma). Se mudar as palavras em `data.js`, rode o gerador de novo (o `t15.py` falha se faltar divisão).
