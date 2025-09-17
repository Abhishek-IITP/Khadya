"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [isDark, setIsDark] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    if (nextTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <main className="bg-white text-white transition-colors duration-300 dark:bg-black">
      {/* Top Navigation */}
      <nav className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <div className="text-2xl font-bold tracking-wide text-black dark:text-white">
          Krydha Clothing
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="rounded-full bg-gray-200 px-4 py-2 text-sm font-medium text-black transition hover:opacity-80 dark:bg-gray-800 dark:text-white"
          >
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
          <Link
            href="/login"
            className="rounded-full bg-gray-200 px-4 py-2 text-sm font-medium text-black transition hover:opacity-80 dark:bg-gray-800 dark:text-white"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex min-h-[80vh] items-center justify-center px-4 text-center text-black dark:text-white">
        <div className="max-w-2xl">
          <h1 className="mb-6 text-5xl font-bold leading-tight">
            Elevate Your Everyday Style
          </h1>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
            Discover premium clothing crafted with comfort, confidence, and .
          </p>
          <Link
            href="/login"
            className="inline-block rounded-full bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-10 text-center text-white">
        <div className="mb-2 text-xl font-bold">Krydha Clothing</div>
        <p className="mb-4 text-sm text-gray-400">
          Premium Apparel Crafted With Care
        </p>
        <div className="flex justify-center space-x-6 text-sm text-gray-400">
          <Link href="/privacy" className="hover:text-white">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-white">
            Terms
          </Link>
          <Link href="/contact" className="hover:text-white">
            Contact
          </Link>
        </div>
        <p className="mt-4 text-xs text-gray-500">
          © {new Date().getFullYear()} Krydha Clothing. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
