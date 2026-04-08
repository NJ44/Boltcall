import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const AeoGlobalIntro: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const contentExact = new Set([
    '/blog',
    '/comparisons',
    '/pricing',
    '/documentation',
    '/help-center',
    '/about',
    '/contact',
    '/partners',
  ]);
  const contentPrefixes = ['/blog/', '/comparisons/', '/compare/'];
  const serviceSchemaRoutes = new Set([
    '/strike-ai',
    '/about',
    '/features/lead-reactivation',
    '/features/smart-website',
    '/tools/vet-clinic-revenue-calculator',
    '/features/automated-reminders',
    '/contact',
    '/conversion-rate-optimizer',
    '/newsletter',
    '/ai-visibility-check',
    '/tools/chiropractor-patient-recovery-calculator',
    '/tools/solar-quote-generator',
    '/speed-test',
    '/tools/dentist-chair-calculator',
    '/business-audit',
    '/pricing',
    '/features/instant-form-reply',
    '/tools/medspa-rebooking-calculator',
    '/tools/auto-repair-missed-call-calculator',
    '/tools/hvac-overflow-calculator',
    '/features/sms-booking-assistant',
    '/rank-on-google-offer',
    '/features/ai-follow-up-system',
    '/features/website-widget',
    '/tools/solar-profit-calculator',
    '/seo-audit',
    '/tools/lawyer-intake-calculator',
    '/ai-revenue-audit',
    '/features/ai-receptionist',
  ]);

  const isComparisonsRoute =
    path === '/comparisons' || path.startsWith('/comparisons/') || path.startsWith('/compare/');
  const isBlogRoute = path === '/blog' || path.startsWith('/blog/');
  const isContentPage =
    contentExact.has(path) || contentPrefixes.some((prefix) => path.startsWith(prefix));
  const shouldShow = isContentPage;

  const title = isComparisonsRoute ? 'Comparison Summary' : 'Page Summary';

  const tldrText = isComparisonsRoute
    ? "This page compares Boltcall's AI receptionist with traditional call centers, human receptionists, voicemail systems, and answering services, focusing on cost, reliability, speed, and conversion impact."
    : isBlogRoute
      ? "This article explains how Boltcall's AI receptionist helps local businesses improve response speed, reduce missed leads, and automate follow-ups with less manual overhead."
      : "This page explains how Boltcall helps local businesses automate customer communication, capture more leads, and improve response quality with AI-powered workflows.";
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    if (!shouldShow) {
      return;
    }

    const headline = document.title || 'Boltcall Article';
    const canonical = `https://boltcall.org${path}`;
    const today = new Date().toISOString().split('T')[0];

    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline,
      author: {
        '@type': 'Organization',
        name: 'Boltcall Team',
      },
      datePublished: today,
      image: 'https://boltcall.org/og-image.jpg',
      mainEntityOfPage: canonical,
    };

    const pathParts = path.split('/').filter(Boolean);
    const breadcrumbItems = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://boltcall.org',
      },
      ...pathParts.map((segment, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        item: `https://boltcall.org/${pathParts.slice(0, index + 1).join('/')}`,
      })),
    ];

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems,
    };

    const articleScriptId = 'aeo-global-article-schema';
    const breadcrumbScriptId = 'aeo-global-breadcrumb-schema';

    const existingArticle = document.getElementById(articleScriptId);
    if (existingArticle) existingArticle.remove();
    const existingBreadcrumb = document.getElementById(breadcrumbScriptId);
    if (existingBreadcrumb) existingBreadcrumb.remove();

    const articleScript = document.createElement('script');
    articleScript.id = articleScriptId;
    articleScript.type = 'application/ld+json';
    articleScript.text = JSON.stringify(articleSchema);
    document.head.appendChild(articleScript);

    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.id = breadcrumbScriptId;
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.text = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(breadcrumbScript);

    return () => {
      articleScript.remove();
      breadcrumbScript.remove();
    };
  }, [path, shouldShow]);

  useEffect(() => {
    if (!serviceSchemaRoutes.has(path)) {
      return;
    }

    const serviceSchemaId = 'aeo-global-service-schema';
    const existing = document.getElementById(serviceSchemaId);
    if (existing) existing.remove();

    const pageTitle = document.title || 'Boltcall Service';
    const metaDescription =
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute('content') ||
      "Boltcall provides AI-powered business automation services for local businesses.";

    const serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: pageTitle,
      description: metaDescription,
      provider: {
        '@type': 'Organization',
        name: 'Boltcall',
        url: 'https://boltcall.org',
      },
    };

    const script = document.createElement('script');
    script.id = serviceSchemaId;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(serviceSchema);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [path]);

  if (!shouldShow) {
    return null;
  }

  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isComparisonsRoute && (
          <p className="text-sm text-gray-800 mb-3">
            This page compares Boltcall's AI receptionist with traditional call centers, human receptionists, and other answering services, highlighting the advantages and disadvantages of each option.
          </p>
        )}
        <p className="text-sm text-gray-600 mb-2">Written by the Boltcall Team</p>
        <p className="text-xs text-gray-500 mb-3">Last updated: {lastUpdated}</p>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
          <p className="text-xs font-semibold text-blue-700 mb-1">TL;DR</p>
          <p className="text-sm text-gray-800">{tldrText}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <span className="font-semibold">Q:</span> How does Boltcall ensure quality responses?
              {' '}
              <span className="font-semibold">A:</span> Boltcall uses trained AI workflows and business-specific context to provide consistent, accurate replies.
            </p>
            <p>
              <span className="font-semibold">Q:</span> Is Boltcall only for calls?
              {' '}
              <span className="font-semibold">A:</span> No. Boltcall supports calls, lead capture, and follow-up automation across multiple channels.
            </p>
            <p>
              <span className="font-semibold">Q:</span> Where can I see more comparisons?
              {' '}
              <span className="font-semibold">A:</span> Visit
              {' '}
              <Link className="text-blue-600 hover:text-blue-700" to="/comparisons">
                /comparisons
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="mt-5 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Sources & Citations</h3>
          <ul className="space-y-1 text-sm text-gray-700 list-disc pl-5">
            <li>
              <a
                href="https://hbr.org/2011/03/the-short-life-of-online-sales-leads"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-700"
              >
                Harvard Business Review: The Short Life of Online Sales Leads
              </a>
              {' '}
              (speed-to-lead and response-time impact)
            </li>
            <li>
              <a
                href="https://www.salesforce.com/resources/research-reports/state-of-the-connected-customer/"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-700"
              >
                Salesforce: State of the Connected Customer
              </a>
              {' '}
              (customer service and response expectations)
            </li>
            <li>
              <a
                href="https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/the-state-of-ai"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-700"
              >
                McKinsey: The State of AI
              </a>
              {' '}
              (AI adoption and operational impact)
            </li>
            <li>
              <a
                href="https://www.brightlocal.com/research/local-consumer-review-survey/"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-700"
              >
                BrightLocal: Local Consumer Review Survey
              </a>
              {' '}
              (local business trust and customer behavior)
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AeoGlobalIntro;

