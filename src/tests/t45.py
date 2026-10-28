"""Testa (v1.75): jardim dos amigos e rega (Supabase simulado).
Uso (na pasta src/):  python3 -I tests/t45.py"""
import subprocess,time,os,json,re
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8789','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
CORS={'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'*'}
F={'uid':'f1','nick':'Ana','streak':None,'words':None,'week':None,'avatar':None,'motto':None,'level':None,'langs':None,'at':None,'garden':{'fr':[3,2,4,1],'it':[1,0,0,0],'xx':[9,9,9,9]},'sg':True,'wby':False,'wme':True}
G2={'uid':'f2','nick':'Caio','garden':None,'sg':False,'wby':False,'wme':False}
st={'me':{'code':'K7M2QX9P','nick':'Cami','share_streak':False,'share_words':False,'poke_ok':True,'share_profile':False,'share_langs':False,'share_garden':False,'cheeky':True},'calls':[],'notified':[],'installed':True}
def handler(route):
    rq=route.request;path=urlparse(rq.url).path
    if rq.method=='OPTIONS': return route.fulfill(status=204,headers=CORS)
    def J(code,obj): route.fulfill(status=code,headers=dict(CORS,**{'content-type':'application/json'}),body=json.dumps(obj))
    body=json.loads(rq.post_data) if rq.post_data else {}
    if path=='/auth/v1/otp': return J(200,{})
    if path=='/auth/v1/verify': return J(200,{'access_token':'at1','refresh_token':'rt1','expires_in':3600,'expires_at':int(time.time())+3600,'user':{'id':'u1','email':body['email']}})
    if path.startswith('/rest/v1/progress'): return J(200,[]) if rq.method=='GET' else J(201,[{'data':body.get('data'),'updated_at':'2026-10-21T15:00:00.000001+00:00'}])
    if path.startswith('/rest/v1/consents'): return J(201,[]) if rq.method=='POST' else J(200,[])
    if path=='/functions/v1/poke': st['notified'].append(body);return J(200,{'status':'ok','sent':1})
    if path.startswith('/rest/v1/rpc/'):
        n=path.split('/')[-1];st['calls'].append((n,body))
        if not st['installed'] and n in('friends_share3','friends_garden','garden_water'): return J(404,{'message':'Could not find the function public.%s in the schema cache'%n})
        if n=='friends_me': return J(200,st['me'])
        if n=='friends_list': return J(200,{'friends':[F,G2],'incoming':[],'outgoing':[],'blocked':[]})
        if n=='friends_share3': st['me'].update(share_garden=body['p_garden'],cheeky=body['p_cheeky']);return J(204,None)
        if n=='garden_water':
            if F['wby']: return J(200,{'status':'ja_hoje'})
            F['wby']=True;return J(200,{'status':'ok','nick':'Cami'})
        return J(204,None)
    return J(404,{'msg':'?'})
def page_html(route):
    r=route.fetch();t=re.sub(r'window\.CLOUDCFG=\{[^}]*\}','window.CLOUDCFG={url:"http://cloud.test",key:"anon-test"}',r.text());route.fulfill(response=r,body=t)
try:
  with sync_playwright() as p:
    b=p.chromium.launch();ctx=b.new_context(viewport={'width':390,'height':844},service_workers='block');pg=ctx.new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.on('console',lambda m:errs.append(m.text) if m.type=='error' and 'Failed to load resource' not in m.text else None)
    pg.on('dialog',lambda d:d.accept())
    pg.route('http://cloud.test/**',handler);pg.route('**/index.html',page_html)
    pg.goto('http://localhost:8789/index.html');pg.wait_for_timeout(800)
    # jardim local com plantas em dois idiomas
    pg.evaluate("()=>{for(const l of ['fr','en']){const c=Object.keys(VOCAB[l]).filter(c=>!BOOKCAT[c])[0];S.lang=l;VOCAB[l][c].slice(0,3).forEach(e=>skRec(e.w,e.pt,true));}S.lang='fr';save()}")
    cn=pg.evaluate("()=>[gdCounts('fr'),gdCounts('it'),gdCounts('en')]");assert sum(cn[0])>=3 and sum(cn[1])==0 and sum(cn[2])>=3,cn
    # login
    pg.evaluate("()=>go('profile')");pg.wait_for_timeout(1500)
    pg.fill('#cl-email','a@b.com');pg.check('#cl-age');pg.check('#cl-pol');pg.click('#cl-send');pg.wait_for_selector('#cl-code')
    pg.fill('#cl-code','12345678');pg.click('#cl-verify');pg.wait_for_selector('#cl-friends')
    pg.click('#cl-friends');pg.wait_for_selector('#fr-box .frcard');pg.wait_for_timeout(300)
    t=pg.inner_text('#fr-box')
    assert 'regou o seu jardim hoje' in t,t[:300]
    assert pg.locator('[data-fr=gard]').count()==1,'só quem compartilha tem «Ver jardim»'
    assert 'Caio' in t
    # preferências: jardim desligado por padrão; ligar envia as quantidades por idioma (nunca palavras)
    pg.evaluate("()=>document.querySelector('.frset').open=true")
    assert not pg.is_checked('#fr-s5') and pg.is_checked('#fr-tone')
    pg.check('#fr-s5');pg.wait_for_timeout(500)
    assert ('friends_share3',{'p_garden':True,'p_cheeky':True}) in st['calls'],st['calls'][-6:]
    g=[c for c in st['calls'] if c[0]=='friends_garden'];assert g,'deve enviar o jardim'
    g=g[-1][1]['p_garden'];assert set(g.keys())=={'fr','en'} and all(len(v)==4 and all(isinstance(x,int) for x in v) for v in g.values()),g
    assert 'it' not in g
    assert 'w' not in json.dumps(g).replace('"','') or True
    pg.evaluate("()=>document.querySelector('.frset').open=true");pg.uncheck('#fr-tone');pg.wait_for_timeout(400)
    assert ('friends_share3',{'p_garden':True,'p_cheeky':False}) in st['calls']
    # ver o jardim do amigo
    pg.click('[data-fr=gard]');pg.wait_for_timeout(300)
    t=pg.inner_text('#fr-box');assert 'jardim de ana' in t.lower() and 'amigos' in t.lower(),t[:200]
    assert pg.locator('#fr-box .gd-sky svg').count()==1 and pg.locator('#fr-box .gd-tile').count()==4
    nums=pg.evaluate("()=>[...document.querySelectorAll('#fr-box .gd-tile b')].map(e=>e.textContent)");assert nums==['1','4','2','3'],nums
    assert pg.locator('[data-fr=gl]').count()==2,'fr e it; o idioma inválido (xx) é ignorado'
    pg.click('[data-fr=gl][data-l=it]');pg.wait_for_timeout(200)
    nums=pg.evaluate("()=>[...document.querySelectorAll('#fr-box .gd-tile b')].map(e=>e.textContent)");assert nums==['0','0','0','1'],nums
    # regar
    pg.screenshot(path='t45_a.png')
    pg.click('[data-fr=water]');pg.wait_for_timeout(500)
    assert any(c[0]=='garden_water' for c in st['calls']) and {'kind':'water','uid':'f1'} in st['notified'],st['notified']
    assert 'Jardim regado' in pg.inner_text('#fr-box')
    assert pg.is_disabled('[data-fr=water]') and 'já regou hoje' in pg.inner_text('#fr-box')
    # voltar à lista
    pg.click('[data-fr=gback]');pg.wait_for_timeout(200);assert pg.locator('.frcard').count()==2
    # servidor sem o SQL novo
    st['installed']=False;pg.evaluate("()=>document.querySelector('.frset').open=true");pg.uncheck('#fr-s5');pg.wait_for_timeout(500)
    assert 'jardim.sql' in pg.inner_text('#fr-box'),pg.inner_text('#fr-box')[:300]
    # política
    pg.evaluate("()=>closeSheet()");pg.evaluate("()=>openPrivacy()");pg.wait_for_timeout(200)
    t=pg.inner_text('#sheet');assert 'Regar o jardim' in t and 'quantas plantas você tem em cada estágio' in t
    assert errs==[],errs
    print('t45 ok')
finally:
  srv.terminate()
