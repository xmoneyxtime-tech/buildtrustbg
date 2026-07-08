import { AppShell } from "./components/ui";
import { HomeContent } from "./components/home/HomeContent";

export const metadata = {
  title: "BuildTrustBG | Платформа за строителни компании",
  description: "Намерете, сравнете и изберете проверени строителни фирми в България",
};

export default function Home() {
  return (
    <AppShell>
      <HomeContent />
    </AppShell>
  );
}

