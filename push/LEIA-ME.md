# Notificações com o app fechado (Web Push)

Como funciona, em 3 peças:
1. **O celular** (app instalado na tela inicial) pede permissão e se inscreve no serviço de push do próprio sistema (Apple no iPhone, Google no Android). Código: `src/push.js`, `src/pushcfg.js`, evento `push` em `sw.js`.
2. **A caixa** (`push/sink.gs`, Google Apps Script ligado a uma planilha da Camila) guarda por aparelho: endereço de envio, horário, estilo, idioma, fuso e «já estudou hoje». Sem nome, e-mail ou progresso.
3. **O remetente** (`push/send.py`, rodado de hora em hora por `.github/workflows/push.yml`) lê a caixa, vê quem está na janela do horário (do horário escolhido até 2 h depois), manda a mensagem e anota o envio.

## Montar (uma vez só)
1. Google Drive → novo Planilhas Google (nome: «Mots e Parole – notificações»). **Extensões → Apps Script.** Apague o código, cole `push/sink.gs` e troque `__SINK_KEY__` pela chave secreta (a mesma do passo 3).
2. **Implantar → Nova implantação → App da Web.** «Executar como: Eu» e «Quem pode acessar: Qualquer pessoa». Autorize. Copie o endereço que termina em `/exec`.
3. GitHub → repositório → Settings → Secrets and variables → Actions → New repository secret: `SINK_KEY` (chave secreta) e `VAPID_PRIVATE` (chave privada de envio). Os valores foram entregues à Camila na conversa; **nunca** vão para o repositório.
4. Colar o endereço `/exec` em `src/pushcfg.js` (`sink:"..."`), rodar `python3 build.py` e publicar.
5. Teste: Actions → «Lembretes (notificações)» → Run workflow; o log mostra quantos foram enviados.

## Limites (ditos na tela)
- iPhone: só iOS 16.4+ e com o app instalado pela Tela de Início (Safari → Compartilhar → Adicionar à Tela de Início). A permissão só é pedida depois de um toque.
- O GitHub pode atrasar tarefas agendadas (às vezes dezenas de minutos). Em repositório sem atividade por 60 dias o GitHub desativa as tarefas agendadas; é só reativar em Actions.
- A mensagem não conhece o progresso: o servidor só sabe se a pessoa já estudou naquele dia.
- Chaves: a pública está em `src/pushcfg.js`. Para trocar o par de chaves, gere um novo (py_vapid), atualize `pub` e o segredo `VAPID_PRIVATE`; todos precisam reativar o envio.
- Testes: `tests/t25.py` cobre a inscrição no app e o `push` do service worker; o envio de verdade (Apple/Google) só se confirma num aparelho.
