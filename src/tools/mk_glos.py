"""Junta tools/glos_<lang>.txt («palavra|tradução») em src/glossario.js (GLOS). Entradas com «?» ficam de fora.
Uso: python3 -I tools/mk_glos.py"""
import os,json
os.chdir(os.path.dirname(os.path.abspath(__file__)))
G={}
for l in ('fr','it','en'):
    d={}
    f='glos_%s.txt'%l
    if os.path.exists(f):
        for ln in open(f,encoding='utf8'):
            ln=ln.rstrip('\n')
            if '|' not in ln:continue
            w,t=ln.split('|',1);w=w.strip().lower();t=t.strip()
            if w and t and t!='?':d[w]=t
    G[l]=d
open('../glossario.js','w',encoding='utf8').write('/* gerado por tools/mk_glos.py. Traduções: escritas por Claude, sem fonte conferida. */\nwindow.GLOS='+json.dumps(G,ensure_ascii=False,separators=(',',':'))+';\n')
print({l:len(v) for l,v in G.items()})
