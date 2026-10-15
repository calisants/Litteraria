"""Para cada alternativa errada de um item de conjugação (FR/IT), diz qual forma ela é, segundo o verbecc."""
import re,sys
sys.path.insert(0,'/tmp/claude-0/-home-claude-motsparole/b7be1e6f-b9fc-5ca5-b42c-c17ff73eaa83/scratchpad')
sys.path.insert(0,'/tmp/claude-0/-home-claude/b7be1e6f-b9fc-5ca5-b42c-c17ff73eaa83/scratchpad')
import conj
from gram_gen import clean
FR_RE=re.compile(r"^(que |qu')?(je |j'|tu |il |elle |on |nous |vous |ils |elles )(.*)$")
IT_RE=re.compile(r"^(che )?(io |tu |lui |lei |noi |voi |loro )(.*)$")
TL={('indicatif','présent'):'presente do indicativo',('indicatif','imparfait'):'imparfait (passado descritivo)',('indicatif','futur-simple'):'futuro simples',
 ('indicatif','passé-composé'):'passé composé',('indicatif','passé-simple'):'passé simple',('conditionnel','présent'):'condicional presente',
 ('subjonctif','présent'):'subjuntivo presente',('subjonctif','imparfait'):'subjuntivo imperfeito',('impératif','impératif-présent'):'imperativo',
 ('indicativo','presente'):'presente do indicativo',('indicativo','imperfetto'):'imperfetto (passado descritivo)',('indicativo','futuro'):'futuro semplice',
 ('indicativo','passato-prossimo'):'passato prossimo',('indicativo','passato-remoto'):'passato remoto',('condizionale','presente'):'condizionale presente',
 ('congiuntivo','presente'):'congiuntivo presente',('congiuntivo','imperfetto'):'congiuntivo imperfetto',('imperativo','imperativo-presente'):'imperativo'}
VRE=re.compile(r"\(([^,()]+?)(?:,|\))")
def forms(lang,verb):
    d=conj.get(lang,verb);RE=FR_RE if lang=='fr' else IT_RE;out={}
    for key,rows in d.items():
        if key not in TL:continue
        for rr in rows:
            if rr.get('g')=='f':continue
            full=clean(rr['c'][0]);m=RE.match(full)
            if not m:continue
            out.setdefault(m.group(3),{}).setdefault(key,[]).append(m.group(2).strip())
    return out
def hint_items(items):
    n=0
    for lang in ('fr','it'):
        for t,pages in items[lang].items():
            for pg in pages:
                for it in pg:
                    m=VRE.search(it['q'])
                    if not m:continue
                    verb=m.group(1).strip()
                    try:F=forms(lang,verb)
                    except Exception:continue
                    d={}
                    for k,o in enumerate(it['o']):
                        if k==it['a']:continue
                        r=F.get(o)
                        if not r:continue
                        key=sorted(r,key=lambda x:list(TL).index(x))[0]
                        ps=list(dict.fromkeys(r[key]))
                        d[o]="«%s» é a forma de %s no %s de «%s», não a que o exercício pede."%(o,' / '.join('«%s»'%p for p in ps),TL[key],verb)
                    if d:it['d']=d;n+=1
    return n
