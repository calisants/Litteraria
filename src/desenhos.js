/* ===== Desenhos das palavras concretas (SVG originais, feitos por Claude) =====
   Objetos e animais genéricos, em traço simples; nenhum personagem nem ilustração de livro.
   Cores vêm das variáveis do tema (--ink, --surface, --g1..--g5), então combinam com cada estilo, claro ou escuro.
   Só inglês por enquanto (palavras concretas dos temas de «Alice»): DRAW[idioma][palavra] = conteúdo do SVG (64x64). */
const DRAW=(function(){
  const F=n=>'fill="var(--g'+n+')"',S='fill="var(--surface)"',K='fill="var(--ink)"',D='fill="#20303a"',W='fill="#b8895a"';
  const house='<rect x="14" y="28" width="36" height="26" '+F(1)+'/><polygon points="9,30 32,9 55,30" '+F(4)+'/><rect x="28" y="38" width="9" height="16" '+F(3)+'/><rect x="18" y="34" width="7" height="7" '+S+'/><rect x="40" y="34" width="7" height="7" '+S+'/>';
  const note='<ellipse cx="20" cy="48" rx="7" ry="5" '+K+'/><ellipse cx="44" cy="42" rx="7" ry="5" '+K+'/><path d="M26 48V17M50 42V13"/><polygon points="26,17 50,13 50,21 26,25" '+K+'/>';
  const thick=(d,w,fill)=>'<path d="'+d+'" fill="none" stroke="var(--ink)" stroke-width="'+(w+4)+'"/><path d="'+d+'" fill="none" stroke="'+fill+'" stroke-width="'+w+'"/>';
  const en={
    house:house,home:house,
    tea:'<path d="M12 24H46V36A17 17 0 0 1 29 53A17 17 0 0 1 12 36Z" '+S+'/><path d="M46 28H49A6 6 0 0 1 49 40H45" fill="none"/><ellipse cx="29" cy="56" rx="22" ry="4" '+F(3)+'/><path d="M12 30H46" '+F(1)+'/><path d="M22 18Q19 14 22 10M32 18Q29 14 32 10" fill="none"/>',
    box:'<rect x="12" y="26" width="40" height="28" '+F(1)+'/><rect x="9" y="17" width="46" height="10" '+F(4)+'/><rect x="28" y="17" width="8" height="37" '+F(3)+'/>',
    pocket:'<path d="M12 12H52V38Q52 52 32 58Q12 52 12 38Z" '+F(3)+'/><path d="M18 20H46" stroke-dasharray="3 3" fill="none"/><path d="M20 28Q32 34 44 28" fill="none"/>',
    fan:'<path d="M32 54L8 24A30 30 0 0 1 56 24Z" '+F(4)+'/><path d="M32 54L20 15M32 54V13M32 54L44 15" fill="none"/><rect x="28" y="52" width="8" height="8" rx="2" '+F(1)+'/>',
    tail:'<ellipse cx="18" cy="44" rx="14" ry="12" '+F(1)+'/>'+thick("M28 46C46 50 56 38 48 26C44 18 50 12 56 10",5,"var(--g1)")+'<path d="M5 56H33" fill="none"/>',
    pool:'<ellipse cx="32" cy="38" rx="25" ry="14" '+F(3)+'/><ellipse cx="32" cy="38" rx="14" ry="6" fill="none" stroke="var(--surface)"/><path d="M18 28Q22 24 26 28M40 24Q44 20 48 24" fill="none"/>',
    hole:'<rect x="6" y="30" width="52" height="26" '+F(1)+'/><rect x="6" y="24" width="52" height="8" '+F(2)+'/><ellipse cx="32" cy="38" rx="17" ry="8" '+D+'/>',
    frog:'<ellipse cx="32" cy="40" rx="22" ry="14" '+F(2)+'/><circle cx="21" cy="24" r="8" '+F(2)+'/><circle cx="43" cy="24" r="8" '+F(2)+'/><circle cx="21" cy="24" r="3" '+D+'/><circle cx="43" cy="24" r="3" '+D+'/><path d="M18 42Q32 52 46 42" fill="none"/>',
    crab:'<path d="M18 30L10 20M46 30L54 20M16 38L6 42M16 44L8 52M48 38L58 42M48 44L56 52" fill="none"/><ellipse cx="32" cy="38" rx="17" ry="12" '+F(4)+'/><circle cx="10" cy="17" r="7" '+F(4)+'/><circle cx="54" cy="17" r="7" '+F(4)+'/><path d="M27 28V22M37 28V22" fill="none"/><circle cx="27" cy="21" r="2.5" '+D+'/><circle cx="37" cy="21" r="2.5" '+D+'/>',
    candle:'<rect x="24" y="28" width="16" height="26" '+S+'/><rect x="16" y="54" width="32" height="5" rx="2" '+F(3)+'/><path d="M32 28V23" fill="none"/><path d="M32 7C39 15 40 22 32 25C24 22 25 15 32 7Z" '+F(1)+'/>',
    pie:'<ellipse cx="32" cy="52" rx="26" ry="6" '+F(3)+'/><path d="M8 36V44A24 10 0 0 0 56 44V36Z" '+F(1)+'/><ellipse cx="32" cy="36" rx="24" ry="10" '+F(1)+'/><path d="M18 32L34 40M28 28L44 36M46 32L30 40M36 28L20 36" fill="none"/>',
    pencil:'<g transform="rotate(40 32 32)"><rect x="26" y="8" width="12" height="38" '+F(1)+'/><polygon points="26,46 38,46 32,58" '+S+'/><polygon points="30,54 34,54 32,58" '+D+'/><rect x="26" y="3" width="12" height="7" '+F(4)+'/><path d="M26 13H38" fill="none"/></g>',
    rose:'<path d="M32 38V60" fill="none"/><path d="M32 52Q20 52 17 42Q29 42 32 52Z" '+F(2)+'/><path d="M32 48Q44 48 47 38Q35 38 32 48Z" '+F(2)+'/><circle cx="32" cy="24" r="15" '+F(4)+'/><path d="M32 24m-7 0a7 7 0 1 1 7 7M32 24m-2 0a2 2 0 1 1 2 2" fill="none"/>',
    crown:'<path d="M10 46L7 18L22 30L32 12L42 30L57 18L54 46Z" '+F(1)+'/><rect x="10" y="46" width="44" height="8" '+F(4)+'/><circle cx="7" cy="17" r="3" '+F(4)+'/><circle cx="32" cy="11" r="3" '+F(4)+'/><circle cx="57" cy="17" r="3" '+F(4)+'/>',
    star:'<polygon points="32,8 37.9,25.9 54.8,26.6 41.5,37.1 46.1,53.4 32,44 17.9,53.4 22.5,37.1 9.2,26.6 26.1,25.9" '+F(1)+'/>',
    boot:'<path d="M20 8H38V32L52 38Q58 41 58 48V54H20Z" '+F(4)+'/><rect x="20" y="8" width="18" height="7" '+F(3)+'/><rect x="18" y="54" width="42" height="6" '+D+'/>',
    fire:'<path d="M32 5C40 18 52 26 50 40C48 54 36 58 32 58C28 58 16 54 14 40C13 30 22 24 26 14C28 20 30 14 32 5Z" '+F(4)+'/><path d="M32 30C38 38 42 42 40 48C38 54 34 54 32 54C30 54 26 54 24 48C24 42 30 38 32 30Z" '+F(1)+'/>',
    smoke:'<circle cx="24" cy="46" r="10" '+F(3)+'/><circle cx="39" cy="40" r="12" '+F(3)+'/><circle cx="29" cy="25" r="10" '+F(3)+'/><circle cx="44" cy="20" r="8" '+F(3)+'/>',
    branch:thick("M8 52Q30 42 56 18",6,"#b8895a")+thick("M28 44Q32 32 26 22",4,"#b8895a")+thick("M42 31Q50 33 54 40",4,"#b8895a")+'<ellipse cx="25" cy="17" rx="5" ry="9" '+F(2)+'/><ellipse cx="53" cy="43" rx="7" ry="4.5" '+F(2)+'/><ellipse cx="53" cy="12" rx="6" ry="4" transform="rotate(-30 53 12)" '+F(2)+'/>',
    paper:'<path d="M14 6H40L52 18V58H14Z" '+S+'/><path d="M40 6V18H52" fill="none"/><path d="M21 28H45M21 36H45M21 44H35" fill="none"/>',
    letter:'<rect x="7" y="14" width="50" height="36" '+F(1)+'/><path d="M7 14L32 36L57 14" fill="none"/><circle cx="32" cy="36" r="4.5" '+F(4)+'/>',
    stair:'<polygon points="6,58 6,46 20,46 20,34 34,34 34,22 48,22 48,10 58,10 58,58" '+F(3)+'/>',
    dish:'<ellipse cx="32" cy="36" rx="27" ry="14" '+S+'/><ellipse cx="32" cy="36" rx="18" ry="8" '+F(1)+'/><ellipse cx="32" cy="36" rx="11" ry="4.5" '+S+'/>',
    song:note,music:note,
    tear:'<path d="M32 6C32 6 15 28 15 40A17 17 0 0 0 49 40C49 28 32 6 32 6Z" '+F(3)+'/><path d="M23 41A9 9 0 0 0 30 50" fill="none" stroke="var(--surface)"/>',
    picture:'<rect x="7" y="9" width="50" height="46" '+F(1)+'/><rect x="15" y="17" width="34" height="30" '+F(3)+'/><polygon points="15,47 27,30 35,40 41,33 49,47" '+F(2)+'/><circle cx="41" cy="25" r="4" '+F(1)+'/>',
    poison:'<rect x="27" y="14" width="10" height="14" '+S+'/><rect x="26" y="7" width="12" height="8" '+W+'/><path d="M27 26H37L46 36V54Q46 59 41 59H23Q18 59 18 54V36Z" '+F(2)+'/><rect x="22" y="39" width="20" height="13" '+S+'/><path d="M28 42L36 50M36 42L28 50" fill="none"/>',
    crumb:'<polygon points="12,44 19,38 27,43 25,51 15,52" '+F(1)+'/><polygon points="34,26 42,21 49,27 46,34 37,34" '+F(1)+'/><polygon points="31,50 38,46 44,51 40,57 33,56" '+F(1)+'/><polygon points="20,22 24,19 28,22 26,26 21,26" '+F(1)+'/>',
    stick:thick("M10 54L54 10",6,"#b8895a")+thick("M30 34L42 42",3.5,"#b8895a"),
    sign:'<rect x="29" y="8" width="7" height="52" '+W+'/><polygon points="10,14 46,14 55,23 46,32 10,32" '+F(1)+'/><polygon points="54,36 20,36 10,43.5 20,51 54,51" '+F(3)+'/>',
    list:'<rect x="12" y="8" width="40" height="50" '+S+'/><rect x="23" y="3" width="18" height="9" rx="2" '+F(3)+'/><rect x="18" y="20" width="6" height="6" fill="none"/><rect x="18" y="31" width="6" height="6" fill="none"/><rect x="18" y="42" width="6" height="6" fill="none"/><path d="M19 23L21 25L26 19M30 24H46M30 35H46M30 46H40" fill="none"/>',
    world:'<circle cx="32" cy="32" r="24" '+F(3)+'/><polygon points="17,22 28,16 36,24 28,34 18,32" '+F(2)+'/><polygon points="38,36 50,32 49,46 40,50" '+F(2)+'/><ellipse cx="32" cy="32" rx="10" ry="24" fill="none" stroke-width="1.4"/>'
  };
  return {en:en};
})();
/* Monta o <svg>; o texto alternativo é a tradução em português */
function drawSvg(lang,w,alt){
  const d=DRAW[lang]&&DRAW[lang][String(w).toLowerCase()];
  return d?'<svg class="wdraw-svg" viewBox="0 0 64 64" role="img" aria-label="Desenho: '+esc(alt||w)+'"><g stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none">'+d+"</g></svg>":"";
}
