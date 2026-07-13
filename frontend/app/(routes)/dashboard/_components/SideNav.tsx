"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  PiggyBank,
  ReceiptText,
  Wallet,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { useAuthStore } from "@/store/useAuthStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import Profile from "../profile/page";

function SideNav() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const { logout } = useAuthStore();

  const sidebarMenu = [
    { id: 1, name: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
    { id: 2, name: "Budget", icon: PiggyBank, path: "/dashboard/budget" },
    { id: 3, name: "Expenses", icon: ReceiptText, path: "/dashboard/expense" },
    { id: 4, name: "Income", icon: Wallet, path: "/dashboard/income" },
    { id: 5, name: "Profile", icon: User, isDialog: true },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Hamburger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="rounded-full bg-primary p-3 text-white shadow-lg"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-screen w-65 flex-col border-r bg-white p-6 shadow-sm">
        <Image src="/logo.svg" alt="logo" width={180} height={80} />

        <div className="mt-12 flex-1">
          {sidebarMenu.map((menu) =>
            menu.isDialog ? (
              <button
                key={menu.id}
                onClick={() => setIsProfileOpen(true)}
                className="mb-3 flex w-full items-center gap-3 rounded-lg p-4 text-gray-600 hover:bg-blue-500 hover:text-white"
              >
                <menu.icon size={20} />
                {menu.name}
              </button>
            ) : (
              <Link key={menu.id} href={menu.path!}>
                <div
                  className={`mb-3 flex items-center gap-3 rounded-lg p-4 transition ${
                    pathname === menu.path
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-blue-100"
                  }`}
                >
                  <menu.icon size={20} />
                  {menu.name}
                </div>
              </Link>
            ),
          )}
        </div>

        <button
          onClick={handleLogout}
          className="cursor-pointer flex items-center justify-center gap-2 rounded-lg border border-red-400 py-3 text-red-500 hover:bg-red-500 hover:text-white"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 250,
              }}
              className="fixed left-0 top-0 z-50 h-screen w-72 bg-white shadow-xl md:hidden"
            >
              <div className="flex items-center justify-between border-b p-5">
                <Image src="/logo.svg" alt="logo" width={150} height={60} />

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-md p-2 hover:bg-gray-100"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="p-4">
                {sidebarMenu.map((menu) =>
                  menu.isDialog ? (
                    <button
                      key={menu.id}
                      onClick={() => {
                        setIsProfileOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="mb-2 flex w-full items-center gap-3 rounded-lg p-4 text-gray-600 hover:bg-blue-100"
                    >
                      <menu.icon size={20} />
                      {menu.name}
                    </button>
                  ) : (
                    <Link
                      key={menu.id}
                      href={menu.path!}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div
                        className={`mb-2 flex items-center gap-3 rounded-lg p-4 ${
                          pathname === menu.path
                            ? "bg-primary text-white"
                            : "text-gray-600 hover:bg-blue-100"
                        }`}
                      >
                        <menu.icon size={20} />
                        {menu.name}
                      </div>
                    </Link>
                  ),
                )}
              </div>

              <div className="absolute bottom-6 left-4 right-4 cursor-pointer">
                <button
                  onClick={handleLogout}
                  className=" flex w-full items-center justify-center gap-2 rounded-lg border border-red-400 py-3 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
          </DialogHeader>

          <Profile />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SideNav;
