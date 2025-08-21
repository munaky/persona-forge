// components/FullScreenLoader.tsx
import React from "react";
import { Loader2 } from "lucide-react";

interface FullScreenLoadingProps {
  loading: boolean;
}

export default function FullScreenLoader({ loading }: FullScreenLoadingProps) {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-white" />
        <p className="text-white text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
};