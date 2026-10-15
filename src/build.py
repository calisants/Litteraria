"""Monta o app. Uso (dentro de src/):  python3 build.py
1) junta as partes em src/mots-parole-v4.html (usado pelos testes);
2) atualiza ../index.html (cabeçalho + app + registro do service worker)."""
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
r = lambda f: open(f, encoding='utf8').read()
JS = ['data.js','content.js','content2.js','content3.js','content4.js','content5.js',
      'pron.js','sons.js','p3.js','p4.js','p5.js','p6.js','p7.js','p9.js','p10.js','p8.js']
built = r('p1.html') + "\n" + r('p2.html') + "\n<script>\n" + "\n".join(r(f) for f in JS) + "\n</script>\n"
open('mots-parole-v4.html', 'w', encoding='utf8').write(built)
idx = r('../index.html')
new = (idx[:idx.index('<title>')] + built.rstrip('\n') + '\n\n'
       + idx[idx.index('<script>\nif("serviceWorker"'):])
open('../index.html', 'w', encoding='utf8').write(new)
print('ok', len(new), 'bytes')
