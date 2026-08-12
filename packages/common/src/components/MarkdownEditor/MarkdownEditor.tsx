'use client'

import dynamic from 'next/dynamic'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import type { MDXEditorMethods, MDXEditorProps } from '@mdxeditor/editor'

const InitializedMarkdownEditor = dynamic(
    () => import('./InitializedMarkdownEditor'),
    { ssr: false }
)

export type MarkdownEditorProps = Omit<
    MDXEditorProps,
    'markdown' | 'onChange'
> & {
    value: string
    onChange: (value: string) => void
}

export const MarkdownEditor = forwardRef<MDXEditorMethods, MarkdownEditorProps>(
    function MarkdownEditor({ value, onChange, ...props }, forwardedRef) {
        const editorRef = useRef<MDXEditorMethods>(null)
        const latestMarkdown = useRef(value)

        useImperativeHandle(forwardedRef, () => editorRef.current!, [])

        useEffect(() => {
            if (value === latestMarkdown.current) {
                return
            }

            latestMarkdown.current = value
            editorRef.current?.setMarkdown(value)
        }, [value])

        return (
            <InitializedMarkdownEditor
                {...props}
                editorRef={editorRef}
                markdown={value}
                onChange={(nextValue) => {
                    latestMarkdown.current = nextValue
                    onChange(nextValue)
                }}
            />
        )
    }
)

MarkdownEditor.displayName = 'MarkdownEditor'
