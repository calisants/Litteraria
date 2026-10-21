"""Testa Amigos (v1.43): ativar, código, convidar, aceitar, bloquear, denunciar, desativar. Supabase simulado.
Uso (na pasta src/):  python3 -I tests/t28.py"""
import subprocess,time,os,json,re
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8788','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
CORS={'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'*'}
st={'poked':0,'me':None,'inc':[{'uid':'f1','nick':'Ana'}],'fr':[],'out':[],'blk':[],'calls':[],'installed':True}
def handler(route):
    rq=route.request;path=urlparse(rq.url).path
    if rq.method=='OPTIONS': return route.fulfill(status=204,headers=CORS)
    def J(code,obj): route.fulfill(status=code,headers=dict(CORS,**{'content-type':'application/json'}),body=json.dumps(obj))
    body=json.loads(rq.post_data) if rq.post_data else {}
    if path=='/auth/v1/otp': return J(200,{})
    if path=='/auth/v1/verify': return J(200,{'access_token':'at1','refresh_token':'rt1','expires_in':3600,'expires_at':int(time.time())+3600,'user':{'id':'u1','email':body['email']}})
    if path.startswith('/rest/v1/progress'): return J(200,[]) if rq.method=='GET' else J(201,[{'data':body.get('data'),'updated_at':'2026-10-21T15:00:00.000001+00:00'}])
    if path.startswith('/rest/v1/consents'): return J(201,[]) if rq.method=='POST' else J(200,[])
    if path=='/functions/v1/poke':
        st['poked']+=1;st['calls'].append(('POKE',body))
        return J(200,{'status':'ok' if st['poked']==1 else 'ja_hoje','sent':1})
    if path.startswith('/rest/v1/rpc/'):
        n=path.split('/')[-1];st['calls'].append((n,body))
        if not st['installed'] and n.startswith('friends'): return J(404,{'message':'Could not find the function public.%s in the schema cache'%n})
        if n=='friends_me': return J(200,st['me'])
        if n=='friends_enable':
            if len(body['p_nick'])<2: return J(400,{'message':'apelido deve ter de 2 a 20 letras'})
            st['me']={'code':'K7M2QX9P','nick':body['p_nick'],'share_streak':False,'share_words':False,'poke_ok':True};return J(200,'K7M2QX9P')
        if n=='friends_share': st['me'].update(share_streak=body['p_streak'],share_words=body['p_words']);return J(204,None)
        if n=='friends_stats': return J(204,None)
        if n=='friends_pokes_set': st['me']['poke_ok']=body['p_on'];return J(204,None)
        if n=='friends_list': return J(200,{'friends':st['fr'],'incoming':st['inc'],'outgoing':st['out'],'blocked':st['blk']})
        if n=='friends_request':
            if body['p_code'].upper()=='ZZZZZZZZ': return J(200,'nao_encontrado')
            st['out'].append({'uid':'f2','nick':'Bia'});return J(200,'enviado')
        if n=='friends_respond':
            if body['p_accept']: st['fr'].append({'uid':'f1','nick':'Ana','streak':5,'words':None,'week':None})
            st['inc']=[];return J(204,None)
        if n=='friends_block':
            st['fr']=[];st['blk'].append({'uid':body['p_uid'],'nick':'Ana'});return J(204,None)
        if n=='friends_unblock': st['blk']=[];return J(204,None)
        if n=='friends_report': st['blk'].append({'uid':body['p_uid'],'nick':'Ana'});st['fr']=[];return J(204,None)
        if n=='friends_disable': st['me']=None;st['fr']=[];return J(204,None)
        return J(204,None)
    return J(404,{'msg':'?'})
def page_html(route):
    r=route.fetch();t=re.sub(r'window\.CLOUDCFG=\{[^}]*\}','window.CLOUDCFG={url:"http://cloud.test",key:"anon-test"}',r.text());route.fulfill(response=r,body=t)
try:
  with sync_playwright() as p:
    b=p.chromium.launch();ctx=b.new_context(viewport={'width':390,'height':844},service_workers='block');pg=ctx.new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.on('console',lambda m:errs.append(m.text) if m.type=='error' and 'Failed to load resource' not in m.text else None)
    pg.on('dialog',lambda d:d.accept('conteúdo ofensivo') if d.type=='prompt' else d.accept())
    pg.route('http://cloud.test/**',handler);pg.route('**/index.html',page_html)
    pg.goto('http://localhost:8788/index.html');pg.wait_for_timeout(700)
    assert pg.is_visible('#go-friends'),'atalho na tela inicial'
    pg.click('#go-friends');assert pg.is_visible('#fr-login');pg.click('#fr-login');assert pg.is_visible('#s-settings') and pg.evaluate("()=>document.querySelector('#sec-cloud').open")
    pg.evaluate("()=>go('home')")
    # sem conta: orienta a entrar
    pg.evaluate("()=>openFriends()");assert 'entre na conta' in pg.inner_text('#fr-box').lower();pg.evaluate("()=>closeSheet()")
    # entra na conta
    pg.evaluate("()=>{go('settings');document.querySelectorAll('#s-settings details').forEach(d=>d.open=true)}")
    pg.fill('#cl-email','a@b.com');pg.check('#cl-age');pg.check('#cl-pol');pg.click('#cl-send');pg.wait_for_selector('#cl-code')
    pg.fill('#cl-code','12345678');pg.click('#cl-verify');pg.wait_for_selector('#cl-friends')
    # servidor sem a parte de Amigos
    st['installed']=False;pg.click('#cl-friends');pg.wait_for_selector('#fr-box');pg.wait_for_timeout(300)
    assert 'ainda não tem a parte de Amigos' in pg.inner_text('#fr-box'),pg.inner_text('#fr-box')
    pg.evaluate("()=>closeSheet()");st['installed']=True
    pg.click('#cl-friends');pg.wait_for_selector('#fr-on')
    t=pg.inner_text('#fr-box');assert 'opcional' in t and 'só entra quem tiver o seu' in t
    # apelido curto é recusado; depois ativa com sequência marcada
    pg.fill('#fr-nick','a');pg.click('#fr-on');pg.wait_for_timeout(300);assert '2 a 20' in pg.inner_text('#fr-box')
    pg.fill('#fr-nick','Cami');pg.check('#fr-s1');pg.click('#fr-on');pg.wait_for_selector('#fr-code')
    assert pg.inner_text('#fr-code')=='K7M2QX9P' and 'Ana' in pg.inner_text('#fr-box')
    assert ('friends_share',{'p_streak':True,'p_words':False}) in st['calls']
    assert any(c[0]=='friends_stats' for c in st['calls']),'deve enviar números'
    # convite por código inexistente e existente
    pg.fill('#fr-add','zzzzzzzz');pg.click('#fr-req');pg.wait_for_timeout(300);assert 'Não achei' in pg.inner_text('#fr-box')
    pg.fill('#fr-add','ABCD2345');pg.click('#fr-req');pg.wait_for_timeout(300);t=pg.inner_text('#fr-box');assert 'Convite enviado' in t and 'Bia' in t
    # aceita convite recebido; lista mostra só o que o amigo compartilha
    pg.click('[data-fr=acc]');pg.wait_for_timeout(300);t=pg.inner_text('#fr-box').lower();assert 'amigos (1)' in t and '5 dias seguidos' in t and 'palavras acertadas' not in t.split('amigos (1)')[1].split('convites enviados')[0]
    # cutucar: 1ª envia, 2ª no mesmo dia avisa; preferência de receber
    pg.click('[data-fr=poke]');pg.wait_for_timeout(300);assert 'Cutucada enviada' in pg.inner_text('#fr-box')
    assert ('POKE',{'uid':'f1'}) in st['calls']
    pg.click('[data-fr=poke]');pg.wait_for_timeout(300);assert 'já cutucou essa pessoa hoje' in pg.inner_text('#fr-box')
    assert pg.is_checked('#fr-poke');pg.uncheck('#fr-poke');pg.wait_for_timeout(300);assert ('friends_pokes_set',{'p_on':False}) in st['calls']
    # mudar compartilhamento
    pg.check('#fr-s2');pg.wait_for_timeout(300);assert ('friends_share',{'p_streak':True,'p_words':True}) in st['calls']
    # denunciar bloqueia; desbloquear
    pg.click('[data-fr=rep]');pg.wait_for_timeout(300);assert any(c[0]=='friends_report' and 'ofensivo' in c[1]['p_reason'] for c in st['calls']);assert 'bloqueados' in pg.inner_text('#fr-box').lower()
    pg.click('[data-fr=unb]');pg.wait_for_timeout(300);assert 'bloqueados' not in pg.inner_text('#fr-box').lower()
    # desativar
    pg.click('#fr-off');pg.wait_for_selector('#fr-on');assert pg.evaluate("()=>localStorage.getItem('mots-parole-friends')")is None
    # privacidade menciona Amigos
    pg.evaluate("()=>openPrivacy()");assert 'amigos (opcional' in pg.inner_text('#sheet').lower()
    print('erros:',errs);assert not errs;print('OK t28')
finally: srv.terminate()
