/* ===== Caça-palavras ===== */
const ws={p:null,found:new Map(),cells:[],anchor:null,hover:null,dragging:false,tap:false,cfg:null};
function startSearch(){
  const c=CFG.search[P.level];ws.cfg=c;seedNow();
  const words=pickWords(S.lang,P.cat,c.n,3,c.maxLen);
  let p=null,n=words.length;
  while(!p&&n>=4){p=genSearch(words.slice(0,n),c.size,c.dirs,POOL[S.lang]);if(!p)n--;}
  ws.p=p;ws.found=new Map();ws.anchor=ws.hover=null;ws.dragging=ws.tap=false;ws.cells=[];
  const fit=$("#fit");fit.className="fit cgrid wgrid";fit.style.setProperty("--cols",p.size);fit.innerHTML="";
  for(let r=0;r<p.size;r++){
    ws.cells[r]=[];
    for(let q=0;q<p.size;q++){
      const d=document.createElement("div");d.className="wc";d.dataset.r=r;d.dataset.c=q;d.textContent=p.grid[r][q];
      fit.appendChild(d);ws.cells[r][q]=d;
    }
  }
  fitFn=()=>fitGrid(p.size,p.size,2,18,60);fitFn();
  setStatus("#ws-status","Arraste sobre as letras, ou toque na primeira e na última.");
  renderWsList();
}
function renderWsList(){
  $("#ws-list").innerHTML=ws.p.placed.map((p,i)=>{
    const it=p.it;
    if(ws.found.has(i))return '<li class="found f'+ws.found.get(i)+'"><b>'+esc(full(it))+'</b><span class="t">'+esc(it.pt)+"</span>"+speakBtn(full(it))+"</li>";
    if(ws.cfg.showTr)return "<li><b>"+esc(it.w)+'</b><span class="t">'+esc(it.pt)+"</span></li>";
    return '<li><span class="t">'+esc(it.pt)+"</span><small>"+it.s.length+" letras</small></li>";
  }).join("");
}
function lineCells(a,b,size){
  const dr=b.r-a.r,dc=b.c-a.c,adr=Math.abs(dr),adc=Math.abs(dc);
  if(!adr&&!adc)return [a];
  let sr,sc,len;
  if(adr>=2*adc){sr=Math.sign(dr);sc=0;len=adr;}
  else if(adc>=2*adr){sr=0;sc=Math.sign(dc);len=adc;}
  else{sr=Math.sign(dr);sc=Math.sign(dc);len=Math.max(adr,adc);}
  const out=[];
  for(let i=0;i<=len;i++){const r=a.r+sr*i,c=a.c+sc*i;if(r<0||c<0||r>=size||c>=size)break;out.push({r:r,c:c});}
  return out;
}
function clearSel(){$$("#fit .sel").forEach(c=>c.classList.remove("sel"));}
function paintSel(){
  clearSel();if(!ws.anchor)return;
  lineCells(ws.anchor,ws.hover||ws.anchor,ws.p.size).forEach(x=>ws.cells[x.r][x.c].classList.add("sel"));
}
function finishSel(){
  const cells=lineCells(ws.anchor,ws.hover,ws.p.size);
  ws.anchor=ws.hover=null;ws.tap=false;ws.dragging=false;clearSel();
  if(cells.length<2)return;
  const str=cells.map(x=>ws.p.grid[x.r][x.c]).join(""),rev=str.split("").reverse().join("");
  const hit=p=>p.it.s===str||p.it.s===rev;
  const idx=ws.p.placed.findIndex((p,i)=>!ws.found.has(i)&&hit(p));
  if(idx>=0){
    const col=ws.found.size%5+1;ws.found.set(idx,col);
    cells.forEach(x=>{const el=ws.cells[x.r][x.c];el.classList.remove("f1","f2","f3","f4","f5","rev");el.classList.add("f"+col);});
    const it=ws.p.placed[idx].it,total=ws.p.placed.length;
    skRec(it.w,it.pt,true);
    renderWsList();
    if(ws.found.size===total){
      markDone();sfx("done");
      setStatus("#ws-status","Página concluída. "+full(it)+" = "+it.pt+".","ok");
      setTimeout(()=>doneSheet("Página concluída: palavras",ws.p.placed.map(p=>p.it)),500);
    }else{sfx("ok");setStatus("#ws-status","Achou: "+full(it)+" = "+it.pt+" ("+ws.found.size+" de "+total+").","ok");}
  }else if(ws.p.placed.some((p,i)=>ws.found.has(i)&&hit(p)))setStatus("#ws-status","Você já encontrou essa palavra.");
  else{sfx("bad");shake($("#fit"));setStatus("#ws-status","Essa sequência não está na lista. Tente de novo.","bad");}
}
function cellAt(e){
  const el=document.elementFromPoint(e.clientX,e.clientY),c=el&&el.closest&&el.closest(".wc");
  return c?{r:+c.dataset.r,c:+c.dataset.c}:null;
}
const fitEl=$("#fit");
const zoomed=()=>$("#stage").classList.contains("zoom");
/* ampliado: a grade rola com o dedo, então a seleção é por toque (primeira e última letra) */
fitEl.addEventListener("click",e=>{
  if(!P||P.type!=="search"||!ws.p||!zoomed())return;
  const c=e.target.closest(".wc");if(!c)return;
  const cell={r:+c.dataset.r,c:+c.dataset.c};
  if(ws.anchor){ws.hover=cell;finishSel();return;}
  ws.anchor=cell;ws.hover=cell;ws.tap=true;paintSel();
  setStatus("#ws-status","Agora toque na última letra da palavra.");
});
fitEl.addEventListener("pointerdown",e=>{
  if(!P||P.type!=="search"||!ws.p||zoomed())return;
  const cell=cellAt(e);if(!cell)return;
  e.preventDefault();
  if(ws.tap&&ws.anchor){ws.hover=cell;finishSel();return;}
  ws.anchor=cell;ws.hover=cell;ws.dragging=true;ws.tap=false;
  try{fitEl.setPointerCapture(e.pointerId);}catch(_){}
  paintSel();
});
fitEl.addEventListener("pointermove",e=>{
  if(!P||P.type!=="search"||!ws.dragging||zoomed())return;
  const cell=cellAt(e);
  if(cell&&(cell.r!==ws.hover.r||cell.c!==ws.hover.c)){ws.hover=cell;paintSel();}
});
fitEl.addEventListener("pointerup",()=>{
  if(!P||P.type!=="search"||!ws.dragging||zoomed())return;
  ws.dragging=false;
  if(ws.hover.r===ws.anchor.r&&ws.hover.c===ws.anchor.c){ws.tap=true;paintSel();}else finishSel();
});
fitEl.addEventListener("pointercancel",()=>{if(ws.tap&&!ws.dragging)return;ws.dragging=false;ws.anchor=ws.hover=null;ws.tap=false;clearSel();});
$("#ws-reveal").addEventListener("click",()=>{
  ws.p.placed.forEach((p,i)=>{if(!ws.found.has(i)&&!p.missed){p.missed=true;skRec(p.it.w,p.it.pt,false);}});
  ws.p.placed.forEach((p,i)=>{if(!ws.found.has(i))p.cells.forEach(c=>ws.cells[c[0]][c[1]].classList.add("rev"));});
  setStatus("#ws-status","Respostas marcadas na grade. Veja as traduções na lista.");
});

/* ===== Conecte ===== */
const cn={groups:[],tiles:[],sel:new Set(),solved:[],mistakes:0,done:false,cfg:null};
const CLASH=[["pessoas","familia"],["comida","restaurante"],["clima","natureza"],["saude","corpo"],["trabalho","laboratorio"]];
const clashes=(a,b)=>CLASH.some(p=>(p[0]===a&&p[1]===b)||(p[0]===b&&p[1]===a));
function startConnect(){
  const c=CFG.connect[P.level];cn.cfg=c;seedNow();
  let keys=CATS.filter(x=>x[2]===P.sec).map(x=>x[0]);
  if(keys.length<c.groups)keys=CATS.map(x=>x[0]);
  const pool=shuffle(keys),cats=[];
  pool.forEach(k=>{if(cats.length<c.groups&&!cats.some(o=>clashes(o,k)))cats.push(k);});
  pool.forEach(k=>{if(cats.length<c.groups&&cats.indexOf(k)<0)cats.push(k);});
  cn.groups=cats.map(cat=>({cat:cat,label:CATLABEL[cat],items:shuffle(VOCAB[S.lang][cat]).slice(0,4)}));
  let id=0;
  cn.tiles=shuffle(cn.groups.flatMap((g,gi)=>g.items.map(it=>({id:id++,it:it,gi:gi}))));
  cn.sel=new Set();cn.solved=[];cn.mistakes=0;cn.done=false;
  fitFn=null;
  renderConnect();cnSay("Escolha 4 palavras do mesmo tema.");
}
function cnSay(msg,kind){setStatus("#cn-status",msg+" ("+cn.solved.length+" de "+cn.groups.length+" grupos)",kind);}
function renderConnect(){
  $("#cn-solved").innerHTML=cn.solved.map((gi,n)=>{
    const g=cn.groups[gi];
    return '<div class="band g'+(n%5+1)+'" style="margin-bottom:8px"><h3>'+esc(g.label)+"</h3><ul>"+g.items.map(it=>"<li><b>"+esc(full(it))+"</b><small> "+esc(it.pt)+"</small>"+speakBtn(full(it))+"</li>").join("")+"</ul></div>";
  }).join("");
  $("#cn-grid").innerHTML=cn.tiles.filter(t=>cn.solved.indexOf(t.gi)<0).map(t=>'<button type="button" class="tile" data-id="'+t.id+'" aria-pressed="'+cn.sel.has(t.id)+'"><span>'+esc(t.it.w)+"</span>"+(cn.cfg.showTr?"<small>"+esc(t.it.pt)+"</small>":"")+"</button>").join("");
  $("#cn-submit").disabled=cn.sel.size!==4||cn.done;
}
$("#cn-grid").addEventListener("click",e=>{
  const b=e.target.closest(".tile");if(!b||cn.done)return;
  const id=+b.dataset.id;
  if(cn.sel.has(id))cn.sel.delete(id);else if(cn.sel.size<4)cn.sel.add(id);
  renderConnect();
});
$("#cn-submit").addEventListener("click",()=>{
  if(cn.sel.size!==4||cn.done)return;
  const picked=cn.tiles.filter(t=>cn.sel.has(t.id)),counts={};
  picked.forEach(t=>{counts[t.gi]=(counts[t.gi]||0)+1;});
  const top=Math.max.apply(null,Object.values(counts));
  if(top===4){
    picked.forEach(t=>skRec(t.it.w,t.it.pt,true));
    const gi=picked[0].gi;cn.solved.push(gi);cn.sel=new Set();renderConnect();
    if(cn.solved.length===cn.groups.length){
      cn.done=true;markDone();sfx("done");cnSay("Página concluída.","ok");renderConnect();
      setTimeout(()=>doneSheet("Página concluída: palavras",cn.groups.flatMap(g=>g.items)),500);
    }else{sfx("ok");cnSay("Certo! Tema: "+cn.groups[gi].label+".","ok");}
  }else{
    const maj=+Object.keys(counts).sort((a,b)=>counts[b]-counts[a])[0];
    picked.forEach(t=>{if(t.gi!==maj)skRec(t.it.w,t.it.pt,false);});
    cn.mistakes++;renderConnect();sfx("bad");$$("#cn-grid .tile[aria-pressed=true]").forEach(shake);
    cnSay(top===3?"Quase! 3 dessas palavras são do mesmo tema.":"Essas 4 palavras não formam um grupo.","bad");
  }
});
$("#cn-shuffle").addEventListener("click",()=>{cn.tiles=shuffle(cn.tiles);renderConnect();});
$("#cn-clear").addEventListener("click",()=>{cn.sel=new Set();renderConnect();});
$("#cn-hint").addEventListener("click",()=>{
  const left=cn.groups.map((g,i)=>i).filter(i=>cn.solved.indexOf(i)<0);
  if(left.length)cnSay("Um dos temas é: "+cn.groups[left[rnd(left.length)]].label+".");
});

