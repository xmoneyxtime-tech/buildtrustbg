"use client";

import { ReactNode } from "react";
import { TranslationProvider } from "@/app/lib/i18n";

interface RootLayoutClientProps {
  children: ReactNode;
}

export function RootLayoutClient({ children }: RootLayoutClientProps) {
  return (
    <TranslationProvider>
      {children}
    </TranslationProvider>
  );
}
