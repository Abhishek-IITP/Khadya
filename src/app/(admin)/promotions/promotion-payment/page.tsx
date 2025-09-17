"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Checkbox } from "@/components/FormElements/checkbox";
import { RadioInput } from "@/components/FormElements/radio";

interface PaymentData {
  promotionName: string;
  description: string;
  productName: string;
  productCategory: string;
  startDate: string;
  endDate: string;
  duration: number;
  price: number;
}

const PaymentGateway: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Calculate pricing based on duration (200 for 7 days)
  const calculatePrice = (duration: number): number => {
    const basePrice = 200; // Base price for 7 days
    const pricePerDay = basePrice / 7; // ~28.57 per day
    return Math.round(pricePerDay * duration);
  };

  useEffect(() => {
    // Get promotion data from URL parameters
    const promotionName = searchParams.get("name");
    const description = searchParams.get("description");
    const productName = searchParams.get("productName");
    const productCategory = searchParams.get("productCategory");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (promotionName && description && productCategory && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const price = calculatePrice(duration);

      setPaymentData({
        promotionName,
        description,
        productName: productName || "",
        productCategory,
        startDate,
        endDate,
        duration,
        price,
      });
    } else {
      // Redirect back to create promotion if data is missing
      router.push("/promotions/create");
    }
  }, [searchParams, router]);

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      alert("Please select a payment method");
      return;
    }

    if (!termsAccepted) {
      alert("Please accept the terms and conditions");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // After successful payment, save the promotion to database
      if (!paymentData) {
        throw new Error("Payment data is missing");
      }

      const promotionData = {
        name: paymentData.promotionName,
        description: paymentData.description,
        product_id: searchParams.get("productId") || "", // We need to pass product ID
        start_date: paymentData.startDate,
        end_date: paymentData.endDate,
        status: "promoted", // Set status to "promoted" after successful payment
      };

      console.log("Saving promotion after payment:", promotionData);

      const response = await fetch("/api/promotions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(promotionData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create promotion");
      }

      console.log("Promotion created successfully:", result);
      
      // Clear the saved form data from localStorage after successful payment
      localStorage.removeItem('promotionFormData');
      console.log("Cleared saved form data from localStorage");
      
      // Show success alert and then redirect with loading state
      alert("Payment successful! Your promotion has been created and is now live.");
      
      // Set redirecting state and redirect
      setIsRedirecting(true);
      setTimeout(() => {
        router.push("/dashboard"); // Redirect to dashboard on successful payment
      }, 1000); // Small delay to show the loading state
    } catch (error) {
      console.error("Error processing payment:", error);
      alert(`Payment failed: ${error instanceof Error ? error.message : "Please try again."}`);
      // Redirect back to promotion page on payment failure
      router.push("/promotions/create");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">Loading payment details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show redirecting loader
  if (isRedirecting) {
    return (
      <div className="min-h-screen py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-gray-200 shadow-sm">
            <div className="p-12 text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Redirecting to Dashboard
              </h3>
              <p className="text-gray-600">
                Your promotion has been successfully created and is now live!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-gray-200 shadow-sm">
          <ShowcaseSection title="Payment Gateway" className="!p-6.5">
            <div className="p-6">
              {/* Promotion Details */}
              <div className="mb-8 rounded-lg bg-gray-50 p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Promotion Details
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Promotion Name</p>
                    <p className="text-gray-900">{paymentData.promotionName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Product Category</p>
                    <p className="text-gray-900">{paymentData.productCategory}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Duration</p>
                    <p className="text-gray-900">{paymentData.duration} days</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Period</p>
                    <p className="text-gray-900">
                      {new Date(paymentData.startDate).toLocaleDateString()} -{" "}
                      {new Date(paymentData.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-600">Description</p>
                  <p className="text-gray-900">{paymentData.description}</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-8 rounded-lg bg-blue-50 p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Pricing Details
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Promotion for {paymentData.duration} days
                    </p>
                    <p className="text-xs text-gray-500">
                      (₹{Math.round(200 / 7)} per day)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      ₹{paymentData.price}
                    </p>
                    <p className="text-sm text-gray-500">Total Amount</p>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-8">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Select Payment Method
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="credit"
                      name="paymentMethod"
                      value="credit"
                      checked={selectedPaymentMethod === "credit"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label htmlFor="credit" className="text-sm font-medium text-gray-700">
                      Credit Card
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="debit"
                      name="paymentMethod"
                      value="debit"
                      checked={selectedPaymentMethod === "debit"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label htmlFor="debit" className="text-sm font-medium text-gray-700">
                      Debit Card
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="upi"
                      name="paymentMethod"
                      value="upi"
                      checked={selectedPaymentMethod === "upi"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label htmlFor="upi" className="text-sm font-medium text-gray-700">
                      UPI
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="netbanking"
                      name="paymentMethod"
                      value="netbanking"
                      checked={selectedPaymentMethod === "netbanking"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label htmlFor="netbanking" className="text-sm font-medium text-gray-700">
                      Net Banking
                    </label>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="mb-8">
                <Checkbox
                  label="I agree to the terms and conditions and privacy policy"
                  withIcon="check"
                  withBg
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50"
                >
                  Back to Promotion
                </button>
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={isProcessing || !selectedPaymentMethod || !termsAccepted}
                  className="rounded-lg bg-blue-600 px-8 py-3 text-white disabled:bg-gray-400"
                >
                  {isProcessing ? "Processing..." : `Pay ₹${paymentData.price}`}
                </button>
              </div>
            </div>
          </ShowcaseSection>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
