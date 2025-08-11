import { Helmet } from 'react-helmet-async';

export const ContactSEO = () => {
  const canonicalUrl = 'https://nco-search-india.netlify.app';
  const currentUrl = `${canonicalUrl}/contact`;
  
  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact NCO India - Get Support and Information',
    description: 'Contact the National Classification of Occupation (NCO) team for support, feedback, or inquiries about job classification and career services in India.',
    url: currentUrl,
    mainEntity: {
      '@type': 'Organization',
      name: 'National Classification of Occupation (NCO) India',
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: 'support@nco.gov.in',
          availableLanguage: ['English', 'Hindi'],
          areaServed: 'IN',
          serviceArea: {
            '@type': 'Country',
            name: 'India'
          }
        },
        {
          '@type': 'ContactPoint',
          contactType: 'technical support',
          email: 'tech@nco.gov.in',
          availableLanguage: ['English']
        },
        {
          '@type': 'ContactPoint',
          contactType: 'general',
          telephone: '+91-11-1234-5678',
          availableLanguage: ['English', 'Hindi'],
          areaServed: 'IN'
        }
      ],
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IN',
        addressRegion: 'Delhi',
        addressLocality: 'New Delhi',
        postalCode: '110001',
        streetAddress: 'Ministry of Labour and Employment'
      }
    }
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How can I get help with NCO code classification?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can contact our support team via email at support@nco.gov.in or call us at +91-11-1234-5678. Our team is available Monday to Friday, 9 AM to 6 PM IST.'
        }
      },
      {
        '@type': 'Question',
        name: 'What information should I provide when contacting support?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Please provide your job description, industry sector, and any specific questions about NCO codes. This helps us provide more accurate and helpful assistance.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do you provide support in regional languages?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we provide support in English and Hindi. For other regional languages, please specify your preferred language in your inquiry.'
        }
      },
      {
        '@type': 'Question',
        name: 'How long does it take to get a response?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We typically respond to email inquiries within 24-48 hours. For urgent matters, please call our support line during business hours.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can I report bugs or suggest improvements?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutely! We welcome feedback and bug reports. Please send detailed information to tech@nco.gov.in with screenshots if possible.'
        }
      }
    ]
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Contact NCO India - Get Support & Information',
    description: 'Contact the National Classification of Occupation (NCO) team for support, feedback, or inquiries about job classification and career services in India. Get expert assistance with NCO codes.',
    url: currentUrl,
    isPartOf: {
      '@type': 'WebSite',
      name: 'NCO Code Search India',
      url: canonicalUrl
    }
  };

  return (
    <Helmet>
      {/* Page-specific Meta Tags */}
      <title>Contact NCO India - Get Support & Information | National Classification of Occupations</title>
      <meta name="description" content="Contact the National Classification of Occupation (NCO) team for support, feedback, or inquiries about job classification and career services in India. Get expert assistance with NCO codes." />
      <meta name="keywords" content="contact NCO India, NCO support, job classification help, NCO code assistance, career service contact, government job support, NCS help desk, occupational classification support" />
      <link rel="canonical" href={currentUrl} />
      
      {/* Page-specific Open Graph Tags */}
      <meta property="og:title" content="Contact NCO India - Get Support & Information | National Classification of Occupations" />
      <meta property="og:description" content="Contact the National Classification of Occupation (NCO) team for support, feedback, or inquiries about job classification and career services in India. Get expert assistance with NCO codes." />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="website" />

      {/* Page-specific Twitter Card Tags */}
      <meta name="twitter:title" content="Contact NCO India - Get Support & Information | National Classification of Occupations" />
      <meta name="twitter:description" content="Contact the National Classification of Occupation (NCO) team for support, feedback, or inquiries about job classification and career services in India. Get expert assistance with NCO codes." />
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
              name: 'Contact',
              item: currentUrl
            }
          ]
        })}
      </script>

      {/* Contact Page Schema */}
      <script type="application/ld+json">
        {JSON.stringify(contactPageSchema)}
      </script>

      {/* FAQ Schema */}
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>

      {/* WebPage Schema */}
      <script type="application/ld+json">
        {JSON.stringify(webPageSchema)}
      </script>
    </Helmet>
  );
};
