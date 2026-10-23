import json, sys
sys.path.insert(0, '.')
import gram_rules as G1, gram_rules2 as G2, gram_rules3 as G3
items = json.load(open('gram_items.json', encoding='utf8'))
items2 = json.load(open('gram_items2.json', encoding='utf8'))
items3 = json.load(open('gram_items3.json', encoding='utf8'))
for l in items: items[l].update(items2[l]); items[l].update(items3[l])
items4 = json.load(open('gram_items4.json', encoding='utf8'))  # páginas só do inglês (gram_en_cam.py)
for l in items4: items[l].update(items4[l])
try:
    import hints
    NH = hints.hint_items(items)
except ImportError:  # módulo conj (verbecc) não está mais no repositório: usa as dicas guardadas em gram_hints.json
    _H = json.load(open('gram_hints.json', encoding='utf8')); NH = 0
    for _l, _ts in _H.items():
        for _t, _ps in _ts.items():
            for _pi, _qs in _ps.items():
                for _qi, _o in _qs.items():
                    _it = items[_l][_t][int(_pi)][int(_qi)]
                    assert _it['q'] == _o['q'], (_l, _t, _pi, _qi)
                    _it['d'] = _o['d']; NH += 1
rules = {l: {**G1.R[l], **G2.R2[l], **G3.R3[l]} for l in G1.R}
ORDER = [  # ordem didática: vocabulário da gramática -> frase simples no presente -> estruturas -> passado e futuro -> frases complexas
 ("classes", "Classes de palavras", "Classes"),
 ("artigos", "Artigos e gênero", "Artigos"),
 ("plural", "Plural dos substantivos", "Plural"),
 ("presente", "Verbos no presente", "Presente"),
 ("negacao", "Negação e perguntas", "Negação"),
 ("possessivos", "Possessivos e pronomes", "Possessivos"),
 ("falsos", "Falsos amigos (semântica)", "Falsos amigos"),
 ("prep", "Preposições", "Preposições"),
 ("prep2", "Preposições parecidas: above, over, among, during…", "Preposições parecidas"),
 ("reflexivos", "Verbos e pronomes reflexivos", "Reflexivos"),
 ("ordem", "Ordem da frase (sintaxe)", "Ordem da frase"),
 ("adverbios", "Advérbios", "Advérbios"),
 ("passado", "Passado básico", "Passado"),
 ("futuro", "Futuro", "Futuro"),
 ("condicional", "Condicional e frases com «se»", "Condicional"),
 ("subjuntivo", "Subjuntivo", "Subjuntivo"),
 ("conjuncoes", "Conjunções", "Conjunções"),
 ("confusas", "Palavras que se confundem", "Confundíveis"),
 ("sinonimos", "Sinônimos e antônimos", "Sinônimos"),
]
for _l,_d in G3.OV.items():
    for _t,_o in _d.items(): rules[_l].setdefault(_t,{}).update(_o)
for l in items:
    ONLY_EN = {'prep2', 'confusas'}
    exp = {t[0] for t in ORDER} - (set() if l == 'en' else ONLY_EN)
    assert set(items[l]) == exp, (l, set(items[l]) ^ exp)
    assert set(rules[l]) == exp, (l, set(rules[l]) ^ exp)
dump = lambda o: json.dumps(o, ensure_ascii=False, separators=(',', ':'))
types = "[" + ", ".join(json.dumps(list(t), ensure_ascii=False) for t in ORDER) + "]"
js = ("/* ===== Volume 3 (id 4): Gramática. Dados gerados por gram_gen.py, gram_gen2.py e gram_rules*.py; conjugações conferidas por verbecc/lemminflect ===== */\n"
      "const GRAM={items:" + dump(items) + ",rules:" + dump(rules) + "};\n"
      "const VOLUME4={id:4,title:\"Volume 4 · Gramática\",types:" + types + ",pages:[]};\n"
      "VOLUME4.types.forEach(t=>{const ls=[\"fr\",\"it\",\"en\"].filter(l=>GRAM.items[l][t[0]]),n=Math.max(...ls.map(l=>GRAM.items[l][t[0]].length));for(let i=1;i<=n;i++){const pg={id:t[0]+\"-\"+i,type:t[0],n:i,meta:\"6 perguntas · \"+t[1],themes:[]};if(ls.length<3)pg.langs=ls;VOLUME4.pages.push(pg);}});\n"
      "VOLUMES.push(VOLUME4);\n"
      "const DRILL=" + open('bank.json', encoding='utf8').read() + ";\n")
open(sys.argv[1], 'w', encoding='utf8').write(js)
n = sum(len(p) for l in items.values() for t in l.values() for p in t)
print("dicas", NH);print("itens", n, "paginas por idioma", sum(len(t) for t in items['fr'].values()), "bytes", len(js))
