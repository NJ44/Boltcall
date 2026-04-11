/**
 * JSON-LD schema factories and injector for SEO/AEO.
 * Usage in page components:
 *
 *   useEffect(() => {
 *     return injectSchemas([
 *       createArticleSchema({ headline: '...', description: '...', datePublished: '2026-01-01', url: '/blog/my-post' }),
 *       createFAQSchema([{ question: '...', answer: '...' }]),
 *     ]);
 *   }, []);
 */

interface ArticleConfig {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  url: string;
  image?: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

export function createArticleSchema(config: ArticleConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: config.headline,
    description: config.description,
    author: { '@type': 'Organization', name: 'Boltcall', url: 'https://boltcall.org' },
    publisher: {
      '@type': 'Organization',
      name: 'Boltcall',
      logo: { '@type': 'ImageObject', url: 'https://boltcall.org/boltcall_full_logo.png' },
    },
    datePublished: config.datePublished,
    dateModified: config.dateModified ?? config.datePublished,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://boltcall.org${config.url}` },
    image: config.image
      ? { '@type': 'ImageObject', url: config.image }
      : { '@type': 'ImageObject', url: 'https://boltcall.org/og-image.jpg' },
  };
}

export function createFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

interface ServiceConfig {
  name: string;
  description: string;
  url: string;
}

interface ProductConfig {
  name: string;
  description: string;
  image: string;
  url: string;
  price?: string;
  priceCurrency?: string;
}

export function createServiceSchema(config: ServiceConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: config.name,
    description: config.description,
    provider: {
      '@type': 'Organization',
      name: 'Boltcall',
      url: 'https://boltcall.org',
    },
    url: `https://boltcall.org${config.url}`,
  };
}

export function createProductSchema(config: ProductConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: config.name,
    description: config.description,
    image: config.image,
    url: `https://boltcall.org${config.url}`,
    brand: { '@type': 'Organization', name: 'Boltcall' },
    offers: {
      '@type': 'Offer',
      priceCurrency: config.priceCurrency ?? 'USD',
      price: config.price ?? '0',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Boltcall' },
    },
  };
}


interface BreadcrumbItem {
  name: string;
  url: string;
}

export function createBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `https://boltcall.org${item.url}`,
    })),
  };
}

export function createPersonSchema(name: string, url?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url: url ?? 'https://boltcall.org',
  };
}

/**
 * Inject one or more JSON-LD schema objects into <head>.
 * Returns a cleanup function suitable for useEffect.
 */
export function injectSchemas(schemas: Record<string, unknown>[]): () => void {
  const elements: HTMLScriptElement[] = [];

  schemas.forEach((schema, i) => {
    const id = `schema-${(schema['@type'] as string || 'unknown').toLowerCase()}-${i}`;
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    elements.push(script);
  });

  return () => {
    elements.forEach((el) => {
      if (el.parentNode) el.parentNode.removeChild(el);
    });
  };
}
