'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { HeroUIProvider } from '@heroui/react'

export default function Providers({ children }: { children: any }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <HeroUIProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </HeroUIProvider>
  )
}
