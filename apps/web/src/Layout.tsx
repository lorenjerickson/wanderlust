import { Outlet } from 'react-router-dom'
import { Header } from './components/header'

export function Layout() {
    return (
        <div style={{ overflowX: 'hidden' }}>
            <Header />
            <main>
                <Outlet />
            </main>
        </div>
    )
}
