import React, { useState, useMemo, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

const PASSWORD_REQUIREMENTS = [
  { regex: /.{6,}/, text: "At least 6 characters" },
  { regex: /[0-9]/, text: "At least 1 number" },
  { regex: /[a-z]/, text: "At least 1 lowercase letter" },
  { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
] as const;

interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  containerClassName?: string;
  showErrors?: boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, containerClassName, value, onChange, showErrors, ...props }, ref) => {
    const [password, setPassword] = useState<string>(value?.toString() || "");
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if (value !== undefined) {
        setPassword(value.toString());
      }
    }, [value]);

    const strength = useMemo(() => {
      const requirements = PASSWORD_REQUIREMENTS.map((req) => ({
        met: req.regex.test(password),
        text: req.text,
      }));
      return {
        score: requirements.filter((r) => r.met).length,
        requirements,
      };
    }, [password]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      onChange?.(e);
    };

    const unmetRequirements = strength.requirements.filter((r) => !r.met);

    return (
      <div className={containerClassName}>
        <div className="space-y-1.5">
          {/* Input */}
          <div className="relative">
            <input
              type={isVisible ? "text" : "password"}
              value={password}
              onChange={handleChange}
              className={`w-full px-5 py-3 bg-gray-100/80 rounded-full text-sm text-gray-800 placeholder-gray-400 border-none outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200 pr-11 ${className || ""}`}
              ref={ref}
              {...props}
            />
            <button
              type="button"
              onClick={() => setIsVisible((prev) => !prev)}
              aria-label={isVisible ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors outline-none"
            >
              {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Strength bars */}
          {password.length > 0 && (
            <div className="flex gap-1.5 px-2 pt-0.5">
              {[1, 2, 3, 4].map((level) => (
                <span
                  key={level}
                  className={`${
                    strength.score >= level
                      ? level <= 1
                        ? "bg-red-300"
                        : level <= 2
                          ? "bg-orange-300"
                          : level <= 3
                            ? "bg-yellow-300"
                            : "bg-emerald-400"
                      : "bg-gray-200"
                  } h-1 rounded-full w-full transition-colors duration-300`}
                />
              ))}
            </div>
          )}

          {/* Errors — shown on submit attempt */}
          {showErrors && password.length > 0 && unmetRequirements.length > 0 && (
            <ul className="px-2 space-y-0.5">
              {unmetRequirements.map((req, i) => (
                <li key={i} className="text-xs text-red-500">{req.text}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
