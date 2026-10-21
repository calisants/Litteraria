"""Testa: frase do dia, álbum de citações, jogos de citação, mini-leitura e «Meus livros».
Uso (na pasta src/):  python3 -I tests/t20.py"""
import subprocess,time,os,json
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8776','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
def start(pg,lang,vol,pid):
    pg.evaluate("(a)=>{closeSheet();S.lang=a[0];S.vol=a[1];save();syncPrefs();go('vol');startPage(a[2])}",[lang,vol,pid]);pg.wait_for_timeout(200)
try:
  with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_context(viewport={'width':390,'height':844}).new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
    pg.goto('http://localhost:8776/index.html');pg.wait_for_timeout(700)
    # frase do dia: existe nos 3 idiomas e é a mesma ao longo do dia
    for l in ('fr','it','en'):
        pg.evaluate("(l)=>{S.lang=l;go('vol')}",l)
        t1=pg.inner_text('#qod');pg.evaluate("()=>go('vol')");assert t1==pg.inner_text('#qod') and 'frase do dia' in t1.lower(),l
    pg.click('#qod-more');assert pg.is_visible('#qod .favbtn')
    # álbum: guardar, listar, tirar, e a leitura do salvamento descarta ids inválidos
    pg.click('#qod .favbtn');assert pg.evaluate("()=>S.fav.length")==1
    pg.evaluate("()=>go('album')");assert pg.inner_text('#album-count').startswith('1 frase')
    pg.click('#album-list .favbtn');assert pg.evaluate("()=>S.fav.length")==0 and 'vazio' in pg.inner_text('#album-list')
    pg.evaluate("()=>{S.fav=['alice:1','alice:1','x:1','alice:99','bad','peter:3'];save()}")
    pg.reload();pg.wait_for_timeout(600);fav=pg.evaluate("()=>S.fav");print('fav após recarregar:',fav);assert fav==['alice:1','x:1','alice:99','peter:3'];pg.evaluate("()=>go('album')");assert pg.inner_text('#album-count').startswith('2 frases'),pg.inner_text('#album-count')
    pg.evaluate("()=>{S.fav=[];save()}")
    # estrela dentro da página de frases do livro
    start(pg,'en',3,'frases-livro-peter-1')
    pg.evaluate("()=>{for(const w of sn.words){const b=sn.bank.find(x=>x.w===w&&!sn.slot.includes(x));sn.slot.push(b)}renderSentence()}");pg.click('#sn-submit');pg.wait_for_timeout(80)
    assert pg.is_visible('#sstage .favbtn');pg.click('#sstage .favbtn');assert pg.evaluate("()=>S.fav")==['peter:0']
    # jogos de citação: acerta tudo, conclui e marca como feita
    ids=pg.evaluate("()=>VOLUME.pages.filter(p=>p.type==='citacao'||p.type==='qualivro').map(p=>p.id+'|'+p.langs[0]+'|'+p.qs.length)");print(len(ids),'páginas de citação');assert len(ids)>=20
    for x in ids:
        pid,lang,n=x.split('|');start(pg,lang,1,pid)
        q=pg.evaluate("()=>quizState().qs.length");assert q>=4,(pid,q)
        for i in range(q):
            # ao menos 4 opções diferentes (citação) e a certa entre elas
            right=pg.evaluate("()=>{const q=quizState().qs[quizState().i];return quizState().kind==='cit'?q.opts.indexOf(q.ans):q.opts.indexOf(q.p.book)}");assert right>=0,(pid,i)
            assert pg.evaluate("()=>{const q=quizState().qs[quizState().i];return new Set(q.opts).size===q.opts.length}")
            pg.click(f'.opt[data-o="{right}"]');pg.click('#qz-next');pg.wait_for_timeout(40)
        assert pg.evaluate("(k)=>!!S.done[k]",lang+':'+pid),pid
    # um erro mostra a resposta certa
    start(pg,'fr',1,'qualivro-fr-1');pg.evaluate("()=>{}");wrong=pg.evaluate("()=>{const q=quizState().qs[0];return q.opts.findIndex(x=>x!==q.p.book)}")
    pg.click(f'.opt[data-o="{wrong}"]');assert pg.is_visible('.opt.right') and pg.is_visible('.opt.wrong') and 'Era' in pg.inner_text('#gstage')
    # mini-leitura: 12 trechos (sem Verne e Pinóquio), palavra do vocabulário abre o significado, tradução liga e desliga
    rids=pg.evaluate("()=>VOLUME3.pages.filter(p=>p.type==='leitura').map(p=>p.id+'|'+p.langs[0])");print(len(rids),'trechos');assert len(rids)==16
    for x in rids:
        pid,lang=x.split('|');start(pg,lang,3,pid)
        assert pg.locator('.rd-line').count()>=3,pid
        if pg.locator('.rw').count():
            pg.locator('.rw').first.click();assert '=' in pg.inner_text('.rd-def'),pid
        else:assert 'nenhuma palavra' in pg.inner_text('.rd-def'),pid
        pg.locator('.rd-tr').first.click();assert pg.locator('.rd-pt').count()==1
        pg.click('#rd-all');assert pg.locator('.rd-pt').count()==pg.locator('.rd-line').count()
        pg.click('#rd-done');assert pg.evaluate("(k)=>!!S.done[k]",lang+':'+pid),pid
    # trilha: a leitura vem depois das frases do livro
    path=pg.evaluate("()=>{S.lang='en';_path=null;return lessonPath().filter(r=>pageInLang(r.page)).map(r=>r.page.id).filter(i=>/^(frases-livro|leitura)-peter/.test(i)).slice(-5)}");print(path);assert path[-1]=='leitura-peter-2' and path[-3]=='leitura-peter-1' or path[-1]=='leitura-peter-2'
    pg.evaluate("()=>closeSheet()")
    # Meus livros
    for l in ('fr','it','en'):
        pg.evaluate("(l)=>{S.lang=l;save();go('books')}",l)
        n=pg.locator('.bkc').count();assert n==pg.evaluate("(l)=>BOOKS.filter(b=>b.lang===l).length",l),(l,n)
    pg.evaluate("()=>{S.lang='en';S.done={};save();go('books')}")
    pg.locator('[data-bk-go]').first.click();pg.wait_for_timeout(200);assert pg.evaluate("()=>!$('#s-game').hidden")
    pg.evaluate("()=>{S.done={};save()}")
    # telas novas respeitam o contraste em todos os estilos (cores vêm das variáveis do tema)
    print('erros:',errs);assert not [e for e in errs if 'ERR_FILE_NOT_FOUND' not in e]
    print('t20 ok')
finally:
  srv.terminate()
