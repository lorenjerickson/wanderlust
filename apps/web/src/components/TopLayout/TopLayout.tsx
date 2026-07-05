import { Header } from '@/core/components/Header/Header'
import { ReactNode } from 'react'

type TopLayoutProps = {
    children: ReactNode
}

export function TopLayout({ children }: TopLayoutProps) {
    return (
        <div className="flex h-screen w-screen flex-col overflow-hidden bg-neutral-900 text-slate-200">
            <Header />
            <main className="min-h-0 flex-1 overflow-hidden">
                {children}
            </main>
        </div>
    )
}
