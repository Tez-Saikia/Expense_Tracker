import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

import { useIncomeStore } from "@/store/userIncomeStore";

function DownloadIncomeData() {
  const isLoading = useIncomeStore((state) => state.isLoading);

  const downloadIncome = useIncomeStore((state) => state.downloadIncome);

  const handleDownload = async () => {
    try {
      await downloadIncome();

      toast.success("Income data downloaded successfully 🎉");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data.message ?? "Failed to download income data",
        );
      }
    }
  };

  return (
    <Button
      disabled={isLoading}
      onClick={handleDownload}
      className="cursor-pointer"
    >
      {isLoading ? (
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
  );
}

export default DownloadIncomeData;
