"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useOutsideClick } from "@/hooks/use-outside-click";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  getTopChannels,
  updateProduct,
  getProductById,
  approvesProduct,
} from "../fetch";
import Image from "next/image";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "../../lib/toast-utils";

type Product = {
  id: string;
  title: string;
  stock: number;
  productimagesurl: string[];
  manufacturer: string;
  updated_at: string;
  price: string;
  sku: string;
  category: string;
};

export default function ProductsApprovals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // expanded card state
  const [active, setActive] = useState<Product | null>(null);
  const [details, setDetails] = useState<Product | null>(null);

  const ref = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const id = useId();

  // fetch products for current page
  const fetchProducts = async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await getTopChannels(pageNum, 6); // adjust per page
      setProducts(res.products);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  // fetch details when a product is expanded
  useEffect(() => {
    if (active) {
      getProductById(active.id).then((res: any) => setDetails(res));
    } else {
      setDetails(null);
    }
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  // approve logic
  const approveProduct = async (productId: string) => {
    try {
      const res = await approvesProduct(productId);
      console.log(res);
      if (res.success) {
        showSuccessToast("Product approved successfully!");
        fetchProducts(page);
        setActive(null);
      } else {
        showErrorToast("Failed to approve product.");
      }
    } catch (err) {
      console.error("Error approving product:", err);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">
        Products Approvals
      </h2>

      {/* Product List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="mx-auto flex w-full max-w-2xl flex-col gap-y-4 p-2">
          {products.map((product) => (
            <motion.div
              layoutId={`card-${product.id}-${id}`}
              key={product.id}
              onClick={() => setActive(product)}
              className="flex cursor-pointer items-center justify-between rounded-xl border p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={product.productimagesurl[0]}
                  alt={product.title}
                  width={50}
                  height={50}
                  className="h-14 w-14 rounded-md object-cover"
                />
                <div>
                  <p className="font-medium text-gray-200">{product.title}</p>
                  <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                  <p className="text-sm text-gray-500">₹{product.price}</p>
                </div>
              </div>
              <motion.button
                layoutId={`button-${product.id}-${id}`}
                className="rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-800 hover:bg-gray-dark hover:text-white"
              >
                View
              </motion.button>
            </motion.div>
          ))}
        </ul>
      )}

      {/* Modal */}
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 z-[100] grid place-items-center pt-20">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40"
              onClick={() => setActive(null)}
            />
            <motion.div
              layoutId={`card-${active.id}-${id}`}
              ref={ref}
              className="relative z-50 flex h-fit max-h-[90%] w-full max-w-[500px] flex-col overflow-hidden rounded-2xl bg-white dark:bg-neutral-900"
            >
              {/* Image */}
              <motion.div layoutId={`image-${active.id}-${id}`}>
                <Image
                  src={active.productimagesurl[0]}
                  alt={active.title}
                  width={500}
                  height={300}
                  className="h-60 w-full object-cover"
                />
              </motion.div>

              {/* Details */}
              <div className="space-y-2 p-4">
                <motion.h3
                  layoutId={`title-${active.id}-${id}`}
                  className="text-lg font-bold"
                >
                  {active.title}
                </motion.h3>
                <p className="text-sm text-gray-500">
                  SKU: {active.sku} | Category: {active.category}
                </p>
                <p className="text-sm text-gray-600">
                  Price: ₹{active.price} | Stock: {active.stock}
                </p>
                <p className="text-sm text-gray-500">
                  Manufacturer: {active.manufacturer}
                </p>
                <p className="text-sm text-gray-500">
                  Updated: {new Date(active.updated_at).toLocaleDateString()}
                </p>

                {/* Extra details fetched */}
                {details && (
                  <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    <p>✨ Full details loaded from DB</p>
                    {/* map more details if present */}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    onClick={() => setActive(null)}
                    className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-gray-3 hover:bg-gray-400 hover:text-gray-800"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => approveProduct(active.id)}
                    className="rounded-lg bg-white px-4 py-2 text-sm text-gray-900 shadow-sm hover:bg-gray-dark hover:text-white"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => page > 1 && setPage(page - 1)}
            />
          </PaginationItem>

          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                isActive={page === i + 1}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          {totalPages > 5 && <PaginationEllipsis />}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() => page < totalPages && setPage(page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
