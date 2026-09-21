// 지역 랜딩 페이지 데이터. 실제 촬영한 프로젝트의 지역만 다룬다.
export type Area = {
  slug: string; name: string; title: string; question: string; answer: string; description: string;
  districts: string[]; projects: string[]; keywords: string[];
};
export const AREAS: Area[] = [
  {
    slug: 'seoul', name: '서울', title: '서울 인테리어 촬영',
    question: '서울에서 카페, 쇼룸, 주거 공간 촬영이 필요하다면',
    answer: '용산, 신당, 신촌, 안암, 노원 등 서울 곳곳의 카페와 쇼룸, 아파트, 숙소를 촬영해 왔습니다. 서울 전 지역 출장비 없이 진행하며, 공간 종류와 희망 일정을 보내주시면 빠른 시간 안에 견적을 드립니다.',
    description: '서울 인테리어 촬영. 용산 카페, 신당 아파트, 신촌 프랜차이즈 매장, 안암 한옥 숙소, 노원 오피스텔 등 서울 촬영 사례와 진행 방식.',
    districts: ['용산', '신당', '신촌', '안암', '노원'],
    projects: ['cafe-majorica', 'apt-sindang-hyundai', 'franchise-greenboys', 'stay-anam-anwoljae', 'stay-officetel', 'showroom-duomo-lighting', 'showroom-knoll'],
    keywords: ['서울 인테리어 촬영', '서울 카페 촬영', '서울 공간 사진', '서울 쇼룸 촬영'],
  },
  {
    slug: 'gyeonggi', name: '경기', title: '경기 인테리어·숙소 촬영',
    question: '경기 지역 독채 숙소, 카페, 매장 촬영이 필요하다면',
    answer: '남양주와 파주의 독채 숙소를 비롯해 경기 지역 공간을 촬영해 왔습니다. 김포에 기반을 두고 있어 경기 서부·북부는 가깝게 움직이며, 그 외 지역도 출장 촬영이 가능합니다.',
    description: '경기 인테리어·숙소 촬영. 남양주 담연재, 파주 Mukta 등 경기 지역 독채 숙소 촬영 사례와 진행 방식. 김포 기반, 경기 전 지역 출장.',
    districts: ['남양주', '파주', '김포'],
    projects: ['stay-namyangju-damyeonjae', 'stay-paju-mukta'],
    keywords: ['경기 인테리어 촬영', '남양주 숙소 사진', '파주 독채 촬영', '김포 인테리어 촬영'],
  },
];
