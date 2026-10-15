// Line icons drawn in a 100x100 box centred on origin.
function drawWon(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = '#000'; ctx.lineWidth = 4.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(-14, -14); ctx.lineTo(-7, 14); ctx.lineTo(0, -6); ctx.lineTo(7, 14); ctx.lineTo(14, -14); ctx.stroke(); line(-18, -1, 18, -1); ctx.restore(); }
const S = () => { ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; };
const ICONS = {
  coin(c, a) { S(); ctx.strokeStyle = c; circle(0, 0, 38); ctx.stroke(); circle(0, 0, 28); ctx.fillStyle = a; ctx.fill();
    drawWon(0, 0, 1); },
  coins(c, a) { S(); ctx.strokeStyle = c;
    for (let i = 0; i < 4; i++) { const y = 30 - i * 14; ctx.beginPath(); ctx.ellipse(-12, y, 26, 9, 0, 0, Math.PI * 2); ctx.fillStyle = '#000'; ctx.fill(); ctx.stroke(); }
    circle(26, 14, 22); ctx.fillStyle = a; ctx.fill(); drawWon(26, 14, 0.78); },
  bill(c, a) { S(); ctx.strokeStyle = c; rrect(-44, -26, 88, 52, 6); ctx.stroke(); circle(0, 0, 13); ctx.fillStyle = a; ctx.fill();
    circle(-30, 0, 3); ctx.fillStyle = c; ctx.fill(); circle(30, 0, 3); ctx.fill(); },
  wallet(c, a) { S(); ctx.strokeStyle = c; rrect(-42, -28, 84, 60, 8); ctx.stroke(); rrect(12, -8, 30, 20, 5); ctx.stroke();
    circle(24, 2, 4); ctx.fillStyle = a; ctx.fill(); line(-34, -28, 22, -42); line(22, -42, 30, -28); },
  briefcase(c, a) { S(); ctx.strokeStyle = c; rrect(-44, -22, 88, 60, 7); ctx.stroke(); rrect(-16, -36, 32, 14, 4); ctx.stroke();
    line(-44, 4, 44, 4); ctx.fillStyle = a; ctx.fillRect(-7, -2, 14, 12); },
  chartUp(c, a) { S(); ctx.strokeStyle = c; line(-44, -44, -44, 42); line(-44, 42, 44, 42);
    ctx.strokeStyle = a; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-34, 24); ctx.lineTo(-10, 2); ctx.lineTo(8, 14); ctx.lineTo(36, -24); ctx.stroke();
    ctx.fillStyle = a; arrowHead(40, -30, -0.9, 18); },
  chartDown(c, a) { S(); ctx.strokeStyle = c; line(-44, -44, -44, 42); line(-44, 42, 44, 42);
    ctx.strokeStyle = a; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-34, -26); ctx.lineTo(-10, -4); ctx.lineTo(8, -14); ctx.lineTo(34, 20); ctx.stroke();
    ctx.fillStyle = a; arrowHead(38, 26, 0.9, 18); },
  clock(c, a) { S(); ctx.strokeStyle = c; circle(0, 0, 42); ctx.stroke(); ctx.strokeStyle = a; ctx.lineWidth = 6; line(0, 0, 0, -26); line(0, 0, 18, 10);
    circle(0, 0, 5); ctx.fillStyle = a; ctx.fill(); },
  calendar(c, a) { S(); ctx.strokeStyle = c; rrect(-40, -34, 80, 76, 8); ctx.stroke(); line(-40, -12, 40, -12); line(-20, -44, -20, -26); line(20, -44, 20, -26);
    ctx.fillStyle = a; ctx.fillRect(4, 6, 20, 18); ctx.fillStyle = c; for (const [x, y] of [[-26, 6], [-10, 6], [-26, 24], [-10, 24]]) ctx.fillRect(x, y, 10, 10); },
  pin(c, a) { S(); ctx.fillStyle = a; ctx.beginPath(); ctx.arc(0, -12, 30, Math.PI * 0.85, Math.PI * 2.15); ctx.lineTo(0, 44); ctx.closePath(); ctx.fill();
    circle(0, -12, 11); ctx.fillStyle = '#000'; ctx.fill(); },
  plane(c, a) { ctx.save(); ctx.rotate(-0.6); ctx.fillStyle = c; ctx.beginPath();
    ctx.moveTo(0, -48); ctx.quadraticCurveTo(7, -40, 7, -20); ctx.lineTo(46, 6); ctx.lineTo(46, 16); ctx.lineTo(7, 4); ctx.lineTo(6, 30); ctx.lineTo(18, 40); ctx.lineTo(18, 47);
    ctx.lineTo(0, 41); ctx.lineTo(-18, 47); ctx.lineTo(-18, 40); ctx.lineTo(-6, 30); ctx.lineTo(-7, 4); ctx.lineTo(-46, 16); ctx.lineTo(-46, 6); ctx.lineTo(-7, -20); ctx.quadraticCurveTo(-7, -40, 0, -48); ctx.fill();
    ctx.fillStyle = a; ctx.fillRect(-3, -36, 6, 10); ctx.restore(); },
  person(c, a) { ctx.fillStyle = c; circle(0, -24, 17); ctx.fill(); ctx.beginPath(); ctx.moveTo(-32, 46); ctx.quadraticCurveTo(-32, 0, 0, 0); ctx.quadraticCurveTo(32, 0, 32, 46); ctx.closePath(); ctx.fill(); },
  worker(c, a) { ICONS.person(c, a); ctx.fillStyle = a; ctx.beginPath(); ctx.moveTo(0, 4); ctx.lineTo(-6, 14); ctx.lineTo(0, 40); ctx.lineTo(6, 14); ctx.closePath(); ctx.fill(); },
  family(c, a) { ctx.save(); ctx.translate(-26, 0); ctx.scale(0.8, 0.8); ICONS.person(c, a); ctx.restore();
    ctx.save(); ctx.translate(26, 0); ctx.scale(0.8, 0.8); ICONS.person(c, a); ctx.restore();
    ctx.save(); ctx.translate(0, 18); ctx.scale(0.55, 0.55); ICONS.person(a, a); ctx.restore(); },
  house(c, a) { S(); ctx.strokeStyle = c; ctx.beginPath(); ctx.moveTo(-44, -2); ctx.lineTo(0, -40); ctx.lineTo(44, -2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-32, -10); ctx.lineTo(-32, 42); ctx.lineTo(32, 42); ctx.lineTo(32, -10); ctx.stroke();
    ctx.fillStyle = a; rrect(-10, 14, 20, 28, 3); ctx.fill(); },
  heart(c, a) { ctx.fillStyle = a; ctx.beginPath(); ctx.moveTo(0, 38); ctx.bezierCurveTo(-60, -4, -30, -48, 0, -18); ctx.bezierCurveTo(30, -48, 60, -4, 0, 38); ctx.fill(); },
  bread(c, a) { S(); ctx.strokeStyle = c; ctx.beginPath(); ctx.moveTo(-40, 30); ctx.lineTo(-40, -4); ctx.arc(-24, -10, 18, Math.PI * 0.9, Math.PI * 1.5); ctx.lineTo(24, -28);
    ctx.arc(24, -10, 18, Math.PI * 1.5, Math.PI * 2.1); ctx.lineTo(40, 30); ctx.closePath(); ctx.stroke();
    ctx.strokeStyle = a; line(-20, -6, -10, 14); line(0, -8, 10, 12); line(20, -6, 28, 10); },
  shop(c, a) { S(); ctx.strokeStyle = c; ctx.beginPath(); ctx.moveTo(-36, -4); ctx.lineTo(-36, 42); ctx.lineTo(36, 42); ctx.lineTo(36, -4); ctx.stroke();
    ctx.fillStyle = a; ctx.beginPath(); ctx.moveTo(-46, -12); ctx.lineTo(-38, -40); ctx.lineTo(38, -40); ctx.lineTo(46, -12); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#000'; for (let i = -1; i <= 1; i++) ctx.fillRect(i * 26 - 3, -40, 6, 28);
    rrect(-12, 14, 24, 28, 3); ctx.stroke(); },
  building(c, a) { S(); ctx.strokeStyle = c; ctx.strokeRect(-30, -44, 60, 88); ctx.fillStyle = c;
    for (let r = 0; r < 4; r++) for (let k = 0; k < 2; k++) ctx.fillRect(-18 + k * 24, -32 + r * 18, 12, 10); ctx.fillStyle = a; ctx.fillRect(-8, 30, 16, 14); },
  grid(c, a) { S(); ctx.strokeStyle = c; rrect(-42, -36, 84, 72, 6); ctx.stroke(); ctx.lineWidth = 3;
    for (let i = 1; i < 4; i++) line(-42, -36 + i * 18, 42, -36 + i * 18); line(-14, -36, -14, 36); line(14, -36, 14, 36);
    ctx.fillStyle = a; ctx.fillRect(-42, -36, 84, 18); },
  doc(c, a) { S(); ctx.strokeStyle = c; ctx.beginPath(); ctx.moveTo(-32, -44); ctx.lineTo(16, -44); ctx.lineTo(34, -26); ctx.lineTo(34, 44); ctx.lineTo(-32, 44); ctx.closePath(); ctx.stroke();
    ctx.lineWidth = 4; line(-20, -20, 18, -20); line(-20, -4, 18, -4); ctx.strokeStyle = a; line(-20, 12, 6, 12); line(-20, 28, 18, 28); },
  report(c, a) { S(); ctx.strokeStyle = c; rrect(-36, -44, 72, 88, 6); ctx.stroke(); ctx.fillStyle = a;
    ctx.fillRect(-22, 8, 10, 24); ctx.fillRect(-5, -6, 10, 38); ctx.fillRect(12, -20, 10, 52); ctx.fillStyle = c; ctx.fillRect(-22, -30, 44, 5); },
  magnifier(c, a) { S(); ctx.strokeStyle = c; ctx.lineWidth = 7; circle(-8, -8, 28); ctx.stroke(); ctx.strokeStyle = a; ctx.lineWidth = 11; line(14, 14, 38, 38); },
  bulb(c, a) { S(); ctx.strokeStyle = c; ctx.beginPath(); ctx.arc(0, -12, 28, Math.PI * 0.8, Math.PI * 2.2); ctx.lineTo(12, 22); ctx.lineTo(-12, 22); ctx.closePath(); ctx.stroke();
    line(-10, 32, 10, 32); line(-6, 41, 6, 41); ctx.strokeStyle = a; ctx.beginPath(); ctx.moveTo(-8, 8); ctx.lineTo(-4, -10); ctx.lineTo(0, 2); ctx.lineTo(4, -10); ctx.lineTo(8, 8); ctx.stroke(); },
  question(c, a) { ctx.fillStyle = a; setFont(96, 700); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', 0, 6); },
  exclaim(c, a) { ctx.fillStyle = a; setFont(96, 700); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('!', 0, 6); },
  check(c, a) { ctx.strokeStyle = a; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(-34, 2); ctx.lineTo(-10, 26); ctx.lineTo(36, -24); ctx.stroke(); },
  cross(c, a) { ctx.strokeStyle = a; ctx.lineWidth = 12; ctx.lineCap = 'round'; line(-30, -30, 30, 30); line(30, -30, -30, 30); },
  target(c, a) { S(); ctx.strokeStyle = c; circle(0, 0, 42); ctx.stroke(); circle(0, 0, 27); ctx.stroke(); circle(0, 0, 12); ctx.fillStyle = a; ctx.fill(); },
  play(c, a) { ctx.fillStyle = a; rrect(-48, -34, 96, 68, 18); ctx.fill(); ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(-12, -18); ctx.lineTo(20, 0); ctx.lineTo(-12, 18); ctx.closePath(); ctx.fill(); },
  screen(c, a) { S(); ctx.strokeStyle = c; rrect(-46, -34, 92, 62, 6); ctx.stroke(); line(-18, 42, 18, 42); line(0, 28, 0, 42);
    ctx.fillStyle = a; ctx.beginPath(); ctx.moveTo(-8, -14); ctx.lineTo(12, -3); ctx.lineTo(-8, 8); ctx.closePath(); ctx.fill(); },
  comment(c, a) { S(); ctx.strokeStyle = c; rrect(-44, -36, 88, 58, 10); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-20, 22); ctx.lineTo(-30, 40); ctx.lineTo(0, 22); ctx.stroke();
    ctx.lineWidth = 4; line(-30, -18, 30, -18); ctx.strokeStyle = a; line(-30, 0, 12, 0); },
  pushpin(c, a) { ctx.save(); ctx.rotate(0.5); ctx.fillStyle = a; rrect(-14, -40, 28, 12, 3); ctx.fill(); ctx.fillRect(-8, -30, 16, 26);
    rrect(-22, -6, 44, 10, 3); ctx.fill(); ctx.strokeStyle = c; ctx.lineWidth = 5; ctx.lineCap = 'round'; line(0, 4, 0, 40); ctx.restore(); },
  link(c, a) { ctx.save(); ctx.rotate(-0.78); S(); ctx.lineWidth = 8; ctx.strokeStyle = c; rrect(-46, -14, 50, 28, 14); ctx.stroke(); ctx.strokeStyle = a; rrect(-4, -14, 50, 28, 14); ctx.stroke(); ctx.restore(); },
  megaphone(c, a) { S(); ctx.strokeStyle = c; ctx.beginPath(); ctx.moveTo(-36, -12); ctx.lineTo(20, -36); ctx.lineTo(20, 28); ctx.lineTo(-36, 10); ctx.closePath(); ctx.stroke();
    ctx.fillStyle = a; ctx.fillRect(-46, -12, 12, 22); line(-26, 12, -18, 36); ctx.strokeStyle = a; line(32, -18, 44, -26); line(34, -2, 48, -2); line(32, 14, 44, 22); },
  book(c, a) { S(); ctx.strokeStyle = c; ctx.beginPath(); ctx.moveTo(0, -26); ctx.quadraticCurveTo(-24, -40, -46, -32); ctx.lineTo(-46, 34); ctx.quadraticCurveTo(-24, 26, 0, 38);
    ctx.quadraticCurveTo(24, 26, 46, 34); ctx.lineTo(46, -32); ctx.quadraticCurveTo(24, -40, 0, -26); ctx.lineTo(0, 38); ctx.stroke();
    ctx.strokeStyle = a; ctx.lineWidth = 4; line(-34, -14, -12, -10); line(-34, 2, -12, 6); },
  box(c, a) { S(); ctx.strokeStyle = c; ctx.beginPath(); ctx.moveTo(0, -42); ctx.lineTo(40, -22); ctx.lineTo(40, 24); ctx.lineTo(0, 44); ctx.lineTo(-40, 24); ctx.lineTo(-40, -22); ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-40, -22); ctx.lineTo(0, -2); ctx.lineTo(40, -22); ctx.moveTo(0, -2); ctx.lineTo(0, 44); ctx.stroke();
    ctx.strokeStyle = a; line(-20, -32, 20, -12); },
  cap(c, a) { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(0, -36); ctx.lineTo(48, -14); ctx.lineTo(0, 8); ctx.lineTo(-48, -14); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-28, 0); ctx.lineTo(-28, 24); ctx.quadraticCurveTo(0, 42, 28, 24); ctx.lineTo(28, 0); ctx.lineTo(0, 12); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = a; ctx.lineWidth = 4; line(40, -10, 40, 22); circle(40, 26, 5); ctx.fillStyle = a; ctx.fill(); },
  star(c, a) { ctx.fillStyle = a; ctx.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 19 : 44, ang = -Math.PI / 2 + i * Math.PI / 5; ctx.lineTo(Math.cos(ang) * r, Math.sin(ang) * r + 4); } ctx.closePath(); ctx.fill(); },
  key(c, a) { S(); ctx.strokeStyle = a; ctx.lineWidth = 8; circle(-22, 0, 18); ctx.stroke(); line(-4, 0, 44, 0); line(30, 0, 30, 16); line(42, 0, 42, 12); },
  lock(c, a) { S(); ctx.strokeStyle = c; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(0, -12, 20, Math.PI, 0); ctx.lineTo(20, 2); ctx.moveTo(-20, 2); ctx.lineTo(-20, -12); ctx.stroke();
    ctx.fillStyle = c; rrect(-32, 0, 64, 46, 8); ctx.fill(); ctx.fillStyle = a; circle(0, 18, 7); ctx.fill(); ctx.fillRect(-3, 20, 6, 14); },
  unlock(c, a) { S(); ctx.strokeStyle = c; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(0, -22, 20, Math.PI, 0); ctx.lineTo(20, -14); ctx.moveTo(-20, 2); ctx.lineTo(-20, -22); ctx.stroke();
    ctx.fillStyle = c; rrect(-32, 0, 64, 46, 8); ctx.fill(); ctx.fillStyle = a; circle(0, 18, 7); ctx.fill(); ctx.fillRect(-3, 20, 6, 14); },
  gear(c, a) { ctx.fillStyle = c; ctx.beginPath(); for (let i = 0; i < 16; i++) { const r = i % 2 ? 32 : 44, ang = i * Math.PI / 8; ctx.lineTo(Math.cos(ang - 0.15) * r, Math.sin(ang - 0.15) * r); ctx.lineTo(Math.cos(ang + 0.15) * r, Math.sin(ang + 0.15) * r); } ctx.closePath(); ctx.fill();
    circle(0, 0, 15); ctx.fillStyle = a; ctx.fill(); },
  gift(c, a) { S(); ctx.strokeStyle = c; ctx.strokeRect(-38, -10, 76, 52); ctx.strokeRect(-44, -26, 88, 16); ctx.fillStyle = a; ctx.fillRect(-6, -26, 12, 68);
    ctx.strokeStyle = a; ctx.beginPath(); ctx.ellipse(-14, -34, 13, 8, 0.4, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.ellipse(14, -34, 13, 8, -0.4, 0, Math.PI * 2); ctx.stroke(); },
  chat(c, a) { ctx.fillStyle = a; ctx.beginPath(); ctx.ellipse(0, -6, 46, 34, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.moveTo(-24, 20); ctx.lineTo(-34, 44); ctx.lineTo(-4, 26); ctx.fill();
    ctx.fillStyle = '#000'; for (let i = -1; i <= 1; i++) { circle(i * 18, -6, 6); ctx.fill(); } },
  cart(c, a) { S(); ctx.strokeStyle = c; ctx.beginPath(); ctx.moveTo(-46, -34); ctx.lineTo(-32, -34); ctx.lineTo(-20, 18); ctx.lineTo(32, 18); ctx.lineTo(42, -18); ctx.lineTo(-26, -18); ctx.stroke();
    ctx.fillStyle = a; circle(-14, 34, 8); ctx.fill(); circle(26, 34, 8); ctx.fill(); },
  piggy(c, a) { S(); ctx.strokeStyle = c; ctx.beginPath(); ctx.ellipse(0, 6, 40, 30, 0, 0, Math.PI * 2); ctx.stroke(); line(-22, 32, -22, 44); line(18, 32, 18, 44);
    ctx.fillStyle = a; ctx.fillRect(-12, -26, 24, 6); circle(46, 4, 9); ctx.stroke(); circle(18, -4, 4); ctx.fillStyle = c; ctx.fill(); ctx.beginPath(); ctx.moveTo(-20, -18); ctx.lineTo(-26, -36); ctx.lineTo(-8, -24); ctx.stroke(); },
  funnel(c, a) { S(); ctx.strokeStyle = c; ctx.beginPath(); ctx.moveTo(-46, -38); ctx.lineTo(46, -38); ctx.lineTo(10, 6); ctx.lineTo(10, 40); ctx.lineTo(-10, 30); ctx.lineTo(-10, 6); ctx.closePath(); ctx.stroke();
    ctx.fillStyle = a; ctx.beginPath(); ctx.moveTo(-30, -24); ctx.lineTo(30, -24); ctx.lineTo(12, -2); ctx.lineTo(-12, -2); ctx.closePath(); ctx.fill(); },
  eye(c, a) { S(); ctx.strokeStyle = c; ctx.beginPath(); ctx.moveTo(-46, 0); ctx.quadraticCurveTo(0, -46, 46, 0); ctx.quadraticCurveTo(0, 46, -46, 0); ctx.stroke(); circle(0, 0, 14); ctx.fillStyle = a; ctx.fill(); },
  flag(c, a) { S(); ctx.strokeStyle = c; line(-28, -44, -28, 46); ctx.fillStyle = a; ctx.beginPath(); ctx.moveTo(-26, -42); ctx.lineTo(36, -26); ctx.lineTo(-26, -8); ctx.closePath(); ctx.fill(); },
  thumb(c, a) { ctx.fillStyle = a; rrect(-44, -6, 20, 50, 4); ctx.fill(); ctx.beginPath(); ctx.moveTo(-18, -4); ctx.lineTo(0, -40); ctx.quadraticCurveTo(14, -44, 12, -24); ctx.lineTo(8, -8); ctx.lineTo(38, -8);
    ctx.quadraticCurveTo(48, -6, 44, 6); ctx.lineTo(36, 40); ctx.quadraticCurveTo(32, 46, 24, 46); ctx.lineTo(-18, 46); ctx.closePath(); ctx.fill(); },
  hourglass(c, a) { S(); ctx.strokeStyle = c; line(-30, -44, 30, -44); line(-30, 44, 30, 44); ctx.beginPath(); ctx.moveTo(-24, -44); ctx.lineTo(-24, -30); ctx.lineTo(0, 0); ctx.lineTo(-24, 30); ctx.lineTo(-24, 44);
    ctx.moveTo(24, -44); ctx.lineTo(24, -30); ctx.lineTo(0, 0); ctx.lineTo(24, 30); ctx.lineTo(24, 44); ctx.stroke(); ctx.fillStyle = a; ctx.beginPath(); ctx.moveTo(-16, 40); ctx.lineTo(0, 22); ctx.lineTo(16, 40); ctx.closePath(); ctx.fill(); },
  puzzle(c, a) { ctx.fillStyle = a; ctx.beginPath(); ctx.moveTo(-36, -36); ctx.lineTo(-8, -36); ctx.arc(0, -36, 10, Math.PI, 0); ctx.lineTo(36, -36); ctx.lineTo(36, -8); ctx.arc(36, 0, 10, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(36, 36); ctx.lineTo(-36, 36); ctx.closePath(); ctx.fill(); },
  loop(c, a) { S(); ctx.lineWidth = 7; ctx.strokeStyle = c; ctx.beginPath(); ctx.arc(0, 0, 36, -2.6, 0.4); ctx.stroke(); ctx.strokeStyle = a; ctx.beginPath(); ctx.arc(0, 0, 36, 0.54, 3.5); ctx.stroke();
    ctx.fillStyle = c; arrowHead(36 * Math.cos(0.4), 36 * Math.sin(0.4), 0.4 + Math.PI / 2, 18); ctx.fillStyle = a; arrowHead(36 * Math.cos(3.5), 36 * Math.sin(3.5), 3.5 + Math.PI / 2, 18); },
};

