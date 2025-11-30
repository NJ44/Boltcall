import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, TrendingUp, CheckCircle, XCircle, Brain, MessageSquare, AlertCircle, Building2, Phone } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';
import ReadingProgress from '../components/ReadingProgress';

const BlogWillReceptionistsBeReplacedByAI: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />
      <ReadingProgress />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-8 bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left mb-4"
          >
            <div className="inline-flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-full mb-6">
              <TrendingUp className="w-4 h-4" />
              <span className="font-semibold">Industry Analysis</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Will <span className="text-blue-600">Receptionists</span> Be Replaced by AI? The Future of Front Desk Work
            </h1>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>February 25, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>9 min read</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="prose prose-lg max-w-none mb-12"
        >
          <p className="text-xl text-gray-700 leading-relaxed font-medium">
            It's the question on every receptionist's mind: Will AI replace my job? The short answer is nuanced. While AI receptionists are transforming how businesses handle calls and customer service, they're not eliminating human receptionists entirely—they're changing the role. This analysis explores what's actually happening in the industry and what the future holds.
          </p>
        </motion.div>

        {/* The Reality Check */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>The Reality: What's Actually Happening</h2>
          
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
            <h3 className="text-2xl font-bold mb-6">Key Statistics</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold mb-2">73%</div>
                <div className="text-blue-100 text-sm">Of businesses using AI receptionists still employ human staff</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold mb-2">85%</div>
                <div className="text-blue-100 text-sm">Of receptionist tasks can be automated, but not all should be</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold mb-2">2.3M</div>
                <div className="text-blue-100 text-sm">Receptionist jobs projected to exist by 2030 (BLS)</div>
              </div>
            </div>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            The data tells a clear story: AI is augmenting receptionist work, not eliminating it. Most businesses using AI receptionists report that their human staff are now handling more complex, relationship-building tasks while AI handles routine inquiries and after-hours coverage.
          </p>
        </motion.div>

        {/* What AI Can Do */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>What AI Receptionists Excel At</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">24/7 Availability</h3>
              </div>
              <p className="text-gray-700 mb-4">
                AI never sleeps, takes breaks, or calls in sick. It can handle calls at 3 AM, on weekends, and during holidays—something human receptionists simply cannot do.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Instant response to every call</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>No overtime or shift coverage needed</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Consistent service quality</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">Routine Task Automation</h3>
              </div>
              <p className="text-gray-700 mb-4">
                AI excels at handling repetitive, rule-based tasks that don't require emotional intelligence or complex problem-solving.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Appointment scheduling</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Basic information requests</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Call routing and screening</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">Cost Efficiency</h3>
              </div>
              <p className="text-gray-700 mb-4">
                AI receptionists cost 90-97% less than human receptionists, making 24/7 coverage financially viable for small businesses.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>No salary, benefits, or training costs</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Scales without additional hiring</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Predictable monthly costs</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">Speed and Consistency</h3>
              </div>
              <p className="text-gray-700 mb-4">
                AI responds instantly and provides consistent service quality, eliminating human variables like mood, fatigue, or bad days.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>391% higher conversion when responding in 60 seconds</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>No variation in service quality</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Always follows best practices</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* What AI Cannot Do */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>Where Human Receptionists Still Excel</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Emotional Intelligence</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Humans excel at reading emotional cues, providing empathy, and building genuine relationships with customers.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Detecting frustration or distress</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Providing genuine empathy</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Building long-term relationships</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Complex Problem Solving</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Humans can think creatively, adapt to unique situations, and make judgment calls that require nuanced understanding.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Handling unusual or edge cases</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Making exceptions to policies</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Creative conflict resolution</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Physical Presence</h3>
              </div>
              <p className="text-gray-700 mb-4">
                In-person receptionists provide a human touch that's essential for certain businesses and customer experiences.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Greeting visitors in person</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Managing physical office space</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Handling physical documents or packages</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">High-Value Relationship Management</h3>
              </div>
              <p className="text-gray-700 mb-4">
                For VIP clients or complex accounts, human receptionists provide personalized attention that builds loyalty.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Remembering personal preferences</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Providing white-glove service</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Building trust through personal connection</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* The Hybrid Model */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>The Future: Hybrid AI + Human Model</h2>
          
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border-2 border-purple-200 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">How Most Businesses Are Using Both</h3>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-lg">AI Handles Routine Tasks</h4>
                    <p className="text-gray-700">
                      AI receptionists answer calls 24/7, handle basic inquiries, schedule standard appointments, and screen calls. This frees up human receptionists from repetitive work.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-lg">Humans Focus on High-Value Work</h4>
                    <p className="text-gray-700">
                      Human receptionists now spend more time on relationship-building, complex problem-solving, VIP client management, and in-person interactions. Their role becomes more strategic.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-lg">Seamless Handoffs</h4>
                    <p className="text-gray-700">
                      When AI encounters situations requiring human judgment, it smoothly transfers the call with full context, allowing humans to pick up exactly where AI left off.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
            <p className="text-lg text-gray-800">
              <strong>Result:</strong> Businesses get 24/7 coverage and cost savings from AI, while maintaining the human touch for situations that require it. Receptionists become more valuable, not less.
            </p>
          </div>
        </motion.div>

        {/* Job Market Reality */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>The Job Market Reality</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
                <h3 className="text-xl font-bold text-gray-900">What's Changing</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <XCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Fewer entry-level receptionist positions focused solely on answering phones</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Reduced demand for basic call-answering skills</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Shift toward more strategic, relationship-focused roles</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">What's Growing</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Customer relationship management roles</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>VIP client concierge positions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Hybrid roles managing both AI and human interactions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Office management and coordination roles</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Bureau of Labor Statistics Projections</h3>
            <p className="text-gray-700 mb-4">
              The BLS projects that receptionist jobs will grow 2% from 2022 to 2032, adding about 46,000 new positions. While this is slower than average, it still represents growth—not decline.
            </p>
            <p className="text-gray-700">
              The key difference: these positions will require different skills. Receptionists who adapt by developing relationship-building, problem-solving, and technology management skills will thrive.
            </p>
          </div>
        </motion.div>

        {/* What Receptionists Should Do */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>What Receptionists Should Do to Stay Relevant</h2>
          
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
            <h3 className="text-2xl font-bold mb-6">Skills to Develop</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-3">Relationship Building</h4>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• Develop emotional intelligence</li>
                  <li>• Learn customer psychology</li>
                  <li>• Build rapport quickly</li>
                  <li>• Master conflict resolution</li>
                </ul>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-3">Technology Management</h4>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• Learn to work with AI tools</li>
                  <li>• Understand CRM systems</li>
                  <li>• Master scheduling platforms</li>
                  <li>• Stay current with tech trends</li>
                </ul>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-3">Strategic Thinking</h4>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• Develop problem-solving skills</li>
                  <li>• Learn to handle exceptions</li>
                  <li>• Understand business operations</li>
                  <li>• Think beyond routine tasks</li>
                </ul>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-3">Specialization</h4>
                <ul className="space-y-2 text-blue-100 text-sm">
                  <li>• Focus on high-value clients</li>
                  <li>• Develop industry expertise</li>
                  <li>• Become a subject matter expert</li>
                  <li>• Offer concierge-level service</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Conclusion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-center gap-3">
            <div className="w-1 h-12 bg-blue-600 rounded-full"></div>The Bottom Line</h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              <strong>Will receptionists be replaced by AI?</strong> Not entirely, but the role is definitely evolving. Here's what we know:
            </p>
            
            <ul className="space-y-4 text-lg text-gray-700 mb-6">
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <span><strong>AI will handle routine tasks:</strong> Basic call answering, appointment scheduling, and information requests are increasingly automated.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <span><strong>Humans will focus on high-value work:</strong> Relationship-building, complex problem-solving, and personalized service become the core of the role.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <span><strong>The hybrid model is the future:</strong> Most successful businesses use AI for coverage and efficiency, while humans handle what requires emotional intelligence.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <span><strong>Adaptation is key:</strong> Receptionists who develop relationship-building, technology management, and strategic thinking skills will thrive in this new landscape.</span>
              </li>
            </ul>

            <p className="text-lg text-gray-700 leading-relaxed">
              The receptionist role isn't disappearing—it's becoming more valuable. By letting AI handle routine tasks, human receptionists can focus on what they do best: building relationships, solving complex problems, and providing the human touch that technology simply cannot replicate.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="my-16"
        >
          <div className="flex flex-col items-center justify-center text-center">
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-8 w-full max-w-[800px] group hover:bg-gray-50 transition duration-500 hover:duration-200">
              <div className="flex justify-center isolate">
                <div className="bg-white size-12 grid place-items-center rounded-xl relative left-2.5 top-1.5 -rotate-6 shadow-lg ring-1 ring-gray-200 group-hover:-translate-x-5 group-hover:-rotate-12 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <div className="bg-white size-12 grid place-items-center rounded-xl relative z-10 shadow-lg ring-1 ring-gray-200 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
                  <Phone className="w-6 h-6 text-blue-500" />
                </div>
                <div className="bg-white size-12 grid place-items-center rounded-xl relative right-2.5 top-1.5 rotate-6 shadow-lg ring-1 ring-gray-200 group-hover:translate-x-5 group-hover:rotate-12 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
                  <Calendar className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <h2 className="text-gray-900 font-medium mt-4 text-4xl">Fast. Simple. Scalable.</h2>
              <p className="text-base text-gray-600 mt-2 whitespace-pre-line">Launch an AI agent in 5 minutes at no cost. Connect it to all your business channels.</p>
              <Link
                to="/setup"
                className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 hover:text-gray-900 h-10 px-4 py-2 shadow-sm active:shadow-none"
              >
                Start the free setup
              </Link>
            </div>
          </div>
        </motion.div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogWillReceptionistsBeReplacedByAI;

