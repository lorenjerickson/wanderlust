import { useQuery } from '@tanstack/react-query'

export enum Roles {
  GlobalAdmin = 'global-admin',
  GameMaster = 'game-master',
  Player = 'player',
  Spectator = 'spectator',
}

export function useParticipants({ roles }: { roles: string[] }) {
  return useQuery({
    queryKey: ['participants', roles],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/participants?roles=` +
          roles.join(','),
      )
      const data = await response.json()
      return data
    },
  })
}
