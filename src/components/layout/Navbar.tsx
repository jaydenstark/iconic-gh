'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Moon, Sun, Menu } from 'lucide-react';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial preference
    if (typeof window !== 'undefined') {
      const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark' ||
        (!document.documentElement.hasAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setIsDark(isDarkMode);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <header className={`${styles.navbar} glass`}>
      <Link href="/" className={styles.logo}>
        ICONIC<span>GH</span>
      </Link>

      <nav className={styles.links}>
        <Link href="/category/politics" className={styles.link}>Politics</Link>
        <Link href="/category/business" className={styles.link}>Business</Link>
        <Link href="/category/tech" className={styles.link}>Tech</Link>
        <Link href="/category/sports" className={styles.link}>Sports</Link>
        <Link href="/category/entertainment" className={styles.link}>Entertainment</Link>
      </nav>

      <div className={styles.actions}>
        <button className={styles.iconButton} aria-label="Search">
          <Search size={20} />
        </button>
        <button className={styles.iconButton} onClick={toggleTheme} aria-label="Toggle Dark Mode">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className={`${styles.iconButton} md:hidden`} aria-label="Menu" style={{ display: 'flex' }} onClick={() => {}}>
          {/* Menu button normally hidden on desktop via media queries, inline style just for fallback if needed, but we rely on css usually. We'll refine responsiveness later */}
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
};
