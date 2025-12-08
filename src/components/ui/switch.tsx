import { cn } from "@/lib/utils";
import { useState } from "react";

export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  leftLabel?: string;
  rightLabel?: string;
  className?: string;
  disabled?: boolean;
}

export const Switch = ({ 
  checked: controlledChecked, 
  onChange, 
  leftLabel = "Yes", 
  rightLabel = "No",
  className,
  disabled = false
}: SwitchProps) => {
  const [internalChecked, setInternalChecked] = useState(false);
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const newChecked = e.target.checked;
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    onChange?.(newChecked);
  };

  return (
    <div className={cn("flex flex-col items-center gap-4 p-4 rounded-lg", className)}>
      <label className={cn("rocker rocker-small", disabled && "opacity-50 cursor-not-allowed")}>
        <input 
          type="checkbox" 
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
        />
        <span className="switch-left">{leftLabel}</span>
        <span className="switch-right">{rightLabel}</span>
      </label>
    </div>
  );
};

export const Component = () => {
  return <Switch />;
};

