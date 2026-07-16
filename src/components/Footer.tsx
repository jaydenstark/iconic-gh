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
            <img 
              src="/logo.png?v=3" 
              alt="ICONIC GH Logo" 
              width={180}
              height={60}
              style={{ marginBottom: '1rem' }}
            />
          </Link>
          <p className={styles.description}>
            ICONIC GH is a premium software development and digital marketing agency. We build next-generation applications and scale brands globally through strategic growth campaigns.
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
          <h3 className={styles.linkTitle}>Services</h3>
          <nav className={styles.links}>
            <Link href="/#services" className={styles.link}>Software Development</Link>
            <Link href="/#services" className={styles.link}>Digital Marketing</Link>
            <Link href="/#services" className={styles.link}>Mobile App Design</Link>
            <Link href="/#services" className={styles.link}>SEO Optimization</Link>
            <Link href="/#services" className={styles.link}>Cloud Solutions</Link>
          </nav>
        </div>

        <div>
          <h3 className={styles.linkTitle}>Company</h3>
          <nav className={styles.links}>
            <Link href="/about" className={styles.link}>About Us</Link>
            <Link href="/#portfolio" className={styles.link}>Our Work</Link>
            <Link href="/#contact" className={styles.link}>Contact Us</Link>
            <Link href="/admin" className={styles.link}>Admin Console</Link>
          </nav>
        </div>

        <div>
          <h3 className={styles.linkTitle}>Insights</h3>
          <nav className={styles.links}>
            <Link href="/blog" className={styles.link}>Blog Home</Link>
            <Link href="/categories?c=tech" className={styles.link}>Tech News</Link>
            <Link href="/categories?c=business" className={styles.link}>Business News</Link>
            <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
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
