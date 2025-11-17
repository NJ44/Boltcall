import React from 'react';
import styled from 'styled-components';

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

const StyledWrapper = styled.div`
  .form__group {
    position: relative;
    padding: 20px 0 0;
    width: 100%;
  }

  .form__field {
    font-family: inherit;
    width: 100%;
    border: none;
    border-bottom: 2px solid #9b9b9b;
    outline: 0;
    font-size: 17px;
    color: #000;
    padding: 7px 0;
    background: transparent;
    transition: border-color 0.2s;
  }

  .form__field::placeholder {
    color: transparent;
  }

  .form__field:placeholder-shown ~ .form__label {
    font-size: 15px;
    cursor: text;
    top: 20px;
    font-weight: 400;
  }

  .form__label {
    position: absolute;
    top: 0;
    display: block;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    font-size: 12px;
    color: #9b9b9b;
    font-weight: 400;
    pointer-events: none;
  }

  .form__field:focus {
    padding-bottom: 6px;
    font-weight: 400;
    border-width: 3px;
    border-image: linear-gradient(to right, #116399, #38caef);
    border-image-slice: 1;
  }

  .form__field:focus ~ .form__label {
    position: absolute;
    top: 0;
    display: block;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    font-size: 12px;
    color: #38caef;
    font-weight: 400;
  }

  /* reset input */
  .form__field:required, .form__field:invalid {
    box-shadow: none;
  }

  .form__field:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Remove grey autofill background in browsers */
  input.form__field:-webkit-autofill,
  input.form__field:-webkit-autofill:hover,
  input.form__field:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0px 1000px #ffffff inset;
    box-shadow: 0 0 0px 1000px #ffffff inset;
    -webkit-text-fill-color: #000000;
    transition: background-color 5000s ease-in-out 0s;
  }
`;

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
    <StyledWrapper>
      <div className="form__group field">
        <input
          type={type}
          className={`form__field ${className}`}
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
        <label htmlFor={inputId} className="form__label">
          {labelText}
        </label>
      </div>
    </StyledWrapper>
  );
};

export default StyledInput;
