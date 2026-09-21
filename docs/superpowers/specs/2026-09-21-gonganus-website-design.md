# 공간어스(gonganus) 웹사이트 설계서

작성일: 2026-09-21
목표: gonganus.com을 "전문 인테리어·공간 촬영 스튜디오" 사이트로 새로 만든다. 사진이 주인공인 미니멀 화이트 디자인, 검색·AI 노출을 처음부터 갖춘 구조, 이후 촬영 건 추가가 쉬운 관리 방식.

## 1. 배경과 결정 사항

- 현재 사이트: Adobe Portfolio. 모든 페이지 제목이 동일, 주소가 난수, 구조화 데이터 없음.
- 주 타깃: 인테리어·시공 업체, 브랜드·쇼룸(가구·조명 등). B2B.
- 서비스: 사진 / 영상 / 사진+영상 패키지. 가격은 표시하지 않고 문의 유도.
- 디자인: 미니멀 화이트, 사진이 주인공. 로고는 세리프 워드마크 + 얇은 원 3개(투명 PNG·AI 원본 보유).
- About: 작가 이름 없이 스튜디오 철학만. "1인/2인" 언급 없음.
- 영상: Adobe Creative Cloud Video 플레이어 임베드(현 사이트 주소 재사용). Adobe Portfolio 해지 시 영상이 사라지므로 추후 유튜브 이전 권장(범위 밖).
- 가격 표현: "저렴한 가격" 대신 "합리적인 견적".
- 언어: 한국어만.
- 호스팅: GitHub Pages (계정 jhlee33214). 도메인: Namecheap.
- 프로젝트 폴더: `/Users/studioapro/자료/gonganus-site`

## 2. 페이지 구조

| 주소 | 페이지 | 내용 |
|---|---|---|
| `/` | 홈 | 로고 + 한 줄 슬로건("공간을 이해하고 기록합니다"), 대표 사진 1장 풀폭, 선별 프로젝트 8개 그리드, 강점 4가지, 카카오톡 문의 CTA |
| `/work/` | 포트폴리오 전체 | 20건 그리드(최신순), 상단에 분류 링크 |
| `/work/category/{cafe,stay,showroom,beauty,residence,etc}/` | 분류별 목록 | 같은 그리드, 분류만 필터. 각 분류가 고유 제목·설명을 가진 별도 페이지 |
| `/work/{slug}/` | 프로젝트 상세 ×20 | 제목, 분류·연도, 1~2줄 설명, 사진 세로 나열(풀폭 1열, 세로 사진은 2열 짝지음), 이전·다음 프로젝트 링크 |
| `/video/` | 영상 | 현 사이트 영상 20개 임베드, 제목·연도 |
| `/services/` | 서비스 | 3가지 서비스와 결과물(보정 사진 30장 이상, 2분 이내 영상), 진행 4단계(문의→일정→촬영→납품), 대상 공간(숙박·매장·임대·쇼룸), 가격은 문의 안내 |
| `/about/` | 소개 | 철학 3원칙(수직을 세운다 / 빛을 섞지 않는다 / 창을 살린다) 원문 유지, 스튜디오 소개 문단 |
| `/contact/` | 문의 | 카카오톡 채널 큰 버튼(pf.kakao.com/_nrYHG), 이메일 studio@gonganus.com, 인스타그램 @gonganus. 입력 폼 없음 |
| `/404` | 없는 페이지 | 홈·포트폴리오 링크 |

프로젝트 slug 예: `namyangju-damyeonjae`, `cafe-oodood`, `showroom-knoll`. 영문 소문자·하이픈만.

분류 매핑: Cafe→cafe, Airbnb→stay, Showroom→showroom, beauty→beauty, APT→residence, Pool·franchise·workshop→etc.

## 3. 콘텐츠 데이터 구조

프로젝트 1건 = 마크다운 파일 1개 + 사진 폴더 1개.

```
src/content/work/cafe-oodood.md
src/assets/work/cafe-oodood/01.jpg ... 20.jpg
```

frontmatter 필드: `title`, `category`, `year`, `location`(선택), `summary`(1~2줄), `cover`(대표 사진 파일명), `featured`(홈 노출 여부), `order`(정렬).
영상 목록은 `src/content/videos.json` 한 파일(제목, 연도, 임베드 주소, 가로/세로 비율).
사이트 공통 정보(상호, 연락처, SNS, 인증 코드)는 `src/site.config.ts` 한 파일.

새 프로젝트 추가 절차: 사진 폴더 넣기 → md 파일 1개 작성 → git push. 목록·홈·sitemap 자동 갱신.

## 4. 디자인 시스템

- 색: 배경 #FFFFFF, 본문 #111111, 보조 #6B6B6B, 선 #E5E5E5. 강조색 없음.
- 글꼴: 본문 Pretendard(로컬 woff2, 400/500), 제목·영문 세리프는 로고와 어울리는 웹폰트 1종(Cormorant 계열 또는 시스템 세리프). 웹폰트 총 2종 이내.
- 레이아웃: 최대 폭 1440px, 좌우 여백 데스크톱 48px / 모바일 20px. 그리드 데스크톱 3열, 태블릿 2열, 모바일 1열. 사진 비율은 원본 유지(썸네일은 4:3 고정 크롭).
- 헤더: 좌측 로고(높이 28px), 우측 메뉴 5개(Work · Video · Services · About · Contact). 모바일은 햄버거 → 전체화면 메뉴.
- 푸터: 상호, 이메일, 인스타그램, 카카오톡 링크, 저작권.
- 모션: 이미지 hover 시 프로젝트명 페이드인, 페이지 진입 시 콘텐츠 짧은 페이드. 그 외 없음.
- 접근성: 모든 사진에 alt(프로젝트명 + 순번), 키보드 포커스 표시, 명도 대비 AA.

## 5. 기술 구성

- Astro 5 (정적 출력). content collections로 프로젝트 관리. `astro:assets`로 이미지 자동 변환(webp, 폭 480/960/1440/1920 반응형).
- 클라이언트 JS는 모바일 메뉴 토글 하나만. 프레임워크 없음.
- 저장소: GitHub `jhlee33214/gonganus-site`. GitHub Actions로 push 시 빌드·배포.
- 배포: GitHub Pages, 커스텀 도메인 gonganus.com (`public/CNAME`). HTTPS 강제.
- 원본 사진은 저장소에 포함(jpg 약 407장). 저장소 용량 1GB 한도 안에서 관리하기 위해 원본은 긴 변 2560px로 축소해 저장.

## 6. 검색·AI 노출(SEO) 기본 내장

- 페이지별 고유 `<title>`, `meta description`, canonical, OG/Twitter 카드(프로젝트는 대표 사진).
- JSON-LD: 전체 `ProfessionalService`(상호, 지역 서울, 연락처, SNS sameAs), 프로젝트 페이지 `ImageGallery`, About `AboutPage`.
- `sitemap-index.xml` 자동 생성, `robots.txt`(전체 허용 + AI 크롤러 허용), `llms.txt`(스튜디오 소개·서비스·연락처 요약).
- 구글 서치콘솔·네이버 서치어드바이저 인증 meta 자리(`site.config.ts`에 값만 넣으면 출력).
- 이미지 파일명에 프로젝트명 포함, alt 텍스트 규칙 적용.
- 배포 후 `/fire-your-seo-agency` 스킬로 진단해 점수표 산출, 남은 항목(서치콘솔 등록 등)은 사용자 수행 안내.

## 7. 콘텐츠 이관

- 사진: 현 사이트 22페이지에서 `_rw_3840` 원본 URL 407장 수집·다운로드 → 프로젝트별 폴더 정리 → 2560px로 축소.
- 프로젝트 순서·연도: 현 홈 목록 순서(2026 Duomo Lighting … 2024 담연재) 그대로.
- 문구: About 3원칙 원문, 소개서의 강점 4가지(표현만 손질), 연락처.
- 로고: `공간어스 로고(ai).ai` → SVG 변환(가능 시), 실패 시 투명 PNG(843×566) 사용. 파비콘은 원 3개 부분만.

## 8. 배포 절차와 사용자 수행 항목

1. 로컬 빌드 성공 확인 → GitHub 저장소 생성·push → Actions 배포 → `jhlee33214.github.io/gonganus-site`에서 1차 확인.
2. GitHub Pages 커스텀 도메인 설정(제가 수행).
3. 사용자 수행: Namecheap DNS에서 A 레코드 4개(GitHub Pages IP)와 www CNAME 변경. 화면 단위로 안내 문서 제공.
4. DNS 반영 후 HTTPS 활성화 확인.
5. 사용자 수행: 구글 서치콘솔·네이버 서치어드바이저 등록(인증 코드 전달받아 반영).
6. Adobe Portfolio는 영상 임베드 때문에 당분간 유지.

## 9. 검증 기준

- `astro build` 오류 0, 모든 링크·이미지 404 없음(빌드 후 링크 체커).
- 내장 브라우저로 홈·포트폴리오·상세·서비스·문의 페이지 데스크톱/모바일 캡처 확인.
- 페이지별 title·description 중복 0(빌드 산출물 grep).
- Lighthouse 성능·SEO·접근성 90 이상(홈, 상세 1건).
- SEO 스킬 진단 점수표 산출.

## 10. 범위 밖 (추후)

영어판, 문의 입력 폼, 블로그/촬영 팁 글, 유튜브 이전, 가격표.
