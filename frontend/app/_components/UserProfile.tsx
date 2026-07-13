"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuthStore } from "@/store/useAuthStore";

export default function UserProfile() {
  const router = useRouter();

  const { authUser, logout } = useAuthStore();

  if (!authUser) return null;

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative h-10 w-10 overflow-hidden rounded-full cursor-pointer">
          <Image
            src={authUser.avatar || "/default-avatar.png"}
            alt={authUser.username}
            fill
            className="object-cover"
          />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem className="capitalize">{authUser.username}</DropdownMenuItem>

        <DropdownMenuItem>{authUser.email}</DropdownMenuItem>

        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
