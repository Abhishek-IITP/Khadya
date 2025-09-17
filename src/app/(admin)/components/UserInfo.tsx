"use client";

import UserDropdown from "@/app/(admin)/components/UserDropDown";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserInfo(props: unknown) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/user", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
   setUser(null);
        } else {
          console.log(data.user);
          setUser(data.user);
        }
      })
      .catch((err) => {
        console.error("User fetch failed", err);

      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center rounded-md px-4 py-2 text-white bg-blue-600 font-medium hover:bg-blue-800 transition"
      >
        Login
      </Link>
    );
  }

  return <UserDropdown user={user} />;
}
