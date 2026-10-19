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







import math
def defs(*g):return "<defs>"+"".join(g)+"</defs>"
def lg(i,c1,c2,x2=0,y2=1):return f'<linearGradient id="{i}" x1="0" y1="0" x2="{x2}" y2="{y2}"><stop offset="0" stop-color="{c1}"/><stop offset="1" stop-color="{c2}"/></linearGradient>'
def rg(i,c,op0=.9):return f'<radialGradient id="{i}"><stop offset="0" stop-color="{c}" stop-opacity="{op0}"/><stop offset="1" stop-color="{c}" stop-opacity="0"/></radialGradient>'
def ridge(y,amp,seed,col,op=1,n=7):
    r=random.Random(seed);pts=[(i*400/n,y+r.uniform(-amp,amp)) for i in range(n+1)]
    d=f"M0 800V{pts[0][1]:.1f}"
    for i in range(1,len(pts)):
        x0,y0=pts[i-1];x1,y1=pts[i];d+=f"C{x0+(x1-x0)/2:.1f} {y0:.1f} {x0+(x1-x0)/2:.1f} {y1:.1f} {x1:.1f} {y1:.1f}"
    return f'<path d="{d}V800Z" fill="{col}" opacity="{op}"/>'
def wind(dark):
    r=random.Random(11)
    sk1,sk2=("#0b1f2b","#1f4a57") if dark else ("#bfe3ea","#f6f3d8")
    gl="#ffd27a" if dark else "#fff3b0";hill1,hill2=("#16384a","#1d4d56") if dark else ("#a6d0c0","#8fc4a8")
    wat1,wat2=("#143a4a","#0c2430") if dark else ("#9fd3df","#6fb5c8");gr="#8fd08a" if dark else "#3f8a45";gr2="#5fae6a" if dark else "#2c6e38"
    ln="#c9efe9" if dark else "#ffffff";tr="#3a2a1c" if dark else "#5a4630";bt="#e0c58a" if dark else "#7a5a2a"
    o=[defs(lg("s",sk1,sk2),lg("w",wat1,wat2),rg("g",gl))]
    o.append('<rect width="400" height="800" fill="url(#s)"/>')
    o.append('<circle cx="300" cy="190" r="120" fill="url(#g)"/><circle cx="300" cy="190" r="26" fill="%s" opacity=".9"/>'%gl)
    for i in range(14):
        x,y=r.randint(10,380),r.randint(40,230);o.append(f'<path d="M{x} {y}q8 -6 16 0q8 -6 16 0" stroke="{ln}" stroke-width="1.4" fill="none" opacity=".55"/>')
    o.append(ridge(400,26,3,hill1,.8));o.append(ridge(430,22,5,hill2,.9))
    # willow
    o.append(f'<path d="M62 560C70 480 54 420 74 330C84 290 96 270 104 250C94 280 100 300 92 340C80 420 98 480 96 560Z" fill="{tr}" stroke="{tr}" stroke-width="3"/>')
    for i in range(34):
        x0=r.uniform(40,170);y0=r.uniform(225,290);L=r.uniform(170,300);dx=r.uniform(-30,16)
        o.append(f'<path d="M{x0:.0f} {y0:.0f}C{x0+dx:.0f} {y0+L*.4:.0f} {x0+dx*1.6:.0f} {y0+L*.75:.0f} {x0+dx*1.4:.0f} {y0+L:.0f}" stroke="{gr if i%2 else gr2}" stroke-width="{r.choice([1.2,1.6,2])}" fill="none" stroke-linecap="round" opacity=".85"/>')
        for k in range(1,8):
            t=k/8;px=x0+dx*1.4*t;py=y0+L*t;o.append(f'<path d="M{px:.0f} {py:.0f}q5 -9 11 -4q-4 8 -11 4Z" fill="{gr}" opacity=".7"/>')
    o.append('<rect y="500" width="400" height="300" fill="url(#w)"/>')
    for y in range(512,800,22):
        o.append(f'<path d="M0 {y}q50 -9 100 0t100 0t100 0t100 0" stroke="{ln}" stroke-width="1.3" fill="none" opacity=".4"/>')
    for k in range(9):
        o.append(f'<path d="M300 {520+k*22}h{36-k*3}" stroke="{gl}" stroke-width="2.4" opacity=".7" stroke-linecap="round"/>')
    # boat
    o.append(f'<g transform="translate(230 600)"><path d="M0 0h96q-12 24 -40 24h-20q-28 0 -36 -24Z" fill="{bt}"/><path d="M0 0h96" stroke="{tr}" stroke-width="3"/><path d="M26 -2L70 -34" stroke="{tr}" stroke-width="3" stroke-linecap="round"/></g>')
    # lilies
    for x,y in ((60,690),(120,720),(330,700),(350,760)):
        o.append(f'<ellipse cx="{x}" cy="{y}" rx="26" ry="8" fill="{gr}" opacity=".8"/><circle cx="{x+6}" cy="{y-4}" r="5" fill="#f9c6d8"/>')
    # reeds
    for i in range(16):
        x=r.choice([r.randint(0,110),r.randint(300,400)]);h=r.randint(140,260)
        o.append(f'<path d="M{x} 800C{x+8} {800-h*.5:.0f} {x-6} {800-h*.8:.0f} {x+4} {800-h}" stroke="{gr2}" stroke-width="2.4" fill="none" stroke-linecap="round"/>')
        if i%3==0:o.append(f'<rect x="{x+2}" y="{800-h-40}" width="7" height="34" rx="3.5" fill="{tr}" transform="rotate(4 {x+4} {800-h})"/>')
    for x,y in ((190,420),(150,360),(330,330)):
        o.append(f'<g transform="translate({x} {y})" stroke="{ln}" fill="none" stroke-width="1.2" opacity=".8"><path d="M0 0h18M9 0v-3"/><ellipse cx="-6" cy="-4" rx="8" ry="3" opacity=".7"/><ellipse cx="22" cy="-4" rx="8" ry="3" opacity=".7"/></g>')
    return W("".join(o))
def sherlock(dark):
    r=random.Random(22)
    sk1,sk2=("#0e1018","#30344a") if dark else ("#d8d5cf","#f3efe6")
    hs=("#1a1c28","#232736","#2b3044") if dark else ("#8e8a84","#a8a39b","#bdb8ae")
    win="#ffd877" if dark else "#f6c453";fg="#aeb8cc" if dark else "#ffffff";lamp="#ffdf8a" if dark else "#e9a93a";st="#3a3f55" if dark else "#7a766e"
    o=[defs(lg("s",sk1,sk2),rg("lg",lamp,.85),rg("mo","#f2efe0" if dark else "#fff8dc",.9))]
    o.append('<rect width="400" height="800" fill="url(#s)"/>')
    o.append('<circle cx="320" cy="110" r="90" fill="url(#mo)"/><circle cx="320" cy="110" r="30" fill="%s" opacity=".95"/>'%("#f6f1dc" if dark else "#fff3c4"))
    # rows of townhouses
    x=-10
    for lvl,(base,hh,col,wop) in enumerate(((470,230,hs[0],.5),(520,260,hs[1],.8),(580,290,hs[2],1))):
        x=-20+lvl*14
        while x<420:
            w=r.randint(60,92);h=hh+r.randint(-30,40);y=base-h+(800-base)*0+ (base-hh)*0
            top=base+ (800-base)*0 - h
            o.append(f'<rect x="{x}" y="{top}" width="{w}" height="{800-top}" fill="{col}"/>')
            o.append(f'<path d="M{x-4} {top}L{x+w/2} {top-26}L{x+w+4} {top}Z" fill="{col}"/>')
            for cx in (x+w*.2,x+w*.62):
                o.append(f'<rect x="{cx:.0f}" y="{top-48}" width="8" height="26" fill="{col}"/><rect x="{cx-2:.0f}" y="{top-52}" width="12" height="5" fill="{col}"/>')
            for ry in range(int(top)+24,int(base)+60,40):
                for cx in (x+w*.2,x+w*.6):
                    lit=r.random()<.45*wop
                    o.append(f'<rect x="{cx:.0f}" y="{ry}" width="14" height="22" rx="1.5" fill="{win if lit else st}" opacity="{.95 if lit else .35}"/>')
            x+=w+r.randint(2,8)
    o.append(f'<rect y="640" width="400" height="160" fill="{hs[2]}" opacity=".0"/>')
    # fog bands
    for y,op in ((330,.28),(450,.34),(560,.4),(660,.45)):
        o.append(f'<path d="M-20 {y}q60 -26 120 0t120 0t120 0t120 0V{y+70}H-20Z" fill="{fg}" opacity="{op}"/>')
    # cobbles
    for row in range(8):
        y=690+row*14
        for k in range(-1,9):
            xx=k*52+(26 if row%2 else 0);o.append(f'<ellipse cx="{xx}" cy="{y}" rx="24" ry="6" fill="none" stroke="{st}" stroke-width="1.4" opacity=".7"/>')
    # gas lamp
    o.append(f'<circle cx="86" cy="430" r="130" fill="url(#lg)"/>')
    o.append(f'<g stroke="{st if not dark else "#10121a"}" fill="none" stroke-width="5" stroke-linecap="round"><path d="M86 700V470"/><path d="M70 700H102M76 690H96"/></g>')
    o.append(f'<path d="M70 470L66 430H106L102 470Z" fill="{lamp}" stroke="#10121a" stroke-width="3"/><path d="M62 430L86 408L110 430Z" fill="#10121a"/><circle cx="86" cy="402" r="4" fill="#10121a"/>')
    # smoke curls
    for i in range(3):
        o.append(f'<path d="M{150+i*90} {250-i*30}q-18 -22 0 -44q18 -22 0 -44" stroke="{fg}" stroke-width="3" fill="none" opacity=".45" stroke-linecap="round"/>')
    return W("".join(o))
def frank(dark):
    r=random.Random(33)
    sk1,sk2=("#06070e","#262c44") if dark else ("#aeb4c6","#dfe2ea")
    cl=("#1c2136","#2b3250","#39425f") if dark else ("#8c93a8","#a3a9bb","#c2c6d2")
    bolt="#fff6b0" if dark else "#e7a70e";mo="#e9edf8" if dark else "#fffbe4";sil="#080a12" if dark else "#3a3f55";wl="#ffd877" if dark else "#f2b84b"
    o=[defs(lg("s",sk1,sk2),rg("mo",mo,.8),rg("bg",bolt,.7))]
    o.append('<rect width="400" height="800" fill="url(#s)"/>')
    o.append('<circle cx="290" cy="170" r="110" fill="url(#mo)"/><circle cx="290" cy="170" r="42" fill="%s"/>'%mo)
    o.append(f'<circle cx="276" cy="158" r="8" fill="none" stroke="{cl[1]}" opacity=".5"/><circle cx="304" cy="186" r="6" fill="none" stroke="{cl[1]}" opacity=".5"/>')
    for i,(y,c) in enumerate(((150,cl[0]),(250,cl[1]),(340,cl[2]))):
        d=f"M-20 {y}"
        for k in range(6):d+=f"q40 -{r.randint(30,60)} 80 -{r.randint(0,10)}q20 -{r.randint(10,30)} 40 0"
        o.append(f'<path d="M-20 {y+30}c40 -60 90 -30 120 -50c30 -30 80 -30 110 -4c40 -30 90 -10 110 30c30 -10 60 10 60 40V{y+120}H-20Z" fill="{c}" opacity=".85"/>')
    # lightning
    def bolt_path(x,y,ln):
        pts=[(x,y)];
        for k in range(ln):
            x+=r.randint(-26,22);y+=r.randint(26,46);pts.append((x,y))
        return pts
    for bx in (110,230):
        pts=bolt_path(bx,170,9);d="M"+"L".join(f"{a} {b}" for a,b in pts)
        o.append(f'<circle cx="{pts[-1][0]}" cy="{pts[-1][1]}" r="50" fill="url(#bg)"/><path d="{d}" stroke="{bolt}" stroke-width="5" fill="none" stroke-linejoin="round"/><path d="{d}" stroke="#ffffff" stroke-width="1.6" fill="none"/>')
        a=pts[4];o.append(f'<path d="M{a[0]} {a[1]}l22 24l-6 30" stroke="{bolt}" stroke-width="3" fill="none"/>')
    # cliff + castle
    o.append(f'<path d="M0 800V600Q60 560 110 580Q170 520 260 560Q330 520 400 560V800Z" fill="{sil}"/>')
    o.append(f'<g fill="{sil}"><rect x="210" y="430" width="120" height="140"/><rect x="198" y="360" width="34" height="210"/><rect x="304" y="380" width="30" height="190"/><path d="M194 360L215 318L236 360Z"/><path d="M300 380L319 344L338 380Z"/><rect x="250" y="400" width="40" height="40"/><path d="M246 400L270 372L294 400Z"/><rect x="214" y="420" width="108" height="8"/></g>')
    for x,y,w,h in ((210,380,8,16),(316,404,7,14),(262,408,10,18),(236,470,9,16),(290,470,9,16)):
        o.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="3" fill="{wl}"/>')
    # dead trees
    def tree(x,y,s):
        return f'<g stroke="{sil}" stroke-width="{3*s}" stroke-linecap="round" fill="none"><path d="M{x} {y}V{y-90*s}"/><path d="M{x} {y-40*s}l-26 -30s"/><path d="M{x} {y-60*s}l30 -34s"/><path d="M{x} {y-80*s}l-14 -24s"/><path d="M{x-26*s} {y-70*s}l-10 -14s"/></g>'
    o.append(tree(60,620,1.3)+tree(140,640,1)+tree(360,640,.9))
    # waves
    o.append(f'<rect y="680" width="400" height="120" fill="{sil}"/>')
    for y in range(690,800,14):o.append(f'<path d="M0 {y}q25 -8 50 0t50 0t50 0t50 0t50 0t50 0t50 0t50 0" stroke="{mo}" stroke-width="1.2" fill="none" opacity=".35"/>')
    for i in range(22):
        x,y=r.randint(0,400),r.randint(2,70);o.append(f'<path d="M{x} {y}v22" stroke="{mo}" stroke-width=".8" opacity=".35"/>')
    return W("".join(o))
def fleur(x,y,s,c,op=1):
    return f'<g transform="translate({x} {y}) scale({s})" fill="{c}" opacity="{op}"><path d="M0-22C8-12 8-2 0 6C-8-2-8-12 0-22Z"/><path d="M-3 4C-18 4-24-10-16-20C-14-10-8-6-3-6Z"/><path d="M3 4C18 4 24-10 16-20C14-10 8-6 3-6Z"/><rect x="-11" y="8" width="22" height="4" rx="1.5"/><path d="M-4 12L-6 22M4 12L6 22M0 12V20" stroke="{c}" stroke-width="2.4" fill="none"/></g>'
def musq(dark):
    r=random.Random(44)
    sk1,sk2=("#0d1230","#3a2a58") if dark else ("#c9d4f2","#f7e6d4")
    gold="#e8c46a" if dark else "#a47a1c";cur=("#5a1730","#7a2040") if dark else ("#c46d85","#d98fa4");bl="#9db8e8" if dark else "#2d4a8a";sil="#0a0c1c" if dark else "#7480a8";wl="#ffd877" if dark else "#f4b840"
    o=[defs(lg("s",sk1,sk2),lg("c",cur[0],cur[1],1,0),rg("mo","#fff2c4" if dark else "#fff7dc",.8))]
    o.append('<rect width="400" height="800" fill="url(#s)"/>')
    o.append('<circle cx="270" cy="170" r="90" fill="url(#mo)"/><circle cx="270" cy="170" r="30" fill="%s"/>'%("#fff1c0" if dark else "#fff7dc"))
    # paris rooftops with tower
    o.append(ridge(520,12,2,sil,.55,9))
    o.append(f'<g fill="{sil}" opacity=".85"><rect x="150" y="400" width="52" height="170"/><path d="M144 400L176 340L208 400Z"/><rect x="170" y="300" width="12" height="44"/><path d="M168 300L176 270L184 300Z"/><rect x="40" y="450" width="70" height="120"/><path d="M34 450L75 410L116 450Z"/><rect x="300" y="440" width="80" height="130"/><path d="M294 440L340 400L386 440Z"/></g>')
    for x,y in ((160,420),(184,420),(165,470),(55,470),(88,470),(318,470),(350,470)):
        o.append(f'<rect x="{x}" y="{y}" width="10" height="16" rx="2" fill="{wl}" opacity=".9"/>')
    # crossed swords
    o.append(f'<g transform="translate(200 640)" opacity=".92"><g stroke="{gold}" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M-120-100L96 80" stroke-width="5"/><path d="M120-100L-96 80" stroke-width="5"/><path d="M-130-110l22 8l-8 22" stroke-width="3"/></g><g fill="{gold}"><rect x="-70" y="38" width="46" height="7" rx="3" transform="rotate(40 -47 41)"/><rect x="24" y="38" width="46" height="7" rx="3" transform="rotate(-40 47 41)"/><circle cx="-104" cy="-82" r="7"/><circle cx="104" cy="-82" r="7"/></g></g>')
    # plume
    o.append(f'<g transform="translate(70 640) rotate(-18)"><path d="M0 0C-30 -40 -10 -110 40 -150C30 -100 50 -60 10 -10Z" fill="{cur[1]}" opacity=".9"/><path d="M0 0C20 -50 30 -90 40 -150" stroke="{gold}" stroke-width="2" fill="none"/><path d="M6-30l-16-6M12-56l-18-4M20-84l-16-2M28-110l-14 0" stroke="{gold}" stroke-width="1.6"/></g>')
    # curtains
    o.append(f'<path d="M0 0H92Q70 120 84 240Q94 340 60 440Q40 500 70 560Q20 600 0 640Z" fill="url(#c)"/><path d="M400 0H308Q330 120 316 240Q306 340 340 440Q360 500 330 560Q380 600 400 640Z" fill="url(#c)"/>')
    for i in range(6):
        o.append(f'<path d="M{10+i*12} 0Q{30+i*8} 200 {16+i*8} 420" stroke="{cur[0]}" stroke-width="2" fill="none" opacity=".55"/><path d="M{390-i*12} 0Q{370-i*8} 200 {384-i*8} 420" stroke="{cur[0]}" stroke-width="2" fill="none" opacity=".55"/>')
    o.append(f'<path d="M0 12H400" stroke="{gold}" stroke-width="3"/>')
    for x in range(20,400,40):o.append(f'<circle cx="{x}" cy="12" r="4" fill="{gold}"/>')
    # fleur-de-lis band
    for i,x in enumerate(range(40,400,64)):o.append(fleur(x,300,1.1,gold,.55))
    for i,x in enumerate(range(72,400,64)):o.append(fleur(x,740,.9,bl,.7))
    for i in range(8):o.append(f'<path d="M{20+i*52} 770h30" stroke="{gold}" stroke-width="2" opacity=".6"/>')
    return W("".join(o))
def principe(dark):
    r=random.Random(55)
    sk1,sk2=("#1c1030","#7a3a4a") if dark else ("#f3c9b0","#fbe9cf")
    sn="#ffcf7a" if dark else "#fff0b8";ter=("#2a1f22","#3b2a2a","#4a3430") if dark else ("#c9a07e","#b98c68","#a67a58");dome="#d9806a" if dark else "#b85a3e";stn="#e6cfa8" if dark else "#d9bd90";cyp="#16301f" if dark else "#3f6b44";gold="#e8c46a" if dark else "#a47a1c";pal="#b34a4a" if dark else "#8a2a2a"
    o=[defs(lg("s",sk1,sk2),rg("sn",sn,.9))]
    o.append('<rect width="400" height="800" fill="url(#s)"/>')
    o.append('<circle cx="90" cy="230" r="130" fill="url(#sn)"/><circle cx="90" cy="230" r="34" fill="%s"/>'%sn)
    for i,(y,c) in enumerate(((420,ter[0]),(470,ter[1]),(530,ter[2]))):o.append(ridge(y,16,10+i,c,1,6))
    # cathedral dome
    o.append(f'<g transform="translate(250 360)"><rect x="-70" y="60" width="140" height="110" fill="{stn}"/><path d="M-56 60Q-56 0 0 -20Q56 0 56 60Z" fill="{dome}"/><path d="M0 -20V60M-28 -8V60M28 -8V60M-46 22Q0 4 46 22" stroke="{stn}" stroke-width="2.4" fill="none"/><rect x="-6" y="-48" width="12" height="30" fill="{stn}"/><path d="M-8 -48L0 -66L8 -48Z" fill="{dome}"/><path d="M0 -66V-80M-6 -74H6" stroke="{gold}" stroke-width="2.4"/><rect x="-90" y="90" width="30" height="80" fill="{stn}"/><rect x="60" y="90" width="30" height="80" fill="{stn}"/></g>')
    for k in range(4):
        for j in range(3):o.append(f'<rect x="{196+k*34}" y="{458+j*22}" width="9" height="14" rx="4.5" fill="{pal}" opacity=".65"/>')
    # tower
    o.append(f'<g transform="translate(90 330)"><rect x="-26" y="40" width="52" height="220" fill="{stn}"/><rect x="-36" y="10" width="72" height="34" fill="{stn}"/><path d="M-36 10H36" stroke="{ter[0]}" stroke-width="2"/>'+"".join(f'<rect x="{x}" y="0" width="10" height="14" fill="{stn}"/>' for x in (-36,-18,0,18,26))+f'<rect x="-14" y="-40" width="28" height="42" fill="{stn}"/><path d="M-18 -40L0 -64L18 -40Z" fill="{pal}"/><circle cx="0" cy="130" r="14" fill="none" stroke="{ter[0]}" stroke-width="2.4"/><path d="M0 130V120M0 130l6 4" stroke="{ter[0]}" stroke-width="2"/></g>')
    # cypress
    for x,y,s in ((30,560,1.1),(350,560,1.2),(318,580,.8),(60,590,.8)):
        o.append(f'<path d="M{x} {y}C{x-22*s} {y-60*s} {x-14*s} {y-140*s} {x} {y-170*s}C{x+14*s} {y-140*s} {x+22*s} {y-60*s} {x} {y}Z" fill="{cyp}"/><rect x="{x-2}" y="{y}" width="4" height="22" fill="{ter[2]}"/>')
    # banners
    for x,c in ((150,pal),(210,gold),(270,pal)):
        o.append(f'<path d="M{x} 120V260" stroke="{gold}" stroke-width="3"/><path d="M{x} 126H{x+44}L{x+34} 144L{x+44} 162H{x} Z" fill="{c}" opacity=".9"/>')
    # laurel crown + crown
    o.append(f'<g transform="translate(200 680)" opacity=".95"><path d="M-70 40Q-96 -10 -48 -50" stroke="{cyp}" stroke-width="3" fill="none"/><path d="M70 40Q96 -10 48 -50" stroke="{cyp}" stroke-width="3" fill="none"/>'+"".join(f'<path transform="translate({-74+ (-1)*0 + i*0} 0)" d=""/>' for i in range(0))+"".join(f'<ellipse cx="{-82+i*4}" cy="{30-i*13}" rx="11" ry="5" fill="{cyp}" transform="rotate({-35-i*8} {-82+i*4} {30-i*13})"/><ellipse cx="{82-i*4}" cy="{30-i*13}" rx="11" ry="5" fill="{cyp}" transform="rotate({35+i*8} {82-i*4} {30-i*13})"/>' for i in range(5))+f'<path d="M-36 26L-44-20L-18 0L0-30L18 0L44-20L36 26Z" fill="{gold}" stroke="{pal}" stroke-width="2.2"/><rect x="-36" y="26" width="72" height="10" rx="2" fill="{gold}" stroke="{pal}" stroke-width="2.2"/><circle cx="0" cy="-34" r="4" fill="{pal}"/><circle cx="-44" cy="-22" r="3.4" fill="{pal}"/><circle cx="44" cy="-22" r="3.4" fill="{pal}"/></g>')
    return W("".join(o))
def dante(dark):
    r=random.Random(66)
    sk1,sk2=("#080a1e","#2a2d6a") if dark else ("#d9d2f0","#fbe6d2")
    gold="#f6dc8e" if dark else "#a8741c";ring="#b9c4f2" if dark else "#4a5a9a";fl=("#ff7a3d","#ffbf4d") if dark else ("#e4572a","#f1a12c");mt="#1a1330" if dark else "#8a7aa6";rs="#ffe9a8" if dark else "#fff2c0"
    o=[defs(lg("s",sk1,sk2),rg("c",rs,.95),lg("f",fl[0],fl[1],0,-1))]
    o.append('<rect width="400" height="800" fill="url(#s)"/>')
    # rays
    for k in range(24):
        a=k*math.pi/12;o.append(f'<path d="M200 220L{200+math.cos(a)*420:.0f} {220+math.sin(a)*420:.0f}" stroke="{gold}" stroke-width="{1.6 if k%2 else 3}" opacity=".16"/>')
    o.append('<circle cx="200" cy="220" r="150" fill="url(#c)" opacity=".55"/>')
    for i,rad in enumerate((26,52,82,116,152,190)):
        o.append(f'<circle cx="200" cy="220" r="{rad}" fill="none" stroke="{ring}" stroke-width="{1.8 if i%2 else 1.2}" opacity=".6" stroke-dasharray="{"2 7" if i%2 else "0"}"/>')
        for j in range(5+i*2):
            a=r.uniform(0,6.283);o.append(f'<circle cx="{200+math.cos(a)*rad:.1f}" cy="{220+math.sin(a)*rad:.1f}" r="{r.choice([2,2.6,3.4])}" fill="{gold}"/>')
    o.append(f'<circle cx="200" cy="220" r="13" fill="{gold}"/><circle cx="200" cy="220" r="5" fill="#ffffff"/>')
    for i in range(36):
        x,y=r.randint(6,394),r.randint(6,520);o.append(f'<circle cx="{x}" cy="{y}" r="{r.choice([.8,1.1,1.5])}" fill="{rs}" opacity=".85"/>')
    for x,y,s in ((46,90,8),(350,70,7),(370,360,6),(34,330,6)):o.append(star4(x,y,s,gold))
    # mountain of terraces
    o.append(f'<path d="M-10 800V640L90 560L150 520L190 440L210 440L250 520L310 560L410 640V800Z" fill="{mt}"/>')
    for k,y in enumerate((470,510,552,596,640)):
        w=22+k*46
        o.append(f'<path d="M{200-w} {y}Q200 {y-12} {200+w} {y}" stroke="{gold}" stroke-width="2" fill="none" opacity=".7"/>')
    o.append(f'<path d="M190 440Q200 410 210 440" fill="{rs}" opacity=".8"/>')
    # flames
    for x in range(-10,420,34):
        h=r.randint(70,150);w=r.randint(22,34)
        o.append(f'<path d="M{x} 800C{x-w} {800-h*.4:.0f} {x+w*.3:.0f} {800-h*.6:.0f} {x} {800-h}C{x+w*1.2:.0f} {800-h*.6:.0f} {x+w*.8:.0f} {800-h*.3:.0f} {x+w} 800Z" fill="url(#f)" opacity=".75"/>')
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
