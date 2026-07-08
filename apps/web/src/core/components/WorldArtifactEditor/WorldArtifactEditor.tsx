'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState, useTransition } from 'react'

import { generateWorldArtifactDraft } from '@/server/ai'
import {
    WORLD_ARTIFACT_TYPES,
    type WorldArtifactType,
} from '@/core/types/worldArtifact'
import {
    createWorldArtifact,
    findWorldArtifactById,
    findWorldArtifacts,
    updateWorldArtifact,
    type WorldArtifact,
} from '@/server/worldArtifact'
import { uploadWorldArtifactImage } from '@/server/worldArtifactImage'
import { MarkdownEditor } from '@/core/components/MarkdownEditor'

import styles from './WorldArtifactEditor.module.scss'

type EditorMode = 'idle' | 'create' | 'edit'

export type WorldArtifactEditorState = {
    mode: EditorMode
    artifactId?: string
}

type WorldArtifactEditorProps = {
    state: WorldArtifactEditorState
    onSaved: (artifactId: string) => void
}

const WORLD_ARTIFACT_PARENT_TYPES: Partial<
    Record<WorldArtifactType, WorldArtifactType[]>
> = {
    Campaign: ['World'],
    Scenario: ['World', 'Campaign'],
    Encounter: ['World', 'Campaign', 'Scenario'],
    Creature: ['World', 'Campaign'],
    Item: ['World', 'Campaign'],
}

const IMAGE_ARTIFACT_TYPES: WorldArtifactType[] = [...WORLD_ARTIFACT_TYPES]

const PARENT_CONTEXT_CHARACTER_LIMIT = 6000

function summarizeParentContext(markdown: string) {
    const normalizedMarkdown = markdown.trim()

    if (normalizedMarkdown.length <= PARENT_CONTEXT_CHARACTER_LIMIT) {
        return normalizedMarkdown
    }

    return `${normalizedMarkdown.slice(
        0,
        PARENT_CONTEXT_CHARACTER_LIMIT
    )}\n\n[Parent artifact context truncated. Add a concise summary to the prompt context if more continuity detail is needed.]`
}

export function WorldArtifactEditor({
    state,
    onSaved,
}: WorldArtifactEditorProps) {
    const [artifact, setArtifact] = useState<WorldArtifact | null>(null)
    const [availableArtifacts, setAvailableArtifacts] = useState<
        WorldArtifact[]
    >([])
    const [parentArtifactIds, setParentArtifactIds] = useState<
        Partial<Record<WorldArtifactType, string>>
    >({})
    const [artifactType, setArtifactType] = useState<WorldArtifactType>('World')
    const [title, setTitle] = useState('')
    const [mapImageUrl, setMapImageUrl] = useState('')
    const [descriptionMarkdown, setDescriptionMarkdown] = useState('')
    const [promptContext, setPromptContext] = useState('')
    const [status, setStatus] = useState('')
    const [error, setError] = useState('')
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        let isCurrent = true

        startTransition(async () => {
            setStatus('')
            setError('')

            if (state.mode === 'idle') {
                setArtifact(null)
                setAvailableArtifacts([])
                setParentArtifactIds({})
                return
            }

            const nextAvailableArtifacts = await findWorldArtifacts()

            if (!isCurrent) {
                return
            }

            setAvailableArtifacts(nextAvailableArtifacts)

            if (state.mode === 'create') {
                setArtifact(null)
                setArtifactType('World')
                setParentArtifactIds({})
                setTitle('')
                setMapImageUrl('')
                setDescriptionMarkdown('')
                setPromptContext('')
                return
            }

            if (!state.artifactId) {
                return
            }

            const nextArtifact = await findWorldArtifactById(state.artifactId!)

            if (!isCurrent) {
                return
            }

            setArtifact(nextArtifact)
            setArtifactType(nextArtifact?.artifactType ?? 'World')
            setTitle(nextArtifact?.title ?? '')
            setMapImageUrl(nextArtifact?.mapImageUrl ?? '')
            setDescriptionMarkdown(nextArtifact?.descriptionMarkdown ?? '')
            setPromptContext('')
            setParentArtifactIds({})
        })

        return () => {
            isCurrent = false
        }
    }, [state])

    const requiredParentTypes = useMemo(
        () => WORLD_ARTIFACT_PARENT_TYPES[artifactType] ?? [],
        [artifactType]
    )

    const parentOptionsByType = useMemo(() => {
        return requiredParentTypes.reduce<
            Partial<Record<WorldArtifactType, WorldArtifact[]>>
        >((optionsByType, parentType) => {
            optionsByType[parentType] = availableArtifacts.filter(
                (availableArtifact) =>
                    availableArtifact.artifactType === parentType &&
                    availableArtifact.id !== artifact?.id
            )

            return optionsByType
        }, {})
    }, [artifact?.id, availableArtifacts, requiredParentTypes])

    const selectedParentArtifacts = useMemo(() => {
        return requiredParentTypes
            .map((parentType) => {
                const parentArtifactId = parentArtifactIds[parentType]

                if (!parentArtifactId) {
                    return null
                }

                return (
                    availableArtifacts.find(
                        (availableArtifact) =>
                            availableArtifact.id === parentArtifactId
                    ) ?? null
                )
            })
            .filter((parentArtifact): parentArtifact is WorldArtifact =>
                Boolean(parentArtifact)
            )
    }, [availableArtifacts, parentArtifactIds, requiredParentTypes])

    const missingSelectableParentTypes = useMemo(() => {
        return requiredParentTypes.filter((parentType) => {
            const parentOptions = parentOptionsByType[parentType] ?? []

            return (
                parentOptions.length > 0 &&
                !parentOptions.some(
                    (parentOption) =>
                        parentOption.id === parentArtifactIds[parentType]
                )
            )
        })
    }, [parentArtifactIds, parentOptionsByType, requiredParentTypes])

    const isEditing = state.mode === 'edit'
    const canSave = title.trim().length > 0 && state.mode !== 'idle'
    const canGenerate = !isPending && missingSelectableParentTypes.length === 0
    const supportsArtifactImage = IMAGE_ARTIFACT_TYPES.includes(artifactType)
    const canUploadArtifactImage =
        supportsArtifactImage && title.trim().length > 0

    const handleGenerate = () => {
        setError('')
        setStatus('Generating content...')

        startTransition(async () => {
            try {
                const draft = await generateWorldArtifactDraft({
                    artifactType,
                    parentArtifacts: selectedParentArtifacts.map(
                        (parentArtifact) => ({
                            artifactType: parentArtifact.artifactType,
                            title: parentArtifact.title,
                            descriptionMarkdown: summarizeParentContext(
                                parentArtifact.descriptionMarkdown
                            ),
                        })
                    ),
                    brief:
                        promptContext ||
                        `Create a ${artifactType.toLowerCase()} artifact for this world.`,
                    existingTitle: title || artifact?.title,
                    existingDescriptionMarkdown:
                        descriptionMarkdown || artifact?.descriptionMarkdown,
                })

                setTitle(draft.title)
                setArtifactType(
                    WORLD_ARTIFACT_TYPES.includes(
                        draft.artifactType as WorldArtifactType
                    )
                        ? (draft.artifactType as WorldArtifactType)
                        : artifactType
                )
                setParentArtifactIds((currentParentArtifactIds) => {
                    const nextArtifactType = WORLD_ARTIFACT_TYPES.includes(
                        draft.artifactType as WorldArtifactType
                    )
                        ? (draft.artifactType as WorldArtifactType)
                        : artifactType
                    const nextParentTypes =
                        WORLD_ARTIFACT_PARENT_TYPES[nextArtifactType] ?? []
                    const nextParentArtifactIds: Partial<
                        Record<WorldArtifactType, string>
                    > = {}

                    nextParentTypes.forEach((parentType) => {
                        const selectedArtifactId =
                            currentParentArtifactIds[parentType]

                        if (selectedArtifactId) {
                            nextParentArtifactIds[parentType] =
                                selectedArtifactId
                        }
                    })

                    return nextParentArtifactIds
                })
                setDescriptionMarkdown(draft.descriptionMarkdown)
                setStatus('Generated draft content.')
            } catch (generationError) {
                setError(
                    generationError instanceof Error
                        ? generationError.message
                        : 'Unable to generate content.'
                )
                setStatus('')
            }
        })
    }

    const handleSave = () => {
        if (!canSave) {
            return
        }

        setError('')
        setStatus('Saving...')

        startTransition(async () => {
            try {
                const savedArtifact =
                    isEditing && artifact
                        ? await updateWorldArtifact({
                              id: artifact.id,
                              artifactType,
                              title,
                              mapImageUrl: mapImageUrl || undefined,
                              descriptionMarkdown,
                          })
                        : await createWorldArtifact({
                              artifactType,
                              title,
                              mapImageUrl: mapImageUrl || undefined,
                              descriptionMarkdown,
                          })

                if (!savedArtifact) {
                    throw new Error('World artifact no longer exists.')
                }

                setArtifact(savedArtifact)
                setStatus('Saved.')
                onSaved(savedArtifact.id)
            } catch (saveError) {
                setError(
                    saveError instanceof Error
                        ? saveError.message
                        : 'Unable to save world artifact.'
                )
                setStatus('')
            }
        })
    }

    const handleImageUpload = (file: File | undefined) => {
        if (!file || !canUploadArtifactImage) {
            return
        }

        setError('')
        setStatus('Uploading image...')

        startTransition(async () => {
            try {
                const uploadedImageUrl = await uploadWorldArtifactImage({
                    artifactType,
                    artifactTitle: title,
                    file,
                })

                setMapImageUrl(uploadedImageUrl)
                setStatus('Uploaded image. Save to attach it.')
            } catch (uploadError) {
                setError(
                    uploadError instanceof Error
                        ? uploadError.message
                        : 'Unable to upload image.'
                )
                setStatus('')
            }
        })
    }

    if (state.mode === 'idle') {
        return (
            <div className={styles.emptyState}>
                Select a world artifact, or use the add button in the World
                panel.
            </div>
        )
    }

    return (
        <div className={styles.editorPanel} aria-busy={isPending}>
            <div className={styles.topBar}>
                <div>
                    <div className={styles.modeLabel}>
                        {isEditing
                            ? 'Editing world artifact'
                            : 'Create world artifact'}
                    </div>
                    {isEditing ? (
                        <div className={styles.typeBadge}>{artifactType}</div>
                    ) : null}
                </div>
                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.secondaryButton}
                        onClick={handleGenerate}
                        disabled={!canGenerate}
                        title={
                            missingSelectableParentTypes.length > 0
                                ? `Select ${missingSelectableParentTypes.join(
                                      ', '
                                  )} context before generating.`
                                : 'Generate'
                        }
                    >
                        Generate
                    </button>
                    <button
                        type="button"
                        className={styles.primaryButton}
                        onClick={handleSave}
                        disabled={!canSave || isPending}
                    >
                        Save
                    </button>
                </div>
            </div>

            <div className={styles.formGrid}>
                <label className={styles.field}>
                    <span className={styles.label}>
                        Additional prompt context
                    </span>
                    <textarea
                        className={[styles.input, styles.promptArea].join(' ')}
                        value={promptContext}
                        onChange={(event) =>
                            setPromptContext(event.target.value)
                        }
                        placeholder="Add lore constraints, campaign continuity, names, tone, or anything the AI should honor."
                    />
                </label>
                <details className={styles.detailsPanel} open>
                    <summary className={styles.detailsSummary}>
                        Artifact details
                    </summary>
                    <div className={styles.compactFields}>
                        {!isEditing ? (
                            <label
                                className={[
                                    styles.field,
                                    styles.compactField,
                                ].join(' ')}
                            >
                                <span className={styles.label}>Type</span>
                                <select
                                    className={styles.input}
                                    value={artifactType}
                                    onChange={(event) => {
                                        const nextArtifactType = event.target
                                            .value as WorldArtifactType
                                        setArtifactType(nextArtifactType)
                                        if (
                                            !IMAGE_ARTIFACT_TYPES.includes(
                                                nextArtifactType
                                            )
                                        ) {
                                            setMapImageUrl('')
                                        }
                                        setParentArtifactIds({})
                                    }}
                                    aria-label="Artifact type"
                                >
                                    {WORLD_ARTIFACT_TYPES.map((type) => (
                                        <option value={type} key={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        ) : null}
                        {requiredParentTypes.map((parentType) => {
                            const parentOptions =
                                parentOptionsByType[parentType] ?? []
                            const selectedParentArtifactId = parentOptions.some(
                                (parentOption) =>
                                    parentOption.id ===
                                    parentArtifactIds[parentType]
                            )
                                ? parentArtifactIds[parentType]
                                : ''

                            return (
                                <label
                                    className={[
                                        styles.field,
                                        styles.compactField,
                                    ].join(' ')}
                                    key={parentType}
                                >
                                    <span className={styles.label}>
                                        {parentType} context
                                    </span>
                                    <select
                                        className={styles.input}
                                        value={selectedParentArtifactId}
                                        onChange={(event) =>
                                            setParentArtifactIds(
                                                (currentParentArtifactIds) => ({
                                                    ...currentParentArtifactIds,
                                                    [parentType]:
                                                        event.target.value ||
                                                        undefined,
                                                })
                                            )
                                        }
                                        aria-label={`${parentType} parent context`}
                                    >
                                        <option value="">
                                            {parentOptions.length > 0
                                                ? `No ${parentType.toLowerCase()} selected`
                                                : `No ${parentType.toLowerCase()} artifacts available`}
                                        </option>
                                        {parentOptions.map((parentOption) => (
                                            <option
                                                value={parentOption.id}
                                                key={parentOption.id}
                                            >
                                                {parentOption.title}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            )
                        })}
                        <label
                            className={[styles.field, styles.compactField].join(
                                ' '
                            )}
                        >
                            <span className={styles.label}>Title</span>
                            <input
                                className={styles.input}
                                value={title}
                                onChange={(event) =>
                                    setTitle(event.target.value)
                                }
                                placeholder="Artifact title"
                            />
                        </label>
                        {supportsArtifactImage ? (
                            <div
                                className={[
                                    styles.field,
                                    styles.imageUploadField,
                                ].join(' ')}
                            >
                                <span className={styles.label}>Image</span>
                                <div className={styles.imageUploadRow}>
                                    {mapImageUrl ? (
                                        <Image
                                            key={mapImageUrl}
                                            className={styles.imagePreview}
                                            src={mapImageUrl}
                                            alt=""
                                            width={56}
                                            height={36}
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <div
                                            className={styles.imagePreviewEmpty}
                                            aria-hidden="true"
                                        />
                                    )}
                                    <label
                                        className={[
                                            styles.secondaryButton,
                                            styles.uploadButton,
                                            !canUploadArtifactImage || isPending
                                                ? styles.uploadButtonDisabled
                                                : '',
                                        ].join(' ')}
                                    >
                                        Upload
                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg,image/gif,image/webp"
                                            disabled={
                                                !canUploadArtifactImage ||
                                                isPending
                                            }
                                            onChange={(event) => {
                                                handleImageUpload(
                                                    event.target.files?.[0]
                                                )
                                                event.target.value = ''
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </details>
            </div>

            <div className={styles.editorShell}>
                <div className={styles.editorBody}>
                    <MarkdownEditor
                        className={styles.markdownEditor}
                        value={descriptionMarkdown}
                        onChange={setDescriptionMarkdown}
                        placeholder="Write Markdown notes for this world artifact."
                        contentEditableClassName={styles.markdownContent}
                    />
                </div>
            </div>

            <div
                className={[styles.status, error ? styles.error : ''].join(' ')}
            >
                {error || status}
            </div>
        </div>
    )
}
