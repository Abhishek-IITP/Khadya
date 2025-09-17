import { getUser } from "@/auth/server";
import { createClient } from "@/auth/server";
import { NextResponse } from "next/server";
import { z } from "zod";

// Zod schema for promotion data validation
const promotionSchema = z.object({
  name: z.string().min(1, "Promotion name is required"),
  description: z.string().min(1, "Description is required"),
  product_id: z.string().min(1, "Product ID is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  status: z.string().optional().default("pending"),
});

// POST /api/promotions - Create a new promotion
export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate the request body
    const validatedData = promotionSchema.parse(body);

    const supabase = await createClient();

    // Insert promotion into database
    const { data: promotion, error } = await supabase
      .from("Promotions")
      .insert([
        {
          name: validatedData.name,
          description: validatedData.description,
          product_id: validatedData.product_id,
          user_id: user.id,
          start_date: validatedData.start_date,
          end_date: validatedData.end_date,
          status: validatedData.status,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Promotion created successfully",
      promotion 
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: "Validation failed", 
        details: error.errors 
      }, { status: 400 });
    }

    console.error("Unexpected error:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}
