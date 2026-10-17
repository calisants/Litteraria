"""Gera ../livros_data.js: temas de vocabulário tirados de livros de domínio público/estudo (só as palavras; nenhuma frase é copiada).
 Entradas: livro_pp.txt (fr, O Pequeno Príncipe; pp_words.txt) e livro_alice.txt (en, Alice no País das Maravilhas).
 Linha: palavra|tradução|classe(s,v,adj,adv,prep,conj,pron)[|artigo]. Sílabas: fr = syl_fr (regras), en = syl_en (Pyphen + CMU).
 Tradução: escrita por Claude, sem fonte conferida. Existência (fr: Wikcionário/Kaikki; en: dicionário CMU) e gênero (fr) conferidos."""
import json,re,sys
sys.path.insert(0,'.')
import syl_fr,syl_en,pyphen,cmudict
CL={'s':'substantivo','v':'verbo','adj':'adjetivo','adv':'advérbio','prep':'preposição','conj':'conjunção','pron':'pronome'}
CHUNK=40
py=pyphen.Pyphen(lang='en_US');cm=cmudict.dict()
def sy(lang,w):
    out=[]
    for t in re.split("([-'’ ])",w):
        if not t:continue
        if t in "-'’ ":out.append(t);continue
        p=(syl_fr.OVR.get(t) or syl_fr.syl(t,True)) if lang=='fr' else syl_en.pick(t,py,cm)
        assert ''.join(p)==t,(w,p)
        out.append('·'.join(p))
    return ''.join(out)
BOOKS=[("pp","fr","francês","O Pequeno Príncipe","pp_words.txt"),("alice","en","inglês","Alice no País das Maravilhas","livro_alice.txt")]
miss=[]
out=[]
for bid,lang,ln,name,fn in BOOKS:
    ws=[]
    for l in open(fn,encoding='utf8'):
        p=l.rstrip('\n').split('|')
        if len(p)<3:continue
        if lang=='en' and p[0] not in cm:miss.append(p[0])
        d={'w':p[0],'pt':p[1],'c':CL[p[2]],'sy':sy(lang,p[0])}
        if len(p)>3 and p[3]:d['a']=p[3]
        ws.append(d)
    n=len(ws);k=max(1,round(n/CHUNK))
    chunks=[]
    for i in range(k):
        part=ws[round(i*n/k):round((i+1)*n/k)]
        chunks.append({'cat':bid+str(i+1),'name':name+" · parte "+str(i+1),'words':part})
    out.append({'id':bid,'lang':lang,'ln':ln,'name':name,'chunks':chunks})
    print(bid,n,len(chunks),[len(c['words']) for c in chunks])
print('en sem CMU:',miss)
open('../livros_data.js','w',encoding='utf8').write('/* gerado por tools/mk_livros.py */\nconst BOOKS='+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';\n')
