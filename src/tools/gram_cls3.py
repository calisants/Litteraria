"""Acrescenta a 3ª página de «Classes de palavras» (pronome, conjunção, interjeição) a gram_items.json.
O gerador antigo (gram_gen.py) depende de um módulo que não está mais no repositório, então esta página
é gerada à parte. Idempotente: só acrescenta se 'classes' ainda tem 2 páginas. Rode dentro de tools/."""
import json, random

LABEL = {"pr": "PRONOME", "cj": "CONJUNÇÃO", "ij": "INTERJEIÇÃO"}
ART = {"pr": "o", "cj": "a", "ij": "a"}
UM = {"pr": "um", "cj": "uma", "ij": "uma"}
HELP = {
    "pr": "O pronome fica no lugar de um substantivo ou se refere a algo já dito ou presente na situação.",
    "cj": "A conjunção liga duas partes da frase.",
    "ij": "A interjeição expressa emoção e vale como uma frase sozinha.",
}
FR = [
    ("Marie est fatiguée, mais elle continue à travailler.", "pr", "elle", ["Marie", "fatiguée", "travailler"]),
    ("Je mange du pain et je bois de l'eau.", "cj", "et", ["mange", "pain", "bois"]),
    ("Hourra ! Nous avons gagné le match.", "ij", "Hourra", ["avons", "gagné", "match"]),
    ("Je regarde la télévision avec mon frère.", "pr", "Je", ["regarde", "télévision", "frère"]),
    ("Je reste à la maison car il pleut.", "cj", "car", ["reste", "maison", "pleut"]),
    ("Oh ! Le gâteau est délicieux.", "ij", "Oh", ["gâteau", "est", "délicieux"]),
]
IT = [
    ("Maria è stanca, ma lei continua a lavorare.", "pr", "lei", ["Maria", "stanca", "lavorare"]),
    ("Mangio la pasta e bevo l'acqua.", "cj", "e", ["Mangio", "pasta", "bevo"]),
    ("Evviva! Abbiamo vinto la partita.", "ij", "Evviva", ["Abbiamo", "vinto", "partita"]),
    ("Io abito a Roma con mia sorella.", "pr", "Io", ["abito", "Roma", "sorella"]),
    ("Resto a casa perché piove.", "cj", "perché", ["Resto", "casa", "piove"]),
    ("Oh, il gelato è buonissimo!", "ij", "Oh", ["gelato", "è", "buonissimo"]),
]
EN = [
    ("Mary is tired, but she keeps working.", "pr", "she", ["Mary", "tired", "working"]),
    ("I eat bread and I drink water.", "cj", "and", ["eat", "bread", "drink"]),
    ("Hooray! The team won the match.", "ij", "Hooray", ["team", "won", "match"]),
    ("I watch television with my brother.", "pr", "I", ["watch", "television", "brother"]),
    ("I stay at home because it is raining.", "cj", "because", ["stay", "home", "raining"]),
    ("Wow! This cake is delicious.", "ij", "Wow", ["cake", "is", "delicious"]),
]

def items(lang, data):
    r = random.Random("cls3|" + lang)
    out = []
    for sent, c, ans, others in data:
        opts = [ans] + others
        r.shuffle(opts)
        out.append({"q": f"{sent}\nQual palavra é {ART[c]} {LABEL[c]}?", "o": opts, "a": opts.index(ans),
                    "w": f"«{ans}» é {UM[c]} {LABEL[c].lower()}. " + HELP[c], "s": sent, "k": ans})
    return out

if __name__ == "__main__":
    d = json.load(open("gram_items.json", encoding="utf8"))
    for lang, data in (("fr", FR), ("it", IT), ("en", EN)):
        pages = d[lang]["classes"]
        if len(pages) == 2:
            pages.append(items(lang, data))
        assert len(pages) == 3 and len(pages[2]) == 6
    json.dump(d, open("gram_items.json", "w", encoding="utf8"), ensure_ascii=False, indent=0)
    print("ok", [len(d[l]["classes"]) for l in d])
