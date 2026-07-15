import Search from '@/pages/Search';

export const metadata = {
  title: 'Search Articles | ICONIC GH',
  description: 'Search articles and news releases by keyword, category, or headline on ICONIC GH.',
  alternates: {
    canonical: '/search',
  },
  openGraph: {
    title: 'Search Articles | ICONIC GH',
    description: 'Search articles and news releases by keyword, category, or headline on ICONIC GH.',
    url: 'https://www.iconicgh.com/search',
    siteName: 'ICONIC GH',
  }
};

export default function SearchPage() {
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
        "name": "Search",
        "item": "https://www.iconicgh.com/search"
      }
    ]
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.iconicgh.com/search/#webpage",
    "url": "https://www.iconicgh.com/search",
    "name": "Search Articles | ICONIC GH",
    "description": "Search articles and news releases by keyword, category, or headline on ICONIC GH."
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
      <Search />
    </>
  );
}
