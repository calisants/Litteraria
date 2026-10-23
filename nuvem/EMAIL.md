# Trocar o e-mail do Litteraria e mudar o layout dos e-mails

## 1. Layout novo dos e-mails de entrada (Supabase)
Supabase → Authentication → Emails (Templates). Cole o HTML e troque o assunto:

| Modelo do Supabase | Quem recebe | Arquivo | Assunto sugerido |
|---|---|---|---|
| **Confirm sign up** | quem entra pela 1ª vez (vira o «e-mail de boas-vindas») | `emails/boas-vindas.html` | Bem-vindo(a) ao Litteraria: seu código de entrada |
| **Magic Link** | quem já tem conta | `emails/codigo.html` | Seu código do Litteraria |

- O código vem de `{{ .Token }}` e o endereço de `{{ .Email }}` (variáveis do próprio Supabase). Não apague.
- O ícone no topo carrega de `https://litteraria.com.br/icon-192.png`; se a imagem não abrir no e-mail, o texto «Litteraria» aparece no lugar.
- Para editar os modelos o Supabase exige SMTP próprio (você já tem).
- O Supabase não manda um e-mail «de boas-vindas» separado depois do cadastro; por isso o modelo da 1ª entrada já faz esse papel.

## 2. O que depende do e-mail atual (se você trocar de conta)
Marque conforme for fazendo:
- [ ] **Supabase → SMTP** (Project Settings → Authentication → SMTP): endereço remetente, nome («Litteraria») e a senha de app do Gmail novo (precisa de verificação em duas etapas no Gmail novo).
- [ ] **Conta do Supabase**: convide o e-mail novo como dono da organização (ou troque o e-mail da conta) antes de deixar o antigo.
- [ ] **Registro.br** (litteraria.com.br): troque o e-mail de contato do titular. É para lá que vão os avisos de renovação (R$ 40/ano).
- [ ] **GitHub**: o repositório continua na conta `calisants`; só mude se quiser trocar o e-mail da conta em Settings → Emails. Não afeta o app.
- [ ] **Pasta «litteraria» no Drive** (formulário de sugestões, planilha de respostas, planilha de notificações): transfira a **propriedade** para a conta nova (Compartilhar → ao lado do nome → «Transferir a propriedade»). O link do formulário (`FB_FORM` em `p10.js`) não muda.
- [ ] **Apps Script das notificações** (`push/sink.gs`): se ele continuar na conta antiga, nada muda. Se você recriar na conta nova, o endereço `sink` em `src/pushcfg.js` muda e preciso republicar.
- [ ] **Conectores do Claude** (Drive e Gmail): estão ligados à conta antiga. Para eu enxergar a pasta nova, reconecte com a conta nova.
- [ ] **Quem já tem conta no app** entra com o próprio e-mail; não muda nada para eles.
- Não muda: chave VAPID, segredos do GitHub, endereço do app, progresso salvo.

## 3. Alternativa (sem criar outro Gmail)
Enviar os códigos de um endereço do próprio domínio, como `nao-responda@litteraria.com.br`, com um serviço de e-mail transacional (por exemplo Resend ou Brevo) ligado ao SMTP do Supabase. Isso exige registrar SPF e DKIM no DNS do Registro.br. Não conferi preços nem limites atuais desses serviços; veja a página de cada um antes de escolher.
