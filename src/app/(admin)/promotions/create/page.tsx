"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DatePicker from "react-datepicker";
import { Calendar } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { Checkbox } from "@/components/FormElements/checkbox";
import { RadioInput } from "@/components/FormElements/radio";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";

// ✅ Zod Schema
const promotionSchema = z
  .object({
    promotionName: z
      .string()
      .min(1, "Promotion name is required")
      .min(3, "Promotion name must be at least 3 characters"),
    shortDescription: z
      .string()
      .min(1, "Short description is required")
      .max(500, "Description must be less than 500 characters"),
    selectedProduct: z.string().min(1, "Please select a product"),
    discountedPrice: z.boolean(),
    discountType: z.enum(["flat", "percentage"]).optional(),
    flatDiscount: z.number().optional(),
    percentageDiscount: z
      .number()
      .min(1, "Discount must be at least 1%")
      .max(100, "Discount cannot exceed 100%")
      .optional(),
    productCategory: z.string().min(1, "Product category is required"),
    productSubCategory: z
      .string()
      .min(1, "Product gender is required"),
    startDate: z.date(),
    endDate: z.date(),
    targetingArea: z.string().min(1, "Targeting area is required"),
  })
  .refine(
    (data) => {
      if (
        data.discountedPrice &&
        data.discountType === "flat" &&
        (!data.flatDiscount || data.flatDiscount <= 0)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Flat discount amount is required and must be greater than 0",
      path: ["flatDiscount"],
    },
  )
  .refine(
    (data) => {
      if (data.endDate <= data.startDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  )
  .refine(
    (data) => {
      const timeDiff = data.endDate.getTime() - data.startDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      if (daysDiff > 7) {
        return false;
      }
      return true;
    },
    {
      message: "Duration cannot exceed 7 days",
      path: ["endDate"],
    },
  );

type PromotionFormData = z.infer<typeof promotionSchema>;
type ProductOption = { value: string; label: string };

const categories = [
  { value: "clothing", label: "Clothing" },
  { value: "footwear", label: "Footwear" },
  { value: "accessories", label: "Accessories" },
  { value: "electronics", label: "Electronics" },
];

const subCategories = [
  { value: "mens", label: "Men's" },
  { value: "womens", label: "Women's" },
  { value: "kids", label: "Kids" },
  { value: "unisex", label: "Unisex" },
];

const CreatePromotionForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    mode: "onSubmit", // Validate only on submit to avoid showing errors immediately
    defaultValues: {
      discountedPrice: false,
      discountType: "flat",
      promotionName: "",
      shortDescription: "",
      selectedProduct: "",
      productCategory: "",
      productSubCategory: "",
      targetingArea: "",
    },
  });

  // Dynamic products for dropdown
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);
  const [fetchingProduct, setFetchingProduct] = useState(false);
  const [checkingPromotions, setCheckingPromotions] = useState(false);

  const watchDiscountedPrice = watch("discountedPrice");
  const watchDiscountType = watch("discountType");

  // Restore form data from localStorage when component mounts
  useEffect(() => {
    const savedFormData = localStorage.getItem('promotionFormData');
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        console.log("Restoring form data from localStorage:", parsedData);
        
        // Restore form values
        setValue("promotionName", parsedData.promotionName || "");
        setValue("shortDescription", parsedData.shortDescription || "");
        setValue("selectedProduct", parsedData.selectedProduct || "");
        setValue("productCategory", parsedData.productCategory || "");
        setValue("productSubCategory", parsedData.productSubCategory || "");
        setValue("targetingArea", parsedData.targetingArea || "");
        setValue("discountedPrice", parsedData.discountedPrice || false);
        setValue("discountType", parsedData.discountType || "flat");
        setValue("flatDiscount", parsedData.flatDiscount || undefined);
        setValue("percentageDiscount", parsedData.percentageDiscount || undefined);
        
        // Restore dates
        if (parsedData.startDate) {
          setValue("startDate", new Date(parsedData.startDate));
        }
        if (parsedData.endDate) {
          setValue("endDate", new Date(parsedData.endDate));
        }
      } catch (error) {
        console.error("Error parsing saved form data:", error);
      }
    }
  }, [setValue]);

  // Fetch all products for dropdown on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      setProductError(null);
      try {
        const res = await fetch("/api/promotions/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        const arr = data.products || data;
        const options = arr.map((p: any) => ({
          value: p.id,
          label: p.name || p.title || p.product_name || `Product ${p.id}`,
        }));
        setProducts(options);
      } catch (err: any) {
        setProductError(err.message || "Could not load products");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch product details on select
  const selectedProductId = watch("selectedProduct");
  useEffect(() => {
    if (!selectedProductId) return;
    const fetchProductDetails = async () => {
      setFetchingProduct(true);
      try {
        const res = await fetch(`/api/products/${selectedProductId}`);
        if (!res.ok) throw new Error("Failed to fetch product details");
        const prod = await res.json();
        
        // Print all product details to console
        console.log("Selected Product Details:", prod);
        
        // Auto-fill category and gender (sub-category) from the selected product
        if (prod.category) setValue("productCategory", prod.category);
        if (prod.gender) setValue("productSubCategory", prod.gender);
      } catch (err) {
        console.error("Error fetching product details:", err);
      } finally {
        setFetchingProduct(false);
      }
    };
    fetchProductDetails();
  }, [selectedProductId, setValue]);

  const onSubmit = async (data: PromotionFormData) => {
    try {
      // First, check for existing active promotions for this product
      console.log("Checking for existing promotions...");
      setCheckingPromotions(true);
      
      const checkData = {
        product_id: data.selectedProduct,
        start_date: data.startDate.toISOString(),
        end_date: data.endDate.toISOString(),
      };

      const checkResponse = await fetch("/api/promotions/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkData),
      });

      const checkResult = await checkResponse.json();

      if (!checkResponse.ok) {
        throw new Error(checkResult.error || "Failed to check existing promotions");
      }

      // If there's a conflict, show error and stop
      if (checkResult.hasConflict) {
        alert(checkResult.message);
        setCheckingPromotions(false);
        return;
      }

      console.log("No conflicts found, proceeding to payment...");
      setCheckingPromotions(false);

      // Save form data to localStorage before redirecting
      const formDataToSave = {
        ...data,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
      };
      localStorage.setItem('promotionFormData', JSON.stringify(formDataToSave));
      console.log("Form data saved to localStorage:", formDataToSave);

      // Get the selected product name for display
      const selectedProduct = products.find(p => p.value === data.selectedProduct);
      const productName = selectedProduct?.label || "Selected Product";

      // Prepare data for payment gateway
      const paymentData = {
        name: data.promotionName,
        description: data.shortDescription,
        productName: productName,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
      };

      console.log("Redirecting to payment gateway with data:", paymentData);

      // Create URL parameters for payment gateway
      const params = new URLSearchParams({
        name: paymentData.name,
        description: paymentData.description,
        productName: paymentData.productName,
        productCategory: data.productCategory, // Pass the product category for display
        productId: data.selectedProduct, // Pass the product ID for database saving
        startDate: paymentData.startDate,
        endDate: paymentData.endDate,
      });

      // Redirect to payment gateway
      window.location.href = `/promotions/promotion-payment?${params.toString()}`;
    } catch (error) {
      console.error("Error preparing payment:", error);
      alert(`Error preparing payment: ${error instanceof Error ? error.message : "Please try again."}`);
      setCheckingPromotions(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-gray-200 shadow-sm">
          <ShowcaseSection title="Create a promotion" className="!p-6.5">
            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Promotion Name */}
                  <Controller
                    name="promotionName"
                    control={control}
                    render={({ field }) => (
                  <InputGroup
                    type="text"
                    label="Promotion Name"
                    placeholder="Enter Promotion Name"
                        value={field.value || ""}
                        handleChange={field.onChange}
                        name={field.name}
                      />
                    )}
                  />
                  {errors.promotionName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.promotionName.message}
                    </p>
                  )}

                  {/* Select Product */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Select Product
                    </label>
                    <p className="mb-3 text-xs text-gray-500">
                      When you select a product, the category and gender will be automatically filled from the product details.
                    </p>
                  <Controller
                    name="selectedProduct"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Select
                            label=""
                          items={products}
                          placeholder={loadingProducts ? "Loading..." : "Choose product"}
                          value={field.value}
                          onChange={field.onChange}
                        />
                        {fetchingProduct && (
                          <p className="mt-1 text-sm text-blue-600">Fetching product details...</p>
                        )}
                        {productError && (
                          <p className="mt-1 text-sm text-red-600">{productError}</p>
                        )}
                      </>
                    )}
                  />
                  </div>
                  {errors.selectedProduct && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.selectedProduct.message}
                    </p>
                  )}

                  {/* Discounted Price (Checkbox + Radio) */}
                  <Controller
                    name="discountedPrice"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        label="Discounted Price"
                        withIcon="check"
                        withBg
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    )}
                  />
                  {watchDiscountedPrice && (
                    <div className="space-y-3">
                      <div className="flex gap-6">
                        <RadioInput
                          label="Flat Discount"
                          name="discountType"
                          value="flat"
                        />
                        <RadioInput
                          label="% Discount"
                          name="discountType"
                          value="percentage"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {watchDiscountType === "flat" ? (
                          <InputGroup
                            {...register("flatDiscount", {
                              valueAsNumber: true,
                            })}
                            type="number"
                            label="Flat Discount"
                            placeholder="Enter flat discount"
                          />
                        ) : (
                          <InputGroup
                            {...register("percentageDiscount", {
                              valueAsNumber: true,
                            })}
                            type="number"
                            label="% Discount"
                            placeholder="Enter % discount"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Duration */}
                  <label className="mb-2 block text-sm font-medium">
                    Duration (Maximum 7 days)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <Controller
                      name="startDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={field.onChange}
                          placeholderText="Start Date"
                          className="w-full rounded-lg border px-3 py-2.5"
                          minDate={new Date()}
                          dateFormat="dd/MM/yyyy"
                        />
                      )}
                    />
                    <Controller
                      name="endDate"
                      control={control}
                      render={({ field }) => {
                        const startDate = watch("startDate");
                        const maxEndDate = startDate ? new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000) : undefined;
                        
                        return (
                        <DatePicker
                          selected={field.value}
                          onChange={field.onChange}
                          placeholderText="End Date"
                          className="w-full rounded-lg border px-3 py-2.5"
                            minDate={startDate ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000) : new Date()}
                            maxDate={maxEndDate}
                            dateFormat="dd/MM/yyyy"
                            disabled={!startDate}
                        />
                        );
                      }}
                    />
                  </div>
                  {watch("startDate") && watch("endDate") && (
                    <p className="mt-2 text-sm text-gray-600">
                      Duration: {Math.ceil((watch("endDate").getTime() - watch("startDate").getTime()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  )}

                  {/* Targeting Area */}
                  <Controller
                    name="targetingArea"
                    control={control}
                    render={({ field }) => (
                  <InputGroup
                    type="text"
                    label="Targeting Area"
                    placeholder="Enter targeting area"
                        value={field.value || ""}
                        handleChange={field.onChange}
                        name={field.name}
                      />
                    )}
                  />
                  {errors.targetingArea && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.targetingArea.message}
                    </p>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Short Description */}
                  <Controller
                    name="shortDescription"
                    control={control}
                    render={({ field }) => (
                      <TextAreaGroup
                        label="Short Description"
                        placeholder="Write a short description"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.shortDescription && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.shortDescription.message}
                    </p>
                  )}

                  {/* Product Categories - Auto-filled from selected product */}
                  <Controller
                    name="productCategory"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Product Category
                        </label>
                        <input
                          type="text"
                          value={field.value || ""}
                          readOnly
                          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-gray-500"
                          placeholder="Will be auto-filled when you select a product"
                        />
                        {fetchingProduct && (
                          <p className="mt-1 text-sm text-blue-600">Loading category...</p>
                        )}
                      </div>
                    )}
                  />
                  {errors.productCategory && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.productCategory.message}
                    </p>
                  )}

                  {/* Product Gender - Auto-filled from selected product */}
                  <Controller
                    name="productSubCategory"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Product Gender
                        </label>
                        <input
                          type="text"
                          value={field.value || ""}
                          readOnly
                          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-gray-500"
                          placeholder="Will be auto-filled when you select a product"
                        />
                        {fetchingProduct && (
                          <p className="mt-1 text-sm text-blue-600">Loading gender...</p>
                        )}
                      </div>
                    )}
                  />
                  {errors.productSubCategory && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.productSubCategory.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || checkingPromotions}
                    className="rounded-lg bg-blue-600 px-8 py-3 text-white disabled:bg-gray-400"
                  >
                    {checkingPromotions 
                      ? "Checking for existing promotions..." 
                      : isSubmitting 
                        ? "Processing..." 
                        : "Proceed to Payment"
                    }
                  </button>
                </div>
              </div>
            </form>
          </ShowcaseSection>
        </div>
      </div>
    </div>
  );
};

export default CreatePromotionForm;
