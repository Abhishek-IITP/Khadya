"use client";

import { ChevronUpIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import { useId, useState } from "react";

type SelectItem = { value: string; label: string };

type SelectProps = {
  required?: boolean;
  label: string;
  items: SelectItem[];
  prefixIcon?: React.ReactNode;
  className?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
};

export function Select({
  required,
  items,
  label,
  defaultValue,
  placeholder,
  prefixIcon,
  value,
  onChange,
  className,
}: SelectProps) {
  const id = useId();

  // fallback to internal state only if value is not passed
  const [isOptionSelected, setIsOptionSelected] = useState(defaultValue || "");
  const selected = value ?? isOptionSelected;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVal = e.target.value;
    setIsOptionSelected(newVal);
    onChange?.(newVal);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <label
        htmlFor={id}
        className="block text-body-sm font-medium text-dark dark:text-white"
      >
        {label}
      </label>

      <div className="relative">
        {prefixIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            {prefixIcon}
          </div>
        )}

        <select
          required={required}
          id={id}
          value={selected}
          onChange={handleChange}
          className={cn(
            "w-full appearance-none rounded-lg border border-stroke bg-transparent px-5.5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary [&>option]:text-dark-5 dark:[&>option]:text-dark-6",
            selected && "text-dark dark:text-white",
            prefixIcon && "pl-11.5"
          )}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}

          {items.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <ChevronUpIcon className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-180" />
      </div>
    </div>
  );
}
