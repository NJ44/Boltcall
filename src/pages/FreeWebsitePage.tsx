import React, { useEffect, useState } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { Link, useSearchParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FreeWebsiteMultiStepForm } from '@/components/ui/free-website-multistep-form';
import AnimatedNumberCountdown from '@/components/ui/countdown-number';

const FreeWebsitePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [showSurvey, setShowSurvey] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Fixed end date (2 days from launch date - doesn't reset on deploy)
  // Update the launch date below to set when the offer started
  const [endDate] = useState(() => {
    // Set the launch date to when the offer started (update this date as needed)
    // The timer will always show 2 days from this fixed date
    const launchDate = new Date('2026-01-15T00:00:00Z'); // Update this to your launch date
    const endsAt = new Date(launchDate);
    endsAt.setDate(endsAt.getDate() + 2);
    return endsAt;
  });

  useEffect(() => {
    document.title = 'Get Your Free Professional Website - Boltcall';
    updateMetaDescription('Fill out our form to get a free professional website for your business. Modern design, fast loading, and SEO optimized. Apply now.');
  }, []);
  const [referrerId, setReferrerId] = useState<string | null>(null);
  const [surveyData, setSurveyData] = useState({
    name: '',
    email: '',
    companyName: '',
    website: ''
  });
  const [allowNotifications, setAllowNotifications] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Wrapper function to handle partial form data updates
  const handleFormDataUpdate = (data: Record<string, string>) => {
    setSurveyData(prev => ({
      ...prev,
      ...data,
    }));
  };

  // Get referral ID from URL on mount
  useEffect(() => {
    const refParam = searchParams.get('ref');
    if (refParam) {
      setReferrerId(refParam);
    }
  }, [searchParams]);



  return (
    <div className="min-h-screen h-auto items-start justify-start bg-white">
      <header className="w-full py-8">
        <div className="max-w-4xl mx-auto px-4 flex justify-center">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: 'easeOut' }}>
            <Link to="/" className="block">
              <img src="/boltcall_full_logo.png" alt="Boltcall" className="h-16 w-auto" />
            </Link>
          </motion.div>
        </div>
      </header>

        <motion.div className="max-w-4xl mx-auto px-4 pb-16" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: 'easeOut', delay: 0.15 }}>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl overflow-hidden shadow-[0_35px_60px_-12px_rgba(0,0,0,0.6)]">
          {/* Left: dark panel */}
          <div className="bg-gray-900 text-white p-10 md:p-12 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-gray-400 rounded-full -ml-[8px]">
                  NEW WEBSITE IN 24 HOURS
                </span>
                <h1 className="text-[calc(1.5rem*1.1)] md:text-[calc(1.875rem*1.1)] font-extrabold text-white leading-tight">
                  <span className="text-blue-500">Free Professional</span>
                  <br />
                  <span className="text-white">Website</span>
                </h1>
              </div>

              <p className="mt-10 text-white text-base md:text-lg leading-6 max-w-md">
                Get a <span className="text-blue-500">completely free</span> professional website <span className="text-blue-500">optimized</span> to help you attract more customers.
              </p>

              {/* Website highlights */}
              <ul className="mt-6 space-y-3 text-white/90 text-[calc(0.875rem*1.1)]">
                <li className="flex items-start gap-3">
                  <Check className="w-3.5 h-3.5 mt-0.5 text-brand-blue" strokeWidth={2.5} />
                  <span>AI Receptionist</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-3.5 h-3.5 mt-0.5 text-brand-blue" strokeWidth={2.5} />
                  <span>Google reviews automatic system</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-3.5 h-3.5 mt-0.5 text-brand-blue" strokeWidth={2.5} />
                  <span>AI Visibility optimised stracture</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-3.5 h-3.5 mt-0.5 text-brand-blue" strokeWidth={2.5} />
                  <span>SEO optimized for Google ranking</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-3.5 h-3.5 mt-0.5 text-brand-blue" strokeWidth={2.5} />
                  <span>Instant forms response AI system</span>
                </li>
              </ul>
            </div>

            {/* Disclaimer removed per request */}
          </div>

          {/* Right: brand panel */}
          <div className="bg-gradient-to-b from-brand-blue to-brand-sky text-white p-10 md:p-12">
            <AnimatePresence mode="wait">
              {!showSurvey ? (
                <motion.div
                  key="countdown"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <p className="uppercase tracking-widest text-xs text-white/80 mb-4">Offer ends in:</p>
                  <div className="mt-4 scale-[0.87]">
                    <AnimatedNumberCountdown
                      endDate={endDate}
                      className="[&_span]:text-white/80 [&_div]:text-white"
                    />
                  </div>

                  <button
                    onClick={() => setShowSurvey(true)}
                    className="mt-8 inline-flex items-center justify-center px-6 py-3 bg-white text-brand-blue font-semibold rounded-md shadow hover:bg-gray-50 transition-colors"
                  >
                    Apply for Free Website
                  </button>

                  <div className="my-8 h-px w-40 bg-white/30 mx-auto" />

                  <p className="mt-10 text-xs text-white/80">©2026 Boltcall</p>
                </motion.div>
              ) : (
                <motion.div
                  key="survey"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full flex flex-col"
                >
                  <div className="flex-1 giveaway-form">
                    {!isSubmitted ? (
                      <FreeWebsiteMultiStepForm
                        formData={surveyData}
                        setFormData={handleFormDataUpdate}
                        allowNotifications={allowNotifications}
                        setAllowNotifications={setAllowNotifications}
                        onSubmit={async () => {
                          setIsSubmitting(true);
                          try {
                            // Prepare data to send to webhook
                            const referralId = referrerId || '0';
                            const payload = {
                              name: surveyData.name,
                              email: surveyData.email,
                              companyName: surveyData.companyName,
                              website: surveyData.website,
                              allowNotifications: allowNotifications,
                              referralId: referralId
                            };

                            console.log('Submitting form with payload:', payload);

                            // Call webhook
                            const response = await fetch('https://n8n.srv974118.hstgr.cloud/webhook/c4bc1f22-204e-40d1-be8d-fae0f36f3098', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify(payload),
                            });

                            console.log('Response status:', response.status);
                            
                            // Get response body first (can only read once)
                            const responseText = await response.text();
                            console.log('Response text:', responseText);
                            
                            // Check if response is ok
                            if (!response.ok) {
                              console.error('Response error:', responseText);
                              throw new Error(`Failed to submit form: ${response.status} ${response.statusText}`);
                            }

                            // Try to get referral ID from response header (may be blocked by CORS)
                            let referralIdFromHeader = null;
                            try {
                              referralIdFromHeader = response.headers.get('referal_id') || response.headers.get('referral_id');
                              console.log('Referral ID from header:', referralIdFromHeader);
                              console.log('All response headers:', Array.from(response.headers.entries()));
                            } catch (e) {
                              console.log('Could not access response headers (CORS):', e);
                            }
                            
                            // Parse response body - handle UUID string directly
                            let responseData = null;
                            let finalReferralId = referralIdFromHeader;
                            
                            if (!finalReferralId && responseText) {
                              const trimmedText = responseText.trim();
                              
                              // Check if response is a UUID string (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
                              const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                              if (uuidPattern.test(trimmedText)) {
                                // Response is directly the UUID
                                finalReferralId = trimmedText;
                                console.log('Response is UUID string:', trimmedText);
                              } else {
                                // Try to parse as JSON
                                try {
                                  responseData = JSON.parse(trimmedText);
                                  console.log('Response body (parsed as JSON):', responseData);
                                  // Try to extract ID from JSON object
                                  finalReferralId = responseData?.id || 
                                                    responseData?.referal_id || 
                                                    responseData?.referral_id ||
                                                    responseData?.userId ||
                                                    responseData?.user_id;
                                } catch (e) {
                                  // If it's not JSON and not UUID, check if it's a plain number/string ID
                                  if (trimmedText) {
                                    finalReferralId = trimmedText;
                                    console.log('Response is plain text ID:', trimmedText);
                                  } else {
                                    console.log('Response is empty or invalid');
                                  }
                                }
                              }
                            }
                            
                            console.log('Final referral ID found:', finalReferralId);
                            
                            // Form submitted successfully
                            setIsSubmitted(true);
                          } catch (error) {
                            console.error('Error submitting form:', error);
                            const errorMessage = error instanceof Error ? error.message : 'Failed to submit form. Please try again.';
                            alert(errorMessage);
                          } finally {
                            setIsSubmitting(false);
                          }
                        }}
                        isSubmitting={isSubmitting}
                        isSubmitted={isSubmitted}
                      />
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-6 flex flex-col justify-center h-full"
                      >
                        <div className="mb-4">
                          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-7 h-7 text-white" strokeWidth={2.5} />
                          </div>
                          <h3 className="text-2xl font-bold mb-2">Application Received!</h3>
                          <p className="text-white/90">
                            Thank you for your interest! We'll review your application and get back to you soon.
                          </p>
                        </div>
                        <div className="mt-4">
                          <p className="text-white/90 mb-2">In the meantime...</p>
                          <a 
                            href="https://tryboltcall.com/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-6 py-3 bg-white text-brand-blue font-semibold rounded-md shadow hover:bg-gray-50 transition-colors"
                          >
                            View Demo
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        </motion.div>
    </div>
  );
};

export default FreeWebsitePage;

