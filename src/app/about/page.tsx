'use client';

import React from 'react';
import { Target, Lightbulb, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div style={{ maxWidth: '1000px', margin: '4rem auto', padding: '0 1.5rem', fontFamily: 'var(--font-sans)', color: 'var(--foreground)' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.1em' }}>
          Who We Are
        </span>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, var(--foreground) 30%, var(--primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Engineered to Scale Brands
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
          ICONIC GH is a premier digital agency that combines custom software engineering with result-driven marketing tactics to build products and grow audiences worldwide.
        </p>
      </div>

      {/* Grid: Mission and Vision */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
        <div style={{ padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--secondary)' }}>
          <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
            <Target size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>Our Mission</h2>
          <p style={{ color: 'var(--secondary-foreground)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
            To deliver robust, scalable technology systems and highly targeted marketing pipelines that allow growth-stage companies and enterprises to operate efficiently and scale revenue predictably.
          </p>
        </div>

        <div style={{ padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--secondary)' }}>
          <div style={{ color: 'var(--accent)', marginBottom: '1rem' }}>
            <Lightbulb size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>Our Vision</h2>
          <p style={{ color: 'var(--secondary-foreground)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
            To be the leading integration partner in West Africa for enterprise software solutions and performance-driven digital marketing, Bridging the gap between technological innovation and commercial success.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div style={{ marginBottom: '5.5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, textAlign: 'center', marginBottom: '3rem' }}>Our Operating Values</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, borderLeft: '4px solid var(--primary)', paddingLeft: '0.75rem', marginBottom: '0.75rem' }}>
              1. Technical Precision
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
              We write production-grade, highly structured code. Every module, feature, and endpoint is stress-tested to ensure speed, uptime, and accessibility.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, borderLeft: '4px solid var(--accent)', paddingLeft: '0.75rem', marginBottom: '0.75rem' }}>
              2. Data over Hype
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
              We run campaigns backed by quantitative metrics. From Search Engine Optimization to Pay-Per-Click budgets, we monitor return on ad spend (ROAS) and CPA values.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, borderLeft: '4px solid #f43f5e', paddingLeft: '0.75rem', marginBottom: '0.75rem' }}>
              3. Transparent Partnership
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
              We build trust through clear milestones. Our clients have direct access to automated dashboards detailing project timelines and active campaign returns.
            </p>
          </div>
        </div>
      </div>

      {/* Leadership / Team section */}
      <div style={{ marginBottom: '5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, textAlign: 'center', marginBottom: '3.5rem' }}>Our Leadership Team</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2.5rem' }}>
          
          {/* Team Member 1 */}
          <div style={{ textAlign: 'center', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem', background: 'var(--secondary)' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', margin: '0 auto 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.5rem' }}>
              EO
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.25rem' }}>Emmanuel Osei</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, display: 'block', marginBottom: '1rem' }}>
              Managing Partner & Tech Lead
            </span>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: '1.5', margin: 0 }}>
              Fmr Senior Cloud Architect. Expert in scalable system designs, database synchronization, and secure API architectures.
            </p>
          </div>

          {/* Team Member 2 */}
          <div style={{ textAlign: 'center', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem', background: 'var(--secondary)' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent) 0%, #f43f5e 100%)', margin: '0 auto 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.5rem' }}>
              AA
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.25rem' }}>Abena Ansah</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600, display: 'block', marginBottom: '1rem' }}>
              Director of Growth & ROI
            </span>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: '1.5', margin: 0 }}>
              Performance marketer with a decade of SEO/PPC experience. Specializes in client brand positioning and ROI cost estimators.
            </p>
          </div>

          {/* Team Member 3 */}
          <div style={{ textAlign: 'center', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem', background: 'var(--secondary)' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981 0%, var(--primary) 100%)', margin: '0 auto 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.5rem' }}>
              KM
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.25rem' }}>Kofi Mensah</h3>
            <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600, display: 'block', marginBottom: '1rem' }}>
              Lead UI/UX Architect
            </span>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: '1.5', margin: 0 }}>
              Creative director focused on building immersive, premium web interfaces that convert visitors into active corporate clients.
            </p>
          </div>

        </div>
      </div>

      {/* CTA section */}
      <div style={{ padding: '3.5rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>Ready to Scale Your Digital Infrastructure?</h3>
        <p style={{ color: 'var(--muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
          Use our interactive project cost estimator or contact our consultancy team directly to receive a comprehensive growth audit.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/#estimator" style={{ background: 'var(--primary)', color: 'white', padding: '0.8rem 2rem', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            Calculate Budget <ArrowUpRight size={18} />
          </Link>
          <Link href="/#contact" style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)', padding: '0.8rem 2rem', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
            Book Consultation
          </Link>
        </div>
      </div>
    </div>
  );
}
