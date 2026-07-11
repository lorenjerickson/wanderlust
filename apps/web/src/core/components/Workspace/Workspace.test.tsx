import { act, cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Panel } from '../Panel'
import { Workspace } from './Workspace'

const addPanelMock = vi.fn()
const addFloatingGroupMock = vi.fn()
const closeGroupMock = vi.fn()
const closePanelMock = vi.fn()
const exitMaximizedMock = vi.fn()
const isMaximizedMock = vi.fn(() => false)
const maximizeMock = vi.fn()
const setSizeMock = vi.fn()
let mockPanelLocationType: 'grid' | 'floating' = 'grid'
let mockLocationChangeListener:
    | ((event: { location: { type: string } }) => void)
    | undefined

vi.mock('@/server/ai', () => ({
    generateWorldArtifactDraft: vi.fn(),
}))

vi.mock('@/server/worldArtifact', () => ({
    createWorldArtifact: vi.fn(),
    findWorldArtifactById: vi.fn(),
    findWorldArtifacts: vi.fn(async () => []),
    updateWorldArtifact: vi.fn(),
}))

vi.mock('@/server/world', () => ({
    findAllWorlds: vi.fn(async () => []),
}))

vi.mock('dockview-react', () => {
    return {
        DockviewReact: ({
            onReady,
            className,
            components,
            rightHeaderActionsComponent,
        }: any) => {
            React.useEffect(() => {
                onReady?.({
                    api: {
                        addPanel: addPanelMock,
                    },
                })
            }, [onReady])

            const panelComponents = Object.values(components)
            const MockPanel = panelComponents[0] as React.ComponentType<any>
            const HeaderActions = rightHeaderActionsComponent as
                | React.ComponentType<any>
                | undefined
            const activePanel = {
                api: {
                    close: closePanelMock,
                },
            }
            const group = {}

            return (
                <div data-testid="mock-dockview" className={className}>
                    {HeaderActions ? (
                        <HeaderActions
                            activePanel={activePanel}
                            api={{
                                close: closeGroupMock,
                                exitMaximized: exitMaximizedMock,
                                isMaximized: isMaximizedMock,
                                maximize: maximizeMock,
                                setSize: setSizeMock,
                            }}
                            containerApi={{
                                addFloatingGroup: addFloatingGroupMock,
                            }}
                            group={group}
                            panels={[activePanel]}
                        />
                    ) : null}
                    {MockPanel ? (
                        <MockPanel
                            api={{
                                title: 'Mock panel',
                                location: { type: mockPanelLocationType },
                                onDidLocationChange: (
                                    listener: (event: {
                                        location: { type: string }
                                    }) => void
                                ) => {
                                    mockLocationChangeListener = listener
                                    return {
                                        dispose: () => {
                                            mockLocationChangeListener =
                                                undefined
                                        },
                                    }
                                },
                            }}
                            params={{
                                id: 'mock',
                                title: 'Mock panel',
                                statusMessage: 'Mock status',
                            }}
                        />
                    ) : null}
                </div>
            )
        },
    }
})

describe('Workspace', () => {
    afterEach(() => {
        cleanup()
    })

    beforeEach(() => {
        mockPanelLocationType = 'grid'
        mockLocationChangeListener = undefined
        addFloatingGroupMock.mockClear()
        addPanelMock.mockClear()
        closeGroupMock.mockClear()
        closePanelMock.mockClear()
        exitMaximizedMock.mockClear()
        isMaximizedMock.mockClear()
        isMaximizedMock.mockReturnValue(false)
        maximizeMock.mockClear()
        setSizeMock.mockClear()
    })

    it('renders the shell and default border layout regions', () => {
        render(<Workspace isGm title="App Workspace" />)

        expect(screen.queryByText('App Workspace')).toBeNull()
        expect(
            screen.getByRole('button', { name: 'Choose visible panels' })
        ).toBeTruthy()
        expect(screen.getByTestId('workspace-shell')).toBeTruthy()
        expect(addPanelMock).toHaveBeenCalledTimes(10)
        expect(addPanelMock).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'world',
                component: 'world',
                title: 'World',
            })
        )
        expect(addPanelMock).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'world-artifact-editor',
                component: 'world-artifact-editor',
                title: 'World Editor',
            })
        )
        expect(addPanelMock).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'campaign',
                component: 'campaign',
                title: 'Campaign',
            })
        )
        expect(addPanelMock).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'actors',
                component: 'actors',
                title: 'Actors',
                position: { referencePanel: 'campaign' },
            })
        )
        expect(addPanelMock).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'encounter-map',
                component: 'encounter-map',
                title: 'Map',
            })
        )
        expect(addPanelMock).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'media-library',
                component: 'media-library',
                title: 'Media',
            })
        )
        expect(addPanelMock).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'chat-log',
                component: 'chat-log',
                title: 'Chat',
            })
        )
        expect(addPanelMock).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'compendium',
                component: 'compendium',
                title: 'Compendium',
            })
        )
        expect(addPanelMock).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'encounter',
                component: 'encounter',
                title: 'Encounter',
                position: { referencePanel: 'compendium' },
            })
        )
        expect(addPanelMock).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'actor-detail',
                component: 'actor-detail',
                title: 'Actor Detail',
                position: { referencePanel: 'compendium' },
            })
        )
    })

    it('filters GM-only default panels for non-GM users', () => {
        render(<Workspace title="Player Workspace" />)

        expect(addPanelMock).toHaveBeenCalledTimes(7)
        expect(addPanelMock).not.toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'world',
            })
        )
        expect(addPanelMock).not.toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'world-artifact-editor',
            })
        )
        expect(addPanelMock).not.toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'actors',
            })
        )
    })

    it('accepts Panel children as dockable components', () => {
        render(
            <Workspace title="Custom Workspace">
                <Panel id="workspace-left-custom" title="Left" region="left">
                    Left content
                </Panel>
                <Panel
                    id="workspace-middle"
                    title="Center"
                    region="middle-center"
                >
                    Center content
                </Panel>
            </Workspace>
        )

        expect(addPanelMock).toHaveBeenCalledTimes(2)
        expect(addPanelMock).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'workspace-middle',
                title: 'Center',
                position: {
                    referencePanel: 'workspace-left-custom',
                    direction: 'right',
                },
            })
        )
    })

    it('rejects non-Panel children', () => {
        expect(() => {
            render(
                <Workspace>
                    <div>Invalid child</div>
                </Workspace>
            )
        }).toThrowError(
            'Workspace only accepts Panel components as dockable children.'
        )
    })

    it('renders Dockview header action buttons for the active panel', async () => {
        const user = userEvent.setup()

        render(<Workspace isGm title="App Workspace" />)

        await user.click(screen.getByLabelText('Detach panel'))
        await user.click(screen.getByLabelText('Minimize group'))
        await user.click(screen.getByLabelText('Maximize group'))
        await user.click(screen.getByLabelText('Close panel'))

        expect(addFloatingGroupMock).toHaveBeenCalledTimes(1)
        expect(setSizeMock).toHaveBeenCalledWith({ height: 140 })
        expect(maximizeMock).toHaveBeenCalledTimes(1)
        expect(closePanelMock).toHaveBeenCalledTimes(1)
        expect(closeGroupMock).not.toHaveBeenCalled()
    })

    it('hides the panel title when docked and shows it when floating', () => {
        mockPanelLocationType = 'grid'
        render(<Workspace isGm title="App Workspace" />)

        expect(screen.queryByText('Mock panel')).toBeNull()

        act(() => {
            mockLocationChangeListener?.({ location: { type: 'floating' } })
        })

        expect(screen.getByText('Mock panel')).toBeTruthy()
    })
})
