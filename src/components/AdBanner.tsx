'use client';

import React, { useState, useEffect } from 'react';
import { AdvertisementsService } from '@/services/advertisements';
import { Advertisement } from '@/services/firebase/types';
import styles from './AdBanner.module.css';

interface AdBannerProps {
  position: 'hero-banner' | 'sidebar-square';
}

export const AdBanner: React.FC<AdBannerProps> = ({ position }) => {
  const [ad, setAd] = useState<Advertisement | null>(null);

  useEffect(() => {
    const fetchAd = async () => {
      const allAds = await AdvertisementsService.getAdvertisements();
      const now = new Date();
      // Filter for matching position and valid date range
      const activeAd = allAds.find(item => 
        item.position === position && 
        new Date(item.startDate) <= now && 
        new Date(item.endDate) >= now
      );
      if (activeAd) {
        setAd(activeAd);
      }
    };
    fetchAd();
  }, [position]);

  return (
    <div className={styles.adContainer}>
      <span className={styles.adLabel}>Sponsored Advertisement</span>
      <div className={styles.adBox}>
        {ad ? (
          <a href={ad.link} target="_blank" rel="noopener noreferrer" className={styles.adLink}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ad.image} alt={ad.title} className={styles.adImage} />
          </a>
        ) : (
          <div className={styles.adFallback}>
            <span className={styles.adFallbackTitle}>Advertise with ICONIC GH</span>
            <span>Reach thousands of readers daily. Contact ads@iconicgh.com</span>
          </div>
        )}
      </div>
    </div>
  );
};
