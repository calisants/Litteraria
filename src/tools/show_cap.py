import json,sys
d=json.load(open('livros_txt/%s/orig.json'%sys.argv[1]))
c=d[int(sys.argv[2])-1]
print(c['t'])
for i,p in enumerate(c['p'],1): print(i,p)
