import React from 'react';
import { BlogHome } from '@/pages/BlogHome';

export const metadata = {
  title: 'ICONIC GH Blog | Insights, News & Stories',
  description: 'Stay informed with the latest insights, breaking news, tech trends, and business analysis from around the globe.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'ICONIC GH Blog | Insights, News & Stories',
    description: 'Stay informed with the latest insights, breaking news, tech trends, and business analysis from around the globe.',
    url: 'https://www.iconicgh.com/blog',
    siteName: 'ICONIC GH',
  }
};

export default function BlogRoutePage() {
  const newsMediaOrgJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "name": "ICONIC GH",
    "url": "https://www.iconicgh.com",
    "logo": "https://www.iconicgh.com/logo.png",
    "publishingPrinciples": "https://www.iconicgh.com/privacy"
  };

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
        "name": "Blog",
        "item": "https://www.iconicgh.com/blog"
      }
    ]
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.iconicgh.com/blog/#webpage",
    "url": "https://www.iconicgh.com/blog",
    "name": "ICONIC GH Blog | Insights, News & Stories",
    "description": "Stay informed with the latest insights, breaking news, tech trends, and business analysis from around the globe."
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsMediaOrgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <BlogHome />
    </>
  );
}
