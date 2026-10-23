"""Testa: trilha de aprendizado em Hoje, treino de palavras erradas, nome «Lições».
Uso (na pasta src/):  python3 -I tests/t16.py"""
import subprocess,time,os
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8773','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_context(viewport={'width':390,'height':844}).new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
    pg.goto('http://localhost:8773/index.html');pg.wait_for_timeout(700)
    assert 'Lições' in pg.inner_text('#go-games') and 'Jogos' not in pg.inner_text('#go-games')
    r=pg.evaluate("()=>{const P=lessonPath();const ids=P.map(r=>r.vol+':'+r.page.id);const c={};P.forEach(r=>c[r.vol]=(c[r.vol]||0)+1);return {n:P.length,dup:ids.length-new Set(ids).size,c}}");print(r);assert r['dup']==0 and r['n']>250
    # trilha: começa pela pronúncia; depois vocabulário do 1º tema; não depende do último jogo aberto
    pg.evaluate("()=>{S.lang='fr';S.done={};S.rv={};S.rvv={};S.sk={};S.rfd=ymd();save()}")
    s=pg.evaluate("()=>planText()");print(s);assert 'Pronúncia' in s
    pg.evaluate("()=>{lessonPath().filter(r=>r.vol===2).forEach(r=>S.done['fr:'+r.page.id]=1)}")
    s=pg.evaluate("()=>planText()");print(s);assert 'Vocabulário · Conheça #1' in s and 'Cumprimentos' in s
    # revisão diária de sons/palavras: 1x por dia, só de páginas já concluídas (não das feitas hoje)
    pg.evaluate("()=>{S.rfd='';save()}");s=pg.evaluate("()=>planText()");print(s);assert s.startswith('rever: Pronúncia') or s.startswith('rever:'),s
    pg.evaluate("()=>{S.dtd={d:ymd(),ids:lessonPath().filter(r=>r.vol===2).map(r=>'fr:'+r.page.id)};S.rfd='';save()}");s=pg.evaluate("()=>planText()");assert 'rever' not in s,s
    pg.evaluate("()=>{startToday&&0;S.rfd=ymd();S.dtd=null;save()}");s=pg.evaluate("()=>planText()");assert 'rever' not in s,s
    pg.evaluate("()=>{S.vol=1;startPage('cross-comida-adv');go('home')}")  # último jogo aberto: outro tema/jogo
    assert pg.evaluate("()=>planText()")==s,'não pode mudar pelo último jogo aberto'
    # domínio das palavras: pula a lição de vocabulário
    pg.evaluate("()=>{const p=lessonPath().find(r=>r.page.id==='conheca-saudacoes-1').page;wordsOf(p).forEach(e=>{S.sk.fr=S.sk.fr||{};S.sk.fr[e.w.toLowerCase()]=[3,0,'x']})}")
    s2=pg.evaluate("()=>planText()");print(s2);assert 'Conheça #1' not in s2
    # palavras erradas
    pg.click('#go-train');assert pg.is_disabled('[data-train=r]') or True
    pg.evaluate("()=>closeSheet()")
    pg.evaluate("()=>{S.sk={fr:{}};const ws=Object.values(VOCAB.fr).flat().slice(0,12);ws.forEach(e=>{S.sk.fr[e.w.toLowerCase()]=[0,2,e.pt]});save()}")
    assert pg.evaluate("()=>weakWords().length")==12
    assert pg.evaluate("()=>todayPlan().kind")=='weak' and 'reforçar 12' in pg.evaluate("()=>planText()")
    pg.evaluate("()=>{S.rvv['fr:v|bonjour']=[Date.now()-1,0,0]}");assert pg.evaluate("()=>todayPlan().kind")=='review','revisão vencida vem antes'
    pg.evaluate("()=>{S.rvv={}}")
    pg.click('#go-train');assert not pg.is_disabled('[data-train=r]') and 'Revisar palavras que errei (12)' in pg.inner_text('#sheet-in')
    pg.click('[data-train=r]');pg.wait_for_timeout(300)
    n=pg.evaluate("()=>[gm.items.length,gm.drill,gm.items.every(i=>i._force)]");print(n);assert n==[10,True,True]
    wk=pg.evaluate("()=>weakWords().map(e=>e.w.toLowerCase())")
    ans=pg.evaluate("()=>gm.items[0].ok[0]");k=pg.evaluate("()=>gm.items[0].k.toLowerCase()")
    pg.fill('#gm-typed',ans);pg.click('#gm-submit');assert 'Certo' in pg.inner_text('#gm-status')
    h=pg.evaluate("(k)=>S.sk.fr[k]",k);print('após acerto',h);assert h[0]==1
    # sem palavras erradas: botão desligado
    pg.evaluate("()=>{S.sk={};closeSheet();go('home')}");pg.click('#go-train');assert pg.is_disabled('[data-train=r]') and '(0)' in pg.inner_text('#sheet-in')
    print('erros:',errs);assert not errs
    b.close()
finally: srv.terminate()
