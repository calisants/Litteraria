"""Junta o original (livros_txt/<id>/orig.json) com a tradução (livros_txt/<id>/pt_<n>.txt) e grava ../books/<id>.js.
Uso (dentro de src/):  python3 -I tools/mk_texto.py <id> [<id> ...]   (sem ids = todos que têm pasta)
pt_<n>.txt: primeira linha opcional «T|título traduzido»; depois «número|tradução», um por parágrafo, na ordem.
Capítulos sem arquivo de tradução ficam de fora (o livro aparece só com os capítulos prontos) e o script avisa."""
import json, os, sys
ids = sys.argv[1:] or sorted(d for d in os.listdir("livros_txt") if os.path.isdir("livros_txt/" + d))
os.makedirs("../books", exist_ok=True)
INFO = {}
for bid in ids:
    orig = json.load(open("livros_txt/%s/orig.json" % bid, encoding="utf8"))
    out, falta = [], []
    for n, c in enumerate(orig, 1):
        f = "livros_txt/%s/pt_%d.txt" % (bid, n)
        if not os.path.exists(f):
            falta.append(n); continue
        pt, tt = {}, ""
        for ln in open(f, encoding="utf8").read().split("\n"):
            if not ln.strip(): continue
            k, _, v = ln.partition("|")
            if k == "T": tt = v.strip()
            else: pt[int(k)] = v.strip()
        assert sorted(pt) == list(range(1, len(c["p"]) + 1)), "%s cap %d: tradução com %d parágrafos, original com %d" % (bid, n, len(pt), len(c["p"]))
        out.append({"n": n, "t": c["t"], "tp": tt, "p": [[o, pt[i]] for i, o in enumerate(c["p"], 1)]})
    js = "(window.BOOKTXT=window.BOOKTXT||{})[%s]=%s;\n" % (json.dumps(bid), json.dumps(out, ensure_ascii=False, separators=(",", ":")))
    open("../books/%s.js" % bid, "w", encoding="utf8").write(js)
    INFO[bid] = {"total": len(orig), "chs": [{"n": c["n"], "t": c["t"], "tp": c["tp"], "w": sum(len(x[0].split()) for x in c["p"])} for c in out]}
    print(bid, len(out), "capítulos prontos de", len(orig), "| %d KB" % (len(js) // 1024), "| faltam:", falta or "-")
# lista dos capítulos prontos (carregada junto com o app; os textos ficam em ../books/<id>.js e só abrem quando a pessoa lê)
old = {}
if os.path.exists("livros_txt.js"):
    old = json.loads(open("livros_txt.js", encoding="utf8").read().split("=", 1)[1].rstrip().rstrip(";"))
old.update(INFO)
open("livros_txt.js", "w", encoding="utf8").write("window.BOOKTXT_INFO=" + json.dumps(old, ensure_ascii=False, separators=(",", ":")) + ";\n")
