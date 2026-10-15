import json,sys,re
K=sys.argv[1]
voc=json.load(open(K+'/vocab_it.json',encoding='utf8'))
targets=set()
for v in voc: targets.add(v['w'].lower())
extra="libro studente zaino casa amico acqua amici studenti libri case gatto scuola psicologo università pane spaghetti ragazze albero amica ora specchio cane notte città caffè bar film medico gioco parco lago arancia camicia valigia burro camera salire squisito parenti cantina caldo morbido bravo vacanza stufo firma andare essere avere fare parlare finire prendere volere potere sapere dire venire vedere mangiare amare dormire leggere partire".split()
targets.update(extra)
out={}
with open(K+'/kaikki.org-dictionary-Italian.jsonl',encoding='utf8') as f:
    for line in f:
        if '"lang_code": "it"' not in line: continue
        try: e=json.loads(line)
        except: continue
        w=e.get('word','').lower()
        if w not in targets: continue
        sens=[]
        for s in e.get('senses',[])[:4]:
            sens.append({'g':s.get('glosses',[''])[0][:90],'t':s.get('tags',[])[:6]})
        out.setdefault(w,[]).append({'pos':e.get('pos'),'head':[h.get('expansion') for h in e.get('head_templates',[])][:2],
          'forms':[{'f':x.get('form'),'t':x.get('tags',[])[:5]} for x in e.get('forms',[])[:30]],'sens':sens})
json.dump(out,open(K+'/it_lookup.json','w',encoding='utf8'),ensure_ascii=False)
print(len(targets),len(out))
