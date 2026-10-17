"""Testa o Dicionário (ordem alfabética, busca, idioma, sílabas para todas as palavras, áudio).
Uso (na pasta src/):  python3 -I tests/t15.py"""
import subprocess,time,os
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8770','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_context(viewport={'width':390,'height':844}).new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
    pg.goto('http://localhost:8770/index.html');pg.wait_for_timeout(700)
    pg.click('#go-dict');assert pg.is_visible('#s-dict') and pg.inner_text('#dict-title')=='Dicionário de Francês'
    n=pg.evaluate("()=>document.querySelectorAll('#dict-list .dl-row').length");print('palavras fr:',n);assert n>=950
    heads=pg.evaluate("()=>[...document.querySelectorAll('#dict-list .dl-h')].map(h=>h.textContent)");print(heads);assert heads==sorted(heads,key=lambda x:x.lower()) and heads[0]=='A'
    assert pg.evaluate("()=>document.querySelectorAll('#dict-list .speak').length")==n
    pg.fill('#dict-q','mae');t=pg.inner_text('#dict-list');print(t[:120].replace(chr(10),' | '));assert 'mère' in t and 'mãe' in t
    pg.fill('#dict-q','bonjour');assert 'Diga olá à sua mãe' in pg.inner_text('#dict-list') and 'Tu passeras le bonjour' in pg.inner_text('#dict-list')
    pg.fill('#dict-q','bonjour');assert 'sílabas: bon·jour' in pg.inner_text('#dict-list')
    pg.fill('#dict-q','baobab');t=pg.inner_text('#dict-list');assert 'baobá' in t and 'ba·o·bab' in t and 'Pequeno Príncipe' in t
    pg.fill('#dict-q','planète');assert 'la planète' in pg.inner_text('#dict-list') and 'planeta' in pg.inner_text('#dict-list')
    r=pg.evaluate("()=>{const app=new Set(Object.values(VOCAB.fr).flat().map(e=>e.w.toLowerCase()));return [PPW.length,PPW.filter(x=>app.has(x.w.toLowerCase())).length,PPW.filter(x=>x.sy.replace(/·/g,'')!==x.w).length,PPW.filter(x=>x.c==='substantivo'&&!x.a).length,new Set(PPW.map(x=>x.w)).size]}");print('livro:',r);assert r[0]>=450 and r[1]==0 and r[2]==0 and r[3]==0 and r[4]==r[0]
    assert 'O Pequeno Príncipe' in pg.inner_text('#dict-src')
    pg.fill('#dict-q','zzzz');assert 'Nenhuma palavra' in pg.inner_text('#dict-list')
    pg.fill('#dict-q','')
    for l,w,sy in (('it','telefono','te·le·fo·no'),('en','computer','com·put·er')):
        pg.click('[data-dictlang=%s]'%l);pg.fill('#dict-q',w);t=pg.inner_text('#dict-list');print(l,t.replace(chr(10),' | ')[:90]);assert sy in t and pg.evaluate("()=>S.lang")==l
    pg.click('[data-dictlang=en]');assert 'ainda não há para o inglês' in pg.inner_text('#dict-src')
    pg.click('[data-dictlang=it]');pg.fill('#dict-q','birra');assert 'Mi piace la birra' in pg.inner_text('#dict-list') and 'Eu gosto de cerveja' in pg.inner_text('#dict-list') and 'CC BY-SA' in pg.inner_text('#dict-src')
    # toda palavra do vocabulário tem divisão que reconstrói a palavra
    bad=pg.evaluate("()=>{const o=[];for(const l of ['fr','it','en'])for(const e of Object.values(VOCAB[l]).flat()){const s=SIL[l][e.w];if(!s||s.replace(/·/g,'')!==e.w.toLowerCase())o.push([l,e.w,s])}return o}");print('sem divisão:',bad[:5]);assert not bad
    assert pg.evaluate("()=>document.querySelector('#dict-src').textContent.length")>40
    pg.click('#s-dict [data-back=home]');assert pg.is_visible('#s-home')
    print('erros:',errs);assert not errs
    b.close()
finally: srv.terminate()
