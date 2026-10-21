"""Separa «The Adventures of Sherlock Holmes» (Gutenberg nº 1661) em 12 contos e parágrafos.
Uso (dentro de src/):  python3 -I tools/prep_sherlock.py <sherlock.txt>
Só junta linhas quebradas. Os sublinhados _assim_ do Gutenberg (marca de itálico) são retirados; nenhuma palavra muda."""
import json, os, re, sys
t = open(sys.argv[1], encoding="utf8").read()
t = t[t.index("*** START"):t.index("*** END")]
t = t[t.index("\n", 5):]
TIT = dict((a, b.strip()) for a, b in re.findall(r"^\s+([IVX]+)\.\s+(.+)$", t[:t.index("\n\n\n\n\nI. A SCANDAL")], re.M))
chs, cur = [], None
for blk in re.split(r"\n\s*\n", t):
    b = re.sub(r"\s*\n\s*", " ", blk).strip()
    if not b: continue
    m = re.match(r"^([IVX]+)\. ([A-Z][A-Z ’'\-]+)$", b)
    if m and (cur is not None or b == "I. A SCANDAL IN BOHEMIA"):
        title = m.group(1) + ". " + TIT[m.group(1)]
        cur = {"t": title, "p": []}; chs.append(cur); continue
    if cur is None: continue
    b = re.sub(r"_([^_]+)_", r"\1", b)
    cur["p"].append(b)
os.makedirs("livros_txt/sherlock", exist_ok=True)
json.dump(chs, open("livros_txt/sherlock/orig.json", "w", encoding="utf8"), ensure_ascii=False, indent=0)
for k, c in enumerate(chs, 1):
    print(k, c["t"], len(c["p"]), sum(len(x.split()) for x in c["p"]))
