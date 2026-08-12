'use server'

import { mkdir, writeFile } from 'fs/promises'
import path from 'path'

import type { WorldArtifactType } from '@wanderlust/common'

const ARTIFACT_IMAGE_DIRS: Record<WorldArtifactType, string> = {
    World: 'worlds',
    Location: 'locations',
    Campaign: 'campaigns',
    Scenario: 'scenarios',
    Encounter: 'encounters',
    Creature: 'creatures',
    Item: 'items',
}

const IMAGE_EXTENSION_BY_TYPE: Record<string, string> = {
    'image/gif': 'gif',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
}

type UploadWorldArtifactImageArgs = {
    artifactType: WorldArtifactType
    artifactTitle: string
    file: File
}

function toKebabCase(value: string) {
    return (
        value
            .trim()
            .toLowerCase()
            .replace(/['"]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || 'untitled-artifact'
    )
}

function getImageExtension(file: File) {
    const extensionFromMimeType = IMAGE_EXTENSION_BY_TYPE[file.type]

    if (extensionFromMimeType) {
        return extensionFromMimeType
    }

    const extensionFromName = path
        .extname(file.name)
        .replace('.', '')
        .toLowerCase()

    if (Object.values(IMAGE_EXTENSION_BY_TYPE).includes(extensionFromName)) {
        return extensionFromName
    }

    throw new Error('Upload must be a PNG, JPG, GIF, or WebP image.')
}

export async function uploadWorldArtifactImage({
    artifactType,
    artifactTitle,
    file,
}: UploadWorldArtifactImageArgs) {
    if (!file.size) {
        throw new Error('Choose an image to upload.')
    }

    const imageDirectory = ARTIFACT_IMAGE_DIRS[artifactType]
    const extension = getImageExtension(file)
    const baseName = toKebabCase(artifactTitle)
    const relativeDirectory = path.join('assets', 'images', imageDirectory)
    const publicDirectory = path.join(
        process.cwd(),
        'public',
        relativeDirectory
    )
    const fileName = `${baseName}.${extension}`
    const filePath = path.join(publicDirectory, fileName)
    const publicUrl = `/${path
        .join(relativeDirectory, fileName)
        .split(path.sep)
        .join('/')}`
    const arrayBuffer = await file.arrayBuffer()

    await mkdir(publicDirectory, { recursive: true })
    await writeFile(filePath, Buffer.from(arrayBuffer))

    return `${publicUrl}?v=${Date.now().toString(36)}`
}
