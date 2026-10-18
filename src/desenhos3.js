/* ===== Desenhos (lote 3): roupas, corpo, saúde, trabalho, cidade ===== */
(function(){
  const K=window.__K,H=K.H,S=H.S,L=H.L,dot=H.dot,spark=H.spark,eyes=H.eyes,blush=H.blush,P=K.P,C=K.C,E=K.E,R=K.R,ik=K.ik,add=K.add;
  const {PK,PE,MI,SK,LI,BU,RS,WD,GR,GM,RD,OR,BR,WH,DG}=K.col;
  /* roupas */
  add("shirt",["camisa","camiseta"],P(SK,'M22 8L6 18L12 30L20 26V56H44V26L52 30L58 18L42 8Q32 16 22 8Z')+L('M22 8Q32 16 42 8')+C(WH,32,28,1.2)+C(WH,32,36,1.2)+C(WH,32,44,1.2)+spark(54,10)+dot(8,50));
  add("trousers",["calça"],P(SK,'M16 6H48L52 58H36L32 28L28 58H12Z')+L('M16 12H48')+L('M32 12V28')+spark(54,12)+dot(8,30));
  add("dress",["vestido"],P(PK,'M24 6H28L32 14L36 6H40L42 22L52 58H12L22 22Z')+L('M22 22H42')+L('M28 30Q32 34 36 30')+spark(54,10)+dot(8,40));
  add("skirt",["saia"],P(LI,'M20 10H44L56 56H8Z')+L('M20 10Q32 16 44 10')+L('M24 20L18 54M32 22V55M40 20L46 54')+spark(54,10)+dot(8,24));
  add("coat",["casaco","jaqueta"],P(OR,'M22 8L6 18L8 56H24V30H40V56H56L58 18L42 8Q32 16 22 8Z')+L('M32 14V56')+C(BR,28,36,1.6)+C(BR,28,44,1.6)+L('M24 30V56')+spark(54,10)+dot(6,6));
  add("hat",["chapéu"],E(BR,32,44,26,7)+P(BR,'M16 44C16 22 22 12 32 12C42 12 48 22 48 44Z')+L('M16 38Q32 44 48 38')+R(RD,16,36,32,5,0)+spark(54,14)+dot(8,20));
  add("shoe",["sapato","tênis"],P(BR,'M6 24H22L26 34Q42 36 56 44V52H6Z')+L('M6 52H56')+L('M14 24V36M20 24V34')+L('M28 38L32 34M34 40L38 36')+spark(50,26)+dot(10,12));
  add("sock",["meia"],P(LI,'M20 6H40V30L56 42Q60 50 52 54Q46 56 40 50L20 38Z')+L('M20 12H40')+L('M20 18H40')+spark(52,14)+dot(10,52));
  add("bag",["bolsa"],P(PK,'M10 24H54L50 56H14Z')+L('M22 24Q22 8 32 8Q42 8 42 24')+C(BU,32,36,2)+L('M10 24H54')+spark(54,10)+dot(8,44));
  add("sweater",["suéter","blusa"],P(LI,'M22 8L8 20L8 44H16L18 28V56H46V28L48 44H56L56 20L42 8Q32 16 22 8Z')+L('M18 50H46M22 8Q32 16 42 8')+L('M24 30H40M24 38H40')+spark(54,10)+dot(6,6));
  add("tie",["gravata"],P(RD,'M26 6H38L36 14L40 54L32 60L24 54L28 14Z')+L('M26 6H38')+L('M28 24L36 26M28 34L36 36M29 44L35 46')+spark(52,16)+dot(10,40));
  add("glove",["luva"],P(PK,'M20 58V36L12 24Q10 18 16 18L22 26V10Q22 6 26 6Q30 6 30 10V24V8Q30 4 34 4Q38 4 38 8V24V12Q38 8 42 8Q46 8 46 12V30Q56 34 50 44L44 58Z')+L('M20 50H44')+spark(54,10)+dot(8,54));
  add("scarf",["cachecol"],P(RD,'M10 12Q32 4 54 12V26Q32 34 10 26Z')+P(RD,'M36 28H52V58L44 53L36 58Z')+L('M14 18Q32 12 50 18M14 23Q32 28 50 23')+L('M36 38H52M36 46H52')+spark(8,44)+dot(56,6));
  add("cap",["boné"],P(SK,'M10 40C10 20 20 12 32 12C44 12 52 22 52 40Z')+P(SK,'M50 38H62Q62 46 50 46Z')+L('M10 40H52')+L('M32 12V40')+C(BU,32,12,2)+spark(10,14)+dot(56,20));
  add("belt",["cinto"],R(BR,4,24,56,16,2)+R(BU,24,22,16,20,3)+R('none',28,27,8,10,1)+C(BR,12,32,1.3)+C(BR,50,32,1.3)+C(BR,56,32,1.3)+spark(54,12)+dot(8,52));
  add("glasses",["óculos"],C(SK,18,34,11)+C(SK,46,34,11)+L('M29 34Q32 30 35 34')+L('M7 32L2 26M57 32L62 26')+L('M12 28Q14 26 17 26')+spark(32,16)+dot(56,52));
  add("boots",["botas","bota"],P(BR,'M16 6H36V34L54 42V54H10V6Z')+L('M16 14H36')+L('M10 54H54')+L('M20 42L26 44')+spark(50,20)+dot(8,60));
  add("shorts",["short","bermuda"],P(SK,'M12 10H52L56 38H36L32 26L28 38H8Z')+L('M12 16H52')+L('M32 16V26')+spark(54,50)+dot(8,52));
  /* corpo */
  add("hand",["mão"],P(PE,'M22 58Q10 50 10 38V24Q10 20 14 20Q18 20 18 24V30V12Q18 8 22 8Q26 8 26 12V28V8Q26 4 30 4Q34 4 34 8V28V10Q34 6 38 6Q42 6 42 10V34L46 28Q50 26 52 30Q54 34 48 46Q44 58 36 58Z')+spark(54,10)+dot(8,56));
  add("foot",["pé"],P(PE,'M30 22Q20 24 20 40Q20 54 31 56Q43 56 43 42Q43 24 30 22Z')+C(PE,19,16,3.4)+C(PE,27,11,3.6)+C(PE,36,11,3.2)+C(PE,44,16,2.8)+C(PE,50,24,2.4)+L('M26 34Q30 38 28 46')+spark(54,50)+dot(8,12));
  add("eye",["olho"],P(WH,'M4 32Q32 6 60 32Q32 58 4 32Z')+C('#9cc7e8',32,32,11)+C('var(--ink)',32,32,5)+'<circle cx="35" cy="29" r="2" fill="#fff"/>'+L('M16 20L12 12M32 14V6M48 20L52 12')+spark(54,50)+dot(8,52));
  add("ear",["orelha"],P(PE,'M24 6Q46 4 48 24Q48 36 40 40Q36 48 30 54Q22 58 20 50Q22 46 26 46Q20 40 18 30Q16 12 24 6Z')+L('M26 18Q38 14 40 26Q40 32 34 36')+spark(54,10)+dot(8,44));
  add("nose",["nariz"],P(PE,'M30 6Q28 24 24 38Q16 40 16 46Q16 52 24 52Q28 52 32 49Q36 52 40 52Q48 52 48 46Q48 40 40 38Q36 24 34 6Z')+L('M22 46Q24 48 27 46M37 46Q40 48 42 46')+spark(54,12)+dot(8,16));
  add("mouth",["boca"],P(RD,'M6 30Q32 22 58 30Q50 52 32 52Q14 52 6 30Z')+P(WH,'M10 32Q32 26 54 32Q48 38 32 38Q16 38 10 32Z')+L('M6 30Q32 22 58 30')+L('M10 32Q32 26 54 32')+spark(54,12)+dot(8,52));
  add("tooth",["dente"],P(WH,'M14 10Q22 4 32 10Q42 4 50 10Q54 24 48 36Q46 54 40 56Q36 56 34 40Q32 38 30 40Q28 56 24 56Q18 54 16 36Q10 24 14 10Z')+spark(54,10)+dot(8,40));
  add("heart",["coração"],P(RD,'M32 56C14 42 6 32 6 22Q6 10 18 10Q26 10 32 18Q38 10 46 10Q58 10 58 22C58 32 50 42 32 56Z')+L('M16 18Q18 15 22 15')+spark(54,50)+dot(6,48));
  add("head",["cabeça"],E(PE,32,30,18,22)+P(BR,'M14 28Q12 8 32 8Q52 8 50 28Q42 16 32 18Q22 16 14 28Z')+ik(25,31)+ik(39,31)+L('M28 42Q32 45 36 42')+blush(21,43,38)+P(PE,'M24 50H40V58H24Z')+spark(54,12)+dot(8,12));
  /* saúde */
  add("medicine",["remédio","comprimido"],P(WH,'M14 24H50V54Q50 58 46 58H18Q14 58 14 54Z')+R(RD,12,14,40,10,2)+L('M32 34V48M24 41H40')+spark(54,10)+dot(8,40));
  add("ambulance",["ambulância"],R(WH,4,18,40,28,3)+P(WH,'M44 26H54L60 36V46H44Z')+L('M50 30V36H57')+L('M24 24V38M17 31H31','stroke="#d33" stroke-width="2.6"')+C(GR,16,48,6)+C(GR,48,48,6)+spark(10,10)+dot(58,14));
  add("bandage",["curativo","band-aid"],P(PE,'M10 18L46 54Q52 58 56 54Q60 50 56 44L20 8Q14 4 10 8Q6 12 10 18Z')+R(BR,22,22,20,12,0)+L('M28 24L36 32M24 28L32 36M30 22L38 30')+spark(52,14)+dot(8,50));
  add("syringe",["vacina","seringa"],R(WH,14,22,28,12,2)+L('M42 28H54M10 28H14M10 22V34')+R(SK,20,24,12,8,0)+L('M14 38L8 44M22 22V18M28 22V18')+L('M48 26V30')+spark(52,48)+dot(8,12));
  add("hospital",["hospital"],R(WH,10,16,44,40,2)+L('M10 56H54')+R(RD,28,22,8,20,1)+R(RD,22,28,20,8,1)+R(SK,26,44,12,12,1)+spark(52,8)+dot(6,12));
  /* trabalho */
  add("computer",["computador","notebook"],R(SK,12,10,40,30,2)+R(WH,16,14,32,22,1)+P(GR,'M6 44H58L54 52H10Z')+L('M26 48H38')+L('M20 20H44M20 26H38M20 31H42')+spark(56,8)+dot(8,18));
  add("phone",["telefone","celular"],R(GR,18,4,28,56,5)+R(SK,22,10,20,38,1)+C(WH,32,54,2.4)+L('M28 7H36')+L('M26 18H38M26 24H36M26 30H38')+spark(54,10)+dot(8,40));
  add("book",["livro"],P(LI,'M6 12Q22 8 32 14Q42 8 58 12V52Q42 48 32 54Q22 48 6 52Z')+L('M32 14V54')+L('M12 20Q22 18 28 22M12 28Q22 26 28 30M36 22Q42 18 52 20M36 30Q42 26 52 28')+spark(54,8)+dot(8,58));
  add("pen",["caneta"],P(SK,'M44 6L58 20L24 54L8 58L12 42Z')+L('M38 12L52 26')+P(BU,'M12 42L24 54L8 58Z')+L('M8 58L10 54')+spark(14,16)+dot(54,52));
  add("school",["escola"],R(PE,8,24,48,32,2)+P(PK,'M4 26L32 10L60 26Z')+R(SK,26,40,12,16,1)+R(SK,14,32,8,8,1)+R(SK,42,32,8,8,1)+L('M32 10V2')+P(RD,'M32 2H42V7H32Z')+spark(54,50)+dot(6,14));
  /* cidade */
  add("plane",["avião"],P(WH,'M4 34L52 20Q60 18 60 24Q60 28 52 30L10 42Z')+P(SK,'M26 28L34 8L40 10L36 28ZM24 40L32 56L38 54L34 38Z')+P(SK,'M4 34L6 26L12 26L16 34Z')+L('M44 24H46M38 26H40M32 28H34')+spark(54,50)+dot(8,56));
  add("train",["trem"],R(RD,10,10,44,38,6)+R(SK,16,16,14,12,2)+R(SK,34,16,14,12,2)+R(WH,16,34,32,6,1)+C(BU,20,44,2.4)+C(BU,44,44,2.4)+L('M6 52H58M14 48L8 56M50 48L56 56')+spark(54,6)+dot(6,8));
  add("car",["carro"],P(RD,'M6 40L10 30Q12 24 20 24H40Q46 24 50 30L58 34Q60 36 60 42V44H6Z')+P(SK,'M16 28H30V32H14ZM34 28H42Q46 28 48 32H34Z')+C(DG,18,46,7)+C(DG,48,46,7)+C(WH,18,46,2.4)+C(WH,48,46,2.4)+spark(52,10)+dot(8,20));
  add("bridge",["ponte"],P(WD,'M2 36H62V42H2Z')+L('M2 36Q32 4 62 36')+L('M12 30V36M20 22V36M32 17V36M44 22V36M52 30V36')+P(SK,'M2 42Q8 58 16 56L2 56ZM62 42Q56 58 48 56L62 56Z')+L('M2 56Q16 50 32 56T62 56')+spark(52,8)+dot(6,14));
  add("suitcase",["mala"],R(BR,8,20,48,34,4)+L('M24 20V12H40V20')+L('M8 36H56')+R(BU,28,32,8,8,1)+C(DG,16,56,2)+C(DG,48,56,2)+spark(54,10)+dot(6,14));
  add("passport",["passaporte"],R(SK,14,6,36,50,3)+C(BU,32,26,9)+L('M32 17V35M23 26H41')+L('M22 44H42M24 49H40')+spark(54,10)+dot(8,52));
  add("taxi",["táxi"],P(BU,'M6 40L10 30Q12 24 20 24H40Q46 24 50 30L58 34Q60 36 60 42V44H6Z')+R(WH,24,16,16,8,2)+P(SK,'M16 28H30V32H14ZM34 28H42Q46 28 48 32H34Z')+C(DG,18,46,7)+C(DG,48,46,7)+C(WH,18,46,2.4)+C(WH,48,46,2.4)+L('M10 38H56','stroke-dasharray="3 3"')+spark(54,8)+dot(6,16));
  add("church",["igreja"],R(PE,14,28,36,28,1)+P(PK,'M10 30L32 16L54 30Z')+R(PE,26,8,12,16,1)+P(PK,'M24 10L32 2L40 10Z')+L('M32 2V-2')+P(SK,'M26 56V44Q26 38 32 38Q38 38 38 44V56Z')+L('M20 36V42M44 36V42')+spark(54,16)+dot(6,16));
  add("bus",["ônibus"],R(BU,6,10,52,38,5)+R(SK,12,16,12,10,2)+R(SK,28,16,12,10,2)+R(SK,44,16,10,10,2)+L('M6 34H58')+C(DG,18,50,6)+C(DG,46,50,6)+C(WH,18,50,2)+C(WH,46,50,2)+spark(54,6)+dot(6,8));
  add("bicycle",["bicicleta"],C('none',16,42,12)+C('none',48,42,12)+L('M16 42L26 24H40L48 42M26 24L34 42H16M24 20H30M40 24L38 16H44')+C(BU,34,42,2.4)+spark(54,12)+dot(6,16));
  add("map",["mapa"],P(PE,'M6 12L22 8L42 14L58 10V52L42 56L22 50L6 54Z')+L('M22 8V50M42 14V56')+L('M10 28Q16 22 18 30M26 30Q32 24 38 32','stroke-dasharray="3 3"')+P(RD,'M48 28L52 36L48 34L44 36Z')+spark(54,50)+dot(6,6));
  add("beach",["praia"],P(SK,'M0 40Q16 34 32 40T64 40V56H0Z')+P(BU,'M0 48Q20 42 40 48T64 46V60H0Z')+C(OR,48,16,7)+P(RS,'M10 18Q22 6 34 18Z')+L('M22 18V46')+spark(8,8)+dot(54,30));
  window.__K.H=H;
})();
