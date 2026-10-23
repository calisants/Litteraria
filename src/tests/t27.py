"""Testa o aviso de atualização na 1ª abertura depois de uma versão nova.
Uso (na pasta src/):  python3 -I tests/t27.py"""
import subprocess,time,os
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8780','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch();ctx=b.new_context(viewport={'width':390,'height':844},service_workers='block');pg=ctx.new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8780/index.html');pg.wait_for_timeout(600)
    assert not pg.query_selector('#upd-note'),'1º uso não mostra aviso'
    cur=pg.evaluate("()=>APP_REL.v");assert pg.evaluate("()=>localStorage.getItem('mots-parole-lastver')")==cur
    pg.reload();pg.wait_for_timeout(500);assert not pg.query_selector('#upd-note'),'mesma versão não mostra'
    pg.evaluate("()=>localStorage.setItem('mots-parole-lastver','0.0.1')");pg.reload();pg.wait_for_timeout(500)
    assert pg.is_visible('#upd-note') and cur in pg.inner_text('#upd-note')
    pg.click('#upd-close');assert not pg.query_selector('#upd-note')
    pg.reload();pg.wait_for_timeout(500);assert not pg.query_selector('#upd-note'),'não volta depois de fechar'
    pg.evaluate("()=>localStorage.setItem('mots-parole-lastver','0.0.1')");pg.reload();pg.wait_for_timeout(500)
    pg.click('#upd-read');assert pg.is_visible('#s-news') and not pg.query_selector('#upd-note')
    # v1.52.1: sair do app sem tocar nos botões não faz o aviso voltar
    pg.evaluate("()=>localStorage.setItem('mots-parole-lastver','0.0.1')");pg.reload();pg.wait_for_timeout(500)
    assert pg.is_visible('#upd-note');pg.reload();pg.wait_for_timeout(500);assert not pg.query_selector('#upd-note'),'não volta se só saiu e voltou'
    # v1.52.1: aviso de mudança de endereço (só no endereço antigo)
    assert not pg.query_selector('#move-note'),'em localhost não aparece'
    pg.add_init_script("window.__moveTest=true")
    pg.evaluate("()=>localStorage.removeItem('mots-parole-move')");pg.reload();pg.wait_for_timeout(900)
    assert pg.is_visible('#move-note') and 'litteraria.com.br' in pg.inner_text('#move-note')
    pg.click('#move-later');assert not pg.query_selector('#move-note')
    pg.reload();pg.wait_for_timeout(900);assert not pg.query_selector('#move-note'),'adiado: não volta no mesmo dia'
    pg.evaluate("()=>localStorage.removeItem('mots-parole-move')");pg.reload();pg.wait_for_timeout(900)
    with pg.expect_download() as d: pg.click('#move-bk')
    assert d.value.suggested_filename.startswith('litteraria-progresso-')
    assert pg.evaluate("()=>localStorage.getItem('mots-parole-move')")=='ok'
    pg.click('#move-later');pg.reload();pg.wait_for_timeout(900);assert not pg.query_selector('#move-note'),'backup feito: não volta'
    # usuário antigo (tem progresso, não tem a marca)
    pg.evaluate("()=>{localStorage.removeItem('mots-parole-lastver');save()}");pg.reload();pg.wait_for_timeout(500)
    assert pg.is_visible('#upd-note'),'usuário antigo deve ver o aviso'
    print('erros:',errs);assert not errs;print('OK t27')
finally: srv.terminate()
