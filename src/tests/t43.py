"""Testa (v1.73): Lição do Jardim por tema, marcadores de estágio e novo layout do jardim.
Uso (na pasta src/):  python3 -I tests/t43.py"""
import subprocess,time,os
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8787','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_context(viewport={'width':390,'height':844}).new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8787/index.html');pg.wait_for_timeout(1200)
    for l in ['fr','it','en']:
        n=pg.evaluate("(l)=>VOLUME3.pages.filter(p=>p.type==='jardim'&&p.tema&&p.langs[0]===l).length",l);assert n>=20,(l,n)
        assert pg.evaluate("(l)=>VOLUME3.pages.filter(p=>p.type==='jardim'&&p.tema&&p.langs[0]===l).every(p=>!p.rd&&p.themes.length===1&&p.sub)",l)
        pg.evaluate("(l)=>{S.lang=l;S.vol=3;S.done={};save();closeSheet();startPage(window.nextJardimTema().id)}",l);pg.wait_for_timeout(250)
        t=pg.inner_text('#gstage');assert 'Tema:' in t and 'Começar' in t,t[:200]
        assert ('Frases' in t) and ('sem fonte conferida' in t or 'Wikcionário' in t)
        for i in range(6):
            pg.click('[data-jd=next]') if pg.locator('[data-jd=next]').count() else None
        pg.wait_for_timeout(100)
    # marcadores de estágio: sem sublinhado duplo/grosso, com ::after
    css=pg.evaluate("()=>{const e=document.createElement('button');e.className='rw k gs2';document.body.appendChild(e);const s=getComputedStyle(e,'::after').content,bb=getComputedStyle(e).borderBottomStyle;e.remove();return [s,bb]}")
    assert css[0] not in ('none','normal','""'),css
    assert css[1]=='solid',css
    # jardim: tiles, barras e canteiros
    pg.evaluate("()=>{S.lang='fr';const c=Object.keys(VOCAB.fr).filter(c=>!BOOKCAT[c])[0];VOCAB.fr[c].slice(0,4).forEach(e=>skRec(e.w,e.pt,true));save();go('garden')}");pg.wait_for_timeout(300)
    assert pg.locator('.gd-tile').count()==4 and pg.locator('.gd-bed .gd-stack').count()>=1 and pg.locator('.gd-emptybeds').count()==1
    assert pg.locator('.gd-pl').count()==4
    # botão de tema em Treino
    pg.evaluate("()=>{go('home');openTrainMenu()}");assert pg.locator('#train-garden-t').count()==1
    pg.click('#train-garden-t');pg.wait_for_timeout(300)
    assert pg.evaluate("()=>P&&P.type==='jardim'&&!!P.tema")
    assert errs==[],errs
    print('t43 ok')
finally:
  srv.terminate()
