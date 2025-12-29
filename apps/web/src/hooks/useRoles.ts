import { useQuery } from '@tanstack/react-query'

export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/roles`,
      )
      const data = await response.json()
      return data
    },
  })
}
