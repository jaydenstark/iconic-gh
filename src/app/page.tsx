import React from 'react';
import { Home } from '@/pages/Home';

export const metadata = {
  title: 'ICONIC GH | Breaking Global News & Trending Stories',
  description: 'Delivering breaking news, deep analysis, and trending stories from around the globe. Stay informed with ICONIC GH.',
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
    "@type": "Organization",
    "name": "ICONIC GH",
    "url": "https://iconicgh.com",
    "logo": "https://iconicgh.com/icons/icon-192x192.png",
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
      <Home />
    </>
  );
}
