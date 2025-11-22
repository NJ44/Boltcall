import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Facebook, Check, ArrowRight, Loader2 } from 'lucide-react';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { motion, AnimatePresence } from 'framer-motion';

const GiveawayPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showSurvey, setShowSurvey] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referralLink, setReferralLink] = useState('');
  const [referrerId, setReferrerId] = useState<string | null>(null);
  const [surveyData, setSurveyData] = useState({
    name: '',
    email: '',
    companyName: '',
    website: '',
    whyChoose: ''
  });
  const [allowNotifications, setAllowNotifications] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get referral ID from URL on mount
  useEffect(() => {
    const refParam = searchParams.get('ref');
    if (refParam) {
      setReferrerId(refParam);
    }
  }, [searchParams]);

  const generateReferralLink = (userId: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://boltcall.org';
    return `${baseUrl}/giveaway?ref=${userId}`;
  };
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://boltcall.com/giveaway';
  const shareText = encodeURIComponent("I'm entering Boltcall's giveaway — if either of us wins, we both win! Join here:");
  const encodedUrl = encodeURIComponent(shareUrl);
  const twitterHref = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  useEffect(() => {
    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + 14); // 14 days from now
    const target = endsAt.getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(target - now, 0);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AuroraBackground className="min-h-screen h-auto items-start justify-start bg-white">
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
              <h1 className="text-3xl md:text-4xl font-extrabold text-white flex items-center gap-3 flex-wrap">
                <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-gray-400 rounded-full">
                  Limited Time Black Friday
                </span>
                <span className="text-white">3 Months</span> <span className="text-blue-500">Pro Plan</span> <span className="text-white">+</span> <span className="text-blue-500">smart website</span> <span className="text-white">package</span>
              </h1>

              <p className="mt-10 text-white text-base md:text-lg leading-6 max-w-md">
                We're rewarding one lucky winner with <span className="text-blue-500">3 months</span> of our <span className="text-blue-500">Pro plan</span> plus a complete <span className="text-blue-500">website package</span>.
              </p>

              {/* Prize highlights */}
              <ul className="mt-6 space-y-3 text-white/90 text-sm">
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 mt-0.5 text-brand-blue" />
                  <span>AI Receptionist</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 mt-0.5 text-brand-blue" />
                  <span>SMS messaging</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 mt-0.5 text-brand-blue" />
                  <span>Instant form replies</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 mt-0.5 text-brand-blue" />
                  <span>Instant follow-ups</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 mt-0.5 text-brand-blue" />
                  <span>Plus more bonuses</span>
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
                  <p className="uppercase tracking-widest text-xs text-white/80">Giveaway ends in:</p>
                  <div className="mt-4 flex items-center justify-center gap-6">
                    {[
                      { label: 'days', value: timeLeft.days },
                      { label: 'hours', value: timeLeft.hours },
                      { label: 'mins', value: timeLeft.minutes },
                      { label: 'secs', value: timeLeft.seconds },
                    ].map((t) => (
                      <div key={t.label} className="text-center">
                        <div className="text-3xl font-extrabold leading-none">{t.value}</div>
                        <div className="text-[10px] uppercase tracking-widest opacity-80">{t.label}</div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowSurvey(true)}
                    className="mt-8 inline-flex items-center justify-center px-6 py-3 bg-white text-brand-blue font-semibold rounded-md shadow hover:bg-gray-50 transition-colors"
                  >
                    Enter Giveaway
                  </button>

                  <div className="my-8 h-px w-40 bg-white/30 mx-auto" />

                  <div className="text-sm md:text-base opacity-90">Share the giveaway on your socials for a higher chance to win!</div>
                  <div className="mt-4 flex items-center justify-center gap-2.5 px-2">
                    <a
                      href={twitterHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on X (Twitter)"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white hover:bg-white/20 transition"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.49 11.24H16.29l-5.486-7.163-6.272 7.163H1.223l7.73-8.833L.75 2.25h6.043l4.957 6.51 6.494-6.51zm-1.158 19.5h1.833L7.01 3.89H5.048l12.038 17.86z"/></svg>
                    </a>
                    <a
                      href={facebookHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on Facebook"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white hover:bg-white/20 transition"
                    >
                      <Facebook className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={linkedinHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on LinkedIn"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white hover:bg-white/20 transition"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5" fill="currentColor"><path d="M4.983 3.5C4.983 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.483 1.12 2.483 2.5zM.25 8.25h4.5v15.5H.25zM8.75 8.25h4.31v2.12h.06c.6-1.14 2.06-2.34 4.24-2.34 4.53 0 5.37 2.98 5.37 6.85v7.88h-4.5v-6.98c0-1.66-.03-3.8-2.31-3.8-2.31 0-2.67 1.8-2.67 3.66v7.12h-4.5z"/></svg>
                    </a>
                  </div>

                  <div className="my-8 h-px w-40 bg-white/30 mx-auto" />

                  <div className="text-sm opacity-90">Send the post to this email: <a href="mailto:noamj@boltcall.org" className="underline hover:opacity-80">noamj@boltcall.org</a></div>

                  <p className="mt-10 text-xs text-white/80">©{new Date().getFullYear()} Boltcall</p>
                </motion.div>
              ) : (
                <motion.div
                  key="survey"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full flex flex-col"
                >
                  <div className="flex-1">
                    {currentStep === 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-medium mb-2 text-white">Name</label>
                          <input
                            type="text"
                            value={surveyData.name}
                            onChange={(e) => setSurveyData({ ...surveyData, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Your full name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-white">Email Address</label>
                          <input
                            type="email"
                            value={surveyData.email}
                            onChange={(e) => setSurveyData({ ...surveyData, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="your@email.com"
                          />
                        </div>
                        <button
                          onClick={() => {
                            if (surveyData.email && surveyData.name) setCurrentStep(2);
                          }}
                          disabled={!surveyData.email || !surveyData.name}
                          className="mt-6 w-full px-6 py-3 bg-white text-brand-blue font-semibold rounded-md shadow hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          Continue
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-medium mb-2 text-white">Company Name</label>
                          <input
                            type="text"
                            value={surveyData.companyName}
                            onChange={(e) => setSurveyData({ ...surveyData, companyName: e.target.value })}
                            className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Your Company Name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-white">Website</label>
                          <input
                            type="url"
                            value={surveyData.website}
                            onChange={(e) => setSurveyData({ ...surveyData, website: e.target.value })}
                            className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="https://yourwebsite.com"
                          />
                        </div>
                        <div className="flex gap-3 mt-6">
                          <button
                            onClick={() => setCurrentStep(1)}
                            className="flex-1 px-6 py-3 bg-white/10 text-white font-semibold rounded-md border border-white/30 hover:bg-white/20 transition-colors"
                          >
                            Back
                          </button>
                          <button
                            onClick={() => {
                              if (surveyData.companyName && surveyData.website) setCurrentStep(3);
                            }}
                            disabled={!surveyData.companyName || !surveyData.website}
                            className="flex-1 px-6 py-3 bg-white text-brand-blue font-semibold rounded-md shadow hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            Continue
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {!isSubmitted ? (
                      <>
                        {currentStep === 3 && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                          >
                            <div>
                              <label className="block text-sm font-medium mb-2 text-white">Why do you think we need to choose you?</label>
                              <textarea
                                value={surveyData.whyChoose}
                                onChange={(e) => setSurveyData({ ...surveyData, whyChoose: e.target.value })}
                                rows={6}
                                className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                placeholder="Tell us why you should win..."
                              />
                            </div>
                            <div className="flex items-start gap-3 mt-4 p-4 bg-white/5 rounded-lg border border-white/20">
                              <div className="relative mt-0.5">
                                <input
                                  type="checkbox"
                                  id="allowNotifications"
                                  checked={allowNotifications}
                                  onChange={(e) => setAllowNotifications(e.target.checked)}
                                  className="sr-only"
                                />
                                <label
                                  htmlFor="allowNotifications"
                                  className={`flex items-center justify-center w-5 h-5 rounded border-2 cursor-pointer transition-all ${
                                    allowNotifications
                                      ? 'bg-blue-600 border-blue-600'
                                      : 'bg-white/10 border-white/40'
                                  }`}
                                >
                                  {allowNotifications && (
                                    <Check className="w-3.5 h-3.5 text-white" />
                                  )}
                                </label>
                              </div>
                              <label htmlFor="allowNotifications" className="text-sm text-white/95 cursor-pointer leading-relaxed flex-1">
                                I allow you to send me notifications about the giveaway
                              </label>
                            </div>
                            <div className="flex gap-3 mt-6">
                              <button
                                onClick={() => setCurrentStep(2)}
                                className="flex-1 px-6 py-3 bg-white/10 text-white font-semibold rounded-md border border-white/30 hover:bg-white/20 transition-colors"
                              >
                                Back
                              </button>
                              <button
                                onClick={async () => {
                                  if (surveyData.whyChoose) {
                                    setIsSubmitting(true);
                                    try {
                                      // Prepare data to send to webhook
                                      const referralId = referrerId || '0';
                                      const payload = {
                                        name: surveyData.name,
                                        email: surveyData.email,
                                        companyName: surveyData.companyName,
                                        website: surveyData.website,
                                        whyChoose: surveyData.whyChoose,
                                        allowNotifications: allowNotifications,
                                        referralId: referralId
                                      };

                                      // Call webhook
                                      const response = await fetch('https://n8n.srv974118.hstgr.cloud/webhook/9b2699f0-f411-4a5d-911d-5d562fd0b828', {
                                        method: 'POST',
                                        headers: {
                                          'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(payload),
                                      });

                                      if (!response.ok) {
                                        throw new Error('Failed to submit form');
                                      }

                                      // Get the referral ID from response header
                                      const referralIdFromHeader = response.headers.get('referal_id');
                                      
                                      if (referralIdFromHeader) {
                                        // Generate referral link using the ID from header: ref={referralIdFromHeader}
                                        const link = generateReferralLink(referralIdFromHeader);
                                        setReferralLink(link);
                                        setIsSubmitted(true);
                                      } else {
                                        console.error('No referal_id in response headers');
                                        throw new Error('No referral ID returned from webhook');
                                      }
                                    } catch (error) {
                                      console.error('Error submitting form:', error);
                                      alert('Failed to submit form. Please try again.');
                                    } finally {
                                      setIsSubmitting(false);
                                    }
                                  }
                                }}
                                disabled={!surveyData.whyChoose || isSubmitting}
                                className="flex-1 px-6 py-3 bg-white text-brand-blue font-semibold rounded-md shadow hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                              >
                                {isSubmitting ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Submitting...</span>
                                  </>
                                ) : (
                                  'Submit'
                                )}
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-6"
                      >
                        <div className="mb-4">
                          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                          <p className="text-white/90">
                            Your entry has been submitted successfully. We'll be in touch soon!
                          </p>
                        </div>

                        <div className="bg-white/10 rounded-lg p-4 border border-white/30">
                          <p className="text-sm font-medium mb-3">Your Referral Link</p>
                          <div className="flex items-center gap-2 mb-3">
                            <input
                              type="text"
                              readOnly
                              value={referralLink}
                              className="flex-1 px-3 py-2 rounded-md bg-white/10 border border-white/30 text-white text-sm focus:outline-none"
                            />
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(referralLink);
                                // You could add a toast notification here
                              }}
                              className="px-4 py-2 bg-white text-brand-blue font-semibold rounded-md hover:bg-gray-50 transition-colors text-sm whitespace-nowrap"
                            >
                              Copy
                            </button>
                          </div>
                          <p className="text-base text-white/90 mt-2 font-medium">
                            Share this link with a friend. If one of you wins, you both win a prize
                          </p>
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
    </AuroraBackground>
  );
};

export default GiveawayPage;
