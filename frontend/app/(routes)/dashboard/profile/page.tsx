"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Profile() {
  const { authUser, setAuthUser } = useAuthStore();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [avatar, setAvatar] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (authUser) {
      setUsername(authUser.username);
      setEmail(authUser.email);
    }
  }, [authUser]);

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);

      const profileChanged =
        username.trim() !== authUser?.username ||
        email.trim() !== authUser?.email;

      const passwordChanged = newPassword.trim().length > 0;
      const avatarChanged = avatar !== null;

      if (passwordChanged && !currentPassword.trim()) {
        toast.error("Please enter your current password");
        return;
      }

      if (!profileChanged && !passwordChanged && !avatarChanged) {
        toast.info("No changes detected");
        return;
      }

      // Update username/email
      if (profileChanged) {
        const res = await axiosInstance.patch("/user/update", {
          username: username.trim(),
          email: email.trim(),
        });

        if (res.data?.data) {
          setAuthUser(res.data.data);
        }

        toast.success(res.data?.message || "Profile updated successfully");
      }

      // Update avatar
      if (avatarChanged && avatar) {
        const formData = new FormData();

        formData.append("avatar", avatar);

        const res = await axiosInstance.patch("/user/avatar", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (res.data?.data) {
          setAuthUser(res.data.data);
        }

        toast.success(res.data?.message || "Avatar updated successfully");

        setAvatar(null);
      }

      // Update password
      if (passwordChanged) {
        const res = await axiosInstance.patch("/user/password", {
          currentPassword,
          newPassword,
        });

        toast.success(res.data?.message || "Password updated successfully");

        setCurrentPassword("");
        setNewPassword("");
      }
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges =
    username.trim() !== authUser?.username ||
    email.trim() !== authUser?.email ||
    newPassword.trim().length > 0 ||
    avatar !== null;

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-4">
        <img
          src={
            avatar
              ? URL.createObjectURL(avatar)
              : authUser?.avatar || "/default-avatar.png"
          }
          alt="Profile"
          className="h-24 w-24 rounded-full object-cover border"
        />

        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              setAvatar(file);
            }
          }}
        />
      </div>

      {/* Username */}
      <div>
        <label className="mb-2 block text-sm font-medium">Username</label>
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />
      </div>

      {/* Email */}
      <div>
        <label className="mb-2 block text-sm font-medium">Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />
      </div>

      {/* Current Password */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Current Password
        </label>

        <div className="relative">
          <Input
            type={showCurrentPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter new password"
            className="pr-10"
          />

          {showCurrentPassword ? (
            <FaEye
              onClick={() => setShowCurrentPassword(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
            />
          ) : (
            <FaEyeSlash
              onClick={() => setShowCurrentPassword(true)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
            />
          )}
        </div>
      </div>

      {/* New Password */}
      <div>
        <label className="mb-2 block text-sm font-medium">New Password</label>

        <div className="relative">
          <Input
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="pr-10"
          />

          {showNewPassword ? (
            <FaEye
              onClick={() => setShowNewPassword(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
            />
          ) : (
            <FaEyeSlash
              onClick={() => setShowNewPassword(true)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
            />
          )}
        </div>
      </div>

      <Button
        onClick={handleUpdateProfile}
        disabled={!hasChanges || isLoading}
        className="w-full cursor-pointer"
      >
        {isLoading ? "Updating..." : "Update Profile"}
      </Button>
    </div>
  );
}

export default Profile;
