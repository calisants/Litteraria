"""Testa (v1.67): ordem das lições dentro de cada tema (Conheça > Reconheça > Complete > Embaralhe > Caça-palavras > Cruzadas > Escreva > Frase).
Uso (na pasta src/):  python3 -I tests/t37.py"""
import subprocess,time,os
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8787','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
ORD=['conheca','reco','completar','embaralhar','search','cross','escreva','contexto']
try:
  with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_context(viewport={'width':390,'height':844}).new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8787/index.html');pg.wait_for_timeout(1200)
    for lang in ['fr','it','en']:
      r=pg.evaluate("""(l)=>{S.lang=l;window._path=null;try{_path=null}catch(e){};const L=lessonPath();const first=L.find(r=>r.voc&&r.page.cat);const cat=first.page.cat;
        return L.filter(r=>r.page.cat===cat&&!r.early).map(r=>r.page.type)}""",lang)
      idx=[ORD.index(t) for t in r if t in ORD]
      assert idx==sorted(idx),(lang,r)
      assert set(ORD[:-1])<=set(r),(lang,r)
    assert not errs,errs
    print('t37 ok');b.close()
finally:
  srv.terminate()
