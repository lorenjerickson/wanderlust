import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Router } from './Router'

const queryClient = new QueryClient()

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router />
        </QueryClientProvider>
    )
}
