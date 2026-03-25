import React from 'react';

interface StyledInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  autoComplete?: string;
}

const StyledInput: React.FC<StyledInputProps> = ({
  placeholder = "Name",
  value,
  onChange,
  onFocus,
  onBlur,
  name,
  id,
  type = "text",
  required = false,
  disabled = false,
  className = "",
  maxLength,
  minLength,
  pattern,
  autoComplete,
  ...rest
}) => {
  const inputId = id || name || 'input';
  const labelText = placeholder;

  return (
    <div className="relative pt-5 w-full">
      <input
        type={type}
        className={`peer w-full border-0 border-b-2 border-gray-400 bg-transparent px-0 py-[7px] text-[17px] text-black outline-none transition-[border-color] duration-200 placeholder:text-transparent focus:border-b-[3px] focus:pb-[6px] focus:font-normal disabled:cursor-not-allowed disabled:opacity-50 [border-image:none] focus:[border-image:linear-gradient(to_right,#116399,#38caef)_1] ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        name={name}
        id={inputId}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        autoComplete={autoComplete}
        {...rest}
      />
      <label
        htmlFor={inputId}
        className="pointer-events-none absolute top-0 block text-xs font-normal text-gray-400 transition-all duration-[400ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] peer-placeholder-shown:top-5 peer-placeholder-shown:text-[15px] peer-placeholder-shown:cursor-text peer-focus:top-0 peer-focus:text-xs peer-focus:text-[#38caef]"
      >
        {labelText}
      </label>
    </div>
  );
};

export default StyledInput;
