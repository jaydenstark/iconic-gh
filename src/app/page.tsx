import React from 'react';
import { CompanyHome } from '@/pages/CompanyHome';

export const metadata = {
  title: 'ICONIC GH | Premium Software Development & Digital Marketing Agency',
  description: 'ICONIC GH delivers high-performance custom software solutions, iOS/Android mobile apps, cloud systems, and data-driven digital marketing campaigns.',
  openGraph: {
    title: 'ICONIC GH | Premium Software Development & Digital Marketing Agency',
    description: 'ICONIC GH delivers high-performance custom software solutions, iOS/Android mobile apps, cloud systems, and data-driven digital marketing campaigns.',
    url: 'https://iconicgh.com',
    siteName: 'ICONIC GH',
  }
};

export default function HomePage() {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ICONIC GH",
    "url": "https://iconicgh.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://iconicgh.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "ICONIC GH",
    "url": "https://iconicgh.com",
    "logo": "https://www.iconicgh.com/logo.png",
    "description": "Premium software development and digital marketing agency.",
    "sameAs": [
      "https://twitter.com/iconic_gh",
      "https://facebook.com/iconic_gh"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <CompanyHome />
    </>
  );
}
