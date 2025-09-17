import { getUser } from "@/auth/server";
import { createClient } from "@/auth/server";
import { NextResponse } from "next/server";
import { z } from "zod";

// Zod schema for checking existing promotions
const checkPromotionSchema = z.object({
  product_id: z.string().min(1, "Product ID is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
});

// POST /api/promotions/check - Check for existing active promotions
export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate the request body
    const validatedData = checkPromotionSchema.parse(body);

    const supabase = await createClient();

    // Check for existing active promotions for this product
    const { data: existingPromotions, error } = await supabase
      .from("Promotions")
      .select("id, name, start_date, end_date, status")
      .eq("product_id", validatedData.product_id)
      .eq("user_id", user.id)
      .eq("status", "promoted")
      .gte("end_date", new Date().toISOString()); // Only check promotions that haven't ended yet

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Check if the new promotion dates overlap with existing promotions
    const newStartDate = new Date(validatedData.start_date);
    const newEndDate = new Date(validatedData.end_date);
    
    const conflictingPromotions = existingPromotions?.filter(promotion => {
      const existingStartDate = new Date(promotion.start_date);
      const existingEndDate = new Date(promotion.end_date);
      
      // Check for date overlap
      return (
        (newStartDate <= existingEndDate && newEndDate >= existingStartDate)
      );
    }) || [];

    if (conflictingPromotions.length > 0) {
      const conflict = conflictingPromotions[0];
      return NextResponse.json({
        hasConflict: true,
        conflict: {
          id: conflict.id,
          name: conflict.name,
          start_date: conflict.start_date,
          end_date: conflict.end_date,
        },
        message: `This product already has an active promotion "${conflict.name}" running from ${new Date(conflict.start_date).toLocaleDateString()} to ${new Date(conflict.end_date).toLocaleDateString()}. Please wait until the current promotion ends.`
      });
    }

    return NextResponse.json({
      hasConflict: false,
      message: "No conflicts found. Product can be promoted."
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: "Validation failed", 
        details: error.issues 
      }, { status: 400 });
    }

    console.error("Unexpected error:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}
