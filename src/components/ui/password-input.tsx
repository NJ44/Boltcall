import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  containerClassName?: string;
  showErrors?: boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, containerClassName, value, onChange, ...props }, ref) => {
    const [password, setPassword] = useState<string>(value?.toString() || "");
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if (value !== undefined) {
        setPassword(value.toString());
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      onChange?.(e);
    };

    return (
      <div className={containerClassName}>
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
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
