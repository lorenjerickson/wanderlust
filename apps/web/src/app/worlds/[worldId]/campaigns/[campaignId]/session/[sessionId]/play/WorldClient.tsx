'use client'

import type { WorkspaceServices } from '@wanderlust/common'
import { Workspace } from '@wanderlust/common/components'

import { TopLayout } from '@/components/TopLayout/TopLayout'
import { generateWorldArtifactDraft } from '@/server/ai'
import { findAllWorlds } from '@/server/world'
import {
    createWorldArtifact,
    findWorldArtifactById,
    findWorldArtifacts,
    updateWorldArtifact,
} from '@/server/worldArtifact'
import { uploadWorldArtifactImage } from '@/server/worldArtifactImage'

type WorldClientProps = {
    isGm: boolean
}

const workspaceServices: WorkspaceServices = {
    createWorldArtifact,
    findAllWorlds,
    findWorldArtifactById,
    findWorldArtifacts,
    generateWorldArtifactDraft,
    updateWorldArtifact,
    uploadWorldArtifactImage,
}

export function WorldClient({ isGm }: WorldClientProps) {
    return (
        <TopLayout>
            <Workspace isGm={isGm} services={workspaceServices} />
        </TopLayout>
    )
}
