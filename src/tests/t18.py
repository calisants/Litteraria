"""Testa: temas de livros (lições novas só no idioma do livro, sem mexer nas lições antigas).
Uso (na pasta src/):  python3 -I tests/t18.py   (OLD=caminho do index.html antigo para comparar os ids das páginas)"""
import subprocess,time,os,json
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8775','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
OLD=os.environ.get('OLD')
IDS="()=>VOLUMES.map(v=>[v.id,v.pages.filter(p=>!p.langs).map(p=>p.id+'|'+p.n)])"
try:
  with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_context(viewport={'width':390,'height':844}).new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
    pg.goto('http://localhost:8775/index.html');pg.wait_for_timeout(700)
    new=pg.evaluate(IDS)
    if OLD:
        pg2=b.new_page();pg2.goto('file://'+OLD);pg2.wait_for_timeout(600);old=pg2.evaluate(IDS)
        assert old==new,'ids/ordem/numeração das lições antigas mudaram';print('lições antigas idênticas:',sum(len(x[1]) for x in new))
    r=pg.evaluate("()=>{const o={};for(const l of ['fr','it','en']){S.lang=l;o[l]=VOLUME5.pages.filter(pageInLang).length}return o}");print(r)
    assert r['fr']>r['it']>0 and r['en']>r['it'] and r['it']==pg.evaluate("()=>VOLUME5.pages.filter(p=>!p.langs).length+VOLUME5.pages.filter(p=>p.langs&&p.langs[0]==='it').length")
    # trilha: livros ficam no fim e só no idioma certo; com tudo feito, a próxima lição é do livro
    pg.evaluate("()=>{S.lang='fr';S.done={};S.sk={};save()}")
    pg.evaluate("()=>lessonPath().forEach(r=>{if(!r.page.langs)S.done['fr:'+r.page.id]=1})")
    nx=pg.evaluate("()=>nextNewPage().page.id");print('próxima (fr, tudo feito):',nx);assert nx=='conheca-pp1-1'
    pg.evaluate("()=>{S.lang='it';S.done={};lessonPath().forEach(r=>{if(!r.page.langs)S.done['it:'+r.page.id]=1})}")
    assert pg.evaluate("()=>nextNewPage().page.id")=='conheca-pinocchio1-1'
    pg.evaluate("()=>{S.lang='en';S.done={};lessonPath().forEach(r=>{if(!r.page.langs)S.done['en:'+r.page.id]=1})}")
    assert pg.evaluate("()=>nextNewPage().page.id")=='conheca-alice1-1'
    # sumário: fr mostra, it não mostra; filtro de tema do livro
    pg.evaluate("()=>{S.lang='fr';S.vol=5;save();go('vol');renderIndex()}")
    assert pg.evaluate("()=>document.querySelectorAll('#toc [data-id=\"conheca-pp1-1\"]').length")==1
    pg.evaluate("()=>{S.fTheme='livro-pp';renderIndex()}");pg.wait_for_timeout(100)
    assert pg.evaluate("()=>[...document.querySelectorAll('#f-theme option')].some(o=>o.value==='livro-pp')")
    n=pg.evaluate("()=>document.querySelectorAll('#toc [data-id]').length");print('páginas do tema livro-pp:',n);assert n>=12*16-1
    pg.evaluate("()=>{S.lang='it';renderIndex()}")
    assert pg.evaluate("()=>document.querySelectorAll('#toc [data-id]').length")==0
    pg.evaluate("()=>{S.fTheme='livro-pinocchio';renderIndex()}");assert pg.evaluate("()=>document.querySelectorAll('#toc [data-id]').length")>=100
    pg.evaluate("()=>{S.fTheme='all';S.lang='fr';save()}")
    # abre e joga cada tipo de lição em fr e en
    for lang,cat in (('fr','pp1'),('fr','verne2'),('it','pinocchio3'),('en','alice3')):
        for pid in ['conheca-%s-1'%cat,'reco-%s-1'%cat,'completar-%s-2'%cat,'embaralhar-%s-1'%cat,'escreva-%s-2'%cat]:
            pg.evaluate("(a)=>{S.lang=a[0];S.vol=5;save();syncPrefs();go('vol');startPage(a[1])}",[lang,pid]);pg.wait_for_timeout(250)
            ok=pg.evaluate("()=>gm.items.length>0&&gm.items.every(i=>i.q||i.k)")
            assert ok,pid
            t=pg.inner_text('#s-game')
            assert len(t)>20,pid
        print(lang,'ok',pid)
    # introdução de palavra mostra classe e tema do livro
    pg.evaluate("()=>{S.lang='fr';startPage('conheca-pp1-1')}");pg.wait_for_timeout(250)
    t=pg.inner_text('#s-game');print(t[:260].replace(chr(10),' | '));assert 'O Pequeno Príncipe' in t
    # organização: Lições abre direto os volumes (com idioma); apagar estatísticas fica em Estatísticas; Ajustes em grupos
    pg.evaluate("()=>{S.lang='fr';S.style='padrao';save();go('home')}");pg.click('#go-games');assert pg.is_visible('#s-vol') and pg.is_visible('#s-vol [data-k=lang]')
    pg.click('#s-vol [data-k=lang][data-v=it]');assert pg.evaluate("()=>S.lang")=='it' and 'Italiano' in pg.inner_text('#vol-lang')
    pg.click('#s-vol [data-back]');assert pg.is_visible('#s-home')
    pg.evaluate("()=>go('stats')");assert pg.is_visible('#clear-stats')
    pg.evaluate("()=>go('profile')");assert not pg.is_visible('#clear-stats')
    pg.evaluate("()=>go('settings')");g=pg.evaluate("()=>[...document.querySelectorAll('#s-settings .grp')].map(x=>x.textContent)");print(g);assert g==['Aparência','Som e vibração','Estudo','Dados','Sobre e ajuda']
    assert pg.is_visible('#sec-layout');pg.evaluate("()=>{S.style='fofo';save();applyTheme();syncPrefs()}");assert not pg.is_visible('#sec-layout') and pg.is_visible('#sec-estilo')
    # frases dos livros: 2 páginas por livro, só no idioma certo, no fim da trilha, jogáveis
    r=pg.evaluate("()=>VOLUME3.pages.filter(p=>p.book).map(p=>p.id+'|'+p.langs[0]+'|'+p.lines.length)");print(r);assert len(r)==6 and all(x.endswith('|5') for x in r)
    for lang,pid in (('fr','frases-livro-verne-2'),('it','frases-livro-pinocchio-1'),('en','frases-livro-alice-2')):
        pg.evaluate("(a)=>{S.lang=a[0];S.vol=3;save();syncPrefs();go('vol');startPage(a[1])}",[lang,pid]);pg.wait_for_timeout(250)
        assert pg.evaluate("()=>sn.lines.length")==5 and pg.evaluate("()=>pageInLang(P)")
        for i in range(5):
            for w in pg.evaluate("()=>sn.words"):
                pg.evaluate("(w)=>{const b=sn.bank.find(x=>x.w===w&&!sn.slot.includes(x));sn.slot.push(b);renderSentence()}",w)
            pg.click('#sn-submit');pg.wait_for_timeout(80)
            assert pg.evaluate("()=>sn.solved"),(pid,i)
            if i<4:pg.click('#sn-next');pg.wait_for_timeout(80)
    pg.evaluate("()=>{S.lang='it'}");assert not pg.evaluate("()=>pageInLang(VOLUME3.pages.find(p=>p.id==='frases-livro-verne-1'))")
    last=pg.evaluate("()=>{S.lang='fr';_path=null;const L=lessonPath().filter(r=>pageInLang(r.page));return L[L.length-1].page.id}");print('última da trilha fr:',last);assert last=='frases-livro-verne-2'
    print('erros:',errs);assert not errs
    print('t18 ok')
finally:
  srv.terminate()
