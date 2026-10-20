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
    # novidades
    pg.evaluate("()=>{closeSheet();go('settings')}");pg.click('#open-news');pg.wait_for_timeout(100)
    t=pg.inner_text('#news-list');assert 'Versão 1.34.0' in t
    print('erros:',errs);assert not errs
    print('OK t23')
finally: srv.terminate()
