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
    color: #fff;
    padding: 7px 0;
    background: transparent;
    transition: border-color 0.2s;
  }

  .form__field::placeholder {
    color: transparent;
  }

  .form__field:placeholder-shown ~ .form__label {
    font-size: 17px;
    cursor: text;
    top: 20px;
  }

  .form__label {
    position: absolute;
    top: 0;
    display: block;
    transition: 0.2s;
    font-size: 17px;
    color: #9b9b9b;
    pointer-events: none;
  }

  .form__field:focus {
    padding-bottom: 6px;
    font-weight: 700;
    border-width: 3px;
    border-image: linear-gradient(to right, #116399, #38caef);
    border-image-slice: 1;
  }

  .form__field:focus ~ .form__label {
    position: absolute;
    top: 0;
    display: block;
    transition: 0.2s;
    font-size: 17px;
    color: #38caef;
    font-weight: 700;
  }

  /* reset input */
  .form__field:required, .form__field:invalid {
    box-shadow: none;
  }

  .form__field:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
        />
        <label htmlFor={inputId} className="form__label">
          {labelText}
        </label>
      </div>
    </StyledWrapper>
  );
};

export default StyledInput;
