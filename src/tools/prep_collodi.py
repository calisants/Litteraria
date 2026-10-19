"""Collodi, «I racconti delle fate» (1875; PDF do Liber Liber que ela enviou, passado por pdftotext): separa em contos e parágrafos -> livros_txt/racconti/orig.json
Uso (dentro de src/):  python3 -I tools/prep_collodi.py <racconti.txt>
- 15 contos; o 1º (Barba-blu) começa sem título na linha 1; os outros começam numa linha de título bem recuada;
- as linhas quebradas são juntadas (linha terminada em «-» junta sem espaço: só há nomes compostos, ex. Barba-blu);
- parágrafo novo = linha recuada; parágrafos com mais de ~110 palavras são cortados entre frases (~60 palavras);
- «MORALE» / «ALTRA MORALE» (Le Fate) entram como início do parágrafo seguinte."""
import json, os, re, sys
L = open(sys.argv[1], encoding="utf8").read().replace("\x0c", " ").split("\n")
T = [(i, l.strip()) for i, l in enumerate(L) if re.match(r"^\s{18,}\S", l) and len(l.strip()) < 60]
heads = [(0, "Barba-blu")] + [(i, t) for i, t in T if t not in ("MORALE", "ALTRA MORALE")]
def sents(t): return re.split(r"(?:(?<=[.!?…])|(?<=[.!?][»”\"']))\s+(?=[A-ZÀ-Ý«“\"'])", t)
def split(t, goal=60):
    if len(t.split()) <= 110: return [t]
    ps, cur = [], ""
    for x in sents(t):
        cur = (cur + " " + x).strip()
        if len(cur.split()) >= goal: ps.append(cur); cur = ""
    if cur:
        if ps and len(cur.split()) < 25: ps[-1] += " " + cur
        else: ps.append(cur)
    return ps
def join(lines):
    s = ""
    for l in lines:
        l = l.strip()
        if not l: continue
        s = (s + l) if s.endswith("-") else (s + " " + l if s else l)
    return re.sub(r"\s+", " ", s).strip()
out = []
for k, (i, title) in enumerate(heads):
    e = heads[k + 1][0] if k + 1 < len(heads) else len(L)
    paras, cur, pend = [], [], ""
    for l in L[(i + 1 if k else 0):e]:
        s = l.strip()
        if s in ("MORALE", "ALTRA MORALE"):
            if cur: paras.append(join(cur)); cur = []
            pend = s.capitalize() + ". "; continue
        if not s: continue
        if re.match(r"^\s{4,}", l) and cur:
            paras.append(join(cur)); cur = []
        if not cur and pend: s = pend + s; pend = ""
        cur.append(s)
    if cur: paras.append(join(cur))
    ps = []
    for p in paras: ps += split(p)
    out.append({"t": title.replace("d' oro", "d'oro"), "p": ps})
os.makedirs("livros_txt/racconti", exist_ok=True)
json.dump(out, open("livros_txt/racconti/orig.json", "w", encoding="utf8"), ensure_ascii=False, indent=0)
for k, c in enumerate(out, 1): print(k, c["t"], len(c["p"]), sum(len(x.split()) for x in c["p"]))
