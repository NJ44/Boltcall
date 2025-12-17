"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";

type OTPVerificationProps = {
  email?: string;
  onVerified?: (code: string) => Promise<void> | void;
  onResend?: () => Promise<void> | void;
};

export function OTPVerification({
  email = "jamescarter@gmail.com",
  onVerified,
  onResend,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 4) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsLoading(false);
    if (onVerified) {
      await onVerified(otpCode);
    } else {
      console.log("OTP verified:", otpCode);
    }
  };

  const handleResend = async () => {
    if (onResend) {
      await onResend();
    } else {
      console.log("Resending OTP...");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative w-full max-w-xs overflow-hidden rounded-2xl shadow-2xl bg-white border border-gray-200"
      >
        <div className="relative z-10 p-6">
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-xl bg-blue-50 border border-blue-100">
              <img
                src="/boltcall_full_logo.png"
                alt="Boltcall logo"
                className="w-8 h-8 object-contain"
                loading="lazy"
              />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Enter verification code
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              We emailed you a verification code to
              <br />
              <span className="text-gray-900 font-medium">{email}</span>
            </p>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            {otp.map((digit, index) => (
              <div key={index} className="relative">
                <input
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-semibold bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-blue-50 focus:border-blue-400 focus:outline-none transition-all duration-200 shadow-sm rounded-xl"
                  placeholder=""
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={isLoading || otp.join("").length !== 4}
            className="w-full py-3 mb-4 rounded-xl bg-blue-600 text-white font-semibold shadow-lg transition-all duration-200 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </button>

          <div className="text-center mb-6">
            <span className="text-gray-600 text-sm">Didn't get the code? </span>
            <button
              onClick={handleResend}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
            >
              Resend
            </button>
          </div>

          <div className="text-center">
            <p className="text-gray-500 text-xs leading-relaxed">
              By continuing, you agree to our{" "}
              <button className="text-blue-700 hover:text-blue-800 underline transition-colors">
                Terms of Service
              </button>{" "}
              &{" "}
              <button className="text-blue-700 hover:text-blue-800 underline transition-colors">
                Privacy Policy
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

