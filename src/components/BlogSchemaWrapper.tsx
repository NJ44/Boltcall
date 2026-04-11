import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { createPersonSchema, injectSchemas } from '../lib/schema';

/**
 * Layout wrapper for all blog/article routes.
 * Injects Person schema (author signal) on every blog page without
 * modifying individual page components.
 */
export default function BlogSchemaWrapper() {
  useEffect(() => {
    return injectSchemas([createPersonSchema('Boltcall Team')]);
  }, []);

  return <Outlet />;
}
