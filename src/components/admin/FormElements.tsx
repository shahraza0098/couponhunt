import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function FormInput({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-[--ch-text-muted] mb-2">{label}</label>
      <input
        className="block w-full rounded-xl border-0 py-3 px-4 bg-[--ch-bg] text-[--ch-text] shadow-sm ring-1 ring-inset ring-[--ch-border] focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm transition-all"
        {...props}
      />
      {error && <p className="mt-2 text-sm text-rose-500">{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

export function FormSelect({ label, options, error, className = '', ...props }: SelectProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-[--ch-text-muted] mb-2">{label}</label>
      <select
        className="block w-full rounded-xl border-0 py-3 px-4 bg-[--ch-bg] text-[--ch-text] shadow-sm ring-1 ring-inset ring-[--ch-border] focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm transition-all appearance-none"
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-2 text-sm text-rose-500">{error}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function FormTextarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-[--ch-text-muted] mb-2">{label}</label>
      <textarea
        className="block w-full rounded-xl border-0 py-3 px-4 bg-[--ch-bg] text-[--ch-text] shadow-sm ring-1 ring-inset ring-[--ch-border] focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm transition-all"
        rows={4}
        {...props}
      />
      {error && <p className="mt-2 text-sm text-rose-500">{error}</p>}
    </div>
  );
}

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
}

export function FormCheckbox({ label, description, className = '', ...props }: CheckboxProps) {
  return (
    <div className={`relative flex items-start ${className}`}>
      <div className="flex h-6 items-center">
        <input
          type="checkbox"
          className="h-5 w-5 rounded border-[--ch-border] bg-[--ch-bg] text-emerald-500 focus:ring-emerald-600 focus:ring-offset-[--ch-surface]"
          {...props}
        />
      </div>
      <div className="ml-3 text-sm leading-6">
        <label className="font-medium text-[--ch-text]">{label}</label>
        {description && <p className="text-[--ch-text-muted]">{description}</p>}
      </div>
    </div>
  );
}
