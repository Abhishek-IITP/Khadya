import { createClient } from "@/auth/server";
import { NextResponse } from "next/server";

// POST /api/promotions/update-expired - Update expired promotion statuses
export async function POST() {
  try {
    const supabase = await createClient();

    // Get current date in ISO format
    const currentDate = new Date().toISOString();

    // Find all promoted promotions that have ended
    const { data: expiredPromotions, error: fetchError } = await supabase
      .from("Promotions")
      .select("id, name, end_date, status")
      .eq("status", "promoted")
      .lt("end_date", currentDate); // end_date is less than current date

    if (fetchError) {
      console.error("Error fetching expired promotions:", fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!expiredPromotions || expiredPromotions.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No expired promotions found",
        updatedCount: 0
      });
    }

    // Update all expired promotions to "unpromoted" status
    const { data: updatedPromotions, error: updateError } = await supabase
      .from("Promotions")
      .update({ status: "unpromoted" })
      .eq("status", "promoted")
      .lt("end_date", currentDate)
      .select("id, name, end_date");

    if (updateError) {
      console.error("Error updating expired promotions:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    console.log(`Updated ${updatedPromotions?.length || 0} expired promotions to unpromoted status`);

    // Log notification trigger for expired promotions
    if (updatedPromotions && updatedPromotions.length > 0) {
      console.log(`Triggering notifications for ${updatedPromotions.length} expired promotions`);
      updatedPromotions.forEach(promo => {
        console.log(`Notification: Promotion "${promo.name}" expired on ${promo.end_date}`);
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${updatedPromotions?.length || 0} expired promotions`,
      updatedCount: updatedPromotions?.length || 0,
      updatedPromotions: updatedPromotions
    });

  } catch (error) {
    console.error("Unexpected error updating expired promotions:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}

// GET /api/promotions/update-expired - Check for expired promotions (for manual testing)
export async function GET() {
  try {
    const supabase = await createClient();
    const currentDate = new Date().toISOString();

    // Find all promoted promotions that have ended
    const { data: expiredPromotions, error } = await supabase
      .from("Promotions")
      .select("id, name, end_date, status")
      .eq("status", "promoted")
      .lt("end_date", currentDate);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      expiredCount: expiredPromotions?.length || 0,
      expiredPromotions: expiredPromotions || []
    });

  } catch (error) {
    console.error("Error checking expired promotions:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}
