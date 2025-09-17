"use client"


import Image from "next/image";
import Link from "next/link";


export default function emailVerified() {
  return (
    <>


      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="flex flex-wrap items-start">
        

          <div className=" w-full p-7.5 ">
            <div className="custom-gradient-1 flex items-center flex-col overflow-hidden rounded-2xl px-12.5 pt-12.5 dark:!bg-dark-2 dark:bg-none">
              <Link className="mb-10 inline-block" href="/">
                <Image
                  className="hidden dark:block"
                  src={"/images/logo/logo.svg"}
                  alt="Logo"
                  width={176}
                  height={32}
                />
                <Image
                  className="dark:hidden"
                  src={"/images/logo/logo-dark.svg"}
                  alt="Logo"
                  width={176}
                  height={32}
                />
              </Link>
              <p className="mb-3 text-xl font-medium text-dark dark:text-white">
               Your Email is Verified!
              </p>

              <h1 className="mb-4 text-2xl text-center font-bold text-dark dark:text-white sm:text-heading-3">
                Welcome To Krydha Manufaturer!
              </h1>

              <p className="w-full max-w-[375px] font-medium text-dark-4 items-center flex text-center dark:text-dark-6">
                Sign in to your account and complete your profile to use Krydha Maufaturer Portal.
              </p>


   <Link
        href="/login"
        className="inline-flex items-center rounded-md px-4 py-2 mt-4 text-white bg-blue-600 font-medium hover:bg-blue-800 transition"
      >
        Login
      </Link>
              <div className="mt-31">
                <Image
                  src={"/images/grids/grid-02.svg"}
                  alt="Logo"
                  width={405}
                  height={325}
                  className="mx-auto dark:opacity-30"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
