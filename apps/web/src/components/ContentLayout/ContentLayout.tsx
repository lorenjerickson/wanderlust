import { ReactNode } from 'react'
import classes from './ContentLayout.module.scss'
import { SideNav } from '@/core/components/SideNav/SideNav'

type ContentLayoutProps = {
    children: ReactNode
}

export function ContentLayout({ children }: ContentLayoutProps) {
    return (
        <div className={classes.sideLayout}>
            <div className={classes.nav}>
                <SideNav />
            </div>
            <div className={classes.content}>
                {children}
            </div>
        </div>
    )
}
