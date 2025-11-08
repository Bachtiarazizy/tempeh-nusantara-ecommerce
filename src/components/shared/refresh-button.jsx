// app/buyer/components/refresh-button.jsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function RefreshButton() {
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      router.refresh();

      // Simulate loading time
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Data berhasil diperbarui!");
    } catch (error) {
      toast.error("Gagal memperbarui data");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <Button onClick={handleRefresh} disabled={refreshing} variant="outline" size="sm" className="gap-2">
      <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
      Perbarui
    </Button>
  );
}
