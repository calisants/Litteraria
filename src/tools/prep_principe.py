"""O Príncipe (texto Einaudi/Firpo, só o corpo): separa em Dedica + Cap. 1-26 e em parágrafos.
O arquivo vem com o texto corrido (sem quebras) e com o cabeçalho de página «Niccolò Machiavelli - Il Principe»
no meio; aqui o cabeçalho é removido (religando palavras cortadas) e os parágrafos são grupos de frases.
Os títulos em colchetes (tradução italiana dos títulos latinos) são acréscimo da edição e NÃO entram.
Uso (dentro de src/):  python3 -I tools/prep_principe.py <arquivo.txt>"""
import json, os, re, sys
t = open(sys.argv[1], encoding="utf8").read()
HDR = "Niccolò Machiavelli - Il Principe"
t = re.sub(r"(?<=\w)" + re.escape(HDR) + r" (?=\w)", "", t)      # palavra cortada pela página
t = re.sub(r"\s*" + re.escape(HDR) + r"\s*", " ", t)
a = t.index("DEDICA NICOLAUS")
t = t[a:]
t = t.replace("DEDICA NICOLAUS MACLAVELLUS AD MAGNIFICUM LAURENTIUM MEDICEM. [NICOLO MACHIAVELLI AL MAGNIFICO LORENZO DE' MEDICI]", "").strip()
parts = re.split(r"\bCAP\. (\d+) ", t)
secs = [("Dedica", parts[0].strip())]
for k in range(1, len(parts), 2):
    n, body = int(parts[k]), parts[k + 1].strip()
    m = re.match(r"(.+?\.)\s*\[[^\]]*\]\s*(.*)$", body, re.S)
    lat, rest = m.group(1).strip(), m.group(2).strip()
    secs.append(("Cap. %d · %s" % (n, lat.rstrip(".")), rest))
out = []
FIX = {"etoffendono": "et offendono"}      # erros de espaço do e-texto
for title, body in secs:
    body = re.sub(r"\s+", " ", body)
    body = re.sub(r"([,;:])(?=[A-Za-zÀ-ù])", r"\1 ", body)
    for a_, b_ in FIX.items(): body = body.replace(a_, b_)
    sents = re.split(r"(?<=[.!?])\s+(?=[A-ZÈÉÀ\"«'])", body)
    ps, cur = [], ""
    for s in sents:
        cur = (cur + " " + s).strip()
        if len(cur.split()) >= 60: ps.append(cur); cur = ""
    if cur:
        if ps and len(cur.split()) < 25: ps[-1] += " " + cur
        else: ps.append(cur)
    out.append({"t": title, "p": ps})
os.makedirs("livros_txt/principe", exist_ok=True)
json.dump(out, open("livros_txt/principe/orig.json", "w", encoding="utf8"), ensure_ascii=False, indent=0)
for k, c in enumerate(out, 1):
    print(k, c["t"][:70], len(c["p"]), sum(len(x.split()) for x in c["p"]))
