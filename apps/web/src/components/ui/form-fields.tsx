"use client";

import type { ReactNode } from "react";

export function FieldWrapper({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-ink">
        {label}
        {required ? <span className="text-primary"> *</span> : null}
      </label>
      {hint ? <p className="text-xs text-gray-500">{hint}</p> : null}
      {children}
    </div>
  );
}

export function TextField({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
    />
  );
}

export function TextAreaField({
  value,
  onChange,
  placeholder,
  rows = 5,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
    />
  );
}

export function RadioGroupField({
  name,
  options,
  value,
  onChange,
  descriptions,
}: {
  name: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  descriptions?: Record<string, string>;
}) {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <label
          key={option}
          className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
            value === option
              ? "border-primary bg-primary/5"
              : "border-gray-200 bg-white hover:border-primary/30"
          }`}
        >
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
            className="mt-0.5 h-4 w-4 accent-[var(--color-primary)]"
          />
          <span>
            <span className="font-medium text-ink">{option}</span>
            {descriptions?.[option] ? (
              <span className="mt-1 block text-xs text-gray-500 leading-relaxed">
                {descriptions[option]}
              </span>
            ) : null}
          </span>
        </label>
      ))}
    </div>
  );
}

export function CheckboxGroupField({
  options,
  values,
  onChange,
}: {
  options: readonly string[];
  values: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = (option: string) => {
    onChange(
      values.includes(option)
        ? values.filter((v) => v !== option)
        : [...values, option],
    );
  };

  return (
    <div className="grid sm:grid-cols-2 gap-2">
      {options.map((option) => (
        <label
          key={option}
          className={`flex cursor-pointer items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm transition-colors ${
            values.includes(option)
              ? "border-primary bg-primary/5"
              : "border-gray-200 bg-white hover:border-primary/30"
          }`}
        >
          <input
            type="checkbox"
            checked={values.includes(option)}
            onChange={() => toggle(option)}
            className="mt-0.5 h-4 w-4 accent-[var(--color-primary)]"
          />
          <span className="text-ink leading-snug">{option}</span>
        </label>
      ))}
    </div>
  );
}
