"""Lista as palavras mais frequentes dos textos completos (books/*.js) que ainda não têm tradução no app
(nem no vocabulário, nem em tools/glos_<lang>.txt). Uso: python3 -I tools/mk_glos_cands.py <fr|it|en> [N]"""
import json,re,sys,os,collections
os.chdir(os.path.dirname(os.path.abspath(__file__)))
lang=sys.argv[1];N=int(sys.argv[2]) if len(sys.argv)>2 else 300
BOOKS={'en':['alice','peter','frank','grimm'],'fr':['perrault'],'it':['principe','racconti']}[lang]
tok=re.compile(r"[^\W\d_][\w'’]*",re.U)
cnt=collections.Counter();low=collections.Counter()
for b in BOOKS:
    t=open('../../books/%s.js'%b,encoding='utf8').read()
    data=json.loads(t[t.index('=[')+1:t.rindex(']')+1].rstrip(';'))
    for ch in data:
        for p in ch['p']:
            txt=p[0]
            for m in tok.finditer(txt):
                w=m.group(0).replace('’',"'");k=w.lower()
                cnt[k]+=1
                if w==k:low[k]+=1
have=set()
vt=open('../data.js',encoding='utf8').read()+''.join(open('../'+f,encoding='utf8').read() for f in os.listdir('..') if re.match(r'(content\d*|livros_data)\.js$',f))
for m in re.finditer(r'\bw:"([^"]+)"',vt):have.add(m.group(1).lower())
gl=set()
if os.path.exists('glos_%s.txt'%lang):
    for l in open('glos_%s.txt'%lang,encoding='utf8'):
        if '|' in l:gl.add(l.split('|')[0].strip().lower())
out=[]
for w,c in cnt.most_common():
    if w in have or w in gl or len(w)<2 or low[w]/c<0.7 or c<3:continue
    out.append((w,c))
    if len(out)>=N:break
for w,c in out:print(w,c,sep='|')
