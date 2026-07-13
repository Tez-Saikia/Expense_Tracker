"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";

function Hero() {
  const { authUser, isCheckingAuth } = useAuthStore();

  return (
    <section className="bg-white lg:grid lg:min-h-screen flex flex-col items-center justify-center pb-12">
      <div className="mx-auto w-screen max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-prose text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Spend with care,
            <strong className="text-primary"> live </strong>
            with ease.
          </h1>

          <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed">
            Take control of your spending now to enjoy more freedom later.
          </p>

          <div className="mt-4 flex justify-center gap-4 sm:mt-6">
            {!isCheckingAuth && (
              <Link
                href={authUser ? "/dashboard" : "/signup"}
                className="inline-block rounded border border-primary bg-primary px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-blue-600"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center w-full -mt-9 px-4">
        <Image
          src="/dashboard.png"
          alt="Expense Tracker Dashboard"
          width={1000}
          height={700}
          className="mt-5 rounded-xl border-2 shadow-xl"
        />
      </div>
    </section>
  );
}

export default Hero;
