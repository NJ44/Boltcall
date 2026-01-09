"use client";

import React from "react";
import { FeedbackWidget } from "@/components/ui/feedback-widget";

const FeedbackWidgetDemo: React.FC = () => {
  return (
    <div className="relative flex h-[400px] w-full items-center justify-center bg-slate-50">
      <FeedbackWidget
        onSubmit={(data) => {
          console.log("Feedback submitted:", data);
        }}
      />
    </div>
  );
};

export default FeedbackWidgetDemo;


