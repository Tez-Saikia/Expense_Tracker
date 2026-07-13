import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000/api/v1/"
    : "/user";

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
