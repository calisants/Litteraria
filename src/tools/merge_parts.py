"""Junta livros_txt/<id>/parts/lit_<n>_<a>-<b>.txt em livros_txt/<id>/lit_<n>.txt (capítulos longos traduzidos em pedaços).
Uso (dentro de src/):  python3 -I tools/merge_parts.py <id>"""
import sys, os, re, json
bid = sys.argv[1]
d = "livros_txt/%s/parts" % bid
orig = json.load(open("livros_txt/%s/orig.json" % bid, encoding="utf8"))
por = {}
for f in sorted(os.listdir(d)):
    m = re.match(r"lit_(\d+)_(\d+)-(\d+)\.txt$", f)
    if m: por.setdefault(int(m[1]), []).append((int(m[2]), int(m[3]), f))
for n, ps in por.items():
    ps.sort(); T = ""; linhas = {}
    for a, b, f in ps:
        for ln in open(os.path.join(d, f), encoding="utf8").read().split("\n"):
            if not ln.strip(): continue
            k, _, v = ln.partition("|")
            if k == "T": T = v.strip()
            else:
                assert a <= int(k) <= b, (f, k); linhas[int(k)] = v.strip()
    tot = len(orig[n - 1]["p"])
    assert sorted(linhas) == list(range(1, tot + 1)), "cap %d: faltam/sobram %s" % (n, sorted(set(range(1, tot + 1)) ^ set(linhas))[:10])
    open("livros_txt/%s/lit_%d.txt" % (bid, n), "w", encoding="utf8").write("T|%s\n" % T + "\n".join("%d|%s" % (i, linhas[i]) for i in range(1, tot + 1)) + "\n")
    print("cap", n, "ok,", tot, "parágrafos")
