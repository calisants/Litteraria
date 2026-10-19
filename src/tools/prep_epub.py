"""Separa um ePub (Gutenberg) em capítulos e parágrafos: um capítulo por arquivo xhtml que tenha um título h2/h3 e parágrafos.
Uso (dentro de src/):  python3 -I tools/prep_epub.py <id> <pasta do ePub descompactado/OEBPS> <regex do título, ex. '^(Letter|Chapter) \\d+$'>
Grava livros_txt/<id>/orig.json (mesmo formato do prep_texto.py). O texto não é alterado; só tira marcação, junta espaços e converte entidades."""
import json, os, re, sys, glob, html
bid, d, rx = sys.argv[1], sys.argv[2], re.compile(sys.argv[3])
def txt(s): return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", "", s))).strip()
def key(f): return int(re.search(r"-h-(\d+)\.", f).group(1))
chs = []
for f in sorted(glob.glob(d + "/*.xhtml"), key=lambda f: key(f) if re.search(r"-h-\d+\.", f) else -1):
    t = open(f, encoding="utf8").read()
    hs = [txt(h) for h in re.findall(r"<h[1-4][^>]*>(.*?)</h[1-4]>", t, re.S)]
    if not hs or not rx.match(hs[0]): continue
    ps = [txt(p) for p in re.findall(r"<p[ >].*?</p>", t, re.S)]
    ps = [p for p in ps if p]
    chs.append({"t": hs[0] + (" · " + " ".join(hs[1:]) if len(hs) > 1 else ""), "p": ps})
os.makedirs("livros_txt/" + bid, exist_ok=True)
json.dump(chs, open("livros_txt/%s/orig.json" % bid, "w", encoding="utf8"), ensure_ascii=False, indent=0)
for k, c in enumerate(chs, 1): print(k, c["t"], len(c["p"]), sum(len(x.split()) for x in c["p"]))
