/* ===== Liga cada palavra ao desenho pelo significado em português =====
   Regra: a primeira tradução da palavra (antes da vírgula) tem de ser igual à de um desenho.
   Temas que não são objetos (cores, verbos, descrições, saudações etc.) ficam de fora, e nos livros só substantivos. */
(function(){
  const first=pt=>String(pt||"").split(/[,;\/(]/)[0].trim().toLowerCase();
  const svgOf={};
  Object.keys(window.__PT).forEach(id=>window.__PT[id].forEach(p=>{svgOf[p.toLowerCase()]=window.__D[id];}));
  /* desenhos antigos (en): a figura vale para o significado da palavra inglesa */
  const alias={pão:"loaf",botas:"boot",lar:"house",prato:"dish",casa:"house",chá:"tea",rosa:"rose"};
  const enOld=DRAW.en;
  Object.keys(enOld).forEach(k=>{
    const e=(VOCAB.en&&Object.keys(VOCAB.en).reduce((r,c)=>r||VOCAB.en[c].find(x=>x.w.toLowerCase()===k),null))||null;
    if(e&&!svgOf[first(e.pt)])svgOf[first(e.pt)]=enOld[k];
  });
  Object.keys(alias).forEach(p=>{if(enOld[alias[p]])svgOf[p]=enOld[alias[p]];});
  const SKIP={cores:1,verbos:1,descricoes:1,saudacoes:1,perguntas:1,numeros:1,dias:1,direcoes:1,pessoas:1,familia:1};
  const BAD={"compras|caixa":1};
  /* palavras de sentido diferente do desenho (bolsa de valores, raio de luz, «present» verbo etc.) */
  const NO={fr:{bourse:1,banc:1,langue:1,arrestation:1,quart:1,vapeur:1,chair:1,mouton:1},it:{raggio:1,figura:1,rimedio:1,vapore:1,saetta:1,stanza:1},en:{present:1,figure:1,dressing:1,examination:1,account:1,country:1,note:1,way:1,room:1,quarter:1,lounge:1,steam:1,flesh:1,breast:1,bosom:1}};
  ["fr","it","en"].forEach(l=>{
    const d=DRAW[l]||(DRAW[l]={});
    Object.keys(VOCAB[l]||{}).forEach(cat=>{
      if(SKIP[cat])return;
      const isBook=!!(BOOKCAT&&BOOKCAT[cat]);
      VOCAB[l][cat].forEach(e=>{
        const k=e.w.toLowerCase();
        if(d[k]||(NO[l]&&NO[l][k]))return;
        if(isBook&&e.cls&&e.cls!=="substantivo")return;
        if(BAD[cat+"|"+first(e.pt)])return;
        const s=svgOf[first(e.pt)];
        if(s)d[k]=s;
      });
    });
  });
})();
