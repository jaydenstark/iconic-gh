'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Loader } from 'lucide-react';
import { AIService } from '@/services/ai';
import { ArticlesService } from '@/services/articles';

interface AISummaryProps {
  articleId: string;
  articleTitle: string;
  articleBody: string[];
  initialSummary?: string;
}

export const AISummary = ({ articleId, articleTitle, articleBody, initialSummary }: AISummaryProps) => {
  const [summary, setSummary] = useState(initialSummary || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [displayedText, setDisplayedText] = useState('');

  // Typing effect when summary is loaded or generated
  useEffect(() => {
    if (!summary || !isOpen) {
      Promise.resolve().then(() => {
        setDisplayedText(summary);
      });
      return;
    }

    let i = 0;
    Promise.resolve().then(() => {
      setDisplayedText('');
    });
    const timer = setInterval(() => {
      setDisplayedText((prev) => prev + summary.charAt(i));
      i++;
      if (i >= summary.length) {
        clearInterval(timer);
      }
    }, 15); // Quick typing speed

    return () => clearInterval(timer);
  }, [summary, isOpen]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const generated = await AIService.summarizeArticle(articleTitle, articleBody);
      setSummary(generated);
      
      // Persist the generated summary in our local database
      await ArticlesService.updateArticle(articleId, { summary: generated });
    } catch (e) {
      console.error('AI summary generation failed:', e);
      setSummary('Failed to generate summary. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div 
      className="glass" 
      style={{
        margin: '1.5rem 0',
        padding: '1.25rem',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(255, 255, 255, 0.03)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        overflow: 'hidden'
      }}
    >
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ff2a5f', fontWeight: 700 }}>
          <Sparkles size={18} className="shimmer-icon" />
          <span style={{ fontSize: '0.95rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            AI Key Takeaways
          </span>
        </div>
        <button 
          style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          aria-label={isOpen ? 'Collapse AI Summary' : 'Expand AI Summary'}
        >
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {isOpen && (
        <div style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--foreground)', transition: 'all 0.3s ease' }}>
          {summary ? (
            <p style={{ margin: 0, fontWeight: 500 }}>{displayedText}</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
              <p style={{ margin: 0, color: 'var(--muted)' }}>
                No summary generated yet. Generate instant, AI-powered key highlights of this story using Google Gemini.
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); handleGenerate(); }}
                disabled={isGenerating}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#fff',
                  background: 'linear-gradient(135deg, #ff2a5f 0%, #ff7e40 100%)',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(255, 42, 95, 0.3)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {isGenerating ? (
                  <>
                    <Loader size={16} className="animate-spin" /> Analyzing Story...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> Generate AI Summary
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
      
      <style jsx global>{`
        @keyframes shimmer {
          0% { opacity: 0.7; }
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 0.7; }
        }
        .shimmer-icon {
          animation: shimmer 2s infinite ease-in-out;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};
