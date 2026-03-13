"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase";

type OTPVerificationProps = {
  email: string;
  onVerified?: () => Promise<void> | void;
};

export function OTPVerification({
  email,
  onVerified,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < pasted.length && i < 6; i++) {
        newOtp[i] = pasted[i];
      }
      setOtp(newOtp);
      const nextEmpty = Math.min(pasted.length, 5);
      inputRefs.current[nextEmpty]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) return;
    setIsLoading(true);
    setError("");

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: "signup",
      });

      if (verifyError) {
        setError(verifyError.message || "Invalid verification code. Please try again.");
        setIsLoading(false);
        return;
      }

      if (onVerified) {
        await onVerified();
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError("");

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email,
      });

      if (resendError) {
        setError(resendError.message || "Failed to resend code.");
        return;
      }

      // Start cooldown
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      setError("Failed to resend code.");
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
                src="/boltcall_icon.png"
                alt="Boltcall icon"
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

          <div className="flex justify-center gap-3 mb-4" onPaste={handlePaste}>
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
                  className="w-11 h-12 text-center text-lg font-semibold bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-blue-50 focus:border-blue-400 focus:outline-none transition-all duration-200 shadow-sm rounded-xl"
                  placeholder=""
                />
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-4 text-center">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleVerify}
            disabled={isLoading || otp.join("").length !== 6}
            className="w-full py-3 mb-4 rounded-xl bg-blue-600 text-white font-semibold shadow-lg transition-all duration-200 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </button>

          <div className="text-center mb-6">
            <span className="text-gray-600 text-sm">Didn't get the code? </span>
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200 disabled:text-gray-400"
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend"}
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
