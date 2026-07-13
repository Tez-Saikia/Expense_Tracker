import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface AuthStore {
  authUser: User | null;
  isCheckingAuth: boolean;
  signup: (formData: FormData) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setAuthUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isCheckingAuth: true,
  setAuthUser: (user) => set({ authUser: user }),

  signup: async (formData) => {
    const res = await axiosInstance.post("/user/register", formData);

    set({ authUser: res.data.data.user });

    return res.data;
  },

  login: async (email, password) => {
    const res = await axiosInstance.post("/user/login", { email, password });

    set({ authUser: res.data.data.user });

    return res.data;
  },

  logout: async () => {
    try {
      await axiosInstance.post("/user/logout");

      set({ authUser: null });
    } catch (error) {
      console.log("Failed to logout: ", error);
    }
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("user/me");
      console.log(res.data.data);
      set({ authUser: res.data.data });
    } catch (error) {
      console.error("Error while checking auth: ", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
