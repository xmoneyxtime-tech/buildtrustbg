/**
 * Reusable Form Input Component
 * 
 * Provides consistent styling and behavior for all form inputs.
 */

"use client";

import { FC, InputHTMLAttributes } from "react";
import type {
  ButtonHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const FormInput: FC<FormInputProps> = ({
  label,
  error,
  hint,
  required,
  className,
  ...props
}) => {
  return (
    <label className="block text-sm text-slate-700">
      {label && (
        <span className="mb-2 flex items-center gap-1">
          <span className="font-medium text-slate-900">{label}</span>
          {required && <span className="text-red-500">*</span>}
        </span>
      )}
      <input
        {...props}
        className={`
          w-full rounded-2xl border bg-[#F8FAFC] px-4 py-3
          outline-none transition
          focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81]
          disabled:bg-slate-100 disabled:cursor-not-allowed
          ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-slate-200 hover:border-slate-300"
          }
          ${className || ""}
        `}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </label>
  );
};

/**
 * Reusable Form Textarea Component
 */
interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  rows?: number;
}

export const FormTextarea: FC<FormTextareaProps> = ({
  label,
  error,
  hint,
  required,
  rows = 4,
  className,
  ...props
}) => {
  return (
    <label className="block text-sm text-slate-700">
      {label && (
        <span className="mb-2 flex items-center gap-1">
          <span className="font-medium text-slate-900">{label}</span>
          {required && <span className="text-red-500">*</span>}
        </span>
      )}
      <textarea
        rows={rows}
        {...props}
        className={`
          w-full rounded-2xl border bg-[#F8FAFC] px-4 py-3
          outline-none transition font-sans
          focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81]
          disabled:bg-slate-100 disabled:cursor-not-allowed
          resize-none
          ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-slate-200 hover:border-slate-300"
          }
          ${className || ""}
        `}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </label>
  );
};

/**
 * Reusable Form Select Component
 */
interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
}

export const FormSelect: FC<FormSelectProps> = ({
  label,
  error,
  hint,
  required,
  options,
  className,
  ...props
}) => {
  return (
    <label className="block text-sm text-slate-700">
      {label && (
        <span className="mb-2 flex items-center gap-1">
          <span className="font-medium text-slate-900">{label}</span>
          {required && <span className="text-red-500">*</span>}
        </span>
      )}
      <select
        {...props}
        className={`
          w-full rounded-2xl border bg-[#F8FAFC] px-4 py-3
          outline-none transition
          focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81]
          disabled:bg-slate-100 disabled:cursor-not-allowed
          ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-slate-200 hover:border-slate-300"
          }
          ${className || ""}
        `}
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </label>
  );
};

/**
 * Form Section Container
 */
interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const FormSection: FC<FormSectionProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </div>
  );
};

/**
 * Form Submit Button
 */
interface FormSubmitButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  icon?: React.ReactNode;
}

export const FormSubmitButton: FC<FormSubmitButtonProps> = ({
  loading,
  icon,
  children,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`
        rounded-2xl bg-[#0F4C81] px-6 py-3
        font-medium text-white transition
        hover:bg-[#0A3A5C] disabled:bg-slate-300
        disabled:cursor-not-allowed flex items-center gap-2
        ${className || ""}
      `}
    >
      {loading && (
        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {icon && !loading && icon}
      {children}
    </button>
  );
};
