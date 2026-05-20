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
    openGraph: {
      title: `${post.title} | ICONIC GH`,
      description: post.excerpt || post.body[0],
      images: [{ url: post.image }],
    },
  };
}

export default async function ArticleRoutePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  return <ArticlePage id={id} />;
}
