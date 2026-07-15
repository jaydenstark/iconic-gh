'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/services/articles';
import styles from './ArticleCard.module.css';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const getTimeAgo = (dateStr: string) => {
    const past = new Date(dateStr).getTime();
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();
    const diffMins = Math.floor((now - past) / (1000 * 60));
    
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <article className={styles.card}>
      <Link href={`/article/${article.id}`} className={styles.imageWrapper}>
        <Image 
          src={article.image || 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop'} 
          alt={article.title} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.image} 
          style={{ objectFit: 'cover' }}
        />
      </Link>
      <div className={styles.content}>
        <div>
          <div className={styles.meta}>
            <span className={styles.category}>{article.category}</span>
            <span>{getTimeAgo(article.date)}</span>
          </div>
          <Link href={`/article/${article.id}`}>
            <h3 className={styles.title}>{article.title}</h3>
          </Link>
          <p className={styles.excerpt}>{article.excerpt}</p>
        </div>
        <div className={styles.footer}>
          <div className={styles.author}>
            <Image 
              src={article.author?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop'} 
              alt={article.author?.name || 'Author'} 
              width={24}
              height={24}
              className={styles.avatar} 
              style={{ objectFit: 'cover', borderRadius: '50%' }}
            />
            <span className={styles.authorName}>{article.author?.name}</span>
          </div>
          <span className={styles.readTime}>{article.readTime}</span>
        </div>
      </div>
    </article>
  );
};
