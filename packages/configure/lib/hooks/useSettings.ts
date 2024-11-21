import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

export function useSettings() {
  const response = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      return fetch("http://localhost:3000/settings").then((res) => res.json());
    },
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
    refetchOnMount: true,
  });

  const addSettings = async (settings: any) => {  
    return fetch("http://localhost:3000/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    });

  };

  return useMemo(() => {
    return {
      settings: response.data,
      isLoading: response.isLoading,
      isError: response.isError,
      error: response.error,
      addSettings,
    };
  }, [response]);
}
