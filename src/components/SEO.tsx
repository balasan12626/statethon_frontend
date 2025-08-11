import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  path?: string;
}

export const SEO = ({
  title = 'NCO Code Search India | NCS Job Portal | Find Government Jobs',
  description = 'Search NCO codes & NCS job listings in India. AI-powered job matching with National Career Service (NCS). Find government jobs by NCO classification codes.',
  canonicalUrl = 'https://nco-search-india.netlify.app', // Updated with actual domain
  path = '',
}: SEOProps) => {
  const currentUrl = `${canonicalUrl}${path}`;
  
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'NCO Code Search India - National Career Service Job Portal',
    url: canonicalUrl,
    description: 'Official Indian National Classification of Occupations (NCO) code search and NCS job matching platform',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${canonicalUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    audience: {
      '@type': 'Audience',
      geographicArea: {
        '@type': 'Country',
        name: 'India',
      },
    },
  };

  const jobPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    jobBenefits: 'Government Jobs, Career Growth, Skill Development',
    occupationalCategory: 'National Classification of Occupations India',
    industry: 'Government Sector, Private Sector',
    employmentType: ['FULL_TIME', 'PART_TIME', 'CONTRACT'],
    relevantOccupation: 'All NCO Classified Jobs',
    description: 'Find jobs matching your skills through NCO codes in India. Access government and private sector opportunities through National Career Service (NCS).',
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IN',
        addressRegion: 'All India'
      }
    }
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'National Classification of Occupation (NCO) India',
    url: canonicalUrl,
    logo: `${canonicalUrl}/logo.png`,
    description: 'Official Indian National Classification of Occupations (NCO) system providing standardized job classifications and AI-powered semantic search for career matching.',
    foundingDate: '2015',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressRegion: 'All India'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'support@nco.gov.in',
      availableLanguage: ['English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Gujarati', 'Punjabi', 'Odia', 'Assamese', 'Marathi', 'Sanskrit']
    },
    sameAs: [
      'https://www.ncs.gov.in',
      'https://www.linkedin.com/company/nco-india',
      'https://twitter.com/nco_india'
    ]
  };

  return (
    <Helmet>
      {/* Essential Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="NCO code search India, National Classification of Occupations India, NCS job portal India, government jobs India, find jobs by NCO code, job classification India, NCS portal login, career service India, employment news India, sarkari naukri" />
      <link rel="canonical" href={currentUrl} />
      
      {/* Language and Region Tags */}
      <meta name="language" content="en-IN" />
      <link rel="alternate" href={`${currentUrl}`} hrefLang="en-IN" />
      <link rel="alternate" href={`${currentUrl}/hi`} hrefLang="hi-IN" />
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />
      <meta name="geo.position" content="20.5937;78.9629" />
      <meta name="ICBM" content="20.5937, 78.9629" />

      {/* Mobile and Crawler Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />

      {/* Performance Optimizations */}
      <link rel="preload" href="/src/main.tsx" as="script" />
      <link rel="preload" href="/src/index.css" as="style" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//translate.google.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />

      {/* Open Graph Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="NCO Code Search India" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:locale:alternate" content="hi_IN" />
      <meta property="og:image" content={`${canonicalUrl}/og-image.svg`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="NCO Code Search India - Find Government Jobs" />
      <meta property="og:image:type" content="image/svg+xml" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${canonicalUrl}/og-image.svg`} />
      <meta name="twitter:site" content="@ncs_india" />
      <meta name="twitter:creator" content="@ncs_india" />

      {/* Mobile App Tags */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <meta name="apple-mobile-web-app-title" content="NCO Code Search" />
      <meta name="application-name" content="NCO Code Search" />
      <meta name="theme-color" content="#1a56db" />
      <meta name="msapplication-TileColor" content="#1a56db" />
      <meta name="msapplication-config" content="/browserconfig.xml" />

      {/* Favicon */}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Security-related meta that are safe to include in HTML. Header-only policies like X-Frame-Options are set via server config (see netlify.toml). */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />

      {/* Additional SEO Meta Tags */}
      <meta name="author" content="National Classification of Occupation (NCO) India" />
      <meta name="copyright" content="Copyright © 2024 NCO India. All rights reserved." />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />
      <meta name="revisit-after" content="1 days" />
      <meta name="generator" content="React + Vite" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(jobPostingSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
};