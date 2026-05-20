'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArticlesService, Article } from '@/services/articles';
import styles from './HeroSlider.module.css';

export const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [posts, setPosts] = useState<Article[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await ArticlesService.getArticles({ limit: 4, sortBy: 'trending' });
      setPosts(data);
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    if (posts.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [posts]);

  if (posts.length === 0) {
    return (
      <div className={styles.heroContainer} style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--secondary)' }}>
        <p style={{ color: 'var(--muted)' }}>Loading featured stories...</p>
      </div>
    );
  }

  return (
    <div className={styles.heroContainer}>
      {posts.map((post, index) => (
        <div 
          key={post.id} 
          className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
          style={{ backgroundImage: `url('${post.image}')` }}
        >
          <div className={styles.overlay} />
          <div className={styles.content}>
            <span className={styles.category}>{post.category}</span>
            <Link href={`/article/${post.id}`}>
              <h1 className={styles.title}>{post.title}</h1>
            </Link>
            <p className={styles.excerpt}>{post.excerpt}</p>
          </div>
        </div>
      ))}
      <div className={styles.controls}>
        {posts.map((_, idx) => (
          <button 
            key={idx}
            className={`${styles.dot} ${idx === currentIndex ? styles.active : ''}`}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
