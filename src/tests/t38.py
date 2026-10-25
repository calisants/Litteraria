"""Testa (v1.68): tela «Meu jardim» (estágios, canteiros, folha da planta, regar, estado vazio).
Uso (na pasta src/):  python3 -I tests/t38.py"""
import subprocess,time,os
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8788','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_context(viewport={'width':390,'height':844}).new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8788/index.html');pg.wait_for_timeout(1200)
    # vazio
    pg.click('#go-garden');pg.wait_for_timeout(300)
    assert pg.locator('#s-garden').is_visible() and pg.locator('.gd-empty').count()==1
    assert pg.locator('.gd-pl').count()==0
    # com palavras: uma em cada estágio, uma murcha
    pg.evaluate("""()=>{S.lang='fr';const ws=VOCAB.fr.saudacoes.slice(0,5).map(e=>e.w.toLowerCase());window.__ws=ws;
      const t=Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5);
      S.sk.fr=S.sk.fr||{};ws.forEach(w=>{S.sk.fr[w]=[1,0,'x'];});
      S.gd['fr:'+ws[0]]=[0,0,0,0,0,t,-1];S.gd['fr:'+ws[1]]=[1,t,1,1,0,t,0];S.gd['fr:'+ws[2]]=[2,t,3,2,0,t,0];S.gd['fr:'+ws[3]]=[3,t,15,5,0,t,0];S.gd['fr:'+ws[4]]=[2,t-9,3,2,1,t,0];save();go('garden');}""")
    pg.wait_for_timeout(300)
    assert pg.locator('.gd-pl').count()==5,pg.locator('.gd-pl').count()
    for cls in ['gd0','gd1','gd2','gd3','wilted']:
      assert pg.locator('.gd-pl .'+cls).count()>=1,cls
    assert pg.locator('#gd-water').count()==1
    # folha da planta: flor mostra frase de exemplo ou dica; sombra mostra como crescer
    pg.locator('.gd-pl').first.click();pg.wait_for_timeout(200)
    assert pg.locator('#sheet').is_visible() and 'Como cresce' in pg.inner_text('#sheet-in')
    pg.click('#sheet-close')
    pg.screenshot(path='gd_shot.png')
    # visitantes: 3 flores/frutos = 1 borboleta
    assert 'uma borboleta' in pg.inner_text('.gd-vis') and 'abelha' in pg.inner_text('.gd-vis')
    # regar uma palavra só: a semente (4ª planta) acerta e sobe de estágio no registro
    w=pg.locator('.gd-pl').nth(3).locator('.gd-w').inner_text()
    pg.locator('.gd-pl').nth(3).click();pg.wait_for_timeout(200)
    pg.click('[data-gdw=start]');pg.fill('#gd-in',w);pg.click('[data-gdw=ok]');pg.wait_for_timeout(200)
    assert 'Certo' in pg.inner_text('#gd-res'),pg.inner_text('#gd-res')
    sk=pg.evaluate("(w)=>S.sk.fr[w.toLowerCase()]",w);assert sk[0]>=2,sk
    pg.click('#sheet-close')
    # errar: dá a resposta e põe na fila
    w0=pg.locator('.gd-pl').nth(4).locator('.gd-w').inner_text()
    pg.locator('.gd-pl').nth(4).click();pg.wait_for_timeout(200)
    pg.click('[data-gdw=start]');pg.fill('#gd-in','zzzz');pg.click('[data-gdw=ok]');pg.wait_for_timeout(200)
    assert 'Quase' in pg.inner_text('#gd-res')
    assert pg.evaluate("(w)=>!!S.rvv['fr:v|'+w.toLowerCase()]",w0)
    pg.click('#sheet-close')
    # trocar de idioma muda o jardim
    pg.evaluate("()=>{S.lang='en';go('garden');}");pg.wait_for_timeout(200)
    assert pg.locator('.gd-pl').count()==0
    assert not errs,errs
    print('t38 ok');b.close()
finally:
  srv.terminate()
