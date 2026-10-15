/* Pares de sons: palavra|IPA|como fala|tradução || palavra|IPA|como fala|tradução (IPA e acento: dados abertos derivados do Wiktionary) */
const SONS={
"fr": [
[
"rue|ʁy|rü|rua||roue|ʁu|ru|roda",
"tu|ty|tü (u francês: lábios em «u», língua em «i»)|você (tu)||tout|tu|tu («u» normal)|tudo",
"dessus|dəsy|de-sü|em cima||dessous|dəsu|de-su|embaixo",
"beau|bo|bô|bonito||bon|bɔ̃|bõ (nasal)|bom"
],
[
"vin|vɛ̃|vẽ (nasal)|vinho||vent|vɑ̃|vã (nasal, boca mais aberta)|vento",
"chou|ʃu|chu|repolho||joue|ʒu|ju|bochecha",
"peu|pø|pö (ö: «ê» com lábios de «ô»)|pouco||pou|pu|pu|piolho",
"deux|dø|dö (ö)|dois||doux|du|du|suave, doce"
],
[
"sur|syʁ|sür (u francês)|sobre||sourd|suʁ|sur («u» normal; o d final é mudo)|surdo",
"bon|bɔ̃|bõ (nasal «õ»)|bom||bain|bɛ̃|bẽ (nasal «ẽ»)|banho",
"main|mɛ̃|mẽ (nasal «ẽ»)|mão||mon|mɔ̃|mõ (nasal «õ»)|meu",
"lait|lɛ|lé|leite||lit|li|li|cama"
],
[
"poisson|pwasɔ̃|pua-sõ (s = «ss»)|peixe||poison|pwazɔ̃|pua-zõ (s = «z»)|veneno",
"cousin|kuzɛ̃|cu-zẽ (s = «z»)|primo||coussin|kusɛ̃|cu-sẽ (s = «ss»)|almofada",
"feu|fø|fö (ö)|fogo||fou|fu|fu (u normal)|louco",
"poule|pul|pul (u normal)|galinha||pull|pyl|pül (u francês)|blusa"
],
[
"boue|bu|bu (u normal)|lama||bu|by|bü (u francês)|bebido (particípio de boire)",
"peur|pœʁ|pör (ö aberto)|medo||pour|puʁ|pur (u normal)|para",
"temps|tɑ̃|tã (nasal «ã»)|tempo||ton|tɔ̃|tõ (nasal «õ»)|teu; tom",
"lent|lɑ̃|lã (nasal «ã»)|lento||long|lɔ̃|lõ (nasal «õ»)|longo"
],
[
"blanc|blɑ̃|blã (nasal «ã»)|branco||blond|blɔ̃|blõ (nasal «õ»)|loiro",
"rouge|ʁuʒ|ruj (u normal)|vermelho||rage|ʁaʒ|raj (a)|raiva",
"ceux|sø|sö (ö)|aqueles||sous|su|su (u normal)|sob",
"banc|bɑ̃|bã (nasal «ã»)|banco (de sentar)||bien|bjɛ̃|biẽ (nasal «ẽ»)|bem"
]
],
"it": [
[
"pala|ˈpala|PA-la|pá||palla|ˈpalla|PAL-la (consoante dupla: ll longo)|bola",
"caro|ˈkaro|CA-ro|caro, querido||carro|ˈkarro|CAR-ro (rr longo)|carroça, carro de mão",
"sete|ˈsete|SÊ-te|sede (vontade de beber)||sette|ˈsɛtte|SÉT-te (tt longo; é aberto)|sete (número)",
"nono|ˈnɔno|NÓ-no|nono (9º)||nonno|ˈnɔnno|NÓN-no (nn longo)|avô"
],
[
"capelli|kaˈpelli|ca-PÊL-li|cabelos||cappelli|kapˈpɛlli|cap-PÉL-li (pp longo)|chapéus",
"ci|tʃi|tchi (tchi)|nos, lá||chi|ki|qui (qui)|quem",
"gli|ʎi|lhi (lhi)|lhe, os||li|li|li (li)|lá, os",
"sci|ʃi|chi (chi)|esqui||sì|si|si (si)|sim"
],
[
"pena|ˈpena|PÊ-na|pena (dó)||penna|ˈpenna|PÊN-na (nn longo)|caneta, pena (de ave)",
"seta|ˈseta|SÊ-ta|seda||setta|ˈsɛtta|SÉT-ta (tt longo)|seita",
"bruto|ˈbruto|BRU-to|bruto, grosseiro||brutto|ˈbrutto|BRUT-to (tt longo)|feio",
"cade|ˈkade|CA-de|cai||cadde|ˈkadde|CAD-de (dd longo)|caiu"
],
[
"eco|ˈɛko|É-co|eco||ecco|ˈɛkko|ÉK-co (cc longo)|aqui está",
"ala|ˈala|A-la|asa||alla|ˈalla|AL-la (ll longo)|à, ao (a + la)",
"papa|ˈpapa|PA-pa|papa (o Papa)||pappa|ˈpappa|PAP-pa (pp longo)|papinha",
"fumo|ˈfumo|FU-mo|fumaça; eu fumo||fummo|ˈfummo|FUM-mo (mm longo)|fomos (verbo ser, passado)"
],
[
"sano|ˈsano|SA-no|saudável||sanno|ˈsanno|SAN-no (nn longo)|eles sabem",
"tono|ˈtɔno|TÓ-no|tom||tonno|ˈtonno|TÔN-no (nn longo)|atum",
"moto|ˈmɔto|MÓ-to|movimento; moto||motto|ˈmɔtto|MÓT-to (tt longo)|lema",
"lego|ˈleɡo|LÊ-go (g duro)|eu amarro||leggo|ˈlɛɡɡo|LÉG-go (gg = dj longo)|eu leio"
],
[
"che|ke|quê (qué)|que||ce|tʃe|tchê (tché)|nos, lá",
"ghiro|ˈɡiro|GUI-ro (g duro)|arganaz (um roedor)||giro|ˈdʒiro|DJI-ro (dj)|volta, passeio",
"scena|ˈʃɛna|CHÉ-na (ch)|cena (de palco)||cena|ˈtʃena|TCHÊ-na (tch)|jantar",
"sono|ˈsono|SÔ-no|eu sou, eu estou||suono|ˈswɔno|SUÓ-no (uó)|som"
]
],
"en": [
[
"ship|ʃɪp|chip (i curto)|navio||sheep|ʃiːp|chiip (i longo)|ovelha",
"bit|bɪt|bit (i curto)|pedaço||beat|biːt|biit (i longo)|bater",
"full|fʊl|ful (u curto)|cheio||fool|fuːl|fuul (u longo)|bobo",
"think|θɪŋk|think (th: língua entre os dentes)|pensar||sink|sɪŋk|sink (s normal)|afundar"
],
[
"three|θriː|thrii (th)|três||tree|triː|trii (t)|árvore",
"very|ˈvɛri|VÉ-ri (v: dentes no lábio de baixo)|muito||berry|ˈbɛri|BÉ-ri (b)|fruta vermelha, baga",
"light|laɪt|lait|luz||right|raɪt|rait (r inglês, sem vibrar)|certo, direita",
"cat|kæt|quét (a aberto)|gato||cut|kʌt|kât (a curto e fraco)|cortar"
],
[
"bad|bæd|béd (a aberto e mais longo)|ruim||bed|bɛd|béd (mais curto)|cama",
"walk|wɔːk|uók (o longo)|andar||work|wɜːk|uérk (vogal «ér»)|trabalhar",
"sit|sɪt|sit (i curto)|sentar||seat|siːt|siit (i longo)|assento",
"pull|pʊl|pul (u curto)|puxar||pool|puːl|puul (u longo)|piscina"
],
[
"sheep|ʃiːp|chiip (sh)|ovelha||cheap|tʃiːp|tchiip (tch)|barato",
"chair|tʃeə|tchéa (tch)|cadeira||share|ʃeə|chéa (sh)|compartilhar",
"grass|ɡrɑːs|graas (r)|grama||glass|ɡlɑːs|glaas (l)|vidro, copo",
"rice|raɪs|rais (r)|arroz||lice|laɪs|lais (l)|piolhos"
],
[
"west|wɛst|uést (u)|oeste||vest|vɛst|vést (v)|colete",
"wine|waɪn|uain (u)|vinho||vine|vaɪn|vain (v)|videira",
"they|ðeɪ|dhêi (dh: língua entre os dentes, com voz)|eles||day|deɪ|dêi (d)|dia",
"bought|bɔːt|bót (o aberto, longo)|comprou||boat|bəʊt|bôut (ôu)|barco"
],
[
"heart|hɑːt|haat (a longo)|coração||hat|hæt|hét (a curto)|chapéu",
"pen|pɛn|pén|caneta||pan|pæn|pén (a aberto)|panela",
"thing|θɪŋ|thing (th)|coisa||sing|sɪŋ|sing (s)|cantar",
"show|ʃəʊ|chôu (sh)|mostrar||so|səʊ|sôu (s)|então"
]
]
};
