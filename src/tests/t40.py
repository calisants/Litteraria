"""Testa (v1.70.1): memória sem desenhos repetidos na página, artigo de palavras de livros em francês, escolha da voz.
Uso (na pasta src/):  python3 -I tests/t40.py"""
import subprocess,time,os
from playwright.sync_api import sync_playwright
root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
srv=subprocess.Popen(['python3','-m','http.server','8787','-d',root],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_context(viewport={'width':390,'height':844}).new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8787/index.html');pg.wait_for_timeout(1200)
    r=pg.evaluate("""()=>{const o={};for(const l of ['fr','it','en']){
      const pgs=VOLUME.pages.filter(p=>p.type==='memoria'&&p.langs[0]===l);
      o[l+'dup']=pgs.filter(p=>{const s=p.words.map(w=>DRAW[l][w]);return new Set(s).size!==s.length}).length;
      o[l+'min']=Math.min(...pgs.map(p=>p.words.length));
      o[l+'art']=Object.values(VOCAB[l]).flat().filter(e=>e.a==='m'||e.a==='f').length;}
      S.lang='fr';const e=Object.values(VOCAB.fr).flat().find(x=>x.w==='traversée');o.trav=full(e);
      const f=(w)=>full(Object.values(VOCAB.fr).flat().find(x=>x.w===w));o.h=[f('houppe'),f('humeur'),f('pari')];
      const fake=[{name:'A',lang:'fr-CA',localService:true},{name:'Google français',lang:'fr-FR',localService:false},{name:'B',lang:'en-US',localService:true}];
      const old=speechSynthesis.getVoices;speechSynthesis.getVoices=()=>fake;o.v=pickVoice('fr-FR').name;o.none=pickVoice('it-IT');speechSynthesis.getVoices=old;
      o.box=!!document.getElementById('voice-box');return o}""")
    for l in ['fr','it','en']:
      assert r[l+'dup']==0,r;assert r[l+'min']>=4,r
    assert r['frart']==0 and r['itart']==0 and r['enart']==0,r
    assert r['trav']=='la traversée' and r['h']==['la houppe',"l'humeur",'le pari'],r
    assert r['v']=='Google français' and r['none'] is None,r
    assert r['box']
    # compartilhar o app
    pg.evaluate("()=>{go('settings');document.querySelectorAll('details').forEach(d=>d.open=true)}")
    pg.click('#open-share');pg.wait_for_timeout(200)
    assert 'Litteraria' in pg.inner_text('#sheet-in') and 'localhost:8787' in pg.inner_text('#shr-txt') and pg.get_attribute('#shr-wa','href').startswith('https://wa.me/?text=')
    assert not errs,errs
    print('t40 ok');b.close()
finally:
  srv.terminate()
