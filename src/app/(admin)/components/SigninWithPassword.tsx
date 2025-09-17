"use client";
import { EmailIcon, PasswordIcon } from "@/assets/icons";
import Link from "next/link";
import React, { useState } from "react";
import InputGroup from "./InputGroup";
import { Checkbox } from "./checkbox";
import { loginAction, signupAction } from "../action/user";
import { useRouter } from "next/navigation";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "../lib/toast-utils";

type Props = {
  type: "login" | "signUp";
};

export default function SigninWithPassword({ type }: Props) {
  const isLoginForm = type === "login";
  const [data, setData] = useState({
    email: process.env.NEXT_PUBLIC_DEMO_USER_MAIL || "",
    password: process.env.NEXT_PUBLIC_DEMO_USER_PASS || "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { email, password, remember } = data;
    let errorMessage = null;
    let title = "";
    let description = "";

    if (isLoginForm) {
      const res = await loginAction(email, password, remember);
      console.log(res);
      errorMessage = res.errorMessage;
      title = "Logged In";
      description = "You have logged in successfully";
    } else {
      const res = await signupAction(email, password);
      errorMessage = res.errorMessage;
      title = "Signed Up";
      description = "Verify your email to login";
    }

    if (!errorMessage) {
      if (isLoginForm) {
        showSuccessToast(description);
        router.replace("/dashboard");
      } else {
        showWarningToast(description);
        router.replace("/login");
      }
    } else {
      showErrorToast(errorMessage);
      console.log("Error:", errorMessage);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup
        type="email"
        label="Email"
        className="mb-4 [&_input]:py-[15px]"
        placeholder="Enter your email"
        name="email"
        handleChange={handleChange}
        value={data.email}
        icon={<EmailIcon />}
      />

      <InputGroup
        type="password"
        label="Password"
        className="mb-5 [&_input]:py-[15px]"
        placeholder="Enter your password"
        name="password"
        handleChange={handleChange}
        value={data.password}
        icon={<PasswordIcon />}
      />

      <div className="mb-6 flex items-center justify-between gap-2 py-2 font-medium">
        {isLoginForm ? (
          <Checkbox
            label="Remember me"
            name="remember"
            withIcon="check"
            minimal
            radius="md"
            onChange={(e) =>
              setData({
                ...data,
                remember: e.target.checked,
              })
            }
          />
        ) : (
          <div />
        )}

        <Link
          href="/auth/forgot-password"
          className="hover:text-primary dark:text-white dark:hover:text-primary"
        >
          Forgot Password?
        </Link>
      </div>

      <div className="mb-4.5">
        <button
          type="submit"
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
        >
          {isLoginForm ? "Sign In" : "Sign Up"}
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
          )}
        </button>
      </div>
    </form>
  );
}
