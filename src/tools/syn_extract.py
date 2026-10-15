import json,sys
lang,dump,vocab,out=sys.argv[1:5]
V={}
for e in json.load(open(vocab,encoding='utf8')):
    V.setdefault(e['w'].lower(),e)
res={}
with open(dump,encoding='utf8') as f:
    for line in f:
        try:e=json.loads(line)
        except Exception:continue
        w=e.get('word','')
        if w.lower() not in V or ' ' in w:continue
        syn=set();ant=set()
        for s in e.get('senses',[]):
            for x in s.get('synonyms',[]):syn.add(x.get('word'))
            for x in s.get('antonyms',[]):ant.add(x.get('word'))
        for x in e.get('synonyms',[]):syn.add(x.get('word'))
        for x in e.get('antonyms',[]):ant.add(x.get('word'))
        if syn or ant:
            r=res.setdefault(w.lower(),{'pos':set(),'syn':set(),'ant':set(),'pt':V[w.lower()].get('pt')})
            r['pos'].add(e.get('pos'));r['syn']|={x for x in syn if x};r['ant']|={x for x in ant if x}
json.dump({k:{'pos':sorted(map(str,v['pos'])),'syn':sorted(v['syn']),'ant':sorted(v['ant']),'pt':v['pt']} for k,v in res.items()},open(out,'w',encoding='utf8'),ensure_ascii=False,indent=0)
print(lang,len(res),'palavras com syn/ant')
