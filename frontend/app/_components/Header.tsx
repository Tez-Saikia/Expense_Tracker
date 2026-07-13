"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import UserProfile from "./UserProfile";
import { useAuthStore } from "@/store/useAuthStore";

function Header() {
  const authUser = useAuthStore((state) => state.authUser);

  return (
    <header className="p-5 flex justify-between items-center border shadow">
      <Image src="/logo.svg" alt="logo" width={200} height={100} />

      {authUser ? (
        <UserProfile />
      ) : (
        <Link href="/signup">
          <Button className="cursor-pointer hover:bg-blue-600">
            Get Started
          </Button>
        </Link>
      )}
    </header>
  );
}

export default Header;
