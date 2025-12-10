import React, { useState, useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import StyledInput from '../components/ui/StyledInput';
import { MultipleSelect } from '../components/ui/multiple-select';
import type { TTag } from '../components/ui/multiple-select';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
  interests: z.array(z.any()).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<TTag[]>([]);

  useEffect(() => {
    document.title = 'Contact Us - Get in Touch with Boltcall | Boltcall';
    updateMetaDescription('Contact Boltcall for AI receptionist support. Get help, ask questions, or start your free setup. We are here to help.');
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const interestOptions: TTag[] = [
    { key: 'lead-generation', name: 'Lead Generation' },
    { key: 'ads-campaigns', name: 'Ads Campaigns' },
    { key: 'speed-to-lead', name: 'Speed to Lead' },
    { key: 'ai-receptionist', name: 'AI Receptionist' },
    { key: 'agents', name: 'Agents' },
  ];

  const onSubmit = async (data: ContactFormData) => {
    try {
      setIsLoading(true);
      
      // POST to n8n webhook
      const response = await fetch('https://n8n.srv974118.hstgr.cloud/webhook/9073ec26-3576-4fd4-9b63-a65c1d73250e', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      console.log('Contact form submitted:', data);
      setIsSubmitted(true);
      reset();
      setSelectedInterests([]);
      
      // Reset success message after 3 seconds
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Logo in top left corner */}
      <div className="absolute top-0 left-0 z-10 p-4" style={{ transform: 'translate(-10px, -20px)' }}>
        <Link to="/">
          <img 
            src="/boltcall_full_logo.png" 
            alt="Boltcall" 
            className="h-16 w-auto"
          />
        </Link>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <div className="min-h-screen flex">
          {/* Left Panel - White Background with Title and Animation */}
          <div className="hidden lg:flex lg:w-1/2 bg-white flex-col items-center justify-center p-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mt-16"
            >
              <h1 className="text-5xl font-bold text-zinc-900 mb-8">GET IN <span className="text-blue-600">TOUCH</span></h1>
              <div className="w-96 h-96 mt-16">
                <DotLottieReact
                  src="/Email.lottie"
                  loop
                  autoplay
                  style={{
                    width: '100%',
                    height: '100%'
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* Right Panel - Blue Background with Contact Form */}
          <div className="w-full lg:w-1/2 bg-blue-600 flex items-start justify-center pt-8 p-6">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full max-w-lg"
            >
              <Card className="p-4 bg-white shadow-2xl border-0">
                {/* Header */}

                {/* Success Message */}
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-green-800 font-medium">Message sent successfully!</p>
                        <p className="text-green-700 text-sm">We'll get back to you soon.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                  {/* Name */}
                  <div>
                    <StyledInput
                      {...register('name')}
                      placeholder="Name"
                      name="name"
                      required
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <StyledInput
                      {...register('email')}
                      type="email"
                      placeholder="Email"
                      name="email"
                      required
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <StyledInput
                      {...register('phoneNumber')}
                      type="tel"
                      placeholder="Phone Number"
                      name="phoneNumber"
                      required
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                    )}
                  </div>

                  {/* Interests Multi-select */}
                  <div>
                    <MultipleSelect
                      tags={interestOptions}
                      defaultValue={selectedInterests}
                      onChange={(items) => {
                        setSelectedInterests(items);
                        setValue('interests', items);
                      }}
                    />
                    {errors.interests && (
                      <p className="mt-1 text-sm text-red-600">{errors.interests.message}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="mb-3">
                    <textarea
                      {...register('message')}
                      placeholder="Message"
                      name="message"
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-black"
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-start">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>

              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
