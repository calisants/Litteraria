/* ===== Dicionário: palavras do app em ordem alfabética, com sílabas, tradução, tema e áudio ===== */
const SIL_SRC={
  fr:"Sílabas do francês: regras aplicadas por Claude (o «e» final que não se pronuncia fica junto da sílaba anterior). Conferidas contra o Wikcionário: bateram 37 de 41 divisões (as diferenças são escolhas para estudo: a-mi, a-cide, nu-age) e a quantidade de sílabas bateu em 474 de 481 palavras com pronúncia (IPA); nas 7 restantes, a fala come um «e» do meio (ex.: samedi), mas a escrita foi mantida.",
  it:"Sílabas do italiano: divisão do Wikcionário (arquivo Kaikki), em 473 de 480 palavras. As outras 7 foram divididas por Claude, sem fonte conferida.",
  en:"Sílabas do inglês: padrões de hifenização do LibreOffice (pacote Pyphen), com a quantidade de sílabas conferida no dicionário de pronúncia CMU. 7 palavras foram corrigidas à mão. Hifenização de dicionário nem sempre coincide com a divisão pela pronúncia."
};
const dnorm=s=>String(s).toLowerCase().replace(/œ/g,"oe").replace(/æ/g,"ae").normalize("NFD").replace(/[̀-ͯ]/g,"");
let dictRows=[];
function exHtml(e){
  const x=EX[S.lang]&&EX[S.lang][e.w.toLowerCase()];
  return x?'<small class="ex"><i>'+esc(x[0])+"</i><br>"+esc(x[1])+"</small>":"";
}
function dictBuild(){
  const seen=new Set(),rows=[];
  Object.values(VOCAB[S.lang]).flat().forEach(e=>{
    const k=e.w+"|"+e.pt;if(seen.has(k))return;seen.add(k);
    rows.push({e:e,key:dnorm(e.w),txt:dnorm(full(e)+" "+e.pt)});
  });
  rows.sort((a,b)=>a.key.localeCompare(b.key,S.lang)||a.e.pt.localeCompare(b.e.pt,"pt"));
  dictRows=rows;
}
function dictRender(){
  const q=dnorm($("#dict-q").value.trim()),rows=q?dictRows.filter(r=>r.txt.indexOf(q)>=0):dictRows;
  let last="",h="";
  rows.forEach(r=>{
    const L=(r.key.charAt(0)||"#").toUpperCase();
    if(!q&&L!==last){h+='<h3 class="dl-h">'+esc(L)+"</h3>";last=L;}
    const e=r.e,sy=(SIL[S.lang]&&SIL[S.lang][e.w])||e.w;
    h+='<div class="dl-row"><div class="tx"><b>'+esc(full(e))+'</b><span class="pt">'+esc(e.pt)+'</span><small>sílabas: <span class="sy">'+esc(sy)+"</span> · "+esc(catName(e.cat))+"</small>"+exHtml(e)+"</div>"+speakBtn(full(e))+"</div>";
  });
  $("#dict-list").innerHTML=h||'<p class="empty">Nenhuma palavra encontrada.</p>';
  if(typeof parDict==="function")parDict(q);
  $("#dict-count").textContent=rows.length+(rows.length===1?" palavra":" palavras")+(q?" encontradas":" em ordem alfabética")+" · "+LNAME[S.lang];
  $("#dict-title").textContent="Dicionário de "+LNAME[S.lang];
  const nEx=EX[S.lang]?Object.keys(EX[S.lang]).length:0;
  $("#dict-src").textContent=SIL_SRC[S.lang]+" "+(nEx?"Exemplos: frases do Wikcionário (licença CC BY-SA 4.0), traduzidas para o português por Claude. Só aparecem "+nEx+" exemplos: escolhi apenas frases que usam a palavra no mesmo sentido do app e descartei expressões, frases antigas e sentidos diferentes.":"Exemplos: ainda não há para este idioma.")+" "+bookNote(S.lang);
}
function dictOpen(){
  $("#dict-lang").innerHTML=Object.keys(LNAME).map(l=>'<button type="button" data-dictlang="'+l+'" aria-pressed="'+(l===S.lang)+'">'+LNAME[l]+"</button>").join("");
  dictBuild();$("#dict-q").value="";dictRender();go("dict");
}
$("#go-dict").addEventListener("click",dictOpen);
$("#dict-lang").addEventListener("click",e=>{const b=e.target.closest("[data-dictlang]");if(!b)return;S.lang=b.dataset.dictlang;save();syncPrefs();dictOpen();});
$("#dict-q").addEventListener("input",dictRender);
