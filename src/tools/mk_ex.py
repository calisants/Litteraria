"""Gera ../exemplos.js: um exemplo por palavra, do Wikcionário (arquivos Kaikki fr/it), com tradução para o português feita por Claude.
ex_en.json = frases escolhidas (texto original + tradução em inglês do Wikcionário); ex_pt.json = só as frases revisadas à mão (sentido igual ao do app) com a tradução em português."""
import json
en=json.load(open('ex_en.json'));pt=json.load(open('ex_pt.json'))
out={}
for l in pt:
    out[l]={}
    for w,tr in pt[l].items():
        assert w in en[l],(l,w)
        out[l][w]=[en[l][w]['t'],tr]
open('../exemplos.js','w',encoding='utf8').write('/* gerado por tools/mk_ex.py: exemplos do Wikcionário (CC BY-SA 4.0), traduzidos por Claude */\nconst EX='+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';\n')
print({l:len(v) for l,v in out.items()})
