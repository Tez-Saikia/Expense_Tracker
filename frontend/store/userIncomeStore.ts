import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

export interface Income {
  _id: string;
  icon: string;
  description: string;
  amount: number;
  date: string;
}

export interface ChartData {
  label: string;
  income: number;
}

export interface IncomeOverview {
  totalIncome: number;
  averageIncome: number;
  numberOfTransactions: number;
  recentTransactions: Income[];
  chartData: ChartData[];
  range: string;
}

export interface CreateIncomePayload {
  icon: string;
  description: string;
  amount: number;
  date: number;
}

export interface UserIncomeStore {
  isLoading: boolean;
  income: Income[];
  overview: IncomeOverview | null;

  fetchIncome: () => Promise<void>;
  fetchOverview: (range?: string) => Promise<void>;
  addIncome: (IncomeData: CreateIncomePayload) => Promise<void>;
  deleteIncome: (id: string) => Promise<void>;

  downloadIncome: () => Promise<void>;
}

export const useIncomeStore = create<UserIncomeStore>((set) => ({
  income: [],
  isLoading: false,
  overview: null,

  fetchIncome: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/income/get");
      set({ income: res.data.data });
    } catch (error) {
      console.error("Failed to fetch the income data: ", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchOverview: async (range = "monthly") => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/income/overview?range=${range}`);
      set({ overview: res.data.data });
    } catch (error) {
      console.error("Failed to fetch the income overview: ", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addIncome: async (IncomeData) => {
    try {
      await axiosInstance.post("/income/add", IncomeData);

      const state = useIncomeStore.getState();

      await state.fetchIncome();

      if (state.overview) {
        await state.fetchOverview(state.overview.range);
      }
    } catch (error) {
      console.error("Failed to add the income:", error);
      throw error;
    }
  },

  deleteIncome: async (id) => {
    try {
      await axiosInstance.delete(`/income/delete/${id}`);

      set((state) => ({
        income: state.income.filter((income) => income._id !== id),
      }));

      const state = useIncomeStore.getState();

      if (state.overview) {
        await state.fetchOverview(state.overview.range);
      }
    } catch (error) {
      console.error("Failed to delete income:", error);
      throw error;
    }
  },

  downloadIncome: async () => {
    try {
      set({ isLoading: true });

      const res = await axiosInstance.get("/income/download", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement("a");

      link.href = url;
      link.download = "income.xlsx";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download income data:", error);

      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
