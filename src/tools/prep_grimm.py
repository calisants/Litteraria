"""Grimm (inglês, Gutenberg nº 2591, tradução de Edgar Taylor/Margaret Hunt, domínio público): escolhe contos -> livros_txt/grimm/orig.json
Uso (dentro de src/):  python3 -I tools/prep_grimm.py <grimm.txt>
- cada conto começa na linha de título (maiúsculas, recuo de 6 espaços) e vai até o título seguinte;
- o texto não é alterado: só junta as linhas quebradas e, em parágrafos com mais de ~110 palavras, corta entre frases (~60 palavras)."""
import json, os, re, sys
L = open(sys.argv[1], encoding="utf8").read().split("\n")
T = [(i, l.strip()) for i, l in enumerate(L) if l.startswith("      ") and l.strip().isupper() and len(l.strip()) > 3 and not l.strip().startswith("THE BROTHERS") and not re.search("[’!]", l)]
PICK = [  # (título no livro, título em inglês mostrado)
 ("SNOWDROP", "Snowdrop [Snow White]"), ("ASHPUTTEL", "Ashputtel [Cinderella]"), ("RAPUNZEL", "Rapunzel"), ("HANSEL AND GRETEL", "Hansel and Gretel"),
 ("LITTLE RED-CAP [LITTLE RED RIDING HOOD]", "Little Red-Cap [Little Red Riding Hood]"), ("BRIAR ROSE", "Briar Rose [Sleeping Beauty]"), ("THE FROG-PRINCE", "The Frog-Prince"),
 ("RUMPELSTILTSKIN", "Rumpelstiltskin"), ("THE TRAVELLING MUSICIANS", "The Travelling Musicians"), ("THE TWELVE DANCING PRINCESSES", "The Twelve Dancing Princesses"),
 ("THE GOLDEN GOOSE", "The Golden Goose"), ("THE QUEEN BEE", "The Queen Bee"), ("THE SEVEN RAVENS", "The Seven Ravens"), ("THE FISHERMAN AND HIS WIFE", "The Fisherman and His Wife"),
 ("MOTHER HOLLE", "Mother Holle"), ("THE WOLF AND THE SEVEN LITTLE KIDS", "The Wolf and the Seven Little Kids"), ("THE ELVES AND THE SHOEMAKER", "The Elves and the Shoemaker")]
def sents(t):
    return re.split(r"(?:(?<=[.!?])|(?<=[.!?][’”]))\s+(?=[A-Z‘“])", t)
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
out = []
for key, show in PICK:
    k = [n for n, (i, t) in enumerate(T) if t == key]
    assert k, key
    n = k[-1]; a = T[n][0] + 1; b = T[n + 1][0] if n + 1 < len(T) else len(L)
    ps = []
    for blk in re.split(r"\n\s*\n", "\n".join(L[a:b])):
        s = re.sub(r"\s*\n\s*", " ", blk).strip()
        if s and not (s.isupper() and len(s.split()) < 14): ps += split(s)
    out.append({"t": show, "p": ps})
os.makedirs("livros_txt/grimm", exist_ok=True)
json.dump(out, open("livros_txt/grimm/orig.json", "w", encoding="utf8"), ensure_ascii=False, indent=0)
for k, c in enumerate(out, 1): print(k, c["t"], len(c["p"]), sum(len(x.split()) for x in c["p"]))
