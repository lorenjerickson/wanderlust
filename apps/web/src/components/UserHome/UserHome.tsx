'use client'

import { FormEvent, useState } from 'react'
import type {
    InputHTMLAttributes,
    ReactNode,
    TextareaHTMLAttributes,
} from 'react'

import {
    createOwnedCampaign,
    createOwnedWorld,
    type OwnedCampaignSummary,
    type OwnedWorldSummary,
} from '@/server/userHome'

export type UserHomeProfile = {
    fullName: string
    username: string
    emailAddress: string
    phoneNumber: string
    zipCode: string
    isGm: boolean
}

type UserHomeProps = {
    user: UserHomeProfile
    initialWorlds: OwnedWorldSummary[]
    initialCampaigns: OwnedCampaignSummary[]
}

const PRIMARY_ACTION_CLASS =
    'btn btn-warning inline-flex min-h-11 items-center justify-center rounded-lg border border-warning bg-warning px-4 py-2 text-sm font-semibold text-warning-content shadow-md transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warning disabled:cursor-not-allowed disabled:opacity-40'
const SECONDARY_ACTION_CLASS =
    'btn inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-base-content bg-transparent px-4 py-2 text-sm font-semibold text-base-content transition hover:bg-base-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-base-content sm:w-auto'
const MODAL_BOX_CLASS =
    'modal-box max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto bg-base-200 p-6 sm:p-7'
const FORM_CLASS = 'mt-6 flex flex-col gap-5'
const FIELD_GROUP_CLASS = 'flex min-w-0 flex-col gap-2'
const FIELD_LABEL_CLASS = 'text-sm font-semibold text-base-content'
const FIELD_CONTROL_CLASS =
    'input min-h-11 w-full rounded-lg border border-base-content bg-base-100 px-3 py-2 text-base-content shadow-sm outline-none transition placeholder:opacity-60 focus:border-warning focus:ring-2 focus:ring-warning disabled:cursor-not-allowed disabled:opacity-50'
const TEXTAREA_CLASS =
    'textarea min-h-28 w-full resize-y rounded-lg border border-base-content bg-base-100 px-3 py-2 text-base-content shadow-sm outline-none transition placeholder:opacity-60 focus:border-warning focus:ring-2 focus:ring-warning disabled:cursor-not-allowed disabled:opacity-50'
const SELECT_CLASS =
    'select min-h-11 w-full rounded-lg border border-base-content bg-base-100 px-3 py-2 text-base-content shadow-sm outline-none transition focus:border-warning focus:ring-2 focus:ring-warning disabled:cursor-not-allowed disabled:opacity-50'
const FORM_ACTIONS_CLASS =
    'mt-2 flex flex-col-reverse gap-3 border-t border-base-300 pt-5 sm:flex-row sm:justify-end'

function getInitials(name: string) {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase()
}

export function UserHome({
    user,
    initialWorlds,
    initialCampaigns,
}: UserHomeProps) {
    const [ownedWorlds, setOwnedWorlds] =
        useState<OwnedWorldSummary[]>(initialWorlds)
    const [ownedCampaigns, setOwnedCampaigns] =
        useState<OwnedCampaignSummary[]>(initialCampaigns)

    function handleCampaignCreated(campaign: OwnedCampaignSummary) {
        setOwnedCampaigns((current) => [...current, campaign])
        setOwnedWorlds((current) =>
            current.map((world) =>
                campaign.worldId && world.id === campaign.worldId
                    ? { ...world, campaignCount: world.campaignCount + 1 }
                    : world
            )
        )
    }

    return (
        <div className="h-screen overflow-y-auto bg-base-200">
            <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="breadcrumbs text-sm text-base-content opacity-70">
                    <ul>
                        <li>Wanderlust</li>
                        <li>My Account</li>
                    </ul>
                </div>

                <ProfileCard user={user} />
                <SummaryStats
                    worldCount={ownedWorlds.length}
                    campaignCount={ownedCampaigns.length}
                />

                <OwnedWorldsSection
                    worlds={ownedWorlds}
                    canCreate={user.isGm}
                />
                <OwnedCampaignsSection
                    campaigns={ownedCampaigns}
                    worlds={ownedWorlds}
                    canCreate={user.isGm}
                />

                {user.isGm ? (
                    <>
                        <CreateWorldModal
                            onWorldCreated={(world) =>
                                setOwnedWorlds((current) => [...current, world])
                            }
                        />
                        <CreateCampaignModal
                            worlds={ownedWorlds}
                            onCampaignCreated={handleCampaignCreated}
                        />
                    </>
                ) : null}
            </div>
        </div>
    )
}

function ProfileCard({ user }: { user: UserHomeProfile }) {
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
                        <h1 className="text-2xl font-bold">{user.fullName}</h1>
                        <p className="text-base-content opacity-70">
                            @{user.username}
                        </p>
                        {user.isGm ? (
                            <span className="badge badge-primary badge-sm mt-1">
                                Game Master
                            </span>
                        ) : null}
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

function SummaryStats({
    worldCount,
    campaignCount,
}: {
    worldCount: number
    campaignCount: number
}) {
    return (
        <div className="stats stats-vertical mt-6 w-full border border-base-300 bg-base-100 sm:stats-horizontal">
            <div className="stat">
                <div className="stat-title">Worlds</div>
                <div className="stat-value">{worldCount}</div>
                <div className="stat-desc">owned by you</div>
            </div>
            <div className="stat">
                <div className="stat-title">Campaigns</div>
                <div className="stat-value">{campaignCount}</div>
                <div className="stat-desc">owned by you</div>
            </div>
        </div>
    )
}

function OwnedWorldsSection({
    worlds,
    canCreate,
}: {
    worlds: OwnedWorldSummary[]
    canCreate: boolean
}) {
    return (
        <section className="mt-10" aria-labelledby="owned-worlds-heading">
            <SectionHeader
                id="owned-worlds-heading"
                title="My Worlds"
                subtitle="Worlds you own and the campaigns that live in them."
                action={
                    canCreate ? (
                        <button
                            className={PRIMARY_ACTION_CLASS}
                            onClick={() =>
                                (
                                    document.getElementById(
                                        'create-world-modal'
                                    ) as HTMLDialogElement | null
                                )?.showModal()
                            }
                        >
                            Create world
                        </button>
                    ) : null
                }
            />
            {worlds.length === 0 ? (
                <EmptyState message="You don't own any worlds yet." />
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {worlds.map((world) => (
                        <article
                            key={world.id}
                            className="card card-border bg-base-100"
                        >
                            <div className="card-body">
                                <div className="flex items-start justify-between gap-3">
                                    <h3 className="card-title">
                                        <a
                                            className="link link-hover"
                                            href={`/worlds/${world.id}`}
                                        >
                                            {world.name}
                                        </a>
                                    </h3>
                                    <span className="badge badge-sm">
                                        Owner
                                    </span>
                                </div>
                                <p className="text-sm text-base-content opacity-80">
                                    {world.description || 'No description yet.'}
                                </p>
                                <p className="text-xs text-base-content opacity-70">
                                    {world.campaignCount} campaign
                                    {world.campaignCount === 1 ? '' : 's'}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    )
}

function OwnedCampaignsSection({
    campaigns,
    worlds,
    canCreate,
}: {
    campaigns: OwnedCampaignSummary[]
    worlds: OwnedWorldSummary[]
    canCreate: boolean
}) {
    const canCreateCampaign = canCreate && worlds.length > 0

    return (
        <section className="mt-10" aria-labelledby="owned-campaigns-heading">
            <SectionHeader
                id="owned-campaigns-heading"
                title="My Campaigns"
                subtitle="Campaigns you own and run as Game Master."
                action={
                    canCreate ? (
                        <button
                            className={PRIMARY_ACTION_CLASS}
                            disabled={!canCreateCampaign}
                            title={
                                canCreateCampaign
                                    ? undefined
                                    : 'Create a world before creating a campaign'
                            }
                            onClick={() =>
                                (
                                    document.getElementById(
                                        'create-campaign-modal'
                                    ) as HTMLDialogElement | null
                                )?.showModal()
                            }
                        >
                            Create campaign
                        </button>
                    ) : null
                }
            />
            {campaigns.length === 0 ? (
                <EmptyState message="You don't own any campaigns yet." />
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {campaigns.map((campaign) => (
                        <article
                            key={campaign.id}
                            className="card card-border bg-base-100"
                        >
                            <div className="card-body">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h3 className="card-title">
                                            {campaign.worldId ? (
                                                <a
                                                    className="link link-hover"
                                                    href={`/worlds/${campaign.worldId}/campaigns/${campaign.id}`}
                                                >
                                                    {campaign.title}
                                                </a>
                                            ) : (
                                                campaign.title
                                            )}
                                        </h3>
                                        <p className="text-sm text-base-content opacity-70">
                                            {campaign.worldName} ·{' '}
                                            {campaign.playerCount} players
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap justify-end gap-2">
                                        <span className="badge badge-sm">
                                            GM
                                        </span>
                                        <span
                                            className={`badge badge-sm ${campaign.active ? 'badge-success' : 'badge-warning'}`}
                                        >
                                            {campaign.active
                                                ? 'Active'
                                                : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-base-content opacity-80">
                                    {campaign.description ||
                                        'No description yet.'}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    )
}

function SectionHeader({
    id,
    title,
    subtitle,
    action,
}: {
    id: string
    title: string
    subtitle: string
    action: ReactNode
}) {
    return (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <h2 id={id} className="text-lg font-semibold">
                    {title}
                </h2>
                <p className="text-sm text-base-content opacity-70">
                    {subtitle}
                </p>
            </div>
            {action}
        </div>
    )
}

function EditProfileModal({ user }: { user: UserHomeProfile }) {
    return (
        <dialog id="edit-profile-modal" className="modal">
            <div className={MODAL_BOX_CLASS}>
                <h3 className="text-lg font-bold">Edit profile</h3>
                <form method="dialog" className={FORM_CLASS}>
                    <ProfileField
                        id="profile-full-name"
                        label="Full name"
                        name="fullName"
                        defaultValue={user.fullName}
                        autoComplete="name"
                        required
                    />
                    <ProfileField
                        id="profile-username"
                        label="Username"
                        name="username"
                        defaultValue={user.username}
                        autoComplete="username"
                        required
                    />
                    <ProfileField
                        id="profile-email"
                        label="Email address"
                        name="emailAddress"
                        type="email"
                        defaultValue={user.emailAddress}
                        autoComplete="email"
                        required
                    />
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <ProfileField
                            id="profile-phone"
                            label="Phone number"
                            name="phoneNumber"
                            type="tel"
                            defaultValue={user.phoneNumber}
                            autoComplete="tel"
                        />
                        <ProfileField
                            id="profile-zip-code"
                            label="Zip code"
                            name="zipCode"
                            defaultValue={user.zipCode}
                            autoComplete="postal-code"
                            inputMode="numeric"
                        />
                    </div>
                    <div className={FORM_ACTIONS_CLASS}>
                        <button
                            type="button"
                            className={SECONDARY_ACTION_CLASS}
                            onClick={(event) =>
                                event.currentTarget.closest('dialog')?.close()
                            }
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`${PRIMARY_ACTION_CLASS} w-full sm:w-auto`}
                        >
                            Save changes
                        </button>
                    </div>
                </form>
            </div>
            <ModalBackdrop />
        </dialog>
    )
}

function ProfileField({
    id,
    label,
    type = 'text',
    ...inputProps
}: InputHTMLAttributes<HTMLInputElement> & {
    id: string
    label: string
}) {
    return (
        <div className={FIELD_GROUP_CLASS}>
            <label className={FIELD_LABEL_CLASS} htmlFor={id}>
                {label}
            </label>
            <input
                {...inputProps}
                id={id}
                type={type}
                className={FIELD_CONTROL_CLASS}
            />
        </div>
    )
}

function CreateWorldModal({
    onWorldCreated,
}: {
    onWorldCreated: (world: OwnedWorldSummary) => void
}) {
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const form = event.currentTarget
        const formData = new FormData(form)
        setIsSaving(true)
        setError('')

        try {
            const world = await createOwnedWorld({
                name: String(formData.get('name') ?? '').trim(),
                description: String(formData.get('description') ?? '').trim(),
            })
            onWorldCreated(world)
            form.reset()
            form.closest('dialog')?.close()
        } catch (creationError) {
            setError(
                creationError instanceof Error
                    ? creationError.message
                    : 'Unable to create world.'
            )
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <dialog id="create-world-modal" className="modal">
            <div className={MODAL_BOX_CLASS}>
                <h3 className="text-lg font-bold">Create a world</h3>
                <form className={FORM_CLASS} onSubmit={handleSubmit}>
                    <LabeledInput
                        id="world-name"
                        label="World name"
                        name="name"
                        required
                        autoFocus
                    />
                    <LabeledTextarea
                        id="world-description"
                        label="Description"
                        name="description"
                    />
                    <FormError message={error} />
                    <FormActions
                        isSaving={isSaving}
                        submitLabel="Create world"
                    />
                </form>
            </div>
            <ModalBackdrop />
        </dialog>
    )
}

function CreateCampaignModal({
    worlds,
    onCampaignCreated,
}: {
    worlds: OwnedWorldSummary[]
    onCampaignCreated: (campaign: OwnedCampaignSummary) => void
}) {
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const form = event.currentTarget
        const formData = new FormData(form)
        setIsSaving(true)
        setError('')

        try {
            const campaign = await createOwnedCampaign({
                title: String(formData.get('title') ?? '').trim(),
                description: String(formData.get('description') ?? '').trim(),
                worldId: String(formData.get('worldId') ?? ''),
            })
            onCampaignCreated(campaign)
            form.reset()
            form.closest('dialog')?.close()
        } catch (creationError) {
            setError(
                creationError instanceof Error
                    ? creationError.message
                    : 'Unable to create campaign.'
            )
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <dialog id="create-campaign-modal" className="modal">
            <div className={MODAL_BOX_CLASS}>
                <h3 className="text-lg font-bold">Create a campaign</h3>
                <form className={FORM_CLASS} onSubmit={handleSubmit}>
                    <LabeledInput
                        id="campaign-title"
                        label="Campaign title"
                        name="title"
                        required
                        autoFocus
                    />
                    <div className={FIELD_GROUP_CLASS}>
                        <label
                            className={FIELD_LABEL_CLASS}
                            htmlFor="campaign-world"
                        >
                            World
                        </label>
                        <select
                            id="campaign-world"
                            className={SELECT_CLASS}
                            name="worldId"
                            required
                        >
                            {worlds.map((world) => (
                                <option key={world.id} value={world.id}>
                                    {world.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <LabeledTextarea
                        id="campaign-description"
                        label="Description"
                        name="description"
                    />
                    <FormError message={error} />
                    <FormActions
                        isSaving={isSaving}
                        submitLabel="Create campaign"
                    />
                </form>
            </div>
            <ModalBackdrop />
        </dialog>
    )
}

function LabeledInput({
    id,
    label,
    ...props
}: InputHTMLAttributes<HTMLInputElement> & {
    id: string
    label: string
}) {
    return (
        <div className={FIELD_GROUP_CLASS}>
            <label className={FIELD_LABEL_CLASS} htmlFor={id}>
                {label}
            </label>
            <input {...props} id={id} className={FIELD_CONTROL_CLASS} />
        </div>
    )
}

function LabeledTextarea({
    id,
    label,
    ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
    id: string
    label: string
}) {
    return (
        <div className={FIELD_GROUP_CLASS}>
            <label className={FIELD_LABEL_CLASS} htmlFor={id}>
                {label}
            </label>
            <textarea {...props} id={id} className={TEXTAREA_CLASS} rows={5} />
        </div>
    )
}

function FormActions({
    isSaving,
    submitLabel,
}: {
    isSaving: boolean
    submitLabel: string
}) {
    return (
        <div className={FORM_ACTIONS_CLASS}>
            <button
                type="button"
                className={SECONDARY_ACTION_CLASS}
                onClick={(event) =>
                    event.currentTarget.closest('dialog')?.close()
                }
            >
                Cancel
            </button>
            <button
                type="submit"
                className={`${PRIMARY_ACTION_CLASS} w-full sm:w-auto`}
                disabled={isSaving}
            >
                {isSaving ? 'Creating…' : submitLabel}
            </button>
        </div>
    )
}

function FormError({ message }: { message: string }) {
    return message ? (
        <p className="text-sm text-error" role="alert">
            {message}
        </p>
    ) : null
}

function ModalBackdrop() {
    return (
        <form method="dialog" className="modal-backdrop">
            <button>close</button>
        </form>
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
