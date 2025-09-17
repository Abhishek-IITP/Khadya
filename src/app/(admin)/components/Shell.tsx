"use client";

import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

export function Shell({ children }: PropsWithChildren) {
  const pathname = usePathname();

  const showFullLayout = !pathname.startsWith("/home"); // or use your group name
  const isLoggedIn = true; // Optionally pass as prop or check using context/auth state

  return (
    <div className="flex min-h-screen">
      {showFullLayout && isLoggedIn && <Sidebar />}

      <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
        {showFullLayout && isLoggedIn && <Header />}

        <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                padding: "12px 16px",
                borderRadius: "8px",
                fontSize: "14px",
              },
            }}
          />
        </main>
      </div>
    </div>
  );
}
