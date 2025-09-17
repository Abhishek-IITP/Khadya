'use client';

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { standardFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui-elements/button";
import EditProductButton from "../EditProductButton";
import DeleteProductButton from "../DeleteProductButton";
import { formatDistanceToNow } from "date-fns";
import Pagination from "@/components/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { TopChannelsSkeleton } from "./skeleton";

type PaginatedData = {
  products: any[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
};

export function TopChannelsTable({
  initialData,
  className,
}: {
  initialData: PaginatedData;
  className?: string;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setFiltered] = useState(initialData.products || []);
  const [isPending, startTransition] = useTransition();
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      const lower = searchTerm.toLowerCase();
      const products = initialData.products || [];
      const results = products.filter((item) =>
        item.title?.toLowerCase().includes(lower) ||
        item.sku?.toLowerCase().includes(lower) ||
        item.id?.toString().includes(lower)
      );
      setFiltered(results);
      setIsSearching(false);
    }, 300); // Debounce search

    return () => {
      clearTimeout(timeoutId);
      setIsSearching(false);
    };
  }, [searchTerm, initialData.products]);

  const handlePageChange = (page: number) => {
    startTransition(() => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set('page', page.toString());
      const search = current.toString();
      const query = search ? `?${search}` : '';
      router.push(`/inventory${query}`);
    });
  };

  // Show skeleton during page transitions
  if (isPending) {
    return <TopChannelsSkeleton />;
  }

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className
      )}
    >
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="mb-1 text-body-2xlg font-bold text-dark dark:text-white">All Products List</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {((initialData.currentPage - 1) * 10) + 1} to {Math.min(initialData.currentPage * 10, initialData.totalCount)} of {initialData.totalCount} products
          </p>
        </div>

        <div className="w-full md:max-w-md relative">
          <input
            type="text"
            placeholder="Search (Product Name or Product ID)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-dark placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-dark dark:text-white pr-10"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/inventory/addProductForm" className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600">
            Add Product
          </Link>
          {/* <div className="relative">Sort ▼</div>
          <div className="relative">Filter ▼</div> */}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="min-w-[120px] !text-left">Product Name & ID</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="!text-right">Price</TableHead>
            <TableHead className="!text-right">Stock</TableHead>
            <TableHead className="!text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filtered && filtered.length > 0 ? (
            filtered.map((channel, i) => (
              <TableRow key={channel.id} className="text-center text-base font-medium text-dark dark:text-white">
                <TableCell className="flex min-w-fit items-center gap-3">
                  <Image
                    src={channel.productimagesurl?.[0] || "https://placehold.co/600x400"}
                    className="rounded-lg object-cover"
                    width={60}
                    height={60}
                    alt={channel.title}
                  />
                  <div className="flex flex-col justify-start items-start">
                    <p>{channel.title}</p>
                    <p className="text-xs">{channel.sku}</p>
                  </div>
                </TableCell>

                <TableCell>{channel.size}</TableCell>

                <TableCell className="!text-right text-green-light-1">
                  <div>Rs.{standardFormat(channel.price)}</div>
                  <p className="text-xs text-gray-5">
                    Updated {formatDistanceToNow(new Date(channel.updated_at), { addSuffix: true })}
                  </p>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col justify-end items-end">
                    <div>{channel.stock} Left</div>
                    <p className="text-xs text-gray-5">{channel.sold} Sold</p>
                  </div>
                </TableCell>

                <TableCell className="!text-right">
                  <div className="flex justify-end items-center gap-2">
                    <Button icon={<Eye className="h-4 w-4 dark:text-white" />} label="" size="small" variant="outlinePrimary" className="h-8 w-8" />
                    <EditProductButton channel={channel} />
                    <DeleteProductButton channel={channel} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                No products found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Component */}
      {initialData && initialData.totalPages > 1 && (
        <Pagination
          currentPage={initialData.currentPage}
          totalPages={initialData.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
