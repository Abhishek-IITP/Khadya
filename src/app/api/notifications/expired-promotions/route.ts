import { getUser } from "@/auth/server";
import { createClient } from "@/auth/server";
import { NextResponse } from "next/server";

// GET /api/notifications/expired-promotions - Get expired promotion notifications
export async function GET() {
  try {
    const user = await getUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();

    // Get current date
    const currentDate = new Date().toISOString();

    // Find promotions that expired in the last 24 hours (to show recent notifications)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayISO = yesterday.toISOString();

    // First, let's update any expired promotions that haven't been updated yet
    const { data: updatedPromotions, error: updateError } = await supabase
      .from("Promotions")
      .update({ status: "unpromoted" })
      .eq("user_id", user.id)
      .eq("status", "promoted")
      .lt("end_date", currentDate)
      .select("id, name, end_date");

    if (updateError) {
      console.error("Error updating expired promotions:", updateError);
    } else if (updatedPromotions && updatedPromotions.length > 0) {
      console.log(`Updated ${updatedPromotions.length} expired promotions to unpromoted status`);
      updatedPromotions.forEach(promo => {
        console.log(`Notification: Promotion "${promo.name}" expired on ${promo.end_date}`);
      });
    }

    // Get expired promotions with product details
    const { data: expiredPromotions, error } = await supabase
      .from("Promotions")
      .select(`
        id,
        name,
        description,
        end_date,
        status,
        product_id
      `)
      .eq("user_id", user.id)
      .eq("status", "unpromoted")
      .gte("end_date", yesterdayISO) // Expired in the last 24 hours
      .lte("end_date", currentDate) // But before current time
      .order("end_date", { ascending: false });

    if (error) {
      console.error("Error fetching expired promotions:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Format notifications
    const notifications = expiredPromotions?.map(promotion => ({
      id: promotion.id,
      type: "expired_promotion",
      title: "Promotion Expired",
      message: `Your promotion "${promotion.name}" has expired.`,
      productName: "Product ID: " + promotion.product_id,
      productCategory: "Unknown Category",
      promotionName: promotion.name,
      endDate: promotion.end_date,
      timestamp: new Date().toISOString(),
      read: false
    })) || [];

    return NextResponse.json({
      success: true,
      notifications,
      count: notifications.length
    });

  } catch (error) {
    console.error("Error getting expired promotion notifications:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}

// POST /api/notifications/expired-promotions - Mark notification as read
export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { notificationId } = body;

    if (!notificationId) {
      return NextResponse.json({ error: "Notification ID is required" }, { status: 400 });
    }

    // In a real app, you'd store notification read status in a database
    // For now, we'll just return success
    return NextResponse.json({
      success: true,
      message: "Notification marked as read"
    });

  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}
