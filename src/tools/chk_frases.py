"""Confere que cada frase de livros_frases.js aparece palavra por palavra no texto do livro (arg: pasta com verne.txt, pinocchio.txt, carroll-alice.txt)."""
import re,sys,os
d=sys.argv[1];src={"verne":"verne.txt","pinocchio":"pinocchio.txt","alice":"carroll-alice.txt"}
js=open(os.path.join(os.path.dirname(__file__),"..","livros_frases.js"),encoding="utf8").read()
bad=0
for b,f in src.items():
    t=re.sub(r"\s+"," ",open(os.path.join(d,f),encoding="utf8").read())
    blk=re.search(b+r":\[(.*?)\]\n?[,\]}]",js,re.S) or re.search(b+r":\[(.*)",js,re.S)
    part=js[js.index(" "+b+":["):]
    for m in re.finditer(r'\{s:"([^"]+)"',part.split("],\n")[0] if b!="alice" else part.split("]\n};")[0]):
        ok=m.group(1) in t
        if not ok:bad+=1;print("NÃO ACHEI",b,m.group(1))
print("ok" if not bad else "erros",bad,"| frases:",js.count("{s:"))
