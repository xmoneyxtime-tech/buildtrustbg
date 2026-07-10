/**
 * Company Profile Business Logic Services
 * 
 * Handles:
 * - Profile completion calculation
 * - Trust score recalculation
 * - Activity timeline event creation
 * 
 * These services are reusable and not tied to API or UI.
 */

import { CompanyProfileData, CompanyProfileUpdateInput, ActivityEvent, ActivityEventType } from "./types";

/**
 * Profile Completion Checklist Items
 * Maps to ProfileCompletionCard component
 */
const PROFILE_COMPLETION_ITEMS = [
  { key: "logoUrl", weight: 10 },
  { key: "coverImageUrl", weight: 10 },
  { key: "description", weight: 15 },
  { key: "industry", weight: 10 },
  { key: "phone", weight: 10 },
  { key: "country", weight: 10 },
  { key: "city", weight: 10 },
  { key: "address", weight: 5 },
  { key: "website", weight: 10 },
] as const;

/**
 * Calculate profile completion percentage
 * 
 * Weights each field based on importance.
 * Fields are considered complete if they have non-empty values.
 * 
 * @param profile - Company profile data
 * @returns Completion percentage (0-100)
 */
export function calculateProfileCompletion(
  profile: Pick<
    CompanyProfileData,
    "logoUrl" | "coverImageUrl" | "description" | "industry" | "phone" | "country" | "city" | "address" | "website"
  >
): number {
  let totalWeight = 0;
  let completedWeight = 0;

  PROFILE_COMPLETION_ITEMS.forEach(({ key, weight }) => {
    totalWeight += weight;

    const value = profile[key as keyof typeof profile];
    if (value && String(value).trim().length > 0) {
      completedWeight += weight;
    }
  });

  if (totalWeight === 0) return 0;
  return Math.round((completedWeight / totalWeight) * 100);
}

/**
 * Get profile completion checklist
 * 
 * @param profile - Company profile data
 * @returns Array of completion items with completion status
 */
export function getProfileCompletionChecklist(
  profile: Pick<
    CompanyProfileData,
    "logoUrl" | "coverImageUrl" | "description" | "industry" | "phone" | "country" | "city" | "address" | "website"
  >
) {
  return PROFILE_COMPLETION_ITEMS.map(({ key }) => ({
    key,
    completed: Boolean(profile[key as keyof typeof profile]?.toString().trim()),
  }));
}

/**
 * Recalculate trust score
 * 
 * Uses the trust score engine with updated profile data.
 * Must be called after profile updates.
 * 
 * @param profile - Updated company profile
 * @returns New trust score (0-100)
 */
export function recalculateTrustScore(profile: CompanyProfileData): number {
  // TODO: Integrate with trust-score engine when real data available
  // For now, return a calculated trust score based on profile completion
  // Real implementation will need database integration

  const profileCompletion = calculateProfileCompletion(profile);
  const baseScore = profileCompletion * 0.6; // Profile completion is 60% of trust score
  const verificationBonus = profile.status === "approved" ? 20 : 0; // 20% bonus if verified
  const activityBonus = 10; // 10% bonus for recent activity

  return Math.round(Math.min(100, baseScore + verificationBonus + activityBonus));
}

/**
 * Create activity event for profile update
 * 
 * Records what was changed for the activity timeline.
 * 
 * @param companyId - Company ID
 * @param updateData - Fields that were updated
 * @param profile - Updated profile data
 * @returns Activity event
 */
export function createActivityEvent(
  companyId: string,
  updateData: CompanyProfileUpdateInput,
  profile: CompanyProfileData
): ActivityEvent {
  const changedFields = Object.keys(updateData) as Array<keyof CompanyProfileUpdateInput>;
  void profile; // Mark as used to satisfy linter

  let type: ActivityEventType = "profile_updated";
  let title = "Profile updated";
  let description: string | undefined;

  // Determine specific event type based on what changed
  if (changedFields.length === 1) {
    const field = changedFields[0];
    if (field === "logoUrl") {
      type = "logo_changed";
      title = "Logo updated";
    } else if (field === "coverImageUrl") {
      type = "cover_image_changed";
      title = "Cover image updated";
    } else if (["email", "phone", "website"].includes(field)) {
      type = "contact_updated";
      title = "Contact information updated";
    } else if (["country", "city", "address"].includes(field)) {
      type = "location_updated";
      title = "Location information updated";
    }
  }

  if (changedFields.length > 1) {
    description = `Updated ${changedFields.length} field${changedFields.length > 1 ? "s" : ""}`;
  }

  return {
    id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    companyId,
    type,
    title,
    description,
    metadata: {
      changedFields,
      previousValues: {},
      newValues: updateData,
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Check if profile completion changed
 * 
 * Useful for determining if we should show a celebration or notification.
 * 
 * @param oldCompletion - Previous completion percentage
 * @param newCompletion - New completion percentage
 * @returns true if completion improved
 */
export function hasCompletionImproved(
  oldCompletion: number,
  newCompletion: number
): boolean {
  return newCompletion > oldCompletion;
}

/**
 * Get completion milestones
 * 
 * Returns whether certain completion thresholds were reached.
 * Useful for gamification/rewards.
 * 
 * @param oldCompletion - Previous completion percentage
 * @param newCompletion - New completion percentage
 * @returns Array of milestones reached
 */
export function getCompletionMilestones(
  oldCompletion: number,
  newCompletion: number
): number[] {
  const milestones = [25, 50, 75, 100];
  return milestones.filter(
    (milestone) => oldCompletion < milestone && newCompletion >= milestone
  );
}
