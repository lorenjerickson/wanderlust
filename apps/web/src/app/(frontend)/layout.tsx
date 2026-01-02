import Providers from './providers'
import { Montserrat } from 'next/font/google'
import './styles.css'

const montserrat = Montserrat({
  subsets: ['latin'], // Or other subsets
  weight: ['400', '700'], // Specify needed weights
  variable: '--font-montserrat', // Assign a CSS variable
})

export default async function RootLayout(props: any) {
  const { children } = props

  return (
    <html lang="en" className={`${montserrat.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Roboto&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
