/* Notas de atualização: mais nova primeiro. Acrescente uma entrada a cada versão publicada (mesmo número de VERSION). */
const NOVIDADES=[
{v:"1.46.0",d:"2026-10-21",t:["Novo: ao tocar em «sequência / nível» na tela inicial, abre o painel com seus pontos fortes e fracos: os temas de vocabulário em que você mais acerta, os que precisam de reforço e as palavras que mais erra, com o botão «Treinar o que preciso reforçar»","Corrigido: esse toque também abria o Perfil; agora abre só o painel (o Perfil abre ao tocar no resto da faixa)","Sequência de dias continua em «Pontos e sequência»; o painel mostra só o que você realmente jogou"]},
{v:"1.45.0",d:"2026-10-21",t:["Novo: atalho «Amigos» na tela inicial (aparece quando a conta na nuvem está disponível). Sem estar logado, ele leva direto para Conta e nuvem"]},
{v:"1.44.0",d:"2026-10-21",t:["Novo: cutucar um amigo. Em Amigos, toque em «Cutucar» ao lado do nome e ele recebe uma notificação para estudar. Limite de 1 por amigo por dia; dá para desligar em «Aceitar cutucadas»","Para receber cutucadas, ligue os lembretes com o app fechado (Ajustes → Lembretes e cartão)","Política de Privacidade atualizada com o que as cutucadas guardam"]},
{v:"1.43.0",d:"2026-10-21",t:["Novo: na primeira vez que você abre o app depois de uma atualização, aparece um aviso para ler as novidades","Novo: Amigos (opcional, só com conta). Ajustes → Conta e nuvem → Amigos. Você ativa, ganha um código, e só quem tiver o código pode te adicionar. Cada um escolhe se mostra a sequência de dias e as palavras acertadas. Dá para bloquear, denunciar e desativar","Antes de usar Amigos, a criadora precisa instalar a parte nova no servidor; se ainda não estiver instalada, o app avisa"]},
{v:"1.42.2",d:"2026-10-21",t:["Conta na nuvem: o código recebido por e-mail pode ter 6 a 8 números; o texto agora diz isso"]},
{v:"1.42.1",d:"2026-10-21",t:["Conta na nuvem: as mensagens de erro agora dizem o motivo, para facilitar achar o problema"]},
{v:"1.42.0",d:"2026-10-21",t:[
"Novo: conta opcional com backup na nuvem. Ajustes → Conta e nuvem. Você digita o e-mail, recebe um código de 6 números e entra. O progresso fica guardado e vale em mais de um aparelho",
"Você pode baixar os seus dados e apagar a conta e tudo o que está na nuvem, quando quiser. Sem conta, o app continua igual, só neste aparelho",
"A Política de Privacidade (Ajustes → Sobre e ajuda) agora também explica a conta"]},
{v:"1.41.1",d:"2026-10-21",t:["Ajuste interno na preparação da conta na nuvem (compatível com as chaves novas do Supabase). Nada muda na tela"]},
{v:"1.41.0",d:"2026-10-21",t:[
"Novo: Política de Privacidade, em Ajustes → Sobre e ajuda. Ela diz o que o app guarda e o que sai do aparelho",
"Pronto para a conta opcional com backup na nuvem (entrada por código no e-mail, sincronização entre aparelhos, baixar meus dados e apagar a conta). Ela aparece em Ajustes quando o serviço estiver ligado"]},
{v:"1.40.1",d:"2026-10-21",t:[
"As notificações com o app fechado estão ligadas no app. Para receber: Ajustes → Lembretes e cartão → ligue os lembretes e toque em «Ativar envio com o app fechado». No iPhone, abra o app pelo ícone da Tela de Início"]},
{v:"1.40.0",d:"2026-10-21",t:[
"Novo: lembretes que chegam como notificação do celular mesmo com o app fechado (iPhone e Android). Ajustes → Lembretes e cartão. No iPhone, instale o app pela Tela de Início (iOS 16.4 ou mais novo)",
"O aviso não vem se você já tiver estudado naquele dia. A mensagem é sempre genérica: o servidor não sabe o seu progresso",
"Só vai para o servidor o endereço de envio do aparelho, o horário, o estilo, o idioma e se você já estudou hoje"]},
{v:"1.39.1",d:"2026-10-21",t:[
"Corrigido: o «Hoje» aparecia duas vezes na tela inicial. O Cartão do dia agora vem desligado; para usar, ative em Ajustes → Lembretes e cartão"]},
{v:"1.39.0",d:"2026-10-21",t:[
"Corrigido: ao sair do app no meio de uma lição (para usar outro app) e voltar, a lição continua de onde parou. Só se perde se você fechar o app de vez ou ficar mais de 3 horas fora",
"Em «Hoje», os jogos entram entre as lições: depois de 2 lições seguidas vem um jogo (de tipo diferente do último)",
"Novos jogos de literatura: Quem escreveu?, Ordene o trecho, Ordem dos capítulos (Alice e O Príncipe), Qual regra explica a frase? e caça-palavras e cruzadas com as palavras de cada livro",
"Novo (opcional): pontos, sequência de dias, nível e conquistas. Ajustes → Estudo → Pontos e sequências",
"Novo: lembretes para fazer a lição (3 estilos, inclusive o Cartão do dia) e aviso na tela inicial. Ajustes → Lembretes e cartão. Leia lá o que o celular permite ou não",
"Novo: Cartão do dia na tela inicial, com o que você escolher: mensagem, o que aparece em «Hoje», frase do dia, citação de um livro ou palavra do dia. Segurando o ícone do app aparecem atalhos (Hoje, Cartão do dia, Treino)",
"Novo: 6 ícones do app (Padrão, Alice, Pequeno Príncipe, Frankenstein, Soft elegante e A Divina Comédia). Ajustes → Aparência",
"Telas mais limpas: início com um botão grande «Hoje» e lista curta, Ajustes em grupos que abrem e fecham, filtros recolhidos, caixas de palavras e opções menores e mais leves",
"A Frase do dia não tem mais «Salvar como imagem» (o Álbum de citações continua com ele)"]},
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

/* ===== Aviso na primeira abertura depois de uma atualização (v1.43) =====
   Guarda a última versão vista em localStorage (fora do progresso). Quem abre o app pela 1ª vez nunca vê o aviso. */
(function(){
  const K="mots-parole-lastver";
  let last=null;
  try{last=localStorage.getItem(K);if(last===null&&localStorage.getItem(KEY)!==null)last="antes";}catch(_){}
  const cur=APP_REL.v;
  const mark=()=>{try{localStorage.setItem(K,cur);}catch(_){}};
  if(last===null||last===cur){mark();return;}
  const box=document.createElement("div");
  box.id="upd-note";box.setAttribute("role","dialog");box.setAttribute("aria-modal","true");box.setAttribute("aria-label","App atualizado");
  box.style.cssText="position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.45)";
  const n=NOVIDADES.find(x=>x.v===cur);
  box.innerHTML='<div style="max-width:420px;width:100%;background:var(--surface,#fff);color:var(--ink,#222);border:1px solid var(--line,#ccc);border-radius:16px;padding:20px;box-shadow:0 10px 30px rgba(0,0,0,.3)">'+
    '<h3 style="margin:0 0 8px;font-size:1.15rem">O app foi atualizado</h3>'+
    '<p style="margin:0 0 6px">Agora você está na versão <b>'+esc(cur)+'</b>. Leia as notas de atualização para saber o que há de novo.</p>'+
    (n?'<p style="margin:0 0 14px;color:var(--muted,#666);font-size:.92rem">Resumo: '+esc(n.t[0])+(n.t.length>1?" (e mais "+(n.t.length-1)+")":"")+'</p>':'')+
    '<div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn wide" id="upd-read">Ler as novidades</button><button type="button" class="btn wide" id="upd-close">Agora não</button></div></div>';
  const close=()=>{mark();box.remove();};
  box.addEventListener("click",e=>{
    const t=e.target.closest&&e.target.closest("button");if(!t)return;
    if(t.id==="upd-read"){close();go("news");renderNews();}
    else if(t.id==="upd-close")close();
  });
  const add=()=>document.body.appendChild(box);
  if(document.body)add();else document.addEventListener("DOMContentLoaded",add);
})();
