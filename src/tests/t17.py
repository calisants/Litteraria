"""Testa: estilos visuais (7 + padrão), variações de cor, contraste, persistência, Cultural por idioma, painéis.
Uso (na pasta src/):  python3 -I tests/t17.py   (SHOTS=pasta salva capturas de tela)"""
import subprocess,time,os
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8774','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
SH=os.environ.get('SHOTS')
CONTR="""()=>{const out=[];const L=h=>{const c=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4));return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const cr=(a,b)=>{const x=L(a),y=L(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
Object.keys(STYLES).forEach(id=>['fr'].forEach(lg=>{S.lang=lg;schemeList(id).forEach((s,i)=>{
 const ink=cr(s[7],s[2]),mut=cr(s[8],s[3]),acc=cr(s[9],s[3]),oa=cr(lum(s[9])<.19?'#ffffff':'#0d1117',s[9]),ok=cr(s[10],s[3]),bad=cr(s[11],s[3]);
 if(ink<7||mut<4.5||acc<3||oa<4.5||ok<3||bad<3)out.push([id,lg,s[0],+ink.toFixed(1),+mut.toFixed(1),+acc.toFixed(1),+oa.toFixed(1),+ok.toFixed(1),+bad.toFixed(1)])})}));return out}"""
try:
  with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_context(viewport={'width':390,'height':844}).new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
    pg.goto('http://localhost:8774/index.html');pg.wait_for_timeout(700)
    bad=pg.evaluate(CONTR);print('contraste abaixo do mínimo:',bad);assert not bad
    assert pg.evaluate("()=>S.style")=='padrao' and pg.evaluate("()=>document.documentElement.dataset.style")=='padrao'
    pg.click('#go-settings');pg.wait_for_timeout(200)
    assert pg.locator('#style-grid .stcard').count()==1+pg.evaluate('()=>Object.keys(STYLES).length')
    ids=['fofo','soft','pp','alice','pinocchio','verne','peter','wind','sherlock','frank','musq','principe','dante']
    assert [pg.locator('#style-grid [data-style=%s]'%i).count() for i in ('tech','game','cultural','exec','min')]==[0,0,0,0,0]
    assert [pg.locator('#scheme-row .sch').count() for _ in [pg.click('#style-grid [data-style=fofo]')]]==[3]
    for i in ids:
      pg.click('#style-grid [data-style=%s]'%i);pg.wait_for_timeout(100)
      assert pg.evaluate("()=>document.documentElement.dataset.style")==i
      assert pg.is_hidden('#sec-cor') and pg.is_visible('#scheme-row')
      n=pg.locator('#scheme-row .sch').count();assert n>=2
      acc0=pg.evaluate("()=>getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()")
      pg.click('#scheme-row .sch >> nth=1');pg.wait_for_timeout(100)
      acc1=pg.evaluate("()=>getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()")
      assert pg.evaluate("()=>S.scheme")==1 and (acc0!=acc1),(i,acc0,acc1)
      if SH:pg.screenshot(path=SH+'/set-%s.png'%i)
    # escuro: 2ª variação de «Beira do Rio» => data-appmode dark
    pg.click('#style-grid [data-style=wind]');pg.click('#scheme-row .sch >> nth=1');assert pg.evaluate("()=>document.documentElement.dataset.appmode")=='dark'
    pg.reload();pg.wait_for_timeout(600)
    assert pg.evaluate("()=>[S.style,S.scheme]")==['wind',1] and pg.evaluate("()=>document.documentElement.dataset.style")=='wind'
    # estilos removidos salvos por versões anteriores caem no Padrão
    for old in ('tech','game','cultural','exec','min'):
        pg.evaluate("(o)=>{const x=JSON.parse(localStorage.getItem(KEY));x.style=o;x.scheme=1;localStorage.setItem(KEY,JSON.stringify(x))}",old);pg.reload();pg.wait_for_timeout(400)
        assert pg.evaluate("()=>S.style")=='padrao',old
    assert pg.evaluate("()=>schemeList('fofo').map(s=>s[0])")==['Rosa bebê','Azul céu','Lavanda e champagne']
    assert pg.evaluate("()=>schemeList('soft').map(s=>s[0])")==['Branco, bege, dourado','Nude e salmão']
    # valor inválido salvo é descartado
    pg.evaluate("()=>{const o=JSON.parse(localStorage.getItem(KEY));o.style='hack';o.scheme=99;localStorage.setItem(KEY,JSON.stringify(o))}")
    pg.reload();pg.wait_for_timeout(500);assert pg.evaluate("()=>[S.style,S.scheme]")==['padrao',0]
    # voltar ao padrão restaura Cor e remove cores forçadas
    pg.evaluate("()=>{S.style='soft';save();applyTheme()}");pg.evaluate("()=>{S.style='padrao';save();applyTheme();syncPrefs()}")
    assert pg.evaluate("()=>document.documentElement.style.getPropertyValue('--ink')")==''
    # telas em cada estilo: início, lição, estatísticas, sem erros
    pg.evaluate("()=>{S.sk={fr:{a:[1,3,'x'],b:[4,0,'y']}};S.rv={};S.plays={fr:{cross:5}};save()}")
    for i in ids:
      pg.evaluate("(i)=>{S.style=i;S.scheme=0;S.lang='fr';save();applyTheme();go('home')}",i);pg.wait_for_timeout(100)
      if SH:pg.screenshot(path=SH+'/home-%s.png'%i)
      pg.evaluate("()=>{go('stats')}");pg.wait_for_timeout(100)
      if SH:pg.screenshot(path=SH+'/stats-%s.png'%i)
      pg.evaluate("()=>{go('home');startPage('cross-comida-adv')}");pg.wait_for_timeout(300)
      if SH:pg.screenshot(path=SH+'/game-%s.png'%i)
      pg.evaluate("()=>go('home')")
    # sem rolagem horizontal em nenhum estilo
    for i in ids:
      pg.evaluate("(i)=>{S.style=i;applyTheme();go('settings')}",i)
      assert pg.evaluate("()=>document.documentElement.scrollWidth<=innerWidth+1"),i
    print('erros:',errs);assert not errs
    print('t17 ok')
finally:
  srv.terminate()
