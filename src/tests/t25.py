"""Testa v1.40: notificações com o app fechado (inscrição no cliente, envio de mensagem pelo service worker).
O envio de verdade (GitHub Actions → Apple/Google) não dá para testar aqui: ver push/LEIA-ME.md.
Uso (na pasta src/):  python3 -I tests/t25.py"""
import subprocess,time,os,json
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8785','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch();ctx=b.new_context(viewport={'width':390,'height':844},permissions=['notifications']);pg=ctx.new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.on('console',lambda m:errs.append(m.text) if m.type=='error' and 'sink' not in m.text and 'Failed to load resource' not in m.text else None)
    posts=[]
    def sink(route):
        req=route.request
        if req.method=='POST':posts.append(json.loads(req.post_data))
        route.fulfill(status=200,body='{"ok":true}',headers={'access-control-allow-origin':'*'})
    pg.route('http://sink.test/**',sink)
    pg.goto('http://localhost:8785/index.html');pg.wait_for_timeout(1200)
    pg.evaluate("()=>{PUSHCFG.sink=''}")
    open_=lambda:pg.evaluate("()=>{go('settings');document.querySelectorAll('#s-settings details').forEach(d=>d.open=true)}")
    # 1) sem caixa configurada: nada aparece e nada é enviado
    open_();assert pg.inner_text('#rm-push').strip()=='','sem sink deve ficar vazio'
    assert pg.evaluate("()=>PUSHCFG.pub.length")>80
    # 2) com caixa: simula PushManager (o headless não fala com o serviço de push da Apple/Google)
    pg.evaluate("""()=>{PUSHCFG.sink='http://sink.test/exec';
      Object.defineProperty(Notification,'permission',{get:()=>'granted',configurable:true});Notification.requestPermission=()=>Promise.resolve('granted');
      let cur=null;const mk=()=>({endpoint:'https://fcm.googleapis.com/fcm/send/teste-'+Math.random().toString(36).slice(2),toJSON(){return{endpoint:this.endpoint,keys:{p256dh:'BPk',auth:'aut'}}},unsubscribe(){cur=null;return Promise.resolve(true)}});
      PushManager.prototype.getSubscription=function(){return Promise.resolve(cur)};
      PushManager.prototype.subscribe=function(o){window.__subOpts=o;cur=cur||mk();return Promise.resolve(cur)};}""")
    open_();pg.wait_for_timeout(200)
    t=pg.inner_text('#rm-push');print('sem lembretes:',t[:70]);assert 'Ligue os lembretes' in t and 'Sem nome, e-mail ou progresso' in t
    pg.click('#rm-seg [data-rm="on"]');pg.wait_for_timeout(3600)
    sub=[x for x in posts if x.get('a')=='sub'];assert sub,posts
    x=sub[-1];print({k:x[k] for k in('h','tz','st','ln','done')});assert x['sub']['endpoint'].startswith('https://fcm.googleapis.com/') and len(x['id'])==32
    assert pg.evaluate("()=>window.__subOpts.userVisibleOnly")==True and pg.evaluate("()=>window.__subOpts.applicationServerKey.length")==65
    assert 'ativo' in pg.inner_text('#rm-push') and pg.evaluate("()=>window.__pushOn")==1
    # o estado para o service worker avisa que o envio é pelo servidor
    st=pg.evaluate("async()=>{const c=await caches.open('mp-state');return (await (await c.match('state.json')).json()).push}");assert st==1,st
    # mudar horário reenvia
    n0=len(sub);pg.select_option('#rm-hour','8');pg.wait_for_timeout(3600)
    sub=[x for x in posts if x.get('a')=='sub'];assert len(sub)>n0 and sub[-1]['h']==8
    # estudou hoje → avisa a caixa
    pg.evaluate("()=>{S.gam.days.push(ymd());save()}");pg.wait_for_timeout(3600)
    sub=[x for x in posts if x.get('a')=='sub'];assert sub[-1]['done']
    # desligar remove a inscrição
    pg.click('#rm-seg [data-rm="off"]');pg.wait_for_timeout(3600)
    assert any(x.get('a')=='del' for x in posts) and pg.evaluate("()=>window.__pushOn")==0
    # 3) service worker: a mensagem de push vira notificação (sw.js rodado com um «self» de mentira, em Node)
    js=r"""
const fs=require('fs'),vm=require('vm');const H={},shown=[],opened=[];
const self={addEventListener:(t,f)=>{H[t]=f},registration:{showNotification:(t,o)=>{shown.push([t,o]);return Promise.resolve()}},
 clients:{matchAll:()=>Promise.resolve([]),openWindow:u=>{opened.push(u);return Promise.resolve()},claim:()=>Promise.resolve()},skipWaiting(){}};
vm.runInNewContext(fs.readFileSync(process.argv[2],'utf8'),{self,caches:{open:()=>Promise.resolve({match:()=>Promise.resolve(null),put:()=>Promise.resolve(),addAll:()=>Promise.resolve()}),keys:()=>Promise.resolve([]),delete(){}},
 console,Response,fetch:()=>Promise.reject(),URL,Promise,JSON,Date,String,Object,Notification:undefined});
(async()=>{
 let w=[];const ev=(d)=>({data:d?{json:()=>d}:null,waitUntil:p=>w.push(p),notification:{close(){},data:d&&{go:d.go}},action:''});
 H.push(ev({t:'Teste',b:'Corpo',go:'cartao'}));H.push(ev(null));await Promise.all(w);
 const e=ev({go:'cartao'});H.notificationclick(e);await Promise.all(w);
 console.log(JSON.stringify({n:shown.length,t0:shown[0][0],b0:shown[0][1].body,g0:shown[0][1].data.go,t1:shown[1][0],g1:shown[1][1].data.go,tag:shown[0][1].tag,opened}));
})();
"""
    open('/tmp/_swpush.js','w').write(js)
    r=subprocess.run(['node','/tmp/_swpush.js',os.path.join(root,'sw.js')],capture_output=True,text=True);print(r.stdout.strip(),r.stderr.strip()[:300])
    o=json.loads(r.stdout.strip().splitlines()[-1]);assert o['n']==2 and o['t0']=='Teste' and o['g0']=='cartao' and o['t1']=='Litteraria' and o['g1']=='hoje' and o['opened']==['./?go=cartao'],o
    print('erros:',errs);assert not errs
    print('OK t25')
finally: srv.terminate()
