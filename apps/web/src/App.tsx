import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { Router } from './Router';
import { theme } from './theme';
import { Header } from './components/header/header';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Header />
      <Router />
    </MantineProvider>
  );
}