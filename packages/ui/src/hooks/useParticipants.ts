import { useQuery } from "@tanstack/react-query";

export function useParticipants() {
  return useQuery({
    queryKey: ["participants"],
    queryFn: async () => {
      const response = await fetch("/api/participants");
      const data = await response.json();
      return data;
    },
  });
}
