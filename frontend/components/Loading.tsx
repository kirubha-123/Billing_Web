import React from "react";

interface LoadingProps {
  message?: string;
}

export default function Loading({ message = "Loading..." }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
      </div>
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  );
}
