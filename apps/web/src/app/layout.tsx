import type { Metadata } from 'next'
import { ReactNode } from 'react'

import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
    title: 'Wanderlust',
    description: 'Where adventure awaits.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
