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
def wind(dark):
    random.seed(33);wa="#7fc3d6" if dark else "#2f7f94";rd="#9bd48a" if dark else "#4b8a3a";bt="#e0c58a" if dark else "#8a6a2c";o=[]
    for y in (430,480,530,580,630,680):
        o.append(f'<path d="M0 {y}Q50 {y-12} 100 {y}T200 {y}T300 {y}T400 {y}" fill="none" stroke="{wa}" stroke-width="1.6" opacity=".6"/>')
    for i in range(13):
        x=random.randint(10,390);h=random.randint(70,150);b=random.randint(-10,10)
        o.append(f'<path d="M{x} 800C{x+b} {800-h*.5} {x+b*2} {800-h*.8} {x+b*3} {800-h}" fill="none" stroke="{rd}" stroke-width="2.2" opacity=".6" stroke-linecap="round"/><ellipse cx="{x+b*3}" cy="{800-h-8}" rx="3" ry="9" fill="{rd}" opacity=".6"/>')
    for i in range(12):
        x,y=random.randint(20,380),random.randint(20,380);r=random.randint(0,180)
        o.append(f'<path transform="translate({x} {y}) rotate({r}) scale(1.6)" d="M0-9C4-4 4 4 0 9C-4 4-4-4 0-9Z" fill="{rd}" opacity=".45"/>')
    o.append(f'<g transform="translate(270 520)" opacity=".85" fill="none" stroke="{bt}" stroke-width="2.2" stroke-linecap="round"><path d="M-46-6H46L32 14H-32Z"/><path d="M-4-6V-50L26-14H-4"/></g>')
    return W("".join(o))
def sherlock(dark):
    random.seed(44);c="#e6c36a" if dark else "#7a5c1e";fg="#b9c4d6" if dark else "#4d5a73";o=[]
    for y in (120,230,350,470):
        o.append(f'<path d="M0 {y}Q70 {y-26} 150 {y}T300 {y}T400 {y}" fill="none" stroke="{fg}" stroke-width="10" opacity=".14" stroke-linecap="round"/>')
    for r in range(5):
        for k in range(6):
            x=k*70+(35 if r%2 else 0);y=640+r*32
            o.append(f'<ellipse cx="{x}" cy="{y}" rx="30" ry="14" fill="none" stroke="{fg}" stroke-width="1.4" opacity=".55"/>')
    o.append(f'<g transform="translate(290 250) rotate(-35)" fill="none" stroke="{c}" stroke-width="3" opacity=".85" stroke-linecap="round"><circle r="46"/><circle r="38" stroke-width="1"/><path d="M0 46V118" stroke-width="7"/></g>')
    o.append(f'<g transform="translate(90 520)" fill="none" stroke="{c}" stroke-width="2.4" opacity=".8" stroke-linecap="round"><circle cy="-10" r="12"/><path d="M-5 0L-9 30H9L5 0"/></g>')
    for x,y,s in ((60,70,6),(340,80,5)):o.append(star4(x,y,s,c))
    return W("".join(o))
def frank(dark):
    random.seed(55);bolt="#f4e07a" if dark else "#9a6b00";mo="#d8e0f0" if dark else "#4a5568";st="#8fa6c9" if dark else "#3e5278";o=[]
    for i in range(24):
        x,y=random.randint(10,390),random.randint(10,300);o.append(f'<circle cx="{x}" cy="{y}" r="{random.choice([1,1.3,1.8])}" fill="{mo}" opacity=".8"/>')
    o.append(f'<circle cx="300" cy="120" r="46" fill="{mo}" opacity=".25"/><circle cx="300" cy="120" r="46" fill="none" stroke="{mo}" stroke-width="1.6"/><circle cx="286" cy="108" r="7" fill="none" stroke="{mo}" opacity=".6"/><circle cx="312" cy="134" r="5" fill="none" stroke="{mo}" opacity=".6"/>')
    o.append(f'<path d="M120 0L96 170L132 170L100 330L170 130L134 130L160 0Z" fill="{bolt}" opacity=".7"/>')
    for k in range(5):
        x=k*80;o.append(f'<path d="M{x} 800V700Q{x+20} 640 {x+40} 700V800" fill="none" stroke="{st}" stroke-width="2" opacity=".7"/>')
    o.append(f'<path d="M0 560L60 540L120 560L180 530L240 555L300 525L360 550L400 540V800H0Z" fill="{st}" opacity=".18"/>')
    o.append(f'<path d="M30 580V470M30 470L10 440M30 470L50 440M30 500L8 480M30 500L52 480" stroke="{st}" stroke-width="2" fill="none" opacity=".6"/>')
    return W("".join(o))
def musq(dark):
    random.seed(66);c="#e3c26a" if dark else "#7a5c1e";b="#9db8e8" if dark else "#2d4a8a";o=[]
    for x,y,sc in ((100,150,1.3),(310,300,1.0),(120,520,1.1)):
        o.append(f'<g transform="translate({x} {y}) scale({sc})" fill="none" stroke="{c}" stroke-width="2.2" opacity=".8" stroke-linecap="round"><path d="M-42-42L42 42M42-42L-42 42"/><path d="M-50-30L-30-50M30 50L50 30M-50 30L-30 50M30-50L50-30"/><circle cx="-42" cy="-42" r="3.5"/><circle cx="42" cy="-42" r="3.5"/></g>')
    for x,y in ((300,110),(70,350),(330,560),(190,700)):
        o.append(f'<g transform="translate({x} {y})" fill="{b}" opacity=".6"><path d="M0-22C6-12 6-4 0 2C-6-4-6-12 0-22Z"/><path d="M-4 2C-18 0-22-10-16-18C-12-8-8-4-2 0Z"/><path d="M4 2C18 0 22-10 16-18C12-8 8-4 2 0Z"/><rect x="-10" y="4" width="20" height="4" rx="1"/></g>')
    o.append(f'<g transform="translate(250 690) rotate(-30)" fill="none" stroke="{c}" stroke-width="2" opacity=".8" stroke-linecap="round"><path d="M0 0C10-30 30-60 40-100C20-80 10-50 0 0Z"/><path d="M0 0L-8 24"/></g>')
    for x,y,s in ((50,60,6),(350,60,5),(200,420,5)):o.append(star4(x,y,s,c))
    return W("".join(o))
def principe(dark):
    random.seed(77);c="#e0b95a" if dark else "#7a5c1e";r="#d98a8a" if dark else "#8a2a2a";o=[]
    for x,y,sc in ((80,140,1.2),(300,260,1.0),(150,480,1.1)):
        o.append(f'<g transform="translate({x} {y}) scale({sc})" fill="none" stroke="{c}" stroke-width="2.2" opacity=".8" stroke-linejoin="round"><path d="M-40 40V-10H-30V-20H-20V-10H-8V-20H4V-10H16V-20H28V-10H40V40Z"/><path d="M-10 40V18Q0 6 10 18V40"/></g>')
    o.append(f'<g transform="translate(300 600)" fill="none" stroke="{c}" stroke-width="2.4" opacity=".85" stroke-linejoin="round"><path d="M-40 20L-46-20L-22 0L0-30L22 0L46-20L40 20Z"/><path d="M-40 28H40"/><circle cx="0" cy="-34" r="3" fill="{c}"/></g>')
    for i in range(10):
        x=30+i*36;y=700+(i%2)*14;o.append(f'<path transform="translate({x} {y}) rotate({-20+i*4})" d="M0 0C6-8 6-18 0-26C-6-18-6-8 0 0Z" fill="{r}" opacity=".45"/>')
    for x,y,s in ((60,60,6),(340,70,5),(200,330,5)):o.append(star4(x,y,s,c))
    return W("".join(o))
def dante(dark):
    random.seed(88);c="#f0d58a" if dark else "#7a4a00";fl="#f08a5a" if dark else "#b3411a";g="#a9b8e8" if dark else "#3a4a8a";o=[]
    for rx in (30,60,95,135,180):
        o.append(f'<circle cx="200" cy="180" r="{rx}" fill="none" stroke="{g}" stroke-width="1.4" opacity=".45"/>')
    for k in range(12):
        import math
        a=k*math.pi/6;o.append(f'<path d="M{200+math.cos(a)*30:.1f} {180+math.sin(a)*30:.1f}L{200+math.cos(a)*180:.1f} {180+math.sin(a)*180:.1f}" stroke="{c}" stroke-width="1" opacity=".3"/>')
    for i in range(30):
        x,y=random.randint(8,392),random.randint(8,420);o.append(f'<circle cx="{x}" cy="{y}" r="{random.choice([1,1.3,1.8])}" fill="{c}"/>')
    for x,y,s in ((200,180,10),(60,330,6),(340,350,7)):o.append(star4(x,y,s,c))
    for k in range(8):
        x=20+k*50;h=40+(k*37)%50
        o.append(f'<path d="M{x} 800C{x-14} {800-h*.5} {x+6} {800-h*.7} {x} {800-h}C{x+16} {800-h*.6} {x+12} {800-h*.3} {x+8} 800Z" fill="{fl}" opacity=".5"/>')
    return W("".join(o))
ST={"pp":pp,"alice":alice,"pino":pino,"verne":verne,"peter":peter,"wind":wind,"sherlock":sherlock,"frank":frank,"musq":musq,"principe":principe,"dante":dante}
ID={"pp":"pp","alice":"alice","pino":"pinocchio","verne":"verne","peter":"peter","wind":"wind","sherlock":"sherlock","frank":"frank","musq":"musq","principe":"principe","dante":"dante"}
fonts={"pp":"Newsreader","alice":"Newsreader","pino":"Newsreader","verne":"Newsreader","peter":"Newsreader","wind":"Newsreader","sherlock":"Newsreader","frank":"Newsreader","musq":"Newsreader","principe":"Newsreader","dante":"Newsreader"}
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
