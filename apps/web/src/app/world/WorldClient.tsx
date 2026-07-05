'use client'

import { Workspace } from '@/core/components/Workspace/Workspace'

import { TopLayout } from '@/components/TopLayout/TopLayout'

type WorldClientProps = {
    isGm: boolean
}

export function WorldClient({ isGm }: WorldClientProps) {
    return (
        <TopLayout>
            <Workspace isGm={isGm} />
        </TopLayout>
    )
}
