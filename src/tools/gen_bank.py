"""Banco do Treino de verbos: formas geradas por verbecc (FR/IT) e lemminflect (EN)."""
import json,sys
sys.path.insert(0,'/tmp/claude-0/-home-claude/b7be1e6f-b9fc-5ca5-b42c-c17ff73eaa83/scratchpad')
sys.path.insert(0,'.')
import gram_gen2 as G
from gram_gen import clean
from lemminflect import getInflection as infl
FRV="parler finir manger aller être avoir faire prendre venir vouloir pouvoir devoir voir savoir dire mettre partir sortir dormir lire écrire ouvrir connaître boire".split()
ITV="parlare finire mangiare andare essere avere fare prendere venire volere potere dovere vedere sapere dire mettere partire uscire dormire leggere scrivere aprire bere capire".split()
FRT=[('presente','présent',('indicatif','présent')),('imperfeito','imparfait',('indicatif','imparfait')),('passado composto','passé composé',('indicatif','passé-composé')),
     ('futuro','futur simple',('indicatif','futur-simple')),('condicional','conditionnel présent',('conditionnel','présent')),('subjuntivo','subjonctif présent',('subjonctif','présent'))]
ITT=[('presente','presente',('indicativo','presente')),('imperfeito','imperfetto',('indicativo','imperfetto')),('passado composto','passato prossimo',('indicativo','passato-prossimo')),
     ('futuro','futuro semplice',('indicativo','futuro')),('condicional','condizionale presente',('condizionale','presente')),('subjuntivo','congiuntivo presente',('congiuntivo','presente'))]
def build(lang,verbs,tenses):
    out={}
    for tid,label,key in tenses:
        rows=[]
        for v in verbs:
            try:
                b=G.prow(lang,v,key,G.FRP if lang=='fr' else G.ITP)
            except Exception as e:
                print('pulei',lang,v,tid,str(e)[:60]);continue
            ps=G.FRP if lang=='fr' else G.ITP
            rows.append([v,[b[p][0] for p in ps],[b[p][1] for p in ps]])
        out[tid]=rows
    return out
bank={'fr':build('fr',FRV,FRT),'it':build('it',ITV,ITT)}
# inglês: lemminflect
ENV="be have do go make take come see know say get give find think tell become leave feel put bring begin keep write read speak eat drink sleep run walk play work live study".split()
PR=["I ","you ","he ","we ","you ","they "]
def en_row(v,t):
    out=[]
    for i,p in enumerate(PR):
        if t=='presente':
            f={'be':["am","are","is","are","are","are"],'have':["have","have","has","have","have","have"]}.get(v)
            x=f[i] if f else (infl(v,'VBZ')[0] if p=="he " else v)
        elif t=='passado simples':
            x={'be':["was","were","was","were","were","were"]}.get(v,[infl(v,'VBD')[0]]*6)[i]
        else: # present perfect
            pp=infl(v,'VBN')[0];x=("has " if p=="he " else "have ")+pp
        out.append(x)
    return out
bank['en']={t:[[v,PR,en_row(v,t)] for v in ENV] for t in ('presente','passado simples','present perfect')}
labels={'fr':{t[0]:t[1] for t in FRT},'it':{t[0]:t[1] for t in ITT},'en':{t:t for t in bank['en']}}
json.dump({'bank':bank,'labels':labels},open('bank.json','w',encoding='utf8'),ensure_ascii=False,separators=(',',':'))
print({l:{t:len(r) for t,r in bank[l].items()} for l in bank})
import os;print(os.path.getsize('bank.json'))
print(bank['fr']['passado composto'][3],bank['it']['subjuntivo'][2],bank['en']['presente'][0])
