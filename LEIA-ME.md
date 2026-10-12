# Mots & Parole: como colocar no ar e instalar

Esta pasta é o app completo. Ele precisa ficar em um endereço https para o celular oferecer a instalação e para funcionar offline. Abrir o index.html direto do arquivo funciona como página, mas não instala como app.

## Arquivos

- index.html: o app (os três jogos, os 23 temas e as traduções)
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

Quando houver uma versão nova do index.html, substitua o arquivo no mesmo lugar e troque o número em CACHE no começo do sw.js (de v1 para v2). Assim os aparelhos baixam a versão nova.

## Observações

- As fontes do título vêm do Google Fonts. Se o aparelho nunca abriu o app com internet, usa uma fonte parecida do sistema.
- O progresso não é salvo entre jogos. Só são lembrados o idioma, o modo, a aba e o tema escolhidos.
