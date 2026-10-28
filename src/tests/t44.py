"""Testa (v1.74): compartilhar o jardim por link/imagem e a tela de quem recebe.
Uso (na pasta src/):  python3 -I tests/t44.py"""
import subprocess,time,os,re
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8787','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch();ctx=b.new_context(viewport={'width':390,'height':844},permissions=['clipboard-read','clipboard-write']);pg=ctx.new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8787/index.html');pg.wait_for_timeout(1200)
    # jardim vazio: avisa
    pg.evaluate("()=>{S.lang='fr';S.gd={};S.sk={};save();go('garden')}");pg.wait_for_timeout(300)
    assert pg.locator('#gd-share').count()==1
    pg.click('#gd-share');pg.wait_for_timeout(200)
    assert 'ainda é só terra' in pg.inner_text('#sheet'),pg.inner_text('#sheet')[:200]
    pg.evaluate("()=>closeSheet()")
    # com plantas
    pg.evaluate("()=>{S.lang='fr';const c=Object.keys(VOCAB.fr).filter(c=>!BOOKCAT[c])[0];VOCAB.fr[c].slice(0,5).forEach(e=>skRec(e.w,e.pt,true));save();go('garden')}");pg.wait_for_timeout(300)
    pg.click('#gd-share');pg.wait_for_timeout(250)
    assert pg.locator('#jc-name').count()==1 and pg.locator('#jc-share').count()==1
    pg.fill('#jc-name','Ana <b>x</b>')
    pg.click('#jc-copy');pg.wait_for_timeout(200)
    link=pg.evaluate("()=>navigator.clipboard.readText()");assert '?jardim=' in link,link
    o=pg.evaluate("(q)=>window.__jardimParse(q)",link.split('?jardim=')[1]);assert o and o['l']=='fr' and sum(o['c'])>=5 and o['n']=='Ana bx/b',o
    assert '<' not in o['n'] and '>' not in o['n']
    # compartilhar sem Web Share copia texto + link
    pg.click('#jc-share');pg.wait_for_timeout(200)
    t=pg.evaluate("()=>navigator.clipboard.readText()");assert 'jardim de francês' in t and '?jardim=' in t,t
    # imagem
    with pg.expect_download() as d: pg.click('#jc-img')
    assert d.value.suggested_filename.endswith('.png')
    pg.evaluate("()=>closeSheet()")
    # link inválido não abre nada
    for bad in ['xxxx','eyJ2IjoyfQ','e30']:
        pg2=ctx.new_page();pg2.goto('http://localhost:8787/index.html?jardim='+bad);pg2.wait_for_timeout(900)
        assert 'Quero fazer o meu jardim' not in pg2.inner_text('body');assert 'jardim=' not in pg2.url;pg2.close()
    # link válido: quem recebe vê, sem mexer no progresso
    ctx2=b.new_context(viewport={'width':390,'height':844});pg3=ctx2.new_page();e3=[];pg3.on('pageerror',lambda e:e3.append(str(e)))
    pg3.goto('http://localhost:8787/index.html?jardim='+link.split('?jardim=')[1]);pg3.wait_for_timeout(1000)
    assert pg3.locator('#jv-start').count()==1 and 'Jardim de Ana' in pg3.inner_text('#sheet'),pg3.inner_text('body')[:300]
    assert 'jardim=' not in pg3.url
    assert pg3.evaluate("()=>Object.keys(S.gd||{}).length")==0
    pg3.click('#jv-start');pg3.wait_for_timeout(300)
    assert e3==[],e3
    assert errs==[],errs
    print('t44 ok')
finally:
  srv.terminate()
