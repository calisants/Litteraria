/* ===== Palavras cruzadas ===== */
const cw={cred:new Set(),missed:new Set(),clueEls:[],p:null,order:[],map:{},vals:{},given:{},wrong:{},rev:{},cells:{},ei:0,cur:null,dir:0,finished:false,cfg:null};
const kk=x=>key(x[0],x[1]);
function entryKeys(e){return e.cells.map(kk);}
function entrySolved(e){return entryKeys(e).every(k=>cw.vals[k]===cw.p.sol[k]);}
function curEntry(){return cw.order[cw.ei];}
const shortClue=pt=>pt.split(/\s*[\/;]\s*/)[0].replace(/\s*\(.*?\)/g,"").trim();
/* layout "brasileiro": cada dica fica numa casa antes da palavra, com seta; a grade ganha 1 linha e 1 coluna de margem */
function swedish(p){
  const sol={},clues={};
  Object.keys(p.sol).forEach(k=>{const a=k.split(",").map(Number);sol[key(a[0]+1,a[1]+1)]=p.sol[k];});
  p.entries.forEach(e=>{
    e.r+=1;e.c+=1;e.cells=e.cells.map(x=>[x[0]+1,x[1]+1]);
    const ck=e.d?key(e.r-1,e.c):key(e.r,e.c-1);
    (clues[ck]=clues[ck]||{})[e.d?"v":"h"]=e;
  });
  return {entries:p.entries,sol:sol,nums:{},clues:clues,rows:p.rows+1,cols:p.cols+1};
}
function creditAll(){
  cw.order.forEach(e=>{
    if(cw.cred.has(e)||!entrySolved(e))return;
    cw.cred.add(e);
    if(entryKeys(e).every(k=>!cw.rev[k]))skRec(e.it.w,e.it.pt,true);
  });
}
function missEntry(e){if(cw.missed.has(e)||cw.cred.has(e))return;cw.missed.add(e);skRec(e.it.w,e.it.pt,false);}

function startCross(){
  const c=CFG.cross[P.level];cw.cfg=c;seedNow();
  let p=null;
  for(let at=0;at<10;at++){
    if(at)seedWith(S.lang+"|"+(P.vid||curVol().id)+"|"+P.id+"#"+at);
    const q=makeCrossword(pickWords(S.lang,P.cat,c.n,3,c.max),c.span,c.tries);
    if(!p||q.entries.length>p.entries.length)p=q;
    if(p.entries.length>=Math.ceil(c.n*.75))break;
  }
  p=swedish(p);
  cw.cred=new Set();cw.missed=new Set();cw.clueEls=[];
  cw.p=p;cw.finished=false;cw.vals={};cw.given={};cw.wrong={};cw.rev={};cw.cells={};cw.map={};
  p.entries.forEach(e=>e.cells.forEach(x=>{const k=kk(x);(cw.map[k]=cw.map[k]||{})[e.d]=e;}));
  cw.order=p.entries.slice().sort((a,b)=>a.num-b.num||a.d-b.d);
  if(c.given){
    const ks=shuffle(Object.keys(p.sol));
    ks.slice(0,Math.round(ks.length*c.given)).forEach(k=>{cw.vals[k]=p.sol[k];cw.given[k]=1;});
  }
  const fit=$("#fit");fit.className="fit cgrid";fit.style.setProperty("--cols",p.cols);fit.innerHTML="";
  for(let r=0;r<p.rows;r++)for(let q=0;q<p.cols;q++){
    const k=key(r,q);
    if(p.sol[k]){
      const d=document.createElement("div");d.className="cc";d.dataset.k=k;
      d.appendChild(document.createElement("span"));
      fit.appendChild(d);cw.cells[k]=d;
    }else if(p.clues[k]){
      const cl=document.createElement("div"),m=p.clues[k];cl.className="cl"+(m.h&&m.v?" two":"");
      ["h","v"].forEach(t=>{
        if(!m[t])return;
        const sp=document.createElement("span");sp.className="ct "+t;sp.dataset.ei=cw.order.indexOf(m[t]);
        sp.textContent=shortClue(m[t].it.pt);cl.appendChild(sp);cw.clueEls.push([sp,m[t]]);
      });
      fit.appendChild(cl);
    }else fit.insertAdjacentHTML("beforeend",'<div class="cx"></div>');
  }
  fitFn=()=>fitGrid(p.cols,p.rows,2,18,72);fitFn();
  setStatus("#cw-status","");
  const first=cw.order.findIndex(e=>!entrySolved(e));
  selectEntry(first<0?0:first);
}
function selectEntry(i,k){
  cw.ei=i;const e=cw.order[i];cw.dir=e.d;
  if(!k){const ks=entryKeys(e);k=ks.find(x=>!cw.vals[x])||ks.find(x=>cw.vals[x]!==cw.p.sol[x])||ks[0];}
  cw.cur=k;paintCross();
}
function selectCell(k){
  const m=cw.map[k];if(!m)return;
  let d=cw.dir;
  if(cw.cur===k&&m[0]&&m[1])d=1-d;else if(!m[d])d=m[0]?0:1;
  cw.dir=d;cw.ei=cw.order.indexOf(m[d]);cw.cur=k;paintCross();
}
function paintCross(){
  const e=curEntry(),inw=new Set(entryKeys(e));
  Object.keys(cw.cells).forEach(k=>{
    const d=cw.cells[k];
    d.className="cc"+(inw.has(k)?" inword":"")+(k===cw.cur?" active":"")+(cw.wrong[k]?" wrong":"")+(cw.given[k]?" given":"")+(cw.rev[k]?" rev":"");
    d.lastChild.textContent=cw.vals[k]||"";
  });
  cw.clueEls.forEach(x=>{x[0].classList.toggle("sel",x[1]===e);x[0].classList.toggle("ok",cw.finished||entrySolved(x[1]));});
  const art=cw.cfg.article&&e.it.a?" · artigo: "+e.it.a:"";
  const solved=cw.finished||entrySolved(e);
  followActive();
  $("#cw-clue").innerHTML="<span><b>"+(e.d?"↓ Vertical":"→ Horizontal")+"</b> "+esc(e.it.pt)+"</span><small>"+plural(e.it.s.length,"letra","letras")+esc(art)+(solved?" · "+esc(full(e.it)):"")+"</small>";
}
function afterSolve(){
  const n=cw.order.length;
  for(let s=1;s<=n;s++){const j=(cw.ei+s)%n;if(!entrySolved(cw.order[j])){selectEntry(j);checkDone();return;}}
  paintCross();checkDone();
}
function checkDone(){
  if(cw.finished||!cw.order.every(entrySolved))return;
  cw.finished=true;paintCross();markDone();sfx("done");
  setStatus("#cw-status","Página concluída. Veja as palavras e as traduções.","ok");
  setTimeout(()=>doneSheet("Página concluída: palavras",cw.order.map(e=>e.it)),400);
}
function typeLetter(ch){
  if(cw.finished||!cw.cur)return;
  const k=cw.cur,ks=entryKeys(curEntry()),i=ks.indexOf(k);
  if(!cw.given[k]){cw.vals[k]=ch;delete cw.wrong[k];delete cw.rev[k];}
  setStatus("#cw-status","");
  creditAll();
  if(entrySolved(curEntry())){sfx("ok");afterSolve();return;}
  if(i<ks.length-1)cw.cur=ks[i+1];
  paintCross();checkDone();
}
function backspace(){
  if(cw.finished||!cw.cur)return;
  const k=cw.cur,ks=entryKeys(curEntry()),i=ks.indexOf(k);
  const clear=x=>{if(!cw.given[x]){delete cw.vals[x];delete cw.wrong[x];delete cw.rev[x];}};
  if(!cw.given[k]&&cw.vals[k])clear(k);
  else if(i>0){cw.cur=ks[i-1];clear(ks[i-1]);}
  setStatus("#cw-status","");
  paintCross();
}
function focusNative(){
  if(S.kb||$("#s-game").hidden||!P||P.type!=="cross")return;
  const n=$("#native");n.value="";try{n.focus({preventScroll:true});}catch(_){}
}
$("#native").addEventListener("input",e=>{
  const v=e.target.value;e.target.value="";
  Array.from(v).forEach(c=>{const ch=norm(c);if(ch.length===1)typeLetter(ch);});
});
function stepEntry(d){const n=cw.order.length;selectEntry((cw.ei+d+n)%n);}
function hintLetter(){
  if(cw.finished)return;
  const sol=cw.p.sol,ks=entryKeys(curEntry());
  let k=(cw.cur&&cw.vals[cw.cur]!==sol[cw.cur])?cw.cur:ks.find(x=>cw.vals[x]!==sol[x]);
  if(!k)k=Object.keys(sol).find(x=>cw.vals[x]!==sol[x]);
  if(!k)return;
  cw.vals[k]=sol[k];delete cw.wrong[k];cw.rev[k]=1;
  setStatus("#cw-status","Letra revelada.");
  if(entrySolved(curEntry())){creditAll();afterSolve();}else{paintCross();checkDone();}
}
function checkLetters(){
  if(cw.finished)return;
  let wrong=0,empty=0;
  Object.keys(cw.cells).forEach(k=>{
    delete cw.wrong[k];
    if(!cw.vals[k])empty++;else if(cw.vals[k]!==cw.p.sol[k]){cw.wrong[k]=1;wrong++;}
  });
  cw.order.forEach(e=>{if(entryKeys(e).some(k=>cw.wrong[k]))missEntry(e);});
  paintCross();
  if(wrong){
    sfx("bad");$$(".cc.wrong").forEach(shake);
    setStatus("#cw-status",plural(wrong,"letra errada marcada","letras erradas marcadas")+" em vermelho.","bad");
  }
  else setStatus("#cw-status",empty?"Nenhuma letra errada. Faltam "+plural(empty,"casa","casas")+".":"Tudo certo!","ok");
}
function revealAll(){
  if(cw.finished)return;
  Object.keys(cw.cells).forEach(k=>{if(cw.vals[k]!==cw.p.sol[k])cw.rev[k]=1;cw.vals[k]=cw.p.sol[k];delete cw.wrong[k];});
  cw.order.forEach(e=>missEntry(e));
  cw.finished=true;paintCross();
  setStatus("#cw-status","Respostas reveladas. A página não é marcada como concluída.");
  openSheet("Respostas",cw.order.map(e=>wordRow(e.it)).join(""),true);
}
function openClues(){
  const row=e=>{const s=cw.finished||entrySolved(e);return '<button type="button" class="srow" data-ei="'+cw.order.indexOf(e)+'"><span class="n">'+(e.d?"↓":"→")+'</span><span class="pt">'+esc(e.it.pt)+" <small>("+e.it.s.length+")</small></span>"+(s?'<span class="w">'+esc(full(e.it))+"</span>":"")+"</button>";};
  openSheet("Lista de palavras",'<p class="sh">Horizontais</p>'+cw.order.filter(e=>!e.d).map(row).join("")+'<p class="sh">Verticais</p>'+cw.order.filter(e=>e.d).map(row).join(""),false);
}
function buildKb(){
  const del='<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M21 5H9l-6 7 6 7h12z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 9.5l5 5m0-5l-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  $("#kb").innerHTML=["QWERTYUIOP","ASDFGHJKL","ZXCVBNM#"].map(r=>"<div>"+r.split("").map(ch=>ch==="#"?'<button type="button" class="del" data-ch="DEL" aria-label="Apagar">'+del+"</button>":'<button type="button" data-ch="'+ch+'">'+ch+"</button>").join("")+"</div>").join("");
}
$("#kb").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;if(b.dataset.ch==="DEL")backspace();else typeLetter(b.dataset.ch);});
$("#fit").addEventListener("click",e=>{if(!P||P.type!=="cross")return;const c=e.target.closest(".cc");if(c){selectCell(c.dataset.k);focusNative();return;}const t=e.target.closest(".ct");if(t){selectEntry(+t.dataset.ei);focusNative();}});
$("#cw-prev").addEventListener("click",()=>stepEntry(-1));
$("#cw-next").addEventListener("click",()=>stepEntry(1));
$("#cw-hint").addEventListener("click",hintLetter);
$("#cw-check").addEventListener("click",checkLetters);
$("#cw-reveal").addEventListener("click",revealAll);
$("#g-list").addEventListener("click",openClues);
$("#sheet-in").addEventListener("click",e=>{const b=e.target.closest("[data-ei]");if(!b)return;closeSheet();selectEntry(+b.dataset.ei);});
document.addEventListener("keydown",e=>{
  if($("#s-game").hidden||!P||P.type!=="cross"||sheetOpen()||e.metaKey||e.ctrlKey||e.altKey)return;
  const k=e.key;
  if(k==="Backspace"){e.preventDefault();backspace();}
  else if(k==="ArrowRight"){e.preventDefault();stepEntry(1);}
  else if(k==="ArrowLeft"){e.preventDefault();stepEntry(-1);}
  else if(k==="ArrowUp"||k==="ArrowDown"){e.preventDefault();selectCell(cw.cur);}
  else if(k.length===1){const ch=norm(k);if(ch.length===1){e.preventDefault();typeLetter(ch);}}
});
