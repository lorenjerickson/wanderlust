import { Header } from '@wanderlust/ui'
import { ReactNode } from 'react'

type LayoutProps = {
    children: ReactNode
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="flex h-screen w-screen flex-col overflow-hidden bg-neutral-900 text-slate-200">
            <Header />
            <main className="min-h-0 flex-1 overflow-hidden">
                {children}
            </main>
        </div>
    )
}
