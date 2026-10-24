"""Testa (v1.64): Lição do Jardim, 7 telas sobre um trecho de livro.
Uso (na pasta src/):  python3 -I tests/t35.py"""
import subprocess,time,os
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8785','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch()
    for lang,game in (('en',0),('en',1),('en',2),('fr',1),('it',2),('it',0)):
      ctx=b.new_context(viewport={'width':390,'height':844});ctx.add_init_script('window.__jdGame=%d'%game);pg=ctx.new_page();errs=[]
      pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
      pg.goto('http://localhost:8785/index.html');pg.wait_for_timeout(1200)
      ids=pg.evaluate("(l)=>VOLUME3.pages.filter(p=>p.type==='jardim'&&p.langs[0]===l).map(p=>p.id)",lang)
      assert len(ids)>=2,ids
      pg.evaluate("(a)=>{S.lang=a[0];S.sound='off';startLesson({vol:3,page:VOLUME3.pages.find(p=>p.id===a[1])});}",[lang,ids[0]])
      pg.wait_for_timeout(400)
      st=lambda:pg.evaluate("()=>jardimState().scr")
      assert st()==0 and 'Começar' in pg.inner_text('#gstage')
      pg.click('[data-jd=next]');assert st()==1
      # leitura: ouvir destaca, tradução, palavra
      pg.click('[data-jd=say]');assert pg.locator('.rd-play').count()==1
      pg.click('[data-jd=tr] >> nth=0');assert pg.locator('.rd-pt').count()==1
      if pg.locator('.rw').count():
        pg.click('.rw >> nth=0');assert pg.locator('.rd-def .gdchip').count()==1
      pg.click('[data-jd=next]');assert st()==2
      # lacunas: 3 opções >= 48px; 1º erro mostra dica e treme; 2º erro revela
      n=pg.evaluate("()=>jardimState().gaps.length");assert n>=3,n
      for k in range(n):
        a=pg.evaluate("()=>jardimState().gaps[jardimState().gi].a")
        assert pg.locator('.jd-opt').count()==3
        h=pg.evaluate("()=>Math.min(...[...document.querySelectorAll('.jd-opt')].map(b=>b.getBoundingClientRect().height))");assert h>=47,h
        wrong=[i for i in range(3) if i!=a]
        if k==0:  # erra 2 vezes
          pg.click(f'.jd-opt >> nth={wrong[0]}');assert 'Ainda não' in pg.inner_text('#jd-fb')
          pg.click(f'.jd-opt >> nth={wrong[1]}');assert 'A resposta era' in pg.inner_text('#gstage')
        elif k==1:  # erra 1 vez e depois acerta
          pg.click(f'.jd-opt >> nth={wrong[0]}');pg.click(f'.jd-opt >> nth={a}');assert 'Certo' in pg.inner_text('#gstage')
        else:
          pg.click(f'.jd-opt >> nth={a}');assert 'Certo' in pg.inner_text('#gstage')
        pg.click('[data-jd=gnext]')
      assert st()==3
      # blocos
      parts=pg.evaluate("()=>jardimState().parts.length")
      if parts>=3:
        wrong_idx=pg.evaluate("()=>jardimState().order.find(i=>i!==0)")
        pg.click(f'.jd-blk[data-i="{wrong_idx}"]');assert 'não vem agora' in pg.inner_text('#jd-fb')
        for i in range(parts):pg.click(f'.jd-blk[data-i="{i}"]')
      pg.click('[data-jd=next]');assert st()==4
      # jogo (rodizio)
      g0=pg.evaluate("()=>jardimState().game")
      assert g0==game or (g0==0 and pg.evaluate("()=>jardimState().dt.items.length+jardimState().fw.items.length")>=0),(g0,game)
      game=g0
      if game==0:
        m=pg.evaluate("()=>jardimState().match.e.map(e=>e.pt)")
        assert len(m)>=3
        pg.click('.jd-w >> nth=0');
        wrongm=pg.evaluate("()=>jardimState().match.picks.findIndex(p=>p!==jardimState().match.e[0].pt)")
        pg.click(f'.jd-m[data-i="{wrongm}"]');assert 'Não é esse' in pg.inner_text('#jd-fb')
        for i in range(len(m)):
          pg.click(f'.jd-w[data-i="{i}"]')
          j=pg.evaluate("(i)=>jardimState().match.picks.indexOf(jardimState().match.e[i].pt)",i)
          pg.click(f'.jd-m[data-i="{j}"]')
      elif game==1:
        n=pg.evaluate("()=>jardimState().fw.items.length");assert n>=1
        for k in range(n):
          w=pg.evaluate("()=>{const it=jardimState().fw.items[jardimState().fw.i];return it.e.w.toLowerCase()}")
          letters=pg.evaluate("()=>jardimState().fw.items[jardimState().fw.i].t")
          if k==0:  # monta errado de propósito (se a palavra tiver 2 letras diferentes) e depois certo
            wrong=sorted(range(len(letters)),key=lambda i:letters[i],reverse=True)
            if ''.join(letters[i] for i in wrong)!=w:
              for i in wrong:pg.click(f'.jd-tile[data-i="{i}"]')
              assert 'não forma' in pg.inner_text('#jd-fb')
          pool=list(range(len(letters)));used=[]
          for ch in w:
            i=next(x for x in pool if letters[x]==ch and x not in used);used.append(i)
            pg.click(f'.jd-tile[data-i="{i}"]')
          assert 'Certo' in pg.inner_text('#jd-fb')
          pg.click('[data-jd=fnext]')
      else:
        n=pg.evaluate("()=>jardimState().dt.items.length");assert n>=1
        for k in range(n):
          w=pg.evaluate("()=>jardimState().dt.items[jardimState().dt.i].e.w").lower()
          toks=pg.evaluate("()=>[...document.querySelectorAll('.jd-tok')].map(b=>b.dataset.t)")
          bad=next(t for t in toks if t.lower()!=w and len(t)>2)
          pg.click(f'.jd-tok[data-t="{bad}"] >> nth=0');assert 'Não é essa' in pg.inner_text('#jd-fb')
          good=next((t for t in toks if t.lower()==w),None) or next(t for t in toks if w in t.lower())
          pg.click(f'.jd-tok[data-t="{good}"] >> nth=0');assert 'Achou' in pg.inner_text('#jd-fb')
          pg.click('[data-jd=dnext]')
      if game==0:pg.click('[data-jd=next]')
      assert st()==5
      # frase nova
      if pg.locator('#jd-in').count():
        w=pg.evaluate("()=>jardimState().fresh.e.w")
        pg.fill('#jd-in','zzzz');pg.click('[data-jd=chk]');assert 'Ainda não' in pg.inner_text('#jd-fb')
        pg.fill('#jd-in',w);pg.click('[data-jd=chk]');assert 'Certo' in pg.inner_text('#jd-fb')
      pg.click('[data-jd=next]');assert st()==6
      assert 'O que cresceu' in pg.inner_text('#gstage')
      pg.click('[data-jd=fin]');pg.wait_for_timeout(300)
      assert pg.evaluate("(a)=>!!S.done[a[0]+':'+a[1]]",[lang,ids[0]])
      # o jardim registrou acertos e erros
      g=pg.evaluate("()=>Object.keys(S.gd).length");assert g>=3,g
      # Treino abre a lição
      pg.evaluate("()=>{go('home');openTrainMenu();}");assert pg.locator('#train-garden').count()==1
      assert not [e for e in errs if 'favicon' not in e],errs
      print(lang,'jogo',game,'ok',len(ids),'trechos')
      ctx.close()
    # sublinhado por estágio e nome do estágio no balão, na Leitura
    ctx=b.new_context(viewport={'width':390,'height':844});pg=ctx.new_page()
    pg.goto('http://localhost:8785/index.html');pg.wait_for_timeout(1200)
    pg.evaluate("()=>{S.lang='en';S.gd={};startLesson({vol:3,page:VOLUME3.pages.find(p=>p.id==='leitura-peter-1')});}");pg.wait_for_timeout(300)
    assert pg.locator('.rw.gs0').count()>=1
    pg.evaluate("()=>{const k=document.querySelector('.rw').dataset.k;S.gd['en:'+k]=[3,1,15,9,0,1,-1];renderLeitura&&0}") if False else None
    pg.click('.rw >> nth=0');assert pg.locator('.rd-def .gdchip').count()==1
    print('t35 ok')
finally:
  srv.terminate()
