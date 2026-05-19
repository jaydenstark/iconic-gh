'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './HeroCarousel.module.css';

const MOCK_HERO_POSTS = [
  {
    id: '1',
    title: 'The Future of AI: How New Models are Reshaping Industries',
    excerpt: 'An in-depth look at the latest generative AI developments and their impact on global markets, healthcare, and education.',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Global Summit Reaches Historic Agreement on Climate Action',
    excerpt: 'World leaders pledge unprecedented funding to combat climate change, aiming for net-zero emissions by 2040.',
    category: 'World',
    image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9cce?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Tech Giant Unveils Revolutionary Mixed Reality Headset',
    excerpt: 'The long-awaited device promises to blend digital and physical worlds with unprecedented fidelity and ease of use.',
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1200&auto=format&fit=crop',
  }
];

export const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MOCK_HERO_POSTS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.heroContainer}>
      {MOCK_HERO_POSTS.map((post, index) => (
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
        {MOCK_HERO_POSTS.map((_, idx) => (
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
