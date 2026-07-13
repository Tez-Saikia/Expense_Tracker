import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

export interface Expense {
  _id: string;
  amount: number;
  description: string;
  createdAt: string;
}

export interface Budget {
  _id: string;
  amount: number;
  category: string;
  icon: string;
  startDate: string;
  endDate: string;
  totalSpent: number;
  itemCount: number;
  remainingAmount: number;
  percentage: number;
  expenses?: Expense[];
}

export interface CreateBudgetPayload {
  category: string;
  amount: number;
  icon: string;
  startDate: string;
  endDate: string;
}

export interface UserBudgetStore {
  budget: Budget[];
  isLoading: boolean;
  budgetInfo: Budget | null;

  fetchBudget: () => Promise<void>;
  fetchBudgetById: (id: string) => Promise<void>;

  createBudget: (budgetData: CreateBudgetPayload) => Promise<void>;

  updateBudget: (id: string, budgetData: CreateBudgetPayload) => Promise<void>;

  deleteBudget: (id: string) => Promise<void>;

  setBudgets: (budgets: Budget[]) => void;
}

export const useBudgetStore = create<UserBudgetStore>((set) => ({
  budget: [],
  isLoading: false,
  budgetInfo: null,

  setBudgets: (budgets) => set({ budget: budgets }),

  fetchBudget: async () => {
    try {
      set({ isLoading: true });

      const res = await axiosInstance.get("/budget/get");

      set({
        budget: res.data.data,
      });
    } catch (error) {
      console.error("Failed to fetch budget list:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchBudgetById: async (id) => {
    try {
      set({ isLoading: true });

      const res = await axiosInstance.get(`/budget/${id}`);

      set({
        budgetInfo: res.data.data,
      });
    } catch (error) {
      console.error("Failed to fetch budget:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  createBudget: async (budgetData) => {
    try {
      await axiosInstance.post("/budget/add", budgetData);

      await useBudgetStore.getState().fetchBudget();
    } catch (error) {
      console.error("Failed to create budget:", error);
      throw error;
    }
  },

  updateBudget: async (id, budgetData) => {
    try {
      await axiosInstance.patch(`/budget/update/${id}`, budgetData);

      await useBudgetStore.getState().fetchBudgetById(id);
    } catch (error) {
      console.error("Failed to update budget:", error);
      throw error;
    }
  },

  deleteBudget: async (id) => {
    try {
      await axiosInstance.delete(`/budget/delete/${id}`);

      set((state) => ({
        budget: state.budget.filter((budget) => budget._id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete budget:", error);
      throw error;
    }
  },
}));
