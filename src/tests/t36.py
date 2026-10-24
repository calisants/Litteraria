"""Testa (v1.66): instalar o app (cartão na tela inicial, botão em Ajustes, evento beforeinstallprompt, app já instalado).
Uso (na pasta src/):  python3 -I tests/t36.py"""
import subprocess,time,os
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8786','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch()
    # 1) navegador automatizado sem __instTest: cartão escondido; botão em Ajustes existe
    ctx=b.new_context(viewport={'width':390,'height':844});pg=ctx.new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8786/index.html');pg.wait_for_timeout(1200)
    assert pg.evaluate("()=>document.getElementById('inst-card').hidden")
    pg.evaluate("()=>{go('settings');document.querySelectorAll('details').forEach(d=>d.open=true);}")
    assert pg.locator('#open-install').is_visible()
    pg.click('#open-install');pg.wait_for_timeout(300)
    assert 'Chrome' in pg.inner_text('body') or 'Edge' in pg.inner_text('body')
    # 2) com __instTest e beforeinstallprompt: cartão aparece, «Instalar o app» chama prompt()
    ctx2=b.new_context(viewport={'width':390,'height':844});ctx2.add_init_script("window.__instTest=1")
    p2=ctx2.new_page();p2.on('pageerror',lambda e:errs.append(str(e)))
    p2.goto('http://localhost:8786/index.html');p2.wait_for_timeout(1200)
    p2.evaluate("""()=>{window.__pc=0;const e=new Event('beforeinstallprompt');e.prompt=()=>{window.__pc++};e.userChoice=Promise.resolve({outcome:'dismissed'});window.dispatchEvent(e);}""")
    assert not p2.evaluate("()=>document.getElementById('inst-card').hidden")
    assert p2.inner_text('#inst-go')=='Instalar o app'
    p2.click('#inst-go');p2.wait_for_timeout(300)
    assert p2.evaluate("()=>window.__pc")==1
    # «Agora não» esconde e lembra
    p2.evaluate("()=>window.__instPaint()")
    p2.evaluate("()=>{const e=new Event('beforeinstallprompt');e.prompt=()=>{};e.userChoice=Promise.resolve({});window.dispatchEvent(e);}")
    p2.click('#inst-later');assert p2.evaluate("()=>document.getElementById('inst-card').hidden")
    p2.reload();p2.wait_for_timeout(1200);assert p2.evaluate("()=>document.getElementById('inst-card').hidden")
    # 3) app já instalado: nem cartão nem botão
    ctx3=b.new_context(viewport={'width':390,'height':844});ctx3.add_init_script("window.__instTest=1;window.__instStandalone=true")
    p3=ctx3.new_page();p3.goto('http://localhost:8786/index.html');p3.wait_for_timeout(1200)
    assert p3.evaluate("()=>document.getElementById('inst-card').hidden")
    assert p3.evaluate("()=>document.getElementById('open-install').hidden")
    assert not errs,errs
    print('t36 ok')
    b.close()
finally:
  srv.terminate()
