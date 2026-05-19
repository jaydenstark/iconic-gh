import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Calendar, Clock, Eye, Share2 } from 'lucide-react';
import { Comments } from '@/components/article/Comments';
import styles from '@/components/article/Article.module.css';

// Rich Mock Data Store
const ARTICLES_DATABASE: Record<string, any> = {
  '1': {
    id: '1',
    title: 'The Future of AI: How New Models are Reshaping Industries',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop',
    date: 'May 19, 2026',
    readTime: '6 min read',
    views: '1,420 views',
    author: {
      name: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
      bio: 'Sarah is a senior technology journalist reporting on artificial intelligence, cybernetics, and future society trends for over a decade.'
    },
    body: [
      'Artificial intelligence has transitioned from a conceptual science-fiction dream into a fundamental structural block of global enterprise. Over the past year, massive advancements in large multimodal models have redefined how humans and systems collaborate.',
      'From healthcare algorithms that detect anomalies with precision exceeding human limits, to automated engineering flows that draft codebases overnight, the economic footprint of cognitive automation is expanding rapidly.',
      'Critics suggest that the speed of scaling leaves regulatory pipelines in the dust, bringing significant questions around security, authorship, and structural employment shifts. However, early adopters are realizing unprecedented efficiency leaps.',
      'As we look toward the final half of the decade, the boundary between digital orchestration and physical labor will blur even further, calling for a unified standard of safety and human-centric design in autonomous execution.'
    ]
  },
  '2': {
    id: '2',
    title: 'Global Summit Reaches Historic Agreement on Climate Action',
    category: 'World',
    image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9cce?q=80&w=1200&auto=format&fit=crop',
    date: 'May 18, 2026',
    readTime: '8 min read',
    views: '2,890 views',
    author: {
      name: 'David Atten',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop',
      bio: 'David is an award-winning environmental advocate and investigative reporter focusing on climate policy, ecosystems, and conservation strategies.'
    },
    body: [
      'In an extraordinary concluding session, world leaders from over 160 nations have formally signed the 2026 Accord, establishing a legally binding pathway to reach carbon-neutral operations by 2040.',
      'The policy includes global carbon pricing mechanisms, a complete phase-out of traditional high-emission subsidy lines, and a monumental financial fund dedicated to climate adaptation projects in developing regions.',
      'Negotiators spent over three weeks in continuous sessions to hammer out details, overcoming severe differences between industrialized zones and growing economies.',
      'This accord marks a significant milestone in global unified action, bringing a renewed sense of optimism and clear operational guidelines for international corporations and regional leaders alike.'
    ]
  },
  '3': {
    id: '3',
    title: 'Tech Giant Unveils Revolutionary Mixed Reality Headset',
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1200&auto=format&fit=crop',
    date: 'May 17, 2026',
    readTime: '5 min read',
    views: '3,110 views',
    author: {
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=100&auto=format&fit=crop',
      bio: 'Marcus reports on consumer electronics, enterprise hardware innovations, and venture dynamics in Silicon Valley.'
    },
    body: [
      'The consumer electronics market received a major shakeup today as the leading hardware enterprise officially launched its long-rumored mixed reality device.',
      'Integrating native micro-OLED displays with custom-silicon latency tracking, the headset projects virtual workspaces and high-resolution assets into physical surroundings with absolute precision.',
      'Analysts suggest this launch marks the first viable step towards post-smartphone interfaces, with major implications for remote collaboration, professional design workflows, and immersive education.',
      'Early pre-order queues have exceeded standard launch expectations, showing a massive public appetite for mature, well-integrated spatial computing solutions.'
    ]
  },
  '4': {
    id: '4',
    title: 'The Rise of Quantum Computing in Finance',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
    date: 'May 16, 2026',
    readTime: '7 min read',
    views: '980 views',
    author: {
      name: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
      bio: 'Sarah is a senior technology journalist reporting on artificial intelligence, cybernetics, and future society trends.'
    },
    body: [
      'Quantum computer grids are moving beyond research labs and entering the core infrastructure of the world\'s largest financial brokerages.',
      'By utilizing superposition and quantum entanglement, these systems can process risk calculations and portfolio optimization models in seconds that would occupy traditional supercomputer clusters for years.',
      'Major firms are actively recruiting quantum specialists to design proprietary algorithmic strategies, preparing for a future where transactional velocity is dictated by subatomic physics.',
      'While general-purpose quantum processors are still a work in progress, specialized annealers and hybrid quantum-classic stacks are already delivering verifiable alpha in modern markets.'
    ]
  },
  '5': {
    id: '5',
    title: 'New Health Guidelines Emphasize Preventive Care',
    category: 'Health',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1200&auto=format&fit=crop',
    date: 'May 15, 2026',
    readTime: '4 min read',
    views: '1,120 views',
    author: {
      name: 'David Atten',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop',
      bio: 'David is an award-winning environmental advocate and investigative reporter focusing on health, policy, and human ecosystems.'
    },
    body: [
      'The World Health Organization has released its most comprehensive update to health and wellness guidelines in two decades, placing a heavy accent on preventative care.',
      'Moving away from reactive medical interventions, the guidelines present structured pathways for metabolic optimization, proactive sleep hygiene, and personalized nutritional strategies.',
      'Clinical data shows that minor lifestyle adjustments, when scaled across populations, reduce chronic conditions and ease structural pressure on national healthcare budgets.',
      'The WHO plans to launch joint education programs with regional schools and city planning committees to integrate these concepts into daily municipal life.'
    ]
  },
  '6': {
    id: '6',
    title: 'Electric Vehicle Adoption Surpasses Expectations',
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938cb?q=80&w=1200&auto=format&fit=crop',
    date: 'May 14, 2026',
    readTime: '5 min read',
    views: '1,560 views',
    author: {
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=100&auto=format&fit=crop',
      bio: 'Marcus reports on consumer electronics, enterprise hardware innovations, and venture dynamics in Silicon Valley.'
    },
    body: [
      'Electric vehicle registration metrics have smashed past previous Q1 predictions, showing that EV technology has crossed the chasm into mainstream adoption.',
      'The rapid expansion of localized ultra-fast charging points and next-generation solid-state batteries are successfully erasing traditional range anxieties.',
      'Traditional auto manufacturers are scaling back combustion assembly lines far faster than expected to redirect factory bandwidth toward fully electric chassis.',
      'As battery supply chains diversify and manufacturing yields optimize, EV affordability is projected to reach parity with gas-powered vehicles within the next twelve months.'
    ]
  }
};

const RELATED_POSTS = [
  { id: '4', title: 'The Rise of Quantum Computing in Finance', category: 'Technology', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop' },
  { id: '5', title: 'New Health Guidelines Emphasize Preventive Care', category: 'Health', image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=400&auto=format&fit=crop' },
  { id: '6', title: 'Electric Vehicle Adoption Surpasses Expectations', category: 'Business', image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938cb?q=80&w=400&auto=format&fit=crop' },
];

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = ARTICLES_DATABASE[resolvedParams.id] || ARTICLES_DATABASE['1'];
  return {
    title: `${post.title} | ICONIC GH`,
    description: post.body[0],
    openGraph: {
      title: `${post.title} | ICONIC GH`,
      description: post.body[0],
      images: [{ url: post.image }],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const articleId = resolvedParams.id;
  const post = ARTICLES_DATABASE[articleId] || ARTICLES_DATABASE['1'];

  return (
    <article className={styles.articleContainer}>
      <header className={styles.header}>
        <span className={styles.category}>{post.category}</span>
        <h1 className={styles.title}>{post.title}</h1>
        
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <Calendar size={16} />
            <span>{post.date}</span>
          </div>
          <div className={styles.metaItem}>
            <Clock size={16} />
            <span>{post.readTime}</span>
          </div>
          <div className={styles.metaItem}>
            <Eye size={16} />
            <span>{post.views}</span>
          </div>
        </div>
      </header>

      <div className={styles.featureImageWrapper}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.image} alt={post.title} className={styles.featureImage} />
      </div>

      <div className={styles.layout}>
        <div>
          {/* Article Body */}
          <div className={styles.body}>
            {post.body.map((para: string, idx: number) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {/* Share buttons */}
          <div className={styles.shareSection}>
            <span className={styles.shareTitle}>Share This Story</span>
            <div className={styles.shareButtons}>
              <a href="#" className={styles.shareButton} aria-label="Share on Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className={styles.shareButton} aria-label="Share on Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className={styles.shareButton} aria-label="Share on LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" className={styles.shareButton} aria-label="Copy Link">
                <Share2 size={18} />
              </a>
            </div>
          </div>

          {/* Author Profile */}
          <div className={styles.authorCard}>
            <div 
              className={styles.authorAvatar} 
              style={{ backgroundImage: `url('${post.author.avatar}')` }}
            />
            <div className={styles.authorInfo}>
              <span className={styles.authorName}>{post.author.name}</span>
              <p className={styles.authorBio}>{post.author.bio}</p>
            </div>
          </div>

          {/* Client-side Comments */}
          <Comments />
        </div>
      </div>

      {/* Related Posts */}
      <div className={styles.relatedSection}>
        <h3 className={styles.relatedTitle}>Related Stories</h3>
        <div className={styles.relatedGrid}>
          {RELATED_POSTS.map((rel) => (
            <div key={rel.id} className={styles.relatedCard}>
              <Link href={`/article/${rel.id}`}>
                <div 
                  className={styles.relatedThumb} 
                  style={{ backgroundImage: `url('${rel.image}')` }}
                />
              </Link>
              <span className={styles.relatedCategory}>{rel.category}</span>
              <Link href={`/article/${rel.id}`}>
                <h4 className={styles.relatedHeadline}>{rel.title}</h4>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
