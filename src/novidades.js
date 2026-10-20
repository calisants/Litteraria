/* Notas de atualização: mais nova primeiro. Acrescente uma entrada a cada versão publicada (mesmo número de VERSION). */
const NOVIDADES=[
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
