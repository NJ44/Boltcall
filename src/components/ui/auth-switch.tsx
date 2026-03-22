import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { resetPassword } from "../../lib/auth";
import { OTPVerification } from "./otp-verify";
import PasswordInput from "./password-input";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

interface AuthSwitchProps {
  defaultMode?: "login" | "signup";
  defaultRedirect?: string;
}

const PillInput = ({
  error: fieldError,
  rightElement,
  className: _extraClass,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
  error?: string;
  rightElement?: React.ReactNode;
}) => (
  <div>
    <div className="relative">
      <input
        {...props}
        className={cn(
          "w-full px-5 py-3 bg-gray-100/80 rounded-full text-sm text-gray-800 placeholder-gray-400 border-none outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200",
          rightElement && "pr-11"
        )}
      />
      {rightElement && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightElement}
        </span>
      )}
    </div>
    {fieldError && (
      <p className="mt-1 ml-4 text-xs text-red-500">{fieldError}</p>
    )}
  </div>
);

export default function AuthSwitch({
  defaultMode = "login",
  defaultRedirect = "/dashboard",
}: AuthSwitchProps) {
  const [mode, setMode] = useState<"login" | "signup">(defaultMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [signedUpEmail, setSignedUpEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const rawRedirect = new URLSearchParams(location.search).get("redirect");
  const redirectTo = rawRedirect && rawRedirect.startsWith("/") && !rawRedirect.startsWith("//")
    ? rawRedirect
    : defaultRedirect;

  const loginForm = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });
  const signupForm = useForm<SignupFormData>({ resolver: zodResolver(signupSchema) });

  const isLogin = mode === "login";

  // Clear stale API error when validation errors appear
  const loginHasValidationErrors = Object.keys(loginForm.formState.errors).length > 0;
  const signupHasValidationErrors = Object.keys(signupForm.formState.errors).length > 0;
  useEffect(() => {
    if ((isLogin && loginHasValidationErrors) || (!isLogin && signupHasValidationErrors)) {
      setError("");
    }
  }, [loginHasValidationErrors, signupHasValidationErrors, isLogin]);

  const switchMode = (newMode: "login" | "signup") => {
    if (newMode === mode) return;
    setError("");
    setResetSent(false);
    loginForm.reset();
    signupForm.reset();
    setMode(newMode);
  };

  const onLogin = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError("");
      await login(data);
      navigate(redirectTo);
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSignup = async (data: SignupFormData) => {
    try {
      setIsLoading(true);
      setError("");
      await signup({ name: '', email: data.email, password: data.password, company: "" });
      setSignedUpEmail(data.email);
      setShowOtp(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerified = async () => navigate(redirectTo);

  const handleForgotPassword = async () => {
    const email = loginForm.getValues("email");
    if (!email || !z.string().email().safeParse(email).success) {
      loginForm.setError("email", { message: "Enter your email above first" });
      return;
    }
    try {
      setIsLoading(true);
      setError("");
      await resetPassword(email);
      setResetSent(true);
    } catch {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (showOtp) {
    return <OTPVerification email={signedUpEmail} onVerified={handleOtpVerified} />;
  }

  const submitButton = (text: string, loadingText: string) => (
    <button
      type="submit"
      disabled={isLoading}
      className="w-52 mx-auto block py-3 rounded-full bg-blue-600 text-white font-bold text-sm tracking-widest uppercase shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          {loadingText}
        </span>
      ) : (
        text
      )}
    </button>
  );

  /*
   * The clip-path creates the curved wave divider.
   * When gradient is on LEFT  → curve bulges out to the right
   * When gradient is on RIGHT → curve bulges out to the left (mirrored)
   */
  /*
   * Uses a huge ellipse to create a smooth convex curve on the divider edge.
   * Login:  gradient on left  → ellipse centered far left so right edge arcs into white
   * Signup: gradient on right → ellipse centered far right so left edge arcs into white
   */
  const clipLeft = "ellipse(42% 100% at 5% 50%)";
  const clipRight = "ellipse(42% 100% at 95% 50%)";

  // Only animate left position on desktop (lg breakpoint = 1024px)
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 px-4 py-6 sm:p-4 overflow-hidden">
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
        className="relative w-full max-w-[700px] min-h-0 lg:h-[460px] rounded-[20px] sm:rounded-[28px] shadow-2xl overflow-hidden bg-white"
      >
        {/* ── GRADIENT PANEL with curved clip-path (desktop only) ── */}
        <motion.div
          className="absolute inset-0 z-10 hidden lg:block pointer-events-none"
          animate={{ x: isLogin ? 0 : 0 }}
        >
          <motion.div
            className="absolute top-0 bottom-0 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800"
            animate={{
              left: isLogin ? "0%" : "0%",
              right: isLogin ? "0%" : "0%",
              clipPath: isLogin ? clipLeft : clipRight,
            }}
            transition={{ type: "spring", stiffness: 170, damping: 26 }}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </motion.div>

        {/* ── GRADIENT PANEL CONTENT (desktop only) ── */}
        <motion.div
          className="absolute top-0 bottom-0 w-[45%] z-20 hidden lg:flex items-center justify-center pointer-events-auto"
          animate={{ left: isLogin ? "0%" : "55%" }}
          transition={{ type: "spring", stiffness: 170, damping: 26 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="text-center px-8 text-white"
            >
              <h3 className="text-2xl font-bold mb-3">
                {isLogin ? "New here?" : "One of us?"}
              </h3>
              <p className="text-white/80 text-sm leading-relaxed mb-6 max-w-[240px] mx-auto">
                {isLogin
                  ? "Join us today and discover a world of possibilities. Create your account in seconds!"
                  : "Welcome back! Sign in to continue your journey with us."}
              </p>
              <button
                type="button"
                onClick={() => switchMode(isLogin ? "signup" : "login")}
                className="px-8 py-2.5 rounded-full border-2 border-white text-white text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ── FORM SIDE ── */}
        <motion.div
          className="relative lg:absolute lg:top-0 lg:bottom-0 w-full lg:w-[50%] z-[5] flex flex-col items-center justify-center px-6 py-8 sm:px-12 sm:py-10 lg:py-0"
          animate={isDesktop ? { left: isLogin ? "50%" : "0%" } : { left: "0%" }}
          transition={{ type: "spring", stiffness: 170, damping: 26 }}
        >
          {/* Mobile toggle */}
          <div className="flex bg-gray-100 p-1 rounded-full mb-5 w-full max-w-[280px] lg:hidden">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={cn(
                "flex-1 py-2 text-sm font-semibold rounded-full transition-all duration-300",
                isLogin ? "bg-blue-600 text-white shadow" : "text-gray-500"
              )}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={cn(
                "flex-1 py-2 text-sm font-semibold rounded-full transition-all duration-300",
                !isLogin ? "bg-blue-600 text-white shadow" : "text-gray-500"
              )}
            >
              Sign Up
            </button>
          </div>

          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-[340px]"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-6 sm:mb-8">
                  Sign in
                </h2>
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-3 sm:space-y-4">
                  <PillInput
                    {...loginForm.register("email")}
                    type="email"
                    placeholder="Email"
                    error={loginForm.formState.errors.email?.message}
                  />
                  <PasswordInput
                    {...loginForm.register("password")}
                    placeholder="Password"
                    id="login-password"
                    showStrength={false}
                  />
                  {loginForm.formState.errors.password && (
                    <p className="ml-4 text-xs text-red-500 -mt-2">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                  <div className="text-right -mt-1">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      disabled={isLoading}
                      className="text-xs text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  {resetSent && (
                    <div className="bg-green-50 rounded-full px-4 py-2">
                      <p className="text-green-600 text-xs text-center">Password reset email sent! Check your inbox.</p>
                    </div>
                  )}
                  {error && (
                    <div className="bg-red-50 rounded-full px-4 py-2">
                      <p className="text-red-500 text-xs text-center">{error}</p>
                    </div>
                  )}
                  <div className="pt-2">{submitButton("LOGIN", "Signing in...")}</div>
                </form>
                {/* Social login removed — email + password only */}
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-[340px]"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-6 sm:mb-8">
                  Sign up
                </h2>
                <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-3 sm:space-y-4">
                  <PillInput
                    {...signupForm.register("email")}
                    type="email"
                    placeholder="Email"
                    error={signupForm.formState.errors.email?.message}
                  />
                  <PasswordInput
                    {...signupForm.register("password")}
                    placeholder="Password"
                    id="signup-password"
                  />
                  {signupForm.formState.errors.password && (
                    <p className="ml-4 text-xs text-red-500 -mt-2">
                      {signupForm.formState.errors.password.message}
                    </p>
                  )}
                  {error && (
                    <div className="bg-red-50 rounded-full px-4 py-2">
                      <p className="text-red-500 text-xs text-center">{error}</p>
                    </div>
                  )}
                  <div className="pt-2">{submitButton("SIGN UP", "Creating account...")}</div>
                </form>
                {/* Social login removed — email + password only */}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 text-center lg:hidden">
            <p className="text-gray-500 text-sm">
              {isLogin ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button type="button" onClick={() => switchMode("signup")} className="text-blue-600 font-medium">Sign up</button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button type="button" onClick={() => switchMode("login")} className="text-blue-600 font-medium">Sign in</button>
                </>
              )}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
