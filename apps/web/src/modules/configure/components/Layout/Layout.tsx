import { Outlet } from 'react-router-dom'

export function ConfigureLayout() {
    return (
        <div className="configure layout">
            <div className="layout__sidebar">
                <nav>
                    <ul>
                        <li>System</li>
                        <li>Security</li>
                        <li>Users</li>
                        <li>Modules</li>
                        <li>Media</li>
                    </ul>
                </nav>
            </div>
            <div className="layout__content">
                <Outlet />
            </div>
        </div>
    )
}
