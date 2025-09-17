"use client";
import React, { useState } from "react";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

const TestNotifications: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const createTestExpiredPromotion = async () => {
    setIsCreating(true);
    setResult(null);

    try {
      // Create a test promotion that expired 1 hour ago
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);
      
      const response = await fetch("/api/promotions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Test Expired Promotion",
          description: "This is a test promotion that has expired",
          product_id: "test-product-id", // You'll need a real product ID
          start_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          end_date: oneHourAgo.toISOString(), // 1 hour ago
          status: "promoted" // Start as promoted, then it will be marked as expired
        }),
      });

      const data = await response.json();
      setResult(data);

      if (response.ok) {
        console.log("Test promotion created:", data);
        
        // Now update it to expired status
        setTimeout(async () => {
          try {
            const updateResponse = await fetch("/api/promotions/update-expired", {
              method: "POST",
            });
            const updateData = await updateResponse.json();
            console.log("Expired promotions updated:", updateData);
          } catch (error) {
            console.error("Error updating expired promotions:", error);
          }
        }, 2000);
      } else {
        console.error("Failed to create test promotion:", data);
      }
    } catch (error) {
      console.error("Error creating test promotion:", error);
      setResult({
        success: false,
        error: "Failed to create test promotion"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const triggerNotificationCheck = async () => {
    setIsCreating(true);
    setResult(null);

    try {
      const response = await fetch("/api/notifications/expired-promotions");
      const data = await response.json();
      setResult(data);

      if (response.ok) {
        console.log("Notifications fetched:", data);
      } else {
        console.error("Failed to fetch notifications:", data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setResult({
        success: false,
        error: "Failed to fetch notifications"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-gray-200 shadow-sm">
          <ShowcaseSection title="Test Notification System" className="!p-6.5">
            <div className="p-6">
              <div className="mb-8">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Test Expired Promotion Notifications
                </h3>
                <p className="mb-6 text-gray-600">
                  This tool helps test the notification system by creating expired promotions and checking notifications.
                </p>

                <div className="mb-6 rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notes:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• You need a valid product ID in your database to create test promotions</li>
                    <li>• Notifications will appear 3 times with 30-minute intervals</li>
                    <li>• Check the notification bell icon in the top-right corner</li>
                    <li>• Notifications auto-refresh every 5 minutes</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={createTestExpiredPromotion}
                    disabled={isCreating}
                    className="rounded-lg bg-blue-600 px-6 py-3 text-white disabled:bg-gray-400"
                  >
                    {isCreating ? "Creating..." : "Create Test Expired Promotion"}
                  </button>

                  <button
                    onClick={triggerNotificationCheck}
                    disabled={isCreating}
                    className="rounded-lg bg-green-600 px-6 py-3 text-white disabled:bg-gray-400"
                  >
                    {isCreating ? "Checking..." : "Check Notifications"}
                  </button>
                </div>
              </div>

              {result && (
                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 font-semibold text-gray-900">
                    {result.success ? "✅ Success" : "❌ Error"}
                  </h4>
                  
                  {result.success ? (
                    <div>
                      <p className="text-gray-700">{result.message}</p>
                      {result.count !== undefined && (
                        <p className="mt-2 text-sm text-gray-600">
                          Found {result.count} notifications
                        </p>
                      )}
                      {result.notifications && result.notifications.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700">Notifications:</p>
                          <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                            {result.notifications.map((notif: any) => (
                              <li key={notif.id}>
                                {notif.title}: {notif.message}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-red-600">{result.error}</p>
                  )}
                </div>
              )}

              <div className="mt-8 rounded-lg bg-gray-50 p-4">
                <h4 className="mb-2 font-semibold text-gray-900">How Notifications Work:</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p><strong>1. Automatic Detection:</strong> System checks for expired promotions daily</p>
                  <p><strong>2. Notification Display:</strong> Shows in top-right notification bell</p>
                  <p><strong>3. Timing:</strong> Appears 3 times with 30-minute intervals</p>
                  <p><strong>4. Auto-refresh:</strong> Checks for new notifications every 5 minutes</p>
                  <p><strong>5. Manual Control:</strong> Users can mark as read or dismiss</p>
                </div>
              </div>
            </div>
          </ShowcaseSection>
        </div>
      </div>
    </div>
  );
};

export default TestNotifications;
