import Profile from '@/pages/Profile';

export const metadata = {
  title: 'User Profile | ICONIC GH',
  description: 'Manage your user profile details, read history, and personalization preferences on ICONIC GH.',
  alternates: {
    canonical: '/profile',
  },
  openGraph: {
    title: 'User Profile | ICONIC GH',
    description: 'Manage your user profile details, read history, and personalization preferences on ICONIC GH.',
    url: 'https://www.iconicgh.com/profile',
    siteName: 'ICONIC GH',
  }
};

export default function ProfilePage() {
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
        "name": "Profile",
        "item": "https://www.iconicgh.com/profile"
      }
    ]
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.iconicgh.com/profile/#webpage",
    "url": "https://www.iconicgh.com/profile",
    "name": "User Profile | ICONIC GH",
    "description": "Manage your user profile details, read history, and personalization preferences on ICONIC GH."
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
      <Profile />
    </>
  );
}
