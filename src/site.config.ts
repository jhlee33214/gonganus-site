// 사이트 공통 정보. 상호·연락처·검색엔진 인증 코드는 여기서만 바꾼다.
export const siteConfig = {
  name: '공간어스',
  nameEn: 'gonganus',
  tagline: '공간을 이해하고 기록합니다',
  description: '공간어스는 카페·쇼룸·숙박·주거 공간을 사진과 영상으로 기록하는 인테리어 촬영 스튜디오입니다. 인테리어 회사와 브랜드를 위한 공간 사진·영상 촬영, 서울·수도권 및 전국 출장.',
  url: 'https://gonganus.com',
  email: 'studio@gonganus.com',
  kakao: 'https://pf.kakao.com/_nrYHG',
  instagram: 'https://www.instagram.com/gonganus',
  areaServed: '서울·수도권, 전국 출장',
  // 구글 서치콘솔 / 네이버 서치어드바이저 "HTML 태그" 인증값. 비워두면 출력하지 않는다.
  verification: { google: '', naver: '' },
};

export const nav = [
  { href: '/work/', label: 'Work' },
  { href: '/video/', label: 'Video' },
  { href: '/services/', label: 'Services' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
];
