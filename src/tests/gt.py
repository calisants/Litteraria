from playwright.sync_api import sync_playwright
import os,json
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':390,'height':844});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file://'+os.path.abspath('mots-parole-v4.html'));pg.wait_for_timeout(800)
    pg.click('#go-games')
    for lang in ('fr','it','en'):
        pg.click(f'#s-vol [data-k=lang][data-v={lang}]')
        print(lang,pg.locator('#s-vol .tile b').all_inner_texts())
        pg.click('[data-pick-vol="4"]');pg.wait_for_timeout(100)
        print(' jogos:',pg.locator('#f-game option').all_inner_texts(),'theme visible',pg.is_visible('#f-theme-w'),'level',pg.is_visible('#f-level-w'),'rows',pg.locator('#toc .toc-row').count())
        ids=pg.evaluate("()=>[...document.querySelectorAll('#toc .toc-row')].map(b=>b.dataset.id)")
        for pid in ids:
            pg.click(f'.toc-row[data-id="{pid}"]');pg.wait_for_timeout(60)
            for i in range(6):
                a=pg.evaluate("()=>gm.items[gm.i].a")
                if i==0:  # errar primeiro
                    wr=(a+1)%4;pg.click(f'#gstage .lopt[data-k="{wr}"]');pg.click('#gm-submit')
                pg.click(f'#gstage .lopt[data-k="{a}"]');pg.click('#gm-submit');pg.click('#gm-next')
            pg.wait_for_timeout(60);pg.click('#sheet-close') if pg.is_visible('#sheet-close') else None
            pg.click('#s-game [data-back]')
        n=pg.evaluate(f"()=>VOLUME4.pages.filter(p=>S.done['{lang}:'+p.id]).length")
        print(' concluidas',n,'de',len(ids))
        pg.click('#s-index [data-back]')
    pg.screenshot(path='g0.png')
    print(errs);b.close()
