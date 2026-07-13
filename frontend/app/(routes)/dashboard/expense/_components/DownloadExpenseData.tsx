"use client";

import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/axios";
import axios from "axios";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function DownloadExpenseData() {
  const [loading, setLoading] = useState(false);
  const handleExpenseDownloadBtn = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/expence/download", {
        responseType: "blob",
        withCredentials: true,
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement("a");
      link.href = url;
      link.download = "expense_data.xlsx";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(res.data.message || "Expense data downloaded successfully");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data.message ||
            "Error while downloading the Expense data",
        );
        console.error("Error while downloading expense data: ", error);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Button
        disabled={loading}
        onClick={() => handleExpenseDownloadBtn()}
        className="cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" />
            Downloading...
          </>
        ) : (
          <>
            <Download />
            Download
          </>
        )}
      </Button>
    </div>
  );
}

export default DownloadExpenseData;
