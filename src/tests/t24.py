"""Testa v1.39: pontos/sequência opcionais, ícone do app, retomar lição ao voltar, jogos entre lições.
Uso (na pasta src/):  python3 -I tests/t24.py"""
import subprocess,time,os
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8783','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch();ctx=b.new_context(viewport={'width':390,'height':844});pg=ctx.new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
    pg.goto('http://localhost:8783/index.html');pg.wait_for_timeout(700)
    # pontos desligados por padrão; dias são anotados mesmo assim
    assert pg.evaluate("()=>S.gam.on")==False
    assert pg.evaluate("()=>S.gam.pts")==0
    # v1.53: a escolha de ícones foi retirada
    pg.evaluate("()=>{go('settings');document.querySelectorAll('#s-settings details').forEach(d=>d.open=true)}")
    assert not pg.query_selector('#ic-grid'),'sem escolha de ícones'
    # v1.53: palavras parecidas no dicionário e última tela
    pg.evaluate("()=>{S.lang='fr';save();dictOpen()}");pg.wait_for_timeout(200)
    assert 'cousine' in pg.text_content('#dict-list .pares') and 'cuisine' in pg.text_content('#dict-list .pares')
    pg.fill('#dict-q','cousine');pg.wait_for_timeout(200);assert pg.locator('#dict-list .pares').count()==1
    pg.evaluate("()=>{go('stats')}");pg.reload();pg.wait_for_timeout(900)
    assert pg.is_visible('#s-stats'),'reabre na última tela'
    pg.evaluate("()=>{go('home')}");pg.reload();pg.wait_for_timeout(900);assert pg.is_visible('#s-home')
    # Frase do dia sem imagem; retomada
    pg.evaluate("()=>{S.lang='en';save();go('home')}")
    pg.evaluate("()=>{const r=lessonPath().find(eligible);startLesson(r);}");pg.wait_for_timeout(300)
    pid=pg.evaluate("()=>P&&P.id");assert pid
    pg.evaluate("()=>document.dispatchEvent(new Event('visibilitychange'))")
    pg.evaluate("()=>window.dispatchEvent(new Event('pagehide'))");pg.wait_for_timeout(200)
    assert pg.evaluate("()=>!!localStorage.getItem(KEY+'-rs')"),'sem registro de retomada'
    pg.reload();pg.wait_for_timeout(900)
    assert pg.evaluate("()=>P&&P.id")==pid,'a lição não voltou'
    # intercalação: nenhuma sequência de 3 lições seguidas sem jogo ao avançar o «Próximo»
    run=pg.evaluate("""()=>{let max=0,cur=0;S.sq=0;S.lgt='';for(let i=0;i<14;i++){const r=nextNewPage();if(!r)break;
      const g=isGameRef(r);if(g){cur=0;S.sq=0;S.lgt=r.page.type;}else{cur++;S.sq++;}
      max=Math.max(max,cur);S.done[S.lang+':'+r.page.id]=1;}return max}""")
    assert run<=2,run
    print('erros:',errs);assert not errs
    print('OK t24')
finally: srv.terminate()
