"""Testa o Ciclo da palavra (formas ver/ouvir/escrever/frase; forma muda ao acertar e ao errar).
Uso (na pasta src/):  python3 -I tests/t30.py"""
import subprocess,time,os
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8780','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_context(viewport={'width':390,'height':844}).new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
    pg.goto('http://localhost:8780/index.html');pg.wait_for_timeout(700)
    # palavra com frase de contexto
    w=pg.evaluate("()=>{S.lang='en';S.rvv={};S.cad=[];const e=Object.values(VOCAB.en).flat().find(x=>ctxFor(x)&&/^[a-z]{4,}$/.test(x.w));return e.w}")
    forms=[]
    for step in range(4):
        pg.evaluate("(a)=>{S.rvv={};S.rvv['en:v|'+a[0]]=[1,a[1],0];save();closeSheet();startCiclo()}",[w,step])
        forms.append(pg.evaluate("()=>__ciclo().cur.f"));
        assert forms[-1]==step,(forms,step)
        if step in(0,1):
            a=pg.evaluate("()=>__ciclo().cur.a")
            if step==1:
                pg.click('#cic-show');assert pg.inner_text('#cic-word').strip()
            pg.click('[data-cic-opt="%d"]'%a)
        else:
            pg.fill('#cic-in',w if step==3 else pg.evaluate("()=>{const e=__ciclo().cur.e;return full(e)}"));pg.click('#cic-check')
        assert 'Certo!' in pg.inner_text('#sheet'),(step,pg.inner_text('#sheet'))
        st=pg.evaluate("(k)=>S.rvv['en:v|'+k]",w)
        assert (st and st[1]==step+1) or (step==3 and st is not None),st
        pg.click('#cic-next')
    # errar: volta 2 degraus, vence amanhã e a forma muda
    pg.evaluate("(w)=>{S.rvv={};S.rvv['en:v|'+w]=[1,2,0];save();closeSheet();startCiclo()}",w)
    f0=pg.evaluate("()=>__ciclo().cur.f");pg.fill('#cic-in','zzzz');pg.click('#cic-check')
    assert 'Ainda não' in pg.inner_text('#sheet')
    st=pg.evaluate("(w)=>S.rvv['en:v|'+w]",w);assert st[1]==0 and st[2]==1 and st[0]>pg.evaluate("()=>Date.now()"),st
    assert (st[1]+st[2])%4!=f0
    pg.click('#cic-next');assert 'Ciclo concluído' in pg.inner_text('#sheet')
    # Treino mostra o botão e Hoje usa o ciclo
    pg.evaluate("(w)=>{S.rvv={};S.rvv['en:v|'+w]=[1,0,0];save();closeSheet();openTrainMenu()}",w)
    assert pg.is_visible('#train-cycle');pg.click('#train-cycle');assert 'Ciclo da palavra' in pg.inner_text('#sheet-title')
    pg.evaluate("(w)=>{closeSheet();startToday()}",w);assert 'Ciclo da palavra' in pg.inner_text('#sheet-title')
    assert not errs,errs
    print('ok t30 errs',errs)
finally:
  srv.terminate()
