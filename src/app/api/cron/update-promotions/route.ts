import { NextResponse } from "next/server";

// GET /api/cron/update-promotions - Cron job endpoint for updating expired promotions
export async function GET(request: Request) {
  try {
    // Verify the request is from a legitimate cron service
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Call the update-expired API
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const updateUrl = `${baseUrl}/api/promotions/update-expired`;
    
    const response = await fetch(updateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (response.ok) {
      console.log(`Cron job completed: ${result.message}`);
      return NextResponse.json({
        success: true,
        message: result.message,
        updatedCount: result.updatedCount,
        timestamp: new Date().toISOString()
      });
    } else {
      console.error('Cron job failed:', result.error);
      return NextResponse.json({
        success: false,
        error: result.error,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
