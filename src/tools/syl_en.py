"""Divisão silábica do inglês (escrita). Base: padrões de hifenização do LibreOffice (Pyphen); quando a contagem não bate com a do CMU Pronouncing Dictionary, usa regras próprias; sobras corrigidas à mão (OVR)."""
import re
V="aeiouy"
ONS=("bl","br","cl","cr","dr","fl","fr","gl","gr","pl","pr","tr","sc","sk","sl","sm","sn","sp","st","sw","tw","str","spr","spl","scr","thr","shr","chr")
DG=("ch","sh","th","ph","wh","gh","ck","ng","qu")
OVR={"cheerio":["chee","ri","o"],"evening":["eve","ning"],"hour":["hour"],"laboratory":["lab","o","ra","to","ry"],"maybe":["may","be"],"temperature":["tem","per","a","ture"],"tired":["tired"]}
def nuc(w):
    out=[]
    for m in re.finditer("[aeiouy]+",w):
        s,e=m.span()
        if m.group()=="y" and s==0 and len(w)>1 and w[1] in V:continue
        if s>0 and w[s]=="y" and False:pass
        out.append([s,e])
    # w/y inicial semivogal; qu: u faz parte do onset
    for n in out:
        if n[0]>0 and w[n[0]-1]=="q" and w[n[0]]=="u" and n[1]-n[0]>1:n[0]+=1
    out=[n for n in out if n[1]>n[0]]
    if len(out)>1:
        a,b=out[-1]
        if w[a:b]=="e" and b==len(w) and w[a-1] not in V: out=out[:-1]
        elif w[a:b]=="e" and w[b:] in ("s","d") and w[a-1] not in "td" and w[a-1] not in V: out=out[:-1]
    return out
def rule(w):
    n=nuc(w)
    if len(n)<2:return [w]
    cuts=[0]
    for (a1,b1),(a2,b2) in zip(n,n[1:]):
        c=w[b1:a2]
        if len(c)<=1:cut=b1
        else:
            k=1
            for L in (3,2):
                if len(c)>=L and c[-L:] in ONS or (L==2 and len(c)>=2 and c[-2:] in DG and c[-2:] not in ("ck","ng","gh")):k=L;break
            cut=a2-k if len(c)>=k else b1
            if c[-2:] in ("ck","ng") :cut=a2
        if len(c)==0:cut=b1
        cuts.append(cut)
    cuts.append(len(w))
    return [w[i:j] for i,j in zip(cuts,cuts[1:])]

def pick(w,py,cm):
    if w in OVR:return OVR[w]
    k=sum(1 for p in cm.get(w,[[]])[0] if p[-1].isdigit()) if w in cm else None
    a=py.inserted(w,'-').split('-');b=rule(w)
    if k is None:return a
    if len(a)==k and not (len(a)>1 and any(len(x)==1 and x not in 'aeiou' for x in a)):return a
    return b if len(b)==k else a
