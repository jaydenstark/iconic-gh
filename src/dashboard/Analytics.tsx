/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Eye, FileText, TrendingUp, TrendingDown,
  Compass, DollarSign, Activity, BarChart2, Globe, Users,
  CheckCircle, AlertCircle, Sparkles, Send, RefreshCw, Layers
} from 'lucide-react';
import { Article, ArticlesService } from '@/services/articles';
import { useAuth } from '@/hooks/useAuth';
import styles from './Analytics.module.css';

interface AnalyticsProps {
  posts: Article[];
  simulatedRole: string;
  isPushSubscribed: boolean;
  onRoleChange: (role: any) => void;
}

export const Analytics: React.FC<AnalyticsProps> = ({
  posts,
  simulatedRole,
  isPushSubscribed: _isPushSubscribed,
  onRoleChange,
}) => {
  const [activeSubtab, setActiveSubtab] = useState<string>('overview');

  // Chatbot states
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { 
      sender: 'ai', 
      text: "Good morning! I am your AI Growth Assistant. I analyze your traffic patterns, SEO parameters, and revenue daily. Ask me anything, or select one of the morning review questions below:" 
    }
  ]);

  // Outline generator states
  const [outlineTopic, setOutlineTopic] = useState('');
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [generatedOutline, setGeneratedOutline] = useState('');

  // Sorting Content Table
  const [sortField, setSortField] = useState<'views' | 'time' | 'seo' | 'revenue'>('views');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  if (simulatedRole === 'visitor') {
    return (
      <div style={{
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: '16px',
        padding: '3rem',
        textAlign: 'center',
        boxShadow: 'var(--shadow-md)',
        maxWidth: '700px',
        margin: '2rem auto'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
          color: 'var(--primary)',
          marginBottom: '1.5rem'
        }}>
          <Eye size={40} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>Welcome to the Admin Console</h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
          You are currently simulating the <strong>Visitor (Public Reader)</strong> identity. In production, readers do not have access to administrative dashboards. Use the switcher dropdown above to toggle between operational roles (e.g. Super Admin or Editor) to explore the AI control panels.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/" style={{
            background: 'var(--primary)',
            color: 'white',
            padding: '0.8rem 1.8rem',
            borderRadius: '8px',
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '0.9rem',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
          }}>
            Return to Homepage
          </Link>
          <button 
            onClick={() => onRoleChange('super_admin')}
            style={{
              background: 'var(--secondary)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
              padding: '0.8rem 1.8rem',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Simulate Admin Role
          </button>
        </div>
      </div>
    );
  }

  // Predefined Chat Answers
  const CHAT_ANSWERS: Record<string, string> = {
    revenue: `Yesterday's top-earning articles and revenue breakdown:
1. **"Ghana Parliament Passes Historic Digital Economy Bill"** - GH₵ 142.50 (High CTR AdSense + Affiliate signup links)
2. **"Accra Stock Exchange Records Strongest Quarter in Five Years"** - GH₵ 95.00 (Direct Sponsor banner slot clicks)
3. **"Kumasi Becomes West Africa's Fastest Growing Tech Hub"** - GH₵ 74.20 (Newsletter referral conversion fees)

*Analysis*: Technology and Finance categories continue to yield 2.4x higher CPM than general politics news.`,

    trending: `Top Ghanaian and African trends not yet covered on your site:
1. **"Akosombo Dam Spillage Relief Funds Details"** (Trending Index: 94/100) - Gaps found: Competitors cover distribution disputes but omit details on specific allocations.
2. **"Ghanaian Cedis Stability Interventions by Bank of Ghana"** (Trending Index: 88/100) - Gaps found: Lacks a step-by-step explainer for SMEs.
3. **"West African Power Pool Grid Commissioning"** (Trending Index: 82/100) - Gaps found: Infrastructure impact on manufacturing costs.

*Action*: Go to the 'AI Content' tab, enter one of these topics, and click 'Generate Outline' to create outlines instantly.`,

    seo: `Articles requiring immediate search engine optimizations:
- **"Black Stars Coach Names Squad for AFCON Qualifier"** (SEO Score: 55/100)
  *Fixes*: Add ALT tags to the 3 main photos. Expand the meta description from 80 to 155 characters.
- **"African Union Summit Backs Free Trade Agreement"** (SEO Score: 68/100)
  *Fixes*: Insert at least 2 internal links pointing to related 'Africa Business' articles. Raise keyword density for "Free Trade" to 1.8%.`,

    time: `Optimal publishing times calculated for today, July 14, 2026:
- **11:30 AM GMT**: Best for Business/Politics (aligns with corporate mid-day traffic spikes).
- **5:45 PM GMT**: Best for Tech/Sports (catches users during their evening transit).
- **Push Alerts Schedule**: Recommend sending push alerts at **1:15 PM GMT** (historic open rates show spikes to 24.2%).`,

    traffic: `Audience acquisition channel overview:
- **WhatsApp Channels & Groups**: +18.4% growth week-over-week. Holds an average session reading time of 4m 12s.
- **Google Organic Search**: +8.2% growth. Main keywords: "Ghana digital economy bill" and "Accra stocks".
- **Facebook Referrals**: -14.2% drop due to recent algorithm alterations limiting news link distributions.

*Strategic recommendation*: Allocate more resources to WhatsApp newsletter triggers and search keywords, and deprioritize organic social shares.`,

    advertiser: `Direct advertising and monetization recommendations:
- **Category: Technology** (Average CTR: 4.8%) -> Approach local fintechs like **Hubtel** or **ExpressPay** for home section sponsorship.
- **Category: Business/Finance** (CPM: GH₵ 8.50) -> Approach financial institutions like **GCB Bank** or **EcoBank** to sponsor your newsletter's weekly financial brief.`
  };

  const handleSuggestionClick = (key: string, label: string) => {
    const userMsg = { sender: 'user' as const, text: label };
    const aiMsg = { sender: 'ai' as const, text: CHAT_ANSWERS[key] || "I am analyzing that metric now..." };
    setChatMessages(prev => [...prev, userMsg, aiMsg]);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const userMsg = { sender: 'user' as const, text: userText };
    setChatInput('');

    let aiResponse = "I can help you review your site metrics. Try asking about 'revenue', 'trends', 'SEO updates', 'traffic growth', or 'advertiser matches'.";
    const lower = userText.toLowerCase();

    if (lower.includes('revenue') || lower.includes('earn') || lower.includes('money')) {
      aiResponse = CHAT_ANSWERS.revenue;
    } else if (lower.includes('trend') || lower.includes('cover') || lower.includes('topic')) {
      aiResponse = CHAT_ANSWERS.trending;
    } else if (lower.includes('seo') || lower.includes('audit') || lower.includes('score')) {
      aiResponse = CHAT_ANSWERS.seo;
    } else if (lower.includes('time') || lower.includes('publish') || lower.includes('schedule')) {
      aiResponse = CHAT_ANSWERS.time;
    } else if (lower.includes('traffic') || lower.includes('source') || lower.includes('visitor')) {
      aiResponse = CHAT_ANSWERS.traffic;
    } else if (lower.includes('advertiser') || lower.includes('sponsor') || lower.includes('ad')) {
      aiResponse = CHAT_ANSWERS.advertiser;
    }

    setChatMessages(prev => [...prev, userMsg, { sender: 'ai' as const, text: aiResponse }]);
  };

  // Generate Outline Simulation
  const handleGenerateOutline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!outlineTopic.trim()) return;

    setIsGeneratingOutline(true);
    setGeneratedOutline('');

    setTimeout(() => {
      setIsGeneratingOutline(false);
      setGeneratedOutline(`ARTICLE OUTLINE: ${outlineTopic.toUpperCase()}
--------------------------------------------------
Target Word Count: 1,200 words
Recommended Editor: AI Assisted (Editor Review)
Primary Focus Keyword: ${outlineTopic.toLowerCase()}
Secondary Keywords: ghana updates, african growth, analytics forecast

[SECTION 1: INTRODUCTION & CONTEXT] (250 words)
- Hook: The current economic/political impact of the event.
- Core stats: Reference today's trending indicators.
- Thesis: Why this issue matters now for Ghanaian readers.

[SECTION 2: CHRONOLOGY & DEVELOPMENT] (350 words)
- Background details of the story.
- Key figures involved (Government officials, local leaders, developers).
- Timeline of events leading to today's announcement.

[SECTION 3: STATISTICAL FORECAST & ANALYSIS] (400 words)
- Comparative analysis: How this matches similar shifts in neighboring regions.
- Economic/Social implications (Cost increases, industry adjustments).
- Gaps in current coverage (unanswered questions from other outlets).

[SECTION 4: CONCLUSION & RECOMMENDATIONS] (200 words)
- Summary of primary points.
- Actionable advice for stakeholders.
- Reader prompt: Call-to-action for comments and sharing.

--------------------------------------------------
RECOMMENDED TAGS: Ghana, Development, Insights, Trending`);
    }, 1200);
  };

  // Article performance helpers
  const getArticleMetrics = (post: Article) => {
    // Generate realistic, consistent metrics based on post title length
    const scoreSeed = post.title.length;
    const views = post.views || 100;
    const readingTime = `${(scoreSeed % 4) + 2}m ${(scoreSeed * 7) % 60}s`;
    const scrollDepth = `${80 - (scoreSeed % 25)}%`;
    const shares = Math.ceil(views * 0.05);
    const commentsCount = Math.ceil(views * 0.015);
    const bounceRate = `${45 + (scoreSeed % 15)}%`;
    const seoScore = 100 - (scoreSeed % 35);
    const revenue = `GH₵ ${(views * 0.08 * 15).toFixed(2)}`;

    return {
      title: post.title,
      category: post.category,
      views,
      readingTime,
      scrollDepth,
      shares,
      comments: commentsCount,
      bounceRate,
      seoScore,
      revenueNumeric: views * 0.08 * 15,
      revenue
    };
  };

  const articleRows = posts.map(post => getArticleMetrics(post));

  // Sort function
  const handleSort = (field: 'views' | 'time' | 'seo' | 'revenue') => {
    const isAsc = sortField === field && sortOrder === 'desc';
    setSortField(field);
    setSortOrder(isAsc ? 'asc' : 'desc');
  };

  const sortedRows = [...articleRows].sort((a, b) => {
    let valA: any = 0;
    let valB: any = 0;

    if (sortField === 'views') {
      valA = a.views;
      valB = b.views;
    } else if (sortField === 'seo') {
      valA = a.seoScore;
      valB = b.seoScore;
    } else if (sortField === 'revenue') {
      valA = a.revenueNumeric;
      valB = b.revenueNumeric;
    } else if (sortField === 'time') {
      valA = parseFloat(a.readingTime);
      valB = parseFloat(b.readingTime);
    }

    if (sortOrder === 'asc') {
      return valA > valB ? 1 : -1;
    } else {
      return valA < valB ? 1 : -1;
    }
  });

  return (
    <div className={styles.container}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={24} style={{ color: 'var(--primary)' }} /> AI Growth Dashboard
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: '0.2rem 0 0' }}>
          Interactive business control center analyzing site performance, search visibility, and revenue drivers.
        </p>
      </div>

      {/* Sub-tab navigation */}
      <div className={styles.subtabs}>
        <button className={`${styles.subtabButton} ${activeSubtab === 'overview' ? styles.subtabButtonActive : ''}`} onClick={() => setActiveSubtab('overview')}>Overview</button>
        <button className={`${styles.subtabButton} ${activeSubtab === 'traffic' ? styles.subtabButtonActive : ''}`} onClick={() => setActiveSubtab('traffic')}>Traffic & Sources</button>
        <button className={`${styles.subtabButton} ${activeSubtab === 'content' ? styles.subtabButtonActive : ''}`} onClick={() => setActiveSubtab('content')}>Content Performance</button>
        <button className={`${styles.subtabButton} ${activeSubtab === 'ai-intel' ? styles.subtabButtonActive : ''}`} onClick={() => setActiveSubtab('ai-intel')}>AI Intelligence</button>
        <button className={`${styles.subtabButton} ${activeSubtab === 'revenue' ? styles.subtabButtonActive : ''}`} onClick={() => setActiveSubtab('revenue')}>Revenue & Ads</button>
        <button className={`${styles.subtabButton} ${activeSubtab === 'growth' ? styles.subtabButtonActive : ''}`} onClick={() => setActiveSubtab('growth')}>Audience Growth</button>
        <button className={`${styles.subtabButton} ${activeSubtab === 'seo' ? styles.subtabButtonActive : ''}`} onClick={() => setActiveSubtab('seo')}>SEO Audit</button>
        <button className={`${styles.subtabButton} ${activeSubtab === 'competitors' ? styles.subtabButtonActive : ''}`} onClick={() => setActiveSubtab('competitors')}>Competitors</button>
        <button className={`${styles.subtabButton} ${activeSubtab === 'editorial' ? styles.subtabButtonActive : ''}`} onClick={() => setActiveSubtab('editorial')}>Editorial Newsroom</button>
        <button className={`${styles.subtabButton} ${activeSubtab === 'assistant' ? styles.subtabButtonActive : ''}`} onClick={() => setActiveSubtab('assistant')}>🤖 AI Growth Assistant</button>
      </div>

      <div className={styles.panelContent}>

        {/* 1. OVERVIEW TAB */}
        {activeSubtab === 'overview' && (
          <div>
            <div className={styles.kpiGrid}>
              <div className={styles.kpiCard}>
                <div className={styles.kpiHeader}>
                  <span className={styles.kpiLabel}>{"Today's Visitors"}</span>
                  <TrendingUp size={16} className={styles.changePositive} />
                </div>
                <span className={styles.kpiValue}>4,728</span>
                <span className={`${styles.kpiChange} ${styles.changePositive}`}>+8.4% vs yesterday</span>
              </div>
              <div className={styles.kpiCard}>
                <div className={styles.kpiHeader}>
                  <span className={styles.kpiLabel}>Active Users</span>
                  <Activity size={16} style={{ color: 'var(--primary)', animation: 'pulse 1.5s infinite' }} />
                </div>
                <span className={styles.kpiValue}>142</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Real-time reading pages</span>
              </div>
              <div className={styles.kpiCard}>
                <div className={styles.kpiHeader}>
                  <span className={styles.kpiLabel}>Revenue Today</span>
                  <DollarSign size={16} className={styles.changePositive} />
                </div>
                <span className={styles.kpiValue}>GH₵ 19,267.50</span>
                <span className={`${styles.kpiChange} ${styles.changePositive}`}>+12.6% vs yesterday</span>
              </div>
              <div className={styles.kpiCard}>
                <div className={styles.kpiHeader}>
                  <span className={styles.kpiLabel}>Average reading time</span>
                  <BarChart2 size={16} className={styles.changePositive} />
                </div>
                <span className={styles.kpiValue}>3m 42s</span>
                <span className={`${styles.kpiChange} ${styles.changePositive}`}>+14s increase</span>
              </div>
              <div className={styles.kpiCard}>
                <div className={styles.kpiHeader}>
                  <span className={styles.kpiLabel}>Bounce Rate</span>
                  <TrendingDown size={16} className={styles.changePositive} />
                </div>
                <span className={styles.kpiValue}>41.2%</span>
                <span className={`${styles.kpiChange} ${styles.changePositive}`}>-2.1% drop (Good)</span>
              </div>
            </div>

            <div className={styles.dashboardGrid}>
              <div className={styles.card}>
                <h3 className={styles.cardTitle}><Activity size={18} /> Real-Time Traffic Wave</h3>
                {/* SVG Line Graph */}
                <svg viewBox="0 0 500 150" className={styles.svgChart}>
                  <defs>
                    <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M 0 120 Q 50 80 100 90 T 200 40 T 300 70 T 400 30 T 500 50 L 500 150 L 0 150 Z" fill="url(#waveGrad)" />
                  <path d="M 0 120 Q 50 80 100 90 T 200 40 T 300 70 T 400 30 T 500 50" fill="none" stroke="var(--primary)" strokeWidth="3" className={styles.chartPath} />
                  <circle cx="200" cy="40" r="5" fill="var(--accent)" />
                  <text x="210" y="35" fontSize="10" fill="var(--foreground)" fontWeight="700">Peak spike: 182 users</text>
                </svg>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
                  <span>08:00 GMT</span>
                  <span>10:00 GMT</span>
                  <span>12:00 GMT</span>
                  <span>14:00 GMT</span>
                  <span>16:00 GMT</span>
                  <span>18:00 GMT</span>
                </div>
              </div>

              <div className={styles.card}>
                <h3 className={styles.cardTitle}><Compass size={18} /> Quick Monetization Opportunities</h3>
                <div className={styles.list}>
                  <div className={styles.listItem}>
                    <div className={styles.listItemText}>
                      <span className={styles.listItemTitle}>Tech Sponsorship Openings</span>
                      <span className={styles.listItemMeta}>Avg CTR: 4.8% on Technology articles</span>
                    </div>
                    <span className={`${styles.listItemValue} ${styles.changePositive}`}>High Match</span>
                  </div>
                  <div className={styles.listItem}>
                    <div className={styles.listItemText}>
                      <span className={styles.listItemTitle}>Affiliate Product Placements</span>
                      <span className={styles.listItemMeta}>Suit {"\"SaaS Platforms\""} inside Business section</span>
                    </div>
                    <span className={`${styles.listItemValue} ${styles.changePositive}`}>Recommend</span>
                  </div>
                  <div className={styles.listItem}>
                    <div className={styles.listItemText}>
                      <span className={styles.listItemTitle}>Push Notification Alert</span>
                      <span className={styles.listItemMeta}>Best schedule time: 13:15 GMT</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. TRAFFIC & SOURCES TAB */}
        {activeSubtab === 'traffic' && (
          <div className={styles.dashboardGrid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}><Globe size={18} /> Traffic Channel & Source Distribution</h3>
              <div className={styles.list}>
                <div style={{ margin: '1rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    <span>Google Organic Search</span>
                    <span>42%</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '42%', height: '100%', background: 'var(--primary)', borderRadius: '4px' }}></div>
                  </div>
                </div>
                <div style={{ margin: '1rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    <span>Direct Site Navigation</span>
                    <span>21%</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '21%', height: '100%', background: 'var(--accent)', borderRadius: '4px' }}></div>
                  </div>
                </div>
                <div style={{ margin: '1rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    <span>WhatsApp Shares & Channels</span>
                    <span>16%</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '16%', height: '100%', background: '#10b981', borderRadius: '4px' }}></div>
                  </div>
                </div>
                <div style={{ margin: '1rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    <span>Facebook Pages</span>
                    <span>11%</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '11%', height: '100%', background: '#1877f2', borderRadius: '4px' }}></div>
                  </div>
                </div>
                <div style={{ margin: '1rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    <span>X (Twitter) Feed</span>
                    <span>6%</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '6%', height: '100%', background: '#000000', borderRadius: '4px' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}><Users size={18} /> Geography & Device Breakdown</h3>
              <div className={styles.list}>
                <div className={styles.listItem}>
                  <span className={styles.listItemTitle}>🇬🇭 Ghana (Accra & Kumasi)</span>
                  <span className={styles.listItemValue}>72.4%</span>
                </div>
                <div className={styles.listItem}>
                  <span className={styles.listItemTitle}>🇺🇸 United States</span>
                  <span className={styles.listItemValue}>9.8%</span>
                </div>
                <div className={styles.listItem}>
                  <span className={styles.listItemTitle}>🇬🇧 United Kingdom</span>
                  <span className={styles.listItemValue}>6.1%</span>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                    <div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>64%</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Mobile</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>31%</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Desktop</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>5%</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Tablet</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. CONTENT PERFORMANCE TAB */}
        {activeSubtab === 'content' && (
          <div className={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 className={styles.cardTitle} style={{ margin: 0 }}><FileText size={18} /> Content Metrics & ROI Analysis</h3>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem' }}>
                <span style={{ alignSelf: 'center', fontWeight: 700, color: 'var(--muted)' }}>Sort by:</span>
                <button className={styles.subtabButton} style={{ padding: '0.3rem 0.6rem' }} onClick={() => handleSort('views')}>Views</button>
                <button className={styles.subtabButton} style={{ padding: '0.3rem 0.6rem' }} onClick={() => handleSort('seo')}>SEO Score</button>
                <button className={styles.subtabButton} style={{ padding: '0.3rem 0.6rem' }} onClick={() => handleSort('revenue')}>Revenue</button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem' }}>Headline</th>
                    <th style={{ padding: '0.75rem' }}>Category</th>
                    <th style={{ padding: '0.75rem' }}>Views</th>
                    <th style={{ padding: '0.75rem' }}>Reading Time</th>
                    <th style={{ padding: '0.75rem' }}>Scroll Depth</th>
                    <th style={{ padding: '0.75rem' }}>Bounce</th>
                    <th style={{ padding: '0.75rem' }}>SEO Score</th>
                    <th style={{ padding: '0.75rem' }}>Est. Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRows.map((row, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid var(--border)', background: index % 2 === 0 ? 'transparent' : 'rgba(99, 102, 241, 0.02)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600, maxWidth: '280px' }}>{row.title}</td>
                      <td style={{ padding: '0.75rem' }}>{row.category}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 700 }}>{row.views.toLocaleString()}</td>
                      <td style={{ padding: '0.75rem' }}>{row.readingTime}</td>
                      <td style={{ padding: '0.75rem' }}>{row.scrollDepth}</td>
                      <td style={{ padding: '0.75rem' }}>{row.bounceRate}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 700, color: row.seoScore > 80 ? '#10b981' : row.seoScore > 65 ? 'var(--primary)' : '#f43f5e' }}>{row.seoScore}/100</td>
                      <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>{row.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. AI CONTENT INTELLIGENCE TAB */}
        {activeSubtab === 'ai-intel' && (
          <div className={styles.dashboardGrid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}><Sparkles size={18} style={{ color: 'var(--primary)' }} /> AI Story Outline Draft Engine</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '-1rem', marginBottom: '1.5rem' }}>
                Enter a topic or selected coverage gap keyword to dynamically draft a structured story outline for editorial review.
              </p>

              <form onSubmit={handleGenerateOutline} className={styles.generatorCard}>
                <input 
                  type="text" 
                  placeholder="e.g. Akosombo Dam relief distribution controversy" 
                  value={outlineTopic}
                  onChange={(e) => setOutlineTopic(e.target.value)}
                  className={styles.generatorInput}
                  required
                />
                <button type="submit" className={styles.generatorButton} disabled={isGeneratingOutline}>
                  {isGeneratingOutline ? (
                    <>
                      <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> Drafting Outline...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} /> Generate Story Outline
                    </>
                  )}
                </button>
              </form>

              {generatedOutline && (
                <pre className={styles.outlineOutput} style={{ marginTop: '1.5rem' }}>
                  {generatedOutline}
                </pre>
              )}
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}><Compass size={18} /> Coverage Gaps & Trends</h3>
              <div className={styles.list}>
                <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{"🇬🇭 Trending in Ghana"}</span>
                    <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>High Search</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--secondary-foreground)' }}>
                    {"\"Digital Economy tax thresholds\", \"Cedi exchange rate solutions\", \"Akosombo relief funds\"."}
                  </p>
                </div>

                <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>🌍 Trending in Africa</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>Rising</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--secondary-foreground)' }}>
                    {"\"AfCFTA border policy integration\", \"Kenya fintech corridor\", \"African Union space agency plans\"."}
                  </p>
                </div>

                <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>💻 Global Tech Trends</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>Stable</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--secondary-foreground)' }}>
                    {"\"Gemini AI search priority\", \"Next.js Turbopack benchmarks\", \"Headless Shopify ROI metrics\"."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. REVENUE & ADS TAB */}
        {activeSubtab === 'revenue' && (
          <div className={styles.dashboardGrid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}><DollarSign size={18} /> Monetization Channel Breakdowns</h3>
              <div className={styles.list}>
                <div className={styles.listItem}>
                  <div className={styles.listItemText}>
                    <span className={styles.listItemTitle}>Google AdSense</span>
                    <span className={styles.listItemMeta}>Programmatic display banner blocks</span>
                  </div>
                  <span className={styles.listItemValue}>GH₵ 8,763.00 (45.5%)</span>
                </div>
                <div className={styles.listItem}>
                  <div className={styles.listItemText}>
                    <span className={styles.listItemTitle}>Direct Sponsor Campaigns</span>
                    <span className={styles.listItemMeta}>Fixed-fee home custom header banners</span>
                  </div>
                  <span className={styles.listItemValue}>GH₵ 5,250.00 (27.2%)</span>
                </div>
                <div className={styles.listItem}>
                  <div className={styles.listItemText}>
                    <span className={styles.listItemTitle}>Sponsored Articles</span>
                    <span className={styles.listItemMeta}>Paid guest columns from local businesses</span>
                  </div>
                  <span className={styles.listItemValue}>GH₵ 3,750.00 (19.5%)</span>
                </div>
                <div className={styles.listItem}>
                  <div className={styles.listItemText}>
                    <span className={styles.listItemTitle}>Affiliate Links</span>
                    <span className={styles.listItemMeta}>SaaS software recommendation triggers</span>
                  </div>
                  <span className={styles.listItemValue}>GH₵ 1,504.50 (7.8%)</span>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}><Activity size={18} /> Revenue Flow Analysis</h3>
              <div className={styles.list}>
                <div className={styles.listItem}>
                  <span className={styles.listItemTitle}>Revenue Today</span>
                  <span className={styles.listItemValue} style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>GH₵ 19,267.50</span>
                </div>
                <div className={styles.listItem}>
                  <span className={styles.listItemTitle}>Revenue Yesterday</span>
                  <span className={styles.listItemValue}>GH₵ 17,100.00</span>
                </div>
                <div className={styles.listItem}>
                  <span className={styles.listItemTitle}>Revenue This Month</span>
                  <span className={styles.listItemValue} style={{ fontWeight: 800 }}>GH₵ 222,300.00</span>
                </div>
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981', marginBottom: '0.2rem' }}>ROI Forecast</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--secondary-foreground)', lineHeight: '1.4' }}>
                    {"Based on current traffic acceleration and sponsor contracts, monthly revenue is projected to hit **GH₵ 486,000** (+18.4% above target)."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. AUDIENCE GROWTH TAB */}
        {activeSubtab === 'growth' && (
          <div className={styles.dashboardGrid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}><Users size={18} /> Audience Growth Metrics</h3>
              <div className={styles.list}>
                <div className={styles.listItem}>
                  <div className={styles.listItemText}>
                    <span className={styles.listItemTitle}>Newsletter Subscribers</span>
                    <span className={styles.listItemMeta}>Opt-in email briefs</span>
                  </div>
                  <span className={styles.listItemValue}>12,492 (+1.5% weekly)</span>
                </div>
                <div className={styles.listItem}>
                  <div className={styles.listItemText}>
                    <span className={styles.listItemTitle}>Email Open Rate</span>
                    <span className={styles.listItemMeta}>Industry benchmark average: 22%</span>
                  </div>
                  <span className={styles.listItemValue} style={{ color: '#10b981', fontWeight: 800 }}>38.2% (High)</span>
                </div>
                <div className={styles.listItem}>
                  <div className={styles.listItemText}>
                    <span className={styles.listItemTitle}>Push Notification CTR</span>
                    <span className={styles.listItemMeta}>Click-through rate of desktop notifications</span>
                  </div>
                  <span className={styles.listItemValue}>8.4%</span>
                </div>
                <div className={styles.listItem}>
                  <div className={styles.listItemText}>
                    <span className={styles.listItemTitle}>Returning Visitors Ratio</span>
                    <span className={styles.listItemMeta}>Shows long-term reader trust and engagement</span>
                  </div>
                  <span className={styles.listItemValue}>58.2%</span>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}><TrendingUp size={18} /> Social & Authority Stats</h3>
              <div className={styles.list}>
                <div className={styles.listItem}>
                  <span className={styles.listItemTitle}>Google Rankings (Top 3 Keywords)</span>
                  <span className={`${styles.listItemValue} ${styles.changePositive}`}>18 keywords</span>
                </div>
                <div className={styles.listItem}>
                  <span className={styles.listItemTitle}>Active Backlinks (Referrers)</span>
                  <span className={styles.listItemValue}>1,482 domains</span>
                </div>
                <div className={styles.listItem}>
                  <span className={styles.listItemTitle}>Domain Authority (Estimated)</span>
                  <span className={styles.listItemValue} style={{ color: 'var(--primary)' }}>38 / 100</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. SEO DASHBOARD TAB */}
        {activeSubtab === 'seo' && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}><CheckCircle size={18} /> Automated Site SEO & Readability Audits</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '-1rem', marginBottom: '1.5rem' }}>
              Real-time structural scanning of article metadata to spot keyword densities, missing assets, and broken URL configurations.
            </p>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{ padding: '1.25rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--secondary)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <AlertCircle size={28} style={{ color: '#f43f5e', flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.9rem', fontWeight: 700 }}>Missing Image ALT Attributes</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)' }}>
                    {"Article \"Black Stars Coach Names Squad...\" has 3 custom images lacking alt tags, affecting Google Image search indexation."}
                  </p>
                </div>
              </div>
              <div style={{ padding: '1.25rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--secondary)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <AlertCircle size={28} style={{ color: '#eab308', flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.9rem', fontWeight: 700 }}>Missing Internal Context Links</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)' }}>
                    {"Article \"African Union Summit Backs Free Trade...\" has 0 anchor links connecting back to category tags or archived articles."}
                  </p>
                </div>
              </div>
              <div style={{ padding: '1.25rem', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--secondary)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <CheckCircle size={28} style={{ color: '#10b981', flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.9rem', fontWeight: 700 }}>Meta Description Length Compliance</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)' }}>
                    92% of recently published articles meet the standard 120-160 character meta description length recommendation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 8. COMPETITOR MONITOR TAB */}
        {activeSubtab === 'competitors' && (
          <div className={styles.dashboardGrid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}><Globe size={18} /> Head-to-Head Competitor Metrics</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                      <th style={{ padding: '0.75rem' }}>Competitor Portal</th>
                      <th style={{ padding: '0.75rem' }}>Est. Daily Traffic</th>
                      <th style={{ padding: '0.75rem' }}>Daily Articles Count</th>
                      <th style={{ padding: '0.75rem' }}>Social Engagement</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 700 }}>GhanaWeb</td>
                      <td style={{ padding: '0.75rem' }}>140,000</td>
                      <td style={{ padding: '0.75rem' }}>45 posts/day</td>
                      <td style={{ padding: '0.75rem', color: '#10b981', fontWeight: 700 }}>High</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 700 }}>MyJoyOnline</td>
                      <td style={{ padding: '0.75rem' }}>95,000</td>
                      <td style={{ padding: '0.75rem' }}>32 posts/day</td>
                      <td style={{ padding: '0.75rem', color: '#10b981', fontWeight: 700 }}>Medium-High</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(99, 102, 241, 0.05)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>ICONIC GH (Us)</td>
                      <td style={{ padding: '0.75rem', fontWeight: 700 }}>24,700</td>
                      <td style={{ padding: '0.75rem' }}>6 posts/day</td>
                      <td style={{ padding: '0.75rem', color: '#10b981', fontWeight: 700 }}>Very High (CTR: 3.8%)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}><Activity size={18} /> Coverage Overlap Checks</h3>
              <div className={styles.list}>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                  We scan competitor RSS feeds every 30 minutes to detect stories they have covered but we have omitted, giving us immediate options to publish.
                </p>
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--secondary)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>Competitor Trending (Last 2 Hours)</div>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8rem', color: 'var(--secondary-foreground)' }}>
                    <li style={{ marginBottom: '0.4rem' }}>{"*\"Trade ministry issues guidelines on imported retail items\"*"}</li>
                    <li>{"*\"Sports Authority outlines Accra Stadium renovation schedule\"*"}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 9. EDITORIAL NEWSROOM TAB */}
        {activeSubtab === 'editorial' && (
          <div className={styles.dashboardGrid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}><Layers size={18} /> Newsroom Queue</h3>
              <div className={styles.list}>
                <div className={styles.listItem}>
                  <div className={styles.listItemText}>
                    <span className={styles.listItemTitle}>Drafts Pending Edit</span>
                    <span className={styles.listItemMeta}>Waiting for editor review</span>
                  </div>
                  <span style={{ background: 'var(--border)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>4 posts</span>
                </div>
                <div className={styles.listItem}>
                  <div className={styles.listItemText}>
                    <span className={styles.listItemTitle}>Scheduled Publications</span>
                    <span className={styles.listItemMeta}>Set to deploy automatically today</span>
                  </div>
                  <span style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>2 posts</span>
                </div>
                <div className={styles.listItem}>
                  <div className={styles.listItemText}>
                    <span className={styles.listItemTitle}>Fact-Check Review Queue</span>
                    <span className={styles.listItemMeta}>Verify quotes and data checks</span>
                  </div>
                  <span style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>1 post</span>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}><CheckCircle size={18} /> Published Today</h3>
              <div className={styles.list}>
                <div className={styles.listItem}>
                  <span className={styles.listItemTitle} style={{ maxWidth: '240px' }}>{"\"Ghana Parliament Passes Digital Economy...\""}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Published 2h ago</span>
                </div>
                <div className={styles.listItem}>
                  <span className={styles.listItemTitle} style={{ maxWidth: '240px' }}>{"\"Accra Stock Exchange Records Strongest...\""}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Published 5h ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 10. AI GROWTH ASSISTANT TAB */}
        {activeSubtab === 'assistant' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className={styles.chatContainer}>
              <div className={styles.chatMessages}>
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`${styles.chatBubble} ${msg.sender === 'user' ? styles.bubbleUser : styles.bubbleAI}`}>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                  </div>
                ))}
              </div>

              {/* Suggestions Panel */}
              <div className={styles.chatSuggestions}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '0.2rem' }}>Quick Morning Review Questions:</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0.5rem' }}>
                  <button className={styles.suggestionButton} onClick={() => handleSuggestionClick('revenue', 'Which articles generated the most revenue yesterday?')}>
                    💰 Which articles generated the most revenue yesterday?
                  </button>
                  <button className={styles.suggestionButton} onClick={() => handleSuggestionClick('trending', 'Which stories are trending but not yet covered?')}>
                    📈 Which stories are trending but not yet covered?
                  </button>
                  <button className={styles.suggestionButton} onClick={() => handleSuggestionClick('seo', 'Which articles need SEO improvements?')}>
                    🔍 Which articles need SEO improvements?
                  </button>
                  <button className={styles.suggestionButton} onClick={() => handleSuggestionClick('time', 'What is the best time to publish today?')}>
                    ⏰ What is the best time to publish today?
                  </button>
                  <button className={styles.suggestionButton} onClick={() => handleSuggestionClick('traffic', 'Which traffic source is growing or declining?')}>
                    📊 Which traffic source is growing or declining?
                  </button>
                  <button className={styles.suggestionButton} onClick={() => handleSuggestionClick('advertiser', 'Which advertisers should be approached based on categories?')}>
                    🤝 Which advertisers should be approached?
                  </button>
                </div>
              </div>

              {/* Freeform input */}
              <form onSubmit={handleSendChat} className={styles.chatInputArea}>
                <input 
                  type="text" 
                  placeholder="Type a custom query (e.g., 'tell me about yesterday's revenue')..." 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className={styles.chatInput}
                />
                <button type="submit" className={styles.chatSendButton}>
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export const AnalyticsPanelWrapper: React.FC = () => {
  const { role, changeRole } = useAuth();
  const [posts, setPosts] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await ArticlesService.getArticles();
        setPosts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    Promise.resolve().then(() => {
      loadPosts();
    });
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>Loading analytics...</div>;
  }

  return (
    <Analytics 
      posts={posts}
      simulatedRole={role}
      isPushSubscribed={true}
      onRoleChange={changeRole}
    />
  );
};

export default AnalyticsPanelWrapper;
