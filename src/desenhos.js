/* ===== Desenhos das palavras concretas (SVG originais, feitos por Claude) =====
   Estilo «linha fina»: contorno delicado + cor pastel levemente deslocada + brilhinhos (escolhido pela Camila em 18/10/2026).
   Objetos e animais genéricos; nenhum personagem nem ilustração de livro.
   O contorno usa --ink (combina com claro e escuro); as cores pastel são fixas.
   Só inglês por enquanto (palavras concretas dos temas de «Alice» + coelho): DRAW[idioma][palavra] = conteúdo do SVG (64x64). */
const DRAW=(function(){
  const ST='stroke="var(--ink)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';
  const at=a=>Object.keys(a).map(k=>k+'="'+a[k]+'"').join(' ');
  /* S: cor pastel deslocada 2px + contorno fino por cima */
  const S=(tag,color,a)=>'<'+tag+' '+at(a)+' fill="'+color+'" transform="translate(2 2)"/><'+tag+' '+at(a)+' fill="none" '+ST+'/>';
  const L=(d,x)=>'<path d="'+d+'" fill="none" '+ST+(x?' '+x:'')+'/>';
  const dot=(x,y,c,r)=>'<circle cx="'+x+'" cy="'+y+'" r="'+(r||1.3)+'" fill="'+(c||'#9ec5e8')+'"/>';
  const spark=(x,y,s,c)=>{s=s||3;const q=s*.28;return '<path d="M'+x+' '+(y-s)+'L'+(x+q)+' '+(y-q)+'L'+(x+s)+' '+y+'L'+(x+q)+' '+(y+q)+'L'+x+' '+(y+s)+'L'+(x-q)+' '+(y+q)+'L'+(x-s)+' '+y+'L'+(x-q)+' '+(y-q)+'Z" fill="'+(c||'#f4b860')+'"/>';};
  const eyes=(x1,x2,y,r)=>'<circle cx="'+x1+'" cy="'+y+'" r="'+(r||1.3)+'" fill="var(--ink)"/><circle cx="'+x2+'" cy="'+y+'" r="'+(r||1.3)+'" fill="var(--ink)"/>';
  const blush=(x1,x2,y)=>'<ellipse cx="'+x1+'" cy="'+y+'" rx="3" ry="1.8" fill="#f9b5c4"/><ellipse cx="'+x2+'" cy="'+y+'" rx="3" ry="1.8" fill="#f9b5c4"/>';
  const PK='#f9c6c0',PE='#fdeccb',MI='#c8e8cb',SK='#cfe3f6',LI='#dcd5f5',BU='#ffe7a3',RS='#fbc3d0',WD='#e3c9a8',GR='#e6e9ef',GM='#bfe6c4';
  const house=S('rect',PE,{x:14,y:29,width:36,height:25,rx:2})+S('path',PK,{d:'M9 31L32 11L55 31Z'})+S('path',SK,{d:'M27 54V44A5 5 0 0 1 37 44V54Z'})+S('rect',SK,{x:17,y:35,width:7,height:7,rx:1})+S('rect',SK,{x:40,y:35,width:7,height:7,rx:1})+L('M20.5 35V42M40 38.5H47')+L('M38 20V13H43V24')+spark(52,12)+dot(10,16);
  const note=S('ellipse',LI,{cx:20,cy:48,rx:7,ry:5})+S('ellipse',LI,{cx:44,cy:42,rx:7,ry:5})+L('M26.5 47V17M50.5 41V13')+S('polygon',LI,{points:'26.5,17 50.5,13 50.5,21 26.5,25'})+spark(12,20)+dot(56,30,'#f4b860')+spark(40,52,2.2,'#9ec5e8');
  const en={
    house:house,home:house,
    tea:S('path','#f9dfe6',{d:'M13 26H47V37A17 17 0 0 1 30 54A17 17 0 0 1 13 37Z'})+L('M47 29H50A6 6 0 0 1 50 41H45')+S('ellipse',SK,{cx:30,cy:55,rx:21,ry:3.5})+L('M13 26H47')+L('M30 45C25 42 24 38 27 37C28.6 36.4 30 38 30 38C30 38 31.4 36.4 33 37C36 38 35 42 30 45Z')+L('M23 18Q20 14 23 10M32 18Q29 14 32 9')+spark(52,16)+dot(11,18),
    box:S('rect',PE,{x:12,y:26,width:40,height:28})+S('rect',PK,{x:9,y:18,width:46,height:9})+L('M28 18V54M36 18V54')+L('M32 18C26 9 21 14 26 18M32 18C38 9 43 14 38 18')+spark(54,10)+dot(8,36),
    pocket:S('path',SK,{d:'M12 12H52V38Q52 52 32 58Q12 52 12 38Z'})+L('M17 18H47','stroke-dasharray="2.5 2.5"')+L('M20 27Q32 34 44 27')+spark(56,10)+dot(8,50),
    fan:S('path',PK,{d:'M32 54L8 24A30 30 0 0 1 56 24Z'})+L('M32 54L20 15M32 54V13M32 54L44 15')+S('rect',BU,{x:28,y:52,width:8,height:8,rx:2})+spark(8,10)+dot(58,8),
    tail:S('ellipse',BU,{cx:16,cy:46,rx:13,ry:11})+S('path',BU,{d:'M26 46C40 52 54 42 48 28C44 20 50 14 56 12C60 16 56 18 54 22C58 34 52 54 28 54Z'})+L('M8 58H30')+spark(10,22)+dot(58,50),
    pool:S('ellipse',SK,{cx:32,cy:38,rx:25,ry:14})+L('M32 38m-14 0a14 6 0 1 0 28 0a14 6 0 1 0 -28 0')+L('M18 34Q22 31 26 34M40 29Q44 26 48 29')+spark(10,16)+dot(54,14),
    hole:S('rect',PE,{x:6,y:30,width:52,height:26})+S('rect',GM,{x:6,y:24,width:52,height:8})+S('ellipse','#b8bfcc',{cx:32,cy:39,rx:17,ry:8})+L('M10 24L11 20M16 24L17 19M48 24L49 19M54 24L55 20')+spark(52,10)+dot(10,12),
    frog:S('ellipse',GM,{cx:32,cy:40,rx:21,ry:14})+S('circle',GM,{cx:22,cy:25,r:7.5})+S('circle',GM,{cx:42,cy:25,r:7.5})+'<circle cx="22" cy="25" r="2.2" fill="var(--ink)"/><circle cx="42" cy="25" r="2.2" fill="var(--ink)"/>'+L('M27 40Q32 45 37 40')+blush(17,47,38)+spark(52,12)+dot(10,14),
    crab:L('M19 42L9 47M20 47L12 55M45 42L55 47M44 47L52 55')+L('M19 34L11 24M45 34L53 24')+S('path',PK,{d:'M11 24C3 24 2 13 9 12C10 17 14 18 14 20Z'})+S('path',PK,{d:'M53 24C61 24 62 13 55 12C54 17 50 18 50 20Z'})+S('ellipse',PK,{cx:32,cy:40,rx:18,ry:12})+L('M26 29V23M38 29V23')+'<circle cx="26" cy="22" r="2.4" fill="var(--ink)"/><circle cx="38" cy="22" r="2.4" fill="var(--ink)"/>'+L('M28 41Q32 45 36 41')+blush(22,42,40)+spark(32,7,2.5)+dot(8,36),
    candle:S('path',RS,{d:'M24 29H40V54H24Z'})+S('ellipse',LI,{cx:32,cy:55,rx:17,ry:3.5})+L('M24 29Q32 33 40 29')+L('M32 29V24')+S('path',BU,{d:'M32 8C38 15 39 21 32 24C25 21 26 15 32 8Z'})+spark(12,16)+spark(52,24,2.5,'#9ec5e8')+dot(50,10),
    pie:S('ellipse',SK,{cx:32,cy:53,rx:27,ry:5.5})+S('path',PE,{d:'M8 36V44A24 10 0 0 0 56 44V36Z'})+S('ellipse',BU,{cx:32,cy:36,rx:24,ry:10})+L('M18 32L34 40M28 28L44 36M46 32L30 40M36 28L20 36')+spark(54,16)+dot(8,22),
    pencil:'<g transform="rotate(40 32 32)">'+S('rect',BU,{x:26,y:9,width:12,height:37})+S('polygon',PE,{points:'26,46 38,46 32,58'})+'<polygon points="30,54 34,54 32,58" fill="var(--ink)"/>'+S('rect',PK,{x:26,y:3,width:12,height:7})+L('M26 13H38')+'</g>'+spark(54,12)+dot(10,52),
    rose:L('M32 38C32 46 31 52 31 58')+S('path',MI,{d:'M31.5 51C22 52 17 46 16 40C25 39 30 43 31.5 51Z'})+S('path',MI,{d:'M32 47C42 48 47 42 48 36C39 35 34 39 32 47Z'})+S('circle',RS,{cx:32,cy:25,r:15})+L('M32 25m-8 0a8 8 0 1 1 8 8')+L('M32 25m-3.5 0a3.5 3.5 0 1 1 3.5 3.5')+spark(52,12)+dot(12,14,'#f4b860'),
    crown:S('path',BU,{d:'M10 46L7 18L22 30L32 12L42 30L57 18L54 46Z'})+S('rect',PK,{x:10,y:46,width:44,height:8})+L('M10 50H54')+'<circle cx="7" cy="17" r="2.4" fill="'+PK+'" stroke="var(--ink)" stroke-width="1.2"/><circle cx="32" cy="11" r="2.4" fill="'+PK+'" stroke="var(--ink)" stroke-width="1.2"/><circle cx="57" cy="17" r="2.4" fill="'+PK+'" stroke="var(--ink)" stroke-width="1.2"/>'+spark(50,6,2.4,'#9ec5e8')+dot(12,6),
    star:S('polygon',BU,{points:'32,8 37.9,25.9 54.8,26.6 41.5,37.1 46.1,53.4 32,44 17.9,53.4 22.5,37.1 9.2,26.6 26.1,25.9'})+eyes(28,36,32,1.2)+L('M29.5 36Q32 38.5 34.5 36')+spark(10,10,3,'#9ec5e8')+spark(56,50,2.5)+dot(8,52),
    boot:S('path',PK,{d:'M20 8H38V32L52 38Q58 41 58 48V54H20Z'})+S('rect',SK,{x:20,y:8,width:18,height:7})+S('rect',WD,{x:18,y:54,width:42,height:6})+L('M24 22H34M24 27H34')+spark(50,14)+dot(10,30),
    fire:S('path',PK,{d:'M32 5C40 18 52 26 50 40C48 54 36 58 32 58C28 58 16 54 14 40C13 30 22 24 26 14C28 20 30 14 32 5Z'})+S('path',BU,{d:'M32 30C38 38 42 42 40 48C38 54 34 54 32 54C30 54 26 54 24 48C24 42 30 38 32 30Z'})+spark(10,16)+spark(54,18,2.4,'#9ec5e8')+dot(8,50),
    smoke:S('path',GR,{d:'M14 52C5 52 5 40 15 40C15 30 28 26 34 32C40 25 54 30 50 40C58 42 56 54 46 52Z'})+S('path',GR,{d:'M30 22C24 22 24 14 31 14C32 8 41 8 42 14C47 14 47 21 41 22Z'})+spark(54,10)+dot(8,24),
    branch:L('M8 52Q30 42 56 18')+L('M8 56Q30 46 56 22')+L('M28 44Q32 32 26 22')+L('M42 31Q50 33 54 40')+S('ellipse',MI,{cx:25,cy:17,rx:5,ry:9})+S('ellipse',MI,{cx:53,cy:43,rx:7,ry:4.5})+S('ellipse',MI,{cx:53,cy:12,rx:6,ry:4,transform:'rotate(-30 53 12)'})+L('M25 10V24')+spark(8,30,2.5)+dot(14,10),
    paper:S('path',SK,{d:'M14 6H40L52 18V58H14Z'})+L('M40 6V18H52')+L('M21 28H45M21 36H45M21 44H35')+spark(56,8)+dot(8,40),
    letter:S('rect',BU,{x:7,y:14,width:50,height:36})+L('M7 14L32 36L57 14')+'<circle cx="32" cy="36" r="4.5" fill="'+PK+'" stroke="var(--ink)" stroke-width="1.2"/>'+spark(54,8)+dot(8,8),
    stair:S('polygon',LI,{points:'6,58 6,46 20,46 20,34 34,34 34,22 48,22 48,10 58,10 58,58'})+spark(14,22)+dot(26,12)+spark(54,2.5,2.2),
    dish:S('ellipse',SK,{cx:32,cy:36,rx:27,ry:14})+L('M32 36m-18 0a18 8 0 1 0 36 0a18 8 0 1 0 -36 0')+S('ellipse',BU,{cx:32,cy:36,rx:11,ry:4.5})+spark(8,12)+dot(56,12),
    song:note,music:note,
    tear:S('path',SK,{d:'M32 6C32 6 15 28 15 40A17 17 0 0 0 49 40C49 28 32 6 32 6Z'})+L('M23 41A9 9 0 0 0 30 50')+spark(54,16)+dot(10,12),
    picture:S('rect',BU,{x:7,y:9,width:50,height:46})+S('rect',SK,{x:15,y:17,width:34,height:30})+S('polygon',MI,{points:'15,47 27,30 35,40 41,33 49,47'})+S('circle',BU,{cx:41,cy:25,r:4})+spark(58,6,2.4)+dot(6,58),
    poison:S('rect',GR,{x:27,y:14,width:10,height:14})+S('rect',WD,{x:26,y:7,width:12,height:8})+S('path',MI,{d:'M27 26H37L46 36V54Q46 59 41 59H23Q18 59 18 54V36Z'})+S('rect',PE,{x:22,y:39,width:20,height:13})+L('M28 42L36 50M36 42L28 50')+spark(54,16,2.6)+dot(10,20),
    crumb:S('polygon',PE,{points:'12,44 19,38 27,43 25,51 15,52'})+S('polygon',PE,{points:'34,26 42,21 49,27 46,34 37,34'})+S('polygon',PE,{points:'31,50 38,46 44,51 40,57 33,56'})+S('polygon',PE,{points:'20,22 24,19 28,22 26,26 21,26'})+spark(54,50,2.4)+dot(10,10),
    stick:S('path',WD,{d:'M8 52L12 56L56 12L52 8Z'})+L('M30 34L42 42')+spark(10,16)+dot(54,54),
    sign:S('rect',WD,{x:29,y:8,width:7,height:52})+S('polygon',BU,{points:'10,14 46,14 55,23 46,32 10,32'})+S('polygon',SK,{points:'54,36 20,36 10,43.5 20,51 54,51'})+spark(56,6,2.4)+dot(6,56),
    list:S('rect',GR,{x:12,y:8,width:40,height:50})+S('rect',SK,{x:23,y:3,width:18,height:9,rx:2})+'<rect x="18" y="20" width="6" height="6" fill="none" '+ST+'/><rect x="18" y="31" width="6" height="6" fill="none" '+ST+'/><rect x="18" y="42" width="6" height="6" fill="none" '+ST+'/>'+L('M19 23L21 25L26 19M30 24H46M30 35H46M30 46H40')+spark(58,18,2.4)+dot(6,30),
    world:S('circle',SK,{cx:32,cy:32,r:24})+S('polygon',MI,{points:'17,22 28,16 36,24 28,34 18,32'})+S('polygon',MI,{points:'38,36 50,32 49,46 40,50'})+L('M32 32m-10 0a10 24 0 1 0 20 0a10 24 0 1 0 -20 0')+spark(58,8,2.6)+dot(6,10),
    cabbage:S('circle',GM,{cx:32,cy:34,r:20})+L('M16 28Q32 20 48 28M14 40Q32 52 50 40M32 14Q26 34 32 54')+spark(54,10)+dot(8,52),
    lettuce:S('path',MI,{d:'M10 36C6 26 14 18 22 20C24 12 40 12 42 20C50 18 58 26 54 36C58 46 46 54 38 50C34 58 26 58 24 50C16 54 6 46 10 36Z'})+L('M32 52V28M32 42L23 33M32 42L41 33')+spark(56,8)+dot(8,10),
    radish:S('path',MI,{d:'M32 22C24 10 16 8 12 12C16 20 26 22 32 22Z'})+S('path',MI,{d:'M32 22C40 10 48 8 52 12C48 20 38 22 32 22Z'})+S('path',RS,{d:'M32 20C46 22 52 34 42 46C38 52 32 58 32 58C32 58 26 52 22 46C12 34 18 22 32 20Z'})+L('M32 58V62')+L('M26 30Q32 36 38 30')+spark(54,50)+dot(8,40),
    onion:S('path','#f6d9b0',{d:'M32 14C32 22 14 26 14 42C14 54 24 58 32 58C40 58 50 54 50 42C50 26 32 22 32 14Z'})+L('M32 18C25 30 25 46 32 58M32 18C39 30 39 46 32 58')+L('M32 14Q29 8 34 4M28 58L26 62M32 58V62M36 58L38 62')+spark(54,12)+dot(8,30),
    potato:S('path',WD,{d:'M10 36C10 22 26 16 40 18C54 20 58 32 52 44C46 54 24 56 14 48C11 45 10 41 10 36Z'})+'<ellipse cx="24" cy="32" rx="1.6" ry="1.1" fill="var(--ink)"/><ellipse cx="38" cy="42" rx="1.6" ry="1.1" fill="var(--ink)"/><ellipse cx="44" cy="28" rx="1.4" ry="1" fill="var(--ink)"/>'+L('M20 42Q24 44 28 42')+spark(54,10)+dot(8,52),
    pea:S('path',MI,{d:'M8 40C8 22 40 14 56 20C54 40 36 52 14 48C10 47 8 44 8 40Z'})+S('circle','#a8d8a8',{cx:21,cy:37,r:5})+S('circle','#a8d8a8',{cx:32,cy:33,r:5})+S('circle','#a8d8a8',{cx:43,cy:29,r:5})+L('M56 20Q60 14 58 10')+spark(52,50)+dot(10,16),
    blackberry:S('circle','#cdb4e8',{cx:26,cy:32,r:6})+S('circle','#cdb4e8',{cx:38,cy:32,r:6})+S('circle','#cdb4e8',{cx:20,cy:43,r:6})+S('circle','#cdb4e8',{cx:32,cy:43,r:6})+S('circle','#cdb4e8',{cx:44,cy:43,r:6})+S('circle','#cdb4e8',{cx:26,cy:54,r:6})+S('circle','#cdb4e8',{cx:38,cy:54,r:6})+S('path',MI,{d:'M32 26C26 16 18 14 14 18C18 24 26 28 32 26Z'})+S('path',MI,{d:'M32 26C38 16 46 14 50 18C46 24 38 28 32 26Z'})+L('M32 26V20')+spark(54,8)+dot(8,24),
    boat:S('path',WD,{d:'M8 38H56L48 52H16Z'})+L('M32 38V10L50 32H32')+S('path',SK,{d:'M32 12L48 32H32Z'})+L('M4 56Q16 52 28 56T52 56T62 56')+spark(54,10)+dot(8,20),
    lantern:S('rect',BU,{x:20,y:20,width:24,height:30,rx:4})+L('M24 20V14Q32 6 40 14V20M20 50H44M26 56H38')+L('M32 28Q27 36 32 44Q37 36 32 28')+spark(54,12)+dot(8,52),
    pipe:S('path',WD,{d:'M10 40H34Q42 40 44 34V22'})+S('path',WD,{d:'M38 22H54V34Q54 42 46 42H40Z'})+L('M10 40H34Q42 40 44 34V22M38 22H54')+L('M46 18Q42 12 48 8Q52 4 50 2')+spark(14,16)+dot(8,52),
    chimney:S('rect',PK,{x:20,y:16,width:24,height:40})+L('M16 16H48M20 30H44M20 44H44M32 16V30M26 30V44M38 30V44')+L('M30 10Q26 6 31 3M38 10Q42 6 37 2')+spark(54,24)+dot(8,52),
    sledge:S('path',WD,{d:'M12 24H52V38H12Z'})+L('M8 48H50Q58 48 58 40V34M18 38V48M44 38V48')+L('M18 24V16M46 24V16M18 16H46')+spark(54,10)+dot(8,56),
    ship:S('path',WD,{d:'M6 40H58L48 54H16Z'})+S('path',SK,{d:'M20 12L34 36H20Z'})+S('path',SK,{d:'M38 18L52 36H38Z'})+L('M34 8V40M20 12V40')+L('M4 58Q16 54 28 58T52 58T62 58')+spark(54,8)+dot(8,24),
    umbrella:S('path',PK,{d:'M8 34C8 18 20 10 32 10C44 10 56 18 56 34C52 30 48 30 44 34C40 30 36 30 32 34C28 30 24 30 20 34C16 30 12 30 8 34Z'})+L('M32 34V52Q32 58 38 58Q42 58 42 54')+L('M32 10V6M32 10Q22 20 20 34M32 10Q42 20 44 34')+spark(54,10)+dot(8,52),
    button:S('circle',SK,{cx:32,cy:32,r:22})+L('M32 32m-15 0a15 15 0 1 0 30 0a15 15 0 1 0 -30 0')+'<circle cx="26" cy="26" r="2.2" fill="var(--ink)"/><circle cx="38" cy="26" r="2.2" fill="var(--ink)"/><circle cx="26" cy="38" r="2.2" fill="var(--ink)"/><circle cx="38" cy="38" r="2.2" fill="var(--ink)"/>'+L('M26 26L38 38M38 26L26 38','stroke-width="1"')+spark(56,8)+dot(8,56),
    gate:S('rect',WD,{x:8,y:8,width:8,height:52})+S('rect',WD,{x:48,y:8,width:8,height:52})+S('rect',WD,{x:16,y:16,width:32,height:6})+S('rect',WD,{x:16,y:36,width:32,height:6})+L('M16 42L48 22')+'<circle cx="44" cy="39" r="1.6" fill="var(--ink)"/>'+spark(32,8,2.4)+dot(32,54),
    rake:S('rect',WD,{x:30,y:4,width:4,height:32})+S('rect',GR,{x:12,y:36,width:40,height:5})+L('M16 41V54M24 41V54M32 41V54M40 41V54M48 41V54')+spark(52,14)+dot(10,16),
    wheelbarrow:S('path',SK,{d:'M8 22H46L40 42H16Z'})+S('circle',GR,{cx:50,cy:44,r:9})+'<circle cx="50" cy="44" r="1.8" fill="var(--ink)"/>'+L('M8 22L2 30M16 42L14 58M30 42L34 58')+spark(52,12)+dot(8,54),
    loaf:S('path',PE,{d:'M8 40C6 26 18 18 32 18C46 18 58 26 56 40C56 48 52 50 50 52H14C10 50 8 48 8 40Z'})+L('M20 26L26 38M32 24L38 36M44 26L48 38')+spark(54,10)+dot(8,14),
    bun:S('ellipse',PE,{cx:32,cy:38,rx:22,ry:16})+L('M18 32Q32 24 46 32')+'<ellipse cx="26" cy="36" rx="1.1" ry=".8" fill="var(--ink)"/><ellipse cx="34" cy="40" rx="1.1" ry=".8" fill="var(--ink)"/><ellipse cx="40" cy="34" rx="1.1" ry=".8" fill="var(--ink)"/>'+spark(54,14)+dot(8,24),
    pot:S('path','#f3c5a5',{d:'M12 28H52L46 58H18Z'})+S('rect','#f3c5a5',{x:10,y:22,width:44,height:8})+L('M32 22V12')+S('path',MI,{d:'M32 15C26 6 18 8 16 12C20 18 28 18 32 15Z'})+S('path',MI,{d:'M32 13C38 4 46 6 48 10C44 16 36 16 32 13Z'})+spark(54,12)+dot(8,40),
    cucumber:S('path',MI,{d:'M8 44C4 36 12 30 20 26L50 10C58 6 60 14 56 22C52 30 40 38 26 48C18 54 10 50 8 44Z'})+'<circle cx="26" cy="36" r="1.2" fill="var(--ink)"/><circle cx="36" cy="28" r="1.2" fill="var(--ink)"/><circle cx="46" cy="20" r="1.2" fill="var(--ink)"/><circle cx="20" cy="44" r="1.2" fill="var(--ink)"/>'+spark(52,48)+dot(10,12),
    rabbit:S('path',RS,{d:'M24 4C19 6 19 18 22 26L27 27C29 20 29 9 24 4Z'})+S('path',RS,{d:'M40 4C45 6 45 18 42 26L37 27C35 20 35 9 40 4Z'})+S('ellipse',GR,{cx:32,cy:51,rx:15,ry:11})+S('ellipse',GR,{cx:32,cy:36,rx:13,ry:11})+eyes(27.5,36.5,35,1.3)+L('M30.6 39.2H33.4L32 40.6Z')+L('M32 40.6V42M32 42Q30.8 43 29.8 42.4M32 42Q33.2 43 34.2 42.4')+blush(23.5,40.5,40)+L('M24 38L16 37M24 40L15 41M40 38L48 37M40 40L49 41','stroke-width="1"')+spark(54,10)+dot(8,14)
  };
  return {en:en,_h:{S:S,L:L,dot:dot,spark:spark,eyes:eyes,blush:blush}};
})();
/* Monta o <svg>; o texto alternativo é a tradução em português */
function drawSvg(lang,w,alt){
  const d=DRAW[lang]&&DRAW[lang][String(w).toLowerCase()];
  return d?'<svg class="wdraw-svg" viewBox="0 0 64 64" role="img" aria-label="Desenho: '+esc(alt||w)+'">'+d+"</svg>":"";
}
