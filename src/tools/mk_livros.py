"""Gera ../livros_data.js: temas de vocabulário tirados de livros de domínio público/estudo (só as palavras; nenhuma frase é copiada).
 Entradas: pp_words.txt (fr, O Pequeno Príncipe; pp_words.txt) livro_verne.txt (fr, A Volta ao Mundo em 80 Dias), livro_pinocchio.txt (it, As Aventuras de Pinóquio; it_hy.json = hifenização do Wikcionário) e livro_alice.txt (en, Alice no País das Maravilhas).
 Linha: palavra|tradução|classe(s,v,adj,adv,prep,conj,pron)[|artigo]. Sílabas: fr = syl_fr (regras), en = syl_en (Pyphen + CMU).
 Tradução: escrita por Claude, sem fonte conferida. Existência (fr: Wikcionário/Kaikki; en: dicionário CMU) e gênero (fr) conferidos."""
import json,re,sys
sys.path.insert(0,'.')
import syl_fr,syl_en,pyphen,cmudict,os
CL={'s':'substantivo','v':'verbo','adj':'adjetivo','adv':'advérbio','prep':'preposição','conj':'conjunção','pron':'pronome'}
CHUNK=40
py=pyphen.Pyphen(lang='en_US');cm=cmudict.dict();pyit=pyphen.Pyphen(lang='it_IT')
IT_HY=json.load(open('it_hy.json',encoding='utf8'))   # hifenização do Wikcionário (Kaikki) das palavras dos livros
def it_art(w,g):
    if re.match('[aeiouàèéìòù]',w):return "l'"
    if g=='f':return 'la'
    return 'lo' if re.match(r'(s[^aeiouàèéìòù]|z|gn|ps|pn|x|y)',w) else 'il'
def it_syl(w):
    p=IT_HY.get(w)
    if p:
        parts=[q for x in p for q in x.split('‧')];out=[];i=0
        for q in parts:out.append(w[i:i+len(q)]);i+=len(q)
        if ''.join(out)==w:return out
    return pyit.inserted(w).split('-')
def sy(lang,w):
    out=[]
    for t in re.split("([-'’ ])",w):
        if not t:continue
        if t in "-'’ ":out.append(t);continue
        p=(syl_fr.OVR.get(t) or syl_fr.syl(t,True)) if lang=='fr' else (syl_en.pick(t,py,cm) if lang=='en' else it_syl(t))
        assert ''.join(p)==t,(w,p)
        out.append('·'.join(p))
    return ''.join(out)
BOOKS=[("pp","fr","francês","O Pequeno Príncipe","pp_words.txt"),("verne","fr","francês","A Volta ao Mundo em 80 Dias","livro_verne.txt"),("pinocchio","it","italiano","As Aventuras de Pinóquio","livro_pinocchio.txt"),("alice","en","inglês","Alice no País das Maravilhas","livro_alice.txt"),("peter","en","inglês","Peter Rabbit","livro_peter.txt")]
miss=[]
out=[]
for bid,lang,ln,name,fn in BOOKS:
    ws=[]
    for l in open(fn,encoding='utf8'):
        p=l.rstrip('\n').split('|')
        if len(p)<3:continue
        if lang=='en' and p[0] not in cm:miss.append(p[0])
        d={'w':p[0],'pt':p[1],'c':CL[p[2]],'sy':sy(lang,p[0])}
        if len(p)>3 and p[3]:d['a']=it_art(p[0],p[3]) if lang=='it' else p[3]
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
