import { useState, useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send } from 'lucide-react';
import LazyLottie from '../components/ui/LazyLottie';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

type ContactFormData = z.infer<typeof contactSchema>;

const PillInput = ({
  error: fieldError,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
}) => (
  <div>
    <input
      {...props}
      className={cn(
        "w-full px-5 py-3 bg-gray-100/80 rounded-full text-sm text-gray-800 placeholder-gray-400 border-none outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200"
      )}
    />
    {fieldError && (
      <p className="mt-1 ml-4 text-xs text-red-500">{fieldError}</p>
    )}
  </div>
);

const Contact: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    document.title = 'Contact Boltcall - Get in Touch with Our Team';
    updateMetaDescription('Get in touch with Boltcall. Contact our team for AI receptionist support, sales questions, or general inquiries. We\'re here to help.');
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      setIsLoading(true);

      const response = await fetch('https://n8n.srv974118.hstgr.cloud/webhook/9073ec26-3576-4fd4-9b63-a65c1d73250e', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to submit form');

      setIsSubmitted(true);
      reset();
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 px-4 py-6 sm:p-4 overflow-hidden flex flex-col items-center">
      {/* Logo */}
      <div className="absolute top-4 left-5 z-30 hidden lg:block">
        <Link to="/">
          <img
            src="/boltcall_full_logo.png"
            alt="Boltcall"
            className="h-10 w-auto brightness-0 invert"
          />
        </Link>
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-[860px] min-h-0 lg:h-[540px] rounded-[20px] sm:rounded-[28px] shadow-2xl overflow-hidden bg-white"
      >
        {/* Gradient panel with curved clip-path (desktop only) */}
        <div className="absolute inset-0 z-10 hidden lg:block pointer-events-none">
          <div
            className="absolute top-0 bottom-0 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800"
            style={{
              width: "100%",
              height: "100%",
              clipPath: "ellipse(42% 100% at 5% 50%)",
            }}
          />
        </div>

        {/* Gradient panel content with Lottie (desktop only) */}
        <div className="absolute top-0 bottom-0 left-0 w-[45%] z-20 hidden lg:flex flex-col items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center px-8 text-white"
          >
            <p className="text-2xl font-bold mb-2">Get in Touch</p>
            <p className="text-white/80 text-sm leading-relaxed mb-4 max-w-[240px] mx-auto">
              Have a question or want to learn more? We'd love to hear from you.
            </p>
            <div className="w-72 h-72 mx-auto">
              <LazyLottie
                src="/Email.lottie"
                loop
                autoplay
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </motion.div>
        </div>

        {/* Form side */}
        <div className="relative lg:absolute lg:top-0 lg:bottom-0 lg:right-0 w-full lg:w-[55%] z-[5] flex flex-col items-center justify-center px-6 py-8 sm:px-12 sm:py-10 lg:py-0">
          {/* Mobile header with Lottie */}
          <div className="lg:hidden text-center mb-4">
            <div className="w-32 h-32 mx-auto mb-2">
              <LazyLottie
                src="/Email.lottie"
                loop
                autoplay
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <p className="text-2xl font-bold text-gray-900">Get in Touch</p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="w-full max-w-[380px]"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-5 hidden lg:block">
              Contact Us
            </h1>

            {/* Success Message */}
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 rounded-full px-4 py-2 mb-4"
              >
                <p className="text-green-600 text-xs text-center font-medium">
                  Message sent successfully! We'll get back to you soon.
                </p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <PillInput
                {...register('name')}
                placeholder="Full Name"
                error={errors.name?.message}
              />
              <PillInput
                {...register('email')}
                type="email"
                placeholder="Email"
                error={errors.email?.message}
              />
              <div>
                <textarea
                  {...register('message')}
                  placeholder="Your message..."
                  rows={3}
                  className="w-full px-5 py-3 bg-gray-100/80 rounded-2xl text-sm text-gray-800 placeholder-gray-400 border-none outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200 resize-none"
                />
                {errors.message && (
                  <p className="mt-1 ml-4 text-xs text-red-500">{errors.message.message}</p>
                )}
              </div>
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-52 mx-auto block py-3 rounded-full bg-blue-600 text-white font-bold text-sm tracking-widest uppercase shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" />
                      Send Message
                    </span>
                  )}
                </button>
              </div>
            </form>

            <p className="mt-4 text-center text-xs text-gray-400">
              See how Boltcall compares on{' '}
              <a
                href="https://www.g2.com/categories/ai-sales-assistant"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                G2
              </a>{' '}
              or read reviews on{' '}
              <a
                href="https://www.capterra.com/p/10010996/Boltcall/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Capterra
              </a>
              .
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
