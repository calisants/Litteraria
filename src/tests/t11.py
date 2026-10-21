from playwright.sync_api import sync_playwright
import os,json,subprocess,time
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8780','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
with sync_playwright() as p:
    b=p.chromium.launch();ctx=b.new_context(viewport={'width':390,'height':844});pg=ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
    pg.goto('http://localhost:8780/index.html');pg.wait_for_timeout(500)
    print('goal:',pg.inner_text('#goal-txt'),'|',pg.inner_text('#today-sub'))
    # dica de alternativa errada
    pg.click('#go-games');pg.click('#s-vol [data-k=lang][data-v=fr]');pg.click('[data-pick-vol="4"]');pg.click('.toc-row[data-id="presente-1"]')
    d=pg.evaluate("()=>gm.items[gm.i].d");bad=[k for k,o in enumerate(pg.evaluate("()=>gm.items[gm.i].o")) if pg.evaluate("(k)=>gm.items[gm.i].d&&gm.items[gm.i].d[gm.items[gm.i].o[k]]",k)][0]
    pg.click(f'#gstage .lopt[data-k="{bad}"]');pg.click('#gm-submit');print('hint:',pg.inner_text('#gm-status'))
    print('goal n apos 1 resposta:',pg.evaluate("()=>dayN()"))
    pg.click('#s-game [data-back]');pg.click('#s-index [data-back]');pg.click('#s-vol [data-back]')
    # vocabulario errado entra na fila
    pg.evaluate("()=>{skRec('bonjour','bom dia',false);skRec('bonsoir','x',false);Object.keys(S.rvv).forEach(k=>S.rvv[k][0]=Date.now()-5);save();renderMe();}")
    print('rvv:',pg.evaluate("()=>Object.keys(S.rvv)"),'| due:',pg.evaluate("()=>dueCount()"))
    pg.click('#go-today');pg.wait_for_timeout(100)
    types=pg.evaluate("()=>gm.types");print('tipos revisao',types)
    # responder revisao: itens de vocabulario digitando
    for i in range(len(types)):
        it=pg.evaluate("()=>({a:gm.items[gm.i].a,v:!!gm.items[gm.i]._v,ok:gm.items[gm.i].ok||null,typ:typedOn(gm.items[gm.i])})")
        if it['v'] and not it['typ']:pg.click('#typed-toggle')
        if it['v'] or it['typ']:
            ans=pg.evaluate("()=>accepts(gm.items[gm.i])[0]");pg.fill('#gm-typed',ans);pg.click('#gm-submit')
        else:
            pg.click(f'#gstage .lopt[data-k="{it["a"]}"]');pg.click('#gm-submit')
        pg.click('#gm-next')
    print('sheet:',pg.inner_text('#sheet-in')[:70].replace('\n',' '))
    print('rvv apos:',pg.evaluate("()=>JSON.stringify(S.rvv)")[:120])
    pg.click('#sheet-close');pg.click('#s-game [data-back]')
    # treino em cada idioma
    for lang in ('fr','it','en'):
        pg.evaluate(f"()=>{{S.lang='{lang}';save();}}")
        for kind in ('verb','word'):
            pg.evaluate("()=>go('home')");pg.click('#go-train');pg.wait_for_timeout(50)
            btns=pg.locator('#sheet-in [data-train]');n=btns.count()
            idx=1 if kind=='verb' else n-1
            btns.nth(idx).click();pg.wait_for_timeout(80)
            q0=pg.inner_text('#gstage .gq');
            for i in range(10):
                ans=pg.evaluate("()=>accepts(gm.items[gm.i])[0]")
                if i==2:pg.fill('#gm-typed','zzzz');pg.click('#gm-submit')
                pg.fill('#gm-typed',ans);pg.press('#gm-typed','Enter');pg.click('#gm-next')
            print(lang,kind,'q0=',q0.replace('\n',' ')[:50],'| fim:',pg.inner_text('#sheet-in')[:40].replace('\n',' '))
            pg.click('#drill-more');pg.wait_for_timeout(60);pg.click('#s-game [data-back]')
    print('meta:',pg.evaluate("()=>goalText()"))
    pg.evaluate("()=>{go('settings');document.querySelectorAll('#s-settings details').forEach(d=>d.open=true)}");pg.click('[data-goal="10"]');print('goal',pg.evaluate("()=>S.goal"))
    pg.evaluate("()=>go('home')");pg.screenshot(path='t11-home.png')
    print('errs',errs);b.close();srv.terminate()
    assert not errs,errs
