import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Phone, Calendar } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import GiveawayBar from '../../components/GiveawayBar';
import { Link } from 'react-router-dom';

const SMSBookingAssistantPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
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
              <MessageSquare className="w-4 h-4" />
              <span className="font-semibold">SMS Booking Assistant</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight flex items-center justify-center gap-3">
              <div className="w-1 h-16 bg-blue-600 rounded-full"></div>
              <span>Book Appointments via <span className="text-blue-600">SMS</span></span>
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What is SMS Booking Assistant?
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                SMS Booking Assistant enables your customers to book, reschedule, and manage appointments 
                entirely through text messages. No phone calls, no website visits, no apps—just simple, 
                convenient SMS conversations that work on any phone, regardless of the device or carrier.
              </p>
              <p className="text-lg">
                Your AI assistant handles availability checks, confirms appointments, sends reminders, 
                and manages cancellations—all through natural text conversations that feel like texting a friend. 
                The system understands natural language, so customers can express their preferences in their own words, 
                and the AI will interpret and respond appropriately.
              </p>
              <p className="text-lg">
                The booking process is seamless and intuitive. Customers simply text your business number, 
                and the AI guides them through the booking process step by step. It can check your calendar 
                availability in real-time, suggest optimal appointment times, handle rescheduling requests, 
                and even manage cancellations—all automatically.
              </p>
              <p className="text-lg">
                This SMS-based approach eliminates the friction of traditional booking methods. Customers 
                don't need to download apps, navigate websites, or wait on hold. They can book appointments 
                from anywhere, at any time, using the communication method they're most comfortable with.
              </p>
            </div>
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Why SMS Booking is Critical
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  SMS is Preferred
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  <strong>98% of text messages are opened</strong>, compared to just 20% of emails. 
                  Customers prefer SMS for quick, convenient communication. By offering SMS booking, 
                  you're meeting customers where they already are.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  SMS has become the preferred communication channel for many customers because it's immediate, 
                  personal, and doesn't require internet connectivity. Unlike emails that can get lost in spam 
                  folders or apps that require downloads, SMS works on every phone and gets immediate attention. 
                  This high engagement rate means your booking messages are more likely to be seen and acted upon.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  Reduce No-Shows
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  SMS reminders have a <strong>45% higher response rate</strong> than phone calls or emails. 
                  Automated SMS reminders significantly reduce no-shows, protecting your revenue and 
                  ensuring better schedule utilization.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  No-shows cost businesses thousands of dollars annually in lost revenue and wasted time. 
                  SMS reminders sent 24 hours and 2 hours before appointments dramatically reduce no-show rates 
                  by keeping appointments top-of-mind for customers. The convenience of SMS also makes it easy 
                  for customers to confirm, reschedule, or cancel if needed, reducing last-minute cancellations.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  Save Time
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Eliminate back-and-forth phone calls and emails. Customers can book in seconds via text, 
                  and you save hours of administrative work. <strong>Automate 80% of your booking process</strong> 
                  with SMS Booking Assistant.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  Traditional booking methods require multiple touchpoints: phone calls, emails, calendar checks, 
                  and confirmations. Each interaction takes time and creates opportunities for errors or miscommunication. 
                  SMS booking streamlines this entire process into a single, automated conversation that handles 
                  everything from initial inquiry to final confirmation, freeing up your staff to focus on delivering 
                  excellent service rather than managing schedules.
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              How SMS Booking Helps Your Business
            </h2>
            
            <div className="space-y-6 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  24/7 Booking
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Customers can book appointments anytime, even when your business is closed. 
                  No more missed opportunities due to limited hours. This 24/7 availability means 
                  you capture bookings from customers who research and make decisions outside of 
                  traditional business hours.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  Many customers prefer to book appointments during evenings, weekends, or other times 
                  when they're not at work. By offering SMS booking that works around the clock, you 
                  never miss an opportunity to capture a booking, regardless of when the customer decides 
                  to reach out.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  Instant Confirmations
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Send immediate booking confirmations via SMS. Customers get instant peace of mind, 
                  and you reduce confusion and cancellations. The confirmation includes all relevant 
                  details: date, time, location, and any special instructions.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  Instant confirmations are crucial for customer satisfaction. When customers book an 
                  appointment, they want immediate reassurance that their booking was successful. SMS 
                  confirmations provide this reassurance instantly, reducing anxiety and preventing 
                  customers from double-booking or making alternative arrangements.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  Automated Reminders
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Reduce no-shows with automated SMS reminders sent before appointments. 
                  Customers can confirm, reschedule, or cancel with a simple text reply. This 
                  two-way communication makes it easy for customers to manage their appointments 
                  without having to call or email.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  Automated reminders serve multiple purposes: they keep appointments top-of-mind, 
                  allow customers to easily reschedule if needed, and provide an opportunity to 
                  confirm attendance. The ability to reschedule via text reduces last-minute cancellations 
                  and helps you fill cancelled slots more quickly.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  Calendar Sync
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  All bookings automatically sync with your calendar system. No double-booking, 
                  no manual entry, no scheduling conflicts. The system checks your calendar in 
                  real-time before confirming any appointment, ensuring you never overbook.
                </p>
                <p className="text-gray-600 leading-relaxed mt-3">
                  Calendar integration eliminates the most common scheduling errors: double-booking, 
                  booking during unavailable times, and forgetting to block out personal time. The 
                  system respects your existing calendar entries, blocked time, and business hours, 
                  ensuring every booking is valid and conflict-free.
                </p>
              </div>
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
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <h2 className="text-gray-900 font-medium mt-4 text-4xl">Fast. Simple. Scalable.</h2>
            <p className="text-base text-gray-600 mt-2 whitespace-pre-line">Launch an AI agent in 5 minutes at no cost. Connect it to all your business channels.</p>
            <Link
              to="/setup"
              className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start the free setup
            </Link>
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default SMSBookingAssistantPage;

