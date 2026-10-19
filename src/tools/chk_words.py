"""Confere uma lista de vocabulário (palavra|pt|classe[|gênero]) contra o Kaikki (Wikcionário) e contra o texto do livro.
Uso: python3 -I chk_words.py <fr|it> <lista.txt> <kaikki.jsonl> <texto.txt>
Mostra: palavra sem entrada no Kaikki, classe que não bate, gênero que não bate, e quantas vezes o radical aparece no texto."""
import sys, json, re, unicodedata
lang, lst, kk, txt = sys.argv[1:5]
rows = [l.rstrip("\n").split("|") for l in open(lst, encoding="utf8") if l.strip() and not l.startswith("#")]
want = {r[0] for r in rows}
K = {}
for line in open(kk, encoding="utf8"):
    try: e = json.loads(line)
    except Exception: continue
    if e.get("lang_code") != lang: continue
    w = e["word"]
    if w in want: K.setdefault(w, []).append(e)
POS = {"s": "noun", "v": "verb", "adj": "adj", "adv": "adv", "prep": "prep", "conj": "conj", "pron": "pron"}
def norm(t): return "".join(c for c in unicodedata.normalize("NFD", t.lower()) if unicodedata.category(c) != "Mn").replace("ſ", "s")
T = norm(open(txt, encoding="utf8").read())
bad = 0
for r in rows:
    w, pt, c = r[0], r[1], r[2]; g = r[3] if len(r) > 3 else ""
    es = K.get(w)
    if not es: print("SEM ENTRADA:", w); bad += 1; continue
    ps = {e.get("pos") for e in es}
    if POS[c] not in ps: print("CLASSE:", w, c, "tem", ps); bad += 1
    if c == "s" and g:
        gs = set()
        for e in es:
            if e.get("pos") != "noun": continue
            for h in e.get("head_templates", []):
                m = re.search(r"\b(m|f)\b", h.get("expansion", "").split("(")[0])
                if m: gs.add(m.group(1))
            for s in e.get("senses", []):
                for t in s.get("tags", []):
                    if t in ("masculine", "feminine"): gs.add(t[0])
        if gs and g not in gs: print("GÊNERO:", w, g, "tem", gs); bad += 1
    stem = norm(w)[:max(4, len(norm(w)) - 2)]
    n = T.count(stem)
    if n == 0: print("NÃO APARECE NO TEXTO:", w)
print(len(rows), "palavras;", bad, "problemas")
