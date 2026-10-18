"""Gera os papéis de parede (SVG original em data-URI) dos estilos de livro e reescreve o bloco entre
/* BEGIN wallpapers */ e /* END wallpapers */ em ../p1.html. Desenhos genéricos: nenhum personagem nem ilustração dos livros.
Uso (em src/tools): python3 -I mk_wallpapers.py"""
import random,urllib.parse,re
def uri(s):return "data:image/svg+xml,"+urllib.parse.quote(s,safe="/:=\" ").replace('"',"%22").replace(" ","%20")
W=lambda body:f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">{body}</svg>'
def star4(x,y,s,c):return f'<path d="M{x} {y-s}L{x+s*.28} {y-s*.28}L{x+s} {y}L{x+s*.28} {y+s*.28}L{x} {y+s}L{x-s*.28} {y+s*.28}L{x-s} {y}L{x-s*.28} {y-s*.28}Z" fill="{c}"/>'
def pp(dark):
    random.seed(7);star="#f6e7a6" if dark else "#c9a227";g="#e7b94a" if dark else "#d9b44a";o=[]
    for i in range(46):o.append(f'<circle cx="{random.randint(8,392)}" cy="{random.randint(8,560)}" r="{random.choice([1,1,1.4,1.8])}" fill="{star}"/>')
    for x,y,s in ((70,90,7),(318,150,9),(210,250,6),(110,420,8)):o.append(star4(x,y,s,star))
    o.append(f'<circle cx="300" cy="700" r="120" fill="{g}" opacity=".55"/><path d="M300 580V556" stroke="{g}" stroke-width="3" fill="none"/><circle cx="300" cy="550" r="7" fill="{star}"/>')
    for k in range(9):x=40+k*18;o.append(f'<path d="M{x} 800Q{x-4} 770 {x+3} 748" stroke="{g}" stroke-width="2.2" fill="none" opacity=".6"/>')
    return W("".join(o))
def alice(dark):
    random.seed(11);c1="#ff7fa3" if dark else "#b4204f";c2="#9fd6dc" if dark else "#2f7480";o=[]
    P={"h":"M0 3C-7-2-4-7 0-3C4-7 7-2 0 3Z","d":"M0-5L4 0L0 5L-4 0Z","s":"M0-5C-6 0-5 3-1 2L-1 5L1 5L1 2C5 3 6 0 0-5Z"}
    for i in range(16):
        x,y=random.randint(20,380),random.randint(20,640);k=random.choice("hds");sc=random.choice([1.6,2,2.6]);r=random.randint(-25,25)
        col=c1 if k in "hd" else c2
        o.append(f'<path transform="translate({x} {y}) rotate({r}) scale({sc})" d="{P[k]}" fill="{col}" opacity=".7"/>')
    for i in range(6):
        x,y=random.randint(30,370),random.randint(30,620);sc=random.choice([1.6,2.2])
        o.append(f'<g transform="translate({x} {y}) scale({sc})" fill="{c2}" opacity=".7"><circle cx="0" cy="-3" r="2.2"/><circle cx="-3" cy="0" r="2.2"/><circle cx="3" cy="0" r="2.2"/><rect x="-.8" y="0" width="1.6" height="5"/></g>')
    # relógio de bolso genérico
    o.append(f'<g transform="translate(300 640)" fill="none" stroke="{c1}" stroke-width="3" opacity=".75"><circle r="46"/><circle r="40" stroke-width="1.2"/><path d="M0 0V-26M0 0L18 8" stroke-linecap="round"/><circle cy="-56" r="6"/></g>')
    # tabuleiro no rodapé
    for r in range(2):
        for k in range(14):
            if (r+k)%2==0:o.append(f'<rect x="{k*30}" y="{740+r*30}" width="30" height="30" fill="{c2}" opacity=".45"/>')
    return W("".join(o))
def pino(dark):
    random.seed(5);w="#d6a35c" if dark else "#8a5a2b";r="#f2b24c" if dark else "#a8321e";o=[]
    for i in range(22):
        y=20+i*36+random.randint(-6,6);a=random.randint(8,26);o.append(f'<path d="M-10 {y}C100 {y-a} 200 {y+a} 410 {y-a/2}" stroke="{w}" stroke-width="1.6" fill="none" opacity=".4"/>')
    for x,y in ((90,140),(310,330),(140,560)):o.append(f'<ellipse cx="{x}" cy="{y}" rx="16" ry="9" fill="none" stroke="{w}" stroke-width="2" opacity=".55"/><ellipse cx="{x}" cy="{y}" rx="8" ry="4.5" fill="none" stroke="{w}" stroke-width="1.5" opacity=".55"/>')
    for x,y,s in ((330,90,8),(60,330,7),(220,470,9),(350,600,7)):o.append(star4(x,y,s,r))
    o.append(f'<g transform="translate(95 690)" stroke="{r}" fill="none" stroke-width="2.4" opacity=".8"><path d="M0 0C10-30 30-40 40-70M40 0C38-30 52-45 58-70"/><circle cx="0" cy="6" r="10" fill="{r}" fill-opacity=".5"/><circle cx="40" cy="6" r="10" fill="{r}" fill-opacity=".5"/></g>')
    o.append(f'<path d="M280 740C300 700 340 720 320 750C300 775 270 750 290 735C305 725 322 738 312 748" stroke="{w}" stroke-width="3" fill="none" opacity=".6"/>')
    return W("".join(o))
def verne(dark):
    c="#d9b04a" if dark else "#7a5c1e";b="#7fb7d6" if dark else "#0b5a7a";o=[]
    for rx in (40,100,160,215):o.append(f'<ellipse cx="200" cy="330" rx="{rx}" ry="215" fill="none" stroke="{b}" stroke-width="1.2" opacity=".35"/>')
    for ry in (60,130,200):o.append(f'<ellipse cx="200" cy="330" rx="215" ry="{ry}" fill="none" stroke="{b}" stroke-width="1.2" opacity=".35"/>')
    o.append(f'<path d="M20 600C90 480 140 560 200 430S320 300 380 150" stroke="{c}" stroke-width="2.4" stroke-dasharray="3 7" fill="none" opacity=".85" stroke-linecap="round"/>')
    for x,y in ((20,600),(200,430),(380,150)):o.append(f'<circle cx="{x}" cy="{y}" r="5" fill="{c}"/>')
    o.append(f'<g transform="translate(300 690)" opacity=".85"><circle r="52" fill="none" stroke="{c}" stroke-width="2"/><circle r="44" fill="none" stroke="{c}" stroke-width="1"/><path d="M0-48L8-8L48 0L8 8L0 48L-8 8L-48 0L-8-8Z" fill="{c}" opacity=".6"/><path d="M0-48L4-4L-4-4Z" fill="{b}"/></g>')
    o.append(f'<g transform="translate(70 700)" fill="none" stroke="{c}" stroke-width="2.4" opacity=".8"><circle r="26"/><path d="M0 0V-16M0 0L11 6" stroke-linecap="round"/></g>')
    for x,y,s in ((60,90,7),(330,60,6),(120,250,5)):o.append(star4(x,y,s,c))
    return W("".join(o))
def peter(dark):
    random.seed(21);car="#f2a65a" if dark else "#c4631a";g="#8fcf8a" if dark else "#3f7d3a";w="#e8dfc8" if dark else "#8a7a55";o=[]
    for i in range(11):
        x,y=random.randint(30,370),random.randint(30,600);sc=random.choice([1.0,1.3,1.7]);r=random.randint(-30,30)
        o.append(f'<g transform="translate({x} {y}) rotate({r}) scale({sc})" opacity=".7"><path d="M-5 0H5L0 26Z" fill="{car}"/><path d="M0 0C-8-10-10-14-9-18M0 0C0-10 0-16 0-22M0 0C8-10 10-14 9-18" stroke="{g}" stroke-width="2.2" fill="none" stroke-linecap="round"/></g>')
    for i in range(7):
        x,y=random.randint(30,370),random.randint(30,600);sc=random.choice([1.2,1.6])
        o.append(f'<g transform="translate({x} {y}) scale({sc})" fill="none" stroke="{g}" stroke-width="1.6" opacity=".65"><circle r="9"/><path d="M-6-2C-2-8 4-8 6-2M-5 3C-1-3 3-3 5 3"/></g>')
    for i in range(14):
        x,y=random.randint(20,380),random.randint(20,640);r=random.randint(0,180);o.append(f'<path transform="translate({x} {y}) rotate({r}) scale(1.5)" d="M0-6C5-3 5 3 0 6C-5 3-5-3 0-6Z" fill="{g}" opacity=".5"/>')
    for k in range(14):
        x=k*30+8;o.append(f'<path d="M{x} 800V736L{x+7} 726L{x+14} 736V800" fill="none" stroke="{w}" stroke-width="2" opacity=".7"/>')
    o.append(f'<path d="M0 752H400M0 784H400" stroke="{w}" stroke-width="2" opacity=".7"/>')
    for x,y in ((330,690),(70,660)):o.append(f'<g transform="translate({x} {y})" opacity=".8"><path d="M0 0C-14 4-14 22 0 26C14 22 14 4 0 0Z" fill="{car}" fill-opacity=".35" stroke="{car}" stroke-width="1.6"/></g>')
    return W("".join(o))
ST={"pp":pp,"alice":alice,"pino":pino,"verne":verne,"peter":peter}
ID={"pp":"pp","alice":"alice","pino":"pinocchio","verne":"verne","peter":"peter"}
fonts={"pp":"Newsreader","alice":"Newsreader","pino":"Newsreader","verne":"Newsreader","peter":"Newsreader"}
css=["/* BEGIN wallpapers */"]
for k,f in ST.items():
    i=ID[k]
    css.append(f':root[data-style="{i}"]{{--radius:16px;--bw:1px;--font-title:"Newsreader",Georgia,serif;--font-body:"Atkinson Hyperlegible",system-ui,sans-serif}}')
    css.append(f':root[data-style="{i}"] body::before{{content:"";position:fixed;inset:0;z-index:-1;pointer-events:none;opacity:.55;background:url("{uri(f(False))}") center/cover no-repeat}}')
    css.append(f':root[data-style="{i}"][data-appmode="dark"] body::before{{opacity:.8;background-image:url("{uri(f(True))}")}}')
    css.append(f':root[data-style="{i}"] .tile,:root[data-style="{i}"] .rule,:root[data-style="{i}"] .stats{{box-shadow:0 2px 14px -6px color-mix(in srgb,var(--accent) 50%,transparent)}}')
    css.append(f':root[data-style="{i}"] .hero .brand{{font-weight:500;letter-spacing:.02em}}')
    css.append(f':root[data-style="{i}"] .lab,:root[data-style="{i}"] .stats h3{{letter-spacing:.14em}}')
css.append("/* END wallpapers */")
p="../p1.html";s=open(p,encoding="utf8").read()
blk="\n".join(css)
if "/* BEGIN wallpapers */" in s:s=re.sub(r"/\* BEGIN wallpapers \*/.*?/\* END wallpapers \*/",lambda m:blk,s,flags=re.S)
else:
    a=s.index(':root[data-style="pp"]{');e=s.index("/* Soft */")
    s=s[:a]+blk+"\n"+s[e:]
open(p,"w",encoding="utf8").write(s);print("ok",len(blk))
