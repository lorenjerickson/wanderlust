import { useQuery } from "@tanstack/react-query";

enum Roles {
  GlobalAdmin = "global-admin",
  GameMaster = "game-master",
  Player = "player",
  Spectator = "spectator",
}

export function useParticipants({ roles }: { roles: string[] }) {
  return useQuery({
    queryKey: ["participants", roles],
    queryFn: async () => {
      const response = await fetch(
        "http://localhost:3000/api/participants?roles=" + roles.join(",")
      );
      const data = await response.json();
      return data;
    },
  });
}
