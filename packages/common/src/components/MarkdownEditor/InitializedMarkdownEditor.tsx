'use client'

import type { ForwardedRef } from 'react'
import {
    BlockTypeSelect,
    BoldItalicUnderlineToggles,
    codeBlockPlugin,
    codeMirrorPlugin,
    CreateLink,
    diffSourcePlugin,
    DiffSourceToggleWrapper,
    headingsPlugin,
    InsertTable,
    InsertThematicBreak,
    linkDialogPlugin,
    linkPlugin,
    listsPlugin,
    ListsToggle,
    markdownShortcutPlugin,
    MDXEditor,
    quotePlugin,
    Separator,
    StrikeThroughSupSubToggles,
    tablePlugin,
    thematicBreakPlugin,
    toolbarPlugin,
    UndoRedo,
    type MDXEditorMethods,
    type MDXEditorProps,
} from '@mdxeditor/editor'

type InitializedMarkdownEditorProps = {
    editorRef: ForwardedRef<MDXEditorMethods> | null
} & MDXEditorProps

export default function InitializedMarkdownEditor({
    editorRef,
    ...props
}: InitializedMarkdownEditorProps) {
    return (
        <MDXEditor
            {...props}
            ref={editorRef}
            plugins={[
                toolbarPlugin({
                    toolbarContents: () => (
                        <DiffSourceToggleWrapper>
                            <UndoRedo />
                            <Separator />
                            <BlockTypeSelect />
                            <Separator />
                            <BoldItalicUnderlineToggles />
                            <StrikeThroughSupSubToggles />
                            <Separator />
                            <ListsToggle />
                            <Separator />
                            <CreateLink />
                            <InsertTable />
                            <InsertThematicBreak />
                        </DiffSourceToggleWrapper>
                    ),
                }),
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                linkPlugin(),
                linkDialogPlugin(),
                tablePlugin(),
                thematicBreakPlugin(),
                codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
                codeMirrorPlugin({
                    codeBlockLanguages: {
                        css: 'CSS',
                        js: 'JavaScript',
                        json: 'JSON',
                        md: 'Markdown',
                        ts: 'TypeScript',
                        tsx: 'TSX',
                        txt: 'Text',
                    },
                }),
                diffSourcePlugin({ viewMode: 'rich-text' }),
                markdownShortcutPlugin(),
            ]}
        />
    )
}
