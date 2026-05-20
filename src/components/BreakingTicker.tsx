'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArticlesService, Article } from '@/services/articles';
import styles from './BreakingTicker.module.css';

export const BreakingTicker = () => {
  const [headlines, setHeadlines] = useState<Article[]>([]);

  useEffect(() => {
    const fetchHeadlines = async () => {
      const data = await ArticlesService.getArticles({ limit: 5, sortBy: 'recent' });
      setHeadlines(data);
    };
    fetchHeadlines();
  }, []);

  if (headlines.length === 0) {
    return (
      <div className={styles.tickerContainer}>
        <div className={styles.label}>Breaking</div>
        <div className={styles.tickerWrapper}>
          <div className={styles.tickerContent}>
            <div className={styles.tickerItem}>
              <span>Flash</span>
              <span>Loading real-time news stream...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Duplicate items to ensure smooth continuous loop
  const displayItems = [...headlines, ...headlines];

  return (
    <div className={styles.tickerContainer}>
      <div className={styles.label}>Breaking</div>
      <div className={styles.tickerWrapper}>
        <div className={styles.tickerContent}>
          {displayItems.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className={styles.tickerItem}>
              <span>Breaking</span>
              <Link href={`/article/${item.id}`}>{item.title}</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
