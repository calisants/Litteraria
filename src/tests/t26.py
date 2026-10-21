"""Testa v1.41: Política de Privacidade, conta por código de e-mail, sincronização com a nuvem, conflito, baixar dados, apagar conta.
O Supabase é simulado aqui (rotas interceptadas); o serviço de verdade só se confirma com o projeto dela.
Uso (na pasta src/):  python3 -I tests/t26.py"""
import subprocess,time,os,json,re
from urllib.parse import urlparse,parse_qs
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8787','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
CORS={'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'*'}
class Fake:
    def __init__(s): s.prog={};s.cons={};s.n=0;s.codes=[];s.deleted=0
    def stamp(s): s.n+=1; return '2026-10-21T15:00:%02d.%06d+00:00'%(s.n%60,s.n)
fk=Fake()
CFG=['{url:"http://cloud.test",key:"anon-test"}']
def handler(route):
    rq=route.request;u=urlparse(rq.url);path=u.path;q=parse_qs(u.query)
    if rq.method=='OPTIONS': return route.fulfill(status=204,headers=CORS)
    def J(code,obj): route.fulfill(status=code,headers=dict(CORS,**{'content-type':'application/json'}),body=json.dumps(obj))
    body=json.loads(rq.post_data) if rq.post_data else {}
    if path=='/auth/v1/otp': fk.codes.append(body['email']);return J(200,{})
    if path=='/auth/v1/verify':
        if body.get('token')!='123456': return J(400,{'msg':'Token has expired or is invalid'})
        return J(200,{'access_token':'at1','refresh_token':'rt1','expires_in':3600,'expires_at':int(time.time())+3600,'user':{'id':'u1','email':body['email']}})
    if path=='/rest/v1/progress':
        if rq.method=='GET': return J(200,[dict(fk.prog)] if fk.prog else [])
        if rq.method=='POST':
            if fk.prog: return J(409,{'message':'duplicate'})
            fk.prog={'data':body['data'],'updated_at':fk.stamp()};return J(201,[fk.prog])
        if rq.method=='PATCH':
            want=q.get('updated_at',[''])[0].replace('eq.','')
            if not fk.prog or fk.prog['updated_at']!=want: return J(200,[])
            fk.prog={'data':body['data'],'updated_at':fk.stamp()};return J(200,[fk.prog])
    if path=='/rest/v1/consents':
        if rq.method=='POST': fk.cons=body;return J(201,[])
        return J(200,[fk.cons] if fk.cons else [])
    if path=='/rest/v1/rpc/delete_me': fk.prog={};fk.cons={};fk.deleted+=1;return J(204,{})
    return J(404,{'msg':'?'})
def page_html(route):
    r=route.fetch();cfg=CFG[0];t=re.sub(r'window\.CLOUDCFG=\{[^}]*\}','window.CLOUDCFG='+cfg,r.text())
    route.fulfill(response=r,body=t)
try:
  with sync_playwright() as p:
    b=p.chromium.launch();errs=[]
    def newpage(ctx,cloud=True):
        pg=ctx.new_page()
        pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.on('console',lambda m:errs.append(m.text) if m.type=='error' and 'Failed to load resource' not in m.text else None)
        if cloud:
            pg.route('http://cloud.test/**',handler)
            pg.route('**/index.html',page_html)
        return pg
    openset=lambda pg:pg.evaluate("()=>{go('settings');document.querySelectorAll('#s-settings details').forEach(d=>d.open=true)}")
    # 1) sem nuvem configurada: sem o grupo; política sem a parte de conta
    CFG[0]='{url:"",key:""}'
    c0=b.new_context(viewport={'width':390,'height':844},service_workers='block');pg=newpage(c0,cloud=False)
    pg.route('**/index.html',page_html)
    pg.goto('http://localhost:8787/index.html');pg.wait_for_timeout(800);openset(pg)
    assert pg.locator('#sec-cloud').count()==0
    pg.click('#open-priv');t=pg.inner_text('#sheet').lower();assert 'sem conta, nada sai do seu aparelho' in t and 'conta (opcional)' not in t and 'seus direitos' not in t
    c0.close();CFG[0]='{url:"http://cloud.test",key:"anon-test"}'
    # 2) com nuvem: entrar
    c1=b.new_context(viewport={'width':390,'height':844},service_workers='block');pg=newpage(c1)
    pg.goto('http://localhost:8787/index.html');pg.wait_for_timeout(800);openset(pg)
    assert pg.locator('#sec-cloud').count()==1
    pg.evaluate("()=>{S.done['fr:alfabeto-1']=1;S.done['fr:alfabeto-2']=1;save()}")
    pg.click('#cl-send');assert 'e-mail' in pg.inner_text('#cloud-box')   # e-mail vazio
    pg.fill('#cl-email','ana@exemplo.com');pg.click('#cl-send');assert 'duas caixas' in pg.inner_text('#cloud-box')
    pg.fill('#cl-email','ana@exemplo.com');pg.check('#cl-age');pg.check('#cl-pol')
    pg.click('#cl-send');pg.wait_for_selector('#cl-code');assert fk.codes==['ana@exemplo.com']
    pg.fill('#cl-code','000000');pg.click('#cl-verify');pg.wait_for_timeout(400);assert 'incorreto ou vencido' in pg.inner_text('#cloud-box')
    pg.fill('#cl-code','123456');pg.click('#cl-verify');pg.wait_for_selector('#cl-now');pg.wait_for_timeout(500)
    assert fk.cons.get('age_ok')==True and fk.cons.get('policy_version')=='2026-10-21',fk.cons
    assert len(fk.prog['data']['done'])==2 and 'rm' in fk.prog['data']
    assert 'ana@exemplo.com' in pg.inner_text('#cloud-box')
    # política com a parte de conta
    pg.click('#open-priv') if pg.is_visible('#open-priv') else None
    pg.evaluate("()=>openPrivacy()");t=pg.inner_text('#sheet').lower();assert 'conta (opcional)' in t and 'seus direitos' in t and 'idade' in t;pg.evaluate("()=>closeSheet()")
    # 3) enviar mudança local
    pg.evaluate("()=>{S.done['fr:alfabeto-3']=1;save()}");pg.click('#cl-now');pg.wait_for_timeout(600)
    assert len(fk.prog['data']['done'])==3
    # 4) conflito: outro aparelho gravou antes
    other=json.loads(json.dumps(fk.prog['data']));other['done']['fr:alfabeto-9']=1;other['done']['fr:alfabeto-8']=1
    fk.prog={'data':other,'updated_at':fk.stamp()}
    pg.evaluate("()=>{S.done['fr:alfabeto-4']=1;save()}");pg.click('#cl-now');pg.wait_for_selector('#cl-cloud')
    t=pg.inner_text('#sheet');assert 'Neste aparelho' in t and 'Na nuvem' in t
    pg.click('#cl-cloud');pg.wait_for_timeout(900)
    pg.wait_for_load_state();pg.wait_for_timeout(800)
    done=pg.evaluate("()=>Object.keys(S.done).sort()");assert 'fr:alfabeto-9' in done and 'fr:alfabeto-4' not in done,done
    # 5) baixar meus dados
    openset(pg);print('caixa:',pg.inner_text('#cloud-box')[:120].replace(chr(10),' | '),'| sessão:',pg.evaluate("()=>localStorage.getItem('mots-parole-cloud')")[:60])
    with pg.expect_download() as dl: pg.click('#cl-dl')
    d=json.load(open(dl.value.path(),encoding='utf8'));assert d['email']=='ana@exemplo.com' and d['progresso']['done'] and d['consentimento'][0]['age_ok']
    # 6) outro aparelho vazio: o progresso da nuvem vem sozinho
    c2=b.new_context(viewport={'width':390,'height':844},service_workers='block');p2=newpage(c2)
    p2.goto('http://localhost:8787/index.html');p2.wait_for_timeout(600);openset(p2)
    p2.fill('#cl-email','ana@exemplo.com');p2.check('#cl-age');p2.check('#cl-pol');p2.click('#cl-send');p2.wait_for_selector('#cl-code')
    p2.fill('#cl-code','123456');p2.click('#cl-verify');p2.wait_for_timeout(1500)
    assert 'fr:alfabeto-9' in p2.evaluate("()=>Object.keys(S.done)"),'aparelho novo deveria receber o progresso'
    c2.close()
    # 7) sair e apagar a conta
    pg.reload();pg.wait_for_timeout(900);openset(pg)
    pg.click('#cl-out');assert pg.is_visible('#cl-email') and pg.evaluate("()=>Object.keys(S.done).length")>0
    pg.fill('#cl-email','ana@exemplo.com');pg.check('#cl-age');pg.check('#cl-pol');pg.click('#cl-send');pg.wait_for_selector('#cl-code')
    pg.fill('#cl-code','123456');pg.click('#cl-verify');pg.wait_for_timeout(1500)
    openset(pg);pg.wait_for_selector('#cl-del');pg.click('#cl-del');pg.click('#cl-del2');pg.wait_for_timeout(600)
    assert fk.deleted==1 and not fk.prog and not fk.cons and pg.is_visible('#cl-email')
    assert pg.evaluate("()=>Object.keys(S.done).length")>0,'progresso local deve ficar'
    print('erros:',errs);assert not errs
    print('OK t26')
finally: srv.terminate()
