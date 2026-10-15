"""Temas novos da gramática (volume 3): futuro, condicional, subjuntivo, possessivos,
conjunções, advérbios, reflexivos, ordem da frase.
Formas verbais de francês e italiano vêm do verbecc; o restante é escrito à mão a partir
dos capítulos do Tex's French Grammar, dos Wikibooks de italiano e do Cambridge Grammar of English."""
import json, re, sys
import gram_gen as G
from gram_gen import rng, shuf, mcq, clean, PER
import conj

FRP = ["je", "tu", "il", "nous", "vous", "ils"]
ITP = ["io", "tu", "lui", "noi", "voi", "loro"]
FR_RE = re.compile(r"^(que |qu')?(je |j'|tu |il |elle |on |nous |vous |ils |elles )(.*)$")
IT_RE = re.compile(r"^(che )?(io |tu |lui |lei |noi |voi |loro )(.*)$")

VERIFY = []   # (lang, verb, key, person, esperado) para conferir formas escritas à mão


def prow(lang, verb, key, persons):
    d = conj.get(lang, verb)
    assert key in d, (lang, verb, key)
    out = {}
    for rr in d[key]:
        pr = rr['pr'].value
        if pr in persons and pr not in out and rr.get('g') != 'f':
            full = clean(rr['c'][0])
            m = (FR_RE if lang == 'fr' else IT_RE).match(full)
            assert m, full
            out[pr] = ((m.group(1) or '') + m.group(2), m.group(3), full)
    assert len(out) == 6, (lang, verb, key, list(out))
    return out


def form(lang, verb, key, person):
    return prow(lang, verb, key, FRP if lang == 'fr' else ITP)[person][1]


def citem(r, lang, verb, key, person, label, others=None, extra_wrong=None):
    persons = FRP if lang == 'fr' else ITP
    base = prow(lang, verb, key, persons)
    pre, rest, full = base[person]
    if others:
        wrong = [prow(lang, verb, k, persons)[person][1] for k in others if k != key]
    else:
        wrong = [base[p][1] for p in persons if p != person]
    if extra_wrong:
        wrong = wrong + extra_wrong
    wrong = [w for w in dict.fromkeys(wrong) if w != rest]
    q = f"{pre}___  ({verb}, {label})"
    para = " · ".join(base[p][2] for p in persons)
    w = f"{label[0].upper() + label[1:]} de «{verb}»: {para}."
    return mcq(r, q, rest, wrong, w, s=full, k=full)


def H(r, q, ok, wrong, why, s=None):
    s = s or (q.replace("___", ok) if "___" in q else ok)
    return mcq(r, q, ok, wrong, why, s=s, k=s)


def HD(r, data, page, tag, say=None):
    """data: lista de (q, ok, [erradas], porquê[, fala])"""
    rr = rng(tag, page)
    out = []
    for row in data[page * PER:(page + 1) * PER]:
        q, ok, wr, why = row[:4]
        s = row[4] if len(row) > 4 else None
        out.append(H(rr, q, ok, wr, why, s=s))
    return out


def pick(lst, page, i, mul=5):
    return lst[(i * mul + page) % len(lst)]


# =====================================================================  FUTURO
FR_FUT_OTH = [("indicatif", "présent"), ("indicatif", "imparfait"), ("conditionnel", "présent"), ("indicatif", "futur-simple")]
IT_FUT_OTH = [("indicativo", "presente"), ("indicativo", "imperfetto"), ("condizionale", "presente"), ("indicativo", "futuro")]

EN_FUT = [
    [("Next year, she ___ 30. (be)", "will be", ["will is", "will been", "is will"], "Futuro com «will» + verbo no infinitivo sem «to»: she will be."),
     ("We ___ you tomorrow. (see)", "will see", ["will saw", "will seen", "will sees"], "«will» é seguido da forma base do verbo: will see."),
     ("They are going to ___ a new car. (buy)", "buy", ["bought", "buys", "buying"], "«be going to» + verbo na forma base: going to buy."),
     ("She isn't going to ___ my car. (borrow)", "borrow", ["borrows", "borrowed", "borrowing"], "Na negativa, «be» recebe o «not» e o verbo continua na forma base: isn't going to borrow."),
     ("He ___ to the party. (não virá)", "won't come", ["won't comes", "won't came", "doesn't will come"], "«won't» = will not. O verbo seguinte fica na forma base: won't come."),
     ("I think it ___ tomorrow. (rain)", "will rain", ["will to rain", "is will rain", "rains will"], "Previsão baseada em opinião: will + forma base.")],
    [("Look at those black clouds! It ___ rain any minute.", "'s going to", ["'s raining", "rains", "rained"], "Previsão com evidência no presente usa «be going to». O livro avisa que o present progressive («It's raining any minute») não é usado nesse caso."),
     ("My flight ___ at nine tomorrow morning. (horário)", "leaves", ["leaved", "is leave", "leaving"], "O present simple também refere o futuro, com horários: «My flight leaves in two hours' time»."),
     ("She ___ next Thursday. (come)", "is coming", ["coming", "come", "has came"], "O present progressive refere o futuro para planos combinados: «She's coming next Thursday»."),
     ("If Sally ___ too, there'll be five of us.", "comes", ["will come", "would come", "came"], "Na oração com «if» usa-se o present simple. «Will» fica na oração principal, não na do «if»."),
     ("We're ___ buy a new camera.", "going to", ["go to", "goes to", "gone to"], "«be going to + verbo»: We're going to buy."),
     ("Don't let him cook. He ___ even burn the toast.", "'ll", ["is", "does", "has"], "«Will» ('ll) vale para julgamentos do falante: «He'll even burn the toast».")],
]

# =====================================================================  CONDICIONAL
FR_SI = [
    ("Si j'ai le temps, j'___ au cinéma. (aller; condição possível)", "irai", ["irais", "allais", "serais allé"], "«si» + presente → futuro no resultado: j'irai.", [("fr", "aller", ("indicatif", "futur-simple"), "je", "irai")]),
    ("Si j'avais du temps, je ___ en Italie. (voyager)", "voyagerais", ["voyagerai", "voyageais", "voyagerait"], "«si» + imparfait → condicional no resultado: je voyagerais.", [("fr", "voyager", ("conditionnel", "présent"), "je", "voyagerais")]),
    ("Si nous gagnions, nous ___ contents. (être)", "serions", ["serons", "étions", "sommes"], "«si» + imparfait → condicional: nous serions.", [("fr", "être", ("conditionnel", "présent"), "nous", "serions")]),
    ("Si tu étais riche, qu'est-ce que tu ___ ? (faire)", "ferais", ["feras", "faisais", "fais"], "Condicional de «faire»: ferais. O radical «fer-» é irregular, como no futuro.", [("fr", "faire", ("conditionnel", "présent"), "tu", "ferais")]),
    ("Si elle ___ faim, elle mangerait. (avoir)", "avait", ["aurait", "aura", "a"], "Na oração com «si», usa-se o imparfait e nunca o condicional: si elle avait.", [("fr", "avoir", ("indicatif", "imparfait"), "il", "avait")]),
    ("Si vous ___ venir, ce serait super. (pouvoir)", "pouviez", ["pourriez", "pourrez", "pouvez"], "Imparfait depois de «si» (e condicional na outra parte): si vous pouviez.", [("fr", "pouvoir", ("indicatif", "imparfait"), "vous", "pouviez")]),
]
IT_COND_SE = ("Se piove, ___ a casa. (stare)", "starò", ["starei", "stavo", "stato"],
              "O capítulo traz o exemplo «Se piove, starò a casa» (se + presente, futuro no resultado).", [("it", "stare", ("indicativo", "futuro"), "io", "starò")])

EN_COND = [
    [("If it ___ tomorrow, we will stay at home.", "rains", ["will rain", "would rain", "rained"], "1º condicional: if + present simple, e «will» na oração principal."),
     ("If he moves to Manchester, he ___ sell his house in Bristol.", "will have to", ["would have to", "had to", "having to"], "1º condicional: if + present simple + will/shall/may. Exemplo do livro: «he will have to sell his house»."),
     ("We won't have enough time if we ___ do some shopping too.", "want to", ["will want to", "wanted to", "would want to"], "No 1º condicional, «will» e «shall» ficam na oração principal e nunca na do «if»."),
     ("If I won the lottery, I ___ travel the world.", "would", ["will", "am going to", "did"], "2º condicional: if + passado simples + would/could/might."),
     ("If I knew what you wanted, maybe I ___ help you.", "could", ["can", "will", "am"], "2º condicional: if + passado simples + would/could/might. Exemplo do livro: «maybe I could help you»."),
     ("I would do a computer course if I ___ the time.", "had", ["have", "would have", "will have"], "2º condicional: a oração com «if» fica no passado simples: if I had the time.")],
    [("If I had seen you walking, I ___ offered you a lift.", "could have", ["could", "can have", "could has"], "3º condicional: if + past perfect + would/could/might + have + particípio. Exemplo do livro."),
     ("Tessa would have been furious if she ___ him say that.", "had heard", ["heard", "would hear", "has heard"], "3º condicional: a oração com «if» usa o past perfect (had + particípio). Exemplo do livro."),
     ("I would have called you if I ___ your number.", "had had", ["had", "have had", "would have"], "3º condicional: if + past perfect. Past perfect de «have» = had had."),
     ("If she had studied, she ___ the exam.", "would have passed", ["would pass", "had passed", "will have passed"], "3º condicional: would + have + particípio passado na oração principal."),
     ("If they ___ earlier, they wouldn't have missed the train.", "had left", ["left", "would leave", "have left"], "3º condicional: if + past perfect (had left)."),
     ("Qual frase fala de algo que NÃO aconteceu no passado?", "If I had seen you, I could have offered you a lift.", ["If I see you, I will offer you a lift.", "If I saw you, I would offer you a lift.", "If I see you, I offer you a lift."], "O 3º condicional (had + particípio, could have + particípio) imagina um passado que não aconteceu.")],
]

# =====================================================================  SUBJUNTIVO
FR_SUBJ_FRAMES = [
    ("Il faut que tu ___ le vin. (choisir)", "choisir", "tu", "«il faut que» exige o subjuntivo, com dois sujeitos diferentes."),
    ("Il est important que nous ___ tôt. (partir)", "partir", "nous", "«il est important que» (necessidade) também exige o subjuntivo."),
    ("Elle travaille pour que vous ___ contents. (être)", "être", "vous", "«pour que» (intenção) é uma das conjunções que pedem subjuntivo."),
    ("Nous partirons avant que tu ___ ton travail. (finir)", "finir", "tu", "«avant que» (tempo) pede subjuntivo."),
    ("Bien qu'il ___ froid, nous sortons. (faire)", "faire", "il", "«bien que» (obstáculo, 'embora') pede subjuntivo."),
    ("Il vaut mieux que je ___ la vérité. (savoir)", "savoir", "je", "«il vaut mieux que» está na lista de expressões de necessidade que pedem subjuntivo."),
]

IT_SUBJ_H = [
    ("Studio duramente affinché ___ ottenere buoni risultati. (potere, io)", "possa", ["posso", "potrò", "potevo"], "O capítulo traz «Studio duramente affinché possa ottenere buoni risultati»: depois de «affinché» vem o congiuntivo.", [("it", "potere", ("congiuntivo", "presente"), "io", "possa"), ("it", "potere", ("indicativo", "presente"), "io", "posso"), ("it", "potere", ("indicativo", "futuro"), "io", "potrò"), ("it", "potere", ("indicativo", "imperfetto"), "io", "potevo")]),
    ("Preferirei parlare con lui prima che ___ via. (andare)", "vada", ["va", "andrà", "andava"], "Exemplo do capítulo: «prima che vada via». Depois de «prima che» vem o congiuntivo.", [("it", "andare", ("congiuntivo", "presente"), "lui", "vada"), ("it", "andare", ("indicativo", "presente"), "lui", "va"), ("it", "andare", ("indicativo", "futuro"), "lui", "andrà"), ("it", "andare", ("indicativo", "imperfetto"), "lui", "andava")]),
    ("Puoi prendere la mia macchina purché la ___ entro le 8. (riportare)", "riporti", ["riporta", "riporterai", "riportavi"], "Exemplo do capítulo: «purché la riporti entro le 8». Depois de «purché» vem o congiuntivo.", [("it", "riportare", ("congiuntivo", "presente"), "tu", "riporti"), ("it", "riportare", ("indicativo", "presente"), "lui", "riporta"), ("it", "riportare", ("indicativo", "futuro"), "tu", "riporterai"), ("it", "riportare", ("indicativo", "imperfetto"), "tu", "riportavi")]),
    ("Non posso cucinare senza che tu mi ___ gli ingredienti. (dare)", "dia", ["dai", "darai", "davi"], "Exemplo do capítulo: «senza che tu mi dia gli ingredienti». Depois de «senza che» vem o congiuntivo.", [("it", "dare", ("congiuntivo", "presente"), "tu", "dia"), ("it", "dare", ("indicativo", "presente"), "tu", "dai"), ("it", "dare", ("indicativo", "futuro"), "tu", "darai"), ("it", "dare", ("indicativo", "imperfetto"), "tu", "davi")]),
    ("Non verrò alla festa a meno che tu non ___ anche tu. (venire)", "venga", ["vieni", "verrai", "venivi"], "Exemplo do capítulo: «a meno che tu non venga anche tu». Depois de «a meno che» vem o congiuntivo.", [("it", "venire", ("congiuntivo", "presente"), "tu", "venga"), ("it", "venire", ("indicativo", "presente"), "tu", "vieni"), ("it", "venire", ("indicativo", "futuro"), "tu", "verrai"), ("it", "venire", ("indicativo", "imperfetto"), "tu", "venivi")]),
    ("«Che io ___» (That I eat). Complete com o congiuntivo presente. (mangiare)", "mangi", ["mangio", "mangerò", "mangiassi"], "O capítulo dá «Che io mangi» (presente do congiuntivo) e «Che io mangiassi» (imperfeito do congiuntivo).", [("it", "mangiare", ("congiuntivo", "presente"), "io", "mangi"), ("it", "mangiare", ("indicativo", "presente"), "io", "mangio"), ("it", "mangiare", ("indicativo", "futuro"), "io", "mangerò"), ("it", "mangiare", ("congiuntivo", "imperfetto"), "io", "mangiassi")]),
]

EN_SUBJ = [
    [("Subjuntivo formal: They insisted that she ___ a psychiatrist. (consult)", "consult", ["consults", "consulted", "consulting"], "O subjuntivo inglês usa a forma base do verbo, sem -s. Exemplo do livro: «They insisted that she consult a psychiatrist»."),
     ("Subjuntivo formal: It is imperative that they ___ served a good meal. (be)", "be", ["are", "is", "been"], "Depois de expressões de necessidade (imperative, essential, important), o subjuntivo de «be» é «be». Exemplo do livro: «it is imperative they be served»."),
     ("I can remember it as if it ___ yesterday.", "were", ["be", "been", "are"], "O livro dá «as if it were yesterday». Depois de if, as if, though e as though, usa-se o «were» hipotético."),
     ("I would be careful if I ___ you.", "were", ["be", "am", "been"], "«If I were you» é o exemplo do livro do «were» hipotético, para todas as pessoas."),
     ("Subjuntivo formal: The committee demanded that the report ___ finished by Friday. (be)", "be", ["is", "was", "being"], "Depois de verbos como suggest, insist, recommend e demand, o subjuntivo usa a forma base: that the report be finished."),
     ("Subjuntivo formal: We recommend that he ___ a doctor. (see)", "see", ["sees", "saw", "seeing"], "Depois de «recommend that», o subjuntivo usa a forma base do verbo, sem -s.")],
    [("Subjuntivo formal: The doctor recommended that he ___ more water. (drink)", "drink", ["drinks", "drank", "drinking"], "«recommend that» pede a forma base: that he drink."),
     ("Subjuntivo formal: It is essential that every student ___ on time. (arrive)", "arrive", ["arrives", "arrived", "arriving"], "Depois de «it is essential that», o subjuntivo usa a forma base."),
     ("He talks as if he ___ the boss.", "were", ["be", "been", "are"], "Depois de «as if», o subjuntivo usa o «were» hipotético para todas as pessoas."),
     ("Subjuntivo formal: They insisted that he ___ the truth. (tell)", "tell", ["tells", "told", "telling"], "«insist that» pede a forma base: that he tell."),
     ("Subjuntivo formal: It is imperative that he ___ us today. (call)", "call", ["calls", "called", "calling"], "«it is imperative that» pede a forma base: that he call."),
     ("Subjuntivo formal: She suggested that he ___ at home. (stay)", "stay", ["stays", "stayed", "staying"], "«suggest that» pede a forma base: that he stay.")],
]

# =====================================================================  POSSESSIVOS
FR_POSS = [
    [("___ frère s'appelle Trey. (meu)", "Mon", ["Ma", "Mes", "Son"], "«frère» é masculino singular: mon frère."),
     ("Voici ___ sœur, Rita. (minha)", "ma", ["mon", "mes", "ta"], "«sœur» é feminino singular: ma sœur."),
     ("___ amie Tammy est sympa. (minha amiga)", "Mon", ["Ma", "Mes", "Notre"], "Diante de substantivo feminino que começa com som de vogal, usa-se mon/ton/son: mon amie. É a regra da ligação (liaison) do capítulo."),
     ("Nous aimons ___ famille. (nossa)", "notre", ["nos", "votre", "mon"], "«notre» serve para masculino e feminino singular; «nos» é o plural."),
     ("Ils adorent ___ chien. (deles)", "leur", ["leurs", "son", "ses"], "«leur» (singular) e «leurs» (plural) concordam com a coisa possuída: um só chien, então leur."),
     ("Elle présente ___ enfants. (dela)", "ses", ["son", "sa", "leurs"], "«enfants» é plural, então ses. O «son/sa/ses» pode ser 'dele' ou 'dela', e o contexto decide.")],
    [("— C'est ton béret, Tex ? — Oui, c'est ___ . (o meu)", "le mien", ["la mienne", "les miens", "le tien"], "O pronome possessivo concorda com a coisa possuída (béret é masculino singular): le mien. Exemplo do capítulo."),
     ("Ma sœur est secrétaire. ___ est PDG. (a minha)", "La mienne", ["Le mien", "Les miennes", "La sienne"], "Pronome possessivo feminino singular de «eu»: la mienne. Exemplo do capítulo: «La mienne est PDG»."),
     ("Tes parents sont américains. ___ aussi. (os meus)", "Les miens", ["Le mien", "Les miennes", "Les tiens"], "Plural masculino de «eu»: les miens."),
     ("Notre maison est grande, ___ est petite. (a de vocês)", "la vôtre", ["la nôtre", "la leur", "le vôtre"], "«maison» é feminino singular: la vôtre (de vocês)."),
     ("Leurs enfants sont petits, ___ sont grands. (os nossos)", "les nôtres", ["les leurs", "les vôtres", "les miens"], "Plural de «nosso»: les nôtres. Com acento circunflexo, ao contrário de «notre»."),
     ("Qual é um pronome possessivo (substitui o substantivo)?", "le mien", ["mon", "ma", "mes"], "«mon, ma, mes» acompanham um substantivo (determinantes). «le mien» substitui o substantivo (pronome).")],
]
IT_POSS = [
    [("___ zio è simpatico. (meu tio)", "Mio", ["Mia", "Miei", "Mie"], "Com parente no singular, o possessivo vai sem artigo: mio zio."),
     ("Hanno rubato ___ automobile! (minha)", "la mia", ["mia", "il mio", "le mie"], "Com coisas, o possessivo leva artigo: la mia automobile. Exemplo do capítulo."),
     ("Mi piace ___ lavoro. (meu)", "il mio", ["mio", "la mia", "i miei"], "«lavoro» não é parente: leva artigo, il mio lavoro. Exemplo do capítulo."),
     ("Sara è ___ sorella. (minha)", "mia", ["la mia", "mio", "mie"], "Parente no singular: sem artigo. «Sara è mia sorella» é exemplo do capítulo."),
     ("___ sorella è malata. (a deles)", "La loro", ["Loro", "La lora", "Le loro"], "«loro» sempre leva o artigo e nunca muda de forma. «La lora» não existe."),
     ("___ zie sono vecchie. (as minhas tias)", "Le mie", ["Mie", "La mia", "Le miei"], "No plural, mesmo com parentes, volta o artigo: le mie zie. Exemplo do capítulo.")],
    [("Questa macchina è ___ . (a minha)", "la mia", ["il mio", "le mie", "i miei"], "O possessivo concorda com a coisa possuída (macchina é feminino singular): la mia. Exemplo do capítulo: «Questa macchina è la mia»."),
     ("Un ___ figlio è malato. (um dos meus filhos)", "mio", ["il mio", "mia", "miei"], "Para «um dos meus», usa-se o artigo indefinido + possessivo: un mio figlio. Exemplo do capítulo."),
     ("Fatti gli affari ___ ! (os seus)", "tuoi", ["tuo", "tua", "tue"], "Na expressão fixa, o possessivo vem depois do substantivo e concorda com ele: gli affari tuoi (masculino plural)."),
     ("Le chiavi sono ___ . (as minhas)", "le mie", ["i miei", "la mia", "il mio"], "«chiavi» é feminino plural: le mie."),
     ("___ vedo. (Eu te vejo.)", "Ti", ["Lo", "Mi", "Ci"], "Pronome de objeto direto de «tu»: ti. Vai antes do verbo: Ti vedo. Exemplo do capítulo."),
     ("___ problema non si può risolvere. (aquele)", "Quel", ["Quello", "Quella", "Quei"], "«Quello» encurta antes de substantivo conforme o artigo: il problema → quel problema. Exemplo do capítulo.")],
]
EN_POSS = [
    [("Is this coat ___ ?", "yours", ["your", "you", "yourself"], "Possessivo que fica sozinho (pronome): mine, yours, his, hers, ours, theirs. Exemplo do livro: «Is this coat yours?»."),
     ("Here's ___ ticket. (deles)", "their", ["theirs", "them", "they"], "Antes de um substantivo usa-se o possessivo determinante: my, your, his, her, its, our, their."),
     ("Have you given the rabbit ___ dinner yet?", "its", ["it's", "itself", "it"], "«its» (sem apóstrofo) é o possessivo. O livro usa esse exemplo."),
     ("I can't believe that the house is ___ at last. (nossa)", "ours", ["our", "us", "ourselves"], "Possessivo sozinho de «we»: ours. Exemplo do livro."),
     ("It's ___ own fault. (dele)", "his", ["him", "he", "hers"], "«own» vem depois do possessivo determinante: his own fault. Exemplo do livro: «It's his own fault»."),
     ("The book is ___ . (dela)", "hers", ["her's", "hers'", "hers's"], "Os possessivos terminados em -s não levam apóstrofo: hers, yours, ours, theirs.")],
    [("That bag isn't mine; it's ___ . (dele)", "his", ["he's", "him", "her"], "Possessivo sozinho de «he»: his. «he's» é 'he is'."),
     ("The best man at Jane's and ___ wedding couldn't stop telling jokes.", "my", ["mine", "me", "I"], "Exemplo do livro: «Jane's and my wedding». Quando o possessivo determinante e o 's modificam o mesmo substantivo, o determinante vem em segundo."),
     ("Can I borrow your pen? I forgot ___ .", "mine", ["my", "me", "myself"], "Possessivo sozinho (pronome) de «I»: mine."),
     ("A cat will use every garden except ___ own as a toilet.", "its", ["it's", "it", "itself"], "«its own» é o exemplo do livro. «Its» só aparece sozinho como pronome quando vem com (very) own."),
     ("Their house is big, but ___ is bigger. (a nossa)", "ours", ["our", "us", "ours'"], "Possessivo sozinho de «we»: ours."),
     ("Now that you've got your very ___ flat, how does it feel?", "own", ["self", "itself", "one"], "«(very) own» reforça o possessivo: your very own flat. Exemplo do livro.")],
]

# =====================================================================  CONJUNÇÕES
FR_CONJ = [
    [("Je prends du thé ___ du café ? (ou)", "ou", ["mais", "donc", "car"], "«ou» liga alternativas."),
     ("Il pleut, ___ je prends un parapluie. (por isso)", "donc", ["mais", "ou", "car"], "«donc» indica consequência ('então, portanto')."),
     ("Il ne sort pas ___ il est malade. (porque)", "car", ["donc", "mais", "ou"], "«car» introduz a causa ('pois')."),
     ("Tex ___ Tammy sont fatigués. (e)", "et", ["ou", "mais", "puis"], "«et» liga elementos da mesma categoria."),
     ("Trey n'est ni intellectuel ___ cultivé.", "ni", ["ou", "et", "mais"], "«ne … ni … ni» significa 'nem … nem'."),
     ("Ils sont pauvres ___ heureux. (mas)", "mais", ["donc", "car", "ni"], "«mais» indica oposição.")],
    [("Je lis ___ tu dors. (enquanto)", "pendant que", ["parce que", "depuis que", "puisque"], "«pendant que» = enquanto. Conjunção subordinativa."),
     ("Il est évident ___ Trey est curieux.", "que", ["quand", "pendant", "depuis"], "«que» (= que) é a conjunção subordinativa mais usada."),
     ("Tex a changé ___ il connaît Trey. (desde que)", "depuis que", ["pendant que", "parce que", "tandis que"], "«depuis que» = desde que (tempo)."),
     ("Trey se lève ___ le soleil se couche. (quando)", "quand", ["car", "donc", "mais"], "«quand» (ou «lorsque») = quando."),
     ("Elle travaille ___ tu sois content. (para que)", "pour que", ["parce que", "puisque", "depuis que"], "«pour que» (intenção) pede subjuntivo, por isso «sois»."),
     ("___ elle soit fatiguée, elle travaille. (embora)", "Bien qu'", ["Parce qu'", "Puisqu'", "Quand"], "«bien que» (obstáculo, 'embora') pede subjuntivo («soit»).")],
]
IT_CONJ = [
    [("Non posso uscire ___ sono malato. (porque)", "perché", ["ma", "quindi", "oppure"], "Exemplo do capítulo: «perché» dá a causa."),
     ("Mi piace il calcio, ___ non mi piace giocare. (mas)", "ma", ["e", "o", "quindi"], "«ma» = mas. Exemplo do capítulo."),
     ("Ho comprato pane ___ latte. (e)", "e", ["ma", "tuttavia", "quindi"], "«e» liga dois elementos. Exemplo do capítulo."),
     ("Vuoi la pasta ___ la pizza? (ou)", "o", ["ma", "quindi", "tuttavia"], "«o» (ou «oppure») apresenta alternativas. Exemplo do capítulo."),
     ("Ho fame, ___ mangerò una pizza. (então)", "quindi", ["ma", "o", "perché"], "«quindi» (ou «dunque», «perciò») dá a consequência. Exemplo do capítulo."),
     ("Non mi piace lo sport, ___ devo fare esercizio. (no entanto)", "tuttavia", ["quindi", "e", "perché"], "«tuttavia» = no entanto. Exemplo do capítulo.")],
    [("___ abbia studiato tanto, non ho superato l'esame. (embora)", "Benché", ["Perché", "Quindi", "Poiché"], "«benché» (ou «sebbene») = embora. Exemplo do capítulo, com o verbo no congiuntivo."),
     ("Studio ___ possa ottenere buoni risultati. (para que)", "affinché", ["benché", "finché", "dopo che"], "«affinché» = para que. Exemplo do capítulo, com o congiuntivo («possa»)."),
     ("Non verrò alla festa ___ tu non venga anche tu. (a menos que)", "a meno che", ["dopo che", "poiché", "quindi"], "«a meno che» = a menos que. Exemplo do capítulo, com o congiuntivo."),
     ("Puoi prendere la mia macchina ___ la riporti entro le 8. (contanto que)", "purché", ["dopo che", "tuttavia", "oppure"], "«purché» = contanto que. Exemplo do capítulo, com o congiuntivo."),
     ("O que significa «se» em «Se piove, starò a casa»?", "se (condição)", ["porque", "embora", "portanto"], "«se» introduz uma condição. Exemplo do capítulo."),
     ("Preferirei parlare con lui ___ vada via. (antes que)", "prima che", ["dopo che", "senza che", "a meno che"], "«prima che» = antes que. Exemplo do capítulo, com o congiuntivo («vada»).")],
]
EN_CONJ = [
    [("You can join now ___ wait and discuss things with your partner. (ou)", "or", ["but", "because", "although"], "«or» liga alternativas. Conjunção coordenativa (and, or, but)."),
     ("I like football, ___ I don't like playing it. (mas)", "but", ["or", "because", "so"], "«but» liga ideias que se opõem."),
     ("She neither eats meat ___ drinks coffee.", "nor", ["or", "and", "but"], "Correlativas: neither … nor …. Exemplo do livro."),
     ("The class can meet either on Friday ___ on Thursday afternoon.", "or", ["nor", "and", "than"], "Correlativas: either … or …. Exemplo do livro."),
     ("Both my brother ___ my sister are doctors.", "and", ["or", "nor", "but"], "Correlativas: both … and …."),
     ("Neither I ___ my family feel that an interview is appropriate.", "nor", ["or", "and", "but"], "Correlativas: neither … nor …. Exemplo do livro.")],
    [("They had to cancel their holiday ___ Anne's mother was seriously ill.", "because", ["although", "unless", "until"], "«because» dá a causa. Exemplo do livro."),
     ("___ you have not explained your action, the school will make a formal report. (já que)", "As", ["Although", "Unless", "Until"], "«as» pode ser 'já que'. Exemplo do livro."),
     ("Walkers need to be prepared for a steep climb ___ reach the village. (a fim de)", "in order to", ["because", "although", "unless"], "«in order to» = a fim de. Exemplo do livro."),
     ("Just ___ I arrived, I got a phone call.", "when", ["although", "because", "unless"], "«when» pode ser modificado por um advérbio: just when. Exemplo do livro."),
     ("I've been afraid to go out after dark ever ___ I heard about it.", "since", ["until", "because", "unless"], "«since» (tempo) também pode ser modificado por advérbio: ever since. Exemplo do livro."),
     ("Tex is a poet, ___ Trey is a musician. (contraste)", "whereas", ["because", "unless", "until"], "«whereas» e «while» ligam dois contrastes. Está na lista de subordinativas do livro.")],
]

# =====================================================================  ADVÉRBIOS
FR_ADV = [
    [("Advérbio de «lent(e)»:", "lentement", ["lentment", "lentemment", "lentiment"], "Regra geral: feminino do adjetivo + -ment (lente → lentement)."),
     ("Advérbio de «heureux»:", "heureusement", ["heureuxment", "heureusment", "heureusemment"], "Feminino «heureuse» + -ment → heureusement. Exemplo do capítulo."),
     ("Advérbio de «poli(e)»:", "poliment", ["poliement", "polimment", "politement"], "Adjetivos que acabam em vogal recebem -ment no masculino: poli → poliment. Exemplo do capítulo."),
     ("Advérbio de «vrai(e)»:", "vraiment", ["vraiement", "vraiemment", "vraiyment"], "Adjetivo terminado em vogal: vrai → vraiment. Exemplo do capítulo."),
     ("Advérbio de «récent»:", "récemment", ["récentment", "récentement", "récentiment"], "Adjetivos em -ent: troca-se por -emment (récent → récemment). Exemplo do capítulo."),
     ("Advérbio de «suffisant»:", "suffisamment", ["suffisantment", "suffisemment", "suffisantement"], "Adjetivos em -ant: troca-se por -amment (suffisant → suffisamment). Exemplo do capítulo.")],
    [("Como dizer: Joe-Bob gosta muito de ketchup.", "Joe-Bob aime beaucoup le ketchup.", ["Joe-Bob beaucoup aime le ketchup.", "Joe-Bob aime le ketchup beaucoup.", "Beaucoup Joe-Bob aime le ketchup."], "O advérbio vem logo depois do verbo conjugado, antes do objeto. Exemplo do capítulo: «J'aime beaucoup le ketchup»."),
     ("Como dizer: Edouard não anda depressa.", "Edouard ne marche pas vite.", ["Edouard ne marche vite pas.", "Edouard ne vite marche pas.", "Edouard vite ne marche pas."], "Quando o verbo é negativo, o advérbio vem depois da negação: ne marche pas vite. Exemplo do capítulo."),
     ("O que significa «souvent»?", "com frequência", ["nunca", "sempre", "às vezes"], "«souvent» = often (lista de advérbios de tempo do capítulo)."),
     ("O que significa «toujours»?", "sempre", ["nunca", "às vezes", "com frequência"], "«toujours» = always. «jamais» = never."),
     ("O que significa «tôt»?", "cedo", ["tarde", "hoje", "agora"], "«tôt» = early; «tard» = late."),
     ("O que significa «demain»?", "amanhã", ["ontem", "hoje", "agora"], "«demain» = tomorrow; «hier» = yesterday; «aujourd'hui» = today.")],
]
IT_ADV = [
    [("Advérbio de «veloce»:", "velocemente", ["velocimente", "velocemento", "veloceente"], "Regra geral: forma feminina singular do adjetivo + -mente. Exemplo do capítulo: veloce → velocemente."),
     ("O que significa «spesso»?", "com frequência", ["sempre", "nunca", "pouco"], "Lista de advérbios comuns do capítulo: spesso = often."),
     ("O que significa «mai»?", "nunca", ["sempre", "muito", "tarde"], "Lista do capítulo: mai = never."),
     ("O que significa «tardi»?", "tarde", ["cedo", "aqui", "bem"], "Lista do capítulo: tardi = late."),
     ("O que significa «bene»?", "bem", ["mal", "muito", "pouco"], "Lista do capítulo: bene = well; male = badly."),
     ("O que significa «troppo»?", "demais", ["pouco", "bastante", "nunca"], "Lista do capítulo: troppo = too much; poco = little; abbastanza = enough/quite.")],
    [("È ___ bello. (muito)", "molto", ["bene", "male", "spesso"], "Advérbio que modifica um adjetivo vem antes dele. Exemplo do capítulo: «È molto bello»."),
     ("Sono ___ stanco. (bastante)", "abbastanza", ["mai", "tardi", "qui"], "«abbastanza» = bastante, antes do adjetivo. Exemplo do capítulo."),
     ("La casa è ___ grande. (extremamente)", "estremamente", ["spesso", "mai", "qui"], "Advérbio de intensidade antes do adjetivo. Exemplo do capítulo."),
     ("Parla ___ chiaramente. (muito)", "molto", ["mai", "qui", "tardi"], "Advérbio que modifica outro advérbio vem antes dele. Exemplo do capítulo: «Parla molto chiaramente»."),
     ("Non bevo ___ . (nunca)", "mai", ["sempre", "spesso", "molto"], "«mai» = nunca, e na frase negativa vem depois do verbo: Non bevo mai."),
     ("Ho ___ vissuto qui. (sempre)", "sempre", ["mai", "poco", "tardi"], "Exemplo do capítulo: «Ho sempre vissuto qui».")],
]
EN_ADV = [
    [("She sings ___ . (beautiful)", "beautifully", ["beautiful", "beautify", "beauty"], "A maioria dos advérbios é o adjetivo + -ly. Exemplo do livro: beautiful → beautifully."),
     ("They walked ___ across the narrow bridge. (careful)", "carefully", ["careful", "carefulness", "care"], "Adjetivo + -ly. Exemplo do livro: careful → carefully."),
     ("He works very ___ . (duro, com esforço)", "hard", ["hardly", "hardy", "harder"], "«hard» tem a mesma forma de adjetivo e advérbio. «hardly» existe, mas significa 'quase não'."),
     ("The train arrived ___ . (atrasado)", "late", ["lately", "latly", "lateness"], "«late» também tem a mesma forma de adjetivo e advérbio. «lately» significa 'ultimamente'."),
     ("soon – ___ – soonest", "sooner", ["soonner", "more soon", "soonish"], "Alguns advérbios têm comparativo e superlativo: soon – sooner – soonest. Exemplo do livro."),
     ("hard – harder – ___", "hardest", ["most hard", "hardiest", "harderest"], "Comparativo e superlativo de «hard»: harder, hardest. Exemplo do livro.")],
    [("Qual destas palavras é um advérbio que NÃO vem de um adjetivo?", "very", ["quickly", "carefully", "beautifully"], "O livro cita just, quite, so, soon, too e very como advérbios sem adjetivo relacionado."),
     ("Qual destas palavras tem a mesma forma de adjetivo e de advérbio?", "late", ["quickly", "happily", "slowly"], "O livro cita hard, outside, right, straight, late, well."),
     ("A maioria dos advérbios de modo é formada com o adjetivo +", "-ly", ["-ed", "-ing", "-er"], "Exemplo do livro: beautiful → beautifully, careful → carefully."),
     ("Como dizer: Eu muitas vezes visito minha tia aos domingos.", "I often visit my aunt on Sundays.", ["I visit often my aunt on Sundays.", "I visit my often aunt on Sundays.", "Often I my visit aunt on Sundays."], "O advérbio de frequência fica na posição do meio, antes do verbo principal, e não entre o verbo e o objeto."),
     ("They walked carefully across the narrow bridge. Qual palavra é o advérbio?", "carefully", ["walked", "narrow", "bridge"], "«carefully» descreve como eles andaram (modo). Exemplo do livro."),
     ("It all happened rather suddenly. Qual palavra modifica um advérbio?", "rather", ["happened", "all", "suddenly"], "Um advérbio pode ser modificado por outro advérbio: rather suddenly. Exemplo do livro.")],
]

# =====================================================================  REFLEXIVOS
FR_REFL_H = [
    ("Como dizer: Eu não me barbeio.", "Je ne me rase pas.", ["Je me ne rase pas.", "Je ne rase me pas.", "Je me rase ne pas."], "Na negativa, o «ne» vem antes do pronome reflexivo e o «pas» depois do verbo. Exemplo do capítulo."),
    ("Como dizer: Tex lava as mãos.", "Tex se lave les mains.", ["Tex se lave ses mains.", "Tex lave les mains.", "Tex se lave mains."], "Com partes do corpo, usa-se o artigo definido (les) e não o possessivo. Exemplo do capítulo: «Tex se lave les mains»."),
    ("Em qual frase Tex faz a ação nele mesmo?", "Tex se rase.", ["Tex rase Joe-Bob.", "Tex rase le chat.", "Tex rase Tammy."], "Verbo reflexivo: o sujeito faz a ação em si mesmo. Quem raspa outra pessoa usa o verbo sem reflexivo."),
    ("Nous ___ amusons beaucoup. (nos divertimos)", "nous", ["me", "se", "vous"], "O pronome reflexivo de «nous» é «nous»: nous nous amusons. Reflexivos: me, te, se, nous, vous, se."),
    ("Ils ___ réveillent à sept heures.", "se", ["me", "te", "nous"], "O pronome reflexivo de «ils» é «se»."),
    ("O que significa «s'amuser»?", "divertir-se", ["lavar-se", "levantar-se", "vestir-se"], "É um verbo pronominal idiomático: s'amuser = divertir-se. Lista do capítulo."),
]
FR_REFL_VERBS = ["se laver", "se lever", "se coucher", "s'habiller", "se réveiller", "se promener"]
IT_REFL_VERBS = ["lavarsi", "alzarsi", "svegliarsi", "vestirsi", "divertirsi", "sentirsi"]
IT_REFL_H = [
    ("Os verbos reflexivos usam, no passato prossimo, o auxiliar:", "essere", ["avere", "andare", "fare"], "Capítulo «Verbs»: todos os verbos reflexivos usam essere no passato prossimo."),
    ("Ieri mi ___ alzato presto. (passato prossimo)", "sono", ["ho", "hai", "sia"], "Reflexivo + essere: mi sono alzato. Auxiliar «essere» na 1ª pessoa do singular: sono."),
    ("Loro si ___ divertiti. (passato prossimo)", "sono", ["hanno", "è", "ha"], "Reflexivo + essere: si sono divertiti."),
    ("Noi ci ___ svegliati presto. (passato prossimo)", "siamo", ["abbiamo", "sono", "siete"], "Reflexivo + essere: ci siamo svegliati."),
    ("Voi vi ___ divertiti? (passato prossimo)", "siete", ["avete", "siamo", "sono"], "Reflexivo + essere: vi siete divertiti."),
    ("Lui si ___ vestito. (passato prossimo)", "è", ["ha", "sono", "era"], "Reflexivo + essere: si è vestito."),
]
EN_REFL = [
    [("He hurt ___ quite badly in the fall.", "himself", ["him", "his", "hisself"], "Reflexivo: o sujeito e o objeto são a mesma pessoa. Exemplo do livro: «He hurt himself»."),
     ("She looks very pleased with ___ . (ela mesma)", "herself", ["her", "hers", "she"], "O reflexivo deixa claro que é a mesma pessoa. Exemplo do livro: «pleased with herself»."),
     ("When are you going to stop pushing ___ so hard? (você mesmo)", "yourself", ["you", "yours", "your"], "Reflexivo de «you»: yourself. Exemplo do livro."),
     ("Children always hurt ___ when they play that game. (cada um se machuca)", "themselves", ["them", "theirselves", "theirs"], "Reflexivo de «they»: themselves. Exemplo do livro."),
     ("We painted the house ___ . (nós mesmos)", "ourselves", ["ours", "us", "ourself"], "Reflexivo de «we»: ourselves."),
     ("The Head of Department ___ knows that the staff are unhappy. (ênfase)", "herself", ["her", "hers", "she"], "O reflexivo pode dar ênfase ao sujeito. Exemplo do livro: «The Head of Department herself knows …»")],
    [("Qual frase está correta?", "He himself told me he was retiring.", ["Himself told me he was retiring.", "Him told me he was retiring.", "Hisself told me he was retiring."], "O reflexivo não pode ser o sujeito sozinho. Só serve como ênfase depois de um pronome pessoal sujeito: He himself …"),
     ("Children always hurt ___ when they play that game. (uma criança machuca a outra)", "each other", ["themselves", "itself", "myself"], "«each other» é recíproco: uma pessoa machuca a outra. Contraste do livro: hurt themselves / hurt each other."),
     ("Reflexivo de «it»:", "itself", ["itselves", "hisself", "its'self"], "Lista do livro: myself, yourself, himself, herself, itself, oneself, ourselves, yourselves, themselves."),
     ("Reflexivo de «they»:", "themselves", ["theirselves", "themselfs", "theirself"], "Lista do livro: themselves."),
     ("Reflexivo de «you» no plural (vocês):", "yourselves", ["yourself", "yourselfs", "yoursselves"], "No plural, «-self» vira «-selves»: yourselves."),
     ("She looks very pleased with herself. Qual palavra é o pronome reflexivo?", "herself", ["She", "looks", "pleased"], "Exemplo do livro: «pleased with herself».")],
]

# =====================================================================  ORDEM DA FRASE
FR_ORD = [
    [("Como dizer: Eu o vejo.", "Je le vois.", ["Je vois le.", "Le je vois.", "Je vois lui."], "O pronome objeto vem antes do verbo (exceto no imperativo afirmativo)."),
     ("Como dizer: Ele me dá o livro.", "Il me donne le livre.", ["Il donne me le livre.", "Il me le donne livre.", "Me il donne le livre."], "Pronome objeto antes do verbo: il me donne."),
     ("Como dizer: Eu o dou a ele. (le + lui)", "Je le lui donne.", ["Je lui le donne.", "Je donne le lui.", "Le je lui donne."], "Ordem dos pronomes: me/te/nous/vous/se, depois le/la/les, depois lui/leur, depois y, depois en."),
     ("Como dizer: Eu te dou ele. (te + le)", "Je te le donne.", ["Je le te donne.", "Je donne te le.", "Te je le donne."], "Ordem dos pronomes: me/te/nous/vous antes de le/la/les."),
     ("Como dizer: Há alguns lá. (y + en)", "Il y en a.", ["Il en y a.", "Il y a en.", "Y il en a."], "O «y» sempre vem antes do «en». Exemplo do capítulo: «Oui, il y en a»."),
     ("Como dizer: Vá lá! (imperativo afirmativo)", "Vas-y !", ["Y vas !", "Y va !", "Vas y !"], "No imperativo afirmativo, o pronome vem depois do verbo, ligado por hífen. Exemplo do capítulo: «Vas-y avec Bette».")],
    [("Como dizer: Eu não vou nadar.", "Je ne vais pas nager.", ["Je vais ne pas nager.", "Je ne vais nager pas.", "Je ne pas vais nager."], "No futur proche, o «ne … pas» envolve o verbo «aller». Exemplo do capítulo."),
     ("Como dizer: Tex não foi gentil. (passé composé)", "Tex n'a pas été gentil.", ["Tex n'a été pas gentil.", "Tex n'a pas gentil été.", "Tex a pas n'été gentil."], "Nos tempos compostos, «ne … pas» envolve o auxiliar. Exemplo do capítulo."),
     ("Como dizer: Ele come bem.", "Il mange bien.", ["Il bien mange.", "Bien il mange.", "Il mange le bien."], "O advérbio vem depois do verbo conjugado."),
     ("Como dizer: Você gosta de filmes? (com «est-ce que»)", "Est-ce que tu aimes les films ?", ["Tu est-ce que aimes les films ?", "Est-ce tu que aimes les films ?", "Que est-ce tu aimes les films ?"], "«est-ce que» vem no início, antes de uma frase afirmativa normal. Exemplo do capítulo."),
     ("Como dizer: um gato pequeno.", "un petit chat", ["un chat petit", "petit un chat", "chat petit un"], "Adjetivos de Beleza, Idade, Número, Bondade e Tamanho (BANGS) vêm antes do substantivo: petit, grand, jeune, beau, bon…"),
     ("Como dizer: uma música francesa.", "une musique française", ["une française musique", "française une musique", "musique une française"], "A maioria dos adjetivos vem depois do substantivo.")],
]
IT_ORD = [
    [("Como dizer: um carro vermelho.", "una macchina rossa", ["rossa una macchina", "macchina una rossa", "macchina rossa una"], "Em italiano, a ordem normal é substantivo + adjetivo. Exemplo do capítulo."),
     ("Como dizer: Marta me deu o livro.", "Marta mi ha dato il libro.", ["Marta ha dato mi il libro.", "Marta il libro mi ha dato.", "Marta ha dato il libro mi."], "O pronome de objeto indireto vem antes do verbo. Exemplo do capítulo."),
     ("Como dizer: cinco meninas.", "cinque ragazze", ["ragazze cinque", "cinque ragazzi", "cinquanta ragazze"], "Numerais vêm antes do substantivo. Exemplo do capítulo: «cinque ragazze»."),
     ("Como dizer: este livro.", "questo libro", ["libro questo", "libro questa", "questo libri"], "Demonstrativos vêm antes do substantivo. Exemplo do capítulo: «questo libro»."),
     ("Como dizer: Eu te vejo.", "Ti vedo.", ["Vedo ti.", "Ti io vedo.", "Vedo ti lo."], "Os pronomes de objeto direto e indireto vêm antes do verbo: Ti vedo. Exemplo do capítulo."),
     ("Como dizer: Eu quero vê-lo.", "Voglio vederlo.", ["Voglio lo vedere.", "Voglio vedere lo.", "Voglio vedere-lo."], "Com o infinitivo, o pronome gruda no fim do verbo (sem o «e» final). O capítulo diz: Voglio vederlo, e não voglio lo vedere.")],
    [("Como dizer: Eu gosto de livros. (piacere)", "Mi piacciono i libri.", ["Io piaccio i libri.", "Mi piace i libri.", "Piaccio i libri."], "«piacere» funciona como 'ser agradável para': Mi piacciono i libri = os livros me agradam. Exemplo do capítulo."),
     ("Como dizer: Anna precisa de um guarda-chuva. (servire)", "Ad Anna serve un ombrello.", ["Anna serve un ombrello.", "Un ombrello serve Anna.", "Anna serve all'ombrello."], "«servire» indica necessidade e a pessoa vem com «a». Exemplo do capítulo: «Ad Anna serve un ombrello»."),
     ("Como dizer: Eu sinto sua falta. (mancare)", "Mi manchi.", ["Ti manco.", "Io manchi te.", "Ti manchi."], "«mancare» inverte sujeito e objeto: Mi manchi = você me falta. Exemplo do capítulo."),
     ("Qual frase está na ordem mais comum (sujeito–verbo–objeto)?", "Luca ha comprato una macchina.", ["Una macchina Luca ha comprato.", "Ha comprato una macchina Luca.", "Una macchina ha comprato Luca."], "O capítulo diz que a maioria das frases segue sujeito–verbo–objeto: Luca ha comprato una nuova macchina."),
     ("Como dizer: minha casa.", "la mia casa", ["casa la mia", "mia la casa", "mia casa la"], "O possessivo geralmente vem antes do substantivo, com artigo. Exemplo do capítulo: «la mia casa»."),
     ("Como dizer: os livros interessantes.", "i libri interessanti", ["interessanti i libri", "i interessanti libri", "libri i interessanti"], "Ordem normal: artigo + substantivo + adjetivo, com concordância.")],
]
EN_ORD = [
    [("Qual frase tem a ordem normal (sujeito–verbo–objeto)?", "He loves football.", ["Football he loves.", "Loves he football.", "He football loves."], "A ordem não marcada do inglês é S–V–O. O livro dá «He loves football.» como exemplo."),
     ("Como dizer: um carro vermelho.", "a red car", ["a car red", "red a car", "car a red"], "Em inglês, o adjetivo vem antes do substantivo."),
     ("Como dizer: sapatos vermelhos baratos.", "cheap red shoes", ["red cheap shoes", "shoes cheap red", "red shoes cheap"], "Os modificadores vêm antes do substantivo principal. Exemplo do livro: «cheap red shoes»."),
     ("Como dizer: uma reunião muito importante.", "a very important meeting", ["a important very meeting", "very a important meeting", "a meeting very important"], "Os modificadores vêm antes do substantivo principal. Exemplo do livro: «a very important meeting»."),
     ("Como dizer: um muro de pedra.", "a stone wall", ["a wall stone", "stone a wall", "wall a stone"], "Substantivos também podem modificar substantivos, antes do principal. Exemplo do livro: «a stone wall»."),
     ("Como dizer: um relatório publicado na semana passada.", "a report published last week", ["a published report last week", "published a report last week", "a report last week published"], "Alguns modificadores vêm depois do substantivo. Exemplo do livro: «a long-awaited government report published last week».")],
    [("Qual frase tem a ordem normal?", "I bought this furniture years ago.", ["This furniture I bought years ago.", "Bought I this furniture years ago.", "I this furniture bought years ago."], "A ordem normal é sujeito–verbo–objeto. Colocar o objeto na frente é possível, mas menos comum."),
     ("Como dizer: Eu muitas vezes visito minha tia.", "I often visit my aunt.", ["I visit often my aunt.", "I visit my often aunt.", "Often I my visit aunt."], "O advérbio de frequência vem antes do verbo principal e não entre o verbo e o objeto."),
     ("Como dizer: um estudante universitário.", "a university student", ["a student university", "university a student", "student a university"], "O modificador vem antes do substantivo principal. Exemplo do livro: «all university students»."),
     ("Como dizer: uma gaveta cheia de canetas.", "a drawer full of pens", ["a full drawer of pens", "full a drawer of pens", "a drawer of pens full"], "Alguns modificadores vêm depois do substantivo. Exemplo do livro: «a drawer full of pens and pencils»."),
     ("Como dizer: o primeiro capítulo do livro.", "the first chapter of the book", ["the chapter first of the book", "first the chapter of the book", "the first of the book chapter"], "Ordem do sintagma nominal: determinante + modificador + substantivo + complemento. Exemplo do livro."),
     ("Como dizer: muitas cidades grandes perto daqui.", "many big towns nearby", ["big many towns nearby", "many towns big nearby", "nearby many big towns"], "Determinante, modificador, substantivo e, no fim, o advérbio de lugar. Exemplo do livro: «many big towns nearby».")],
]

TYPES2 = [
    ("futuro", "Futuro", "Futuro"),
    ("condicional", "Condicional e frases com «se»", "Condicional"),
    ("subjuntivo", "Subjuntivo", "Subjuntivo"),
    ("possessivos", "Possessivos e pronomes", "Possessivos"),
    ("conjuncoes", "Conjunções", "Conjunções"),
    ("adverbios", "Advérbios", "Advérbios"),
    ("reflexivos", "Verbos e pronomes reflexivos", "Reflexivos"),
    ("ordem", "Ordem da frase (sintaxe)", "Ordem da frase"),
]


def conj_page(lang, tag, page, spec, key, label, others):
    r = rng(tag, lang, page)
    persons = FRP if lang == 'fr' else ITP
    out = []
    for i, v in enumerate(spec):
        pr = persons[(i * 5 + 1 + page) % 6]
        out.append(citem(r, lang, v, key, pr, label, others=others))
    return out


def gen(lang, tid, page):
    r = rng(tid, lang, page)
    if tid == "futuro":
        if lang == "en":
            return HD(r, EN_FUT[page], 0, "futen")
        key = ("indicatif", "futur-simple") if lang == "fr" else ("indicativo", "futuro")
        oth = FR_FUT_OTH if lang == "fr" else IT_FUT_OTH
        if lang == "fr":
            reg = ["parler", "finir", "vendre", "manger", "aimer", "choisir"]
            irr = ["être", "avoir", "aller", "faire", "pouvoir", "voir"]
        else:
            reg = ["parlare", "vendere", "finire", "dimenticare", "mangiare", "guardare"]
            irr = ["essere", "avere", "andare", "fare", "potere", "vedere"]
        out = conj_page(lang, "fut", page, [reg, irr][page], key, "futuro", oth)
        if lang == "fr" and page == 0:
            out = out[:4]
            out.append(H(r, "Demain, nous ___ visiter le musée. (futur proche)", "allons", ["allez", "vont", "va"], "Futur proche = «aller» no presente + infinitivo: nous allons visiter. Equivale a 'ir + verbo'."))
            out.append(H(r, "Tu ___ nager ? (futur proche)", "vas", ["va", "allons", "vont"], "Futur proche = «aller» no presente + infinitivo: tu vas nager. Exemplo do capítulo: «Je vais nager»."))
        return out
    if tid == "condicional":
        if lang == "en":
            return HD(r, EN_COND[page], 0, "conden")
        if lang == "fr":
            if page == 0:
                return conj_page("fr", "cond", 0, ["jouer", "aimer", "finir", "vendre", "aller", "pouvoir"], ("conditionnel", "présent"), "condicional", [("indicatif", "présent"), ("indicatif", "imparfait"), ("indicatif", "futur-simple"), ("conditionnel", "présent")])
            rr = rng("fr-si", page)
            for row in FR_SI:
                VERIFY.extend(row[4])
            return [H(rr, row[0], row[1], row[2], row[3]) for row in FR_SI]
        key = ("condizionale", "presente")
        oth = [("indicativo", "presente"), ("indicativo", "imperfetto"), ("indicativo", "futuro"), ("condizionale", "presente")]
        if page == 0:
            out = conj_page("it", "cond", 0, ["parlare", "vendere", "finire", "mangiare", "essere"], key, "condizionale", oth)
            VERIFY.extend(IT_COND_SE[4])
            out.append(H(r, IT_COND_SE[0], IT_COND_SE[1], IT_COND_SE[2], IT_COND_SE[3]))
            return out
        return conj_page("it", "cond", 1, ["andare", "fare", "potere", "dovere", "vedere", "volere"], key, "condizionale", oth)
    if tid == "subjuntivo":
        if lang == "en":
            return HD(r, EN_SUBJ[page], 0, "subjen")
        if lang == "fr":
            if page == 0:
                key = ("subjonctif", "présent")
                oth = [("indicatif", "présent"), ("indicatif", "imparfait"), ("indicatif", "futur-simple"), ("conditionnel", "présent")]
                plan = [("finir", "tu"), ("attendre", "je"), ("venir", "vous"), ("aller", "il"), ("prendre", "nous"), ("boire", "tu")]
                return [citem(r, "fr", v, key, p, "subjuntivo", others=oth) for v, p in plan]
            out = []
            for q, v, p, why in FR_SUBJ_FRAMES:
                sub = prow("fr", v, ("subjonctif", "présent"), FRP)[p][1]
                ind = prow("fr", v, ("indicatif", "présent"), FRP)[p][1]
                fut = prow("fr", v, ("indicatif", "futur-simple"), FRP)[p][1]
                imp = prow("fr", v, ("indicatif", "imparfait"), FRP)[p][1]
                wr = [x for x in dict.fromkeys([ind, v, fut, imp]) if x != sub]
                assert len(wr) >= 3, (v, p, sub, wr)
                out.append(H(r, q, sub, wr, why + f" Subjuntivo de «{v}» com «{p}»: {sub}."))
            return out
        if page == 0:
            key = ("congiuntivo", "presente")
            oth = [("indicativo", "presente"), ("congiuntivo", "imperfetto"), ("indicativo", "futuro"), ("condizionale", "presente")]
            plan = [("parlare", "voi"), ("mettere", "io"), ("sentire", "tu"), ("essere", "io"), ("avere", "voi"), ("finire", "io")]
            return [citem(r, "it", v, key, p, "congiuntivo presente", others=oth) for v, p in plan]
        out = []
        for row in IT_SUBJ_H:
            VERIFY.extend(row[4])
            out.append(H(r, row[0], row[1], row[2], row[3]))
        return out
    if tid == "possessivos":
        d = {"fr": FR_POSS, "it": IT_POSS, "en": EN_POSS}[lang]
        return HD(r, d[page], 0, "poss" + lang)
    if tid == "conjuncoes":
        d = {"fr": FR_CONJ, "it": IT_CONJ, "en": EN_CONJ}[lang]
        return HD(r, d[page], 0, "conj" + lang)
    if tid == "adverbios":
        d = {"fr": FR_ADV, "it": IT_ADV, "en": EN_ADV}[lang]
        return HD(r, d[page], 0, "adv" + lang)
    if tid == "reflexivos":
        if lang == "en":
            return HD(r, EN_REFL[page], 0, "refl")
        if page == 0:
            spec = FR_REFL_VERBS if lang == "fr" else IT_REFL_VERBS
            key = ("indicatif", "présent") if lang == "fr" else ("indicativo", "presente")
            return conj_page(lang, "refl", 0, spec, key, "presente", None)
        return HD(r, FR_REFL_H if lang == "fr" else IT_REFL_H, 0, "reflh")
    if tid == "ordem":
        d = {"fr": FR_ORD, "it": IT_ORD, "en": EN_ORD}[lang]
        return HD(r, d[page], 0, "ord" + lang)
    raise KeyError(tid)


def build2():
    out = {}
    for lang in ("fr", "it", "en"):
        out[lang] = {}
        for tid, long_, short in TYPES2:
            pages = []
            for p in range(2):
                items = gen(lang, tid, p)
                assert len(items) == PER, (lang, tid, p, len(items))
                pages.append(items)
            out[lang][tid] = pages
    return out


def verify_forms():
    bad = []
    for lang, verb, key, person, exp in VERIFY:
        got = form(lang, verb, key, person)
        if got != exp:
            bad.append((lang, verb, key, person, exp, got))
    return bad


if __name__ == "__main__":
    G2 = build2()
    json.dump(G2, open("gram_items2.json", "w", encoding="utf8"), ensure_ascii=False, indent=0)
    n = sum(len(p) for l in G2.values() for t in l.values() for p in t)
    print("itens", n)
    bad = verify_forms()
    print("verificação das formas escritas à mão:", len(VERIFY), "conferidas;", "divergências:", bad)
