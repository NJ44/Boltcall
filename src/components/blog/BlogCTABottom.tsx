import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, Phone, Calendar } from "lucide-react";

interface BlogCTABottomProps {
  headline?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

const BlogCTABottom: React.FC<BlogCTABottomProps> = ({
  headline = "Ready to stop missing calls?",
  description = "Launch an AI receptionist in 5 minutes. No credit card, no contracts, no code.",
  buttonText = "Start the free setup",
  buttonLink = "/signup",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="my-16"
    >
      <div className="flex flex-col items-center justify-center text-center">
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-8 w-full max-w-[800px] group hover:bg-gray-50 transition duration-500 hover:duration-200">
          {/* Stacked icon trio */}
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

          <h2 className="text-gray-900 font-medium mt-4 text-3xl md:text-4xl">
            {headline}
          </h2>

          <p className="text-base text-gray-600 mt-2 max-w-lg mx-auto">
            {description}
          </p>

          <Link
            to={buttonLink}
            className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 hover:text-gray-900 h-10 px-4 py-2 shadow-sm active:shadow-none"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCTABottom;
