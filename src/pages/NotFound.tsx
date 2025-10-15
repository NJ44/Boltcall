import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  ArrowLeft, 
  Search, 
  HelpCircle, 
  MessageSquare,
  Phone,
  Bot,
  BarChart3,
  Settings,
  ExternalLink
} from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const quickLinks = [
    { title: 'Dashboard', icon: <BarChart3 className="w-5 h-5" />, path: '/dashboard', description: 'View your analytics and performance' },
    { title: 'Agents', icon: <Bot className="w-5 h-5" />, path: '/dashboard/agents', description: 'Manage your AI assistants' },
    { title: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/dashboard/settings', description: 'Configure your account' },
    { title: 'Documentation', icon: <HelpCircle className="w-5 h-5" />, path: '/documentation', description: 'Get help and guides' },
    { title: 'Contact', icon: <MessageSquare className="w-5 h-5" />, path: '/contact', description: 'Get in touch with support' }
  ];

  const popularPages = [
    { title: 'Home', path: '/', description: 'Return to homepage' },
    { title: 'Login', path: '/login', description: 'Sign in to your account' },
    { title: 'Sign Up', path: '/signup', description: 'Create a new account' },
    { title: 'Setup', path: '/setup', description: 'Get started with BoltCall' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* 404 Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative">
            <div className="text-9xl font-bold text-blue-600 mb-4">404</div>
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="absolute -top-4 -right-4 text-6xl"
            >
              🤖
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Oops! It looks like our AI assistant couldn't find the page you're looking for. 
            Don't worry, we'll help you get back on track.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Home className="w-5 h-5" />
            Go Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          <button
            onClick={() => navigate('/contact')}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Phone className="w-5 h-5" />
            Contact Support
          </button>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Navigation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.path}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  {link.icon}
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {link.title}
                  </h4>
                  <p className="text-sm text-gray-600">{link.description}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors ml-auto mt-1" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Popular Pages */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white"
        >
          <h3 className="text-2xl font-bold mb-6">Popular Pages</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularPages.map((page, index) => (
              <motion.a
                key={index}
                href={page.path}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                className="flex flex-col items-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors group"
              >
                <h4 className="font-semibold mb-2 group-hover:text-blue-200 transition-colors">
                  {page.title}
                </h4>
                <p className="text-sm text-blue-100 text-center">
                  {page.description}
                </p>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-600 mb-4">
            Still can't find what you're looking for?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/documentation"
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Search className="w-4 h-4" />
              Browse Documentation
            </a>
            <a
              href="/contact"
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Contact Support
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
