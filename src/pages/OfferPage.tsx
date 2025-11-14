import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, ArrowRight } from 'lucide-react';
import GiveawayBar from '../components/GiveawayBar';
import Header from '../components/Header';
import Button from '../components/ui/Button';
import StyledInput from '../components/ui/StyledInput';

const offerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  companyWebsite: z.string().url('Please enter a valid website URL'),
});

type OfferFormData = z.infer<typeof offerSchema>;

const OfferPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
  });

  const onSubmit = async (data: OfferFormData) => {
    setIsSubmitting(true);
    
    try {
      // POST to n8n webhook
      const response = await fetch('https://n8n.srv974118.hstgr.cloud/webhook/1b1c7fe4-dec4-423d-bb3e-6ce0c66819aa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      console.log('Offer form submitted:', data);
      setIsSubmitted(true);
      reset();
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-white">
      {/* Giveaway Bar */}
      <GiveawayBar />
      
      {/* Header */}
      <div className="relative z-10 pt-32">
        <Header />
      </div>

      {/* Main Content */}
      <main className="relative z-10 pt-2 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Section - Title and Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                Special Offer
                <span className="block text-blue-600 mt-2">
                  Limited Time Only
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-lg text-gray-600 leading-relaxed"
              >
                Don't miss out on this exclusive opportunity to transform your business.
              </motion.p>
            </motion.div>

            {/* Right Section - Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:sticky lg:top-8"
            >
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl p-6 lg:p-7 border border-gray-200 max-w-md">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Thank You!
                    </h3>
                    <p className="text-gray-600">
                      We've received your information and will contact you shortly.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <div className="mb-6">
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Claim Your Offer
                      </h2>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                      {/* Full Name */}
                      <div>
                        <StyledInput
                          {...register('fullName')}
                          type="text"
                          placeholder="Full Name"
                          name="fullName"
                          required
                        />
                        {errors.fullName && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.fullName.message}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <StyledInput
                          {...register('email')}
                          type="email"
                          placeholder="Email Address"
                          name="email"
                          required
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      {/* Company */}
                      <div>
                        <StyledInput
                          {...register('company')}
                          type="text"
                          placeholder="Company Name"
                          name="company"
                          required
                        />
                        {errors.company && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.company.message}
                          </p>
                        )}
                      </div>

                      {/* Company Website */}
                      <div>
                        <StyledInput
                          {...register('companyWebsite')}
                          type="url"
                          placeholder="Company Website URL"
                          name="companyWebsite"
                          required
                        />
                        {errors.companyWebsite && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.companyWebsite.message}
                          </p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 py-3 text-lg font-semibold"
                      >
                        {isSubmitting ? (
                          'Processing...'
                        ) : (
                          <>
                            Claim Offer Now
                            <ArrowRight className="w-5 h-5 ml-2 inline" />
                          </>
                        )}
                      </Button>

                      <p className="text-xs text-gray-500 text-center">
                        By submitting this form, you agree to our terms and conditions.
                        We respect your privacy and will never share your information.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OfferPage;

