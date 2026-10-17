from playwright.sync_api import sync_playwright
import os,json
with sync_playwright() as p:
    b=p.chromium.launch();ctx=b.new_context(viewport={'width':390,'height':844},accept_downloads=True);pg=ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file://'+os.path.abspath('mots-parole-v4.html'));pg.wait_for_timeout(600)
    print('today sub:',pg.inner_text('#today-sub'))
    pg.screenshot(path='t-home.png')
    # abrir presente #1 fr pelo indice
    pg.click('#go-games');pg.click('#s-vol [data-k=lang][data-v=fr]');pg.click('[data-pick-vol="4"]')
    pg.click('.toc-row[data-id="presente-1"]');pg.wait_for_timeout(100)
    # errar primeiro item, acertar o resto
    for i in range(6):
        a=pg.evaluate("()=>gm.items[gm.i].a")
        if i==0:
            pg.click(f'#gstage .lopt[data-k="{(a+1)%4}"]');pg.click('#gm-submit')
        pg.click(f'#gstage .lopt[data-k="{a}"]');pg.click('#gm-submit');pg.click('#gm-next')
    print('sheet:',pg.inner_text('#sheet-in')[:80].replace('\n',' '))
    print('rv:',pg.evaluate("()=>JSON.stringify(S.rv)"))
    pg.click('#sheet-close');pg.click('#s-game [data-back]');pg.click('#s-index [data-back]');pg.click('#s-vol [data-back]')
    pg.evaluate("()=>{Object.keys(S.rv).forEach(k=>S.rv[k][0]=Date.now()-1000);save();renderMe();}")
    print('today sub:',pg.inner_text('#today-sub'))
    pg.click('#go-today');pg.wait_for_timeout(100)
    print('title:',pg.inner_text('#g-title'),'| n items',pg.evaluate("()=>gm.items.length"))
    # modo digitar
    pg.click('#typed-toggle');pg.wait_for_timeout(50)
    ans=pg.evaluate("()=>gm.items[gm.i].o[gm.items[gm.i].a]");print('resposta esperada:',ans)
    pg.screenshot(path='t-typed.png')
    pg.fill('#gm-typed','xxx');pg.click('#gm-submit');print('st1:',pg.inner_text('#gm-status'))
    pg.fill('#gm-typed','xx');pg.click('#gm-submit');print('st2:',pg.inner_text('#gm-status'))
    pg.fill('#gm-typed',ans.upper());pg.press('#gm-typed','Enter');print('st3:',pg.inner_text('#gm-status'))
    print('rv apos revisao:',pg.evaluate("()=>JSON.stringify(S.rv)"))
    pg.click('#gm-next');
    pg.click('#sheet-close') if pg.is_visible('#sheet-close') else None
    # backup
    pg.click('#s-game [data-back]') if pg.is_visible('#s-game [data-back]') else None
    pg.evaluate("()=>go('settings')");
    with pg.expect_download() as d: pg.click('#bk-save')
    path=d.value.path();raw=open(path,encoding='utf8').read();print('backup bytes',len(raw),'done',len(json.loads(raw)['done']))
    pg.evaluate("()=>{localStorage.clear();}");pg.reload();pg.wait_for_timeout(300)
    print('apos limpar done=',pg.evaluate("()=>Object.keys(S.done).length"))
    pg.evaluate("()=>go('settings')")
    pg.set_input_files('#bk-file',path);pg.wait_for_timeout(200);print(pg.inner_text('#bk-note'))
    pg.click('#bk-go');pg.wait_for_timeout(500)
    print('apos restaurar done=',pg.evaluate("()=>Object.keys(S.done).length"),'rv=',pg.evaluate("()=>Object.keys(S.rv).length"))
    pg.evaluate("()=>go('settings')");pg.screenshot(path='t-settings.png',full_page=True)
    bad=pg.set_input_files('#bk-file',files=[{'name':'x.json','mimeType':'application/json','buffer':b'{"a":1}'}]);pg.wait_for_timeout(200);print(pg.inner_text('#bk-note'))
    print('errs',errs);b.close()
