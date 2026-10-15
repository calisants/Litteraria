import collections
D='/tmp/claude-0/wn/wordnet/'
def load():
    syn=collections.defaultdict(set);ant=collections.defaultdict(set);byoff={}
    for pos in('adj','adv','noun','verb'):
        for ln in open(D+'data.'+pos,encoding='utf8'):
            if ln.startswith('  '):continue
            h,_,gloss=ln.partition(' | ');f=h.split()
            off=f[0];n=int(f[3],16);words=[f[4+2*i].lower().split('(')[0] for i in range(n)]
            byoff[(off,f[2] if f[2]!='s' else 'a')]=words
            rest=f[4+2*n:];pc=int(rest[0]);ptrs=[rest[1+4*i:5+4*i] for i in range(pc)]
            for i,w in enumerate(words):
                syn[w]|={x for x in words if x!=w}
            for sym,o,p,st in ptrs:
                if sym=='!' and st!='0000':
                    s=int(st[:2],16);t=int(st[2:],16)
                    byoff.setdefault('ants',[]).append((off,f[2],s,o,p,t,words))
    for off,pt,s,o,p,t,words in byoff['ants']:
        tw=byoff.get((o,p if p!='s' else 'a'))
        if tw and s>=1 and t>=1 and t<=len(tw):ant[words[s-1]].add(tw[t-1])
    return syn,ant
