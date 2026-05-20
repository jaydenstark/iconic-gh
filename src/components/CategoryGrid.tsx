'use client';

import React from 'react';
import Link from 'next/link';
import { Landmark, Briefcase, Cpu, Trophy, Film, Globe } from 'lucide-react';
import styles from './CategoryGrid.module.css';

const CATEGORIES = [
  { name: 'Politics', slug: 'politics', icon: Landmark, count: 142 },
  { name: 'Business', slug: 'business', icon: Briefcase, count: 98 },
  { name: 'Tech', slug: 'tech', icon: Cpu, count: 120 },
  { name: 'Sports', slug: 'sports', icon: Trophy, count: 85 },
  { name: 'Entertainment', slug: 'entertainment', icon: Film, count: 110 },
  { name: 'World', slug: 'world', icon: Globe, count: 230 },
];

export const CategoryGrid = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Browse by Category</h2>
      <div className={styles.grid}>
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link key={cat.slug} href={`/categories?c=${cat.slug}`} className={styles.card}>
              <div className={styles.iconWrapper}>
                <Icon size={32} />
              </div>
              <span className={styles.name}>{cat.name}</span>
              <span className={styles.count}>{cat.count} articles</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
