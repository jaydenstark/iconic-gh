import { NextResponse } from 'next/server';

export async function GET() {
  const targetBaseUrl = 'https://www.iconicgh.com';
  
  const videos = [
    {
      loc: `${targetBaseUrl}/blog`,
      thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=600&auto=format&fit=crop',
      title: 'ICONIC Podcast: Digital Growth and AI in West Africa',
      desc: 'Exclusive discussion with leading technology pioneers on business automation and digital transformation.',
      player: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: 1800,
      pubDate: '2026-05-19T10:00:00Z',
    },
    {
      loc: `${targetBaseUrl}/blog`,
      thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=600&auto=format&fit=crop',
      title: 'Next.js App Router Architecture Best Practices',
      desc: 'Technical overview of building enterprise software platforms using high-performance static rendering.',
      player: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: 1200,
      pubDate: '2026-05-18T14:30:00Z',
    }
  ];

  const xmlItems = videos.map((v) => `
  <url>
    <loc>${v.loc}</loc>
    <video:video>
      <video:thumbnail_loc>${v.thumbnail.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</video:thumbnail_loc>
      <video:title>${v.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</video:title>
      <video:description>${v.desc.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</video:description>
      <video:player_loc>${v.player.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</video:player_loc>
      <video:duration>${v.duration}</video:duration>
      <video:publication_date>${new Date(v.pubDate).toISOString()}</video:publication_date>
    </video:video>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${xmlItems}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600',
    },
  });
}
