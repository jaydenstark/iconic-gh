'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Article } from '@/services/articles';
import styles from './NewsCard.module.css';

interface NewsCardProps {
  article: Article;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const getTimeAgo = (dateStr: string) => {
    const past = new Date(dateStr).getTime();
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={article.image || 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop'} 
          alt={article.title} 
          className={styles.image} 
          loading="lazy" 
        />
      </Link>
      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.category}>{article.category}</span>
          <span>{getTimeAgo(article.date)}</span>
        </div>
        <Link href={`/article/${article.id}`}>
          <h3 className={styles.title}>{article.title}</h3>
        </Link>
        <p className={styles.excerpt}>{article.excerpt}</p>
        <div className={styles.footer}>
          <div className={styles.author}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={article.author?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop'} 
              alt={article.author?.name} 
              className={styles.avatar} 
            />
            <span className={styles.authorName}>{article.author?.name}</span>
          </div>
          <Link href={`/article/${article.id}`} className={styles.readMore}>
            Read <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
};
