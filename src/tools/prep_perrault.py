"""Perrault, «Histoires ou Contes du temps passé» (1697): separa em seções e parágrafos -> livros_txt/perrault/orig.json
Uso (dentro de src/):  python3 -I tools/prep_perrault.py <arquivo .xhtml do ePub da Wikisource>
- só o corpo do livro (dedicatória + 8 contos com moralidades); fora: capa, tabela, privilégio do rei, errata;
- ſ (s longo) vira s; espaços não separáveis viram espaço comum; o resto fica como no texto da Wikisource;
- os versos das moralidades vêm com lixo de digitalização na margem de cada linha («FBel», «Ie d», «Et »...): as linhas
  foram refeitas à mão abaixo, linha a linha, e conferidas contra o texto (cada verso aparece no original);
- versos separados por « / »; «on le l'aille» da Wikisource foi corrigido para «on le raille»."""
import json, os, re, sys
from bs4 import BeautifulSoup
src = sys.argv[1]
s = BeautifulSoup(open(src, encoding="utf8").read(), "html.parser")
for x in s.select(".ws-pagenum,figure,.mw-empty-elt,sup,.reference"): x.decompose()
B = []
for el in s.find_all(["p", "div", "h1", "h2", "h3", "h4", "li"]):
    if el.find(["p", "div"]): continue
    tx = el.get_text(" ", strip=False).replace("\xa0", " ").replace("ſ", "s")
    tx = re.sub(r"[ \t\r\f\v]+", " ", tx); tx = re.sub(r" ?\n ?", "\n", tx).strip()
    if tx: B.append(tx)
def find(prefix, start=0):
    for i in range(start, len(B)):
        if B[i].startswith(prefix): return i
    raise SystemExit("nao achei: " + prefix)
def sents(t):
    t = re.sub(r"\s+", " ", t).strip()
    t = t.replace("Mr. ", "Mr.\u0001")
    return [x.replace("\u0001", " ") for x in re.split(r"(?<=[.!?:;])\s+(?=[A-ZÀ-Ý«\"'“])", t) if x]
def paras(t, goal=60):
    ps, cur = [], ""
    for x in sents(t):
        cur = (cur + " " + x).strip()
        if len(cur.split()) >= goal: ps.append(cur); cur = ""
    if cur:
        if ps and len(cur.split()) < 25: ps[-1] += " " + cur
        else: ps.append(cur)
    return ps
V = {  # moralidades refeitas à mão (verso por verso)
 "bela": "MORALITÉ. Attendre quelque temps pour avoir un Époux Riche, bien-fait, galant & doux, La chose est assez naturelle ; Mais l’attendre cent ans, & toûjours en dormant, On ne trouve plus de femelle Qui dormist si tranquillement. La Fable semble encor vouloir nous faire entendre Que souvent de l’Hymen les agreables nœuds, Pour estre differez, n’en sont pas moins heureux, Et qu’on ne perd rien pour attendre. Mais le sexe avec tant d’ardeur Aspire à la foy conjugale Que je n’ay pas la force ny le cœur De luy prescher cette morale.",
 "chap": "MORALITÉ. On voit icy que de jeunes enfans, / Sur tout de jeunes filles, / Belles, bien faites & gentilles, / Font tres-mal d’écouter toute sorte de gens, / Et que ce n’est pas chose estrange, / S’il en est tant que le loup mange. / Je dis le loup, car tous les loups / Ne sont pas de la mesme sorte ; / Il en est d’une humeur accorte, / Sans bruit, sans fiel & sans courroux, / Qui privez, complaisans & doux / Suivent les jeunes Demoiselles / Jusque dans les maisons, jusque dans les ruelles ; / Mais, hélas ! qui ne sçait que ces loups doucereux, / De tous les loups sont les plus dangereux.",
 "barbe1": "MORALITÉ. La curiosité, malgré tous ses attraits, / Couste souvent bien des regrets ; / On en voit, tous les jours, mille exemples paroistre, / C’est, n’endeplaise au sexe, un plaisir bien leger, / Dés qu’on le prend, il cesse d’estre, / Et toûjours il couste trop cher.",
 "barbe2": "AUTRE MORALITÉ. Pour peu qu’on ait l’esprit sensé, / Et que du monde on sçache le grimoire, / On voit bien-tost que cette histoire / Est un conte du temps passé ; / Il n’est plus d’Epoux si terrible, / Ny qui demande l’impossible, / Fut-il mal-content & jaloux, / Prés de sa femme on le voit filer doux ; / Et de quelque couleur que sa barbe puisse estre, / On a peine à juger qui des deux est le maistre.",
 "chat1": "MORALITÉ. Quelque grand que soit l’avantage / De jouir d’un riche heritage / Venant à nous de pere en fils, / Aux jeunes gens pour l’ordinaire, / L’industrie & le sçavoir faire, / Vallent mieux que des biens acquis.",
 "chat2": "AUTRE MORALITÉ. Si le fils d’un Meûnier tant de vitesse, / Gagne le cœur d’une Princesse / Et s’en fait regarder avec des yeux mourans, / C’est que l’habit, la mine & la jeunesse, / Pour inspirer de la tendresse, / N’en sont pas des moyens toûjours indifferens.",
 "fees1": "MORALITÉ. Les Diamans et les Pistoles / Peuvent beaucoup sur les esprits ; / Cependant les douces paroles / Ont encor plus de force, et sont d’un plus grand prix.",
 "fees2": "AUTRE MORALITÉ. L’onnesteté couste des soins, / Et veut un peu de complaisance, / Mais tost ou tard elle a sa récompense, / Et souvent dans le temps qu’on y pense le moins.",
 "cend1": "MORALITÉ. La beauté, pour le sexe, est un rare tresor ; / De l’admirer jamais on ne se lasse ; / Mais ce qu’on nomme bonne grace / Est sans prix, & vaut mieux encor. / C’est ce qu’à Cendrillon fit avoir sa Maraine, / En la dressant, en l’instruisant, / Tant & si bien qu’elle en fit une Reine : / (Car ainsi sur ce conte on va moralisant.) / Belles, ce don vaut mieux que d’estre bien coëffées, / Pour engager un cœur, pour en venir à bout, / La bonne grace est le vrai don des Fées ; / Sans elle on ne peut rien, avec elle on peut tout.",
 "cend2": "AUTRE MORALITÉ. C’est sans doute un grand avantage / D’avoir de l’esprit, du courage, / De la naissance, du bon sens, / Et d’autres semblables talens / Qu’on reçoit du Ciel en partage ; / Mais vous aurez beau les avoir, / Pour vostre avancement ce seront choses vaines / Si vous n’avez, pour les faire valoir, / Ou des parrains, ou des Maraines.",
 "riq1": "MORALITÉ. Ce que l’on voit dans cet écrit / Est moins un conte en l’air que la verité même ; / Tout est beau dans ce que l’on aime, / Tout ce qu’on aime a de l’esprit.",
 "riq2": "AUTRE MORALITÉ. Dans un objet où la Nature / Aura mis de beaux traits & la vive peinture / D’un teint où jamais l’Art ne sçauroit arriver, / Tous ces dons pourront moins pour rendre un cœur sensible / Qu’un seul agrément invisible / Que l’Amour y fera trouver.",
 "pouc": "MORALITÉ. On ne s’afflige point d’avoir beaucoup d’enfans / Quand ils sont tous beaux, bien-faits & bien grands / Et d’un extérieur qui brille ; / Mais si l’un d’eux est foible ou ne dit mot, / On le méprise, on le raille, on le pille. / Quelquefois, cependant, c’est ce petit marmot / Qui fera le bonheur de toute la famille.",
}
def prose(i): return paras(B[i])
secs = []
i0 = find("On ne trouvera pas étrange")
ded = B[i0].rstrip(); ded = ded[:ded.rindex("Quoi qu’il en soit")].rstrip() + " Quoi qu’il en soit, MADEMOISELLE,"
secs.append({"t": "Épître à Mademoiselle", "p": paras(ded) + ["Pouvois-je mieux choisir pour rendre vrai-semblable / Ce que la Fable a d’incroyable ? / Et jamais Fée, au tems jadis, / Fit-elle à jeune Créature / Plus de dons, & de dons exquis, / Que vous en a fait la Nature ?", "Je suis avec un trés profond respect, de Vôtre Altesse Royale, le trés-humble & trés-obeissant serviteur. P. Darmancour."]})
FIRST = ["Il estoit une fois un Roi & une Reine", "Il estoit une fois une petite fille de Vilage", "Il estoit une fois un homme qui avoit de belles maisons", "Vn Meusnier", "Il estoit une fois une Veuve", "Il estoit une fois un gentil-homme", "Il estoit une fois une Reine qui accoucha d’un fils", "Il estoit une fois un Bucheron"]
POS = [find(f) for f in FIRST] + [find("FIN.")]
def tale(n, title, moral):
    ps = []
    for i in range(POS[n], POS[n + 1]):
        t = B[i]
        ls = t.split("\n")
        if (len(ls) >= 3 and sum(len(x.split()) for x in ls) / len(ls) < 9) or t.startswith(("MORALIT", "AUTRE", "Autre")) or len(t.split()) < 40 and i != POS[n]: continue
        if len(t.split()) < 40: pass
        ps += prose(i)
    return {"t": title, "p": ps + [V[k] for k in moral]}
TT = [("La Belle au bois dormant", ["bela"]), ("Le petit Chaperon rouge", ["chap"]), ("La Barbe bleüe", ["barbe1", "barbe2"]), ("Le Maistre Chat, ou le Chat Botté", ["chat1", "chat2"]), ("Les Fées", ["fees1", "fees2"]), ("Cendrillon, ou la petite Pantoufle de verre", ["cend1", "cend2"]), ("Riquet à la Houppe", ["riq1", "riq2"]), ("Le petit Poucet", ["pouc"])]
for n, (t, m) in enumerate(TT): secs.append(tale(n, t, m))
# Riquet: o bloco final traz a moralidade junto do texto; Les Fées / Cendrillon etc.: nada a fazer
for sec in secs:
    sec["p"] = [x for x in sec["p"] if x]
os.makedirs("livros_txt/perrault", exist_ok=True)
json.dump(secs, open("livros_txt/perrault/orig.json", "w", encoding="utf8"), ensure_ascii=False, indent=0)
for k, c in enumerate(secs, 1): print(k, c["t"], len(c["p"]), sum(len(x.split()) for x in c["p"]))
