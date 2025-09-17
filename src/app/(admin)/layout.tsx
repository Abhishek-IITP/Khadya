import "@/css/satoshi.css";
import "@/css/style.css";

import { Sidebar } from "@/components/Layouts/sidebar";

import "flatpickr/dist/flatpickr.css";
import "jsvectormap/dist/jsvectormap.css";

import { Header } from "@/components/Layouts/header";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";
import { getUser } from "@/auth/server";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    template: "%s | Krydha Clothing",
    default: "Krydha Clothing",
  },
  description:
    "Krydha Clothing is a manufacturer web portal that provides a comprehensive solution for managing and tracking orders, inventory, and customer information.",
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const user = await getUser();
  console.log(user);
  console.log(user?.userRole);
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <NextTopLoader color="#5750F1" showSpinner={false} />

          <div className="flex min-h-screen">
            {user ? <Sidebar user={user} userRole={user?.userRole} /> : <></>}

            <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
              {user ? <Header /> : <></>}

              <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
                {children}
                <Toaster
                  position="bottom-right"
                  toastOptions={{
                    duration: 4000, // auto-dismiss after 4 seconds
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
        </Providers>
      </body>
    </html>
  );
}
