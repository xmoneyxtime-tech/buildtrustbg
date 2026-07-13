/**
 * Company Profile Update API Route
 * 
 * POST /api/company/profile/update
 * 
 * Updates company profile with validation and business logic.
 * Recalculates profile completion and trust score.
 * Creates activity timeline events.
 */

import { NextRequest, NextResponse } from "next/server";
import type { CompanyProfileUpdateInput, UpdateProfileResponse } from "@/app/lib/company/types";
import {
  validateProfileUpdate,
  sanitizeProfileInput,
  hasUpdateFields,
} from "@/app/lib/company/validation";
import {
  calculateProfileCompletion,
  recalculateTrustScore,
  createActivityEvent,
} from "@/app/lib/company/services";
import { getCurrentUser } from "@/app/lib/auth";

/**
 * Mock database functions - Replace with real database calls
 */
async function getCompanyProfile(companyId: string) {
  // TODO: Replace with real database query
  // This should fetch from your database
  return {
    id: companyId,
    companyName: "Example Company",
    email: "contact@example.com",
    phone: "+359 888 123 456",
    country: "Bulgaria",
    city: "Sofia",
    address: "Sample Street 123",
    industry: "Construction",
    description: "Sample company description",
    website: "https://example.com",
    logoUrl: undefined,
    coverImageUrl: undefined,
    status: "approved" as const,
    profileCompletion: 60,
    trustScore: 75,
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

async function updateCompanyProfile(companyId: string, updates: CompanyProfileUpdateInput) {
  // TODO: Replace with real database update
  // This should update your database and return updated profile
  const currentProfile = await getCompanyProfile(companyId);
  return {
    ...currentProfile,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
}

async function saveActivityEvent(event: ReturnType<typeof createActivityEvent>) {
  // TODO: Replace with real database insert
  // This should save the activity event to your database
  return event;
}

export async function POST(request: NextRequest): Promise<NextResponse<UpdateProfileResponse>> {
  try {
    // 1. Authentication
    const user = getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: User not authenticated",
        },
        { status: 401 }
      );
    }

    // 2. Authorization - Only company users can update their own profile
    if (user.role !== "company") {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden: Only company users can update profiles",
        },
        { status: 403 }
      );
    }

    // 3. Parse request body
    let updateData: CompanyProfileUpdateInput;
    try {
      updateData = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON payload",
        },
        { status: 400 }
      );
    }

    // 4. Check if there are fields to update
    if (!hasUpdateFields(updateData)) {
      return NextResponse.json(
        {
          success: false,
          message: "No fields provided for update",
          profile: undefined,
        },
        { status: 400 }
      );
    }

    // 5. Validate input
    const validationErrors = validateProfileUpdate(updateData);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Validation failed: ${validationErrors.join(", ")}`,
          profile: undefined,
        },
        { status: 400 }
      );
    }

    // 6. Sanitize input
    const sanitizedData = sanitizeProfileInput(updateData);

    // 7. Fetch current profile
    // TODO: Use user.id to get company ID from user-company mapping
    const companyId = user.id;
    const currentProfile = await getCompanyProfile(companyId);

    // 8. Company ownership validation
    // TODO: Verify that user owns this company
    // For now, we assume the user ID maps to company ID

    // 9. Calculate old metrics (for future use in milestone tracking)
    // const oldProfileCompletion = currentProfile.profileCompletion;

    // 10. Update profile in database
    const updatedProfile = await updateCompanyProfile(companyId, sanitizedData);

    // 11. Recalculate metrics
    const newProfileCompletion = calculateProfileCompletion(updatedProfile);
    const newTrustScore = recalculateTrustScore(updatedProfile);

    // 12. Update profile with new metrics
    updatedProfile.profileCompletion = newProfileCompletion;
    updatedProfile.trustScore = newTrustScore;

    // 13. Save updated profile with metrics
    await updateCompanyProfile(companyId, {
      ...sanitizedData,
    });

    // 14. Create activity event
    const activityEvent = createActivityEvent(companyId, sanitizedData, updatedProfile);
    await saveActivityEvent(activityEvent);

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        profile: updatedProfile,
        profileCompletion: newProfileCompletion,
        trustScore: newTrustScore,
        activity: activityEvent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
