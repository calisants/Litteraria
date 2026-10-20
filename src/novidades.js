/* Notas de atualização: mais nova primeiro. Acrescente uma entrada a cada versão publicada (mesmo número de VERSION). */
const NOVIDADES=[
{v:"1.38.0",d:"2026-10-20",t:[
"Novo: «Salvar como imagem» na Frase do dia e no Álbum de citações, com a frase, a tradução e o nome do livro",
"A imagem é gerada no próprio aparelho; no celular abre o menu de compartilhar, no computador baixa o arquivo"]},
{v:"1.37.0",d:"2026-10-20",t:[
"Leitor de livros: botão «Aa» para ajustar o tamanho da letra (4 tamanhos), o espaço entre linhas e o fundo (padrão, sépia ou escuro)",
"A escolha fica salva e vale só no leitor"]},
{v:"1.36.0",d:"2026-10-20",t:[
"Novo: contexto histórico e cultural nos 7 livros com texto completo (Peter Rabbit, Alice, Frankenstein, O Príncipe, Perrault, Grimm e Collodi)",
"Cada livro tem «Sobre o livro e a época»; cada capítulo tem suas notas, todas com a fonte e o link",
"Fatos conferidos em páginas abertas durante a pesquisa; o resumo é escrito por Claude"]},
{v:"1.35.0",d:"2026-10-20",t:[
"Leitor: toque em qualquer palavra do capítulo para ver o significado e ouvir (inglês, francês e italiano)",
"Novo glossário com as 1.650 palavras mais frequentes dos livros (traduções escritas por Claude, sem fonte conferida)",
"Novo: «Meu caderno de palavras» (em Livros) e «Guardar no caderno» no leitor; as palavras do caderno voltam nos cartões de revisão"]},
{v:"1.34.0",d:"2026-10-20",t:[
"Meta de hoje e Frase do dia agora ficam em Lições (a tela inicial ficou mais limpa)",
"Novo: notas de atualização (Ajustes → Sobre e ajuda → Novidades)",
"Novo: cartões de revisão no Treino, com «Fácil» e «Preciso rever» (sem tempo e sem pontos)"]},
{v:"1.33.0",d:"2026-10-19",t:[
"Tradução literal (segue a ordem do original) e natural, com botão para alternar nos contos, em Alice, O Príncipe e nos livros italianos",
"Citação e «De qual livro?»: tradução só aparece pelo botão de dica",
"Frases erradas voltam para revisão no dia seguinte"]},
{v:"1.32.1",d:"2026-10-19",t:["Intruso: a tradução só aparece depois de acertar"]},
{v:"1.32.0",d:"2026-10-19",t:[
"Contos de Collodi completos (15 contos)",
"Vocabulário ampliado: Perrault, Collodi, Mosqueteiros e Divina Comédia"]},
{v:"1.30.0",d:"2026-10-19",t:["Novo livro em italiano: contos de Collodi («I racconti delle fate»)"]},
{v:"1.29.0",d:"2026-10-19",t:["Texto completo de 17 contos dos Irmãos Grimm (inglês)"]},
{v:"1.28.0",d:"2026-10-19",t:["Vocabulário ampliado de Alice, Vento nos Salgueiros, Sherlock e Frankenstein","Novo livro de vocabulário: Contos dos Irmãos Grimm"]},
{v:"1.27.0",d:"2026-10-19",t:["Contos de Perrault completos (francês)","Estilos novos: Salão das Fadas, Floresta Encantada, Contos à Luz de Vela","Estilos visuais agrupados em Ajustes"]}
];
function renderNews(){
  const el=$("#news-list");if(!el)return;
  el.innerHTML=NOVIDADES.map(n=>'<article class="news"><h3>Versão '+esc(n.v)+' · '+esc(n.d.split("-").reverse().join("/"))+'</h3><ul>'+n.t.map(x=>"<li>"+esc(x)+"</li>").join("")+"</ul></article>").join("");
}
window.renderNews=renderNews;
document.addEventListener("click",e=>{if(e.target.closest&&e.target.closest("#open-news")){go("news");renderNews();}});
