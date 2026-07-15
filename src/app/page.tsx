import React from 'react';
import { CompanyHome } from '@/pages/CompanyHome';

export const metadata = {
  title: 'ICONIC GH | Premium Software Development & Digital Marketing Agency',
  description: 'ICONIC GH delivers high-performance custom software solutions, iOS/Android mobile apps, cloud systems, and data-driven digital marketing campaigns.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ICONIC GH | Premium Software Development & Digital Marketing Agency',
    description: 'ICONIC GH delivers high-performance custom software solutions, iOS/Android mobile apps, cloud systems, and data-driven digital marketing campaigns.',
    url: 'https://www.iconicgh.com',
    siteName: 'ICONIC GH',
  }
};

export default function HomePage() {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ICONIC GH",
    "url": "https://www.iconicgh.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.iconicgh.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ICONIC GH",
    "url": "https://www.iconicgh.com",
    "logo": "https://www.iconicgh.com/logo.png",
    "description": "Premium software development and digital marketing agency.",
    "sameAs": [
      "https://twitter.com/iconic_gh",
      "https://facebook.com/iconic_gh"
    ]
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "ICONIC GH",
    "url": "https://www.iconicgh.com",
    "logo": "https://www.iconicgh.com/logo.png",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "AU3 Community 7",
      "addressLocality": "Tema",
      "addressRegion": "Greater Accra",
      "addressCountry": "GH"
    },
    "telephone": "+233500329461"
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.iconicgh.com/#webpage",
    "url": "https://www.iconicgh.com",
    "name": "ICONIC GH | Premium Software Development & Digital Marketing Agency",
    "description": "ICONIC GH delivers high-performance custom software solutions, iOS/Android mobile apps, cloud systems, and data-driven digital marketing campaigns."
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <CompanyHome />
    </>
  );
}
