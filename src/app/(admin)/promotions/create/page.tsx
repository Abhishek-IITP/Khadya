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
    defaultValues: {
      discountedPrice: false,
      discountType: "flat",
    },
  });

  // Dynamic products for dropdown
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);
  const [fetchingProduct, setFetchingProduct] = useState(false);

  const watchDiscountedPrice = watch("discountedPrice");
  const watchDiscountType = watch("discountType");

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
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Promotion created:", data);
      alert("Promotion created successfully!");
      reset();
    } catch (error) {
      console.error("Error creating promotion:", error);
      alert("Error creating promotion. Please try again.");
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
                  <InputGroup
                    {...register("promotionName")}
                    type="text"
                    label="Promotion Name"
                    placeholder="Enter Promotion Name"
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
                    Duration
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
                        />
                      )}
                    />
                    <Controller
                      name="endDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={field.onChange}
                          placeholderText="End Date"
                          className="w-full rounded-lg border px-3 py-2.5"
                        />
                      )}
                    />
                  </div>

                  {/* Targeting Area */}
                  <InputGroup
                    {...register("targetingArea")}
                    type="text"
                    label="Targeting Area"
                    placeholder="Enter targeting area"
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
                        defaultValue={field.value}
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
                    disabled={isSubmitting}
                    className="rounded-lg bg-blue-600 px-8 py-3 text-white"
                  >
                    {isSubmitting ? "Creating..." : "Create Promotion"}
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
