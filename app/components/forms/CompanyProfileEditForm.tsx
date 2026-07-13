/**
 * Company Profile Edit Form
 * 
 * Comprehensive form for editing all company profile fields.
 * Handles validation, loading states, and success/error feedback.
 */

"use client";

import { FC, useMemo, useState, useCallback } from "react";
import { useTranslation } from "@/app/lib/i18n";
import type { CompanyProfileUpdateInput } from "@/app/lib/company/types";
import {
  FormInput,
  FormTextarea,
  FormSelect,
  FormSection,
  FormSubmitButton,
} from "./FormInputs";
import { sortByLocale } from "@/app/lib/sorting";

export const COUNTRIES = [
  { value: "bg", label: "Bulgaria" },
  { value: "eu", label: "European Union" },
];

export const INDUSTRIES = [
  { value: "construction", label: "Construction" },
  { value: "renovation", label: "Renovation" },
  { value: "roofing", label: "Roofing" },
  { value: "electrical", label: "Electrical" },
  { value: "plumbing", label: "Plumbing" },
  { value: "architecture", label: "Architecture" },
  { value: "interior-design", label: "Interior Design" },
  { value: "painting", label: "Painting" },
  { value: "flooring", label: "Flooring" },
  { value: "hvac", label: "HVAC" },
];

export const CITIES = [
  { value: "sofia", label: "Sofia" },
  { value: "plovdiv", label: "Plovdiv" },
  { value: "varna", label: "Varna" },
  { value: "burgas", label: "Burgas" },
  { value: "ruse", label: "Ruse" },
  { value: "stara-zagora", label: "Stara Zagora" },
];

interface CompanyProfileEditFormProps {
  initialData?: CompanyProfileUpdateInput;
  onSuccess?: (data: unknown) => void;
  onError?: (error: string) => void;
}

export const CompanyProfileEditForm: FC<CompanyProfileEditFormProps> = ({
  initialData = {},
  onSuccess,
  onError,
}) => {
  const { t, language } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<CompanyProfileUpdateInput>(initialData);
  const [successMessage, setSuccessMessage] = useState("");
  const sortedIndustries = useMemo(() => sortByLocale(INDUSTRIES, language, (item) => item.label), [language]);
  const sortedCountries = useMemo(() => sortByLocale(COUNTRIES, language, (item) => item.label), [language]);
  const sortedCities = useMemo(() => sortByLocale(CITIES, language, (item) => item.label), [language]);

  const handleInputChange = useCallback(
    (field: keyof CompanyProfileUpdateInput, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value || undefined,
      }));
      // Clear error for this field
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrors({});

    try {
      const response = await fetch("/api/company/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      interface UpdateResponse {
        success: boolean;
        message: string;
        data?: Record<string, unknown>;
      }

      const data: UpdateResponse = await response.json();

      if (!response.ok) {
        // Parse validation errors
        if (response.status === 400) {
          setErrors({ general: data.message });
        } else {
          setErrors({ general: data.message || "Update failed" });
        }
        onError?.(data.message);
        return;
      }

      setSuccessMessage("Profile updated successfully!");
      onSuccess?.(data);

      // Clear form after successful update
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Update failed";
      setErrors({ general: message });
      onError?.(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* General Section */}
      <FormSection
        title={t("dashboardCompany.generalInfo")}
        description="Company name, description, and industry"
      >
        <FormInput
          label={t("formLabels.companyName")}
          placeholder="Enter company name"
          value={formData.companyName || ""}
          onChange={(e) => handleInputChange("companyName", e.target.value)}
          error={errors.companyName}
          hint="2-100 characters"
        />
        <FormSelect
          label={t("formLabels.industry")}
          options={sortedIndustries}
          value={formData.industry || ""}
          onChange={(e) => handleInputChange("industry", e.target.value)}
          error={errors.industry}
        />
        <FormTextarea
          label={t("formLabels.description")}
          placeholder="Enter company description"
          value={formData.description || ""}
          onChange={(e) => handleInputChange("description", e.target.value)}
          error={errors.description}
          hint="10-2000 characters, tell about your services"
          rows={4}
          className="md:col-span-2"
        />
      </FormSection>

      {/* Contact Section */}
      <FormSection
        title={t("dashboardCompany.contactInfo")}
        description="Email, phone, and website"
      >
        <FormInput
          label={t("formLabels.email")}
          type="email"
          placeholder="contact@company.bg"
          value={formData.email || ""}
          onChange={(e) => handleInputChange("email", e.target.value)}
          error={errors.email}
        />
        <FormInput
          label={t("formLabels.phone")}
          type="tel"
          placeholder="+359 888 123 456"
          value={formData.phone || ""}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          error={errors.phone}
          hint="Valid phone number"
        />
        <FormInput
          label={t("formLabels.website")}
          type="url"
          placeholder="https://company.bg"
          value={formData.website || ""}
          onChange={(e) => handleInputChange("website", e.target.value)}
          error={errors.website}
          hint="Must start with https://"
          className="md:col-span-2"
        />
      </FormSection>

      {/* Location Section */}
      <FormSection
        title={t("dashboardCompany.location")}
        description="Country, city, and address"
      >
        <FormSelect
          label={t("formLabels.country")}
          options={sortedCountries}
          value={formData.country || ""}
          onChange={(e) => handleInputChange("country", e.target.value)}
          error={errors.country}
        />
        <FormSelect
          label={t("formLabels.city")}
          options={sortedCities}
          value={formData.city || ""}
          onChange={(e) => handleInputChange("city", e.target.value)}
          error={errors.city}
        />
        <FormInput
          label={t("formLabels.address")}
          placeholder="Street name and number"
          value={formData.address || ""}
          onChange={(e) => handleInputChange("address", e.target.value)}
          error={errors.address}
          hint="5-200 characters"
          className="md:col-span-2"
        />
      </FormSection>

      {/* Branding Section */}
      <FormSection
        title={t("dashboardCompany.branding")}
        description="Logo and cover image URLs"
      >
        <FormInput
          label={t("formLabels.logoUrl")}
          type="url"
          placeholder="https://example.com/logo.png"
          value={formData.logoUrl || ""}
          onChange={(e) => handleInputChange("logoUrl", e.target.value)}
          error={errors.logoUrl}
          hint="HTTPS URL to your logo"
          className="md:col-span-2"
        />
        <FormInput
          label={t("formLabels.coverImageUrl")}
          type="url"
          placeholder="https://example.com/cover.png"
          value={formData.coverImageUrl || ""}
          onChange={(e) => handleInputChange("coverImageUrl", e.target.value)}
          error={errors.coverImageUrl}
          hint="HTTPS URL to your cover image"
          className="md:col-span-2"
        />
      </FormSection>

      {/* Error Message */}
      {errors.general && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">{errors.general}</p>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-medium text-emerald-700">✓ {successMessage}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-4">
        <FormSubmitButton loading={loading} icon="💾">
          {loading ? "Saving..." : "Save Changes"}
        </FormSubmitButton>
        <button
          type="button"
          onClick={() => setFormData(initialData)}
          disabled={loading}
          className="rounded-2xl border border-slate-200 px-6 py-3 font-medium text-slate-900 transition hover:bg-slate-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
