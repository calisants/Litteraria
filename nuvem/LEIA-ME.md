# Conta e nuvem (Supabase)

O app guarda tudo no aparelho. Com a conta (opcional), uma cópia do progresso fica no Supabase e vale em qualquer aparelho. Entrada por **código numérico (6 a 8 dígitos; o Supabase manda 8 por padrão) enviado ao e-mail** (funciona dentro do app instalado no iPhone, ao contrário do link por e-mail).

## Montar (uma vez)
1. supabase.com → New project (plano Free). Escolha a região mais perto do Brasil que aparecer; guarde a senha do banco.
2. **SQL Editor** → cole `nuvem/setup.sql` inteiro → Run. Cria as tabelas `progress` e `consents`, as regras (cada pessoa só vê a própria linha), `delete_me()` e `ping()`.
3. **Authentication → Sign In / Providers → Email**: ligado (é o único provedor necessário). O padrão do Supabase já exige confirmar o e-mail; com código, a confirmação acontece ao digitar o código.
4. **Authentication → Email Templates → Magic Link**: troque o corpo por algo como `<p>Seu código do Litteraria: <b>{{ .Token }}</b></p><p>Vale por 1 hora.</p>` (a variável `{{ .Token }}` é o código).
5. **Envio de e-mail (obrigatório antes de abrir ao público)**: o envio embutido do Supabase só entrega para membros da sua equipe e a 2 mensagens por hora (docs: supabase.com/docs/guides/auth/auth-smtp). Em Authentication → SMTP Settings configure um provedor (os docs citam Resend, AWS SES, Postmark, SendGrid, ZeptoMail, Brevo). Normalmente exige um remetente verificado; um domínio próprio melhora a entrega.
6. **Project Settings → API**: copie a «Project URL» e a chave pública (a chave «publishable», ou a antiga `anon`). Cole em `src/nuvemcfg.js` (`url`, `key`), rode `python3 build.py` e publique. A chave pública pode ficar no app; **nunca** use a `service_role`.
7. Teste: Perfil → Conta e backup na nuvem.

## Pausa por inatividade
O plano gratuito pausa projetos após 1 semana sem atividade (supabase.com/pricing). O `push/send.py` faz uma consulta (`ping`) por dia às 12h UTC no GitHub Actions. Não conferi quais chamadas o Supabase conta como atividade; olhe o painel do projeto de vez em quando.

## Como funciona a sincronização
- Salva a cada 20 s após uma mudança, ao voltar ao app e ao abrir. «Sincronizar agora» força.
- O servidor carimba `updated_at`. O app só grava se o carimbo que ele conhece ainda é o atual; senão pergunta «usar o da nuvem» ou «usar o deste aparelho». Não há mistura automática.
- Lembretes (`rm`) e `wd` (resto do antigo Cartão do dia) não viajam entre aparelhos.
- Apagar conta: `delete_me()` remove o usuário; as linhas somem junto. O progresso local fica.

## Privacidade
Texto em `src/privacidade.js` (muda conforme os recursos ligados). Atualize `PRIV_VER` ao mudar o que o app guarda. O texto não é parecer jurídico. Dados de menores: a ANPD (Enunciado CD/ANPD nº 1/2023) diz que dados de crianças e adolescentes podem usar outras bases legais além do consentimento, sempre com o melhor interesse do jovem acima de tudo; criança, para a LGPD, é quem tem menos de 12 anos.

## Testes
`tests/t26.py` simula o Supabase (entrar, conflito, aparelho novo, baixar dados, apagar conta). O serviço de verdade só se confirma com o projeto dela.

## Cutucar (v1.44.0)
1. SQL Editor: rode `nuvem/cutucar.sql` (depois de `amigos.sql`).
2. Edge Functions → Deploy a new function → Via Editor → nome `poke` → cole `nuvem/poke/index.ts` → Deploy. Em Settings da função, **desligue «Verify JWT»** (a função confere o login sozinha).
3. Edge Functions → Secrets: `VAPID_PUBLIC` (a mesma chave pública de `src/pushcfg.js`), `VAPID_PRIVATE` (a mesma do GitHub) e `VAPID_SUBJECT` = `mailto:calisants@users.noreply.github.com`.
Limites no banco: só amigos aceitos, sem bloqueio, 1 por amigo por dia, 5 recebidas por dia, e a pessoa pode desligar. Sem aparelho inscrito, a cutucada nem é registrada.

## Amigos, parte 2 (v1.47: ícone, frase, nível e idiomas)
1. Supabase → SQL Editor → New query → cole TODO o conteúdo de `nuvem/amigos2.sql` → Run. Pode rodar mais de uma vez. (Rode antes `amigos.sql` e `cutucar.sql`, se ainda não rodou.)
2. Sem esse passo, o app continua funcionando como antes; só as duas opções novas («Meu ícone, minha frase e meu nível» e «Os idiomas que estudo») avisam que o servidor ainda não tem a parte nova.

## Avisos de convite e desafio (v1.55)
1. SQL Editor: rode `nuvem/avisos.sql` (depois de `amigos.sql`, `cutucar.sql`, `amigos2.sql` e `desafio.sql`). Pode rodar mais de uma vez.
2. Edge Functions → `poke` → cole o conteúdo novo de `nuvem/poke/index.ts` → Deploy. (Mesmo nome, mesmos segredos VAPID.)
Avisos: «te convidou para ser amigo», «aceitou o seu convite», «te desafiou», «aceitou o seu desafio». Só chegam a quem aceita avisos (a caixa «Aceitar avisos dos amigos») e tem as notificações ligadas no aparelho. Limites: 1 de cada tipo por pessoa por dia e 10 por dia recebidos; cutucadas continuam com os seus 5 por dia.

## Jardim dos amigos e rega (v1.75)
1. SQL Editor: rode `nuvem/jardim.sql` (depois de `amigos.sql`, `cutucar.sql`, `amigos2.sql`, `desafio.sql` e `avisos.sql`). Pode rodar mais de uma vez.
2. Edge Functions → `poke` → cole o conteúdo novo de `nuvem/poke/index.ts` → Deploy (agora aceita `kind: "water"`).
3. No app: Amigos → «O que meus amigos veem e preferências» → marque «O meu jardim» (começa desligado). Quem é amigo aceito e tem o jardim visível ganha o botão «🌱 Ver jardim» no cartão e pode «Regar» 1 vez por dia (máx. 5 regas por dia no jardim de cada pessoa).
Só quantidades por estágio (sombra, semente, flor, fruto) por idioma vão ao servidor, nunca palavras. Regar não muda o progresso de ninguém. O aviso é brincalhão por padrão; quem desmarca «Avisos de rega em tom brincalhão» recebe um aviso neutro. Sem o passo 1, o app avisa «O servidor ainda não tem o jardim dos amigos instalado (jardim.sql)»; sem o passo 2 a rega é registrada, mas a notificação não chega.


## Atualização 1.76 (aviso de rega com motivo)
1. SQL Editor: rode de novo `jardim.sql` (pode rodar quantas vezes quiser). Ele passa a devolver o motivo quando o aviso não sai.
2. Edge Functions → poke → Code: cole o `poke/index.ts` novo e clique em «Deploy updates».
3. Para receber avisos, o aparelho do amigo precisa de: lembretes com o app fechado ligados (Ajustes), permissão de notificações e «Aceitar avisos dos amigos» marcado. Amigos → Ajustes mostra o que falta.
