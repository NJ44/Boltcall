interface FAQItem {
  question: string;
  answer: string;
}

export function createFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Injects JSON-LD schema scripts into the document head.
 * Returns a cleanup function that removes the injected scripts.
 */
export function injectSchemas(schemas: Record<string, unknown>[]): () => void {
  const scripts: HTMLScriptElement[] = [];

  schemas.forEach((schema, index) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema-id', `injected-schema-${index}-${Date.now()}`);
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    scripts.push(script);
  });

  return () => {
    scripts.forEach((script) => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    });
  };
}
