"use client";

import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import { Dialog } from "@headlessui/react";
import { ArrowDown, ArrowUp, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Order = {
  id: string;
  customer_email: string;
  customer_name: string;
  order_status: string;
  total_amount: number;
  order_number: string;
  created_at: string;
  items: { name: string; quantity: number }[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<keyof Order>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const ORDERS_PER_PAGE = 8;

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        const res = await fetch("/api/orders");
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const filteredOrders =
    filter.toLowerCase() === "all"
      ? orders
      : orders.filter((o) => o.order_status.toLowerCase() === filter.toLowerCase());

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];

    if (typeof valA === "number" && typeof valB === "number") {
      return sortOrder === "asc" ? valA - valB : valB - valA;
    }

    return sortOrder === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const totalPages = Math.ceil(sortedOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  const toggleSort = (field: keyof Order) => {
    if (field === sortBy) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const exportCSV = () => {
    const headers = ["ID", "Status", "Total", "Created At"];
    const rows = filteredOrders.map((o) => [
      o.id,
      o.order_status,
      o.total_amount,
      o.created_at,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-dark min-h-screen">
      {/* Loading Overlay for initial load */}
      {loading && orders.length === 0 && (
        <div className="fixed inset-0 bg-white/80 dark:bg-gray-dark/80 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-lg font-medium text-dark dark:text-white">Loading orders...</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Please wait while we fetch your data</p>
          </div>
        </div>
      )}
      
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["All", "Shipped", "Delivered", "Cancelled", "Refunded"].map((status) => (
          <button
            key={status}
            onClick={() => {
              setFilter(status);
              setCurrentPage(1);
            }}
            disabled={loading}
            className={`px-4 py-2 text-sm rounded-full border transition-colors duration-200 ${
              filter === status 
                ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white" 
                : "bg-white dark:bg-gray-dark text-dark dark:text-white border-gray-300 dark:border-dark-3 hover:bg-gray-50 dark:hover:bg-dark-2"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {status}
          </button>
        ))}
        <button
          onClick={exportCSV}
          disabled={loading}
          className={`ml-auto bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm transition-colors duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
              Loading...
            </>
          ) : (
            "Export CSV"
          )}
        </button>
      </div>

      {/* Table */}
      <div className={`overflow-x-auto border rounded-lg dark:border-dark-3 bg-white dark:bg-gray-dark ${loading ? 'opacity-75 pointer-events-none' : ''} transition-opacity duration-200`}>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-dark-2 text-left">
            <tr>
              <th className="p-3 cursor-pointer text-dark dark:text-white" onClick={() => toggleSort("id")}>
                Order ID {sortBy === "id" && (sortOrder === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
              </th>
              <th className="p-3 cursor-pointer text-dark dark:text-white" onClick={() => toggleSort("order_number")}>
                Order Number {sortBy === "order_number" && (sortOrder === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
              </th>
              <th className="p-3 cursor-pointer text-dark dark:text-white" onClick={() => toggleSort("order_status")}>
                Status {sortBy === "order_status" && (sortOrder === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
              </th>
              <th className="p-3 cursor-pointer text-dark dark:text-white" onClick={() => toggleSort("total_amount")}>
                Total ₹ {sortBy === "total_amount" && (sortOrder === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
              </th>
              <th className="p-3 cursor-pointer text-dark dark:text-white" onClick={() => toggleSort("created_at")}>
                Date {sortBy === "created_at" && (sortOrder === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Loading skeleton rows
              Array.from({ length: ORDERS_PER_PAGE }).map((_, index) => (
                <tr key={index} className="border-t dark:border-dark-3">
                  <td className="p-3">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="p-3">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="p-3">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="p-3">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="p-3">
                    <Skeleton className="h-4 w-24" />
                  </td>
                </tr>
              ))
            ) : paginatedOrders.length === 0 && !loading ? (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-500 dark:text-gray-400">
                  No orders found.
                </td>
              </tr>
            ) : !loading ? (
              paginatedOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="hover:bg-gray-50 dark:hover:bg-dark-2 cursor-pointer border-t dark:border-dark-3"
                >
                  <td className="p-3 text-dark dark:text-white">{order.id}</td>
                  <td className="p-3 text-dark dark:text-white">{order.order_number}</td>
                  <td className="p-3 capitalize text-dark dark:text-white">{order.order_status}</td>
                  <td className="p-3 text-dark dark:text-white">₹{order.total_amount}</td>
                  <td className="p-3 text-dark dark:text-white">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            ) : null}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
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
                <p><strong>Customer Name:</strong> {selectedOrder.customer_name}</p>
                <p><strong>Customer Email:</strong> {selectedOrder.customer_email}</p>
                <p><strong>Status:</strong> {selectedOrder.order_status}</p>
                <p><strong>Total:</strong> ₹{selectedOrder.total_amount}</p>
                <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                <div>
                  <strong>Items:</strong>
                  <ul className="list-disc ml-5">
                    {selectedOrder.items.map((item, idx) => (
                      <li key={idx}>
                        {item.name} × {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            <div className="mt-4 text-right">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-200"
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
