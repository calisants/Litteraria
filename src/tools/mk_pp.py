"""Gera ../petitprince.js: palavras de «O Pequeno Príncipe» para o dicionário (só fr).
Entrada: pp_words.txt (palavra|tradução|classe[|artigo]). Palavras escolhidas por frequência no livro (nenhuma frase é copiada);
existência e gênero conferidos no Wikcionário (Kaikki). Tradução escrita por Claude."""
import json,sys
sys.path.insert(0,'.')
import syl_fr
CL={'s':'substantivo','v':'verbo','adj':'adjetivo','adv':'advérbio'}
out=[]
for l in open('pp_words.txt',encoding='utf8'):
    p=l.rstrip('\n').split('|')
    if len(p)<3:continue
    w=p[0];sy=''.join('·'.join(syl_fr.OVR.get(t) or syl_fr.syl(t,True)) if t not in "-'’ " else t for t in __import__('re').split("([-'’ ])",w) if t)
    assert sy.replace('·','')==w,(w,sy)
    d={'w':w,'pt':p[1],'c':CL[p[2]],'sy':sy}
    if len(p)>3 and p[3]:d['a']=p[3]
    out.append(d)
out.sort(key=lambda d:d['w'])
open('../petitprince.js','w',encoding='utf8').write('/* gerado por tools/mk_pp.py */\nconst PPW='+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';\n')
print(len(out))
