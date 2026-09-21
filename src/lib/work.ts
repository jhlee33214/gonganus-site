import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';

export type Work = CollectionEntry<'work'>;
export type CategoryKey = Work['data']['category'];

export const CATEGORIES: Record<CategoryKey, { label: string; description: string }> = {
  cafe: { label: '카페', description: '카페 인테리어 촬영. 마감의 질감과 자연광을 있는 그대로 남깁니다.' },
  stay: { label: '숙박', description: '에어비앤비 / 독채 / 오피스텔 촬영. 예약 페이지에 바로 쓸 수 있는 객실 사진과 영상을 만듭니다.' },
  showroom: { label: '쇼룸', description: '가구 / 조명 브랜드 쇼룸 촬영. 제품과 공간이 한 장에 함께 보이도록 구성합니다.' },
  beauty: { label: '뷰티', description: '스파 / 뷰티숍 촬영. 조명 조건을 정리해 마감재의 색을 정확하게 담습니다.' },
  residence: { label: '주거', description: '아파트 / 주택 인테리어 촬영. 시공사 포트폴리오를 위한 주거 공간 기록입니다.' },
  etc: { label: '기타', description: '키즈풀, 프랜차이즈 매장, 워크숍 등 그 밖의 상업 공간 촬영입니다.' },
};

export async function getAllWork(): Promise<Work[]> {
  const all = await getCollection('work');
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getWorkByCategory(category: CategoryKey): Promise<Work[]> {
  return (await getAllWork()).filter((w) => w.data.category === category);
}

export async function getFeaturedWork(limit = 8): Promise<Work[]> {
  return (await getAllWork()).filter((w) => w.data.featured).slice(0, limit);
}

export async function getAdjacent(slug: string): Promise<{ prev?: Work; next?: Work }> {
  const all = await getAllWork();
  const i = all.findIndex((w) => w.id === slug);
  return { prev: all[i - 1], next: all[i + 1] };
}

// src/assets/work/<slug>/NN.jpg 전부를 파일명 순으로 반환
const images = import.meta.glob<{ default: ImageMetadata }>('/src/assets/work/*/*.jpg', { eager: true });

export function getProjectImages(slug: string): { file: string; image: ImageMetadata }[] {
  return Object.entries(images)
    .filter(([path]) => path.includes(`/work/${slug}/`) && !path.endsWith('/cover.jpg'))
    .map(([path, mod]) => ({ file: path.split('/').pop()!, image: mod.default }))
    .sort((a, b) => a.file.localeCompare(b.file));
}

export function getCover(slug: string, cover: string): ImageMetadata {
  const exact = Object.entries(images).find(([path]) => path.includes(`/work/${slug}/`) && path.endsWith(`/${cover}`));
  const found = exact ? { file: cover, image: exact[1].default } : getProjectImages(slug)[0];
  if (!found) throw new Error(`대표 사진 없음: ${slug}/${cover}`);
  return found.image;
}

export const workUrl = (w: Work) => `/work/${w.id}/`;
export const categoryUrl = (c: CategoryKey) => `/work/category/${c}/`;
