import { axiosInstance } from "@/lib/axios";

export const getCurrentUser = async () => {
    return await axiosInstance.get("/user/me")
}