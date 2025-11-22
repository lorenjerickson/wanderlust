import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export function useMedia() {
  const [filter, setFilter] = useState("");

  const response = useQuery({
    queryKey: ["media", filter],
    queryFn: async () => {
      const response = await fetch(`/api/media?filter=${filter}`, {
        headers: {
          Acceot: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.json();
    },
  });

  return {
    filter,
    setFilter,
    media: response.data,
    isLoading: response.isLoading,
    error: response.error,
  };
}
