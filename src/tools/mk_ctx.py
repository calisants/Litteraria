#!/usr/bin/env python3
"""Lê tools/ctx_{fr,it,en}.txt e gera src/frases_ctx.js (CTXC).
Confere: a palavra aparece inteira, uma vez só, na frase; não há palavra repetida."""
import re, json, sys, os
H = os.path.dirname(os.path.abspath(__file__))
out = {}; bad = 0
for l in ("fr", "it", "en"):
    d = {}
    for n, ln in enumerate(open(os.path.join(H, f"ctx_{l}.txt"), encoding="utf-8"), 1):
        ln = ln.rstrip("\n")
        if not ln.strip() or ln.startswith("#"): continue
        p = ln.split("|")
        if len(p) != 3: print(l, n, "formato", ln); bad += 1; continue
        w, s, pt = p
        if w in d: print(l, n, "repetida", w); bad += 1
        c = len(re.findall(r"(?<![\w])" + re.escape(w) + r"(?![\w])", s, re.I | re.U))
        if c != 1: print(l, n, f"«{w}» aparece {c}x em: {s}"); bad += 1
        d[w] = [s, pt]
    out[l] = d
if bad: sys.exit("erros: %d" % bad)
js = "/* Gerado por tools/mk_ctx.py. Frases escritas por Claude, sem fonte conferida (só palavras sem exemplo do Wikcionário). */\nconst CTXC=" + json.dumps(out, ensure_ascii=False, separators=(",", ":")) + ";\n"
open(os.path.join(H, "..", "frases_ctx.js"), "w", encoding="utf-8").write(js)
print({k: len(v) for k, v in out.items()})
