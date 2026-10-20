"""Junta tools/ctxh/<livro>.json em src/ctxhist.js (CTXH). Confere: cada nota tem texto, fonte e URL https; texto até 60 palavras.
Uso: python3 -I tools/mk_ctxh.py"""
import os,json,glob
os.chdir(os.path.dirname(os.path.abspath(__file__)))
G={};bad=0
for f in sorted(glob.glob('ctxh/*.json')):
    b=os.path.basename(f)[:-5];d=json.load(open(f,encoding='utf8'))
    def ok(n):
        global bad
        good=isinstance(n,dict) and n.get('t') and n.get('s') and str(n.get('u','')).startswith('https://') and len(n['t'].split())<=60
        if not good:bad+=1;print('nota inválida em',b,n)
        return good
    G[b]={'intro':[n for n in d.get('intro',[]) if ok(n)],'ch':{k:[n for n in v if ok(n)] for k,v in d.get('ch',{}).items()}}
    print(b,len(G[b]['intro']),'intro;',sum(len(v) for v in G[b]['ch'].values()),'notas em',len(G[b]['ch']),'capítulos')
open('../ctxhist.js','w',encoding='utf8').write('/* gerado por tools/mk_ctxh.py. Notas escritas por Claude a partir das fontes indicadas em cada uma. */\nwindow.CTXH='+json.dumps(G,ensure_ascii=False,separators=(',',':'))+';\n')
print('inválidas:',bad)
