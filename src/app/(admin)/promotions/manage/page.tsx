"use client";
import React, { useState } from "react";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

const PromotionManagement: React.FC = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateResult, setUpdateResult] = useState<any>(null);

  const handleUpdateExpired = async () => {
    setIsUpdating(true);
    setUpdateResult(null);

    try {
      const response = await fetch("/api/promotions/update-expired", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      setUpdateResult(result);

      if (response.ok) {
        console.log("Successfully updated expired promotions:", result);
      } else {
        console.error("Failed to update expired promotions:", result);
      }
    } catch (error) {
      console.error("Error updating expired promotions:", error);
      setUpdateResult({
        success: false,
        error: "Failed to update expired promotions"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCheckExpired = async () => {
    setIsUpdating(true);
    setUpdateResult(null);

    try {
      const response = await fetch("/api/promotions/update-expired", {
        method: "GET",
      });

      const result = await response.json();
      setUpdateResult(result);

      if (response.ok) {
        console.log("Expired promotions check:", result);
      } else {
        console.error("Failed to check expired promotions:", result);
      }
    } catch (error) {
      console.error("Error checking expired promotions:", error);
      setUpdateResult({
        success: false,
        error: "Failed to check expired promotions"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-gray-200 shadow-sm">
          <ShowcaseSection title="Promotion Management" className="!p-6.5">
            <div className="p-6">
              <div className="mb-8">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Expired Promotions Management
                </h3>
                <p className="mb-6 text-gray-600">
                  This tool helps manage expired promotions by updating their status from "promoted" to "unpromoted".
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={handleCheckExpired}
                    disabled={isUpdating}
                    className="rounded-lg bg-blue-600 px-6 py-3 text-white disabled:bg-gray-400"
                  >
                    {isUpdating ? "Checking..." : "Check Expired Promotions"}
                  </button>

                  <button
                    onClick={handleUpdateExpired}
                    disabled={isUpdating}
                    className="rounded-lg bg-green-600 px-6 py-3 text-white disabled:bg-gray-400"
                  >
                    {isUpdating ? "Updating..." : "Update Expired Promotions"}
                  </button>
                </div>
              </div>

              {updateResult && (
                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 font-semibold text-gray-900">
                    {updateResult.success ? "✅ Success" : "❌ Error"}
                  </h4>
                  
                  {updateResult.success ? (
                    <div>
                      <p className="text-gray-700">{updateResult.message}</p>
                      {updateResult.updatedCount !== undefined && (
                        <p className="mt-2 text-sm text-gray-600">
                          Updated {updateResult.updatedCount} promotions
                        </p>
                      )}
                      {updateResult.expiredCount !== undefined && (
                        <p className="mt-2 text-sm text-gray-600">
                          Found {updateResult.expiredCount} expired promotions
                        </p>
                      )}
                      {updateResult.updatedPromotions && updateResult.updatedPromotions.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700">Updated Promotions:</p>
                          <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                            {updateResult.updatedPromotions.map((promo: any) => (
                              <li key={promo.id}>
                                {promo.name} (Ended: {new Date(promo.end_date).toLocaleDateString()})
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {updateResult.expiredPromotions && updateResult.expiredPromotions.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700">Expired Promotions:</p>
                          <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                            {updateResult.expiredPromotions.map((promo: any) => (
                              <li key={promo.id}>
                                {promo.name} (Ended: {new Date(promo.end_date).toLocaleDateString()})
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-red-600">{updateResult.error}</p>
                  )}
                </div>
              )}

              <div className="mt-8 rounded-lg bg-gray-50 p-4">
                <h4 className="mb-2 font-semibold text-gray-900">Automated Updates</h4>
                <p className="text-sm text-gray-600">
                  This system automatically updates expired promotion statuses daily at midnight via cron job.
                  You can also manually trigger updates using the buttons above for testing purposes.
                </p>
              </div>
            </div>
          </ShowcaseSection>
        </div>
      </div>
    </div>
  );
};

export default PromotionManagement;
