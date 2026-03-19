import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  containerClassName?: string;
  showStrength?: boolean;
}

const getStrength = (pw: string) => {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
};

const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColors = ["", "bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"];

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, containerClassName, showStrength = true, value, onChange, ...props }, ref) => {
    const [password, setPassword] = useState<string>(value?.toString() || "");
    const [isVisible, setIsVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
      if (value !== undefined) {
        setPassword(value.toString());
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      onChange?.(e);
    };

    const strength = getStrength(password);
    const showBar = showStrength && isFocused && password.length > 0;

    return (
      <div className={containerClassName}>
        <div className="relative">
          <input
            type={isVisible ? "text" : "password"}
            value={password}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`w-full px-5 py-3 bg-gray-100/80 rounded-full text-sm text-gray-800 placeholder-gray-400 border-none outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200 pr-11 ${className || ""}`}
            ref={ref}
            {...props}
          />
          <button
            type="button"
            onClick={() => setIsVisible((prev) => !prev)}
            aria-label={isVisible ? "Hide password" : "Show password"}
            className="absolute right-3 top-0 bottom-0 flex items-center justify-center w-8 text-gray-400 hover:text-gray-600 transition-colors outline-none focus:outline-none"
          >
            {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Strength bar - only visible when focused and typing */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showBar ? "max-h-10 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"
          }`}
        >
          <div className="flex items-center gap-2 px-4">
            <div className="flex gap-1 flex-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                    i <= strength ? strengthColors[strength] : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] font-medium text-gray-400 min-w-[36px] text-right">
              {strengthLabels[strength]}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
