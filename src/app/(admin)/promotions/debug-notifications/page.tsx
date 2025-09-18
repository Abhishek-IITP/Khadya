"use client";
import React, { useState } from "react";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

const DebugNotifications: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const testNotificationAPI = async () => {
    setIsLoading(true);
    setResults(null);

    try {
      const response = await fetch("/api/notifications/expired-promotions");
      const data = await response.json();
      
      setResults({
        type: "notifications",
        data: data,
        success: response.ok
      });

      console.log("Notification API Response:", data);
    } catch (error) {
      console.error("Error testing notification API:", error);
      setResults({
        type: "notifications",
        data: { error: "Failed to fetch notifications" },
        success: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testUpdateExpiredAPI = async () => {
    setIsLoading(true);
    setResults(null);

    try {
      const response = await fetch("/api/promotions/update-expired", {
        method: "POST"
      });
      const data = await response.json();
      
      setResults({
        type: "update-expired",
        data: data,
        success: response.ok
      });

      console.log("Update Expired API Response:", data);
    } catch (error) {
      console.error("Error testing update expired API:", error);
      setResults({
        type: "update-expired",
        data: { error: "Failed to update expired promotions" },
        success: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkExpiredPromotions = async () => {
    setIsLoading(true);
    setResults(null);

    try {
      const response = await fetch("/api/promotions/update-expired", {
        method: "GET"
      });
      const data = await response.json();
      
      setResults({
        type: "check-expired",
        data: data,
        success: response.ok
      });

      console.log("Check Expired API Response:", data);
    } catch (error) {
      console.error("Error checking expired promotions:", error);
      setResults({
        type: "check-expired",
        data: { error: "Failed to check expired promotions" },
        success: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTestExpiredPromotion = async () => {
    setIsLoading(true);
    setResults(null);

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
          name: "Test Expired Promotion - " + new Date().toLocaleTimeString(),
          description: "This is a test promotion that has expired",
          product_id: "test-product-id", // You'll need a real product ID
          start_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          end_date: oneHourAgo.toISOString(), // 1 hour ago
          status: "promoted" // Start as promoted, then it will be marked as expired
        }),
      });

      const data = await response.json();
      
      setResults({
        type: "create-test",
        data: data,
        success: response.ok
      });

      console.log("Create Test Promotion Response:", data);
    } catch (error) {
      console.error("Error creating test promotion:", error);
      setResults({
        type: "create-test",
        data: { error: "Failed to create test promotion" },
        success: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-gray-200 shadow-sm">
          <ShowcaseSection title="Debug Notification System" className="!p-6.5">
            <div className="p-6">
              <div className="mb-8">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Debug Expired Promotion Notifications
                </h3>
                <p className="mb-6 text-gray-600">
                  This tool helps debug the notification system by testing all the APIs and checking the data flow.
                </p>

                <div className="mb-6 rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">🔍 Debug Steps:</h4>
                  <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
                    <li>Check for expired promotions (should find promoted promotions with end_date < now)</li>
                    <li>Update expired promotions (should change status from "promoted" to "unpromoted")</li>
                    <li>Test notification API (should find unpromoted promotions from last 24 hours)</li>
                    <li>Create test promotion (creates a promotion that expired 1 hour ago)</li>
                  </ol>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={checkExpiredPromotions}
                    disabled={isLoading}
                    className="rounded-lg bg-blue-600 px-4 py-3 text-white disabled:bg-gray-400"
                  >
                    {isLoading ? "Checking..." : "1. Check Expired Promotions"}
                  </button>

                  <button
                    onClick={testUpdateExpiredAPI}
                    disabled={isLoading}
                    className="rounded-lg bg-green-600 px-4 py-3 text-white disabled:bg-gray-400"
                  >
                    {isLoading ? "Updating..." : "2. Update Expired Promotions"}
                  </button>

                  <button
                    onClick={testNotificationAPI}
                    disabled={isLoading}
                    className="rounded-lg bg-purple-600 px-4 py-3 text-white disabled:bg-gray-400"
                  >
                    {isLoading ? "Testing..." : "3. Test Notification API"}
                  </button>

                  <button
                    onClick={createTestExpiredPromotion}
                    disabled={isLoading}
                    className="rounded-lg bg-orange-600 px-4 py-3 text-white disabled:bg-gray-400"
                  >
                    {isLoading ? "Creating..." : "4. Create Test Promotion"}
                  </button>
                </div>

                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">🔔 Check Header Notifications</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    After running the tests above, check the notification bell icon in the header (top-right corner) to see if notifications appear.
                  </p>
                  <div className="text-xs text-blue-600">
                    <p><strong>Expected behavior:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Red dot should appear on notification bell</li>
                      <li>Clicking bell should show expired promotion notifications</li>
                      <li>Notifications should appear 3 times with 30-minute intervals</li>
                      <li>Auto-refresh every 5 minutes</li>
                    </ul>
                  </div>
                </div>
              </div>

              {results && (
                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 font-semibold text-gray-900">
                    {results.success ? "✅ Success" : "❌ Error"} - {results.type}
                  </h4>
                  
                  <div className="bg-gray-50 p-3 rounded mt-2">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(results.data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              <div className="mt-8 rounded-lg bg-gray-50 p-4">
                <h4 className="mb-2 font-semibold text-gray-900">Expected Flow:</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p><strong>Step 1:</strong> Check for promoted promotions with end_date < current time</p>
                  <p><strong>Step 2:</strong> Update those promotions to status "unpromoted"</p>
                  <p><strong>Step 3:</strong> Notification API should find unpromoted promotions from last 24 hours</p>
                  <p><strong>Step 4:</strong> Header notification should display these notifications</p>
                </div>
              </div>
            </div>
          </ShowcaseSection>
        </div>
      </div>
    </div>
  );
};

export default DebugNotifications;
