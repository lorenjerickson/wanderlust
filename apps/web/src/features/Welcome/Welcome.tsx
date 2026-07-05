import classes from './Welcome.module.scss'

export function Welcome() {
    return (
        <div className={classes.welcome}>
            <div className={classes.pageTitle}>Wanderlust</div>
            <div className={classes.tagline}>
                Where adventure awaits.
            </div>
        </div>
    )
}
