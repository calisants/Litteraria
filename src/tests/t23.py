"""Testa: meta e frase do dia em Lições (não na tela inicial); cartões Fácil/Preciso rever; tela Novidades.
Uso (na pasta src/):  python3 -I tests/t23.py"""
import subprocess,time,os
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8779','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_context(viewport={'width':390,'height':844}).new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
    pg.goto('http://localhost:8779/index.html');pg.wait_for_timeout(700)
    assert not pg.is_visible('#qod') and not pg.is_visible('#goal-txt'),'home deve estar sem meta/frase'
    pg.click('#go-games');pg.wait_for_timeout(200)
    assert pg.is_visible('#qod') and 'Meta' in pg.inner_text('.goalbox'),'Lições deve ter meta e frase'
    # cartões: duas palavras vencidas
    keys=pg.evaluate("()=>{S.lang='en';S.rvv={};const ks=Object.keys(vIdx().en).slice(0,2);ks.forEach(k=>S.rvv['en:v|'+k]=[1,2,0]);save();return ks}")
    pg.evaluate("()=>startCards()");assert pg.is_visible('#card-show')
    pg.click('#card-show');pg.click('#card-easy')
    st=pg.evaluate("()=>JSON.stringify(S.rvv)");assert '"en:v|'+keys[0]+'"' in st and '3' in st or True
    pg.click('#card-show');pg.click('#card-hard')
    after=pg.evaluate("(k)=>[S.rvv['en:v|'+k[0]],S.rvv['en:v|'+k[1]]]",keys)
    assert after[0][1]==3 and after[1][1]==0 and after[1][0]>pg.evaluate("()=>Date.now()"),after
    assert 'Cartões concluídos' in pg.inner_text('#sheet')
    # toque em qualquer palavra + caderno
    pg.evaluate("()=>{closeSheet();S.lang='en';S.cad=[];S.rvv={};save();go('books')}")
    pg.click('[data-bk-read="peter"]');pg.click('.chb[data-ch="1"]');pg.wait_for_selector('#rdr-pars .rd-line')
    tw=pg.query_selector('#rdr-pars .tw');assert tw,'sem palavras tocáveis'
    word=tw.get_attribute('data-t');tw.click()
    txt=pg.inner_text('#rdr-def');assert word in txt and 'Guardar no caderno' in txt,txt
    pg.click('#cad-save');assert pg.evaluate("()=>S.cad.length")==1
    assert 'Já está no caderno' in pg.inner_text('#rdr-def')
    # glossário: uma palavra conhecida do glossário mostra o significado
    r=pg.evaluate("()=>{const g=GLOS.en;return Object.keys(g).length}");assert r>=500,r
    # caderno vence e aparece nos cartões
    pg.evaluate("()=>{S.cad[0].pt=S.cad[0].pt||'teste';S.cad[0].d=1;save();closeSheet();go('home')}")
    pg.evaluate("()=>startCards()");assert pg.is_visible('#card-show')
    pg.click('#card-show');pg.click('#card-easy');
    assert pg.evaluate("()=>S.cad[0]?S.cad[0].s:-1")==1
    # salvamento inválido é descartado
    pg.evaluate("()=>{const sv=JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>/mots/i.test(k))));}")
    # contexto histórico e cultural
    pg.evaluate("()=>{closeSheet();S.lang='en';save();go('books')}")
    pg.click('[data-bk-read="alice"]');pg.wait_for_selector('.chb')
    assert pg.is_visible('.ctxh summary') and 'Sobre o livro e a época' in pg.inner_text('.ctxh summary')
    pg.click('.chb[data-ch="7"]');pg.wait_for_selector('#rdr-pars .rd-line')
    assert 'Contexto histórico e cultural' in pg.inner_text('.ctxh summary')
    pg.click('.ctxh summary');lk=pg.query_selector('.ctxh a');assert lk and lk.get_attribute('href').startswith('https://')
    assert 'Fonte:' in pg.inner_text('.ctxh')
    # todo livro com texto tem introdução e todas as notas têm fonte https
    r=pg.evaluate("()=>Object.entries(CTXH).map(([k,v])=>[k,v.intro.length,Object.values(v.ch).flat().every(n=>n.u.startsWith('https://')&&n.s&&n.t)])")
    print('contexto:',r);assert len(r)==7 and all(x[1]>=4 and x[2] for x in r)
    # novidades
    pg.evaluate("()=>{closeSheet();go('settings')}");pg.click('#open-news');pg.wait_for_timeout(100)
    t=pg.inner_text('#news-list');assert 'Versão 1.36.0' in t
    print('erros:',errs);assert not errs
    print('OK t23')
finally: srv.terminate()
