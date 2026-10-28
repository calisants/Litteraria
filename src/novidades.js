/* Notas de atualização: mais nova primeiro. Acrescente uma entrada a cada versão publicada (mesmo número de VERSION). */
const NOVIDADES=[
{v:"1.75.1",d:"2026-10-28",t:["A Frase do dia saiu da tela de Lições, a pedido. As citações continuam em Livros e no Álbum, e dá para guardar as que você gostar"]},
{v:"1.75.0",d:"2026-10-28",t:["Jardim dos amigos: em Amigos → preferências, marque «O meu jardim» (começa desligado) e seus amigos veem a cena e quantas plantas você tem em cada estágio. Nunca as palavras","Quem é seu amigo tem o botão «Ver jardim» no cartão e pode regar o seu jardim 1 vez por dia, de brincadeira (não muda o progresso de ninguém). O cartão mostra «regou o seu jardim hoje»","Se você aceita avisos, chega uma notificação de rega, com um tom brincalhão (dá para trocar por um aviso neutro). Precisa do arquivo jardim.sql no Supabase e da função poke republicada. A Política de Privacidade foi atualizada"]},
{v:"1.74.0",d:"2026-10-28",t:["Meu jardim agora tem «Compartilhar meu jardim»: gera um link (e uma imagem) que diz «Esse é o meu jardim de italiano/francês/inglês no Litteraria» e convida a pessoa a fazer o dela estudando e lendo no app","Quem abre o link vê o seu jardim só para olhar (cena e quantidade de frutos, flores, sementes e sombras) e um botão para começar o dele. Nada do progresso dela é alterado","Você pode pôr um nome ou apelido (opcional). O link leva só o idioma, as quantidades e esse nome, dentro do próprio endereço: nada é enviado a servidor. A Política de Privacidade foi atualizada"]},
{v:"1.73.1",d:"2026-10-28",t:["A cena do topo do Meu jardim foi refeita: céu em degradê, sol, nuvens que passam, colinas, cerca e uma árvore que aparece com o primeiro fruto (e ganha maçãs com 3). As flores do fundo aparecem conforme suas flores e frutos aumentam","Os bichinhos agora batem as asas e passeiam pelo jardim: borboletas, abelha, passarinho e joaninha (as animações param se o aparelho estiver com «reduzir movimento»)"]},
{v:"1.73.0",d:"2026-10-28",t:["Lição do Jardim por tema: além dos trechos de livros, agora dá para fazer as 7 telas com as palavras e frases de um tema de Vocabulário (Treino → «Lição do Jardim: palavras de um tema», ou pela lista de Conversação). As frases são do Wikcionário ou escritas por Claude, e a tela diz qual","Estágio das palavras no leitor: saíram os sublinhados duplo e grosso, que ficavam estranhos. Agora aparece um sinal depois da palavra: 🌱 semente, 🌸 flor, 🍎 fruto (sombra não tem sinal). O sublinhado só mostra se a palavra já foi aprendida","Meu jardim com novo visual: resumo em quatro cartões, barra de progresso, barra até a próxima visita, canteiros em cartões com uma faixa de cores que mostra quantas plantas estão em cada estágio, e os canteiros vazios ficam juntos no fim"]},
{v:"1.72.0",d:"2026-10-27",t:["Novo jogo «Parece, mas não é» (falsos amigos): você vê a palavra em francês, italiano ou inglês e escolhe o que ela significa, com o falso amigo entre as opções (ex.: library não é livraria; é biblioteca). Os pares vêm de páginas que abri e conferi, e a fonte aparece na tela","Novas «Conversas com escolhas» (Conversação): 3 diálogos por idioma (café, pedir o caminho, hotel). Você escolhe a resposta, o app mostra se soa natural, seca ou estranha e por quê. Diálogos escritos por Claude, sem fonte conferida","Nenhuma tradução aparece antes de você responder"]},
{v:"1.71.0",d:"2026-10-27",t:["Novo jogo «Gênero das palavras» (francês e italiano): você vê a palavra e escolhe o artigo (le/la; il/lo/la). Erros voltam na revisão. Palavras com «l'» ficam de fora, porque o app não guarda o gênero delas","Novo jogo «Ditado de frases (com áudio)»: ouça a frase e escreva. Sem áudio, há o botão «Mostrar a frase». Acento esquecido conta como certo, com aviso","Novo em Treino: «Só 5 minutos», 6 passos rápidos (3 palavras, 2 de gênero ou escrita, 1 ditado) com um círculo de progresso"]},
{v:"1.70.2",d:"2026-10-27",t:["Pedir o código por e-mail: se o servidor não responder em 25 segundos, o app avisa que ele pode estar «dormindo» (comum no serviço gratuito depois de dias sem uso) e pede para esperar 1 a 2 minutos e tentar de novo, em vez de ficar sem resposta"]},
{v:"1.70.1",d:"2026-10-27",t:["Jogo da memória: duas palavras com o mesmo desenho (como lunch e dinner) nunca ficam na mesma página","Francês dos livros: 241 palavras apareciam e eram faladas como «f traversée» ou «m pari». Agora são «la traversée», «le pari», «l'homme» etc.","Áudio: o app escolhe uma voz do idioma certo e avisa se o aparelho não tem voz em francês, italiano ou inglês. Em Ajustes → Som e vibração há botões para testar cada idioma e ver qual voz está em uso","Novo: Ajustes → Sobre e ajuda → «Compartilhar o app com alguém». Abre o menu de compartilhar do celular (ou copia o convite / envia pelo WhatsApp) com o endereço do app"]},
{v:"1.70.0",d:"2026-10-25",t:["«Hoje» e «Próximo» não levam mais às lições dos livros (frases, leitura, palavras dos livros e jogos de citação). Elas continuam em Lições e em Livros, para quem quiser ir lá. Quem já está numa lição de livro segue no livro ao tocar em «Próximo»"]},
{v:"1.69.0",d:"2026-10-25",t:["Meu jardim agora recebe visitas: uma borboleta com 3 flores ou frutos, uma abelha com 10, outra borboleta com 20, um passarinho com 40 e uma joaninha com 80. O jardim diz qual é a próxima visita","Regar só uma palavra: toque numa planta e escolha «Regar só esta palavra» (ou «Plantar», se ainda é sombra). Você escreve a palavra a partir da tradução; acertar faz a planta crescer e errar manda a palavra para a revisão"]},
{v:"1.68.0",d:"2026-10-25",t:["Novo: «Meu jardim», uma aba na tela inicial. Cada palavra que você acerta vira uma planta (sombra, semente, flor e fruto) num canteiro do seu tema, e o jardim vai enchendo conforme você aprende","Toque numa planta para ver a palavra, a tradução, o desenho, a frase de exemplo (a partir da flor) e o que falta para ela crescer","Plantas que murcham mostram uma gota: «Regar agora» abre o Ciclo da palavra"]},
{v:"1.67.0",d:"2026-10-25",t:["Nova ordem das lições dentro de cada tema: Conheça → Reconheça → Complete → Embaralhe → Caça-palavras → Cruzadas → Escreva → Frase → O Intruso. Só depois começa o tema seguinte","Os jogos soltos (memória, citação etc.) continuam aparecendo como intervalo entre lições, mas não puxam mais um jogo do mesmo tema para antes da vez dele"]},
{v:"1.66.0",d:"2026-10-23",t:["Novo: «Baixar o app». Quem abre o site no navegador vê um cartão na tela inicial para instalar o Litteraria (Android e computador abrem a janela de instalação; no iPhone aparece o passo a passo do Safari). Também fica em Ajustes → Sobre e ajuda → «Baixar o app (instalar)». No app já instalado o cartão não aparece","No iPhone, guarde o progresso antes (conta ou backup): o app instalado pode começar vazio"]},
{v:"1.65.0",d:"2026-10-23",t:["Lição do Jardim: a tela 5 agora alterna entre três jogos: Combine, Fitwords (monte a palavra com as letras) e Detetive de Fragmentos (ache no trecho a palavra que tem aquele significado)","Palavras do leitor e da Leitura têm sublinhado por estágio (pontilhado = Sombra, simples = Semente, duplo = Flor, grosso = Fruto) e o balão mostra o nome do estágio, então nada depende só de cor","Os textos da Lição do Jardim usam a fonte Atkinson Hyperlegible, feita para leitura fácil"]},
{v:"1.64.0",d:"2026-10-23",t:["Novo: Lição do Jardim, 7 telas curtas sobre um trecho real de um livro: Capa, Leitura guiada (com «Ouvir a frase» e o estágio de cada palavra), 5 Lacunas, Blocos de sentido, Combine, Palavra em frase nova e «O que cresceu»","Está em Treino → «Lição do Jardim» e em Lições → Volume 5 (Conversação), uma por trecho dos livros de domínio público","Nas lacunas, o primeiro erro balança a frase e mostra a tradução; no segundo, a resposta aparece e a palavra volta na revisão. Nada depende só de cor ou de som","As palavras que precisam de água (até 3) entram na tela Combine e na frase nova, com a primeira letra de dica"]},
{v:"1.63.1",d:"2026-10-23",t:["Jardim da Memória: as palavras que «precisam de água» (no máximo 3 por vez) agora entram primeiro também no jogo da memória com imagens e nos Cartões de revisão"]},
{v:"1.63.0",d:"2026-10-23",t:["Jardim da Memória (começo): cada palavra tem um estágio: Sombra, Semente, Flor e Fruto. Ela sobe quando você acerta em dias diferentes e em formas diferentes (ver, ouvir, escrever, usar na frase)","Palavra que fica muito tempo sem prática «precisa de água»: desce no máximo 1 estágio (nunca volta à Sombra), seu histórico de acertos fica e ela volta para a revisão","Errar uma palavra que já é Flor ou Fruto agora faz ela perder só 1 degrau na fila de revisão (antes eram 2)","Cada sessão do Ciclo da palavra traz no máximo 3 palavras que precisam de água, em forma diferente da última vez, e com a primeira letra de dica","Se você ficar mais de 2 semanas sem abrir o app, as revisões atrasadas se espalham por 5 dias, para não virar uma montanha"]},
{v:"1.62.1",d:"2026-10-23",t:["Código de entrada em grupos de 3 números (ex.: 482 917), no e-mail e no app; você pode digitar com ou sem espaço"]},
{v:"1.62.0",d:"2026-10-23",t:["Novo: tutorial de boas-vindas na primeira abertura (6 telas curtas). Para rever: Ajustes → Sobre e ajuda → «Ver o tutorial»","«Hoje» agora alterna entre Pronúncia, Vocabulário e Jogos (volumes 1, 2 e 3). Gramática e Conversação (volumes 4 e 5) só entram depois de todos os grupos de temas; continuam abertas em Lições","Perfil: o logo ficou recolhido; toque em «Trocar o logo» para ver todos","Notificações: ícone de livro na barra de cima, no lugar do quadrado branco (pode demorar para atualizar no aparelho)"]},
{v:"1.61.0",d:"2026-10-23",t:["«As Aventuras de Pinóquio» (Collodi) agora tem o texto completo em italiano, nos 36 capítulos, com «Ver tradução» em cada parágrafo, palavras do vocabulário sublinhadas e toque em qualquer palavra","Em Livros → Pinóquio → «Ler o livro». A tradução é escrita por Claude, sem fonte conferida; só existe a versão natural"]},
{v:"1.60.0",d:"2026-10-23",t:["Trilha mais gradual: gramática e frases agora pedem só uma parte das palavras que o app já apresentou (de 30% a 55%, dentro de cada grupo de temas), em vez de quase todas. Continuam abertas em Lições","Inglês: 2 páginas novas de gramática, «Preposições parecidas» (above, over, below, under, between, among, during, while, for, since) e «Palavras que se confundem» (already/yet, especially/specially, quite/quiet, opposite/in front of). Os fatos foram conferidos no Cambridge Grammar of English; as frases dos exercícios são de Claude, sem fonte conferida","Cerca de 55 desenhos novos (cozinha, quarto, moinho, riacho, estações do ano, médico, dentista, tesouro, coroa, chama e outros) ligados a palavras em francês, italiano e inglês. Aparecem no Conheça, no Ciclo da palavra e no jogo da memória"]},
{v:"1.59.0",d:"2026-10-23",t:["Esquecer faz parte: as palavras que você acertou numa lição de vocabulário também voltam para revisão, bem espaçadas (primeiro em 2 dias, depois 7, 14 e 30), no Ciclo da palavra. Até 6 palavras por lição","Jogo da memória das palavras em revisão: sempre 6 pares (completa com outras palavras que têm desenho) e título mais curto","Treino: o botão do Ciclo da palavra ficou mais curto","Limpeza interna: código e arquivos que não eram mais usados foram removidos, e os textos de ajuda foram atualizados"]},
{v:"1.58.0",d:"2026-10-23",t:["«Primeiro livrinho» cedo na trilha: depois dos primeiros temas entram as primeiras palavras de um livro curto (Peter Rabbit no inglês; Contos de Perrault no francês; Contos de Collodi no italiano) e uma página de frases do livro; no inglês, também a primeira Leitura","Novo: jogo da memória com as palavras que você está revisando (palavra × desenho). Aparece no fim do Ciclo da palavra e em Treino","As páginas dos livros continuam também no fim da trilha e em Livros","Corrigido: o aviso «O app foi atualizado» podia sumir sozinho; agora ele fica na tela até você tocar num botão (ou até 4 segundos depois de aparecer, para não voltar na próxima abertura)"]},
{v:"1.57.0",d:"2026-10-23",t:["Novo: «Ciclo da palavra». Uma palavra que você errou volta em formas diferentes: ver (com desenho), ouvir, escrever e usar na frase","Se acertar, ela volta mais adiante e em outra forma; se errar, volta amanhã, também em outra forma","Fica no «Hoje» (revisão) e em Treino → «Ciclo da palavra». «Ouvir» tem o botão «Mostrar a palavra» para quem está sem som"]},
{v:"1.56.0",d:"2026-10-23",t:["Jogos de literatura refeitos para treinar o idioma: saíram «Quem escreveu?», «De qual livro é?» e «Ordem dos capítulos» (eram perguntas sobre os livros, não sobre a língua)","Novo: «Ouça e escolha (com áudio)»: você ouve uma frase de um livro e escolhe o que ela quer dizer. Sem áudio, há o botão «Mostrar a frase»","Continuam: «Complete a citação», «Ordene o trecho» e «Qual o sentido?»"]},
{v:"1.55.0",d:"2026-10-23",t:["Novo: notificações de «fulano te convidou para ser amigo», «aceitou o seu convite», «te desafiou» e «aceitou o seu desafio». Só chegam a quem aceita avisos dos amigos e tem as notificações ligadas, e dependem de uma atualização no servidor (feita pela criadora do app)","Mudou: em Amigos, «Aceitar cutucadas» virou «Aceitar avisos dos amigos» e controla todos esses avisos","Ao tocar numa notificação de amigo, o app abre direto em Amigos"]},
{v:"1.54.0",d:"2026-10-23",t:["Novo: link de convite para amigos. Em Amigos, «Convidar por link» abre o WhatsApp (ou o menu de compartilhar) com um link; quem toca nele já vê o seu código preenchido","Novo: 17 ícones novos de perfil ligados aos livros (pena, tinteiro, castelo, coruja, rosa, lanterna etc.)","Novo: «Livro favorito» no Perfil (fica só no seu aparelho; não é enviado a amigos)","Mudou: Conta e backup na nuvem (o e-mail) agora fica no Perfil, não mais em Ajustes","Mudou: «Hoje» e «Próximo» agora só levam à gramática e às frases quando você já acertou palavras suficientes (a primeira página pede 30 palavras, e cada página seguinte, mais 9). Antes disso, seguem as palavras e os jogos. Tudo continua aberto em Lições","Novo: uma vez por dia, «Hoje» sugere rever uma página que você já concluiu, alternando entre os sons das letras (Pronúncia) e as palavras, mesmo com o volume terminado","Corrigido e refeito: «Qual regra?» agora se chama «Qual o sentido?»: você lê uma frase do livro e escolhe o que ela quer dizer entre 4 opções. Depois da resposta aparece a estrutura gramatical da frase. O visual quebrado das opções foi corrigido","Mudou: as fontes ficaram recolhidas. Em cada regra, no dicionário e nos textos dos livros há um «Fonte» que você abre só se quiser ver","Removido: o Cartão do dia (o cartão da tela inicial e a opção nos lembretes e no ícone do app). Os lembretes continuam","Ainda não existe: aviso de notificação para convites e desafios (exige mudança no servidor)"]},
{v:"1.53.0",d:"2026-10-22",t:["Novo ícone do app: o livro aberto com «tt». A escolha de ícones saiu de Ajustes","Entrar na conta: o passo do código não se perde mais quando você vai ao e-mail e volta (Samsung Internet e outros navegadores)","Ao sair do app e voltar, ele reabre na última tela (Ajustes, Livros, Estatísticas…), e não mais na tela inicial","Dicionário: nova seção «Palavras parecidas: não confunda» (cuisine e cousine, desert e dessert…), nos 3 idiomas. Pares escritos por Claude, sem fonte conferida","O app muda para o endereço litteraria.com.br. Quem tem conta entra de novo e recupera tudo; quem não tem, baixe o backup antes em Ajustes → Dados"]},
{v:"1.52.1",d:"2026-10-22",t:["O aviso «O app foi atualizado» não volta mais a cada vez que você abre o app: ele aparece uma vez por versão","Aviso de que o app muda de endereço (litteraria.com.br) ainda hoje, com botão para baixar o backup. Quem tem conta na nuvem recupera tudo entrando de novo","Política de Privacidade revisada: agora diz o que vai junto nas sugestões, como o e-mail é usado e onde o app fica hospedado"]},
{v:"1.52.0",d:"2026-10-22",t:["O app agora se chama Litteraria (antes Mots & Parole). Seu progresso, sua conta e seus amigos continuam como estavam","No iPhone, o ícone que já está na tela inicial pode continuar com o nome antigo: renomeie o atalho, ou instale de novo depois de baixar um backup em Ajustes → Dados"]},
{v:"1.51.1",d:"2026-10-22",t:["Sherlock Holmes: capítulo 12 («A Aventura das Faias de Cobre») já disponível para ler. O livro está completo, com os 12 contos","Tradução escrita por Claude, sem fonte conferida"]},
{v:"1.50.2",d:"2026-10-22",t:["Sherlock Holmes: capítulo 10 («A Aventura do Nobre Solteirão») já disponível para ler"]},
{v:"1.51.0",d:"2026-10-22",t:["Vocabulário dos livros ampliado: A Volta ao Mundo em 80 Dias (+93 palavras), As Aventuras de Pinóquio (+85) e O Príncipe (+81), em partes novas no fim de cada livro; as lições antigas não mudam","Existência, classe e gênero das palavras conferidos no Wikcionário (Kaikki); traduções escritas por Claude, sem fonte conferida"]},
{v:"1.50.5",d:"2026-10-22",t:["Francês, Presente: o rótulo de fonte agora diz o que foi conferido de verdade no Tex's French Grammar (verbos em -ir formam o 2º grupo; o gerúndio em -issant sai do «nous»: finissons → finissant). A divisão completa em três grupos continua sem fonte conferida e o cartão diz isso"]},
{v:"1.50.4",d:"2026-10-22",t:["Gramática, Classes de palavras: nova 3ª página em francês, italiano e inglês com pronome, conjunção e interjeição (6 perguntas). O cartão da regra agora explica as nove classes do italiano e as três novas nos outros idiomas","Frases dos exercícios e definições: escritas por Claude, sem fonte conferida (o rótulo no cartão diz isso)"]},
{v:"1.50.3",d:"2026-10-22",t:["Sherlock Holmes: capítulo 11 («A Aventura da Coroa de Berilos») já disponível para ler"]},
{v:"1.50.1",d:"2026-10-22",t:["Sherlock Holmes: capítulo 9 («A Aventura do Polegar do Engenheiro») já disponível para ler"]},
{v:"1.50.0",d:"2026-10-22",t:["Novo: desafio semanal entre amigos. Em Amigos, toque em «Desafiar» no cartão de um amigo; o desafio só começa se ele aceitar. Vence quem concluir mais lições de segunda a domingo","Os dois veem só o total de lições da semana (e o resultado da semana passada). Nenhum idioma, dia ou lição. Qualquer um pode encerrar a qualquer hora e os totais são apagados do servidor","Antes de usar, a criadora precisa instalar a parte nova no servidor (desafio.sql); se não estiver instalada, o app avisa"]},
{v:"1.49.4",d:"2026-10-22",t:["Corrigido: em Amigos, ao tocar em «Mais» os botões Remover, Bloquear e Denunciar ficavam por cima de «Cutucar»; agora abrem logo abaixo, sem sobrepor"]},
{v:"1.49.3",d:"2026-10-22",t:["Sherlock Holmes: capítulo 8 («A Aventura da Faixa Malhada») já disponível para ler"]},
{v:"1.49.2",d:"2026-10-22",t:["Sherlock Holmes: capítulo 7 («A Aventura do Carbúnculo Azul») já disponível para ler"]},
{v:"1.49.1",d:"2026-10-22",t:["Sherlock Holmes: capítulo 6 («O Homem do Lábio Torcido») já disponível para ler"]},
{v:"1.49.0",d:"2026-10-22",t:["Sherlock Holmes: capítulos 4 («O Mistério do Vale de Boscombe») e 5 («As Cinco Sementes de Laranja») já disponíveis para ler. A tradução continua sendo feita aos poucos"]},
{v:"1.48.0",d:"2026-10-22",t:["O painel de pontos fortes e fracos agora também mostra a Gramática: os assuntos em que você acerta mais (artigos, plural, presente...) e os que precisam de reforço, por idioma","A conta de gramática começa a valer a partir de agora; as respostas antigas não tinham o tipo registrado","«Apagar estatísticas» também zera essa conta","Sherlock Holmes: capítulo 3 já disponível para ler (a tradução continua sendo feita aos poucos)"]},
{v:"1.47.0",d:"2026-10-22",t:["Amigos redesenhado: cada amigo agora é um cartão com ícone, frase do perfil, nível, sequência, palavras, idiomas que estuda e «ativo hoje / ontem». A lista de amigos vem primeiro; as opções de privacidade ficam recolhidas em «O que meus amigos veem»","Tudo é opcional e escolhido por você: «Meu ícone, minha frase e meu nível» e «Os idiomas que estudo» começam desligados. Se desligar, o dado é apagado do servidor","Os botões Remover, Bloquear e Denunciar ficam em «Mais», para não poluir o cartão"]},
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
  let closed=false,readd=0;
  const close=()=>{closed=true;mark();box.remove();};
  box.addEventListener("click",e=>{
    const t=e.target.closest&&e.target.closest("button");if(!t)return;
    if(t.id==="upd-read"){close();go("news");renderNews();}
    else if(t.id==="upd-close")close();
  });
  /* Marca como visto só depois de 4 s na tela (ou ao tocar nos botões): sair do app depois de ler não faz o aviso voltar,
     mas uma recarga logo ao abrir (atualização do app) não gasta o aviso. Se algo tirar o aviso da tela sozinho, ele volta (até 5 vezes). */
  const add=()=>{
    document.body.appendChild(box);setTimeout(mark,4000);
    try{new MutationObserver(()=>{if(!closed&&!box.isConnected&&readd<5){readd++;document.body.appendChild(box);}}).observe(document.body,{childList:true});}catch(_){}
  };
  if(document.body)add();else document.addEventListener("DOMContentLoaded",add);
})();

/* ===== Aviso de mudança de endereço (v1.52.1) =====
   Só aparece no endereço antigo (github.io). No endereço novo o armazenamento começa vazio, então lá não faz sentido. */
(function(){
  if((window.__moveTest?"calisants.github.io":location.hostname)!=="calisants.github.io")return; /* __moveTest: só para o teste */
  const K="mots-parole-move";let st=null;
  try{st=localStorage.getItem(K);}catch(_){}
  const today=new Date().toISOString().slice(0,10);
  if(st==="ok"||st===today)return;
  const box=document.createElement("div");
  box.id="move-note";box.setAttribute("role","dialog");box.setAttribute("aria-modal","true");box.setAttribute("aria-label","Mudança de endereço");
  box.style.cssText="position:fixed;inset:0;z-index:9998;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.5)";
  box.innerHTML='<div style="max-width:440px;width:100%;max-height:92vh;overflow:auto;background:var(--surface,#fff);color:var(--ink,#222);border:1px solid var(--line,#ccc);border-radius:16px;padding:20px;box-shadow:0 10px 30px rgba(0,0,0,.3)">'+
    '<h3 style="margin:0 0 8px;font-size:1.15rem">O Litteraria vai mudar de endereço</h3>'+
    '<p style="margin:0 0 8px">Em breve o app passa a ficar em <b>litteraria.com.br</b>. O progresso que está <b>só neste aparelho</b> não vai junto sozinho.</p>'+
    '<p style="margin:0 0 8px"><b>Para não perder nada:</b> baixe o backup agora. Depois, no endereço novo, vá em Ajustes → Dados → «Escolher arquivo de backup».</p>'+
    '<p style="margin:0 0 14px;color:var(--muted,#666);font-size:.92rem">Se você tem conta na nuvem e o progresso já está salvo nela, basta entrar de novo no endereço novo. Você vai precisar instalar o app de novo e ligar os lembretes outra vez.</p>'+
    '<p id="move-msg" aria-live="polite" style="margin:0 0 10px;font-weight:600"></p>'+
    '<div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn wide primary" id="move-bk">Baixar backup agora</button><button type="button" class="btn wide" id="move-later">Lembrar depois</button></div></div>';
  box.addEventListener("click",e=>{
    const t=e.target.closest&&e.target.closest("button");if(!t)return;
    if(t.id==="move-bk"){const b=document.getElementById("bk-save");if(b)b.click();try{localStorage.setItem(K,"ok");}catch(_){}
      document.getElementById("move-msg").textContent="Backup baixado. Procure o arquivo litteraria-progresso em Downloads.";t.hidden=true;document.getElementById("move-later").textContent="Fechar";}
    else if(t.id==="move-later"){try{if(localStorage.getItem(K)!=="ok")localStorage.setItem(K,today);}catch(_){}box.remove();}
  });
  const add=()=>document.body.appendChild(box);
  if(document.body)setTimeout(add,400);else document.addEventListener("DOMContentLoaded",()=>setTimeout(add,400));
})();
