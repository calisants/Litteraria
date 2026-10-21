/* ===== Política de Privacidade (texto que aparece no app) =====
   Descreve o que o app realmente faz. As partes sobre conta e lembretes só aparecem quando esses recursos estão ligados (CLOUDCFG / PUSHCFG).
   Mudou algo no que o app guarda ou envia? Atualize o texto e PRIV_VER. */
const PRIV_VER="2026-10-21";
function privSections(){
  const cloud=!!(window.CLOUDCFG&&CLOUDCFG.url&&CLOUDCFG.key),push=!!(window.PUSHCFG&&PUSHCFG.sink);
  const s=[];
  s.push(["Quem cuida dos seus dados","O Mots & Parole é feito por Camila (@calisants), que decide como os dados do app são tratados. Para falar sobre privacidade, use Ajustes → Sobre e ajuda → «Enviar sugestão ou avisar de erro»."]);
  s.push(["Sem conta, nada sai do seu aparelho","O progresso, os ajustes, o nome que você digitar, o caderno de palavras e as citações favoritas ficam só no armazenamento deste aparelho. O app não tem anúncios e não usa ferramentas de estatística de terceiros."]);
  if(cloud)s.push(["Conta (opcional)","Se você criar uma conta, guardamos: o seu e-mail; uma cópia do seu progresso (lições feitas, pontuações, revisões, caderno de palavras, favoritos, ajustes e o nome que você digitou); e a data em que você aceitou esta política e confirmou ter 13 anos ou mais. Isso serve só para você recuperar o progresso se trocar de celular e usar o app em mais de um aparelho. Os dados ficam no Supabase, um serviço de terceiros; eles não ficam no GitHub nem em outro lugar do app. Cada conta só consegue ler e alterar os próprios dados. Tecnicamente, quem administra o projeto tem acesso a eles; esse acesso é para manter o serviço e atender pedidos seus."]);
  if(push)s.push(["Lembretes com o app fechado (opcional)","Se você ativar, enviamos para uma planilha da criadora do app: o endereço de envio do seu aparelho (fornecido pela Apple, Google ou Mozilla), o horário escolhido, o estilo do lembrete, o idioma e se você já estudou naquele dia. Sem nome, sem e-mail, sem progresso. Uma rotina do GitHub lê essa planilha e manda o aviso. Desligar os lembretes remove a sua linha."]);
  s.push(["Sugestões e avisos de erro","O que você escrever no formulário de sugestões vai para um Google Formulários da criadora. Não escreva dados pessoais ali."]);
  if(cloud)s.push(["Seus direitos","Você pode, a qualquer momento e sem justificar: baixar tudo o que guardamos sobre você («Baixar meus dados»), apagar a conta e todos os dados da nuvem («Apagar minha conta e dados») e sair do aparelho. Pode também pedir correção ou esclarecimentos pelo formulário de sugestões. Apagar a conta não apaga o progresso que já está no seu aparelho."]);
  if(cloud)s.push(["Idade","Contas são para quem tem 13 anos ou mais. Se você tem entre 13 e 17 anos, converse com uma pessoa responsável antes de criar a conta. Quem tem menos de 13 não deve criar conta: o app funciona normalmente sem ela."]);
  s.push(["Quanto tempo guardamos",cloud?"Enquanto a conta existir. Ao apagar a conta, os dados da nuvem são removidos. Cópias de segurança do serviço, se houver, seguem as regras dele.":"No seu aparelho, até você apagar os dados do navegador ou do app."]);
  s.push(["Mudanças","Se este texto mudar, a data abaixo muda. Versão do texto: "+PRIV_VER+". Este texto explica o que o app faz; não é aconselhamento jurídico."]);
  return s;
}
function privHtml(){return privSections().map(x=>'<h3 class="lab" style="margin-top:14px">'+esc(x[0])+'</h3><p class="help" style="white-space:pre-line">'+esc(x[1])+"</p>").join("");}
function openPrivacy(){openSheet("Política de Privacidade",privHtml(),false);}
document.addEventListener("click",e=>{const t=e.target.closest&&e.target.closest("#open-priv,[data-open-priv]");if(t){e.preventDefault();openPrivacy();}});
