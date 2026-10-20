/* ===== Núcleo: estado, tema, sons, navegação ===== */
const APP_VERSION="v6"; /* mesma versão do CACHE no sw.js */
const KEY="mots-parole-"+APP_VERSION;
const $=(s,r)=>(r||document).querySelector(s);
const $$=(s,r)=>Array.from((r||document).querySelectorAll(s));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const plural=(n,a,b)=>n+" "+(n===1?a:b);
/* destaque de palavra: o que vem entre « » vira negrito de verdade, sem os sinais em volta (esc() antes, então é seguro) */
const hl=s=>esc(s).replace(/«([^»]*)»/g,"<b>$1</b>");
function setStatus(id,msg,kind){const n=$(id);n.innerHTML=hl(msg);n.className="status"+(kind?" "+kind:"");}

const LNAME={fr:"Francês",it:"Italiano",en:"Inglês"};
const SPEECH={fr:"fr-FR",it:"it-IT",en:"en-GB"};
const CATLABEL=Object.fromEntries(CATS.map(c=>[c[0],c[1]]));
const GROUPLABEL=Object.fromEntries(GROUPS);
const ALL8=[[0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[1,-1],[-1,1]];
const CFG={
  cross:{easy:{n:6,span:7,max:7,given:.35,article:true,tries:600},classic:{n:9,span:9,max:8,given:0,article:true,tries:800},adv:{n:12,span:11,max:10,given:0,article:false,tries:800}},
  search:{easy:{size:9,n:7,dirs:[[0,1],[1,0]],showTr:true,maxLen:9},classic:{size:11,n:11,dirs:[[0,1],[1,0],[1,1],[-1,1]],showTr:true,maxLen:9},adv:{size:13,n:15,dirs:ALL8,showTr:false,maxLen:11}},
  connect:{easy:{groups:3,showTr:false},classic:{groups:4,showTr:false},adv:{groups:5,showTr:false}}
};
const PALS={
  auto:{name:"Automática: azul no francês, verde no italiano, vinho no inglês",bg:"linear-gradient(135deg,#1f3d7a 33%,#1b5e43 33% 66%,#8a2a45 66%)"},
  ocean:{name:"Oceano",l:"#0f5c73",d:"#6cc4dc"},
  forest:{name:"Floresta",l:"#2d6a3e",d:"#7fd09a"},
  wine:{name:"Vinho",l:"#8a2a45",d:"#e58aa5"},
  slate:{name:"Grafite",l:"#3b4658",d:"#b5c0d4"},
  lav:{name:"Lavanda",l:"#5b4b9a",d:"#b6a8f0"},
  amber:{name:"Âmbar",l:"#8a5a12",d:"#e6b45a"},
  custom:{name:"Personalizada: escolha sua cor abaixo",bg:"conic-gradient(#e0413a,#e8b933,#4fbf6b,#35a7d9,#6b5bd6,#d9489a,#e0413a)"}
};
Object.keys(PALS).forEach(k=>{if(PALS[k].l)PALS[k].bg=PALS[k].l;});
const AUTO_ACC={fr:["#1f3d7a","#8fa9e8"],it:["#1b5e43","#6fcf9f"],en:["#8a2a45","#e58aa5"]};

/* ----- preferências e páginas concluídas (nada de progresso parcial) ----- */
/* ----- estilos visuais: cada estilo tem variações de cor. Esquema: [nome, escuro?, fundo, cartão, cartão2, linha, borda, texto, texto2, destaque, ok, erro] ----- */
const STYLES={
  fofo:{name:"Fofo",desc:"Pastel, cantos bem redondos",schemes:[
    ["Rosa bebê",0,"#fff1f5","#ffffff","#ffe0ea","#f3c6d5","#b5658a","#4a2535","#7a4a5e","#c2457a","#1f7a55","#c0392b"],
    ["Azul céu",0,"#eef6ff","#ffffff","#dcebff","#bcd6f5","#5f86b4","#1f3350","#4a6283","#3b6fc4","#1f7a55","#c0392b"],
    ["Lavanda e champagne",0,"#f6f1fa","#ffffff","#e8dff2","#d6c8e6","#7f6c99","#2f2640","#5b4f70","#76489f","#2d6a4a","#a8362b"]]},
  soft:{name:"Soft elegante",desc:"Bege, dourado e salmão, linhas finas",schemes:[
    ["Branco, bege, dourado",0,"#faf6ef","#fffdf9","#efe6d6","#e0d3bb","#9a8250","#2e2a22","#62594a","#7d5f16","#2d6a4a","#a8362b"],
    ["Nude e salmão",0,"#fbf1ec","#ffffff","#f3dccf","#e6c7b8","#a56a5c","#3b2620","#6d4a40","#b04a38","#2d6a4a","#a8362b"]]},
  pp:{name:"Céu estrelado",desc:"Inspirado em O Pequeno Príncipe: estrelas, trigo e um planetinha",schemes:[
    ["Noite de estrelas",1,"#101b3a","#18264d","#22336a","#34457e","#c9a94f","#f8f1d6","#cfc8aa","#f2c94c","#7fdca8","#ff9a8f"],
    ["Trigo dourado",0,"#fbf2d3","#fffaea","#f1e2b3","#e0cc8b","#8a6d1d","#23305a","#4d4a3a","#2c4a9a","#2d6a4a","#a8362b"]]},
  alice:{name:"País das Maravilhas",desc:"Inspirado em Alice: cartas, chá e relógio de bolso",schemes:[
    ["Chá das cinco",0,"#eaf6f7","#ffffff","#d3ecee","#a9d3d8","#2f7480","#12333a","#3f5a60","#b4204f","#1f7a55","#c0392b"],
    ["Jardim da Rainha",1,"#10242a","#18343c","#224650","#336068","#6fb7c0","#eef8f6","#b8d3d3","#ff7fa3","#7fdca8","#ff9a8f"]]},
  pinocchio:{name:"Oficina de Pinóquio",desc:"Inspirado em Pinóquio: madeira, estrelas e cerejas",schemes:[
    ["Madeira e cerejas",0,"#f7ecd6","#fffaf0","#ecd9b4","#d9bf90","#8a5a2b","#3a2412","#5e4630","#a8321e","#2d6a4a","#a8362b"],
    ["Oficina à noite",1,"#24160d","#33200f","#47301a","#5e4426","#d6a35c","#fbeed8","#d9c3a0","#f2b24c","#7fdca8","#ff9a8f"]]},
  verne:{name:"Volta ao Mundo",desc:"Inspirado em Verne: mapa, bússola e rota de viagem",schemes:[
    ["Mapa antigo",0,"#f4e9cf","#fffaf0","#e9d9b2","#d4be8a","#7a5c1e","#1d2b36","#4a4a3c","#0b5a7a","#2d6a4a","#a8362b"],
    ["Travessia noturna",1,"#0b1d2c","#12293c","#1b3a53","#2d5170","#d9b04a","#f3ecd8","#b9c4cc","#e8bf55","#7fdca8","#ff9a8f"]]},
  peter:{name:"Horta do Peter",desc:"Inspirado em Peter Rabbit: horta, cenouras e cerca de madeira",schemes:[
    ["Horta ao amanhecer",0,"#eef6e8","#ffffff","#dcebd2","#bcd6ad","#5d8a4a","#1f2f1a","#475c40","#a8480d","#1f7a45","#b3261e"],
    ["Horta ao luar",1,"#13221a","#1b3024","#26422f","#385a43","#8fcf8a","#eef7ea","#bcd3b8","#f2a65a","#7fdca8","#ff9a8f"]]},
  wind:{name:"Beira do Rio",desc:"Inspirado em O Vento nos Salgueiros: rio, juncos e folhas de salgueiro",schemes:[["Rio de manhã",0,"#e9f4f1","#ffffff","#d3e8e2","#a9cfc6","#2f7f94","#16302b","#41594f","#8a4b0a","#1f7a45","#b3261e"],["Rio ao entardecer",1,"#10232a","#183039","#223f4a","#34596a","#7fc3d6","#e8f4f2","#b4cfcb","#f0b865","#7fdca8","#ff9a8f"]]},
sherlock:{name:"Rua de Baker Street",desc:"Inspirado em Sherlock Holmes: névoa, lupa e paralelepípedos",schemes:[["Neblina de Londres",0,"#f1ede4","#ffffff","#e4ddcc","#c8bda3","#4d5a73","#26221a","#565044","#7a4a00","#1f7a45","#b3261e"],["Lampião à noite",1,"#1a1c24","#232632","#2e3242","#444a60","#b9c4d6","#f0ece0","#c0bcae","#e6c36a","#7fdca8","#ff9a8f"]]},
frank:{name:"Noite de Tempestade",desc:"Inspirado em Frankenstein: relâmpago, lua e torres góticas",schemes:[["Céu cinzento",0,"#eceef3","#ffffff","#dde1ea","#b9c0d0","#3e5278","#1d2230","#4a5163","#7a4f00","#1f7a45","#b3261e"],["Tempestade",1,"#12141d","#1b1f2c","#262b3b","#3a4259","#8fa6c9","#e9ecf5","#b7bdd0","#f4e07a","#7fdca8","#ff9a8f"]]},
musq:{name:"Capa e Espada",desc:"Inspirado em Os Três Mosqueteiros: espadas cruzadas, flor-de-lis e pluma",schemes:[["Guarda real",0,"#eef0f7","#ffffff","#dde2f0","#b4bedb","#2d4a8a","#1c2036","#444b66","#7a4f00","#1f7a45","#b3261e"],["Noite em Paris",1,"#10162b","#182040","#222c56","#35437a","#9db8e8","#eef1fa","#bcc4dd","#e3c26a","#7fdca8","#ff9a8f"]]},
principe:{name:"Torres de Florença",desc:"Inspirado em O Príncipe: torres, coroa e louro",schemes:[["Pedra e louro",0,"#f3ede0","#ffffff","#e7dcc4","#cdbd98","#8a2a2a","#2a2118","#574c3c","#7a4f00","#1f7a45","#a31f1f"],["Corte à luz de vela",1,"#201714","#2c211c","#3a2c25","#55433a","#d98a8a","#f6ece0","#cdbcae","#e0b95a","#7fdca8","#ff9a8f"]]},
dante:{name:"Círculos do Paraíso",desc:"Inspirado em A Divina Comédia: círculos, estrelas e chamas",schemes:[["Céu claro",0,"#f1eefa","#ffffff","#e2ddf3","#bdb4e0","#3a4a8a","#201c33","#4a4660","#8a3b12","#1f7a45","#b3261e"],["Noite estrelada",1,"#0f1226","#171b38","#212649","#343b6e","#a9b8e8","#eef0fb","#bfc4de","#f0d58a","#7fdca8","#ff9a8f"]]},
perrault:{name:"Salão das Fadas",desc:"Inspirado nos Contos de Perrault: castelo, carruagem de abóbora, sapatinho e estrelas",schemes:[["Salão ao amanhecer",0,"#fbeef3","#ffffff","#f5dde8","#e0b3c8","#8a2f5c","#2a1a26","#5c4455","#7a4f00","#1f7a45","#b3261e"],["Baile à meia-noite",1,"#1a1026","#261836","#33204a","#4c3270","#e9a3c1","#f6eef8","#cdb9d6","#f2d27a","#7fdca8","#ff9a8f"]]},
grimm:{name:"Floresta Encantada",desc:"Inspirado nos Contos dos Irmãos Grimm: floresta, trilha de migalhas, cogumelos e coruja",schemes:[["Clareira",0,"#eef5e8","#ffffff","#dbe9d2","#b5cfa8","#3f6a2f","#1c2a18","#44563e","#8a4b0a","#1f7a45","#b3261e"],["Floresta à noite",1,"#0d1b14","#14271d","#1e3a2b","#2f5642","#9fd68a","#eaf5e6","#b6cdb0","#f2c06a","#7fdca8","#ff9a8f"]]},
racconti:{name:"Contos à Luz de Vela",desc:"Inspirado em I racconti delle fate: colinas toscanas, torre, livro aberto e vela",schemes:[["Colinas ao pôr do sol",0,"#fbefe0","#ffffff","#f3dcc0","#dcb98e","#9a4a1e","#2b1c10","#5a4430","#7a4f00","#1f7a45","#b3261e"],["Luz de vela",1,"#1e120a","#2a1a0f","#3a2515","#573820","#f0b060","#f8eee0","#d5c0a6","#f2c864","#7fdca8","#ff9a8f"]]},
};
const S={lang:"fr",layout:"classic",mode:"auto",pal:"auto",style:"padrao",scheme:0,custom:"#7a3b8f",player:"",motto:"",avatar:"book",plays:{},sk:{},sound:"on",snd:"mid",hap:"on",trem:"on",kb:false,vol:1,fTheme:"all",fLevel:"all",fGame:"all",done:{},rv:{},rvv:{},typed:false,goal:20,day:{d:"",n:0},zoom:false,bk:0,bks:0,since:0,fav:[],cap:{},trad:"lit",qrv:{},cad:[],rd:{fs:0,bg:"pad",lh:0}};
try{S.kb=!!(window.matchMedia&&matchMedia("(pointer:coarse)").matches);}catch(_){}
(function load(){
  let sv=null;
  try{sv=JSON.parse(localStorage.getItem(KEY)||"null");}catch(_){}
  let old=false;
  if(!sv){old=true;["v5","v4","v3"].forEach(v=>{if(!sv){try{sv=JSON.parse(localStorage.getItem("mots-parole-"+v)||"null");}catch(_){}}});}
  if(!sv)return;
  if(LNAME[sv.lang])S.lang=sv.lang;
  if(["classic","soft","sharp"].indexOf(sv.layout)>=0)S.layout=sv.layout;
  if(["auto","light","dark"].indexOf(sv.mode)>=0)S.mode=sv.mode;
  if(PALS[sv.pal])S.pal=sv.pal;
  if(sv.style==="padrao"||(typeof sv.style==="string"&&Object.prototype.hasOwnProperty.call(STYLES,sv.style)))S.style=sv.style;
  if(Number.isInteger(sv.scheme)&&sv.scheme>=0&&sv.scheme<6)S.scheme=sv.scheme;
  if(typeof sv.custom==="string"&&/^#[0-9a-f]{6}$/i.test(sv.custom))S.custom=sv.custom;
  if(typeof sv.player==="string")S.player=sv.player.slice(0,24);else if(typeof sv.dev==="string")S.player=sv.dev.slice(0,24);
  if(typeof sv.motto==="string")S.motto=sv.motto.slice(0,60);
  if(typeof sv.avatar==="string"&&/^[a-z]+$/.test(sv.avatar))S.avatar=sv.avatar;
  if(sv.plays&&typeof sv.plays==="object")Object.keys(sv.plays).forEach(l=>{if(LNAME[l]&&sv.plays[l]&&typeof sv.plays[l]==="object"){S.plays[l]={};Object.keys(sv.plays[l]).forEach(t=>{const n=+sv.plays[l][t];if(/^[a-z]+$/.test(t)&&n>0)S.plays[l][t]=Math.min(n,1e6);});}});
  if(sv.sk&&typeof sv.sk==="object")Object.keys(sv.sk).forEach(l=>{if(LNAME[l]&&sv.sk[l]&&typeof sv.sk[l]==="object"){S.sk[l]={};Object.keys(sv.sk[l]).forEach(k=>{const a=sv.sk[l][k];if(Array.isArray(a)&&a.length>=2)S.sk[l][k]=[Math.max(0,+a[0]||0),Math.max(0,+a[1]||0),String(a[2]||"").slice(0,120)];});}});
  if(sv.rv&&typeof sv.rv==="object")Object.keys(sv.rv).forEach(k=>{const a=sv.rv[k];if(/^(fr|it|en):[a-z]+\|\d+\|\d+$/.test(k)&&Array.isArray(a)&&+a[0]>0)S.rv[k]=[+a[0],Math.min(4,Math.max(0,+a[1]||0)),Math.min(99,Math.max(0,+a[2]||0))];});
  if(sv.rvv&&typeof sv.rvv==="object")Object.keys(sv.rvv).slice(0,400).forEach(k=>{const a=sv.rvv[k];if(/^(fr|it|en):v\|[^|]{1,40}$/.test(k)&&Array.isArray(a)&&+a[0]>0)S.rvv[k]=[+a[0],Math.min(4,Math.max(0,+a[1]||0)),Math.min(99,Math.max(0,+a[2]||0))];});
  if(sv.goal===10||sv.goal===20||sv.goal===40)S.goal=sv.goal;
  if(sv.day&&typeof sv.day==="object"&&/^\d{4}-\d\d-\d\d$/.test(sv.day.d)&&+sv.day.n>=0)S.day={d:sv.day.d,n:Math.min(+sv.day.n,100000)};
  if(typeof sv.typed==="boolean")S.typed=sv.typed;
  if(typeof sv.zoom==="boolean")S.zoom=sv.zoom;
  if(Array.isArray(sv.fav))S.fav=sv.fav.filter((k,i,a)=>typeof k==="string"&&/^[a-z]+:\d{1,2}$/.test(k)&&a.indexOf(k)===i).slice(0,300);
  ["bk","bks","since"].forEach(k=>{const n=+sv[k];if(n>0&&n<4e12)S[k]=n;});
  if(sv.sound==="on"||sv.sound==="off")S.sound=sv.sound;
  if(sv.snd==="low"||sv.snd==="mid"||sv.snd==="high")S.snd=sv.snd;
  if(sv.hap==="on"||sv.hap==="off")S.hap=sv.hap;
  if(sv.trem==="on"||sv.trem==="off")S.trem=sv.trem;
  if(typeof sv.kb==="boolean")S.kb=sv.kb;
  if(sv.vol===1||sv.vol===2||sv.vol===3||sv.vol===4||sv.vol===5)S.vol=sv.vol;
  if(sv.fTheme==="all"||CATS.some(c=>c[0]===sv.fTheme)||BOOKTHEMES.some(c=>c[0]===sv.fTheme))S.fTheme=sv.fTheme;
  if(sv.fLevel==="all"||LVN[sv.fLevel])S.fLevel=sv.fLevel;
  if(typeof sv.fGame==="string"&&/^[a-z]+$/.test(sv.fGame))S.fGame=sv.fGame;
  if(sv.trad==="nat"||sv.trad==="lit")S.trad=sv.trad;
  if(sv.rd&&typeof sv.rd==="object"){S.rd={fs:[0,1,2,3].indexOf(+sv.rd.fs)>=0?+sv.rd.fs:0,bg:["pad","sepia","escuro"].indexOf(sv.rd.bg)>=0?sv.rd.bg:"pad",lh:+sv.rd.lh===1?1:0};}
  if(Array.isArray(sv.cad))sv.cad.slice(0,300).forEach(c=>{if(c&&/^(fr|it|en)$/.test(c.l)&&typeof c.w==="string"&&c.w.length>0&&c.w.length<40&&typeof c.pt==="string"&&c.pt.length<120&&!S.cad.some(x=>x.l===c.l&&x.w===c.w))S.cad.push({l:c.l,w:c.w,pt:c.pt,b:typeof c.b==="string"?c.b.slice(0,20):"",d:+c.d>0?+c.d:Date.now(),s:Math.min(4,Math.max(0,+c.s||0))});});
  if(sv.qrv&&typeof sv.qrv==="object")Object.keys(sv.qrv).slice(0,200).forEach(k=>{const a=sv.qrv[k];if(/^[a-z]+:\d{1,2}$/.test(k)&&Array.isArray(a)&&+a[0]>0)S.qrv[k]=[+a[0],Math.min(4,Math.max(0,+a[1]||0))];});
  if(sv.cap&&typeof sv.cap==="object")Object.keys(sv.cap).forEach(k=>{if(/^[a-z]+-\d{1,3}$/.test(k))S.cap[k]=1;});
  /* as marcas de concluído das versões antigas não são trazidas: os ids das páginas mudaram */
  if(!old&&sv.done&&typeof sv.done==="object")Object.keys(sv.done).forEach(k=>{if(/^(fr|it|en):[a-z0-9-]+$/.test(k))S.done[k]=1;});
})();
function save(){
  if(!S.since)S.since=Date.now();
  try{localStorage.setItem(KEY,JSON.stringify(S));return true;}
  catch(_){if(typeof saveFail==="function")saveFail();return false;}
}

/* ----- tema e cores ----- */
const mq=window.matchMedia?matchMedia("(prefers-color-scheme: dark)"):null;
function isDark(){
  if(S.mode==="dark")return true;
  if(S.mode==="light")return false;
  const t=document.documentElement.dataset.theme;
  if(t==="dark")return true;
  if(t==="light")return false;
  return !!(mq&&mq.matches);
}
function hexRgb(h){const n=parseInt(h.slice(1),16);return [(n>>16)&255,(n>>8)&255,n&255];}
function lum(h){const c=hexRgb(h).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);});return .2126*c[0]+.7152*c[1]+.0722*c[2];}
function toHsl(h){
  const a=hexRgb(h).map(v=>v/255),r=a[0],g=a[1],b=a[2],mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;
  let hh=0,s=0;
  if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);hh=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;hh*=60;}
  return [hh,s,l];
}
function fromHsl(h,s,l){
  const a=s*Math.min(l,1-l);
  const f=n=>{const k=(n+h/30)%12;const c=l-a*Math.max(-1,Math.min(k-3,9-k,1));return Math.round(255*c).toString(16).padStart(2,"0");};
  return "#"+f(0)+f(8)+f(4);
}

function schemeList(id){return STYLES[id].schemes;}
function curScheme(){
  if(S.style==="padrao")return null;
  const l=schemeList(S.style);return l[Math.min(S.scheme,l.length-1)];
}
const SCH_VARS=["--bg0","--surface0","--surface20","--line0","--grid0","--ink","--muted","--accent","--ok","--bad"];
function applyTheme(){
  const root=document.documentElement,sc=curScheme();
  root.setAttribute("data-layout",S.layout);
  root.setAttribute("data-style",S.style);
  if(sc){
    root.setAttribute("data-appmode",sc[1]?"dark":"light");
    [2,3,4,5,6,7,8,9,10,11].forEach((n,i)=>root.style.setProperty(SCH_VARS[i],sc[n]));
    root.style.setProperty("--on-accent",lum(sc[9])<.19?"#ffffff":"#0d1117");
    return;
  }
  SCH_VARS.forEach(v=>root.style.removeProperty(v));
  const dark=isDark();
  if(S.mode==="auto")root.removeAttribute("data-appmode");else root.setAttribute("data-appmode",S.mode);
  let acc;
  if(S.pal==="auto")acc=AUTO_ACC[S.lang][dark?1:0];
  else if(S.pal==="custom"){const h=toHsl(S.custom);acc=fromHsl(h[0],Math.min(h[1],.85),dark?Math.max(h[2],.66):Math.min(h[2],.36));}
  else acc=dark?PALS[S.pal].d:PALS[S.pal].l;
  root.style.setProperty("--accent",acc);
  root.style.setProperty("--on-accent",lum(acc)<.19?"#ffffff":"#0d1117");
}
if(mq&&mq.addEventListener)mq.addEventListener("change",applyTheme);
try{new MutationObserver(applyTheme).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});}catch(_){}

/* ----- sons suaves (Web Audio, sem arquivos) ----- */
let AC=null;
const TONES={
  ok:[[523.25,0,.12,"sine"],[659.25,.09,.18,"sine"]],
  done:[[523.25,0,.13,"sine"],[659.25,.1,.13,"sine"],[783.99,.2,.3,"sine"]],
  bad:[[196,0,.16,"triangle"],[155.56,.1,.22,"triangle"]]
};
const VOLG={low:1,mid:2.2,high:3.4};
function wrongFx(){
  if(S.hap==="on"){try{if(navigator.vibrate)navigator.vibrate([40,30,40]);}catch(_){}}
  const mot=!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches);
  if(mot&&S.trem==="on")$$("#s-game .stage:not([hidden]), #s-game .cstage:not([hidden]), #s-game .sstage:not([hidden]), #s-game .ostage:not([hidden])").forEach(el=>{
    el.classList.remove("tremble");void el.offsetWidth;el.classList.add("tremble");
    setTimeout(()=>el.classList.remove("tremble"),500);
  });
}
function sfx(kind){
  if(kind==="bad")wrongFx();
  if(S.sound!=="on")return;
  try{
    const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return;
    AC=AC||new Ctx();if(AC.state==="suspended")AC.resume();
    const t0=AC.currentTime+.01;
    TONES[kind].forEach(n=>{
      const o=AC.createOscillator(),g=AC.createGain(),s=t0+n[1];
      o.type=n[3];o.frequency.value=n[0];
      g.gain.setValueAtTime(.0001,s);
      g.gain.exponentialRampToValueAtTime((kind==="bad"?.07:.05)*(VOLG[S.snd]||2.2),s+.02);
      g.gain.exponentialRampToValueAtTime(.0001,s+n[2]);
      o.connect(g);g.connect(AC.destination);o.start(s);o.stop(s+n[2]+.05);
    });
  }catch(_){}
}
function shake(el){
  if(!el)return;
  el.classList.remove("shake");void el.offsetWidth;el.classList.add("shake");
  setTimeout(()=>el.classList.remove("shake"),450);
}

/* ----- pronúncia ----- */
const SPK='<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9H3z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const speakBtn=t=>'<button class="speak" type="button" data-say="'+esc(t)+'" aria-label="Ouvir '+esc(t)+'">'+SPK+"</button>";
function speak(t){
  try{
    if(!window.speechSynthesis)return;
    const u=new SpeechSynthesisUtterance(t.replace(/ /g," "));u.lang=SPEECH[S.lang];u.rate=.9;
    speechSynthesis.cancel();speechSynthesis.speak(u);
  }catch(_){}
}
if(!("speechSynthesis" in window))$("#app").classList.add("no-speech");
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest(".speak");if(b){e.stopPropagation();speak(b.dataset.say);}},true);

/* ----- folha deslizante ----- */
const sheetOpen=()=>!$("#sheet").hidden;
function openSheet(title,html,foot){
  $("#sheet-title").textContent=title;$("#sheet-in").innerHTML=html;$("#sheet-foot").hidden=!foot;
  /* «Próximo» só aparece quando a página já foi concluída e ainda há lição na trilha; aí ele é o botão principal */
  const nx=!!foot&&typeof canGoNext==="function"&&canGoNext();
  $("#sheet-next").hidden=!nx;$("#sheet-again").classList.toggle("primary",!nx);
  $("#sheet").hidden=false;$("#sheet-close").focus();
}
function closeSheet(){$("#sheet").hidden=true;}
const wordRow=it=>'<div class="srow"><span class="w">'+esc(full(it))+'</span><span class="pt">'+esc(it.pt)+"</span>"+speakBtn(full(it))+"</div>";
function doneSheet(title,items){openSheet(title,items.map(wordRow).join(""),true);}
$("#sheet-close").addEventListener("click",closeSheet);
$("#sheet").addEventListener("click",e=>{if(e.target.id==="sheet")closeSheet();});
$("#sheet-again").addEventListener("click",()=>{closeSheet();newGame();});
$("#sheet-index").addEventListener("click",()=>{closeSheet();go("index");});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&sheetOpen())closeSheet();});

/* ----- grade que se ajusta ao espaço ----- */
let fitFn=null;
/* ampliar: células grandes e a grade rola dentro da área do jogo */
const ZOOM_CELL=46,ZOOM_CELL_CROSS=64;let ZOOM=false;
function followActive(){
  if(!ZOOM)return;
  const st=$("#stage"),a=$("#fit .active");if(!a)return;
  const sr=st.getBoundingClientRect(),ar=a.getBoundingClientRect();
  st.scrollLeft+=ar.left+ar.width/2-(sr.left+sr.width/2);
  st.scrollTop+=ar.top+ar.height/2-(sr.top+sr.height/2);
}
/* nome próprio: p10.js tem outra applyZoom (zoom de pinça do Ajustes) e, no mesmo <script>, a última sobrescrevia esta */
function applyGridZoom(){
  const on=ZOOM&&P&&(P.type==="cross"||P.type==="search"),st=$("#stage");
  st.classList.toggle("zoom",!!on);
  $("#zoom-toggle").textContent=ZOOM?"Reduzir":"Ampliar";
  if(fitFn)fitFn();
  if(!on){st.scrollLeft=0;st.scrollTop=0;}else followActive();
}
$("#zoom-toggle").addEventListener("click",()=>{ZOOM=!ZOOM;applyGridZoom();});
function fitGrid(cols,rows,gap,minC,maxC){
  const st=$("#stage"),f=$("#fit"),w=st.clientWidth,h=st.clientHeight;
  if(!w||!h)return;
  if(st.classList.contains("zoom")){f.style.setProperty("--cell",(P&&P.type==="cross"?ZOOM_CELL_CROSS:ZOOM_CELL)+"px");return;}
  const c=Math.max(minC,Math.min(maxC,Math.floor(Math.min((w-(cols-1)*gap)/cols,(h-(rows-1)*gap)/rows))));
  f.style.setProperty("--cell",c+"px");
}
if(window.ResizeObserver)new ResizeObserver(()=>{if(fitFn)fitFn();}).observe($("#stage"));
window.addEventListener("resize",()=>{if(fitFn)fitFn();});

/* ----- páginas do caderno ----- */
let P=null;
const curVol=()=>VOLUMES.find(v=>v.id===S.vol)||VOLUMES[0];
const pageTitle=p=>curVol().types.find(t=>t[0]===p.type)[2]+" #"+p.n;
const pageMeta=p=>p.meta||"";
const doneKey=p=>S.lang+":"+p.id;
const isDone=p=>!!S.done[doneKey(p)];
function markDone(){
  if(!P)return;
  S.done[doneKey(P)]=1;
  const pl=S.plays[S.lang]||(S.plays[S.lang]={});pl[P.type]=(pl[P.type]||0)+1;
  save();
}
/* acertos e erros por palavra/frase: alimentam "para treinar" e "palavras dominadas" */
function skRec(w,label,ok){
  if(!w)return;
  const L=S.sk[S.lang]||(S.sk[S.lang]={}),k=String(w).toLowerCase().slice(0,100);
  const a=L[k]||(L[k]=[0,0,""]);
  a[ok?0:1]++;if(label)a[2]=String(label).slice(0,120);
  const ks=Object.keys(L);
  if(ks.length>1500)ks.slice(0,ks.length-1500).forEach(x=>delete L[x]);
  save();
}
function seedNow(){seedWith(S.lang+"|"+(P.vid||curVol().id)+"|"+P.id);}

let clearStatsArmed=false;
const SCREENS=["home","lang","vol","index","stats","settings","profile","game","feedback","dict","books","album","reader","news"];
let clearArmed=false;
function go(name){
  SCREENS.forEach(s=>{$("#s-"+s).hidden=s!==name;});
  $$(".scroll").forEach(n=>{n.scrollTop=0;});
  if(name!=="game")fitFn=null;
  if(name==="index")renderIndex();
  if(name==="home"){renderMe();if(typeof renderQod==="function")renderQod();}
  if(name==="books"&&typeof renderBooks==="function")renderBooks();
  if(name==="album"&&typeof renderAlbum==="function")renderAlbum();
  if(name==="vol"){$("#vol-lang").textContent=LNAME[S.lang];if(typeof renderToday==="function")renderToday();if(typeof renderQod==="function")renderQod();}
  if(name==="stats"){syncPrefs();renderStats();}
  if(name==="settings"){bkReset();clearArmed=false;$("#clear-note").textContent="";syncPrefs();}
  if(name==="profile"){clearStatsArmed=false;$("#clear-stats-note").textContent="";syncPrefs();}
}
$$("[data-back]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.back)));
$("#go-games").addEventListener("click",()=>go("vol"));
$("#s-lang").addEventListener("click",e=>{const b=e.target.closest("[data-pick-lang]");if(!b)return;S.lang=b.dataset.pickLang;save();syncPrefs();go("vol");});
$("#s-vol").addEventListener("click",e=>{const b=e.target.closest("[data-pick-vol]");if(!b)return;S.vol=+b.dataset.pickVol;S.fGame="all";save();go("index");});
$("#go-profile").addEventListener("click",()=>go("profile"));
$("#go-stats").addEventListener("click",()=>go("stats"));
$("#go-settings").addEventListener("click",()=>go("settings"));
$("#go-style").addEventListener("click",()=>{go("settings");const g=$("#sec-estilo");if(g&&g.scrollIntoView)g.scrollIntoView();});

function pageShown(p){
  if(!pageInLang(p))return false;
  if(S.vol!==4&&S.fTheme!=="all"&&!(p.themes&&p.themes.indexOf(S.fTheme)>=0))return false;
  if(S.vol===1&&S.fLevel!=="all"&&p.level!==S.fLevel)return false;
  if(S.fGame!=="all"&&p.type!==S.fGame)return false;
  return true;
}
function buildThemeSelect(){
  const sel=$("#f-theme");
  sel.innerHTML='<option value="all">Todos os temas</option>'+GROUPS.filter(g=>CATS.some(c=>c[2]===g[0])).map(g=>'<optgroup label="'+esc(g[1])+'">'+CATS.filter(c=>c[2]===g[0]).map(c=>'<option value="'+c[0]+'">'+esc(c[1])+"</option>").join("")+"</optgroup>").join("")+[["Livros — romances e clássicos",c=>!/^livro-(perrault|grimm|racconti)$/.test(c[0])],["Livros — contos de fadas",c=>/^livro-(perrault|grimm|racconti)$/.test(c[0])]].map(g=>{const l=BOOKTHEMES.filter(g[1]);return l.length?'<optgroup label="'+g[0]+'">'+l.map(c=>'<option value="'+c[0]+'">'+esc(c[1])+"</option>").join("")+"</optgroup>":"";}).join("");
}
function renderIndex(){
  const V=curVol();
  if(S.fGame!=="all"&&!V.types.some(t=>t[0]===S.fGame))S.fGame="all";
  $("#vol-title").textContent=LNAME[S.lang]+" · "+V.title;
  $("#f-game").innerHTML='<option value="all">Todos os tipos de lição</option>'+V.types.map(t=>'<option value="'+t[0]+'">'+esc(t[2])+"</option>").join("");
  $("#f-game").value=S.fGame;
  const num={};V.pages.forEach((p,i)=>{num[p.id]=i+1;});
  $("#f-theme").value=S.fTheme;$("#f-level").value=S.fLevel;
  $("#f-level-w").hidden=S.vol!==1;
  $("#f-theme-w").hidden=S.vol===4;
  $("#filters").classList.toggle("one",S.vol!==1);
  $("#f-theme-w").classList.toggle("one",S.vol!==1);
  let shown=0;
  const html=V.types.map(t=>{
    const pages=V.pages.filter(p=>p.type===t[0]&&pageShown(p));
    if(!pages.length)return "";
    let last=null;
    const rows=pages.map(p=>{
      shown++;
      let sub="";
      if(p.sub&&p.sub!==last&&S.fTheme==="all"){sub='<h3 class="sub">'+esc(p.sub)+"</h3>";}
      last=p.sub;
      return sub+'<button type="button" class="toc-row" data-id="'+p.id+'"><span class="l1"><b>'+pageTitle(p)+'</b><span class="dots"></span>'+(isDone(p)?'<span class="st">Concluído</span>':"")+'<span class="pg">p. '+num[p.id]+'</span></span><small>'+esc(pageMeta(p))+"</small></button>";
    }).join("");
    return '<section class="toc-sec"><h2 class="lab">'+t[1]+'</h2><div class="toc">'+rows+"</div></section>";
  }).join("");
  $("#toc").innerHTML=html||'<p class="empty">Nenhuma página com esses filtros. Troque o tema, o nível ou o jogo.</p>';
  $("#toc-help").textContent=shown+" de "+V.pages.filter(pageInLang).length+" páginas. Cada página é fixa, como num livro impresso. Toque em uma para jogar.";
  syncPrefs();
  renderStats();
}
$("#toc").addEventListener("click",e=>{const b=e.target.closest("[data-id]");if(b)startPage(b.dataset.id);});

function onFilter(e){
  if(e.target.id==="f-theme")S.fTheme=e.target.value;else if(e.target.id==="f-level")S.fLevel=e.target.value;else if(e.target.id==="f-game")S.fGame=e.target.value;else return;
  save();renderIndex();
}
$("#f-theme").addEventListener("change",onFilter);
$("#f-level").addEventListener("change",onFilter);
$("#f-game").addEventListener("change",onFilter);

/* ----- perfil do jogador: logos desenhadas em SVG ----- */
const AVATARS={
  book:'<path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v15H5.5C4.7 19 4 18.3 4 17.5zM20 5.5C20 4.7 19.3 4 18.5 4H13v15h5.5c.8 0 1.5-.7 1.5-1.5z"/>',
  pencil:'<path d="M4 20l1-4L16 5l3 3L8 19zM14 7l3 3"/>',
  globe:'<circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c-3 3-3 13 0 16M12 4c3 3 3 13 0 16"/>',
  key:'<circle cx="8" cy="14" r="3.5"/><path d="M10.5 11.5L19 3M16 6l2.5 2.5M14 8l2 2"/>',
  compass:'<circle cx="12" cy="12" r="8"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  bulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.4.4.5.8.5 1.1v1h6v-1c0-.3.1-.7.5-1.1A6 6 0 0 0 12 3z"/>',
  leaf:'<path d="M5 19C5 10 10 5 19 5c0 9-5 14-14 14zM5 19l8-8"/>',
  moon:'<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>',
  mountain:'<path d="M3 19l6-10 4 6 2-3 6 7z"/>',
  coffee:'<path d="M5 9h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4zM16 10h1.5a2 2 0 0 1 0 4H16M8 4v2M12 4v2"/>',
  heart:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  chat:'<path d="M4 5h16v11H9l-5 4z"/>'
};
function avatarHtml(k,size){
  const st='style="--av:'+size+'px"';
  if(k==="initial"||!AVATARS[k])return '<span class="avatar" '+st+" aria-hidden=\"true\">"+esc((S.player||"?").trim().charAt(0).toUpperCase()||"?")+"</span>";
  return '<span class="avatar" '+st+' aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+AVATARS[k]+"</svg></span>";
}
function renderMe(){
  $("#me-av").outerHTML=avatarHtml(S.avatar,56).replace("<span ",'<span id="me-av" ');
  $("#me-name").textContent=S.player||"Jogador(a)";
  $("#me-motto").textContent=S.motto||"Seu caderno de idiomas";
  $$("#avgrid button").forEach(b=>{b.innerHTML=avatarHtml(b.dataset.av,40);});
}

/* ----- resumo do caderno (tela inicial) ----- */
const GAMENAME={conheca:"Conheça",reco:"Reconheça",completar:"Complete",embaralhar:"Embaralhe",escreva:"Escreva",frases:"Frases",artigos:"Artigos",plural:"Plural",presente:"Presente",passado:"Passado",negacao:"Negação",prep:"Preposições",classes:"Classes",falsos:"Falsos amigos",cross:"Cruzadas",search:"Caça-palavras",connect:"Conecte",odd:"Intruso",sentence:"Conversação",resposta:"Respostas",alfabeto:"Alfabeto",sons:"Pares de sons",fala:"Sons difíceis",tema:"Palavras",ditado:"Ditado",frases:"Frases"};
function vocabSet(){const set=new Set();Object.values(VOCAB[S.lang]).flat().forEach(it=>set.add(it.w.toLowerCase()));return set;}
function renderStats(){
  const L=S.lang,pl=S.plays[L]||{},sk=S.sk[L]||{};
  const pages=VOLUMES.reduce((n,v)=>n+v.pages.filter(pageInLang).length,0);
  const doneN=Object.keys(S.done).filter(k=>k.indexOf(L+":")===0).length;
  const vs=vocabSet(),vocabN=vs.size;
  let mastered=0;Object.keys(sk).forEach(k=>{if(vs.has(k)&&sk[k][0]>=2&&sk[k][0]>sk[k][1])mastered++;});
  const total=Object.values(pl).reduce((a,b)=>a+b,0);
  const all=Object.keys(S.plays).reduce((n,l)=>n+Object.values(S.plays[l]).reduce((a,b)=>a+b,0),0);
  $("#st-line").textContent=doneN+" páginas · "+mastered+" palavras dominadas";
  const main=["cross","search","connect"].map(t=>"<div><b>"+(pl[t]||0)+"</b><small>"+GAMENAME[t]+"</small></div>").join("");
  const more=["odd","sentence","resposta","tema","ditado","sons","frases","conheca","contexto","reco","completar","embaralhar","escreva"].concat(VOLUME4.types.map(t=>t[0])).filter(t=>pl[t]).map(t=>GAMENAME[t]+" "+pl[t]).join(" · ");
  const worst=Object.keys(sk).filter(k=>sk[k][1]>sk[k][0]).sort((a,b)=>(sk[b][1]-sk[b][0])-(sk[a][1]-sk[a][0])).slice(0,6);
  const pct=n=>Math.round(100*n/Math.max(1,pages));
  $("#st-body").innerHTML=
    "<div><h3>Partidas concluídas em "+LNAME[L]+"</h3><div class=\"sgrid\">"+main+"</div>"+
    '<p class="help">'+(more?esc(more)+". ":"")+"Total em "+LNAME[L]+": "+total+(all!==total?" · em todos os idiomas: "+all:"")+".</p></div>"+
    "<div><h3>Páginas do caderno</h3><div class=\"bar2\"><i style=\"width:"+pct(doneN)+"%\"></i></div><p class=\"help\">"+doneN+" de "+pages+" páginas concluídas em "+LNAME[L]+".</p></div>"+
    "<div><h3>Palavras dominadas</h3><div class=\"bar2\"><i style=\"width:"+Math.round(100*mastered/Math.max(1,vocabN))+"%\"></i></div><p class=\"help\">"+mastered+" de "+vocabN+" palavras. Conta quando você acerta a palavra pelo menos 2 vezes e acerta mais do que erra.</p></div>"+
    "<div><h3>Para treinar</h3>"+(worst.length?'<div class="train">'+worst.map(k=>'<div class="tr"><span><b>'+esc(k)+"</b><br><small>"+esc(sk[k][2]||"")+" · errou "+sk[k][1]+"x, acertou "+sk[k][0]+"x</small></span>"+(k.length<=40?speakBtn(k):"")+"</div>").join("")+"</div>":'<p class="help">Ainda sem erros registrados. Eles aparecem aqui conforme você joga.</p>')+"</div>";
}
function buildSettings(){
  buildThemeSelect();
  $("#avgrid").innerHTML=["initial"].concat(Object.keys(AVATARS)).map(k=>'<button type="button" data-av="'+k+'" aria-label="Logo '+k+'">'+avatarHtml(k,40)+"</button>").join("");
  buildStylePicker();
  $("#swatches").innerHTML=Object.keys(PALS).map(k=>'<button type="button" class="sw" data-pal="'+k+'" style="background:'+PALS[k].bg+'" aria-label="'+esc(PALS[k].name)+'"></button>').join("");
}

function stylePrev(id,i){
  const sc=id==="padrao"?null:schemeList(id)[i||0];
  const bg=sc?sc[2]:"#f4f5f7",su=sc?sc[3]:"#ffffff",ac=sc?sc[9]:"#1f3d7a",ln=sc?sc[6]:"#6f798b";
  return '<span class="stpv" data-pv="'+id+'" style="background:'+bg+';border-color:'+ln+'"><i style="background:'+su+'"></i><i style="background:'+ac+'"></i><i style="background:'+su+'"></i></span>';
}
const STYLE_GROUPS=[["Básicos",["padrao","fofo","soft"]],["Livros em francês",["pp","verne","musq","perrault"]],["Livros em italiano",["pinocchio","principe","dante","racconti"]],["Livros em inglês",["alice","peter","wind","sherlock","frank","grimm"]]];
function buildStylePicker(){
  const card=id=>'<button type="button" class="stcard" data-style="'+id+'">'+stylePrev(id,0)+"<b>"+(id==="padrao"?"Padrão":STYLES[id].name)+"</b><small>"+(id==="padrao"?"Como era antes":STYLES[id].desc)+"</small></button>";
  const seen={},groups=STYLE_GROUPS.map(g=>[g[0],g[1].filter(id=>{const ok=(id==="padrao"||STYLES[id])&&!seen[id];if(ok)seen[id]=1;return ok;})]);
  const extra=Object.keys(STYLES).filter(id=>!seen[id]);
  if(extra.length)groups.push(["Outros",extra]);
  $("#style-grid").innerHTML=groups.filter(g=>g[1].length).map(g=>'<h3 class="stgh">'+esc(g[0])+"</h3>"+g[1].map(card).join("")).join("");
}
function syncStyle(){
  $$("#style-grid .stcard").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.style===S.style)));
  const sw=$("#scheme-row"),on=S.style!=="padrao";
  sw.hidden=!on;$("#sec-cor").hidden=on;$("#sec-modo").hidden=on;$("#sec-layout").hidden=on;$("#style-note").hidden=!on;
  if(on){
    const l=schemeList(S.style),cur=Math.min(S.scheme,l.length-1);
    sw.querySelector(".schs").innerHTML=l.map((s,i)=>'<button type="button" class="sch" data-scheme="'+i+'" aria-pressed="'+(i===cur)+'" aria-label="Cores: '+esc(s[0])+'"><span style="background:linear-gradient(90deg,'+s[2]+' 33%,'+s[3]+' 33% 66%,'+s[9]+' 66%)"></span><small>'+esc(s[0])+"</small></button>").join("");
    $("#style-note").textContent="Neste estilo, a cor e o claro/escuro seguem a variação escolhida acima. Para usar as cores livres de antes, volte ao Padrão.";
  }
}
$("#style-grid").addEventListener("click",e=>{const b=e.target.closest("[data-style]");if(!b)return;S.style=b.dataset.style;S.scheme=0;save();applyTheme();syncStyle();});
$("#scheme-row").addEventListener("click",e=>{const b=e.target.closest("[data-scheme]");if(!b)return;S.scheme=+b.dataset.scheme;save();applyTheme();syncStyle();});
function syncPrefs(){
  syncStyle();
  $$("[data-k]").forEach(b=>b.setAttribute("aria-pressed",String(String(S[b.dataset.k])===b.dataset.v)));
  $$("#swatches .sw").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.pal===S.pal)));
  $("#swlabel").textContent=PALS[S.pal].name;
  $("#custom-row").hidden=S.pal!=="custom";
  $("#custom-color").value=S.custom;
  if(document.activeElement!==$("#player"))$("#player").value=S.player;
  if(document.activeElement!==$("#motto"))$("#motto").value=S.motto;
  $$("#avgrid button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.av===S.avatar)));
  renderMe();
  $("#vol-lang").textContent=LNAME[S.lang];
  $("#app").dataset.lang=S.lang;
}
function onPrefClick(e){
  const k=e.target.closest("[data-k]"),p=e.target.closest("[data-pal]");
  if(k&&k.disabled)return;
  if(k)S[k.dataset.k]=k.dataset.k==="vol"?+k.dataset.v:k.dataset.v;else if(p)S.pal=p.dataset.pal;else return;
  save();applyTheme();
  if(k&&(k.dataset.k==="lang"||k.dataset.k==="vol"))renderIndex();else syncPrefs();
  if(k&&k.dataset.k==="lang"&&!$("#s-vol").hidden){if(typeof renderToday==="function")renderToday();if(typeof renderQod==="function")renderQod();}
  if(k&&(k.dataset.k==="sound"||k.dataset.k==="snd"))sfx("ok");
  if(k&&k.dataset.k==="hap"&&S.hap==="on"){try{navigator.vibrate&&navigator.vibrate([40,30,40]);}catch(_){}}
}
$("#s-index").addEventListener("click",onPrefClick);
$("#s-settings").addEventListener("click",onPrefClick);
$("#custom-color").addEventListener("input",e=>{S.custom=e.target.value;save();applyTheme();});
$("#player").addEventListener("input",e=>{S.player=e.target.value.slice(0,24);save();renderMe();});
$("#motto").addEventListener("input",e=>{S.motto=e.target.value.slice(0,60);save();renderMe();});
$("#avgrid").addEventListener("click",e=>{const b=e.target.closest("[data-av]");if(!b)return;S.avatar=b.dataset.av;save();syncPrefs();});
$(".me").addEventListener("click",()=>go("profile"));
$("#s-stats").addEventListener("click",e=>{onPrefClick(e);renderStats();});
$("#s-profile").addEventListener("click",onPrefClick);
$("#s-vol").addEventListener("click",onPrefClick);
$("#clear-stats").addEventListener("click",()=>{
  if(!clearStatsArmed){clearStatsArmed=true;$("#clear-stats-note").textContent="Toque de novo para apagar as estatísticas (partidas, erros e palavras dominadas). As marcas de concluído ficam.";return;}
  S.plays={};S.sk={};save();clearStatsArmed=false;$("#clear-stats-note").textContent="Estatísticas apagadas.";
});
$("#clear-done").addEventListener("click",()=>{
  if(!clearArmed){clearArmed=true;$("#clear-note").textContent="Toque de novo para apagar todas as marcas de concluído.";return;}
  S.done={};S.cap={};save();clearArmed=false;$("#clear-note").textContent="Marcas apagadas.";
});

const STAGES={cross:"#stage",search:"#stage",connect:"#cstage",sentence:"#sstage",frases:"#sstage",odd:"#ostage",alfabeto:"#lstage",sons:"#lstage",fala:"#lstage",tema:"#lstage",ditado:"#lstage",resposta:"#rstage"};
const GRAMTYPES=VOLUME4.types.map(t=>t[0]);
VOLUME4.types.forEach(t=>{GAMENAME[t[0]]=t[2];});
GRAMTYPES.forEach(t=>{STAGES[t]="#gstage";});
const DOCKS={cross:"cross",search:"search",connect:"connect",sentence:"sentence",frases:"sentence",odd:"odd",alfabeto:"listen",sons:"listen",fala:"listen",tema:"listen",ditado:"listen",resposta:"resp"};
GRAMTYPES.forEach(t=>{DOCKS[t]="gram";});
function startPage(id){
  P=curVol().pages.find(p=>p.id===id);
  go("game");
  $("#g-title").textContent=pageTitle(P);
  $("#g-sub").textContent=LNAME[S.lang]+" · "+pageMeta(P);
  ["#stage","#cstage","#sstage","#ostage","#lstage","#rstage","#gstage"].forEach(s=>{$(s).hidden=s!==STAGES[P.type];});
  ["cross","search","connect","sentence","odd","listen","resp","gram"].forEach(d=>{$("#dock-"+d).hidden=d!==DOCKS[P.type];});
  $("#g-list").hidden=P.type!=="cross";
  $("#kb-toggle").hidden=P.type!=="cross";
  $("#zoom-toggle").hidden=!(P.type==="cross"||P.type==="search");
  applyKb();
  newGame();
  applyGridZoom();
}
const GAMEFN={cross:startCross,search:startSearch,connect:startConnect,sentence:startSentence,frases:startSentence,odd:startOdd,alfabeto:startListen,sons:startListen,fala:startListen,tema:startListen,ditado:startListen,resposta:startResp};
GRAMTYPES.forEach(t=>{GAMEFN[t]=startGram;});
function newGame(){GAMEFN[P.type]();}
$("#g-new").addEventListener("click",newGame);
function applyKb(){
  $("#kb").hidden=!S.kb;
  $("#kb-toggle").textContent=S.kb?"Teclado: sim":"Teclado: não";
}
$("#kb-toggle").addEventListener("click",()=>{S.kb=!S.kb;save();applyKb();if(!S.kb&&typeof focusNative==="function")focusNative();});
