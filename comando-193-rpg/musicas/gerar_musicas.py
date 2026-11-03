# Gera as músicas do jogo (chiptune). Requer: python3, numpy e ffmpeg.  Uso: python gerar_musicas.py
# Para mudar uma música, edite o dicionário TH (andamento, tom, escala, melodia, baixo, bateria e efeitos).
import numpy as np, subprocess, wave, os
SR=22050
rng=np.random.default_rng(11)
SC={'maj':[0,2,4,5,7,9,11],'min':[0,2,3,5,7,8,10],'dor':[0,2,3,5,7,9,10],'lyd':[0,2,4,6,7,9,11],'phr':[0,1,3,5,7,8,10],'whole':[0,2,4,6,8,10]}
def f(m): return 440.0*2**((float(m)-69)/12)
def pitch(root,sc,d):
    s=SC[sc]; n=len(s); return root+s[d%n]+12*(d//n)
def osc(kind,fr,duty=.5):
    ph=(np.cumsum(fr)/SR)%1
    if kind=='pulse': return np.where(ph<duty,1.,-1.)
    if kind=='tri': return 4*np.abs(ph-.5)-1
    if kind=='saw': return 2*ph-1
    return np.sin(2*np.pi*ph)
def env(n,a,d,s,r):
    e=np.full(n,float(s)); a=min(int(a*SR),n)
    if a>0: e[:a]=np.linspace(0,1,a)
    dn=min(int(d*SR),n-a)
    if dn>0: e[a:a+dn]=np.linspace(1,s,dn)
    r=min(int(r*SR),n)
    if r>0: e[n-r:]=e[n-r:]*np.linspace(1,0,r)
    return e
class T:
    def __init__(s,bpm,bars,tail=3.0):
        s.st=60/bpm/4; s.bars=bars; s.n=int(bars*16*s.st*SR); s.buf=np.zeros(s.n+int(tail*SR)); s.dur=s.n/SR
    def add(s,sec,w):
        i=int(sec*SR)
        if i<0 or i>=len(s.buf): return
        w=w[:len(s.buf)-i]; s.buf[i:i+len(w)]+=w
    def note(s,step,ln,m,kind='pulse',vol=.2,duty=.25,e=(.004,.06,.6,.04),slide=1.0,vib=0,vibhz=6):
        n=max(16,int(ln*s.st*SR)); fr=np.full(n,f(m))
        if slide!=1.0: fr=fr*np.linspace(1,slide,n)
        if vib: fr=fr*(1+vib*np.sin(2*np.pi*vibhz*np.arange(n)/SR)*np.minimum(1,np.arange(n)/(.25*SR)))
        s.add(step*s.st,osc(kind,fr,duty)*env(n,*e)*vol)
    def kick(s,step,v=.55):
        n=int(.16*SR); s.add(step*s.st,osc('sine',np.linspace(160,45,n))*np.exp(-np.arange(n)/SR*16)*v)
    def snare(s,step,v=.3):
        n=int(.14*SR); s.add(step*s.st,(rng.uniform(-1,1,n)*.7+osc('tri',np.full(n,190.))*.3)*np.exp(-np.arange(n)/SR*26)*v)
    def hat(s,step,v=.09):
        n=int(.035*SR); s.add(step*s.st,np.diff(np.r_[0,rng.uniform(-1,1,n)])*np.exp(-np.arange(n)/SR*90)*v)
    def nb(s,sec,dur,vol,lp=1,shape='dec'):
        n=int(dur*SR); x=rng.uniform(-1,1,n)
        if lp>1: x=np.convolve(x,np.ones(lp)/lp,'same')*np.sqrt(lp)
        k=np.arange(n)/SR
        e=np.exp(-k*(5/dur)) if shape=='dec' else np.sin(np.pi*np.arange(n)/n)**2
        s.add(sec,x*e*vol)
    def fin(s):
        out=s.buf[:s.n].copy(); tail=s.buf[s.n:]; out[:len(tail)]+=tail; return out
def echo(x,sec,fb,k=4):
    y=x.copy()
    for i in range(1,k+1): y+=(fb**i)*np.roll(x,int(sec*SR*i))
    return y

# ---- efeitos ----
def fx_boing(t):
    for b in (0,8): t.note(b*16+14,2,84,'pulse',.12,.5,slide=1.9)
    t.note(15*16+8,3,76,'pulse',.12,.5,slide=1.5); t.note(15*16+11,4,78,'pulse',.12,.5,slide=.7)
def fx_siren(t):
    for b in (3,11):
        for k in range(4): t.note(b*16+k*4,4,81 if k%2==0 else 76,'pulse',.1,.5)
def fx_crackle(t):
    for _ in range(int(t.dur*16)): t.nb(rng.uniform(0,t.dur),rng.uniform(.006,.02),rng.uniform(.04,.1),2)
    for b in (0,4,8,12): t.nb(b*16*t.st,4*16*t.st,.05,60,'swell')
def fx_zap(t):
    for b in (3,7,11,15): t.note(b*16+12,4,96,'saw',.09,slide=.22)
    for b in (7,15): t.note(b*16,16,48,'saw',.055,slide=6.0)
def fx_wind(t):
    for b in (0,4,8,12): t.nb(b*16*t.st,4*16*t.st,.09,50,'swell')
def fx_rumble(t):
    for b in range(0,16,2): t.nb(b*16*t.st,2*16*t.st,.28,90)
    for _ in range(14): t.nb(rng.uniform(0,t.dur),.05,.07,3)
def fx_hoot(t):
    for b in (5,13): t.note(b*16,3,76,'sine',.1,slide=.95); t.note(b*16+6,5,76,'sine',.1,slide=.9)
    for b in (2,10): t.nb(b*16*t.st,4*16*t.st,.05,50,'swell')
def fx_bubbles(t):
    for _ in range(46): t.note(rng.uniform(0,t.bars*16-2),1.5,rng.integers(84,97),'sine',.05,slide=1.45)
def fx_geiger(t):
    for _ in range(int(t.dur*16)):
        a=rng.uniform(0,t.dur); 
        if rng.uniform()<.25+.75*a/t.dur: t.nb(a,.004,.09,1)
    for b in (3,7,11,15): t.note(b*16,2,83,'sine',.08); t.note(b*16+4,2,83,'sine',.08)
FX={'boing':fx_boing,'siren':fx_siren,'crackle':fx_crackle,'zap':fx_zap,'wind':fx_wind,'rumble':fx_rumble,'hoot':fx_hoot,'bubbles':fx_bubbles,'geiger':fx_geiger}

K4='x...x...x...x...'; S2='....x.......x...'; H8='x.x.x.x.x.x.x.x.'; Z='.'*16
TH={
'animal':dict(bpm=152,root=60,sc='maj',A=[0,3,4,0],B=[5,3,1,4],lk='pulse',duty=.25,lv=.2,
  m=[(0,7,2),(2,9,2),(4,11,2),(6,9,2),(8,7,4),(12,4,2),(14,5,2),(16,7,2),(18,8,2),(20,9,2),(22,8,2),(24,7,4),(28,4,2),(30,2,2)],
  mB=[(0,9,2),(2,11,2),(4,12,4),(8,11,2),(10,9,2),(12,7,4),(16,9,2),(18,11,2),(20,12,2),(22,14,2),(24,12,6),(30,11,2)],
  bass='x.o.x.o.x.o.x.o.',arp='0.1.2.1.0.1.2.1.',k=K4,s=S2,h=H8,fx=['boing']),
'predial':dict(bpm=158,root=64,sc='min',A=[0,0,5,6],B=[3,4,5,6],lk='pulse',duty=.5,lv=.17,
  m=[(0,7,3),(3,7,1),(4,9,3),(7,9,1),(8,10,4),(12,9,2),(14,7,2),(16,7,3),(19,7,1),(20,9,3),(23,9,1),(24,11,2),(26,10,2),(28,9,2),(30,8,2)],
  mB=[(0,11,2),(2,11,2),(4,12,2),(6,11,2),(8,10,4),(12,9,4),(16,11,2),(18,11,2),(20,12,2),(22,14,2),(24,13,4),(28,12,2),(30,11,2)],
  bass='x.x.x.x.x.x.x.xx',arp='0.1.2.3.0.1.2.3.',k='x...x...x...x..x',s=S2,h='x.x.x.x.x.x.x.xx',fx=['siren']),
'florestal':dict(bpm=140,root=62,sc='dor',A=[0,3,0,4],B=[5,3,0,4],lk='pulse',duty=.125,lv=.2,
  m=[(0,0,4),(4,4,4),(8,7,6),(14,6,2),(16,5,4),(20,4,4),(24,2,6),(30,4,2)],
  mB=[(0,7,2),(2,8,2),(4,9,4),(8,11,4),(12,9,2),(14,8,2),(16,7,4),(20,5,4),(24,4,6),(30,2,2)],
  bass='x.xx.xx.x.xx.xx.',arp='0123210.0123210.',k='x..x..x.x..x..x.',s=S2,h=H8,fx=['crackle']),
'busca':dict(bpm=90,root=57,sc='min',A=[0,5,3,4],B=[0,6,5,4],lk='tri',duty=.5,lv=.26,echo=(.33,.38),
  m=[(0,7,6),(8,9,4),(12,8,4),(16,7,8),(24,4,6)],mB=[(0,9,6),(8,11,4),(12,10,4),(16,9,8),(24,7,6)],
  bass='x.......x.......',arp='.0...1...2...1..',k='x...............',s=Z,h='........x.......',kv=.3,hv=.04,fx=['hoot']),
'carro_eletrico':dict(bpm=130,root=60,sc='min',A=[0,5,6,4],B=[3,3,4,4],lk='saw',duty=.5,lv=.13,vib=.008,
  m=[(0,7,1),(1,9,1),(2,10,1),(3,9,1),(4,7,2),(6,11,2),(8,10,4),(12,9,2),(14,7,2),(16,7,1),(17,9,1),(18,10,1),(19,12,1),(20,11,2),(22,10,2),(24,9,4),(28,7,4)],
  mB=[(0,12,2),(2,11,2),(4,10,2),(6,9,2),(8,10,2),(10,9,2),(12,7,4),(16,12,2),(18,14,2),(20,15,4),(24,14,2),(26,12,2),(28,11,4)],
  bass='xxx.xxx.xxx.xxx.',arp='0120120120120120',k=K4,s=S2,h='.x.x.x.x.x.x.x.x',fx=['zap']),
'altura':dict(bpm=108,root=62,sc='lyd',A=[0,1,4,0],B=[5,1,4,0],lk='tri',duty=.5,lv=.26,vib=.012,
  m=[(0,7,8),(8,9,8),(16,11,8),(24,14,8)],mB=[(0,14,4),(4,12,4),(8,11,8),(16,9,4),(20,11,4),(24,12,8)],
  bass='x.......x.......',arp='0.1.2.3.2.1.0.1.',k='x.......x.......',s=Z,h='..x...x...x...x.',hv=.05,fx=['wind']),
'colapso':dict(bpm=98,root=48,sc='phr',A=[0,1,0,4],B=[0,3,1,0],lk='saw',duty=.5,lv=.15,bv=.4,
  m=[(0,7,6),(8,8,2),(12,7,4),(16,6,6),(24,8,2),(28,7,4)],mB=[(0,9,4),(4,8,4),(8,7,8),(16,5,4),(20,6,4),(24,7,8)],
  bass='x..x..x.x..x....',arp='0...2...0...3...',k='x.......x..x....',s='........x.......',h='..x...x...x...x.',fx=['rumble']),
'crise':dict(bpm=72,root=65,sc='maj',A=[0,4,5,3],B=[3,0,3,4],lk='tri',duty=.5,lv=.26,vib=.006,pad=True,bv=.22,
  m=[(0,7,8),(8,8,4),(12,9,4),(16,11,8),(24,9,8)],mB=[(0,11,6),(8,9,4),(12,8,4),(16,7,12)],
  bass='x.......x.......',arp='0.1.2.1.0.1.2.1.',k='x...............',s=Z,h=Z,kv=.25,arp_from=4,dr_from=8,fx=[]),
'aquatico':dict(bpm=100,root=67,sc='maj',A=[0,4,5,3],B=[3,4,0,5],lk='pulse',duty=.25,lv=.13,echo=(.3,.4),
  m=[(0,7,4),(4,9,4),(8,11,4),(12,9,4),(16,7,4),(20,4,4),(24,5,6),(30,7,2)],mB=[(0,11,4),(4,12,4),(8,14,6),(14,12,2),(16,11,4),(20,9,4),(24,7,8)],
  bass='x...x...x...x...',arp='0123210123210123',arpk='tri',arpv=.08,k='x.......x.......',s=Z,h='..x...x...x...x.',hv=.05,kv=.35,bv=.26,fx=['bubbles']),
'quimica':dict(bpm=118,root=60,sc='whole',A=[0,1,2,3],B=[3,2,1,0],lk='pulse',duty=.125,lv=.15,vib=.02,vibhz=8,
  m=[(0,6,2),(2,6,2),(4,7,2),(6,8,2),(8,9,4),(12,8,2),(14,7,2),(16,6,2),(18,7,2),(20,9,2),(22,10,2),(24,11,4),(28,9,4)],
  mB=[(0,10,2),(2,9,2),(4,8,2),(6,7,2),(8,6,4),(12,7,2),(14,8,2),(16,10,2),(18,11,2),(20,12,4),(24,10,2),(26,9,2),(28,8,4)],
  bass='x.x.x.x.x.x.x.x.',arp='0.1.2.3.0.1.2.3.',k=K4,s=S2,h=H8,fx=['geiger']),
}
def build(nm,th):
    t=T(th['bpm'],16); root,sc=th['root'],th['sc']
    for bar in range(16):
        cd=(th['B'] if 8<=bar<12 else th['A'])[bar%4]; base=bar*16
        for st,ch in enumerate(th['bass']):
            if ch!='.': t.note(base+st,th.get('bl',1.6),pitch(root-24,sc,cd+(4 if ch=='f' else 0))+(12 if ch=='o' else 0),'tri',th.get('bv',.34),e=(.002,.04,.8,.03))
        if bar>=th.get('arp_from',0):
            tones=[cd,cd+2,cd+4,cd+7]
            for st,ch in enumerate(th['arp']):
                if ch!='.': t.note(base+st,.9,pitch(root+12,sc,tones[int(ch)]),th.get('arpk','pulse'),th.get('arpv',.06),.125,e=(.002,.05,.5,.03))
        if th.get('pad'):
            for d in (cd,cd+2,cd+4): t.note(base,16,pitch(root-12,sc,d),'tri',.05,e=(.4,.2,.8,.6))
        if bar>=th.get('dr_from',0):
            for st in range(16):
                if th['k'][st]=='x': t.kick(base+st,th.get('kv',.55))
                if th['s'][st]=='x': t.snare(base+st,.3)
                if th['h'][st]=='x': t.hat(base+st,th.get('hv',.09))
    def lead(m,bar,shift=0,octv=0):
        for st,d,ln in m: t.note(bar*16+st,ln*.92,pitch(root,sc,d+shift+7*octv if len(SC[sc])==7 else d+shift+6*octv),th['lk'],th['lv'],th['duty'],vib=th.get('vib',0),vibhz=th.get('vibhz',6),e=(.006,.08,.7,.06))
    var=lambda m:[(s,d+(2 if s>=24 else 0),l) for s,d,l in m]
    lead(th['m'],0); lead(var(th['m']),2)
    lead(th['m'],4,0,1); lead(var(th['m']),6,0,1)
    lead(th['mB'],8); lead(var(th['mB']),10)
    lead(th['m'],12,0,1); lead(var(th['m']),14,0,1)
    for k in th['fx']: FX[k](t)
    x=t.fin()
    if 'echo' in th: x=echo(x,*th['echo'])
    x=x/(np.max(np.abs(x))*1.12+1e-9)
    x=np.round(x*48)/48
    return x
if __name__=='__main__':
    os.makedirs('tmp_wav',exist_ok=True); os.makedirs('audio',exist_ok=True)
    out='audio/'
    for nm,th in TH.items():
        x=build(nm,th); pcm=(x*32767).astype('<i2')
        w=wave.open(f'tmp_wav/{nm}.wav','wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes()); w.close()
        subprocess.run(['ffmpeg','-y','-loglevel','error','-i',f'tmp_wav/{nm}.wav','-codec:a','libmp3lame','-b:a','96k','-ar','22050',out+f'tema_{nm}.mp3'],check=True)
        print(nm,round(len(x)/SR,1),'s  pico',round(float(np.max(np.abs(x))),2),' rms',round(float(np.sqrt(np.mean(x**2))),3),' mp3 KB',os.path.getsize(out+f'tema_{nm}.mp3')//1024)
