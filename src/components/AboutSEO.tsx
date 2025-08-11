import { Helmet } from 'react-helmet-async';

export const AboutSEO = () => {
  const canonicalUrl = 'https://nco-search-india.netlify.app';
  const currentUrl = `${canonicalUrl}/about`;
  
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

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the National Classification of Occupation (NCO)?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The National Classification of Occupation (NCO) is India\'s official system for classifying and coding occupations. It provides a standardized framework for categorizing jobs across different sectors and industries in India.'
        }
      },
      {
        '@type': 'Question',
        name: 'How accurate is the AI-powered NCO code matching?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our AI-powered semantic search achieves 95% accuracy in matching job descriptions with appropriate NCO codes. The system uses advanced natural language processing to understand context and provide precise matches.'
        }
      },
      {
        '@type': 'Question',
        name: 'Which languages are supported for NCO code search?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We support 13+ Indian languages including Hindi, Bengali, Tamil, Telugu, Malayalam, Kannada, Gujarati, Punjabi, Odia, Assamese, Marathi, and Sanskrit, making the platform accessible to users across India.'
        }
      },
      {
        '@type': 'Question',
        name: 'How many NCO codes are available in the system?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our system contains over 3,600 NCO codes covering 52 industry sectors, providing comprehensive coverage of occupations across the Indian job market.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is the NCO system integrated with National Career Service (NCS)?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, our platform is fully integrated with the National Career Service (NCS) portal, allowing users to find government jobs and career opportunities based on their NCO codes.'
        }
      }
    ]
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'About NCO India - National Classification of Occupations | AI-Powered Job Classification',
    description: 'Learn about India\'s National Classification of Occupation (NCO) system. Discover how AI-powered semantic search revolutionizes job classification with 95% accuracy and multi-language support.',
    image: `${canonicalUrl}/og-image.svg`,
    author: {
      '@type': 'Organization',
      name: 'National Classification of Occupation (NCO) India'
    },
    publisher: {
      '@type': 'Organization',
      name: 'National Classification of Occupation (NCO) India',
      logo: {
        '@type': 'ImageObject',
        url: `${canonicalUrl}/logo.png`
      }
    },
    datePublished: '2024-01-15T00:00:00Z',
    dateModified: '2024-01-15T00:00:00Z',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': currentUrl
    }
  };

  return (
    <Helmet>
      {/* Page-specific Meta Tags */}
      <title>About NCO India - National Classification of Occupations | AI-Powered Job Classification</title>
      <meta name="description" content="Learn about India's National Classification of Occupation (NCO) system. Discover how AI-powered semantic search revolutionizes job classification with 95% accuracy and multi-language support." />
      <meta name="keywords" content="NCO India, National Classification of Occupations India, job classification system, AI-powered NCO search, career matching India, government job classification, NCS integration, occupational codes India" />
      <link rel="canonical" href={currentUrl} />
      
      {/* Page-specific Open Graph Tags */}
      <meta property="og:title" content="About NCO India - National Classification of Occupations | AI-Powered Job Classification" />
      <meta property="og:description" content="Learn about India's National Classification of Occupation (NCO) system. Discover how AI-powered semantic search revolutionizes job classification with 95% accuracy and multi-language support." />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="article" />
      <meta property="article:published_time" content="2024-01-15T00:00:00Z" />
      <meta property="article:modified_time" content="2024-01-15T00:00:00Z" />
      <meta property="article:author" content="NCO India" />
      <meta property="article:section" content="About" />
      <meta property="article:tag" content="NCO, Job Classification, AI, Career Service" />

      {/* Page-specific Twitter Card Tags */}
      <meta name="twitter:title" content="About NCO India - National Classification of Occupations | AI-Powered Job Classification" />
      <meta name="twitter:description" content="Learn about India's National Classification of Occupation (NCO) system. Discover how AI-powered semantic search revolutionizes job classification with 95% accuracy and multi-language support." />
      <meta name="twitter:card" content="summary_large_image" />

      {/* Breadcrumb Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: canonicalUrl
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'About NCO',
              item: currentUrl
            }
          ]
        })}
      </script>

      {/* Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>

      {/* FAQ Schema */}
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>

      {/* Article Schema */}
      <script type="application/ld+json">
        {JSON.stringify(articleSchema)}
      </script>
    </Helmet>
  );
};
