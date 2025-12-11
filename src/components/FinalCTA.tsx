import React from 'react';
import { useNavigate } from 'react-router-dom';
import Section from './ui/Section';
import { Users, Phone, Calendar } from 'lucide-react';

const FinalCTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Section id="contact" background="white">
      <div className="max-w-4xl mx-auto py-20">
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
            <p className="text-base text-gray-600 mt-2 whitespace-pre-line">Get your helper ready in 5 minutes. It is free. Connect it to your phone, website, and messages.</p>
            <button
              onClick={() => navigate('/coming-soon')}
              className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 hover:text-gray-900 h-10 px-4 py-2 shadow-sm active:shadow-none"
            >
              Start the free setup
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default FinalCTA;
