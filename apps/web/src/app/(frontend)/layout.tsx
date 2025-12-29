import { ThemeProvider } from '@mui/material/styles';
import Providers from './providers';
import './styles.css';
import theme from './theme';

export default async function RootLayout(props: any) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <Providers>
          <ThemeProvider theme={theme}>
            <main>{children}</main>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
