'use client'

export const LoginPage = () => {
    return (
        <main className="flex h-screen w-screen items-center justify-center bg-neutral-900 px-6 text-slate-100">
            <div className="w-full max-w-md">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
                    Wanderlust
                </p>
                <h1 className="mt-4 text-4xl font-bold tracking-normal text-white">
                    Let the adventure begin.
                </h1>
                <p className="mt-4 text-base leading-7 text-slate-300">
                    Sign in with Auth0 to enter your campaign workspace.
                </p>
                <div className="mt-8 flex gap-3">
                    <a
                        className="inline-flex h-11 items-center justify-center rounded-md bg-amber-300 px-5 text-sm font-semibold text-neutral-950 transition hover:bg-amber-200"
                        href="/auth/login"
                    >
                        Log in
                    </a>
                    <a
                        className="inline-flex h-11 items-center justify-center rounded-md border border-slate-600 px-5 text-sm font-semibold text-slate-100 transition hover:border-slate-400"
                        href="/auth/login?screen_hint=signup"
                    >
                        Sign up
                    </a>
                </div>
            </div>
        </main>
    )
}
