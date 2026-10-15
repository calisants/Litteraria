"""Testa: Treino com idioma, versão, sugestões, volumes reordenados, exercícios de escrita, volume do som, tremor/vibração.
Uso (na pasta src/):  python3 -I tests/t14.py"""
import subprocess,time,os
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8766','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch();ctx=b.new_context(viewport={'width':390,'height':844});pg=ctx.new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
    pg.goto('http://localhost:8766/index.html');pg.wait_for_timeout(800)
    # versão
    print('versao:',pg.inner_text('#ver-line'));assert 'Versão' in pg.inner_text('#ver-line') and '/' in pg.inner_text('#ver-line')
    # Treino: idioma explícito e troca
    pg.click('#go-train');t=pg.inner_text('#sheet-title');print('treino:',t);assert t.startswith('Treino de ')
    pg.click('[data-trainlang=it]');assert pg.inner_text('#sheet-title')=='Treino de Italiano' and pg.evaluate("()=>S.lang")=='it'
    assert 'Italiano' in pg.inner_text('#sheet-in')
    pg.click('[data-train=w]');pg.wait_for_timeout(200);assert 'Italiano' in pg.inner_text('#g-sub');print('sub:',pg.inner_text('#g-sub'))
    pg.evaluate("()=>go('home')");assert 'Italiano' in pg.inner_text('#train-sub')
    # sugestões
    pg.evaluate("()=>go('settings')");pg.click('#s-settings [data-feedback]');assert pg.is_visible('#fb-text')
    pg.click('#fb-send');assert 'Escreva algo' in pg.inner_text('#fb-note')
    pg.fill('#fb-text','teste');
    with ctx.expect_page() as np_: pg.click('#fb-send')
    from urllib.parse import unquote
    u=unquote(unquote(np_.value.url));print('url:',u[:120]);assert 'github.com' in u and 'calisants/motsparole/issues/new?title=' in u
    assert 'Versão 1.1.0' in u and 'camilimasiv' not in u
    pg.evaluate("()=>closeSheet()")
    # volumes
    v=pg.evaluate("()=>VOLUMES.map(v=>v.title+' :: '+v.types.map(t=>t[0]).join(','))");print(*v,sep='\n')
    assert [x.split(' ·')[0] for x in v]==['Volume 1','Volume 2','Volume 3','Volume 4','Volume 5']
    assert v[2].endswith('odd,connect,search,cross')
    # seeds de páginas movidas continuam com o volume de origem
    s=pg.evaluate("()=>{S.lang='fr';S.vol=5;const r=[];for(const id of ['tema-comida','ditado-comida']){P=VOLUME5.pages.find(p=>p.id===id);r.push([P.vid,P.id])}return r}");print(s);assert all(x[0]==2 for x in s)
    # exercícios de escrita, todos os idiomas e temas, sem áudio obrigatório
    res=pg.evaluate("""()=>{const out=[];for(const l of ['fr','it','en'])for(const t of ['reco','completar','embaralhar','escreva'])for(const c of CATS)for(const part of [1,2]){
      S.lang=l;S.vol=5;P=VOLUME5.pages.find(p=>p.id===t+'-'+c[0]+'-'+part);startVoc();
      if(!gm.items.length||gm.items.length<5)out.push(['pouco',l,t,c[0],part,gm.items.length]);
      gm.items.forEach(it=>{if(t!=='reco'){const a=it.ok[0];if(!a||/[?]/.test(a))out.push(['ok',l,t,a]);}
        if(t==='embaralhar'){const q=it.q.split('\\n')[1].toLowerCase().replace(/ /g,'');if(q===it.k.toLowerCase())out.push(['igual',it.k]);
          if([...q].sort().join('')!==[...it.k.toLowerCase()].sort().join(''))out.push(['letras',it.k,q]);}
        if(t==='completar'&&!/[?]/.test(it.q.split('\\n')[1]))out.push(['semfalta',it.k]);});}
      return out}""");print('problemas:',res[:8],len(res));assert not res
    # jogar uma página de escrever: erro entra na revisão como palavra; acerto não
    pg.evaluate("()=>{S.lang='fr';S.vol=5;S.rvv={};S.day={d:'',n:0};startPage('escreva-saudacoes-1')}");pg.wait_for_timeout(200)
    assert pg.is_visible('#gm-typed')
    ans=pg.evaluate("()=>gm.items[0].ok[0]");wk=pg.evaluate("()=>gm.items[0].k")
    pg.fill('#gm-typed','xyz');pg.click('#gm-submit');assert 'Ainda não' in pg.inner_text('#gm-status') or 'Dica' in pg.inner_text('#gm-status')
    assert pg.evaluate("(k)=>!!S.rvv['fr:v|'+k.toLowerCase()]",wk),'erro deveria entrar na revisão'
    pg.fill('#gm-typed',ans);pg.click('#gm-submit');assert 'Certo' in pg.inner_text('#gm-status')
    # volume do som e vibração
    pg.evaluate("""()=>{window.__g=[];window.__v=[];const C=window.AudioContext||window.webkitAudioContext;
      const og=C.prototype.createGain;C.prototype.createGain=function(){const g=og.call(this);const e=g.gain.exponentialRampToValueAtTime.bind(g.gain);g.gain.exponentialRampToValueAtTime=(v,t)=>{if(v>.001)window.__g.push(v);return e(v,t)};return g};
      navigator.vibrate=p=>{window.__v.push(p);return true};}""")
    vols={}
    for lv in ['low','mid','high']:
        pg.evaluate("(l)=>{S.snd=l;S.sound='on';window.__g=[];sfx('ok')}",lv);vols[lv]=max(pg.evaluate("()=>window.__g"))
    print('ganhos ok:',vols);assert vols['low']<vols['mid']<vols['high']<=.2 and vols['mid']>=.09
    pg.evaluate("()=>{S.hap='on';window.__v=[];sfx('bad')}");assert pg.evaluate("()=>window.__v.length")==1
    pg.evaluate("()=>{S.hap='off';window.__v=[];sfx('bad')}");assert pg.evaluate("()=>window.__v.length")==0
    pg.evaluate("()=>{S.sound='off';sfx('bad')}")
    assert pg.evaluate("()=>[...document.querySelectorAll('#s-game .tremble')].length")>=1,'tremor na tela'
    pg.evaluate("()=>go('settings')");pg.click('#s-settings [data-k=snd][data-v=high]');assert pg.evaluate("()=>S.snd")=='high'
    pg.click('#s-settings [data-k=hap][data-v=off]');assert pg.evaluate("()=>S.hap")=='off'
    pg.reload();pg.wait_for_timeout(500);assert pg.evaluate("()=>[S.snd,S.hap]")==['high','off']
    print('erros:',errs);assert not errs
    b.close()
finally: srv.terminate()
