import { useEffect } from 'react';

type SchemaObject = Record<string, unknown>;

/**
 * Injects one or more JSON-LD schema scripts into <head> on mount and removes
 * them on unmount. Keeps schema co-located with page logic instead of scattered
 * across ad-hoc useEffect blocks.
 *
 * Usage:
 *   useSchemaInjector([{ "@type": "FAQPage", ... }, { "@type": "Product", ... }]);
 */
export function useSchemaInjector(schemas: SchemaObject[]): void {
  useEffect(() => {
    const scripts = schemas.map(schema => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
      return script;
    });
    return () => scripts.forEach(s => s.remove());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
