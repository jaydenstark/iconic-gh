'use client';

import React, { useState } from 'react';
import styles from './Newsletter.module.css';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <div className={styles.newsletterCard}>
      <h3 className={styles.title}>Stay in the Loop</h3>
      <p className={styles.description}>
        Subscribe to the ICONIC GH newsletter and receive the latest breaking news stories and exclusive reports direct to your inbox.
      </p>
      {submitted ? (
        <p className={styles.successMsg}>Thank you! You have successfully subscribed to our newsletter.</p>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Enter your email address" 
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email Address"
          />
          <button type="submit" className={styles.submitBtn}>
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
};
