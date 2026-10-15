"""Sinônimos e antônimos: pares verificados no Kaikki (FR/IT) e no WordNet (EN)."""
import json,sys
sys.path.insert(0,'.')
import wn_lite
WNS,WNA=wn_lite.load()
KFR=json.load(open('syn_fr.json'));KIT=json.load(open('syn_it.json'))
def rel(lang,a,b,kind):
    "o par (a,b) está na lista de sinônimos/antônimos de a ou de b na fonte?"
    if lang=='en':
        T=WNA if kind=='ant' else WNS
        return b in T[a] or a in T[b]
    K=KFR if lang=='fr' else KIT
    return b in K.get(a,{}).get(kind,[]) or a in K.get(b,{}).get(kind,[])
def related(lang,a,b):return rel(lang,a,b,'ant') or rel(lang,a,b,'syn')
ANT={
 'fr':[('facile','difficile'),('froid','chaud'),('riche','pauvre'),('ouvrir','fermer'),('fort','faible'),('souvent','rarement')],
 'it':[('forte','debole'),('caldo','freddo'),('ricco','povero'),('aprire','chiudere'),('giovane','vecchio'),('pulito','sporco')],
 'en':[('hot','cold'),('big','small'),('easy','difficult'),('rich','poor'),('open','close'),('strong','weak')]}
SYN={
 'fr':[('laid','moche'),('souvent','fréquemment'),('difficile','ardu'),('parfois','quelquefois'),('aussi','également'),('joli','mignon')],
 'it':[('veloce','rapido'),('malato','ammalato'),('adesso','ora'),('qui','qua'),('ballare','danzare'),('comprare','acquistare')],
 'en':[('big','large'),('fast','quick'),('begin','start'),('happy','glad'),('buy','purchase'),('sick','ill')]}
# distractors: palavras básicas, da mesma classe, sem relação com o alvo nem com a resposta (checado abaixo)
ADJ={'fr':['vert','rouge','jaune','bleu'],'it':['verde','rosso','giallo','blu'],'en':['green','red','yellow','blue']}
ADV={'fr':['ici','hier','demain',"aujourd'hui"],'it':['qui','ieri','domani','oggi'],'en':['here','yesterday','tomorrow','today']}
VRB={'fr':['manger','dormir','écrire'],'it':['mangiare','dormire','scrivere'],'en':['eat','sleep','write']}
KIND={'fr':{'facile':ADJ,'froid':ADJ,'riche':ADJ,'ouvrir':VRB,'fort':ADJ,'souvent':ADV,'laid':ADJ,'difficile':ADJ,'parfois':ADV,'aussi':ADV,'joli':ADJ},
      'it':{'forte':ADJ,'caldo':ADJ,'ricco':ADJ,'aprire':VRB,'giovane':ADJ,'pulito':ADJ,'veloce':ADJ,'malato':ADJ,'adesso':ADV,'qui':ADV,'ballare':VRB,'comprare':VRB},
      'en':{'hot':ADJ,'big':ADJ,'easy':ADJ,'rich':ADJ,'open':VRB,'strong':ADJ,'fast':ADJ,'begin':VRB,'happy':ADJ,'buy':VRB,'sick':ADJ}}
TRAP={('syn','fr'):{'laid':'beau','souvent':'rarement','difficile':'facile'},('syn','it'):{'veloce':'lento','comprare':'vendere'},('syn','en'):{'big':'small','fast':'slow','begin':'end','happy':'unhappy','buy':'sell'},
      ('ant','fr'):{'fort':'robuste','souvent':'fréquemment'},('ant','it'):{'ricco':'facoltoso'},('ant','en'):{'big':'large','strong':'solid'}}
ANSOUT={}
def mk(lang,pairs,kind,i0):
    items=[]
    for i,(t,ans) in enumerate(pairs):
        assert rel(lang,t,ans,kind),(lang,t,ans,kind)
        ds=[d for d in KIND[lang][t][lang] if not related(lang,t,d) and not related(lang,ans,d) and d not in (t,ans)][:3]
        trap=TRAP[(kind,lang)].get(t)
        if trap:
            # armadilha verificada: antônimo (em pergunta de sinônimo) ou sinônimo (em pergunta de antônimo) do alvo
            assert rel(lang,t,trap,'ant' if kind=='syn' else 'syn'),(lang,t,trap)
            assert not rel(lang,ans,trap,'syn'),(lang,ans,trap)
            ds=[trap]+ds[:2]
        for d in ds:
            if d==trap:continue
            assert not related(lang,t,d) and not related(lang,ans,d),(lang,t,ans,d)
        k=(i0+i)%4;opts=ds[:];opts.insert(k,ans)
        if lang=='fr':q={'ant':'Contrário de «%s»:','syn':'Sinônimo de «%s»:'}[kind]%t
        else:q={'ant':'Contrário de «%s»:','syn':'Sinônimo de «%s»:'}[kind]%t
        src={'fr':'Wiktionnaire (via Kaikki)','it':'Wiktionary (via Kaikki)','en':'Princeton WordNet'}[lang]
        w=('«%s» é o contrário de «%s» (lista de antônimos: %s).' if kind=='ant' else '«%s» é sinônimo de «%s» (lista de sinônimos: %s).')%(ans,t,src)
        if trap:w+=' Cuidado: «%s» é o contrário de «%s», não sinônimo.'%(trap,t) if kind=='syn' else ' Cuidado: «%s» é sinônimo de «%s», não o contrário.'%(trap,t)
        items.append({'q':q,'o':opts,'a':k,'w':w,'s':ans,'k':t})
    return items
out={}
for L in ('fr','it','en'):
    out[L]={'sinonimos':[mk(L,ANT[L],'ant',0),mk(L,SYN[L],'syn',2)]}
json.dump(out,open('gram_items3.json','w',encoding='utf8'),ensure_ascii=False)
print('ok',{l:sum(len(p) for p in out[l]['sinonimos']) for l in out})
