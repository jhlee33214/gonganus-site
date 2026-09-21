// 현 Adobe Portfolio 사이트(gonganus.com)에서 프로젝트·사진 URL·영상 임베드를 수집해 data/scrape.json으로 저장한다.
import { writeFileSync, readFileSync } from 'node:fs';

const BASE = 'https://gonganus.com';
const pages = JSON.parse(readFileSync(new URL('../data/pages.json', import.meta.url), 'utf8'));
const VIDEO_PAGE = '16662ad67b3f76';

const get = async (path) => (await fetch(`${BASE}/${path}`, { headers: { 'user-agent': 'Mozilla/5.0' } })).text();
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ').trim();
const stripTags = (s) => decode(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');

// 1) 홈에서 순서·연도 파악:  "(Showroom) Duomo Lighting 2026" 식으로 나열됨
const home = await get('');
const homeText = stripTags(home.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<svg[\s\S]*?<\/svg>/g, ''));
const orderList = [...homeText.matchAll(/\(([A-Za-z]+)\)\s*([^()]+?)\s*(20\d\d)\b/g)].map((m, i) => ({
  order: i + 1, type: m[1], name: m[2].trim(), year: Number(m[3]),
}));

// 2) 각 프로젝트 페이지
const projects = [];
for (const [path, slug] of Object.entries(pages)) {
  const html = await get(path);
  const rawTitle = decode((html.match(/<title>([^<]*)<\/title>/) || [, ''])[1]).replace(/^gonganus studio\s*-\s*/, '');
  const m = rawTitle.match(/^\(([A-Za-z]+)\)\s*(.+)$/);
  const type = m ? m[1] : '';
  const name = m ? m[2].trim() : rawTitle;
  // 갤러리 원본: _rw_3840 (문서 순서, 중복 제거)
  const seen = new Set();
  const images = [];
  for (const mm of html.matchAll(/https:\/\/cdn\.myportfolio\.com\/([a-f0-9-]+)\/([a-f0-9-]+)_rw_3840\.(jpe?g|png)\?h=[a-f0-9]+/g)) {
    if (seen.has(mm[2])) continue;
    seen.add(mm[2]);
    images.push(mm[0]);
  }
  const ord = orderList.find((o) => o.name === name);
  projects.push({ pageUrl: `${BASE}/${path}`, slug, type, name, year: ord?.year ?? null, order: ord?.order ?? null, images });
  console.log(`${slug.padEnd(28)} ${String(images.length).padStart(3)}장  ${type} ${name} ${ord?.year ?? '?'}`);
}

// 3) 영상 페이지: 각 iframe 뒤에 오는 첫 텍스트가 그 영상의 제목(캡션). 캡션이 없으면 "공간 영상".
const vhtml = (await get(VIDEO_PAGE)).replace(/<script[\s\S]*?<\/script>/g, '').replace(/<svg[\s\S]*?<\/svg>/g, '');
const ev = [];
for (const m of vhtml.matchAll(/padding-bottom:\s*([\d.]+)%[^>]*>\s*<iframe[^>]*src="([^"]+)"/g)) ev.push({ at: m.index, kind: 'V', embed: decode(m[2]), ratio: Number(m[1]) > 100 ? '9:16' : '16:9' });
for (const m of vhtml.matchAll(/>([^<>]{2,80})</g)) { const t = decode(m[1]); if (t && !/^[\s\W]*$/.test(t)) ev.push({ at: m.index, kind: 'T', text: t }); }
ev.sort((a, b) => a.at - b.at);
const videos = [];
for (let i = 0; i < ev.length; i++) {
  if (ev[i].kind !== 'V') continue;
  const next = ev[i + 1];
  const caption = next && next.kind === 'T' && !/^(Back to Top|Copyright)/.test(next.text) ? next.text : '';
  const y = caption.match(/^(20\d\d)\s+(.+)$/);
  videos.push({ id: ev[i].embed.match(/\/ccv\/([^/]+)\/embed/)[1], title: y ? y[2].trim() : (caption || '공간 영상'), year: y ? Number(y[1]) : null, embed: ev[i].embed, ratio: ev[i].ratio });
}
console.log(`영상 ${videos.length}개`);
videos.forEach((v) => console.log('  ', v.ratio, v.year ?? '----', v.title));

writeFileSync(new URL('../data/scrape.json', import.meta.url), JSON.stringify({ scrapedAt: new Date().toISOString(), projects, videos }, null, 2));
console.log(`프로젝트 ${projects.length}건, 사진 ${projects.reduce((a, p) => a + p.images.length, 0)}장 → data/scrape.json`);
