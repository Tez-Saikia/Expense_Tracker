"use client";

import axios from "axios";
import { useState, ChangeEvent, useRef } from "react";
import { toast } from "sonner";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

function SignUpPage() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { signup } = useAuthStore();

  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);

      const form = new FormData();

      form.append("email", formData.email);
      form.append("username", formData.username);
      form.append("password", formData.password);

      if (avatar) {
        form.append("avatar", avatar);
      }

      const response = await signup(form);

      toast.success(response.data.message || "Account created successfully 🎉");

      router.push("/login");

      setFormData({
        email: "",
        username: "",
        password: "",
      });

      setAvatar(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      console.log(response.data);
      console.log(response);
    } catch (error) {
      console.error("Failed to register: ", error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data.message ||
            "Unable to create account. Please try again.",
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar */}
          <div>
            <label className="mb-2 block text-sm font-medium">Avatar</label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="w-full rounded-lg border p-2"
            />
          </div>

          {/* Username */}
          <div>
            <label className="mb-2 block text-sm font-medium">Username</label>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full rounded-lg border p-3 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              {showPassword ? (
                <FaEye
                  onClick={() => setShowPassword(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                />
              ) : (
                <FaEyeSlash
                  onClick={() => setShowPassword(true)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                />
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-3 font-medium text-white transition hover:bg-blue-500 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <div className="text-center">
            <Link
              href="/login"
              className="text-gray-600 text-sm hover:underline cursor-pointer"
            >
              Already Signed in? <span className="text-primary font-bold">Click here</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;
