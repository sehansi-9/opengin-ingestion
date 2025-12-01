'use client';

import { useAddDealContext } from '@/contexts/addDealContext';
import clsx from 'clsx';

interface InputProps {
  label: string;
  id: string;
  description?: string;
  required?: boolean;
  pattern?: string;
  type: string;
  minLength?: number;
  min?: number;
  max?: number;
  errorMsg?: string;
  className?: string;
}

export default function Input({
  label,
  id,
  required,
  pattern,
  type,
  minLength,
  min,
  max,
  description,
  errorMsg,
  className,
}: InputProps) {
  const { updateNewDealDetails, newDealData } = useAddDealContext();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNewDealDetails({ [e.target.name]: e.target.value });
  };

  return (
    <div>
      <label className="block text-lg" htmlFor={id}>
        {label}
        {description && (
          <span className="text-sm text-muted-foreground block mb-1">
            {description}
          </span>
        )}
      </label>

      <input
        className={clsx(
          // Base styles
          "w-full rounded-lg px-3 py-3 transition-colors text-sm",

          // Light mode
          "bg-white border border-slate-300 text-slate-900 placeholder-slate-400",
          
          // Dark mode
          "dark:bg-transparent dark:text-slate-100 dark:placeholder-slate-500",

          // Error styling
          errorMsg &&
            "border-red-500 dark:border-red-600 focus-visible:ring-red-500 dark:focus-visible:ring-red-500",

          // Allow manual overrides
          className
        )}
        type={type}
        name={id}
        id={id}
        required={required}
        pattern={pattern}
        minLength={minLength}
        min={min}
        max={max}
        onChange={handleInputChange}
        defaultValue={newDealData[id]}
      />

      <div className="min-h-8 mt-1">
        {errorMsg && (
          <span className="text-red-500 text-sm block">
            {errorMsg}
          </span>
        )}
      </div>
    </div>
  );
}
