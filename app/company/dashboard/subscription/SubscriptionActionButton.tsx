"use client";

import { useState } from "react";

type SubscriptionActionButtonProps = {
  endpoint: string;
  payload?: Record<string, string>;
  label: string;
  variant?: "primary" | "secondary";
  className?: string;
};

export function SubscriptionActionButton({
  endpoint,
  payload,
  label,
  variant = "primary",
  className = "",
}: SubscriptionActionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload ?? {}),
      });

      const data = (await response.json()) as {
        error?: string;
        checkoutUrl?: string;
        portalUrl?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Request failed.");
      }

      const redirectUrl = data.checkoutUrl ?? data.portalUrl;

      if (!redirectUrl) {
        throw new Error("Missing redirect URL.");
      }

      window.location.assign(redirectUrl);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Request failed.");
      setIsLoading(false);
    }
  }

  const baseClass =
    variant === "primary"
      ? "bg-[#0F4C81] text-white hover:bg-[#0B3D67]"
      : "bg-white text-[#0F4C81] ring-1 ring-inset ring-slate-300 hover:bg-slate-50";

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className={`inline-flex h-12 items-center justify-center rounded-[12px] px-6 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 ${baseClass} ${className}`.trim()}
      >
        {isLoading ? "Redirecting..." : label}
      </button>
      {error ? <p className="mt-2 text-sm text-rose-700">{error}</p> : null}
    </div>
  );
}