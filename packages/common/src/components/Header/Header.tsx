import {
    IconBrush,
    IconMenu2,
    IconPhoto,
    IconPlayerPlay,
    IconSettings,
} from '@tabler/icons-react'
import Image from 'next/image'
import type { ImageProps } from 'next/image'
import Link from 'next/link'

export type HeaderProps = {
    logoSrc?: ImageProps['src']
}

const settings = ['Profile', 'Account', 'Dashboard', 'Logout']

const pages = [
    {
        label: 'Configure',
        path: '/configure',
        icon: <IconSettings size={18} />,
    },
    {
        label: 'Media',
        path: '/media',
        icon: <IconPhoto size={18} />,
    },
    {
        label: 'Design',
        path: '/design',
        icon: <IconBrush size={18} />,
    },
    {
        label: 'Play',
        path: '/play',
        icon: <IconPlayerPlay size={18} />,
    },
]

export function Header({ logoSrc }: HeaderProps) {
    return (
        <div className="navbar min-h-14 border-b border-slate-800 bg-neutral-900 px-4 text-slate-100 shadow-none">
            <div className="navbar-start">
                <div className="dropdown md:hidden">
                    <button
                        type="button"
                        tabIndex={0}
                        className="btn btn-ghost btn-square text-slate-200 hover:bg-slate-800 hover:text-white"
                        aria-label="Open navigation"
                    >
                        <IconMenu2 size={22} />
                    </button>
                    <ul
                        tabIndex={0}
                        className="menu dropdown-content z-50 mt-3 w-52 rounded-box bg-neutral-800 p-2 text-slate-100 shadow"
                    >
                        {pages.map((page) => (
                            <li key={page.label}>
                                <a
                                    href={page.path}
                                    className="text-slate-200 hover:bg-slate-700 hover:text-white"
                                >
                                    {page.icon}
                                    {page.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <Link
                    href="/"
                    className="btn btn-ghost h-12 px-2 hover:bg-slate-800"
                    aria-label="Wanderlust home"
                >
                    {logoSrc ? (
                        <Image
                            src={logoSrc}
                            alt="Wanderlust"
                            className="h-9 w-auto object-contain"
                            priority
                        />
                    ) : (
                        <span className="px-2 text-lg font-semibold">
                            Wanderlust
                        </span>
                    )}
                </Link>
            </div>

            <div className="navbar-center hidden md:flex">
                <ul className="menu menu-horizontal gap-1 px-1">
                    {pages.map((page) => (
                        <li key={page.label}>
                            <a
                                href={page.path}
                                className="text-slate-200 hover:bg-slate-800 hover:text-white"
                            >
                                {page.icon}
                                {page.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="navbar-end">
                <div className="dropdown dropdown-end">
                    <button
                        type="button"
                        tabIndex={0}
                        className="avatar btn btn-ghost btn-circle hover:bg-slate-800"
                        aria-label="Open account menu"
                    >
                        <div className="w-9 rounded-full bg-primary text-primary-content">
                            <span className="flex h-full items-center justify-center text-sm font-semibold">
                                W
                            </span>
                        </div>
                    </button>
                    <ul
                        tabIndex={0}
                        className="menu dropdown-content z-50 mt-3 w-52 rounded-box bg-neutral-800 p-2 text-slate-100 shadow"
                    >
                        {settings.map((setting) => (
                            <li key={setting}>
                                <button
                                    type="button"
                                    className="text-slate-200 hover:bg-slate-700 hover:text-white"
                                >
                                    {setting}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
