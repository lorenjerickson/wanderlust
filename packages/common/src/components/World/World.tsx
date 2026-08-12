'use client'

import { IconMap, IconPlus } from '@tabler/icons-react'
import { useEffect, useMemo, useState, useTransition } from 'react'

import type {
    WorldArtifact,
    WorldArtifactType,
    WorldDataServices,
    WorldRecord,
} from '../../types'

import styles from './World.module.scss'

export type WorldProps = {
    refreshToken: number
    onCreateArtifact: () => void
    onEditArtifact: (artifactId: string) => void
    services: WorldDataServices
}

function getExcerpt(markdown: string) {
    return markdown
        .replace(/^#+\s+/gm, '')
        .replace(/[*_`>#-]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
}

export function World({
    refreshToken,
    onCreateArtifact,
    onEditArtifact,
    services,
}: WorldProps) {
    const [query, setQuery] = useState('')
    const [artifacts, setArtifacts] = useState<WorldArtifact[]>([])
    const [currentWorld, setCurrentWorld] = useState<WorldRecord | null>(null)
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        startTransition(async () => {
            const [nextArtifacts, worlds] = await Promise.all([
                services.findWorldArtifacts({ query }),
                services.findAllWorlds(),
            ])
            setArtifacts(nextArtifacts)
            setCurrentWorld(worlds[0] ?? null)
        })
    }, [query, refreshToken, services])

    const groupedArtifacts = useMemo(() => {
        return artifacts.reduce<
            Partial<Record<WorldArtifactType, WorldArtifact[]>>
        >((groups, artifact) => {
            groups[artifact.artifactType] ??= []
            groups[artifact.artifactType]?.push(artifact)
            return groups
        }, {})
    }, [artifacts])

    return (
        <div className={styles.worldPanel}>
            <section
                className={[
                    styles.worldMap,
                    currentWorld?.mapImageUrl ? '' : styles.worldMapEmpty,
                ].join(' ')}
                style={
                    currentWorld?.mapImageUrl
                        ? {
                              backgroundImage: `url(${currentWorld.mapImageUrl})`,
                          }
                        : undefined
                }
            >
                <span className={styles.worldMapTitle}>
                    {currentWorld?.name ?? 'World Map'}
                </span>
            </section>

            <div className={styles.toolbar}>
                <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className={styles.searchInput}
                    placeholder="Search world artifacts"
                    aria-label="Search world artifacts by title or description"
                />
                <button
                    type="button"
                    className={styles.addButton}
                    onClick={onCreateArtifact}
                    aria-label="Create world artifact"
                    title="Create world artifact"
                >
                    <IconPlus size={18} aria-hidden="true" />
                </button>
            </div>

            <div className={styles.artifactGroups} aria-busy={isPending}>
                {artifacts.length === 0 ? (
                    <div className={styles.emptyState}>
                        {query
                            ? 'No matching world artifacts.'
                            : 'No world artifacts yet.'}
                    </div>
                ) : null}
                {Object.entries(groupedArtifacts).map(
                    ([artifactType, groupArtifacts]) => (
                        <section
                            className={styles.artifactGroup}
                            key={artifactType}
                        >
                            <h3 className={styles.artifactGroupTitle}>
                                {artifactType}
                            </h3>
                            <div className={styles.artifactList}>
                                {groupArtifacts?.map((artifact) => (
                                    <button
                                        type="button"
                                        className={styles.artifactButton}
                                        key={artifact.id}
                                        onDoubleClick={() =>
                                            onEditArtifact(artifact.id)
                                        }
                                        onClick={() =>
                                            onEditArtifact(artifact.id)
                                        }
                                        aria-label={`Edit ${artifact.title}`}
                                    >
                                        <span
                                            className={styles.artifactTitleRow}
                                        >
                                            <span
                                                className={styles.artifactTitle}
                                            >
                                                {artifact.title}
                                            </span>
                                            {artifact.artifactType ===
                                                'World' &&
                                            artifact.mapImageUrl ? (
                                                <span
                                                    className={styles.mapBadge}
                                                >
                                                    <IconMap
                                                        size={11}
                                                        aria-hidden="true"
                                                    />{' '}
                                                    Map
                                                </span>
                                            ) : null}
                                        </span>
                                        <span
                                            className={styles.artifactExcerpt}
                                        >
                                            {getExcerpt(
                                                artifact.descriptionMarkdown
                                            ) || 'No notes yet.'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </section>
                    )
                )}
            </div>
        </div>
    )
}
