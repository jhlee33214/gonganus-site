# 공간어스 웹사이트 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** gonganus.com을 Astro 정적 사이트로 새로 만들어 GitHub Pages에 배포한다. 설계서: `docs/superpowers/specs/2026-09-21-gonganus-website-design.md`

**Architecture:** Astro 5 content collections(`src/content/work/*.md` + `src/assets/work/<slug>/NN.jpg`)가 프로젝트 20건의 단일 진실 소스. 페이지는 컬렉션을 읽어 정적 HTML로 출력. 사이트 공통 정보는 `src/site.config.ts` 하나. GitHub Actions가 push마다 빌드해 Pages에 배포.

**Tech Stack:** Node 26, Astro 5, @astrojs/sitemap, sharp(이미지 변환), Pretendard + Cormorant Garamond(로컬 woff2), GitHub Pages.

## Global Constraints

- 색: 배경 #FFFFFF, 본문 #111111, 보조 #6B6B6B, 선 #E5E5E5. 강조색 없음.
- 웹폰트 2종만: Pretendard 400/500, Cormorant Garamond 400/500. 로컬 woff2.
- 클라이언트 JS는 모바일 메뉴 토글 하나만.
- 주소: `/work/`, `/work/category/{cafe,stay,showroom,beauty,residence,etc}/`, `/work/{slug}/`, `/video/`, `/services/`, `/about/`, `/contact/`. slug는 영문 소문자·하이픈만. 모든 주소 끝에 `/`.
- 페이지별 title·description 고유. alt = "프로젝트명 공간 사진 N".
- 저장 원본 사진은 긴 변 2560px jpg. 빌드 산출은 webp 480/960/1440/1920.
- "저렴" 단어 금지 → "합리적인 견적". 작가 이름·인원수 언급 금지.
- 연락처: 카카오톡 `https://pf.kakao.com/_nrYHG`, `studio@gonganus.com`, `https://www.instagram.com/gonganus`.
- 프로젝트 폴더 `/Users/studioapro/자료/gonganus-site`. 커밋 메시지 끝에 `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

---

## 파일 구조

```
astro.config.mjs            사이트 주소·sitemap·이미지 설정
package.json
public/CNAME                gonganus.com
public/robots.txt           전체 허용 + sitemap 주소
public/llms.txt             스튜디오 요약
public/fonts/*.woff2        Pretendard, Cormorant
public/favicon.svg, og-default.jpg
scripts/scrape.mjs          현 사이트 22페이지 → data/scrape.json (프로젝트·사진 URL·영상 임베드)
scripts/download.mjs        scrape.json → src/assets/work/<slug>/NN.jpg (2560px)
scripts/gen-content.mjs     scrape.json + data/projects.json(수기 메타) → src/content/work/*.md, src/content/videos.json
data/projects.json          slug·분류·연도·summary·featured 수기 메타 (20건)
src/site.config.ts          상호·슬로건·연락처·인증코드
src/content.config.ts       work 컬렉션 스키마
src/content/work/*.md       프로젝트 20건
src/content/videos.json     영상 20건
src/styles/global.css       토큰·리셋·타이포·그리드
src/layouts/Base.astro      html 골격, <head>(SEO/OG/JSON-LD), Header, Footer
src/components/Header.astro, Footer.astro, Seo.astro, WorkGrid.astro, ProjectCard.astro, Cta.astro, VideoEmbed.astro
src/lib/work.ts             컬렉션 조회 헬퍼(정렬·분류·이전/다음·이미지 로드)
src/pages/index.astro, work/index.astro, work/category/[category].astro, work/[slug].astro, video.astro, services.astro, about.astro, contact.astro, 404.astro
.github/workflows/deploy.yml
docs/dns-namecheap.md       사용자용 도메인 연결 안내
```

---

### Task 1: 프로젝트 스캐폴드와 디자인 토큰

**Files:** Create `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `src/site.config.ts`, `src/styles/global.css`, `src/layouts/Base.astro`, `src/components/{Header,Footer,Seo}.astro`, `src/pages/index.astro`(임시), `public/fonts/*`, `public/favicon.svg`.

**Produces:** `siteConfig` 객체(`name, tagline, url, email, kakao, instagram, verification:{google,naver}`), `Base.astro` props `{title, description, image?, jsonLd?}`.

- [ ] Step 1: `npm init -y && npm i astro @astrojs/sitemap sharp` 후 `package.json` scripts: `dev`, `build`, `preview`, `scrape`, `download`, `gen`.
- [ ] Step 2: `astro.config.mjs` — `site: 'https://gonganus.com'`, `trailingSlash: 'always'`, `integrations: [sitemap()]`, `image: { service: sharpImageService() }`.
- [ ] Step 3: 폰트 다운로드 — Pretendard 400/500 woff2(cactus.tistory Pretendard GitHub 릴리스 `PretendardVariable`는 크므로 static `Pretendard-Regular.woff2`, `Pretendard-Medium.woff2`), Cormorant Garamond 400/500(google fonts api css → woff2 URL 추출). `public/fonts/`에 저장.
- [ ] Step 4: `global.css` — `:root` 토큰, `@font-face` 4개(`font-display: swap`), 리셋, `.container`(max 1440, padding 48/20), `.grid-3`, 타이포 스케일(h1 세리프 40/32, 본문 16/1.7), 포커스 링.
- [ ] Step 5: `Seo.astro` — title(`{page} — 공간어스` 형식, 홈만 `공간어스 gonganus | 공간·인테리어 사진 영상 촬영 스튜디오`), description, canonical, OG/Twitter, 인증 meta(값 있을 때만), JSON-LD `<script type="application/ld+json">`.
- [ ] Step 6: `Header.astro`(로고 svg/png 링크 + nav 5개 + 모바일 토글 `<script>` 8줄), `Footer.astro`.
- [ ] Step 7: `Base.astro`에서 Seo/Header/Footer 조립. 임시 `index.astro`로 `npm run build` 성공 확인.
- [ ] Step 8: 커밋 `feat: 스캐폴드·디자인 토큰·기본 레이아웃`.

### Task 2: 현 사이트 수집·사진 다운로드

**Files:** Create `scripts/scrape.mjs`, `scripts/download.mjs`, `data/scrape.json`(산출), `src/assets/work/<slug>/NN.jpg`(산출).

**Produces:** `data/scrape.json` = `{ projects: [{ pageUrl, title, slug, images: [url3840...] }], videos: [{ title, embed, ratio }] }`.

- [ ] Step 1: `scrape.mjs` — sitemap.xml에서 URL 수집 → 각 페이지 fetch → `<title>`에서 `gonganus studio - (Cafe) OODOOD` 파싱 → 본문 `module-media` 영역의 `_rw_3840.jpg?h=...` URL을 문서 순서대로 중복 제거 → slug는 `data/projects.json`의 `pageUrl→slug` 매핑으로 부여. 영상 페이지(`16662ad67b3f76`)는 `<iframe src="https://www-ccv.adobe.io/...">`와 `padding-bottom` 비율, 인접 제목 텍스트를 추출.
- [ ] Step 2: 실행 `node scripts/scrape.mjs` → 프로젝트 20건, 사진 합계 약 400장, 영상 20개 출력 확인. 0건인 프로젝트가 있으면 해당 페이지 HTML을 열어 선택자 수정.
- [ ] Step 3: `download.mjs` — 동시 4개로 fetch → sharp `resize({ width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 88 })` → `src/assets/work/<slug>/01.jpg…`. 이미 있으면 건너뜀.
- [ ] Step 4: 실행 후 `find src/assets/work -name '*.jpg' | wc -l`이 scrape.json 사진 수와 일치, `du -sh src/assets/work` 600MB 이하 확인.
- [ ] Step 5: 커밋 `feat: 현 사이트 콘텐츠 수집 스크립트와 사진`(사진 포함).

### Task 3: 콘텐츠 컬렉션과 메타데이터

**Files:** Create `data/projects.json`, `scripts/gen-content.mjs`, `src/content.config.ts`, `src/content/work/*.md`, `src/content/videos.json`, `src/lib/work.ts`.

**Produces:** 스키마 `{ title, category: enum, year: number, location?: string, summary: string, cover: string, featured: boolean, order: number }`. `work.ts` 함수: `getAllWork()`(order 오름차순), `getWorkByCategory(cat)`, `getFeaturedWork(8)`, `getAdjacent(slug)`, `getProjectImages(slug)`(import.meta.glob으로 `../assets/work/<slug>/*.jpg` 정렬 반환), `CATEGORIES = {cafe:'카페', stay:'숙박', showroom:'쇼룸', beauty:'뷰티', residence:'주거', etc:'기타'}`.

- [ ] Step 1: `data/projects.json` 20건 수기 작성. 현 홈 순서대로 order 1~20. featured는 상위 8건. summary는 분류·장소 기반 1문장(예: "OODOOD 카페의 목재 마감과 자연광을 기록했습니다."). location은 제목에서 확인되는 것만(남양주·안암동·파주·신당).
- [ ] Step 2: `gen-content.mjs` — projects.json × scrape.json 병합 → md 파일 frontmatter 출력(본문 없음), videos.json 출력.
- [ ] Step 3: `content.config.ts` — `defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/work' }), schema })`.
- [ ] Step 4: `work.ts` 구현. `npm run build`로 스키마 오류 0 확인.
- [ ] Step 5: 커밋 `feat: 프로젝트 콘텐츠 20건·영상 목록`.

### Task 4: 페이지와 컴포넌트

**Files:** Create `src/components/{WorkGrid,ProjectCard,Cta,VideoEmbed}.astro`, `src/pages/{index,work/index,work/category/[category],work/[slug],video,services,about,contact,404}.astro`, `public/og-default.jpg`.

- [ ] Step 1: `ProjectCard.astro` — `<a href=/work/{slug}/>` + `<Image>` 4:3 크롭(widths 480/960/1440) + hover 시 제목·분류 페이드. `WorkGrid.astro` — `.grid-3`.
- [ ] Step 2: `work/index.astro` — 분류 링크 줄 + 전체 그리드. `work/category/[category].astro` — `getStaticPaths`로 6개, 제목 `{분류} 공간 촬영 — 공간어스`, description 분류별 고유 문장.
- [ ] Step 3: `work/[slug].astro` — h1, 분류·연도·location, summary, 사진 세로 나열(가로 사진 풀폭, 세로 사진은 연속 2장을 2열), 이전/다음, JSON-LD ImageGallery, OG 이미지 cover.
- [ ] Step 4: `index.astro` — 히어로(로고 크게 + 슬로건 + 대표 사진 1장 = order 1 cover), featured 8 그리드, 강점 4개(제목: 사진과 영상을 한 번에 / 작가가 직접 촬영 / 5일 안에 납품 / 합리적인 견적, 높은 완성도), Cta.
- [ ] Step 5: `services.astro`(3 서비스 + 결과물 + 4단계 + 대상 공간 + 가격 문의), `about.astro`(3원칙 원문 + 소개 문단), `contact.astro`(카카오 큰 버튼, 이메일, 인스타), `video.astro`(VideoEmbed 반복, loading=lazy), `404.astro`.
- [ ] Step 6: `og-default.jpg` = order 1 cover를 1200×630으로 sharp 크롭.
- [ ] Step 7: `npm run build` 성공, `dist/` 내 html 수 = 1+1+6+20+5+1 = 34 확인. 커밋 `feat: 전체 페이지`.

### Task 5: SEO 파일과 구조화 데이터

**Files:** Create `public/robots.txt`, `public/llms.txt`, `public/CNAME`. Modify `Base.astro`(전역 JSON-LD ProfessionalService), `about.astro`(AboutPage).

- [ ] Step 1: robots.txt — `User-agent: *` `Allow: /` + `Sitemap: https://gonganus.com/sitemap-index.xml`. AI 크롤러(GPTBot, PerplexityBot, ClaudeBot, Google-Extended) 명시 허용.
- [ ] Step 2: llms.txt — 상호, 한 줄 소개, 서비스 3종, 대상 공간, 연락처, 주요 페이지 링크.
- [ ] Step 3: ProfessionalService JSON-LD: name "공간어스", alternateName "gonganus", url, email, areaServed "서울·수도권, 전국 출장", sameAs [instagram, kakao], image og-default.
- [ ] Step 4: 빌드 후 검사 스크립트(한 줄): `grep -ho '<title>[^<]*' dist -r | sort | uniq -d` 결과 없음, description도 동일. 커밋 `feat: SEO 파일·구조화 데이터`.

### Task 6: 로컬 검증

- [ ] Step 1: `npm run build && npm run preview` → 내장 브라우저로 `/`, `/work/`, `/work/cafe-oodood/`, `/services/`, `/contact/` 데스크톱·모바일(375px) 캡처, 콘솔 오류 0.
- [ ] Step 2: 링크·이미지 404 검사: dist의 모든 `href`/`src` 상대경로가 dist에 존재하는지 node 한 줄 스크립트.
- [ ] Step 3: 문제 수정 후 커밋 `fix: 검증 수정`.

### Task 7: 배포

**Files:** Create `.github/workflows/deploy.yml`, `docs/dns-namecheap.md`.

- [ ] Step 1: deploy.yml — `withastro/action@v3` + `actions/deploy-pages@v4`, Node 22, `permissions: pages: write, id-token: write`.
- [ ] Step 2: `gh repo create jhlee33214/gonganus-site --public --source . --push`.
- [ ] Step 3: `gh api -X POST repos/jhlee33214/gonganus-site/pages -f build_type=workflow` → Actions 완료 대기 → `gh api -X PUT repos/.../pages -f cname=gonganus.com -F https_enforced=true`.
- [ ] Step 4: `docs/dns-namecheap.md` — Namecheap Advanced DNS에서 기존 A/CNAME 삭제 후 A 4개(185.199.108.153/109/110/111) + `www` CNAME `jhlee33214.github.io.` 설정 화면 순서 안내.
- [ ] Step 5: 커밋·push. 사용자에게 DNS 변경 요청.

### Task 8: SEO 진단

- [ ] Step 1: `/fire-your-seo-agency` 스킬로 `https://gonganus.com`(DNS 반영 전이면 `https://jhlee33214.github.io/gonganus-site/`) 진단 → 점수표.
- [ ] Step 2: 코드로 고칠 수 있는 항목 반영·커밋. 사용자 수행 항목(서치콘솔·네이버 등록) 목록 전달.
