import { cn } from "@/lib/utils";
import { useState } from "react";
import "./rocker-switch.css";

interface RockerSwitchProps {
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  labelYes?: string;
  labelNo?: string;
  size?: "small" | "normal" | "large";
  className?: string;
  disabled?: boolean;
}

export const Component = ({
  defaultChecked = false,
  checked,
  onChange,
  labelYes = "Yes",
  labelNo = "No",
  size = "small",
  className,
  disabled = false,
}: RockerSwitchProps) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const newVal = e.target.checked;
    if (!isControlled) setInternalChecked(newVal);
    onChange?.(newVal);
  };

  return (
    <div className={cn("flex flex-col items-center gap-4 p-4 rounded-lg", className)}>
      <label
        className={cn(
          "rocker",
          size === "small" && "rocker-small",
          size === "large" && "rocker-large",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none"
        )}
      >
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
        />
        <span className="switch-left">{labelYes}</span>
        <span className="switch-right">{labelNo}</span>
      </label>
    </div>
  );
};
