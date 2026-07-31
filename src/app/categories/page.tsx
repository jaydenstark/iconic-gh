import Categories from '@/pages/Categories';

export const metadata = {
  title: 'Explore News Categories | ICONIC GH',
  description: 'Browse articles across technology, business, politics, sports, entertainment, and world news channels on ICONIC GH.',
  alternates: {
    canonical: '/categories',
  },
  openGraph: {
    title: 'Explore News Categories | ICONIC GH',
    description: 'Browse articles across technology, business, politics, sports, entertainment, and world news channels on ICONIC GH.',
    url: 'https://www.iconicgh.com/categories',
    siteName: 'ICONIC GH',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Explore News Categories | ICONIC GH',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore News Categories | ICONIC GH',
    description: 'Browse articles across technology, business, politics, sports, entertainment, and world news channels on ICONIC GH.',
    images: ['/og-image.jpg'],
  }
};

export default function CategoriesPage() {
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
        "name": "Categories",
        "item": "https://www.iconicgh.com/categories"
      }
    ]
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.iconicgh.com/categories/#webpage",
    "url": "https://www.iconicgh.com/categories",
    "name": "Explore News Categories | ICONIC GH",
    "description": "Browse articles across technology, business, politics, sports, entertainment, and world news channels on ICONIC GH."
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
      <Categories />
    </>
  );
}
