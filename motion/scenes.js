// 글자 없는 모션그래픽: 문장(segments.json)마다 장면 하나
const W=720,H=1280,TAU=Math.PI*2;
const C={bg:'#0f1226',w:'#f4f6ff',a:'#ff5d73',b:'#3dd9eb',c:'#ffc857',dim:'#2a2f55'};
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const E={out:x=>1-Math.pow(1-x,3),io:x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2,
 back:x=>{const c=1.70158+1;return 1+c*Math.pow(x-1,3)+1.70158*Math.pow(x-1,2)},
 el:x=>x==0||x==1?x:Math.pow(2,-10*x)*Math.sin((x*10-.75)*(TAU/3))+1};
const seg=(t,a,b)=>clamp((t-a)/(b-a));
let g;
function circ(x,y,r,col,a=1){g.globalAlpha=a;g.fillStyle=col;g.beginPath();g.arc(x,y,Math.max(0,r),0,TAU);g.fill();g.globalAlpha=1}
function ring(x,y,r,col,lw=6,a=1){g.globalAlpha=a;g.strokeStyle=col;g.lineWidth=lw;g.beginPath();g.arc(x,y,Math.max(0,r),0,TAU);g.stroke();g.globalAlpha=1}
function rr(x,y,w,h,r,col,a=1){g.globalAlpha=a;g.fillStyle=col;g.beginPath();g.roundRect(x,y,w,h,r);g.fill();g.globalAlpha=1}
function line(pts,col,lw=8,a=1){g.globalAlpha=a;g.strokeStyle=col;g.lineWidth=lw;g.lineCap='round';g.lineJoin='round';g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke();g.globalAlpha=1}
function coin(x,y,r,s=1,col=C.c){g.save();g.translate(x,y);g.scale(Math.max(.02,Math.abs(s)),1);circ(0,0,r,col);ring(0,0,r*.68,'#fff6',r*.12);g.restore()}
function star(x,y,r,col,rot=0,a=1){g.save();g.translate(x,y);g.rotate(rot);g.globalAlpha=a;g.fillStyle=col;g.beginPath();for(let i=0;i<8;i++){const rad=i%2?r*.3:r;g.lineTo(Math.cos(i*TAU/8)*rad,Math.sin(i*TAU/8)*rad)}g.closePath();g.fill();g.restore();g.globalAlpha=1}
function pips(n,col,p){ // 첫째/둘째/셋째 표시: 점 n개
 for(let i=0;i<3;i++){const on=i<n,k=E.back(seg(p,i*.12,.4+i*.12));circ(W/2+(i-1)*70,150,on?16*k:8,on?col:C.dim)}}
function bag(x,y,s,col,rot=0){g.save();g.translate(x,y);g.rotate(rot);g.scale(s,s);rr(-70,-50,140,130,18,col);ring(0,-50,32,col,10);g.restore()}
function sparkle(x,y,t,col=C.w,r=20){star(x,y,r*(.6+.4*Math.sin(t*8)),col,t*2)}
function burst(x,y,p,col,n=10,R=150){for(let i=0;i<n;i++){const a=i/n*TAU,d=R*E.out(p);circ(x+Math.cos(a)*d,y+Math.sin(a)*d,10*(1-p),col,1-p*.6)}}
function person(x,y,s,col){circ(x,y-40*s,28*s,col);g.save();g.fillStyle=col;g.beginPath();g.arc(x,y+60*s,55*s,Math.PI,0);g.fill();g.restore()}
function token(x,y,r,col,sh){ // 세 가지 돈의 상징: 0 고통(뾰족) 1 편리(번개) 2 감정(하트)
 circ(x,y,r,col);g.save();g.translate(x,y);g.fillStyle=C.bg;g.beginPath();
 if(sh==0){for(let i=0;i<8;i++){const rad=i%2?r*.28:r*.62,a=i*TAU/8-Math.PI/2;g.lineTo(Math.cos(a)*rad,Math.sin(a)*rad)}}
 else if(sh==1){g.moveTo(r*.15,-r*.6);g.lineTo(-r*.35,r*.08);g.lineTo(-r*.02,r*.08);g.lineTo(-r*.15,r*.6);g.lineTo(r*.35,-r*.1);g.lineTo(r*.02,-r*.1)}
 else{g.moveTo(0,r*.5);g.bezierCurveTo(-r*.8,-r*.05,-r*.35,-r*.7,0,-r*.25);g.bezierCurveTo(r*.35,-r*.7,r*.8,-r*.05,0,r*.5)}
 g.closePath();g.fill();g.restore()}
const cols=[C.a,C.b,C.c];

// 각 장면: (t=장면 내 초, p=0..1 진행도, d=길이)
const S=[
// 0 사람들은 딱 세 가지의 돈을 씁니다
(t,p)=>{const k=E.back(seg(p,0,.25));coin(W/2,640,110*k,Math.cos(t*3));
 for(let i=0;i<3;i++){const q=E.out(seg(p,.35,.85)),a=i/3*TAU-Math.PI/2+t*.6;
  token(W/2+Math.cos(a)*230*q,640+Math.sin(a)*230*q,52*q,cols[i],i)}
 if(p<.4)burst(W/2,640,seg(p,.25,.4),C.w,12,200)},
// 1 첫째, 고통을 없애려 지갑을 엽니다
(t,p)=>{pips(1,C.a,p);const o=E.out(seg(p,.1,.5));
 rr(W/2-150,640-90,300,200,28,'#8a3548');
 g.save();g.translate(W/2-150,550);g.rotate(-o*1.1);rr(0,-10,300,70,28,C.a);g.restore();
 for(let i=0;i<5;i++){const q=seg(p,.35+i*.1,.9);if(q>0){coin(W/2-80+i*40,640-q*380-Math.sin(q*3)*20,26,Math.cos(q*10+i),C.c)}}
 token(W/2,720,44,C.a,0)},
// 2 스트레스·빚·체중 등 문제가 클수록 더 많은 돈
(t,p)=>{pips(1,C.a,1);const xs=[-190,0,190];
 xs.forEach((x,i)=>{const h=60+E.out(seg(p,i*.15,.6+i*.15))*(300+i*60);
  rr(W/2+x-55,900-h,110,h,22,C.a,.35+.2*i);
  for(let j=0;j<Math.floor(h/60);j++)coin(W/2+x,880-j*52,24,1);});
 const r=E.out(seg(p,0,.9));circ(W/2,420,70+r*110,C.a,.18);ring(W/2,420,70+r*110,C.a,6,.7)},
// 3 스트레스 해소 쇼핑
(t,p)=>{pips(1,C.a,1);const q=seg(p,0,.45);
 const sc=[[-150,-60],[-60,-120],[40,-70],[130,-130],[190,-50]].map(([x,y],i)=>[W/2-140+i*70,520+y*(1-q)*.6+(i%2?-30:30)*(1-q)]);
 line(sc,C.a,10,1-q);
 const k=E.back(seg(p,.35,.65));bag(W/2,700,k*1.3,C.b,Math.sin(t*9)*.08*seg(p,.5,1));
 sparkle(W/2+130,590,t,C.w,22*k);sparkle(W/2-140,620,t+1,C.c,16*k)},
// 4 다이어트 (아령 들기)
(t,p)=>{pips(1,C.a,1);const up=(1-Math.cos(clamp(t*3.2)*TAU*1))/2*0;const y=760-Math.abs(Math.sin(t*3.2))*190;
 line([[W/2-170,y],[W/2+170,y]],C.w,18);
 [-1,1].forEach(s=>{rr(W/2+s*170-27,y-70,54,140,14,C.a);rr(W/2+s*(170+s*50)-15,y-48,30,96,10,C.c)});
 const k=E.out(seg(p,0,.5));ring(W/2,420,70*k,C.b,12);
 g.globalAlpha=.9;line([[W/2-35*k,420],[W/2-8*k,448],[W/2+38*k,392]],C.b,12);g.globalAlpha=1;
 for(let i=0;i<4;i++)circ(W/2-120+i*80,910+((t*80+i*40)%60),6,C.b,.5)},
// 5 둘째
(t,p)=>{pips(2,C.b,p);const k=E.back(seg(p,0,.4));
 token(W/2,640,160*k,C.b,1);ring(W/2,640,160*k+30*E.out(p),C.b,5,1-p)},
// 6 삼성·애플·쿠팡·아마존 = 세계적인 기업들
(t,p)=>{pips(2,C.b,1);const k=E.out(seg(p,0,.4));
 circ(W/2,660,150*k,'#1d2a66');ring(W/2,660,150*k,C.b,5);
 g.save();g.beginPath();g.arc(W/2,660,150*k,0,TAU);g.clip();
 for(let i=-3;i<=3;i++){line([[W/2-150+((t*20)%1),660+i*45],[W/2+150,660+i*45]],C.b,2,.35)}g.restore();
 for(let i=0;i<4;i++){const a=i/4*TAU+t*1.2,R=270*k;const x=W/2+Math.cos(a)*R,y=660+Math.sin(a)*R*.55;
  const kk=E.back(seg(p,.3+i*.12,.6+i*.12));rr(x-45*kk,y-45*kk,90*kk,90*kk,22*kk,[C.a,C.w,C.c,C.b][i]);circ(x,y,16*kk,C.bg)}},
// 7 더 빠르게, 더 쉽게, 편리하게
(t,p)=>{pips(2,C.b,1);for(let i=0;i<9;i++){const y=380+i*85,x0=((t*900+i*173)%1100)-200;line([[x0,y],[x0+180,y]],C.b,6,.35)}
 const q=E.out(seg(p,0,.35));g.save();g.translate(W/2+(1-q)*-500,560);rr(-130,-70,260,140,70,C.b);
 g.fillStyle=C.bg;g.beginPath();g.moveTo(-30,-30);g.lineTo(55,0);g.lineTo(-30,30);g.fill();g.restore();
 const bk=E.back(seg(p,.35,.65));rr(W/2-170,820,340,120,60,C.dim);circ(W/2-110+bk*220*Math.min(1,seg(p,.5,.7)),880,44,C.c);
 const ck=seg(p,.7,.95);line([[W/2-40,1050],[W/2-10,1085],[W/2+50,1015]].map((pt,i,arr)=>pt),C.b,14,ck)},
// 8 귀찮음 해소 (엉킨 선이 풀려 직선으로)
(t,p)=>{pips(2,C.b,1);const q=E.io(seg(p,.1,.7)),pts=[];
 for(let i=0;i<=60;i++){const x=W/2-250+i*500/60,ph=i*.55+t*3;const tan=Math.sin(ph)*130+Math.sin(ph*2.3)*70;pts.push([x,640+tan*(1-q)])}
 line(pts,q>.95?C.b:C.a,12);
 const k=E.back(seg(p,.7,1));circ(W/2,640,20*k,C.w);burst(W/2,640,seg(p,.7,1),C.b,10,180)},
// 9 귀찮음을 해소해줄 때 돈을 쓴다
(t,p)=>{pips(2,C.b,1);rr(W/2-190,800,380,70,35,C.dim);rr(W/2-120,818,240,18,9,'#000a');
 const q=seg(p,.05,.5);const cy=300+E.out(q)*(530-300);coin(W/2,cy,64,Math.cos(t*8)*(q<1?1:0)+ (q>=1?1:0),C.c);
 if(q>=1)burst(W/2,820,seg(p,.5,.9),C.c,12,180);
 for(let i=0;i<3;i++){const a=seg(p,.55+i*.08,1);if(a>0)token(W/2-150+i*150,1030-E.out(a)*60,38*E.back(a),cols[1],1)}},
// 10 셋째
(t,p)=>{pips(3,C.c,p);const k=E.back(seg(p,0,.4));
 token(W/2,640,160*k,C.c,2);ring(W/2,640,160*k+30*E.out(p),C.c,5,1-p)},
// 11 다른 데서 얻을 수 없는 그 순간의 감정 (하트 맥박 + 순간 플래시)
(t,p)=>{pips(3,C.c,1);const beat=1+.12*Math.max(0,Math.sin(t*7))**2;
 for(let i=0;i<3;i++)ring(W/2,640,160*E.out(seg((t*.9+i*.33)%1,0,1))+60,C.c,4,1-seg((t*.9+i*.33)%1,0,1));
 token(W/2,640,150*beat*E.back(seg(p,0,.3)),C.c,2);
 for(let i=0;i<6;i++){const a=i/6*TAU+t,r=260;sparkle(W/2+Math.cos(a)*r,640+Math.sin(a)*r,t+i,C.c,14)}},
// 12 나중에 할 얘기거리 (말풍선 팝)
(t,p)=>{pips(3,C.c,1);[[-120,520,1],[110,700,-1],[-90,880,1]].forEach(([x,y,s],i)=>{
  const k=E.back(seg(p,i*.2,.3+i*.2));g.save();g.translate(W/2+x,y);g.scale(k*s,k);rr(-120,-60,240,120,40,i==1?C.c:C.w);
  g.fillStyle=i==1?C.c:C.w;g.beginPath();g.moveTo(-70,55);g.lineTo(-100,100);g.lineTo(-30,58);g.fill();
  for(let j=0;j<3;j++)circ(-45+j*45,0,12*(1+.35*Math.sin(t*8+j*1.2)),C.bg);g.restore()})},
// 13 편의점 봉투 100원은 아까워서 손에 들고
(t,p)=>{pips(3,C.c,1);const k=E.back(seg(p,0,.3));
 g.save();g.translate(W/2,560);g.rotate(Math.sin(t*3)*.06);bag(0,170,k*.9,C.w);line([[0,0],[0,90]],C.w,10);g.restore();
 const c=E.out(seg(p,.3,.7));coin(W/2+140,760,34*c,Math.cos(t*5),C.c);
 const sq=seg(p,.55,.9);line([[W/2+105,730],[W/2+175,790]],C.a,10,sq);line([[W/2+175,730],[W/2+105,790]],C.a,10,sq)},
// 14 해외여행엔 100만원 (비행기 + 동전더미)
(t,p)=>{pips(3,C.c,1);const q=E.io(seg(p,0,.8));
 for(let i=0;i<5;i++){const h=E.out(seg(p,.1+i*.08,.6));for(let j=0;j<4+i;j++)if(j/(4+i)<h)coin(110+i*125,1050-j*30,44,1,C.c)}
 const x=-80+q*880,y=520-Math.sin(q*Math.PI)*130;g.save();g.translate(x,y);g.rotate(-.25+q*.5);
 g.fillStyle=C.w;g.beginPath();g.moveTo(80,0);g.lineTo(-20,-18);g.lineTo(-70,-70);g.lineTo(-45,0);g.lineTo(-70,70);g.lineTo(-20,18);g.closePath();g.fill();g.restore();
 line([[x-200,y+10],[x-60,y+10]],C.w,5,.3)},
// 15 돈은 이 세 군데로만 흐릅니다 (세 갈래 파이프)
(t,p)=>{const xs=[-210,0,210];
 for(let i=0;i<3;i++){const x=W/2+xs[i];line([[W/2,420],[W/2,520],[x,640],[x,1000]],C.dim,34);
  const draw=seg(p,.15+i*.1,.6+i*.1);line([[W/2,420],[W/2,520],[x,640],[x,1000]],cols[i],8,draw);
  token(x,1060,E.back(seg(p,.5+i*.1,.8))*58,cols[i],i)}
 for(let k=0;k<12;k++){const f=((t*.6+k/12)%1);const i=k%3,x=W/2+xs[i];
  const P=[[W/2,420],[W/2,520],[x,640],[x,1000]];const lens=[100,Math.hypot(x-W/2,120),360],tot=lens.reduce((a,b)=>a+b);let d=f*tot,s=0;
  while(s<2&&d>lens[s]){d-=lens[s];s++}const a=P[s],b=P[s+1],u=d/lens[s];
  coin(a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,16,Math.cos(t*6+k),C.c)}
 circ(W/2,420,34*E.back(seg(p,0,.2)),C.c)},
// 16 돈 버는 사람 = 이 중 하나를 주는 사람
(t,p)=>{const k=E.back(seg(p,0,.3));person(W/2+200,760,2*k,C.w);
 g.save();g.translate(W/2-200,760);person(0,0,2*k,C.dim);g.restore();
 const q=E.io(seg(p,.25,.7));token(W/2-200+q*400,560-Math.sin(q*Math.PI)*120,60,cols[1],1);
 for(let i=0;i<3;i++)token(W/2-110+i*110,1040,seg(p,.1+i*.1,.4)*40,cols[i],i);
 if(q>=1){burst(W/2+200,560,seg(p,.7,1),C.c,10,150);coin(W/2+200,480-seg(p,.7,1)*40,30,Math.cos(t*8),C.c)}},
// 17 나는 이 세 중에 뭘 줄 수 있을까 (물음표 + 세 토큰 순환)
(t,p)=>{const k=E.back(seg(p,0,.35));g.save();g.translate(W/2,520);g.scale(k,k);
 g.strokeStyle=C.w;g.lineWidth=26;g.lineCap='round';g.beginPath();g.arc(0,-40,70,Math.PI*1.1,Math.PI*2.55);g.bezierCurveTo(70,90,0,60,0,130);g.stroke();circ(0,230,18,C.w);g.restore();
 for(let i=0;i<3;i++){const a=i/3*TAU+t*1.6,x=W/2+Math.cos(a)*230,y=900+Math.sin(a)*110;const on=Math.floor((t*1.2)%3)==i;
  token(x,y,(on?66:46)*seg(p,.2,.5),cols[i],i)}},
// 18 질문 몇 개만 답하면 (체크리스트)
(t,p)=>{rr(W/2-230,330,460,640,44,'#1a1f44');rr(W/2-230,330,460,640,44,'#0000',1);ring(W/2,330,0,C.w);
 for(let i=0;i<4;i++){const y=440+i*130,k=E.out(seg(p,i*.15,.3+i*.15));rr(W/2-190,y-30,60*k,60*k,16*k,cols[i%3]);
  const ck=seg(p,.35+i*.13,.5+i*.13);line([[W/2-176,y],[W/2-160,y+16],[W/2-140,y-14]],C.bg,9,ck);
  rr(W/2-100,y-12,280*k,24,12,C.dim)}},
// 19 프로필 링크에서 확인
(t,p)=>{const k=E.back(seg(p,0,.3));circ(W/2,520,130*k,C.dim);person(W/2,520,1.4*k,C.w);ring(W/2,520,130*k+14,C.c,8);
 // 링크(체인) 버튼
 const bk=E.back(seg(p,.25,.55));rr(W/2-190,780,380,120,60,C.b,1);g.save();g.translate(W/2,840);g.scale(bk,bk);
 rr(-70,-22,80,44,22,'#0000');g.strokeStyle=C.bg;g.lineWidth=12;g.beginPath();g.roundRect(-80,-24,90,48,24);g.stroke();g.beginPath();g.roundRect(-10,-24,90,48,24);g.stroke();g.restore();
 // 커서 탭
 const cx=W/2+120-(1-E.out(seg(p,.4,.75)))*200,cy=840+90-(1-E.out(seg(p,.4,.75)))*200+Math.max(0,Math.sin(seg(p,.75,1)*TAU*2))*-10;
 g.save();g.translate(cx,cy);g.fillStyle=C.w;g.beginPath();g.moveTo(0,0);g.lineTo(0,70);g.lineTo(20,52);g.lineTo(38,88);g.lineTo(52,80);g.lineTo(34,46);g.lineTo(60,44);g.closePath();g.fill();g.restore();
 ring(W/2,840,40+((t*80)%120),C.b,4,1-((t*80)%120)/120)}
];

// 문장 18+마지막(프로필 링크)=segments.json 인덱스에 대응. 문장 수 > 장면 수인 경우를 위해 매핑
// seg idx : 0 세가지 | 1 첫째 | 2 스트레스빚 | 3 쇼핑 | 4 다이어트 | 5 둘째 | 6 기업 | 7 빠르게 | 8 귀찮음 | 9 돈쓴다 | 10 셋째 | 11 감정(=11) | 12 얘기거리 | 13 봉투 | 14 해외여행 | 15 흐른다 | 16 주는 사람 | 17 뭘 줄까 | 18 질문 | 19 링크
const MAP=[0,1,2,3,4,6,5,7,8,9,11,12,13,14,15,16,17,18,19];
function bgDraw(t){const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#141a3d');gr.addColorStop(1,'#0b0d1f');g.fillStyle=gr;g.fillRect(0,0,W,H);
 for(let i=0;i<26;i++){const x=(i*277+t*(10+i%5*6))%W,y=(i*431+t*(-14-i%4*8)+H*3)%H;circ(x,y,2+i%3*1.5,'#fff',.08+.04*(i%3))}}
window.setup=(ctx)=>{g=ctx};
window.render=(t,segs)=>{bgDraw(t);let i=segs.findIndex(s=>t<s.end);if(i<0)i=segs.length-1;
 const s=segs[i],start=i==0?0:segs[i-1].end,end=s.end,d=end-start,lt=t-start,p=clamp(lt/d);
 // 장면 입출력 페이드/스케일
 const fi=E.out(clamp(lt/.28)),fo=1-E.io(clamp((lt-(d-.22))/.22));
 g.save();g.globalAlpha=fi*fo;g.translate(W/2,H/2);const sc=.92+.08*fi;g.scale(sc,sc);g.translate(-W/2,-H/2);
 // 장면 1개만 사용(문장 수와 장면 수 일치)
 const sceneIdx=Math.min(MAP[i]??i,S.length-1);S[sceneIdx](lt,p);g.restore()};
