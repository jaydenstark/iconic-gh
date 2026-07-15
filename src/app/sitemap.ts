import { MetadataRoute } from 'next';
import { ArticlesService } from '@/services/articles';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.iconicgh.com';
  
  const routes = ['', '/about', '/privacy', '/blog', '/search', '/categories', '/profile'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));
  
  try {
    const articles = await ArticlesService.getArticles();
    const articleRoutes = articles.map((article) => ({
      url: `${baseUrl}/article/${article.id}`,
      lastModified: new Date(article.date),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
    return [...routes, ...articleRoutes];
  } catch (e) {
    console.error('Failed to generate sitemap routes:', e);
    return routes;
  }
}
