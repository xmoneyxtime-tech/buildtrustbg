"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DashboardShell } from "@/app/components/ui";
import { mockCities, mockCompanies } from "@/app/lib/mock-admin-data";

export default function CitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate company count per city
  const cityCompanyCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    mockCities.forEach((city) => {
      counts[city.name] = mockCompanies.filter((c) => c.city === city.name).length;
    });
    return counts;
  }, []);

  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return mockCities;

    const query = searchQuery.toLowerCase();
    return mockCities.filter(
      (city) =>
        city.name.toLowerCase().includes(query) ||
        city.region.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <DashboardShell role="admin" title="Градове" subtitle="Управляйте градове и региони">
      <div className="space-y-6">
        <input
          type="text"
          placeholder="Търсете град или регион..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-[12px] border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-500 transition hover:border-gray-300 focus:border-[#F58220] focus:outline-none"
        />

        <div className="space-y-3">
          {filteredCities.length > 0 ? (
            filteredCities.map((city) => (
              <Link
                key={city.id}
                href={`/companies?city=${encodeURIComponent(city.name)}`}
              >
                <div className="flex items-center justify-between rounded-[12px] border border-gray-200 bg-white px-6 py-4 transition hover:border-[#F58220] hover:bg-[#FFF7EE]">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">📍</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{city.name}</h3>
                      <p className="text-sm text-gray-500">
                        {cityCompanyCounts[city.name] || 0} компани{
                          (cityCompanyCounts[city.name] || 0) === 1 ? "я" : "и"
                        }
                      </p>
                    </div>
                  </div>
                  <span className="text-xl text-gray-400">&gt;</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-[12px] border border-gray-200 bg-white px-6 py-12 text-center">
              <p className="text-gray-500">Няма намерени градове</p>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
