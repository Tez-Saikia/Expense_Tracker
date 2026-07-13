"use client";

import React, { useEffect, useState } from "react";
import SideNav from "./_components/SideNav";
import DashboardHeader from "./_components/DashboardHeader";
import { axiosInstance } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type DashboardLayoutProps = {
  children: React.ReactNode;
};
interface Budget {
  _id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  userId: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}
function DashboardLayout({ children }: DashboardLayoutProps) {
  console.log("🔥 DASHBOARD LAYOUT LOADED");
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  const route = useRouter();

  const checkUserBudget = async () => {
    try {
      const response = await axiosInstance.get("/budget/get");

      if (response.data.success) {
        const budgetList = response.data.data;
        setBudgets(response.data.data);

        console.log(budgetList);

        if (budgetList.length === 0) {
          route.push("/dashboard/budget");
        }
      }
    } catch (error) {
      console.error("Error while fatching Budget", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserBudget();
  }, []);

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin" />
        <p className="text-sm text-muted-foreground">
          Loading Data...
        </p>
      </div>
    </div>
  }

 return (
  <div>
    <aside className="fixed left-0 top-0 z-30">
      <SideNav />
    </aside>

    <main className="min-h-screen md:ml-64">
      <DashboardHeader />
      {children}
    </main>
  </div>
);
}

export default DashboardLayout;
