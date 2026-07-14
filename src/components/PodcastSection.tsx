'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, SkipForward, SkipBack, Headphones, Mic, Heart, Share2 } from 'lucide-react';
import styles from './PodcastSection.module.css';

interface Episode {
  id: string;
  title: string;
  showName: string;
  host: string;
  duration: string;
  durationSeconds: number;
  thumbnail: string;
  audioUrl?: string;
  description: string;
  date: string;
}

const PODCAST_EPISODES: Episode[] = [
  {
    id: 'ep-1',
    title: 'The Rise of Digital Trade Zones in West Africa',
    showName: 'The Iconic Pitch',
    host: 'Sarah Jenkins',
    duration: '24:18',
    durationSeconds: 1458,
    thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=400&auto=format&fit=crop',
    description: 'We analyze the cross-border digital policies, emerging payment corridors, and localized fintech hubs accelerating commerce across the ECOWAS region.',
    date: 'May 18, 2026'
  },
  {
    id: 'ep-2',
    title: 'Ecotourism or Greenwashing? Ghana’s Forest Reserve Dilemma',
    showName: 'Green Frontiers',
    host: 'David Atten',
    duration: '31:05',
    durationSeconds: 1865,
    thumbnail: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=400&auto=format&fit=crop',
    description: 'An investigative exploration into conservation funding, rural community participation, and regulatory policies protecting primary forest reserves.',
    date: 'May 15, 2026'
  },
  {
    id: 'ep-3',
    title: 'Decoded: Designing the Autonomous Smart City Grids',
    showName: 'Silicon & Beyond',
    host: 'Marcus Vance',
    duration: '18:42',
    durationSeconds: 1122,
    thumbnail: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=400&auto=format&fit=crop',
    description: 'A deep-dive technical interview with infrastructure designers engineering dynamic micro-grids powered by decentralized clean generation systems.',
    date: 'May 10, 2026'
  }
];

export const PodcastSection = () => {
  const [activeEp, setActiveEp] = useState<Episode>(PODCAST_EPISODES[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // in seconds
  const [volume, setVolume] = useState(70); // 0 - 100
  const [isLiked, setIsLiked] = useState(false);

  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
      }
    };
  }, []);

  // Control playback simulation
  useEffect(() => {
    if (isPlaying) {
      playbackTimerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= activeEp.durationSeconds) {
            setIsPlaying(false);
            if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
      }
    }

    return () => {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
      }
    };
  }, [isPlaying, activeEp]);

  // Load new episode resets player progress
  const handleSelectEpisode = (ep: Episode) => {
    setActiveEp(ep);
    setProgress(0);
    setIsPlaying(false);
    setIsLiked(false);
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkipForward = () => {
    const idx = PODCAST_EPISODES.findIndex(e => e.id === activeEp.id);
    const nextIdx = (idx + 1) % PODCAST_EPISODES.length;
    handleSelectEpisode(PODCAST_EPISODES[nextIdx]);
  };

  const handleSkipBack = () => {
    const idx = PODCAST_EPISODES.findIndex(e => e.id === activeEp.id);
    const prevIdx = (idx - 1 + PODCAST_EPISODES.length) % PODCAST_EPISODES.length;
    handleSelectEpisode(PODCAST_EPISODES[prevIdx]);
  };

  const handleProgressBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(Number(e.target.value));
  };

  // Formatting seconds to MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <section className={styles.container}>
      <div className={styles.sectionHeader}>
        <div className={styles.titleArea}>
          <div className={styles.badge}>
            <Mic size={14} className={styles.badgeIcon} />
            <span>EXCLUSIVES</span>
          </div>
          <h2 className={styles.sectionTitle}>Iconic Podcasts</h2>
        </div>
        <p className={styles.sectionSubtitle}>
          Deep analysis, original investigative audio reports, and sharp interviews with industry leaders.
        </p>
      </div>

      <div className={styles.layout}>
        {/* Main Interactive Deck */}
        <div className={styles.deck}>
          <div className={styles.nowPlayingPanel}>
            <div 
              className={styles.albumCover}
              style={{ backgroundImage: `url('${activeEp.thumbnail}')` }}
            >
              <div className={styles.overlay}>
                <span className={styles.nowPlayingLabel}>NOW PLAYING</span>
                <span className={styles.showName}>{activeEp.showName}</span>
              </div>
            </div>

            <div className={styles.playerControlsWrapper}>
              <div className={styles.trackDetails}>
                <h3 className={styles.episodeTitle}>{activeEp.title}</h3>
                <span className={styles.hostLabel}>Hosted by {activeEp.host} • {activeEp.date}</span>
              </div>

              {/* Animated Audio Frequency Waves */}
              <div className={styles.waveContainer}>
                {[...Array(16)].map((_, i) => {
                  // eslint-disable-next-line react-hooks/purity
                  const randomHeight = isPlaying ? `${Math.floor(Math.random() * 28) + 6}px` : '4px';
                  const animationDelay = `${i * 0.1}s`;
                  return (
                    <div 
                      key={i} 
                      className={styles.waveBar} 
                      style={{ 
                        height: randomHeight,
                        animationDelay: animationDelay,
                        animationPlayState: isPlaying ? 'running' : 'paused'
                      }} 
                    />
                  );
                })}
              </div>

              {/* Time progress bar */}
              <div className={styles.timeline}>
                <span className={styles.timeLabel}>{formatTime(progress)}</span>
                <input 
                  type="range"
                  min="0"
                  max={activeEp.durationSeconds}
                  value={progress}
                  onChange={handleProgressBarChange}
                  className={styles.progressSlider}
                  aria-label="Playback progress"
                />
                <span className={styles.timeLabel}>{activeEp.duration}</span>
              </div>

              {/* Control Buttons row */}
              <div className={styles.controlButtons}>
                <button 
                  onClick={() => setIsLiked(!isLiked)} 
                  className={`${styles.iconButton} ${isLiked ? styles.liked : ''}`}
                  aria-label="Like episode"
                >
                  <Heart size={20} fill={isLiked ? 'var(--primary)' : 'none'} stroke={isLiked ? 'var(--primary)' : 'currentColor'} />
                </button>

                <div className={styles.playbackTriggers}>
                  <button onClick={handleSkipBack} className={styles.skipButton} aria-label="Previous episode">
                    <SkipBack size={22} fill="currentColor" />
                  </button>

                  <button 
                    onClick={handleTogglePlay} 
                    className={styles.playTrigger} 
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause size={24} fill="currentColor" />
                    ) : (
                      <Play size={24} fill="currentColor" style={{ marginLeft: '3px' }} />
                    )}
                  </button>

                  <button onClick={handleSkipForward} className={styles.skipButton} aria-label="Next episode">
                    <SkipForward size={22} fill="currentColor" />
                  </button>
                </div>

                <button 
                  className={styles.iconButton}
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Share link copied to clipboard!');
                    }
                  }}
                  aria-label="Share episode"
                >
                  <Share2 size={20} />
                </button>
              </div>

              {/* Volume line */}
              <div className={styles.volumeControl}>
                <Volume2 size={16} className={styles.volumeIcon} />
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className={styles.volumeSlider}
                  aria-label="Volume slider"
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)', width: '25px', textAlign: 'right' }}>{volume}%</span>
              </div>
            </div>
          </div>
          
          <div className={styles.epDetailsCard}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary)', marginBottom: '0.5rem' }}>
              Episode Notes
            </h4>
            <p className={styles.epDescription}>{activeEp.description}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <span className={styles.metaTag}><Headphones size={12} /> {activeEp.duration}</span>
              <span className={styles.metaTag}>MP3 High Quality</span>
              <span className={styles.metaTag}>Stereo</span>
            </div>
          </div>
        </div>

        {/* Episodes Sidebar list */}
        <div className={styles.sidebar}>
          <h3 className={styles.sidebarTitle}>All Episodes</h3>
          <div className={styles.episodesList}>
            {PODCAST_EPISODES.map((ep) => {
              const isActive = ep.id === activeEp.id;
              return (
                <div 
                  key={ep.id} 
                  className={`${styles.sidebarItem} ${isActive ? styles.sidebarItemActive : ''}`}
                  onClick={() => handleSelectEpisode(ep)}
                >
                  <div 
                    className={styles.sidebarThumb}
                    style={{ backgroundImage: `url('${ep.thumbnail}')` }}
                  >
                    {isActive && isPlaying && (
                      <div className={styles.sidebarPlayOverlay}>
                        <Pause size={16} fill="white" />
                      </div>
                    )}
                    {(!isActive || !isPlaying) && (
                      <div className={styles.sidebarPlayOverlay}>
                        <Play size={16} fill="white" style={{ marginLeft: '2px' }} />
                      </div>
                    )}
                  </div>
                  <div className={styles.sidebarInfo}>
                    <span className={styles.sidebarShow}>{ep.showName} • {ep.date}</span>
                    <h4 className={styles.sidebarEpTitle}>{ep.title}</h4>
                    <span className={styles.sidebarDuration}>{ep.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PodcastSection;
