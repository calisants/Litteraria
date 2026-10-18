#!/usr/bin/env python3
"""Candidatas de vocabulário a partir de um livro (só palavras; nenhuma frase é copiada).
Uso: python3 -I book_cands.py <en|fr|it> <texto.txt> <saida.txt> <N> [kaikki.jsonl]
Lematiza (simplemma), tira nomes próprios, palavras que já existem no app e função/stopwords, e (fr/it) exige entrada no Kaikki,
descartando palavras só arcaicas/poéticas. Saída: lema|contagem|classe|gênero|definição em inglês (para eu traduzir com a definição na mão)."""
import sys,re,json,collections,subprocess,simplemma,os
lang,txt,out,N=sys.argv[1],sys.argv[2],sys.argv[3],int(sys.argv[4]);kk=sys.argv[5] if len(sys.argv)>5 else None
t=open(txt,encoding='utf8').read()
a=t.find('*** START');b=t.find('*** END')
if a>=0:
    a=t.find('***',a+10)+3
    t=t[a:(b if b>0 else len(t))]
t=re.sub(r'Op\. Grande biblioteca.*|ACTA G\. D.Anna.*|Dante Alighieri\s+Divina Commedia.*|Édition du groupe.*|[–-]\d+[–-]','',t)
t=t.replace('’',"'")
tok=re.findall(r"[A-Za-zÀ-ÿœŒ]+(?:'[A-Za-zÀ-ÿœŒ]+)*",t)
low=collections.Counter();cap=collections.Counter();lem=collections.Counter()
for i,w in enumerate(tok):
    for p in w.split("'"):
        if len(p)<3:continue
        l=p.lower();low[l]+=1
        if p[0].isupper() and p.lower()!=p:cap[l]+=1
        lem[simplemma.lemmatize(l,lang=lang)]+=1
have=set(json.load(open('/tmp/bk/have_%s.json'%lang))['have']) if os.path.exists('/tmp/bk/have_%s.json'%lang) else set()
KK={}
if kk:
    for line in open(kk,encoding='utf8'):
        try:e=json.loads(line)
        except:continue
        if e.get('lang_code')!=lang:continue
        KK.setdefault(e['word'].lower(),[]).append(e)
POS={'noun':'s','verb':'v','adj':'adj','adv':'adv','prep':'prep','conj':'conj','pron':'pron','det':'pron','num':'adj','intj':None}
BAD={'archaic','obsolete','poetic','dated','dialectal','regional','rare','Tuscan','historical'}
def info(w):
    es=KK.get(w,[])
    best=None
    for e in es:
        p=POS.get(e.get('pos'),'x')
        if p in (None,'x'):continue
        tags=[set(s.get('tags',[])|set()) if isinstance(s.get('tags'),set) else set(s.get('tags',[])) for s in e.get('senses',[])]
        if tags and all(tg&BAD for tg in tags):continue
        form=' '.join(h.get('expansion','') for h in e.get('head_templates',[]))
        g=''
        if p=='s':
            m=re.search(r'\b(m|f)\b',form.split('(')[0])
            g=m.group(1) if m else ''
            if not g:
                for s in e.get('senses',[]):
                    for tg in s.get('tags',[]):
                        if tg in('masculine','feminine'):g=tg[0]
        gl=(e.get('senses') or [{}])[0].get('glosses',[''])[0][:60]
        cand=(p,g,gl)
        if best is None or (p=='s' and best[0]!='s'):best=cand
    return best
STOP=set(open('/tmp/bk/stop_%s.txt'%lang).read().split()) if os.path.exists('/tmp/bk/stop_%s.txt'%lang) else set()
rows=[]
for l,n in lem.most_common():
    if len(l)<3 or l in have or l in STOP:continue
    if low.get(l,0) and cap.get(l,0)/max(1,low[l])>.3:continue   # nome próprio
    if kk:
        i=info(l)
        if not i:continue
        rows.append((l,n,)+i)
    else:rows.append((l,n,'','',''))
    if len(rows)>=N:break
open(out,'w',encoding='utf8').write('\n'.join('|'.join(map(str,r)) for r in rows)+'\n')
print(len(tok),'tokens;',len(rows),'candidatas')
