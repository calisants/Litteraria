"""Gera ../sil.js: divisão silábica por palavra do vocabulário (fr, it, en).
fr: regras próprias (syl_fr.py), conferidas: 37 de 41 hifenizações do Wikcionário e 474 de 481 contagens de sílabas pelo IPA dele.
it: hifenização do Wikcionário (arquivo Kaikki que a Camila enviou); 7 palavras sem dado, feitas à mão.
en: padrões de hifenização do LibreOffice (Pyphen), com a contagem de sílabas conferida no CMU Pronouncing Dictionary."""
import json,re,subprocess,sys
sys.path.insert(0,'.')
import syl_fr,syl_en,pyphen,cmudict
S=sys.argv[1]  # pasta com hy.json
V=json.loads(subprocess.run(['node','-e','const fs=require("fs");global.window={};eval(fs.readFileSync("../data.js","utf8")+";console.log(JSON.stringify(VOCAB))")'],capture_output=True,text=True).stdout)
hy=json.load(open(S+'/hy.json'))['it']
IT_MAN={"beige":["beige"],"bordeaux":["bor","deaux"],"complimenti":["com","pli","men","ti"],"menu":["me","nu"],"pantaloncini":["pan","ta","lon","ci","ni"],"qui":["qui"],"weekend":["week","end"]}
def it_tok(w):
    if w in IT_MAN:return IT_MAN[w]
    s=[p for x in hy[w] for p in x.split('‧')];out=[];i=0
    for p in s:
        out.append(w[i:i+len(p)]);i+=len(p)
    assert ''.join(out)==w,(w,hy[w])
    return out
cm=cmudict.dict();py=pyphen.Pyphen(lang='en_US')
def do(l,w):
    toks=re.split("([-'’ ])",w.lower());res=[]
    for t in toks:
        if not t or t in "-'’ ":res.append(t);continue
        if l=='fr':p=syl_fr.OVR.get(t) or syl_fr.syl(t,True)
        elif l=='it':p=it_tok(t)
        else:p=syl_en.pick(t,py,cm)
        assert ''.join(p)==t,(l,t,p)
        res.append('·'.join(p))
    return ''.join(res)
out={}
for l in V:
    out[l]={}
    for arr in V[l].values():
        for e in arr:out[l][e['w']]=do(l,e['w'])
open('../sil.js','w',encoding='utf8').write('/* gerado por tools/mk_syl.py */\nconst SIL='+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';\n')
print({l:len(v) for l,v in out.items()})
print([out['fr'][k] for k in ('bonjour','bonne nuit','aéroport','assiette','grand-père',"d'accord")],[out['it'][k] for k in list(out['it'])[:4]],[out['en'][k] for k in ('computer','good morning','about')])
