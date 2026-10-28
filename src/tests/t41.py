"""Testa (v1.71): Gênero das palavras, Ditado de frases e Só 5 minutos.
Uso (na pasta src/):  python3 -I tests/t41.py"""
import subprocess,time,os
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8787','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_context(viewport={'width':390,'height':844}).new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8787/index.html');pg.wait_for_timeout(1200)
    info=pg.evaluate("""()=>{const o={};for(const l of ['fr','it','en']){o[l]={g:VOLUME.pages.filter(p=>p.type==='genero'&&p.langs[0]===l).length,d:VOLUME.pages.filter(p=>p.type==='ditado'&&p.langs[0]===l).length};}return o}""")
    assert info['fr']['g']>=20 and info['it']['g']>=20 and info['en']['g']==0,info
    assert info['fr']['d']>=15 and info['it']['d']>=15 and info['en']['d']>=15,info
    # Gênero: acerta tudo no francês
    pg.evaluate("()=>{S.lang='fr';S.done={};save();startPage('genero-fr-1')}");pg.wait_for_timeout(300)
    n=pg.evaluate("()=>__gnState().items.length");assert n>=10,n
    for i in range(n):
        art=pg.evaluate("()=>{const g=__gnState();return ART_OF(g)}") if False else pg.evaluate("()=>{const g=__gnState();return ['le','la'].indexOf(g.items[g.i].a)}")
        pg.click('[data-g="%d"]'%art);pg.click('#gn-next')
    assert 'Página concluída' in pg.inner_text('#sheet-title'),pg.inner_text('#sheet-title')
    assert pg.evaluate("()=>S.done['fr:genero-fr-1']===1")
    assert pg.evaluate("()=>Object.keys(S.sk.fr||{}).length")==0   # acertos não contam como palavra conhecida
    # erro vai para sk
    pg.evaluate("()=>{closeSheet();S.done={};startPage('genero-fr-2')}");pg.wait_for_timeout(200)
    wrong=pg.evaluate("()=>{const g=__gnState();return ['le','la'].indexOf(g.items[g.i].a)===0?1:0}")
    pg.click('[data-g="%d"]'%wrong);assert pg.evaluate("()=>Object.keys(S.sk.fr||{}).length")==1
    # Ditado: acento faltando conta como certo com aviso
    pg.evaluate("()=>{closeSheet();S.lang='fr';S.done={};startPage('ditado-fr-1')}");pg.wait_for_timeout(200)
    typ=pg.evaluate("()=>{const d=__dtState();return d.items[d.i].s}")
    pg.fill('#dt-in',typ.replace('é','e').replace('è','e').replace('ç','c'));pg.click('#dt-ok')
    assert pg.evaluate("()=>__dtState().res") in ('ok','acc')
    pg.click('#dt-next');pg.fill('#dt-in','zzz');pg.click('#dt-ok');assert pg.evaluate("()=>__dtState().res")=='bad'
    pg.evaluate("()=>closeSheet()")
    # Ditado sem áudio: mostrar a frase
    pg.click('#dt-next');pg.click('#dt-show');assert pg.locator('.qz-s').count()==1
    # Só 5 minutos nos 3 idiomas
    for l in ['fr','it','en']:
        pg.evaluate("(l)=>{S.lang=l;S.done={};S.rvv={};save();go('home');openTrainMenu()}",l)
        assert pg.locator('#train-five').count()==1
        pg.click('#train-five');pg.wait_for_selector('#f5')
        steps=pg.evaluate("()=>__f5State().st.map(s=>s.k).join('')");assert steps.startswith('mmm') and steps.endswith('d') and len(steps)==6,(l,steps)
        for i in range(6):
            k=pg.evaluate("()=>{const f=__f5State();return f.st[f.i].k}")
            if k=='m':
                pg.click('[data-f5o="0"]')
            elif k=='g':
                pg.click('[data-f5g="0"]')
            else:
                pg.fill('#f5-in','zzz');pg.click('#f5-ok')
            pg.click('#f5-next')
        assert 'Sessão concluída' in pg.inner_text('#f5')
        pg.click('#f5-close')
    assert not errs,errs
    print('t41 ok');b.close()
finally:
  srv.terminate()
