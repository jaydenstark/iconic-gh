'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ICONIC_AUTHOR } from '@/services/articles';
import { RSS_FEEDS } from '@/services/newsCrawler';

// ============================================================
// Types
// ============================================================
interface CrawlStats {
  feedsProcessed: number;
  newArticles: number;
  skippedDuplicates: number;
  errors: string[];
  articlesPublished: string[];
}

interface IconicConfig {
  paused: boolean;
  lastRun?: string;
  lastRunStats?: CrawlStats;
}

interface RecentPost {
  id: string;
  title: string;
  category: string;
  sourceName: string;
  publishDate: string;
  views: number;
}

// ============================================================
// Styles — scoped via CSS-in-JS object style
// ============================================================
const S = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 8px',
  } as React.CSSProperties,

  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    background: 'linear-gradient(135deg, #111 0%, #1a0a0a 100%)',
    border: '1px solid rgba(214,0,0,0.3)',
    borderRadius: '16px',
    padding: '24px 28px',
    marginBottom: '28px',
    position: 'relative' as const,
    overflow: 'hidden',
  },

  headerGlow: {
    position: 'absolute' as const,
    top: '-40px',
    right: '-40px',
    width: '200px',
    height: '200px',
    background: 'radial-gradient(circle, rgba(214,0,0,0.2) 0%, transparent 70%)',
    pointerEvents: 'none' as const,
  },

  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: '3px solid #D60000',
    objectFit: 'cover' as const,
    flexShrink: 0,
  },

  authorInfo: {
    flex: 1,
  },

  authorName: {
    fontSize: '24px',
    fontWeight: 800,
    color: '#fff',
    margin: 0,
    letterSpacing: '-0.5px',
  },

  authorBio: {
    fontSize: '13px',
    color: '#aaa',
    margin: '6px 0 0',
    lineHeight: 1.5,
    maxWidth: '500px',
  },

  statusBadge: (active: boolean) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.5px',
    background: active ? 'rgba(16,185,129,0.15)' : 'rgba(107,114,128,0.2)',
    color: active ? '#10b981' : '#9ca3af',
    border: `1px solid ${active ? 'rgba(16,185,129,0.3)' : 'rgba(107,114,128,0.2)'}`,
    marginTop: '10px',
  } as React.CSSProperties),

  statusDot: (active: boolean) => ({
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: active ? '#10b981' : '#9ca3af',
    boxShadow: active ? '0 0 6px #10b981' : 'none',
    animation: active ? 'pulse 2s infinite' : 'none',
  } as React.CSSProperties),

  controls: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap' as const,
    marginLeft: 'auto',
    alignItems: 'flex-start',
  },

  btn: (variant: 'primary' | 'danger' | 'ghost' | 'gold') => {
    const variants = {
      primary: { background: '#D60000', color: '#fff', border: '1px solid #D60000' },
      danger: { background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' },
      ghost: { background: 'rgba(255,255,255,0.05)', color: '#ccc', border: '1px solid rgba(255,255,255,0.1)' },
      gold: { background: 'rgba(255,215,0,0.12)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.3)' },
    };
    return {
      padding: '10px 18px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
      ...variants[variant],
    } as React.CSSProperties;
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '28px',
  },

  statCard: {
    background: '#111',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center' as const,
  },

  statValue: {
    fontSize: '32px',
    fontWeight: 800,
    color: '#fff',
    lineHeight: 1,
    marginBottom: '6px',
  },

  statLabel: {
    fontSize: '12px',
    color: '#888',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.8px',
  },

  section: {
    background: '#111',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '14px',
    padding: '24px',
    marginBottom: '24px',
  },

  sectionTitle: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  postRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },

  postTitle: {
    flex: 1,
    fontSize: '13px',
    color: '#e5e7eb',
    fontWeight: 500,
    lineHeight: 1.4,
  },

  postMeta: {
    fontSize: '11px',
    color: '#666',
  },

  categoryBadge: {
    padding: '3px 9px',
    background: 'rgba(214,0,0,0.15)',
    color: '#D60000',
    borderRadius: '20px',
    fontSize: '10px',
    fontWeight: 700,
    whiteSpace: 'nowrap' as const,
  },

  feedRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },

  toggle: (enabled: boolean) => ({
    width: '40px',
    height: '22px',
    borderRadius: '11px',
    background: enabled ? '#D60000' : '#333',
    border: 'none',
    cursor: 'pointer',
    position: 'relative' as const,
    transition: 'background 0.2s',
    flexShrink: 0,
  } as React.CSSProperties),

  toggleThumb: (enabled: boolean) => ({
    position: 'absolute' as const,
    top: '3px',
    left: enabled ? '21px' : '3px',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    background: '#fff',
    transition: 'left 0.2s',
  } as React.CSSProperties),

  errorList: {
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: '8px',
    padding: '12px 16px',
    marginTop: '12px',
  },

  errorItem: {
    fontSize: '12px',
    color: '#ef4444',
    lineHeight: 1.6,
  },

  logEntry: {
    fontSize: '12px',
    color: '#9ca3af',
    fontFamily: 'monospace',
    lineHeight: 1.6,
    padding: '2px 0',
  },

  triggerResult: (success: boolean) => ({
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    background: success ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
    color: success ? '#10b981' : '#ef4444',
    border: `1px solid ${success ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
    marginTop: '12px',
  } as React.CSSProperties),
};

// ============================================================
// AIAuthor Component
// ============================================================
export default function AIAuthor() {
  const [config, setConfig] = useState<IconicConfig>({ paused: false });
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [feeds, setFeeds] = useState(RSS_FEEDS.map(f => ({ ...f })));
  const [isTriggering, setIsTriggering] = useState(false);
  const [triggerResult, setTriggerResult] = useState<{ success: boolean; message: string; stats?: CrawlStats } | null>(null);
  const [loading, setLoading] = useState(true);
  const [weeklyCount, setWeeklyCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // ── Load config & posts from Firestore (or mock data in dev)
  const loadData = useCallback(async () => {
    setLoading(true);
    const useFirestore = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';

    if (useFirestore) {
      try {
        const { initializeApp, getApps, getApp } = await import('firebase/app');
        const { getFirestore, doc, getDoc, collection, query, where, orderBy, limit, getDocs } = await import('firebase/firestore');

        const firebaseConfig = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        };
        const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
        const db = getFirestore(app);

        // Load config
        const configSnap = await getDoc(doc(db, 'iconic_config', 'settings'));
        if (configSnap.exists()) {
          const d = configSnap.data();
          setConfig({
            paused: d.paused || false,
            lastRun: d.lastRun?.toDate?.()?.toISOString() || d.lastRun,
            lastRunStats: d.lastRunStats,
          });
        }

        // Load recent posts by Iconic
        const postsQuery = query(
          collection(db, 'posts'),
          where('authorId', '==', 'iconic-ai'),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        const postsSnap = await getDocs(postsQuery);
        const posts: RecentPost[] = postsSnap.docs.map(d => ({
          id: d.id,
          title: d.data().title,
          category: d.data().category || 'Ghana',
          sourceName: d.data().sourceName || 'Iconic AI',
          publishDate: d.data().publishDate?.toDate?.()?.toISOString() || new Date().toISOString(),
          views: d.data().views || 0,
        }));
        setRecentPosts(posts);

        // Count weekly posts
        const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000);
        const weeklyQuery = query(
          collection(db, 'posts'),
          where('authorId', '==', 'iconic-ai'),
          where('createdAt', '>=', weekAgo)
        );
        const weeklySnap = await getDocs(weeklyQuery);
        setWeeklyCount(weeklySnap.size);
        setTotalCount(postsSnap.size);
      } catch (err) {
        console.error('Failed to load Iconic data:', err);
      }
    } else {
      // Dev mode: show demo data
      setConfig({ paused: false, lastRun: new Date(Date.now() - 28 * 60 * 1000).toISOString() });
      setRecentPosts([
        { id: '1', title: 'Ghana Parliament Passes Historic Digital Economy Bill', category: 'Politics', sourceName: 'GhanaWeb', publishDate: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), views: 342 },
        { id: '2', title: 'Accra Stock Exchange Records Strongest Quarter in Five Years', category: 'Business', sourceName: 'MyJoyOnline', publishDate: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), views: 218 },
        { id: '3', title: "Black Stars Coach Names Squad for AFCON Qualifier", category: 'Sports', sourceName: 'Pulse Ghana', publishDate: new Date(Date.now() - 9 * 3600 * 1000).toISOString(), views: 1203 },
        { id: '4', title: 'African Union Summit Backs Continental Free Trade Agreement Expansion', category: 'Africa', sourceName: 'BBC Africa', publishDate: new Date(Date.now() - 14 * 3600 * 1000).toISOString(), views: 487 },
        { id: '5', title: 'Kumasi Becomes West Africa\'s Fastest Growing Tech Hub', category: 'Technology', sourceName: 'Modern Ghana', publishDate: new Date(Date.now() - 22 * 3600 * 1000).toISOString(), views: 892 },
      ]);
      setWeeklyCount(47);
      setTotalCount(312);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Toggle Iconic on/off
  const togglePause = async () => {
    const newPaused = !config.paused;
    setConfig(prev => ({ ...prev, paused: newPaused }));

    const useFirestore = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';
    if (useFirestore) {
      try {
        const { initializeApp, getApps, getApp } = await import('firebase/app');
        const { getFirestore, doc, setDoc } = await import('firebase/firestore');
        const app = getApps().length > 0 ? getApp() : initializeApp({
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });
        const db = getFirestore(app);
        await setDoc(doc(db, 'iconic_config', 'settings'), { paused: newPaused }, { merge: true });
      } catch (err) {
        console.error('Failed to update config:', err);
        setConfig(prev => ({ ...prev, paused: !newPaused })); // Revert
      }
    }
  };

  // ── Manual trigger
  const triggerCrawl = async () => {
    setIsTriggering(true);
    setTriggerResult(null);
    try {
      const res = await fetch('/api/iconic-crawl', {
        method: 'POST',
        headers: {
          'x-iconic-admin': process.env.NEXT_PUBLIC_CRON_SECRET || 'dev-trigger',
        },
      });
      const data = await res.json();
      setTriggerResult({ success: res.ok, message: data.message || data.error, stats: data.stats });
      if (res.ok) loadData(); // Refresh post list
    } catch (err) {
      setTriggerResult({ success: false, message: `Request failed: ${err}` });
    } finally {
      setIsTriggering(false);
    }
  };

  // ── Toggle feed
  const toggleFeed = (index: number) => {
    setFeeds(prev => prev.map((f, i) => i === index ? { ...f, enabled: !f.enabled } : f));
  };

  // ── Helpers
  const isOnline = !config.paused;
  const formatDate = (iso?: string) => {
    if (!iso) return 'Never';
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
        Loading Iconic AI status...
      </div>
    );
  }

  const lastStats = config.lastRunStats;

  return (
    <div style={S.container}>

      {/* ── Header ── */}
      <div style={S.header}>
        <div style={S.headerGlow} />
        <img
          src={ICONIC_AUTHOR.avatar}
          alt="Iconic AI"
          style={S.avatar}
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=100'; }}
        />
        <div style={S.authorInfo}>
          <h2 style={S.authorName}>⚡ Iconic AI Author</h2>
          <p style={S.authorBio}>{ICONIC_AUTHOR.bio}</p>
          <div style={S.statusBadge(isOnline)}>
            <span style={S.statusDot(isOnline)} />
            {isOnline ? 'ONLINE — Publishing Every 30 Minutes' : 'PAUSED'}
            {config.lastRun && <span style={{ marginLeft: '8px', opacity: 0.7, fontWeight: 400 }}>· Last run {formatDate(config.lastRun)}</span>}
          </div>
        </div>

        <div style={S.controls}>
          <button
            style={S.btn('gold')}
            onClick={triggerCrawl}
            disabled={isTriggering}
          >
            {isTriggering ? '⏳ Crawling...' : '▶ Run Now'}
          </button>
          <button
            style={S.btn(isOnline ? 'danger' : 'primary')}
            onClick={togglePause}
          >
            {isOnline ? '⏸ Pause Iconic' : '▶ Resume Iconic'}
          </button>
        </div>
      </div>

      {/* ── Trigger Result ── */}
      {triggerResult && (
        <div style={triggerResult.success ? S.triggerResult(true) : S.triggerResult(false)}>
          <strong>{triggerResult.success ? '✓' : '✗'}</strong> {triggerResult.message}
          {triggerResult.stats && triggerResult.stats.articlesPublished.length > 0 && (
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontWeight: 700, marginBottom: '4px' }}>Published articles:</div>
              {triggerResult.stats.articlesPublished.map((t, i) => (
                <div key={i} style={S.logEntry}>· {t}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Stats Grid ── */}
      <div style={S.statsGrid}>
        <div style={S.statCard}>
          <div style={{ ...S.statValue, color: '#D60000' }}>{weeklyCount}</div>
          <div style={S.statLabel}>Articles This Week</div>
        </div>
        <div style={S.statCard}>
          <div style={{ ...S.statValue, color: '#FFD700' }}>{totalCount}</div>
          <div style={S.statLabel}>Total Published</div>
        </div>
        <div style={S.statCard}>
          <div style={{ ...S.statValue, color: '#60a5fa' }}>
            {feeds.filter(f => f.enabled).length}
          </div>
          <div style={S.statLabel}>Active Sources</div>
        </div>
        <div style={S.statCard}>
          <div style={{ ...S.statValue, color: '#10b981' }}>
            {lastStats ? lastStats.newArticles : '—'}
          </div>
          <div style={S.statLabel}>Last Run · New Posts</div>
        </div>
        <div style={S.statCard}>
          <div style={{ ...S.statValue, color: '#a78bfa' }}>
            {lastStats ? lastStats.skippedDuplicates : '—'}
          </div>
          <div style={S.statLabel}>Last Run · Skipped</div>
        </div>
      </div>

      {/* ── Recent Posts ── */}
      <div style={S.section}>
        <div style={S.sectionTitle}>
          📰 Recent AI-Published Articles
        </div>
        {recentPosts.length === 0 ? (
          <p style={{ color: '#666', fontSize: '13px' }}>No articles published yet. Click &quot;Run Now&quot; to start crawling.</p>
        ) : (
          recentPosts.map((post) => (
            <div key={post.id} style={S.postRow}>
              <span style={S.categoryBadge}>{post.category}</span>
              <div style={{ flex: 1 }}>
                <div style={S.postTitle}>{post.title}</div>
                <div style={S.postMeta}>
                  via {post.sourceName} · {formatDate(post.publishDate)} · {post.views} views
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Feed Manager ── */}
      <div style={S.section}>
        <div style={S.sectionTitle}>
          📡 RSS Feed Sources
        </div>
        {feeds.map((feed, i) => (
          <div key={feed.url} style={S.feedRow}>
            <button
              style={S.toggle(feed.enabled)}
              onClick={() => toggleFeed(i)}
              aria-label={`${feed.enabled ? 'Disable' : 'Enable'} ${feed.name}`}
            >
              <span style={S.toggleThumb(feed.enabled)} />
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: feed.enabled ? '#e5e7eb' : '#666' }}>
                {feed.name}
              </div>
              <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>{feed.url}</div>
            </div>
            <span style={{
              ...S.categoryBadge,
              background: feed.category === 'Ghana' ? 'rgba(255,215,0,0.12)' : 'rgba(96,165,250,0.12)',
              color: feed.category === 'Ghana' ? '#FFD700' : '#60a5fa',
            }}>
              {feed.category}
            </span>
          </div>
        ))}
        <p style={{ fontSize: '11px', color: '#555', marginTop: '12px' }}>
          Note: Feed enable/disable toggles apply to the next crawl run. Changes are not yet persisted to Firestore.
        </p>
      </div>

      {/* ── Last Run Errors ── */}
      {lastStats && lastStats.errors.length > 0 && (
        <div style={S.section}>
          <div style={S.sectionTitle}>⚠️ Last Run Errors</div>
          <div style={S.errorList}>
            {lastStats.errors.map((err, i) => (
              <div key={i} style={S.errorItem}>· {err}</div>
            ))}
          </div>
        </div>
      )}

      {/* ── Prompt Preview ── */}
      <div style={S.section}>
        <div style={S.sectionTitle}>🤖 AI Paraphrasing Prompt (Preview)</div>
        <pre style={{
          fontSize: '11px',
          color: '#9ca3af',
          background: '#0a0a0a',
          padding: '16px',
          borderRadius: '8px',
          overflowX: 'auto',
          lineHeight: 1.7,
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
{`You are Iconic, the AI journalist for ICONIC GH — Ghana's premier digital news platform.

Your task: Rewrite the following news story in your own words for a Ghanaian 
and African audience.

RULES:
- Write a NEW headline (punchy, journalistic, max 12 words)
- Write a one-sentence excerpt/teaser (max 30 words)
- Write 4-6 body paragraphs expanding on the story. Add Ghanaian/African context.
- Use professional newspaper journalism style — factual, clear, engaging.
- Do NOT copy the original text verbatim. Paraphrase everything.
- Choose ONE category from: Ghana, Africa, Politics, Business, Sports, 
  Entertainment, Health, Technology

[Article content injected here at runtime]

Respond ONLY with valid JSON: { title, excerpt, body[], category, readTime }`}
        </pre>
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
