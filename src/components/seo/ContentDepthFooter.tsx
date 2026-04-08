import React from 'react';
import { useLocation } from 'react-router-dom';

const exactRoutes = new Set([
  '/',
  '/about',
  '/contact',
  '/pricing',
  '/documentation',
  '/help-center',
  '/newsletter',
  '/conversion-rate-optimizer',
  '/ai-visibility-check',
  '/speed-test',
  '/business-audit',
  '/ai-revenue-audit',
  '/seo-audit',
  '/seo-aeo-audit',
  '/free-website',
  '/solar-speed-playbook',
  '/funnel-optimizer',
  '/ai-readiness-scorecard',
  '/rank-on-google-offer',
  '/ai-agent-comparison',
  '/giveaway',
  '/ai-receptionist-roi',
  '/blog',
  '/comparisons',
  '/strike-ai',
  '/challenge',
]);

const prefixRoutes = [
  '/blog/',
  '/comparisons/',
  '/compare/',
  '/tools/',
  '/features/',
  '/ai-guide-for-businesses',
];

const excludedPrefixes = ['/dashboard', '/setup', '/auth/', '/admin', '/payment/'];
const excludedExact = new Set(['/login', '/signup']);

const ContentDepthFooter: React.FC = () => {
  const { pathname } = useLocation();

  const isExcluded =
    excludedExact.has(pathname) ||
    excludedPrefixes.some((prefix) => pathname.startsWith(prefix));

  const shouldShow =
    !isExcluded &&
    (exactRoutes.has(pathname) || prefixRoutes.some((prefix) => pathname.startsWith(prefix)));

  if (!shouldShow) return null;

  return (
    <section className="bg-white border-t border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Additional Page Context</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            This page is part of Boltcall&apos;s public resource library for AI receptionist
            implementation, lead response optimization, and customer communication automation.
            Content is written for local business operators who need practical, fast-to-apply
            guidance across calls, forms, booking flows, and follow-up systems.
          </p>
          <p>
            Boltcall content focuses on measurable business outcomes: faster response times, reduced
            missed opportunities, more reliable customer handling, and clearer operational workflows.
            Where relevant, pages include comparisons, implementation trade-offs, and examples to help
            teams choose tools and processes that fit their business model.
          </p>
          <p>
            To keep information useful for both users and AI-assisted search experiences, pages are
            periodically reviewed for clarity, updated language, and coverage of common objections.
            Supporting references and structured metadata are used where appropriate to improve
            discoverability and answer quality.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContentDepthFooter;

