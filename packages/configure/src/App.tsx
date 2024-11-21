import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRouter } from "./Router";
import "@ui/theme/theme.scss";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  );
}
