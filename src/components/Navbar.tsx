'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Moon, Sun, Menu, Bell, BellOff, X, Shield } from 'lucide-react';
import { ArticlesService, Article } from '@/services/articles';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const [isDark, setIsDark] = useState(false);
  
  // Search state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  
  // Push Notifications state
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isNotificationSupported, setIsNotificationSupported] = useState(false);

  useEffect(() => {
    // Check theme preference
    if (typeof window !== 'undefined') {
      const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark' ||
        (!document.documentElement.hasAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setIsDark(isDarkMode);
      
      // Check notification support & status
      setIsNotificationSupported('Notification' in window);
      const sub = localStorage.getItem('iconic_gh_push_subscribed') === 'true';
      if (sub && Notification.permission === 'granted') {
        setIsSubscribed(true);
      } else if (sub) {
        localStorage.removeItem('iconic_gh_push_subscribed');
        setIsSubscribed(false);
      }
    }
  }, []);

  // Instant live client-side search logic
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim().length > 1) {
        const all = await ArticlesService.getArticles();
        const filtered = all.filter(a => 
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) || 
          a.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered.slice(0, 5));
      } else {
        setSearchResults([]);
      }
    };
    performSearch();
  }, [searchQuery]);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleSubscribeToggle = async () => {
    if (!isNotificationSupported) {
      alert('Desktop notifications are not supported in this browser.');
      return;
    }

    if (isSubscribed) {
      localStorage.setItem('iconic_gh_push_subscribed', 'false');
      setIsSubscribed(false);
      alert('You have unsubscribed from breaking news notifications.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        localStorage.setItem('iconic_gh_push_subscribed', 'true');
        setIsSubscribed(true);
        
        new Notification('Welcome to ICONIC GH!', {
          body: 'You are now subscribed to receive real-time breaking news and trending updates.',
          icon: '/icons/icon-192x192.png',
        });
      } else {
        alert('Notification permission was denied. Please adjust your browser settings to receive alerts.');
      }
    } catch (e) {
      console.error('Failed to subscribe to push alerts:', e);
    }
  };

  return (
    <header className={`${styles.navbar} glass`}>
      {isSearchOpen ? (
        <div className={styles.searchOverlay}>
          <div className={styles.searchBar}>
            <Search size={20} className={styles.searchIconInside} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search headline, category, or story..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button 
              className={styles.closeSearchButton} 
              onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
              aria-label="Close search"
            >
              <X size={20} />
            </button>
          </div>
          
          {searchResults.length > 0 && (
            <div className={`${styles.searchDropdown} glass`}>
              {searchResults.map((post) => (
                <Link 
                  key={post.id} 
                  href={`/article/${post.id}`}
                  className={styles.searchResultItem}
                  onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                >
                  <div 
                    className={styles.resultImage} 
                    style={{ backgroundImage: `url('${post.image}')` }}
                  />
                  <div className={styles.resultDetails}>
                    <span className={styles.resultCategory}>{post.category}</span>
                    <span className={styles.resultTitle}>{post.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <Link href="/" className={styles.logo}>
            ICONIC<span>GH</span>
          </Link>

          <nav className={styles.links}>
            <Link href="/category/politics" className={styles.link}>Politics</Link>
            <Link href="/category/business" className={styles.link}>Business</Link>
            <Link href="/category/tech" className={styles.link}>Tech</Link>
            <Link href="/category/sports" className={styles.link}>Sports</Link>
            <Link href="/category/entertainment" className={styles.link}>Entertainment</Link>
            <Link href="/admin" className={styles.link} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)', fontWeight: 700 }}>
              <Shield size={14} /> Console
            </Link>
          </nav>

          <div className={styles.actions}>
            <button 
              className={styles.iconButton} 
              onClick={() => setIsSearchOpen(true)} 
              aria-label="Open Search"
            >
              <Search size={20} />
            </button>
            <button 
              className={`${styles.iconButton} ${isSubscribed ? styles.bellSubscribed : ''}`} 
              onClick={handleSubscribeToggle} 
              aria-label="Toggle notifications"
              style={{ color: isSubscribed ? '#ff2a5f' : 'inherit' }}
            >
              {isSubscribed ? <Bell size={20} /> : <BellOff size={20} />}
            </button>
            <button className={styles.iconButton} onClick={toggleTheme} aria-label="Toggle Dark Mode">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link href="/admin" className={styles.iconButton} aria-label="Admin Console" style={{ display: 'flex' }}>
              <Shield size={20} style={{ color: 'var(--primary)' }} />
            </Link>
          </div>
        </>
      )}
    </header>
  );
};
