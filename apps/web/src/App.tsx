<<<<<<< HEAD
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router } from './Router';
import { theme } from './theme';
import '@mantine/core/styles.css';
=======
import '@mantine/core/styles.css';
import { Router } from './Router';
import { theme } from './theme';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
>>>>>>> cb21b1c (feat: auth with jwt)

const queryClient = new QueryClient();

export default function App() {
  ``;
  return (
<<<<<<< HEAD
    <MantineProvider theme={theme}>
=======
    <MantineProvider>
>>>>>>> cb21b1c (feat: auth with jwt)
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </MantineProvider>
  );
}
