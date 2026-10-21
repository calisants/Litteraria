"""Gera os ícones alternativos do app (icons/<id>-192.png, -512.png, -maskable-512.png) a partir de SVG original.
Só objetos genéricos (relógio de bolso, planeta, raio, anéis, monograma); nenhum personagem de livro.
Uso:  python3 -I tools/mk_icons.py        (na pasta src/, precisa de playwright + chromium)"""
import os,sys
from playwright.sync_api import sync_playwright
HERE=os.path.dirname(os.path.abspath(__file__)); OUT=os.path.abspath(os.path.join(HERE,'..','..','icons')); FONTS=os.path.abspath(os.path.join(HERE,'..','..','fonts'))
os.makedirs(OUT,exist_ok=True)
def stars(pts,col='#fff6d6'):
    return ''.join('<circle cx="%d" cy="%d" r="%s" fill="%s" opacity="%s"/>'%(x,y,r,col,o) for x,y,r,o in pts)
def spark(x,y,s,col='#ffe9a8'):
    return '<path d="M%d %d l%d %d %d %d %d %d %d %d z" fill="%s"/>'%(x,y-s,s*0.25,s*0.75,s*0.75,s*0.25,-s*0.75,s*0.25,-s*0.25,s*0.75,col)
ticks=''.join('<line x1="256" y1="%d" x2="256" y2="%d" stroke="#8a6a2a" stroke-width="%d" transform="rotate(%d 256 262)"/>'%(184,198 if i%3 else 204,4 if i%3 else 7,i*30) for i in range(12))
SV={}
SV['alice']='''<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#14495a"/><stop offset="1" stop-color="#2a2a63"/></linearGradient></defs>
<rect width="512" height="512" fill="url(#g)"/>
<path d="M60 430 C150 380 120 300 210 280 S330 330 452 250" fill="none" stroke="#ffffff" stroke-opacity=".10" stroke-width="22" stroke-linecap="round"/>
<circle cx="256" cy="128" r="17" fill="none" stroke="#b8862b" stroke-width="9"/>
<rect x="242" y="136" width="28" height="30" rx="6" fill="#b8862b"/>
<circle cx="256" cy="262" r="112" fill="#f3d27a" stroke="#b8862b" stroke-width="10"/>
<circle cx="256" cy="262" r="90" fill="#fff8e0" stroke="#d6aa4a" stroke-width="3"/>
'''+ticks+'''
<line x1="256" y1="262" x2="256" y2="205" stroke="#2b2b4a" stroke-width="7" stroke-linecap="round"/>
<line x1="256" y1="262" x2="298" y2="285" stroke="#2b2b4a" stroke-width="6" stroke-linecap="round"/>
<circle cx="256" cy="262" r="8" fill="#c0392b"/>
<path d="M372 168c-14-20-44-4-30 20l30 30 30-30c14-24-16-40-30-20z" fill="#d64550" transform="translate(-6 -4) scale(.9)"/>'''
SV['pp']='''<defs><radialGradient id="g" cx=".5" cy=".4" r=".8"><stop offset="0" stop-color="#26397f"/><stop offset="1" stop-color="#0a1030"/></radialGradient>
<radialGradient id="p" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#7fc29a"/><stop offset="1" stop-color="#2c6a4c"/></radialGradient></defs>
<rect width="512" height="512" fill="url(#g)"/>'''+stars([(110,120,3,1),(400,110,4,.9),(150,220,2.5,.8),(380,250,2.5,.9),(90,300,2,.7),(440,330,3,.8),(300,90,2,.7),(210,150,2,.7)])+spark(360,170,26)+spark(140,160,18,'#fff3c4')+'''
<circle cx="256" cy="352" r="96" fill="url(#p)"/>
<path d="M200 330c20-14 44-18 70-10M232 380c24 6 48 2 66-14" stroke="#e8f5c8" stroke-opacity=".35" stroke-width="6" fill="none" stroke-linecap="round"/>
<path d="M256 256 C256 236 254 226 256 206" stroke="#4d9b62" stroke-width="7" fill="none" stroke-linecap="round"/>
<path d="M256 240c-26 0-38-14-40-30 22 0 38 8 40 30zM256 232c24-2 36-16 38-30-22 0-36 10-38 30z" fill="#4d9b62"/>
<g transform="translate(256 190)"><circle r="22" fill="#d6405a"/><circle cx="-12" cy="-8" r="14" fill="#e85d75"/><circle cx="12" cy="-8" r="14" fill="#e85d75"/><circle cy="6" r="12" fill="#b82f48"/></g>'''
SV['frank']='''<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a2230"/><stop offset="1" stop-color="#0f1319"/></linearGradient>
<filter id="b" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="9"/></filter></defs>
<rect width="512" height="512" fill="url(#g)"/>
<ellipse cx="170" cy="120" rx="110" ry="34" fill="#2b3646"/><ellipse cx="310" cy="100" rx="130" ry="38" fill="#323f52"/><ellipse cx="250" cy="150" rx="140" ry="30" fill="#273142"/>
<path d="M130 440V270l22-34 22 34v170z M210 440V240h50v200z" fill="#0a0d12"/>
<path d="M235 200l25-60 25 60z" fill="#0a0d12"/><rect x="224" y="300" width="22" height="42" rx="11" fill="#e9d36b" opacity=".85"/>
<polygon points="300,86 214,262 266,262 226,432 346,224 288,224 330,86" fill="#d9f26a" filter="url(#b)" opacity=".7"/>
<polygon points="300,86 214,262 266,262 226,432 346,224 288,224 330,86" fill="#f4ffb0" stroke="#d9f26a" stroke-width="4" stroke-linejoin="round"/>'''
SV['soft']='''<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f7efe1"/><stop offset="1" stop-color="#efd9c8"/></linearGradient></defs>
<rect width="512" height="512" fill="url(#g)"/>
<circle cx="256" cy="256" r="188" fill="none" stroke="#c9a45c" stroke-width="5"/><circle cx="256" cy="256" r="172" fill="none" stroke="#c9a45c" stroke-width="1.8"/>
<text x="168" y="300" font-family="Newsreader,Georgia,serif" font-weight="600" font-size="170" fill="#b9873a" text-anchor="middle">M</text>
<text x="344" y="300" font-family="Newsreader,Georgia,serif" font-weight="600" font-size="170" fill="#b9873a" text-anchor="middle">P</text>
<text x="256" y="268" font-family="Newsreader,Georgia,serif" font-style="italic" font-weight="500" font-size="62" fill="#d99a85" text-anchor="middle">&amp;</text>
<path d="M200 350h112" stroke="#c9a45c" stroke-width="3"/><circle cx="256" cy="350" r="5" fill="#c9a45c"/>'''
rings=''.join('<circle cx="256" cy="256" r="%d" fill="none" stroke="#f0b95c" stroke-opacity="%.2f" stroke-width="%d"/>'%(r,o,w) for r,o,w in [(186,.35,5),(160,.45,5),(134,.55,5),(108,.7,6),(82,.85,6),(56,1,7)])
SV['dante']='''<defs><radialGradient id="g" cx=".5" cy=".5" r=".75"><stop offset="0" stop-color="#5a1a12"/><stop offset=".6" stop-color="#2a0c0c"/><stop offset="1" stop-color="#0e0507"/></radialGradient>
<radialGradient id="s" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff3c4"/><stop offset="1" stop-color="#f0b95c" stop-opacity="0"/></radialGradient></defs>
<rect width="512" height="512" fill="url(#g)"/>'''+rings+'''
<circle cx="256" cy="256" r="46" fill="url(#s)"/>
<path d="M256 218l9 25 27 1-21 17 8 26-23-15-23 15 8-26-21-17 27-1z" fill="#fff3c4"/>'''
def page(svg,size):
    return '<style>@font-face{font-family:Newsreader;font-weight:500;src:url(file://%s/newsreader-latin-500-normal.woff2)}@font-face{font-family:Newsreader;font-weight:600;src:url(file://%s/newsreader-latin-600-normal.woff2)}html,body{margin:0}</style><svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" viewBox="0 0 512 512">%s</svg>'%(FONTS,FONTS,size,size,svg)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page()
    for k,svg in SV.items():
        for name,size in (('%s-192.png'%k,192),('%s-512.png'%k,512),('%s-maskable-512.png'%k,512)):
            pg.set_viewport_size({'width':size,'height':size}); pg.set_content(page(svg,size)); pg.wait_for_timeout(150)
            pg.screenshot(path=os.path.join(OUT,name),clip={'x':0,'y':0,'width':size,'height':size})
        open(os.path.join(OUT,k+'.svg'),'w',encoding='utf8').write('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">%s</svg>'%svg)
    b.close()
# o «padrão» continua sendo icon-192.png / icon-512.png / icon-maskable-512.png na raiz
print('ok',sorted(os.listdir(OUT)))
