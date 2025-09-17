"use client";
import React from "react";
import { Check, X } from "lucide-react";

interface PlanFeature {
  name: string;
  included: boolean;
  value?: string | number;
}

interface Plan {
  name: string;
  price: number;
  duration: string;
  description: string;
  recommended?: boolean;
  features: PlanFeature[];
  buttonText: string;
  buttonVariant: "primary" | "secondary";
}

const plans: Plan[] = [
  {
    name: "Krydha Basic",
    price: 499,
    duration: "30 Days",
    description: "Essential visibility for small businesses ready to grow.",
    features: [
      { name: "Post", included: true, value: 1 },
      { name: "Promotion Validity: 30 Days", included: true },
      { name: "Visibility Boost", included: true },
      { name: "Priority Listing", included: false },
      { name: "App Push Notification", included: false },
      { name: "Email Promotion Blast", included: false },
      { name: "Free Post Replacements (within 30 days)", included: false },
      { name: "Dedicated Support", included: false },
      { name: "Top Seller Badge", included: false },
      { name: "Free Bonus Post", included: false },
    ],
    buttonText: "Start 7-days Free Trial",
    buttonVariant: "secondary",
  },
  {
    name: "Krydha Pro",
    price: 2499,
    duration: "30 Days",
    description: "More posts. More visibility. More opportunities to sell.",
    recommended: true,
    features: [
      { name: "Posts", included: true, value: 6 },
      { name: "Promotion Validity: 30 Days", included: true },
      { name: "Visibility Boost", included: true },
      { name: "Priority Listing", included: true },
      { name: "App Push Notification", included: true },
      { name: "Email Promotion Blast", included: true },
      {
        name: "Free Post Replacements (within 30 days)",
        included: true,
        value: 1,
      },
      { name: "Dedicated Support", included: false },
      { name: "Top Seller Badge", included: false },
      { name: "Free Bonus Post", included: false },
    ],
    buttonText: "Start 7-days Free Trial",
    buttonVariant: "primary",
  },
  {
    name: "Krydha Premium",
    price: 4999,
    duration: "30 Days",
    description: "Maximum visibility, maximum impact — become a top seller.",
    features: [
      { name: "Posts", included: true, value: 15 },
      { name: "Promotion Validity: 30 Days", included: true },
      { name: "Visibility Boost", included: true },
      { name: "Priority Listing", included: true },
      { name: "App Push Notification", included: true },
      { name: "Email Promotion Blast", included: true },
      {
        name: "Free Post Replacements (within 30 days)",
        included: true,
        value: 3,
      },
      { name: "Dedicated Support", included: true },
      { name: "Top Seller Badge", included: true },
      { name: "Free Bonus Post", included: true, value: 1 },
    ],
    buttonText: "Start 7-days Free Trial",
    buttonVariant: "secondary",
  },
];

const BuyPlan: React.FC = () => {
  const handlePlanSelect = (planName: string) => {
    console.log(`Selected plan: ${planName}`);
    // Handle plan selection logic here
  };

  const handleContactBusiness = () => {
    console.log("Contact us for Business Plan clicked");
    // Handle business plan contact logic here
  };

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-50">Pricing</h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-200">
            Promote More. Pay Less. Grow Faster. Save up to 33% with Krydha
            Premium!
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border-2 p-8 ${
                plan.recommended
                  ? "scale-105 border-orange-400 bg-gray-800 text-white shadow-2xl"
                  : "border-orange-200 bg-white text-gray-900 shadow-lg"
              } transition-all duration-300 hover:shadow-xl`}
            >
              {/* Recommended Badge */}
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                  <span className="rounded-full bg-orange-400 px-4 py-1 text-sm font-semibold text-gray-900">
                    Recommended
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-8 text-center">
                <h3
                  className={`mb-4 text-2xl font-bold ${plan.recommended ? "text-white" : "text-gray-900"}`}
                >
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span
                    className={`text-4xl font-bold ${plan.recommended ? "text-orange-400" : "text-gray-900"}`}
                  >
                    ₹{plan.price.toLocaleString()}
                  </span>
                  <span
                    className={`ml-2 text-lg ${plan.recommended ? "text-gray-300" : "text-gray-500"}`}
                  >
                    / {plan.duration}
                  </span>
                </div>
                <p
                  className={`text-sm ${plan.recommended ? "text-gray-300" : "text-gray-600"}`}
                >
                  {plan.description}
                </p>
              </div>

              {/* Divider */}
              <div
                className={`border-t ${plan.recommended ? "border-gray-600" : "border-gray-200"} mb-8`}
              />

              {/* Features List */}
              <div className="mb-8 space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      {feature.included ? (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      ) : (
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full ${
                            plan.recommended ? "bg-gray-600" : "bg-gray-200"
                          }`}
                        >
                          <X
                            className={`h-3 w-3 ${plan.recommended ? "text-gray-400" : "text-gray-400"}`}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {feature.value && (
                          <span
                            className={`text-lg font-bold ${
                              feature.included
                                ? plan.recommended
                                  ? "text-orange-400"
                                  : "text-green-600"
                                : plan.recommended
                                  ? "text-gray-400"
                                  : "text-gray-400"
                            }`}
                          >
                            {feature.value}
                          </span>
                        )}
                        <span
                          className={`text-sm ${
                            feature.included
                              ? plan.recommended
                                ? "text-white"
                                : "text-gray-900"
                              : plan.recommended
                                ? "text-gray-400"
                                : "text-gray-400"
                          }`}
                        >
                          {feature.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handlePlanSelect(plan.name)}
                className={`w-full rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 ${
                  plan.buttonVariant === "primary"
                    ? "bg-orange-400 text-gray-900 hover:bg-orange-500"
                    : "bg-orange-400 text-gray-900 hover:bg-orange-500"
                } transform hover:scale-105 active:scale-95`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Business Plan CTA */}
        <div className="text-center">
          <button
            onClick={handleContactBusiness}
            className="transform rounded-lg bg-orange-400 px-8 py-4 text-lg font-semibold text-gray-900 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-orange-500 active:scale-95"
          >
            Contact us for Business Plan
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-lg">
            <h3 className="mb-6 text-2xl font-bold text-gray-900">
              Why Choose Krydha?
            </h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                  <span className="text-2xl">🚀</span>
                </div>
                <h4 className="mb-2 font-semibold text-gray-900">
                  Boost Visibility
                </h4>
                <p className="text-sm text-gray-600">
                  Get your products seen by more customers with our advanced
                  promotion tools.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                  <span className="text-2xl">📈</span>
                </div>
                <h4 className="mb-2 font-semibold text-gray-900">
                  Increase Sales
                </h4>
                <p className="text-sm text-gray-600">
                  Drive more conversions with targeted promotions and priority
                  listings.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                  <span className="text-2xl">💼</span>
                </div>
                <h4 className="mb-2 font-semibold text-gray-900">
                  Grow Your Business
                </h4>
                <p className="text-sm text-gray-600">
                  Scale your business with our comprehensive suite of marketing
                  tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BuyPlan;
