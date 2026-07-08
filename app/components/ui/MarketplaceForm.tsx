"use client";

import { FormEvent, useState } from "react";
import { CompanyRegistrationForm } from "@/app/lib/marketplace/types";

const defaultForm: CompanyRegistrationForm = {
  companyName: "",
  email: "",
  phone: "",
  city: "",
  service: "",
  description: "",
  website: "",
};

type MarketplaceFormProps = {
  onSubmit: (form: CompanyRegistrationForm) => void;
  submitLabel?: string;
};

export function MarketplaceForm({ onSubmit, submitLabel = "Подай заявка" }: MarketplaceFormProps) {
  const [form, setForm] = useState<CompanyRegistrationForm>(defaultForm);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm text-slate-700">
          <span className="mb-2 block font-medium">Име на фирма</span>
          <input
            required
            value={form.companyName}
            onChange={(event) => setForm({ ...form, companyName: event.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 outline-none transition focus:border-[#0F4C81]"
            placeholder="Например BuildPro Ltd"
          />
        </label>
        <label className="block text-sm text-slate-700">
          <span className="mb-2 block font-medium">Имейл</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 outline-none transition focus:border-[#0F4C81]"
            placeholder="name@company.bg"
          />
        </label>
        <label className="block text-sm text-slate-700">
          <span className="mb-2 block font-medium">Телефон</span>
          <input
            required
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 outline-none transition focus:border-[#0F4C81]"
            placeholder="+359 888 123 456"
          />
        </label>
        <label className="block text-sm text-slate-700">
          <span className="mb-2 block font-medium">Град</span>
          <input
            required
            value={form.city}
            onChange={(event) => setForm({ ...form, city: event.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 outline-none transition focus:border-[#0F4C81]"
            placeholder="София"
          />
        </label>
        <label className="block text-sm text-slate-700">
          <span className="mb-2 block font-medium">Услуга</span>
          <input
            required
            value={form.service}
            onChange={(event) => setForm({ ...form, service: event.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 outline-none transition focus:border-[#0F4C81]"
            placeholder="Строителство на къщи"
          />
        </label>
        <label className="block text-sm text-slate-700">
          <span className="mb-2 block font-medium">Уебсайт</span>
          <input
            value={form.website}
            onChange={(event) => setForm({ ...form, website: event.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 outline-none transition focus:border-[#0F4C81]"
            placeholder="https://company.bg"
          />
        </label>
      </div>

      <label className="block text-sm text-slate-700">
        <span className="mb-2 block font-medium">Кратко описание</span>
        <textarea
          required
          rows={4}
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
          className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 outline-none transition focus:border-[#0F4C81]"
          placeholder="Опишете услугите и специализацията на фирмата."
        />
      </label>

      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center rounded-[12px] bg-[#0F4C81] px-6 text-sm font-semibold text-white transition hover:bg-[#0B3D67]"
      >
        {submitLabel}
      </button>
    </form>
  );
}
