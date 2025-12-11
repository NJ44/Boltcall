import React, { useEffect } from 'react';
import { updateMetaDescription } from '../../lib/utils';
import { motion } from 'framer-motion';
import { RotateCw, TrendingUp, DollarSign, CheckCircle, ArrowRight } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import GiveawayBar from '../../components/GiveawayBar';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const LeadReactivationPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Lead Reactivation System for Cold Leads | Boltcall';
    updateMetaDescription('Lead reactivation system re-engages cold leads automatically. Send personalized messages, bring back lost customers.');
  }, []);
  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-full mb-6">
              <RotateCw className="w-4 h-4" />
              <span className="font-semibold">Lead Reactivation</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Turn Cold Leads into <span className="text-blue-600">Hot Customers</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Re-engage with past leads automatically. Send personalized messages, offer special promotions, 
              and bring back customers who didn't convert the first time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What It Is Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
              <span>What is Lead Reactivation?</span>
            </h2>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Lead Reactivation automatically re-engages with past leads who didn't convert initially. 
              It sends personalized messages, special offers, and targeted campaigns to bring cold leads 
              back into your sales funnel.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Upload your list of past leads, and the AI will create personalized reactivation campaigns 
              tailored to each lead's history, preferences, and previous interactions with your business.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why It's Important Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
              <span>Why Lead Reactivation is Critical</span>
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Unlock Hidden Revenue</h3>
                    <p className="text-gray-600">
                      Past leads represent <strong>untapped revenue potential</strong>. Many didn't convert because 
                      of timing, not lack of interest. Reactivating just 10% of past leads can add significant 
                      revenue with minimal effort. For a business with 1,000 past leads, that's 100 new opportunities.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Lower Acquisition Cost</h3>
                    <p className="text-gray-600">
                      Reactivating existing leads costs <strong>5-10x less</strong> than acquiring new ones. 
                      These leads already know your brand and have shown interest. With the right message and timing, 
                      many will convert.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <RotateCw className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Timing Changes Everything</h3>
                    <p className="text-gray-600">
                      A lead that wasn't ready 6 months ago might be ready now. Circumstances change—budgets open up, 
                      needs evolve, priorities shift. Regular reactivation ensures you're there when they're ready to buy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Helps Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
              <span>How Lead Reactivation Helps Your Business</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Recover Lost Revenue</h3>
                </div>
                <p className="text-gray-600">
                  Turn past leads into customers. Reactivate 10-20% of cold leads and recover 
                  revenue that would otherwise be lost forever.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Personalized Campaigns</h3>
                </div>
                <p className="text-gray-600">
                  AI creates personalized reactivation messages based on each lead's history, 
                  preferences, and previous interactions for maximum relevance.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Automated Workflows</h3>
                </div>
                <p className="text-gray-600">
                  Set up automated reactivation campaigns that run continuously. 
                  Upload your list once, and the system handles everything.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Track Results</h3>
                </div>
                <p className="text-gray-600">
                  Monitor reactivation rates, conversion metrics, and ROI. 
                  See which campaigns work best and optimize for better results.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Start Reactivating Leads Today</h3>
              <p className="text-blue-100 mb-6">
                Turn your past leads into new customers with automated reactivation campaigns.
              </p>
              <Link to="/coming-soon">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
              <span>How Lead Reactivation Works</span>
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Step 1: Lead List Upload
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Upload your list of past leads—this can be from your CRM, spreadsheet, email list, 
                  or any other source. The system accepts common formats (CSV, Excel) and can integrate 
                  directly with popular CRM platforms. You can upload leads manually or set up automatic 
                  syncing to continuously add new cold leads to your reactivation campaigns.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  The system analyzes each lead's information: when they first contacted you, what they 
                  were interested in, any previous interactions, and how long it's been since last 
                  contact. This analysis helps create personalized reactivation strategies for each lead.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Step 2: Campaign Creation
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  The AI creates personalized reactivation campaigns based on each lead's history and 
                  profile. Campaigns can include special offers, new service announcements, industry 
                  insights, case studies, or simply a friendly check-in. The messaging is tailored to 
                  address why the lead didn't convert initially and what might have changed.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  You can create different campaigns for different lead segments: leads who requested 
                  quotes but didn't buy, leads who scheduled consultations but didn't show, leads who 
                  showed interest but went silent, etc. Each segment gets messaging that addresses their 
                  specific situation and provides relevant value.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Step 3: Multi-Touch Campaign Execution
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Reactivation campaigns typically involve multiple touchpoints over time. The system 
                  sends a series of messages via SMS, email, or both, with each message providing 
                  different value and addressing different objections. The sequence is designed to 
                  gradually re-engage leads without being pushy or annoying.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  The timing between messages is optimized based on engagement levels. If a lead shows 
                  interest (opens emails, clicks links, responds), the system may accelerate the sequence 
                  or move them to a different track. If there's no engagement, it may slow down or 
                  pause the campaign to avoid being too aggressive.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Step 4: Response Tracking & Lead Scoring
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  The system tracks every interaction: email opens, link clicks, responses, and 
                  engagement levels. Based on this data, it scores leads to identify which ones are 
                  warming up and ready for sales outreach. Hot leads are flagged for immediate follow-up 
                  by your sales team.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  Lead scoring helps prioritize your sales efforts. Instead of treating all reactivated 
                  leads the same, you can focus on the ones showing the most interest and engagement. 
                  This improves conversion rates and makes your sales team more efficient.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Step 5: Conversion & Re-engagement
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  When a reactivated lead shows buying signals or responds positively, the system can 
                  automatically schedule calls, send special offers, or route them to your sales team 
                  with full context. The goal is to convert reactivated leads into customers while 
                  maintaining relationships with those who aren't ready yet.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  Even leads who don't convert immediately remain in your nurturing system. They may 
                  receive periodic check-ins, industry updates, or special offers, keeping your business 
                  top-of-mind for when they're ready to buy. This long-term relationship building can 
                  pay off months or years later.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
              <span>Real-World Success Stories</span>
            </h2>
            
            <div className="space-y-8">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">B2B Service Company</h3>
                <p className="text-gray-600 leading-relaxed mb-3">
                  A B2B service company had 2,000 leads in their CRM that hadn't converted over the 
                  past year. They implemented lead reactivation campaigns, sending personalized messages 
                  with industry insights, case studies, and special offers. Within 3 months, 12% of 
                  those leads (240 leads) re-engaged, and 8% (160 leads) converted into customers.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  The reactivated customers had an average deal size of $5,000, generating $800,000 in 
                  revenue from leads that were previously considered lost. The cost of the reactivation 
                  campaign was minimal compared to the revenue generated, making it one of the most 
                  profitable marketing initiatives the company had ever run.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">E-commerce Business</h3>
                <p className="text-gray-600 leading-relaxed mb-3">
                  An e-commerce business reactivated customers who had abandoned shopping carts or 
                  browsed but didn't purchase. They sent personalized messages with product 
                  recommendations, special discounts, and helpful content. 15% of reactivated leads 
                  made purchases, generating $120,000 in additional revenue over 6 months.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  The reactivation campaigns also helped identify which products and messaging resonated 
                  most with different customer segments. This insight helped improve their main marketing 
                  campaigns and product offerings, creating value beyond just reactivated sales.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Best Practices Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
              <span>Best Practices for Lead Reactivation</span>
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Provide Value, Not Just Promotions</h3>
                <p className="text-gray-600">
                  While special offers can be effective, don't rely solely on discounts. Provide valuable 
                  content like industry insights, case studies, helpful tips, or relevant news. This builds 
                  trust and positions your business as a valuable resource, not just a vendor.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Acknowledge the Gap</h3>
                <p className="text-gray-600">
                  Acknowledge that it's been a while since you last connected. This shows you're paying 
                  attention and care about the relationship. A simple "We noticed we haven't connected 
                  in a while" can be more effective than pretending the gap never happened.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Segment Your Leads</h3>
                <p className="text-gray-600">
                  Not all cold leads are the same. Segment them by interest level, previous interactions, 
                  time since last contact, or industry. Create different reactivation campaigns for each 
                  segment to maximize relevance and engagement.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Test Different Approaches</h3>
                <p className="text-gray-600">
                  Test different messaging, offers, timing, and channels to see what works best for your 
                  leads. The AI system can help optimize based on results, but manual testing and 
                  refinement can accelerate improvements.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-1 h-12 bg-blue-600 rounded-full"></div>
              <span>Frequently Asked Questions</span>
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How old can leads be for reactivation?</h3>
                <p className="text-gray-600">
                  Leads can be reactivated regardless of age. However, the approach may differ. Recent 
                  leads (1-3 months old) might need gentle re-engagement, while older leads (6+ months) 
                  might need more aggressive campaigns or different messaging. The system can adapt 
                  strategies based on lead age and history.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What if leads don't want to be contacted?</h3>
                <p className="text-gray-600">
                  The system respects opt-outs immediately. If a lead unsubscribes or requests no 
                  further contact, they're removed from reactivation campaigns. It's important to 
                  maintain positive relationships and respect preferences, even with cold leads.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How long should reactivation campaigns run?</h3>
                <p className="text-gray-600">
                  Reactivation campaigns typically run for 30-90 days with multiple touchpoints. 
                  However, the system can continue nurturing leads indefinitely with periodic check-ins 
                  if they don't convert. The key is balancing persistence with respect for the lead's 
                  preferences.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I reactivate leads from different sources?</h3>
                <p className="text-gray-600">
                  Yes. You can upload leads from any source: CRM, email lists, spreadsheets, previous 
                  campaigns, or any other source. The system can handle leads from multiple sources 
                  and create unified reactivation campaigns or separate campaigns for different sources.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LeadReactivationPage;

