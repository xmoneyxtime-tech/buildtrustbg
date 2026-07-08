import { ReactNode } from "react";
import { Footer } from "./Footer";
import { ClientAppShellHeader } from "./ClientAppShellHeader";

type AppShellProps = {
  children: ReactNode;
  showCTA?: boolean;
};

export function AppShell({ children, showCTA = true }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)] text-slate-900">
      <ClientAppShellHeader showCTA={showCTA} />

      <main>{children}</main>

      <Footer />
    </div>
  );
}
