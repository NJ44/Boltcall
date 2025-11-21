import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Calendar, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import GiveawayBar from '../../components/GiveawayBar';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const SMSBookingAssistantPage: React.FC = () => {
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
              <MessageSquare className="w-4 h-4" />
              <span className="font-semibold">SMS Booking Assistant</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Book Appointments via <span className="text-blue-600">SMS</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Let customers book, reschedule, and manage appointments through simple text messages. 
              Your SMS Booking Assistant handles everything automatically.
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">What is SMS Booking Assistant?</h2>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              SMS Booking Assistant enables your customers to book, reschedule, and manage appointments 
              entirely through text messages. No phone calls, no website visits, no apps—just simple, 
              convenient SMS conversations.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Your AI assistant handles availability checks, confirms appointments, sends reminders, 
              and manages cancellations—all through natural text conversations that feel like texting a friend.
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Why SMS Booking is Critical</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">SMS is Preferred</h3>
                <p className="text-gray-600">
                  <strong>98% of text messages are opened</strong>, compared to just 20% of emails. 
                  Customers prefer SMS for quick, convenient communication. By offering SMS booking, 
                  you're meeting customers where they already are.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Reduce No-Shows</h3>
                <p className="text-gray-600">
                  SMS reminders have a <strong>45% higher response rate</strong> than phone calls or emails. 
                  Automated SMS reminders significantly reduce no-shows, protecting your revenue and 
                  ensuring better schedule utilization.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Save Time</h3>
                <p className="text-gray-600">
                  Eliminate back-and-forth phone calls and emails. Customers can book in seconds via text, 
                  and you save hours of administrative work. <strong>Automate 80% of your booking process</strong> 
                  with SMS Booking Assistant.
                </p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">How SMS Booking Helps Your Business</h2>
            
            <div className="space-y-6 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Booking</h3>
                <p className="text-gray-600">
                  Customers can book appointments anytime, even when your business is closed. 
                  No more missed opportunities due to limited hours.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Confirmations</h3>
                <p className="text-gray-600">
                  Send immediate booking confirmations via SMS. Customers get instant peace of mind, 
                  and you reduce confusion and cancellations.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Automated Reminders</h3>
                <p className="text-gray-600">
                  Reduce no-shows with automated SMS reminders sent before appointments. 
                  Customers can confirm, reschedule, or cancel with a simple text reply.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Calendar Sync</h3>
                <p className="text-gray-600">
                  All bookings automatically sync with your calendar system. No double-booking, 
                  no manual entry, no scheduling conflicts.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Start Booking via SMS Today</h3>
              <p className="text-blue-100 mb-6">
                Make appointment booking effortless for your customers and yourself.
              </p>
              <Link to="/setup">
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

      <Footer />
    </div>
  );
};

export default SMSBookingAssistantPage;

