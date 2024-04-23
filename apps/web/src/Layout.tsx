import { Outlet } from "react-router-dom";
import { Header } from "@wanderlust/ui";

export function Layout() {


    return (
        <div>            
            <Header />
            <main><Outlet /></main>
        </div>
    )
}