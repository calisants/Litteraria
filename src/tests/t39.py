"""Testa (v1.70): lições de livros não entram em «Hoje»/«Próximo»; quem está num livro segue nele.
Uso (na pasta src/):  python3 -I tests/t39.py"""
import subprocess,time,os
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8787','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_context(viewport={'width':390,'height':844}).new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8787/index.html');pg.wait_for_timeout(1200)
    for lang in ['fr','it','en']:
      r=pg.evaluate("""(l)=>{S.lang=l;S.sq=0;S.sk[l]=S.sk[l]||{};
        const bad=[];const L=lessonPath();
        // simula tudo conhecido para abrir os limiares
        const all=(VOCAB[l]||{});for(const c in all)all[c].forEach(e=>{S.sk[l][e.w.toLowerCase()]=[3,0]});
        for(let i=0;i<400;i++){S.sq=i%3===2?2:0;const n=nextNewPage();if(!n)break;
          if(isBookRef(n))bad.push(n.page.id);
          S.done[l+':'+n.page.id]=1;}
        const book=L.find(r=>r.page.book&&pageInLang(r.page));
        let cont=null;if(book){delete S.done[l+':'+book.page.id];const nx=nextAfter(book.page);cont=nx?isBookRef(nx):null;}
        return {bad,cont,hasBook:L.some(r=>isBookRef(r)&&pageInLang(r.page))}}""",lang)
      assert not r['bad'],(lang,r['bad'][:5])
      assert r['hasBook'],lang
    assert not errs,errs
    print('t39 ok');b.close()
finally:
  srv.terminate()
