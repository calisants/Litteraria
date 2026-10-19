"""Confere que cada frase de livros_frases.js e cada trecho de livros_leitura.js aparece palavra por palavra no texto do livro.
Uso: python3 -I tools/chk_frases.py <pasta com os textos: verne.txt, pinocchio.txt, carroll-alice.txt, peter.txt, wind.txt, sherlock.txt, frank.txt, musq.txt, principe.txt, dante.txt>
Normaliza só aspas/apóstrofos curvos, espaços e o espaço antes de ! ? ; : (tipografia francesa); a 1ª letra pode ser maiúscula/minúscula (início de frase). Livro sem arquivo na pasta é avisado e pulado."""
import re,sys,os
d=sys.argv[1]
src={"verne":"verne.txt","pinocchio":"pinocchio.txt","alice":"carroll-alice.txt","peter":"peter.txt","wind":"wind.txt","sherlock":"sherlock.txt","frank":"frank.txt","musq":"musq.txt","principe":"principe.txt","dante":"dante.txt"}
js=open(os.path.join(os.path.dirname(__file__),"..","livros_frases.js"),encoding="utf8").read()
def norm(x):
    x=x.replace("\u2019","'").replace("\u2018","'").replace("\u201c",'"').replace("\u201d",'"').replace("\u00a0"," ")
    x=re.sub(r"\s+"," ",x).replace("T o Sherlock","To Sherlock");return re.sub(r" ([!?;:])",r"\1",x)
bad=0;tot=0
for b,f in src.items():
    fp=os.path.join(d,f)
    if not os.path.exists(fp):print("sem texto:",b);continue
    t=norm(open(fp,encoding="utf8",errors="ignore").read())
    i=js.index(" "+b+":[");j=js.find("]",js.index("note:",i));
    # bloco do livro: do início até o próximo " xxx:[" ou "};"
    m=re.search(r"\n [a-z]+:\[|\n\};",js[i+5:]);part=js[i:i+5+(m.start() if m else len(js))]
    for mm in re.finditer(r'\{s:"((?:[^"\\]|\\.)*)"',part):
        s=mm.group(1);tot+=1
        ok=s in t or s[0].swapcase()+s[1:] in t
        if not ok:bad+=1;print("NÃO ACHEI",b,"|",s)
lj=open(os.path.join(os.path.dirname(__file__),"..","livros_leitura.js"),encoding="utf8").read()
for b,f in src.items():
    fp=os.path.join(d,f)
    if not os.path.exists(fp) or (" "+b+":[") not in lj:continue
    t=norm(open(fp,encoding="utf8",errors="ignore").read())
    i=lj.index(" "+b+":[");m=re.search(r"\n [a-z]+:\[|\n\};",lj[i+5:]);part=lj[i:i+5+(m.start() if m else len(lj))]
    for mm in re.finditer(r'\{s:"((?:[^"\\]|\\.)*)",pt:',part):
        s0=mm.group(1).replace('\\"','"');tot+=1
        if not(s0 in t or s0[0].swapcase()+s0[1:] in t):bad+=1;print("NÃO ACHEI (leitura)",b,"|",s0)
print("ok" if not bad else "erros",bad,"| frases conferidas:",tot)
