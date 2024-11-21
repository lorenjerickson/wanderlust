import { Outlet } from 'react-router-dom'
import { Header } from '../header'
import classes from './Layout.module.scss'

export function Layout() {
    return (
        <div className={classes.layout}>
            <Header />
            <main className={classes.main}>
                <Outlet />
            </main>
        </div>
    )
}
