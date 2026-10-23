/* ===== Desenhos (lote 7, 23/10/2026): comida e casa, corpo, estações, cidade e objetos que faltavam =====
   Só objetos e lugares genéricos (nada de personagens de livros). Mesmo estilo «linha fina» dos lotes anteriores. */
(function(){
  const K=window.__K,H=K.H,S=H.S,L=H.L,dot=H.dot,spark=H.spark,P=K.P,C=K.C,E=K.E,R=K.R,ik=K.ik,add=K.add;
  const {PK,PE,MI,SK,LI,BU,RS,WD,GR,GM,RD,OR,BR,WH,DG}=K.col;
  /* comida e restaurante */
  add("meat",["carne"],P(RD,'M8 34C8 20 22 12 36 16C50 20 58 32 52 44C46 54 20 56 8 34Z')+E('#fde1e1',36,34,9,6)+C(WH,46,42,5)+L('M12 30Q20 26 28 28')+spark(10,12)+dot(56,14));
  add("dessert",["sobremesa"],P(PE,'M10 50L30 22L50 50Z')+P(RS,'M14 44L30 22L46 44Z')+P(WH,'M10 50H50V56H10Z')+C(RD,30,18,4)+L('M30 14V10')+spark(54,14)+dot(8,14));
  add("napkin",["guardanapo"],P(PK,'M10 14H54V50H10Z')+L('M10 28H54M32 14V50M10 14L54 50','stroke-dasharray="3 3"')+P(RS,'M40 40H54V50H40Z')+spark(54,8)+dot(8,56));
  add("meal",["almoço","jantar","refeição"],E(WH,32,36,24,10)+E('#fffdf6',32,36,16,6)+C(MI,28,34,4)+C(OR,36,36,4)+L('M6 20V44M3 20V28Q3 32 6 32M9 20V28Q9 32 6 32')+P(GR,'M58 20V44M58 20Q52 26 56 32')+spark(32,12)+dot(56,56));
  add("waiter",["garçom"],E(WH,32,22,22,5)+L('M12 22H52')+P(OR,'M24 20Q24 12 32 12Q40 12 40 20Z')+L('M32 12V9')+L('M32 27V46M24 56L32 46L40 56')+P(WH,'M24 30H40V46H24Z')+spark(54,10)+dot(8,12));
  /* casa e lugares */
  add("bedroom",["quarto"],R(PE,6,8,52,46,2)+R(WD,10,32,36,14,2)+R(PK,10,28,36,8,3)+R(WH,12,22,12,8,4)+R(SK,44,14,10,14,1)+L('M10 46V54M46 46V54')+spark(52,40)+dot(8,60));
  add("kitchen",["cozinha"],R(PE,6,8,52,46,2)+R(GR,12,28,24,24,2)+C(DG,20,34,3)+C(DG,28,34,3)+R(GR,16,44,16,6,1)+P(GR,'M40 20H54V50H40Z')+C(WH,47,28,4)+L('M6 54H58')+L('M30 14Q28 10 30 6')+spark(54,56)+dot(8,60));
  add("livingroom",["sala de estar"],R(PE,4,8,56,44,2)+R(LI,10,32,34,14,5)+R(LI,8,26,8,16,3)+R(LI,38,26,8,16,3)+R(SK,48,16,8,16,1)+R(WD,48,32,8,16,1)+C(BU,50,12,4)+L('M20 46V52M36 46V52')+spark(30,16)+dot(8,12));
  add("ceiling",["teto"],R(PE,4,4,56,12,0)+L('M32 16V30')+P(BU,'M20 40Q32 26 44 40Z')+L('M20 40H44')+L('M4 16H60')+spark(52,40)+dot(10,44)+dot(54,54));
  add("fireplace",["lareira"],R(BR,8,8,48,48,2)+P(DG,'M16 56V28Q16 20 32 20Q48 20 48 28V56Z')+P(OR,'M24 56Q22 44 30 36Q34 44 40 40Q42 48 40 56Z')+P(BU,'M30 56Q28 50 33 46Q36 50 36 56Z')+L('M8 20H56')+spark(56,10)+dot(8,60));
  add("courtyard",["pátio"],R(PE,4,10,56,44,1)+R(GR,14,22,36,28,0)+L('M14 22H50M14 36H50M32 22V50')+P(GM,'M4 54H60V58H4Z')+R(SK,8,14,6,8,1)+R(SK,50,14,6,8,1)+spark(32,12)+dot(58,56));
  add("stable",["estábulo"],P(RD,'M4 30L32 8L60 30Z')+R(WD,8,30,48,26,1)+R(BR,18,36,28,20,1)+L('M32 36V56M18 46H46')+L('M8 56H56')+spark(56,10)+dot(6,12));
  add("prison",["prisão"],R(DG,6,8,52,48,2)+L('M16 12V52M26 12V52M36 12V52M46 12V52')+L('M10 24H54M10 42H54')+spark(54,14)+dot(8,60));
  add("mill",["moinho"],R(PE,24,26,16,30,1)+P(PK,'M22 26L32 14L42 26Z')+L('M32 22L10 6M32 22L54 6M32 22L10 38M32 22L54 38')+P(WH,'M32 22L14 8L8 12ZM32 22L56 10L58 16ZM32 22L12 36L16 40Z')+C(BU,32,22,2.4)+spark(56,48)+dot(8,52));
  add("meadow",["prado"],P(GM,'M0 36H64V60H0Z')+P(SK,'M0 8H64V36H0Z')+C(PK,14,46,3)+C(BU,14,46,1)+C(LI,30,52,3)+C(BU,30,52,1)+C(PK,46,44,3)+C(BU,46,44,1)+L('M14 49V56M30 55V60M46 47V56')+C(BU,52,18,6)+spark(14,16)+dot(30,22));
  add("stream",["riacho","córrego"],P(GM,'M0 8H64V60H0Z')+P(SK,'M26 6Q40 20 30 32Q20 44 34 60H46Q34 44 46 32Q56 20 40 6Z')+L('M34 14Q38 20 34 26M36 40Q40 46 38 52')+C(DG,14,44,3)+C(DG,52,48,3)+spark(12,16)+dot(54,14));
  add("valley",["vale"],P(MI,'M0 20L14 8L32 40L50 6L64 20V60H0Z')+P(GM,'M0 44Q32 28 64 44V60H0Z')+P(SK,'M28 60Q32 44 38 44Q40 52 42 60Z')+spark(32,8)+dot(8,14));
  add("woods",["bosque"],R(BR,12,34,4,16,1)+C(GM,14,24,10)+R(BR,30,30,4,20,1)+C(MI,32,18,12)+R(BR,48,36,4,14,1)+C(GM,50,26,9)+L('M4 52H60')+spark(54,8)+dot(8,8));
  add("road",["estrada","caminho"],P(DG,'M26 8H38L58 60H6Z')+L('M32 14V20M32 28V36M32 46V54','stroke-dasharray="4 4" stroke-width="2"')+P(GM,'M0 8H26L6 60H0ZM38 8H64V60H58Z')+spark(54,8)+dot(8,8));
  add("coast",["costa","litoral"],P(SK,'M0 0H64V30Q48 36 32 30Q16 24 0 30Z')+P(BU,'M0 30Q16 24 32 30Q48 36 64 30V44Q48 50 32 44Q16 38 0 44Z')+P(GM,'M0 44Q16 38 32 44Q48 50 64 44V60H0Z')+L('M6 22Q12 20 18 22M40 16Q46 14 52 16')+spark(52,6)+dot(8,10));
  add("horizon",["horizonte"],P(SK,'M0 0H64V34H0Z')+P('#a9d2f3','M0 34H64V60H0Z')+C(BU,32,34,10)+P('#a9d2f3','M0 34H64V40H0Z')+L('M0 34H64')+L('M12 46H24M36 50H52')+spark(10,12)+dot(54,12));
  /* corpo */
  add("belly",["barriga","estômago"],P(PE,'M14 8H50V26Q60 38 48 54Q32 62 16 54Q4 38 14 26Z')+C(PE,32,40,2.4)+L('M18 18H46')+spark(54,10)+dot(6,12));
  add("beard",["barba"],E(PE,32,26,16,18)+P(BR,'M16 28Q16 52 32 54Q48 52 48 28Q44 38 32 38Q20 38 16 28Z')+L('M26 32Q32 30 38 32')+ik(26,22)+ik(38,22)+spark(54,10)+dot(8,12));
  add("cheek",["bochecha"],E(PE,32,32,24,22)+C(PK,18,38,6)+C(PK,46,38,6)+ik(22,28)+ik(42,28)+L('M26 44Q32 48 38 44')+spark(54,10)+dot(8,12));
  add("chest",["peito","tórax"],P(PE,'M10 10H54L58 34Q50 54 32 56Q14 54 6 34Z')+L('M32 14V46')+L('M16 22Q24 30 32 26Q40 30 48 22')+spark(54,10)+dot(6,10));
  add("wing",["asa"],P(WH,'M6 50Q4 22 24 12Q40 6 56 8Q50 18 54 24Q46 28 48 34Q40 36 40 42Q30 44 28 52Z')+L('M16 44Q26 28 46 16M24 48Q32 34 48 24')+spark(54,50)+dot(8,12));
  add("lip",["lábio"],P(RD,'M6 34Q18 20 32 28Q46 20 58 34Q46 50 32 48Q18 50 6 34Z')+L('M6 34Q32 40 58 34')+spark(54,12)+dot(10,12));
  /* saúde */
  add("doctor",["médico"],C(PE,32,16,9)+P(WH,'M14 58V36Q14 28 24 26H40Q50 28 50 36V58Z')+L('M24 26Q26 40 32 42Q38 40 40 26')+C(DG,32,44,3)+L('M32 26V32')+R(RD,28,48,8,2,1)+spark(54,10)+dot(8,14));
  add("dentist",["dentista"],P(WH,'M20 14Q8 12 12 30Q14 44 20 54Q24 58 28 48Q32 40 36 48Q40 58 44 54Q50 44 52 30Q56 12 44 14Q32 20 20 14Z')+L('M40 34L58 22')+C(SK,60,20,4)+spark(10,50)+dot(54,52));
  /* tempo e estações */
  add("thunder",["trovão"],P(DG,'M12 30Q2 30 4 20Q6 12 16 14Q18 4 30 6Q42 6 42 16Q54 16 52 26Q52 30 46 30Z')+P(BU,'M30 28L20 44H28L24 58L40 38H32L36 28Z')+L('M46 40Q52 44 50 52M52 36Q60 42 58 54')+spark(10,50)+dot(56,10));
  add("summer",["verão"],C(BU,32,24,12)+L('M32 4V8M32 40V44M12 24H8M56 24H52M18 10L21 13M46 38L43 35M46 10L43 13M18 38L21 35')+P(SK,'M0 50Q16 44 32 50Q48 56 64 50V60H0Z')+spark(54,10)+dot(8,10));
  add("winter",["inverno"],L('M32 6V58M8 32H56M14 14L50 50M50 14L14 50')+L('M26 8L32 14L38 8M26 56L32 50L38 56M8 26L14 32L8 38M56 26L50 32L56 38')+C(SK,32,32,5)+spark(54,8)+dot(8,56));
  add("springtime",["primavera"],L('M32 58V30')+P(MI,'M32 46C22 46 16 40 18 34C26 34 30 40 32 46Z')+P(MI,'M32 40C42 40 48 34 46 28C38 28 34 34 32 40Z')+C(PK,32,22,6)+C(PK,24,26,6)+C(PK,40,26,6)+C(PK,27,16,6)+C(PK,37,16,6)+C(BU,32,22,4)+spark(10,12)+dot(54,52));
  add("autumn",["outono"],P(OR,'M32 6C40 14 52 14 56 20C52 24 54 30 48 32C52 38 44 42 40 40L40 52L32 58L24 52L24 40C20 42 12 38 16 32C10 30 12 24 8 20C12 14 24 14 32 6Z')+L('M32 14V56M32 28L22 22M32 28L42 22M32 40L24 34M32 40L40 34')+spark(54,50)+dot(8,56));
  add("flame",["chama"],P(OR,'M32 6C36 18 50 24 48 40C46 52 38 58 32 58C24 58 16 52 16 40C16 32 22 28 24 20C28 24 30 20 32 6Z')+P(BU,'M32 30C35 38 42 40 40 48C38 54 34 56 32 56C28 56 24 52 24 46C24 40 30 38 32 30Z')+spark(10,12)+dot(54,14));
  /* cidade e trabalho */
  add("city",["cidade"],R(SK,4,26,14,32,1)+R(LI,20,12,16,46,1)+R(PE,38,30,12,28,1)+R(MI,52,20,10,38,1)+L('M24 18H32M24 26H32M24 34H32M24 42H32M8 32H14M8 40H14M42 36H46M42 44H46M56 28H58M56 36H58')+L('M2 58H62')+spark(44,10)+dot(8,12));
  add("ticket",["bilhete","ingresso"],P(BU,'M4 18H60V28Q54 32 60 36V46H4V36Q10 32 4 28Z')+L('M42 18V46','stroke-dasharray="3 3"')+L('M12 28H34M12 36H28')+spark(54,10)+dot(8,56));
  add("university",["universidade","faculdade"],P(LI,'M4 24L32 8L60 24Z')+R(WH,8,24,48,6,0)+R(PE,12,30,6,22,1)+R(PE,24,30,6,22,1)+R(PE,34,30,6,22,1)+R(PE,46,30,6,22,1)+R(LI,6,52,52,6,0)+L('M32 8V3M32 3H38')+spark(56,8)+dot(6,10));
  add("laboratory",["laboratório"],R(PE,4,40,56,6,1)+L('M10 46V58M54 46V58')+P(SK,'M16 40V30L10 20H22L16 30Z')+P(MI,'M32 40V22H44V40Z')+L('M32 22H44')+P(PK,'M50 40V30L46 20H56L52 30Z')+C(WH,20,14,3)+C(WH,36,14,3)+spark(54,8)+dot(6,12));
  add("meeting",["reunião"],E(WD,32,36,22,10)+C(PE,12,24,5)+C(PE,32,18,5)+C(PE,52,24,5)+P(SK,'M6 36Q12 30 18 36ZM26 30Q32 24 38 30ZM46 36Q52 30 58 36Z')+R(WH,26,32,12,6,1)+spark(54,8)+dot(8,56));
  add("contract",["contrato"],R(WH,12,6,40,52,2)+L('M18 16H46M18 24H46M18 32H40')+L('M20 48Q26 40 30 48Q34 52 42 44')+C(RD,46,50,4)+spark(56,12)+dot(6,60));
  /* objetos */
  add("treasure",["tesouro"],R(WD,8,30,48,24,3)+P(BR,'M8 30Q8 14 32 14Q56 14 56 30Z')+R(BU,28,30,8,10,1)+C(DG,32,36,2)+L('M8 38H56')+C(BU,18,12,3)+C(BU,32,8,3)+C(BU,46,12,3)+spark(56,8)+dot(6,12));
  add("gold",["ouro"],P(BU,'M8 46L16 28H48L56 46Z')+P('#fff1bf','M16 28H48L44 34H20Z')+P(BU,'M20 28L26 14H38L44 28Z')+L('M20 28H44')+spark(54,10)+dot(8,14));
  add("arrow",["flecha"],L('M10 54L52 12')+P(GR,'M52 12L58 6L56 18L48 14Z')+P(RS,'M10 54L6 50L14 48ZM10 54L14 58L16 50Z')+L('M14 50L20 44M18 54L24 48')+spark(14,14)+dot(56,52));
  add("spindle",["fuso"],L('M32 4V60')+P(WD,'M26 22H38L42 36H22Z')+P(BR,'M22 36H42L38 44H26Z')+L('M24 28H40M24 30L40 34')+spark(50,12)+dot(14,52));
  add("wand",["varinha"],P(BR,'M12 54L42 24L46 28L16 58Z')+P(BU,'M48 12L50 18L56 18L51 22L53 28L48 24L43 28L45 22L40 18L46 18Z')+spark(14,14)+dot(56,50));
  add("inn",["estalagem","pousada"],R(PE,6,24,52,32,1)+P(RD,'M2 26L32 8L62 26Z')+R(WD,26,38,12,18,1)+R(SK,12,32,10,10,1)+R(SK,42,32,10,10,1)+R(BU,40,12,16,10,1)+L('M2 56H62')+spark(8,10)+dot(58,60));
  add("fountain",["fonte","chafariz"],P(GR,'M6 44H58L52 56H12Z')+P(SK,'M10 44Q32 36 54 44Z')+L('M32 44V24')+P(GR,'M22 24H42Q40 30 32 30Q24 30 22 24Z')+L('M32 24Q26 12 18 18M32 24Q38 12 46 18M32 24V8')+spark(52,12)+dot(8,14));
  add("brick",["tijolo"],R(RD,6,16,52,16,1)+R(RD,6,34,24,16,1)+R(RD,32,34,26,16,1)+L('M20 16V32M42 16V32M18 34V50')+spark(54,8)+dot(8,56));
  add("raven",["corvo"],P(DG,'M8 32Q10 16 30 14Q46 14 52 24L60 26L52 30Q48 44 34 46L36 56M26 46L24 56M8 32Q14 36 22 34')+ik(44,22)+P(BU,'M52 24L62 28L52 30Z')+spark(12,10)+dot(56,52));
  add("ram",["carneiro"],C(WH,22,22,7)+C(WH,34,20,8)+C(WH,44,26,7)+C(WH,40,36,8)+C(WH,26,34,8)+E(PE,16,40,8,10)+P(GR,'M12 26Q6 20 12 16Q18 14 18 22')+ik(14,36)+L('M24 46V58M40 46V58')+spark(54,10)+dot(54,52));
  add("crown",["coroa"],P(BU,'M8 46L12 20L24 32L32 14L40 32L52 20L56 46Z')+R(BU,8,46,48,8,2)+C(RD,12,18,3)+C(SK,32,12,3)+C(RD,52,18,3)+C(RD,32,50,2)+spark(56,8)+dot(6,10));
  add("drop",["gota"],P(SK,'M32 6C42 22 50 30 50 40C50 50 42 58 32 58C22 58 14 50 14 40C14 30 22 22 32 6Z')+L('M22 42Q22 50 30 52')+spark(54,16)+dot(10,16));
  add("steamship",["navio a vapor","vapor"],P(RD,'M6 38H58L50 54H14Z')+R(WH,18,26,28,12,1)+R(DG,26,10,8,16,1)+R(RD,26,10,8,4,0)+R(DG,38,16,6,10,1)+R(SK,22,30,5,5,1)+R(SK,32,30,5,5,1)+R(SK,42,30,5,5,1)+L('M30 10Q26 6 30 2M4 58Q16 54 28 58Q40 54 52 58')+spark(54,10)+dot(6,16));
  add("cabin",["cabine","camarote"],R(PE,8,10,48,42,2)+R(WD,12,34,26,10,2)+R(PK,12,30,26,8,3)+C(SK,46,22,7)+C('#e9f4fc',46,22,4)+L('M8 52H56')+spark(52,40)+dot(6,60));
  add("midnight",["meia-noite"],C(WH,32,32,24)+L('M32 14V32M32 32V14','stroke-width="2.4"')+L('M32 10V13M32 51V54M10 32H13M51 32H54')+C(BU,52,10,5)+spark(10,10)+dot(56,56));
  add("beanie",["gorro","touca"],P(RD,'M10 42Q8 14 32 12Q56 14 54 42Z')+R(WH,8,40,48,10,4)+L('M18 42V50M26 42V50M34 42V50M42 42V50M50 42V50')+C(WH,32,8,5)+spark(54,10)+dot(6,12));
})();
