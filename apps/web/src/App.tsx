import '@mantine/core/styles.css';
import { ConfigProvider } from 'antd';
import { Router } from './Router';
import { theme } from './theme';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    <ConfigProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </ConfigProvider>
  );
}
