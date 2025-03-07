import { Outlet } from 'react-router-dom'
import classes from './TopLayout.module.scss'
import { Header } from '@wanderlust/ui'

export function TopLayout() {
    return (
        <div className={classes.layout}>
            <Header />
            <main className={classes.main}>
                <Outlet />
            </main>
        </div>
    )
}
