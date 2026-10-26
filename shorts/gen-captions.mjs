import fs from 'fs';
const t=s=>{const [h,m,r]=s.split(':');const [sec,ms]=r.split(',');return +h*3600+ +m*60+ +sec+ +ms/1000};
const out=fs.readFileSync('shorts_trimmed.srt','utf8').trim().split(/\r?\n\r?\n/).map(b=>{const l=b.split(/\r?\n/);const [a,c]=l[1].split(' --> ');return {start:t(a),end:t(c),text:l.slice(2).join(' ').trim()}});
fs.writeFileSync('src/captions.ts','export const captions=' + JSON.stringify(out,null,1)+' as {start:number;end:number;text:string}[];\n');
console.log(out.length,'captions');
