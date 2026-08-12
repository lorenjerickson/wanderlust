import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ActorListItem, Actors } from './Actors'

const actors: ActorListItem[] = [
    {
        id: 'aria',
        name: 'Aria Vale',
        description: 'A wandering knight',
        type: 'hero',
    },
    {
        id: 'rook',
        name: 'Rook',
        description: 'Keeper of the black gate',
        type: 'villain',
    },
]

describe('Actors', () => {
    it('renders actor actions and filters', () => {
        render(<Actors />)

        expect(screen.getByRole('button', { name: 'Add actor' })).toBeTruthy()
        expect(
            screen.getByRole('searchbox', {
                name: 'Filter actors by name or description',
            })
        ).toBeTruthy()
        expect(
            screen.getByRole('combobox', { name: 'Filter actors by type' })
        ).toBeTruthy()
    })

    it('filters actors by text and type', async () => {
        const user = userEvent.setup()
        render(<Actors actors={actors} />)

        await user.type(
            screen.getByRole('searchbox', {
                name: 'Filter actors by name or description',
            }),
            'gate'
        )

        expect(screen.queryByText('Aria Vale')).toBeNull()
        expect(screen.getByText('Rook')).toBeTruthy()

        await user.clear(
            screen.getByRole('searchbox', {
                name: 'Filter actors by name or description',
            })
        )
        await user.selectOptions(
            screen.getByRole('combobox', { name: 'Filter actors by type' }),
            'hero'
        )

        expect(screen.getByText('Aria Vale')).toBeTruthy()
        expect(screen.queryByText('Rook')).toBeNull()
    })

    it('calls the add actor action', async () => {
        const user = userEvent.setup()
        const onAddActor = vi.fn()
        render(<Actors onAddActor={onAddActor} />)

        await user.click(screen.getByRole('button', { name: 'Add actor' }))

        expect(onAddActor).toHaveBeenCalledOnce()
    })
})
