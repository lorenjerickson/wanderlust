'use client'

import { IconPlus, IconSearch } from '@tabler/icons-react'
import { useMemo, useState } from 'react'
import styles from './Actors.module.scss'

export type ActorType = 'hero' | 'pawn' | 'villain'

export type ActorListItem = {
    id: string
    name: string
    description: string
    type: ActorType
}

export type ActorsProps = {
    actors?: ActorListItem[]
    onAddActor?: () => void
    onSelectActor?: (actor: ActorListItem) => void
}

type ActorTypeFilter = 'all' | ActorType

const EMPTY_ACTORS: ActorListItem[] = []

export function Actors({
    actors = EMPTY_ACTORS,
    onAddActor,
    onSelectActor,
}: ActorsProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [typeFilter, setTypeFilter] = useState<ActorTypeFilter>('all')

    const filteredActors = useMemo(() => {
        const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase()

        return actors.filter((actor) => {
            const matchesType =
                typeFilter === 'all' || actor.type === typeFilter
            const matchesSearch =
                normalizedSearchTerm.length === 0 ||
                actor.name.toLocaleLowerCase().includes(normalizedSearchTerm) ||
                actor.description
                    .toLocaleLowerCase()
                    .includes(normalizedSearchTerm)

            return matchesType && matchesSearch
        })
    }, [actors, searchTerm, typeFilter])

    const hasActiveFilters =
        searchTerm.trim().length > 0 || typeFilter !== 'all'

    return (
        <div className={styles.panelView}>
            <div className={styles.controls}>
                <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={onAddActor}
                >
                    <IconPlus size={16} stroke={2} aria-hidden="true" />
                    Add actor
                </button>

                <div className={styles.filters} role="search">
                    <label className={styles.searchField}>
                        <span className="sr-only">
                            Filter actors by name or description
                        </span>
                        <IconSearch
                            className={styles.searchIcon}
                            size={16}
                            stroke={1.8}
                            aria-hidden="true"
                        />
                        <input
                            type="search"
                            className="input input-sm"
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                            placeholder="Name or description"
                        />
                    </label>

                    <label>
                        <span className="sr-only">Filter actors by type</span>
                        <select
                            className="select select-sm"
                            value={typeFilter}
                            onChange={(event) =>
                                setTypeFilter(
                                    event.target.value as ActorTypeFilter
                                )
                            }
                        >
                            <option value="all">All types</option>
                            <option value="hero">Hero</option>
                            <option value="pawn">Pawn</option>
                            <option value="villain">Villain</option>
                        </select>
                    </label>
                </div>
            </div>

            <div className={styles.actorList} aria-live="polite">
                {filteredActors.length > 0 ? (
                    filteredActors.map((actor) => (
                        <button
                            type="button"
                            className={styles.actorListItem}
                            key={actor.id}
                            onClick={() => onSelectActor?.(actor)}
                        >
                            <span className={styles.actorSummary}>
                                <span className={styles.actorName}>
                                    {actor.name}
                                </span>
                                <span className={styles.actorDescription}>
                                    {actor.description}
                                </span>
                            </span>
                            <span className={styles.actorType}>
                                {actor.type}
                            </span>
                        </button>
                    ))
                ) : (
                    <p className={styles.emptyState}>
                        {hasActiveFilters
                            ? 'No actors match these filters.'
                            : 'No actors have been added yet.'}
                    </p>
                )}
            </div>
        </div>
    )
}
