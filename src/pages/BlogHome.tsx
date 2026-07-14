'use client';

import React, { useState, useEffect } from 'react';
import { BreakingTicker } from '@/components/BreakingTicker';
import { HeroSlider } from '@/components/HeroSlider';
import { CategoryGrid } from '@/components/CategoryGrid';
import { VideoSection } from '@/components/VideoSection';
import { NewsCard } from '@/components/NewsCard';
import { AdBanner } from '@/components/AdBanner';
import { Newsletter } from '@/components/Newsletter';
import { TrendingNews } from '@/components/TrendingNews';
import { PodcastSection } from '@/components/PodcastSection';
import { ArticlesService, Article } from '@/services/articles';

export const BlogHome = () => {
  const [posts, setPosts] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await ArticlesService.getArticles({ sortBy: 'recent' });
        setPosts(data);
      } catch (err) {
        console.error('Failed to load home page articles:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <main>
      <h1 style={{ display: 'none' }}>ICONIC GH - Global Breaking News, Analysis and Trending Stories</h1>
      
      <BreakingTicker />
      <HeroSlider />
      
      {/* Main Grid: Featured news + Trending News sidebar */}
      <div className="homeGrid">
        {/* Left Column: Featured Articles Grid Section */}
        <section style={{ padding: '1rem 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, position: 'relative' }}>
              Featured Stories
              <span style={{ position: 'absolute', bottom: '-0.6rem', left: 0, width: '50px', height: '4px', backgroundColor: 'var(--primary)' }} />
            </h2>
          </div>

          {loading ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--muted)' }}>
              Loading latest news articles...
            </div>
          ) : posts.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--muted)' }}>
              No articles found. Check back later!
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {posts.map((post) => (
                <NewsCard key={post.id} article={post} />
              ))}
            </div>
          )}
        </section>

        {/* Right Column: Trending News Section */}
        <aside style={{ padding: '1rem 0' }}>
          <TrendingNews />
        </aside>
      </div>

      {/* Programmatic Advertisement Banner Placement */}
      <AdBanner position="hero-banner" />

      {/* Podcast Exclusives Section */}
      <PodcastSection />

      {/* Video Reports Section */}
      <VideoSection />

      {/* Categories Selection Block */}
      <CategoryGrid />

      {/* Brand Engagement Newsletter Form */}
      <Newsletter />
    </main>
  );
};
export default BlogHome;
