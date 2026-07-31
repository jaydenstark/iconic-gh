import React from 'react';
import { ShieldCheck, Lock, Scale } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy & Terms | ICONIC GH',
  description: 'Review the official operational terms, data protection guidelines, and service level policies for ICONIC GH.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy & Terms | ICONIC GH',
    description: 'Review the official operational terms, data protection guidelines, and service level policies for ICONIC GH.',
    url: 'https://www.iconicgh.com/privacy',
    siteName: 'ICONIC GH',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Privacy Policy & Terms | ICONIC GH',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy & Terms | ICONIC GH',
    description: 'Review the official operational terms, data protection guidelines, and service level policies for ICONIC GH.',
    images: ['/og-image.jpg'],
  }
};

export default function PrivacyPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.iconicgh.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Privacy Policy",
        "item": "https://www.iconicgh.com/privacy"
      }
    ]
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.iconicgh.com/privacy/#webpage",
    "url": "https://www.iconicgh.com/privacy",
    "name": "Privacy Policy & Terms | ICONIC GH",
    "description": "Review the official operational terms, data protection guidelines, and service level policies for ICONIC GH."
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 1.5rem', fontFamily: 'var(--font-sans)', color: 'var(--foreground)' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', background: 'linear-gradient(135deg, var(--foreground) 30%, var(--primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Privacy Policy & Terms
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.05rem' }}>
          Last Updated: July 14, 2026. Official operational terms and data protection policies for ICONIC GH.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '2.5rem' }}>
        
        {/* Section 1 */}
        <section style={{ padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)', color: 'var(--primary)', padding: '0.5rem', borderRadius: '8px' }}>
              <ShieldCheck size={24} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>Data Protection & Security</h2>
          </div>
          <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--secondary-foreground)', marginBottom: '1rem' }}>
            At ICONIC GH, we take your data privacy with extreme seriousness. We implement industry-standard encryption protocols and secure socket layers (SSL) to ensure that any client project files, marketing leads data, and payment information processed through our systems are fully secure.
          </p>
          <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--secondary-foreground)' }}>
            We only collect necessary operational information (such as names, contact emails, and project scope details) when you utilize our interactive estimators or contact forms. This data is strictly utilized to compute custom project audits and is never shared, leased, or sold to third-party marketing entities.
          </p>
        </section>

        {/* Section 2 */}
        <section style={{ padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)', color: 'var(--primary)', padding: '0.5rem', borderRadius: '8px' }}>
              <Lock size={24} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>Privacy Policies</h2>
          </div>
          <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--secondary-foreground)', marginBottom: '1rem' }}>
            Our integration with third-party tracking tools like Google Analytics 4 and Firebase Analytics is designed to capture aggregate traffic patterns, devices, and session duration. This helps us optimize site performance, diagnose load-time bugs, and continuously improve user layouts.
          </p>
          <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--secondary-foreground)' }}>
            You may adjust your browser cookie settings to decline analytic cookies, which will not degrade your browsing experience on our platform in any way.
          </p>
        </section>

        {/* Section 3 */}
        <section style={{ padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)', color: 'var(--primary)', padding: '0.5rem', borderRadius: '8px' }}>
              <Scale size={24} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>Terms of Service</h2>
          </div>
          <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--secondary-foreground)', marginBottom: '1rem' }}>
            By engaging our software engineering or marketing consultation services, you agree to comply with our delivery agreements. All estimates generated by our online widgets are non-binding projections based on typical developer times and media advertising retainers.
          </p>
          <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--secondary-foreground)' }}>
            Official service level agreements (SLAs), detailed project milestones, design mockups, and intellectual property rights assignments are formally signed and validated in customized engineering contract documents prior to project kicks-off.
          </p>
        </section>

      </div>
    </div>
    </>
  );
}
