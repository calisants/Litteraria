/* ===== Desenhos das palavras (lote 2): objetos, comidas, animais, roupas etc. para fr, it e en =====
   Cada desenho é um «conceito» ligado ao significado em português (a primeira tradução do dicionário do app),
   então a mesma figura aparece em francês, italiano e inglês (pomme, mela e apple = maçã).
   Só entram classes de substantivo concreto; temas como cores, verbos e descrições ficam de fora.
   Mesmo estilo «linha fina» de desenhos.js (SVG originais de Claude). */
(function(){
  const H=DRAW._h,S=H.S,L=H.L,dot=H.dot,spark=H.spark,eyes=H.eyes,blush=H.blush;
  const PK='#f9c6c0',PE='#fdeccb',MI='#c8e8cb',SK='#cfe3f6',LI='#dcd5f5',BU='#ffe7a3',RS='#fbc3d0',WD='#e3c9a8',GR='#e6e9ef',GM='#bfe6c4',RD='#f4a3a3',OR='#fcd3a6',BR='#d2ad84',WH='#fbf8f1',DG='#b8bfcc';
  const P=(c,d)=>S('path',c,{d:d}),C=(c,x,y,r)=>S('circle',c,{cx:x,cy:y,r:r}),E=(c,x,y,rx,ry)=>S('ellipse',c,{cx:x,cy:y,rx:rx,ry:ry}),R=(c,x,y,w,h,rx)=>S('rect',c,{x:x,y:y,width:w,height:h,rx:rx||0});
  const ik=(x,y,r)=>'<circle cx="'+x+'" cy="'+y+'" r="'+(r||1.4)+'" fill="var(--ink)"/>';
  const D={},PT={};
  const add=(id,pts,svg)=>{D[id]=svg;PT[id]=pts;};
  /* comida */
  add("apple",["maçã"],P(RD,'M32 22C24 16 12 22 14 38C16 50 24 58 32 54C40 58 48 50 50 38C52 22 40 16 32 22Z')+L('M32 22Q32 14 37 9')+P(MI,'M35 17C41 8 50 12 48 17C44 21 38 21 35 17Z')+spark(10,14)+dot(56,52));
  add("cheese",["queijo"],P(BU,'M6 36L56 22V44L6 52Z')+P('#fff1bf','M6 36L56 22L58 28L10 44Z')+C(BU,22,44,3)+C(BU,40,36,2.6)+L('M6 52V44')+spark(56,12)+dot(10,24));
  add("milk",["leite"],P(WH,'M20 24H44V56H20Z')+P(SK,'M20 24L26 12H38L44 24Z')+L('M26 12V24M38 12V24')+C(SK,32,40,6)+spark(52,14)+dot(10,50));
  add("fish",["peixe"],E(SK,28,32,20,12)+P(SK,'M46 32L58 22V42Z')+ik(17,29)+L('M10 33Q13 36 10 38')+L('M26 22Q30 16 36 22M28 42Q32 48 38 42')+L('M30 28Q34 32 30 36')+spark(12,12)+dot(54,52));
  add("rice",["arroz"],E(WH,32,32,22,9)+P(BU,'M8 34H56Q54 54 32 56Q10 54 8 34Z')+L('M20 28L22 26M30 25L32 23M40 27L42 25M26 31L28 29M36 30L38 28')+L('M8 34H56')+spark(52,12)+dot(10,16));
  add("cake",["bolo"],P(PE,'M10 36H54V54H10Z')+P(RS,'M10 36Q16 28 22 36Q28 28 34 36Q40 28 46 36Q50 30 54 36V40H10Z')+R(LI,30,24,4,10)+P(BU,'M32 14C36 19 36 22 32 24C28 22 28 19 32 14Z')+L('M10 54H54')+spark(8,16)+dot(56,22));
  add("strawberry",["morango"],P(RD,'M32 56C14 46 12 28 20 24C26 22 30 26 32 26C34 26 38 22 44 24C52 28 50 46 32 56Z')+P(MI,'M32 22L24 14L30 18L32 10L34 18L40 14Z')+'<circle cx="26" cy="34" r="1" fill="#fff"/><circle cx="36" cy="32" r="1" fill="#fff"/><circle cx="32" cy="42" r="1" fill="#fff"/><circle cx="42" cy="38" r="1" fill="#fff"/><circle cx="24" cy="44" r="1" fill="#fff"/>'+spark(54,14)+dot(8,48));
  add("chicken",["frango"],P('#eab67f','M16 16C28 6 46 12 44 26C43 33 37 38 31 37L24 46L18 40L26 32C14 30 10 22 16 16Z')+R(WH,12,40,10,6,3)+R(WH,18,46,10,6,3)+L('M20 20Q26 16 32 20')+spark(52,12)+dot(50,50));
  add("sugar",["açúcar"],R(WH,10,34,20,20,2)+R(WH,34,34,20,20,2)+R(WH,22,16,20,20,2)+L('M14 40L18 40M38 40L42 40M26 22L30 22')+spark(52,16)+dot(8,24));
  add("egg",["ovo"],P(WH,'M32 8C44 8 50 28 50 38C50 49 42 56 32 56C22 56 14 49 14 38C14 28 20 8 32 8Z')+L('M22 26Q24 20 28 17')+spark(54,14)+dot(10,50));
  add("butter",["manteiga"],R(BU,8,30,48,22,3)+P('#fff1bf','M8 33Q8 30 11 30H53Q56 30 56 33V36H8Z')+R(BU,18,20,20,10,2)+L('M8 36H56')+spark(54,14)+dot(10,18));
  add("soup",["sopa"],P(SK,'M8 32H56Q54 54 32 56Q10 54 8 32Z')+E(OR,32,32,24,6)+L('M26 14Q22 10 26 6M36 16Q32 12 36 8')+C(MI,26,32,2)+C(RD,38,33,2)+spark(54,12)+dot(8,16));
  add("salad",["salada"],P(WH,'M8 32H56Q54 54 32 56Q10 54 8 32Z')+C(MI,20,28,8)+C(GM,34,24,9)+C(MI,46,29,7)+C(RD,30,31,4)+C(OR,42,34,3)+L('M8 32H56')+spark(54,10)+dot(8,18));
  add("pasta",["massa"],P(WH,'M8 34H56Q54 54 32 56Q10 54 8 34Z')+L('M14 34Q20 20 26 34Q32 18 38 34Q44 20 50 34')+L('M18 34Q24 26 30 34M34 34Q40 26 46 34')+C(RD,32,28,4)+L('M8 34H56')+spark(54,14)+dot(10,20));
  add("ham",["presunto"],P(PK,'M10 40C6 24 22 14 38 18C52 22 58 34 52 46C46 54 20 54 10 40Z')+E('#fde1e1',34,34,12,8)+R(WH,50,40,8,8,4)+spark(14,14)+dot(54,16));
  add("honey",["mel"],P(BU,'M16 26H48V52Q48 58 42 58H22Q16 58 16 52Z')+R(BR,14,18,36,8,2)+R(WH,22,34,20,12,2)+L('M26 40H38')+P(BU,'M40 18Q44 18 44 24Q44 28 41 28Q38 28 38 24Z')+spark(54,10)+dot(8,38));
  add("fruit",["fruta"],P(BR,'M8 34H56Q52 54 32 56Q12 54 8 34Z')+C(RD,22,28,8)+C(OR,36,26,8)+C(MI,46,32,6)+L('M8 34H56')+spark(54,10)+dot(10,16));
  add("carrot",["legume","cenoura"],P(OR,'M22 20L42 22L34 58Z')+L('M26 30H34M28 40H35')+P(MI,'M32 20C24 12 24 8 28 6C32 8 33 14 32 20Z')+P(MI,'M34 20C40 12 44 10 46 14C44 18 40 20 34 20Z')+spark(10,16)+dot(54,50));
  /* restaurante */
  add("water",["água"],P(SK,'M16 14H48L44 56H20Z')+P('#a9d2f3','M18 30Q25 26 32 30T46 30L44 56H20Z')+L('M16 14H48')+spark(52,22)+dot(10,40));
  add("wine",["vinho"],P(WH,'M18 8H46Q48 28 38 34Q32 38 26 34Q16 28 18 8Z')+P('#d97a8a','M20 20Q32 24 44 20Q44 30 38 33Q32 36 26 33Q20 30 20 20Z')+L('M32 36V54M22 56H42')+spark(54,16)+dot(10,24));
  add("coffee",["café"],P(WH,'M12 24H44V40Q44 54 28 54Q12 54 12 40Z')+L('M44 28H50Q56 28 56 35Q56 42 48 42H43')+E('#b98a63',28,24,16,3)+L('M20 16Q17 12 20 8M30 16Q27 12 30 7')+E(SK,28,56,22,3)+spark(54,10)+dot(8,40));
  add("beer",["cerveja"],P(BU,'M14 18H42V54Q42 58 38 58H18Q14 58 14 54Z')+L('M42 24H50Q55 24 55 32Q55 42 47 42H42')+P(WH,'M12 18Q12 8 20 10Q24 4 32 8Q40 6 44 14Q46 18 42 18Z')+L('M20 28V50M28 28V50M36 28V50')+spark(54,10)+dot(8,40));
  add("glass",["copo"],P('#e9f4fc','M16 12H48L44 56H20Z')+L('M22 20H42')+spark(52,16)+dot(10,42));
  add("juice",["suco"],P('#fff3de','M16 18H48L44 56H20Z')+P(OR,'M18 30H46L44 56H20Z')+L('M36 4L40 22')+C(OR,22,18,4)+spark(52,12)+dot(10,42));
  add("bottle",["garrafa"],P(MI,'M26 6H38V16Q46 22 46 32V54Q46 58 42 58H22Q18 58 18 54V32Q18 22 26 16Z')+R(WH,22,34,20,12,2)+L('M26 6H38')+spark(54,16)+dot(10,40));
  add("fork",["garfo"],P(GR,'M22 6V22Q22 30 30 30V58H34V30Q42 30 42 22V6M32 6V24')+spark(52,14)+dot(10,40));
  add("knife",["faca"],P(GR,'M30 6C40 12 42 28 36 38H30Z')+R(BR,28,38,10,20,4)+spark(52,14)+dot(14,30));
  add("spoon",["colher"],E(GR,32,16,10,13)+P(GR,'M29 28H35L36 58H28Z')+spark(52,14)+dot(12,40));
  add("menu",["cardápio"],R(PE,14,8,36,48,3)+L('M20 18H44M20 26H44M20 34H38M20 42H42')+R(PK,14,8,6,48,2)+spark(54,14)+dot(8,40));
  add("coin",["moeda"],C(BU,32,32,20)+C(BU,32,32,14)+L('M28 28Q32 24 36 28Q28 36 36 38Q32 42 28 38')+spark(54,10)+dot(8,50));
  add("money",["dinheiro","dinheiro vivo"],R(MI,6,18,52,28,3)+C(GM,32,32,8)+L('M12 24H16M48 40H52')+L('M30 28V36')+spark(54,12)+dot(8,54));
  add("basket",["cesta"],P(WD,'M10 28H54L48 54H16Z')+L('M10 28Q32 6 54 28')+L('M20 28L22 54M32 28V54M44 28L42 54M13 38H51M15 46H49')+spark(54,10)+dot(8,16));
  add("gift",["presente"],R(PK,10,28,44,28,2)+R(LI,6,20,52,10,2)+R(BU,28,20,8,36,0)+L('M32 20C24 8 16 14 24 20M32 20C40 8 48 14 40 20')+spark(54,10)+dot(8,14));
  add("card",["cartão"],R(SK,6,16,52,32,4)+R(BU,12,24,10,8,2)+L('M6 38H58M12 43H28')+spark(54,10)+dot(8,56));
  /* casa */
  add("door",["porta"],R(WD,16,6,32,52,2)+L('M16 58H48')+C(BU,40,34,2)+R(WD,22,14,20,14,1)+R(WD,22,34,20,16,1)+spark(54,12)+dot(8,30));
  add("window",["janela"],R(SK,10,10,44,44,2)+L('M32 10V54M10 32H54')+R(WD,6,52,52,6,2)+L('M18 18Q22 16 24 20')+spark(54,8)+dot(6,28));
  add("table",["mesa"],R(WD,6,20,52,8,2)+L('M12 28V56M52 28V56M16 28V40M48 28V40')+spark(52,10)+dot(8,12));
  add("chair",["cadeira"],P(WD,'M16 8H42V32H16Z')+R(WD,12,32,36,8,2)+L('M16 40V58M44 40V58M20 8V32M26 8V32M32 8V32M38 8V32')+spark(52,16)+dot(8,52));
  add("bed",["cama"],R(WD,6,30,52,16,2)+R(PK,6,26,52,10,3)+R(WH,10,20,16,8,4)+L('M6 22V52M58 36V52')+L('M6 46H58')+spark(52,12)+dot(10,12));
  add("roof",["telhado"],P(PK,'M4 36L32 12L60 36Z')+L('M14 36L32 20L50 36M22 36L32 28L42 36')+R(PE,14,36,36,18,1)+spark(54,10)+dot(8,14));
  add("stairs",["escada"],P(WD,'M6 56V44H20V32H34V20H48V8H58V56Z')+L('M20 44V56M34 32V56M48 20V56')+spark(14,16)+dot(54,52));
  add("sofa",["sofá"],P(LI,'M10 24Q10 16 18 16H46Q54 16 54 24V34H10Z')+R(LI,4,30,56,16,5)+R(LI,8,22,10,16,4)+R(LI,46,22,10,16,4)+L('M10 52V56M54 52V56')+spark(54,8)+dot(8,12));
  add("wardrobe",["armário","guarda-roupa"],R(WD,10,6,44,52,2)+L('M32 6V58M10 20H54')+C(BU,28,38,1.6)+C(BU,36,38,1.6)+L('M14 58V62M50 58V62')+spark(58,12)+dot(4,30));
  add("mirror",["espelho"],E(SK,32,28,16,21)+E('none',32,28,16,21)+L('M32 49V58M24 58H40')+L('M24 18Q27 14 31 14')+spark(54,12)+dot(8,20));
  add("key",["chave"],C(BU,20,22,11)+C('#fff6d8',20,22,4)+P(BU,'M26 30L54 52L50 56L46 52L44 54L40 50L36 46L32 38Z')+spark(52,14)+dot(8,50));
  add("lamp",["luminária","abajur"],P(PK,'M16 10H48L56 32H8Z')+L('M32 32V50M22 56H42M32 50V56')+E(BU,32,56,12,3)+spark(10,12)+dot(54,50));
  add("carpet",["tapete"],P(RS,'M6 20H58L52 50H12Z')+L('M16 26H48M18 32H46M20 38H44')+L('M6 20V16M12 20V16M18 20V16M46 20V16M52 20V16M58 20V16')+spark(54,10)+dot(8,52));
  add("curtain",["cortina"],L('M6 8H58')+P(LI,'M8 8H30Q28 24 22 36Q18 48 24 58H8Z')+P(LI,'M56 8H34Q36 24 42 36Q46 48 40 58H56Z')+spark(32,40,3)+dot(32,22));
  window.__D=D;window.__PT=PT;window.__K={P:P,C:C,E:E,R:R,ik:ik,add:add,H:H,col:{PK:PK,PE:PE,MI:MI,SK:SK,LI:LI,BU:BU,RS:RS,WD:WD,GR:GR,GM:GM,RD:RD,OR:OR,BR:BR,WH:WH,DG:DG}};
})();
