'use client'

import { useState } from 'react'

type CampaignStatus = 'active' | 'hiatus' | 'completed'

type LastSession = {
    date: string
    summary: string
}

type PlayerCampaign = {
    id: string
    worldSlug: string
    campaignSlug: string
    sessionSlug: string
    title: string
    worldName: string
    status: CampaignStatus
    characterName: string
    shortDescription: string
    lastSession: LastSession | null
}

type ManagedWorld = {
    id: string
    slug: string
    name: string
    description: string
    campaignCount: number
}

type ManagedCampaign = {
    id: string
    worldSlug: string
    campaignSlug: string
    title: string
    worldName: string
    status: CampaignStatus
    playerCount: number
    shortDescription: string
}

type UserProfile = {
    fullName: string
    username: string
    emailAddress: string
    phoneNumber: string
    zipCode: string
    isGm: boolean
}

const MOCK_USER: UserProfile = {
    fullName: 'Loren Erickson',
    username: 'loren',
    emailAddress: 'lorenjerickson@gmail.com',
    phoneNumber: '(555) 201-4488',
    zipCode: '97214',
    isGm: true,
}

const MOCK_PLAYER_CAMPAIGNS: PlayerCampaign[] = [
    {
        id: 'pc-1',
        worldSlug: 'aetherfall',
        campaignSlug: 'sunken-spire',
        sessionSlug: 'session-12',
        title: 'The Sunken Spire',
        worldName: 'Aetherfall',
        status: 'active',
        characterName: 'Kessa Windmere',
        shortDescription:
            'A drowned city stirs beneath the tides, and something down there still remembers its name.',
        lastSession: {
            date: 'Jul 5, 2026',
            summary:
                'The party breached the outer seawall and lost Torvin to the undertow. Kessa recovered a corroded signet ring from the gatehouse.',
        },
    },
    {
        id: 'pc-2',
        worldSlug: 'cinderreach',
        campaignSlug: 'iron-and-ash',
        sessionSlug: 'session-7',
        title: 'Iron & Ash',
        worldName: 'Cinderreach',
        status: 'active',
        characterName: 'Bram Ashfoot',
        shortDescription:
            'Refugee clans fight for control of the last forge-city as the wastes close in around it.',
        lastSession: {
            date: 'Jun 28, 2026',
            summary:
                'Negotiated a fragile truce between the Rill and Kettish clans. Bram was named a forge-warden as part of the bargain.',
        },
    },
    {
        id: 'pc-3',
        worldSlug: 'aetherfall',
        campaignSlug: 'hollow-court',
        sessionSlug: 'session-1',
        title: 'The Hollow Court',
        worldName: 'Aetherfall',
        status: 'hiatus',
        characterName: 'Ilyra Duskwhisper',
        shortDescription:
            'A shadow court plays kingmaker in a realm that no longer remembers its own throne.',
        lastSession: null,
    },
]

const MOCK_MANAGED_WORLDS: ManagedWorld[] = [
    {
        id: 'w-1',
        slug: 'aetherfall',
        name: 'Aetherfall',
        description:
            'A sky-shattered realm of floating reliquaries and drowned cities, still settling after the Fall.',
        campaignCount: 2,
    },
    {
        id: 'w-2',
        slug: 'cinderreach',
        name: 'Cinderreach',
        description:
            'A scorched frontier where clans of survivors trade steel and favors along the ash roads.',
        campaignCount: 1,
    },
]

const MOCK_MANAGED_CAMPAIGNS: ManagedCampaign[] = [
    {
        id: 'mc-1',
        worldSlug: 'aetherfall',
        campaignSlug: 'sunken-spire',
        title: 'The Sunken Spire',
        worldName: 'Aetherfall',
        status: 'active',
        playerCount: 4,
        shortDescription:
            'A drowned city stirs beneath the tides, and something down there still remembers its name.',
    },
    {
        id: 'mc-2',
        worldSlug: 'aetherfall',
        campaignSlug: 'hollow-court',
        title: 'The Hollow Court',
        worldName: 'Aetherfall',
        status: 'hiatus',
        playerCount: 3,
        shortDescription:
            'A shadow court plays kingmaker in a realm that no longer remembers its own throne.',
    },
    {
        id: 'mc-3',
        worldSlug: 'cinderreach',
        campaignSlug: 'forge-wardens',
        title: 'Forge Wardens',
        worldName: 'Cinderreach',
        status: 'completed',
        playerCount: 5,
        shortDescription:
            'A season-long campaign to rebuild the last working forge before the ash roads close for winter.',
    },
]

const STATUS_BADGE: Record<CampaignStatus, string> = {
    active: 'badge-success',
    hiatus: 'badge-warning',
    completed: 'badge-neutral',
}

function getInitials(name: string) {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase()
}

export function UserHome() {
    const [view, setView] = useState<'player' | 'gm'>('player')

    return (
        <div className="min-h-screen bg-base-200">
            <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="breadcrumbs text-sm text-base-content opacity-70">
                    <ul>
                        <li>Wanderlust</li>
                        <li>My Account</li>
                    </ul>
                </div>

                <ProfileCard user={MOCK_USER} />

                <SummaryStats user={MOCK_USER} />

                <div role="tablist" className="tabs tabs-box mt-10 w-fit">
                    <button
                        role="tab"
                        className={`tab ${view === 'player' ? 'tab-active' : ''}`}
                        onClick={() => setView('player')}
                    >
                        Player
                    </button>
                    {MOCK_USER.isGm && (
                        <button
                            role="tab"
                            className={`tab ${view === 'gm' ? 'tab-active' : ''}`}
                            onClick={() => setView('gm')}
                        >
                            Game Master
                        </button>
                    )}
                </div>

                <div className="mt-6">
                    {view === 'player' ? (
                        <PlayerSection campaigns={MOCK_PLAYER_CAMPAIGNS} />
                    ) : (
                        <GmSection
                            worlds={MOCK_MANAGED_WORLDS}
                            campaigns={MOCK_MANAGED_CAMPAIGNS}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

function ProfileCard({ user }: { user: UserProfile }) {
    return (
        <div className="card card-border mt-6 bg-base-100">
            <div className="card-body gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <div className="avatar avatar-placeholder">
                        <div className="w-16 rounded-full bg-neutral text-neutral-content">
                            <span className="text-xl">
                                {getInitials(user.fullName)}
                            </span>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">
                            {user.fullName}
                        </h1>
                        <p className="text-base-content opacity-70">
                            @{user.username}
                        </p>
                        {user.isGm && (
                            <span className="badge badge-primary badge-sm mt-1">
                                Game Master
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        className="btn btn-outline btn-sm"
                        onClick={() =>
                            (
                                document.getElementById(
                                    'edit-profile-modal'
                                ) as HTMLDialogElement | null
                            )?.showModal()
                        }
                    >
                        Edit profile
                    </button>
                    <a className="btn btn-ghost btn-sm" href="/auth/logout">
                        Log out
                    </a>
                </div>
            </div>

            <div className="divider m-0" />

            <div className="card-body grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
                <DetailField label="Email" value={user.emailAddress} />
                <DetailField label="Phone" value={user.phoneNumber} />
                <DetailField label="Zip code" value={user.zipCode} />
            </div>

            <EditProfileModal user={user} />
        </div>
    )
}

function DetailField({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs tracking-wide text-base-content opacity-70 uppercase">
                {label}
            </p>
            <p className="font-medium">{value}</p>
        </div>
    )
}

function EditProfileModal({ user }: { user: UserProfile }) {
    return (
        <dialog id="edit-profile-modal" className="modal">
            <div className="modal-box">
                <h3 className="text-lg font-bold">Edit profile</h3>

                <fieldset className="fieldset mt-4">
                    <legend className="fieldset-legend">Full name</legend>
                    <input
                        type="text"
                        defaultValue={user.fullName}
                        className="input w-full"
                    />
                </fieldset>

                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Username</legend>
                    <input
                        type="text"
                        defaultValue={user.username}
                        className="input w-full"
                    />
                </fieldset>

                <fieldset className="fieldset">
                    <legend className="fieldset-legend">
                        Email address
                    </legend>
                    <input
                        type="email"
                        defaultValue={user.emailAddress}
                        className="input w-full"
                    />
                </fieldset>

                <div className="grid grid-cols-2 gap-4">
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">
                            Phone number
                        </legend>
                        <input
                            type="tel"
                            defaultValue={user.phoneNumber}
                            className="input w-full"
                        />
                    </fieldset>

                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Zip code</legend>
                        <input
                            type="text"
                            defaultValue={user.zipCode}
                            className="input w-full"
                        />
                    </fieldset>
                </div>

                <div className="modal-action">
                    <form method="dialog" className="flex gap-2">
                        <button className="btn">Cancel</button>
                        <button className="btn btn-primary">
                            Save changes
                        </button>
                    </form>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    )
}

function SummaryStats({ user }: { user: UserProfile }) {
    return (
        <div className="stats stats-vertical mt-6 w-full border border-base-300 bg-base-100 sm:stats-horizontal">
            <div className="stat">
                <div className="stat-title">Playing</div>
                <div className="stat-value text-primary">
                    {MOCK_PLAYER_CAMPAIGNS.length}
                </div>
                <div className="stat-desc">active campaigns</div>
            </div>
            {user.isGm && (
                <>
                    <div className="stat">
                        <div className="stat-title">Worlds</div>
                        <div className="stat-value">
                            {MOCK_MANAGED_WORLDS.length}
                        </div>
                        <div className="stat-desc">under your management</div>
                    </div>
                    <div className="stat">
                        <div className="stat-title">Running</div>
                        <div className="stat-value">
                            {MOCK_MANAGED_CAMPAIGNS.length}
                        </div>
                        <div className="stat-desc">campaigns as GM</div>
                    </div>
                </>
            )}
        </div>
    )
}

function SectionHeading({
    title,
    subtitle,
}: {
    title: string
    subtitle: string
}) {
    return (
        <div className="mb-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-base-content opacity-70">{subtitle}</p>
        </div>
    )
}

function PlayerSection({ campaigns }: { campaigns: PlayerCampaign[] }) {
    if (campaigns.length === 0) {
        return (
            <EmptyState message="You haven't joined any campaigns yet." />
        )
    }

    return (
        <div>
            <SectionHeading
                title="My Campaigns"
                subtitle="Worlds you're adventuring in as a player."
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {campaigns.map((campaign) => (
                    <div
                        key={campaign.id}
                        className="card card-border bg-base-100"
                    >
                        <div className="card-body">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <h2 className="card-title">
                                        {campaign.title}
                                    </h2>
                                    <p className="text-sm text-base-content opacity-70">
                                        {campaign.worldName} · playing{' '}
                                        {campaign.characterName}
                                    </p>
                                </div>
                                <span
                                    className={`badge ${STATUS_BADGE[campaign.status]} badge-sm capitalize`}
                                >
                                    {campaign.status}
                                </span>
                            </div>

                            <p className="text-sm text-base-content opacity-80">
                                {campaign.shortDescription}
                            </p>

                            <div className="divider my-1" />

                            {campaign.lastSession ? (
                                <div>
                                    <p className="text-xs tracking-wide text-base-content opacity-70 uppercase">
                                        Last session ·{' '}
                                        {campaign.lastSession.date}
                                    </p>
                                    <p className="text-sm">
                                        {campaign.lastSession.summary}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-base-content opacity-70 italic">
                                    No sessions played yet.
                                </p>
                            )}

                            <div className="card-actions mt-2 justify-end">
                                <a
                                    className="btn btn-primary btn-sm"
                                    href={`/worlds/${campaign.worldSlug}/campaigns/${campaign.campaignSlug}/session/${campaign.sessionSlug}/lobby`}
                                >
                                    Go to lobby
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function GmSection({
    worlds,
    campaigns,
}: {
    worlds: ManagedWorld[]
    campaigns: ManagedCampaign[]
}) {
    return (
        <div className="flex flex-col gap-10">
            <div>
                <SectionHeading
                    title="Worlds I'm Running"
                    subtitle="Settings you've built for your tables."
                />
                {worlds.length === 0 ? (
                    <EmptyState message="You haven't created a world yet." />
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {worlds.map((world) => (
                            <div
                                key={world.id}
                                className="card card-border bg-base-100"
                            >
                                <div className="card-body">
                                    <h2 className="card-title">
                                        {world.name}
                                    </h2>
                                    <p className="text-sm text-base-content opacity-80">
                                        {world.description}
                                    </p>
                                    <p className="text-xs text-base-content opacity-70">
                                        {world.campaignCount} campaign
                                        {world.campaignCount === 1 ? '' : 's'}
                                    </p>
                                    <div className="card-actions mt-2 justify-end">
                                        <a
                                            className="btn btn-outline btn-sm"
                                            href={`/worlds/${world.slug}`}
                                        >
                                            Manage world
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <SectionHeading
                    title="Campaigns I'm GMing"
                    subtitle="Jump back into a table you run."
                />
                {campaigns.length === 0 ? (
                    <EmptyState message="You aren't running any campaigns yet." />
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {campaigns.map((campaign) => (
                            <div
                                key={campaign.id}
                                className="card card-border bg-base-100"
                            >
                                <div className="card-body">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h2 className="card-title">
                                                {campaign.title}
                                            </h2>
                                            <p className="text-sm text-base-content opacity-70">
                                                {campaign.worldName} ·{' '}
                                                {campaign.playerCount} players
                                            </p>
                                        </div>
                                        <span
                                            className={`badge ${STATUS_BADGE[campaign.status]} badge-sm capitalize`}
                                        >
                                            {campaign.status}
                                        </span>
                                    </div>

                                    <p className="text-sm text-base-content opacity-80">
                                        {campaign.shortDescription}
                                    </p>

                                    <div className="card-actions mt-2 justify-end">
                                        <a
                                            className="btn btn-primary btn-sm"
                                            href={`/worlds/${campaign.worldSlug}/campaigns/${campaign.campaignSlug}`}
                                        >
                                            Manage campaign
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="card card-border card-dash bg-base-100">
            <div className="card-body items-center text-center text-base-content opacity-70">
                <p>{message}</p>
            </div>
        </div>
    )
}
