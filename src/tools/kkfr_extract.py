import json,sys
S=sys.argv[1]
voc=json.load(open(S+'/kk/vocab_fr.json',encoding='utf8'))
T={v['w'].lower() for v in voc}
out={}
with open(S+'/kkfr/kaikki.org-dictionary-French-words.jsonl',encoding='utf8') as f:
    for line in f:
        try: e=json.loads(line)
        except: continue
        w=e.get('word','').lower()
        if w not in T: continue
        if e.get('lang_code')!='fr': continue
        tags=set()
        for h in e.get('head_templates',[]): tags.add(h.get('expansion',''))
        gl=[]
        for s in e.get('senses',[])[:5]:
            gl.append(s.get('glosses',[''])[0][:80])
        syn=[x.get('word') for x in e.get('synonyms',[])][:5]
        ant=[x.get('word') for x in e.get('antonyms',[])][:5]
        for s in e.get('senses',[]):
            syn+= [x.get('word') for x in s.get('synonyms',[])][:3]
            ant+= [x.get('word') for x in s.get('antonyms',[])][:3]
        out.setdefault(w,[]).append({'pos':e.get('pos'),'head':sorted(tags)[:2],'gl':gl,'syn':syn[:6],'ant':ant[:6],
          'forms':[(x.get('form'),x.get('tags',[])[:3]) for x in e.get('forms',[])[:6]]})
json.dump(out,open(S+'/kk/fr_lookup.json','w',encoding='utf8'),ensure_ascii=False)
miss=[w for w in T if w not in out]
print(len(T),len(out),'missing',len(miss),miss[:60])
print('with syn',sum(1 for w in out if any(x['syn'] for x in out[w])),'with ant',sum(1 for w in out if any(x['ant'] for x in out[w])))
