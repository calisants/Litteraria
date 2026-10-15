import json, random, re, sys
sys.path.insert(0, '/tmp/claude-0/-home-claude/b7be1e6f-b9fc-5ca5-b42c-c17ff73eaa83/scratchpad')
import conj
from lemminflect import getInflection as infl

PER = 6  # perguntas por página

def rng(*a): return random.Random("|".join(map(str, a)))

def shuf(r, xs):
    xs = list(xs); r.shuffle(xs); return xs

def mcq(r, q, correct, wrong, w, s=None, k=None):
    wrong = [x for x in dict.fromkeys(wrong) if x != correct]
    assert len(wrong) >= 3, (q, correct, wrong)
    opts = shuf(r, [correct] + wrong[:3])
    d = {"q": q, "o": opts, "a": opts.index(correct), "w": w}
    if s: d["s"] = s
    d["k"] = k or correct
    return d

# ---------------------------------------------------------------- conjugação (fr, it via verbecc)
FRP = ["je", "tu", "il", "nous", "vous", "ils"]
ITP = ["io", "tu", "lui", "noi", "voi", "loro"]

def rows(lang, verb, key, pron_list):
    d = conj.get(lang, verb)[key]
    out = {}
    for r in d:
        pr = r['pr'].value
        if pr in pron_list and pr not in out and r.get('g') != 'f':
            out[pr] = clean(r['c'][0])
    assert len(out) == 6, (lang, verb, key, out)
    return out

def clean(full):
    full = full.replace("veduto/visto", "visto")
    return re.sub(r"/\S+", "", full)

def split_pron(full):
    full = clean(full)
    m = re.match(r"^(\w+['’]|\S+\s)(.*)$", full)
    return m.group(1), m.group(2)

def conj_q(r, lang, verb, key, pronlist, pron, label, tensekeys, others_same_person_tenses=False):
    base = rows(lang, verb, key, pronlist)
    full = base[pron]
    p, form = split_pron(full)
    if others_same_person_tenses:
        wrong = []
        for tk in tensekeys:
            if tk == key: continue
            f2 = split_pron(rows(lang, verb, tk, pronlist)[pron])[1]
            if f2 != form: wrong.append(f2)
    else:
        wrong = [split_pron(base[x])[1] for x in pronlist if x != pron]
        wrong = [x for x in wrong if x != form]
    para = " · ".join(base[x] for x in pronlist)
    inf = verb
    q = f"{p.strip() if p.endswith(chr(39)) is False else p}___  ({inf}, {label})"
    q = (p if p.endswith("'") or p.endswith("’") else p.strip() + " ") + "___  (" + inf + ", " + label + ")"
    w = f"{label.capitalize()} de «{inf}»: {para}."
    return mcq(r, q, form, wrong, w, s=full, k=full)

# ---------------------------------------------------------------- inglês (lemminflect + manual)
ENP = ["I", "you", "he", "we", "you (pl.)", "they"]

def en_forms(v):
    return {
        "base": v,
        "s": infl(v, 'VBZ')[0],
        "past": infl(v, 'VBD')[0],
        "pp": infl(v, 'VBN')[0],
        "ing": infl(v, 'VBG')[0],
    }

# ---------------------------------------------------------------- dados handwritten
# artigos
FR_NOUNS = [  # (nome, genero, inicial_vogal_ou_h_mudo, pt)
    ("livre", "m", 0, "livro"), ("table", "f", 0, "mesa"), ("ami", "m", 1, "amigo"), ("école", "f", 1, "escola"),
    ("garçon", "m", 0, "menino"), ("maison", "f", 0, "casa"), ("hôtel", "m", 1, "hotel"), ("chien", "m", 0, "cachorro"),
    ("fille", "f", 0, "menina/filha"), ("eau", "f", 1, "água"), ("homme", "m", 1, "homem"), ("fenêtre", "f", 0, "janela"),
    ("arbre", "m", 1, "árvore"), ("porte", "f", 0, "porta"), ("fleur", "f", 0, "flor"), ("pain", "m", 0, "pão"),
]
IT_DEF = [  # (substantivo, artigo certo, pt)
    ("libro", "il", "livro"), ("studente", "lo", "estudante"), ("zaino", "lo", "mochila"), ("casa", "la", "casa"),
    ("amico", "l'", "amigo"), ("acqua", "l'", "água"), ("amici", "gli", "amigos"), ("studenti", "gli", "estudantes"),
    ("libri", "i", "livros"), ("case", "le", "casas"), ("gatto", "il", "gato"), ("scuola", "la", "escola"),
    ("psicologo", "lo", "psicólogo"), ("università", "l'", "universidade"), ("pane", "il", "pão"), ("spaghetti", "gli", "espaguete"),
    ("ragazze", "le", "meninas"), ("albero", "l'", "árvore"),
]
IT_INDEF = [
    ("libro", "un", "livro"), ("studente", "uno", "estudante"), ("casa", "una", "casa"), ("amica", "un'", "amiga"),
    ("amico", "un", "amigo"), ("zaino", "uno", "mochila"), ("ora", "un'", "hora"), ("psicologo", "uno", "psicólogo"),
    ("scuola", "una", "escola"), ("albero", "un", "árvore"), ("università", "un'", "universidade"), ("specchio", "uno", "espelho"),
]
EN_AN = [("apple", "an"), ("book", "a"), ("hour", "an"), ("university", "a"), ("umbrella", "an"), ("egg", "an"),
         ("European city", "a"), ("honest man", "an"), ("unicorn", "a"), ("hat", "a"), ("orange", "an"), ("one-way ticket", "a")]
EN_THE = [
    ("I like ___ coffee.", "(nada)", "Substantivo incontável em sentido geral não leva artigo."),
    ("Look at ___ sun! It is very bright.", "the", "Só existe um sol: usa-se «the»."),
    ("She plays ___ piano.", "the", "Com instrumentos musicais usa-se «the»."),
    ("He plays ___ football on Sundays.", "(nada)", "Com esportes não se usa artigo."),
    ("I have ___ idea!", "an", "«idea» começa com som de vogal: «an»."),
    ("We live in ___ small house.", "a", "«small» começa com som de consoante: «a»."),
    ("Please close ___ door.", "the", "A porta é conhecida das duas pessoas: «the»."),
    ("___ children need love.", "(nada)", "Plural em sentido geral não leva artigo."),
]

FR_PL = [  # (singular, plural certo, errados, motivo)
    ("un livre", "des livres", ["des livre", "des livrex", "des livs"], "Regra geral: acrescenta-se «-s»."),
    ("une table", "des tables", ["des table", "des tablex", "des tableaux"], "Regra geral: acrescenta-se «-s»."),
    ("un bateau", "des bateaux", ["des bateaus", "des batteaux", "des bateau"], "Palavras em «-eau» fazem plural em «-x»."),
    ("un cadeau", "des cadeaux", ["des cadeaus", "des cadeau", "des cadeaus'"], "Palavras em «-eau» fazem plural em «-x»."),
    ("un jeu", "des jeux", ["des jeus", "des jeu", "des jeuxs"], "Palavras em «-eu» costumam fazer plural em «-x»."),
    ("un château", "des châteaux", ["des châteaus", "des château", "des châteauxs"], "Palavras em «-eau» fazem plural em «-x»."),
    ("un nez", "des nez", ["des nezs", "des nezes", "des nezx"], "Palavras que já terminam em «-s», «-x» ou «-z» não mudam."),
    ("un prix", "des prix", ["des prixs", "des prixes", "des pri"], "Palavras que já terminam em «-s», «-x» ou «-z» não mudam."),
    ("un fils", "des fils", ["des filss", "des fil", "des filx"], "Palavras que já terminam em «-s», «-x» ou «-z» não mudam."),
    ("un cheval", "des chevaux", ["des chevals", "des cheval", "des chevalx"], "Palavras em «-al» fazem plural em «-aux»."),
    ("un journal", "des journaux", ["des journals", "des journal", "des journalx"], "Palavras em «-al» fazem plural em «-aux»."),
    ("un animal", "des animaux", ["des animals", "des animal", "des animalx"], "Palavras em «-al» fazem plural em «-aux»."),
    ("un hôpital", "des hôpitaux", ["des hôpitals", "des hôpital", "des hôpitalx"], "Palavras em «-al» fazem plural em «-aux»."),
    ("un œil", "des yeux", ["des œils", "des œuls", "des œiux"], "Plural irregular: «un œil», «des yeux»."),
    ("un travail", "des travaux", ["des travails", "des travaus", "des travailx"], "Plural irregular: «travail» faz «travaux»."),
    ("un monsieur", "des messieurs", ["des monsieurs", "des mesieurs", "des monsieux"], "Plural irregular: «monsieur» faz «messieurs»."),
]
IT_PL = [
    ("il libro", "i libri", ["i libre", "le libri", "i libro"], "Masculino em «-o» faz plural em «-i»."),
    ("il gatto", "i gatti", ["i gatte", "le gatti", "i gatto"], "Masculino em «-o» faz plural em «-i»."),
    ("la casa", "le case", ["le casi", "i case", "la case"], "Feminino em «-a» faz plural em «-e»."),
    ("la ragazza", "le ragazze", ["le ragazzi", "le ragazzy", "i ragazze"], "Feminino em «-a» faz plural em «-e»."),
    ("il cane", "i cani", ["i cane", "le cani", "i cano"], "Substantivos em «-e» fazem plural em «-i»."),
    ("la notte", "le notti", ["le notte", "i notti", "le notta"], "Substantivos em «-e» fazem plural em «-i»."),
    ("la città", "le città", ["le cittade", "le citti", "le cittè"], "Palavras com acento final não mudam no plural."),
    ("il caffè", "i caffè", ["i caffi", "i caffe", "i caffèi"], "Palavras com acento final não mudam no plural."),
    ("il bar", "i bar", ["i bari", "i bare", "le bar"], "Palavras que terminam em consoante (estrangeirismos) não mudam."),
    ("il film", "i film", ["i filmi", "i filme", "le film"], "Palavras que terminam em consoante (estrangeirismos) não mudam."),
    ("l'amica", "le amiche", ["le amice", "le amichi", "gli amiche"], "Feminino em «-ca» faz plural em «-che» (para manter o som /k/)."),
    ("il medico", "i medici", ["i medichi", "i medico", "gli medici"], "Muitos masculinos em «-co» fazem plural em «-ci»."),
    ("il gioco", "i giochi", ["i gioci", "i gioco", "gli giochi"], "Aqui o plural mantém o som duro: «-chi»."),
    ("il parco", "i parchi", ["i parci", "i parco", "gli parchi"], "Aqui o plural mantém o som duro: «-chi»."),
    ("il lago", "i laghi", ["i lagi", "i lago", "gli laghi"], "Masculino em «-go» faz plural em «-ghi» (mantém o som duro)."),
    ("l'arancia", "le arance", ["le arancie", "le arancia", "gli arance"], "Em «-cia» depois de consoante, o plural perde o «i»: «arance»."),
    ("la camicia", "le camicie", ["le camice", "le camicia", "gli camicie"], "Em «-cia» depois de vogal, o plural mantém o «i»: «camicie»."),
    ("la valigia", "le valigie", ["le valigi", "le valigia", "gli valigie"], "Em «-gia» depois de vogal, o plural costuma manter o «i»: «valigie» (o Wiktionary também registra «valige»)."),
]
EN_PL = ["box", "bus", "city", "day", "church", "dish", "baby", "boy", "man", "woman", "child", "foot", "tooth", "mouse", "person", "sheep", "book", "class"]
EN_PL_WHY = {
    "box": "Termina em «-x»: acrescenta «-es».", "bus": "Termina em «-s»: acrescenta «-es».",
    "city": "Consoante + «y»: troca por «-ies».", "day": "Vogal + «y»: só acrescenta «-s».",
    "church": "Termina em «-ch»: acrescenta «-es».", "dish": "Termina em «-sh»: acrescenta «-es».",
    "baby": "Consoante + «y»: troca por «-ies».", "boy": "Vogal + «y»: só acrescenta «-s».",
    "man": "Plural irregular: man → men.", "woman": "Plural irregular: woman → women.",
    "child": "Plural irregular: child → children.", "foot": "Plural irregular: foot → feet.",
    "tooth": "Plural irregular: tooth → teeth.", "mouse": "Plural irregular: mouse → mice.",
    "person": "Plural mais comum: person → people.", "sheep": "Não muda: sheep → sheep.",
    "book": "Regra geral: acrescenta «-s».", "class": "Termina em «-s»: acrescenta «-es».",
}

# negação / perguntas (certa primeiro, depois erradas)
FR_NEG = [
    ("Eu não falo inglês.", "Je ne parle pas anglais.", ["Je parle ne pas anglais.", "Je ne pas parle anglais.", "Je pas parle ne anglais."], "A negação envolve o verbo: «ne» antes e «pas» depois."),
    ("Ele não tem carro.", "Il n'a pas de voiture.", ["Il ne a pas de voiture.", "Il pas a de voiture.", "Il n'a de pas voiture."], "«ne» vira «n'» diante de vogal; e depois de «pas» usa-se «de»."),
    ("Nós não comemos carne.", "Nous ne mangeons pas de viande.", ["Nous ne mangeons pas de la viande.", "Nous mangeons ne pas de viande.", "Nous ne pas mangeons de viande."], "«ne … pas» envolve o verbo; depois de «pas», «de» no lugar de «du/de la»."),
    ("Ela não vai ao cinema.", "Elle ne va pas au cinéma.", ["Elle va ne pas au cinéma.", "Elle ne pas va au cinéma.", "Elle ne va au cinéma pas."], "«ne» vem antes do verbo e «pas» logo depois."),
    ("Você fala francês? (pergunta correta)", "Parlez-vous français ?", ["Parlez vous-français ?", "Vous parlez-français ?", "Parlez-français vous ?"], "Na inversão, o verbo vem antes do pronome, ligados por hífen."),
    ("Onde você mora? (pergunta correta)", "Où habitez-vous ?", ["Où vous habitez-?", "Habitez où-vous ?", "Où-habitez vous ?"], "Palavra interrogativa + verbo + pronome (com hífen)."),
    ("Eu nunca como peixe.", "Je ne mange jamais de poisson.", ["Je ne mange pas jamais de poisson.", "Je mange ne jamais de poisson.", "Je ne jamais mange de poisson."], "«ne … jamais» envolve o verbo, como «ne … pas»."),
    ("Que horas são? (pergunta correta)", "Quelle heure est-il ?", ["Quelle heure il est-?", "Quelle est-il heure ?", "Heure quelle est-il ?"], "Expressão fixa: «Quelle heure est-il ?»."),
    ("Você tem irmãos? (pergunta com «est-ce que»)", "Est-ce que tu as des frères ou des sœurs ?", ["Est-ce que as tu des frères ?", "Est-ce tu que as des frères ?", "Que est-ce tu as des frères ?"], "«Est-ce que» vem no início e a frase segue na ordem normal."),
    ("Eles não são brasileiros.", "Ils ne sont pas brésiliens.", ["Ils sont ne pas brésiliens.", "Ils ne pas sont brésiliens.", "Ils ne sont brésiliens pas."], "«ne» antes do verbo e «pas» logo depois."),
    ("Não fale!", "Ne parle pas !", ["Parle ne pas !", "Ne pas parle !", "Pas ne parle !"], "No imperativo negativo também se usa «ne … pas» ao redor do verbo."),
    ("Por que você chora? (pergunta correta)", "Pourquoi pleures-tu ?", ["Pourquoi tu-pleures ?", "Pleures pourquoi-tu ?", "Pourquoi-pleures tu ?"], "Palavra interrogativa + verbo + pronome (com hífen)."),
]
IT_NEG = [
    ("Eu não falo inglês.", "Non parlo inglese.", ["Parlo non inglese.", "Non io parlo inglese.", "Parlo inglese non."], "Em italiano basta colocar «non» antes do verbo."),
    ("Ele não tem carro.", "Non ha la macchina.", ["Ha non la macchina.", "Non la macchina ha.", "Ha la macchina non."], "«Non» vem sempre imediatamente antes do verbo."),
    ("Não vejo ninguém.", "Non vedo nessuno.", ["Vedo nessuno.", "Non vedo qualcuno nessuno.", "Vedo non nessuno."], "Com «nessuno» depois do verbo, também é preciso «non» antes (dupla negação normal em italiano)."),
    ("Nós não comemos carne.", "Non mangiamo carne.", ["Mangiamo non carne.", "Noi mangiamo carne non.", "Non carne mangiamo."], "Basta «non» antes do verbo."),
    ("Você fala italiano? (pergunta)", "Parli italiano?", ["Parli tu italiano è?", "Fai parli italiano?", "Italiano parli è?"], "A pergunta sim/não usa a mesma frase, com entonação de pergunta."),
    ("Onde você mora?", "Dove abiti?", ["Abiti dove tu è?", "Dove tu abiti è?", "Tu dove abiti è?"], "Palavra interrogativa no início e verbo conjugado."),
    ("Eu nunca como peixe.", "Non mangio mai pesce.", ["Mangio non mai pesce.", "Non mai mangio pesce.", "Mangio mai non pesce."], "«Non … mai» (nunca): «non» antes do verbo, «mai» depois."),
    ("Eu nunca vi esse filme.", "Non ho mai visto quel film.", ["Ho non mai visto quel film.", "Non mai ho visto quel film.", "Mai ho non visto quel film."], "«Non … mai»: nos tempos compostos, «mai» fica entre o auxiliar e o particípio (non ho mai visto)."),
    ("Eu não moro mais em Bolonha.", "Non abito più a Bologna.", ["Non abito ancora a Bologna.", "Non abito mai a Bologna.", "Abito non più a Bologna."], "«Non … più» significa «não … mais» («ancora» seria «ainda não»; «mai», «nunca»)."),
    ("Ela não vai ao cinema.", "Non va al cinema.", ["Va non al cinema.", "Non al cinema va.", "Va al cinema non."], "«Non» antes do verbo."),
    ("Por que você chora?", "Perché piangi?", ["Perché tu piangi è?", "Piangi perché tu è?", "Tu perché piangi è?"], "Palavra interrogativa no início."),
    ("Eu não tenho nada.", "Non ho niente.", ["Ho non niente.", "Non niente ho.", "Ho niente non."], "«Non … niente»: dupla negação normal em italiano."),
]
EN_NEG = [
    ("Eu não gosto de café.", "I don't like coffee.", ["I no like coffee.", "I not like coffee.", "I doesn't like coffee."], "Presente: sujeito + don't/doesn't + verbo base."),
    ("Ela não gosta de café.", "She doesn't like coffee.", ["She don't like coffee.", "She doesn't likes coffee.", "She no likes coffee."], "Com he/she/it usa-se «doesn't» e o verbo fica na forma base."),
    ("Você fala inglês? (pergunta)", "Do you speak English?", ["Does you speak English?", "You do speak English?", "Are you speak English?"], "Pergunta no presente: Do/Does + sujeito + verbo base."),
    ("Ele trabalha aqui? (pergunta)", "Does he work here?", ["Do he work here?", "Does he works here?", "Is he work here?"], "Com he/she/it: «Does» e o verbo base (sem -s)."),
    ("Onde você mora?", "Where do you live?", ["Where you do live?", "Where does you live?", "Where you live do?"], "Palavra interrogativa + do/does + sujeito + verbo base."),
    ("Nós não temos tempo.", "We don't have time.", ["We no have time.", "We doesn't have time.", "We not have time."], "Sujeito + don't + verbo base."),
    ("Eles não são brasileiros.", "They aren't Brazilian.", ["They don't Brazilian.", "They no are Brazilian.", "They doesn't be Brazilian."], "Com o verbo «be» não se usa «do»: usa-se «aren't/isn't/am not»."),
    ("Ela está cansada? (pergunta)", "Is she tired?", ["Does she tired?", "Is she is tired?", "She is tired is?"], "Com o verbo «be», inverte-se: Is + sujeito."),
    ("Que horas são?", "What time is it?", ["What is time it?", "What time it is?", "What time does it?"], "Expressão fixa: «What time is it?»."),
    ("Eu não falo francês.", "I don't speak French.", ["I speak not French.", "I no speak French.", "I don't speaks French."], "don't + verbo base."),
    ("Por que você chora?", "Why are you crying?", ["Why you are crying?", "Why do you crying?", "Why are you cry?"], "Why + be + sujeito + verbo-ing (tempo contínuo)."),
    ("Ele não gosta de música.", "He doesn't like music.", ["He don't like music.", "He doesn't likes music.", "He no like music."], "Com he/she/it: doesn't + verbo base."),
]

# preposições
FR_PREP_PLACES = [
    ("Je vais ___ Paris.", "à", "Antes de cidade usa-se «à»."), ("Elle habite ___ Lyon.", "à", "Antes de cidade usa-se «à»."),
    ("Nous allons ___ France.", "en", "País feminino (la France): «en»."), ("Ils vivent ___ Italie.", "en", "País feminino (l'Italie): «en»."),
    ("Il travaille ___ Brésil.", "au", "País masculino (le Brésil): «au»."), ("Elle étudie ___ Portugal.", "au", "País masculino (le Portugal): «au»."),
    ("Nous habitons ___ États-Unis.", "aux", "País no plural (les États-Unis): «aux»."), ("Je voyage ___ Japon.", "au", "País masculino (le Japon): «au»."),
    ("Tu vas ___ Espagne ?", "en", "País feminino (l'Espagne): «en»."), ("Elle va ___ Rome.", "à", "Antes de cidade usa-se «à»."),
    ("Je vais ___ le médecin.", "chez", "«Chez» + pessoa: na casa/consultório de alguém."), ("Il est ___ sa sœur.", "chez", "«Chez» + pessoa: na casa de alguém."),
]
FR_PREP_OPT = ["à", "en", "au", "aux", "chez", "de", "dans"]
IT_PREP = [
    ("Vado ___ Roma.", "a", "Antes de cidade usa-se «a»."), ("Abito ___ Italia.", "in", "Antes de país usa-se «in»."),
    ("Vengo ___ Milano.", "da", "Origem (de onde vem): «da»."), ("Viviamo ___ Spagna.", "in", "Antes de país usa-se «in»."),
    ("Ieri siamo stati ___ pranzo al ristorante.", "a", "Antes de refeições usa-se «a»: a pranzo, a cena."), ("Vado ___ scuola.", "a", "Expressão fixa: «a scuola»."),
    ("Vai ___ cucina e accendi il forno.", "in", "Cômodos da casa pedem «in»: in cucina, in camera, in giardino."), ("Vado ___ treno.", "in", "Meio de transporte: «in treno»."),
    ("Andiamo ___ macchina.", "in", "Meio de transporte: «in macchina»."), ("Vado ___ piedi.", "a", "Expressão fixa: «a piedi» (a pé)."),
    ("Vengo ___ Parigi.", "da", "Origem (de onde vem): «da»."), ("Vivo ___ Francia.", "in", "Antes de país usa-se «in»."),
]
IT_PREP_OPT = ["a", "in", "da", "di", "su", "con"]
EN_PREP = [
    ("I wake up ___ 7 o'clock.", "at", "Horas exatas: «at»."), ("We have class ___ Monday.", "on", "Dias da semana: «on»."),
    ("My birthday is ___ July.", "in", "Meses: «in»."), ("She was born ___ 2001.", "in", "Anos: «in»."),
    ("I sleep ___ night.", "at", "Expressão fixa: «at night»."), ("The book is ___ the table.", "on", "Sobre uma superfície: «on»."),
    ("He lives ___ Brazil.", "in", "Países e cidades: «in»."), ("Wait for me ___ the bus stop.", "at", "Ponto específico: «at»."),
    ("I'm ___ home.", "at", "Expressão fixa: «at home»."), ("We eat ___ the kitchen.", "in", "Dentro de um espaço: «in»."),
    ("I work ___ the morning.", "in", "Partes do dia (manhã, tarde, noite como período): «in the morning/afternoon/evening»."), ("We meet ___ my birthday.", "on", "Dias específicos (datas, aniversário): «on»."),
]
EN_PREP_OPT = ["in", "on", "at", "to"]

# classes de palavras: (frase, classe pedida, resposta, 3 outras opções)
CLS_LABEL = {"v": "VERBO", "s": "SUBSTANTIVO", "adj": "ADJETIVO", "adv": "ADVÉRBIO", "p": "PREPOSIÇÃO", "art": "ARTIGO"}
CLS_ART = {"v": "o", "s": "o", "adj": "o", "adv": "o", "p": "a", "art": "o"}
CLS_UM = {"v": "um", "s": "um", "adj": "um", "adv": "um", "p": "uma", "art": "um"}
FR_CLS = [
    ("Le petit chat dort sur le canapé.", "adj", "petit", ["Le", "chat", "sur"]),
    ("Marie mange une pomme rouge.", "v", "mange", ["Marie", "pomme", "rouge"]),
    ("Nous habitons dans une grande maison.", "p", "dans", ["Nous", "habitons", "grande"]),
    ("Elle chante souvent des chansons.", "adv", "souvent", ["Elle", "chante", "chansons"]),
    ("Les enfants jouent dans le jardin.", "s", "enfants", ["Les", "jouent", "dans"]),
    ("Elle lit un livre intéressant.", "art", "un", ["Elle", "lit", "livre"]),
    ("Mon frère aime les films drôles.", "adj", "drôles", ["frère", "aime", "films"]),
    ("Les élèves écoutent le professeur.", "v", "écoutent", ["Les", "élèves", "le"]),
    ("Je vais à l'école avec mes amis.", "p", "avec", ["Je", "vais", "amis"]),
    ("Les élèves parlent lentement.", "adv", "lentement", ["Les", "élèves", "parlent"]),
    ("Le soleil brille aujourd'hui.", "s", "soleil", ["Le", "brille", "aujourd'hui"]),
    ("Nous achetons une voiture neuve.", "art", "une", ["Nous", "achetons", "neuve"]),
]
IT_CLS = [
    ("Il gatto nero dorme sul divano.", "adj", "nero", ["Il", "gatto", "dorme"]),
    ("Maria mangia una mela rossa.", "v", "mangia", ["Maria", "mela", "rossa"]),
    ("Abitiamo in una casa grande.", "p", "in", ["Abitiamo", "casa", "grande"]),
    ("Lei canta spesso canzoni italiane.", "adv", "spesso", ["Lei", "canta", "canzoni"]),
    ("I bambini giocano nel giardino.", "s", "bambini", ["I", "giocano", "nel"]),
    ("Leggo un libro interessante.", "art", "un", ["Leggo", "libro", "interessante"]),
    ("Mio fratello guarda film divertenti.", "adj", "divertenti", ["fratello", "guarda", "film"]),
    ("Gli studenti ascoltano il professore.", "v", "ascoltano", ["Gli", "studenti", "il"]),
    ("Vado a scuola con i miei amici.", "p", "con", ["Vado", "scuola", "amici"]),
    ("I ragazzi parlano lentamente.", "adv", "lentamente", ["I", "ragazzi", "parlano"]),
    ("Il sole splende oggi.", "s", "sole", ["Il", "splende", "oggi"]),
    ("Compriamo una macchina nuova.", "art", "una", ["Compriamo", "macchina", "nuova"]),
]
EN_CLS = [
    ("The small cat sleeps on the sofa.", "adj", "small", ["The", "cat", "sleeps"]),
    ("Mary eats a red apple.", "v", "eats", ["Mary", "red", "apple"]),
    ("We live in a big house.", "p", "in", ["We", "live", "big"]),
    ("She often sings English songs.", "adv", "often", ["She", "sings", "songs"]),
    ("The children play in the garden.", "s", "children", ["The", "play", "in"]),
    ("He reads an interesting book.", "art", "an", ["He", "reads", "book"]),
    ("My brother likes funny movies.", "adj", "funny", ["brother", "likes", "movies"]),
    ("The students listen to the teacher.", "v", "listen", ["The", "students", "to"]),
    ("I go to school with my friends.", "p", "with", ["I", "go", "friends"]),
    ("The students speak slowly.", "adv", "slowly", ["The", "students", "speak"]),
    ("The sun shines today.", "s", "sun", ["The", "shines", "today"]),
    ("We buy a new car.", "art", "a", ["We", "buy", "new"]),
]
CLS_HELP = {
    "v": "O verbo indica ação ou estado e muda com a pessoa e o tempo.",
    "s": "O substantivo dá nome a pessoas, animais, coisas e ideias.",
    "adj": "O adjetivo descreve ou qualifica um substantivo.",
    "adv": "O advérbio modifica o verbo (como, quando, quanto).",
    "p": "A preposição liga palavras e indica relação (lugar, companhia, direção).",
    "art": "O artigo acompanha o substantivo e indica se ele é conhecido ou não.",
}

# falsos amigos
FR_FA = [
    ("chair", "carne", "cadeira", "«Cadeira» em francês é «chaise»."),
    ("librairie", "livraria", "biblioteca", "«Biblioteca» em francês é «bibliothèque»."),
    ("attendre", "esperar", "atender", "«Atender» é «répondre» ou «servir»."),
    ("rester", "ficar", "restar", "«Restar» (sobrar) é «rester» em alguns usos, mas o sentido principal é ficar."),
    ("cave", "porão / adega", "caverna", "«Caverna» é «caverne» ou «grotte»."),
    ("regarder", "olhar", "regar", "«Regar» é «arroser»."),
    ("sale", "sujo", "sala", "«Sala» é «salle»."),
    ("tasse", "xícara", "taça", "«Taça» é «coupe»."),
    ("location", "aluguel", "localização", "«Localização» é «localisation» ou «emplacement»."),
    ("exprès", "de propósito", "expresso", "«Expresso» (rápido) é «express»; o café é «un café» ou «un expresso»."),
    ("lunettes", "óculos", "lunetas", "«Luneta» (telescópio) é «lunette» no singular; «lunettes» no plural são os óculos."),
    ("journée", "dia (de manhã à noite)", "jornada", "«Jornada» (de viagem) é «voyage» ou «trajet»; em «journée» o foco é o dia inteiro."),
]
IT_FA = [
    ("burro", "manteiga", "burro (animal)", "O animal é «asino» (ou «somaro»)."),
    ("camera", "quarto", "câmera fotográfica", "A máquina fotográfica é «macchina fotografica»."),
    ("salire", "subir", "sair", "«Sair» é «uscire»."),
    ("squisito", "delicioso", "esquisito (estranho)", "«Esquisito» (estranho) é «strano»."),
    ("parenti", "parentes", "pais", "«Pais» é «genitori»."),
    ("cantina", "adega / porão", "cantina (refeitório)", "O refeitório de escola ou empresa é «mensa»."),
    ("caldo", "quente", "caldo (de sopa)", "Caldo de sopa é «brodo»."),
    ("morbido", "macio", "mórbido (doentio)", "«Mórbido» é «morboso»."),
    ("bravo", "habilidoso, bom em algo", "bravo (zangado)", "Zangado é «arrabbiato»."),
    ("vacanza", "férias", "vacância", "Vacância (cargo vago) é «posto vacante»."),
    ("stufo", "farto, cheio", "estufa", "Estufa (de plantas) é «serra»."),
    ("firma", "assinatura", "firma (empresa)", "Empresa é «ditta» ou «azienda»."),
]
EN_FA = [
    ("library", "biblioteca", "livraria", "Livraria em inglês é «bookstore»."),
    ("pretend", "fingir", "pretender", "Pretender é «intend»."),
    ("actually", "na verdade", "atualmente", "Atualmente é «nowadays»."),
    ("costume", "fantasia", "costume (hábito)", "Costume (hábito) é «habit»."),
    ("argue", "discutir", "arguir", "«Argue» significa «discutir», não «arguir»."),
    ("college", "faculdade", "colégio (escola)", "Colégio é «school»."),
    ("exit", "saída", "êxito", "Êxito é «success»."),
    ("attend", "assistir, participar", "atender", "Atender é «answer»."),
    ("realize", "notar, perceber", "realizar", "Realizar é «carry out» ou «put into practice»."),
    ("eventually", "finalmente, por fim", "eventualmente", "Eventualmente é «possibly»."),
    ("resume", "retomar", "resumo", "Resumo é «summary»."),
    ("mayor", "prefeito", "maior", "Maior é «bigger»."),
]

def fa_items(lang, data, page):
    r = rng("fa", lang, page)
    chunk = data[page * PER:(page + 1) * PER]
    pool = [d[1] for d in data]
    lang_name = {"fr": "francês", "it": "italiano", "en": "inglês"}[lang]
    out = []
    for w_, ok, trap, why in chunk:
        wrong = [trap] + [x for x in shuf(r, pool) if x != ok]
        out.append(mcq(r, f"O que significa «{w_}» em {lang_name}?", ok, wrong, f"{why} (A palavra parece «{trap}», mas não é.)", s=w_, k=w_))
    return out

def cls_items(lang, data, page):
    r = rng("cls", lang, page)
    out = []
    for sent, c, ans, others in data[page * PER:(page + 1) * PER]:
        opts = shuf(r, [ans] + others)
        out.append({"q": f"{sent}\nQual palavra é {CLS_ART[c]} {CLS_LABEL[c]}?", "o": opts, "a": opts.index(ans),
                    "w": f"«{ans}» é {CLS_UM[c]} {CLS_LABEL[c].lower()}. " + CLS_HELP[c],
                    "s": sent, "k": ans})
    return out

def neg_items(lang, data, page):
    r = rng("neg", lang, page)
    return [mcq(r, f"Como dizer: {pt}", ok, wr, w, s=ok, k=ok) for pt, ok, wr, w in data[page * PER:(page + 1) * PER]]

def prep_items(lang, data, optpool, page):
    r = rng("prep", lang, page)
    out = []
    for q, ok, w in data[page * PER:(page + 1) * PER]:
        wrong = shuf(r, [x for x in optpool if x != ok])
        out.append(mcq(r, q, ok, wrong, w, s=q.replace("___", ok), k=q.replace("___", ok)))
    return out

# ---------------------------------------------------------------- páginas por tipo e idioma
def gen_artigos(lang, page):
    r = rng("art", lang, page)
    out = []
    if lang == "fr":
        pool = FR_NOUNS
        sel = pool[0:PER] if page == 0 else pool[8:8 + PER]
        for n, g, vow, pt in sel:
            if page == 0:
                ok = "l'" if vow else ("le" if g == "m" else "la")
                q = f"___ {n}   ({pt})"
                if n == "héros": pass
                wrong = [x for x in ["le", "la", "l'", "les"] if x != ok]
                w = f"«{n}» é {'masculino' if g=='m' else 'feminino'}" + (" e começa com som de vogal (ou h mudo): usa-se «l'»." if vow else f": «{ok}».")
                out.append(mcq(r, q, ok, wrong, w, s=(ok + (" " if ok != "l'" else "")) + n))
            else:
                ok = "un" if g == "m" else "une"
                q = f"___ {n}   ({pt})"
                wrong = [x for x in ["un", "une", "le", "la"] if x != ok]
                out.append(mcq(r, q, ok, wrong, f"«{n}» é {'masculino' if g=='m' else 'feminino'}: «{ok}» (artigo indefinido).", s=ok + " " + n))
    elif lang == "it":
        data = IT_DEF if page == 0 else IT_INDEF
        sel = data[:PER] if page == 0 else data[:PER]
        if page == 0: sel = [IT_DEF[i] for i in (0, 1, 4, 6, 9, 12)]
        else: sel = [IT_INDEF[i] for i in (2, 3, 5, 6, 8, 11)]
        opts_def = ["il", "lo", "la", "l'", "i", "gli", "le"]
        opts_ind = ["un", "uno", "una", "un'"]
        for n, ok, pt in sel:
            pool = opts_def if page == 0 else opts_ind
            wrong = [x for x in pool if x != ok]
            wrong = shuf(r, wrong)
            q = f"___{'' if ok.endswith(chr(39)) else ' '}{n}   ({pt})".replace("___ ", "___ ")
            q = f"___ {n}   ({pt})"
            if page == 0:
                if ok == "lo": w = "«lo» (singular masculino) aparece antes de z, s + consoante, gn, ps, x: «lo " + n + "»."
                elif ok == "gli": w = "«gli» (plural masculino) aparece antes de vogal, z, s + consoante, gn, ps, x: «gli " + n + "»."
                elif ok == "l'": w = "Antes de vogal, o artigo singular se reduz a «l'»: «l'" + n + "»."
                elif ok == "il": w = "Masculino singular antes de consoante comum: «il»."
                elif ok == "i": w = "Plural de «il»: «i»."
                elif ok == "la": w = "Feminino singular antes de consoante: «la»."
                else: w = "Feminino plural: «le»."
            else:
                if ok == "uno": w = "«uno» aparece antes de masculino que começa com z, s + consoante, gn, ps, x: «uno " + n + "»."
                elif ok == "un'": w = "Feminino que começa com vogal: «un'» (com apóstrofo)."
                elif ok == "un": w = "Masculino antes de vogal ou consoante comum: «un» (sem apóstrofo)."
                else: w = "Feminino antes de consoante: «una»."
            out.append(mcq(r, q, ok, wrong, w, s=(ok + n if ok.endswith("'") else ok + " " + n)))
    else:
        if page == 0:
            for n, ok in EN_AN[:PER]:
                q = f"___ {n}"
                out.append(mcq(r, q, ok, [x for x in ["a", "an", "the", "(nada)"] if x != ok], f"O que conta é o SOM inicial: «{n.split()[0]}» começa com som de {'vogal' if ok=='an' else 'consoante'}, então «{ok}».", s=ok + " " + n))
        else:
            for q, ok, w in EN_THE[:PER]:
                out.append(mcq(r, q, ok, [x for x in ["a", "an", "the", "(nada)"] if x != ok], w, s=q.replace("___", "" if ok == "(nada)" else ok)))
    return out

def gen_plural(lang, page):
    r = rng("pl", lang, page)
    out = []
    if lang == "fr":
        for sg, ok, wr, w in FR_PL[page * 8:page * 8 + 8][:PER] if False else [FR_PL[i] for i in (0, 2, 4, 6, 9, 13)] if page == 0 else [FR_PL[i] for i in (1, 5, 8, 11, 14, 15)]:
            out.append(mcq(r, f"{sg}  →  ___", ok, wr, w, s=ok))
    elif lang == "it":
        for sg, ok, wr, w in [IT_PL[i] for i in (0, 2, 4, 6, 10, 11)] if page == 0 else [IT_PL[i] for i in (13, 14, 15, 16, 17, 8)]:
            out.append(mcq(r, f"{sg}  →  ___", ok, wr, w, s=ok))
    else:
        words = [EN_PL[i] for i in (0, 2, 3, 4, 6, 8)] if page == 0 else [EN_PL[i] for i in (10, 11, 13, 14, 15, 9)]
        for wd in words:
            ok = infl(wd, 'NNS')[0] if wd not in ("person", "sheep") else ("people" if wd == "person" else "sheep")
            wrong = [wd + "s", wd + "es", wd + "ies", wd, "peoples" if wd == "person" else (wd[:-1] + "ies" if wd.endswith("y") else wd + "en")]
            wrong = [x for x in wrong if x != ok and x != "persons"]
            out.append(mcq(r, f"one {wd}  →  two ___", ok, wrong, EN_PL_WHY[wd], s=ok))
    return out

PRES = {
    "fr": [["être", "avoir", "aller", "faire", "parler", "finir"], ["prendre", "venir", "vouloir", "pouvoir", "savoir", "dire"], ["voir", "manger", "aimer", "choisir", "lire", "partir"]],
    "it": [["essere", "avere", "andare", "fare", "parlare", "finire"], ["prendere", "venire", "volere", "potere", "sapere", "dire"], ["vedere", "mangiare", "amare", "dormire", "leggere", "partire"]],
}
PAST = {"fr": [("indicatif", "passé-composé", "passé composé"), ("indicatif", "imparfait", "imparfait")],
        "it": [("indicativo", "passato-prossimo", "passato prossimo"), ("indicativo", "imperfetto", "imperfetto")]}

def gen_presente(lang, page):
    r = rng("pres", lang, page)
    out = []
    if lang == "en":
        plans = [
            [("be", "I", "am"), ("be", "he", "is"), ("be", "we", "are"), ("have", "I", "have"), ("have", "she", "has"), ("have", "they", "have")],
            [("go", "he", "goes"), ("watch", "she", "watches"), ("study", "he", "studies"), ("play", "it", "plays"), ("wash", "she", "washes"), ("fly", "it", "flies")],
            [("work", "they", "work"), ("like", "we", "like"), ("eat", "he", "eats"), ("live", "you", "live"), ("speak", "she", "speaks"), ("read", "they", "read")],
        ]
        for v, pr, ok in plans[page]:
            f = en_forms(v) if v not in ("be", "have") else None
            if v == "be": pool = ["am", "is", "are", "be", "been"]
            elif v == "have": pool = ["have", "has", "haves", "having", "had"]
            else: pool = [f["base"], f["s"], f["base"] + "es", f["base"] + "s", f["ing"]]
            if v in ("go", "watch", "wash"): pool.append(f["base"] + "s")
            wrong = [x for x in dict.fromkeys(pool) if x != ok]
            if v in ("be", "have") or True:
                if len(wrong) < 3: wrong += ["do", "does", "did"]
            if v == "study": wrong = ["studys", "study", "studyes", "studying"]
            if v == "fly": wrong = ["flys", "fly", "flyes", "flying"]
            if v == "play": wrong = ["plaies", "playes", "play", "playing"]
            rule = {"be": "«to be»: I am, you are, he/she/it is, we are, you are, they are.", "have": "«to have»: I/you/we/they have; he/she/it has."}.get(v, "Com he/she/it, o verbo ganha «-s» (ou «-es» depois de -ch, -sh, -s, -x, -o; «-ies» depois de consoante + y).")
            out.append(mcq(r, f"{pr} ___  ({v})", ok, wrong, rule, s=f"{pr} {ok}", k=f"{pr} {ok}"))
        return out
    pron = FRP if lang == "fr" else ITP
    for i, v in enumerate(PRES[lang][page]):
        pr = pron[(i * 5 + page * 2) % 6]
        key = ("indicatif", "présent") if lang == "fr" else ("indicativo", "presente")
        out.append(conj_q(r, lang, v, key, pron, pr, "presente", [key]))
    return out

def gen_passado(lang, page):
    r = rng("past", lang, page)
    out = []
    if lang == "en":
        if page == 0:
            for v, pr in [("go", "I"), ("eat", "she"), ("have", "we"), ("see", "they"), ("work", "he"), ("study", "I")]:
                f = en_forms(v)
                ok = f["past"]
                wrong = [f["base"], f["s"], f["pp"], f["ing"]]
                wrong = [x for x in dict.fromkeys(wrong) if x != ok]
                if len(wrong) < 3: wrong += [f["base"] + "ed", f["base"] + "d"]
                rule = "Passado simples (ontem, semana passada): verbos regulares ganham «-ed»; os irregulares precisam ser decorados (go → went, eat → ate, have → had, see → saw)."
                out.append(mcq(r, f"Yesterday, {pr} ___  ({v})", ok, wrong, rule + f" Formas de «{v}»: {f['base']} / {f['past']} / {f['pp']}.", s=f"Yesterday, {pr} {ok}", k=f"{v}: {ok}"))
        else:
            for v, pr, aux in [("go", "I", "have"), ("eat", "she", "has"), ("see", "we", "have"), ("do", "he", "has"), ("write", "they", "have"), ("be", "you", "have")]:
                f = en_forms(v)
                ok = f["pp"]
                wrong = [f["base"], f["past"], f["ing"], f["s"]]
                wrong = [x for x in dict.fromkeys(wrong) if x != ok]
                out.append(mcq(r, f"{pr} {aux} ___  ({v})", ok, wrong, f"Present perfect = have/has + particípio passado. Formas de «{v}»: {f['base']} / {f['past']} / {f['pp']}.", s=f"{pr} {aux} {ok}", k=f"{v}: {ok}"))
        return out
    pron = FRP if lang == "fr" else ITP
    tk, label = (PAST[lang][page][:2], PAST[lang][page][2])
    key = (tk[0], tk[1])
    others = [("indicatif", "présent"), ("indicatif", "imparfait"), ("indicatif", "futur-simple"), ("indicatif", "passé-composé")] if lang == "fr" else [("indicativo", "presente"), ("indicativo", "imperfetto"), ("indicativo", "futuro"), ("indicativo", "passato-prossimo")]
    verbs = (["aller", "faire", "parler", "finir", "prendre", "voir"] if lang == "fr" else ["andare", "fare", "parlare", "finire", "prendere", "vedere"])
    if page == 1: verbs = verbs[::-1]
    for i, v in enumerate(verbs):
        pr = pron[(i * 5 + 1 + page) % 6]
        out.append(conj_q(r, lang, v, key, pron, pr, label, others, others_same_person_tenses=True))
    return out

TYPES_G = [
    ("artigos", "Artigos e gênero", "Artigos", 2, gen_artigos),
    ("plural", "Plural dos substantivos", "Plural", 2, gen_plural),
    ("presente", "Verbos no presente", "Presente", 3, gen_presente),
    ("passado", "Passado básico", "Passado", 2, gen_passado),
    ("negacao", "Negação e perguntas", "Negação", 2, None),
    ("prep", "Preposições", "Preposições", 2, None),
    ("classes", "Classes de palavras", "Classes", 2, None),
    ("falsos", "Falsos amigos (semântica)", "Falsos amigos", 2, None),
]

def build():
    G = {}
    for lang in ("fr", "it", "en"):
        G[lang] = {}
        for tid, long_, short, npg, fn in TYPES_G:
            pages = []
            for p in range(npg):
                if tid == "negacao": items = neg_items(lang, {"fr": FR_NEG, "it": IT_NEG, "en": EN_NEG}[lang], p)
                elif tid == "prep":
                    items = prep_items(lang, {"fr": FR_PREP_PLACES, "it": IT_PREP, "en": EN_PREP}[lang], {"fr": FR_PREP_OPT, "it": IT_PREP_OPT, "en": EN_PREP_OPT}[lang], p)
                elif tid == "classes": items = cls_items(lang, {"fr": FR_CLS, "it": IT_CLS, "en": EN_CLS}[lang], p)
                elif tid == "falsos": items = fa_items(lang, {"fr": FR_FA, "it": IT_FA, "en": EN_FA}[lang], p)
                else: items = fn(lang, p)
                assert len(items) == PER, (lang, tid, p, len(items))
                pages.append(items)
            G[lang][tid] = pages
    return G

if __name__ == "__main__":
    G = build()
    json.dump(G, open("gram_items.json", "w", encoding="utf8"), ensure_ascii=False, indent=0)
    n = sum(len(p) for l in G.values() for t in l.values() for p in t)
    print("itens", n)
