"""Separa o texto de um livro em capítulos e parágrafos (só o original, sem mexer nas palavras).
Uso (dentro de src/):  python3 -I tools/prep_texto.py <id> <arquivo.txt> [peter]
Grava livros_txt/<id>/orig.json  ->  [{"t": título do capítulo, "p": [parágrafos]}]
O texto sai do .txt como veio; só junta as linhas quebradas de cada parágrafo."""
import json, os, re, sys
bid, src = sys.argv[1], sys.argv[2]
mode = sys.argv[3] if len(sys.argv) > 3 else ""
t = open(src, encoding="utf8").read()
chs = []
if mode == "peter":
    i = t.index("Once upon a time"); j = t.index(" THE END")
    s = t[i:j].strip()
    s = s.replace("Mrs. ", "Mrs.\u0001").replace("Mr. ", "Mr.\u0001")
    sents = [x.replace("\u0001", " ") for x in re.split(r"(?<=[.!?'])\s+(?=[A-Z'])", s)]
    ps, cur = [], ""
    for x in sents:
        cur = (cur + " " + x).strip()
        if len(cur.split()) >= 28: ps.append(cur); cur = ""
    if cur: ps.append(cur)
    chs = [{"t": "The Tale of Peter Rabbit", "p": ps}]
else:
    cur = None; pend = False
    for blk in re.split(r"\n\s*\n", t):
        b = re.sub(r"\s*\n\s*", " ", blk).strip()
        if not b: continue
        m = re.match(r"CHAPTER ([IVXLC]+)\.?\s*(.*)$", b)
        if m:
            cur = {"t": b, "p": []}; chs.append(cur); pend = not m.group(2); continue
        if cur is not None and pend and not cur["p"]:
            cur["t"] += ". " + b; pend = False; continue
        if cur is None: continue
        cur["p"].append(b)
os.makedirs("livros_txt/" + bid, exist_ok=True)
json.dump(chs, open("livros_txt/%s/orig.json" % bid, "w", encoding="utf8"), ensure_ascii=False, indent=0)
for k, c in enumerate(chs, 1):
    print(k, c["t"], len(c["p"]), sum(len(x.split()) for x in c["p"]))
