import { NextResponse } from 'next/server';
import { ArticlesService, Article } from '@/services/articles';

export async function GET() {
  const baseUrl = 'https://www.iconicgh.com';
  let articles: Article[] = [];
  try {
    articles = await ArticlesService.getArticles();
  } catch (e) {
    console.error(e);
  }

  const twoDaysAgo = Date.now() - 48 * 60 * 60 * 1000;
  const newsArticles = articles.filter(a => new Date(a.date).getTime() >= twoDaysAgo);
  const targetArticles = newsArticles.length > 0 ? newsArticles : articles.slice(0, 3);

  const xmlItems = targetArticles.map((post) => `
  <url>
    <loc>${baseUrl}/article/${post.id}</loc>
    <news:news>
      <news:publication>
        <news:name>ICONIC GH</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date(post.date).toISOString()}</news:publication_date>
      <news:title>${post.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</news:title>
    </news:news>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${xmlItems}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=600',
    },
  });
}
