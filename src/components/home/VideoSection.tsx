'use client';

import React, { useState } from 'react';
import { Play } from 'lucide-react';
import styles from './VideoSection.module.css';

const VIDEOS = [
  {
    id: 'v1',
    title: 'Exclusive Interview: The Future of Global Clean Energy Networks',
    excerpt: 'We sit down with lead architects and policy designers to discuss the path to a fully sustainable global power grid.',
    category: 'Analysis',
    duration: '12:45',
    thumbnail: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'v2',
    title: 'Behind the Scenes: Inside the Latest Quantum Physics Facility',
    category: 'Science',
    duration: '08:20',
    thumbnail: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 'v3',
    title: 'Market Report: Will High Interest Rates Trigger a Shift in Tech Investment?',
    category: 'Finance',
    duration: '05:15',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 'v4',
    title: 'First Look: Deep Sea Explorers Map Previously Unseen Trench Systems',
    category: 'Nature',
    duration: '10:30',
    thumbnail: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=400&auto=format&fit=crop',
  }
];

export const VideoSection = () => {
  const [activeVideo, setActiveVideo] = useState(VIDEOS[0]);

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Video Reports</h2>
      <div className={styles.layout}>
        {/* Main Video Display */}
        <div className={styles.mainVideo}>
          <div className={styles.playerWrapper}>
            <div 
              className={styles.videoThumbnail}
              style={{ backgroundImage: `url('${activeVideo.thumbnail}')` }}
            >
              <button className={styles.playButton} aria-label="Play video">
                <Play size={32} fill="white" style={{ marginLeft: '4px' }} />
              </button>
            </div>
          </div>
          <div className={styles.mainInfo}>
            <span className={styles.mainCategory}>{activeVideo.category} • {activeVideo.duration}</span>
            <h3 className={styles.mainTitle}>{activeVideo.title}</h3>
            {activeVideo.excerpt && <p className={styles.mainExcerpt}>{activeVideo.excerpt}</p>}
          </div>
        </div>

        {/* Sidebar Playlist */}
        <div className={styles.sidebar}>
          {VIDEOS.filter(v => v.id !== activeVideo.id).map((video) => (
            <div 
              key={video.id} 
              className={styles.sideCard}
              onClick={() => setActiveVideo(video)}
            >
              <div 
                className={styles.sideThumbnail}
                style={{ backgroundImage: `url('${video.thumbnail}')` }}
              >
                <div className={styles.sidePlayButton}>
                  <Play size={14} fill="white" style={{ marginLeft: '2px' }} />
                </div>
              </div>
              <div className={styles.sideInfo}>
                <span className={styles.sideCategory}>{video.category} • {video.duration}</span>
                <h4 className={styles.sideTitle}>{video.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
