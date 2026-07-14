'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Code2, 
  Megaphone, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink
} from 'lucide-react';
import { ArticlesService, Article } from '@/services/articles';
import { NewsCard } from '@/components/NewsCard';
import styles from '@/components/CompanyHome.module.css';

export const CompanyHome = () => {
  // Blog articles preview state
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);

  // Cost estimator state
  const [projectScope, setProjectScope] = useState<number>(3); // 1-5 scale
  const [projectSize, setProjectSize] = useState<number>(10); // 5-50 scale (pages/features)
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['seo', 'ppc']);

  // Contact form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        const data = await ArticlesService.getArticles({ sortBy: 'recent', limit: 3 });
        setLatestArticles(data);
      } catch (e) {
        console.error('Failed to fetch articles for company home:', e);
      } finally {
        setArticlesLoading(false);
      }
    };
    fetchLatestArticles();
  }, []);

  // Estimator Calculations
  const getScopeDetails = (scope: number) => {
    switch (scope) {
      case 1: return { name: 'Simple Brand Site', baseCost: 22500, timeWeeks: 2 };
      case 2: return { name: 'E-commerce Store', baseCost: 52500, timeWeeks: 4 };
      case 3: return { name: 'Custom SaaS Platform', baseCost: 90000, timeWeeks: 8 };
      case 4: return { name: 'Enterprise Cloud System', baseCost: 180000, timeWeeks: 12 };
      case 5: return { name: 'AI-Integrated Application', baseCost: 270000, timeWeeks: 16 };
      default: return { name: 'Custom App', baseCost: 75000, timeWeeks: 6 };
    }
  };

  const scopeInfo = getScopeDetails(projectScope);
  const sizeCost = projectSize * 3750;
  const marketingRetainer = selectedChannels.length * 13500;
  
  const estimatedOneTimeCost = scopeInfo.baseCost + sizeCost;
  const estimatedMonthlyMarketing = marketingRetainer;
  const estimatedTimeWeeks = Math.ceil(scopeInfo.timeWeeks + (projectSize * 0.25));
  const estimatedLeads = Math.ceil(((estimatedMonthlyMarketing / 15) * 1.6) / 8);

  // Channel toggle helper
  const toggleChannel = (channel: string) => {
    if (selectedChannels.includes(channel)) {
      setSelectedChannels(selectedChannels.filter(c => c !== channel));
    } else {
      setSelectedChannels([...selectedChannels, channel]);
    }
  };

  // Dynamic deliverables checklist based on scope & marketing selection
  const getIncludedFeatures = (scope: number) => {
    const common = ['Fully Responsive Layouts', 'SEO-Optimized Codebase', 'Modern Accessibility compliance', 'Developer Handover & Docs'];
    switch (scope) {
      case 1: return [...common, 'Custom CSS Animations', 'Domain & Hosting Setup'];
      case 2: return [...common, 'Shopify/Stripe Payment Integration', 'Inventory Management Panel', 'Cart & Secure Checkout'];
      case 3: return [...common, 'Secure User Auth System', 'Dynamic PostgreSQL/Firebase Database', 'REST/GraphQL Custom APIs', 'Interactive Dashboards'];
      case 4: return [...common, 'High Availability Multi-zone Deployment', 'Advanced Cloud Monitoring (AWS/GCP)', 'Role-based Access Controls', 'Automated Daily Backups'];
      case 5: return [...common, 'Gemini/OpenAI Integration', 'Vector Database Search (Pinecone/pgvector)', 'Machine Learning Pipelines', 'Dynamic Model Retraining'];
      default: return common;
    }
  };

  const getMarketingDeliverables = (channels: string[]) => {
    const list: string[] = [];
    if (channels.includes('seo')) {
      list.push('Technical SEO Audit', 'Keyword Strategy Blueprint', 'High-quality Backlink Acquisition');
    }
    if (channels.includes('ppc')) {
      list.push('Campaign Strategy & Bidding Setup', 'Conversion-Optimized Landing Page Design', 'A/B Ad Testing');
    }
    if (channels.includes('content')) {
      list.push('High-Conversion Copywriting', 'Custom Blog & Social Posts', 'Interactive Content creation');
    }
    if (channels.includes('social')) {
      list.push('Custom Visual Assets & Branding', 'Community Engagement Moderation', 'Growth Performance Metrics');
    }
    return list;
  };

  // Form submit handler
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formName && formEmail && formMessage) {
      setFormSubmitted(true);
      setFormName('');
      setFormEmail('');
      setFormMessage('');
      setTimeout(() => {
        setFormSubmitted(false);
      }, 5000);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground} />
        <div className={styles.glowBlob1} />
        <div className={styles.glowBlob2} />
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <Sparkles size={14} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Code & Strategy Synergy
          </div>
          <h1 className={styles.title}>
            Transforming Ideas Into Digital Realities
          </h1>
          <p className={styles.subtitle}>
            We build state-of-the-art software applications and scale brands globally through data-driven digital marketing campaigns.
          </p>
          <div className={styles.ctaGroup}>
            <a href="#estimator" className={styles.btnPrimary}>
              Estimate Your Project <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
            </a>
            <a href="#services" className={styles.btnSecondary}>
              Explore Services
            </a>
          </div>
        </div>
      </section>

      {/* Brand Trust Logo Ticker */}
      <section className={styles.clientTickerSection}>
        <div className={styles.tickerWrapper}>
          <div className={styles.tickerTrack}>
            <span>Stripe</span>
            <span>Vercel</span>
            <span>AWS</span>
            <span>Shopify</span>
            <span>HubSpot</span>
            <span>Framer</span>
            <span>Supabase</span>
            <span>Stripe</span>
            <span>Vercel</span>
            <span>AWS</span>
            <span>Shopify</span>
            <span>HubSpot</span>
            <span>Framer</span>
            <span>Supabase</span>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Our Capabilities</h2>
          <p className={styles.sectionSubtitle}>
            We integrate engineering excellence with creative marketing tactics to solve complex growth challenges.
          </p>
        </div>

        <div className={styles.servicesGrid}>
          {/* Software Development Card */}
          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>
              <Code2 size={28} />
            </div>
            <h3 className={styles.serviceTitle}>Software Development</h3>
            <p className={styles.serviceText}>
              Bespoke engineering solutions tailored to your workflows. We write clean, scalable code deployment-ready for modern cloud architectures.
            </p>
            <ul className={styles.serviceList}>
              <li className={styles.serviceItem}><CheckCircle2 size={16} /> Web & Single Page App Development</li>
              <li className={styles.serviceItem}><CheckCircle2 size={16} /> iOS & Android Mobile Apps</li>
              <li className={styles.serviceItem}><CheckCircle2 size={16} /> Cloud Infrastructure (AWS / GCP / Firebase)</li>
              <li className={styles.serviceItem}><CheckCircle2 size={16} /> Custom AI & API Implementations</li>
            </ul>
          </div>

          {/* Digital Marketing Card */}
          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>
              <Megaphone size={28} />
            </div>
            <h3 className={styles.serviceTitle}>Digital Marketing</h3>
            <p className={styles.serviceText}>
              Accelerate your digital footprint. We design conversion-focused strategies that acquire and engage customers across every digital touchpoint.
            </p>
            <ul className={styles.serviceList}>
              <li className={styles.serviceItem}><CheckCircle2 size={16} /> SEO & Organic Search Growth</li>
              <li className={styles.serviceItem}><CheckCircle2 size={16} /> Pay-Per-Click Advertising (Google & Meta)</li>
              <li className={styles.serviceItem}><CheckCircle2 size={16} /> Data-Driven Content Strategy</li>
              <li className={styles.serviceItem}><CheckCircle2 size={16} /> Brand Positioning & Conversion Audits</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Interactive Project Estimator */}
      <section id="estimator" className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Project & ROI Cost Estimator</h2>
          <p className={styles.sectionSubtitle}>
            Get a real-time assessment of your software build timeline and digital marketing projection in seconds.
          </p>
        </div>

        <div className={styles.estimatorCard}>
          <div className={styles.estimatorLayout}>
            {/* Controls */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Configure Your Requirements</h3>
              
              <div className={styles.sliderGroup}>
                <label className={styles.sliderLabel}>
                  <span>Project Scope & Complexity</span>
                  <span className={styles.sliderValue}>{scopeInfo.name}</span>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={projectScope} 
                  onChange={(e) => setProjectScope(parseInt(e.target.value))}
                  className={styles.rangeInput}
                  style={{ '--value-percent': `${(projectScope - 1) / 4 * 100}%` } as React.CSSProperties}
                />
              </div>

              <div className={styles.sliderGroup}>
                <label className={styles.sliderLabel}>
                  <span>Screens / Primary Features</span>
                  <span className={styles.sliderValue}>{projectSize} Modules</span>
                </label>
                <input 
                  type="range" 
                  min="5" 
                  max="50" 
                  value={projectSize} 
                  onChange={(e) => setProjectSize(parseInt(e.target.value))}
                  className={styles.rangeInput}
                  style={{ '--value-percent': `${(projectSize - 5) / 45 * 100}%` } as React.CSSProperties}
                />
              </div>

              <div className={styles.sliderGroup}>
                <label className={styles.sliderLabel} style={{ marginBottom: '0.5rem' }}>
                  <span>Marketing Retainer Channels</span>
                </label>
                <div className={styles.channelsGrid}>
                  <div 
                    className={`${styles.channelCheckbox} ${selectedChannels.includes('seo') ? styles.channelCheckboxActive : ''}`}
                    onClick={() => toggleChannel('seo')}
                  >
                    SEO Campaign
                  </div>
                  <div 
                    className={`${styles.channelCheckbox} ${selectedChannels.includes('ppc') ? styles.channelCheckboxActive : ''}`}
                    onClick={() => toggleChannel('ppc')}
                  >
                    Google/Meta Ads
                  </div>
                  <div 
                    className={`${styles.channelCheckbox} ${selectedChannels.includes('content') ? styles.channelCheckboxActive : ''}`}
                    onClick={() => toggleChannel('content')}
                  >
                    Content Strategy
                  </div>
                  <div 
                    className={`${styles.channelCheckbox} ${selectedChannels.includes('social') ? styles.channelCheckboxActive : ''}`}
                    onClick={() => toggleChannel('social')}
                  >
                    Social Management
                  </div>
                </div>
              </div>

              {/* Dynamic Deliverables Checklist */}
              <div className={styles.checklistSection}>
                <h4 className={styles.checklistHeading}>Included Deliverables</h4>
                <div className={styles.checklistGrid}>
                  {getIncludedFeatures(projectScope).map((feat, index) => (
                    <div key={index} className={styles.checklistItem}>
                      <span className={styles.checkIcon}>✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                  {getMarketingDeliverables(selectedChannels).map((feat, index) => (
                    <div key={index} className={`${styles.checklistItem} ${styles.marketingItem}`}>
                      <span className={styles.checkIcon}>★</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className={styles.resultsPanel}>
              <h4 className={styles.resultsHeading}>Live Projection</h4>
              
              <div className={styles.resultItem}>
                <div className={styles.resultNumber}>GH₵ {estimatedOneTimeCost.toLocaleString()}</div>
                <div className={styles.resultLabel}>Est. One-time Development Cost</div>
              </div>

              <div className={styles.resultItem}>
                <div className={styles.resultNumber}>GH₵ {estimatedMonthlyMarketing.toLocaleString()}/mo</div>
                <div className={styles.resultLabel}>Monthly Marketing Retainer</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)' }}>~{estimatedTimeWeeks} wks</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Development Timeline</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>+{estimatedLeads}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Est. Monthly Leads</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Showcase */}
      <section id="portfolio" className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Featured Projects</h2>
          <p className={styles.sectionSubtitle}>
            Explore some of the high-performance applications and high-ROI campaigns we have recently delivered.
          </p>
        </div>

        <div className={styles.portfolioGrid}>
          {/* Card 1 */}
          <div className={styles.portfolioCard}>
            <div 
              className={styles.portfolioImage} 
              style={{ backgroundImage: `url('/portfolio-saas.png')` }}
            />
            <div className={styles.portfolioOverlay}>
              <span className={styles.portfolioTag}>SaaS Platform</span>
              <h4 className={styles.portfolioWorkTitle}>Pulse Analytics</h4>
              <p className={styles.portfolioWorkDesc}>A real-time customer feedback aggregator with AI analysis and custom dashboard reports.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className={styles.portfolioCard}>
            <div 
              className={styles.portfolioImage} 
              style={{ backgroundImage: `url('/portfolio-ecommerce.png')` }}
            />
            <div className={styles.portfolioOverlay}>
              <span className={styles.portfolioTag}>E-Commerce</span>
              <h4 className={styles.portfolioWorkTitle}>Apex Headless Store</h4>
              <p className={styles.portfolioWorkDesc}>Bespoke Shopify store powered by Next.js, achieving sub-second page loads and +25% conversions.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className={styles.portfolioCard}>
            <div 
              className={styles.portfolioImage} 
              style={{ backgroundImage: `url('/portfolio-marketing.png')` }}
            />
            <div className={styles.portfolioOverlay}>
              <span className={styles.portfolioTag}>Digital Marketing</span>
              <h4 className={styles.portfolioWorkTitle}>Aura Brand Campaign</h4>
              <p className={styles.portfolioWorkDesc}>An integrated SEO, PPC, and content strategies campaign yielding 4x client growth within 6 months.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className={styles.section} style={{ backgroundColor: 'var(--secondary)' }}>
        <div className={styles.statsContainer}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>120+</div>
            <div className={styles.statLabel}>Solutions Deployed</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>99.9%</div>
            <div className={styles.statLabel}>Client Retention</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>300%</div>
            <div className={styles.statLabel}>Average Campaign ROI</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>24/7</div>
            <div className={styles.statLabel}>Monitoring & Support</div>
          </div>
        </div>
      </section>

      {/* Latest Blog Preview */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Insights & Tech Updates</h2>
          <p className={styles.sectionSubtitle}>
            Stay informed with the latest insights, trending technologies, and strategic advice from our specialists.
          </p>
        </div>

        {articlesLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
            Loading blog insights...
          </div>
        ) : latestArticles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
            Check back later for news updates!
          </div>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
              {latestArticles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
            <div style={{ textAlign: 'center' }}>
              <Link href="/blog" className={styles.btnSecondary} style={{ display: 'inline-flex', padding: '0.8rem 2.2rem' }}>
                Visit Our Full Blog <ExternalLink size={16} style={{ marginLeft: '0.5rem' }} />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Contact Section */}
      <section id="contact" className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Get In Touch</h2>
          <p className={styles.sectionSubtitle}>
            Have a project in mind or looking to accelerate your growth? Send us a message and receive a custom strategy audit.
          </p>
        </div>

        <div className={styles.contactContainer}>
          {formSubmitted ? (
            <div className={styles.successMessage}>
              <CheckCircle2 size={36} style={{ margin: '0 auto 1rem', display: 'block' }} />
              Thank you! Your message has been received. Our team will contact you within 24 hours.
            </div>
          ) : (
            <form onSubmit={handleContactSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="name">Full Name</label>
                <input 
                  type="text" 
                  id="name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className={styles.formInput} 
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className={styles.formInput} 
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="message">Project Requirements / Message</label>
                <textarea 
                  id="message"
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  className={styles.formTextarea} 
                  rows={5}
                  placeholder="Describe your goals, tech needs, or marketing scope..."
                  required
                />
              </div>

              <button type="submit" className={styles.btnPrimary} style={{ width: '100%', border: 'none', padding: '1rem' }}>
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default CompanyHome;
