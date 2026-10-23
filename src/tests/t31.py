"""Testa o «primeiro livrinho» na trilha e a Memória com as palavras em revisão.
Uso (na pasta src/):  python3 -I tests/t31.py"""
import subprocess,time,os
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8781','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_context(viewport={'width':390,'height':844}).new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
    pg.goto('http://localhost:8781/index.html');pg.wait_for_timeout(700)
    # trilha: livrinho cedo, sem repetir páginas
    info=pg.evaluate("""()=>{const L=lessonPath(),ids=L.map(r=>r.page.id),out={};
      out.dup=ids.length-new Set(ids).size;
      for(const l of ['en','fr','it']){const e=L.findIndex(r=>r.early&&r.page.langs&&r.page.langs.indexOf(l)>=0),
        last=L.length-1,fb=L.findIndex(r=>/^frases-livro/.test(r.page.id)&&r.page.langs.indexOf(l)>=0&&!r.early);
        out[l]=[e,fb,L.filter(r=>r.early&&r.page.langs&&r.page.langs.indexOf(l)>=0).map(r=>r.page.id)];}
      return out}""")
    assert info['dup']==0,info
    for l in ('en','fr','it'):
        e,fb,ids=info[l];assert e>0 and len(ids)>=4 and (fb<0 or e<fb),(l,info[l])
    assert any('leitura-peter-1' in i for i in info['en'][2]),info['en']
    # a Leitura inicial só abre depois de palavras suficientes
    r=pg.evaluate("()=>{S.lang='en';S.sk.en={};S.done={};const r=lessonPath().find(x=>x.page.id==='leitura-peter-1');const a=eligible(r);const sk={};Object.keys(vIdx().en).slice(0,40).forEach(k=>sk[k]=[1,0]);S.sk.en=sk;return [a,eligible(r)]}")
    assert r==[False,True],r
    # memória com palavras em revisão
    n=pg.evaluate("()=>{S.lang='en';S.done={};S.rvv={};const ws=Object.keys(DRAW.en).slice(0,6);ws.forEach(w=>S.rvv['en:v|'+w]=[Date.now()-5,0,0]);save();return memRevWords().length}")
    assert n==6,n
    pg.evaluate("()=>{closeSheet();startMemRev(memRevWords())}")
    assert 'Memória das palavras em revisão' in pg.inner_text('#g-title')
    # joga todos os pares
    pg.evaluate("""()=>{const m=memState();const ws=[...new Set(m.cards.map(c=>c.w))];window.__ws=ws}""")
    for w in pg.evaluate("()=>window.__ws"):
        idx=pg.evaluate("(w)=>memState().cards.map((c,i)=>c.w===w?i:-1).filter(i=>i>=0)",w)
        for i in idx:pg.click(f'.mcard[data-i="{i}"]')
        pg.wait_for_timeout(40)
    pg.wait_for_selector('#sheet:not([hidden])',timeout=3000)
    assert 'Página concluída' in pg.inner_text('#sheet-title')
    assert pg.evaluate("()=>!S.done['en:memoria-rev']"),'página virtual não deve contar como concluída'
    # fim do ciclo oferece a memória
    pg.evaluate("()=>{closeSheet();go('home');startCiclo()}")
    for i in range(6):
        c=pg.evaluate("()=>__ciclo().cur")
        if c is None:break
        if c['f']<2:pg.click('[data-cic-opt="%d"]'%c['a'])
        else:
            pg.fill('#cic-in',pg.evaluate("()=>__ciclo().cur.e.w"));pg.click('#cic-check')
        pg.click('#cic-next')
        if 'Ciclo concluído' in pg.inner_text('#sheet-title'):break
    assert pg.is_visible('#cic-mem'),pg.inner_text('#sheet')
    pg.click('#cic-mem');assert 'Memória das palavras em revisão' in pg.inner_text('#g-title')
    pg.evaluate("()=>go('home');openTrainMenu()");assert pg.is_visible('#train-mem')
    assert not errs,errs
    print('ok t31 errs',errs)
finally:
  srv.terminate()
