"""Testa o leitor de livro completo (capítulos, original + tradução, capítulo lido, recarregar).
Uso (na pasta src/):  python3 -I tests/t21.py"""
import subprocess,time,os
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8777','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_context(viewport={'width':390,'height':844}).new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
    pg.goto('http://localhost:8777/index.html');pg.wait_for_timeout(700)
    info=pg.evaluate("()=>BOOKTXT_INFO");print('livros com texto:',{k:(len(v['chs']),v['total']) for k,v in info.items()})
    assert 'peter' in info
    pg.evaluate("()=>{S.lang='en';save();go('books')}")
    assert pg.is_visible('[data-bk-read="peter"]');assert not pg.query_selector('[data-bk-read="pp"]')
    pg.click('[data-bk-read="peter"]');assert pg.is_visible('#s-reader') and pg.is_visible('.chb')
    assert 'Peter' in pg.inner_text('#rdr-title')
    pg.click('.chb[data-ch="1"]');pg.wait_for_selector('#rdr-pars .rd-line');n=pg.evaluate("()=>document.querySelectorAll('#rdr-pars .rd-line').length");print('parágrafos:',n);assert n==26
    assert not pg.query_selector('.rd-pt')
    pg.click('#rdr-pars .rd-tr');assert 'Era uma vez' in pg.inner_text('.rd-pt')
    pg.click('#rdr-pars .rd-tr');assert not pg.query_selector('.rd-pt')
    pg.click('#rdr-all');assert pg.evaluate("()=>document.querySelectorAll('.rd-pt').length")==26
    pg.click('#rdr-all');assert pg.evaluate("()=>document.querySelectorAll('.rd-pt').length")==0
    # palavra do vocabulário
    w=pg.query_selector('#rdr-pars .rw');assert w,'sem palavras do vocabulário';w.click();assert '=' in pg.inner_text('#rdr-def')
    # concluir capítulo
    pg.click('#rdr-done');pg.wait_for_timeout(100);assert pg.evaluate("()=>S.cap['peter-1']")==1
    pg.evaluate("()=>closeSheet()");pg.click('#rdr-list');assert pg.query_selector('.chb.ok')
    pg.reload();pg.wait_for_timeout(600);assert pg.evaluate("()=>S.cap['peter-1']")==1
    # lixo no salvamento é descartado
    pg.evaluate("()=>{S.cap={'peter-1':1,'../x':1,'a-b':1,'alice-12':1};save()}");pg.reload();pg.wait_for_timeout(600)
    assert sorted(pg.evaluate("()=>Object.keys(S.cap)"))==['alice-12','peter-1']
    # voltar
    pg.evaluate("()=>openReader('peter')");pg.click('#rdr-back');assert pg.is_visible('#s-books')
    # todos os livros com texto: cada capítulo abre e tem tradução em todos os parágrafos
    for bid,inf in info.items():
        lang=pg.evaluate("(i)=>BOOKS.find(b=>b.id===i).lang",bid);pg.evaluate("(l)=>{S.lang=l;save()}",lang)
        for c in inf['chs']:
            pg.evaluate("([i,n])=>openReader(i,n)",[bid,c['n']]);pg.wait_for_selector('#rdr-pars .rd-line',timeout=5000)
            bad=pg.evaluate("()=>RK0()") if False else pg.evaluate("()=>readerState().data.p.filter(x=>!x[0].trim()||!x[1].trim()).length")
            assert bad==0,(bid,c['n'])
    assert not errs,errs
    print('OK t21')
finally:
  srv.terminate()
