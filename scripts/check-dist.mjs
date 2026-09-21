// 빌드 산출물 검사: title/description 중복, 내부 링크·이미지 404, 페이지 수
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const htmls = [];
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && htmls.push(p); } })('dist');
const titles = new Map(), descs = new Map(); let broken = 0;
for (const f of htmls) {
  const h = readFileSync(f, 'utf8');
  const t = (h.match(/<title>([^<]*)<\/title>/) || [])[1] ?? '(없음)';
  const d = (h.match(/<meta name="description" content="([^"]*)"/) || [])[1] ?? '(없음)';
  titles.set(t, [...(titles.get(t) ?? []), f]); descs.set(d, [...(descs.get(d) ?? []), f]);
  if (t.length > 70) console.log(`title 길이 ${t.length}: ${f}`);
  if (d.length > 170) console.log(`description 길이 ${d.length}: ${f}`);
  for (const m of h.matchAll(/(?:href|src|srcset)="([^"]+)"/g)) {
    for (let u of m[1].split(',').map((s) => s.trim().split(' ')[0])) {
      if (!u.startsWith('/') || u.startsWith('//')) continue;
      u = u.split('?')[0].split('#')[0];
      const p = join('dist', u);
      if (!(existsSync(p) || existsSync(join(p, 'index.html')))) { broken++; console.log(`404 ${u}  ← ${f}`); }
    }
  }
}
const dupT = [...titles].filter(([, v]) => v.length > 1), dupD = [...descs].filter(([, v]) => v.length > 1);
dupT.forEach(([t, v]) => console.log(`title 중복 "${t}": ${v.join(', ')}`));
dupD.forEach(([d, v]) => console.log(`description 중복: ${v.join(', ')}`));
console.log(`HTML ${htmls.length}개, title 중복 ${dupT.length}, description 중복 ${dupD.length}, 깨진 링크 ${broken}`);
process.exit(dupT.length || dupD.length || broken ? 1 : 0);
