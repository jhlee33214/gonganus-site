import type { APIRoute } from 'astro';
import sharp from 'sharp';
import { getAllWork, getCover } from '../../../lib/work';

export async function getStaticPaths() {
  return (await getAllWork()).map((w) => ({ params: { slug: w.id }, props: { work: w } }));
}

export const GET: APIRoute = async ({ props }) => {
  const cover = getCover(props.work.id, props.work.data.cover);
  const buf = await sharp(cover.fsPath).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 82 }).toBuffer();
  return new Response(buf, { headers: { 'Content-Type': 'image/jpeg' } });
};
