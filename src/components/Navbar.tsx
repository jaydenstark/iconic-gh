'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Moon, Sun, Bell, BellOff, X, Shield } from 'lucide-react';
import { ArticlesService, Article } from '@/services/articles';
import { useAuth } from '@/hooks/useAuth';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const { role } = useAuth();
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const isAdmin = role === 'super_admin' || role === 'editor';
  
  // Search state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  
  // Push Notifications state
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isNotificationSupported, setIsNotificationSupported] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      // Run once on load to set initial state
      handleScroll();
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    // Check theme preference
    if (typeof window !== 'undefined') {
      const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark' ||
        (!document.documentElement.hasAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      const isSupported = 'Notification' in window;
      const sub = localStorage.getItem('iconic_gh_push_subscribed') === 'true';
      const hasPermission = Notification.permission === 'granted';

      Promise.resolve().then(() => {
        setIsDark(isDarkMode);
        setIsNotificationSupported(isSupported);
        if (sub && hasPermission) {
          setIsSubscribed(true);
        } else if (sub) {
          localStorage.removeItem('iconic_gh_push_subscribed');
          setIsSubscribed(false);
        }
      });
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
          icon: '/icon-192x192.png',
        });
      } else {
        alert('Notification permission was denied. Please adjust your browser settings to receive alerts.');
      }
    } catch (e) {
      console.error('Failed to subscribe to push alerts:', e);
    }
  };

  return (
    <header className={`${styles.navbar} ${scrolled ? `glass ${styles.scrolled}` : styles.transparent}`}>
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
            <img 
              src="/logo.png?v=3" 
              alt="ICONIC GH Logo" 
              width={150}
              height={50}
            />
          </Link>

          <nav className={styles.links}>
            <Link href="/" className={`${styles.link} ${pathname === '/' ? styles.active : ''}`}>Home</Link>
            <Link href="/#services" className={styles.link}>Services</Link>
            <Link href="/#portfolio" className={styles.link}>Portfolio</Link>
            <Link href="/about" className={`${styles.link} ${pathname === '/about' ? styles.active : ''}`}>About</Link>
            <Link href="/blog" className={`${styles.link} ${pathname?.startsWith('/blog') || pathname?.startsWith('/article') || pathname?.startsWith('/categories') || pathname?.startsWith('/search') ? styles.active : ''}`}>Blog</Link>
            <Link href="/#contact" className={styles.link}>Contact</Link>
            {isAdmin && (
              <Link href="/admin" className={`${styles.link} ${pathname?.startsWith('/admin') ? styles.active : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)', fontWeight: 700 }}>
                <Shield size={14} /> Console
              </Link>
            )}
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
            {isAdmin && (
              <Link href="/admin" className={styles.iconButton} aria-label="Admin Console" style={{ display: 'flex' }}>
                <Shield size={20} style={{ color: 'var(--primary)' }} />
              </Link>
            )}
          </div>
        </>
      )}
    </header>
  );
};
