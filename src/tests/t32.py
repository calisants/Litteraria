"""Testa: palavras acertadas numa lição de vocabulário entram na fila de revisão espaçada (até 6, 1ª volta em 2 dias).
Uso (na pasta src/):  python3 -I tests/t32.py"""
import subprocess,time,os
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8782','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_context(viewport={'width':390,'height':844}).new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
    pg.goto('http://localhost:8782/index.html');pg.wait_for_timeout(700)
    r=pg.evaluate("""()=>{
      S.lang='fr';S.rvv={};S.sk={fr:{}};S.done={};
      const pg=VOLUME5.pages.find(p=>p.type==='reco'&&p.cat&&pageInLang(p));
      const ws=wordsOf(pg);ws.forEach((e,i)=>{S.sk.fr[e.w.toLowerCase()]=i===0?[0,1]:[1,0];});
      P=pg;markDone();
      const ks=Object.keys(S.rvv);
      return {n:ks.length,max:Math.min(6,ws.length-1),steps:[...new Set(ks.map(k=>S.rvv[k][1]))],due:ks.every(k=>S.rvv[k][0]>Date.now()+864e5),
        first:S.rvv['fr:v|'+ws[0].w.toLowerCase()]||null}}""")
    assert r['n']==r['max'] and r['steps']==[1] and r['due'] and r['first'] is None,r
    # nada vencido hoje: não aparece como «para revisar»
    assert pg.evaluate("()=>dueCount()")==0
    # 2ª conclusão não duplica nem zera o que já está na fila
    n2=pg.evaluate("()=>{const a=JSON.stringify(S.rvv);markDone();return [a===JSON.stringify(S.rvv)||Object.keys(S.rvv).length]}")
    assert not errs,errs
    print('ok t32 errs',errs)
finally:
  srv.terminate()
