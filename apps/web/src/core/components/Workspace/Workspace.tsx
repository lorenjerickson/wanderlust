import React, {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react'
import {
    IconArrowsMaximize,
    IconExternalLink,
    IconLayoutDashboard,
    IconMinus,
    IconX,
} from '@tabler/icons-react'
import {
    DockviewReact,
    IDockviewHeaderActionsProps,
    DockviewReadyEvent,
    IDockviewPanelProps,
} from 'dockview-react'
import 'dockview-react/dist/styles/dockview.css'
import { ActorDetail } from '../ActorDetail'
import { Actors } from '../Actors'
import { Campaign } from '../Campaign'
import { ChatLog } from '../ChatLog'
import { Compendium } from '../Compendium'
import { Encounter } from '../Encounter'
import { EncounterMap } from '../EncounterMap'
import { MediaLibrary } from '../MediaLibrary'
import { World } from '../World'
import {
    WorldArtifactEditor,
    WorldArtifactEditorState,
} from '../WorldArtifactEditor'
import {
    isWorkspacePanelElement,
    Panel,
    WorkspacePanelElement,
    WorkspaceRegion,
} from '../Panel'
import styles from './Workspace.module.scss'

export type WorkspaceProps = {
    className?: string
    isGm?: boolean
    themeClassName?: string
    title?: string
    children?: WorkspacePanelElement | WorkspacePanelElement[]
}

type WorkspacePanelParams = {
    id: string
    title: string
    statusMessage?: string
    content?: ReactNode
}

type WorkspaceRuntimeContextValue = {
    worldArtifactEditorState: WorldArtifactEditorState
    worldRefreshToken: number
    onCreateWorldArtifact: () => void
    onEditWorldArtifact: (artifactId: string) => void
    onSaveWorldArtifact: (artifactId: string) => void
}

const WorkspaceRuntimeContext =
    createContext<WorkspaceRuntimeContextValue | null>(null)

function DefaultPanelContent({
    params,
}: {
    params: WorkspacePanelParams
}): ReactNode {
    const runtime = useContext(WorkspaceRuntimeContext)

    if (!runtime) {
        return params.content
    }

    if (params.id === 'world') {
        return (
            <World
                refreshToken={runtime.worldRefreshToken}
                onCreateArtifact={runtime.onCreateWorldArtifact}
                onEditArtifact={runtime.onEditWorldArtifact}
            />
        )
    }

    if (params.id === 'world-artifact-editor') {
        return (
            <WorldArtifactEditor
                state={runtime.worldArtifactEditorState}
                onSaved={runtime.onSaveWorldArtifact}
            />
        )
    }

    return params.content
}

type RegionDirection = 'left' | 'right' | 'above' | 'below'

type PanelRegionConfig = {
    id: string
    title: string
    statusMessage?: string
    region: WorkspaceRegion
    content?: ReactNode
}

const GM_ONLY_PANEL_IDS = new Set(['world', 'world-artifact-editor', 'actors'])

const DefaultPanel = (props: IDockviewPanelProps<WorkspacePanelParams>) => {
    const [isFloating, setIsFloating] = useState(
        () => props.api.location.type !== 'grid'
    )

    useEffect(() => {
        const disposable = props.api.onDidLocationChange((event) => {
            setIsFloating(event.location.type !== 'grid')
        })

        return () => disposable.dispose()
    }, [props.api])

    return (
        <Panel
            id={props.params.id}
            title={props.params.title}
            statusMessage={props.params.statusMessage}
            isFloating={isFloating}
        >
            <DefaultPanelContent params={props.params} />
        </Panel>
    )
}

const WorkspaceHeaderActions = (props: IDockviewHeaderActionsProps) => {
    const handleDetach = () => {
        props.containerApi.addFloatingGroup(props.activePanel ?? props.group)
    }

    const handleMinimize = () => {
        if (props.api.isMaximized()) {
            props.api.exitMaximized()
            return
        }

        props.api.setSize({ height: 140 })
    }

    const handleMaximize = () => {
        props.api.maximize()
    }

    const handleClose = () => {
        if (props.activePanel) {
            props.activePanel.api.close()
            return
        }

        props.api.close()
    }

    return (
        <div className={styles.workspaceHeaderActions}>
            <button
                type="button"
                className={styles.workspaceHeaderButton}
                onClick={handleDetach}
                aria-label="Detach panel"
                title="Detach panel"
                disabled={!props.activePanel && props.panels.length === 0}
            >
                <IconExternalLink size={14} stroke={1.8} aria-hidden="true" />
            </button>
            <button
                type="button"
                className={styles.workspaceHeaderButton}
                onClick={handleMinimize}
                aria-label="Minimize group"
                title="Minimize group"
            >
                <IconMinus size={14} stroke={1.8} aria-hidden="true" />
            </button>
            <button
                type="button"
                className={styles.workspaceHeaderButton}
                onClick={handleMaximize}
                aria-label="Maximize group"
                title="Maximize group"
            >
                <IconArrowsMaximize size={14} stroke={1.8} aria-hidden="true" />
            </button>
            <button
                type="button"
                className={styles.workspaceHeaderButton}
                onClick={handleClose}
                aria-label="Close panel"
                title="Close panel"
                disabled={!props.activePanel && props.panels.length === 0}
            >
                <IconX size={14} stroke={1.8} aria-hidden="true" />
            </button>
        </div>
    )
}

type DefaultPanelsConfig = {
    worldArtifactEditorState: WorldArtifactEditorState
    worldRefreshToken: number
    onCreateWorldArtifact: () => void
    onEditWorldArtifact: (artifactId: string) => void
    onSaveWorldArtifact: (artifactId: string) => void
}

function getDefaultPanels({
    worldArtifactEditorState,
    worldRefreshToken,
    onCreateWorldArtifact,
    onEditWorldArtifact,
    onSaveWorldArtifact,
}: DefaultPanelsConfig): PanelRegionConfig[] {
    return [
        {
            id: 'world',
            title: 'World',
            statusMessage: 'Worldbuilding ready',
            region: 'left',
            content: (
                <World
                    refreshToken={worldRefreshToken}
                    onCreateArtifact={onCreateWorldArtifact}
                    onEditArtifact={onEditWorldArtifact}
                />
            ),
        },
        {
            id: 'world-artifact-editor',
            title: 'World Editor',
            statusMessage: 'Markdown artifacts',
            region: 'middle-center',
            content: (
                <WorldArtifactEditor
                    state={worldArtifactEditorState}
                    onSaved={onSaveWorldArtifact}
                />
            ),
        },
        {
            id: 'campaign',
            title: 'Campaign',
            statusMessage: 'No active campaign',
            region: 'left',
            content: <Campaign />,
        },
        {
            id: 'actors',
            title: 'Actors',
            statusMessage: 'No actors loaded',
            region: 'left',
            content: <Actors />,
        },
        {
            id: 'encounter-map',
            title: 'Map',
            statusMessage: 'No encounter loaded',
            region: 'middle-center',
            content: <EncounterMap />,
        },
        {
            id: 'media-library',
            title: 'Media',
            statusMessage: 'No media uploaded',
            region: 'middle-top',
            content: <MediaLibrary />,
        },
        {
            id: 'chat-log',
            title: 'Chat',
            statusMessage: 'No messages yet',
            region: 'middle-bottom',
            content: <ChatLog />,
        },
        {
            id: 'compendium',
            title: 'Compendium',
            statusMessage: 'Reference ready',
            region: 'right',
            content: <Compendium />,
        },
        {
            id: 'encounter',
            title: 'Encounter',
            statusMessage: 'No encounter active',
            region: 'right',
            content: <Encounter />,
        },
        {
            id: 'actor-detail',
            title: 'Actor Detail',
            statusMessage: 'No actor selected',
            region: 'right',
            content: <ActorDetail />,
        },
    ]
}

const REGION_PRIORITY: WorkspaceRegion[] = [
    'left',
    'middle-center',
    'right',
    'middle-top',
    'middle-bottom',
]

const REGION_POSITION: Partial<
    Record<
        WorkspaceRegion,
        { referenceRegion: WorkspaceRegion; direction: RegionDirection }
    >
> = {
    'middle-center': { referenceRegion: 'left', direction: 'right' },
    right: { referenceRegion: 'middle-center', direction: 'right' },
    'middle-top': { referenceRegion: 'middle-center', direction: 'above' },
    'middle-bottom': { referenceRegion: 'middle-center', direction: 'below' },
}

function mapPanelElementToConfig(
    panel: WorkspacePanelElement
): PanelRegionConfig {
    const props = panel.props

    return {
        id: props.id,
        title: props.title,
        statusMessage: props.statusMessage,
        content: props.children,
        region: props.region ?? 'middle-center',
    }
}

function normalizePanels(
    children: WorkspaceProps['children']
): PanelRegionConfig[] {
    const nodes = React.Children.toArray(children)
    const normalized: PanelRegionConfig[] = []

    nodes.forEach((node) => {
        if (!isWorkspacePanelElement(node)) {
            throw new Error(
                'Workspace only accepts Panel components as dockable children.'
            )
        }

        normalized.push(mapPanelElementToConfig(node))
    })

    return normalized
}

function getPanelPosition(
    panel: PanelRegionConfig,
    firstPanelByRegion: Partial<Record<WorkspaceRegion, string>>
): { referencePanel: string; direction?: RegionDirection } | undefined {
    const firstPanelInRegion = firstPanelByRegion[panel.region]
    if (firstPanelInRegion && firstPanelInRegion !== panel.id) {
        return { referencePanel: firstPanelInRegion }
    }

    const positionConfig = REGION_POSITION[panel.region]
    if (!positionConfig) {
        return undefined
    }

    const referencePanel = firstPanelByRegion[positionConfig.referenceRegion]
    if (!referencePanel) {
        return undefined
    }

    return {
        referencePanel,
        direction: positionConfig.direction,
    }
}

function getPanelComponents(
    panels: PanelRegionConfig[]
): Record<string, React.FC<IDockviewPanelProps<WorkspacePanelParams>>> {
    return panels.reduce<
        Record<string, React.FC<IDockviewPanelProps<WorkspacePanelParams>>>
    >((acc, panel) => {
        acc[panel.id] = DefaultPanel
        return acc
    }, {})
}

export function Workspace(props: WorkspaceProps) {
    const {
        className,
        isGm = false,
        themeClassName = 'dockview-theme-abyss',
        children,
    } = props

    const [worldRefreshToken, setWorldRefreshToken] = useState(0)
    const [worldArtifactEditorState, setWorldArtifactEditorState] =
        useState<WorldArtifactEditorState>({ mode: 'idle' })
    const [hiddenPanelIds, setHiddenPanelIds] = useState<string[]>([])

    const defaultPanels = useMemo(() => {
        return getDefaultPanels({
            worldArtifactEditorState,
            worldRefreshToken,
            onCreateWorldArtifact: () => {
                setWorldArtifactEditorState({ mode: 'create' })
            },
            onEditWorldArtifact: (artifactId) => {
                setWorldArtifactEditorState({ mode: 'edit', artifactId })
            },
            onSaveWorldArtifact: (artifactId) => {
                setWorldArtifactEditorState({ mode: 'edit', artifactId })
                setWorldRefreshToken((current) => current + 1)
            },
        })
    }, [worldArtifactEditorState, worldRefreshToken])

    const runtimeContext = useMemo<WorkspaceRuntimeContextValue>(() => {
        return {
            worldArtifactEditorState,
            worldRefreshToken,
            onCreateWorldArtifact: () => {
                setWorldArtifactEditorState({ mode: 'create' })
            },
            onEditWorldArtifact: (artifactId) => {
                setWorldArtifactEditorState({ mode: 'edit', artifactId })
            },
            onSaveWorldArtifact: (artifactId) => {
                setWorldArtifactEditorState({ mode: 'edit', artifactId })
                setWorldRefreshToken((current) => current + 1)
            },
        }
    }, [worldArtifactEditorState, worldRefreshToken])

    const availablePanels = useMemo(() => {
        if (!children) {
            return defaultPanels
        }

        return normalizePanels(children)
    }, [children, defaultPanels])

    const allowedPanels = useMemo(() => {
        if (children || isGm) {
            return availablePanels
        }

        return availablePanels.filter(
            (panel) => !GM_ONLY_PANEL_IDS.has(panel.id)
        )
    }, [availablePanels, children, isGm])

    const panels = useMemo(() => {
        return allowedPanels.filter(
            (panel) => !hiddenPanelIds.includes(panel.id)
        )
    }, [allowedPanels, hiddenPanelIds])

    const panelComponents = useMemo(() => {
        return getPanelComponents(panels)
    }, [panels])

    const dockviewClassName = useMemo(() => {
        return [styles.workspaceDockview, themeClassName]
            .filter(Boolean)
            .join(' ')
    }, [themeClassName])

    const rootClassName = useMemo(() => {
        return [styles.workspaceShell, className].filter(Boolean).join(' ')
    }, [className])

    const handleReady = (event: DockviewReadyEvent) => {
        const firstPanelByRegion: Partial<Record<WorkspaceRegion, string>> = {}
        const orderedPanels = [...panels].sort((left, right) => {
            return (
                REGION_PRIORITY.indexOf(left.region) -
                REGION_PRIORITY.indexOf(right.region)
            )
        })

        orderedPanels.forEach((panel) => {
            if (!firstPanelByRegion[panel.region]) {
                firstPanelByRegion[panel.region] = panel.id
            }

            const position = getPanelPosition(panel, firstPanelByRegion)

            event.api.addPanel({
                id: panel.id,
                component: panel.id,
                title: panel.title,
                params: {
                    id: panel.id,
                    title: panel.title,
                    statusMessage: panel.statusMessage,
                    content: panel.content,
                },
                ...(position ? { position } : {}),
            })
        })
    }

    const dockview =
        panels.length > 0 ? (
            <DockviewReact
                key={panels.map((panel) => panel.id).join('|')}
                className={dockviewClassName}
                components={panelComponents}
                rightHeaderActionsComponent={WorkspaceHeaderActions}
                onReady={handleReady}
            />
        ) : (
            <div className={styles.workspaceEmptyState}>
                No panels selected.
            </div>
        )

    const togglePanelVisibility = (panelId: string, isVisible: boolean) => {
        setHiddenPanelIds((currentHiddenPanelIds) => {
            if (isVisible) {
                return currentHiddenPanelIds.filter(
                    (hiddenPanelId) => hiddenPanelId !== panelId
                )
            }

            if (currentHiddenPanelIds.includes(panelId)) {
                return currentHiddenPanelIds
            }

            return [...currentHiddenPanelIds, panelId]
        })
    }

    return (
        <section className={rootClassName} data-testid="workspace-shell">
            <div className={styles.workspaceCanvas}>
                {children ? (
                    dockview
                ) : (
                    <WorkspaceRuntimeContext value={runtimeContext}>
                        {dockview}
                    </WorkspaceRuntimeContext>
                )}
            </div>
            {!children ? (
                <div className="fab z-50">
                    <details className="dropdown dropdown-top dropdown-end">
                        <summary
                            className={`btn btn-lg btn-circle btn-primary ${styles.workspacePanelMenuButton}`}
                            aria-label="Choose visible panels"
                            title="Choose visible panels"
                        >
                            <IconLayoutDashboard
                                size={24}
                                stroke={1.8}
                                aria-hidden="true"
                            />
                        </summary>
                        <div
                            className={`dropdown-content ${styles.workspacePanelMenuList}`}
                        >
                            <div className={styles.workspacePanelMenuHeading}>
                                Visible panels
                            </div>
                            {allowedPanels.map((panel) => (
                                <label
                                    className={styles.workspacePanelMenuItem}
                                    key={panel.id}
                                >
                                    <input
                                        type="checkbox"
                                        checked={
                                            !hiddenPanelIds.includes(panel.id)
                                        }
                                        onChange={(event) =>
                                            togglePanelVisibility(
                                                panel.id,
                                                event.target.checked
                                            )
                                        }
                                    />
                                    <span>{panel.title}</span>
                                </label>
                            ))}
                        </div>
                    </details>
                </div>
            ) : null}
        </section>
    )
}
