// 1단계: data/urls.txt를 curl로 .cache/raw/<slug>/NN.jpg에 내려받고(병렬 8),
// 2단계: sharp로 긴 변 2560px jpg로 변환해 src/assets/work/<slug>/NN.jpg 저장. 이미 있으면 건너뜀.
import { readFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const lines = readFileSync('data/urls.txt', 'utf8').trim().split('\n').map((l) => { const [key, url] = l.split(' '); return { key, url }; });
const raw = (k) => `.cache/raw/${k}.jpg`, out = (k) => `src/assets/work/${k}.jpg`;
const todo = lines.filter((l) => !existsSync(out(l.key)) && !(existsSync(raw(l.key)) && statSync(raw(l.key)).size > 10000));
console.log(`받을 원본 ${todo.length}장`);
for (const l of todo) mkdirSync(`.cache/raw/${l.key.split('/')[0]}`, { recursive: true });
if (todo.length) {
  const cfg = todo.map((l) => `url = "${l.url}"\noutput = "${raw(l.key)}"`).join('\n');
  execFileSync('curl', ['-sS', '-L', '--retry', '3', '--parallel', '--parallel-max', '8', '--config', '-'], { input: cfg, stdio: ['pipe', 'inherit', 'inherit'] });
}
let done = 0, skipped = 0, failed = 0;
for (const l of lines) {
  if (existsSync(out(l.key))) { skipped++; continue; }
  mkdirSync(`src/assets/work/${l.key.split('/')[0]}`, { recursive: true });
  try {
    await sharp(raw(l.key)).rotate().resize({ width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 88, mozjpeg: true }).toFile(out(l.key));
    done++;
  } catch (e) { failed++; console.error(`변환 실패 ${l.key}: ${e.message}`); }
}
console.log(`변환 ${done}장, 건너뜀 ${skipped}장, 실패 ${failed}장`);
