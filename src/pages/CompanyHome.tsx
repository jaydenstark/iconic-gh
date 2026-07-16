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
  const [projectScope, setProjectScope] = useState<number>(2); // Default to Corporate Website
  const [projectSize, setProjectSize] = useState<number>(5); 
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

  // Predefined Quick Choice Packages configuration
  const packages = [
    {
      id: 'simple',
      name: 'Startup Landing Page',
      price: 3500,
      scope: 1,
      size: 1,
      desc: 'Single page site with essential branding, dynamic sections, and instant contact routing.',
      features: ['1 Landing Page / Section', 'Responsive Mobile-First Design', 'Contact Capture Form', 'Hosting & Domain Setup']
    },
    {
      id: 'corporate',
      name: 'Professional Business Site',
      price: 8500,
      scope: 2,
      size: 5,
      desc: 'Sleek multi-page brand profile site with CMS capability to post news and updates.',
      features: ['Up to 5 Pages', 'Dynamic Blog/News Engine', 'SEO & Performance Optimizations', 'Interactive Cost Calculators']
    },
    {
      id: 'ecommerce',
      name: 'Premium E-Commerce Catalog',
      price: 18500,
      scope: 3,
      size: 5,
      desc: 'Complete catalog and payment-ready store for online product ordering and checkout.',
      features: ['Shopify/Mobile Money checkout', 'Up to 5 Core Product Pages', 'Inventory Management Panel', 'WhatsApp Chat Order Routing']
    }
  ];

  const handleSelectPackage = (pkg: typeof packages[0]) => {
    setProjectScope(pkg.scope);
    setProjectSize(pkg.size);
    setFormMessage(`Hello! I would like to request a consultation for the "${pkg.name}" package. Please get back to me!`);
    const contactSec = document.getElementById('contact');
    if (contactSec) {
      contactSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScopeChange = (newScope: number) => {
    setProjectScope(newScope);
    const isSimple = newScope === 1;
    const min = isSimple ? 1 : 5;
    const max = isSimple ? 10 : 50;
    setProjectSize((prev) => {
      if (prev < min) return min;
      if (prev > max) return max;
      return prev;
    });
  };

  const isSimpleSite = projectScope === 1;
  const sizeMin = isSimpleSite ? 1 : 5;
  const sizeMax = isSimpleSite ? 10 : 50;

  // Estimator Calculations
  const getScopeDetails = (scope: number) => {
    switch (scope) {
      case 1: return { name: 'Simple Landing Page', baseCost: 3500, timeWeeks: 1 };
      case 2: return { name: 'Corporate Website', baseCost: 8500, timeWeeks: 3 };
      case 3: return { name: 'E-commerce Platform', baseCost: 18500, timeWeeks: 5 };
      case 4: return { name: 'Custom SaaS Application', baseCost: 45000, timeWeeks: 8 };
      case 5: return { name: 'Enterprise AI/Cloud Platform', baseCost: 95000, timeWeeks: 12 };
      default: return { name: 'Custom App', baseCost: 45000, timeWeeks: 6 };
    }
  };

  const scopeInfo = getScopeDetails(projectScope);
  const sizeCostMultiplier = projectScope === 1 ? 500 : projectScope === 2 ? 1000 : projectScope === 3 ? 1800 : projectScope === 4 ? 3000 : 5000;
  const sizeCost = projectSize * sizeCostMultiplier;
  const marketingRetainer = selectedChannels.length * 2500;
  
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
      case 1: return ['Fully Responsive Layout', 'SEO-Optimized Codebase', 'Contact Form & Google Maps integration', 'Fast SSD Hosting Setup', '1-Month Free Support'];
      case 2: return [...common, 'WordPress / Headless CMS Integration', 'Client Testimonials Slider', 'Custom Dynamic Cost Estimator'];
      case 3: return [...common, 'Shopify/Stripe/Mobile Money Payment Integration', 'Inventory Management Panel', 'Cart & Secure Checkout', 'WhatsApp Chat Order Routing'];
      case 4: return [...common, 'Secure User Auth System', 'Dynamic PostgreSQL/Firebase Database', 'REST/GraphQL Custom APIs', 'Interactive Analytical Dashboards'];
      case 5: return [...common, 'Gemini/OpenAI Integration', 'Vector Database Search (Pinecone/pgvector)', 'High Availability Multi-zone Cloud Deployment', 'Automated Daily Backups'];
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

        {/* Predefined Quick Choice Packages */}
        <div className={styles.packagesContainer}>
          <h3 className={styles.packagesSubheading}>Select a Predefined Website Package</h3>
          <div className={styles.packagesGrid}>
            {packages.map((pkg) => (
              <div 
                key={pkg.id} 
                className={`${styles.packageCard} ${projectScope === pkg.scope && projectSize === pkg.size ? styles.packageCardActive : ''}`}
                onClick={() => handleSelectPackage(pkg)}
              >
                <h4 className={styles.pkgName}>{pkg.name}</h4>
                <div className={styles.pkgPrice}>
                  <span className={styles.pkgPriceCur}>GH₵</span> {pkg.price.toLocaleString()}
                </div>
                <p className={styles.pkgDesc}>{pkg.desc}</p>
                <div className={styles.pkgFeatures}>
                  {pkg.features.map((f, i) => (
                    <div key={i} className={styles.pkgFeatureItem}>
                      <span className={styles.pkgCheck}>✓</span> {f}
                    </div>
                  ))}
                </div>
                <button className={styles.pkgButton}>Select & Configure</button>
              </div>
            ))}
          </div>
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
                  onChange={(e) => handleScopeChange(parseInt(e.target.value))}
                  className={styles.rangeInput}
                  style={{ '--value-percent': `${(projectScope - 1) / 4 * 100}%` } as React.CSSProperties}
                />
              </div>

              <div className={styles.sliderGroup}>
                <label className={styles.sliderLabel}>
                  <span>{isSimpleSite ? 'Pages / Sections' : 'Screens / Primary Features'}</span>
                  <span className={styles.sliderValue}>{projectSize} {isSimpleSite ? 'Pages' : 'Modules'}</span>
                </label>
                <input 
                  type="range" 
                  min={sizeMin} 
                  max={sizeMax} 
                  value={projectSize} 
                  onChange={(e) => setProjectSize(parseInt(e.target.value))}
                  className={styles.rangeInput}
                  style={{ '--value-percent': `${(projectSize - sizeMin) / (sizeMax - sizeMin) * 100}%` } as React.CSSProperties}
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

              <div className={styles.panelDivider}>
                <div>
                  <div className={styles.timelineNumber}>~{estimatedTimeWeeks} wks</div>
                  <div className={styles.mutedLabel}>Development Timeline</div>
                </div>
                <div>
                  <div className={styles.leadsNumber}>+{estimatedLeads}</div>
                  <div className={styles.mutedLabel}>Est. Monthly Leads</div>
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
          {/* Card 1: Westline Decor */}
          <a 
            href="https://www.westlinedecor.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.portfolioCard}
          >
            <div 
              className={styles.portfolioImage} 
              style={{ backgroundImage: `url('/portfolio-westline.png')` }}
            />
            <div className={styles.portfolioOverlay}>
              <span className={styles.portfolioTag}>Interior Design & Fit-Out</span>
              <h4 className={styles.portfolioWorkTitle}>Westline Decor</h4>
              <p className={styles.portfolioWorkDesc}>Custom architectural interior fitting, 3D architectural modeling, and high-end sourcing platform in Ghana.</p>
            </div>
          </a>

          {/* Card 2: Lollarod Enterprise */}
          <a 
            href="https://lollarodenterprisenew.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.portfolioCard}
          >
            <div 
              className={styles.portfolioImage} 
              style={{ backgroundImage: `url('/portfolio-lollarod.png')` }}
            />
            <div className={styles.portfolioOverlay}>
              <span className={styles.portfolioTag}>Retail & E-Commerce</span>
              <h4 className={styles.portfolioWorkTitle}>Lollarod Enterprise</h4>
              <p className={styles.portfolioWorkDesc}>Multi-branch boutique digital catalog and ordering system for luxury home interiors, beddings, and curtains.</p>
            </div>
          </a>

          {/* Card 3: Jaybesin Logistics */}
          <a 
            href="https://www.jaybesinlogistics.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.portfolioCard}
          >
            <div 
              className={styles.portfolioImage} 
              style={{ backgroundImage: `url('/portfolio-jaybesin.png')` }}
            />
            <div className={styles.portfolioOverlay}>
              <span className={styles.portfolioTag}>Logistics & Supply Chain</span>
              <h4 className={styles.portfolioWorkTitle}>Jaybesin Logistics</h4>
              <p className={styles.portfolioWorkDesc}>Global freight tracking dashboard, customs clearance pipeline, and port terminal cargo management application.</p>
            </div>
          </a>
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
