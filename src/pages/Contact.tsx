import React, { useState } from 'react';
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
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  workEmail: z.string().email('Please enter a valid work email address'),
  companyWebsite: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  interests: z.array(z.any()).min(1, 'Please select at least one option'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number')
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<TTag[]>([]);

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
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Contact form submitted:', data);
      setIsSubmitted(true);
      reset();
      setSelectedInterests([]);
      
      // Reset success message after 3 seconds
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
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
              <h1 className="text-5xl font-bold text-zinc-900 mb-8">GET IN TOUCH</h1>
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
                  {/* Full Name */}
                  <div>
                    <StyledInput
                      {...register('fullName')}
                      placeholder="Full Name"
                      name="fullName"
                      required
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                    )}
                  </div>

                  {/* Work Email */}
                  <div>
                    <StyledInput
                      {...register('workEmail')}
                      type="email"
                      placeholder="Work Email"
                      name="workEmail"
                      required
                    />
                    {errors.workEmail && (
                      <p className="mt-1 text-sm text-red-600">{errors.workEmail.message}</p>
                    )}
                  </div>

                  {/* Company Website */}
                  <div>
                    <StyledInput
                      {...register('companyWebsite')}
                      type="url"
                      placeholder="Company Website (optional)"
                      name="companyWebsite"
                    />
                    {errors.companyWebsite && (
                      <p className="mt-1 text-sm text-red-600">{errors.companyWebsite.message}</p>
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

                  {/* Phone Number */}
                  <div className="mb-3">
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
