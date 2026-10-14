import numpy as np, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
W,H=1080,1350
rng=np.random.default_rng(7)
FD=sys.argv[1]; OUT=sys.argv[2]
y=np.linspace(0,1,H)[:,None]; x=np.linspace(0,1,W)[None,:]
# sky gradient: deep navy -> violet -> warm amber at horizon
def lerp(a,b,t): return a+(b-a)*t
stops=[(0.0,(14,20,44)),(0.30,(44,46,92)),(0.52,(150,96,110)),(0.66,(240,160,96)),(0.72,(255,206,140))]
sky=np.zeros((H,W,3))
yy=np.broadcast_to(y,(H,W))
for i in range(len(stops)-1):
    p0,c0=stops[i];p1,c1=stops[i+1]
    m=(yy>=p0)&(yy<=p1); t=((yy-p0)/(p1-p0))[m]
    for k in range(3): sky[...,k][m]=lerp(c0[k],c1[k],t)
m=yy>stops[-1][0]
for k in range(3): sky[...,k][m]=stops[-1][1][k]
# sun glow
sx,sy=0.5,0.665
d=np.sqrt(((x-sx)*W/H)**2+(y-sy)**2)
glow=np.exp(-(d/0.10)**2)*0.9+np.exp(-(d/0.30)**2)*0.35
sky+=glow[...,None]*np.array([255,190,120])*0.55
sun=np.clip(1-(d-0.028)/0.004,0,1)
sky=sky*(1-sun[...,None])+np.array([255,244,220])*sun[...,None]
# stars in upper sky
st=rng.random((H,W))>0.9993
starmask=st*(np.clip(0.45-yy,0,1)/0.45)
sky+=starmask[...,None]*200
img=sky.copy()
# fbm 1D ridges
def fbm(n,oct=6,seed=0):
    r=np.random.default_rng(seed); out=np.zeros(n); amp=1; f=3
    for _ in range(oct):
        pts=r.random(f+2); xs=np.linspace(0,f+1,n)
        out+=amp*np.interp(xs,np.arange(f+2),pts); amp*=0.5; f*=2
    return out/1.9
layers=[(0.60,0.07,(92,70,100),0.55,11),(0.66,0.08,(58,44,74),0.35,12),(0.73,0.09,(34,28,50),0.2,13),(0.82,0.10,(16,14,28),0.0,14)]
for base,amp,col,fog,seed in layers:
    ridge=base-fbm(W,seed=seed)*amp
    mask=(yy>ridge[None,:]).astype(float)
    # soft edge
    mask=np.array(Image.fromarray((mask*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2)))/255
    c=np.array(col,float)
    # fog gradient on each layer (lighter at top)
    depth=np.clip((yy-ridge[None,:])/0.12,0,1)
    layer=c*(1-fog*(1-depth))[...,None]+np.array([255,190,150])*(fog*(1-depth))[...,None]*0.6
    img=img*(1-mask[...,None])+layer*mask[...,None]
# lake reflection at bottom
lake_top=0.86
lm=yy>lake_top
refl_src=np.flipud(img[int(H*0.62):int(H*0.86)])
rh=H-int(H*lake_top)
refl=np.array(Image.fromarray(np.clip(refl_src,0,255).astype(np.uint8)).resize((W,rh)).filter(ImageFilter.GaussianBlur(3)),float)
refl*=0.55
# glimmer path under sun
gp=np.exp(-((x-sx)*W/90)**2)*(rng.random((rh,W))>0.6)*0.6
refl+=gp[...,None]*np.array([255,200,140])[None,None,:]*np.linspace(1,0.2,rh)[:,None,None]
img[int(H*lake_top):]=refl*0.8+np.array([10,10,22])*0.2
# vignette + grain
vd=np.sqrt(((x-0.5)*1.1)**2+((y-0.5))**2)
img*=(1-np.clip(vd-0.35,0,1)*0.9)[...,None]
img+=rng.normal(0,6,(H,W,1))
im=Image.fromarray(np.clip(img,0,255).astype(np.uint8)).convert("RGBA")
# dark gradient behind text area
ov=np.zeros((H,W,4),np.uint8)
ta=np.clip(1-np.abs(np.linspace(0,1,H)-0.33)/0.22,0,1)**1.2*150
ov[...,3]=ta[:,None].astype(np.uint8)
im=Image.alpha_composite(im,Image.fromarray(ov))
F=lambda w,s: ImageFont.truetype(f"{FD}/Pretendard-{w}.otf",s)
lines=[("기억하세요.",F("SemiBold",58),26),
       ("인생 전체를 바꾸는 데는",F("Medium",50),14),
       ("단 1년이면 충분합니다.",F("Bold",62),40),
       ("2027년은 당신의 해입니다.",F("Bold",62),40),
       ("오늘의 다짐을 지금,",F("Regular",42),12),
       ("미래의 나에게 보내세요.",F("Regular",42),0)]
txt=Image.new("RGBA",(W,H),(0,0,0,0)); dr=ImageDraw.Draw(txt)
total=sum(f.getbbox(t)[3]+g for t,f,g in lines)
cy=int(H*0.33)-total//2
pos=[]
for t,f,g in lines:
    b=dr.textbbox((0,0),t,font=f); w=b[2]-b[0]
    pos.append((t,f,(W-w)//2-b[0],cy)); cy+=f.getbbox(t)[3]+g
# highlight underline on key line
sh=Image.new("RGBA",(W,H),(0,0,0,0)); sd=ImageDraw.Draw(sh)
for t,f,px,py in pos: sd.text((px,py+3),t,font=f,fill=(0,0,0,170))
sh=sh.filter(ImageFilter.GaussianBlur(6))
for i,(t,f,px,py) in enumerate(pos):
    col=(255,214,150,255) if i==3 else (255,255,255,255)
    dr.text((px,py),t,font=f,fill=col)
# thin divider
dvy=pos[3][3]+90
dr.line([(W//2-40,dvy),(W//2+40,dvy)],fill=(255,255,255,140),width=2)
im=Image.alpha_composite(im,sh); im=Image.alpha_composite(im,txt)
# carousel hint
d2=ImageDraw.Draw(im); sf=F("Medium",28)
d2.text((W-60,H-60),"→",font=sf,fill=(255,255,255,170),anchor="rb")
im.convert("RGB").save(OUT,quality=95)
