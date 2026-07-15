import React from 'react';
import { Metadata } from 'next';
import { ArticlesService } from '@/services/articles';
import { ArticlePage } from '@/pages/Article';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const articleId = resolvedParams.id;
  const post = (await ArticlesService.getArticleById(articleId)) || (await ArticlesService.getArticles({ limit: 1 }))[0];
  
  if (!post) {
    return {
      title: 'Article Not Found | ICONIC GH',
      description: 'The requested story could not be found.'
    };
  }

  return {
    title: `${post.title} | ICONIC GH`,
    description: post.excerpt || post.body[0],
    alternates: {
      canonical: `/article/${articleId}`,
    },
    openGraph: {
      title: `${post.title} | ICONIC GH`,
      description: post.excerpt || post.body[0],
      url: `https://www.iconicgh.com/article/${articleId}`,
      images: [{ url: post.image }],
      type: 'article',
      publishedTime: post.date,
      authors: [post.author?.name || 'Iconic AI'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | ICONIC GH`,
      description: post.excerpt || post.body[0],
      images: [post.image],
    }
  };
}

export default async function ArticleRoutePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const post = (await ArticlesService.getArticleById(id)) || (await ArticlesService.getArticles({ limit: 1 }))[0];

  if (!post) {
    return <ArticlePage id={id} />;
  }

  const newsArticleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": post.title,
    "image": [
      post.image
    ],
    "datePublished": post.date,
    "dateModified": post.date,
    "author": [{
      "@type": "Person",
      "name": post.author?.name || "Iconic AI",
      "jobTitle": "Journalist"
    }],
    "publisher": {
      "@type": "NewsMediaOrganization",
      "name": "ICONIC GH",
      "url": "https://www.iconicgh.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.iconicgh.com/logo.png"
      }
    },
    "description": post.excerpt || post.body[0]
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.iconicgh.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://www.iconicgh.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://www.iconicgh.com/article/${post.id}`
      }
    ]
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `https://www.iconicgh.com/article/${post.id}/#webpage`,
    "url": `https://www.iconicgh.com/article/${post.id}`,
    "name": `${post.title} | ICONIC GH`,
    "description": post.excerpt || post.body[0]
  };

  const newsMediaOrgJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "name": "ICONIC GH",
    "url": "https://www.iconicgh.com",
    "logo": "https://www.iconicgh.com/logo.png",
    "publishingPrinciples": "https://www.iconicgh.com/privacy"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsMediaOrgJsonLd) }}
      />
      <ArticlePage id={id} />
    </>
  );
}
