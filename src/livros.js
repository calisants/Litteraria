/* ===== Temas de livros: palavras tiradas de um livro viram lições novas de Vocabulário (só no idioma do livro).
   As lições antigas não mudam: estas páginas entram no fim do Volume 2 e no fim da trilha. Dados: livros_data.js (tools/mk_livros.py). ===== */
const BOOKCAT={};
const BOOKTHEMES=BOOKS.map(b=>["livro-"+b.id,b.name+" ("+b.ln+")"]);
(function(){
  let bi=0;
  BOOKS.forEach(b=>{
    if(!SIL[b.lang])SIL[b.lang]={};
    b.chunks.forEach(c=>{
      BOOKCAT[c.cat]={name:b.name,lang:b.lang,book:b.id};
      VOCAB[b.lang][c.cat]=c.words.map(x=>({w:x.w,a:x.a||"",pt:x.pt,s:norm(x.w),cat:c.cat,cls:x.c}));
      c.words.forEach(x=>{SIL[b.lang][x.w]=x.sy;});
      const K=Math.ceil(c.words.length/5),idx=CATS.length+(bi++),th=[c.cat,"livro-"+b.id],base={themes:th,langs:[b.lang],sub:c.name};
      for(let k=1;k<=K;k++)VOLUME5.pages.push(Object.assign({id:"conheca-"+c.cat+"-"+k,type:"conheca",n:VOLUME5.pages.filter(x=>x.type==="conheca").length+1,cat:c.cat,part:k,K:K,meta:c.name+" · grupo "+k+" de "+K},base));
      ["reco","completar","embaralhar","escreva"].forEach(t=>[1,2].forEach(part=>VOLUME5.pages.push(Object.assign({id:t+"-"+c.cat+"-"+part,type:t,n:idx*2+part,cat:c.cat,part:part,meta:c.name+" · metade "+part},base))));
    });
  });
})();
const pageInLang=p=>!p.langs||p.langs.indexOf(S.lang)>=0;
const bookNote=l=>BOOKS.filter(b=>b.lang===l).map(b=>"Temas «"+b.name+"»: palavras escolhidas do texto do livro por frequência (só as palavras; nenhuma frase foi copiada). A existência de cada palavra"+(l==="en"?" foi conferida no dicionário de pronúncia CMU":(l==="it"?", o gênero dos substantivos e as sílabas foram conferidos no Wikcionário (2 palavras sem sílabas lá foram divididas pelo padrão de hifenização do LibreOffice)":" e o gênero dos substantivos foram conferidos no Wikcionário"))+"; a tradução foi escrita por Claude, sem fonte conferida.").join(" ");
