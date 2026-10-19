"""Testa: tradução Natural/Literal no leitor; Intruso sem tradução antes da resposta; dica nas citações; revisão espaçada das citações erradas.
Uso (na pasta src/):  python3 -I tests/t22.py"""
import subprocess,time,os
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8778','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_context(viewport={'width':390,'height':844}).new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
    pg.goto('http://localhost:8778/index.html');pg.wait_for_timeout(700)
    # --- leitor: Natural / Literal ---
    pg.evaluate("()=>{S.lang='en';S.trad='lit';save();go('books')}")
    pg.evaluate("()=>openReader('alice',1)");pg.wait_for_selector('#rdr-pars .rd-line')
    assert pg.is_visible('#rdr-mode') and 'Literal' in pg.inner_text('#rdr-mode')
    pg.click('#rdr-pars .rd-tr');lit=pg.inner_text('.rd-pt')
    pg.click('#rdr-mode');assert 'Natural' in pg.inner_text('#rdr-mode');nat=pg.inner_text('.rd-pt')
    print('LIT:',lit[:90]);print('NAT:',nat[:90]);assert lit!=nat
    assert pg.evaluate("()=>S.trad")=='nat'
    pg.reload();pg.wait_for_timeout(600);assert pg.evaluate("()=>S.trad")=='nat'
    pg.evaluate("()=>{localStorage.setItem('x','1')}")
    # valor inválido é descartado
    pg.evaluate("()=>{S.trad='zzz';save()}");pg.reload();pg.wait_for_timeout(600);assert pg.evaluate("()=>S.trad")=='lit'
    # todo capítulo com literal: mesma contagem e nenhum parágrafo vazio
    info=pg.evaluate("()=>BOOKTXT_INFO");tot=0
    for bid in ['perrault','grimm','alice','principe','racconti']:
        lang=pg.evaluate("(i)=>BOOKS.find(b=>b.id===i).lang",bid);pg.evaluate("(l)=>{S.lang=l;save()}",lang)
        for c in info[bid]['chs']:
            pg.evaluate("([i,n])=>openReader(i,n)",[bid,c['n']]);pg.wait_for_selector('#rdr-pars .rd-line',timeout=5000)
            r=pg.evaluate("()=>readerState().data.p.filter(x=>/\\p{L}/u.test(x[0])).filter(x=>!x[2]||!x[2].trim()).length")
            assert r==0,(bid,c['n']);tot+=1
    print('capítulos com literal conferidos:',tot)
    # --- Intruso sem tradução ---
    pg.evaluate("()=>{S.lang='fr';S.vol=1;save();syncPrefs();go('vol')}")
    oid=pg.evaluate("()=>VOLUME.pages.find(p=>p.type==='odd'&&(!p.langs||p.langs.includes('fr'))).id")
    pg.evaluate("(i)=>startPage(i)",oid);pg.wait_for_timeout(250)
    assert pg.evaluate("()=>[...document.querySelectorAll('#ostage .otile small')].every(s=>s.textContent.trim()==='')")
    # --- Citação: tradução só com dica ---
    cid=pg.evaluate("()=>VOLUME.pages.find(p=>p.type==='citacao'&&p.langs[0]==='en').id")
    pg.evaluate("(a)=>{S.lang='en';S.qrv={};save();S.vol=1;syncPrefs();go('vol');startPage(a)}",cid);pg.wait_for_timeout(250)
    assert not pg.query_selector('#gstage .prompt'),'tradução apareceu sem dica'
    pg.click('#qz-hint');assert 'dica' in pg.inner_text('#gstage .prompt').lower()
    # erra de propósito: entra na revisão
    q=pg.evaluate("()=>{const s=quizState();const q=s.qs[s.i];return {ans:q.ans,opts:q.opts,id:q.p.id}}")
    wrong=[i for i,o in enumerate(q['opts']) if o!=q['ans']][0]
    pg.click('#gstage .opt[data-o="%d"]'%wrong);pg.wait_for_timeout(100)
    assert q['id'] in pg.evaluate("()=>Object.keys(S.qrv)"),'frase errada não entrou na revisão'
    # revisão só volta quando vence
    pg.evaluate("()=>{const k=Object.keys(S.qrv)[0];S.qrv[k][0]=Date.now()-1000;save()}")
    n0=pg.evaluate("(a)=>{startPage(a);return quizState().qs.length}",cid);print('perguntas com revisão:',n0)
    assert n0==pg.evaluate("()=>VOLUME.pages.find(p=>p.type==='citacao'&&p.langs[0]==='en').qs.length")+(0 if q['id'] in pg.evaluate("()=>VOLUME.pages.find(p=>p.type==='citacao'&&p.langs[0]==='en').qs") else 1)
    # lixo no salvamento é descartado
    pg.evaluate("()=>{S.qrv={'../x':[1,1],'a:1':[5,0],'b:2':'x'};save()}");pg.reload();pg.wait_for_timeout(600)
    assert sorted(pg.evaluate("()=>Object.keys(S.qrv)"))==['a:1']
    assert not errs,errs
    print('OK t22')
finally:
  srv.terminate()
