/**
 * Shared helper to calculate KB completeness score and missing items.
 * Used by StepKnowledge (banner) and WizardShell (warning toast).
 */

export interface KBCompletenessResult {
  score: number;
  items: Array<{
    label: string;
    hint: string;
    done: boolean;
  }>;
}

export function calculateKBCompleteness(
  businessProfile: { businessName?: string; websiteUrl?: string },
  knowledgeBase: {
    services: Array<{ name: string }>;
    faqs: Array<{ question: string }>;
    policies: { cancellation: string; reschedule: string; deposit: string };
    uploadedFiles: Array<{ name: string }>;
  }
): KBCompletenessResult {
  const hasBusinessName = !!businessProfile.businessName?.trim();
  const hasWebsite = !!businessProfile.websiteUrl?.trim();
  const hasServices = knowledgeBase.services.some((s) => s.name.trim().length > 0);
  const hasFaqs = knowledgeBase.faqs.some((f) => f.question.trim().length > 0);
  const hasPolicies =
    !!knowledgeBase.policies.cancellation?.trim() ||
    !!knowledgeBase.policies.reschedule?.trim() ||
    !!knowledgeBase.policies.deposit?.trim();
  const hasFiles = knowledgeBase.uploadedFiles.length > 0;

  let score = 0;
  if (hasBusinessName) score += 10;
  if (hasWebsite) score += 20;
  if (hasServices) score += 20;
  if (hasFaqs) score += 20;
  if (hasPolicies) score += 15;
  if (hasFiles) score += 15;

  const items = [
    { label: 'Business name', hint: '', done: hasBusinessName },
    { label: 'Website URL', hint: 'AI auto-learns from your site', done: hasWebsite },
    { label: 'Services', hint: 'so AI can quote prices', done: hasServices },
    { label: 'FAQs', hint: 'instant answers to common questions', done: hasFaqs },
    { label: 'Policies', hint: 'cancellation, reschedule, deposit', done: hasPolicies },
    { label: 'Documents uploaded', hint: 'menu, brochure, etc.', done: hasFiles },
  ];

  return { score, items };
}
