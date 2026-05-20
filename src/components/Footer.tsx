'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from './ui/Button';
import styles from './Footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            ICONIC<span>GH</span>
          </Link>
          <p className={styles.description}>
            Delivering breaking news, deep analysis, and trending stories from around the globe. Stay informed with ICONIC GH.
          </p>
          <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Subscribe to newsletter" 
              className={styles.input}
              required
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>

        <div>
          <h3 className={styles.linkTitle}>Sections</h3>
          <nav className={styles.links}>
            <Link href="/categories?c=politics" className={styles.link}>Politics</Link>
            <Link href="/categories?c=business" className={styles.link}>Business</Link>
            <Link href="/categories?c=tech" className={styles.link}>Tech</Link>
            <Link href="/categories?c=sports" className={styles.link}>Sports</Link>
            <Link href="/categories?c=entertainment" className={styles.link}>Entertainment</Link>
          </nav>
        </div>

        <div>
          <h3 className={styles.linkTitle}>Company</h3>
          <nav className={styles.links}>
            <Link href="/about" className={styles.link}>About Us</Link>
            <Link href="/contact" className={styles.link}>Contact</Link>
            <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
            <Link href="/terms" className={styles.link}>Terms of Service</Link>
            <Link href="/admin" className={styles.link}>Admin Dashboard</Link>
          </nav>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} ICONIC GH. All rights reserved.
        </p>
        <div className={styles.links} style={{ flexDirection: 'row', gap: '1rem' }}>
          <a href="#" className={styles.link}>Twitter</a>
          <a href="#" className={styles.link}>Facebook</a>
          <a href="#" className={styles.link}>Instagram</a>
        </div>
      </div>
    </footer>
  );
};
