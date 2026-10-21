"""Testa: fontes locais, zoom opcional, embaralhar, revisão espaçada, aviso de backup e erro ao salvar.
Uso (na pasta src/):  python3 tests/t13.py   (sobe um servidor local na raiz do repositório)"""
import subprocess,time,os,json
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8765','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_context(viewport={'width':390,'height':844}).new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
    pg.goto('http://localhost:8765/index.html');pg.wait_for_timeout(800)
    pg.evaluate("()=>Promise.all([document.fonts.load('400 16px \"Atkinson Hyperlegible\"'),document.fonts.load('600 16px Newsreader')])")
    print('fontes:',pg.evaluate("()=>[...document.fonts].map(f=>f.family+' '+f.weight+':'+f.status)"))
    assert 'googleapis' not in pg.content()
    vp=lambda:pg.evaluate("()=>document.querySelector('meta[name=viewport]').content")
    print('zoom padrao:',vp()); assert 'user-scalable=no' in vp()
    pg.evaluate("()=>{go('settings');document.querySelectorAll('#s-settings details').forEach(d=>d.open=true)}");pg.click('#zoom-seg [data-zoom=on]');print('zoom ligado:',vp()); assert 'user-scalable' not in vp() and pg.evaluate("()=>S.zoom")
    pg.click('#zoom-seg [data-zoom=off]');assert 'user-scalable=no' in vp()
    # embaralhar: 40 aberturas da mesma pagina; a resposta certa tem de ser sempre o mesmo texto
    pos=[0]*4;txt=set()
    for _ in range(40):
        pg.evaluate("()=>{S.lang='fr';startGramFor&&0}") if False else None
        r=pg.evaluate("()=>{S.lang='fr';P={id:'artigos-1',type:'artigos',n:1};startGram();const it=gm.items[0];return [it.a,it.o[it.a]]}")
        pos[r[0]]+=1;txt.add(r[1])
    print('posicoes',pos,'texto certo',txt); assert len(txt)==1 and min(pos)>0
    # revisao: erro -> amanha 00:00; acertos sobem; erro desce 2 degraus
    pg.evaluate("()=>{S.rv={};S.rv['fr:artigos|1|0']=[Date.now()-1,3,0];save();}")
    st=pg.evaluate("()=>{const k='fr:artigos|1|0';gm.review=true;gm.drill=false;gm.ids=['artigos|1|0'];gm.i=0;S.lang='fr';rvUpdate(false);const a=S.rv[k].slice();S.rv[k][0]=Date.now()-1;rvUpdate(true);return [a,S.rv[k].slice(),new Date(a[0]).getHours()]}")
    print('errou:',st[0],'| acertou:',st[1]); assert st[0][1]==1 and st[0][2]==1 and st[2]==0 and st[1][1]==2
    # intervalo reduzido para item com tropeco
    d=pg.evaluate("()=>[rvIvl(2,0),rvIvl(2,1),rvIvl(0,3)]");print('prazos 7 dias / com tropeco / 1 dia:',d);assert d==[7,4,1]
    pg.evaluate("()=>go('home')")
    # backup: aviso
    pg.evaluate("()=>{S.done={'fr:a':1,'fr:b':1,'fr:c':1};S.bk=0;S.bks=0;S.since=Date.now()-8*864e5;save();renderToday();}")
    print('aviso sem backup:',pg.is_visible('#bk-warn'),pg.inner_text('#bk-warn-txt')); assert pg.is_visible('#bk-warn')
    pg.click('#bk-warn-later');assert not pg.is_visible('#bk-warn')
    pg.evaluate("()=>{S.bks=0;S.bk=Date.now()-15*864e5;renderToday();}");print('aviso 15 dias:',pg.inner_text('#bk-warn-txt'));assert pg.is_visible('#bk-warn')
    pg.evaluate("()=>{S.bk=Date.now()-2*864e5;renderToday();}");assert not pg.is_visible('#bk-warn')
    # erro ao salvar
    pg.evaluate("()=>{Storage.prototype.setItem=function(){throw new Error('cheio')};failShown=false;save();}")
    print('toast:',pg.inner_text('#toast')[:60]);assert pg.is_visible('#toast')
    print('erros:',[e for e in errs if 'cheio' not in e]);b.close()
finally: srv.terminate()
