"""Páginas novas de gramática SÓ do inglês, conferidas no Cambridge Grammar of English (Carter e McCarthy, 2006; PDF no Drive da Camila).
Gera gram_items4.json (usado por mk_content5.py). Frases dos exercícios escritas por Claude com os fatos do livro; nada copiado.
Rode dentro de tools/:  python3 gram_en_cam.py"""
import json, random

def mk(topic, rows):
    r = random.Random("cam|" + topic)
    out = []
    for q, ans, others, why, full in rows:
        opts = [ans] + others
        r.shuffle(opts)
        out.append({"q": q, "o": opts, "a": opts.index(ans), "w": why, "s": full, "k": full})
    return out

PREP2 = [
 [  # above / over / below / under
  ("You can only buy a ticket if you are ___ 18.", "under", ["below", "above", "among"],
   "Com idade, usa-se «under» (e «over» para mais). «Below» não se usa para a idade de alguém.", "You can only buy a ticket if you are under 18."),
  ("You can only enter the club if you are ___ 18.", "over", ["above", "among", "between"],
   "«Above» normalmente não se usa com números; com idade e quantidade usa-se «over».", "You can only enter the club if you are over 18."),
  ("He put a thick vest ___ his jacket.\n(a roupa fica encostada, por baixo)", "under", ["below", "above", "among"],
   "«Under» é a escolha quando uma coisa toca, cobre ou esconde a outra. «Below» é para um nível mais baixo, sem tocar.", "He put a thick vest under his jacket."),
  ("He put a raincoat ___ his jacket.\n(a capa cobre a jaqueta, encostada)", "over", ["above", "below", "among"],
   "«Above» só vale quando NÃO há contato. Se uma coisa cobre a outra, usa-se «over» (ou «on top of»).", "He put a raincoat over his jacket."),
  ("It was already several degrees ___ zero.", "below", ["above", "among", "during"],
   "«Below» também fala de níveis mais baixos em números e medidas (below zero, below average).", "It was already several degrees below zero."),
  ("As we can see from the ___ figures, profits will be lower.", "above", ["below", "under", "beneath"],
   "«The above» pode vir antes do substantivo para o texto já mencionado (the above figures). «The below» não é possível assim.", "As we can see from the above figures, profits will be lower."),
 ],
 [  # between / among / during / while / for / since
  ("She lived in Japan ___ 1994 and 2000.", "between", ["among", "during", "since"],
   "«Between» liga dois pontos, como dois anos. «Among» não faz isso.", "She lived in Japan between 1994 and 2000."),
  ("I found my old letter ___ my books.", "among", ["between", "during", "above"],
   "«Among» é para algo no meio de um grupo ou de uma massa de coisas, sem separação clara. Vem com plural.", "I found my old letter among my books."),
  ("You are not allowed to smoke ___ the flight.", "during", ["for", "since", "while"],
   "«During» liga-se a um evento ou período (the flight). Não se usa para começar uma frase com verbo.", "You are not allowed to smoke during the flight."),
  ("I've been here ___ three weeks.", "for", ["during", "since", "between"],
   "«For» + período de tempo (three weeks). «During» não vai com números de tempo.", "I've been here for three weeks."),
  ("I haven't seen Paul ___ the wedding.", "since", ["for", "during", "while"],
   "«Since» marca o ponto no tempo em que algo começou (o casamento) e vale até agora. «For» é para quanto tempo durou.", "I haven't seen Paul since the wedding."),
  ("Geoff phoned ___ you were walking the dog.", "while", ["during", "between", "since"],
   "Antes de uma oração (sujeito + verbo) usa-se «while». «During» é preposição e vem com substantivo.", "Geoff phoned while you were walking the dog."),
 ],
]

CONF = [
 [
  ("Have you booked a flight ___?\n(Você não sabe se ela já fez até agora.)", "yet", ["already", "specially", "quiet"],
   "«Yet» pergunta se algo aconteceu até este momento. «Already» passa a ideia de «tão cedo!».", "Have you booked a flight yet?"),
  ("There are ten people here ___.\n(mais do que se esperava neste horário)", "already", ["yet", "especially", "quiet"],
   "«Already» fala de algo que aconteceu antes do esperado.", "There are ten people here already."),
  ("I like all fruit, ___ mangoes.", "especially", ["specially", "quiet", "already"],
   "«Especially» significa «principalmente, acima de tudo».", "I like all fruit, especially mangoes."),
  ("All claims are read by ___ trained staff.\n(treinados de propósito para isso)", "specially", ["especially", "yet", "quiet"],
   "«Specially» mostra a intenção por trás de uma ação. «Especially» é «principalmente».", "All claims are read by specially trained staff."),
  ("It's ___ cold today.", "quite", ["quiet", "quote", "quit"],
   "«Quite» (bastante) e «quiet» (quieto) têm grafia parecida, mas são palavras diferentes.", "It's quite cold today."),
  ("We sat ___ each other at the table, face to face.", "opposite", ["in front of", "behind", "among"],
   "«Opposite» é de frente um para o outro (A olha para B). «In front of» é quando um está atrás do outro.", "We sat opposite each other at the table, face to face."),
 ],
 [
  ("I'm going on holiday ___ a month.\n(Viajo daqui a um mês.)", "in", ["for", "since", "during"],
   "«In a month» é daqui a um mês. A viagem de um mês de duração seria «for a month».", "I'm going on holiday in a month."),
  ("I'm going on holiday ___ a month.\n(A viagem dura um mês.)", "for", ["in", "since", "during"],
   "«For» + período de tempo diz quanto tempo dura. «In a month» marcaria o início daqui a um mês.", "I'm going on holiday for a month."),
  ("We moved because the hotel was not ___ good.", "very", ["quiet", "quite", "during"],
   "Em frases negativas, o erro comum é usar «not quite good» no lugar de «not very good».", "We moved because the hotel was not very good."),
  ("___ they get more experience, their tactics will improve.\n(duas coisas que mudam juntas)", "As", ["While", "During", "Since"],
   "Para duas situações que mudam em paralelo, usa-se «as», não «while».", "As they get more experience, their tactics will improve."),
  ("A tall man sat ___ me, so I couldn't see the screen.", "in front of", ["opposite", "among", "over"],
   "«In front of» = ele estava na minha frente, na mesma direção (eu olhava a nuca dele). «Opposite» seria de frente, olho no olho.", "A tall man sat in front of me, so I couldn't see the screen."),
  ("I've been here ___ three weeks ago.", "since", ["for", "during", "while"],
   "«Since three weeks ago» marca o ponto no passado em que começou. «For three weeks» dá a duração.", "I've been here since three weeks ago."),
 ],
]

if __name__ == "__main__":
    d = {"en": {"prep2": [mk("prep2%d" % i, p) for i, p in enumerate(PREP2)],
                "confusas": [mk("conf%d" % i, p) for i, p in enumerate(CONF)]}}
    for t in d["en"].values():
        for pg in t:
            assert len(pg) == 6
            for it in pg:
                assert it["o"][it["a"]] and "___" in it["q"]
                ans = it["o"][it["a"]]
                assert ans.lower() in it["k"].lower(), it
    json.dump(d, open("gram_items4.json", "w", encoding="utf8"), ensure_ascii=False, indent=0)
    print("ok", {k: len(v) for k, v in d["en"].items()})
