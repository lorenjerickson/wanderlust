import { useMemo, useState } from 'react'
import { NavLinkProps } from './types'

export function useSideNav() {
    const [items, setItems] = useState<NavLinkProps[]>([])
    const [isOpen, setOpen] = useState(false)

    return useMemo(() => {
        return {
            isOpen,
            setOpen,
            items,
            setItems,
        }
    }, [items, isOpen])
}
