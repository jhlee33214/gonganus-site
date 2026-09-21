// data/projects.json(수기 메타) + data/scrape.json(수집) → src/content/work/*.md, src/content/videos.json
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const r = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
const meta = r('../data/projects.json');
const { projects, videos } = r('../data/scrape.json');
const titles = r('../data/video-titles.json');
const notes = r('../data/project-notes.json');
mkdirSync(new URL('../src/content/work/', import.meta.url), { recursive: true });
const q = (s) => `"${String(s).replace(/"/g, '\\"')}"`;
let n = 0;
for (const [i, m] of meta.entries()) {
  const s = projects.find((p) => p.slug === m.slug);
  if (!s) throw new Error(`scrape.json에 없음: ${m.slug}`);
  const fm = [
    `title: ${q(m.title)}`, `category: ${m.category}`, `year: ${s.year}`,
    m.location ? `location: ${q(m.location)}` : null,
    `summary: ${q(m.summary)}`, notes[m.slug] ? `note: ${q(notes[m.slug])}` : null, `cover: ${q(m.cover ?? 'cover.jpg')}`,
    `featured: ${!!m.featured}`, `order: ${i + 1}`,
  ].filter(Boolean).join('\n');
  writeFileSync(new URL(`../src/content/work/${m.slug}.md`, import.meta.url), `---\n${fm}\n---\n`);
  n++;
}
const vids = videos.map((v) => ({ ...v, title: titles[v.title] ?? v.title }));
writeFileSync(new URL('../src/content/videos.json', import.meta.url), JSON.stringify(vids, null, 2) + '\n');
console.log(`프로젝트 md ${n}건, 영상 ${vids.length}개 생성`);
