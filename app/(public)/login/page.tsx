"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell, Panel } from "@/app/components/ui";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.info("Marketplace login submitted", { email, password });
  };

  return (
    <AppShell showCTA={false}>
      <section className="mx-auto flex max-w-5xl items-center justify-center px-6 py-10 sm:px-8 lg:px-10 lg:py-16">
        <Panel title="Вход за фирми" description="Влезте в профила си, за да управлявате компанията и документите си." className="w-full max-w-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block text-sm text-slate-700">
              <span className="mb-2 block font-medium">Имейл</span>
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 outline-none transition focus:border-[#0F4C81]"
                placeholder="name@company.bg"
              />
            </label>
            <label className="block text-sm text-slate-700">
              <span className="mb-2 block font-medium">Парола</span>
              <input
                required
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 outline-none transition focus:border-[#0F4C81]"
                placeholder="Въведете парола"
              />
            </label>
            <button type="submit" className="inline-flex h-12 items-center justify-center rounded-[12px] bg-[#0F4C81] px-6 text-sm font-semibold text-white transition hover:bg-[#0B3D67]">
              Влез
            </button>
          </form>

          <div className="mt-6 rounded-[20px] border border-slate-200 bg-[#F8FAFC] p-4 text-sm text-slate-700">
            Нямате профил? <Link href="/register" className="font-semibold text-[#0F4C81]">Регистрирайте се</Link>
          </div>
        </Panel>
      </section>
    </AppShell>
  );
}
