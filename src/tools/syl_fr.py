"""Divisão silábica do francês (escrita) por regras. Validada contra as hifenizações do Wikcionário (Kaikki) e a contagem de sílabas do IPA."""
import re
V="aeiouyàâäéèêëîïôöùûüœæ"
CL=("bl","br","cl","cr","dr","fl","fr","gl","gr","pl","pr","tr","vr")
DG=("ch","ph","th","gn","sh")
def nuclei(w):
    out=[]
    for m in re.finditer("["+V+"]+",w):
        s,e=m.span();seg=m.group()
        # hiato: vogal + é/ï/ë/ü acentuado depois de outra vogal; o + è/ê
        cuts=[]
        for i in range(1,len(seg)):
            if (seg[i] in "éïëü" or (seg[i]=="è" and seg[i-1]=="o")) and seg[i-1] in "aeiouy" and not (seg[i-1]=="u" and seg[i]=="é" and s+i-1>0 and w[s+i-2] in "gq"): cuts.append(i)
            elif seg[i-1] in "aeo" and seg[i]=="o" and False: cuts.append(i)
        prev=0
        for c in cuts+[len(seg)]:
            out.append((s+prev,s+c));prev=c
    return out
def syl(w,merge_e=False):
    n=nuclei(w)
    # u depois de q/g e antes de vogal faz parte da consoante (qu, gu)
    fixed=[]
    for a,b in n:
        if a>0 and w[a]=="u" and w[a-1] in "qg" and b-a>1: a+=1
        fixed.append((a,b))
    n=[x for x in fixed if x[1]>x[0]]
    # e final mudo
    mute=False
    if len(n)>1:
        a,b=n[-1]
        if w[a:b]=="e" and b==len(w): mute=True
        elif w[a:b]=="e" and w[b:]=="s": mute=True
    if mute and merge_e: n=n[:-1]
    if not n: return [w]
    cuts=[0]
    for (a1,b1),(a2,b2) in zip(n,n[1:]):
        c=w[b1:a2]
        if len(c)==0: cut=b1
        elif len(c)==1: cut=b1+1 if c=="x" else b1
        else:
            k=len(c)-1
            if c[-2:] in CL or c[-2:] in DG: k=len(c)-2
            if c[-2:] in ("qu","gu") : k=len(c)-2
            if k<0:k=0
            cut=b1+k
        cuts.append(cut)
    cuts.append(len(w))
    parts=[w[i:j] for i,j in zip(cuts,cuts[1:])]
    return parts
OVR={"client":["cli","ent"],"nuage":["nu","age"],"payer":["pa","yer"],"tchao":["tcha","o"],"réunion":["ré","u","nion"],
 # palavras de «O Pequeno Príncipe» (hiatos e ajustes conferidos contra o IPA do Wikcionário)
 "baobab":["ba","o","bab"],"boa":["bo","a"],"crayon":["cray","on"],"crier":["cri","er"],"créer":["cré","er"],"dédier":["dé","di","er"],
 "confier":["con","fi","er"],"envier":["en","vi","er"],"oublier":["ou","bli","er"],"ennuyer":["en","nuy","er"],"essayer":["es","say","er"],
 "géographe":["gé","o","graphe"],"géographie":["gé","o","gra","phie"],"extraordinaire":["ex","tra","or","di","naire"],"obéir":["o","bé","ir"],
 "océan":["o","cé","an"],"réussir":["ré","us","sir"],"rayonner":["ray","on","ner"],"rayonnement":["ray","on","ne","ment"],"réflexion":["ré","fle","xion"]}
def word(w,merge_e=False):
    out=[]
    for tok in re.split("([-'’ ])",w):
        if tok in ("-","'","’"," ") or not tok: out.append([tok] if tok else []);continue
        out.append(OVR.get(tok) or syl(tok,merge_e))
    return out
