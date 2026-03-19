import React, { useState, useMemo, useEffect } from "react";
import { Check, Eye, EyeOff, Info, X } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const PASSWORD_REQUIREMENTS = [
  { regex: /.{8,}/, text: "At least 8 characters" },
  { regex: /[0-9]/, text: "At least 1 number" },
  { regex: /[a-z]/, text: "At least 1 lowercase letter" },
  { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
  { regex: /[!-/:-@[-`{-~]/, text: "At least 1 special character" },
] as const;

type StrengthScore = 0 | 1 | 2 | 3 | 4 | 5;

const STRENGTH_COLORS: Record<StrengthScore, string> = {
  0: "text-red-500",
  1: "text-orange-500",
  2: "text-yellow-500",
  3: "text-green-500",
  4: "text-amber-700",
  5: "text-emerald-500",
};

interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  containerClassName?: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, containerClassName, value, onChange, ...props }, ref) => {
    const [password, setPassword] = useState<string>(
      value?.toString() || ""
    );
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
        score: requirements.filter((r) => r.met).length as StrengthScore,
        requirements,
      };
    }, [password]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      onChange?.(e);
    };

    return (
      <div className={containerClassName}>
        <div className="space-y-1.5">
          {/* Label row with info icon */}
          <div className="flex items-center justify-between px-1">
            <label
              htmlFor={props.id || "password"}
              className="text-xs font-medium text-gray-500"
            >
              Password
            </label>
            <HoverCard openDelay={200}>
              <HoverCardTrigger asChild>
                <button type="button" className="outline-none">
                  <Info
                    size={15}
                    className={`cursor-pointer ${STRENGTH_COLORS[strength.score]} transition-all`}
                  />
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="bg-white">
                <ul className="space-y-1.5" aria-label="Password requirements">
                  {strength.requirements.map((req, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      {req.met ? (
                        <Check size={14} className="text-emerald-500" />
                      ) : (
                        <X size={14} className="text-gray-300" />
                      )}
                      <span
                        className={`text-xs ${req.met ? "text-emerald-600" : "text-gray-400"}`}
                      >
                        {req.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </HoverCardContent>
            </HoverCard>
          </div>

          {/* Input */}
          <div className="relative">
            <input
              id={props.id || "password"}
              type={isVisible ? "text" : "password"}
              value={password}
              onChange={handleChange}
              aria-invalid={strength.score < 4}
              aria-describedby="password-strength"
              className={`w-full px-5 py-3 bg-gray-100/80 rounded-full text-sm text-gray-800 placeholder-gray-400 border-none outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all duration-200 pr-11 ${className || ""}`}
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
            <div className="flex gap-1.5 px-2 pt-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <span
                  key={level}
                  className={`${
                    strength.score >= level
                      ? level <= 1
                        ? "bg-red-400"
                        : level <= 2
                          ? "bg-orange-400"
                          : level <= 3
                            ? "bg-yellow-400"
                            : level <= 4
                              ? "bg-green-400"
                              : "bg-emerald-500"
                      : "bg-gray-200"
                  } h-1 rounded-full w-full transition-colors duration-300`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
