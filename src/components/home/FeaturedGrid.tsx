import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from './FeaturedGrid.module.css';

const MOCK_FEATURED = [
  {
    id: '4',
    title: 'The Rise of Quantum Computing in Finance',
    excerpt: 'How major banks are leveraging quantum algorithms to optimize portfolios and detect fraud in real-time.',
    category: 'Technology',
    time: '4 hours ago',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: '5',
    title: 'New Health Guidelines Emphasize Preventive Care',
    excerpt: 'The WHO releases updated recommendations focusing on lifestyle interventions over reactive treatments.',
    category: 'Health',
    time: '6 hours ago',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: '6',
    title: 'Electric Vehicle Adoption Surpasses Expectations',
    excerpt: 'Global EV sales hit a new milestone as infrastructure improvements encourage mainstream adoption.',
    category: 'Business',
    time: '12 hours ago',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938cb?q=80&w=600&auto=format&fit=crop',
  }
];

export const FeaturedGrid = () => {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Featured Stories</h2>
        <Link href="/latest" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
          View All Latest
        </Link>
      </div>

      <div className={styles.grid}>
        {MOCK_FEATURED.map((post) => (
          <article key={post.id} className={styles.card}>
            <Link href={`/article/${post.id}`} className={styles.imageWrapper}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.image} alt={post.title} className={styles.image} loading="lazy" />
            </Link>
            <div className={styles.content}>
              <div className={styles.meta}>
                <span className={styles.category}>{post.category}</span>
                <span>{post.time}</span>
              </div>
              <Link href={`/article/${post.id}`}>
                <h3 className={styles.cardTitle}>{post.title}</h3>
              </Link>
              <p className={styles.cardExcerpt}>{post.excerpt}</p>
              <Link href={`/article/${post.id}`} className={styles.readMore}>
                Read Article <ArrowRight size={16} style={{ marginLeft: '4px' }} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
