/* ===== Organização final dos volumes (ordem de aprendizado) e Volume 2: Vocabulário =====
   1 Pronúncia → 2 Vocabulário → 3 Jogos → 4 Gramática → 5 Conversação.
   Os ids internos (1 jogos, 2 pronúncia, 3 conversação, 4 gramática, 5 vocabulário) NÃO mudam o que já existia,
   e as páginas movidas guardam `vid` (volume de origem) para continuarem com o mesmo sorteio. */
const VOCTYPES=[["reco","Reconheça: escolha a palavra","Reconheça"],["tema","Ouça e entenda (com áudio)","Tema"],["completar","Complete a palavra","Complete"],["embaralhar","Letras embaralhadas","Embaralhe"],["escreva","Escreva a palavra","Escreva"],["ditado","Ditado: como se escreve (com áudio)","Ditado"]];
const VOLUME5={id:5,title:"Volume 2 · Vocabulário",types:VOCTYPES,pages:[]};
(function(){
  const take=ts=>{const out=[];VOLUME2.pages=VOLUME2.pages.filter(p=>{if(ts.indexOf(p.type)>=0){out.push(p);return false;}return true;});return out;};
  const moved=take(["tema","ditado"]),frases=take(["frases"]);
  moved.concat(frases).forEach(p=>{p.vid=2;});
  /* Vocabulário: cada tema vira duas partes (a 1ª e a 2ª metade das palavras) por exercício */
  ["reco","completar","embaralhar","escreva"].forEach(t=>CATS.forEach((c,i)=>[1,2].forEach(part=>VOLUME5.pages.push({id:t+"-"+c[0]+"-"+part,type:t,n:i*2+part,cat:c[0],part:part,themes:[c[0]],sub:c[1],meta:c[1]+" · parte "+part}))));
  VOLUME5.pages=VOLUME5.pages.concat(moved);
  VOLUME2.types=VOLUME2.types.filter(t=>["alfabeto","sons","fala"].indexOf(t[0])>=0);
  VOLUME2.title="Volume 1 · Pronúncia";
  VOLUME3.pages=frases.concat(VOLUME3.pages);
  VOLUME3.types=[["frases","Construção de frases","Frases"],["sentence","Monte as falas","Conversação"],["resposta","Qual resposta faz sentido?","Resposta"]];
  VOLUME3.title="Volume 5 · Conversação";
  /* Jogos: do que só pede reconhecer ao que pede lembrar a palavra */
  const T=Object.fromEntries(VOLUME.types.map(t=>[t[0],t]));
  VOLUME.types=["odd","connect","search","cross"].map(k=>T[k]);
  VOLUME.title="Volume 3 · Jogos de palavras";
  VOLUME4.title="Volume 4 · Gramática";
  VOLUMES.length=0;VOLUMES.push(VOLUME2,VOLUME5,VOLUME,VOLUME4,VOLUME3);
})();
