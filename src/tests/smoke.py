import json
from playwright.sync_api import sync_playwright
errs=[];res={}
URL='file:///tmp/claude-0/-home-claude/b7be1e6f-b9fc-5ca5-b42c-c17ff73eaa83/scratchpad/v4/mots-parole-v4.html'
with sync_playwright() as p:
    b=p.chromium.launch()
    ctx=b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,has_touch=True,color_scheme='light')
    pg=ctx.new_page()
    pg.on('console',lambda m:errs.append('console:'+m.text) if m.type=='error' and 'fonts' not in m.text.lower() and 'ERR_' not in m.text else None)
    pg.on('pageerror',lambda e:errs.append('pageerror:'+str(e)))
    pg.goto(URL);pg.wait_for_timeout(300)
    def ns(tag):
        res[tag]=pg.evaluate("()=>({sh:document.documentElement.scrollHeight,ih:innerHeight,sw:document.documentElement.scrollWidth,iw:innerWidth})")
    ns('index');pg.screenshot(path='shot-index.png')
    res['rows']=pg.evaluate("()=>document.querySelectorAll('.toc-row').length")
    for lang in ['fr','it','en']:
        pg.click(f'[data-k="lang"][data-v="{lang}"]')
        for pid in [p['id'] for p in json.loads(open('pages.json').read())]:
            pg.click(f'.toc-row[data-id="{pid}"]');pg.wait_for_timeout(80)
            ns('g-'+pid)
            if pid=='cross-1' and lang=='fr': pg.screenshot(path='shot-cross.png')
            if pid=='search-2' and lang=='it': pg.screenshot(path='shot-search.png')
            if pid=='sentence-1' and lang=='en': pg.screenshot(path='shot-sentence.png')
            if pid=='odd-1' and lang=='fr': pg.screenshot(path='shot-odd.png')
            pg.click('#s-game [data-back="index"]')
    # cruzada: revelar não marca; resolver digitando marca
    pg.click('.toc-row[data-id="cross-1"]')
    sol=pg.evaluate("()=>cw.order.map(e=>entryKeys(e).map(k=>cw.p.sol[k]).join(''))")
    pg.click('#cw-reveal');pg.click('#sheet-close')
    res['done_after_reveal']=pg.evaluate("()=>Object.keys(S.done)")
    pg.click('#g-new');pg.wait_for_timeout(100)
    pg.evaluate("()=>{const ks=Object.keys(cw.p.sol);const last=ks.filter(k=>!cw.given[k]).pop();ks.forEach(k=>{if(k!==last&&!cw.given[k])cw.vals[k]=cw.p.sol[k];});cw.cur=last;cw.ei=cw.order.indexOf(cw.map[last][0]||cw.map[last][1]);delete cw.vals[last];cw.finished=false;typeLetter(cw.p.sol[last]);}")
    pg.wait_for_timeout(600)
    res['done_after_solve']=pg.evaluate("()=>Object.keys(S.done)")
    pg.click('#sheet-index');pg.wait_for_timeout(100)
    res['st']=pg.evaluate("()=>document.querySelectorAll('.toc-row .st').length")
    pg.screenshot(path='shot-index-done.png')
    # kb toggle
    pg.click('.toc-row[data-id="cross-2"]')
    res['kb_before']=pg.evaluate("()=>!document.querySelector('#kb').hidden")
    pg.click('#kb-toggle');res['kb_after']=pg.evaluate("()=>!document.querySelector('#kb').hidden")
    pg.screenshot(path='shot-kb.png')
    # shake: letra errada + verificar
    pg.evaluate("()=>{cw.vals[cw.cur]='Q'==cw.p.sol[cw.cur]?'Z':'Q';paintCross();}")
    pg.click('#cw-check');res['shake_cells']=pg.evaluate("()=>document.querySelectorAll('.cc.shake').length")
    pg.click('#s-game [data-back="index"]')
    # conversação completa
    pg.click('.toc-row[data-id="sentence-1"]')
    for i in range(4):
        words=pg.evaluate("()=>sn.words")
        # errado primeiro (inverte) na 1ª fala
        if i==0 and len(words)>1:
            for w in reversed(words):
                idx=pg.evaluate("(w)=>sn.bank.find(b=>b.w===w&&!sn.slot.includes(b)).id",w)
                pg.click(f'#sn-bank [data-w="{idx}"]')
            pg.click('#sn-submit');res['sn_shake']=pg.evaluate("()=>document.querySelector('#sn-slot').classList.contains('shake')")
            pg.click('#sn-clear')
        for w in words:
            idx=pg.evaluate("(w)=>sn.bank.find(b=>b.w===w&&!sn.slot.includes(b)).id",w)
            pg.click(f'#sn-bank [data-w="{idx}"]')
        pg.click('#sn-submit')
        if i==0: res['sn_note']=pg.inner_text('#sstage .note')
        pg.click('#sn-next');pg.wait_for_timeout(60)
    pg.click('#sheet-close')
    res['done_sn']=pg.evaluate("()=>Object.keys(S.done)")
    pg.click('#s-game [data-back="index"]')
    # intruso
    pg.click('.toc-row[data-id="odd-2"]')
    for i in range(5):
        k=pg.evaluate("()=>od.rounds[od.i].tiles.findIndex(t=>!t.odd)")
        pg.click(f'#ostage [data-k="{k}"]');pg.click('#od-submit')
        if i==0: res['od_shake']=pg.evaluate("()=>!!document.querySelector('.otile.shake')")
        k=pg.evaluate("()=>od.rounds[od.i].tiles.findIndex(t=>t.odd)")
        pg.click(f'#ostage [data-k="{k}"]');pg.click('#od-submit');pg.click('#od-next');pg.wait_for_timeout(50)
    res['done_odd']=pg.evaluate("()=>Object.keys(S.done)")
    pg.click('#sheet-close');pg.click('#s-game [data-back="index"]')
    res['stored']=pg.evaluate("()=>Object.keys(localStorage)")
    pg.click('#open-settings');pg.screenshot(path='shot-settings.png')
    b.close()
print(json.dumps(res,indent=0)[:3000]);print('ERRS',errs)
