"""Envia os lembretes de «Litteraria» (Web Push). Roda de hora em hora no GitHub Actions (.github/workflows/push.yml).
Lê as inscrições da caixa (Apps Script), manda a notificação de quem está na janela do horário escolhido e ainda não recebeu/estudou hoje.
Variáveis: SINK_KEY, VAPID_PRIVATE. O endereço da caixa vem de src/pushcfg.js. Uso: python3 push/send.py [--dry]"""
import os, re, sys, json, hashlib, datetime, urllib.request, urllib.parse
from urllib.parse import urlparse

DRY = "--dry" in sys.argv
FORCE = os.environ.get("FORCE") == "true" or "--force" in sys.argv  # teste: ignora janela de horário, «já enviado» e «já estudou»
NOTICE = os.environ.get("NOTICE", "").strip()[:140]  # aviso único (texto livre): vai a todos, uma vez, sem marcar «enviado hoje»
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
HOSTS = [r"^fcm\.googleapis\.com$", r"^updates\.push\.services\.mozilla\.com$", r"(^|\.)push\.apple\.com$", r"(^|\.)notify\.windows\.com$"]
MSGS = ["Cinco minutinhos de {L} hoje já contam.", "Uma lição curta agora vale mais do que uma longa que nunca começa.",
        "Quem treina pouco, mas sempre, chega longe. Vamos de {L}?", "Que tal uma palavra nova de {L} antes de dormir?",
        "Seu caderno de {L} está aberto. Uma página só?", "Uma pausa boa: uma lição de {L} e pronto.",
        "Errar faz parte. Venha treinar {L} um pouquinho.", "Hoje é um bom dia para um jogo de {L}.",
        "Uma frase de livro, uma lição, e o dia já rendeu.", "Revisar um pouco hoje evita esquecer amanhã."]
WINDOW = 2  # horas depois do horário escolhido em que ainda vale enviar (o GitHub pode atrasar a execução)


def sink_url():
    m = re.search(r'sink:"([^"]*)"', open(os.path.join(ROOT, "src", "pushcfg.js"), encoding="utf8").read())
    return m.group(1) if m else ""


def call(url, key, **q):
    q["k"] = key
    with urllib.request.urlopen(url + "?" + urllib.parse.urlencode(q), timeout=60) as r:
        return json.loads(r.read().decode("utf8"))


def host_ok(endpoint):
    p = urlparse(endpoint)
    return p.scheme == "https" and any(re.search(r, p.hostname or "") for r in HOSTS)


def message(row, day):
    if NOTICE:
        return {"t": "Litteraria", "b": NOTICE, "go": "hoje"}
    L = row.get("ln") or "idiomas"
    n = int(hashlib.sha256((day + row["id"]).encode()).hexdigest(), 16)
    if row["st"] == "calma":
        return {"t": "Litteraria", "b": "Quando puder, uma lição curta de " + L + ".", "go": "hoje"}
    return {"t": "📚 Hora de brincar com as palavras!", "b": MSGS[n % len(MSGS)].replace("{L}", L), "go": "hoje"}


def due(row, now):
    if FORCE or NOTICE:
        return True, (now - datetime.timedelta(minutes=int(row["tz"]))).strftime("%Y-%m-%d")
    local = now - datetime.timedelta(minutes=int(row["tz"]))
    day = local.strftime("%Y-%m-%d")
    h = int(row["h"])
    return (h <= local.hour <= h + WINDOW and row.get("sent") != day and row.get("done") != day), day


def keepalive(now):
    """Uma consulta por dia ao Supabase, para o projeto gratuito não ser pausado por inatividade (se a conta na nuvem estiver ligada)."""
    try:
        t = open(os.path.join(ROOT, "src", "nuvemcfg.js"), encoding="utf8").read()
        u = re.search(r'url:"([^"]*)"', t).group(1); k = re.search(r'key:"([^"]*)"', t).group(1)
    except Exception:
        return
    if not (u and k) or (now.hour != 12 and not FORCE):
        return
    try:
        req = urllib.request.Request(u + "/rest/v1/rpc/ping", data=b"{}", method="POST",
                                     headers=dict({"apikey": k, "content-type": "application/json"}, **({"authorization": "Bearer " + k} if k.startswith("eyJ") else {})))
        with urllib.request.urlopen(req, timeout=30) as r:
            print("ping Supabase:", r.status)
    except Exception as e:
        print("ping Supabase falhou:", str(e)[:100])


def main():
    keepalive(datetime.datetime.utcnow())
    url, key = sink_url(), os.environ.get("SINK_KEY", "")
    if not url:
        print("caixa de inscrições ainda não configurada; nada a fazer"); return 0
    rows = call(url, key, a="list").get("rows", [])
    now = datetime.datetime.utcnow()
    sent = skipped = gone = 0
    for row in rows:
        ok, day = due(row, now)
        if not ok:
            skipped += 1; continue
        try:
            sub = json.loads(row["sub"])
        except Exception:
            call(url, key, a="del", id=row["id"]); gone += 1; continue
        if not host_ok(sub.get("endpoint", "")):
            call(url, key, a="del", id=row["id"]); gone += 1; continue
        if DRY:
            print("enviaria", row["id"][:8], message(row, day)); sent += 1; continue
        from pywebpush import webpush, WebPushException
        try:
            webpush(sub, json.dumps(message(row, day), ensure_ascii=False), vapid_private_key=os.environ["VAPID_PRIVATE"],
                    vapid_claims={"sub": "mailto:calisants@users.noreply.github.com"}, ttl=6 * 3600, headers={"Urgency": "normal"})
            if not (FORCE or NOTICE):
                call(url, key, a="mark", id=row["id"], d=day)
            sent += 1
        except WebPushException as e:
            code = getattr(e.response, "status_code", 0)
            if code in (404, 410):
                call(url, key, a="del", id=row["id"]); gone += 1
            else:
                print("falha", row["id"][:8], code, str(e)[:120])
    print("enviados", sent, "| fora da janela/já feitos", skipped, "| removidos", gone)
    return 0


if __name__ == "__main__":
    sys.exit(main())
