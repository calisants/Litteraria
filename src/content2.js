/* ===== Volume 2: Pronúncia =====
   Formatos (separador "|"):
   ALFA:  letra|texto para a voz|IPA|como fala
   SONS:  palavra A|IPA A|como fala A|tradução A||palavra B|IPA B|como fala B|tradução B
   FALA:  palavra|IPA|como fala|tradução
   "Como fala" é uma aproximação para quem fala português (ver LEGENDA). ö = ê com lábios de ô; ü = u francês. */
const V2LABELS=["Ordem das palavras","Concordância e artigos","Passado e futuro","Perguntas","Pronomes e possessivos","Lugar e tempo"];
const VOLUME2={id:2,title:"Volume 1 · Pronúncia",types:[["alfabeto","Alfabeto","Alfabeto"],["sons","Pares de sons","Sons"],["fala","Sons difíceis","Sons difíceis"],["tema","Palavras por tema: ouça e entenda","Tema"],["ditado","Ditado: como se escreve","Ditado"],["frases","Construção de frases","Frases"]],pages:[]};
(function(){
  const pg=VOLUME2.pages;
  pg.push({id:"alfabeto-1",type:"alfabeto",n:1,meta:"Primeira metade das letras",themes:[]},{id:"alfabeto-2",type:"alfabeto",n:2,meta:"Segunda metade das letras",themes:[]});
  for(let i=1;i<=6;i++)pg.push({id:"sons-"+i,type:"sons",n:i,meta:"Pares mínimos "+["I","II","III","IV","V","VI"][i-1],themes:[]});
  pg.push({id:"fala-1",type:"fala",n:1,meta:"Dia a dia",themes:[]},{id:"fala-2",type:"fala",n:2,meta:"Sons difíceis",themes:[]});
  ["tema","ditado"].forEach(t=>CATS.forEach((c,i)=>pg.push({id:t+"-"+c[0],type:t,n:i+1,cat:c[0],meta:c[1],themes:[c[0]]})));
  V2LABELS.forEach((m,i)=>pg.push({id:"frases-"+(i+1),type:"frases",n:i+1,meta:m,themes:[]}));
})();

const LEGENDA={
 fr:"Como ler: ã, ẽ, õ são vogais nasais (o ar sai pelo nariz e o \"n\" não é pronunciado). ü = u francês (boca em \"u\", língua em \"i\"). ö = \"ê\" com os lábios em \"ô\". r = som de garganta. O \"como fala\" é uma aproximação; o IPA vem entre barras.",
 it:"Como ler: consoante dupla (tt, ll, zz...) é mais longa, com uma pequena pausa antes. gl = lh, gn = nh. c e g antes de e/i = tch e dj; ch e gh = qu e gu. O r é vibrado. A sílaba forte aparece em MAIÚSCULAS no \"como fala\" (e ˈ no IPA). e/o abertos ou fechados variam um pouco conforme a região. O \"como fala\" é uma aproximação; o IPA vem entre barras.",
 en:"Como ler: th = língua entre os dentes (θ sem voz, ð com voz). O h inicial é soprado, como um \"r\" suave de carioca. ː marca vogal longa. A sílaba forte aparece em MAIÚSCULAS no \"como fala\" (e ˈ no IPA); vogal longa aparece dobrada (ii, aa). O \"como fala\" é uma aproximação; o IPA é o britânico, entre barras."
};

const ALFA={
 fr:[
  "A|a|a|a","B|bé|be|bê","C|cé|se|sê","D|dé|de|dê","E|eu|ə|ö (e fraco, como em \"de\")","F|effe|ɛf|éf","G|gé|ʒe|jê","H|hache|aʃ|ách (ch = x)","I|i|i|i","J|ji|ʒi|ji","K|ka|ka|cá","L|elle|ɛl|él","M|emme|ɛm|ém",
  "N|enne|ɛn|én","O|o|o|ô","P|pé|pe|pê","Q|ku|ky|qü (ü = u francês)","R|erre|ɛʁ|ér (r de garganta)","S|esse|ɛs|és","T|té|te|tê","U|u|y|ü (u francês)","V|vé|ve|vê","W|double vé|du.blə.ve|dublevê","X|ixe|iks|iks","Y|i grec|i.gʁɛk|i-grék","Z|zède|zɛd|zéd"],
 it:[
  "A|a|a|a","B|bi|bi|bi","C|ci|tʃi|tchi","D|di|di|di","E|e|e|ê","F|effe|ˈɛf.fe|éfe","G|gi|dʒi|dji","H|acca|ˈak.ka|ácca","I|i|i|i","L|elle|ˈɛl.le|élle","M|emme|ˈɛm.me|émme","N|enne|ˈɛn.ne|énne","O|o|ɔ|ó",
  "P|pi|pi|pi","Q|cu|ku|cu","R|erre|ˈɛr.re|érre (r vibrado)","S|esse|ˈɛs.se|ésse","T|ti|ti|ti","U|u|u|u","V|vu|vu|vu","Z|zeta|ˈdzɛ.ta|dzéta","J|i lunga|i ˈluŋ.ga|i lunga","K|cappa|ˈkap.pa|cápa","W|doppia vu|ˈdop.pja vu|dópia vu","X|ics|iks|iks","Y|ipsilon|ˈip.si.lon|ípsilon"],
 en:[
  "A|ay|eɪ|êi","B|bee|biː|bi","C|see|siː|si","D|dee|diː|di","E|ee|iː|i","F|eff|ɛf|éf","G|jee|dʒiː|dji","H|aitch|eɪtʃ|êitch","I|eye|aɪ|ai","J|jay|dʒeɪ|djêi","K|kay|keɪ|quêi","L|el|ɛl|él","M|em|ɛm|ém",
  "N|en|ɛn|én","O|oh|əʊ|ôu","P|pee|piː|pi","Q|queue|kjuː|quiú","R|are|ɑː|ár (r inglês, sem vibrar)","S|ess|ɛs|és","T|tee|tiː|ti","U|you|juː|iú","V|vee|viː|vi","W|double you|ˈdʌb.əl.juː|dábol-iú","X|ex|ɛks|éks","Y|why|waɪ|uai","Z|zed|zɛd|zéd"]
};

const FALA={
 fr:[[
  "bonjour|bɔ̃.ʒuʁ|bõ-jur|bom dia","merci|mɛʁ.si|mér-si|obrigado","s'il vous plaît|sil vu plɛ|sil vu plé|por favor","au revoir|o ʁə.vwaʁ|ô re-vuár|tchau","oui|wi|uí|sim","eau|o|ô|água","beaucoup|bo.ku|bô-cu|muito","pain|pɛ̃|pẽ|pão","vin|vɛ̃|vẽ|vinho","chien|ʃjɛ̃|chiẽ|cachorro","rue|ʁy|rü|rua","je suis|ʒə sɥi|je süí|eu sou, eu estou"],[
  "deux|dø|dö|dois","rouge|ʁuʒ|ruj|vermelho","croissant|kʁwa.sɑ̃|cruá-sã|croissant","travail|tʁa.vaj|tra-vái|trabalho","fille|fij|fii (i + iê rápido)|filha, menina","huit|ɥit|üit|oito","oiseau|wa.zo|uá-zô|pássaro","nous|nu|nu|nós","cinq|sɛ̃k|sẽk|cinco","quatre|katʁ|catr|quatro","grenouille|ɡʁə.nuj|gre-nui|sapo, rã","ville|vil|vil|cidade"]],
 it:[[
  "ciao|ˈtʃa.o|tchão|oi, tchau","grazie|ˈɡrat.tsje|grátsie|obrigado","per favore|per fa.ˈvo.re|per favôre|por favor","buongiorno|bwon.ˈdʒor.no|buondjórno|bom dia","arrivederci|ar.ri.ve.ˈdɛr.tʃi|arrivedértchi|até logo","acqua|ˈak.kwa|ákkua|água","pane|ˈpa.ne|páne|pão","vino|ˈvi.no|víno|vinho","gatto|ˈɡat.to|gátto (tt longo)|gato","cane|ˈka.ne|cáne|cachorro","amico|a.ˈmi.ko|amíco|amigo","sì|si|si|sim"],[
  "gnocchi|ˈɲɔk.ki|niócki|nhoque","famiglia|fa.ˈmiʎ.ʎa|famílha|família","figlio|ˈfiʎ.ʎo|fílho|filho","pizza|ˈpit.tsa|pítsa|pizza","scusi|ˈsku.zi|skúzi|com licença, desculpe","ragazzo|ra.ˈɡat.tso|ragátso|rapaz","pesce|ˈpeʃ.ʃe|péche (ch longo)|peixe","cena|ˈtʃe.na|tchêna|jantar","chiave|ˈkja.ve|quiáve|chave","gelato|dʒe.ˈla.to|djeláto|sorvete","birra|ˈbir.ra|bírra (rr longo)|cerveja","caffè|kaf.ˈfɛ|caffé (ff longo)|café"]],
 en:[[
  "hello|hə.ˈləʊ|helôu|olá","thank you|ˈθæŋk juː|thénk iú|obrigado","please|pliːz|plíz|por favor","water|ˈwɔː.tə|uóta|água","coffee|ˈkɒf.i|cófi|café","bread|brɛd|bréd|pão","yes|jɛs|iés|sim","good|ɡʊd|gud|bom","friend|frɛnd|frénd|amigo","house|haʊs|háus|casa","morning|ˈmɔː.nɪŋ|mórning|manhã","name|neɪm|nêim|nome"],[
  "think|θɪŋk|thínk|pensar","the|ðə|dhe (th com vibração)|o, a","three|θriː|thrí|três","world|wɜːld|uérld|mundo","comfortable|ˈkʌmf.tə.bəl|cámftabol|confortável","vegetable|ˈvɛdʒ.tə.bəl|védjtabol|legume","Wednesday|ˈwɛnz.deɪ|uénzdêi|quarta-feira","thought|θɔːt|thót|pensamento, pensei","through|θruː|thru|através de","queue|kjuː|quiú|fila","island|ˈaɪ.lənd|áilend|ilha","schedule|ˈʃɛd.juːl|chédjul|horário"]]
};

const FRASES={
 fr:[
  [{s:"Je ne parle pas anglais.",pt:"Eu não falo inglês.",note:"A negação tem duas partes: «ne» antes do verbo e «pas» depois dele."},
   {s:"Elle a une petite voiture.",pt:"Ela tem um carrinho.",note:"Adjetivos curtos e muito usados (petit, grand, bon, beau) vêm antes do substantivo."},
   {s:"Il habite dans une maison blanche.",pt:"Ele mora numa casa branca.",note:"A cor vem depois do substantivo e concorda com ele: «blanche» porque «maison» é feminino."},
   {s:"Où habites-tu"+NB+"?",pt:"Onde você mora?",note:"A pergunta com inversão coloca o pronome depois do verbo, ligado por hífen: habites-tu."}],
  [{s:"Les enfants sont contents.",pt:"As crianças estão contentes.",note:"O adjetivo concorda em número: enfants (plural) pede «contents» com -s."},
   {s:"Elle est allée au marché.",pt:"Ela foi ao mercado.",note:"Com o verbo «être», o particípio concorda com o sujeito: allée (feminino). «Au» = à + le."},
   {s:"Il y a du pain sur la table.",pt:"Há pão na mesa.",note:"«Du» (de + le) é o artigo partitivo, usado para quantidade não contável. «Il y a» = há."},
   {s:"Voici mon frère et ma sœur.",pt:"Aqui estão meu irmão e minha irmã.",note:"O possessivo concorda com a coisa possuída: «mon» (masculino), «ma» (feminino)."}]],
 it:[
  [{s:"Non parlo inglese.",pt:"Eu não falo inglês.",note:"A negação é simples: «non» antes do verbo."},
   {s:"Ho una macchina rossa.",pt:"Eu tenho um carro vermelho.",note:"A cor vem depois do substantivo e concorda com ele: «rossa» (feminino) para «macchina»."},
   {s:"Tu abiti a Milano"+NB+"?",pt:"Você mora em Milão?",note:"A pergunta tem a mesma ordem da afirmação; só muda a entonação. Também se omite o «tu» com frequência."},
   {s:"È una bella città.",pt:"É uma bela cidade.",note:"«Bello» vem antes do substantivo e muda de forma: «bella» com um nome feminino. O acento em «È» o diferencia de «e» (e)."}],
  [{s:"Vado al mercato.",pt:"Eu vou ao mercado.",note:"«Al» = a + il: preposição articulada, que une preposição e artigo."},
   {s:"Le ragazze sono stanche.",pt:"As garotas estão cansadas.",note:"No plural feminino: artigo «le», substantivo em -e e adjetivo concordando (stanche)."},
   {s:"Mi piace il caffè.",pt:"Eu gosto de café.",note:"«Piacere» funciona ao contrário: o café agrada a mim. O verbo concorda com a coisa de que se gosta."},
   {s:"C'è del pane sul tavolo.",pt:"Há pão na mesa.",note:"«C'è» = ci + è (há). «Del» = di + il (partitivo) e «sul» = su + il."}]],
 en:[
  [{s:"I do not speak French.",pt:"Eu não falo francês.",note:"A negação no presente usa o auxiliar «do» + «not» antes do verbo principal."},
   {s:"She has a small red car.",pt:"Ela tem um carrinho vermelho.",note:"Adjetivos vêm antes do substantivo e não mudam de gênero; em geral, tamanho antes da cor."},
   {s:"Where do you live"+NB+"?",pt:"Onde você mora?",note:"Pergunta com palavra interrogativa: where + do + sujeito + verbo."},
   {s:"He always drinks coffee in the morning.",pt:"Ele sempre toma café de manhã.",note:"Advérbios de frequência (always, never, often) vão antes do verbo principal. «Drinks» leva -s na 3ª pessoa."}],
  [{s:"There is some bread on the table.",pt:"Há pão na mesa.",note:"«There is» = há. «Some» acompanha substantivos não contáveis, como bread."},
   {s:"My friends are very tired.",pt:"Meus amigos estão muito cansados.",note:"O plural fica só no substantivo (friends); o adjetivo «tired» não muda."},
   {s:"I like coffee, but she likes tea.",pt:"Eu gosto de café, mas ela gosta de chá.",note:"Na 3ª pessoa do singular do presente, o verbo ganha -s: she likes."},
   {s:"Yesterday we went to the market.",pt:"Ontem nós fomos ao mercado.",note:"«Went» é o passado irregular de «go». A marca de tempo pode abrir a frase."}]]
};
