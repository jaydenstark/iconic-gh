'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArticlesService, Article, Author } from '@/services/articles';
import { ArticleCard } from '@/components/ArticleCard';

const ProfileContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const authorNameParam = searchParams?.get('u') || 'Sarah Jenkins';

  const [authors, setAuthors] = useState<Author[]>([]);
  const [activeAuthor, setActiveAuthor] = useState<Author | null>(null);
  const [contributions, setContributions] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuthorsData = async () => {
      try {
        const list = await ArticlesService.getAuthors();
        setAuthors(list);
        
        // Find matching author by name or fall back to the first author
        const match = list.find(a => a.name.toLowerCase() === authorNameParam.toLowerCase()) || list[0];
        if (match) {
          setActiveAuthor(match);
          
          // Get all articles contributed by this specific author
          const allPosts = await ArticlesService.getArticles();
          const postsByAuthor = allPosts.filter(p => p.author?.name.toLowerCase() === match.name.toLowerCase());
          setContributions(postsByAuthor);
        }
      } catch (err) {
        console.error('Failed to load author profiles:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAuthorsData();
  }, [authorNameParam]);

  const handleAuthorChange = (name: string) => {
    router.push(`/profile?u=${encodeURIComponent(name)}`);
  };

  return (
    <div style={{ padding: '2rem 0', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Authors Avatar Selector Bar */}
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)' }}>
          Meet the Editorial Team
        </span>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: '1.5rem' }}>Contributors & journalists</h2>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          {authors.map((auth) => {
            const isActive = activeAuthor && auth.name.toLowerCase() === activeAuthor.name.toLowerCase();
            return (
              <button
                key={auth.name}
                onClick={() => handleAuthorChange(auth.name)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  outline: 'none',
                  opacity: isActive ? 1 : 0.6,
                  transition: 'opacity 0.2s ease',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={auth.avatar} 
                  alt={auth.name} 
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid',
                    borderColor: isActive ? 'var(--primary)' : 'transparent',
                    boxShadow: isActive ? 'var(--shadow-md)' : 'none',
                    transition: 'all 0.2s ease',
                    marginBottom: '0.5rem'
                  }}
                />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--foreground)' }}>{auth.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--muted)' }}>
          Retrieving author biography and portfolio...
        </div>
      ) : activeAuthor ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
          {/* Author Header Spotlight Card */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'var(--secondary)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            gap: '1rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={activeAuthor.avatar} 
              alt={activeAuthor.name} 
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid var(--background)',
                boxShadow: 'var(--shadow-md)'
              }}
            />
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>{activeAuthor.name}</h1>
              <span style={{ 
                display: 'inline-block',
                fontSize: '0.75rem', 
                fontWeight: 700, 
                color: 'var(--primary)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em', 
                marginTop: '0.25rem',
                backgroundColor: 'rgba(255, 42, 95, 0.1)',
                padding: '0.2rem 0.6rem',
                borderRadius: '4px'
              }}>
                Journalist & Writer
              </span>
            </div>
            <p style={{ 
              color: 'var(--muted)', 
              maxWidth: '600px', 
              fontSize: '1rem', 
              lineHeight: 1.6, 
              margin: '0.5rem 0 0' 
            }}>
              {activeAuthor.bio || "Staff reporter dedicated to publishing accurate, impactful reporting for our global audience."}
            </p>
          </div>

          {/* Author Contribution Portfolio Feed */}
          <div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 800, 
              borderBottom: '2px solid var(--border)', 
              paddingBottom: '0.5rem', 
              marginBottom: '1.5rem' 
            }}>
              Recent Reporting ({contributions.length})
            </h3>
            
            {contributions.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>
                No recent stories published by this writer yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {contributions.map((post) => (
                  <ArticleCard key={post.id} article={post} />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--muted)' }}>
          No writer profile selected.
        </div>
      )}
    </div>
  );
};

export const Profile = () => {
  return (
    <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center', color: 'var(--muted)' }}>Loading journalist portfolios...</div>}>
      <ProfileContent />
    </Suspense>
  );
};

export default Profile;
