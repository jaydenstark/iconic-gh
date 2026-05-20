'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArticlesService, Article } from '@/services/articles';
import { ArticleCard } from '@/components/ArticleCard';

const CATEGORIES_LIST = ['politics', 'business', 'tech', 'sports', 'entertainment', 'world'];

const CategoriesContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeCategory = searchParams?.get('c') || 'politics';
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategoryArticles = async () => {
      setLoading(true);
      try {
        const data = await ArticlesService.getArticles({ category: activeCategory });
        setArticles(data);
      } catch (err) {
        console.error('Failed to load category articles:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCategoryArticles();
  }, [activeCategory]);

  const handleCategorySelect = (slug: string) => {
    router.push(`/categories?c=${slug}`);
  };

  return (
    <div style={{ padding: '2rem 0', maxWidth: 'var(--max-width)', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)' }}>
          Explore Channels
        </span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.5rem', textTransform: 'capitalize' }}>
          {activeCategory} News
        </h1>
        <p style={{ color: 'var(--muted)', marginTop: '0.5rem', fontSize: '1rem' }}>
          Browse high-quality journalism, editorials, and current happenings.
        </p>
      </header>

      {/* Category Selection Bar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '0.75rem', 
        flexWrap: 'wrap', 
        marginBottom: '3rem',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '1.5rem'
      }}>
        {CATEGORIES_LIST.map((cat) => {
          const isActive = cat.toLowerCase() === activeCategory.toLowerCase();
          return (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '20px',
                border: '1px solid',
                borderColor: isActive ? 'var(--primary)' : 'var(--border)',
                backgroundColor: isActive ? 'var(--primary)' : 'var(--secondary)',
                color: isActive ? 'white' : 'var(--foreground)',
                fontWeight: 700,
                fontSize: '0.85rem',
                textTransform: 'capitalize',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Articles Feed */}
      <div>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--muted)' }}>
            Retrieving {activeCategory} articles...
          </div>
        ) : articles.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--muted)', border: '1px dashed var(--border)', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontWeight: 600 }}>No articles published in this category yet.</p>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem' }}>Check back soon for fresh reporting!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {articles.map((item) => (
              <ArticleCard key={item.id} article={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const Categories = () => {
  return (
    <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center', color: 'var(--muted)' }}>Loading channels...</div>}>
      <CategoriesContent />
    </Suspense>
  );
};

export default Categories;
