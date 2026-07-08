"use client";

import { useState } from "react";

type FormField = {
  name: string;
  label: string;
  type: "text" | "email" | "textarea" | "select";
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
};

type AdminFormProps = {
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => void;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
};

export function AdminForm({
  fields,
  onSubmit,
  submitLabel = "Запази",
  cancelLabel = "Отмени",
  onCancel,
}: AdminFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {}));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-[20px] border border-slate-200/80 bg-white p-8 shadow-[0_12px_32px_-16px_rgba(15,76,129,0.12)]">
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-semibold text-slate-900">{field.label}</label>

          {field.type === "textarea" ? (
            <textarea
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              required={field.required}
              className="mt-2 w-full rounded-[12px] border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0F4C81]/50 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/10"
              rows={4}
            />
          ) : field.type === "select" ? (
            <select
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required={field.required}
              className="mt-2 w-full rounded-[12px] border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-900 focus:border-[#0F4C81]/50 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/10"
            >
              <option value="">Избери опция</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              required={field.required}
              className="mt-2 w-full rounded-[12px] border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0F4C81]/50 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/10"
            />
          )}
        </div>
      ))}

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-[12px] bg-[#0F4C81] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0B3D67]"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-[12px] border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {cancelLabel}
          </button>
        )}
      </div>
    </form>
  );
}
