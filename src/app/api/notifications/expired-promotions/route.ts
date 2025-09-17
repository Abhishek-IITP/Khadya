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

    // Get expired promotions with product details
    const { data: expiredPromotions, error } = await supabase
      .from("Promotions")
      .select(`
        id,
        name,
        description,
        end_date,
        status,
        products!inner(
          id,
          title,
          category
        )
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
      message: `Your promotion "${promotion.name}" for ${promotion.products.title} has expired.`,
      productName: promotion.products.title,
      productCategory: promotion.products.category,
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
