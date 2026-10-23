"""Pinóquio (Gutenberg, it): separa em 36 capítulos e parágrafos → livros_txt/pinocchio/orig.json.
Uso (dentro de src/):  python3 -I tools/prep_pino.py <pinoquio.txt>
Título do capítulo = «N. <título>». Só junta linhas quebradas; remove as legendas «[Illustrazione: …]» (não são do texto)."""
import json, os, re, sys
t = open(sys.argv[1], encoding="utf8").read()
i = t.index("*** START"); j = t.index("*** END")
t = t[i:j]
t = t[t.index("\n", 0):]
t = re.sub(r"\[Illustrazione:[^\]]*\]", "", t)
blocks = [re.sub(r"\s*\n\s*", " ", b).strip() for b in re.split(r"\n\s*\n", t)]
blocks = [b for b in blocks if b]
chs = []; cur = None; want_title = False
ROM = re.compile(r"^([IVXL]+)\.$")
for b in blocks:
    m = ROM.match(b)
    if m and (cur is not None or True):
        cur = {"n": m.group(1), "t": "", "p": []}; chs.append(cur); want_title = True; continue
    if cur is None: continue
    if want_title:
        cur["t"] = b; want_title = False; continue
    cur["p"].append(b)
# no último capítulo, corta o que vem depois de «FINE.» (índice, nota do transcritor e rodapé do Gutenberg não são do livro)
for c in chs:
    for i, x in enumerate(c["p"]):
        if x.strip().startswith("FINE"):
            c["p"] = c["p"][:i+1]; break
# remove o que vem antes do capítulo I (página de rosto) e o fim do livro
chs = [c for c in chs if c["p"]]
out = [{"t": "%d. %s" % (k, c["t"]), "p": c["p"]} for k, c in enumerate(chs, 1)]
os.makedirs("livros_txt/pinocchio", exist_ok=True)
json.dump(out, open("livros_txt/pinocchio/orig.json", "w", encoding="utf8"), ensure_ascii=False, indent=0)
for k, c in enumerate(out, 1):
    print(k, c["t"][:70], len(c["p"]), sum(len(x.split()) for x in c["p"]))
