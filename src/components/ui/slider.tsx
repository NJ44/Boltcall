import React, { useState, useRef, useEffect } from 'react';

interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className = '',
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || disabled) return;
    updateValue(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateValue = (e: MouseEvent | React.MouseEvent) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newValue = Math.round((min + (max - min) * percentage) / step) * step;
    
    onValueChange([newValue]);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const percentage = ((value[0] - min) / (max - min)) * 100;

  return (
    <div
      ref={sliderRef}
      className={`relative h-2 bg-gray-200 rounded-full cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onMouseDown={handleMouseDown}
    >
      <div
        className="absolute top-0 left-0 h-2 bg-blue-600 rounded-full transition-all duration-150"
        style={{ width: `${percentage}%` }}
      />
      <div
        className="absolute top-1/2 w-4 h-4 bg-blue-600 rounded-full shadow-md transform -translate-y-1/2 -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform"
        style={{ left: `${percentage}%` }}
      />
    </div>
  );
};
