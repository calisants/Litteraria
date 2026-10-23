/* ===== Palavras parecidas (v1.53): pares que se confundem, no Dicionário =====
   Pedido dela (22/10/2026): «cousine (prima) e cuisine (cozinha)». Cada par: [palavra, significado, palavra, significado].
   Escritos por Claude, sem fonte conferida (rótulo na tela). Edite aqui para acrescentar pares. */
const PARES={
  fr:[["cuisine","cozinha","cousine","prima"],["poisson","peixe","poison","veneno"],["chair","carne","chaise","cadeira"],["sale","sujo","salle","sala"],["mer","mar","mère","mãe"],["cou","pescoço","coup","golpe"],["ville","cidade","village","vilarejo"],["pain","pão","peine","pena, dificuldade"],["librairie","livraria","bibliothèque","biblioteca"],["livre","livro (m.) ou livre (adj.)","libre","livre"],["père","pai","pair","par, igual"],["verre","copo","vert","verde"]],
  it:[["fame","fome","fama","fama"],["pozzo","poço","pazzo","louco"],["cane","cachorro","canna","cana"],["pane","pão","panna","creme de leite"],["cena","jantar","scena","cena (de teatro)"],["cassa","caixa","casa","casa"],["burro","manteiga","asino","burro (o animal)"],["ancora","ainda, de novo","àncora","âncora"]],
  en:[["desert","deserto","dessert","sobremesa"],["quiet","quieto, calmo","quite","bastante"],["angel","anjo","angle","ângulo"],["lose","perder","loose","solto"],["breath","respiração, fôlego","breathe","respirar"],["affect","afetar","effect","efeito"],["their","deles","there","lá, ali"],["weather","tempo (clima)","whether","se (ou não)"],["later","mais tarde","latter","o último, este (de dois)"],["library","biblioteca","bookstore","livraria"],["principal","diretor, principal","principle","princípio"],["stationary","parado","stationery","papelaria, material de escritório"]]
};
function parDict(q){
  const L=PARES[S.lang]||[],el=$("#dict-list");if(!el||!L.length)return;
  const rows=L.filter(p=>!q||dnorm(p.join(" ")).indexOf(q)>=0);
  if(!rows.length)return;
  const h='<details class="pares"'+(q?" open":"")+'><summary><b>Palavras parecidas: não confunda</b> ('+rows.length+')</summary>'+
    rows.map(p=>'<div class="par-row"><div class="tx"><b>'+esc(p[0])+'</b> <span class="pt">'+esc(p[1])+'</span><br><b>'+esc(p[2])+'</b> <span class="pt">'+esc(p[3])+"</span></div></div>").join("")+
    '<p class="help">Pares escritos por Claude, sem fonte conferida.</p></details>';
  el.insertAdjacentHTML("afterbegin",h);
}
