'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArticlesService, Article } from '@/services/articles';
import { ArticleCard } from '@/components/ArticleCard';
import { Search as SearchIcon } from 'lucide-react';

const SearchContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams?.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const executeSearch = async () => {
      setLoading(true);
      try {
        const allArticles = await ArticlesService.getArticles();
        if (!initialQuery.trim()) {
          // If no query, show all articles sorted by recent
          setResults(allArticles);
          return;
        }
        
        const filterTerm = initialQuery.toLowerCase().trim();
        const filtered = allArticles.filter(item => 
          item.title.toLowerCase().includes(filterTerm) || 
          item.excerpt.toLowerCase().includes(filterTerm) || 
          item.body.some(para => para.toLowerCase().includes(filterTerm)) ||
          item.category.toLowerCase().includes(filterTerm)
        );
        setResults(filtered);
      } catch (err) {
        console.error('Failed to query articles:', err);
      } finally {
        setLoading(false);
      }
    };
    executeSearch();
  }, [initialQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div style={{ padding: '2rem 0', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--foreground)' }}>Search Iconic GH</h1>
        <p style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>Search our archives for breaking news, stories, and investigative reports.</p>
      </header>

      {/* High-fidelity interactive Search Box */}
      <form onSubmit={handleSearchSubmit} style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        backgroundColor: 'var(--secondary)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '0.5rem 1rem',
        marginBottom: '3rem',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <SearchIcon size={20} style={{ color: 'var(--muted)' }} />
        <input 
          type="text" 
          placeholder="Type query terms (e.g. AI, climate, interest rates)..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            border: 'none',
            backgroundColor: 'transparent',
            color: 'var(--foreground)',
            padding: '0.5rem 0',
            fontSize: '1rem',
            outline: 'none'
          }}
        />
        <button type="submit" style={{
          backgroundColor: 'var(--primary)',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1.25rem',
          borderRadius: '6px',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}>
          Search
        </button>
      </form>

      {/* Search Results Summary */}
      <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
        {initialQuery.trim() ? (
          <span>Found {results.length} results for &ldquo;<strong>{initialQuery}</strong>&rdquo;</span>
        ) : (
          <span>Browsing all matching stories ({results.length})</span>
        )}
      </div>

      {/* Search Results Feed */}
      <div>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>
            Searching database records...
          </div>
        ) : results.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--muted)', border: '1px dashed var(--border)', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontWeight: 600 }}>No results matched your search terms.</p>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem' }}>Try different query terms or check the spelling.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {results.map((item) => (
              <ArticleCard key={item.id} article={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const Search = () => {
  return (
    <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center', color: 'var(--muted)' }}>Loading search panel...</div>}>
      <SearchContent />
    </Suspense>
  );
};

export default Search;
