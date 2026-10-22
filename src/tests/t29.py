"""Testa v1.46: toque no chip de pontos abre o painel (não o perfil) com pontos fortes e fracos.
Uso (na pasta src/):  python3 -I tests/t29.py"""
import subprocess,time,os
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8784','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch();ctx=b.new_context(viewport={'width':390,'height':844});pg=ctx.new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8784/index.html');pg.wait_for_timeout(700)
    pg.evaluate("()=>{S.gam.on=true;S.lang='en';save();go('home');renderGam()}")
    pg.click('#gam-chip');pg.wait_for_timeout(300)
    assert pg.evaluate("()=>document.querySelector('#s-profile').hidden")==True, 'abriu o perfil'
    t=pg.inner_text('body').lower()
    assert 'pontos fortes e fracos' in t and 'ainda há pouco dado' in t
    pg.keyboard.press('Escape')
    # com dados: dois temas, um forte e um fraco
    pg.evaluate("""()=>{const ths=Object.keys(VOCAB.en);const sk=S.sk.en={};
      ths.slice(0,2).forEach((t,i)=>VOCAB.en[t].slice(0,4).forEach(it=>{sk[it.w.toLowerCase()]=i?[1,5,'x']:[6,0,'x'];}));save();}""")
    pg.evaluate("()=>{S.gs.en={artigos:[9,1],plural:[1,7],presente:[8,2]};save()}")
    pg.evaluate("()=>openGam()");pg.wait_for_timeout(200)
    t=pg.inner_text('body').lower()
    assert 'vocabulário · vai bem' in t and 'gramática · precisa de reforço' in t and 'plural' in t and 'você vai bem em' not in t and 'precisa de reforço' in t and 'treinar o que preciso' in t
    pg.click('#gam-train');pg.wait_for_timeout(300)
    # jogar de verdade uma página de gramática registra em S.gs
    pg.evaluate("()=>closeSheet()")
    pg.evaluate("()=>{S.gs={};S.lang='en';save();const p=VOLUME4.pages.find(x=>x.type==='artigos'&&pageInLang(x));startLesson({vol:4,page:p});}");pg.wait_for_timeout(400)
    pg.click('#gstage .lopt');pg.click('#gm-submit');pg.wait_for_timeout(200)
    gs=pg.evaluate("()=>JSON.stringify(S.gs)");assert 'artigos' in gs,gs
    print('errs',errs);assert not errs
    b.close()
finally:
  srv.terminate()
print('OK t29')
