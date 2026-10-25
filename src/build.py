"""Monta o app. Uso (dentro de src/):  python3 build.py
1) junta as partes em src/mots-parole-v4.html (usado pelos testes);
2) atualiza ../index.html (cabeçalho + app + registro do service worker)."""
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
r = lambda f: open(f, encoding='utf8').read()
v, d = r('VERSION').split()
open('version.js', 'w', encoding='utf8').write('const APP_REL={v:"%s",d:"%s"};\n' % (v, d))
JS = ['version.js','data.js','content.js','content2.js','content3.js','content4.js','content5.js','content6.js',
      'sil.js','exemplos.js','frases_ctx.js','desenhos.js','desenhos2.js','desenhos3.js','desenhos4.js','desenhos5.js','desenhos6.js','desenhos7.js','livros_data.js','livros.js','desenhos_map.js','livros_frases.js','pron.js','sons.js','p3.js','p4.js','p5.js','p6.js','p7.js','p9.js','p10.js','p11.js','p12.js','parecidas.js','p13.js','memoria.js','livros_leitura.js','livros_txt.js','glossario.js','ctxhist.js','livros2.js','jogoslit.js','licao7.js','cartoes.js','ciclo.js','confort.js','perfil2.js','gamif.js','jardim.js','jardimtela.js','lembretes.js','pushcfg.js','push.js','nuvemcfg.js','privacidade.js','nuvem.js','amigos.js','novidades.js','boasvindas.js','instalar.js','retomar.js','p8.js','boot2.js']
built = r('p1.html') + "\n" + r('p2.html') + "\n<script>\n" + "\n".join(r(f) for f in JS) + "\n</script>\n"
open('mots-parole-v4.html', 'w', encoding='utf8').write(built)
idx = r('../index.html')
new = (idx[:idx.index('<title>')] + built.rstrip('\n') + '\n\n'
       + idx[idx.index('<script>\nif("serviceWorker"'):])
open('../index.html', 'w', encoding='utf8').write(new)
print('ok', len(new), 'bytes')
