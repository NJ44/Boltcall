import { cn } from "@/lib/utils";
import { useState } from "react";
import "./rocker-switch.css";

interface RockerSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export const Component = ({
  checked,
  defaultChecked = false,
  onChange,
  className,
}: RockerSwitchProps) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.checked;
    if (!isControlled) setInternalChecked(newVal);
    onChange?.(newVal);
  };

  return (
    <div className={cn("flex flex-col items-center gap-4 p-4 rounded-lg", className)}>
      <label className="rocker rocker-small">
        <input type="checkbox" checked={isChecked} onChange={handleChange} />
        <span className="switch-left">Yes</span>
        <span className="switch-right">No</span>
      </label>
    </div>
  );
};
