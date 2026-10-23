"""Testa (v1.63): Jardim da Memória, passo 1 (estágios, murchar, erro derruba 1 degrau, ausência longa).
Uso (na pasta src/):  python3 -I tests/t34.py"""
import subprocess,time,os
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8784','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch()
    ctx=b.new_context(viewport={'width':390,'height':844});pg=ctx.new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
    pg.goto('http://localhost:8784/index.html');pg.wait_for_timeout(1500)
    ev=lambda js:pg.evaluate(js)
    ev("()=>{S.lang='fr';S.gd={};S.sk.fr={};S.rvv={};}")
    # Sombra -> Semente no 1º acerto; errar na Semente não muda
    ev("()=>skRec('maison','t',false)");assert ev("()=>gdStage('fr','maison')")==0
    ev("()=>skRec('maison','t',true)");assert ev("()=>gdStage('fr','maison')")==1
    ev("()=>skRec('maison','t',false)");assert ev("()=>gdStage('fr','maison')")==1
    # Semente -> Flor só com 3+ dias de diferença
    ev("()=>skRec('maison','t',true)");assert ev("()=>gdStage('fr','maison')")==1  # mesmo dia
    ev("()=>{S.gd['fr:maison'][1]-=4;}");ev("()=>skRec('maison','t',true)");assert ev("()=>gdStage('fr','maison')")==2
    # Flor -> Fruto: precisa de 7 dias, 3 formas e 4 dias com acerto
    ev("()=>{const g=S.gd['fr:maison'];g[1]-=8;g[3]=3;g[2]=1|2;}")
    ev("()=>{window.GDFORM=2;skRec('maison','t',true);window.GDFORM=undefined;}");assert ev("()=>gdStage('fr','maison')")==3
    # errar derruba só 1 degrau e nunca zera o histórico
    ev("()=>skRec('maison','t',false)");assert ev("()=>gdStage('fr','maison')")==2
    ev("()=>skRec('maison','t',false)");assert ev("()=>gdStage('fr','maison')")==1
    ev("()=>skRec('maison','t',false)");assert ev("()=>gdStage('fr','maison')")==1
    assert ev("()=>S.sk.fr.maison[0]")>=3
    # murchar: Flor sem prática por > 28 dias cai 1 estágio, fica «precisa de água» e volta à fila
    ev("()=>{S.gd['fr:maison']=[2,1,0,3,0,1,-1];S.gdt=0;S.rvv={};}")
    ev("()=>{const t=Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5);S.gd['fr:maison'][5]=t-30;S.gdt=t-1;gdTick();}")
    assert ev("()=>gdStage('fr','maison')")==1 and ev("()=>gdWilted('fr','maison')")
    assert ev("()=>!!S.rvv['fr:v|maison']")
    assert ev("()=>gdWiltCount()")==1
    # Fruto só cai 1 estágio (não vai a Sombra) e Sombra/Semente nunca ficam abaixo de Semente por murchar
    ev("()=>{const t=Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5);S.gd['fr:chat']=[3,1,0,5,0,t-80,-1];S.gd['fr:chien']=[1,1,0,1,0,t-20,-1];gdTick();}")
    assert ev("()=>gdStage('fr','chat')")==2 and ev("()=>gdStage('fr','chien')")==1
    # acertar limpa a murcha
    ev("()=>skRec('maison','t',true)");assert not ev("()=>gdWilted('fr','maison')")
    # erro na fila: Flor perde 1 degrau; Semente perde 2
    assert ev("()=>{S.gd['fr:a']=[2,1,0,0,0,1,-1];S.gd['fr:b']=[1,1,0,0,0,1,-1];return [gdDrop('fr:v|a'),gdDrop('fr:v|b')];}")==[1,2]
    # limite de 3 murchas por sessão
    r=ev("()=>{['a1','a2','a3','a4','a5'].forEach(w=>S.gd['fr:'+w]=[2,1,0,0,1,1,-1]);return gdCap(['a1','a2','a3','a4','a5'].map(w=>'fr:v|'+w)).length;}")
    assert r==3,r
    # ausência > 14 dias: nenhuma queda, revisões vencidas espalhadas em 5 dias
    ev("()=>{const t=Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5);S.gd={'fr:x':[2,1,0,3,0,t-60,-1]};S.rvv={};for(let i=0;i<10;i++)S.rvv['fr:v|w'+i]=[Date.now()-864e5,1,0];S.gdt=t-20;gdTick();}")
    assert ev("()=>gdStage('fr','x')")==2
    days=ev("()=>new Set(Object.values(S.rvv).map(a=>a[0])).size");assert days>=4,days
    # validação no carregamento: lixo é descartado, valores limitados
    ev("()=>{localStorage.setItem(KEY,JSON.stringify(Object.assign({},S,{gd:{'fr:ok':[9,1,2,3,4,5,6],'xx:no':[1],'fr:bad':'x'},gdt:5})));}")
    pg.reload();pg.wait_for_timeout(1500)
    g=ev("()=>S.gd")
    assert 'xx:no' not in g and 'fr:bad' not in g and g['fr:ok'][0]==3 and g['fr:ok'][4]==1,g
    # Ciclo da palavra continua funcionando com a palavra murcha
    ev("()=>{S.lang='fr';S.gd={'fr:maison':[2,1,0,3,1,1,-1]};S.rvv={'fr:v|maison':[Date.now()-1000,1,0]};save();}")
    ev("()=>startCiclo()");pg.wait_for_timeout(500)
    assert pg.locator('text=Ciclo da palavra').count()>=1
    print('errs',[e for e in errs if 'favicon' not in e])
    assert not [e for e in errs if 'favicon' not in e]
    print('t34 ok')
finally:
  srv.terminate()
