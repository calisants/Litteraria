"""Testa: frase de contexto (passo 2), botão Próximo, negrito no lugar de « », botão Ampliar do jogo.
Uso (na pasta src/):  python3 -I tests/t19.py"""
import subprocess,time,os
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8776','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_context(viewport={'width':390,'height':844}).new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
    pg.goto('http://localhost:8776/index.html');pg.wait_for_timeout(700)
    # 1) cobertura: toda palavra de CATS tem frase (Wikcionário ou Claude)
    miss=pg.evaluate("""()=>{const o={};for(const l of ['fr','it','en']){S.lang=l;o[l]=[];CATS.forEach(c=>VOCAB[l][c[0]].forEach(e=>{if(!ctxFor(e))o[l].push(e.w)}))}return o}""")
    print('sem frase:',miss);assert all(not v for v in miss.values())
    # 2) a palavra aparece uma vez como lacuna e o enunciado não a revela
    for l in ('fr','it','en'):
        r=pg.evaluate("""(l)=>{S.lang=l;let bad=[];CATS.forEach(c=>VOCAB[l][c[0]].forEach(e=>{const it=itemContexto(e);const g=it.q.split('\\n')[1];const re=new RegExp('(^|[^\\\\p{L}\\\\p{N}])'+e.w.replace(/[.*+?^${}()|[\\]\\\\]/g,'\\\\$&')+'(?![\\\\p{L}\\\\p{N}])','iu');if(!/_____/.test(g)||re.test(g))bad.push(e.w)}));return bad}""",l)
        assert not r,(l,r[:10])
    # 3) jogar uma página de contexto (digitando a resposta certa) e usar o Próximo
    pg.evaluate("()=>{S.lang='fr';S.done={};S.sk={};S.vol=5;save();syncPrefs();go('vol');_path=null;startPage('contexto-pessoas-1')}");pg.wait_for_timeout(300)
    n=pg.evaluate("()=>gm.items.length");assert n>=3
    for i in range(n):
        ans=pg.evaluate("()=>gm.items[gm.i].ok[0]")
        pg.fill('#gm-typed',ans);pg.click('#gm-submit');pg.wait_for_timeout(60)
        assert pg.evaluate("()=>gm.solved"),i
        pg.click('#gm-next');pg.wait_for_timeout(60)
    assert pg.is_visible('#sheet-next'),'Próximo deveria aparecer'
    nx=pg.evaluate("()=>nextAfter(P).page.id");print('próxima depois do contexto:',nx)
    pg.click('#sheet-next');pg.wait_for_timeout(300)
    assert pg.evaluate("()=>P.id")==nx and not pg.is_visible('#sheet') and pg.is_visible('#s-game')
    # 4) sem « » na tela; negrito de verdade
    pg.evaluate("()=>{S.lang='fr';startPage('conheca-pessoas-1')}");pg.wait_for_timeout(250)
    h=pg.inner_html('#gstage');t=pg.inner_text('#gstage');assert '«' not in t and '»' not in t,t[:200];assert '<b>' in h
    # 5) Ampliar no jogo: mudar o estado ao tocar
    pg.evaluate("()=>{S.lang='fr';S.vol=1;save();syncPrefs();go('vol');startPage('cross-pessoas-easy')}");pg.wait_for_timeout(300)
    assert pg.is_visible('#zoom-toggle')
    a=pg.evaluate("()=>ZOOM");pg.click('#zoom-toggle');pg.wait_for_timeout(100)
    assert pg.evaluate("()=>ZOOM")!=a
    print('erros:',errs);assert not errs
    b.close()
finally:
  srv.terminate()
print('t19 ok')
