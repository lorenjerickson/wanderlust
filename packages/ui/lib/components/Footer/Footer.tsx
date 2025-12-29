
export function Footer() {
    return (
        <footer className="footer">
            <div className="row">
                <div className="copyright">
                    <p>© {new Date().getFullYear()} Wanderlust. All rights reserved.</p>
                </div>
                <div className="status">
                    <div className="status-item">
                        <p>[connected]</p>
                    </div>
                    <div className="status-item">
                        <p>[latency]</p>
                    </div>
                    <div className="status-item">
                        <p>[session duration]</p>
                    </div>
                </div>
                <div className="links">
                    <p>Report a problem</p>
                    <p>Privacy Policy</p>
                    <p>Terms of Use</p>
                </div>
            </div>
        </footer>
    )
}