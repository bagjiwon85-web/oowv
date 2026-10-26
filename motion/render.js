// 사용: node render.js <outDir>  — segments.json 기준 30fps PNG 시퀀스 렌더
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const out=process.argv[2];fs.mkdirSync(out,{recursive:true});
 const segs=JSON.parse(fs.readFileSync('segments.json'));segs[segs.length-1].end=61.44;
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:720,height:1280}});
 p.on('pageerror',e=>{console.error('ERR',e.message);process.exit(1)});
 await p.goto('file://'+process.cwd()+'/index.html');
 const FPS=30,N=Math.round(61.44*FPS);
 for(let f=0;f<N;f++){const url=await p.evaluate(([t,s])=>{render(t,s);return document.getElementById('c').toDataURL('image/png')},[f/FPS,segs]);
  fs.writeFileSync(`${out}/${String(f).padStart(5,'0')}.png`,Buffer.from(url.split(',')[1],'base64'));
  if(f%300==0)console.log(f,'/',N)}
 await b.close()})();
