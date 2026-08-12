import wanderlustWideLogo from '@wanderlust/common/assets/wanderlust-wide-logo.png'
import { Header } from '@wanderlust/common/components'
import { ReactNode } from 'react'

type LayoutProps = {
    children: ReactNode
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="flex h-screen w-screen flex-col overflow-hidden bg-neutral-900 text-slate-200">
            <Header logoSrc={wanderlustWideLogo} />
            <main className="min-h-0 flex-1 overflow-hidden">
                {children}
            </main>
        </div>
    )
}
