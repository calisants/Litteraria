"""Testa (v1.72): Parece, mas não é (falsos amigos) e Conversas com escolhas.
Uso (na pasta src/):  python3 -I tests/t42.py"""
import subprocess,time,os
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8787','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_context(viewport={'width':390,'height':844}).new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8787/index.html');pg.wait_for_timeout(1200)
    info=pg.evaluate("""()=>{const o={};for(const l of ['fr','it','en']){o[l]={a:VOLUME.pages.filter(p=>p.type==='parece'&&p.langs[0]===l).length,c:VOLUME3.pages.filter(p=>p.type==='conversa'&&p.langs[0]===l).length};}return o}""")
    assert info['fr']['a']==2 and info['it']['a']==2 and info['en']['a']==4,info
    assert all(info[l]['c']==3 for l in info),info
    # cada par: o sentido certo difere do falso amigo
    assert pg.evaluate("()=>Object.values(__paData).every(L=>L.every(x=>x.length===3&&x[1]!==x[2]&&x[0]&&x[1]&&x[2]))")
    for l in ['fr','it','en']:
        n=info[l]['a']
        for k in range(1,n+1):
            pg.evaluate("([l,k])=>{S.vol=1;S.lang=l;S.done={};save();closeSheet();startPage('parece-'+l+'-'+k)}",[l,k]);pg.wait_for_timeout(250)
            m=pg.evaluate("()=>__paState().items.length");assert m>=4,m
            for i in range(m):
                # 1º item de uma página: erra de propósito; depois acerta
                idx=pg.evaluate("()=>{const c=__paState(),it=c.items[c.i];return it.opts.indexOf(it.real)}")
                if i==0 and k==1:
                    idx=(idx+1)%3
                pg.click('[data-pc="%d"]'%idx)
                assert pg.locator('#pc-next').count()==1
                pg.click('#pc-next')
            assert 'Página concluída' in pg.inner_text('#sheet-title')
            assert pg.evaluate("([l,k])=>S.done[l+':parece-'+l+'-'+k]===1",[l,k])
        txt=pg.inner_text('#sheet-in') if False else ''
    # a fonte aparece na tela
    pg.evaluate("()=>{S.vol=1;S.lang='en';closeSheet();startPage('parece-en-1')}");pg.wait_for_timeout(200)
    assert 'Conferido: Infoescola' in pg.inner_text('#gstage')
    # sem tradução antes: as opções são só 3 e uma é o falso amigo
    assert pg.evaluate("()=>{const c=__paState();return c.items.every(it=>it.opts.length===3&&it.opts.indexOf(it.trap)>=0)}")
    # Conversas: percorre todas escolhendo a 1ª opção "2" e depois a pior
    for l in ['fr','it','en']:
        for k in range(1,4):
            for mode in ('best','worst'):
                pg.evaluate("([l,k])=>{S.vol=3;S.lang=l;S.done={};save();closeSheet();startPage('conversa-'+l+'-'+k)}",[l,k]);pg.wait_for_timeout(250)
                guard=0
                while pg.locator('#cv-end').count()==0 and guard<10:
                    guard+=1
                    i=pg.evaluate("(m)=>{const c=__cvState(),o=c.d.nodes[c.node].o;let q=m==='best'?2:0;let r=o.findIndex(x=>x.q===q);return r<0?0:r}",mode)
                    pg.click('[data-cv="%d"]'%i)
                    assert pg.locator('#cv-next').count()==1
                    pg.click('#cv-next')
                assert pg.locator('#cv-end').count()==1,(l,k,mode)
                pts=pg.evaluate("()=>[__cvState().pts,__cvState().max]")
                if mode=='best': assert pts[0]==pts[1],(l,k,pts)
                else: assert pts[0]<pts[1],(l,k,pts)
                pg.click('#cv-end');assert 'Conversa concluída' in pg.inner_text('#sheet-title')
                assert pg.evaluate("([l,k])=>S.done[l+':conversa-'+l+'-'+k]===1",[l,k])
    # a fala do outro não tem tradução na tela antes da resposta
    pg.evaluate("()=>{S.vol=3;S.lang='fr';closeSheet();startPage('conversa-fr-1')}");pg.wait_for_timeout(200)
    t=pg.inner_text('#gstage');assert 'Bom dia! O que posso servir?' not in t
    assert 'Diálogo escrito por Claude, sem fonte conferida' in t
    # Hoje/Próximo continuam funcionando
    pg.evaluate("()=>{closeSheet();S.lang='fr';S.done={};save();go('home')}")
    assert pg.evaluate("()=>typeof nextAfter==='function'")
    assert errs==[],errs
    print('t42 ok')
finally:
  srv.terminate()
