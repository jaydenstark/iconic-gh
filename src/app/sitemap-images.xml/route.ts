import { NextResponse } from 'next/server';
import { ArticlesService } from '@/services/articles';

export async function GET() {
  const baseUrl = 'https://www.iconicgh.com';
  let articles: any[] = [];
  try {
    articles = await ArticlesService.getArticles();
  } catch (e) {
    console.error(e);
  }

  const staticImages = [
    { loc: `${baseUrl}/`, image: `${baseUrl}/logo.png`, title: 'ICONIC GH Logo' }
  ];

  const articleImages = articles.filter(a => a.image).map((post) => ({
    loc: `${baseUrl}/article/${post.id}`,
    image: post.image.startsWith('http') ? post.image : `${baseUrl}${post.image}`,
    title: post.title,
  }));

  const allItems = [...staticImages, ...articleImages];

  const xmlItems = allItems.map((item) => `
  <url>
    <loc>${item.loc}</loc>
    <image:image>
      <image:loc>${item.image.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</image:loc>
      <image:title>${item.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</image:title>
    </image:image>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${xmlItems}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600',
    },
  });
}
