import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api'],
    },
    sitemap: [
      'https://www.iconicgh.com/sitemap.xml',
      'https://www.iconicgh.com/sitemap-news.xml',
      'https://www.iconicgh.com/sitemap-images.xml',
      'https://www.iconicgh.com/sitemap-videos.xml',
    ],
  };
}
