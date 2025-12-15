import React, { useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { motion } from 'framer-motion';
import { Phone, Zap, Users, Target, TrendingUp, Heart, Award, Globe } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const About: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'About Boltcall - AI Receptionist Solutions | Boltcall';
    updateMetaDescription('Learn about Boltcall - revolutionizing business communication with AI. Our mission, values, and commitment to helping local businesses thrive.');
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              About <span className="text-blue-600">Boltcall</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              We're on a mission to help local businesses compete and thrive in the digital age 
              through intelligent AI-powered communication solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 flex items-start gap-3">
              <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
              <span>Our Mission</span>
            </h2>
            
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                At Boltcall, we believe that every business, regardless of size, deserves access 
                to enterprise-grade communication technology. We're democratizing AI-powered 
                customer service, making it accessible and affordable for local businesses 
                everywhere.
              </p>
              
              <p className="text-lg">
                Our mission is simple: help local businesses never miss an opportunity. Whether 
                it's a phone call at 2 AM, a form submission on a Sunday, or a text message 
                during peak hours, we ensure every customer interaction is handled professionally 
                and instantly.
              </p>
              
              <p className="text-lg">
                We understand that local businesses face unique challenges. Limited budgets, 
                staffing constraints, and the need to compete with larger corporations. That's 
                why we've built solutions that are powerful yet simple, affordable yet 
                comprehensive, and intelligent yet easy to use.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Our Values
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Customer First</h3>
                <p className="text-gray-600">
                  Every decision we make starts with our customers' success. Your growth is our 
                  success.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Simplicity</h3>
                <p className="text-gray-600">
                  Complex problems deserve simple solutions. We make powerful technology easy to 
                  use and understand.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
                <p className="text-gray-600">
                  We continuously push the boundaries of what's possible with AI, always staying 
                  ahead of the curve.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Excellence</h3>
                <p className="text-gray-600">
                  We're committed to delivering the highest quality solutions and support to 
                  every customer.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 flex items-start gap-3">
              <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
              <span>What We Do</span>
            </h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Phone className="w-6 h-6 text-blue-600" />
                  AI Receptionist Services
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  We provide intelligent AI receptionists that answer calls 24/7, handle customer 
                  inquiries, schedule appointments, and qualify leads—all automatically. Our AI 
                  never sleeps, never gets tired, and never misses a call.
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-blue-600" />
                  Instant Lead Response
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  We ensure every form submission, text message, and inquiry gets an instant 
                  response. Research shows that responding within 60 seconds increases conversion 
                  rates by 391%—we make that possible for every business.
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  Business Growth Tools
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Beyond communication, we provide tools for lead reactivation, automated 
                  reminders, follow-up systems, and website optimization. Everything you need 
                  to grow your business in one platform.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why We Started Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 flex items-start gap-3">
              <div className="w-1 self-stretch bg-blue-600 rounded-full"></div>
              <span>Why We Started</span>
            </h2>
            
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                Boltcall was born from a simple observation: local businesses were losing 
                customers because they couldn't compete with the 24/7 availability and instant 
                response times that customers have come to expect.
              </p>
              
              <p className="text-lg">
                We saw small businesses struggling with missed calls, unanswered forms, and 
                the high costs of hiring receptionists. We saw the frustration of business 
                owners who wanted to provide excellent customer service but lacked the resources 
                to do so consistently.
              </p>
              
              <p className="text-lg">
                We realized that AI technology had advanced to the point where it could solve 
                these problems—but existing solutions were either too expensive, too complex, 
                or designed for large enterprises. So we built Boltcall: AI-powered communication 
                solutions designed specifically for local businesses.
              </p>
              
              <p className="text-lg">
                Today, thousands of businesses trust Boltcall to handle their customer 
                communication. From dental practices to legal firms, from home services to 
                healthcare providers—we're helping businesses of all types compete and thrive 
                in the digital age.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="my-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-8 w-full max-w-[800px] group hover:bg-gray-50 transition duration-500 hover:duration-200">
            <div className="flex justify-center isolate">
              <div className="bg-white size-12 grid place-items-center rounded-xl relative left-2.5 top-1.5 -rotate-6 shadow-lg ring-1 ring-gray-200 group-hover:-translate-x-5 group-hover:-rotate-12 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div className="bg-white size-12 grid place-items-center rounded-xl relative z-10 shadow-lg ring-1 ring-gray-200 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
                <Phone className="w-6 h-6 text-blue-500" />
              </div>
              <div className="bg-white size-12 grid place-items-center rounded-xl relative right-2.5 top-1.5 rotate-6 shadow-lg ring-1 ring-gray-200 group-hover:translate-x-5 group-hover:rotate-12 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
                <Globe className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <h2 className="text-gray-900 font-medium mt-4 text-4xl">Ready to Get Started?</h2>
            <p className="text-base text-gray-600 mt-2 whitespace-pre-line">Join thousands of businesses using Boltcall to transform their customer communication.</p>
            <Link
              to="/coming-soon"
              className="inline-block mt-6"
            >
              <Button
                variant="primary"
                size="lg"
              >
                Start Free Setup
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default About;

