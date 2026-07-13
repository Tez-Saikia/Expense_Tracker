import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import { useBudgetStore } from "@/store/userBudgetStore";

export interface Expense {
  _id: string;
  description: string;
  amount: number;
  category: string;
  date: string;

  budgetId: {
    _id: string;
    icon: string;
    category: string;
  };
}

export interface ExpenseOverview {
  totalExpence: number;
  averageExpence: number;
  numberOfTransactions: number;
  recentTransactions: Expense[];
  range: string;
}

interface CreateExpensePayload {
  description: string;
  amount: number;
  budgetId: string;
  date: number;
}

interface CreateBudgetExpensePayload {
  description: string;
  amount: number;
}

interface ExpenseStore {
  expenses: Expense[];
  budgetExpenses: Expense[];
  overview: ExpenseOverview | null;

  isLoading: boolean;

  range: string;
  setRange: (range: string) => void;

  fetchExpenses: () => Promise<void>;
  fetchOverview: (range?: string) => Promise<void>;
  fetchBudgetExpenses: (budgetId: string) => Promise<void>;

  addExpense: (expenseData: CreateExpensePayload) => Promise<void>;

  addBudgetExpense: (
    budgetId: string,
    expenseData: CreateBudgetExpensePayload,
  ) => Promise<void>;

  deleteExpense: (id: string) => Promise<void>;

  deleteBudgetExpense: (expenseId: string, budgetId: string) => Promise<void>;
}

export const useExpenseStore = create<ExpenseStore>((set) => ({
  expenses: [],
  budgetExpenses: [],
  overview: null,

  isLoading: false,

  range: "monthly",

  setRange: (range) => set({ range }),

  fetchExpenses: async () => {
    try {
      set({ isLoading: true });

      const res = await axiosInstance.get("/expence/get");

      set({
        expenses: res.data.data,
      });
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchOverview: async (range = "monthly") => {
    try {
      set({ isLoading: true });

      const res = await axiosInstance.get(`/expence/overview?range=${range}`);

      set({
        overview: res.data.data,
      });
    } catch (error) {
      console.error("Failed to fetch overview:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchBudgetExpenses: async (budgetId) => {
    try {
      set({ isLoading: true });

      const res = await axiosInstance.get(`/expence/budget/${budgetId}`);

      set({
        budgetExpenses: res.data.data,
      });
    } catch (error) {
      console.error("Failed to fetch budget expenses:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addExpense: async (expenseData) => {
    try {
      await axiosInstance.post("/expence/add", expenseData);

      const { fetchExpenses, fetchOverview, range } =
        useExpenseStore.getState();

      await fetchExpenses();
      await fetchOverview(range);
    } catch (error) {
      console.error("Failed to add expense:", error);
      throw error;
    }
  },

  addBudgetExpense: async (budgetId, expenseData) => {
    try {
      await axiosInstance.post(`/expence/budget/${budgetId}`, expenseData);

      await useExpenseStore.getState().fetchBudgetExpenses(budgetId);
    } catch (error) {
      console.error("Failed to add expense:", error);
      throw error;
    }
  },

  deleteExpense: async (id) => {
    try {
      await axiosInstance.delete(`/expence/delete/${id}`);

      const { fetchExpenses, fetchOverview, range } =
        useExpenseStore.getState();

      await fetchExpenses();
      await fetchOverview(range);
    } catch (error) {
      console.error("Failed to delete expense:", error);
      throw error;
    }
  },

  deleteBudgetExpense: async (expenseId: string, budgetId: string) => {
    try {
      await axiosInstance.delete(`/expence/delete/${expenseId}`);

      const { fetchBudgetExpenses } = useExpenseStore.getState();

      const { fetchBudgetById } = useBudgetStore.getState();

      await Promise.all([
        fetchBudgetExpenses(budgetId),
        fetchBudgetById(budgetId),
      ]);
    } catch (error) {
      throw error;
    }
  },
}));
