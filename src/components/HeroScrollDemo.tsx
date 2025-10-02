import React from "react";
import { ContainerScroll } from "./ui/container-scroll-animation";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden pb-[100px] -mt-[560px]">
      <ContainerScroll
        titleComponent={null}
      >
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="mb-8">
            <DotLottieReact
              src="/AI_assistant.lottie"
              loop
              autoplay
              style={{ 
                width: '300px', 
                height: '300px'
              }}
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            AI-Powered Booking Assistant
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of dental practice management with our intelligent AI assistant that handles bookings, answers questions, and provides 24/7 support for your patients.
          </p>
        </div>
      </ContainerScroll>
    </div>
  );
}
