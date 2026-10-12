# Mots & Parole: como colocar no ar e instalar

Esta pasta é o app completo. Ele precisa ficar em um endereço https para o celular oferecer a instalação e para funcionar offline. Abrir o index.html direto do arquivo funciona como página, mas não instala como app.

## Arquivos

- index.html: o app, com 314 páginas em francês, italiano e inglês. Volume 1: jogos de palavras (216 páginas, filtráveis por tema e nível). Volume 2: pronúncia com IPA (62 páginas). Volume 3: conversação (36 páginas)
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
- Larousse e Treccani não publicam IPA em texto acessível, então não foram usados para isso. Traduções, gêneros e artigos do vocabulário foram escritos à mão e conferidos só quanto à existência da palavra; vale uma leitura de alguém fluente.
- A voz do botão de som vem do próprio aparelho (Web Speech) e varia entre celulares.

## Observações

- As fontes do título vêm do Google Fonts. Se o aparelho nunca abriu o app com internet, usa uma fonte parecida do sistema.
- Só é guardado o que está concluído (por idioma e página) e os ajustes (idioma, layout, claro/escuro, cor, som, teclado, nome). Nenhum progresso parcial é salvo, como num caderno de papel.
- Os sons são gerados pelo próprio app (Web Audio) e podem ser desligados em Ajustes.
