"""Testa (v1.62): tutorial de boas-vindas, logo do perfil recolhido, ordem da trilha (volumes 1-3 antes de 4-5), ícone da notificação.
Uso (na pasta src/):  python3 -I tests/t33.py"""
import subprocess,time,os
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8783','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch()
    # 1) instalação nova com __tourTest: o tutorial abre sozinho; 6 passos; «Começar» fecha e marca
    ctx=b.new_context(viewport={'width':390,'height':844});ctx.add_init_script("window.__tourTest=1")
    pg=ctx.new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
    pg.goto('http://localhost:8783/index.html');pg.wait_for_timeout(1500)
    assert pg.locator('#tour').count()==1
    for k in range(5):
      assert pg.locator('.tour-n').inner_text().startswith(str(k+1)+' de 6')
      pg.click('[data-tour=next]')
    assert pg.locator('.tour-n').inner_text().startswith('6 de 6')
    pg.click('[data-tour=back]');assert pg.locator('.tour-n').inner_text().startswith('5 de 6');pg.click('[data-tour=next]')
    pg.click('[data-tour=done]');assert pg.locator('#tour').count()==0
    assert pg.evaluate("()=>localStorage.getItem('mots-parole-tour')")=='1'
    # recarregar não abre de novo
    pg.reload();pg.wait_for_timeout(1500);assert pg.locator('#tour').count()==0
    # botão em Ajustes reabre; «Pular» fecha
    pg.evaluate("()=>{document.querySelectorAll('details').forEach(d=>d.open=true);}")
    pg.evaluate("()=>{go('settings');document.querySelectorAll('details').forEach(d=>d.open=true);}")
    pg.click('#open-tour');assert pg.locator('#tour').count()==1
    pg.click('[data-tour=skip]');assert pg.locator('#tour').count()==0
    # 2) quem já tem progresso não vê o tutorial
    ctx2=b.new_context(viewport={'width':390,'height':844});ctx2.add_init_script("window.__tourTest=1")
    p2=ctx2.new_page();p2.goto('http://localhost:8783/index.html');p2.wait_for_timeout(800)
    p2.evaluate("()=>{S.player='A';save();localStorage.removeItem('mots-parole-tour');}")
    p2.reload();p2.wait_for_timeout(1500);assert p2.locator('#tour').count()==0
    # sem __tourTest (navegador automatizado) também não abre
    ctx3=b.new_context(viewport={'width':390,'height':844});p3=ctx3.new_page();p3.goto('http://localhost:8783/index.html');p3.wait_for_timeout(1500)
    assert p3.locator('#tour').count()==0
    # 3) logo do perfil recolhido; escolher fecha
    pg.evaluate("()=>{go('profile');document.getElementById('avbox').open=false;}");pg.wait_for_timeout(300)
    assert not pg.evaluate("()=>document.getElementById('avbox').open")
    assert pg.locator('#avgrid').is_hidden()
    pg.click('#avbox > summary');assert pg.locator('#avgrid').is_visible()
    pg.click('#avgrid [data-av=book]');assert not pg.evaluate("()=>document.getElementById('avbox').open")
    assert 'avatar' in pg.evaluate("()=>document.getElementById('av-cur').innerHTML")
    # 4) trilha: sem gramática (4) nem conversação (5) antes do fim do vocabulário dos grupos; pronúncia espalhada
    r=pg.evaluate("""()=>{S.lang='fr';_path=null;const L=lessonPath();
      const iG=L.findIndex(r=>r.vol===4),iC=L.findIndex(r=>r.vol===3&&!r.early&&!r.page.book&&!r.page.rd),
            lastV=(()=>{let k=-1;L.forEach((r,i)=>{if(r.voc&&!r.early&&!/livro|book/.test(r.page.cat||'')&&i<iG)k=i;});return k})();
      const au=L.map((r,i)=>r.audio?i:-1).filter(i=>i>=0);
      return {iG,iC,lastV,au,n:L.length,firstGramNeed:L[iG].nf}}""")
    assert r['iG']>r['lastV']>0 and r['iC']>r['lastV'],r
    assert len(r['au'])==10 and r['au'][-1]>r['au'][4]>r['au'][3],r   # 4 no começo, o resto espalhado
    # 5) notificação: ícone de livro em branco (badge) existe e é usado
    assert 'badge-96.png' in open(os.path.join(root,'sw.js')).read()
    assert pg.evaluate("()=>fetch('badge-96.png').then(r=>r.ok)")
    assert not errs,errs
    print('ok t33 errs',errs)
finally:
  srv.terminate()
