import React from 'react';
import Link from 'next/link';
import styles from './TrendingTicker.module.css';

const MOCK_TRENDING = [
  { id: 1, title: 'Global markets rally as tech stocks hit new highs', time: '10m ago' },
  { id: 2, title: 'Major climate summit concludes with historic agreement', time: '1h ago' },
  { id: 3, title: 'New breakthrough in artificial intelligence announced', time: '2h ago' },
  { id: 4, title: 'Championship finals set to begin this weekend', time: '3h ago' },
];

export const TrendingTicker = () => {
  return (
    <div className={styles.tickerContainer}>
      <div className={styles.label}>Trending Now</div>
      <div className={styles.tickerWrapper}>
        <div className={styles.tickerContent}>
          {MOCK_TRENDING.map((item) => (
            <div key={item.id} className={styles.tickerItem}>
              <span>{item.time}</span>
              <Link href={`/article/${item.id}`}>{item.title}</Link>
            </div>
          ))}
          {/* Duplicate for seamless scrolling */}
          {MOCK_TRENDING.map((item) => (
            <div key={`dup-${item.id}`} className={styles.tickerItem}>
              <span>{item.time}</span>
              <Link href={`/article/${item.id}`}>{item.title}</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
