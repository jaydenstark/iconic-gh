'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArticlesService, Article } from '@/services/articles';
import styles from './TrendingNews.module.css';

export const TrendingNews = () => {
  const [trending, setTrending] = useState<Article[]>([]);

  useEffect(() => {
    const fetchTrending = async () => {
      const data = await ArticlesService.getArticles({ limit: 5, sortBy: 'trending' });
      setTrending(data);
    };
    fetchTrending();
  }, []);

  if (trending.length === 0) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Trending</h3>
        <div style={{ padding: '1rem 0', color: 'var(--muted)', fontSize: '0.875rem' }}>
          Loading trending stories...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Trending</h3>
      <div className={styles.list}>
        {trending.map((item, idx) => (
          <div key={item.id} className={styles.item}>
            <div className={styles.rank}>
              {String(idx + 1).padStart(2, '0')}
            </div>
            <div className={styles.content}>
              <span className={styles.category}>{item.category}</span>
              <Link href={`/article/${item.id}`}>
                <h4 className={styles.storyTitle}>{item.title}</h4>
              </Link>
              <span className={styles.meta}>{item.readTime}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
