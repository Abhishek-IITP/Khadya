'use client';

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { standardFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { ArrowDown, ArrowUp, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui-elements/button";
import { formatDistanceToNow } from "date-fns";
import { Dialog } from "@headlessui/react";
import Pagination from "@/components/Pagination";

type Order = {
  id: number;
  customer_email: string;
  customer_name: string;
  order_status: string;
  total_amount: number;
  order_number: string;
  created_at: string;
  items: { name: string; quantity: number }[];
};

export function OrdersTable({
  initialData,
  className,
}: {
  initialData: Order[];
  className?: string;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState<keyof Order>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filtered, setFiltered] = useState(initialData);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [paginatedData, setPaginatedData] = useState<Order[]>([]);

  useEffect(() => {
    let results = initialData;

    // Apply search filter
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      results = results.filter((item) =>
        item.order_number?.toLowerCase().includes(lower) ||
        item.customer_name?.toLowerCase().includes(lower) ||
        item.customer_email?.toLowerCase().includes(lower) ||
        item.id?.toString().includes(lower)
      );
    }

    // Apply status filter
    if (filter.toLowerCase() !== "all") {
      results = results.filter((o) => o.order_status.toLowerCase() === filter.toLowerCase());
    }

    // Apply sorting
    results = [...results].sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];

      if (typeof valA === "number" && typeof valB === "number") {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }

      return sortOrder === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

    setFiltered(results);
    
    // Reset to first page when data changes
    setCurrentPage(1);
  }, [searchTerm, filter, sortBy, sortOrder, initialData]);

  // Update paginated data when filtered data or current page changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedData(filtered.slice(startIndex, endIndex));
  }, [filtered, currentPage]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const toggleSort = (field: keyof Order) => {
    if (field === sortBy) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const exportCSV = () => {
    const headers = ["Order ID", "Customer", "Status", "Total", "Date"];
    const rows = filtered.map((o) => [
      o.order_number,
      o.customer_name,
      o.order_status,
      o.total_amount,
      new Date(o.created_at).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-page-${currentPage}-of-${totalPages}.csv`;
    a.click();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30";
      case "shipped":
        return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30";
      case "cancelled":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30";
      case "refunded":
        return "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30";
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30";
    }
  };

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className
      )}
    >
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col">
          <h2 className="mb-1 text-body-2xlg font-bold text-dark dark:text-white">All Orders</h2>
          <p className="text-sm text-gray-5 dark:text-gray-400">
            Showing {paginatedData.length} of {filtered.length} orders
          </p>
        </div>

        <div className="w-full md:max-w-md">
          <input
            type="text"
            placeholder="Search (Order ID, Customer Name, Email)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-dark placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-dark dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={exportCSV}
            icon={<Download className="h-4 w-4" />}
            label="Export CSV"
            size="small"
            variant="primary"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {["All", "Shipped", "Delivered", "Cancelled", "Refunded"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 text-sm rounded-full border transition-colors duration-200 ${
              filter === status
                ? "bg-primary text-white border-primary"
                : "bg-white dark:bg-gray-dark text-dark dark:text-white border-gray-300 dark:border-dark-3 hover:bg-gray-50 dark:hover:bg-dark-2"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="min-w-[120px] !text-left">
              <button
                className="flex items-center gap-1 text-dark dark:text-white hover:text-primary"
                onClick={() => toggleSort("order_number")}
              >
                Order Details
                {sortBy === "order_number" && (
                  sortOrder === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                )}
              </button>
            </TableHead>
            <TableHead>
              <button
                className="flex items-center gap-1 text-dark dark:text-white hover:text-primary"
                onClick={() => toggleSort("customer_name")}
              >
                Customer
                {sortBy === "customer_name" && (
                  sortOrder === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                )}
              </button>
            </TableHead>
            <TableHead>
              <button
                className="flex items-center gap-1 text-dark dark:text-white hover:text-primary"
                onClick={() => toggleSort("order_status")}
              >
                Status
                {sortBy === "order_status" && (
                  sortOrder === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                )}
              </button>
            </TableHead>
            <TableHead className="!text-right">
              <button
                className="flex items-center gap-1 text-dark dark:text-white hover:text-primary ml-auto"
                onClick={() => toggleSort("total_amount")}
              >
                Total Amount
                {sortBy === "total_amount" && (
                  sortOrder === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                )}
              </button>
            </TableHead>
            <TableHead className="!text-right">
              <button
                className="flex items-center gap-1 text-dark dark:text-white hover:text-primary ml-auto"
                onClick={() => toggleSort("created_at")}
              >
                Date
                {sortBy === "created_at" && (
                  sortOrder === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                )}
              </button>
            </TableHead>
            <TableHead className="!text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedData.map((order) => (
            <TableRow key={order.id} className="text-center text-base font-medium text-dark dark:text-white">
              <TableCell className="!text-left">
                <div className="flex flex-col justify-start items-start">
                  <p className="font-semibold">{order.order_number}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">#{order.id}</p>
                </div>
              </TableCell>

              <TableCell className="!text-left">
                <div className="flex flex-col justify-start items-start">
                  <p>{order.customer_name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{order.customer_email}</p>
                </div>
              </TableCell>

              <TableCell>
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}
                >
                  {order.order_status}
                </span>
              </TableCell>

              <TableCell className="!text-right text-green-light-1">
                <div>₹{standardFormat(order.total_amount)}</div>
                <p className="text-xs text-gray-5">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </p>
              </TableCell>

              <TableCell className="!text-right">
                <div className="flex flex-col justify-end items-end">
                  <div>{new Date(order.created_at).toLocaleDateString()}</div>
                  <p className="text-xs text-gray-5">
                    {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                  </p>
                </div>
              </TableCell>

              <TableCell className="!text-right">
                <div className="flex justify-end items-center gap-2">
                  <Button
                    icon={<Eye className="h-4 w-4 dark:text-white" />}
                    label=""
                    size="small"
                    variant="outlinePrimary"
                    className="h-8 w-8"
                    onClick={() => setSelectedOrder(order)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Order Modal */}
      <Dialog open={!!selectedOrder} onClose={() => setSelectedOrder(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 dark:bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white dark:bg-gray-dark border dark:border-dark-3 rounded-xl max-w-md w-full p-6 shadow-lg dark:shadow-card">
            <Dialog.Title className="text-lg font-semibold mb-4 text-dark dark:text-white">Order Details</Dialog.Title>
            {selectedOrder && (
              <div className="space-y-2 text-dark dark:text-white">
                <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                <p><strong>Order Number:</strong> {selectedOrder.order_number}</p>
                <p><strong>Customer Name:</strong> {selectedOrder.customer_name}</p>
                <p><strong>Customer Email:</strong> {selectedOrder.customer_email}</p>
                <p><strong>Status:</strong> <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.order_status)}`}>{selectedOrder.order_status}</span></p>
                <p><strong>Total:</strong> ₹{selectedOrder.total_amount}</p>
                <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                <div>
                  <strong>Items:</strong>
                  <ul className="list-disc ml-5 mt-1">
                    {selectedOrder.items.map((item, idx) => (
                      <li key={idx}>
                        {item.name} × {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            <div className="mt-6 text-right">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-md transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
